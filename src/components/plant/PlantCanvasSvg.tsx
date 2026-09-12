import React from 'react';
import { motion } from 'motion/react';
import { SeedGrowthEffect, PlantCareMessage } from '../../types';

interface PlantCanvasSvgProps {
  seedCount: number;
  stage: number; // 1 to 5
  isSowingAnim?: boolean;
  recentlyAddedEffect?: SeedGrowthEffect | null;
  encouragementMessages?: PlantCareMessage[];
  onPlantClick?: () => void;
}

export const PlantCanvasSvg: React.FC<PlantCanvasSvgProps> = ({
  seedCount,
  stage,
  isSowingAnim,
  recentlyAddedEffect,
  encouragementMessages = [],
  onPlantClick
}) => {
  // Deterministic micro-elements based on seed count
  // Each seed adds a leaf, bud, blossom, fruit, or firefly
  const leavesCount = Math.min(seedCount, 16);
  const flowersCount = seedCount >= 7 ? Math.min(seedCount - 6, 8) : 0;
  const fruitsCount = seedCount >= 13 ? Math.min(seedCount - 12, 6) : 0;
  const firefliesCount = seedCount >= 21 ? Math.min(seedCount - 20, 10) : 0;
  const [hoveredMessage, setHoveredMessage] = React.useState<PlantCareMessage | null>(null);

  const hasSunMessage = encouragementMessages.some((m) => m.visualEffect === 'sun');

  const ENCOURAGEMENT_SLOTS = [
    { x: 145, y: 135 },
    { x: 255, y: 140 },
    { x: 195, y: 105 },
    { x: 120, y: 185 },
    { x: 280, y: 180 },
    { x: 165, y: 165 },
    { x: 235, y: 160 },
    { x: 200, y: 65 },
    { x: 105, y: 145 },
    { x: 295, y: 140 },
    { x: 150, y: 220 },
    { x: 250, y: 215 },
  ];

  return (
    <div 
      className="relative w-full max-w-[340px] sm:max-w-[400px] h-[360px] sm:h-[420px] mx-auto flex items-end justify-center cursor-pointer select-none group"
      onClick={onPlantClick}
      title="Nhấn nhẹ để chào cái cây của bạn"
    >
      {/* Tooltip on hovering encouragement item */}
      {hoveredMessage && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-2 left-1/2 -translate-x-1/2 z-30 max-w-[280px] bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-lg border border-amber-200 text-center pointer-events-none"
        >
          <div className="text-[11px] font-semibold text-emerald-700 flex items-center justify-center gap-1">
            <span>{hoveredMessage.senderAvatar || '🌱'}</span>
            <span>{hoveredMessage.senderNickname}</span>
            <span className="text-gray-400 font-mono text-[10px]">({hoveredMessage.senderFriendId})</span>
          </div>
          <div className="text-xs text-gray-700 mt-0.5 line-clamp-2 italic">
            "{hoveredMessage.message}"
          </div>
        </motion.div>
      )}

      {/* Background Soft Glow & Sunlight */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />
      {hasSunMessage && (
        <div className="absolute top-4 right-6 w-36 h-36 bg-amber-200/50 rounded-full blur-2xl pointer-events-none animate-pulse" />
      )}
      {stage >= 4 && (
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none animate-pulse" />
      )}

      {/* Swaying wrapper when clicked or during sowing */}
      <motion.div
        animate={
          isSowingAnim
            ? { rotate: [0, -3, 3, -2, 2, 0], scale: [1, 1.05, 1] }
            : { rotate: 0 }
        }
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ rotate: [-2, 2, 0], scale: 0.98 }}
        className="w-full h-full relative flex items-end justify-center"
      >
        <svg
          viewBox="0 0 400 420"
          className="w-full h-full overflow-visible drop-shadow-sm"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="potGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FAF5EE" />
              <stop offset="50%" stopColor="#F4ECE1" />
              <stop offset="100%" stopColor="#E2D4C3" />
            </linearGradient>

            <linearGradient id="potRimGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EADECF" />
              <stop offset="50%" stopColor="#F9F4EB" />
              <stop offset="100%" stopColor="#E2D4C3" />
            </linearGradient>

            <linearGradient id="soilGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6C4E31" />
              <stop offset="100%" stopColor="#4A3422" />
            </linearGradient>

            <linearGradient id="stemGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="50%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>

            <linearGradient id="trunkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8A6844" />
              <stop offset="50%" stopColor="#6D4C2F" />
              <stop offset="100%" stopColor="#53371E" />
            </linearGradient>

            <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6EE7B7" />
              <stop offset="50%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>

            <linearGradient id="matureLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A7F3D0" />
              <stop offset="50%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>

            <linearGradient id="flowerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDA4AF" />
              <stop offset="100%" stopColor="#F43F5E" />
            </linearGradient>

            <linearGradient id="fruitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>

            <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.08" />
            </filter>

            <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Table / Surface Shadow */}
          <ellipse cx="200" cy="405" rx="140" ry="12" fill="#000" fillOpacity="0.06" />

          {/* ════════════════ POT & SOIL ════════════════ */}
          <g id="pot-group" filter="url(#softShadow)">
            {/* Pot Body */}
            <path
              d="M 130 320 L 145 395 C 146 400 152 404 160 404 L 240 404 C 248 404 254 400 255 395 L 270 320 Z"
              fill="url(#potGrad)"
              stroke="#D8C8B5"
              strokeWidth="1.5"
            />
            {/* Pot subtle vertical ribbing/contour */}
            <path d="M 170 325 L 178 395" stroke="#E6DACB" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
            <path d="M 230 325 L 222 395" stroke="#E6DACB" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />

            {/* Soil */}
            <ellipse cx="200" cy="320" rx="68" ry="15" fill="url(#soilGrad)" />
            {/* Soil pebbles / texture */}
            <ellipse cx="175" cy="322" rx="4" ry="2" fill="#8D6E53" opacity="0.7" />
            <ellipse cx="225" cy="321" rx="5" ry="2.5" fill="#5A3D24" opacity="0.6" />
            <ellipse cx="198" cy="325" rx="3.5" ry="2" fill="#8D6E53" opacity="0.8" />
            <ellipse cx="155" cy="319" rx="3" ry="1.5" fill="#422E1B" opacity="0.5" />
            <ellipse cx="242" cy="322" rx="3.5" ry="1.5" fill="#78593E" opacity="0.6" />

            {/* Pot Rim */}
            <ellipse
              cx="200"
              cy="316"
              rx="72"
              ry="16"
              fill="url(#potRimGrad)"
              stroke="#D3C3AF"
              strokeWidth="1.5"
            />

            {/* Cute pot motif / label: tiny stamped heart / plant emblem */}
            <g transform="translate(193, 355) scale(0.8)">
              <circle cx="9" cy="9" r="10" fill="#E8D9C8" opacity="0.7" />
              <path
                d="M 9 14 C 9 14 4 11 4 7.5 C 4 5.5 5.5 4 7.5 4 C 8.5 4 9 5 9 5 C 9 5 9.5 4 10.5 4 C 12.5 4 14 5.5 14 7.5 C 14 11 9 14 9 14 Z"
                fill="#C4B099"
              />
            </g>
          </g>

          {/* ════════════════ STAGE 1: SEEDLING / TINY SPROUT (0 - 2 seeds) ════════════════ */}
          {stage === 1 && (
            <g id="stage-1-sprout" className="transition-all duration-500">
              {seedCount === 0 ? (
                // 0 seeds: Just a tiny fresh green sprout peeking out of the soil mound
                <g transform="translate(0, 0)">
                  {/* Little earth mound */}
                  <ellipse cx="200" cy="317" rx="14" ry="5" fill="#5A3D24" opacity="0.8" />
                  
                  {/* Tiny stem */}
                  <path
                    d="M 200 318 Q 199 300 200 288"
                    stroke="url(#stemGrad)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  
                  {/* Two tiny cotyledon leaves */}
                  <path
                    d="M 200 288 C 190 280 185 292 200 293 Z"
                    fill="url(#leafGrad)"
                    stroke="#047857"
                    strokeWidth="0.5"
                  />
                  <path
                    d="M 200 288 C 210 280 215 292 200 293 Z"
                    fill="url(#leafGrad)"
                    stroke="#047857"
                    strokeWidth="0.5"
                  />
                  
                  {/* Dew drop */}
                  <circle cx="199" cy="286" r="2" fill="#E0F2FE" opacity="0.9" />
                </g>
              ) : (
                // 1-2 seeds: Growing sprout with tiny stem and reaching leaves
                <g>
                  {/* Stem */}
                  <path
                    d="M 200 318 Q 198 280 200 250"
                    stroke="url(#stemGrad)"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  {/* Left leaf */}
                  <path
                    d="M 199 270 C 175 258 175 285 198 274 Z"
                    fill="url(#leafGrad)"
                    stroke="#059669"
                    strokeWidth="0.5"
                  />
                  {/* Right leaf */}
                  <path
                    d="M 200 260 C 225 248 225 275 201 264 Z"
                    fill="url(#leafGrad)"
                    stroke="#059669"
                    strokeWidth="0.5"
                  />
                  {/* Top tender shoot */}
                  <path
                    d="M 200 250 C 192 235 208 235 200 250 Z"
                    fill="#A7F3D0"
                  />
                </g>
              )}
            </g>
          )}

          {/* ════════════════ STAGE 2: YOUNG PLANT (3 - 6 seeds) ════════════════ */}
          {stage === 2 && (
            <g id="stage-2-young-plant" className="transition-all duration-500">
              {/* Main Stem */}
              <path
                d="M 200 318 Q 195 260 202 200"
                stroke="url(#stemGrad)"
                strokeWidth="5"
                strokeLinecap="round"
              />
              {/* Side Branches */}
              <path d="M 198 280 Q 170 260 160 250" stroke="url(#stemGrad)" strokeWidth="3" strokeLinecap="round" />
              <path d="M 201 255 Q 230 240 240 230" stroke="url(#stemGrad)" strokeWidth="3" strokeLinecap="round" />
              <path d="M 199 225 Q 180 205 170 190" stroke="url(#stemGrad)" strokeWidth="2.5" strokeLinecap="round" />

              {/* Leaves */}
              <path d="M 160 250 C 135 235 140 270 160 252 Z" fill="url(#leafGrad)" />
              <path d="M 240 230 C 265 215 260 250 240 232 Z" fill="url(#leafGrad)" />
              <path d="M 170 190 C 150 175 155 205 170 192 Z" fill="url(#leafGrad)" />
              <path d="M 202 200 C 190 175 214 175 202 200 Z" fill="url(#leafGrad)" />
              <path d="M 185 240 C 165 228 170 255 186 242 Z" fill="url(#leafGrad)" />
              <path d="M 215 220 C 235 208 230 235 214 222 Z" fill="url(#leafGrad)" />
            </g>
          )}

          {/* ════════════════ STAGE 3: LARGER TREE / BUSH (7 - 12 seeds) ════════════════ */}
          {stage === 3 && (
            <g id="stage-3-bush" className="transition-all duration-500">
              {/* Wooden Trunk */}
              <path
                d="M 196 318 Q 194 270 198 220 L 204 220 Q 206 270 204 318 Z"
                fill="url(#trunkGrad)"
              />
              {/* Branches */}
              <path d="M 197 250 Q 160 230 145 205" stroke="url(#trunkGrad)" strokeWidth="4" strokeLinecap="round" />
              <path d="M 203 240 Q 240 220 255 195" stroke="url(#trunkGrad)" strokeWidth="4" strokeLinecap="round" />
              <path d="M 199 220 Q 185 180 180 160" stroke="url(#trunkGrad)" strokeWidth="3" strokeLinecap="round" />
              <path d="M 201 215 Q 215 175 225 155" stroke="url(#trunkGrad)" strokeWidth="3" strokeLinecap="round" />

              {/* Foliage Clusters */}
              <circle cx="145" cy="195" r="28" fill="url(#leafGrad)" />
              <circle cx="255" cy="185" r="28" fill="url(#leafGrad)" />
              <circle cx="180" cy="150" r="32" fill="url(#leafGrad)" />
              <circle cx="220" cy="145" r="32" fill="url(#matureLeafGrad)" />
              <circle cx="200" cy="130" r="34" fill="url(#leafGrad)" />

              {/* Leaf texture accents */}
              <path d="M 140 190 Q 130 170 145 180" stroke="#A7F3D0" strokeWidth="2" strokeLinecap="round" />
              <path d="M 255 180 Q 270 165 250 175" stroke="#A7F3D0" strokeWidth="2" strokeLinecap="round" />
              <path d="M 195 125 Q 200 105 205 125" stroke="#A7F3D0" strokeWidth="2" strokeLinecap="round" />
            </g>
          )}

          {/* ════════════════ STAGE 4: MATURE FLOWERING TREE (13 - 20 seeds) ════════════════ */}
          {stage === 4 && (
            <g id="stage-4-flowering-tree" className="transition-all duration-500">
              {/* Sturdy Trunk */}
              <path
                d="M 194 318 Q 192 250 197 180 L 205 180 Q 208 250 206 318 Z"
                fill="url(#trunkGrad)"
              />
              <path d="M 196 230 Q 140 210 120 180" stroke="url(#trunkGrad)" strokeWidth="5" strokeLinecap="round" />
              <path d="M 204 220 Q 260 200 280 170" stroke="url(#trunkGrad)" strokeWidth="5" strokeLinecap="round" />
              <path d="M 198 180 Q 165 140 155 110" stroke="url(#trunkGrad)" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M 202 180 Q 235 140 245 110" stroke="url(#trunkGrad)" strokeWidth="3.5" strokeLinecap="round" />

              {/* Lush Canopy Clouds */}
              <circle cx="125" cy="170" r="35" fill="url(#leafGrad)" />
              <circle cx="275" cy="160" r="35" fill="url(#leafGrad)" />
              <circle cx="155" cy="115" r="40" fill="url(#matureLeafGrad)" />
              <circle cx="245" cy="115" r="40" fill="url(#leafGrad)" />
              <circle cx="200" cy="95" r="45" fill="url(#matureLeafGrad)" />
              <circle cx="170" cy="145" r="35" fill="url(#leafGrad)" />
              <circle cx="230" cy="145" r="35" fill="url(#matureLeafGrad)" />

              {/* Blooming Flowers 🌸 */}
              {[
                { x: 120, y: 155 },
                { x: 280, y: 150 },
                { x: 150, y: 100 },
                { x: 250, y: 105 },
                { x: 200, y: 80 },
                { x: 185, y: 140 },
                { x: 220, y: 135 }
              ].map((pos, idx) => (
                <g key={`flower-${idx}`} transform={`translate(${pos.x}, ${pos.y}) scale(0.9)`}>
                  <circle cx="0" cy="0" r="8" fill="url(#flowerGrad)" />
                  <circle cx="-5" cy="-3" r="5" fill="#FFE4E6" />
                  <circle cx="5" cy="-3" r="5" fill="#FFE4E6" />
                  <circle cx="0" cy="5" r="5" fill="#FFE4E6" />
                  <circle cx="0" cy="0" r="3" fill="#FBBF24" />
                </g>
              ))}

              {/* Sweet fruits 🍎/🍊 */}
              {[
                { x: 140, y: 180 },
                { x: 260, y: 175 },
                { x: 180, y: 110 },
                { x: 225, y: 115 }
              ].map((pos, idx) => (
                <g key={`fruit-${idx}`} transform={`translate(${pos.x}, ${pos.y})`}>
                  <circle cx="0" cy="0" r="6" fill="url(#fruitGrad)" />
                  <path d="M 0 -6 Q 2 -9 4 -8" stroke="#4A3422" strokeWidth="1" fill="none" />
                </g>
              ))}
            </g>
          )}

          {/* ════════════════ STAGE 5: SPECIAL / VIBRANT TREE (21+ seeds) ════════════════ */}
          {stage === 5 && (
            <g id="stage-5-magical-tree" className="transition-all duration-500">
              {/* Grand Trunk with Roots */}
              <path
                d="M 192 318 Q 185 240 196 160 L 206 160 Q 215 240 208 318 Z"
                fill="url(#trunkGrad)"
              />
              {/* Exposed gentle roots hugging the soil */}
              <path d="M 193 315 Q 170 320 155 323" stroke="url(#trunkGrad)" strokeWidth="4" strokeLinecap="round" />
              <path d="M 207 315 Q 230 320 245 323" stroke="url(#trunkGrad)" strokeWidth="4" strokeLinecap="round" />

              {/* Spreading Majestic Branches */}
              <path d="M 194 220 Q 130 190 105 160" stroke="url(#trunkGrad)" strokeWidth="6" strokeLinecap="round" />
              <path d="M 206 210 Q 270 180 295 150" stroke="url(#trunkGrad)" strokeWidth="6" strokeLinecap="round" />
              <path d="M 197 160 Q 150 120 140 80" stroke="url(#trunkGrad)" strokeWidth="4" strokeLinecap="round" />
              <path d="M 203 160 Q 250 120 260 80" stroke="url(#trunkGrad)" strokeWidth="4" strokeLinecap="round" />

              {/* Majestic Canopy with Golden/Emerald Glow */}
              <circle cx="105" cy="150" r="42" fill="url(#leafGrad)" />
              <circle cx="295" cy="140" r="42" fill="url(#leafGrad)" />
              <circle cx="140" cy="85" r="46" fill="url(#matureLeafGrad)" />
              <circle cx="260" cy="85" r="46" fill="url(#matureLeafGrad)" />
              <circle cx="200" cy="65" r="52" fill="url(#matureLeafGrad)" />
              <circle cx="160" cy="120" r="42" fill="url(#leafGrad)" />
              <circle cx="240" cy="120" r="42" fill="url(#matureLeafGrad)" />

              {/* Flowers Everywhere */}
              {[
                { x: 100, y: 135 },
                { x: 300, y: 125 },
                { x: 135, y: 70 },
                { x: 265, y: 70 },
                { x: 200, y: 50 },
                { x: 170, y: 105 },
                { x: 230, y: 100 },
                { x: 125, y: 170 },
                { x: 275, y: 160 }
              ].map((pos, idx) => (
                <g key={`flower5-${idx}`} transform={`translate(${pos.x}, ${pos.y})`}>
                  <circle cx="0" cy="0" r="7" fill="url(#flowerGrad)" />
                  <circle cx="-4" cy="-2" r="4" fill="#FFE4E6" />
                  <circle cx="4" cy="-2" r="4" fill="#FFE4E6" />
                  <circle cx="0" cy="4" r="4" fill="#FFE4E6" />
                  <circle cx="0" cy="0" r="2.5" fill="#FBBF24" />
                </g>
              ))}

              {/* Glowing Golden Fruits */}
              {[
                { x: 115, y: 160 },
                { x: 285, y: 155 },
                { x: 150, y: 140 },
                { x: 250, y: 140 },
                { x: 185, y: 80 },
                { x: 215, y: 80 }
              ].map((pos, idx) => (
                <g key={`fruit5-${idx}`} transform={`translate(${pos.x}, ${pos.y})`}>
                  <circle cx="0" cy="0" r="6" fill="url(#fruitGrad)" />
                  <circle cx="-1.5" cy="-1.5" r="2" fill="#FEF08A" opacity="0.8" />
                </g>
              ))}

              {/* Magical Fireflies / Glowing Particles ✨ */}
              {[
                { x: 80, y: 110, s: 3 },
                { x: 320, y: 100, s: 3.5 },
                { x: 160, y: 40, s: 2.5 },
                { x: 240, y: 35, s: 3 },
                { x: 190, y: 180, s: 2 },
                { x: 220, y: 190, s: 2.5 },
                { x: 110, y: 220, s: 2.5 },
                { x: 290, y: 210, s: 3 }
              ].map((p, idx) => (
                <g key={`firefly-${idx}`} filter="url(#glowEffect)">
                  <circle cx={p.x} cy={p.y} r={p.s} fill="#FEF08A" />
                  <circle cx={p.x} cy={p.y} r={p.s * 2.2} fill="#FDE047" opacity="0.3" />
                </g>
              ))}
            </g>
          )}

          {/* Encouragement gifts from friends (🌸 flower, 🍃 leaf, ☀️ sun, 💧 dew, 🍎 fruit) */}
          {encouragementMessages.length > 0 && (
            <g id="encouragementGifts">
              {encouragementMessages.slice(0, ENCOURAGEMENT_SLOTS.length).map((msg, idx) => {
                const slot = ENCOURAGEMENT_SLOTS[idx % ENCOURAGEMENT_SLOTS.length];
                return (
                  <g
                    key={msg.id || `encourage-${idx}`}
                    transform={`translate(${slot.x}, ${slot.y})`}
                    className="cursor-pointer transition-transform hover:scale-125"
                    onMouseEnter={() => setHoveredMessage(msg)}
                    onMouseLeave={() => setHoveredMessage(null)}
                  >
                    {msg.visualEffect === 'flower' && (
                      <g>
                        <circle cx="0" cy="0" r="9" fill="#FDA4AF" opacity="0.4" />
                        <circle cx="0" cy="0" r="6.5" fill="#FB7185" />
                        <circle cx="-3.5" cy="-2" r="3.5" fill="#FFE4E6" />
                        <circle cx="3.5" cy="-2" r="3.5" fill="#FFE4E6" />
                        <circle cx="0" cy="3.5" r="3.5" fill="#FFE4E6" />
                        <circle cx="0" cy="0" r="2.5" fill="#FDE047" />
                      </g>
                    )}
                    {msg.visualEffect === 'leaf' && (
                      <g>
                        <circle cx="0" cy="0" r="8" fill="#6EE7B7" opacity="0.3" />
                        <path
                          d="M0 -8 C6 -4 6 4 0 8 C-6 4 -6 -4 0 -8 Z"
                          fill="#10B981"
                        />
                        <path d="M0 -6 L0 6" stroke="#A7F3D0" strokeWidth="1" />
                      </g>
                    )}
                    {msg.visualEffect === 'sun' && (
                      <g>
                        <circle cx="0" cy="0" r="9" fill="#FDE047" opacity="0.4" />
                        <circle cx="0" cy="0" r="5.5" fill="#F59E0B" />
                        <circle cx="0" cy="0" r="3.5" fill="#FEF08A" />
                        <line x1="0" y1="-8" x2="0" y2="-11" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
                        <line x1="0" y1="8" x2="0" y2="11" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
                        <line x1="-8" y1="0" x2="-11" y2="0" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
                        <line x1="8" y1="0" x2="11" y2="0" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
                      </g>
                    )}
                    {msg.visualEffect === 'dew' && (
                      <g>
                        <circle cx="0" cy="0" r="8" fill="#93C5FD" opacity="0.3" />
                        <path
                          d="M0 -7 C4 -2 4 4 0 6 C-4 4 -4 -2 0 -7 Z"
                          fill="#38BDF8"
                        />
                        <circle cx="-1" cy="0" r="1.2" fill="#FFFFFF" opacity="0.8" />
                      </g>
                    )}
                    {msg.visualEffect === 'fruit' && (
                      <g>
                        <circle cx="0" cy="0" r="7.5" fill="#EF4444" />
                        <circle cx="-1.5" cy="-1.5" r="2.5" fill="#FCA5A5" opacity="0.8" />
                        <path d="M0 -7 C2 -9 4 -8 5 -6" stroke="#059669" strokeWidth="1.5" fill="none" />
                      </g>
                    )}
                  </g>
                );
              })}
            </g>
          )}
        </svg>
      </motion.div>
    </div>
  );
};
