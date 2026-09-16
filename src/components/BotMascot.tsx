import React from 'react';
import { BotMascotMood } from '../types';
import sproutAvatarImg from '../assets/images/sprout_avatar_1789540976938.jpg';

interface BotMascotProps {
  mood?: BotMascotMood;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isThinking?: boolean;
  className?: string;
  useIllustration?: boolean;
}

export const BotMascot: React.FC<BotMascotProps> = ({
  mood = 'happy',
  size = 'md',
  isThinking = false,
  className = '',
  useIllustration = false
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const getMoodEmoji = () => {
    switch (mood) {
      case 'empathy': return '🥺';
      case 'thinking': return '🤔';
      case 'idea': return '💡';
      case 'cheer': return '🫂';
      case 'happy':
      default: return '😊';
    }
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-rose-100 via-amber-50 to-teal-100 p-0.5 shadow-xs border border-rose-200/80 transition-all select-none ${sizeClasses[size]} ${isThinking ? 'animate-pulse' : ''} ${className}`}
      title={`Teen ơi! (${getMoodEmoji()})`}
    >
      <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-rose-50/60 to-amber-50/60 opacity-80" />

        {!useIllustration ? (
          /* New Official Avatar Image */
          <img
            src={sproutAvatarImg || '/avatar.jpg'}
            alt="Teen ơi! Avatar"
            className="w-full h-full object-cover relative z-10 transition-transform duration-300 hover:scale-105"
            referrerPolicy="no-referrer"
          />
        ) : (
          /* Legacy SVG Illustration fallback */
          <svg
            viewBox="0 0 100 100"
            className="w-[82%] h-[82%] relative z-10 drop-shadow-xs transition-transform duration-300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Sprout on top */}
            <path
              d="M50 22C46 12 36 14 38 22C42 22 47 24 50 26Z"
              fill="#34D399"
            />
            <path
              d="M50 22C54 12 64 14 62 22C58 22 53 24 50 26Z"
              fill="#10B981"
            />
            <path d="M50 26V30" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />

            {/* Lightbulb effect if idea */}
            {mood === 'idea' && (
              <circle cx="50" cy="18" r="7" fill="#FBBF24" className="animate-ping opacity-75" />
            )}

            {/* Main Head / Cloud Body */}
            <path
              d="M26 48C26 36 37 30 50 30C63 30 74 36 74 48C76 56 74 68 68 76C60 84 40 84 32 76C26 68 24 56 26 48Z"
              fill="#FFF1F2"
              stroke="#FDA4AF"
              strokeWidth="2.5"
            />

            {/* Rosy Cheeks */}
            <circle cx="34" cy="58" r="4.5" fill="#FDA4AF" opacity="0.7" />
            <circle cx="66" cy="58" r="4.5" fill="#FDA4AF" opacity="0.7" />

            {/* Eyes & Eyebrows based on mood */}
            {mood === 'happy' && (
              <>
                <path d="M38 50C40 46 44 46 46 50" stroke="#881337" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M54 50C56 46 60 46 62 50" stroke="#881337" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M44 60C47 64 53 64 56 60" stroke="#881337" strokeWidth="2.5" strokeLinecap="round" />
              </>
            )}

            {mood === 'empathy' && (
              <>
                <ellipse cx="41" cy="50" rx="3.5" ry="4.5" fill="#881337" />
                <circle cx="42" cy="48" r="1.5" fill="white" />
                <ellipse cx="59" cy="50" rx="3.5" ry="4.5" fill="#881337" />
                <circle cx="60" cy="48" r="1.5" fill="white" />
                <path d="M46 62C48 64 52 64 54 62" stroke="#881337" strokeWidth="2" strokeLinecap="round" />
              </>
            )}

            {mood === 'thinking' && (
              <>
                <circle cx="43" cy="48" r="3" fill="#881337" />
                <circle cx="61" cy="48" r="3" fill="#881337" />
                <path d="M40 43C42 41 45 42 46 43" stroke="#881337" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M54 42C56 44 59 43 61 44" stroke="#881337" strokeWidth="1.5" strokeLinecap="round" />
                <ellipse cx="50" cy="62" rx="2" ry="2.5" fill="#881337" />
              </>
            )}

            {mood === 'idea' && (
              <>
                <circle cx="41" cy="50" r="3.5" fill="#881337" />
                <circle cx="42.5" cy="48.5" r="1.5" fill="white" />
                <circle cx="59" cy="50" r="3.5" fill="#881337" />
                <circle cx="60.5" cy="48.5" r="1.5" fill="white" />
                <path d="M44 59C44 65 56 65 56 59Z" fill="#F43F5E" stroke="#881337" strokeWidth="1.5" />
              </>
            )}

            {mood === 'cheer' && (
              <>
                <path d="M37 51C39 47 43 47 45 51" stroke="#881337" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M55 51C57 47 61 47 63 51" stroke="#881337" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M28 58C24 64 28 70 34 68" stroke="#FDA4AF" strokeWidth="3" strokeLinecap="round" />
                <path d="M72 58C76 64 72 70 66 68" stroke="#FDA4AF" strokeWidth="3" strokeLinecap="round" />
                <path d="M45 61C48 65 52 65 55 61" stroke="#881337" strokeWidth="2.5" strokeLinecap="round" />
              </>
            )}
          </svg>
        )}

        {/* Small Mood Badge Indicator */}
        {mood !== 'happy' && (
          <span className="absolute -bottom-1 -right-1 text-[11px] leading-none bg-white/95 rounded-full px-0.5 py-0.5 shadow-xs border border-rose-100 z-20">
            {getMoodEmoji()}
          </span>
        )}
      </div>
    </div>
  );
};
