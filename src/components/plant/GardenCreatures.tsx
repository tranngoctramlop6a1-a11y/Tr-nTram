import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GardenDecorationItem } from '../../types';

interface GardenCreaturesProps {
  decorations: GardenDecorationItem[];
  activeIds?: string[];
  onRemoveDecoration?: (id: string) => void;
}

interface InteractiveEmojiWrapperProps {
  item: GardenDecorationItem;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onRemove?: (id: string) => void;
  children: React.ReactNode;
}

const InteractiveEmojiWrapper: React.FC<InteractiveEmojiWrapperProps> = ({
  item,
  isSelected,
  onToggleSelect,
  onRemove,
  children
}) => {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onToggleSelect(item.id);
      }}
      className="relative pointer-events-auto cursor-pointer inline-block group"
      title={`${item.name} • Chạm để hiện nút xóa`}
    >
      <div className="transition-transform duration-200 hover:scale-125 active:scale-95">
        {children}
      </div>

      {/* Floating compact delete button popover */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 4 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute -top-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 bg-stone-900/90 text-white px-2.5 py-0.5 rounded-full shadow-lg border border-stone-700/70 whitespace-nowrap backdrop-blur-2xs"
          >
            <span className="text-[10px] font-bold text-stone-200">{item.name}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove?.(item.id);
              }}
              className="w-4 h-4 rounded-full bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white flex items-center justify-center text-[10px] font-black cursor-pointer transition-colors shadow-2xs"
              title={`Xóa ${item.name} khỏi màn hình`}
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const GardenCreatures: React.FC<GardenCreaturesProps> = ({
  decorations,
  activeIds,
  onRemoveDecoration
}) => {
  const [selectedEmojiId, setSelectedEmojiId] = useState<string | null>(null);

  // Close popup if user clicks anywhere outside
  useEffect(() => {
    if (!selectedEmojiId) return;
    const handleClickOutside = () => setSelectedEmojiId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [selectedEmojiId]);

  // Filter decorations: if activeIds provided, only show those; otherwise show all unlocked
  const activeItems = activeIds
    ? decorations.filter((d) => activeIds.includes(d.id))
    : decorations;

  if (activeItems.length === 0) return null;

  const handleToggleSelect = (id: string) => {
    setSelectedEmojiId((curr) => (curr === id ? null : id));
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
      {activeItems.map((item) => {
        const isSelected = selectedEmojiId === item.id;

        switch (item.type) {
          // ── 1. 🦋 CHÚ BƯỚM NHỎ (Curved Flight & 3D Wing Flap) ──
          case 'butterfly':
            return (
              <motion.div
                key={item.id}
                animate={
                  isSelected
                    ? undefined
                    : {
                        x: [40, 180, 260, 150, 40],
                        y: [140, 90, 170, 230, 140],
                        rotate: [-10, 15, -12, 10, -10]
                      }
                }
                transition={{
                  duration: 14,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className="absolute top-0 left-0"
              >
                <InteractiveEmojiWrapper
                  item={item}
                  isSelected={isSelected}
                  onToggleSelect={handleToggleSelect}
                  onRemove={onRemoveDecoration}
                >
                  <motion.div
                    animate={{
                      scaleX: [1, -0.3, 1],
                      y: [-2, 2, -2]
                    }}
                    transition={{
                      duration: 0.32,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                    className="text-2xl sm:text-3xl filter drop-shadow-sm select-none"
                  >
                    🦋
                  </motion.div>
                </InteractiveEmojiWrapper>
              </motion.div>
            );

          // ── 2. 🐝 CHÚ ONG CHĂM CHỈ (Zigzag & Quick Vibration) ──
          case 'bee':
            return (
              <motion.div
                key={item.id}
                animate={
                  isSelected
                    ? undefined
                    : {
                        x: [240, 210, 170, 230, 240],
                        y: [160, 130, 180, 145, 160],
                        rotate: [5, -15, 20, -5, 5]
                      }
                }
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className="absolute top-0 left-0"
              >
                <InteractiveEmojiWrapper
                  item={item}
                  isSelected={isSelected}
                  onToggleSelect={handleToggleSelect}
                  onRemove={onRemoveDecoration}
                >
                  <motion.div
                    animate={{
                      scaleX: [1, 0.4, 1],
                      x: [-2, 2, -2]
                    }}
                    transition={{
                      duration: 0.16,
                      repeat: Infinity,
                      ease: 'linear'
                    }}
                    className="text-xl sm:text-2xl filter drop-shadow-xs select-none"
                  >
                    🐝
                  </motion.div>
                </InteractiveEmojiWrapper>
              </motion.div>
            );

          // ── 3. 🐦 CHÚ CHIM NON (Glancing & Fluttering) ──
          case 'bird':
            return (
              <motion.div
                key={item.id}
                animate={
                  isSelected
                    ? undefined
                    : {
                        y: [0, -3, 0],
                        rotate: [0, -8, 6, 0]
                      }
                }
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className="absolute top-[32%] right-[18%] text-2xl sm:text-3xl filter drop-shadow-xs select-none"
              >
                <InteractiveEmojiWrapper
                  item={item}
                  isSelected={isSelected}
                  onToggleSelect={handleToggleSelect}
                  onRemove={onRemoveDecoration}
                >
                  <span>🐦</span>
                </InteractiveEmojiWrapper>
              </motion.div>
            );

          // ── 4. 🐞 BỌ RÙA MAY MẮN (Slow Crawl on Pot / Soil Rim) ──
          case 'ladybug':
            return (
              <motion.div
                key={item.id}
                animate={
                  isSelected
                    ? undefined
                    : {
                        x: [0, 16, 24, 0],
                        y: [0, -2, -1, 0]
                      }
                }
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className="absolute bottom-[24%] left-[27%] text-lg sm:text-xl filter drop-shadow-xs select-none"
              >
                <InteractiveEmojiWrapper
                  item={item}
                  isSelected={isSelected}
                  onToggleSelect={handleToggleSelect}
                  onRemove={onRemoveDecoration}
                >
                  <span>🐞</span>
                </InteractiveEmojiWrapper>
              </motion.div>
            );

          // ── 5. 🌸 BÔNG HOA DẠI NỞ RỘ ──
          case 'flower':
            return (
              <motion.div
                key={item.id}
                animate={
                  isSelected
                    ? undefined
                    : {
                        rotate: [-3, 3, -3],
                        scale: [1, 1.05, 1]
                      }
                }
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className="absolute bottom-[22%] right-[24%] text-2xl sm:text-3xl filter drop-shadow-xs select-none"
              >
                <InteractiveEmojiWrapper
                  item={item}
                  isSelected={isSelected}
                  onToggleSelect={handleToggleSelect}
                  onRemove={onRemoveDecoration}
                >
                  <span>🌸</span>
                </InteractiveEmojiWrapper>
              </motion.div>
            );

          // ── 6. 🍄 CÂY NẤM TÍ HON ──
          case 'mushroom':
            return (
              <motion.div
                key={item.id}
                animate={
                  isSelected
                    ? undefined
                    : {
                        scaleY: [1, 1.08, 1]
                      }
                }
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className="absolute bottom-[20%] left-[22%] text-2xl filter drop-shadow-xs select-none"
              >
                <InteractiveEmojiWrapper
                  item={item}
                  isSelected={isSelected}
                  onToggleSelect={handleToggleSelect}
                  onRemove={onRemoveDecoration}
                >
                  <span>🍄</span>
                </InteractiveEmojiWrapper>
              </motion.div>
            );

          // ── 7. ☁️ ĐÁM MÂY BỒNG BỀNH ──
          case 'cloud':
            return (
              <motion.div
                key={item.id}
                animate={
                  isSelected
                    ? undefined
                    : {
                        x: [-20, 20, -20],
                        y: [-4, 4, -4]
                      }
                }
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className="absolute top-[18%] left-[12%] text-3xl opacity-80 filter drop-shadow-xs select-none"
              >
                <InteractiveEmojiWrapper
                  item={item}
                  isSelected={isSelected}
                  onToggleSelect={handleToggleSelect}
                  onRemove={onRemoveDecoration}
                >
                  <span>☁️</span>
                </InteractiveEmojiWrapper>
              </motion.div>
            );

          // ── 8. ⭐ ĐỐM SAO MAY MẮN ──
          case 'star':
            return (
              <motion.div
                key={item.id}
                animate={
                  isSelected
                    ? undefined
                    : {
                        scale: [0.85, 1.25, 0.85],
                        rotate: [0, 45, 90],
                        opacity: [0.7, 1, 0.7]
                      }
                }
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className="absolute top-[20%] right-[22%] text-2xl filter drop-shadow-[0_0_8px_rgba(253,224,71,0.8)] select-none"
              >
                <InteractiveEmojiWrapper
                  item={item}
                  isSelected={isSelected}
                  onToggleSelect={handleToggleSelect}
                  onRemove={onRemoveDecoration}
                >
                  <span>⭐</span>
                </InteractiveEmojiWrapper>
              </motion.div>
            );

          // ── 9. 🌙 VẦNG TRĂNG BẠC ──
          case 'moon':
            return (
              <motion.div
                key={item.id}
                animate={
                  isSelected
                    ? undefined
                    : {
                        y: [-3, 3, -3],
                        rotate: [-5, 5, -5]
                      }
                }
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className="absolute top-[14%] right-[14%] text-2xl sm:text-3xl filter drop-shadow-[0_0_10px_rgba(254,243,199,0.7)] select-none"
              >
                <InteractiveEmojiWrapper
                  item={item}
                  isSelected={isSelected}
                  onToggleSelect={handleToggleSelect}
                  onRemove={onRemoveDecoration}
                >
                  <span>🌙</span>
                </InteractiveEmojiWrapper>
              </motion.div>
            );

          // ── 10. 🌈 MẢNH CẦU VỒNG MINI ──
          case 'rainbow':
            return (
              <motion.div
                key={item.id}
                animate={
                  isSelected
                    ? undefined
                    : {
                        scale: [0.95, 1.05, 0.95],
                        opacity: [0.8, 1, 0.8]
                      }
                }
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className="absolute top-[15%] left-[20%] text-3xl filter drop-shadow-xs select-none"
              >
                <InteractiveEmojiWrapper
                  item={item}
                  isSelected={isSelected}
                  onToggleSelect={handleToggleSelect}
                  onRemove={onRemoveDecoration}
                >
                  <span>🌈</span>
                </InteractiveEmojiWrapper>
              </motion.div>
            );

          // ── 11. ✨ VẦNG HẠT SÁNG LẤP LÁNH ──
          case 'sparkles':
            return (
              <motion.div
                key={item.id}
                animate={
                  isSelected
                    ? undefined
                    : {
                        scale: [0.9, 1.2, 0.9],
                        rotate: [0, 180, 360],
                        opacity: [0.6, 1, 0.6]
                      }
                }
                transition={{
                  duration: 3.2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className="absolute top-[35%] left-[48%] text-2xl filter drop-shadow-xs select-none"
              >
                <InteractiveEmojiWrapper
                  item={item}
                  isSelected={isSelected}
                  onToggleSelect={handleToggleSelect}
                  onRemove={onRemoveDecoration}
                >
                  <span>✨</span>
                </InteractiveEmojiWrapper>
              </motion.div>
            );

          // ── 12. 🎈 BONG BÓNG ƯỚC NGUYỆN ──
          case 'balloon':
            return (
              <motion.div
                key={item.id}
                animate={
                  isSelected
                    ? undefined
                    : {
                        y: [-6, 6, -6],
                        rotate: [-6, 6, -6]
                      }
                }
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className="absolute top-[26%] left-[16%] text-3xl filter drop-shadow-xs select-none"
              >
                <InteractiveEmojiWrapper
                  item={item}
                  isSelected={isSelected}
                  onToggleSelect={handleToggleSelect}
                  onRemove={onRemoveDecoration}
                >
                  <span>🎈</span>
                </InteractiveEmojiWrapper>
              </motion.div>
            );

          // ── 13. 🍃 CHIẾC LÁ MAY MẮN ──
          case 'leaves':
            return (
              <motion.div
                key={item.id}
                animate={
                  isSelected
                    ? undefined
                    : {
                        x: [-15, 15, -15],
                        y: [-4, 6, -4],
                        rotate: [-15, 20, -15]
                      }
                }
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className="absolute top-[42%] right-[26%] text-2xl filter drop-shadow-xs select-none"
              >
                <InteractiveEmojiWrapper
                  item={item}
                  isSelected={isSelected}
                  onToggleSelect={handleToggleSelect}
                  onRemove={onRemoveDecoration}
                >
                  <span>🍃</span>
                </InteractiveEmojiWrapper>
              </motion.div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
};
