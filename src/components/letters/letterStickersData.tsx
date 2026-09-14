import React from 'react';

export type StickerType = 'washi' | 'postage' | 'cute' | 'stamp' | 'emoji';

export interface StickerDefinition {
  id: string;
  name: string;
  type: StickerType;
  category: 'washi' | 'postage' | 'cute' | 'emojis';
  desc?: string;
  char?: string; // If emoji
  renderIcon: (props: { className?: string; style?: React.CSSProperties }) => React.ReactNode;
  defaultScale?: number;
  aspectRatio?: string;
}

export interface PlacedSticker {
  id: string;
  stickerId: string;
  type: StickerType;
  name: string;
  char?: string;
  x: number;      // % of paper width (0 - 100)
  y: number;      // % of paper height (0 - 100)
  rotate: number; // degrees (-180 to 180)
  scale: number;  // 0.6 to 2.0
  zIndex: number;
}

export const STICKER_CATEGORIES = [
  { id: 'all', title: 'Tất cả', icon: '✨' },
  { id: 'washi', title: 'Băng dính Washi', icon: '🩹' },
  { id: 'postage', title: 'Tem thư & Nhật ấn', icon: '💌' },
  { id: 'cute', title: 'Hình vẽ Mini & Biểu tượng', icon: '🌱' },
  { id: 'emojis', title: 'Tem bưu chính Vintage', icon: '🕊️' }
] as const;

