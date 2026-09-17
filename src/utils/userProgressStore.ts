/**
 * User Progress & Account Persistence Store
 * Satisfies Requirements 10, 11, 12, 13:
 * - Persists scenario history, quiz history, bookmarks, game scores per account
 * - Strict Account Isolation: User A's data never leaks to User B
 * - Full Guest Migration: seamlessly ports all guest artifacts to registered account
 */

export interface ScenarioHistoryRecord {
  id?: string;
  questionId?: string;
  scenarioId: string;
  category: string;
  question?: string;
  chosenOption: 'A' | 'B' | 'C' | 'D' | 'E';
  chosenOptionId?: 'A' | 'B' | 'C' | 'D' | 'E';
  chosenOptionText?: string;
  helpAnalysis?: string;
  watchOut?: string;
  tryNext?: string;
  date?: string; // YYYY-MM-DD
  completedAt: string; // ISO timestamp
  source?: string;
  setId?: string;
}

export interface QuizHistoryRecord {
  id: string;
  quizId: string;
  quizTitle: string;
  setId?: string;
  score: number;
  maxScore: number;
  resultLevel: string;
  level?: string;
  resultTitle: string;
  advice?: string[];
  completedAt: string; // ISO timestamp
}

export interface UserProgressData {
  bookmarkedConfessionIds: string[];
  scenarioHistory: ScenarioHistoryRecord[];
  quizHistory: QuizHistoryRecord[];
  fastMathBestScore: number;
  userReactions: Record<string, { empathy?: boolean; meToo?: boolean }>;
  updatedAt: string;
}

const DEFAULT_PROGRESS: UserProgressData = {
  bookmarkedConfessionIds: [],
  scenarioHistory: [],
  quizHistory: [],
  fastMathBestScore: 0,
  userReactions: {},
  updatedAt: new Date().toISOString()
};

function getProgressKey(userId?: string): string {
  return userId ? `teen_user_progress_${userId}` : 'teen_guest_progress';
}

export function recordQuizResult(
  userId: string | undefined,
  record: {
    quizId: string;
    quizTitle: string;
    setId?: string;
    score: number;
    maxScore: number;
    resultLevel: string;
    resultTitle: string;
    advice?: string[];
  }
): void {
  const current = getUserProgress(userId);
  const newRecord: QuizHistoryRecord = {
    id: `qhist_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    ...record,
    level: record.resultLevel,
    completedAt: new Date().toISOString()
  };

  saveUserProgress(userId, {
    quizHistory: [newRecord, ...(current.quizHistory || [])]
  });
}

export function recordScenarioResult(
  userId: string | undefined,
  record: {
    questionId: string;
    scenarioId: string;
    category: string;
    question: string;
    chosenOptionId: 'A' | 'B' | 'C' | 'D' | 'E';
    chosenOptionText: string;
    helpAnalysis: string;
    watchOut: string;
    tryNext: string;
    date: string;
    source?: string;
  }
): void {
  const current = getUserProgress(userId);
  const newRecord: ScenarioHistoryRecord = {
    id: `scenhist_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    questionId: record.questionId,
    scenarioId: record.scenarioId,
    category: record.category,
    question: record.question,
    chosenOption: record.chosenOptionId,
    chosenOptionId: record.chosenOptionId,
    chosenOptionText: record.chosenOptionText,
    helpAnalysis: record.helpAnalysis,
    watchOut: record.watchOut,
    tryNext: record.tryNext,
    date: record.date,
    source: record.source || 'question_bank',
    completedAt: new Date().toISOString()
  };

  // Filter out older duplicate answers for the exact same question on this same day
  const existingFiltered = (current.scenarioHistory || []).filter(
    (item) => !(item.questionId === record.questionId && item.date === record.date)
  );

  saveUserProgress(userId, {
    scenarioHistory: [newRecord, ...existingFiltered]
  });
}

export function toggleConfessionBookmark(userId: string | undefined, confessionId: string): boolean {
  const current = getUserProgress(userId);
  const exists = current.bookmarkedConfessionIds.includes(confessionId);
  const updated = exists
    ? current.bookmarkedConfessionIds.filter(id => id !== confessionId)
    : [...current.bookmarkedConfessionIds, confessionId];
  
  saveUserProgress(userId, {
    bookmarkedConfessionIds: updated
  });
  return !exists;
}

export function getUserProgress(userId?: string): UserProgressData {
  if (!userId || userId === 'guest') {
    return { ...DEFAULT_PROGRESS };
  }
  try {
    const raw = localStorage.getItem(getProgressKey(userId));
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_PROGRESS,
        ...parsed
      };
    }
  } catch (e) {
    console.warn('Failed reading user progress:', e);
  }
  return { ...DEFAULT_PROGRESS };
}

