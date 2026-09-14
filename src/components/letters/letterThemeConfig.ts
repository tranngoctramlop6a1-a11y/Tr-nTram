import { PaperStyle } from '../../types';

export interface PaperThemeConfig {
  id: PaperStyle;
  name: string;
  category: 'vintage' | 'cream' | 'pastel' | 'deep' | 'custom';
  desc: string;
  bgClass: string;
  sheetBg: string;
  borderClass: string;
  envelopeClass: string;
  envelopeFlap: string;
  envelopeInner: string;
  ruledLineColor: string;
  stampBg: string;
  stampBorder: string;
  accentText?: string;
  isDark?: boolean;
}

export const PAPER_THEMES: Record<PaperStyle, PaperThemeConfig> = {
  kraft: {
    id: 'kraft',
    name: 'Giấy Kraft cổ điển',
    category: 'vintage',
    desc: 'Màu nâu mộc tự nhiên, gợi cảm giác vững chãi và hoài niệm',
    bgClass: 'bg-[#F4EBE1]',
    sheetBg: '#F4EBE1',
    borderClass: 'border-[#D9CBB9]',
    envelopeClass: 'bg-[#DECBB7] border-[#CBB39C]',
    envelopeFlap: 'bg-[#D2BDA6] border-[#BAA086]',
    envelopeInner: 'bg-[#E8DACB]',
    ruledLineColor: 'rgba(110, 80, 58, 0.13)',
    stampBg: '#8C5A4B',
    stampBorder: '#6F4134',
    accentText: '#5A3D2B'
  },
  parchment: {
    id: 'parchment',
    name: 'Be giấy mộc',
    category: 'vintage',
    desc: 'Giấy dó nhuốm màu thời gian, ấm áp & hoài niệm',
    bgClass: 'bg-[#F7F2E8]',
    sheetBg: '#F7F2E8',
    borderClass: 'border-[#DFCFC0]',
    envelopeClass: 'bg-[#EFE5D8] border-[#D9C7B2]',
    envelopeFlap: 'bg-[#E3D6C5] border-[#CBBAA5]',
    envelopeInner: 'bg-[#F5ECE0]',
    ruledLineColor: 'rgba(140, 115, 101, 0.12)',
    stampBg: '#C2847A',
    stampBorder: '#A66A60',
    accentText: '#5D4537'
  },
  ivory: {
    id: 'ivory',
    name: 'Trắng ngà thủ công',
    category: 'vintage',
    desc: 'Trang nhã, mộc mạc và tĩnh lặng như sương mai',
    bgClass: 'bg-[#FAF8F5]',
    sheetBg: '#FAF8F5',
    borderClass: 'border-[#EAE3D9]',
    envelopeClass: 'bg-[#F2EEE7] border-[#DDD5C9]',
    envelopeFlap: 'bg-[#E6DFD5] border-[#CFC5B6]',
    envelopeInner: 'bg-[#F7F4EE]',
    ruledLineColor: 'rgba(120, 110, 100, 0.10)',
    stampBg: '#B89B72',
    stampBorder: '#9E825B',
    accentText: '#5C5248'
  },
  coffee: {
    id: 'coffee',
    name: 'Cà phê sữa ấm',
    category: 'vintage',
    desc: 'Tone nâu sữa hoài niệm, ấm cúng như một sáng mùa thu',
    bgClass: 'bg-[#EFE7DD]',
    sheetBg: '#EFE7DD',
    borderClass: 'border-[#D6C7B7]',
    envelopeClass: 'bg-[#E2D4C3] border-[#CDBCAB]',
    envelopeFlap: 'bg-[#D7C6B4] border-[#BFAAA7]',
    envelopeInner: 'bg-[#EAE0D3]',
    ruledLineColor: 'rgba(98, 70, 48, 0.13)',
    stampBg: '#7D5237',
    stampBorder: '#613E27',
    accentText: '#4A3222'
  },
  terracotta: {
    id: 'terracotta',
    name: 'Đất nung mộc',
    category: 'vintage',
    desc: 'Sắc đất nung trầm ấm, mang hơi thở thủ công xưa',
    bgClass: 'bg-[#F8ECE8]',
    sheetBg: '#F8ECE8',
    borderClass: 'border-[#E6CEC6]',
    envelopeClass: 'bg-[#EED0C7] border-[#DCB7AC]',
    envelopeFlap: 'bg-[#E2BFAF] border-[#CC9F90]',
    envelopeInner: 'bg-[#F6E3DD]',
    ruledLineColor: 'rgba(145, 78, 62, 0.12)',
    stampBg: '#A85340',
    stampBorder: '#8C3F2E',
    accentText: '#663124'
  },
  warm_ivory: {
    id: 'warm_ivory',
    name: 'Vàng ngà ánh nến',
    category: 'cream',
    desc: 'Ấm cúng như ánh đèn bàn đêm, trang nhã và dịu mắt',
    bgClass: 'bg-[#FAF3E0]',
    sheetBg: '#FAF3E0',
    borderClass: 'border-[#E6D9BF]',
    envelopeClass: 'bg-[#F2E8CF] border-[#DED1B3]',
    envelopeFlap: 'bg-[#E8DCBF] border-[#D0C2A0]',
    envelopeInner: 'bg-[#F7EED6]',
    ruledLineColor: 'rgba(140, 110, 70, 0.11)',
    stampBg: '#C08A3E',
    stampBorder: '#9E6E2A',
    accentText: '#5A4626'
  },
  cream: {
    id: 'cream',
    name: 'Kem vani dịu ngọt',
    category: 'cream',
    desc: 'Sắc kem mềm như bơ, thanh lịch và tươi sáng dễ chịu',
    bgClass: 'bg-[#FFFDF5]',
    sheetBg: '#FFFDF5',
    borderClass: 'border-[#EFE9D8]',
    envelopeClass: 'bg-[#F8F3E4] border-[#E8DFC9]',
    envelopeFlap: 'bg-[#EDE4CD] border-[#D8CCB0]',
    envelopeInner: 'bg-[#FCF7EB]',
    ruledLineColor: 'rgba(130, 115, 80, 0.10)',
    stampBg: '#B8934A',
    stampBorder: '#9A7734',
    accentText: '#544628'
  },
  butter: {
    id: 'butter',
    name: 'Vàng bơ ấm áp',
    category: 'cream',
    desc: 'Sắc vàng nắng dịu dàng, nạp năng lượng tích cực cho tâm hồn',
    bgClass: 'bg-[#FEF9E7]',
    sheetBg: '#FEF9E7',
    borderClass: 'border-[#F2E5C0]',
    envelopeClass: 'bg-[#F6EBC7] border-[#E7D7A8]',
    envelopeFlap: 'bg-[#EBD9A4] border-[#D6C289]',
    envelopeInner: 'bg-[#FBF1D4]',
    ruledLineColor: 'rgba(160, 130, 60, 0.12)',
    stampBg: '#C9932B',
    stampBorder: '#A6751C',
    accentText: '#624B15'
  },
  peach: {
    id: 'peach',
    name: 'Cam đào pastel',
    category: 'cream',
    desc: 'Ấm êm như cái ôm ngọt ngào, tươi tắn và đáng yêu',
    bgClass: 'bg-[#FDF4EC]',
    sheetBg: '#FDF4EC',
    borderClass: 'border-[#F2DCCB]',
    envelopeClass: 'bg-[#F8E3D2] border-[#EACBB2]',
    envelopeFlap: 'bg-[#EBCFB5] border-[#D6B599]',
    envelopeInner: 'bg-[#FCEDE0]',
    ruledLineColor: 'rgba(175, 105, 75, 0.11)',
    stampBg: '#C77552',
    stampBorder: '#A65A3A',
    accentText: '#6B3E29'
  },
  rose: {
    id: 'rose',
    name: 'Hồng phấn hoa đào',
    category: 'pastel',
    desc: 'Ngọt ngào, êm dịu, vỗ về những tâm sự mỏng manh',
    bgClass: 'bg-[#FDF2F2]',
    sheetBg: '#FDF2F2',
    borderClass: 'border-[#EED5D5]',
    envelopeClass: 'bg-[#F9E5E5] border-[#E8CFCF]',
    envelopeFlap: 'bg-[#EFCFCF] border-[#DFBEBE]',
    envelopeInner: 'bg-[#FCEDED]',
    ruledLineColor: 'rgba(180, 110, 110, 0.11)',
    stampBg: '#C27373',
    stampBorder: '#A45858',
    accentText: '#6E3A3A'
  },
  mint: {
    id: 'mint',
    name: 'Xanh mint tươi mát',
    category: 'pastel',
    desc: 'Trong trẻo, thanh mát, mở ra một ngày bình yên',
    bgClass: 'bg-[#F0F4F1]',
    sheetBg: '#F0F4F1',
    borderClass: 'border-[#D2E2D5]',
    envelopeClass: 'bg-[#E2ECE4] border-[#CBD8CE]',
    envelopeFlap: 'bg-[#D2E0D5] border-[#BCCEC0]',
    envelopeInner: 'bg-[#E8F0EA]',
    ruledLineColor: 'rgba(70, 110, 85, 0.11)',
    stampBg: '#5B8C6E',
    stampBorder: '#457055',
    accentText: '#2D4E39'
  },
  sage: {
    id: 'sage',
    name: 'Xanh xô thơm tĩnh lặng',
    category: 'pastel',
    desc: 'Sắc rêu êm dịu, xoa dịu mọi muộn phiền',
    bgClass: 'bg-[#EDF3EE]',
    sheetBg: '#EDF3EE',
    borderClass: 'border-[#CFDCD0]',
    envelopeClass: 'bg-[#DEE7DF] border-[#CAD6CC]',
    envelopeFlap: 'bg-[#CFDAD0] border-[#B7C5BA]',
    envelopeInner: 'bg-[#E7EFE8]',
    ruledLineColor: 'rgba(60, 90, 70, 0.12)',
    stampBg: '#5B7A68',
    stampBorder: '#456050',
    accentText: '#2D4636'
  },
  matcha: {
    id: 'matcha',
    name: 'Xanh matcha thanh khiết',
    category: 'pastel',
    desc: 'Màu trà xanh non tươi mới, xoa dịu tâm trạng mệt mỏi',
    bgClass: 'bg-[#F2F6EC]',
    sheetBg: '#F2F6EC',
    borderClass: 'border-[#D6E3CB]',
    envelopeClass: 'bg-[#E4ECD7] border-[#CCDAB9]',
    envelopeFlap: 'bg-[#D4E0BF] border-[#BDCCA7]',
    envelopeInner: 'bg-[#ECF2E1]',
    ruledLineColor: 'rgba(85, 115, 60, 0.11)',
    stampBg: '#6B8E4E',
    stampBorder: '#52723A',
    accentText: '#374D25'
  },
  sky: {
    id: 'sky',
    name: 'Lam mây thanh bình',
    category: 'pastel',
    desc: 'Màu bầu trời sáng trong, cho tâm trí thêm khoáng đạt',
    bgClass: 'bg-[#F0F5FA]',
    sheetBg: '#F0F5FA',
    borderClass: 'border-[#D0DFEF]',
    envelopeClass: 'bg-[#E0ECF7] border-[#C7DBEB]',
    envelopeFlap: 'bg-[#CDDFEF] border-[#B2CCE2]',
    envelopeInner: 'bg-[#EAF2F9]',
    ruledLineColor: 'rgba(60, 105, 150, 0.11)',
    stampBg: '#4E7CA5',
    stampBorder: '#38638A',
    accentText: '#264868'
  },
  lavender: {
    id: 'lavender',
    name: 'Tím oải hương mơ màng',
    category: 'pastel',
    desc: 'Sắc hoa tím nhẹ nhàng, lãng mạn và chở che cảm xúc',
    bgClass: 'bg-[#F7F3FB]',
    sheetBg: '#F7F3FB',
    borderClass: 'border-[#E2D6F0]',
    envelopeClass: 'bg-[#EFE4F7] border-[#DCBEEA]',
    envelopeFlap: 'bg-[#E2CEEE] border-[#CBB3DC]',
    envelopeInner: 'bg-[#F3EBF7]',
    ruledLineColor: 'rgba(125, 80, 160, 0.11)',
    stampBg: '#8A5FA8',
    stampBorder: '#70468E',
    accentText: '#4A2A64'
  },
  indigo: {
    id: 'indigo',
    name: 'Lam đêm hoài niệm',
    category: 'deep',
    desc: 'Khoảng trời đêm sâu lắng, cất giữ những điều bí mật',
    bgClass: 'bg-[#222831]',
    sheetBg: '#222831',
    borderClass: 'border-[#39424E]',
    envelopeClass: 'bg-[#2B323D] border-[#3E4756]',
    envelopeFlap: 'bg-[#252B35] border-[#363F4D]',
    envelopeInner: 'bg-[#1E232B]',
    ruledLineColor: 'rgba(255, 255, 255, 0.08)',
    stampBg: '#485C77',
    stampBorder: '#37475E',
    accentText: '#BAC7D5',
    isDark: true
  },
  custom: {
    id: 'custom',
    name: 'Màu tự chọn',
    category: 'custom',
    desc: 'Tùy chỉnh sắc độ giấy theo phong cách và sở thích riêng',
    bgClass: 'bg-[#FAF6F0]',
    sheetBg: '#FAF6F0',
    borderClass: 'border-[#DECBC0]',
    envelopeClass: 'bg-[#EFE4D6] border-[#DDC6B2]',
    envelopeFlap: 'bg-[#E0CFBD] border-[#CBB39E]',
    envelopeInner: 'bg-[#F8EFE4]',
    ruledLineColor: 'rgba(100, 80, 60, 0.12)',
    stampBg: '#8C5A4B',
    stampBorder: '#6F4134',
    accentText: '#4B3629'
  }
};