// 1. SVG Graphic Definitions
export const STICKER_LIBRARY: StickerDefinition[] = [
  // --- WASHI TAPES ---
  {
    id: 'washi-kraft-stripes',
    name: 'Washi sọc be cà phê',
    type: 'washi',
    category: 'washi',
    desc: 'Dải washi giấy Kraft xé mép tự nhiên',
    aspectRatio: '140/32',
    renderIcon: ({ className }) => (
      <svg viewBox="0 0 140 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className || 'w-28 h-7'}>
        <defs>
          <pattern id="washi-stripes-pat" width="12" height="12" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="12" stroke="#8C6D58" strokeWidth="2.5" opacity="0.35" />
          </pattern>
        </defs>
        {/* Jagged / torn ends */}
        <path
          d="M4 2 L136 2 L138 6 L135 10 L139 16 L135 22 L138 27 L135 30 L4 30 L2 26 L5 20 L1 15 L5 9 L2 5 Z"
          fill="#DFCBB5"
          fillOpacity="0.88"
          stroke="#C4AE97"
          strokeWidth="0.8"
        />
        <path
          d="M4 2 L136 2 L138 6 L135 10 L139 16 L135 22 L138 27 L135 30 L4 30 L2 26 L5 20 L1 15 L5 9 L2 5 Z"
          fill="url(#washi-stripes-pat)"
        />
      </svg>
    )
  },
  {
    id: 'washi-gold-polka',
    name: 'Washi chấm bi vàng ấm',
    type: 'washi',
    category: 'washi',
    desc: 'Băng dính chấm bi vàng nến lấp lánh',
    aspectRatio: '140/32',
    renderIcon: ({ className }) => (
      <svg viewBox="0 0 140 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className || 'w-28 h-7'}>
        <defs>
          <pattern id="washi-dots-pat" width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="7" cy="7" r="2" fill="#B27A2E" opacity="0.45" />
          </pattern>
        </defs>
        <path
          d="M3 2 L137 2 L139 7 L135 13 L138 18 L134 24 L138 30 L3 30 L1 25 L4 19 L1 13 L4 7 Z"
          fill="#F5E8C9"
          fillOpacity="0.9"
          stroke="#D8C398"
          strokeWidth="0.8"
        />
        <path
          d="M3 2 L137 2 L139 7 L135 13 L138 18 L134 24 L138 30 L3 30 L1 25 L4 19 L1 13 L4 7 Z"
          fill="url(#washi-dots-pat)"
        />
      </svg>
    )
  },
  {
    id: 'washi-botanical-pink',
    name: 'Washi hoa nhí pastel',
    type: 'washi',
    category: 'washi',
    desc: 'Hoa anh đào & nhành hoa nhỏ ngọt ngào',
    aspectRatio: '140/32',
    renderIcon: ({ className }) => (
      <svg viewBox="0 0 140 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className || 'w-28 h-7'}>
        <path
          d="M4 2 L136 2 L138 7 L135 12 L139 18 L135 24 L138 30 L4 30 L2 25 L5 18 L2 12 L5 6 Z"
          fill="#FCE7E7"
          fillOpacity="0.92"
          stroke="#E8C5C5"
          strokeWidth="0.8"
        />
        {/* Tiny floral icons across the tape */}
        <g fill="#D47E7E" opacity="0.6">
          <circle cx="20" cy="16" r="3" />
          <circle cx="17" cy="13" r="2.2" />
          <circle cx="23" cy="13" r="2.2" />
          <circle cx="17" cy="19" r="2.2" />
          <circle cx="23" cy="19" r="2.2" />
          <circle cx="20" cy="16" r="1.2" fill="#FFF" />

          <circle cx="60" cy="16" r="3" />
          <circle cx="57" cy="13" r="2.2" />
          <circle cx="63" cy="13" r="2.2" />
          <circle cx="57" cy="19" r="2.2" />
          <circle cx="63" cy="19" r="2.2" />
          <circle cx="60" cy="16" r="1.2" fill="#FFF" />

          <circle cx="100" cy="16" r="3" />
          <circle cx="97" cy="13" r="2.2" />
          <circle cx="103" cy="13" r="2.2" />
          <circle cx="97" cy="19" r="2.2" />
          <circle cx="103" cy="19" r="2.2" />
          <circle cx="100" cy="16" r="1.2" fill="#FFF" />
        </g>
      </svg>
    )
  },
  {
    id: 'washi-sage-gingham',
    name: 'Washi ca-rô xanh sage',
    type: 'washi',
    category: 'washi',
    desc: 'Họa tiết gingham thanh bình thư thái',
    aspectRatio: '140/32',
    renderIcon: ({ className }) => (
      <svg viewBox="0 0 140 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className || 'w-28 h-7'}>
        <defs>
          <pattern id="washi-gingham-pat" width="16" height="16" patternUnits="userSpaceOnUse">
            <rect width="8" height="8" fill="#5F8269" fillOpacity="0.25" />
            <rect x="8" y="8" width="8" height="8" fill="#5F8269" fillOpacity="0.25" />
            <rect x="8" width="8" height="8" fill="#5F8269" fillOpacity="0.12" />
            <rect y="8" width="8" height="8" fill="#5F8269" fillOpacity="0.12" />
          </pattern>
        </defs>
        <path
          d="M4 2 L136 2 L138 7 L135 13 L138 18 L134 24 L138 30 L4 30 L2 25 L5 19 L1 13 L4 7 Z"
          fill="#EDF4EE"
          fillOpacity="0.9"
          stroke="#C8D8CB"
          strokeWidth="0.8"
        />
        <path
          d="M4 2 L136 2 L138 7 L135 13 L138 18 L134 24 L138 30 L4 30 L2 25 L5 19 L1 13 L4 7 Z"
          fill="url(#washi-gingham-pat)"
        />
      </svg>
    )
  },
  {
    id: 'washi-vintage-ruler',
    name: 'Washi thước kẻ cổ điển',
    type: 'washi',
    category: 'washi',
    desc: 'Vạch đo thời gian hoài niệm trên trang viết',
    aspectRatio: '140/30',
    renderIcon: ({ className }) => (
      <svg viewBox="0 0 140 30" fill="none" xmlns="http://www.w3.org/2000/svg" className={className || 'w-28 h-6'}>
        <path
          d="M3 2 L137 2 L139 7 L136 14 L138 20 L135 28 L3 28 L1 23 L4 16 L2 9 Z"
          fill="#ECE0D1"
          stroke="#C5B19E"
          strokeWidth="0.8"
        />
        {/* Tick marks */}
        {Array.from({ length: 26 }).map((_, i) => (
          <line
            key={i}
            x1={10 + i * 5}
            y1={2}
            x2={10 + i * 5}
            y2={i % 5 === 0 ? 14 : 8}
            stroke="#7C6048"
            strokeWidth={i % 5 === 0 ? 1.2 : 0.8}
            opacity="0.65"
          />
        ))}
      </svg>
    )
  },

  // --- VINTAGE POSTAGE & POSTAL MARKS ---
  {
    id: 'stamp-airmail-vn',
    name: 'Tem thư Air Mail cổ',
    type: 'postage',
    category: 'postage',
    desc: 'Tem viền răng cưa bưu chính truyền thống',
    aspectRatio: '68/84',
    renderIcon: ({ className }) => (
      <svg viewBox="0 0 68 84" fill="none" xmlns="http://www.w3.org/2000/svg" className={className || 'w-14 h-18'}>
        {/* Perforated edge stamp */}
        <rect x="4" y="4" width="60" height="76" rx="2" fill="#FAF6EE" stroke="#A27357" strokeWidth="1.2" />
        {/* Inner frame */}
        <rect x="8" y="8" width="52" height="68" rx="1" fill="#F4EBE1" stroke="#8C5A4B" strokeWidth="1" />
        <rect x="10" y="10" width="48" height="64" stroke="#8C5A4B" strokeWidth="0.5" strokeDasharray="2 2" />
        {/* Text */}
        <text x="34" y="21" textAnchor="middle" fontSize="6.5" fontFamily="serif" fontWeight="bold" fill="#7C4638" letterSpacing="0.8">
          AIR MAIL
        </text>
        {/* Central Dove Icon */}
        <path
          d="M26 44 C26 38 32 32 40 33 C44 33 46 36 46 39 C46 44 40 48 34 50 L30 52 L31 46 Z"
          fill="#A26250"
          opacity="0.8"
        />
        <circle cx="39" cy="35" r="1.2" fill="#FAF6EE" />
        <path d="M26 44 C22 41 20 37 18 36 C22 39 24 43 26 44 Z" fill="#7C4638" />
        <text x="34" y="65" textAnchor="middle" fontSize="6" fontFamily="serif" fill="#8C5A4B">
          VIỆT NAM
        </text>
        <text x="34" y="71" textAnchor="middle" fontSize="5" fontFamily="monospace" fill="#A27357">
          500đ • 2026
        </text>
      </svg>
    )
  },
  {
    id: 'stamp-lotus-vintage',
    name: 'Tem hoa sen bưu chính',
    type: 'postage',
    category: 'postage',
    desc: 'Biểu tượng hoa sen thanh khiết trên nền giấy dó',
    aspectRatio: '68/84',
    renderIcon: ({ className }) => (
      <svg viewBox="0 0 68 84" fill="none" xmlns="http://www.w3.org/2000/svg" className={className || 'w-14 h-18'}>
        <rect x="4" y="4" width="60" height="76" rx="2" fill="#FDF7F2" stroke="#B87B6C" strokeWidth="1.2" />
        <rect x="8" y="8" width="52" height="68" rx="1" fill="#FBF0E9" stroke="#A85C4B" strokeWidth="1" />
        <text x="34" y="20" textAnchor="middle" fontSize="6" fontFamily="serif" fontWeight="bold" fill="#8C4433">
          BƯU HOA
        </text>
        {/* Lotus Petals */}
        <g transform="translate(18, 28)" fill="#C26D5C" opacity="0.85">
          <path d="M16 4 C10 12 10 20 16 26 C22 20 22 12 16 4 Z" />
          <path d="M16 10 C8 15 6 22 13 25 C14 20 15 15 16 10 Z" opacity="0.8" />
          <path d="M16 10 C24 15 26 22 19 25 C18 20 17 15 16 10 Z" opacity="0.8" />
          <path d="M9 25 C12 28 20 28 23 25 C19 26 13 26 9 25 Z" fill="#6A8068" />
        </g>
        <text x="34" y="66" textAnchor="middle" fontSize="5.5" fontFamily="serif" fill="#7C3B2D">
          HẸN MỞ TƯƠNG LAI
        </text>
        <text x="34" y="72" textAnchor="middle" fontSize="5" fontFamily="monospace" fill="#A85C4B">
          ★ ★ ★
        </text>
      </svg>
    )
  },
  {
    id: 'stamp-postmark-round',
    name: 'Dấu mộc tròn bưu điện',
    type: 'stamp',
    category: 'postage',
    desc: 'Nhật ấn bưu cục hoài niệm màu mực đỏ nâu',
    aspectRatio: '72/72',
    renderIcon: ({ className }) => (
      <svg viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" className={className || 'w-16 h-16'}>
        <circle cx="36" cy="36" r="33" stroke="#8E3E2E" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.8" />
        <circle cx="36" cy="36" r="28" stroke="#8E3E2E" strokeWidth="1.2" opacity="0.9" />
        <circle cx="36" cy="36" r="21" stroke="#8E3E2E" strokeWidth="0.8" opacity="0.6" />
        <path d="M15 36 L57 36" stroke="#8E3E2E" strokeWidth="1" opacity="0.75" />
        <path d="M18 42 L54 42" stroke="#8E3E2E" strokeWidth="0.8" opacity="0.6" />
        <text x="36" y="20" textAnchor="middle" fontSize="5.5" fontFamily="serif" fontWeight="bold" fill="#8E3E2E" opacity="0.85">
          BƯU CHÍNH HẸN ƯỚC
        </text>
        <text x="36" y="32" textAnchor="middle" fontSize="5" fontFamily="monospace" fontWeight="bold" fill="#8E3E2E">
          ★ GỬI CHÍNH TÔI ★
        </text>
        <text x="36" y="52" textAnchor="middle" fontSize="5.5" fontFamily="monospace" fill="#8E3E2E">
          TIME CAPSULE
        </text>
      </svg>
    )
  },
  {
    id: 'stamp-waves-mark',
    name: 'Dấu sóng bưu chính',
    type: 'stamp',
    category: 'postage',
    desc: 'Vệt sóng bưu phẩm Par Avion',
    aspectRatio: '110/36',
    renderIcon: ({ className }) => (
      <svg viewBox="0 0 110 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className || 'w-24 h-8'}>
        <g stroke="#3A4D6B" strokeWidth="1.2" opacity="0.75">
          <path d="M5 10 Q 15 4, 25 10 T 45 10 T 65 10 T 85 10 T 105 10" />
          <path d="M5 18 Q 15 12, 25 18 T 45 18 T 65 18 T 85 18 T 105 18" />
          <path d="M5 26 Q 15 20, 25 26 T 45 26 T 65 26 T 85 26 T 105 26" />
        </g>
        <text x="55" y="34" textAnchor="middle" fontSize="5" fontFamily="serif" fill="#3A4D6B" letterSpacing="1" opacity="0.8">
          PAR AVION • CHUYỂN PHÁT NHANH
        </text>
      </svg>
    )
  },
  {
    id: 'stamp-wax-terracotta',
    name: 'Dấu sáp niêm phong đỏ đất',
    type: 'stamp',
    category: 'postage',
    desc: 'Con dấu sáp hoa văn cổ điển',
    aspectRatio: '60/60',
    renderIcon: ({ className }) => (
      <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className || 'w-14 h-14'}>
        {/* Wax melted irregular border */}
        <path
          d="M30 4 C38 3 48 8 52 16 C57 24 56 34 52 42 C47 51 38 56 30 56 C21 56 12 51 7 43 C2 35 3 24 8 16 C12 8 22 4 30 4 Z"
          fill="#9C3A27"
          stroke="#7A2B1C"
          strokeWidth="1.5"
        />
        <circle cx="30" cy="30" r="19" fill="#B84933" stroke="#D26B54" strokeWidth="1" />
        {/* Rose motif */}
        <path
          d="M30 18 C26 22 26 26 30 29 C34 26 34 22 30 18 Z M24 26 C28 27 29 31 27 34 C24 33 22 30 24 26 Z M36 26 C38 30 36 33 33 34 C31 31 32 27 36 26 Z"
          fill="#E89683"
        />
        <circle cx="30" cy="30" r="3.5" fill="#E89683" />
        <path d="M30 34 L30 42 M26 38 L34 38" stroke="#E89683" strokeWidth="1" strokeLinecap="round" />
      </svg>
    )
  },

  // --- CUTE MINI ILLUSTRATIONS ---
  {
    id: 'cute-sleepy-cat',
    name: 'Mèo lười cuộn tròn',
    type: 'cute',
    category: 'cute',
    desc: 'Chú mèo cuộn tròn sưởi nắng bình yên',
    aspectRatio: '56/56',
    renderIcon: ({ className }) => (
      <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" className={className || 'w-12 h-12'}>
        <circle cx="28" cy="28" r="22" fill="#FAF2E8" stroke="#8C5A4B" strokeWidth="1.5" />
        {/* Curled cat body */}
        <ellipse cx="28" cy="31" rx="15" ry="11" fill="#E8C39E" stroke="#7A4B3C" strokeWidth="1.2" />
        {/* Cat head */}
        <circle cx="20" cy="25" r="8" fill="#F4D3B2" stroke="#7A4B3C" strokeWidth="1.2" />
        {/* Ears */}
        <path d="M14 20 L16 14 L20 18 Z" fill="#D49A76" stroke="#7A4B3C" strokeWidth="1" />
        <path d="M21 18 L25 14 L26 20 Z" fill="#D49A76" stroke="#7A4B3C" strokeWidth="1" />
        {/* Sleeping eyes */}
        <path d="M16 25 Q18 27 20 25" stroke="#4A2E24" strokeWidth="1.2" strokeLinecap="round" />
        {/* Tail wrapped */}
        <path d="M39 34 C42 32 43 27 41 24 C40 22 38 23 37 25" stroke="#7A4B3C" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        {/* Zzz floating */}
        <text x="36" y="16" fontSize="7" fontFamily="sans-serif" fontWeight="bold" fill="#8C5A4B">
          z
        </text>
        <text x="42" y="12" fontSize="5" fontFamily="sans-serif" fontWeight="bold" fill="#B88A78">
          z
        </text>
      </svg>
    )
  },
  {
    id: 'cute-little-sprout',
    name: 'Mầm cây hy vọng',
    type: 'cute',
    category: 'cute',
    desc: 'Chồi non nhú lên tượng trưng cho sự trưởng thành',
    aspectRatio: '48/48',
    renderIcon: ({ className }) => (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className || 'w-11 h-11'}>
        <circle cx="24" cy="24" r="20" fill="#F0F6EE" stroke="#5E8364" strokeWidth="1.2" />
        {/* Soil mound */}
        <path d="M14 36 C18 32 30 32 34 36 Z" fill="#8C6747" opacity="0.8" />
        {/* Stem */}
        <path d="M24 34 Q 24 24 24 19" stroke="#4A7551" strokeWidth="2" strokeLinecap="round" fill="none" />
        {/* Two leaves */}
        <path d="M24 21 C20 17 14 19 14 24 C19 24 23 23 24 21 Z" fill="#71A079" stroke="#4A7551" strokeWidth="1" />
        <path d="M24 19 C28 15 34 17 34 22 C29 22 25 21 24 19 Z" fill="#8BB892" stroke="#4A7551" strokeWidth="1" />
      </svg>
    )
  },
  {
    id: 'cute-steaming-cup',
    name: 'Tách trà bình yên',
    type: 'cute',
    category: 'cute',
    desc: 'Ly trà nóng sưởi ấm tâm hồn những ngày lạnh',
    aspectRatio: '52/52',
    renderIcon: ({ className }) => (
      <svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg" className={className || 'w-11 h-11'}>
        <circle cx="26" cy="26" r="22" fill="#FAF5ED" stroke="#8C6E53" strokeWidth="1.2" />
        {/* Cup */}
        <path d="M16 22 L18 36 C18 39 21 41 26 41 C31 41 34 39 34 36 L36 22 Z" fill="#E8D5C4" stroke="#6E4A32" strokeWidth="1.2" />
        {/* Handle */}
        <path d="M35 24 C40 24 40 33 34 34" stroke="#6E4A32" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        {/* Saucer */}
        <ellipse cx="26" cy="42" rx="14" ry="2.5" fill="#D6C0AB" stroke="#6E4A32" strokeWidth="1" />
        {/* Steam */}
        <path d="M22 17 Q 20 13 22 9" stroke="#8C6E53" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.6" />
        <path d="M26 18 Q 28 14 26 10" stroke="#8C6E53" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.7" />
        <path d="M30 17 Q 29 13 31 9" stroke="#8C6E53" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.6" />
      </svg>
    )
  },
  {
    id: 'cute-paper-plane',
    name: 'Máy bay giấy ước mơ',
    type: 'cute',
    category: 'cute',
    desc: 'Gửi gắm những nguyện ước bay xa về tương lai',
    aspectRatio: '52/52',
    renderIcon: ({ className }) => (
      <svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg" className={className || 'w-11 h-11'}>
        <circle cx="26" cy="26" r="22" fill="#F0F5FA" stroke="#486B8C" strokeWidth="1.2" />
        {/* Flight dashed path */}
        <path d="M12 36 Q 16 30 22 34" stroke="#486B8C" strokeWidth="1" strokeDasharray="2 2" fill="none" opacity="0.6" />
        {/* Paper airplane */}
        <path d="M16 28 L40 14 L28 38 L25 30 Z" fill="#FFFFFF" stroke="#32506D" strokeWidth="1.2" />
        <path d="M40 14 L25 30 L28 38 Z" fill="#D4E3F0" stroke="#32506D" strokeWidth="1.2" />
        <path d="M25 30 L28 34 L31 30 Z" fill="#A8C5DE" stroke="#32506D" strokeWidth="0.8" />
      </svg>
    )
  },
  {
    id: 'cute-vintage-camera',
    name: 'Máy ảnh phim vintage',
    type: 'cute',
    category: 'cute',
    desc: 'Lưu giữ những khoảnh khắc quý báu',
    aspectRatio: '56/50',
    renderIcon: ({ className }) => (
      <svg viewBox="0 0 56 50" fill="none" xmlns="http://www.w3.org/2000/svg" className={className || 'w-12 h-11'}>
        {/* Camera body */}
        <rect x="6" y="14" width="44" height="30" rx="4" fill="#E8DDD1" stroke="#6E513E" strokeWidth="1.5" />
        {/* Leather middle band */}
        <rect x="6" y="22" width="44" height="16" fill="#8C5A4B" opacity="0.9" />
        {/* Top shutter bump */}
        <path d="M18 14 L22 9 L34 9 L38 14 Z" fill="#CBB6A3" stroke="#6E513E" strokeWidth="1.2" />
        {/* Lens */}
        <circle cx="28" cy="30" r="9" fill="#FAF6F0" stroke="#52392A" strokeWidth="1.5" />
        <circle cx="28" cy="30" r="6" fill="#4A3427" />
        <circle cx="26" cy="28" r="1.8" fill="#FFF" />
        {/* Flash & viewfinder */}
        <circle cx="42" cy="18" r="2" fill="#E07A5F" />
        <rect x="12" y="17" width="5" height="3" rx="0.5" fill="#333" />
      </svg>
    )
  },
  {
    id: 'cute-vintage-paperclip',
    name: 'Kẹp giấy đồng giữ góc',
    type: 'cute',
    category: 'cute',
    desc: 'Kẹp giấy hoài niệm giữ chặt trang thư',
    aspectRatio: '32/64',
    renderIcon: ({ className }) => (
      <svg viewBox="0 0 32 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className || 'w-7 h-14'}>
        <path
          d="M10 24 L10 50 C10 56 22 56 22 50 L22 14 C22 6 6 6 6 14 L6 46 C6 50 14 50 14 46 L14 24"
          stroke="#C08A3E"
          strokeWidth="2.8"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M10 24 L10 50 C10 56 22 56 22 50 L22 14 C22 6 6 6 6 14 L6 46 C6 50 14 50 14 46 L14 24"
          stroke="#F3DC9B"
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    )
  },
  {
    id: 'cute-antique-key',
    name: 'Chìa khóa cổ kỷ niệm',
    type: 'cute',
    category: 'cute',
    desc: 'Chìa khóa mở chiếc rương ký ức',
    aspectRatio: '36/68',
    renderIcon: ({ className }) => (
      <svg viewBox="0 0 36 68" fill="none" xmlns="http://www.w3.org/2000/svg" className={className || 'w-8 h-15'}>
        {/* Bow */}
        <circle cx="18" cy="14" r="10" fill="#E5C384" stroke="#8C6228" strokeWidth="1.5" />
        <circle cx="18" cy="14" r="5" fill="#FAF6EE" stroke="#8C6228" strokeWidth="1.2" />
        {/* Shaft */}
        <path d="M18 24 L18 58" stroke="#8C6228" strokeWidth="3" strokeLinecap="round" />
        {/* Bit teeth */}
        <path d="M18 46 L26 46 M18 52 L24 52 M18 56 L26 56" stroke="#8C6228" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: 'cute-four-leaf-clover',
    name: 'Cỏ bốn lá may mắn',
    type: 'cute',
    category: 'cute',
    desc: 'Gửi tặng một lời chúc may mắn và an lành',
    aspectRatio: '48/48',
    renderIcon: ({ className }) => (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className || 'w-11 h-11'}>
        <circle cx="24" cy="24" r="20" fill="#F2F8F0" stroke="#48784E" strokeWidth="1.2" />
        <g fill="#5B9A63" stroke="#3A6A40" strokeWidth="0.8">
          {/* 4 heart shaped leaves */}
          <path d="M24 24 C21 16 27 16 24 24 Z" />
          <path d="M24 24 C16 21 16 27 24 24 Z" />
          <path d="M24 24 C27 32 21 32 24 24 Z" />
          <path d="M24 24 C32 27 32 21 24 24 Z" />
          <circle cx="24" cy="17" r="4.5" />
          <circle cx="17" cy="24" r="4.5" />
          <circle cx="24" cy="31" r="4.5" />
          <circle cx="31" cy="24" r="4.5" />
        </g>
        {/* Stem */}
        <path d="M24 26 Q 28 36 34 38" stroke="#3A6A40" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      </svg>
    )
  },

  // --- CLASSIC EMOJI STAMPS (High Compatibility) ---
  {
    id: 'emoji-love-letter',
    name: 'Thư tình cảm',
    type: 'emoji',
    category: 'emojis',
    char: '💌',
    renderIcon: () => <span className="text-2xl sm:text-3xl select-none">💌</span>
  },
  {
    id: 'emoji-red-postbox',
    name: 'Hòm thư đỏ bưu điện',
    type: 'emoji',
    category: 'emojis',
    char: '📮',
    renderIcon: () => <span className="text-2xl sm:text-3xl select-none">📮</span>
  },
  {
    id: 'emoji-dove',
    name: 'Bồ câu đưa tin',
    type: 'emoji',
    category: 'emojis',
    char: '🕊️',
    renderIcon: () => <span className="text-2xl sm:text-3xl select-none">🕊️</span>
  },
  {
    id: 'emoji-quill',
    name: 'Bút lông chim',
    type: 'emoji',
    category: 'emojis',
    char: '🪶',
    renderIcon: () => <span className="text-2xl sm:text-3xl select-none">🪶</span>
  },
  {
    id: 'emoji-scroll',
    name: 'Cuộn giấy da',
    type: 'emoji',
    category: 'emojis',
    char: '📜',
    renderIcon: () => <span className="text-2xl sm:text-3xl select-none">📜</span>
  },
  {
    id: 'emoji-wax-seal-flower',
    name: 'Dấu hoa văn phong ấn',
    type: 'emoji',
    category: 'emojis',
    char: '🏵️',
    renderIcon: () => <span className="text-2xl sm:text-3xl select-none">🏵️</span>
  },
  {
    id: 'emoji-white-heart',
    name: 'Trái tim thuần khiết',
    type: 'emoji',
    category: 'emojis',
    char: '🤍',
    renderIcon: () => <span className="text-2xl sm:text-3xl select-none">🤍</span>
  },
  {
    id: 'emoji-brown-heart',
    name: 'Trái tim nâu mộc',
    type: 'emoji',
    category: 'emojis',
    char: '🤎',
    renderIcon: () => <span className="text-2xl sm:text-3xl select-none">🤎</span>
  },
  {
    id: 'emoji-teddy-hug',
    name: 'Gấu bông vỗ về',
    type: 'emoji',
    category: 'emojis',
    char: '🧸',
    renderIcon: () => <span className="text-2xl sm:text-3xl select-none">🧸</span>
  },
  {
    id: 'emoji-sparkles',
    name: 'Ánh sao lấp lánh',
    type: 'emoji',
    category: 'emojis',
    char: '✨',
    renderIcon: () => <span className="text-2xl sm:text-3xl select-none">✨</span>
  },
  {
    id: 'emoji-candle',
    name: 'Ngọn nến thơm',
    type: 'emoji',
    category: 'emojis',
    char: '🕯️',
    renderIcon: () => <span className="text-2xl sm:text-3xl select-none">🕯️</span>
  },
  {
    id: 'emoji-crescent-moon',
    name: 'Trăng đêm hoài niệm',
    type: 'emoji',
    category: 'emojis',
    char: '🌙',
    renderIcon: () => <span className="text-2xl sm:text-3xl select-none">🌙</span>
  },
  {
    id: 'emoji-coffee-cup',
    name: 'Tách cà phê ấm',
    type: 'emoji',
    category: 'emojis',
    char: '☕',
    renderIcon: () => <span className="text-2xl sm:text-3xl select-none">☕</span>
  },
  {
    id: 'emoji-olive-branch',
    name: 'Nhành lá ô-liu',
    type: 'emoji',
    category: 'emojis',
    char: '🌿',
    renderIcon: () => <span className="text-2xl sm:text-3xl select-none">🌿</span>
  },
  {
    id: 'emoji-cherry-blossom',
    name: 'Hoa anh đào phai',
    type: 'emoji',
    category: 'emojis',
    char: '🌸',
    renderIcon: () => <span className="text-2xl sm:text-3xl select-none">🌸</span>
  },
  {
    id: 'emoji-sunflower',
    name: 'Hoa hướng dương',
    type: 'emoji',
    category: 'emojis',
    char: '🌻',
    renderIcon: () => <span className="text-2xl sm:text-3xl select-none">🌻</span>
  },
  {
    id: 'emoji-wheat-stalk',
    name: 'Bông lúa chín',
    type: 'emoji',
    category: 'emojis',
    char: '🌾',
    renderIcon: () => <span className="text-2xl sm:text-3xl select-none">🌾</span>
  },
  {
    id: 'emoji-vintage-hourglass',
    name: 'Đồng hồ cát thời gian',
    type: 'emoji',
    category: 'emojis',
    char: '🕰️',
    renderIcon: () => <span className="text-2xl sm:text-3xl select-none">🕰️</span>
  }
];
