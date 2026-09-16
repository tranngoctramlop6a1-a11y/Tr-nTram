import {
  PlantWeatherType,
  PlantEmotionType,
  PlantEmotionOption,
  GardenDecorationItem,
  PlantRewardItem
} from '../../types';

// List of emotions for the Emotion Bar (Strict mapping per requirement)
export const PLANT_EMOTIONS: PlantEmotionOption[] = [
  {
    id: 'happy',
    emoji: '😊',
    label: 'Vui',
    weatherInfluence: 'sunny',
    description: 'Bầu trời xanh sáng, mặt trời to ấm áp phủ ánh nắng chan hòa'
  },
  {
    id: 'fine',
    emoji: '🙂',
    label: 'Ổn',
    weatherInfluence: 'cloudy',
    description: 'Bầu trời xanh thanh bình, mây pastel trôi êm đềm dịu nhẹ'
  },
  {
    id: 'neutral',
    emoji: '😐',
    label: 'Bình thường',
    weatherInfluence: 'windy',
    description: 'Gió nhẹ 3D lướt qua, lá cây và những chiếc lá bay đung đưa'
  },
  {
    id: 'stressed',
    emoji: '😣',
    label: 'Áp lực',
    weatherInfluence: 'rainy',
    description: 'Mưa rơi tí tách nhiều lớp, tưới mát gột rửa bớt gánh nặng'
  },
  {
    id: 'sad',
    emoji: '😞',
    label: 'Suy sụp',
    weatherInfluence: 'heavy_rain',
    description: 'Mưa to nặng hạt, nhưng cây vẫn vững vàng kiên cường đứng đây'
  },
  {
    id: 'angry',
    emoji: '😡',
    label: 'Bực mình',
    weatherInfluence: 'strong_wind',
    description: 'Gió lớn cuộn thổi, cây nghiêng mình rồi lại đứng thẳng mạnh mẽ'
  },
  {
    id: 'lonely',
    emoji: '🥺',
    label: 'Cô đơn',
    weatherInfluence: 'night',
    description: 'Màn đêm yên bình, vầng trăng lớn chiếu ánh sáng dịu lành'
  },
  {
    id: 'unknown',
    emoji: '🤷',
    label: 'Không biết',
    weatherInfluence: 'rainbow',
    description: 'Cầu vồng lớn lung linh dần xuất hiện với muôn sắc màu kỳ diệu'
  }
];

// Weather Metadata & Descriptions
export const WEATHER_CONFIG: Record<
  PlantWeatherType,
  {
    name: string;
    emoji: string;
    skyClass: string;
    description: string;
    ambience: string;
  }
> = {
  sunny: {
    name: 'Nắng to',
    emoji: '☀️',
    skyClass: 'from-amber-200/80 via-sky-100 to-[#FAF8F5]',
    description: 'Bầu trời xanh sáng, mặt trời rực rỡ tỏa muôn tia nắng',
    ambience: 'Ấm áp, bừng sáng & tươi mới'
  },
  cloudy: {
    name: 'Mây xanh nhẹ',
    emoji: '☁️',
    skyClass: 'from-sky-200/85 via-blue-50 to-[#FAF8F5]',
    description: 'Bầu trời xanh dịu mát, những áng mây pastel thong thả trôi',
    ambience: 'Bình yên, thư thả & khoan thai'
  },
  windy: {
    name: 'Gió nhẹ',
    emoji: '🍃',
    skyClass: 'from-emerald-100/70 via-sky-100/50 to-[#FAF8F5]',
    description: 'Luồng gió mát mềm mại, lá bay lững lờ theo làn gió',
    ambience: 'Nhẹ nhàng, êm dịu & thảnh thơi'
  },
  rainy: {
    name: 'Trời mưa',
    emoji: '🌧️',
    skyClass: 'from-slate-300/80 via-sky-200/70 to-[#FAF8F5]',
    description: 'Cơn mưa rơi đều đặn nhiều lớp, đất ẩm và lá cây mát rượi',
    ambience: 'Xoa dịu, lắng đọng & tưới mát'
  },
  heavy_rain: {
    name: 'Mưa to',
    emoji: '⛈️',
    skyClass: 'from-slate-400/90 via-sky-300/80 to-[#FAF8F5]',
    description: 'Mưa giông nặng hạt, cây đung đưa kiên cường trong giọt nước',
    ambience: 'Vững chãi, chở che & kiên cường'
  },
  strong_wind: {
    name: 'Gió lớn',
    emoji: '🌪️',
    skyClass: 'from-amber-100/60 via-slate-300/70 to-[#FAF8F5]',
    description: 'Gió cuộn từng đợt, cây kiên định nghiêng rồi lại đứng thẳng',
    ambience: 'Mạnh mẽ, kiên cường & bứt phá'
  },
  night: {
    name: 'Ban đêm',
    emoji: '🌙',
    skyClass: 'from-indigo-950/60 via-slate-900/40 to-[#FAF8F5]',
    description: 'Bầu trời đêm xanh thẳm, vầng trăng lớn tỏa ánh dịu mát',
    ambience: 'Tĩnh lặng, vỗ về & ấm lòng'
  },
  rainbow: {
    name: 'Cầu vồng',
    emoji: '🌈',
    skyClass: 'from-pink-100/70 via-sky-100/70 to-[#FAF8F5]',
    description: 'Cầu vồng lớn lung linh vắt ngang bầu trời với muôn hạt sáng',
    ambience: 'Kỳ diệu, hy vọng & lung linh'
  },
  gentle_sun: {
    name: 'Nắng nhẹ',
    emoji: '🌤️',
    skyClass: 'from-amber-100/70 via-emerald-50/40 to-[#FAF8F5]',
    description: 'Nắng xuyên qua kẽ lá, bầu trời dễ chịu',
    ambience: 'Dịu dàng & thư thái'
  },
  starry_night: {
    name: 'Đêm đầy sao',
    emoji: '⭐',
    skyClass: 'from-indigo-900/50 via-sky-100/40 to-[#FAF8F5]',
    description: 'Những đốm sao nhỏ lấp lánh trên vòm lá',
    ambience: 'Kỳ diệu & mơ mộng'
  }
};

