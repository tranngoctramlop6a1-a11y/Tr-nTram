export interface StoredAccountCredential {
  email: string;
  password: string;
  nickname?: string;
  avatar?: string;
  id?: string;
  updatedAt: string;
  createdAt?: string;
}

const VAULT_KEY = 'teen_accounts_vault';
const CRED_PREFIX = 'teen_user_credentials_';
const PWD_PREFIX = 'teen_user_pwd_';

export function normalizeEmail(email: string): string {
  return (email || '').trim().toLowerCase();
}

/**
 * Get all accounts stored in the local vault
 */
export function getAllStoredVault(): Record<string, StoredAccountCredential> {
  try {
    const raw = localStorage.getItem(VAULT_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

/**
 * Retrieve credentials for a given email from localStorage
 */
export function getStoredAccountCredential(email: string): StoredAccountCredential | null {
  const clean = normalizeEmail(email);
  if (!clean) return null;

  // 1. Check direct key
  try {
    const directRaw = localStorage.getItem(`${CRED_PREFIX}${clean}`);
    if (directRaw) {
      const parsed = JSON.parse(directRaw);
      if (parsed && parsed.password) {
        return parsed;
      }
    }
  } catch {}

  // 2. Check vault dictionary
  const vault = getAllStoredVault();
  if (vault[clean] && vault[clean].password) {
    return vault[clean];
  }

  // 3. Check legacy raw password key
  try {
    const legacyPwd = localStorage.getItem(`${PWD_PREFIX}${clean}`);
    if (legacyPwd) {
      return {
        email: clean,
        password: legacyPwd,
        updatedAt: new Date().toISOString()
      };
    }
  } catch {}

  return null;
}

/**
 * Check if the email already has a saved password in localStorage
 */
export function hasStoredPassword(email: string): boolean {
  const cred = getStoredAccountCredential(email);
  return Boolean(cred && cred.password && cred.password.length > 0);
}

/**
 * Save or update an account's self-chosen password in localStorage
 */
export function saveStoredAccountCredential(
  email: string,
  password: string,
  extra?: { nickname?: string; avatar?: string; id?: string }
): StoredAccountCredential {
  const clean = normalizeEmail(email);
  const now = new Date().toISOString();

  const existing = getStoredAccountCredential(clean);
  const updated: StoredAccountCredential = {
    email: clean,
    password: password.trim(),
    nickname: extra?.nickname !== undefined ? extra.nickname : (existing?.nickname || ''),
    avatar: extra?.avatar || existing?.avatar || '🌱',
    id: extra?.id || existing?.id,
    createdAt: existing?.createdAt || now,
    updatedAt: now
  };

  // 1. Save direct key
  try {
    localStorage.setItem(`${CRED_PREFIX}${clean}`, JSON.stringify(updated));
    localStorage.setItem(`${PWD_PREFIX}${clean}`, password.trim());
  } catch (e) {
    console.warn('Failed to save direct credential to localStorage:', e);
  }

  // 2. Save into vault
  try {
    const vault = getAllStoredVault();
    vault[clean] = updated;
    localStorage.setItem(VAULT_KEY, JSON.stringify(vault));
  } catch (e) {
    console.warn('Failed to save vault to localStorage:', e);
  }

  return updated;
}

/**
 * Strict verification of email and password against localStorage.
 * 
 * Rules:
 * - If email has a saved password in localStorage:
 *   - password MUST match exactly.
 *   - If not matching: returns { success: false, isStored: true, error: 'Sai mật khẩu. Vui lòng nhập đúng mật khẩu.' }
 * - If email has NO saved password yet in localStorage:
 *   - returns { success: true, isStored: false } allowing first-time setup or initialization.
 */
export function verifyStoredPassword(
  email: string,
  password: string
): { success: boolean; isStored: boolean; error?: string } {
  const clean = normalizeEmail(email);
  if (!clean || !clean.includes('@')) {
    return { success: false, isStored: false, error: 'Địa chỉ email không hợp lệ.' };
  }

  const trimmedPwd = (password || '').trim();
  if (!trimmedPwd) {
    return { success: false, isStored: false, error: 'Vui lòng nhập mật khẩu tự chọn.' };
  }

  const stored = getStoredAccountCredential(clean);

  if (stored && stored.password) {
    if (stored.password !== trimmedPwd) {
      return {
        success: false,
        isStored: true,
        error: 'Sai mật khẩu. Vui lòng nhập đúng mật khẩu đã lưu cho tài khoản này.'
      };
    }
    return { success: true, isStored: true };
  }

  // Account does not have password saved in localStorage yet (e.g. brand new or first setup)
  return { success: true, isStored: false };
}

/**
 * Update password in localStorage (e.g. when reset or changed)
 */
export function updateStoredPassword(email: string, newPassword: string): boolean {
  const clean = normalizeEmail(email);
  if (!clean || !newPassword) return false;
  saveStoredAccountCredential(clean, newPassword);
  return true;
}

/**
 * List recently saved / known accounts for convenient selection (without exposing password)
 */
export function listKnownAccounts(): Array<{ email: string; nickname?: string; avatar?: string; hasPassword: boolean }> {
  const vault = getAllStoredVault();
  return Object.values(vault).map(acc => ({
    email: acc.email,
    nickname: acc.nickname,
    avatar: acc.avatar,
    hasPassword: Boolean(acc.password)
  }));
}
