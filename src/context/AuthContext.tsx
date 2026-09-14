import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface AuthUser {
  id: string;
  email?: string;
  nickname: string;
  avatar: string;
  friend_id: string;
  created_at: string;
  createdAt?: string;
  friendCount?: number;
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
  loginWithGoogle: (emailOrToken: string, suggestedNickname?: string, avatar?: string) => Promise<{ success: boolean; isNew?: boolean; error?: string }>;
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
          if (!parsed.friend_id) {
            parsed.friend_id = (parsed.email || activeEmail).split('@')[0].replace(/[^a-zA-Z0-9]/g, '').slice(0, 6).toUpperCase() + '1001';
          }
          if (!parsed.created_at) {
            parsed.created_at = parsed.createdAt || new Date().toISOString();
          }
          return parsed;
        }
      }
      // Fallback kiểm tra dữ liệu cũ nếu có
      const legacySaved = localStorage.getItem('teen_user_data');
      if (legacySaved) {
        const parsed = JSON.parse(legacySaved);
        if (parsed?.email) {
          if (!parsed.friend_id) {
            parsed.friend_id = parsed.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').slice(0, 6).toUpperCase() + '1001';
          }
          if (!parsed.created_at) {
            parsed.created_at = parsed.createdAt || new Date().toISOString();
          }
          localStorage.setItem(getUserStorageKey(parsed.email), JSON.stringify(parsed));
          localStorage.setItem(ACTIVE_USER_EMAIL_KEY, parsed.email);
          localStorage.removeItem('teen_user_data');
          return parsed;
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
    try {
      const raw = localStorage.getItem(GUEST_JOURNAL_KEY);
      if (raw) {
        const entries = JSON.parse(raw);
        if (Array.isArray(entries) && entries.length > 0) {
          setGuestJournalCount(entries.length);
          return entries.length;
        }
      }
    } catch {}
    setGuestJournalCount(0);
    return 0;
  }, []);

  const enterAsGuest = useCallback(() => {
    localStorage.setItem(WELCOMED_KEY, 'guest');
    setIsGuest(true);
    setIsWelcomeModalOpen(false);
    setIsLoginModalOpen(false);
  }, []);

  const loginWithGoogle = useCallback(async (
    emailOrToken: string,
    suggestedNickname?: string,
    avatar?: string
  ) => {
    try {
      let email = emailOrToken;
      let name = suggestedNickname || '';
      let picture = avatar || '🌱';
      let id = `user_${Date.now()}`;

      if (emailOrToken.includes('.')) {
        const decoded = parseJwt(emailOrToken);
        if (decoded) {
          email = decoded.email || email;
          name = decoded.name || name;
          picture = decoded.picture || picture;
          id = decoded.sub || id;
        }
      }

      const cleanEmail = email.toLowerCase().trim();
      const userKey = getUserStorageKey(cleanEmail);
      
      // Kiểm tra xem tài khoản email này đã từng đăng nhập trước đó chưa
      const existingUserData = localStorage.getItem(userKey);
      let userData: AuthUser;
      let isNewUser = false;

      if (existingUserData) {
        // Nếu đã có rồi, giữ nguyên thông tin cũ (nickname, avatar đã tùy chỉnh) nhưng cập nhật token
        userData = JSON.parse(existingUserData);
        if (!userData.friend_id) {
          userData.friend_id = cleanEmail.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').slice(0, 6).toUpperCase() + '1001';
        }
        if (!userData.created_at) {
          userData.created_at = userData.createdAt || new Date().toISOString();
        }
      } else {
        // Nếu là lần đầu đăng nhập bằng Gmail này
        isNewUser = true;
        const generatedFriendId = cleanEmail.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').slice(0, 6).toUpperCase() + Math.floor(1000 + Math.random() * 9000);
        userData = {
          id,
          email: cleanEmail,
          nickname: name || cleanEmail.split('@')[0],
          avatar: picture,
          friend_id: generatedFriendId,
          created_at: new Date().toISOString(),
          createdAt: new Date().toISOString()
        };
      }

      let activeToken = 'mock_token_' + Date.now();

      // Đồng bộ phiên đăng nhập với máy chủ để xác thực API Bạn bè và Đồng hành
      try {
        const authRes = await fetch('/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: cleanEmail,
            suggestedNickname: userData.nickname,
            suggestedAvatar: userData.avatar
          })
        });
        if (authRes.ok) {
          const authData = await authRes.json();
          if (authData.token) {
            activeToken = authData.token;
          }
          if (authData.user?.friend_id) {
            userData.friend_id = authData.user.friend_id;
          }
        }
      } catch (err) {
        console.warn('Không thể kết nối API xác thực máy chủ, sử dụng phiên cục bộ:', err);
      }

      localStorage.setItem(TOKEN_KEY, activeToken);
      localStorage.setItem(WELCOMED_KEY, 'account');
      localStorage.setItem(ACTIVE_USER_EMAIL_KEY, cleanEmail);
      localStorage.setItem(userKey, JSON.stringify(userData));

      setToken(activeToken);
      setUser(userData);
      setIsGuest(false);
      setIsWelcomeModalOpen(false);
      setIsLoginModalOpen(false);

      // Chỉ bật modal đổi biệt danh nếu thực sự là tài khoản mới tinh
      if (isNewUser) {
        setIsNicknameModalOpen(true);
      }

      const count = checkGuestJournals();
      if (count > 0) {
        setTimeout(() => setIsMigrationModalOpen(true), isNewUser ? 1200 : 300);
      }

      return { success: true, isNew: isNewUser };
    } catch (e: any) {
      return { success: false, error: e.message || 'Đăng nhập thất bại.' };
    }
  }, [checkGuestJournals]);

  const logout = useCallback(async () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ACTIVE_USER_EMAIL_KEY);
    setToken(null);
    setUser(null);
    setIsGuest(true);
    setIsProfileModalOpen(false);
  }, []);

  const updateProfile = useCallback(async (nickname: string, avatar: string) => {
    if (user) {
      const updated = { ...user, nickname, avatar };
      setUser(updated);
      localStorage.setItem(getUserStorageKey(user.email), JSON.stringify(updated));
    }
    return { success: true };
  }, [user]);

  const uploadAvatar = useCallback(async (avatarDataUrl: string) => {
    if (user) {
      const updated = { ...user, avatar: avatarDataUrl };
      setUser(updated);
      localStorage.setItem(getUserStorageKey(user.email), JSON.stringify(updated));
    }
    return { success: true };
  }, [user]);

  const removeAvatar = useCallback(async () => {
    if (user) {
      const updated = { ...user, avatar: '🌱' };
      setUser(updated);
      localStorage.setItem(getUserStorageKey(user.email), JSON.stringify(updated));
    }
    return { success: true };
  }, [user]);

  const deleteAccount = useCallback(async () => {
    if (user) {
      localStorage.removeItem(getUserStorageKey(user.email));
    }
    await logout();
    return { success: true };
  }, [user, logout]);

  const migrateGuestJournal = useCallback(async () => {
    setIsMigrationModalOpen(false);
    return { success: true, count: guestJournalCount };
  }, [guestJournalCount]);

  const declineMigration = useCallback(() => setIsMigrationModalOpen(false), []);
  const refreshUser = useCallback(async () => {}, []);

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
        enterAsGuest, loginWithGoogle, logout, updateProfile, uploadAvatar, removeAvatar, deleteAccount, migrateGuestJournal, declineMigration, refreshUser
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