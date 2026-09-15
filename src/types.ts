export type NavigationTab = 
  | 'chatbot'
  | 'home'
  | 'letters'
  | 'plant'
  | 'journal'
  | 'confessions'
  | 'scenarios'
  | 'quizzes'
  | 'parents'
  | 'school'
  | 'help'
  | 'stories';

// Bức thư cho bản thân ("Letters to My Future Self")
export type PaperStyle = 
  | 'parchment' 
  | 'ivory' 
  | 'kraft' 
  | 'sage' 
  | 'indigo' 
  | 'rose' 
  | 'mint' 
  | 'warm_ivory'
  | 'cream'
  | 'butter'
  | 'peach'
  | 'sky'
  | 'lavender'
  | 'matcha'
  | 'coffee'
  | 'terracotta'
  | 'custom';
export type LetterFont = 'serif' | 'handwriting' | 'sans' | 'cursive' | 'patrick' | 'playfair' | 'charm';
export type LetterConditionType = 'always' | 'date' | 'mood' | 'code';

export interface SelfLetterRecord {
  id: string;
  sender_id?: string;
  sender_name: string;
  receiver_name?: string;
  title: string;              // Tiêu đề bức thư
  content: string;            // Nội dung tâm sự gửi chính mình
  paper_style: PaperStyle;    // Nền giấy: be giấy cũ, trắng ngà, nâu gỗ, xanh trầm, pastel...
  ink_color: string;          // Màu mực chữ (#292524, #78350f, #1e3a5f, #1e392a, #5c252d)
  font_family: LetterFont;    // Serif, handwriting, sans
  drawing_data?: string | null; // Nét vẽ tay / trang trí tự vẽ (canvas data URL PNG)
  open_date: string;          // Ngày hẹn mở thư (YYYY-MM-DD hoặc ISO string)
  wax_seal?: string;          // Phong cách con dấu sáp niêm phong
  is_opened: boolean;
  opened_at?: string | null;
  created_at: string;
  // Stickers & decorations
  stickers_data?: string;     // Danh sách sticker đã đính (JSON string)
  // Legacy compatibility fields
  seal_icon?: string;
  theme_color?: string;
  condition_type?: LetterConditionType;
  unlock_at?: string | null;
  share_key?: string;
}

export interface SelfLetterSummary {
  id: string;
  sender_name: string;
  receiver_name?: string;
  title: string;
  paper_style: PaperStyle;
  ink_color: string;
  font_family: LetterFont;
  open_date: string;
  wax_seal?: string;
  is_opened: boolean;
  opened_at?: string | null;
  created_at: string;
  is_locked: boolean;         // Chưa đến ngày hẹn mở
  lock_message?: string;      // Thông báo nhẹ nhàng khi bấm vào phong bì bị khóa
  days_remaining?: number;    // Số ngày còn lại
  has_drawing?: boolean;
  stickers_data?: string;
  // Legacy compatibility fields
  seal_icon?: string;
  theme_color?: string;
  condition_type?: LetterConditionType;
  unlock_at?: string | null;
  share_key?: string;
}

// Aliases for backwards compatibility
export type LetterRecord = SelfLetterRecord;
export type LetterSummary = SelfLetterSummary;

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

export interface JournalImageItem {
  id: string;
  url: string;
  caption?: string;
  createdAt: string;
}

export interface JournalEntry {
  id: string;
  userId?: string;
  date: string; // 'YYYY-MM-DD'
  createdAt: string;
  updatedAt: string;
  title?: string;
  content: string;
  messages?: JournalMessageItem[];
  images?: JournalImageItem[];
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
  images?: JournalImageItem[];
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
  authorType?: 'user' | 'ai';
  avatarSeed: string;
  content: string;
  timestamp?: string;
  createdAt?: string; // Real ISO timestamp
  likes: number;
}

export interface Confession {
  id: string;
  title: string;
  content: string;
  category: 'Gia đình' | 'Học tập' | 'Tình bạn' | 'Bản thân' | 'Trường học' | 'Tình cảm' | 'Khác';
  author: string;
  authorType?: 'user' | 'ai';
  avatarSeed: string;
  isAnonymous: boolean;
  timestamp?: string;
  createdAt?: string; // Real ISO timestamp
  updatedAt?: string;
  empathyCount: number; // ❤️ Đồng cảm
  meTooCount: number;   // 🫂 Mình cũng từng như vậy
  comments: Comment[];
  userReacted?: {
    empathy?: boolean;
    meToo?: boolean;
  };
  isBookmarked?: boolean;
  reportCount?: number;
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
  tendencyInsight?: string;
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
  id: string; // Stable UID
  email?: string;
  nickname: string;
  avatar: string;
  created_at: string;
  createdAt?: string;
}

export type SeedGrowthEffect = 'flower' | 'leaf' | 'branch' | 'root' | 'fruit' | 'firefly' | 'sprout';

export type PlantWeatherType = 
  | 'sunny' 
  | 'rainy' 
  | 'cloudy' 
  | 'gentle_sun' 
  | 'night' 
  | 'rainbow' 
  | 'starry_night';

export type PlantEmotionType = 
  | 'happy'       // 😊 Vui
  | 'fine'        // 🙂 Ổn
  | 'neutral'     // 😐 Bình thường
  | 'sad'         // 😔 Hơi buồn
  | 'stressed'    // 😣 Áp lực
  | 'anxious'     // 😰 Lo lắng
  | 'angry'       // 😡 Bực mình
  | 'lonely'      // 🥺 Cô đơn
  | 'unknown';    // 🤷 Không biết

export interface PlantEmotionOption {
  id: PlantEmotionType;
  emoji: string;
  label: string;
  weatherInfluence: PlantWeatherType;
  description: string;
}

export interface GardenDecorationItem {
  id: string;
  type: 'butterfly' | 'flower' | 'mushroom' | 'moon' | 'cloud' | 'star' | 'rainbow' | 'ladybug';
  name: string;
  emoji: string;
  unlockedAt: string;
}

export interface PlantRewardItem {
  id: string;
  type: 'sticker' | 'wish' | 'quote' | 'decoration';
  title: string;
  content: string;
  emoji: string;
  decoration?: GardenDecorationItem;
  createdAt: string;
}

export interface DailyPlantLog {
  date: string; // YYYY-MM-DD
  weather: PlantWeatherType;
  emotion?: PlantEmotionType;
  sowedSeed: boolean;
  fertilizerKg: number;
  fertilizerRequiredKg: number;
  fertilizerDone: boolean;
}

export interface EmotionSeedItem {
  id: string;
  createdAt: string; // ISO string
  drawingDataUrl: string; // Base64 data url of the circular drawing
  growthEffect: SeedGrowthEffect; // Type of change contributed to the plant
  stageAtSowing: number; // 1 to 6
  emotion?: PlantEmotionType;
  weather?: PlantWeatherType;
  note?: string; // Optional user note if any
}

export interface FullPlantState {
  seeds: EmotionSeedItem[];
  currentWeather: PlantWeatherType;
  todayEmotion?: PlantEmotionType;
  todayFertilizer: {
    date: string;
    requiredKg: number;
    currentKg: number;
    isCompleted: boolean;
  };
  dailyLogs: Record<string, DailyPlantLog>;
  unlockedDecorations: GardenDecorationItem[];
  rewards: PlantRewardItem[];
  pendingGift: boolean;
  lastVisitedDate?: string;
}


