import React from 'react';
import { motion } from 'motion/react';
import { PlantWeatherType } from '../../types';

interface WeatherEffects3DProps {
  weather: PlantWeatherType;
}

export const WeatherEffects3D: React.FC<WeatherEffects3DProps> = ({ weather }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl z-0 select-none">
      {/* ════════════════ 1. ☀️ NẮNG TO (Sunny) ════════════════ */}
      {weather === 'sunny' && (
        <div className="absolute inset-0 bg-gradient-to-b from-sky-400/25 via-amber-200/30 to-amber-100/10">
          {/* Big Sun in top right with rotating gentle rays */}
          <div className="absolute -top-10 -right-10 sm:top-2 sm:right-4 w-40 h-40 sm:w-48 sm:h-48 flex items-center justify-center">
            {/* Outer ambient glow */}
            <div className="absolute inset-0 rounded-full bg-amber-300/40 blur-3xl animate-pulse" />
            
            {/* Sun Rays (Rotating slowly) */}
            <motion.svg
              viewBox="0 0 200 200"
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              className="w-full h-full opacity-60"
            >
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                <line
                  key={deg}
                  x1="100"
                  y1="100"
                  x2={100 + 85 * Math.cos((deg * Math.PI) / 180)}
                  y2={100 + 85 * Math.sin((deg * Math.PI) / 180)}
                  stroke="#FDE047"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="16 12"
                  opacity="0.8"
                />
              ))}
            </motion.svg>

            {/* Sun Core Disc */}
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-100 shadow-[0_0_40px_rgba(251,191,36,0.8)] flex items-center justify-center text-4xl"
            >
              ☀️
            </motion.div>
          </div>

          {/* Sunlight beams casting across the garden */}
          <div className="absolute -top-12 right-0 w-96 h-96 bg-gradient-to-bl from-amber-300/30 via-yellow-200/15 to-transparent transform -rotate-12 blur-xl pointer-events-none" />

          {/* Moving warm sparkling dust motes */}
          {[
            { top: '25%', left: '30%', delay: 0, duration: 4 },
            { top: '40%', left: '70%', delay: 1.2, duration: 3.5 },
            { top: '65%', left: '45%', delay: 0.8, duration: 4.2 },
            { top: '20%', left: '60%', delay: 2, duration: 3.8 },
            { top: '55%', left: '20%', delay: 1.5, duration: 4.5 },
            { top: '75%', left: '75%', delay: 0.5, duration: 3.2 }
          ].map((mote, i) => (
            <motion.div
              key={`sun-mote-${i}`}
              animate={{
                y: [-10, 10, -10],
                x: [-6, 6, -6],
                opacity: [0.3, 0.9, 0.3],
                scale: [0.8, 1.3, 0.8]
              }}
              transition={{
                duration: mote.duration,
                repeat: Infinity,
                delay: mote.delay,
                ease: 'easeInOut'
              }}
              style={{ top: mote.top, left: mote.left }}
              className="absolute w-2 h-2 rounded-full bg-amber-300/90 shadow-[0_0_8px_rgba(252,211,77,0.9)]"
            />
          ))}
        </div>
      )}

      {/* ════════════════ 2. ☁️ MÂY XANH NHẸ (Cloudy / Blue Skies) ════════════════ */}
      {weather === 'cloudy' && (
        <div className="absolute inset-0 bg-gradient-to-b from-sky-300/30 via-sky-100/40 to-white/40">
          {/* Subtle soft daylight glow */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-80 h-32 bg-sky-200/40 rounded-full blur-3xl" />

          {/* Parallax Layer 1: Background Clouds (Slower, smaller, softer) */}
          <motion.div
            animate={{ x: [-80, 420] }}
            transition={{ duration: 36, repeat: Infinity, ease: 'linear' }}
            className="absolute top-8 left-0 opacity-55 text-4xl filter drop-shadow-xs"
          >
            ☁️
          </motion.div>
          <motion.div
            animate={{ x: [-60, 440] }}
            transition={{ duration: 42, repeat: Infinity, ease: 'linear', delay: 15 }}
            className="absolute top-20 left-0 opacity-45 text-5xl filter drop-shadow-xs"
          >
            ☁️
          </motion.div>

          {/* Parallax Layer 2: Foreground Clouds (Crisp pastel blue / white, gentle drift) */}
          <motion.div
            animate={{ x: [-100, 450] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear', delay: 4 }}
            className="absolute top-12 left-0 opacity-80 text-6xl filter drop-shadow-sm"
          >
            <span className="text-sky-200 drop-shadow-md">☁️</span>
          </motion.div>
          <motion.div
            animate={{ x: [-120, 450] }}
            transition={{ duration: 28, repeat: Infinity, ease: 'linear', delay: 18 }}
            className="absolute top-28 left-0 opacity-75 text-5xl filter drop-shadow-sm"
          >
            <span className="text-blue-100 drop-shadow-md">☁️</span>
          </motion.div>

          {/* Gentle ambient light particles */}
          <div className="absolute bottom-16 left-1/4 w-32 h-10 bg-sky-200/30 rounded-full blur-xl" />
        </div>
      )}

      {/* ════════════════ 3. 🍃 GIÓ NHẸ (Windy / Gentle Breeze) ════════════════ */}
      {weather === 'windy' && (
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-100/30 via-sky-50/40 to-transparent">
          {/* 3D Translucent flowing wind ribbons */}
          <svg viewBox="0 0 400 300" className="absolute inset-0 w-full h-full opacity-70">
            {/* Flowing Ribbon 1 */}
            <motion.path
              d="M -50 80 Q 80 50 200 90 T 450 70"
              fill="none"
              stroke="#A7F3D0"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="60 120"
              animate={{ strokeDashoffset: [200, -200] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            />
            {/* Flowing Ribbon 2 */}
            <motion.path
              d="M -60 140 Q 90 170 240 130 T 460 150"
              fill="none"
              stroke="#6EE7B7"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="80 140"
              animate={{ strokeDashoffset: [240, -240] }}
              transition={{ duration: 4.8, repeat: Infinity, ease: 'linear', delay: 0.6 }}
            />
            {/* Flowing Ribbon 3 */}
            <motion.path
              d="M -40 210 Q 120 180 260 220 T 450 190"
              fill="none"
              stroke="#BAE6FD"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="50 100"
              animate={{ strokeDashoffset: [180, -180] }}
              transition={{ duration: 3.6, repeat: Infinity, ease: 'linear', delay: 1.2 }}
            />
          </svg>

          {/* Floating leaves carried by the wind (Parallax horizontal movement) */}
          {[
            { top: '22%', duration: 4.5, delay: 0, scale: 0.9, emoji: '🍃' },
            { top: '48%', duration: 3.8, delay: 1.5, scale: 0.75, emoji: '🌱' },
            { top: '35%', duration: 5.2, delay: 2.3, scale: 1.1, emoji: '🍃' },
            { top: '70%', duration: 4.1, delay: 0.8, scale: 0.85, emoji: '🍂' },
            { top: '15%', duration: 4.8, delay: 3.1, scale: 0.7, emoji: '🍃' }
          ].map((leaf, idx) => (
            <motion.div
              key={`wind-leaf-${idx}`}
              initial={{ x: -40, opacity: 0 }}
              animate={{
                x: [ -40, 430 ],
                y: [ 0, 15, -15, 10, 0 ],
                rotate: [ -20, 45, 10, 70, 20 ],
                opacity: [ 0, 0.85, 0.9, 0.7, 0 ]
              }}
              transition={{
                duration: leaf.duration,
                repeat: Infinity,
                delay: leaf.delay,
                ease: 'easeInOut'
              }}
              style={{ top: leaf.top }}
              className="absolute text-sm select-none pointer-events-none"
            >
              {leaf.emoji}
            </motion.div>
          ))}
        </div>
      )}

      {/* ════════════════ 4. 🌧️ MƯA (Rainy / Gentle Rain) ════════════════ */}
      {weather === 'rainy' && (
        <div className="absolute inset-0 bg-gradient-to-b from-slate-400/25 via-sky-300/20 to-sky-100/30">
          {/* Muted calm rain lighting */}
          <div className="absolute top-0 inset-x-0 h-28 bg-slate-300/30 blur-2xl" />

          {/* Background Rain Layer (Finer, faster) */}
          <div className="absolute inset-0 overflow-hidden">
            {[10, 25, 40, 55, 70, 85, 95].map((left, idx) => (
              <motion.div
                key={`bg-rain-${idx}`}
                initial={{ y: -30, opacity: 0.6 }}
                animate={{ y: 450, opacity: 0 }}
                transition={{
                  duration: 0.9,
                  repeat: Infinity,
                  delay: (idx * 0.13) % 0.8,
                  ease: 'linear'
                }}
                style={{ left: `${left}%` }}
                className="absolute top-0 w-0.5 h-6 bg-gradient-to-b from-sky-300/80 to-transparent rounded-full transform -rotate-12"
              />
            ))}
          </div>

          {/* Foreground Rain Layer (Slightly thicker, visible drops) */}
          <div className="absolute inset-0 overflow-hidden">
            {[18, 32, 48, 64, 78, 90].map((left, idx) => (
              <motion.div
                key={`fg-rain-${idx}`}
                initial={{ y: -30, opacity: 0.85 }}
                animate={{ y: 450, opacity: 0 }}
                transition={{
                  duration: 0.75,
                  repeat: Infinity,
                  delay: (idx * 0.17) % 0.7,
                  ease: 'linear'
                }}
                style={{ left: `${left}%` }}
                className="absolute top-0 w-1 h-8 bg-gradient-to-b from-sky-400/90 to-transparent rounded-full transform -rotate-12"
              />
            ))}
          </div>

          {/* Damp ground moisture reflection */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-48 h-6 bg-sky-300/25 rounded-full blur-md" />
        </div>
      )}

      {/* ════════════════ 5. ⛈️ MƯA TO (Heavy Rain / Downpour) ════════════════ */}
      {weather === 'heavy_rain' && (
        <div className="absolute inset-0 bg-gradient-to-b from-slate-600/35 via-slate-500/25 to-sky-900/20">
          {/* Subtle Distant Soft Lightning Flash (Gentle, safe, non-scary, every 7s) */}
          <motion.div
            animate={{ opacity: [0, 0, 0.25, 0, 0.15, 0] }}
            transition={{
              duration: 7,
              repeat: Infinity,
              times: [0, 0.88, 0.90, 0.92, 0.94, 1],
              ease: 'easeInOut'
            }}
            className="absolute inset-0 bg-sky-100/40 pointer-events-none"
          />

          {/* Heavy Rain Streaks Layer 1 (Fast & angled) */}
          <div className="absolute inset-0 overflow-hidden">
            {[8, 16, 24, 33, 42, 50, 58, 67, 75, 83, 92].map((left, idx) => (
              <motion.div
                key={`heavy-rain-1-${idx}`}
                initial={{ y: -40, opacity: 0.7 }}
                animate={{ y: 460, opacity: 0 }}
                transition={{
                  duration: 0.55,
                  repeat: Infinity,
                  delay: (idx * 0.08) % 0.5,
                  ease: 'linear'
                }}
                style={{ left: `${left}%` }}
                className="absolute top-0 w-1 h-12 bg-gradient-to-b from-sky-300 to-transparent rounded-full transform -rotate-16"
              />
            ))}
          </div>

          {/* Heavy Rain Streaks Layer 2 (Closer, prominent drops) */}
          <div className="absolute inset-0 overflow-hidden">
            {[12, 28, 45, 62, 79, 94].map((left, idx) => (
              <motion.div
                key={`heavy-rain-2-${idx}`}
                initial={{ y: -50, opacity: 0.85 }}
                animate={{ y: 460, opacity: 0 }}
                transition={{
                  duration: 0.48,
                  repeat: Infinity,
                  delay: (idx * 0.11) % 0.45,
                  ease: 'linear'
                }}
                style={{ left: `${left}%` }}
                className="absolute top-0 w-1.5 h-16 bg-gradient-to-b from-sky-200/90 to-transparent rounded-full transform -rotate-16"
              />
            ))}
          </div>

          {/* Water Splash Ripples on Soil Rim */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-56 h-8 flex items-center justify-around opacity-60">
            {[0, 1, 2, 3].map((r) => (
              <motion.div
                key={`splash-${r}`}
                animate={{ scale: [0.5, 1.8], opacity: [0.8, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: r * 0.2, ease: 'easeOut' }}
                className="w-4 h-2 rounded-full border border-sky-300"
              />
            ))}
          </div>
        </div>
      )}

      {/* ════════════════ 6. 🌪️ GIÓ LỚN (Strong Wind / Gale) ════════════════ */}
      {weather === 'strong_wind' && (
        <div className="absolute inset-0 bg-gradient-to-b from-amber-200/20 via-slate-400/25 to-sky-100/30">
          {/* Swirling 3D Wind Gusts */}
          <svg viewBox="0 0 400 300" className="absolute inset-0 w-full h-full opacity-85">
            {/* Rapid Gust Wave 1 */}
            <motion.path
              d="M -80 70 Q 70 20 220 90 T 480 60"
              fill="none"
              stroke="#E2E8F0"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="100 120"
              animate={{ strokeDashoffset: [300, -300] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
            />
            {/* Rapid Gust Wave 2 */}
            <motion.path
              d="M -90 150 Q 80 200 250 130 T 490 170"
              fill="none"
              stroke="#CBD5E1"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray="120 140"
              animate={{ strokeDashoffset: [340, -340] }}
              transition={{ duration: 2.1, repeat: Infinity, ease: 'linear', delay: 0.3 }}
            />
            {/* Rapid Swirl Loop */}
            <motion.path
              d="M 120 180 C 180 140 220 210 200 180 C 180 150 250 160 380 180"
              fill="none"
              stroke="#94A3B8"
              strokeWidth="2"
              strokeDasharray="60 80"
              animate={{ strokeDashoffset: [200, -200] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
            />
          </svg>

          {/* Fast Swirling Leaves & Wind Dust Motes */}
          {[
            { top: '20%', duration: 1.6, delay: 0, scale: 1.1, emoji: '🍃' },
            { top: '38%', duration: 1.4, delay: 0.4, scale: 0.8, emoji: '🍂' },
            { top: '55%', duration: 1.8, delay: 0.8, scale: 1.2, emoji: '🍃' },
            { top: '72%', duration: 1.5, delay: 0.2, scale: 0.9, emoji: '🍂' },
            { top: '30%', duration: 1.3, delay: 0.9, scale: 1.0, emoji: '💨' }
          ].map((item, idx) => (
            <motion.div
              key={`gale-leaf-${idx}`}
              initial={{ x: -60, opacity: 0 }}
              animate={{
                x: [ -60, 460 ],
                y: [ 0, -20, 25, -15, 0 ],
                rotate: [ -60, 180, 360, 540 ],
                opacity: [ 0, 1, 0.9, 0 ]
              }}
              transition={{
                duration: item.duration,
                repeat: Infinity,
                delay: item.delay,
                ease: 'linear'
              }}
              style={{ top: item.top }}
              className="absolute text-base select-none pointer-events-none"
            >
              {item.emoji}
            </motion.div>
          ))}
        </div>
      )}

      {/* ════════════════ 7. 🌙 BAN ĐÊM + MẶT TRĂNG LỚN (Night) ════════════════ */}
      {(weather === 'night' || weather === 'starry_night') && (
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/70 via-slate-900/50 to-indigo-950/80">
          {/* BIG LUMINOUS MOON (Centerpiece) */}
          <div className="absolute top-4 left-6 sm:top-6 sm:left-8 flex items-center justify-center">
            {/* Moon Glow Halos */}
            <div className="absolute w-28 h-28 rounded-full bg-amber-100/30 blur-2xl animate-pulse" />
            <div className="absolute w-20 h-20 rounded-full bg-sky-200/20 blur-xl" />

            {/* Giant Moon Disc with Details */}
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-100 via-amber-50 to-sky-100 shadow-[0_0_30px_rgba(254,243,199,0.7)] border border-amber-200/80 flex items-center justify-center overflow-hidden"
            >
              {/* Moon craters */}
              <div className="absolute top-2 left-3 w-3.5 h-3.5 rounded-full bg-amber-200/50" />
              <div className="absolute bottom-3 left-4 w-4 h-4 rounded-full bg-amber-200/40" />
              <div className="absolute top-4 right-3 w-5 h-5 rounded-full bg-amber-200/45" />
              <div className="absolute bottom-2 right-4 w-2.5 h-2.5 rounded-full bg-amber-200/60" />
              <span className="text-2xl sm:text-3xl filter drop-shadow-xs opacity-80">🌙</span>
            </motion.div>
          </div>

          {/* Wispy Night Clouds drifting across the moon */}
          <motion.div
            animate={{ x: [-80, 420] }}
            transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
            className="absolute top-8 left-0 opacity-40 text-4xl"
          >
            ☁️
          </motion.div>

          {/* Twinkling Starfield */}
          {[
            { top: '15%', left: '42%', size: 3, delay: 0 },
            { top: '22%', left: '78%', size: 4, delay: 0.8 },
            { top: '10%', left: '88%', size: 3.5, delay: 1.5 },
            { top: '32%', left: '60%', size: 2.5, delay: 2.1 },
            { top: '45%', left: '85%', size: 3, delay: 0.4 },
            { top: '28%', left: '25%', size: 2, delay: 1.8 },
            { top: '8%', left: '65%', size: 3.5, delay: 1.1 },
            { top: '50%', left: '15%', size: 2.5, delay: 2.6 },
            { top: '60%', left: '72%', size: 3, delay: 0.7 },
            { top: '18%', left: '92%', size: 2.5, delay: 2.3 }
          ].map((star, idx) => (
            <motion.div
              key={`night-star-${idx}`}
              animate={{
                opacity: [0.2, 1, 0.2],
                scale: [0.8, 1.4, 0.8]
              }}
              transition={{
                duration: 2.5 + (idx % 3),
                repeat: Infinity,
                delay: star.delay,
                ease: 'easeInOut'
              }}
              style={{
                top: star.top,
                left: star.left,
                width: `${star.size}px`,
                height: `${star.size}px`
              }}
              className="absolute rounded-full bg-amber-100 shadow-[0_0_6px_rgba(254,243,199,0.9)]"
            />
          ))}

          {/* Soft Moonlight Beam beaming down onto the plant */}
          <div className="absolute top-8 left-12 w-64 h-80 bg-gradient-to-br from-amber-100/15 via-sky-200/10 to-transparent transform rotate-12 blur-2xl pointer-events-none" />
        </div>
      )}

      {/* ════════════════ 8. 🌈 CẦU VỒNG (Rainbow) ════════════════ */}
      {weather === 'rainbow' && (
        <div className="absolute inset-0 bg-gradient-to-b from-rose-100/40 via-sky-100/40 to-amber-50/40">
          {/* Large Arc Rainbow behind plant with gradual fade-in & shimmer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{
              opacity: [0.85, 0.95, 0.85],
              scale: [1, 1.015, 1],
              filter: ['brightness(1)', 'brightness(1.15)', 'brightness(1)']
            }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-2 sm:top-4 left-1/2 -translate-x-1/2 w-[340px] sm:w-[400px] h-[200px] pointer-events-none"
          >
            <svg viewBox="0 0 300 160" className="w-full h-full overflow-visible">
              <defs>
                <filter id="rainbowGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              <g filter="url(#rainbowGlow)">
                {/* Red/Rose */}
                <path d="M 20 160 A 130 130 0 0 1 280 160" fill="none" stroke="#FB7185" strokeWidth="5.5" opacity="0.85" />
                {/* Orange */}
                <path d="M 26 160 A 124 124 0 0 1 274 160" fill="none" stroke="#FB923C" strokeWidth="5.5" opacity="0.85" />
                {/* Yellow */}
                <path d="M 32 160 A 118 118 0 0 1 268 160" fill="none" stroke="#FDE047" strokeWidth="5.5" opacity="0.85" />
                {/* Green */}
                <path d="M 38 160 A 112 112 0 0 1 262 160" fill="none" stroke="#4ADE80" strokeWidth="5.5" opacity="0.85" />
                {/* Blue */}
                <path d="M 44 160 A 106 106 0 0 1 256 160" fill="none" stroke="#38BDF8" strokeWidth="5.5" opacity="0.85" />
                {/* Purple */}
                <path d="M 50 160 A 100 100 0 0 1 250 160" fill="none" stroke="#C084FC" strokeWidth="5.5" opacity="0.85" />
              </g>
            </svg>
          </motion.div>

          {/* Pastel Clouds framing rainbow bases */}
          <motion.div
            animate={{ x: [-6, 6, -6] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-28 left-4 text-3xl opacity-75"
          >
            ☁️
          </motion.div>
          <motion.div
            animate={{ x: [6, -6, 6] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-28 right-4 text-3xl opacity-75"
          >
            ☁️
          </motion.div>

          {/* Rainbow Shimmer Sparkles */}
          {[
            { top: '15%', left: '30%', delay: 0 },
            { top: '10%', left: '50%', delay: 0.7 },
            { top: '18%', left: '70%', delay: 1.4 },
            { top: '30%', left: '20%', delay: 2.1 },
            { top: '25%', left: '80%', delay: 1.0 }
          ].map((sparkle, idx) => (
            <motion.div
              key={`rainbow-sparkle-${idx}`}
              animate={{
                scale: [0, 1.4, 0],
                rotate: [0, 90, 180],
                opacity: [0, 0.9, 0]
              }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                delay: sparkle.delay,
                ease: 'easeInOut'
              }}
              style={{ top: sparkle.top, left: sparkle.left }}
              className="absolute text-base pointer-events-none"
            >
              ✨
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
