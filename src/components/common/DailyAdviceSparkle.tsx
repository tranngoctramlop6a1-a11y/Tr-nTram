import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DAILY_ADVICES, DailyAdvice } from '../../data/dailyAdvices';
import { X, Copy, Check, Heart, Sparkles } from 'lucide-react';

interface DailyAdviceSparkleProps {
  className?: string;
  popupAlign?: 'right' | 'left' | 'center';
  darkBg?: boolean;
}

const GUEST_ADVICE_KEY = 'teen_guest_advice_history';

interface StoredAdviceEntry {
  date: string; // YYYY-MM-DD
  advice_id: string;
  read_at: string | null;
}

export const DailyAdviceSparkle: React.FC<DailyAdviceSparkleProps> = ({
  className = '',
  popupAlign = 'right',
  darkBg = false
}) => {
  const { user, token } = useAuth();
  const [advice, setAdvice] = useState<DailyAdvice | null>(null);
  const [hasReadToday, setHasReadToday] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [liked, setLiked] = useState<boolean>(false);
  const [isMarking, setIsMarking] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Today's date string in user's local timezone (YYYY-MM-DD)
  const getTodayDateStr = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Load daily advice for current account / guest
  const loadDailyAdvice = useCallback(async () => {
    const todayStr = getTodayDateStr();

    if (user && token) {
      try {
        const res = await fetch(`/api/users/daily-advice?date=${todayStr}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.advice) {
            setAdvice(data.advice);
            setHasReadToday(!!data.hasReadToday);
            return;
          }
        }
      } catch (err) {
        console.error('Failed to fetch user daily advice:', err);
      }
    }

    // Guest fallback using localStorage
    try {
      const raw = localStorage.getItem(GUEST_ADVICE_KEY);
      let history: StoredAdviceEntry[] = raw ? JSON.parse(raw) : [];

      const todayEntry = history.find((e) => e.date === todayStr);
      if (todayEntry) {
        const found = DAILY_ADVICES.find((a) => a.id === todayEntry.advice_id) || DAILY_ADVICES[0];
        setAdvice(found);
        setHasReadToday(!!todayEntry.read_at);
        return;
      }

      // Find advices not yet given to guest
      const seenIds = new Set(history.map((e) => e.advice_id));
      const unreadList = DAILY_ADVICES.filter((a) => !seenIds.has(a.id));

      let selected: DailyAdvice;
      if (unreadList.length > 0) {
        // Pick deterministically based on date to remain stable throughout the day
        let hash = 0;
        for (let i = 0; i < todayStr.length; i++) {
          hash = (hash << 5) - hash + todayStr.charCodeAt(i);
          hash |= 0;
        }
        selected = unreadList[Math.abs(hash) % unreadList.length];
      } else {
        selected = DAILY_ADVICES[0];
      }

      history.push({
        date: todayStr,
        advice_id: selected.id,
        read_at: null
      });
      localStorage.setItem(GUEST_ADVICE_KEY, JSON.stringify(history));

      setAdvice(selected);
      setHasReadToday(false);
    } catch {
      setAdvice(DAILY_ADVICES[0]);
      setHasReadToday(false);
    }
  }, [user, token]);

  useEffect(() => {
    loadDailyAdvice();
  }, [loadDailyAdvice]);

  // Mark as read when opened
  const markAsRead = async () => {
    if (hasReadToday || isMarking) return;
    setIsMarking(true);
    const todayStr = getTodayDateStr();

    setHasReadToday(true);

    if (user && token) {
      try {
        await fetch('/api/users/daily-advice/read', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ date: todayStr })
        });
      } catch (err) {
        console.error('Failed to mark advice as read:', err);
      } finally {
        setIsMarking(false);
      }
    } else {
      try {
        const raw = localStorage.getItem(GUEST_ADVICE_KEY);
        let history: StoredAdviceEntry[] = raw ? JSON.parse(raw) : [];
        const entry = history.find((e) => e.date === todayStr);
        if (entry) {
          entry.read_at = new Date().toISOString();
          localStorage.setItem(GUEST_ADVICE_KEY, JSON.stringify(history));
        }
      } catch {}
      setIsMarking(false);
    }
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState && !hasReadToday) {
      markAsRead();
    }
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!advice) return;
    navigator.clipboard.writeText(`"${advice.content}" — Lời khuyên tích cực hôm nay ✨`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(!liked);
  };

  const getPopupAlignClass = () => {
    if (popupAlign === 'left') return 'left-0';
    if (popupAlign === 'center') return 'left-1/2 -translate-x-1/2';
    return 'right-0';
  };

  return (
    <div ref={containerRef} className={`relative inline-flex items-center ${className}`}>
      {/* Sparkle and Arrow Trigger Button (✨ →) */}
      <button
        type="button"
        id="btn-daily-advice-trigger"
        onClick={handleToggle}
        aria-label="Lời khuyên siêu tích cực hôm nay"
        title={
          hasReadToday
            ? 'Lời khuyên siêu tích cực hôm nay (Đã đọc)'
            : 'Có lời khuyên siêu tích cực mới hôm nay ✨ Bấm để xem'
        }
        className={`inline-flex items-center gap-0.5 sm:gap-1 px-1.5 py-0.5 sm:py-1 rounded-lg transition-all cursor-pointer select-none text-xs font-semibold ${
          darkBg
            ? isOpen
              ? 'bg-amber-300 text-teal-950 shadow-sm ring-2 ring-white/50'
              : hasReadToday
              ? 'bg-white/15 hover:bg-white/25 text-white border border-white/20'
              : 'bg-amber-400 hover:bg-amber-300 text-teal-950 shadow-sm ring-2 ring-amber-200'
            : isOpen
            ? 'bg-amber-100/90 text-amber-900 shadow-2xs'
            : hasReadToday
            ? 'hover:bg-teal-100/70 text-teal-700/80 hover:text-teal-900'
            : 'bg-amber-50/90 hover:bg-amber-100 text-amber-800 ring-1 ring-amber-300/80 shadow-2xs'
        }`}
      >
        {/* ✨ Sparkle symbol */}
        <span className="text-xs sm:text-sm transform hover:scale-110 transition-transform">✨</span>

        {/* → Small arrow with gentle nudge animation if unread */}
        <span
          className={`inline-block text-xs font-bold leading-none select-none transition-all ${
            darkBg
              ? hasReadToday
                ? 'text-white/80'
                : 'text-teal-950 animate-arrow-nudge'
              : hasReadToday
              ? 'text-teal-700/60'
              : 'text-amber-600 animate-arrow-nudge'
          }`}
        >
          →
        </span>
      </button>

      {/* Popover Bubble / Popup */}
      {isOpen && advice && (
        <div
          id="popover-daily-advice"
          className={`absolute top-full mt-2 z-50 w-[300px] sm:w-[340px] max-w-[92vw] bg-white rounded-2xl p-4 shadow-xl border border-teal-100 text-left animate-in fade-in zoom-in-95 duration-150 ${getPopupAlignClass()}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-gray-100">
            <div className="flex items-center gap-1.5">
              <span className="text-amber-500 text-sm">✨</span>
              <h4 className="text-xs font-bold text-gray-800">Lời khuyên siêu tích cực</h4>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              title="Đóng"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Advice Tag & Context */}
          <div className="flex items-center justify-between mt-2.5 mb-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-teal-50 text-teal-800 border border-teal-200/70">
              <span>{advice.icon}</span>
              <span>{advice.tag}</span>
            </span>
            <span className="text-[10px] text-gray-600 font-medium">
              Dành cho {user?.nickname || 'bạn'} hôm nay
            </span>
          </div>

          {/* Advice Content Card */}
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-teal-50/80 via-white to-amber-50/50 border border-teal-100/90 shadow-2xs">
            <p className="text-xs sm:text-sm text-gray-800 leading-relaxed font-medium">
              &ldquo;{advice.content}&rdquo;
            </p>
          </div>

          {/* Footer & Interactions */}
          <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-600">
            <div className="flex items-center gap-1 text-[10px] text-teal-700/80 font-mono">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Mỗi ngày 1 lời khuyên mới</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                title="Sao chép lời khuyên này"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-700 font-semibold text-[10px]">Đã chép</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span className="text-[10px]">Sao chép</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleLike}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  liked
                    ? 'bg-rose-50 text-rose-500'
                    : 'hover:bg-gray-100 text-gray-400 hover:text-rose-500'
                }`}
                title={liked ? 'Đã yêu thích' : 'Thả tim'}
              >
                <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
