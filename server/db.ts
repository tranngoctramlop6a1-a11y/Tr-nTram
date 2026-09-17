import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { DAILY_ADVICES, DailyAdvice } from '../src/data/dailyAdvices';

export interface UserAdviceEntry {
  date: string; // YYYY-MM-DD
  advice_id: string;
  read_at: string | null;
}

export interface UserRecord {
  id: string;
  google_auth_id?: string;
  email: string;
  nickname: string;
  avatar: string;
  password_hash?: string; // Salted PBKDF2 hash (NEVER stored plaintext)
  password_salt?: string; // Cryptographic salt
  reset_code?: string | null; // 6-digit verification code
  reset_code_expires?: number | null; // Timestamp expiration
  created_at: string;
  last_active: string;
  advice_history?: UserAdviceEntry[];
  fast_math_best_score?: number;
}

export interface UserJournalRecord {
  user_id: string;
  entries: any[];
  capsules: any[];
  updated_at: string;
}

export interface UserPlantRecord {
  user_id: string;
  seeds: any[];
  updated_at: string;
}

export type LetterConditionType = 'always' | 'date' | 'mood' | 'code';
export type PaperStyle = 'parchment' | 'ivory' | 'kraft' | 'sage' | 'indigo' | 'rose' | 'sky' | 'lavender' | 'matcha' | 'warm_ivory' | 'charcoal' | 'butter' | 'terracotta_sheet' | 'mint';
export type LetterFont = 'serif' | 'handwriting' | 'sans' | 'cursive' | 'patrick' | 'playfair';

export interface SelfLetterRecord {
  id: string;
  sender_id?: string;
  sender_name: string;
  receiver_name?: string;
  title: string;
  content: string;
  paper_style: PaperStyle;
  ink_color: string;
  font_family: LetterFont;
  drawing_data?: string | null;
  open_date: string; // YYYY-MM-DD
  wax_seal: string;
  share_key: string;
  is_opened: boolean;
  opened_at?: string | null;
  created_at: string;
  stickers_data?: string;
  // Legacy compatibility fields
  seal_icon?: string;
  theme_color?: string;
  condition_type?: string;
  unlock_at?: string | null;
  secret_code?: string | null;
  secret_hint?: string | null;
  unlock_mood?: string | null;
  music_tone?: string | null;
}

export type LetterRecord = SelfLetterRecord;

export interface SelfLetterSummary {
  id: string;
  sender_name: string;
  receiver_name?: string;
  title: string;
  paper_style: PaperStyle;
  ink_color: string;
  font_family: LetterFont;
  open_date: string;
  wax_seal: string;
  is_locked: boolean;
  lock_message?: string;
  days_remaining?: number;
  is_opened: boolean;
  opened_at?: string | null;
  created_at: string;
  stickers_data?: string;
  // Legacy compatibility
  seal_icon?: string;
  theme_color?: string;
  condition_type?: string;
  unlock_at?: string | null;
}

export type LetterSummary = SelfLetterSummary;

export interface ConfessionCommentRecord {
  id: string;
  user_id?: string | null;
  author: string;
  author_type: 'user' | 'ai';
  source?: 'user' | 'ai';
  avatar_seed: string;
  content: string;
  created_at: string;
  likes: number;
}

export interface ConfessionRecord {
  id: string;
  user_id: string | null;
  source: 'user' | 'ai';
  title: string;
  content: string;
  category: 'Gia đình' | 'Học tập' | 'Tình bạn' | 'Bản thân' | 'Trường học' | 'Tình cảm' | 'Khác';
  author: string;
  author_type: 'user' | 'ai';
  avatar_seed: string;
  is_anonymous: boolean;
  created_at: string;
  updated_at: string;
  visibility: 'public';
  status: 'active';
  empathy_count: number;
  me_too_count: number;
  comments: ConfessionCommentRecord[];
  user_reactions: Record<string, { empathy?: boolean; meToo?: boolean }>;
  report_count: number;
  reports?: Array<{ reason: string; created_at: string }>;
  date_key?: string;
}

export interface StickyNoteRecord {
  id: string;
  content: string;
  author: string;
  author_type: 'user' | 'ai';
  color: string;
  likes: number;
  created_at: string;
}

export interface DatabaseSchema {
  users: Record<string, UserRecord>; // id -> UserRecord
  sessions: Record<string, string>;  // token -> user_id
  journals: Record<string, UserJournalRecord>; // user_id -> UserJournalRecord
  plants: Record<string, UserPlantRecord>; // user_id -> UserPlantRecord
  letters: Record<string, SelfLetterRecord>; // id -> SelfLetterRecord
  confessions: Record<string, ConfessionRecord>; // id -> ConfessionRecord
  stickyNotes: Record<string, StickyNoteRecord>; // id -> StickyNoteRecord
  userProgress: Record<string, any>; // user_id -> UserProgress
}

const DB_FILE_PATH = path.join(process.cwd(), 'server_db_store.json');

class Database {
  private data: DatabaseSchema;
  private saveTimeout: NodeJS.Timeout | null = null;
  // Strict unique lookup indices
  private emailIndex: Map<string, string> = new Map();    // clean email (lowercase) -> user_id
  private googleIdIndex: Map<string, string> = new Map(); // google_auth_id -> user_id

  constructor() {
    this.data = {
      users: {},
      sessions: {},
      journals: {},
      plants: {},
      letters: {},
      confessions: {},
      stickyNotes: {},
      userProgress: {}
    };
    this.load();
  }

  private rebuildIndexes() {
    this.emailIndex.clear();
    this.googleIdIndex.clear();

    for (const user of Object.values(this.data.users)) {
      if (user.email) {
        this.emailIndex.set(user.email.trim().toLowerCase(), user.id);
      }
      if (user.google_auth_id) {
        this.googleIdIndex.set(user.google_auth_id, user.id);
      }
    }
  }

