import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart, Check, X } from 'lucide-react';
import { PlantRewardItem } from '../../types';

interface RewardGiftModalProps {
  isOpen: boolean;
  reward: PlantRewardItem | null;
  onClose: () => void;
}

export const RewardGiftModal: React.FC<RewardGiftModalProps> = ({
  isOpen,
  reward,
  onClose
}) => {
  if (!isOpen || !reward) return null;

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

        {/* Icon / Emoji badge */}
        <div className="relative inline-flex items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.25, 1], rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.6, ease: 'backOut' }}
            className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-100 to-emerald-100 border-2 border-amber-300 flex items-center justify-center text-4xl shadow-md"
          >
            {reward.emoji}
          </motion.div>
          <span className="absolute -top-2 -right-2 text-xl animate-spin-slow">✨</span>
        </div>

        {/* Title & category */}
        <div>
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-extrabold uppercase tracking-wider mb-1">
            {reward.decoration ? '🌱 Vật phẩm trang trí' : '💌 Quà tặng bất ngờ'}
          </span>
          <h3 className="text-lg font-black text-slate-800">
            {reward.title}
          </h3>
        </div>

        {/* Content / Heartwarming message */}
        <div className="bg-white/80 rounded-2xl p-3.5 border border-amber-100/80 shadow-2xs text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
          {reward.content}
        </div>

        {reward.decoration && (
          <p className="text-[11px] text-emerald-700 font-semibold">
            Đã được thêm vào góc vườn nhỏ của bạn! 🌸
          </p>
        )}

        {/* Action Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer"
        >
          Nhận lấy với niềm vui 🌱
        </button>
      </motion.div>
    </div>
  );
};
