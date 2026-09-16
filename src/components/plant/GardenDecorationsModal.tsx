import React from 'react';
import { motion } from 'motion/react';
import { X, Sparkles, Check, EyeOff } from 'lucide-react';
import { GardenDecorationItem, PlantRewardItem } from '../../types';

interface GardenDecorationsModalProps {
  isOpen: boolean;
  unlockedDecorations: GardenDecorationItem[];
  activeDecorations?: string[];
  rewards: PlantRewardItem[];
  onToggleDecoration?: (id: string) => void;
  onClose: () => void;
}

export const GardenDecorationsModal: React.FC<GardenDecorationsModalProps> = ({
  isOpen,
  unlockedDecorations,
  activeDecorations,
  rewards,
  onToggleDecoration,
  onClose
}) => {
  if (!isOpen) return null;

  const unlockedMap = new Map(unlockedDecorations.map((d) => [d.id, d]));
  const unlockedTypes = new Set(unlockedDecorations.map((d) => d.type));

  const ALL_DECORATIONS_LIST = [
    { type: 'butterfly', defaultId: 'dec_butterfly', name: 'Chú bướm nhỏ', emoji: '🦋' },
    { type: 'bee', defaultId: 'dec_bee', name: 'Chú ong nhỏ', emoji: '🐝' },
    { type: 'bird', defaultId: 'dec_bird', name: 'Chim non ríu rít', emoji: '🐦' },
    { type: 'ladybug', defaultId: 'dec_ladybug', name: 'Bọ rùa đỏ', emoji: '🐞' },
    { type: 'flower', defaultId: 'dec_flower', name: 'Hoa dại nở rộ', emoji: '🌸' },
    { type: 'mushroom', defaultId: 'dec_mushroom', name: 'Nấm tí hon', emoji: '🍄' },
    { type: 'cloud', defaultId: 'dec_cloud', name: 'Mây xốp êm đềm', emoji: '☁️' },
    { type: 'star', defaultId: 'dec_star', name: 'Đốm sao may mắn', emoji: '⭐' },
    { type: 'moon', defaultId: 'dec_moon', name: 'Vầng trăng nhỏ', emoji: '🌙' },
    { type: 'rainbow', defaultId: 'dec_rainbow', name: 'Cầu vồng mini', emoji: '🌈' },
    { type: 'sparkles', defaultId: 'dec_sparkles', name: 'Hạt sáng lấp lánh', emoji: '✨' },
    { type: 'balloon', defaultId: 'dec_balloon', name: 'Bong bóng sắc màu', emoji: '🎈' },
    { type: 'leaves', defaultId: 'dec_leaves', name: 'Chiếc lá may mắn', emoji: '🍃' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-amber-100 overflow-hidden my-auto"
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
              <span className="text-[10px] text-slate-500 font-medium">
                Chạm để bật/tắt trong vườn
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {ALL_DECORATIONS_LIST.map((item) => {
                const unlockedItem = unlockedDecorations.find((d) => d.type === item.type || d.id === item.defaultId);
                const isUnlocked = !!unlockedItem;
                const itemId = unlockedItem ? unlockedItem.id : item.defaultId;
                
                // If activeDecorations is undefined, all unlocked items are active by default
                const isActive = isUnlocked && (!activeDecorations || activeDecorations.includes(itemId));

                return (
                  <button
                    key={item.type}
                    type="button"
                    disabled={!isUnlocked}
                    onClick={() => {
                      if (isUnlocked && onToggleDecoration) {
                        onToggleDecoration(itemId);
                      }
                    }}
                    className={`p-3 rounded-2xl border text-center transition-all relative ${
                      isUnlocked
                        ? isActive
                          ? 'bg-emerald-50/80 border-emerald-300 shadow-2xs hover:bg-emerald-100/70 cursor-pointer'
                          : 'bg-amber-50/40 border-amber-200/80 hover:bg-amber-50 cursor-pointer'
                        : 'bg-slate-50/80 border-slate-200/60 opacity-45 cursor-not-allowed'
                    }`}
                  >
                    <div className="text-3xl mb-1">{item.emoji}</div>
                    <div className="text-xs font-bold text-slate-800 truncate">
                      {item.name}
                    </div>
                    <div className="text-[10px] font-semibold mt-1 flex items-center justify-center gap-1">
                      {isUnlocked ? (
                        isActive ? (
                          <span className="text-emerald-700 flex items-center gap-0.5">
                            <Check className="w-3 h-3" /> Đang hiển thị
                          </span>
                        ) : (
                          <span className="text-amber-700 flex items-center gap-0.5">
                            <EyeOff className="w-3 h-3" /> Tạm cất
                          </span>
                        )
                      ) : (
                        <span className="text-slate-400">Chưa mở</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Cards & Secret Quotes received */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span>💌</span>
                <span>Lời nhắn & Thẻ bài đã nhận ({rewards.length})</span>
              </h4>
            </div>

            {rewards.length === 0 ? (
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 text-center text-xs text-slate-500">
                Hãy chăm sóc cây và bón phân mỗi ngày để nhận quà bất ngờ nhé 🌱
              </div>
            ) : (
              <div className="space-y-2">
                {rewards.slice(0, 15).map((r) => (
                  <div
                    key={r.id}
                    className="p-3 rounded-2xl bg-white border border-slate-100 shadow-2xs flex items-start gap-2.5"
                  >
                    <span className="text-2xl shrink-0 mt-0.5">{r.emoji}</span>
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
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </motion.div>
    </div>
  );
};