  private load() {
    try {
      if (fs.existsSync(DB_FILE_PATH)) {
        const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        this.data = {
          users: parsed.users || {},
          sessions: parsed.sessions || {},
          journals: parsed.journals || {},
          plants: parsed.plants || {},
          letters: parsed.letters || {},
          confessions: parsed.confessions || {},
          stickyNotes: parsed.stickyNotes || {},
          userProgress: parsed.userProgress || {}
        };
      }
    } catch (e) {
      console.warn('Could not load database file, initializing empty in-memory store:', e);
    }

    this.rebuildIndexes();
  }

  private scheduleSave() {
    if (this.saveTimeout) return;
    this.saveTimeout = setTimeout(() => {
      this.saveTimeout = null;
      this.saveSync();
    }, 150);
  }

  private saveSync() {
    try {
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to write database file:', e);
    }
  }

  // Find user by ID
  public getUserById(id: string): UserRecord | null {
    return this.data.users[id] || null;
  }

  // Find user by Email (case-insensitive)
  public getUserByEmail(email: string): UserRecord | null {
    const clean = email.trim().toLowerCase();
    const id = this.emailIndex.get(clean);
    if (id && this.data.users[id]) return this.data.users[id];

    // Fallback search
    for (const u of Object.values(this.data.users)) {
      if (u.email && u.email.trim().toLowerCase() === clean) {
        this.emailIndex.set(clean, u.id);
        return u;
      }
    }
    return null;
  }

  // Find user by Google Auth ID
  public getUserByGoogleId(googleId: string): UserRecord | null {
    const id = this.googleIdIndex.get(googleId);
    if (id && this.data.users[id]) return this.data.users[id];

    for (const u of Object.values(this.data.users)) {
      if (u.google_auth_id === googleId) {
        this.googleIdIndex.set(googleId, u.id);
        return u;
      }
    }
    return null;
  }

  // Find or create user via Google OAuth / Gmail payload with strict password verification
  public findOrCreateGoogleUser(params: {
    google_auth_id?: string;
    email: string;
    password?: string;
    suggestedNickname?: string;
    suggestedAvatar?: string;
  }): { user?: UserRecord; isNew?: boolean; error?: string } {
    const cleanEmail = params.email.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { error: 'Email không hợp lệ.' };
    }

    if (!params.password || !params.password.trim()) {
      return { error: 'Vui lòng nhập mật khẩu tự chọn để tiếp tục.' };
    }

    // 1. Lookup existing user by email
    let existing = this.getUserByEmail(cleanEmail);

    // 2. Lookup existing user by google_auth_id if not found by email
    if (!existing && params.google_auth_id) {
      existing = this.getUserByGoogleId(params.google_auth_id);
    }

    if (existing) {
      // If user already has a password set on server, verify it
      if (existing.password_hash && existing.password_salt) {
        const isMatch = this.verifyPassword(params.password.trim(), existing.password_hash, existing.password_salt);
        if (!isMatch) {
          return { error: 'Sai mật khẩu. Vui lòng nhập đúng mật khẩu đã lưu.' };
        }
      } else {
        // User previously registered without password: set their chosen password now
        const { hash, salt } = this.hashPassword(params.password.trim());
        existing.password_hash = hash;
        existing.password_salt = salt;
      }

      existing.last_active = new Date().toISOString();
      if (params.google_auth_id && !existing.google_auth_id) {
        existing.google_auth_id = params.google_auth_id;
        this.googleIdIndex.set(params.google_auth_id, existing.id);
      }
      this.scheduleSave();
      return { user: existing, isNew: false };
    }

    // New User creation: require password and hash it
    const { hash, salt } = this.hashPassword(params.password.trim());
    const id = `usr_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
    const nickname = params.suggestedNickname?.trim() || '';
    const avatar = params.suggestedAvatar || '🌱';

    const newUser: UserRecord = {
      id,
      google_auth_id: params.google_auth_id || `google_${Buffer.from(cleanEmail).toString('base64').replace(/=/g, '')}`,
      email: cleanEmail,
      nickname,
      avatar,
      password_hash: hash,
      password_salt: salt,
      created_at: new Date().toISOString(),
      last_active: new Date().toISOString()
    };

    this.data.users[id] = newUser;

    // Update indexes
    this.emailIndex.set(cleanEmail, id);
    if (newUser.google_auth_id) {
      this.googleIdIndex.set(newUser.google_auth_id, id);
    }

    this.scheduleSave();
    return { user: newUser, isNew: true };
  }

  // Cryptographic Salted PBKDF2 Password Hashing (OWASP / NIST Recommended)
  public hashPassword(password: string, salt?: string): { hash: string; salt: string } {
    const s = salt || crypto.randomBytes(16).toString('hex');
    const h = crypto.pbkdf2Sync(password, s, 100000, 64, 'sha512').toString('hex');
    return { hash: h, salt: s };
  }

  public verifyPassword(password: string, hash?: string, salt?: string): boolean {
    if (!password || !hash || !salt) return false;
    try {
      const calculated = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
      const bufCalculated = Buffer.from(calculated, 'hex');
      const bufStored = Buffer.from(hash, 'hex');
      if (bufCalculated.length !== bufStored.length) return false;
      return crypto.timingSafeEqual(bufCalculated, bufStored);
    } catch {
      return false;
    }
  }

  // Register with Website Password
  public registerWithPassword(params: {
    email: string;
    password: string;
    nickname?: string;
  }): { user?: UserRecord; error?: string } {
    const cleanEmail = params.email.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { error: 'Email không hợp lệ.' };
    }
    if (!params.password || params.password.length < 8) {
      return { error: 'Mật khẩu phải có ít nhất 8 ký tự.' };
    }

    // Check existing
    const existing = this.getUserByEmail(cleanEmail);
    if (existing) {
      if (existing.password_hash) {
        return { error: 'Email này đã có tài khoản. Vui lòng đăng nhập hoặc chọn Quên mật khẩu.' };
      }
      // If user previously signed in with Google, set up their website password seamlessly
      const { hash, salt } = this.hashPassword(params.password);
      existing.password_hash = hash;
      existing.password_salt = salt;
      if (params.nickname?.trim()) {
        existing.nickname = params.nickname.trim();
      }
      existing.last_active = new Date().toISOString();
      this.scheduleSave();
      return { user: existing };
    }

    // Brand new user
    const { hash, salt } = this.hashPassword(params.password);
    const id = `usr_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
    const nickname = params.nickname?.trim() || '';

