import { JournalEntry, JournalMoodItem, TimeCapsule, JournalTheme, JournalDraft } from '../types';

export const JOURNAL_DAILY_QUOTES = [
  'Có những chuyện chỉ cần viết xuống là nhẹ đi một chút.',
  'Viết cho mình của ngày mai.',
  'Hôm nay rồi sẽ trở thành một kỷ niệm.',
  'Một ngày, một vài dòng. Thế là đủ.',
  'Không viết hôm qua cũng chẳng sao. Hôm nay trang này vẫn ở đây.',
  'Cứ thong thả, hôm nay thế nào thì ghi lại thế ấy.',
  'Mỗi dòng viết là một cái ôm gửi tới chính mình.',
  'Trang này là của bạn, không ai phán xét bạn ở đây cả.',
  'Những chuyện nhỏ nhặt nhất của hôm nay, mai này đọc lại sẽ thấy rất thương.',
  'Dù hôm nay vui hay mệt, bạn cũng đã đi trọn một ngày rồi.',
  'Viết lại để nhớ rằng mình đã từng vượt qua ngày hôm nay.',
  'Mọi cảm xúc của bạn đều hợp lệ, không có cảm xúc nào là sai.'
];

export const JOURNAL_CALENDAR_SUBTITLES = [
  'Hôm nay có gì muốn giữ lại không?',
  'Một ngày nữa lại đi qua.',
  'Có vài chuyện chỉ cần viết xuống là đủ.',
  'Hôm nay của bạn thế nào?',
  'Lưu lại một chút của ngày hôm nay.',
  'Không phải ngày nào cũng cần đặc biệt.'
];

export const JOURNAL_DAILY_THOUGHTS = [
  'Không phải ngày nào cũng cần đặc biệt.',
  'Giữ lại những điều nhỏ xíu cũng được.',
  'Ngày hôm nay cũng đáng được nhớ.',
  'Hôm nay đã đi qua rồi.',
  'Có vài chuyện chỉ cần viết xuống là đủ.'
];

export const JOURNAL_MOODS: JournalMoodItem[] = [
  { emoji: '😊', label: 'Vui', color: 'bg-amber-50/80 text-amber-900 border-amber-200' },
  { emoji: '🙂', label: 'Ổn', color: 'bg-teal-50/80 text-teal-900 border-teal-200' },
  { emoji: '😐', label: 'Bình thường', color: 'bg-stone-50/80 text-stone-800 border-stone-200' },
  { emoji: '😔', label: 'Hơi buồn', color: 'bg-sky-50/80 text-sky-900 border-sky-200' },
  { emoji: '😣', label: 'Áp lực', color: 'bg-orange-50/80 text-orange-900 border-orange-200' },
  { emoji: '😰', label: 'Lo lắng', color: 'bg-indigo-50/80 text-indigo-900 border-indigo-200' },
  { emoji: '🥺', label: 'Cô đơn', color: 'bg-violet-50/80 text-violet-900 border-violet-200' },
  { emoji: '😡', label: 'Bực mình', color: 'bg-rose-50/80 text-rose-900 border-rose-200' },
  { emoji: '🤷', label: 'Không biết', color: 'bg-zinc-50/80 text-zinc-800 border-zinc-200' }
];

export const JOURNAL_STICKERS = [
  '🌱', '☕', '🎧', '🌧️', '🌟', '🐱', '💌', '🎈', '🍀', '✨', '🌙', '🧸', '📚', '🍦', '🎨', '🌈', '🚲', '🍪', '☀️', '🌸'
];

export const JOURNAL_DEFAULT_TAGS = [
  '#school',
  '#friends',
  '#family',
  '#study',
  '#random',
  '#goodday',
  '#badday',
  '#memory'
];

