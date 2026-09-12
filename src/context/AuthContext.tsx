import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthUser } from '../types';

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
  loginWithGoogle: (email: string, suggestedNickname?: string, avatar?: string) => Promise<{ success: boolean; isNew?: boolean; error?: string }>;
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
const GUEST_CAPSULES_KEY = 'teen_journal_capsules';

export const AVATAR_PRESETS = [
  '🌸', '🎧', '✨', '🐱', '🐻', '🌿', 
  '🍓', '☁️', '🎨', '🌈', '🚀', '🌷', 
  '🐾', '🐬', '🌙', '🧸'
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isGuest, setIsGuest] = useState<boolean>(() => !localStorage.getItem(TOKEN_KEY));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modals state
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState<boolean>(false);
  const [isMigrationModalOpen, setIsMigrationModalOpen] = useState<boolean>(false);
  const [guestJournalCount, setGuestJournalCount] = useState<number>(0);

  // Fetch current authenticated user
  const fetchCurrentUser = useCallback(async (authToken: string) => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setIsGuest(false);
        return data.user;
      } else {
        // Token expired
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
        setIsGuest(true);
        return null;
      }
    } catch {
      return null;
    }
  }, []);

  // Initial load check
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      const savedToken = localStorage.getItem(TOKEN_KEY);
      const wasWelcomed = localStorage.getItem(WELCOMED_KEY);

      if (savedToken) {
        setToken(savedToken);
        await fetchCurrentUser(savedToken);
      } else {
        // First time opening web: show welcoming screen
        if (!wasWelcomed) {
          setIsWelcomeModalOpen(true);
        }
        setIsGuest(true);
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, [fetchCurrentUser]);

  // Check guest journal count
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

  // Enter as Guest (Vào thẳng - không cần tài khoản)
  const enterAsGuest = useCallback(() => {
    localStorage.setItem(WELCOMED_KEY, 'guest');
    setIsGuest(true);
    setIsWelcomeModalOpen(false);
    setIsLoginModalOpen(false);
  }, []);

  // Login with Google
  const loginWithGoogle = useCallback(async (
    email: string,
    suggestedNickname?: string,
    avatar?: string
  ): Promise<{ success: boolean; isNew?: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          suggestedNickname,
          suggestedAvatar: avatar || '🌱'
        })
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Đăng nhập thất bại.' };
      }

      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(WELCOMED_KEY, 'account');
      setToken(data.token);
      setUser(data.user);
      setIsGuest(false);
      setIsWelcomeModalOpen(false);
      setIsLoginModalOpen(false);

      // If new user, show Nickname modal so they can choose their nickname!
      if (data.isNew) {
        setIsNicknameModalOpen(true);
      }

      // Check if guest has local journals to offer migration
      const count = checkGuestJournals();
      if (count > 0) {
        // Offer migration
        setTimeout(() => {
          setIsMigrationModalOpen(true);
        }, data.isNew ? 1200 : 300);
      }

      return { success: true, isNew: data.isNew };
    } catch (e: any) {
      return { success: false, error: e.message || 'Lỗi kết nối máy chủ.' };
    }
  }, [checkGuestJournals]);

  // Logout
  const logout = useCallback(async () => {
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch {}
    }

    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setIsGuest(true);
    setIsProfileModalOpen(false);
  }, [token]);

  // Update profile
  const updateProfile = useCallback(async (
    nickname: string,
    avatar: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!token) return { success: false, error: 'Chưa đăng nhập.' };

    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ nickname, avatar })
      });

      const data = await res.json();
      if (res.ok && data.user) {
        setUser((prev) => (prev ? { ...prev, nickname: data.user.nickname, avatar: data.user.avatar } : null));
        return { success: true };
      }
      return { success: false, error: data.error || 'Cập nhật thất bại.' };
    } catch (e: any) {
      return { success: false, error: e.message || 'Lỗi kết nối máy chủ.' };
    }
  }, [token]);

  // Upload avatar specifically linked to account ID
  const uploadAvatar = useCallback(async (
    avatarDataUrl: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!token) return { success: false, error: 'Chưa đăng nhập.' };

    try {
      const res = await fetch('/api/users/avatar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ avatar: avatarDataUrl })
      });

      const data = await res.json();
      if (res.ok && data.user) {
        setUser((prev) => (prev ? { ...prev, avatar: data.user.avatar } : null));
        return { success: true };
      }
      return { success: false, error: data.error || 'Cập nhật ảnh đại diện thất bại.' };
    } catch (e: any) {
      return { success: false, error: e.message || 'Lỗi kết nối máy chủ.' };
    }
  }, [token]);

  // Delete custom avatar and revert to default for account ID
  const removeAvatar = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    if (!token) return { success: false, error: 'Chưa đăng nhập.' };

    try {
      const res = await fetch('/api/users/avatar', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (res.ok && data.user) {
        setUser((prev) => (prev ? { ...prev, avatar: '' } : null));
        return { success: true };
      }
      return { success: false, error: data.error || 'Không thể đặt lại ảnh đại diện mặc định.' };
    } catch (e: any) {
      return { success: false, error: e.message || 'Lỗi kết nối máy chủ.' };
    }
  }, [token]);

  // Delete account
  const deleteAccount = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    if (!token) return { success: false, error: 'Chưa đăng nhập.' };

    try {
      const res = await fetch('/api/users/account', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
        setIsGuest(true);
        setIsProfileModalOpen(false);
        return { success: true };
      }
      return { success: false, error: 'Không thể xóa tài khoản.' };
    } catch (e: any) {
      return { success: false, error: e.message || 'Lỗi kết nối máy chủ.' };
    }
  }, [token]);

  // Migrate guest journal entries to account
  const migrateGuestJournal = useCallback(async (): Promise<{ success: boolean; count?: number; error?: string }> => {
    if (!token) return { success: false, error: 'Chưa đăng nhập.' };

    try {
      let entries: any[] = [];
      let capsules: any[] = [];
      const rawEntries = localStorage.getItem(GUEST_JOURNAL_KEY);
      const rawCapsules = localStorage.getItem(GUEST_CAPSULES_KEY);

      if (rawEntries) entries = JSON.parse(rawEntries);
      if (rawCapsules) capsules = JSON.parse(rawCapsules);

      const res = await fetch('/api/journal/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ entries, capsules })
      });

      if (res.ok) {
        setIsMigrationModalOpen(false);
        return { success: true, count: entries.length };
      }
      return { success: false, error: 'Lỗi đồng bộ nhật ký lên tài khoản.' };
    } catch (e: any) {
      return { success: false, error: e.message || 'Lỗi kết nối.' };
    }
  }, [token]);

  const declineMigration = useCallback(() => {
    setIsMigrationModalOpen(false);
  }, []);

  const refreshUser = useCallback(async () => {
    if (token) {
      await fetchCurrentUser(token);
    }
  }, [token, fetchCurrentUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isGuest,
        isLoading,
        isWelcomeModalOpen,
        isLoginModalOpen,
        isProfileModalOpen,
        isNicknameModalOpen,
        isMigrationModalOpen,
        guestJournalCount,
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
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
// Hàm giải mã JWT Token trực tiếp ở Client
const parseJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Lỗi giải mã token Google:', e);
    return null;
  }
};
