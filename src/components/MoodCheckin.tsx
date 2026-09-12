import React, { useState, useEffect } from 'react';
import { MOOD_OPTIONS } from '../data/initialData';
import { MoodType, MoodOption } from '../types';
import { Heart, Sparkles, Wind, MessageSquarePlus, CheckCircle2, History } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MoodCheckinProps {
  onGoToConfession: () => void;
  onGoToHelp: () => void;
}

export const MoodCheckin: React.FC<MoodCheckinProps> = ({
  onGoToConfession,
  onGoToHelp
}) => {
  const [selectedMood, setSelectedMood] = useState<MoodOption | null>(null);
  const [personalThought, setPersonalThought] = useState('');
  const [savedToday, setSavedToday] = useState(false);
  const [recentMoods, setRecentMoods] = useState<{ date: string; emoji: string; label: string }[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('teen_mood_history');
      if (stored) {
        setRecentMoods(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSelectMood = (mood: MoodOption) => {
    setSelectedMood(mood);
    setSavedToday(false);

    // If happy, trigger cheerful confetti
    if (mood.id === 'happy' || mood.id === 'fine') {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#F43F5E', '#F59E0B', '#10B981', '#60A5FA']
      });
    }
  };

  const handleSaveMoodCheckin = () => {
    if (!selectedMood) return;
    const todayStr = new Date().toLocaleDateString('vi-VN', { month: 'numeric', day: 'numeric' });
    const newEntry = {
      date: todayStr,
      emoji: selectedMood.emoji,
      label: selectedMood.label
    };
    const updated = [newEntry, ...recentMoods.filter((_, i) => i < 6)];
    setRecentMoods(updated);
    try {
      localStorage.setItem('teen_mood_history', JSON.stringify(updated));
    } catch {
      // ignore
    }
    setSavedToday(true);
  };

  return (
    <section className="py-12 bg-white border-y border-rose-100/60" id="section-mood-checkin">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span>Khoảnh khắc kết nối với cảm xúc của bạn</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
            Hôm nay bạn cảm thấy thế nào?
          </h2>
          <p className="text-sm text-slate-600 max-w-lg mx-auto">
            Không có cảm xúc nào là "sai" hay "xấu". Mọi điều bạn đang trải qua đều xứng đáng được ghi nhận.
          </p>
        </div>

        {/* Emotion Buttons Grid (8 emotions) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {MOOD_OPTIONS.map((mood) => {
            const isSelected = selectedMood?.id === mood.id;
            return (
              <button
                key={mood.id}
                id={`mood-btn-${mood.id}`}
                onClick={() => handleSelectMood(mood)}
                className={`flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer transform active:scale-95 ${
                  isSelected
                    ? 'border-rose-500 bg-rose-50/70 shadow-md scale-102 ring-2 ring-rose-200'
                    : 'border-slate-100 bg-slate-50/60 hover:bg-white hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <span className="text-3xl sm:text-4xl mb-1.5 transform hover:scale-115 transition-transform select-none">
                  {mood.emoji}
                </span>
                <span className={`text-sm font-bold ${isSelected ? 'text-rose-700' : 'text-slate-700'}`}>
                  {mood.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tailored Positive Feedback Display */}
        {selectedMood && (
          <div className="mt-8 bg-gradient-to-br from-rose-50/80 via-white to-amber-50/60 rounded-3xl p-6 sm:p-8 border border-rose-200/80 shadow-sm animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              
              <div className="w-14 h-14 rounded-2xl bg-white shadow-xs border border-rose-100 flex items-center justify-center text-3xl shrink-0">
                {selectedMood.emoji}
              </div>

              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-100/80 px-2.5 py-0.5 rounded-full">
                    Gửi bạn một chút năng lượng ấm áp
                  </span>
                  <span className="text-xs text-slate-600 font-medium">Hôm nay: {selectedMood.label}</span>
                </div>

                <p className="text-base sm:text-lg text-slate-800 font-bold leading-relaxed">
                  “{selectedMood.response}”
                </p>

                <p className="text-sm text-slate-700 font-medium bg-white/80 p-3.5 rounded-xl border border-rose-100/80">
                  💡 <span className="font-bold text-slate-800">Gợi ý dành cho bạn:</span> {selectedMood.suggestion}
                </p>

                {/* Optional note taking */}
                <div className="pt-2 space-y-2">
                  <label className="text-xs font-bold text-slate-600">
                    Viết vài từ ngắn gọn gửi gắm cho ngày hôm nay (tùy chọn, chỉ lưu riêng trên máy bạn):
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={personalThought}
                      onChange={(e) => setPersonalThought(e.target.value)}
                      placeholder="Ví dụ: Vừa xong bài kiểm tra, thấy nhẹ nhõm hơn..."
                      className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-rose-400 bg-white"
                    />
                    <button
                      onClick={handleSaveMoodCheckin}
                      disabled={savedToday}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        savedToday
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-800 hover:bg-slate-900 text-white'
                      }`}
                    >
                      {savedToday ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Đã ghi nhớ</span>
                        </>
                      ) : (
                        <span>Lưu cảm xúc</span>
                      )}
                    </button>
                  </div>
                </div>

                {/* Quick actions according to mood */}
                <div className="pt-3 flex flex-wrap items-center gap-3">
                  {(selectedMood.id === 'stressed' || selectedMood.id === 'anxious' || selectedMood.id === 'angry') && (
                    <button
                      onClick={onGoToHelp}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Wind className="w-3.5 h-3.5 text-amber-600" />
                      <span>Thử 1 phút thở bình tâm (Hộp thở 4-4-4-4)</span>
                    </button>
                  )}

                  <button
                    onClick={onGoToConfession}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <MessageSquarePlus className="w-3.5 h-3.5 text-rose-500" />
                    <span>Tâm sự ẩn danh cùng các bạn khác</span>
                  </button>

                  <span className="text-[11px] text-slate-600 italic">
                    *Ghi chú: Đây không phải chẩn đoán tâm lý.
                  </span>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* Recent Mood Journey Bar */}
        {recentMoods.length > 0 && (
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-1.5 font-medium">
              <History className="w-3.5 h-3.5 text-slate-600" />
              <span>Nhật ký cảm xúc gần đây của bạn:</span>
            </div>
            <div className="flex items-center gap-2">
              {recentMoods.slice(0, 5).map((m, idx) => (
                <span 
                  key={idx} 
                  title={`${m.date}: ${m.label}`}
                  className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg font-medium text-xs flex items-center gap-1"
                >
                  <span>{m.emoji}</span>
                  <span className="text-[10px] text-slate-600 hidden sm:inline">{m.date}</span>
                </span>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