export const DONT_KNOW_WHAT_TO_WRITE_PROMPTS = [
  'Điều nhỏ nhất hôm nay làm bạn vui là gì?',
  'Có chuyện gì hôm nay bạn muốn quên?',
  'Nếu hôm nay là một màu, nó sẽ là màu gì?',
  'Bạn muốn ngày mai khác hôm nay ở điểm nào?',
  'Điều gì đang chạy vòng vòng trong đầu bạn?',
  'Một bài hát hoặc giai điệu bạn lẩm bẩm cả ngày hôm nay?',
  'Món ăn nào làm bạn thấy dễ chịu nhất hôm nay?',
  'Ai là người bạn đã nghĩ đến nhiều nhất trong ngày?',
  'Nếu được biến mất trong 1 tiếng, bạn muốn ngồi ở đâu?',
  'Một câu nói của ai đó làm bạn để tâm suốt cả ngày?',
  'Hôm nay cơ thể bạn cảm thấy thế nào? Vai có mỏi không?',
  'Một điều ngớ ngẩn bạn đã thấy hoặc làm hôm nay?'
];

export interface PromptCategory {
  id: string;
  name: string;
  icon: string;
  prompts: string[];
}

export const CATEGORIZED_PROMPTS: PromptCategory[] = [
  {
    id: 'self',
    name: 'Bản thân',
    icon: '🌱',
    prompts: [
      'Gần đây bạn có cảm thấy mình đang thay đổi ở điểm nào không?',
      'Một thói quen nhỏ làm bạn cảm thấy dễ chịu mỗi sáng hoặc tối?',
      'Điều gì ở bản thân mà bạn thích nhất dạo này?',
      'Bạn có đang tự khắt khe quá mức với chính mình ở chuyện gì không?',
      'Nếu được tự thưởng cho mình một món quà nhỏ ngay lúc này, bạn muốn gì?'
    ]
  },
  {
    id: 'school',
    name: 'Trường học',
    icon: '🏫',
    prompts: [
      'Tiết học nào hôm nay làm bạn thấy buồn ngủ nhất hoặc hào hứng nhất?',
      'Áp lực bài vở hay thi cử dạo này đang ở mức mấy trên thang điểm 10?',
      'Một góc ở trường mà bạn thích ngồi trốn nhất khi rảnh?',
      'Có thầy cô giáo nào gần đây nói một câu làm bạn nhớ mãi không?',
      'Hôm nay kiểm tra hoặc trả bài có như bạn mong đợi không?'
    ]
  },
  {
    id: 'friends',
    name: 'Bạn bè',
    icon: '👯',
    prompts: [
      'Ai là người bạn cảm thấy nói chuyện thoải mái nhất dạo này?',
      'Có hiểu lầm hay khoảng cách nào với đứa bạn thân làm bạn bận lòng không?',
      'Trò đùa ngớ ngẩn nào giữa nhóm bạn làm cả lũ cười bò gần đây?',
      'Có khi nào ngồi giữa đám đông bạn bè mà bạn vẫn thấy hơi lạc lõng không?',
      'Một người bạn cũ lâu rồi chưa nhắn tin, bạn có nhớ họ không?'
    ]
  },
  {
    id: 'family',
    name: 'Gia đình',
    icon: '🏠',
    prompts: [
      'Không khí bữa cơm gia đình hôm nay thế nào?',
      'Có câu nói nào của bố mẹ gần đây làm bạn thấy hơi chạnh lòng?',
      'Một hành động quan tâm nhỏ xíu của người nhà làm bạn thấy ấm lòng?',
      'Nếu được bố mẹ thấu hiểu một chuyện mà không cần giải thích, bạn muốn đó là chuyện gì?',
      'Khoảnh khắc yên tĩnh nhất trong ngôi nhà của bạn là lúc nào?'
    ]
  },
  {
    id: 'crush',
    name: 'Tình cảm',
    icon: '💗',
    prompts: [
      'Hôm nay có chạm mặt hoặc nhìn thấy người ấy từ xa không?',
      'Một tin nhắn nhỏ xíu làm tim bạn đập nhanh hơn bình thường?',
      'Cảm giác thích một người đang làm bạn thấy vui hay thấy rối bời nhiều hơn?',
      'Bạn nghĩ điều gì ở bạn là đáng yêu nhất khi bạn thật sự thích ai đó?',
      'Có điều gì muốn nói với người ấy mà chỉ dám để trong lòng?'
    ]
  },
  {
    id: 'random',
    name: 'Vui nhảm',
    icon: '😂',
    prompts: [
      'Kể tên 3 món bạn có thể ăn cả tuần mà không chán?',
      'Khoảnh khắc vụng về hoặc quê một cục nhất bạn từng trải qua?',
      'Nếu bạn có siêu năng lực biến hình thành một đồ vật trong phòng, bạn chọn cái gì?',
      'Một meme hoặc video ngắn làm bạn cười sặc sụa gần đây?',
      'Hôm nay bạn đã lướt điện thoại mất bao nhiêu thời gian vô bổ rồi?'
    ]
  },
  {
    id: 'thoughts',
    name: 'Suy nghĩ',
    icon: '🧠',
    prompts: [
      'Điều gì đang làm bạn phân vân nhiều nhất lúc này?',
      'Nếu ngày mai có thể bắt đầu lại một việc, bạn muốn làm khác đi ở đâu?',
      'Có nỗi sợ nào bạn chưa từng dám kể với ai bao giờ không?',
      'Bạn có cảm thấy mình đang phải gồng lên để tỏ ra ổn không?',
      'Thế giới lý tưởng trong mắt bạn trông như thế nào?'
    ]
  },
  {
    id: 'night',
    name: 'Cuối ngày',
    icon: '🌙',
    prompts: [
      'Thở phào một cái... hôm nay điều nặng nề nhất cuối cùng cũng qua rồi chứ?',
      'Trước khi nhắm mắt ngủ, bạn biết ơn điều nhỏ bé nào đã diễn ra hôm nay?',
      'Đêm nay bạn muốn ngủ một giấc thật say mà không phải nghĩ về điều gì?',
      'Nếu ngày hôm nay là một chương sách, tiêu đề của chương này sẽ là gì?',
      'Nhắn gửi một câu chúc ngủ ngon cho chính bạn của đêm nay.'
    ]
  },
  {
    id: 'future',
    name: 'Tương lai',
    icon: '🔮',
    prompts: [
      'Bạn của 5 năm nữa đang làm gì, ở đâu, và có còn hay lo lắng chuyện vặt không?',
      'Ước mơ nhỏ xíu mà bạn chưa bao giờ dám nói to thành lời?',
      'Một nơi bạn nhất định phải đặt chân đến khi tự lập?',
      'Bạn hy vọng phiên bản trưởng thành của mình sẽ giữ lại nét tính cách nào?',
      'Một lời nhắn gửi tới tương lai: hãy kiên nhẫn với mình nhé.'
    ]
  },
  {
    id: 'memory',
    name: 'Kỷ niệm',
    icon: '📸',
    prompts: [
      'Một ký ức tuổi thơ tự nhiên hôm nay bạn chợt nhớ lại?',
      'Mùi hương hoặc bài hát nào gợi lại cho bạn một mùa hè cũ?',
      'Món đồ cũ nào bạn vẫn giữ trong ngăn kéo dù chẳng dùng đến bao giờ?',
      'Chuyến đi chơi nào làm bạn nhớ mãi không quên?',
      'Bức ảnh nào trong điện thoại làm bạn mỉm cười mỗi khi lướt qua?'
    ]
  }
];

