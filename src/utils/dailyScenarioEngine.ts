import { DailyScenarioQuestion } from '../types';
import {
  getQuestionsForCategory,
  getQuestionById,
  SCENARIO_CATEGORIES,
  ScenarioCategoryMeta
} from '../data/scenarioQuestionBank';
import { getUserProgress } from './userProgressStore';

export interface DailyScenarioAssignment {
  questionId: string;
  scenarioId: string;
  date: string; // YYYY-MM-DD
  assignedAt: string;
  source: string;
}

/**
 * Returns YYYY-MM-DD in local timezone (Vietnam GMT+7)
 */
export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Friendly display format (e.g., "16/09/2026")
 */
export function formatDisplayDate(dateStr: string): string {
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

/**
 * Deterministic hash function for pseudo-random seeded selection
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getStorageKey(userId: string | undefined, scenarioId: string, dateStr: string): string {
  const userSegment = userId ? `user_${userId}` : 'guest';
  return `teen_daily_scen_${userSegment}_${scenarioId}_${dateStr}`;
}

/**
 * Retrieves the stable daily question for a category, user, and date.
 * Guarantees:
 * - Reload in same day => EXACT same question
 * - Reopen in same day => EXACT same question
 * - Next day => New question
 * - Anti-repeat based on user history
 */
export function getDailyQuestionForScenario(
  scenarioId: string,
  userId: string | undefined,
  dateStr: string = getTodayDateString()
): DailyScenarioQuestion | null {
  const pool = getQuestionsForCategory(scenarioId);
  if (!pool || pool.length === 0) {
    return null;
  }

  // 1. Check if an assignment was already stored for today
  const cacheKey = getStorageKey(userId, scenarioId, dateStr);
  try {
    const cachedRaw = localStorage.getItem(cacheKey);
    if (cachedRaw) {
      const cachedData: DailyScenarioAssignment = JSON.parse(cachedRaw);
      if (cachedData && cachedData.questionId) {
        const question = getQuestionById(cachedData.questionId);
        if (question && question.scenarioId === scenarioId && question.active) {
          return question;
        }
      }
    }
  } catch (err) {
    console.warn('Error reading cached daily scenario assignment:', err);
  }

  // 2. Not assigned yet -> Deterministic selection using History + Date + User seed
  const userProgress = getUserProgress(userId);
  const scenarioHistory = userProgress.scenarioHistory || [];
  
  // Find questions the user has answered for this scenario
  const historyForCategory = scenarioHistory.filter(
    (item) => item.scenarioId === scenarioId && item.questionId
  );

  const answeredQuestionIds = new Set(historyForCategory.map((h) => h.questionId));

  // Tiers for anti-repetition:
  // Tier 1: Never answered
  const unassistedQuestions = pool.filter((q) => !answeredQuestionIds.has(q.id));

  let candidatePool: DailyScenarioQuestion[];

  if (unassistedQuestions.length > 0) {
    candidatePool = unassistedQuestions;
  } else {
    // Tier 2: Answered long ago (sort by oldest completion date)
    const completionMap = new Map<string, number>();
    for (const record of historyForCategory) {
      if (record.questionId) {
        const time = new Date(record.completedAt || record.date || 0).getTime();
        const existing = completionMap.get(record.questionId) || 0;
        if (time > existing) {
          completionMap.set(record.questionId, time);
        }
      }
    }

    const sortedByOldest = [...pool].sort((a, b) => {
      const timeA = completionMap.get(a.id) || 0;
      const timeB = completionMap.get(b.id) || 0;
      return timeA - timeB;
    });

    // Take the oldest half
    candidatePool = sortedByOldest.slice(0, Math.max(1, Math.floor(sortedByOldest.length / 2)));
  }

  // Seeded index calculation
  const seedString = `${dateStr}_${userId || 'guest'}_${scenarioId}_daily_seed_v2`;
  const seedNum = hashString(seedString);
  const selectedIndex = seedNum % candidatePool.length;
  const selectedQuestion = candidatePool[selectedIndex] || pool[0];

  // 3. Persist assignment so reloads/reopens within this day never change the question
  const assignment: DailyScenarioAssignment = {
    questionId: selectedQuestion.id,
    scenarioId,
    date: dateStr,
    assignedAt: new Date().toISOString(),
    source: selectedQuestion.source || 'question_bank'
  };

  try {
    localStorage.setItem(cacheKey, JSON.stringify(assignment));
  } catch (err) {
    console.warn('Error saving daily scenario assignment:', err);
  }

  return selectedQuestion;
}

/**
 * Check if the user has already answered the daily question for today in this category
 */
export function isDailyScenarioCompleted(
  scenarioId: string,
  userId: string | undefined,
  dateStr: string = getTodayDateString()
): { completed: boolean; answeredOptionId?: 'A' | 'B' | 'C' | 'D' | 'E'; completedAt?: string } {
  const userProgress = getUserProgress(userId);
  const history = userProgress.scenarioHistory || [];

  const found = history.find(
    (item) => item.scenarioId === scenarioId && item.date === dateStr
  );

  if (found) {
    return {
      completed: true,
      answeredOptionId: found.chosenOptionId || found.chosenOption,
      completedAt: found.completedAt
    };
  }

  return { completed: false };
}
