import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { migrateAllGuestDataToUser, syncUserProgressFromServer } from '../utils/userProgressStore';
import { 
  verifyStoredPassword, 
  saveStoredAccountCredential, 
  updateStoredPassword, 
  normalizeEmail 
} from '../utils/authStorage';

export interface AuthUser {
  id: string;
  email?: string;
  nickname: string;
  avatar: string;
  has_password?: boolean;
  created_at: string;
  createdAt?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isGuest: boolean;
  isLoading: boolean;
  isWelcomeModalOpen: boolean;
  isLoginModalOpen: boolean;
  isProfileModalOpen: boolean;
  isNicknameModalOpen: boolean;
  isMigrationModalOpen: boolean;
  guestJournalCount: number;
  openWelcomeModal: () => void;
  closeWelcomeModal: () => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  openProfileModal: () => void;
  closeProfileModal: () => void;
  openNicknameModal: () => void;
  closeNicknameModal: () => void;
  enterAsGuest: () => void;
  loginWithGoogle: (emailOrToken: string, password: string, suggestedNickname?: string, avatar?: string) => Promise<{ success: boolean; isNew?: boolean; error?: string }>;
  loginWithEmailPassword: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  registerWithEmailPassword: (email: string, password: string, nickname?: string) => Promise<{ success: boolean; error?: string }>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; resetCode?: string; message?: string; error?: string }>;
  confirmPasswordReset: (email: string, code: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  changePassword: (newPassword: string, currentPassword?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (nickname: string, avatar: string) => Promise<{ success: boolean; error?: string }>;
  uploadAvatar: (avatarDataUrl: string) => Promise<{ success: boolean; error?: string }>;
  removeAvatar: () => Promise<{ success: boolean; error?: string }>;
  deleteAccount: () => Promise<{ success: boolean; error?: string }>;
  migrateGuestJournal: () => Promise<{ success: boolean; count?: number; error?: string }>;
  declineMigration: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'teen_auth_token';
const WELCOMED_KEY = 'teen_welcomed';
const GUEST_JOURNAL_KEY = 'teen_journal_entries';
const ACTIVE_USER_EMAIL_KEY = 'teen_active_user_email';

const getUserStorageKey = (email: string) => `teen_user_data_${email.toLowerCase().trim()}`;

const parseJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64).split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

export const AVATAR_PRESETS = ['🌸', '🎧', '✨', '🐱', '🐻', '🌿', '🍓', '☁️', '🎨', '🌈', '🚀', '🌷', '🐾', '🐬', '🌙', '🧸'];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  
  // Khôi phục user dựa trên email đang active hoặc token hiện tại
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const activeEmail = localStorage.getItem(ACTIVE_USER_EMAIL_KEY);
      if (activeEmail) {
        const savedUser = localStorage.getItem(getUserStorageKey(activeEmail));
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          if (!parsed.created_at) {
            parsed.created_at = parsed.createdAt || new Date().toISOString();
          }
          return {
            id: parsed.id,
            email: parsed.email || activeEmail,
            nickname: parsed.nickname || 'Bạn',
            avatar: parsed.avatar || '🌱',
            created_at: parsed.created_at,
            createdAt: parsed.createdAt || parsed.created_at
          };
        }
      }

      // Khôi phục từ profile active gần nhất nếu có
      const masterProfile = localStorage.getItem('teen_current_user_profile');
      if (masterProfile) {
        const parsed = JSON.parse(masterProfile);
        if (parsed && parsed.id) {
          return {
            id: parsed.id,
            email: parsed.email || '',
            nickname: parsed.nickname || 'Bạn',
            avatar: parsed.avatar || '🌱',
            created_at: parsed.created_at || new Date().toISOString(),
            createdAt: parsed.createdAt || parsed.created_at || new Date().toISOString()
          };
        }
      }
    } catch {}
    return null;
  });

  const [isGuest, setIsGuest] = useState<boolean>(() => !localStorage.getItem(TOKEN_KEY));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState<boolean>(false);
  const [isMigrationModalOpen, setIsMigrationModalOpen] = useState<boolean>(false);
  const [guestJournalCount, setGuestJournalCount] = useState<number>(0);

  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    const wasWelcomed = localStorage.getItem(WELCOMED_KEY);
    if (savedToken && user) {
      setIsGuest(false);
    } else {
      if (!wasWelcomed) setIsWelcomeModalOpen(true);
      setIsGuest(true);
    }
    setIsLoading(false);
  }, [user]);

  const checkGuestJournals = useCallback(() => {
    let total = 0;
    try {
      const rawJournals = localStorage.getItem(GUEST_JOURNAL_KEY);
      if (rawJournals) {
        const entries = JSON.parse(rawJournals);
        if (Array.isArray(entries)) total += entries.length;
      }
      const rawLetters = localStorage.getItem('self_letters_list_guest');
      if (rawLetters) {
        const letters = JSON.parse(rawLetters);
        if (Array.isArray(letters)) total += letters.length;
      }
      const rawSeeds = localStorage.getItem('teen_plant_guest_seeds');
      if (rawSeeds) {
        const seeds = JSON.parse(rawSeeds);
        if (Array.isArray(seeds)) total += seeds.length;
      }
      const rawProgress = localStorage.getItem('teen_user_progress_guest');
      if (rawProgress) {
        const prog = JSON.parse(rawProgress);
        if (prog?.quizHistory?.length) total += prog.quizHistory.length;
      }
    } catch {}
    setGuestJournalCount(total);
    return total;
  }, []);

  const enterAsGuest = useCallback(() => {
    localStorage.setItem(WELCOMED_KEY, 'guest');
    setIsGuest(true);
    setIsWelcomeModalOpen(false);
    setIsLoginModalOpen(false);
  }, []);

  const establishSession = useCallback((
    activeToken: string,
    serverUser: any,
    isNewUser = false
  ) => {
    const cleanEmail = (serverUser.email || '').toLowerCase().trim();
    const userKey = getUserStorageKey(cleanEmail);

    const userData: AuthUser = {
      id: serverUser.id,
      email: cleanEmail,
      nickname: serverUser.nickname || '',
      avatar: serverUser.avatar || '🌱',
      has_password: Boolean(serverUser.has_password),
      created_at: serverUser.created_at || new Date().toISOString(),
      createdAt: serverUser.created_at || new Date().toISOString()
    };

    localStorage.setItem(TOKEN_KEY, activeToken);
    localStorage.setItem(WELCOMED_KEY, 'account');
    localStorage.setItem('teen_current_user_profile', JSON.stringify(userData));
    if (cleanEmail) {
      localStorage.setItem(ACTIVE_USER_EMAIL_KEY, cleanEmail);
      localStorage.setItem(userKey, JSON.stringify(userData));
    }

    setToken(activeToken);
    setUser(userData);
    setIsGuest(false);
    setIsWelcomeModalOpen(false);
    setIsLoginModalOpen(false);

    // Sync remote user progress from server
    syncUserProgressFromServer(userData.id, activeToken).catch(() => {});

    window.dispatchEvent(
      new CustomEvent('teen_account_changed', {
        detail: { action: 'login', userId: userData.id }
      })
    );

    if (isNewUser) {
      setIsNicknameModalOpen(true);
    }

    // Always check if guest has unmigrated data
    const count = checkGuestJournals();
    if (count > 0) {
      setTimeout(() => setIsMigrationModalOpen(true), 1200);
    }
  }, [checkGuestJournals]);

  const loginWithGoogle = useCallback(async (
    emailOrToken: string,
    password: string,
    suggestedNickname?: string,
    avatar?: string
  ) => {
    try {
      let email = emailOrToken;
      let name = suggestedNickname || '';
      let picture = avatar || '🌱';
      let id = `usr_${Date.now()}`;

      if (emailOrToken.includes('.')) {
        const decoded = parseJwt(emailOrToken);
        if (decoded) {
          email = decoded.email || email;
          name = decoded.name || name;
          picture = decoded.picture || picture;
          id = decoded.sub || id;
        }
      }

      const cleanEmail = normalizeEmail(email);
      if (!cleanEmail || !cleanEmail.includes('@')) {
        return { success: false, error: 'Địa chỉ Gmail không hợp lệ.' };
      }

      if (!password || !password.trim()) {
        return { success: false, error: 'Vui lòng nhập mật khẩu tự chọn của bạn.' };
      }

      const trimmedPassword = password.trim();

      // 1. Strict verification against saved password in localStorage
      const localCheck = verifyStoredPassword(cleanEmail, trimmedPassword);
      if (!localCheck.success) {
        return {
          success: false,
          error: localCheck.error || 'Sai mật khẩu. Vui lòng nhập đúng mật khẩu.'
        };
      }

      let activeToken = 'mock_token_' + Date.now();
      let isNewUser = false;
      let serverUser: any = {
        id,
        email: cleanEmail,
        nickname: name || '',
        avatar: picture,
        has_password: true,
        created_at: new Date().toISOString()
      };

      try {
        const authRes = await fetch('/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: cleanEmail,
            password: trimmedPassword,
            suggestedNickname: name || '',
            suggestedAvatar: picture
          })
        });
        const authData = await authRes.json();
        if (!authRes.ok) {
          return { success: false, error: authData.error || 'Sai mật khẩu. Vui lòng nhập đúng mật khẩu.' };
        }
        if (authData.token) activeToken = authData.token;
        if (authData.user) serverUser = authData.user;
        if (authData.isNew) isNewUser = true;
      } catch (err) {
        console.warn('Không thể kết nối API máy chủ, sử dụng phiên cục bộ an toàn:', err);
      }

      // Save/sync verified credentials in localStorage
      saveStoredAccountCredential(cleanEmail, trimmedPassword, {
        nickname: serverUser.nickname,
        avatar: serverUser.avatar,
        id: serverUser.id
      });

      establishSession(activeToken, serverUser, isNewUser);
      return { success: true, isNew: isNewUser };
    } catch (e: any) {
      return { success: false, error: e.message || 'Đăng nhập thất bại.' };
    }
  }, [establishSession]);

  // Login with Website Email & Password
  const loginWithEmailPassword = useCallback(async (email: string, password: string) => {
    try {
      const cleanEmail = normalizeEmail(email);
      const trimmedPassword = (password || '').trim();

      if (!cleanEmail || !cleanEmail.includes('@')) {
        return { success: false, error: 'Vui lòng nhập email hợp lệ.' };
      }
      if (!trimmedPassword) {
        return { success: false, error: 'Vui lòng nhập mật khẩu.' };
      }

      // Strict check against localStorage
      const localCheck = verifyStoredPassword(cleanEmail, trimmedPassword);
      if (!localCheck.success) {
        return { success: false, error: localCheck.error || 'Sai mật khẩu.' };
      }

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: trimmedPassword })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Sai mật khẩu hoặc email không chính xác.' };
      }

      // Save/sync in localStorage
      saveStoredAccountCredential(cleanEmail, trimmedPassword, {
        nickname: data.user?.nickname,
        avatar: data.user?.avatar,
        id: data.user?.id
      });

      establishSession(data.token, data.user, false);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Lỗi kết nối máy chủ.' };
    }
  }, [establishSession]);

  // Register with Website Email & Password
  const registerWithEmailPassword = useCallback(async (email: string, password: string, nickname?: string) => {
    try {
      const cleanEmail = normalizeEmail(email);
      const trimmedPassword = (password || '').trim();

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          password: trimmedPassword,
          nickname: nickname?.trim()
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Đăng ký không thành công.' };
      }

      saveStoredAccountCredential(cleanEmail, trimmedPassword, {
        nickname: data.user?.nickname || nickname?.trim() || '',
        avatar: data.user?.avatar,
        id: data.user?.id
      });

      establishSession(data.token, data.user, true);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Lỗi kết nối máy chủ.' };
    }
  }, [establishSession]);

  // Request password reset verification code
  const requestPasswordReset = useCallback(async (email: string) => {
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() })
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Không thể yêu cầu đặt lại mật khẩu.' };
      }

      return {
        success: true,
        resetCode: data.resetCode,
        message: data.message
      };
    } catch (e: any) {
      return { success: false, error: e.message || 'Lỗi kết nối khi gửi yêu cầu.' };
    }
  }, []);

  // Confirm password reset with code (preserves UID & all data)
  const confirmPasswordReset = useCallback(async (email: string, code: string, newPassword: string) => {
    try {
      const cleanEmail = normalizeEmail(email);
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          code: code.trim(),
          newPassword
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Đặt lại mật khẩu thất bại.' };
      }

      updateStoredPassword(cleanEmail, newPassword);

      if (data.token && data.user) {
        establishSession(data.token, data.user, false);
      }

      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Lỗi kết nối khi cập nhật mật khẩu.' };
    }
  }, [establishSession]);

  // Change password for currently logged-in user
  const changePassword = useCallback(async (newPassword: string, currentPassword?: string) => {
    if (!token) {
      return { success: false, error: 'Bạn cần đăng nhập để đổi mật khẩu.' };
    }

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Đổi mật khẩu thất bại.' };
      }

      if (user?.email) {
        updateStoredPassword(user.email, newPassword);
      }

      // Mark user as having a password set
      if (user) {
        const updated = { ...user, has_password: true };
        setUser(updated);
        if (user.email) {
          localStorage.setItem(getUserStorageKey(user.email), JSON.stringify(updated));
        }
      }

      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Lỗi khi gửi yêu cầu đổi mật khẩu.' };
    }
  }, [token, user]);

  const logout = useCallback(async () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ACTIVE_USER_EMAIL_KEY);
    localStorage.removeItem('teen_current_user_profile');
    setToken(null);
    setUser(null);
    setIsGuest(true);
    setIsProfileModalOpen(false);
    window.dispatchEvent(new CustomEvent('teen_account_changed', { detail: { action: 'logout' } }));
  }, []);

  const updateProfile = useCallback(async (nickname: string, avatar: string) => {
    if (user) {
      const updated: AuthUser = { ...user, nickname, avatar };
      setUser(updated);
      localStorage.setItem('teen_current_user_profile', JSON.stringify(updated));
      if (user.email) {
        localStorage.setItem(getUserStorageKey(user.email), JSON.stringify(updated));
        localStorage.setItem(ACTIVE_USER_EMAIL_KEY, user.email);
      } else {
        localStorage.setItem(`teen_user_data_${user.id}`, JSON.stringify(updated));
      }

      if (token) {
        fetch('/api/users/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ nickname, avatar })
        }).catch(() => {});
      }
    }
    return { success: true };
  }, [user, token]);

  const uploadAvatar = useCallback(async (avatarDataUrl: string) => {
    if (user) {
      const updated: AuthUser = { ...user, avatar: avatarDataUrl };
      setUser(updated);
      localStorage.setItem('teen_current_user_profile', JSON.stringify(updated));
      if (user.email) {
        localStorage.setItem(getUserStorageKey(user.email), JSON.stringify(updated));
        localStorage.setItem(ACTIVE_USER_EMAIL_KEY, user.email);
      } else {
        localStorage.setItem(`teen_user_data_${user.id}`, JSON.stringify(updated));
      }

      if (token) {
        fetch('/api/users/avatar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ avatar: avatarDataUrl })
        }).catch(() => {});
      }
    }
    return { success: true };
  }, [user, token]);

  const removeAvatar = useCallback(async () => {
    if (user) {
      const updated: AuthUser = { ...user, avatar: '🌱' };
      setUser(updated);
      localStorage.setItem('teen_current_user_profile', JSON.stringify(updated));
      if (user.email) {
        localStorage.setItem(getUserStorageKey(user.email), JSON.stringify(updated));
      } else {
        localStorage.setItem(`teen_user_data_${user.id}`, JSON.stringify(updated));
      }

      if (token) {
        fetch('/api/users/avatar', {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }).catch(() => {});
      }
    }
    return { success: true };
  }, [user, token]);

  const deleteAccount = useCallback(async () => {
    if (token) {
      try {
        await fetch('/api/users/account', {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (e) {
        console.error('Lỗi khi gọi API xóa tài khoản:', e);
      }
    }
    if (user) {
      if (user.email) {
        localStorage.removeItem(getUserStorageKey(user.email));
      }
      localStorage.removeItem(`teen_journal_${user.id}_entries`);
      localStorage.removeItem(`teen_journal_${user.id}_capsules`);
      localStorage.removeItem(`teen_plant_${user.id}_seeds`);
      localStorage.removeItem(`self_letters_list_${user.id}`);
      localStorage.removeItem(`self_letter_draft_${user.id}`);
      localStorage.removeItem(`fast_math_best_${user.id}`);
      localStorage.removeItem(`teen_chat_history_${user.id}`);
    }
    await logout();
    return { success: true };
  }, [user, token, logout]);

  const migrateGuestJournal = useCallback(async () => {
    if (user?.id) {
      await migrateAllGuestDataToUser(user.id, token || undefined);
    }
    setIsMigrationModalOpen(false);
    // After migration, clear guest entries so next accounts don't see them
    localStorage.removeItem(GUEST_JOURNAL_KEY);
    setGuestJournalCount(0);
    window.dispatchEvent(new CustomEvent('teen_progress_updated'));
    window.dispatchEvent(new CustomEvent('teen_account_changed', { detail: { action: 'migrate', userId: user?.id } }));
    return { success: true, count: guestJournalCount };
  }, [user, token, guestJournalCount]);

  const declineMigration = useCallback(() => {
    setIsMigrationModalOpen(false);
    // User declined to migrate guest entries to this account
  }, []);
  const refreshUser = useCallback(async () => {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    if (!savedToken) return;
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${savedToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          const u: AuthUser = {
            id: data.user.id,
            email: data.user.email,
            nickname: data.user.nickname,
            avatar: data.user.avatar,
            has_password: Boolean(data.user.has_password),
            created_at: data.user.created_at,
            createdAt: data.user.created_at
          };
          setUser(u);
          if (u.email) {
            localStorage.setItem(getUserStorageKey(u.email), JSON.stringify(u));
          }
        }
      }
    } catch {}
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user, token, isGuest, isLoading,
        isWelcomeModalOpen, isLoginModalOpen, isProfileModalOpen, isNicknameModalOpen, isMigrationModalOpen, guestJournalCount,
        openWelcomeModal: () => setIsWelcomeModalOpen(true),
        closeWelcomeModal: () => setIsWelcomeModalOpen(false),
        openLoginModal: () => setIsLoginModalOpen(true),
        closeLoginModal: () => setIsLoginModalOpen(false),
        openProfileModal: () => setIsProfileModalOpen(true),
        closeProfileModal: () => setIsProfileModalOpen(false),
        openNicknameModal: () => setIsNicknameModalOpen(true),
        closeNicknameModal: () => setIsNicknameModalOpen(false),
        enterAsGuest,
        loginWithGoogle,
        loginWithEmailPassword,
        registerWithEmailPassword,
        requestPasswordReset,
        confirmPasswordReset,
        changePassword,
        logout,
        updateProfile,
        uploadAvatar,
        removeAvatar,
        deleteAccount,
        migrateGuestJournal,
        declineMigration,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};