export const SAMPLE_JOURNAL_ENTRIES: JournalEntry[] = [];

export const SAMPLE_TIME_CAPSULES: TimeCapsule[] = [];

export function getDraftStorageKey(userId?: string): string | null {
  if (!userId || userId === 'guest') return null;
  return `teen_journal_${userId}_drafts`;
}

// Draft persistence helpers - only stored in localStorage for authenticated accounts
export function getJournalDraft(dateStr: string, userId?: string): JournalDraft | null {
  const key = getDraftStorageKey(userId);
  if (!key) return null; // Guest mode never reads from localStorage drafts

  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const map = JSON.parse(raw);
    return map[dateStr] || null;
  } catch {
    return null;
  }
}

export function saveJournalDraft(dateStr: string, draft: Partial<JournalDraft>, userId?: string): void {
  const key = getDraftStorageKey(userId);
  if (!key) {
    // STRICT GUEST MODE: In guest mode, do NOT write drafts to localStorage!
    return;
  }

  try {
    const raw = localStorage.getItem(key);
    const map = raw ? JSON.parse(raw) : {};
    const existing = map[dateStr] || {};
    map[dateStr] = {
      ...existing,
      ...draft,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(key, JSON.stringify(map));
  } catch {}
}

export function clearJournalDraft(dateStr: string, userId?: string): void {
  const key = getDraftStorageKey(userId);
  if (!key) return;

  try {
    const raw = localStorage.getItem(key);
    if (!raw) return;
    const map = JSON.parse(raw);
    delete map[dateStr];
    localStorage.setItem(key, JSON.stringify(map));
  } catch {}
}

export function hasJournalDraft(dateStr: string, userId?: string): boolean {
  if (!userId || userId === 'guest') return false;
  const draft = getJournalDraft(dateStr, userId);
  return !!draft && (
    !!draft.content?.trim() || 
    !!draft.title?.trim() || 
    !!draft.mood || 
    !!(draft.images && draft.images.length > 0)
  );
}

// Helper to get daily rotating quote
export function getDailyJournalQuote(dateString?: string): string {
  const now = dateString ? new Date(dateString) : new Date();
  // Using day of year to cycle through quotes seamlessly
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return JOURNAL_DAILY_QUOTES[dayOfYear % JOURNAL_DAILY_QUOTES.length];
}

// Format date to Vietnamese string "Thứ Ba, 8 tháng 9, 2026"
export function formatVietnameseDateFull(dateString: string): string {
  const parts = dateString.split('-');
  if (parts.length !== 3) return dateString;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);
  const dateObj = new Date(year, month - 1, day);
  
  const dayNames = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
  const dayOfWeek = dayNames[dateObj.getDay()];
  
  return `${dayOfWeek}, ngày ${day} tháng ${month}, ${year}`;
}

