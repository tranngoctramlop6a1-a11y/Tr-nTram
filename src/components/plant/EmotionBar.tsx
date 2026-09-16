import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart } from 'lucide-react';
import { PlantEmotionType } from '../../types';
import { PLANT_EMOTIONS, WEATHER_CONFIG } from './plantUtils';

interface EmotionBarProps {
  selectedEmotion?: PlantEmotionType;
  onSelectEmotion: (emotion: PlantEmotionType) => void;
  onRemoveEmotion?: () => void;
}

export const EmotionBar: React.FC<EmotionBarProps> = ({
  selectedEmotion,
  onSelectEmotion,
  onRemoveEmotion
}) => {
  return (
    <div className="w-full bg-white/80 backdrop-blur-xs rounded-3xl p-4 sm:p-5 border border-amber-100/90 shadow-xs space-y-3">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-base sm:text-lg">💭</span>
          <div>
            <h3 className="text-xs sm:text-sm font-black text-slate-800 tracking-tight">
              Hôm nay cậu thấy thế nào?
            </h3>
            <p className="text-[11px] text-slate-500">
              Chọn để thay đổi bầu không khí của khu vườn
            </p>
          </div>
        </div>

        {selectedEmotion && (
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/80">
              {WEATHER_CONFIG[PLANT_EMOTIONS.find(e => e.id === selectedEmotion)?.weatherInfluence || 'sunny'].emoji}{' '}
              {WEATHER_CONFIG[PLANT_EMOTIONS.find(e => e.id === selectedEmotion)?.weatherInfluence || 'sunny'].name}
            </span>
            {onRemoveEmotion && (
              <button
                type="button"
                onClick={onRemoveEmotion}
                className="text-[11px] font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 px-2.5 py-1 rounded-full flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                title="Gỡ hạt giống cảm xúc khỏi chậu"
              >
                <span>✕</span>
                <span>Gỡ khỏi chậu</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Emotion Options - Horizontal scroll on small screens, wrap on larger */}
      <div className="flex sm:flex-wrap items-center gap-2 overflow-x-auto pb-1 pt-0.5 no-scrollbar scroll-smooth">
        {PLANT_EMOTIONS.map((item) => {
          const isSelected = selectedEmotion === item.id;
          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (isSelected && onRemoveEmotion) {
                  onRemoveEmotion();
                } else {
                  onSelectEmotion(item.id);
                }
              }}
              title={isSelected ? 'Nhấn để gỡ bỏ khỏi chậu' : item.description}
              className={`px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer border select-none ${
                isSelected
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm ring-2 ring-emerald-400/40'
                  : 'bg-white hover:bg-amber-50/70 text-slate-700 hover:text-slate-900 border-amber-100/80 hover:border-amber-200'
              }`}
            >
              <span className="text-base sm:text-lg leading-none">{item.emoji}</span>
              <span className="whitespace-nowrap">{item.label}</span>
              {isSelected && (
                <span className="text-[10px] bg-emerald-700/80 text-white px-1.5 py-0.2 rounded-full font-semibold ml-0.5">
                  ✕
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Reassurance text under selected emotion */}
      {selectedEmotion && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[11px] sm:text-xs text-slate-600 bg-amber-50/60 rounded-xl p-2.5 border border-amber-100/70 flex items-center gap-2"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>
            {PLANT_EMOTIONS.find((e) => e.id === selectedEmotion)?.description}
          </span>
        </motion.div>
      )}
    </div>
  );
};
