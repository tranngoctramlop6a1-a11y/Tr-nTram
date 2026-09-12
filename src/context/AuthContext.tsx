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
  loginWithGoogle: (credentialOrEmail: string, suggestedNickname?: string, avatar?: string) => Promise<{ success: boolean; isNew?: boolean; error?: string }>;
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
const USER_DATA_KEY = 'teen_user_data';

export const AVATAR_PRESETS = [
  '🌸', '🎧', '✨', '🐱', '🐻', '🌿', 
  '🍓', '☁️', '🎨', '🌈', '🚀', '🌷', 
  '🐾', '🐬', '🌙', '🧸'
];

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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<AuthUser | null>(() => {
    const savedUser = localStorage.getItem(USER_DATA_KEY);
    return savedUser ? JSON.parse(savedUser) : null;
  });
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
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(data.user));
        setIsGuest(false);
        return data.user;
      } else {
        // Nếu backend không phản hồi/lỗi, vẫn dùng thông tin user đã lưu ở localStorage từ JWT client
        const savedUser = localStorage.getItem(USER_DATA_KEY);
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          setUser(parsed);
          setIsGuest(false);
          return parsed;
        }
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_DATA_KEY);
        setToken(null);
        setUser(null);
        setIsGuest(true);
        return null;
      }
    } catch {
      const savedUser = localStorage.getItem(USER_DATA_KEY);
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        setIsGuest(false);
        return parsed;
      }
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

  // Enter as Guest
  const enterAsGuest = useCallback(() => {
    localStorage.setItem(WELCOMED_KEY, 'guest');
    setIsGuest(true);
    setIsWelcomeModalOpen(false);
    setIsLoginModalOpen(false);
  }, []);

  // Login with Google (Client-side JWT handling)
  const loginWithGoogle = useCallback(async (
    credentialOrEmail: string,
    suggestedNickname?: string,
    avatar?: string
  ): Promise<{ success: boolean; isNew?: boolean; error?: string }> => {
    try {
      let email = credentialOrEmail;
      let name = suggestedNickname || '';
      let picture = avatar || '🌱';
      let googleId = '';

      // Kiểm tra xem đầu vào có phải là JWT Token từ Google credential hay không
      if (credentialOrEmail.includes('.')) {
        const decoded = parseJwt(credentialOrEmail);
        if (decoded) {
          email = decoded.email || email;
          name = decoded.name || suggestedNickname || email.split('@')[0];
          picture = decoded.picture || avatar || '🌱';
          googleId = decoded.sub || '';
        }
      }

      const isNewUser = !localStorage.getItem(USER_DATA_KEY);

      const userData: AuthUser = {
        id: googleId || `user_${Date.now()}`,
        email: email,
        nickname: name || email.split('@')[0],
        avatar: picture,
        createdAt: new Date().toISOString()
      };

      // Lưu thông tin đăng nhập trực tiếp tại Frontend
      localStorage.setItem(TOKEN_KEY, credentialOrEmail);
      localStorage.setItem(WELCOMED_KEY, 'account');
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));

      setToken(credentialOrEmail);
      setUser(userData);
      setIsGuest(false);
      setIsWelcomeModalOpen(false);
      setIsLoginModalOpen(false);

      if (isNewUser) {
        setIsNicknameModalOpen(true);
      }

      const count = checkGuestJournals();
      if (count > 0) {
        setTimeout(() => {
          setIsMigrationModalOpen(true);
        }, isNewUser ? 1200 : 300);
      }

      return { success: true, isNew: isNewUser };
    } catch (e: any) {
      return { success: false, error: e.message || 'Lỗi xử lý đăng nhập Google.' };
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
    localStorage.removeItem(USER_DATA_KEY);
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
    const updatedUser = user ? { ...user, nickname, avatar } : null;
    if (updatedUser) {
      setUser(updatedUser);
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(updatedUser));
    }

    if (!token) return { success: true };

    try {
      await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ nickname, avatar })
      });
      return { success: true };
    } catch {
      return { success: true }; // Giữ thay đổi local dù API backend không phản hồi
    }
  }, [token, user]);

  // Upload avatar
  const uploadAvatar = useCallback(async (
    avatarDataUrl: string
  ): Promise<{ success: boolean; error?: string }> => {
    const updatedUser = user ? { ...user, avatar: avatarDataUrl } : null;
    if (updatedUser) {
      setUser(updatedUser);
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(updatedUser));
    }

    if (!token) return { success: true };

    try {
      await fetch('/api/users/avatar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ avatar: avatarDataUrl })
      });
      return { success: true };
    } catch {
      return { success: true };
    }
  }, [token, user]);

  // Delete custom avatar
  const removeAvatar = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    const updatedUser = user ? { ...user, avatar: '🌱' } : null;
    if (updatedUser) {
      setUser(updatedUser);
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(updatedUser));
    }

    if (!token) return { success: true };

    try {
      await fetch('/api/users/avatar', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return { success: true };
    } catch {
      return { success: true };
    }
  }, [token, user]);

  // Delete account
  const deleteAccount = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    if (token) {
      try {
        await fetch('/api/users/account', {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch {}
    }

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
    setToken(null);
    setUser(null);
    setIsGuest(true);
    setIsProfileModalOpen(false);
    return { success: true };
  }, [token]);

  // Migrate guest journal entries
  const migrateGuestJournal = useCallback(async (): Promise<{ success: boolean; count?: number; error?: string }> => {
    let entries: any[] = [];
    const rawEntries = localStorage.getItem(GUEST_JOURNAL_KEY);
    if (rawEntries) entries = JSON.parse(rawEntries);

    setIsMigrationModalOpen(false);

    if (!token) return { success: true, count: entries.length };

    try {
      let capsules: any[] = [];
      const rawCapsules = localStorage.getItem(GUEST_CAPSULES_KEY);
      if (rawCapsules) capsules = JSON.parse(rawCapsules);

      await fetch('/api/journal/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ entries, capsules })
      });

      return { success: true, count: entries.length };
    } catch {
      return { success: true, count: entries.length };
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