// Helper to determine if hex is dark
export function isColorDark(hex: string): boolean {
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length !== 6) return false;
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  // Perceived brightness formula
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128;
}

// Generate dynamic theme config for any custom hex color
export function getCustomPaperConfig(hex: string): PaperThemeConfig {
  const isDark = isColorDark(hex);
  const cleanHex = hex.startsWith('#') ? hex : `#${hex}`;

  return {
    id: 'custom',
    name: 'Màu giấy tự chọn',
    category: 'custom',
    desc: `Màu nền tùy chỉnh (${cleanHex}) mang dấu ấn riêng của bạn`,
    bgClass: '',
    sheetBg: cleanHex,
    borderClass: isDark ? 'border-white/20' : 'border-black/15',
    envelopeClass: isDark ? 'bg-black/30 border-white/20' : 'bg-black/5 border-black/10',
    envelopeFlap: isDark ? 'bg-black/40 border-white/25' : 'bg-black/10 border-black/15',
    envelopeInner: isDark ? 'bg-black/50' : 'bg-black/5',
    ruledLineColor: isDark ? 'rgba(255, 255, 255, 0.09)' : 'rgba(80, 60, 45, 0.11)',
    stampBg: isDark ? '#4B5563' : '#8C5A4B',
    stampBorder: isDark ? '#374151' : '#6F4134',
    accentText: isDark ? '#E5E7EB' : '#4B3629',
    isDark
  };
}

