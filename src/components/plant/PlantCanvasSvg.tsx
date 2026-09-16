import React from 'react';
import { motion, AnimatePresence, TargetAndTransition } from 'motion/react';
import { SeedGrowthEffect, PlantWeatherType, GardenDecorationItem, PlantEmotionType } from '../../types';
import { WeatherEffects3D } from './WeatherEffects3D';
import { GardenCreatures } from './GardenCreatures';
import { PLANT_EMOTIONS } from './plantUtils';

interface PlantCanvasSvgProps {
  seedCount: number;
  stage: number; // 1 to 6
  weather?: PlantWeatherType;
  decorations?: GardenDecorationItem[];
  activeDecorations?: string[];
  todayEmotion?: PlantEmotionType;
  hasPendingGift?: boolean;
  isSowingAnim?: boolean;
  recentlyAddedEffect?: SeedGrowthEffect | null;
  onPlantClick?: () => void;
  onOpenGift?: () => void;
  onOpenRemoveEmotionModal?: () => void;
  onOpenEmotionPicker?: () => void;
  onRemoveDecoration?: (id: string) => void;
}

export const PlantCanvasSvg: React.FC<PlantCanvasSvgProps> = ({
  seedCount,
  stage,
  weather = 'sunny',
  decorations = [],
  activeDecorations,
  todayEmotion,
  hasPendingGift = false,
  isSowingAnim,
  recentlyAddedEffect,
  onPlantClick,
  onOpenGift,
  onOpenRemoveEmotionModal,
  onOpenEmotionPicker,
  onRemoveDecoration
}) => {
  const activeItems = activeDecorations
    ? decorations.filter((d) => activeDecorations.includes(d.id))
    : decorations;
  const decTypes = new Set(activeItems.map((d) => d.type));

  // Determine dynamic plant reaction animation based on weather & interactions
  const getPlantAnimation = (): TargetAndTransition => {
    if (isSowingAnim) {
      return {
        rotate: [0, -4, 4, -2, 2, 0],
        scale: [1, 1.08, 1],
        transition: { duration: 0.8, ease: 'easeInOut' }
      };
    }

    switch (weather) {
      case 'sunny':
      case 'gentle_sun':
        return {
          rotate: [-1, 1, -1],
          scale: [1, 1.015, 1],
          transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
        };
      case 'cloudy':
        return {
          rotate: [-0.6, 0.6, -0.6],
          transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' }
        };
      case 'windy':
        return {
          rotate: [0, 2.5, 0.8, 2, 0],
          transition: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' }
        };
      case 'rainy':
        return {
          rotate: [-1, 0.5, -0.8, 0],
          y: [0, 1.5, 0],
          transition: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
        };
      case 'heavy_rain':
        return {
          rotate: [-2.5, 3.5, -1.8, 2.5, 0],
          y: [0, 2.5, 0],
          transition: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }
        };
      case 'strong_wind':
        return {
          rotate: [0, 7.5, 8.5, 2, 0],
          transition: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' }
        };
      case 'night':
      case 'starry_night':
        return {
          rotate: [-0.5, 0.5, -0.5],
          transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' }
        };
      case 'rainbow':
        return {
          scale: [1, 1.02, 1],
          rotate: [-0.8, 0.8, -0.8],
          transition: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' }
        };
      default:
        return {
          rotate: 0
        };
    }
  };

  return (
    <div 
      className="relative w-full max-w-[360px] sm:max-w-[420px] h-[360px] sm:h-[430px] mx-auto flex items-end justify-center select-none group"
    >
      {/* ════════════════ 3D WEATHER ENVIRONMENT ════════════════ */}
      <WeatherEffects3D weather={weather} />

      {/* ════════════════ ANIMATED COMPANIONS & CREATURES ════════════════ */}
      <GardenCreatures
        decorations={decorations}
        activeIds={activeDecorations}
        onRemoveDecoration={onRemoveDecoration}
      />

      {/* ════════════════ SURPRISE PENDING GIFT (Notice & Bounce) ════════════════ */}
      <AnimatePresence>
        {hasPendingGift && (
          <motion.div
            initial={{ scale: 0, y: -20, opacity: 0 }}
            animate={{ scale: 1, y: [0, -8, 0], opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ y: { duration: 1.4, repeat: Infinity, ease: 'easeInOut' } }}
            onClick={(e) => {
              e.stopPropagation();
              onOpenGift?.();
            }}
            className="absolute top-6 sm:top-8 left-1/2 -translate-x-1/2 z-30 cursor-pointer group flex flex-col items-center"
          >
            <motion.div
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white font-black text-xs shadow-lg flex items-center gap-1.5 border border-amber-300"
            >
              <span>🎁</span>
              <span>Cây có quà tặng bạn! Nhấn mở</span>
            </motion.div>
            <div className="text-4xl filter drop-shadow-md mt-1 animate-bounce">
              🎁
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════════════════ PLANT SVG GRAPHIC ════════════════ */}
      <motion.div
        animate={getPlantAnimation()}
        style={{ transformOrigin: 'bottom center' }}
        whileHover={{ scale: 1.015 }}
        whileTap={{ rotate: [-2, 2, 0], scale: 0.985 }}
        onClick={onPlantClick}
        className="w-full h-full relative z-10 flex items-end justify-center cursor-pointer"
        title="Nhấn nhẹ để chào cái cây của bạn 🌱"
      >
        <svg
          viewBox="0 0 400 430"
          className="w-full h-full overflow-visible drop-shadow-xs"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
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
              <feDropShadow dx="0" dy="4" stdDeviation="5" floodOpacity="0.08" />
            </filter>

            <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Table / Surface Shadow */}
          <ellipse cx="200" cy="410" rx="140" ry="12" fill="#000" fillOpacity="0.06" />

          {/* ════════════════ POT & SOIL ════════════════ */}
          <g id="pot-group" filter="url(#softShadow)">
            {/* Pot Body */}
            <path
              d="M 130 325 L 145 400 C 146 405 152 409 160 409 L 240 409 C 248 409 254 405 255 400 L 270 325 Z"
              fill="url(#potGrad)"
              stroke="#D8C8B5"
              strokeWidth="1.5"
            />
            {/* Ribbing */}
            <path d="M 170 330 L 178 400" stroke="#E6DACB" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
            <path d="M 230 330 L 222 400" stroke="#E6DACB" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />

            {/* Soil */}
            <ellipse cx="200" cy="325" rx="68" ry="15" fill="url(#soilGrad)" />
            {/* Soil pebbles / texture */}
            <ellipse cx="175" cy="327" rx="4" ry="2" fill="#8D6E53" opacity="0.7" />
            <ellipse cx="225" cy="326" rx="5" ry="2.5" fill="#5A3D24" opacity="0.6" />
            <ellipse cx="198" cy="330" rx="3.5" ry="2" fill="#8D6E53" opacity="0.8" />
            <ellipse cx="155" cy="324" rx="3" ry="1.5" fill="#422E1B" opacity="0.5" />
            <ellipse cx="242" cy="327" rx="3.5" ry="1.5" fill="#78593E" opacity="0.6" />

            {/* Pot Rim */}
            <ellipse
              cx="200"
              cy="321"
              rx="72"
              ry="16"
              fill="url(#potRimGrad)"
              stroke="#D3C3AF"
              strokeWidth="1.5"
            />

            {/* Pot emblem */}
            <g transform="translate(193, 360) scale(0.8)">
              <circle cx="9" cy="9" r="10" fill="#E8D9C8" opacity="0.7" />
              <path
                d="M 9 14 C 9 14 4 11 4 7.5 C 4 5.5 5.5 4 7.5 4 C 8.5 4 9 5 9 5 C 9 5 9.5 4 10.5 4 C 12.5 4 14 5.5 14 7.5 C 14 11 9 14 9 14 Z"
                fill="#C4B099"
              />
            </g>
          </g>

          {/* ════════════════ UNLOCKED DECORATIONS ON SOIL / POT ════════════════ */}
          {/* Mushroom decoration */}
          {decTypes.has('mushroom') && (
            <g transform="translate(148, 312) scale(0.85)">
              <path d="M 12 18 L 12 28" stroke="#D1D5DB" strokeWidth="4" strokeLinecap="round" />
              <path d="M 4 18 C 4 10 20 10 20 18 Z" fill="#EF4444" />
              <circle cx="8" cy="14" r="1.5" fill="#FFFFFF" />
              <circle cx="14" cy="13" r="1.5" fill="#FFFFFF" />
            </g>
          )}

          {/* Flower on soil rim */}
          {decTypes.has('flower') && (
            <g transform="translate(242, 310) scale(0.85)">
              <circle cx="10" cy="10" r="5" fill="#FDA4AF" />
              <circle cx="10" cy="10" r="2.5" fill="#FDE047" />
            </g>
          )}

          {/* Ladybug on pot */}
          {decTypes.has('ladybug') && (
            <g transform="translate(160, 345) scale(0.7)">
              <ellipse cx="6" cy="6" rx="5" ry="4" fill="#DC2626" />
              <circle cx="9" cy="6" r="2" fill="#1F2937" />
              <circle cx="4" cy="4" r="1" fill="#1F2937" />
              <circle cx="4" cy="8" r="1" fill="#1F2937" />
            </g>
          )}

          {/* ════════════════ STAGE 1: 🌰 HẠT GIỐNG (Seed) ════════════════ */}
          {stage === 1 && (
            <g id="stage-1-seed" className="transition-all duration-500">
              {/* Earth mound */}
              <ellipse cx="200" cy="322" rx="16" ry="6" fill="#5A3D24" opacity="0.9" />

              {/* Seed pod / seed resting in soil */}
              <path
                d="M 194 322 C 194 316 206 316 206 322 C 206 326 194 326 194 322 Z"
                fill="#854D0E"
                stroke="#A16207"
                strokeWidth="1"
              />
              {/* Little sprout tip peeking out */}
              <path
                d="M 200 317 Q 198 308 201 302"
                stroke="#10B981"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="201" cy="301" r="2" fill="#34D399" />

              {/* Dew drop glimmer */}
              <circle cx="199" cy="318" r="1.5" fill="#E0F2FE" opacity="0.9" />
            </g>
          )}

          {/* ════════════════ STAGE 2: 🌱 MẦM NHỎ (Sprout) ════════════════ */}
          {stage === 2 && (
            <g id="stage-2-sprout" className="transition-all duration-500">
              {/* Stem */}
              <path
                d="M 200 323 Q 197 280 200 248"
                stroke="url(#stemGrad)"
                strokeWidth="4"
                strokeLinecap="round"
              />
              {/* Left cotyledon leaf */}
              <path
                d="M 199 270 C 172 258 172 288 198 274 Z"
                fill="url(#leafGrad)"
                stroke="#059669"
                strokeWidth="0.5"
              />
              {/* Right leaf */}
              <path
                d="M 200 260 C 228 248 228 278 201 264 Z"
                fill="url(#leafGrad)"
                stroke="#059669"
                strokeWidth="0.5"
              />
              {/* Tender shoot tip */}
              <path
                d="M 200 248 C 192 232 208 232 200 248 Z"
                fill="#A7F3D0"
              />
              {/* Dew drop */}
              <circle cx="188" cy="268" r="2" fill="#E0F2FE" opacity="0.8" />
            </g>
          )}

          {/* ════════════════ STAGE 3: 🌿 CÂY NON (Sapling) ════════════════ */}
          {stage === 3 && (
            <g id="stage-3-sapling" className="transition-all duration-500">
              {/* Main Stem */}
              <path
                d="M 200 323 Q 195 260 202 195"
                stroke="url(#stemGrad)"
                strokeWidth="5"
                strokeLinecap="round"
              />
              {/* Branches */}
              <path d="M 198 280 Q 170 260 160 248" stroke="url(#stemGrad)" strokeWidth="3" strokeLinecap="round" />
              <path d="M 201 255 Q 230 240 240 228" stroke="url(#stemGrad)" strokeWidth="3" strokeLinecap="round" />
              <path d="M 199 220 Q 175 200 165 185" stroke="url(#stemGrad)" strokeWidth="2.5" strokeLinecap="round" />

              {/* Leaves */}
              <path d="M 160 248 C 135 235 140 270 160 250 Z" fill="url(#leafGrad)" />
              <path d="M 240 228 C 265 215 260 250 240 230 Z" fill="url(#leafGrad)" />
              <path d="M 165 185 C 145 170 150 200 165 187 Z" fill="url(#leafGrad)" />
              <path d="M 202 195 C 190 170 214 170 202 195 Z" fill="url(#leafGrad)" />
              <path d="M 185 238 C 165 225 170 252 186 240 Z" fill="url(#leafGrad)" />
              <path d="M 215 218 C 235 205 230 232 214 220 Z" fill="url(#leafGrad)" />
            </g>
          )}

          {/* ════════════════ STAGE 4: 🪴 CÂY LỚN (Growing Plant/Bush) ════════════════ */}
          {stage === 4 && (
            <g id="stage-4-growing" className="transition-all duration-500">
              {/* Wooden Trunk */}
              <path
                d="M 196 323 Q 194 270 198 215 L 204 215 Q 206 270 204 323 Z"
                fill="url(#trunkGrad)"
              />
              {/* Branches */}
              <path d="M 197 250 Q 160 230 145 200" stroke="url(#trunkGrad)" strokeWidth="4" strokeLinecap="round" />
              <path d="M 203 240 Q 240 220 255 190" stroke="url(#trunkGrad)" strokeWidth="4" strokeLinecap="round" />
              <path d="M 199 215 Q 185 175 180 155" stroke="url(#trunkGrad)" strokeWidth="3" strokeLinecap="round" />
              <path d="M 201 210 Q 215 170 225 150" stroke="url(#trunkGrad)" strokeWidth="3" strokeLinecap="round" />

              {/* Foliage Clusters */}
              <circle cx="145" cy="190" r="28" fill="url(#leafGrad)" />
              <circle cx="255" cy="180" r="28" fill="url(#leafGrad)" />
              <circle cx="180" cy="145" r="32" fill="url(#leafGrad)" />
              <circle cx="220" cy="140" r="32" fill="url(#matureLeafGrad)" />
              <circle cx="200" cy="125" r="35" fill="url(#leafGrad)" />

              {/* Texture highlights */}
              <path d="M 140 185 Q 130 165 145 175" stroke="#A7F3D0" strokeWidth="2" strokeLinecap="round" />
              <path d="M 255 175 Q 270 160 250 170" stroke="#A7F3D0" strokeWidth="2" strokeLinecap="round" />
            </g>
          )}

          {/* ════════════════ STAGE 5: 🌳 CÂY TRƯỞNG THÀNH (Mature Tree) ════════════════ */}
          {stage === 5 && (
            <g id="stage-5-mature" className="transition-all duration-500">
              {/* Trunk */}
              <path
                d="M 194 323 Q 192 250 197 175 L 205 175 Q 208 250 206 323 Z"
                fill="url(#trunkGrad)"
              />
              <path d="M 196 230 Q 140 210 120 175" stroke="url(#trunkGrad)" strokeWidth="5" strokeLinecap="round" />
              <path d="M 204 220 Q 260 200 280 165" stroke="url(#trunkGrad)" strokeWidth="5" strokeLinecap="round" />
              <path d="M 198 175 Q 165 135 155 105" stroke="url(#trunkGrad)" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M 202 175 Q 235 135 245 105" stroke="url(#trunkGrad)" strokeWidth="3.5" strokeLinecap="round" />

              {/* Canopy */}
              <circle cx="125" cy="165" r="35" fill="url(#leafGrad)" />
              <circle cx="275" cy="155" r="35" fill="url(#leafGrad)" />
              <circle cx="155" cy="110" r="40" fill="url(#matureLeafGrad)" />
              <circle cx="245" cy="110" r="40" fill="url(#leafGrad)" />
              <circle cx="200" cy="90" r="45" fill="url(#matureLeafGrad)" />
              <circle cx="170" cy="140" r="35" fill="url(#leafGrad)" />
              <circle cx="230" cy="140" r="35" fill="url(#matureLeafGrad)" />

              {/* Flowers 🌸 */}
              {[
                { x: 120, y: 150 },
                { x: 280, y: 145 },
                { x: 150, y: 95 },
                { x: 250, y: 100 },
                { x: 200, y: 75 },
                { x: 185, y: 135 },
                { x: 220, y: 130 }
              ].map((pos, idx) => (
                <g key={`fl-${idx}`} transform={`translate(${pos.x}, ${pos.y}) scale(0.9)`}>
                  <circle cx="0" cy="0" r="8" fill="url(#flowerGrad)" />
                  <circle cx="-5" cy="-3" r="5" fill="#FFE4E6" />
                  <circle cx="5" cy="-3" r="5" fill="#FFE4E6" />
                  <circle cx="0" cy="5" r="5" fill="#FFE4E6" />
                  <circle cx="0" cy="0" r="3" fill="#FBBF24" />
                </g>
              ))}

              {/* Sweet fruits 🍎 */}
              {[
                { x: 140, y: 175 },
                { x: 260, y: 170 },
                { x: 180, y: 105 },
                { x: 225, y: 110 }
              ].map((pos, idx) => (
                <g key={`fr-${idx}`} transform={`translate(${pos.x}, ${pos.y})`}>
                  <circle cx="0" cy="0" r="6" fill="url(#fruitGrad)" />
                  <path d="M 0 -6 Q 2 -9 4 -8" stroke="#4A3422" strokeWidth="1" fill="none" />
                </g>
              ))}
            </g>
          )}

          {/* ════════════════ STAGE 6: ✨ CÂY ĐẶC BIỆT (Magical Bloom) ════════════════ */}
          {stage === 6 && (
            <g id="stage-6-magical" className="transition-all duration-500">
              {/* Grand Trunk with Roots */}
              <path
                d="M 192 323 Q 185 240 196 155 L 206 155 Q 215 240 208 323 Z"
                fill="url(#trunkGrad)"
              />
              <path d="M 193 320 Q 170 325 155 328" stroke="url(#trunkGrad)" strokeWidth="4" strokeLinecap="round" />
              <path d="M 207 320 Q 230 325 245 328" stroke="url(#trunkGrad)" strokeWidth="4" strokeLinecap="round" />

              {/* Spreading Branches */}
              <path d="M 194 215 Q 130 185 105 155" stroke="url(#trunkGrad)" strokeWidth="6" strokeLinecap="round" />
              <path d="M 206 205 Q 270 175 295 145" stroke="url(#trunkGrad)" strokeWidth="6" strokeLinecap="round" />
              <path d="M 197 155 Q 150 115 140 75" stroke="url(#trunkGrad)" strokeWidth="4" strokeLinecap="round" />
              <path d="M 203 155 Q 250 115 260 75" stroke="url(#trunkGrad)" strokeWidth="4" strokeLinecap="round" />

              {/* Majestic Canopy with Golden/Emerald Glow */}
              <circle cx="105" cy="145" r="42" fill="url(#leafGrad)" />
              <circle cx="295" cy="135" r="42" fill="url(#leafGrad)" />
              <circle cx="140" cy="80" r="46" fill="url(#matureLeafGrad)" />
              <circle cx="260" cy="80" r="46" fill="url(#matureLeafGrad)" />
              <circle cx="200" cy="60" r="52" fill="url(#matureLeafGrad)" />
              <circle cx="160" cy="115" r="42" fill="url(#leafGrad)" />
              <circle cx="240" cy="115" r="42" fill="url(#matureLeafGrad)" />

              {/* Flowers Everywhere */}
              {[
                { x: 100, y: 130 },
                { x: 300, y: 120 },
                { x: 135, y: 65 },
                { x: 265, y: 65 },
                { x: 200, y: 45 },
                { x: 170, y: 100 },
                { x: 230, y: 95 },
                { x: 125, y: 165 },
                { x: 275, y: 155 }
              ].map((pos, idx) => (
                <g key={`fl6-${idx}`} transform={`translate(${pos.x}, ${pos.y})`}>
                  <circle cx="0" cy="0" r="7" fill="url(#flowerGrad)" />
                  <circle cx="-4" cy="-2" r="4" fill="#FFE4E6" />
                  <circle cx="4" cy="-2" r="4" fill="#FFE4E6" />
                  <circle cx="0" cy="4" r="4" fill="#FFE4E6" />
                  <circle cx="0" cy="0" r="2.5" fill="#FBBF24" />
                </g>
              ))}

              {/* Glowing Golden Fruits */}
              {[
                { x: 115, y: 155 },
                { x: 285, y: 150 },
                { x: 150, y: 135 },
                { x: 250, y: 135 },
                { x: 185, y: 75 },
                { x: 215, y: 75 }
              ].map((pos, idx) => (
                <g key={`fr6-${idx}`} transform={`translate(${pos.x}, ${pos.y})`}>
                  <circle cx="0" cy="0" r="6" fill="url(#fruitGrad)" />
                  <circle cx="-1.5" cy="-1.5" r="2" fill="#FEF08A" opacity="0.8" />
                </g>
              ))}

              {/* Magical Fireflies / Glowing Particles ✨ */}
              {[
                { x: 80, y: 105, s: 3 },
                { x: 320, y: 95, s: 3.5 },
                { x: 160, y: 35, s: 2.5 },
                { x: 240, y: 30, s: 3 },
                { x: 190, y: 175, s: 2 },
                { x: 220, y: 185, s: 2.5 },
                { x: 110, y: 215, s: 2.5 },
                { x: 290, y: 205, s: 3 }
              ].map((p, idx) => (
                <g key={`firefly-${idx}`} filter="url(#glowEffect)">
                  <circle cx={p.x} cy={p.y} r={p.s} fill="#FEF08A" />
                  <circle cx={p.x} cy={p.y} r={p.s * 2.2} fill="#FDE047" opacity="0.3" />
                </g>
              ))}
            </g>
          )}
        </svg>
      </motion.div>

      {/* ════════════════ HẠT MẦM CẢM XÚC TRÊN CHẬU CÂY (Interactive Emotion Seed Badge) ════════════════ */}
      {todayEmotion ? (
        <div
          onClick={(e) => {
            e.stopPropagation();
            onOpenRemoveEmotionModal?.();
          }}
          className="absolute bottom-[5%] sm:bottom-[7%] left-1/2 -translate-x-1/2 z-25 group/seed cursor-pointer"
          title="Hạt mầm cảm xúc hôm nay • Nhấn để gỡ bỏ khỏi chậu"
        >
          <motion.div
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.94 }}
            className="bg-amber-50/95 hover:bg-white text-stone-800 border border-amber-300 shadow-sm hover:shadow-md px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full flex items-center gap-2 backdrop-blur-xs transition-all select-none"
          >
            <span
              className="text-base sm:text-lg leading-none animate-bounce"
              style={{ animationDuration: '3s' }}
            >
              {PLANT_EMOTIONS.find((e) => e.id === todayEmotion)?.emoji || '🌱'}
            </span>
            <div className="flex flex-col text-left">
              <span className="text-[9px] text-amber-800 font-semibold leading-none">Hạt mầm</span>
              <span className="text-xs font-black text-slate-800 leading-tight">
                {PLANT_EMOTIONS.find((e) => e.id === todayEmotion)?.label || 'Cảm xúc'}
              </span>
            </div>
            <span className="text-[10px] font-bold text-rose-600 bg-rose-50 group-hover/seed:bg-rose-100 px-1.5 py-0.5 rounded-full border border-rose-200/80 ml-0.5 flex items-center gap-0.5 transition-colors">
              <span>✕</span>
              <span className="hidden sm:inline">Gỡ</span>
            </span>
          </motion.div>
        </div>
      ) : (
        <div
          onClick={(e) => {
            e.stopPropagation();
            onOpenEmotionPicker?.();
          }}
          className="absolute bottom-[5%] sm:bottom-[7%] left-1/2 -translate-x-1/2 z-25 group/empty cursor-pointer"
          title="Chậu cây đang trống • Nhấn để chọn hoặc gieo cảm xúc hôm nay"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            className="bg-white/85 hover:bg-white text-stone-500 hover:text-emerald-700 border border-dashed border-stone-300 hover:border-emerald-400 px-3 py-1 rounded-full flex items-center gap-1.5 text-[11px] font-bold backdrop-blur-2xs transition-all shadow-2xs select-none"
          >
            <span className="text-emerald-600">🌱</span>
            <span>Chậu trống • Chạm để gieo</span>
          </motion.div>
        </div>
      )}
    </div>
  );
};
