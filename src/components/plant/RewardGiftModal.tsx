import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Check, X, BookOpen, Package } from 'lucide-react';
import { PlantRewardItem } from '../../types';

interface RewardGiftModalProps {
  isOpen: boolean;
  reward: PlantRewardItem | null;
  onApplyGift?: (reward: PlantRewardItem) => void;
  onDeclineGift?: (reward: PlantRewardItem) => void;
  onClose: () => void;
}

export const RewardGiftModal: React.FC<RewardGiftModalProps> = ({
  isOpen,
  reward,
  onApplyGift,
  onDeclineGift,
  onClose
}) => {
  if (!isOpen || !reward) return null;

  const isPhysicalObject = reward.type === 'decoration' && !!reward.decoration;

  // Render dedicated preview animation for the reward
  const renderPreviewAnimation = () => {
    if (!isPhysicalObject || !reward.decoration) {
      return (
        <motion.div
          animate={{ scale: [1, 1.08, 1], rotate: [-2, 2, -2] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="text-5xl filter drop-shadow-md"
        >
          {reward.emoji}
        </motion.div>
      );
    }

    const type = reward.decoration.type;
    switch (type) {
      case 'butterfly':
        return (
          <motion.div
            animate={{
              x: [-12, 12, -12],
              y: [-8, 6, -8],
              rotate: [-12, 12, -12]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="text-5xl filter drop-shadow-md"
          >
            <motion.span
              animate={{ scaleX: [1, -0.4, 1] }}
              transition={{ duration: 0.3, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-block"
            >
              🦋
            </motion.span>
          </motion.div>
        );
      case 'bee':
        return (
          <motion.div
            animate={{
              x: [-15, 15, -15],
              y: [-6, 6, -6],
              rotate: [10, -10, 10]
            }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="text-5xl filter drop-shadow-md"
          >
            <motion.span
              animate={{ scaleX: [1, 0.4, 1] }}
              transition={{ duration: 0.15, repeat: Infinity, ease: 'linear' }}
              className="inline-block"
            >
              🐝
            </motion.span>
          </motion.div>
        );
      case 'bird':
        return (
          <motion.div
            animate={{
              y: [0, -6, 0],
              rotate: [0, -10, 8, 0]
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="text-5xl filter drop-shadow-md"
          >
            🐦
          </motion.div>
        );
      case 'ladybug':
        return (
          <motion.div
            animate={{
              x: [-10, 10, -10],
              rotate: [0, 8, -8, 0]
            }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            className="text-5xl filter drop-shadow-md"
          >
            🐞
          </motion.div>
        );
      case 'flower':
        return (
          <motion.div
            animate={{
              scale: [0.92, 1.12, 0.92],
              rotate: [-6, 6, -6]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="text-5xl filter drop-shadow-md"
          >
            🌸
          </motion.div>
        );
      case 'mushroom':
        return (
          <motion.div
            animate={{
              scaleY: [1, 1.15, 1]
            }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            className="text-5xl filter drop-shadow-md"
          >
            🍄
          </motion.div>
        );
      default:
        return (
          <motion.div
            animate={{
              scale: [0.9, 1.1, 0.9],
              rotate: [-5, 5, -5]
            }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
            className="text-5xl filter drop-shadow-md"
          >
            {reward.emoji}
          </motion.div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 20 }}
        className="relative w-full max-w-sm bg-gradient-to-b from-amber-50 via-white to-emerald-50 rounded-3xl p-6 shadow-2xl border-2 border-amber-200 text-center space-y-4 overflow-hidden"
      >
        {/* Confetti / Sparkle background effects */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-300/30 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-emerald-300/30 rounded-full blur-xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/80 hover:bg-white text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors border border-slate-200/60 cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Header Badge */}
        <div className="pt-1">
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${
            isPhysicalObject
              ? 'bg-amber-100 text-amber-900 border border-amber-200'
              : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
          }`}>
            {isPhysicalObject ? (
              <>
                <Package className="w-3.5 h-3.5" />
                <span>🎁 Cây tặng bạn một món quà!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>💌 Cây muốn nói với bạn...</span>
              </>
            )}
          </span>
        </div>

        {/* Animated Object / Mascot Stage */}
        <div className="relative inline-flex items-center justify-center my-2">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.5, ease: 'backOut' }}
            className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-100/90 via-white to-emerald-100/90 border-2 border-amber-300 flex items-center justify-center shadow-md relative"
          >
            {renderPreviewAnimation()}
          </motion.div>
          <span className="absolute -top-2 -right-2 text-xl animate-spin-slow">✨</span>
        </div>

        {/* Title */}
        <div>
          <h3 className="text-lg font-black text-slate-800">
            {reward.title}
          </h3>
          <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
            {isPhysicalObject ? 'Vật phẩm trang trí sinh động' : 'Lời nhắn vỗ về tâm hồn'}
          </p>
        </div>

        {/* Content / Heartwarming message */}
        <div className="bg-white/85 rounded-2xl p-4 border border-amber-100/90 shadow-2xs text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
          {reward.content}
        </div>

        {/* ════════════════ INTERACTIVE BUTTONS ACCORDING TO REWARD TYPE ════════════════ */}
        {isPhysicalObject ? (
          /* Case 1: Physical Object (Apply vs Ignore) */
          <div className="space-y-2 pt-1">
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => onApplyGift ? onApplyGift(reward) : onClose()}
                className="py-3 px-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-[0.98]"
              >
                <Check className="w-4 h-4" />
                <span>Áp dụng</span>
              </button>

              <button
                type="button"
                onClick={() => onDeclineGift ? onDeclineGift(reward) : onClose()}
                className="py-3 px-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs sm:text-sm shadow-2xs transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-[0.98]"
              >
                <X className="w-4 h-4 text-slate-400" />
                <span>Không áp dụng</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Vật phẩm sẽ luôn được lưu trong Bộ sưu tập của bạn để dùng bất kỳ lúc nào.
            </p>
          </div>
        ) : (
          /* Case 2: Advice / Quote (Single Read button) */
          <div className="pt-1">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <BookOpen className="w-4 h-4" />
              <span>Đã đọc 🌱</span>
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

