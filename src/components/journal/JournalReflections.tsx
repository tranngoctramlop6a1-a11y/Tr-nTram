import React from 'react';
import { JournalEntry } from '../../types';
import { formatVietnameseDateFull } from '../../data/journalData';
import { Sparkles, Heart, Clock, Compass, Calendar, BookOpen, Smile } from 'lucide-react';

interface JournalReflectionsProps {
  entries: JournalEntry[];
  onOpenEntry: (dateStr: string) => void;
}

export const JournalReflections: React.FC<JournalReflectionsProps> = ({
  entries,
  onOpenEntry
}) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const currentDay = now.getDate();

  // 1. "Ngày này năm ấy" (Entries on the same day in past years)
  const onThisDayEntries = entries.filter((e) => {
    const parts = e.date.split('-');
    if (parts.length !== 3) return false;
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    const d = parseInt(parts[2], 10);
    return y < currentYear && m === currentMonth && d === currentDay;
  });

  // 2. Random throwback quote from a past entry (> 7 days ago)
  const pastEntries = entries.filter((e) => {
    try {
      const t = new Date(e.date).getTime();
      return (now.getTime() - t) / (1000 * 3600 * 24) >= 7;
    } catch {
      return false;
    }
  });

  const featuredThrowback = pastEntries.length > 0 ? pastEntries[0] : null;

  // 3. Gentle Statistics
  const totalEntries = entries.length;
  // Count unique dates
  const uniqueDates = new Set(entries.map((e) => e.date)).size;

  // Most frequent mood
  const moodCounts: Record<string, { count: number; label?: string }> = {};
  entries.forEach((e) => {
    if (e.mood) {
      if (!moodCounts[e.mood]) {
        moodCounts[e.mood] = { count: 0, label: e.moodLabel };
      }
      moodCounts[e.mood].count++;
    }
  });

  let mostFrequentMood: { emoji: string; count: number; label?: string } | null = null;
  Object.entries(moodCounts).forEach(([emoji, data]) => {
    if (!mostFrequentMood || data.count > mostFrequentMood.count) {
      mostFrequentMood = { emoji, count: data.count, label: data.label };
    }
  });

  const favoriteEntries = entries.filter((e) => e.isFavorite);

  return (
    <div className="space-y-6">
      
      {/* "Ngày này năm ấy" Spotlight (Only if matching entries exist) */}
      {onThisDayEntries.length > 0 && (
        <div className="bg-gradient-to-r from-amber-100/80 via-rose-100/70 to-pink-100/80 rounded-3xl p-6 sm:p-7 border border-amber-300 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📆</span>
            <div>
              <div className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                Kỷ niệm đặc biệt
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                Ngày này năm ấy...
              </h3>
            </div>
          </div>

          <div className="space-y-3">
            {onThisDayEntries.map((e) => {
              const yearsAgo = currentYear - parseInt(e.date.split('-')[0], 10);
              return (
                <div
                  key={e.id}
                  onClick={() => onOpenEntry(e.date)}
                  className="p-4 rounded-2xl bg-white/90 hover:bg-white border border-amber-200/80 transition-all cursor-pointer space-y-2 shadow-2xs group"
                >
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-bold text-amber-800">
                      {formatVietnameseDateFull(e.date)} • {yearsAgo} năm trước
                    </span>
                    <span className="text-base">{e.mood || '📝'}</span>
                  </div>

                  {e.title && (
                    <div className="font-bold text-sm text-slate-900 group-hover:text-rose-600 transition-colors">
                      {e.title}
                    </div>
                  )}

                  <p className="text-xs sm:text-sm text-slate-700 italic line-clamp-3 leading-relaxed">
                    “{e.content}”
                  </p>

                  <div className="pt-2 flex items-center justify-between text-xs">
                    <span className="text-amber-800 font-bold">
                      {yearsAgo === 1 ? 'Một năm rồi đó.' : `${yearsAgo} năm trôi qua rồi đó.`} 🌱
                    </span>
                    <span className="text-rose-600 font-semibold group-hover:underline">
                      Mở lại trang này →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* "Hôm nay mình khác gì?" (Gentle Reflection) */}
      {featuredThrowback && (
        <div className="bg-white rounded-3xl p-6 border border-teal-100 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center text-xl font-bold">
              🪞
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-bold text-slate-900">
                Nhìn lại một chút...
              </h4>
              <p className="text-xs text-slate-500">
                Một khoảnh khắc trong quá khứ được nhắc lại nhẹ nhàng
              </p>
            </div>
          </div>

          <div 
            onClick={() => onOpenEntry(featuredThrowback.date)}
            className="p-4 rounded-2xl bg-teal-50/50 border border-teal-100/80 space-y-2 cursor-pointer hover:bg-teal-50 transition-colors"
          >
            <div className="text-xs font-bold text-teal-800">
              Ngày {formatVietnameseDateFull(featuredThrowback.date)}, bạn từng viết:
            </div>
            <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
              “{featuredThrowback.content}”
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 text-xs text-slate-600 space-y-1">
            <span className="font-bold text-slate-800 block">Hôm nay thì sao?</span>
            <p>
              Những lo lắng hay cảm xúc của ngày hôm đó có còn làm bạn bận tâm không? Mọi thứ rồi cũng sẽ nhẹ nhàng trôi qua như thế.
            </p>
          </div>
        </div>
      )}

      {/* "Mình đã đi qua" & Gentle Statistics (No streak pressure, no diagnosis) */}
      <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-xs space-y-5">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center text-xl font-bold">
            🌱
          </div>
          <div>
            <h4 className="text-base sm:text-lg font-bold text-slate-900">
              Mình đã đi qua
            </h4>
            <p className="text-xs text-slate-500">
              Từng trang nhỏ tích lũy những ngày tháng của chính bạn
            </p>
          </div>
        </div>

        {/* Milestone Message */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-50/80 to-amber-50/80 border border-rose-100 text-slate-800 space-y-1">
          <span className="text-xs font-extrabold text-rose-700 uppercase tracking-wide">
            Cảm ơn bạn đã luôn ở đây
          </span>
          <p className="text-sm sm:text-base font-black text-slate-900">
            Bạn đã ghi lại {uniqueDates} ngày.
          </p>
          <p className="text-xs text-slate-600 leading-relaxed">
            {uniqueDates} ngày của những chuyện vui, buồn, bình thường và chẳng đâu vào đâu. Mỗi ngày đều là một phần đáng quý của bạn.
          </p>
        </div>

        {/* 4 Gentle metric cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-1">
            <BookOpen className="w-4 h-4 text-rose-500 mx-auto" />
            <div className="text-lg sm:text-xl font-black text-slate-900">{totalEntries}</div>
            <div className="text-[11px] text-slate-500 font-medium">Trang đã viết</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-1">
            <Calendar className="w-4 h-4 text-teal-500 mx-auto" />
            <div className="text-lg sm:text-xl font-black text-slate-900">{uniqueDates}</div>
            <div className="text-[11px] text-slate-500 font-medium">Ngày có nhật ký</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-1">
            <Smile className="w-4 h-4 text-amber-500 mx-auto" />
            <div className="text-lg sm:text-xl font-black text-slate-900">
              {mostFrequentMood ? mostFrequentMood.emoji : '🌱'}
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              {mostFrequentMood ? mostFrequentMood.label || 'Mood hay gặp' : 'Mood yêu thích'}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-1">
            <Heart className="w-4 h-4 text-pink-500 mx-auto" />
            <div className="text-lg sm:text-xl font-black text-slate-900">{favoriteEntries.length}</div>
            <div className="text-[11px] text-slate-500 font-medium">Kỷ niệm yêu thích</div>
          </div>
        </div>

        {/* Warm anti-streak reassurance quote */}
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-700 leading-relaxed italic text-center">
          “Không viết hôm qua cũng chẳng sao. Hôm nay trang này vẫn ở đây chờ bạn.” 🌸
        </div>

      </div>

    </div>
  );
};
