import {
  PlantWeatherType,
  PlantEmotionType,
  PlantEmotionOption,
  GardenDecorationItem,
  PlantRewardItem
} from '../../types';

// List of emotions for the Emotion Bar
export const PLANT_EMOTIONS: PlantEmotionOption[] = [
  {
    id: 'happy',
    emoji: '😊',
    label: 'Vui',
    weatherInfluence: 'sunny',
    description: 'Trời hửng nắng ấm, cây đung đưa hân hoan'
  },
  {
    id: 'fine',
    emoji: '🙂',
    label: 'Ổn',
    weatherInfluence: 'gentle_sun',
    description: 'Nắng nhẹ dịu êm, một ngày thong thả'
  },
  {
    id: 'neutral',
    emoji: '😐',
    label: 'Bình thường',
    weatherInfluence: 'cloudy',
    description: 'Mây lững lờ trôi, gió thổi êm đềm'
  },
  {
    id: 'sad',
    emoji: '😔',
    label: 'Hơi buồn',
    weatherInfluence: 'rainy',
    description: 'Cơn mưa tưới mát cho đất và cây thêm tươi'
  },
  {
    id: 'stressed',
    emoji: '😣',
    label: 'Áp lực',
    weatherInfluence: 'rainy',
    description: 'Cơn mưa rào trút bỏ bớt gánh nặng trên vai'
  },
  {
    id: 'anxious',
    emoji: '😰',
    label: 'Lo lắng',
    weatherInfluence: 'cloudy',
    description: 'Mây êm che chở, cây tỏa sáng ấm áp bên bạn'
  },
  {
    id: 'angry',
    emoji: '😡',
    label: 'Bực mình',
    weatherInfluence: 'cloudy',
    description: 'Gió mát rượi thổi qua xua tan bực bội'
  },
  {
    id: 'lonely',
    emoji: '🥺',
    label: 'Cô đơn',
    weatherInfluence: 'night',
    description: 'Đêm thanh bình, cây luôn ở cạnh bạn'
  },
  {
    id: 'unknown',
    emoji: '🤷',
    label: 'Không biết',
    weatherInfluence: 'rainbow',
    description: 'Cầu vồng bất ngờ hiện lên sau làn mây'
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
    name: 'Nắng ấm',
    emoji: '☀️',
    skyClass: 'from-amber-100/70 via-sky-50 to-[#FAF8F5]',
    description: 'Tia nắng chan hòa, lá cây bừng sáng',
    ambience: 'Ấm áp & tràn đầy hy vọng'
  },
  gentle_sun: {
    name: 'Nắng nhẹ',
    emoji: '🌤️',
    skyClass: 'from-amber-50/80 via-emerald-50/40 to-[#FAF8F5]',
    description: 'Nắng xuyên qua kẽ lá, bầu trời dễ chịu',
    ambience: 'Dịu dàng & thư thái'
  },
  cloudy: {
    name: 'Nhiều mây',
    emoji: '☁️',
    skyClass: 'from-slate-100 via-sky-50/60 to-[#FAF8F5]',
    description: 'Những đám mây xốp che chở nhẹ nhàng',
    ambience: 'Bình yên & khoan thai'
  },
  rainy: {
    name: 'Mưa mát lành',
    emoji: '🌧️',
    skyClass: 'from-sky-100/90 via-teal-50/60 to-[#FAF8F5]',
    description: 'Mưa tưới cho chậu cây được uống nước',
    ambience: 'Lắng đọng & xoa dịu'
  },
  night: {
    name: 'Đêm dịu',
    emoji: '🌙',
    skyClass: 'from-indigo-950/20 via-slate-100 to-[#FAF8F5]',
    description: 'Ánh trăng êm ả, đốm sáng nhỏ bên gốc cây',
    ambience: 'Tĩnh lặng & vỗ về'
  },
  starry_night: {
    name: 'Đêm đầy sao',
    emoji: '⭐',
    skyClass: 'from-indigo-900/25 via-sky-100/40 to-[#FAF8F5]',
    description: 'Những đốm sao nhỏ lấp lánh trên vòm lá',
    ambience: 'Kỳ diệu & mơ mộng'
  },
  rainbow: {
    name: 'Cầu vồng',
    emoji: '🌈',
    skyClass: 'from-pink-100/50 via-sky-100/60 to-[#FAF8F5]',
    description: 'Dải sắc màu rạng rỡ ôm trọn góc vườn',
    ambience: 'Bất ngờ & tươi sáng'
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

// Pool of possible surprise gifts
export const SURPRISE_REWARDS_POOL: Omit<PlantRewardItem, 'id' | 'createdAt'>[] = [
  {
    type: 'decoration',
    title: 'Chú bướm nhỏ xinh',
    emoji: '🦋',
    content: 'Một chú bướm bay đến đậu bên chậu cây của bạn.',
    decoration: {
      id: 'dec_butterfly',
      type: 'butterfly',
      name: 'Chú bướm dạo chơi',
      emoji: '🦋',
      unlockedAt: ''
    }
  },
  {
    type: 'decoration',
    title: 'Cây nấm tí hon',
    emoji: '🍄',
    content: 'Một chiếc nấm chấm bi mọc lên bên gốc cây ấm áp.',
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
    title: 'Bông hoa dại xinh',
    emoji: '🌸',
    content: 'Một nụ hoa nhỏ nở hé bên mép chậu cây.',
    decoration: {
      id: 'dec_flower',
      type: 'flower',
      name: 'Bông hoa dại',
      emoji: '🌸',
      unlockedAt: ''
    }
  },
  {
    type: 'decoration',
    title: 'Đốm sao may mắn',
    emoji: '⭐',
    content: 'Một ngôi sao nhỏ chiếu sáng dịu dàng quanh bạn.',
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
    title: 'Đám mây bông',
    emoji: '☁️',
    content: 'Một cụm mây trắng mềm mại bay lướt qua vườn.',
    decoration: {
      id: 'dec_cloud',
      type: 'cloud',
      name: 'Đám mây xốp',
      emoji: '☁️',
      unlockedAt: ''
    }
  },
  {
    type: 'decoration',
    title: 'Chú bọ rùa may mắn',
    emoji: '🐞',
    content: 'Một chú bọ rùa đỏ nhỏ nhắn ghé thăm chiếc lá xanh.',
    decoration: {
      id: 'dec_ladybug',
      type: 'ladybug',
      name: 'Bọ rùa đỏ',
      emoji: '🐞',
      unlockedAt: ''
    }
  },
  {
    type: 'decoration',
    title: 'Mảnh cầu vồng',
    emoji: '🌈',
    content: 'Cầu vồng nhỏ tí hon lấp lánh phản chiếu sau cơn mưa.',
    decoration: {
      id: 'dec_rainbow',
      type: 'rainbow',
      name: 'Mảnh cầu vồng',
      emoji: '🌈',
      unlockedAt: ''
    }
  },
  {
    type: 'wish',
    title: 'Thẻ bài dịu dàng',
    emoji: '💌',
    content: '“Hôm nay bạn đã làm rất tốt rồi. Hãy tự hào vì mình đã luôn cố gắng.”'
  },
  {
    type: 'sticker',
    title: 'Huy hiệu Mầm Xanh',
    emoji: '🌱',
    content: '“Cứ lớn lên từ từ, không ai hối thúc cậu cả.”'
  },
  {
    type: 'quote',
    title: 'Gió thơm mùa hạ',
    emoji: '🍃',
    content: '“Mỗi cảm xúc ghé thăm đều mang một lời nhắn. Hãy lắng nghe và để nó trôi qua tự nhiên.”'
  }
];

// Pick a surprise reward that hasn't been unlocked if possible
export function pickRandomReward(unlockedIds: string[]): PlantRewardItem {
  const available = SURPRISE_REWARDS_POOL.filter(
    (r) => !r.decoration || !unlockedIds.includes(r.decoration.id)
  );

  const chosen =
    available.length > 0
      ? available[Math.floor(Math.random() * available.length)]
      : SURPRISE_REWARDS_POOL[Math.floor(Math.random() * SURPRISE_REWARDS_POOL.length)];

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
