import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Inbox } from 'lucide-react';

interface SeedBoxSvgProps {
  isOpen?: boolean;
  seedCount: number;
  onClick?: () => void;
  isReceivingSeed?: boolean;
}

export const SeedBoxSvg: React.FC<SeedBoxSvgProps> = ({
  isOpen = false,
  seedCount,
  onClick,
  isReceivingSeed = false
}) => {
  return (
    <div
      onClick={onClick}
      className="relative flex flex-col items-center cursor-pointer select-none group transition-transform active:scale-95"
      title="Hộp đựng cảm xúc - Nhấn để xem những điều đã gieo"
    >
      {/* Glow pulse when receiving seed */}
      {isReceivingSeed && (
        <div className="absolute -inset-4 bg-emerald-400/25 rounded-3xl blur-xl animate-ping pointer-events-none" />
      )}

      {/* SVG Box Graphic */}
      <div className="w-48 sm:w-56 h-32 sm:h-36 relative">
        <svg
          viewBox="0 0 240 160"
          className="w-full h-full overflow-visible drop-shadow-md"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradients for warm wooden/eco crafted box */}
            <linearGradient id="boxFrontGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#C29B72" />
              <stop offset="60%" stopColor="#AD855C" />
              <stop offset="100%" stopColor="#8C6641" />
            </linearGradient>

            <linearGradient id="boxInsideGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3E2714" />
              <stop offset="100%" stopColor="#5E3F24" />
            </linearGradient>

            <linearGradient id="boxLidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D4AF87" />
              <stop offset="50%" stopColor="#C29B72" />
              <stop offset="100%" stopColor="#9C744C" />
            </linearGradient>

            <linearGradient id="tagGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FAF7F2" />
              <stop offset="100%" stopColor="#EDE5D8" />
            </linearGradient>
          </defs>

          {/* Table shadow */}
          <ellipse cx="120" cy="150" rx="90" ry="8" fill="#000" fillOpacity="0.08" />

          {/* Box Inside (visible when open) */}
          <g id="box-interior">
            <path
              d="M 30 50 L 210 50 L 205 75 L 35 75 Z"
              fill="url(#boxInsideGrad)"
            />
            {/* Little folded paper / seeds tucked inside if seedCount > 0 */}
            {seedCount > 0 && (
              <g opacity="0.85">
                <circle cx="90" cy="62" r="7" fill="#FDFBF7" stroke="#D1C2A5" strokeWidth="1" />
                <circle cx="120" cy="60" r="8" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="0.8" />
                <circle cx="148" cy="63" r="6.5" fill="#DCFCE7" stroke="#10B981" strokeWidth="0.8" />
                {seedCount > 3 && (
                  <circle cx="106" cy="65" r="6" fill="#FCE7F3" stroke="#EC4899" strokeWidth="0.8" />
                )}
              </g>
            )}
          </g>

          {/* Box Main Body */}
          <g id="box-body">
            <path
              d="M 28 65 L 212 65 L 202 145 C 201 148 198 150 194 150 L 46 150 C 42 150 39 148 38 145 Z"
              fill="url(#boxFrontGrad)"
              stroke="#7A5633"
              strokeWidth="1.5"
            />

            {/* Wood planks / horizontal joint lines */}
            <path d="M 32 92 L 208 92" stroke="#7A5633" strokeWidth="1" opacity="0.35" />
            <path d="M 35 120 L 205 120" stroke="#7A5633" strokeWidth="1" opacity="0.35" />

            {/* Brass corner brackets */}
            <path d="M 30 70 L 40 70 L 40 80 L 32 80 Z" fill="#D97706" opacity="0.8" />
            <path d="M 210 70 L 200 70 L 200 80 L 208 80 Z" fill="#D97706" opacity="0.8" />
            <path d="M 40 148 L 50 148 L 50 140 L 42 140 Z" fill="#D97706" opacity="0.8" />
            <path d="M 200 148 L 190 148 L 190 140 L 198 140 Z" fill="#D97706" opacity="0.8" />

            {/* Label Tag on Box: "🌱 CẢM XÚC" */}
            <g transform="translate(68, 92)">
              {/* Twine thread holding tag */}
              <path d="M 52 -8 Q 52 0 52 6" stroke="#52391F" strokeWidth="1.2" />
              {/* Paper label tag */}
              <rect
                x="0"
                y="6"
                width="104"
                height="34"
                rx="6"
                fill="url(#tagGrad)"
                stroke="#C7B299"
                strokeWidth="1"
              />
              <circle cx="52" cy="11" r="2.5" fill="#52391F" />

              {/* Tag Text */}
              <text
                x="52"
                y="28"
                textAnchor="middle"
                fontSize="11"
                fontWeight="700"
                fill="#44321D"
                fontFamily="sans-serif"
                letterSpacing="0.5"
              >
                🌱 CẢM XÚC
              </text>
            </g>

            {/* Brass Clasp / Lock Plate */}
            <rect x="114" y="66" width="12" height="15" rx="2" fill="#F59E0B" stroke="#B45309" strokeWidth="0.8" />
            <circle cx="120" cy="74" r="2" fill="#78350F" />
          </g>

          {/* Animated Box Lid */}
          <motion.g
            id="box-lid"
            initial={false}
            animate={
              isOpen
                ? { rotate: -35, translateY: -15, transformOrigin: '28px 50px' }
                : { rotate: 0, translateY: 0 }
            }
            transition={{ type: 'spring', damping: 18, stiffness: 180 }}
          >
            <path
              d="M 22 48 C 22 46 25 44 28 44 L 212 44 C 215 44 218 46 218 48 L 216 66 L 24 66 Z"
              fill="url(#boxLidGrad)"
              stroke="#7A5633"
              strokeWidth="1.5"
            />
            {/* Wood grain line on lid */}
            <path d="M 30 55 L 210 55" stroke="#7A5633" strokeWidth="1" opacity="0.4" />

            {/* Brass top handle / loop */}
            <path
              d="M 104 44 Q 120 32 136 44"
              stroke="#D97706"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            <rect x="101" y="42" width="6" height="4" rx="1" fill="#92400E" />
            <rect x="133" y="42" width="6" height="4" rx="1" fill="#92400E" />
          </motion.g>
        </svg>
      </div>

      {/* Subtext info under the box */}
      <div className="mt-1 flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50/90 border border-amber-200/80 text-[11px] font-semibold text-amber-800 shadow-2xs group-hover:bg-amber-100 transition-colors">
        <Inbox className="w-3.5 h-3.5 text-amber-600" />
        <span>
          {seedCount === 0
            ? 'Hộp đang đợi hạt giống đầu tiên'
            : `${seedCount} hạt giống đã gieo • Nhấn để xem lại`}
        </span>
      </div>
    </div>
  );
};