export function formatVietnameseShortDate(dateString: string): string {
  const parts = dateString.split('-');
  if (parts.length !== 3) return dateString;
  const day = parseInt(parts[2], 10);
  const month = parseInt(parts[1], 10);
  return `${day}/${month}`;
}

export function formatEnglishDate(dateString: string): string {
  const parts = dateString.split('-');
  if (parts.length !== 3) return dateString;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);
  const dateObj = new Date(year, month - 1, day);

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return `${dayNames[dateObj.getDay()]} · ${monthNames[month - 1]} ${day}`;
}

export function getJournalCalendarSubtitle(dateString?: string): string {
  const now = dateString ? new Date(dateString) : new Date();
  const dayIndex = now.getDate() % JOURNAL_CALENDAR_SUBTITLES.length;
  return JOURNAL_CALENDAR_SUBTITLES[dayIndex];
}

export function getDailyJournalThought(dateString?: string): string {
  const now = dateString ? new Date(dateString) : new Date();
  const dayIndex = (now.getDate() + now.getMonth() * 3) % JOURNAL_DAILY_THOUGHTS.length;
  return JOURNAL_DAILY_THOUGHTS[dayIndex];
}

export function formatDayHeader(dateString: string): { dayOfWeek: string; dateFormatted: string } {
  const parts = dateString.split('-');
  if (parts.length !== 3) return { dayOfWeek: 'Hôm nay', dateFormatted: dateString };
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);
  const dateObj = new Date(year, month - 1, day);

  const dayNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  return {
    dayOfWeek: dayNames[dateObj.getDay()],
    dateFormatted: `${day} tháng ${month}, ${year}`
  };
}
