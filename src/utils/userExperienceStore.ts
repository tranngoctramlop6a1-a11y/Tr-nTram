// User Experience Memory & Anti-Repetition Store for "Bạn ơi, mình nói nè"
// Strictly client-side (localStorage), zero personal identifying data (no names, phones, etc.)

export interface GentleBadge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earnedAt?: string;
  isUnlocked: boolean;
}

export interface UserExperienceData {
  recentGreetingIds: string[];
  recentQuestionIds: string[];
  recentMessageIds: string[];
  recentActivityIds: string[];
  completedTaskIds: string[];
  lastVisitDate: string; // YYYY-MM-DD
  visitCountRecent: number;
  daysSinceLastVisit: number;
  lastDiscussedTopic?: {
    topic: string;
    summary: string;
    date: string;
  };
  earnedBadges: Record<string, boolean>;
  totalActivitiesCompleted: number;
  last30sCheckinDate?: string;
}

const STORAGE_KEY = 'teen_experience_memory_v1';

export const INITIAL_BADGES: GentleBadge[] = [
  {
    id: 'badge_first_visit',
    name: 'Lần đầu ghé chơi',
    icon: '🌱',
    description: 'Đã ghé thăm góc nhỏ an toàn "Bạn ơi, mình nói nè"',
    isUnlocked: false
  },
  {
    id: 'badge_storyteller',
    name: 'Người kể chuyện',
    icon: '💬',
    description: 'Đã cởi mở chia sẻ hoặc tâm sự cùng chatbot',
    isUnlocked: false
  },
  {
    id: 'badge_survivor',
    name: 'Vẫn sống sót qua tuần học',
    icon: '😂',
    description: 'Đã kiên cường vượt qua những áp lực học đường',
    isUnlocked: false
  },
  {
    id: 'badge_reflection',
    name: 'Biết nhìn lại',
    icon: '🪞',
    description: 'Đã dừng lại suy ngẫm một chút về bản thân hôm nay',
    isUnlocked: false
  },
  {
    id: 'badge_micro_action',
    name: 'Không bỏ cuộc',
    icon: '🎯',
    description: 'Đã hoàn thành một việc nhỏ tử tế cho chính mình',
    isUnlocked: false
  },
  {
    id: 'badge_brain_spark',
    name: 'Não hoạt động rồi',
    icon: '💡',
    description: 'Đã thử thách góc nhìn với một câu hỏi thú vị',
    isUnlocked: false
  },
  {
    id: 'badge_caring',
    name: 'Người biết quan tâm',
    icon: '🫂',
    description: 'Đã dành thời gian chăm sóc cảm xúc của bản thân',
    isUnlocked: false
  }
];

export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

export function getUserExperienceData(): UserExperienceData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Update visit count & days since last visit
      const today = getTodayDateString();
      if (parsed.lastVisitDate !== today) {
        const last = new Date(parsed.lastVisitDate || today);
        const now = new Date(today);
        const diffDays = Math.max(0, Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24)));
        
        parsed.daysSinceLastVisit = diffDays;
        parsed.lastVisitDate = today;
        parsed.visitCountRecent = (parsed.visitCountRecent || 0) + 1;
        // Auto unlock first visit
        if (!parsed.earnedBadges) parsed.earnedBadges = {};
        parsed.earnedBadges['badge_first_visit'] = true;
        saveUserExperienceData(parsed);
      }
      return parsed;
    }
  } catch (err) {
    console.warn('Error reading experience data:', err);
  }

  // Initial fresh user
  const initialData: UserExperienceData = {
    recentGreetingIds: [],
    recentQuestionIds: [],
    recentMessageIds: [],
    recentActivityIds: [],
    completedTaskIds: [],
    lastVisitDate: getTodayDateString(),
    visitCountRecent: 1,
    daysSinceLastVisit: 0,
    earnedBadges: {
      badge_first_visit: true
    },
    totalActivitiesCompleted: 0
  };
  saveUserExperienceData(initialData);
  return initialData;
}

export function saveUserExperienceData(data: UserExperienceData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn('Error saving experience data:', err);
  }
}

// Unlock a gentle badge
export function unlockBadge(badgeId: string): boolean {
  const data = getUserExperienceData();
  if (!data.earnedBadges) data.earnedBadges = {};
  if (!data.earnedBadges[badgeId]) {
    data.earnedBadges[badgeId] = true;
    saveUserExperienceData(data);
    return true; // newly unlocked
  }
  return false;
}

// Mark a micro task as completed
export function completeMicroTask(taskId: string): void {
  const data = getUserExperienceData();
  if (!data.completedTaskIds.includes(taskId)) {
    data.completedTaskIds = [...data.completedTaskIds, taskId];
    data.totalActivitiesCompleted = (data.totalActivitiesCompleted || 0) + 1;
    unlockBadge('badge_micro_action');
    saveUserExperienceData(data);
  }
}

// Register seen greeting
export function recordGreetingSeen(greetingId: string): void {
  const data = getUserExperienceData();
  const filtered = data.recentGreetingIds.filter(id => id !== greetingId);
  data.recentGreetingIds = [...filtered, greetingId].slice(-6);
  saveUserExperienceData(data);
}

// Register seen question / card
export function recordQuestionSeen(questionId: string): void {
  const data = getUserExperienceData();
  const filtered = data.recentQuestionIds.filter(id => id !== questionId);
  data.recentQuestionIds = [...filtered, questionId].slice(-8);
  saveUserExperienceData(data);
}

// Save topic for story continuity
export function recordDiscussedTopic(topic: string, summary: string): void {
  const data = getUserExperienceData();
  data.lastDiscussedTopic = {
    topic,
    summary,
    date: getTodayDateString()
  };
  unlockBadge('badge_storyteller');
  saveUserExperienceData(data);
}

// Generate gentle non-invasive insights (No medical diagnosis)
export function getGentleInsights(data: UserExperienceData): string[] {
  const insights: string[] = [];
  
  if (data.totalActivitiesCompleted >= 3) {
    insights.push('Bạn đã hoàn thành một vài thói quen nhỏ tích cực gần đây 🌱');
  }

  if (data.visitCountRecent >= 3) {
    insights.push('Bạn đã ghé thăm không gian này được vài lần. Cảm ơn bạn vì đã dành thời gian cho bản thân!');
  }

  if (data.lastDiscussedTopic) {
    insights.push(`Lần trước bạn có nhắc tới chuyện "${data.lastDiscussedTopic.topic}". Hôm nay mọi thứ đã nhẹ nhàng hơn chưa?`);
  }

  if (insights.length === 0) {
    insights.push('Mỗi lần bạn ghé qua đây đều là một khoảnh khắc bạn lắng nghe chính mình.');
  }

  return insights;
}

// Clear all user data cleanly
export function clearAllUserData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('ban_oi_minh_noi_ne_chat_history');
    localStorage.removeItem('teen_chatbot_anti_rep_memory');
    localStorage.removeItem('teen_journal_entries_v1');
    localStorage.removeItem('teen_journal_draft_v1');
  } catch (err) {
    console.warn('Error clearing data:', err);
  }
}