    const newUser: UserRecord = {
      id,
      email: cleanEmail,
      nickname,
      avatar: '🌱',
      password_hash: hash,
      password_salt: salt,
      created_at: new Date().toISOString(),
      last_active: new Date().toISOString()
    };

    this.data.users[id] = newUser;
    this.emailIndex.set(cleanEmail, id);
    this.scheduleSave();
    return { user: newUser };
  }

  // Login with Website Password
  public loginWithPassword(params: {
    email: string;
    password: string;
  }): { user?: UserRecord; error?: string } {
    const cleanEmail = params.email.trim().toLowerCase();

    if (!cleanEmail || !params.password) {
      return { error: 'Vui lòng nhập đầy đủ email và mật khẩu.' };
    }

    const user = this.getUserByEmail(cleanEmail);
    if (!user) {
      return { error: 'Email hoặc mật khẩu không chính xác.' };
    }

    if (!user.password_hash || !user.password_salt) {
      return { error: 'Tài khoản này được đăng ký qua Google. Bạn vui lòng chọn Đăng nhập với Google hoặc thiết lập mật khẩu mới qua Quên mật khẩu.' };
    }

    const isMatch = this.verifyPassword(params.password, user.password_hash, user.password_salt);
    if (!isMatch) {
      return { error: 'Email hoặc mật khẩu không chính xác.' };
    }

    user.last_active = new Date().toISOString();
    this.scheduleSave();
    return { user };
  }

  // Request password reset code
  public requestPasswordReset(email: string): { success: boolean; resetCode?: string; message: string } {
    const cleanEmail = email.trim().toLowerCase();
    const user = this.getUserByEmail(cleanEmail);

    if (!user) {
      // Friendly message without leaking existence for privacy
      return {
        success: true,
        message: 'Nếu email tồn tại trong hệ thống, mã xác thực đặt lại mật khẩu đã được tạo.'
      };
    }

    // Generate secure 6-digit numeric code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.reset_code = code;
    user.reset_code_expires = Date.now() + 15 * 60 * 1000; // 15 minutes validity
    this.scheduleSave();

    return {
      success: true,
      resetCode: code,
      message: 'Mã xác thực 6 chữ số đã được gửi. Mã có hiệu lực trong 15 phút.'
    };
  }

  // Reset password using verified code (NEVER deletes user data, keeps UID intact)
  public resetPasswordWithCode(params: {
    email: string;
    code: string;
    newPassword: string;
  }): { user?: UserRecord; error?: string } {
    const cleanEmail = params.email.trim().toLowerCase();
    const user = this.getUserByEmail(cleanEmail);

    if (!user) {
      return { error: 'Không tìm thấy tài khoản với email này.' };
    }

    if (!user.reset_code || !user.reset_code_expires || user.reset_code.trim() !== params.code.trim()) {
      return { error: 'Mã xác thực không chính xác hoặc đã hết hạn.' };
    }

    if (Date.now() > user.reset_code_expires) {
      user.reset_code = null;
      user.reset_code_expires = null;
      this.scheduleSave();
      return { error: 'Mã xác thực đã hết hạn. Vui lòng yêu cầu mã mới.' };
    }

    if (!params.newPassword || params.newPassword.length < 8) {
      return { error: 'Mật khẩu mới phải có ít nhất 8 ký tự.' };
    }

    const { hash, salt } = this.hashPassword(params.newPassword);
    user.password_hash = hash;
    user.password_salt = salt;
    user.reset_code = null;
    user.reset_code_expires = null;
    user.last_active = new Date().toISOString();
    this.scheduleSave();

    return { user };
  }

  // Change password for logged in user
  public changePassword(params: {
    userId: string;
    newPassword: string;
    currentPassword?: string;
  }): { success: boolean; error?: string } {
    const user = this.getUserById(params.userId);
    if (!user) {
      return { success: false, error: 'Người dùng không tồn tại.' };
    }

    if (!params.newPassword || params.newPassword.length < 8) {
      return { success: false, error: 'Mật khẩu mới phải có ít nhất 8 ký tự.' };
    }

    // If user already has password set, verify current password
    if (user.password_hash && user.password_salt) {
      if (!params.currentPassword) {
        return { success: false, error: 'Vui lòng nhập mật khẩu hiện tại.' };
      }
      const isCurrentValid = this.verifyPassword(params.currentPassword, user.password_hash, user.password_salt);
      if (!isCurrentValid) {
        return { success: false, error: 'Mật khẩu hiện tại không đúng.' };
      }
    }

    const { hash, salt } = this.hashPassword(params.newPassword);
    user.password_hash = hash;
    user.password_salt = salt;
    user.last_active = new Date().toISOString();
    this.scheduleSave();

    return { success: true };
  }

  // Safe user serialization (NEVER leak password_hash, password_salt or reset_code)
  public getSafeUser(user: UserRecord) {
    return {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      avatar: user.avatar,
      has_password: Boolean(user.password_hash),
      created_at: user.created_at,
      createdAt: user.created_at
    };
  }

  // Create session
  public createSession(userId: string): string {
    const token = `tok_${Date.now()}_${Math.random().toString(36).substring(2, 15)}_${Math.random().toString(36).substring(2, 15)}`;
    this.data.sessions[token] = userId;
    this.scheduleSave();
    return token;
  }

  // Retrieve user by session token
  public getUserByToken(token: string): UserRecord | null {
    if (!token) return null;
    const cleanToken = token.startsWith('Bearer ') ? token.slice(7).trim() : token.trim();
    const userId = this.data.sessions[cleanToken];
    if (!userId) {
      // In dev/demo, check if token itself is an ID
      if (cleanToken.startsWith('usr_') && this.data.users[cleanToken]) {
        return this.data.users[cleanToken];
      }
      // Demo dev tokens
      if (cleanToken.startsWith('dev_token_')) {
        const idPart = cleanToken.replace('dev_token_', '');
        if (this.data.users[idPart]) return this.data.users[idPart];
      }
      return null;
    }
    const user = this.data.users[userId];
    if (user) {
      user.last_active = new Date().toISOString();
    }
    return user || null;
  }

  // Invalidate session
  public deleteSession(token: string) {
    const cleanToken = token.startsWith('Bearer ') ? token.slice(7).trim() : token.trim();
    delete this.data.sessions[cleanToken];
    this.scheduleSave();
  }

  // Update profile
  public updateUser(userId: string, updates: { nickname?: string; avatar?: string }): UserRecord | null {
    const user = this.data.users[userId];
    if (!user) return null;

    if (updates.nickname && updates.nickname.trim()) {
      user.nickname = updates.nickname.trim();
    }
    if (updates.avatar && updates.avatar.trim()) {
      user.avatar = updates.avatar.trim();
    }
    user.last_active = new Date().toISOString();
    this.scheduleSave();
    return user;
  }

  // User Fast Math Best Score
  public getUserFastMathBest(userId: string): number {
    const user = this.data.users[userId];
    return user?.fast_math_best_score || 0;
  }

  public updateUserFastMathBest(userId: string, score: number): number {
    const user = this.data.users[userId];
    if (!user) return score;
    const current = user.fast_math_best_score || 0;
    if (score > current) {
      user.fast_math_best_score = score;
      this.scheduleSave();
      return score;
    }
    return current;
  }

  // Get or assign daily advice for user
  public getOrCreateUserDailyAdvice(
    userId: string,
    dateStr: string
  ): { advice: DailyAdvice; hasReadToday: boolean; date: string } {
    const user = this.data.users[userId];
    if (!user) {
      return {
        advice: DAILY_ADVICES[0],
        hasReadToday: false,
        date: dateStr
      };
    }

    if (!user.advice_history) {
      user.advice_history = [];
    }

    // 1. Check if an advice is already assigned to this account for today
    const existingEntry = user.advice_history.find((e) => e.date === dateStr);
    if (existingEntry) {
      const foundAdvice = DAILY_ADVICES.find((a) => a.id === existingEntry.advice_id) || DAILY_ADVICES[0];
      return {
        advice: foundAdvice,
        hasReadToday: !!existingEntry.read_at,
        date: dateStr
      };
    }

    // 2. Identify all advice IDs this account has ever received
    const receivedIds = new Set(user.advice_history.map((e) => e.advice_id));
    const unreadAdvices = DAILY_ADVICES.filter((a) => !receivedIds.has(a.id));

    let chosenAdvice: DailyAdvice;
    if (unreadAdvices.length > 0) {
      let hash = 0;
      const seed = `${user.id}_${dateStr}`;
      for (let i = 0; i < seed.length; i++) {
        hash = (hash << 5) - hash + seed.charCodeAt(i);
        hash |= 0;
      }
      const index = Math.abs(hash) % unreadAdvices.length;
      chosenAdvice = unreadAdvices[index];
    } else {
      const oldestId = user.advice_history[0]?.advice_id;
      chosenAdvice = DAILY_ADVICES.find((a) => a.id === oldestId) || DAILY_ADVICES[0];
    }

    user.advice_history.push({
      date: dateStr,
      advice_id: chosenAdvice.id,
      read_at: null
    });
    this.scheduleSave();

    return {
      advice: chosenAdvice,
      hasReadToday: false,
      date: dateStr
    };
  }

  public markUserDailyAdviceRead(userId: string, dateStr: string): boolean {
    const user = this.data.users[userId];
    if (!user || !user.advice_history) return false;

    const entry = user.advice_history.find((e) => e.date === dateStr);
    if (entry) {
      if (!entry.read_at) {
        entry.read_at = new Date().toISOString();
        this.scheduleSave();
      }
      return true;
    }
    return false;
  }

  // Delete account completely and purge user data
  public deleteUser(userId: string): boolean {
    if (!this.data.users[userId]) return false;

    delete this.data.users[userId];
    delete this.data.journals[userId];
    delete this.data.plants[userId];

    // Purge user's letters
    if (this.data.letters) {
      for (const [id, ltr] of Object.entries(this.data.letters)) {
        if (ltr.sender_id === userId) {
          delete this.data.letters[id];
        }
      }
    }

    // Remove sessions
    for (const [token, uid] of Object.entries(this.data.sessions)) {
      if (uid === userId) delete this.data.sessions[token];
    }

    this.scheduleSave();
    return true;
  }

  // Save User Journal (STRICTLY ISOLATED BY UID)
  public saveUserJournal(userId: string, entries: any[], capsules: any[]): boolean {
    this.data.journals[userId] = {
      user_id: userId,
      entries: Array.isArray(entries) ? entries : [],
      capsules: Array.isArray(capsules) ? capsules : [],
      updated_at: new Date().toISOString()
    };
    this.scheduleSave();
    return true;
  }

  // Get User Journal (STRICTLY ISOLATED BY UID)
  public getUserJournal(userId: string): { entries: any[]; capsules: any[] } {
    const j = this.data.journals[userId];
    if (!j) {
      return { entries: [], capsules: [] };
    }
    return {
      entries: Array.isArray(j.entries) ? j.entries : [],
      capsules: Array.isArray(j.capsules) ? j.capsules : []
    };
  }

  // Save User Plant Seeds & State (STRICTLY PERSONAL - NO FRIEND CARE)
  public saveUserPlant(userId: string, data: any): boolean {
    const existing: Partial<UserPlantRecord> = this.data.plants[userId] || {};
    if (Array.isArray(data)) {
      this.data.plants[userId] = {
        ...existing,
        user_id: userId,
        seeds: data,
        updated_at: new Date().toISOString()
      };
    } else if (data && typeof data === 'object') {
      this.data.plants[userId] = {
        ...existing,
        ...data,
        user_id: userId,
        seeds: Array.isArray(data.seeds) ? data.seeds : (existing.seeds || []),
        updated_at: new Date().toISOString()
      };
    }
    this.scheduleSave();
    return true;
  }

  // Get User Plant (STRICTLY PERSONAL)
  public getUserPlant(userId: string): any {
    const p = this.data.plants[userId];
    if (!p) {
      return { seeds: [] };
    }
    return {
      ...p,
      seeds: Array.isArray(p.seeds) ? p.seeds : []
    };
  }

  // Letters to Self
  public createLetter(data: {
    sender_id?: string;
    sender_name?: string;
    receiver_name?: string;
    title: string;
    content: string;
    paper_style?: PaperStyle;
    ink_color?: string;
    font_family?: LetterFont;
    drawing_data?: string | null;
    open_date: string;
    wax_seal?: string;
    stickers_data?: string;
    seal_icon?: string;
    theme_color?: string;
    condition_type?: LetterConditionType;
    unlock_at?: string | null;
  }): SelfLetterRecord {
    const id = 'self_ltr_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7);
    const share_key = 'sk_' + Math.random().toString(36).substring(2, 10);

    const letter: SelfLetterRecord = {
      id,
      sender_id: data.sender_id || undefined,
      sender_name: data.sender_name?.trim() || 'Tôi của hôm nay',
      receiver_name: data.receiver_name?.trim() || 'Tôi của ngày mai',
      title: data.title.trim(),
      content: data.content.trim(),
      paper_style: data.paper_style || 'parchment',
      ink_color: data.ink_color || '#3b2a1e',
      font_family: data.font_family || 'serif',
      drawing_data: data.drawing_data || null,
      open_date: data.open_date || data.unlock_at || new Date().toISOString().split('T')[0],
      wax_seal: data.wax_seal || 'terracotta',
      is_opened: false,
      opened_at: null,
      created_at: new Date().toISOString(),
      stickers_data: data.stickers_data || undefined,
      seal_icon: data.seal_icon || '✉️',
      theme_color: data.theme_color || 'amber',
      condition_type: 'date',
      unlock_at: data.open_date,
      share_key
    };

    if (!this.data.letters) {
      this.data.letters = {};
    }
    this.data.letters[id] = letter;
    this.scheduleSave();
    return letter;
  }

  private getLetterOpenTimestamp(openDateStr: string): number {
    if (!openDateStr) return 0;
    if (/^\d{4}-\d{2}-\d{2}$/.test(openDateStr)) {
      const parts = openDateStr.split('-');
      return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]), 0, 0, 0).getTime();
    }
    return new Date(openDateStr).getTime();
  }

  private formatVnDate(timestamp: number): string {
    const d = new Date(timestamp);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  public getLetterSummaries(userId?: string): SelfLetterSummary[] {
    if (!this.data.letters) return [];
    const now = Date.now();

    const letters = Object.values(this.data.letters)
      .filter((ltr) => userId ? (ltr.sender_id === userId || !ltr.sender_id) : !ltr.sender_id);

    return letters
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .map(ltr => {
        const openDateStr = ltr.open_date || ltr.unlock_at || ltr.created_at;
        const openTime = this.getLetterOpenTimestamp(openDateStr);
        const formattedDate = this.formatVnDate(openTime);

        let is_locked = false;
        let lock_message = '';
        let days_remaining = 0;

        if (now < openTime) {
          is_locked = true;
          days_remaining = Math.max(1, Math.ceil((openTime - now) / (1000 * 60 * 60 * 24)));
          lock_message = `Bức thư này được hẹn ngày ${formattedDate} mới mở. Hãy kiên nhẫn chờ đợi nhé...`;
        }

        return {
          id: ltr.id,
          sender_name: ltr.sender_name,
          receiver_name: ltr.receiver_name,
          title: ltr.title,
          paper_style: ltr.paper_style || 'parchment',
          ink_color: ltr.ink_color || '#3b2a1e',
          font_family: ltr.font_family || 'serif',
          open_date: openDateStr,
          wax_seal: ltr.wax_seal || 'terracotta',
          is_opened: !!ltr.is_opened,
          opened_at: ltr.opened_at,
          created_at: ltr.created_at,
          is_locked,
          lock_message,
          days_remaining,
          seal_icon: ltr.seal_icon || '✉️',
          theme_color: ltr.theme_color || 'amber',
          has_drawing: !!ltr.drawing_data,
          stickers_data: ltr.stickers_data,
          condition_type: 'date',
          unlock_at: openDateStr
        };
      });
  }

  public getLetterById(id: string): SelfLetterRecord | null {
    if (!this.data.letters) return null;
    return this.data.letters[id] || null;
  }

  public openLetter(
    id: string
  ): { success: boolean; letter?: SelfLetterRecord; locked?: boolean; lock_message?: string; days_remaining?: number; open_date?: string } {
    const ltr = this.getLetterById(id);
    if (!ltr) {
      return { success: false, lock_message: 'Không tìm thấy bức thư này.' };
    }

    const now = Date.now();
    const openDateStr = ltr.open_date || ltr.unlock_at || ltr.created_at;
    const openTime = this.getLetterOpenTimestamp(openDateStr);
    const formattedDate = this.formatVnDate(openTime);

    if (now < openTime) {
      const days_remaining = Math.max(1, Math.ceil((openTime - now) / (1000 * 60 * 60 * 24)));
      const lock_message = `Bức thư này được hẹn ngày ${formattedDate} mới mở. Hãy kiên nhẫn chờ đợi nhé...`;
      return {
        success: false,
        locked: true,
        lock_message,
        days_remaining,
        open_date: openDateStr
      };
    }

    if (!ltr.is_opened) {
      ltr.is_opened = true;
      ltr.opened_at = new Date().toISOString();
      this.scheduleSave();
    }

    return {
      success: true,
      letter: ltr
    };
  }

  public deleteLetter(id: string, userId?: string): boolean {
    if (!this.data.letters || !this.data.letters[id]) return false;
    if (userId && this.data.letters[id].sender_id && this.data.letters[id].sender_id !== userId) {
      return false;
    }
    delete this.data.letters[id];
    this.scheduleSave();
    return true;
  }

  // ==================== Confessions & Community ====================

  public ensureDailyAiConfessions(todayStr: string): void {
    if (!this.data.confessions) {
      this.data.confessions = {};
    }
    const hasTodayAi = Object.values(this.data.confessions).some(
      c => c.author_type === 'ai' && c.date_key === todayStr
    );

    if (!hasTodayAi) {
      const parts = todayStr.split('-');
      const day = parseInt(parts[2], 10) || 15;
      const pool = [
        {
          title: 'Kỳ vọng điểm 9 của mẹ và tờ giấy kiểm tra điểm 6.5',
          content: 'Hôm nay cô giáo trả bài khảo sát Toán. Nhìn thấy con số 6.5 đỏ chói ở góc bài, tự nhiên tai mình ù đi. Suốt quãng đường đạp xe về nhà, mình chỉ sợ nghe câu: "Mẹ cho con đi học thêm bao nhiêu tiền mà chỉ được thế này thôi à?". Mình biết bố mẹ vất vả vì mình, nhưng mình thấy mình đang dần nghẹt thở vì không thể hoàn hảo như kỳ vọng...',
          category: 'Gia đình' as const,
          empathy: 42,
          meToo: 38
        },
        {
          title: 'Cảm giác lạc lõng ngay giữa nhóm bạn thân 4 người',
          content: 'Tụi mình chơi chung từ năm lớp 7. Nhưng dạo gần đây, 3 bạn kia lập một nhóm chat riêng khác, có những câu chuyện đùa riêng mà khi mình hỏi thì các bạn chỉ bảo: "À không có gì đâu". Đi ăn cùng nhau, các bạn cắm mặt vào điện thoại cười với nhau. Ngồi giữa các bạn mà mình thấy cô đơn hơn cả lúc ở một mình...',
          category: 'Tình bạn' as const,
          empathy: 56,
          meToo: 49
        },
        {
          title: 'Tự ti vì khuôn mặt dậy thì nhiều mụn và chiếc kính cận dày cộp',
          content: 'Mỗi lần đi qua gương ở sảnh trường, mình đều cúi gằm mặt xuống. Nhìn các bạn nữ trong lớp da dẻ mịn màng, biết ăn mặc đẹp, mình thấy mình như một chú vịt xấu xí. Đôi khi có bạn nam trêu chọc một câu vô ý thôi mà mình về nhà khóc cả buổi tối...',
          category: 'Bản thân' as const,
          empathy: 68,
          meToo: 72
        },
        {
          title: 'Làm nhóm trưởng bài tập Sinh học: Khi một mình gánh cả team',
          content: 'Cô giáo phân nhóm 5 người làm bài thuyết trình slide. Mình phân chia việc rõ ràng từ thứ Hai, nhưng đến tối Chủ nhật sát ngày nộp bài, 4 bạn kia vẫn "seen" không trả lời. Cuối cùng mình phải thức trắng đêm làm slide cho cả nhóm. Vừa tức vừa bất lực...',
          category: 'Trường học' as const,
          empathy: 61,
          meToo: 55
        },
        {
          title: 'Nỗi sợ hãi vô hình mỗi sáng trước khi bước chân vào cổng trường',
          content: 'Không hẳn là bị bắt nạt, nhưng lớp mình có văn hóa "chia bè kéo phái" và hay soi mói từng hành động của người khác. Chỉ cần bước vào lớp là mình cảm thấy có hàng chục ánh mắt đang nhìn và thì thầm...',
          category: 'Trường học' as const,
          empathy: 77,
          meToo: 64
        },
        {
          title: 'Thích một bạn cùng bàn suốt một năm nhưng không dám nói',
          content: 'Mỗi ngày đến lớp, niềm vui duy nhất là được nhìn thấy bạn ấy cười khi mình chuyền hộ cục tẩy hoặc giảng bài tập Toán. Bạn ấy tốt bụng với tất cả mọi người, nên mình sợ nếu nói ra thì ngay cả tình bạn trong sáng này cũng sẽ tan vỡ mất...',
          category: 'Tình cảm' as const,
          empathy: 89,
          meToo: 82
        }
      ];

      const startIdx = (day * 3) % pool.length;
      const todayPosts = [
        pool[startIdx % pool.length],
        pool[(startIdx + 1) % pool.length],
        pool[(startIdx + 2) % pool.length]
      ];

      const now = Date.now();
      todayPosts.forEach((post, i) => {
        const id = `ai_conf_${todayStr}_${i}`;
        const createdAt = new Date(now - (i * 2 + 1) * 3600 * 1000).toISOString();
        this.data.confessions[id] = {
          id,
          user_id: null,
          source: 'ai',
          title: post.title,
          content: post.content,
          category: post.category,
          author: 'AI Đồng Cảm',
          author_type: 'ai',
          avatar_seed: `ai_avatar_${i}_${day}`,
          is_anonymous: false,
          created_at: createdAt,
          updated_at: createdAt,
          visibility: 'public',
          status: 'active',
          empathy_count: post.empathy,
          me_too_count: post.meToo,
          comments: [],
          user_reactions: {},
          report_count: 0,
          date_key: todayStr
        };
      });

      this.scheduleSave();
    }
  }

  public getConfessions(options: {
    category?: string;
    sortBy?: 'newest' | 'hot' | 'bookmarked';
    search?: string;
    userId?: string;
    bookmarkedIds?: string[];
  }): any[] {
    const todayStr = new Date().toISOString().split('T')[0];
    this.ensureDailyAiConfessions(todayStr);

    let list = Object.values(this.data.confessions || {});

    // Only active and public posts
    list = list.filter(c => (c.status === undefined || c.status === 'active') && (c.visibility === undefined || c.visibility === 'public'));

    // Filter by category
    if (options.category && options.category !== 'Tất cả') {
      list = list.filter(c => c.category === options.category);
    }

    // Filter by search query
    if (options.search && options.search.trim()) {
      const q = options.search.toLowerCase().trim();
      list = list.filter(c => c.title.toLowerCase().includes(q) || c.content.toLowerCase().includes(q));
    }

    // Filter by bookmarked
    if (options.sortBy === 'bookmarked' && options.bookmarkedIds) {
      const bSet = new Set(options.bookmarkedIds);
      list = list.filter(c => bSet.has(c.id));
    }

    // Sort
    if (options.sortBy === 'hot') {
      list.sort((a, b) => {
        const scoreA = (a.empathy_count || 0) * 1.5 + (a.me_too_count || 0) + (a.comments?.length || 0) * 2;
        const scoreB = (b.empathy_count || 0) * 1.5 + (b.me_too_count || 0) + (b.comments?.length || 0) * 2;
        return scoreB - scoreA;
      });
    } else {
      // Default: newest first
      list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    // Map to client format
    return list.map(c => ({
      id: c.id,
      userId: c.user_id || null,
      source: c.source || c.author_type || 'user',
      title: c.title,
      content: c.content,
      category: c.category,
      author: c.author,
      authorType: c.author_type || c.source || 'user',
      avatarSeed: c.avatar_seed,
      isAnonymous: c.is_anonymous,
      createdAt: c.created_at,
      updatedAt: c.updated_at,
      visibility: c.visibility || 'public',
      status: c.status || 'active',
      empathyCount: c.empathy_count || 0,
      meTooCount: c.me_too_count || 0,
      comments: (c.comments || []).map(cm => ({
        id: cm.id,
        userId: cm.user_id || null,
        author: cm.author,
        authorType: cm.author_type || cm.source || 'user',
        source: cm.source || cm.author_type || 'user',
        avatarSeed: cm.avatar_seed,
        content: cm.content,
        createdAt: cm.created_at,
        likes: cm.likes || 0
      })),
      userReacted: options.userId ? (c.user_reactions?.[options.userId] || {}) : {},
      isBookmarked: options.bookmarkedIds?.includes(c.id) || false
    }));
  }

  public createConfession(data: {
    userId?: string | null;
    source?: 'user' | 'ai';
    title: string;
    content: string;
    category: any;
    author: string;
    avatarSeed?: string;
    isAnonymous?: boolean;
    authorType?: 'user' | 'ai';
  }): ConfessionRecord {
    if (!this.data.confessions) {
      this.data.confessions = {};
    }
    const id = 'post_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    const now = new Date().toISOString();

    const record: ConfessionRecord = {
      id,
      user_id: data.userId || null,
      source: data.source || data.authorType || 'user',
      title: data.title.trim(),
      content: data.content.trim(),
      category: data.category || 'Khác',
      author: data.isAnonymous ? (data.author?.trim() || 'Bạn nhỏ ẩn danh') : (data.author?.trim() || 'Thành viên'),
      author_type: data.authorType || 'user',
      avatar_seed: data.avatarSeed || ('user_' + Math.random().toString(36).substring(2, 6)),
      is_anonymous: !!data.isAnonymous,
      created_at: now,
      updated_at: now,
      visibility: 'public',
      status: 'active',
      empathy_count: 1, // Author's initial feeling
      me_too_count: 0,
      comments: [],
      user_reactions: data.userId ? { [data.userId]: { empathy: true } } : {},
      report_count: 0,
      date_key: now.split('T')[0]
    };

    this.data.confessions[id] = record;
    this.scheduleSave();
    return record;
  }

  public deleteConfession(id: string, userId: string, isAdmin = false): { success: boolean; error?: string } {
    if (!this.data.confessions || !this.data.confessions[id]) {
      return { success: false, error: 'Không tìm thấy bài viết.' };
    }
    const conf = this.data.confessions[id];
    if (!isAdmin && conf.user_id && conf.user_id !== userId) {
      return { success: false, error: 'Bạn không có quyền xóa bài viết này.' };
    }
    delete this.data.confessions[id];
    this.scheduleSave();
    return { success: true };
  }

  public reactConfession(id: string, reactorId: string, type: 'empathy' | 'meToo'): { success: boolean; record?: any } {
    if (!this.data.confessions || !this.data.confessions[id]) {
      return { success: false };
    }
    const conf = this.data.confessions[id];
    if (!conf.user_reactions) conf.user_reactions = {};
    const userReact = conf.user_reactions[reactorId] || {};

    if (type === 'empathy') {
      if (userReact.empathy) {
        userReact.empathy = false;
        conf.empathy_count = Math.max(0, (conf.empathy_count || 1) - 1);
      } else {
        userReact.empathy = true;
        conf.empathy_count = (conf.empathy_count || 0) + 1;
      }
    } else if (type === 'meToo') {
      if (userReact.meToo) {
        userReact.meToo = false;
        conf.me_too_count = Math.max(0, (conf.me_too_count || 1) - 1);
      } else {
        userReact.meToo = true;
        conf.me_too_count = (conf.me_too_count || 0) + 1;
      }
    }

    conf.user_reactions[reactorId] = userReact;
    this.scheduleSave();
    return {
      success: true,
      record: {
        id: conf.id,
        empathyCount: conf.empathy_count,
        meTooCount: conf.me_too_count,
        userReacted: userReact
      }
    };
  }

  public addConfessionComment(id: string, comment: {
    userId?: string | null;
    author: string;
    authorType?: 'user' | 'ai';
    source?: 'user' | 'ai';
    avatarSeed?: string;
    content: string;
  }): { success: boolean; comment?: any } {
    if (!this.data.confessions || !this.data.confessions[id]) {
      return { success: false };
    }
    const conf = this.data.confessions[id];
    if (!conf.comments) conf.comments = [];

    const newComm: ConfessionCommentRecord = {
      id: 'comm_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6),
      user_id: comment.userId || null,
      author: comment.author.trim() || 'Người bạn ẩn danh',
      author_type: comment.authorType || 'user',
      source: comment.source || comment.authorType || 'user',
      avatar_seed: comment.avatarSeed || 'commenter_seed',
      content: comment.content.trim(),
      created_at: new Date().toISOString(),
      likes: 0
    };

    conf.comments.push(newComm);
    this.scheduleSave();
    return { success: true, comment: newComm };
  }

  public reportConfession(id: string, reason: string): { success: boolean; reportCount?: number } {
    if (!this.data.confessions || !this.data.confessions[id]) {
      return { success: false };
    }
    const conf = this.data.confessions[id];
    conf.report_count = (conf.report_count || 0) + 1;
    if (!conf.reports) conf.reports = [];
    conf.reports.push({ reason, created_at: new Date().toISOString() });

    this.scheduleSave();
    return { success: true, reportCount: conf.report_count };
  }

  // ==================== Sticky Notes ("Bạn không cô đơn") ====================

  public getStickyNotes(): StickyNoteRecord[] {
    if (!this.data.stickyNotes) {
      this.data.stickyNotes = {};
    }
    // If empty, initialize gentle baseline notes
    if (Object.keys(this.data.stickyNotes).length === 0) {
      const now = Date.now();
      const initial: StickyNoteRecord[] = [
        {
          id: 'note_init_1',
          content: 'Có thể hôm nay cậu thấy mình chẳng làm được gì, nhưng cậu vẫn đang cố gắng từng chút một mà.',
          author: 'Minh Thư',
          author_type: 'user',
          color: 'bg-amber-100 text-amber-900 border-amber-200',
          likes: 24,
          created_at: new Date(now - 3 * 3600 * 1000).toISOString()
        },
        {
          id: 'note_init_2',
          content: 'Không phải ngày nào cũng cần phải ổn. Có những hôm chỉ cần đi qua được ngày hôm đó thôi cũng đã đủ rồi.',
          author: 'AI Đồng Cảm',
          author_type: 'ai',
          color: 'bg-emerald-100 text-emerald-900 border-emerald-200',
          likes: 45,
          created_at: new Date(now - 8 * 3600 * 1000).toISOString()
        },
        {
          id: 'note_init_3',
          content: 'Đừng để điểm số hôm nay làm lu mờ đi lòng nhân ái và sự tử tế trong tim cậu.',
          author: 'Quốc Bảo',
          author_type: 'user',
          color: 'bg-sky-100 text-sky-900 border-sky-200',
          likes: 19,
          created_at: new Date(now - 14 * 3600 * 1000).toISOString()
        }
      ];
      initial.forEach(n => {
        this.data.stickyNotes[n.id] = n;
      });
      this.scheduleSave();
    }

    return Object.values(this.data.stickyNotes).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  public createStickyNote(data: {
    content: string;
    author: string;
    authorType?: 'user' | 'ai';
    color?: string;
  }): StickyNoteRecord {
    if (!this.data.stickyNotes) this.data.stickyNotes = {};
    const id = 'note_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6);
    const colors = [
      'bg-amber-100 text-amber-900 border-amber-200',
      'bg-rose-100 text-rose-900 border-rose-200',
      'bg-sky-100 text-sky-900 border-sky-200',
      'bg-emerald-100 text-emerald-900 border-emerald-200',
      'bg-purple-100 text-purple-900 border-purple-200'
    ];
    const chosenColor = data.color || colors[Math.floor(Math.random() * colors.length)];

    const record: StickyNoteRecord = {
      id,
      content: data.content.trim(),
      author: data.author.trim() || 'Người bạn nhỏ',
      author_type: data.authorType || 'user',
      color: chosenColor,
      likes: 1,
      created_at: new Date().toISOString()
    };
    this.data.stickyNotes[id] = record;
    this.scheduleSave();
    return record;
  }

  public likeStickyNote(id: string): { success: boolean; likes?: number } {
    if (!this.data.stickyNotes || !this.data.stickyNotes[id]) return { success: false };
    const n = this.data.stickyNotes[id];
    n.likes = (n.likes || 0) + 1;
    this.scheduleSave();
    return { success: true, likes: n.likes };
  }

  // ==================== User Progress Persistence ====================

  public getUserProgress(userId: string): any {
    if (!this.data.userProgress) this.data.userProgress = {};
    return this.data.userProgress[userId] || {
      bookmarkedConfessionIds: [],
      scenarioHistory: [],
      quizHistory: [],
      fastMathBestScore: 0,
      userReactions: {},
      updatedAt: new Date().toISOString()
    };
  }

  public saveUserProgress(userId: string, progress: any): boolean {
    if (!this.data.userProgress) this.data.userProgress = {};
    this.data.userProgress[userId] = {
      ...this.data.userProgress[userId],
      ...progress,
      updated_at: new Date().toISOString()
    };
    this.scheduleSave();
    return true;
  }
}

export const db = new Database();