export function saveUserProgress(userId: string | undefined, data: Partial<UserProgressData>): UserProgressData {
  // STRICT GUEST CHECK: Guest mode never writes to localStorage
  if (!userId || userId === 'guest') {
    return {
      ...DEFAULT_PROGRESS,
      ...data,
      updatedAt: new Date().toISOString()
    };
  }

  const current = getUserProgress(userId);
  const updated: UserProgressData = {
    ...current,
    ...data,
    updatedAt: new Date().toISOString()
  };

  try {
    localStorage.setItem(getProgressKey(userId), JSON.stringify(updated));
    // Dispatch event so other components on page re-sync
    window.dispatchEvent(new CustomEvent('teen_progress_updated', { detail: { userId } }));
  } catch (e) {
    console.warn('Failed saving user progress:', e);
  }

  // If user is logged in, asynchronously sync with server
  if (userId) {
    syncUserProgressWithServer(userId, updated).catch(() => {});
  }

  return updated;
}

export async function syncUserProgressWithServer(userId: string, data: UserProgressData): Promise<boolean> {
  const token = localStorage.getItem('teen_mind_auth_token') || sessionStorage.getItem('teen_mind_auth_token');
  if (!token) return false;

  try {
    const res = await fetch('/api/user/progress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchServerUserProgress(userId: string, tokenParam?: string): Promise<UserProgressData | null> {
  const token = tokenParam || localStorage.getItem('teen_mind_auth_token') || sessionStorage.getItem('teen_mind_auth_token');
  if (!token) return null;

  try {
    const res = await fetch('/api/user/progress', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data === 'object') {
        const merged: UserProgressData = {
          ...DEFAULT_PROGRESS,
          ...data
        };
        localStorage.setItem(getProgressKey(userId), JSON.stringify(merged));
        window.dispatchEvent(new CustomEvent('teen_progress_updated', { detail: { userId } }));
        return merged;
      }
    }
  } catch {}
  return null;
}

export const syncUserProgressFromServer = fetchServerUserProgress;

/**
 * Full Migration: Moves all guest artifacts to registered user account
 */
export async function migrateAllGuestDataToUser(userId: string, tokenParam?: string): Promise<{
  success: boolean;
  migratedJournals: number;
  migratedSeeds: number;
  migratedQuizHistory: number;
}> {
  let migratedJournals = 0;
  let migratedSeeds = 0;
  let migratedQuizHistory = 0;

  try {
    // 1. Migrate Journal
    const guestJournalKey = 'teen_journal_entries';
    const guestCapsuleKey = 'teen_journal_capsules';
    const userJournalKey = `teen_journal_${userId}_entries`;
    const userCapsuleKey = `teen_journal_${userId}_capsules`;

    const rawGuestEntries = localStorage.getItem(guestJournalKey);
    const rawGuestCapsules = localStorage.getItem(guestCapsuleKey);
    let guestEntries: any[] = [];
    let guestCapsules: any[] = [];

    if (rawGuestEntries) {
      try {
        guestEntries = JSON.parse(rawGuestEntries);
      } catch {}
    }
    if (rawGuestCapsules) {
      try {
        guestCapsules = JSON.parse(rawGuestCapsules);
      } catch {}
    }

    if (guestEntries.length > 0 || guestCapsules.length > 0) {
      let userEntries: any[] = [];
      let userCapsules: any[] = [];
      try {
        const uE = localStorage.getItem(userJournalKey);
        if (uE) userEntries = JSON.parse(uE);
        const uC = localStorage.getItem(userCapsuleKey);
        if (uC) userCapsules = JSON.parse(uC);
      } catch {}

      // Merge avoiding duplicates
      const existingEntryIds = new Set(userEntries.map(e => e.id));
      const newEntries = guestEntries.filter(e => !existingEntryIds.has(e.id));
      const mergedEntries = [...userEntries, ...newEntries];
      migratedJournals = newEntries.length;

      const existingCapsuleIds = new Set(userCapsules.map(c => c.id));
      const newCapsules = guestCapsules.filter(c => !existingCapsuleIds.has(c.id));
      const mergedCapsules = [...userCapsules, ...newCapsules];

      localStorage.setItem(userJournalKey, JSON.stringify(mergedEntries));
      localStorage.setItem(userCapsuleKey, JSON.stringify(mergedCapsules));

      // Sync to server
      const token = localStorage.getItem('teen_mind_auth_token') || sessionStorage.getItem('teen_mind_auth_token');
      if (token) {
        await fetch('/api/journal/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ entries: mergedEntries, capsules: mergedCapsules })
        }).catch(() => {});
      }
    }

    // 2. Migrate Plant
    const guestPlantKey = 'teen_emotion_plant_full_guest';
    const userPlantKey = `teen_emotion_plant_full_${userId}`;
    const rawGuestPlant = localStorage.getItem(guestPlantKey);
    if (rawGuestPlant) {
      try {
        const guestPlant = JSON.parse(rawGuestPlant);
        localStorage.setItem(userPlantKey, JSON.stringify(guestPlant));
        migratedSeeds = Array.isArray(guestPlant.seeds) ? guestPlant.seeds.length : 0;

        const token = localStorage.getItem('teen_mind_auth_token') || sessionStorage.getItem('teen_mind_auth_token');
        if (token) {
          await fetch('/api/emotion-plant/sync', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(guestPlant)
          }).catch(() => {});
        }
      } catch {}
    }

    // 3. Migrate Progress (Quizzes, Scenarios, Bookmarks, Game score)
    const guestProgress = getUserProgress(undefined);
    const userProgress = getUserProgress(userId);

    const mergedProgress: UserProgressData = {
      bookmarkedConfessionIds: Array.from(new Set([...userProgress.bookmarkedConfessionIds, ...guestProgress.bookmarkedConfessionIds])),
      scenarioHistory: [...userProgress.scenarioHistory, ...guestProgress.scenarioHistory],
      quizHistory: [...userProgress.quizHistory, ...guestProgress.quizHistory],
      fastMathBestScore: Math.max(userProgress.fastMathBestScore || 0, guestProgress.fastMathBestScore || 0),
      userReactions: { ...userProgress.userReactions, ...guestProgress.userReactions },
      updatedAt: new Date().toISOString()
    };
    migratedQuizHistory = guestProgress.quizHistory.length;

    saveUserProgress(userId, mergedProgress);

    // 4. Clean up guest keys
    localStorage.removeItem(guestJournalKey);
    localStorage.removeItem(guestCapsuleKey);
    localStorage.removeItem(guestPlantKey);
    localStorage.removeItem(getProgressKey(undefined));

    // Migrate & clean up guest daily scenario assignments
    const guestDailyKeys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('teen_daily_scen_guest_')) {
        guestDailyKeys.push(key);
      }
    }
    guestDailyKeys.forEach(k => {
      const val = localStorage.getItem(k);
      if (val) {
        const userKey = k.replace('teen_daily_scen_guest_', `teen_daily_scen_${userId}_`);
        localStorage.setItem(userKey, val);
      }
      localStorage.removeItem(k);
    });

    window.dispatchEvent(new CustomEvent('teen_account_changed'));
    return {
      success: true,
      migratedJournals,
      migratedSeeds,
      migratedQuizHistory
    };
  } catch (err) {
    console.error('Error during guest data migration:', err);
    return {
      success: false,
      migratedJournals: 0,
      migratedSeeds: 0,
      migratedQuizHistory: 0
    };
  }
}