// Deterministic random per date string YYYY-MM-DD
export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// Get today's base weather (deterministic for the date)
export function getBaseWeatherForDate(dateStr: string): PlantWeatherType {
  const hash = hashString(dateStr + '_weather');
  const mod = hash % 100;
  if (mod < 28) return 'gentle_sun';
  if (mod < 55) return 'sunny';
  if (mod < 75) return 'cloudy';
  if (mod < 88) return 'rainy';
  if (mod < 94) return 'night';
  if (mod < 97) return 'rainbow';
  return 'starry_night';
}

// Get today's fertilizer requirement (1.5 kg to 3.5 kg, rounded to 0.1 kg, consistent for the date)
export function getRequiredFertilizerForDate(dateStr: string): number {
  const hash = hashString(dateStr + '_fertilizer');
  // Range: 15 to 35 tenths (1.5kg to 3.5kg)
  const tenths = 15 + (hash % 21);
  return tenths / 10;
}

// Today date string in YYYY-MM-DD
export function getTodayDateString(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Plant speech after sowing (short, natural, warm, 1 sentence)
export const SOWING_RESPONSES = {
  thanks: [
    'Cảm ơn cậu đã kể tớ nghe.',
    'Tớ nhận được rồi nha.',
    'Một hạt cảm xúc nữa đã được gieo xuống.',
    'Cảm ơn vì đã để tớ biết hôm nay của cậu.',
    'Tớ giữ giúp cậu hạt mầm này nhé.'
  ],
  wishes: [
    'Mong hôm nay sẽ dịu dàng hơn với cậu.',
    'Chúc cậu có một ngày nhẹ tênh.',
    'Mong cậu tìm được một điều nhỏ khiến mình vui.',
    'Chúc một buổi chiều thật bình yên.',
    'Mong trái tim cậu hôm nay được thả lỏng.'
  ],
  gentleAdvice: [
    'Mệt thì nghỉ một chút cũng được.',
    'Không cần giải quyết mọi thứ ngay hôm nay.',
    'Từ từ thôi, cậu không cần chạy.',
    'Một chuyện một lúc nhé.',
    'Hôm nay làm được đến đâu cũng đáng ghi nhận.',
    'Cứ thở sâu một nhịp, tớ vẫn ở đây.'
  ]
};

export function getRandomSowingMessage(): string {
  const pool = [
    ...SOWING_RESPONSES.thanks,
    ...SOWING_RESPONSES.wishes,
    ...SOWING_RESPONSES.gentleAdvice
  ];
  return pool[Math.floor(Math.random() * pool.length)];
}

// Plant speech when fertilizer is perfect
export const FERTILIZER_SUCCESS_MESSAGES = [
  'Vừa đủ luôn! Cảm ơn cậu nha 🌱',
  'Chuẩn rồi! Tớ khỏe hơn một chút rồi.',
  'Đủ dinh dưỡng rồi nè! Mát lành ghê.',
  'Ước lượng chuẩn quá! Cảm ơn cậu nhiều nhé.',
  'Đất ấm và mềm rồi, tớ vươn cao thêm xíu đây!'
];

// Daily greetings when opening the game
export function getDailyPlantGreeting(isFirstVisitEver: boolean, lastVisited?: string): string {
  const today = getTodayDateString();
  if (isFirstVisitEver) {
    return 'Chào bạn! Tớ là cái cây nhỏ của cậu 🌱';
  }

  // If last visited was days ago
  if (lastVisited && lastVisited !== today) {
    const diffDays = Math.round((new Date(today).getTime() - new Date(lastVisited).getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays > 2) {
      return 'Lâu rồi mới gặp 🌱 Cậu khỏe không? Tớ vẫn ở đây nè.';
    }
  }

  const hours = new Date().getHours();
  if (hours >= 5 && hours < 11) {
    const morningG = [
      'Chào buổi sáng 🌱 Chúc cậu ngày mới nhẹ nhàng!',
      'Hôm nay mình chăm nhau một chút nhé.',
      'Chào cậu, nắng sớm hôm nay dễ chịu ghê.'
    ];
    return morningG[Math.floor(Math.random() * morningG.length)];
  }

  if (hours >= 11 && hours < 14) {
    return 'Trưa rồi, nhớ ăn uống nghỉ ngơi chút nhé 🌱';
  }

  if (hours >= 14 && hours < 18) {
    return 'Buổi chiều thong thả nhé! Tớ vẫn đợi cậu ở đây.';
  }

  const nightG = [
    'Tối rồi, để đầu óc nghỉ ngơi một chút nhé 🌱',
    'Tớ vẫn ở đây nè, ngồi cạnh nhau một xíu nha.',
    'Đêm nay dịu lắm, cậu đã vất vả cả ngày rồi.'
  ];
  return nightG[Math.floor(Math.random() * nightG.length)];
}

// Growth Stage calculation (1 to 6)
// Calculated based on total seeds and fertilizer completions
export function calculatePlantStage(seedCount: number, fertilizerDays: number = 0): number {
  const totalCarePoints = seedCount + fertilizerDays * 1.5;
  if (totalCarePoints <= 2) return 1; // 🌰 Hạt giống
  if (totalCarePoints <= 6) return 2; // 🌱 Mầm nhỏ
  if (totalCarePoints <= 12) return 3; // 🌿 Cây non
  if (totalCarePoints <= 20) return 4; // 🪴 Cây lớn
  if (totalCarePoints <= 30) return 5; // 🌳 Cây trưởng thành
  return 6; // ✨ Cây đặc biệt
}

export function getStageDetails(stage: number): {
  emoji: string;
  title: string;
  desc: string;
  seedReq: string;
} {
  switch (stage) {
    case 1:
      return {
        emoji: '🌰',
        title: 'Hạt giống',
        desc: 'Một hạt mầm bé xíu ngủ yên trong đất mềm, chuẩn bị thức giấc.',
        seedReq: '0 – 2 điểm chăm sóc'
      };
    case 2:
      return {
        emoji: '🌱',
        title: 'Mầm nhỏ',
        desc: 'Chồi non xanh biếc vươn lên đón những tia sáng ấm đầu tiên.',
        seedReq: '3 – 6 điểm chăm sóc'
      };
    case 3:
      return {
        emoji: '🌿',
        title: 'Cây non',
        desc: 'Cành lá sum suê dần, thân cây chắc khỏe theo từng ngày.',
        seedReq: '7 – 12 điểm chăm sóc'
      };
    case 4:
      return {
        emoji: '🪴',
        title: 'Cây lớn',
        desc: 'Tán cây tròn trịa, vững chãi che bóng mát dịu lành.',
        seedReq: '13 – 20 điểm chăm sóc'
      };
    case 5:
      return {
        emoji: '🌳',
        title: 'Cây trưởng thành',
        desc: 'Những đóa hoa thơm và quả ngọt bắt đầu kết trái xinh xắn.',
        seedReq: '21 – 30 điểm chăm sóc'
      };
    case 6:
    default:
      return {
        emoji: '✨',
        title: 'Cây đặc biệt / Kỳ diệu',
        desc: 'Cái cây lấp lánh đốm sáng diệu kỳ, tràn đầy năng lượng yêu thương.',
        seedReq: '31+ điểm chăm sóc'
      };
  }
}

// Pool of possible surprise gifts (Both physical decorations and heartwarming advice)
export const SURPRISE_REWARDS_POOL: Omit<PlantRewardItem, 'id' | 'createdAt'>[] = [
  // ── Animals ──
  {
    type: 'decoration',
    title: 'Chú bướm nhỏ xinh',
    emoji: '🦋',
    content: 'Một chú bướm rực rỡ bay dập dờn đến dạo chơi quanh cái cây của bạn.',
    decoration: {
      id: 'dec_butterfly',
      type: 'butterfly',
      name: 'Chú bướm nhỏ',
      emoji: '🦋',
      unlockedAt: ''
    }
  },
  {
    type: 'decoration',
    title: 'Chú ong chăm chỉ',
    emoji: '🐝',
    content: 'Một chú ong vàng vo ve bay lượn tìm mật ngọt bên chồi lá non.',
    decoration: {
      id: 'dec_bee',
      type: 'bee',
      name: 'Chú ong nhỏ',
      emoji: '🐝',
      unlockedAt: ''
    }
  },
  {
    type: 'decoration',
    title: 'Chú chim nhỏ ghé thăm',
    emoji: '🐦',
    content: 'Một chú chim non vỗ cánh bay đến hót líu lo bên chậu cây thân yêu.',
    decoration: {
      id: 'dec_bird',
      type: 'bird',
      name: 'Chim non ríu rít',
      emoji: '🐦',
      unlockedAt: ''
    }
  },
  {
    type: 'decoration',
    title: 'Chú bọ rùa may mắn',
    emoji: '🐞',
    content: 'Một chú bọ rùa đỏ chấm bi nhỏ xíu ghé đậu trên phiến lá xanh tươi.',
    decoration: {
      id: 'dec_ladybug',
      type: 'ladybug',
      name: 'Bọ rùa may mắn',
      emoji: '🐞',
      unlockedAt: ''
    }
  },

  // ── Garden Nature & Objects ──
  {
    type: 'decoration',
    title: 'Bông hoa dại nở rộ',
    emoji: '🌸',
    content: 'Một nụ hoa nhỏ tươi tắn hé nở bên mép chậu cây tỏa hương êm dịu.',
    decoration: {
      id: 'dec_flower',
      type: 'flower',
      name: 'Hoa dại nở rộ',
      emoji: '🌸',
      unlockedAt: ''
    }
  },
  {
    type: 'decoration',
    title: 'Cây nấm tí hon',
    emoji: '🍄',
    content: 'Một chiếc nấm chấm bi mọc lên bên gốc đất mềm xốp ấm áp.',
    decoration: {
      id: 'dec_mushroom',
      type: 'mushroom',
      name: 'Nấm tí hon',
      emoji: '🍄',
      unlockedAt: ''
    }
  },
  {
    type: 'decoration',
    title: 'Đám mây bồng bềnh',
    emoji: '☁️',
    content: 'Một cụm mây trắng êm ái trôi lững lờ che bóng râm mát cho vườn.',
    decoration: {
      id: 'dec_cloud',
      type: 'cloud',
      name: 'Mây xốp êm đềm',
      emoji: '☁️',
      unlockedAt: ''
    }
  },
  {
    type: 'decoration',
    title: 'Đốm sao may mắn',
    emoji: '⭐',
    content: 'Một ngôi sao nhỏ lấp lánh tỏa ánh sáng kỳ diệu sưởi ấm tâm hồn bạn.',
    decoration: {
      id: 'dec_star',
      type: 'star',
      name: 'Đốm sao may mắn',
      emoji: '⭐',
      unlockedAt: ''
    }
  },
  {
    type: 'decoration',
    title: 'Vầng trăng bạc nhỏ',
    emoji: '🌙',
    content: 'Vầng trăng lưỡi liềm nhỏ nhắn mang ánh sáng dịu lành tới góc vườn.',
    decoration: {
      id: 'dec_moon',
      type: 'moon',
      name: 'Vầng trăng nhỏ',
      emoji: '🌙',
      unlockedAt: ''
    }
  },
  {
    type: 'decoration',
    title: 'Mảnh cầu vồng mini',
    emoji: '🌈',
    content: 'Cầu vồng nhỏ tí hon lấp lánh mang theo lời chúc một ngày an lành.',
    decoration: {
      id: 'dec_rainbow',
      type: 'rainbow',
      name: 'Cầu vồng mini',
      emoji: '🌈',
      unlockedAt: ''
    }
  },
  {
    type: 'decoration',
    title: 'Vầng hạt sáng lấp lánh',
    emoji: '✨',
    content: 'Những hạt bụi sáng diệu kỳ bay lượn thắp sáng xung quanh tán cây.',
    decoration: {
      id: 'dec_sparkles',
      type: 'sparkles',
      name: 'Hạt sáng lấp lánh',
      emoji: '✨',
      unlockedAt: ''
    }
  },
  {
    type: 'decoration',
    title: 'Bong bóng ước nguyện',
    emoji: '🎈',
    content: 'Một quả bóng bay sắc màu nhẹ nhàng bay lượn trong làn gió êm.',
    decoration: {
      id: 'dec_balloon',
      type: 'balloon',
      name: 'Bong bóng sắc màu',
      emoji: '🎈',
      unlockedAt: ''
    }
  },
  {
    type: 'decoration',
    title: 'Chiếc lá may mắn',
    emoji: '🍃',
    content: 'Chiếc lá non bốn mùa mang lại niềm tin và sự nhẹ nhõm cho tâm trí.',
    decoration: {
      id: 'dec_leaves',
      type: 'leaves',
      name: 'Chiếc lá may mắn',
      emoji: '🍃',
      unlockedAt: ''
    }
  },

  // ── Heartwarming Advice & Wisdom Notes (Strict: No apply button, just read & acknowledge) ──
  {
    type: 'advice',
    title: 'Lời nhắn dịu dàng',
    emoji: '💌',
    content: '“Không cần giải quyết hết mọi chuyện trong một ngày.”'
  },
  {
    type: 'advice',
    title: 'Lời nhắn từ cây nhỏ',
    emoji: '🌱',
    content: '“Cứ bước từng bước nhỏ thôi, hôm nay cậu đã làm rất tốt rồi.”'
  },
  {
    type: 'advice',
    title: 'Lời nhắn lắng đọng',
    emoji: '💌',
    content: '“Mệt thì dừng lại hít một hơi thật sâu, không ai hối thúc cậu cả.”'
  },
  {
    type: 'advice',
    title: 'Lời dặn mùa hạ',
    emoji: '🍃',
    content: '“Mỗi cảm xúc ghé qua đều có lý do, hãy dịu dàng với chính mình nhé.”'
  },
  {
    type: 'advice',
    title: 'Lời động viên ấm áp',
    emoji: '🌻',
    content: '“Trời có giông bão thế nào thì chậu cây nhỏ này vẫn luôn đứng vững đợi cậu ở đây.”'
  },
  {
    type: 'advice',
    title: 'Vỗ về trái tim',
    emoji: '✨',
    content: '“Đừng quá khắt khe với bản thân, cậu xứng đáng được ôm ấp và bình yên.”'
  },
  {
    type: 'advice',
    title: 'Thả lỏng suy nghĩ',
    emoji: '🍵',
    content: '“Một chuyện một lúc nhé, đừng gom cả thế giới đặt lên vai mình.”'
  }
];

// Pick a surprise reward with anti-repetition memory
export function pickSmartReward(
  unlockedIds: string[] = [],
  recentRewardHistory: string[] = []
): PlantRewardItem {
  // Recent pool exclusions (last 4 items)
  const recentSet = new Set(recentRewardHistory.slice(0, 4));

  // Eligible pool prioritizing items not given recently and unacquired decorations
  let candidates = SURPRISE_REWARDS_POOL.filter((r) => {
    if (r.decoration) {
      // Prioritize unacquired decorations
      if (unlockedIds.includes(r.decoration.id)) return false;
    }
    // Avoid very recent repeats
    const key = r.decoration ? r.decoration.id : r.title;
    return !recentSet.has(key);
  });

  // If candidate list exhausted, fall back to non-recent advice or general pool
  if (candidates.length === 0) {
    candidates = SURPRISE_REWARDS_POOL.filter((r) => {
      const key = r.decoration ? r.decoration.id : r.title;
      return !recentSet.has(key);
    });
  }

  if (candidates.length === 0) {
    candidates = SURPRISE_REWARDS_POOL;
  }

  const chosen = candidates[Math.floor(Math.random() * candidates.length)];
  const now = new Date().toISOString();

  return {
    ...chosen,
    id: 'reward_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    createdAt: now,
    decoration: chosen.decoration
      ? { ...chosen.decoration, unlockedAt: now }
      : undefined
  };
}

// Backward compatibility alias
export const pickRandomReward = (unlockedIds: string[]): PlantRewardItem =>
  pickSmartReward(unlockedIds, []);
