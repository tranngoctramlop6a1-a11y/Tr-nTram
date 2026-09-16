import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sprout, Trash2, Heart, RotateCcw, Sparkles } from 'lucide-react';
import { PlantEmotionType } from '../../types';
import { PLANT_EMOTIONS, WEATHER_CONFIG } from './plantUtils';

interface RemoveSeedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmRemove: (deleteTodayPaperSeed: boolean) => void;
  todayEmotion?: PlantEmotionType;
  hasTodayPaperSeed?: boolean;
}

export const RemoveSeedModal: React.FC<RemoveSeedModalProps> = ({
  isOpen,
  onClose,
  onConfirmRemove,
  todayEmotion,
  hasTodayPaperSeed = false
}) => {
  const [deletePaperSeed, setDeletePaperSeed] = useState<boolean>(true);

  if (!isOpen) return null;

  const currentEmotionOpt = PLANT_EMOTIONS.find((e) => e.id === todayEmotion);
  const weatherConfig = currentEmotionOpt
    ? WEATHER_CONFIG[currentEmotionOpt.weatherInfluence]
    : WEATHER_CONFIG.sunny;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-md bg-[#FAF8F5] rounded-3xl shadow-2xl border border-amber-200/90 overflow-hidden my-auto"
      >
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-amber-50 via-rose-50/70 to-amber-50 border-b border-amber-100/90 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-700 shadow-2xs">
              <Sprout className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-800">
                Gỡ hạt mầm cảm xúc khỏi chậu
              </h3>
              <p className="text-[11px] text-slate-500">
                Trả lại trạng thái chậu trống để chọn lại
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors border border-slate-200/60 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Planted Emotion Preview Card */}
          {currentEmotionOpt ? (
            <div className="bg-white rounded-2xl p-4 border border-amber-200/80 shadow-2xs flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-2xl shrink-0 shadow-2xs">
                {currentEmotionOpt.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-black text-slate-800">
                    {currentEmotionOpt.label}
                  </h4>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded-full border border-emerald-200">
                    {weatherConfig.emoji} {weatherConfig.name}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                  {currentEmotionOpt.description}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-4 border border-amber-200/80 shadow-2xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center text-xl">
                🌱
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">Hạt giống hôm nay</h4>
                <p className="text-[11px] text-slate-500">Đang được gieo trong chậu cây</p>
              </div>
            </div>
          )}

          {/* Warm Reassurance Message */}
          <div className="bg-amber-50/70 rounded-2xl p-3.5 border border-amber-200/60 text-xs text-slate-600 leading-relaxed space-y-1.5">
            <p className="font-semibold text-slate-800 flex items-center gap-1.5">
              <span>💭</span>
              <span>Cậu muốn đổi sang tâm trạng khác?</span>
            </p>
            <p>
              Khi gỡ hạt giống này ra, chậu cây sẽ trở lại trạng thái ban đầu. Thời tiết khu vườn sẽ quay về nắng dịu để bạn thong thả chọn lại cảm xúc bất kỳ lúc nào.
            </p>
          </div>

          {/* Option to also delete today's folded paper seed if exists */}
          {hasTodayPaperSeed && (
            <label className="flex items-start gap-2.5 p-3 rounded-2xl bg-white border border-slate-200/80 cursor-pointer hover:bg-slate-50 transition-colors">
              <input
                type="checkbox"
                checked={deletePaperSeed}
                onChange={(e) => setDeletePaperSeed(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-800">
                  Đồng thời xóa tờ giấy vẽ cảm xúc đã gieo hôm nay
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Xóa hạt giống khỏi danh sách lịch sử để hoàn toàn làm mới ngày hôm nay.
                </p>
              </div>
            </label>
          )}

          {/* Actions */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <button
              type="button"
              onClick={() => onConfirmRemove(deletePaperSeed)}
              className="flex-1 py-3 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Gỡ bỏ hạt giống khỏi chậu</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="py-3 px-4 rounded-2xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer text-center"
            >
              Giữ lại trong chậu
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