/**
 * Clears active session state on logout
 */
export function clearCurrentSessionState(): void {
  // Dispatch event so all views immediately reset their memory state to guest/blank
  window.dispatchEvent(new CustomEvent('teen_account_changed', { detail: { type: 'logout' } }));
}

/**
 * Purges all transient guest keys from localStorage to ensure Guest Mode never leaks
 * or persists after page refresh (F5) or browser exit.
 */
export function clearAllGuestLocalStorage(): void {
  try {
    const guestKeys = [
      'teen_journal_entries',
      'teen_journal_capsules',
      'teen_journal_pin',
      'teen_journal_drafts',
      'teen_journal_entries_v1',
      'teen_journal_draft_v1',
      'self_letters_list_guest',
      'self_letter_draft_guest',
      'teen_plant_guest_full_state',
      'teen_plant_guest_seeds',
      'teen_guest_progress',
      'teen_user_progress_guest',
      'teen_mood_history_guest'
    ];
    guestKeys.forEach(k => {
      try {
        localStorage.removeItem(k);
      } catch {}
    });

    // Remove any guest letters from master backup
    const backupRaw = localStorage.getItem('self_letters_master_backup');
    if (backupRaw) {
      try {
        const parsed = JSON.parse(backupRaw);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.filter((l: any) => l.sender_id && l.sender_id !== 'guest');
          localStorage.setItem('self_letters_master_backup', JSON.stringify(cleaned));
        }
      } catch {}
    }

    // Dynamic clean for any remaining guest keys
    const toRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (
        key &&
        (key.startsWith('teen_daily_scen_guest_') ||
         key.includes('_guest_') ||
         key.endsWith('_guest'))
      ) {
        toRemove.push(key);
      }
    }
    toRemove.forEach(k => {
      try {
        localStorage.removeItem(k);
      } catch {}
    });
  } catch (e) {
    console.warn('Failed to clear guest localStorage:', e);
  }
}