// Helper to get effective config with custom color fallback
export function getPaperThemeConfig(style: PaperStyle, customHex?: string | null): PaperThemeConfig {
  if (style === 'custom' && customHex) {
    return getCustomPaperConfig(customHex);
  }
  return PAPER_THEMES[style] || PAPER_THEMES.parchment;
}

// Palette category tabs for the color picker
export const PAPER_PALETTE_CATEGORIES = [
  { id: 'all', title: 'Tất cả sắc độ', icon: '🎨' },
  { id: 'vintage', title: 'Giấy mộc Vintage', icon: '📜' },
  { id: 'cream', title: 'Kem bơ ấm áp', icon: '🧈' },
  { id: 'pastel', title: 'Pastel tươi dịu', icon: '🌸' },
  { id: 'deep', title: 'Trầm lắng hoài niệm', icon: '🌙' },
  { id: 'custom', title: 'Tự pha màu', icon: '✨' }
] as const;

// Quick custom pastel color suggestions
export const QUICK_CUSTOM_COLORS = [
  { hex: '#FFF8E7', name: 'Nắng sớm' },
  { hex: '#FFF0F5', name: 'Hoa oải hương trắng' },
  { hex: '#F0FFF0', name: 'Mật sương' },
  { hex: '#F5F5DC', name: 'Giấy dó ngà' },
  { hex: '#FFF5EE', name: 'Vỏ ốc biển' },
  { hex: '#F0F8FF', name: 'Băng mây' },
  { hex: '#FAF0E6', name: 'Vải lanh trắng' },
  { hex: '#E6E6FA', name: 'Tím khói' },
  { hex: '#FFE4E1', name: 'Hồng cánh sen' },
  { hex: '#E0EEE0', name: 'Búp trà non' }
];
