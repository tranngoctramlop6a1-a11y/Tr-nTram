import React from 'react';
import { JournalEntry } from '../../types';
import { ChevronLeft, ChevronRight, Sparkles, Lock } from 'lucide-react';
import { hasJournalDraft, getJournalCalendarSubtitle } from '../../data/journalData';
import { isJournalLocked } from '../../utils/journalTimeLock';
import { useAuth } from '../../context/AuthContext';

interface JournalCalendarProps {
  currentMonth: Date;
  onMonthChange: (newMonth: Date) => void;
  entries: JournalEntry[];
  selectedDate: string; // 'YYYY-MM-DD'
  onSelectDate: (dateString: string) => void;
  onOpenToday: () => void;
}

export const JournalCalendar: React.FC<JournalCalendarProps> = ({
  currentMonth,
  onMonthChange,
  entries,
  selectedDate,
  onSelectDate,
  onOpenToday
}) => {
  const { user } = useAuth();
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth(); // 0 - 11

  // Format YYYY-MM-DD helper
  const formatDateString = (y: number, m: number, d: number) => {
    const mm = String(m + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${y}-${mm}-${dd}`;
  };

  const todayStr = () => {
    const today = new Date();
    return formatDateString(today.getFullYear(), today.getMonth(), today.getDate());
  };

  const today = todayStr();
  const calendarSubtitle = getJournalCalendarSubtitle(today);

  // Create lookup map for entries by date
  const entryMap = new Map<string, JournalEntry>();
  entries.forEach((e) => {
    entryMap.set(e.date, e);
  });

  // Calculate days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 is Sunday
  // Convert to Monday-first (0 = Mon, 6 = Sun)
  const startDay = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  // Previous month days for padding
  const prevMonthDays = new Date(year, month, 0).getDate();

  const handlePrevMonth = () => {
    onMonthChange(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    onMonthChange(new Date(year, month + 1, 1));
  };

  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200/80 shadow-xs space-y-6">
      {/* Calendar Header with Section 2 design */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">📖</span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
              Nhật ký
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600 font-semibold">
              {monthNames[month]} · {year}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium italic">
            “{calendarSubtitle}”
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={onOpenToday}
            className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>Hôm nay</span>
          </button>
          <div className="flex items-center rounded-xl bg-stone-50 p-1 border border-stone-200">
            <button
              onClick={handlePrevMonth}
              title="Tháng trước"
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              title="Tháng sau"
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Weekday headers (Monday - Sunday) */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs font-bold text-slate-500">
        <span className="py-1">T2</span>
        <span className="py-1">T3</span>
        <span className="py-1">T4</span>
        <span className="py-1">T5</span>
        <span className="py-1">T6</span>
        <span className="py-1 text-amber-600">T7</span>
        <span className="py-1 text-rose-600">CN</span>
      </div>

      {/* Days Grid with Section 2 subtle visual states */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {/* Leading padding from previous month */}
        {Array.from({ length: startDay }).map((_, idx) => {
          const dayNumber = prevMonthDays - startDay + idx + 1;
          return (
            <div
              key={`prev-${idx}`}
              className="h-14 sm:h-20 p-1 rounded-2xl bg-stone-50/40 text-slate-300 text-xs flex flex-col justify-between opacity-30 select-none"
            >
              <span className="font-medium text-[11px] p-1">{dayNumber}</span>
            </div>
          );
        })}

        {/* Current month days */}
        {Array.from({ length: daysInMonth }).map((_, idx) => {
          const dayNumber = idx + 1;
          const dateStr = formatDateString(year, month, dayNumber);
          const entry = entryMap.get(dateStr);
          const isLocked = entry ? isJournalLocked(entry) : false;
          const hasDraft = !entry && hasJournalDraft(dateStr, user?.id);
          const hasFutureMessage = !!(entry?.unlockDate || entry?.readLaterDate);
          const isSelected = selectedDate === dateStr;
          const isToday = today === dateStr;

          return (
            <button
              key={dateStr}
              onClick={() => onSelectDate(dateStr)}
              className={`h-14 sm:h-20 p-1.5 sm:p-2 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between relative group cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-102 z-10'
                  : isLocked
                  ? 'bg-amber-50/70 hover:bg-amber-100/80 border-amber-200/90 text-amber-950'
                  : entry
                  ? 'bg-stone-50/90 hover:bg-stone-100 border-stone-200/90 text-slate-800'
                  : hasDraft
                  ? 'bg-amber-50/50 hover:bg-amber-100/60 border-amber-200/70 text-slate-800'
                  : isToday
                  ? 'bg-rose-50/40 hover:bg-rose-50 border-rose-200 text-slate-800'
                  : 'bg-white hover:bg-stone-50/70 border-stone-100 hover:border-stone-200 text-slate-700'
              }`}
            >
              {/* Day header */}
              <div className="flex items-center justify-between w-full">
                <span
                  className={`text-xs font-bold leading-none ${
                    isSelected
                      ? 'text-white'
                      : isLocked
                      ? 'text-amber-900 font-extrabold'
                      : isToday
                      ? 'text-rose-600 font-black'
                      : 'text-slate-700'
                  }`}
                >
                  {dayNumber}
                </span>

                <div className="flex items-center gap-1">
                  {/* Time-locked icon */}
                  {isLocked && !isSelected && (
                    <span 
                      className="text-[10px] select-none text-amber-700" 
                      title={`Đang bị khóa đến ${entry?.unlockDate || entry?.readLaterDate}`}
                    >
                      🔒
                    </span>
                  )}

                  {/* Future capsule / letter indicator 🌱 */}
                  {!isLocked && hasFutureMessage && (
                    <span 
                      className="text-[11px] select-none" 
                      title="Có thư gửi cho tương lai"
                    >
                      🌱
                    </span>
                  )}

                  {/* Today dot indicator */}
                  {isToday && !isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                  )}

                  {/* Draft pencil */}
                  {hasDraft && !isSelected && (
                    <span className="text-[10px] text-amber-500" title="Có bản nháp chưa khép lại">✏️</span>
                  )}

                  {/* Favorite star */}
                  {entry?.isFavorite && !isSelected && (
                    <span className="text-[10px] text-amber-500">⭐</span>
                  )}
                </div>
              </div>

              {/* Mood or Entry indicator */}
              <div className="flex items-center justify-between w-full mt-auto pt-1">
                {entry ? (
                  <div className="flex items-center gap-1">
                    {/* Small mood badge */}
                    {isLocked ? (
                      <span className="text-xs font-bold text-amber-800 flex items-center gap-0.5">
                        <Lock className="w-3 h-3 text-amber-700" />
                        <span className="hidden sm:inline text-[10px]">Đang khóa</span>
                      </span>
                    ) : entry.mood ? (
                      <span className="text-sm sm:text-base leading-none select-none">
                        {entry.mood}
                      </span>
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-stone-400"></span>
                    )}
                  </div>
                ) : hasDraft ? (
                  <span
                    className={`hidden sm:inline text-[10px] font-semibold italic ${
                      isSelected ? 'text-stone-300' : 'text-amber-600'
                    }`}
                  >
                    Đang viết
                  </span>
                ) : (
                  <span
                    className={`hidden sm:inline text-[10px] ${
                      isSelected ? 'text-stone-400' : 'text-stone-300 group-hover:text-stone-400'
                    }`}
                  >
                    —
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Gentle Legend */}
      <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex flex-wrap items-center gap-3 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-stone-400 inline-block"></span>
            <span>Đã ghi lại</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span>🌱</span>
            <span>Gửi tương lai</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block"></span>
            <span>Hôm nay</span>
          </span>
        </div>

        <span className="text-slate-400 italic text-[11px]">
          Chạm vào bất kỳ ngày nào để viết hoặc xem lại
        </span>
      </div>
    </div>
  );
};
