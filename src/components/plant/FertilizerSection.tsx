import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, RotateCcw, Sparkles, HelpCircle } from 'lucide-react';
import { FERTILIZER_SUCCESS_MESSAGES } from './plantUtils';

interface FertilizerSectionProps {
  requiredKg: number;
  currentKg: number;
  isCompleted: boolean;
  onUpdateKg: (newKg: number, delta: number) => void;
  onFertilizerCompleted: () => void;
}

export const FertilizerSection: React.FC<FertilizerSectionProps> = ({
  requiredKg,
  currentKg,
  isCompleted,
  onUpdateKg,
  onFertilizerCompleted
}) => {
  const [scoopAnim, setScoopAnim] = useState<boolean>(false);
  const [lastDelta, setLastDelta] = useState<number | null>(null);

  // Scoop options
  const SCOOP_OPTIONS = [
    { label: '+0.1 kg', delta: 0.1, desc: 'Một thìa nhỏ' },
    { label: '+0.25 kg', delta: 0.25, desc: 'Xẻng vừa' },
    { label: '+0.5 kg', delta: 0.5, desc: 'Xẻng lớn' },
    { label: '+1.0 kg', delta: 1.0, desc: 'Gầu đầy' }
  ];

  const handleScoop = (delta: number) => {
    const nextVal = Math.max(0, Math.round((currentKg + delta) * 100) / 100);
    setLastDelta(delta);
    setScoopAnim(true);
    setTimeout(() => setScoopAnim(false), 500);

    onUpdateKg(nextVal, delta);

    // If hits exact required amount
    if (Math.abs(nextVal - requiredKg) < 0.01 && !isCompleted) {
      onFertilizerCompleted();
    }
  };

  const handleTakeBack = (amount: number) => {
    const nextVal = Math.max(0, Math.round((currentKg - amount) * 100) / 100);
    onUpdateKg(nextVal, -amount);
    if (Math.abs(nextVal - requiredKg) < 0.01 && !isCompleted) {
      onFertilizerCompleted();
    }
  };

  const isExact = Math.abs(currentKg - requiredKg) < 0.01;
  const isOver = currentKg > requiredKg + 0.01;
  const isUnder = currentKg < requiredKg - 0.01;

  // Percentage progress (capped at 100% or overflow representation)
  const percent = Math.min(100, Math.round((currentKg / (requiredKg || 1)) * 100));

  return (
    <div className="w-full bg-white/80 backdrop-blur-xs rounded-3xl p-5 border border-amber-100/90 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-900 text-base shadow-2xs">
            🪣
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-black text-slate-800 tracking-tight">
              Bón phân hôm nay
            </h3>
            <p className="text-[11px] text-slate-500">
              Cây cần đủ dinh dưỡng để vươn lá khỏe mạnh
            </p>
          </div>
        </div>

        {/* Status badge */}
        {isExact || isCompleted ? (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100/90 text-emerald-800 text-[11px] font-bold shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Đã bón đủ chuẩn ✨</span>
          </span>
        ) : isOver ? (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold">
            <span>Hơi nhiều rồi!</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-bold">
            <span>Đang cần bón</span>
          </span>
        )}
      </div>

      {/* Fertilizer Progress Board */}
      <div className="bg-gradient-to-r from-amber-50/70 to-emerald-50/50 rounded-2xl p-3.5 border border-amber-200/60 space-y-2">
        <div className="flex items-baseline justify-between text-xs sm:text-sm font-black">
          <span className="text-slate-700 flex items-center gap-1">
            <span>Lượng đã bón:</span>
            <span className={`text-base font-extrabold ${isExact ? 'text-emerald-700' : isOver ? 'text-rose-600' : 'text-amber-800'}`}>
              {currentKg.toFixed(2)} kg
            </span>
          </span>
          <span className="text-slate-500 font-bold text-xs">
            Hôm nay cần: <span className="text-slate-800 font-extrabold">{requiredKg.toFixed(2)} kg</span>
          </span>
        </div>

        {/* Visual Progress Bar */}
        <div className="relative w-full h-3.5 bg-amber-200/50 rounded-full overflow-hidden p-0.5 border border-amber-300/40">
          <motion.div
            className={`h-full rounded-full transition-all duration-300 ${
              isExact
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                : isOver
                ? 'bg-gradient-to-r from-rose-400 to-amber-500'
                : 'bg-gradient-to-r from-amber-400 to-emerald-500'
            }`}
            animate={{ width: `${Math.min(100, (currentKg / requiredKg) * 100)}%` }}
          />
        </div>

        {/* Dynamic status feedback */}
        <div className="text-xs pt-0.5 font-medium">
          {isExact ? (
            <p className="text-emerald-700 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Vừa đủ luôn! Cảm ơn cậu nha 🌱</span>
            </p>
          ) : isOver ? (
            <p className="text-rose-600 font-semibold flex items-center gap-1.5">
              <span>Ơ, hơi nhiều rồi =)) Cậu bấm "Lấy bớt" lại nhé!</span>
            </p>
          ) : (
            <p className="text-slate-600 flex items-center gap-1.5">
              <span>Tớ vẫn cần thêm một chút nữa 🌱 (còn thiếu {(requiredKg - currentKg).toFixed(2)} kg)</span>
            </p>
          )}
        </div>
      </div>

      {/* Action Controls: Scoops */}
      <div className="space-y-2">
        <div className="text-[11px] font-bold text-slate-600 flex items-center justify-between">
          <span>Chọn xẻng phân bón:</span>
          <span className="text-[10px] text-slate-400 font-normal">Bấm để múc phân vào đất</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {SCOOP_OPTIONS.map((opt) => (
            <motion.button
              key={opt.label}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleScoop(opt.delta)}
              className="px-3 py-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100/80 active:bg-amber-200 border border-amber-200/90 text-amber-950 font-bold text-xs shadow-2xs hover:shadow-xs transition-all flex flex-col items-center justify-center cursor-pointer group"
            >
              <div className="flex items-center gap-1 text-xs">
                <span>🪣</span>
                <span>{opt.label}</span>
              </div>
              <span className="text-[10px] text-amber-800/80 font-normal group-hover:text-amber-950">
                {opt.desc}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Undo / Lấy bớt controls when overfilled or when needed */}
      {(isOver || currentKg > 0) && (
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <div className="text-[11px] text-slate-500 font-medium">
            {isOver ? 'Bớt phân từ đất ra:' : 'Điều chỉnh nếu lỡ tay:'}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleTakeBack(0.1)}
              disabled={currentKg <= 0}
              className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-40"
            >
              ↩️ -0.1 kg
            </button>
            <button
              onClick={() => handleTakeBack(0.25)}
              disabled={currentKg < 0.25}
              className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-40"
            >
              ↩️ -0.25 kg
            </button>
            <button
              onClick={() => handleTakeBack(0.5)}
              disabled={currentKg < 0.5}
              className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-40"
            >
              ↩️ -0.5 kg
            </button>
            {currentKg > 0 && (
              <button
                onClick={() => onUpdateKg(0, -currentKg)}
                className="px-2.5 py-1 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors cursor-pointer"
                title="Làm lại từ đầu"
              >
                Làm lại
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
