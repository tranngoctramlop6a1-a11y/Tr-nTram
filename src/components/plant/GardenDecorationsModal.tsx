import React from 'react';
import { motion } from 'motion/react';
import { X, Sparkles, Trophy, Calendar } from 'lucide-react';
import { GardenDecorationItem, PlantRewardItem } from '../../types';
import { SURPRISE_REWARDS_POOL } from './plantUtils';

interface GardenDecorationsModalProps {
  isOpen: boolean;
  unlockedDecorations: GardenDecorationItem[];
  rewards: PlantRewardItem[];
  onClose: () => void;
}

export const GardenDecorationsModal: React.FC<GardenDecorationsModalProps> = ({
  isOpen,
  unlockedDecorations,
  rewards,
  onClose
}) => {
  if (!isOpen) return null;

  const unlockedIds = new Set(unlockedDecorations.map((d) => d.type));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-amber-100 overflow-hidden my-auto"
      >
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-amber-50/90 via-emerald-50/70 to-amber-50/90 border-b border-amber-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 text-sm font-bold shadow-2xs">
              🏡
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-800">
                Góc vườn & Bộ sưu tập
              </h3>
              <p className="text-[11px] text-slate-500">
                Những món quà nhỏ ghé thăm theo từng ngày chăm sóc
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors border border-slate-200/60 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 max-h-[70vh] overflow-y-auto space-y-5">
          {/* Section 1: Garden Decorations */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Sinh vật & Trang trí vườn ({unlockedDecorations.length})</span>
              </h4>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { type: 'butterfly', name: 'Chú bướm', emoji: '🦋' },
                { type: 'mushroom', name: 'Nấm tí hon', emoji: '🍄' },
                { type: 'flower', name: 'Hoa dại', emoji: '🌸' },
                { type: 'ladybug', name: 'Bọ rùa', emoji: '🐞' },
                { type: 'cloud', name: 'Mây xốp', emoji: '☁️' },
                { type: 'moon', name: 'Vầng trăng', emoji: '🌙' },
                { type: 'star', name: 'Ngôi sao', emoji: '⭐' },
                { type: 'rainbow', name: 'Cầu vồng', emoji: '🌈' }
              ].map((item) => {
                const isUnlocked = unlockedIds.has(item.type as any);
                return (
                  <div
                    key={item.type}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      isUnlocked
                        ? 'bg-emerald-50/60 border-emerald-200 shadow-2xs'
                        : 'bg-slate-50/80 border-slate-200/60 opacity-45'
                    }`}
                  >
                    <div className="text-2xl mb-1">{item.emoji}</div>
                    <div className="text-[11px] font-bold text-slate-800 truncate">
                      {item.name}
                    </div>
                    <div className="text-[9px] text-slate-500 font-medium">
                      {isUnlocked ? 'Đang trong vườn' : 'Chưa ghé thăm'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Cards & Secret Quotes received */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span>💌</span>
                <span>Lời chúc & Thẻ quà đã nhận ({rewards.length})</span>
              </h4>
            </div>

            {rewards.length === 0 ? (
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 text-center text-xs text-slate-500">
                Hãy chăm sóc cây và bón phân mỗi ngày để nhận quà bất ngờ nhé 🌱
              </div>
            ) : (
              <div className="space-y-2">
                {rewards.slice(0, 10).map((r) => (
                  <div
                    key={r.id}
                    className="p-3 rounded-2xl bg-white border border-slate-100 shadow-2xs flex items-start gap-2.5"
                  >
                    <span className="text-xl shrink-0 mt-0.5">{r.emoji}</span>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-800">
                        {r.title}
                      </div>
                      <div className="text-[11px] text-slate-600 font-medium leading-relaxed mt-0.5">
                        {r.content}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </motion.div>
    </div>
  );
};
