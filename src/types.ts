export type NavigationTab = 
  | 'chatbot'
  | 'home'
  | 'plant'
  | 'journal'
  | 'friends'
  | 'confessions'
  | 'scenarios'
  | 'quizzes'
  | 'parents'
  | 'school'
  | 'help'
  | 'stories';

export type JournalTheme = 'cute' | 'night' | 'minimal' | 'paper' | 'gentle';

export interface JournalMoodItem {
  emoji: string;
  label: string;
  color: string;
}

export interface JournalMessageItem {
  id: string;
  time: string; // "10:32"
  text: string;
}

export interface JournalEntry {
  id: string;
  date: string; // 'YYYY-MM-DD'
  createdAt: string;
  updatedAt: string;
  title?: string;
  content: string;
  messages?: JournalMessageItem[];
  mood?: string;
  moodLabel?: string;
  tags: string[];
  stickers?: string[];
  theme?: JournalTheme;
  readLaterDate?: string; // 'YYYY-MM-DD'
  readLaterUnlocked?: boolean;
  reflectionNote?: string;
  reflectionDate?: string;
  isFavorite?: boolean;
}

export interface JournalDraft {
  content: string;
  messages?: JournalMessageItem[];
  title?: string;
  mood?: string;
  moodLabel?: string;
  tags?: string[];
  stickers?: string[];
  theme?: JournalTheme;
  readLaterDate?: string;
  reflectionNote?: string;
  isFavorite?: boolean;
  updatedAt: string;
}

export interface TimeCapsule {
  id: string;
  createdAt: string;
  unlockDate: string; // 'YYYY-MM-DD'
  title: string;
  content: string;
  mood?: string;
  isOpened: boolean;
  openedAt?: string;
}

export type SupportMode = 
  | 'general' 
  | 'listen' 
  | 'advice'
  | 'best_friend' 
  | 'solve' 
  | 'reflect' 
  | 'cheer' 
  | 'study';

export type BotMascotMood = 'happy' | 'empathy' | 'thinking' | 'idea' | 'cheer';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  supportMode?: SupportMode;
  isHelpful?: boolean;
  topic?: string;
  suggestModes?: boolean;
}

export interface ChatTopicItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  starterPrompt: string;
  subtopics: string[];
}

export type MoodType = 
  | 'happy' 
  | 'fine' 
  | 'neutral' 
  | 'sad' 
  | 'stressed' 
  | 'angry' 
  | 'anxious' 
  | 'lonely';

export interface MoodOption {
  id: MoodType;
  emoji: string;
  label: string;
  color: string;
  response: string;
  suggestion: string;
}

export interface Comment {
  id: string;
  author: string;
  avatarSeed: string;
  content: string;
  timestamp: string;
  likes: number;
}

export interface Confession {
  id: string;
  title: string;
  content: string;
  category: 'Gia đình' | 'Học tập' | 'Tình bạn' | 'Bản thân' | 'Trường học' | 'Tình cảm' | 'Khác';
  author: string;
  avatarSeed: string;
  isAnonymous: boolean;
  timestamp: string;
  empathyCount: number; // ❤️ Đồng cảm
  meTooCount: number;   // 🫂 Mình cũng từng như vậy
  comments: Comment[];
  userReacted?: {
    empathy?: boolean;
    meToo?: boolean;
  };
}

export interface ScenarioOption {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
  analysis: string;
  pros: string;
  cons: string;
  takeaway: string;
}

export interface Scenario {
  id: string;
  category: string;
  title: string;
  description: string;
  options: ScenarioOption[];
  generalAdvice: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: {
    label: string;
    score: number;
  }[];
}

export interface QuizResultLevel {
  level: 'low' | 'medium' | 'high' | 'very-high';
  title: string;
  badgeColor: string;
  summary: string;
  actionAdvice: string[];
}

export interface Quiz {
  id: string;
  title: string;
  icon: string;
  description: string;
  disclaimer: string;
  questions: QuizQuestion[];
  results: {
    low: QuizResultLevel;
    medium: QuizResultLevel;
    high: QuizResultLevel;
    veryHigh: QuizResultLevel;
  };
}

export interface ParentTalkTopic {
  id: string;
  title: string;
  situation: string;
  starterScript: string;
  alternativeTextMsg: string;
  dos: string[];
  donts: string[];
  whyParentsReactThisWay: string;
}

export interface SchoolIssueTopic {
  id: string;
  title: string;
  icon: string;
  color: string;
  summary: string;
  signs: string[];
  safeActions: string[];
  whenToSeekAdults: string;
  whoToTurnTo: string[];
}

export interface StickyNote {
  id: string;
  content: string;
  author: string;
  color: string;
  likes: number;
  timestamp: string;
}

export interface AuthUser {
  id: string;
  nickname: string;
  avatar: string;
  friend_id: string;
  created_at: string;
  friendCount?: number;
}

export interface FriendUser {
  id: string;
  nickname: string;
  avatar: string;
  friend_id: string;
  is_online: boolean;
  since: string;
}

export interface FriendRequestItem {
  id: string;
  sender_id?: string;
  receiver_id?: string;
  nickname: string;
  avatar: string;
  friend_id: string;
  created_at: string;
}

export interface BlockedUser {
  id: string;
  nickname: string;
  friend_id: string;
  avatar: string;
}

export type SeedGrowthEffect = 'flower' | 'leaf' | 'branch' | 'root' | 'fruit' | 'firefly' | 'sprout';

export interface EmotionSeedItem {
  id: string;
  createdAt: string; // ISO string
  drawingDataUrl: string; // Base64 data url of the circular drawing
  growthEffect: SeedGrowthEffect; // Type of change contributed to the plant
  stageAtSowing: number; // 1 to 5
  note?: string; // Optional user note if any
}

export type EncouragementEffect = 'flower' | 'leaf' | 'sun' | 'dew' | 'fruit';

export interface PlantCareMessage {
  id: string;
  plantOwnerUserId: string;
  senderUserId: string;
  senderNickname: string;
  senderAvatar: string;
  senderFriendId: string;
  message: string;
  visualEffect: EncouragementEffect;
  createdAt: string;
  readAt?: string | null;
}

export interface PlantPermissions {
  allowFriendsToCare: boolean;
  allowEncouragementMessages: boolean;
}

export interface FriendPlantData {
  ownerNickname: string;
  ownerAvatar: string;
  ownerFriendId: string;
  stage: number;
  seedCount: number;
  messages: PlantCareMessage[];
  permissions: PlantPermissions;
  isAllowed: boolean;
  reason?: string;
}
