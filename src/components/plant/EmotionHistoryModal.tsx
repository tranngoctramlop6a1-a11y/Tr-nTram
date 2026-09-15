import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, Calendar, Clock, Trash2, Eye, Sparkles, Inbox, CheckCircle2 } from 'lucide-react';
import { EmotionSeedItem, DailyPlantLog } from '../../types';
import { WEATHER_CONFIG, PLANT_EMOTIONS } from './plantUtils';

interface EmotionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  seeds: EmotionSeedItem[];
  dailyLogs?: Record<string, DailyPlantLog>;
  onDeleteSeed?: (seedId: string) => void;
}

const EFFECT_MAP: Record<string, { label: string; emoji: string }> = {
  flower: { label: 'Bông hoa nở', emoji: '🌸' },
  leaf: { label: 'Chiếc lá non', emoji: '🍃' },
  branch: { label: 'Cành cây vươn', emoji: '🌿' },
  fruit: { label: 'Trái ngọt lành', emoji: '🍎' },
  firefly: { label: 'Đốm sáng lấp lánh', emoji: '✨' },
  sprout: { label: 'Mầm cây', emoji: '🌱' },
  root: { label: 'Rễ sâu bền', emoji: '🌱' }
};

export const EmotionHistoryModal: React.FC<EmotionHistoryModalProps> = ({
  isOpen,
  onClose,
  seeds,
  dailyLogs = {},
  onDeleteSeed
}) => {
  const [selectedSeed, setSelectedSeed] = useState<EmotionSeedItem | null>(null);

  if (!isOpen) return null;

  // Format date: dd/mm/yyyy
  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return iso;
    }
  };

  const formatTime = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '';
    }
  };

  // Group seeds by date
  const groupedSeeds = seeds.slice().reverse().reduce((acc, seed) => {
    const dateKey = formatDate(seed.createdAt);
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(seed);
    return acc;
  }, {} as Record<string, EmotionSeedItem[]>);

  const dates = Object.keys(groupedSeeds);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-amber-100 overflow-hidden my-auto max-h-[88vh] flex flex-col"
      >
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-amber-50/90 via-emerald-50/70 to-amber-50/90 border-b border-amber-100/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-100/80 flex items-center justify-center text-amber-800 shadow-2xs">
              <Inbox className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-800">
                Những điều đã gieo ({seeds.length})
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Lock className="w-3 h-3 text-emerald-600" />
                <span>Không gian riêng tư tuyệt đối • Chỉ mình bạn có thể xem lại</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors border border-slate-200/60 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {seeds.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center max-w-sm mx-auto">
              <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200/80 flex items-center justify-center text-2xl mb-3">
                📦
              </div>
              <h4 className="text-base font-bold text-slate-800 mb-1">
                Chiếc hộp này chưa có hạt giống nào
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Mỗi khi bạn vẽ một cảm xúc và chọn "Gấp lại và gieo", tờ giấy tròn sẽ được lưu giữ an toàn bên trong chiếc hộp này.
              </p>
            </div>
          ) : (
            dates.map((dateStr) => {
              // Find matching dailyLog if any
              const firstSeedInDate = groupedSeeds[dateStr]?.[0];
              const isoDate = firstSeedInDate ? firstSeedInDate.createdAt.split('T')[0] : '';
              const log = dailyLogs[isoDate];
              const weatherInfo = log?.weather ? WEATHER_CONFIG[log.weather] : null;
              const emotionInfo = log?.emotion ? PLANT_EMOTIONS.find(e => e.id === log.emotion) : null;

              return (
                <div key={dateStr} className="space-y-3">
                  {/* Date header with day's weather & fertilizer info */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-amber-700" />
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        {dateStr}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px]">
                      {weatherInfo && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200/60 font-semibold">
                          <span>{weatherInfo.emoji}</span>
                          <span>{weatherInfo.name}</span>
                        </span>
                      )}

                      {emotionInfo && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/60 font-semibold">
                          <span>{emotionInfo.emoji}</span>
                          <span>{emotionInfo.label}</span>
                        </span>
                      )}

                      {log?.fertilizerDone && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200/60 font-semibold">
                          <CheckCircle2 className="w-3 h-3 text-teal-600" />
                          <span>Đã bón đủ {log.fertilizerKg}kg</span>
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="h-px bg-amber-100/80 w-full" />

                {/* Seed cards in circular grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {groupedSeeds[dateStr].map((seed) => {
                    const eff = EFFECT_MAP[seed.growthEffect] || EFFECT_MAP.sprout;
                    return (
                      <div
                        key={seed.id}
                        onClick={() => setSelectedSeed(seed)}
                        className="group relative bg-[#FAF7F2] rounded-2xl p-3 border border-amber-200/60 hover:border-amber-300 hover:shadow-md transition-all flex flex-col items-center cursor-pointer select-none"
                      >
                        {/* Circular paper thumbnail */}
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white border-2 border-amber-200/80 overflow-hidden shadow-inner flex items-center justify-center relative group-hover:scale-105 transition-transform">
                          <img
                            src={seed.drawingDataUrl}
                            alt="Cảm xúc đã gieo"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                            <Eye className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow" />
                          </div>
                        </div>

                        {/* Meta info */}
                        <div className="mt-2.5 flex items-center justify-between w-full px-1 text-[11px] text-slate-500">
                          <span className="flex items-center gap-1 font-medium">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {formatTime(seed.createdAt)}
                          </span>
                          <span className="flex items-center gap-0.5 text-emerald-700 font-semibold" title={eff.label}>
                            <span>{eff.emoji}</span>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

        {/* Zoom Inspection Modal */}
        <AnimatePresence>
          {selectedSeed && (
            <div className="absolute inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl flex flex-col items-center text-center relative border border-amber-100"
              >
                <button
                  onClick={() => setSelectedSeed(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-[#FAF7F2] border-4 border-amber-200 shadow-lg overflow-hidden my-3">
                  <img
                    src={selectedSeed.drawingDataUrl}
                    alt="Cảm xúc đã gieo"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-1 mt-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-amber-800">
                    <span>{EFFECT_MAP[selectedSeed.growthEffect]?.emoji}</span>
                    <span>{EFFECT_MAP[selectedSeed.growthEffect]?.label}</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Đã gieo vào lúc {formatTime(selectedSeed.createdAt)} ngày {formatDate(selectedSeed.createdAt)}
                  </p>
                  <p className="text-[11px] text-slate-400 italic pt-1">
                    "Hạt giống này đã nuôi cái cây lớn lên một chút."
                  </p>
                </div>

                {onDeleteSeed && (
                  <button
                    onClick={() => {
                      if (confirm('Bạn có chắc muốn xóa hạt giống cảm xúc này khỏi hộp?')) {
                        onDeleteSeed(selectedSeed.id);
                        setSelectedSeed(null);
                      }
                    }}
                    className="mt-5 px-3 py-1.5 rounded-xl text-xs text-red-500 hover:bg-red-50 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xóa hạt giống này</span>
                  </button>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 text-center shrink-0">
          <p className="text-xs text-slate-500 italic">
            “Cứ gieo xuống, rồi một ngày nhìn lại — bạn sẽ thấy mình đã lớn lên cùng nó.”
          </p>
        </div>
      </motion.div>
    </div>
  );
};
