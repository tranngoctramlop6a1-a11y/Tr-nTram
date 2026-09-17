import React, { useState, useEffect, useMemo } from 'react';
import { JournalEntry, TimeCapsule, JournalMoodItem } from '../types';
import { 
  SAMPLE_JOURNAL_ENTRIES, 
  SAMPLE_TIME_CAPSULES, 
  JOURNAL_MOODS, 
  getDailyJournalQuote,
  formatVietnameseDateFull,
  formatVietnameseShortDate
} from '../data/journalData';
import { JournalCalendar } from './journal/JournalCalendar';
import { JournalEditorModal } from './journal/JournalEditorModal';
import { JournalTimeCapsule } from './journal/JournalTimeCapsule';
import { JournalReflections } from './journal/JournalReflections';
import { JournalPinModal } from './journal/JournalPinModal';
import { JournalTimeLockModal } from './journal/JournalTimeLockModal';
import { 
  isJournalLocked, 
  formatUnlockDateLabel, 
  formatRemainingTimeText,
  getRemainingDays 
} from '../utils/journalTimeLock';
import { 
  Calendar as CalendarIcon, 
  BookOpen, 
  Mail, 
  Sparkles, 
  Lock, 
  Unlock,
  KeyRound,
  Search, 
  Download, 
  Trash2, 
  Heart, 
  Filter, 
  Plus, 
  CheckCircle2, 
  BellRing,
  Smile,
  Tag,
  CloudCheck,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface JournalViewProps {
  onAskChatbotWithText?: (text: string) => void;
  preselectedDate?: string;
  initialPromptText?: string;
}

export const JournalView: React.FC<JournalViewProps> = ({
  onAskChatbotWithText,
  preselectedDate,
  initialPromptText
}) => {
  const { user, token } = useAuth();
  const isLoggedIn = Boolean(user && user.id && user.id !== 'guest');
  const storagePrefix = isLoggedIn ? `teen_journal_${user!.id}_` : 'teen_journal_';

  // 1. Storage & State for Journal Entries - ONLY loaded from localStorage if logged in
  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    if (!user || !user.id || user.id === 'guest') {
      return [];
    }
    try {
      const key = `teen_journal_${user.id}_entries`;
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.filter((e) => 
            !e.id?.startsWith('journal-past-') && 
            !e.id?.startsWith('journal-sep-') &&
            e.id !== 'sample-1' &&
            e.id !== 'sample-2'
          );
        }
      }
    } catch {
      // ignore
    }
    return [];
  });

  // 2. Storage & State for Time Capsules - ONLY loaded from localStorage if logged in
  const [capsules, setCapsules] = useState<TimeCapsule[]>(() => {
    if (!user || !user.id || user.id === 'guest') {
      return [];
    }
    try {
      const key = `teen_journal_${user.id}_capsules`;
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.filter((c) => c.id !== 'capsule-1' && c.id !== 'capsule-2');
        }
      }
    } catch {
      // ignore
    }
    return [];
  });

  // Switch journal entries & PIN whenever user identity changes (Login / Logout / Account Switch)
  useEffect(() => {
    if (!user || !user.id || user.id === 'guest') {
      // Guest mode: all temporary entries are reset on page reload/switch, never loaded from localStorage
      setEntries([]);
      setCapsules([]);
      setPin(null);
      setIsUnlocked(true);
      return;
    }

    const keyEntries = `teen_journal_${user.id}_entries`;
    const keyCapsules = `teen_journal_${user.id}_capsules`;
    const keyPin = `teen_journal_${user.id}_pin`;

    let loadedEntries: JournalEntry[] = [];
    let loadedCapsules: TimeCapsule[] = [];
    const loadedPin = localStorage.getItem(keyPin) || null;

    try {
      const storedE = localStorage.getItem(keyEntries);
      if (storedE) loadedEntries = JSON.parse(storedE);
      const storedC = localStorage.getItem(keyCapsules);
      if (storedC) loadedCapsules = JSON.parse(storedC);
    } catch {}

    setEntries(loadedEntries);
    setCapsules(loadedCapsules);
    setPin(loadedPin);
    setIsUnlocked(!loadedPin);

    // If user is authenticated, fetch latest from server
    if (token && user.id && user.id !== 'guest') {
      let isCurrent = true;
      fetch('/api/journal/my', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => res.json())
        .then((data) => {
          if (!isCurrent) return;
          if (Array.isArray(data.entries)) {
            setEntries(data.entries);
            localStorage.setItem(keyEntries, JSON.stringify(data.entries));
          }
          if (Array.isArray(data.capsules)) {
            setCapsules(data.capsules);
            localStorage.setItem(keyCapsules, JSON.stringify(data.capsules));
          }
        })
        .catch(() => {});

      return () => {
        isCurrent = false;
      };
    }
  }, [user?.id, token]);

  // 3. PIN Security
  const [pin, setPin] = useState<string | null>(() => {
    if (!user || !user.id || user.id === 'guest') {
      return null;
    }
    const key = `teen_journal_${user.id}_pin`;
    return localStorage.getItem(key) || null;
  });
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => !pin);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);

  // Sync to localStorage & server (STRICT: Guest mode never writes to localStorage)
  useEffect(() => {
    if (!user?.id || user.id === 'guest') {
      // In Guest Mode: Entries remain in React memory for current session only.
      // Absolute restriction: DO NOT save to localStorage!
      return;
    }

    try {
      const key = `teen_journal_${user.id}_entries`;
      localStorage.setItem(key, JSON.stringify(entries));
    } catch {}

    // Cloud sync if logged in
    if (token && user.id && user.id !== 'guest') {
      const timer = setTimeout(() => {
        fetch('/api/journal/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ entries, capsules })
        }).catch(() => {});
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [entries, user?.id, token]);

  useEffect(() => {
    if (!user?.id || user.id === 'guest') {
      // In Guest Mode: Capsules remain in React memory for current session only.
      // Absolute restriction: DO NOT save to localStorage!
      return;
    }

    try {
      const key = `teen_journal_${user.id}_capsules`;
      localStorage.setItem(key, JSON.stringify(capsules));
    } catch {}

    if (token && user.id && user.id !== 'guest') {
      const timer = setTimeout(() => {
        fetch('/api/journal/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ entries, capsules })
        }).catch(() => {});
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [capsules, user?.id, token]);

  const handleSetPin = (newPin: string | null) => {
    setPin(newPin);
    if (!user?.id || user.id === 'guest') {
      // Guest mode does not persist PIN across reloads
      return;
    }
    const key = `teen_journal_${user.id}_pin`;
    if (newPin) {
      localStorage.setItem(key, newPin);
    } else {
      localStorage.removeItem(key);
    }
  };

  // 4. Navigation Sub-Tabs within Journal
  const [activeSubTab, setActiveSubTab] = useState<'calendar' | 'timeline' | 'capsule' | 'reflection'>('calendar');

  // 5. Calendar state
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState<Date>(new Date());
  
  // Format today helper
  const getTodayStr = () => {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${mm}-${dd}`;
  };
  const todayStr = getTodayStr();

  // 6. Selected Date & Editor Modal
  const [selectedDate, setSelectedDate] = useState<string>(preselectedDate || todayStr);
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(!!preselectedDate || !!initialPromptText);

  // Time-locked Diary Modal & Filter states
  const [timeLockedEntry, setTimeLockedEntry] = useState<JournalEntry | null>(null);
  const [isTimeLockModalOpen, setIsTimeLockModalOpen] = useState<boolean>(false);
  const [lockStatusFilter, setLockStatusFilter] = useState<'all' | 'locked' | 'unlocked'>('all');

  // Handle entry card click - opens lock modal if locked, otherwise opens editor
  const handleEntryCardClick = (entry: JournalEntry) => {
    if (isJournalLocked(entry)) {
      setTimeLockedEntry(entry);
      setIsTimeLockModalOpen(true);
      return;
    }
    handleOpenDate(entry.date);
  };

  // Handle calendar day selection - checks if locked
  const handleCalendarSelectDate = (dateStr: string) => {
    const entry = entries.find((e) => e.date === dateStr);
    if (entry && isJournalLocked(entry)) {
      setTimeLockedEntry(entry);
      setIsTimeLockModalOpen(true);
      return;
    }
    handleOpenDate(dateStr);
  };

  // Search & Filter state for Timeline view
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonthFilter, setSelectedMonthFilter] = useState<string | null>(null);
  const [selectedMoodFilter, setSelectedMoodFilter] = useState<string | null>(null);
  const [selectedTagFilter, setSelectedTagFilter] = useState<string | null>(null);

  // Clear all modal confirm
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Section 11: "Ngày này năm ấy" (Real past entries on this same day, no fake/demo data)
  const onThisDayEntry = useMemo(() => {
    const todayMonthDay = todayStr.slice(5); // "-MM-DD"
    const todayYear = parseInt(todayStr.slice(0, 4), 10);
    return entries.find((e) => {
      const entryYear = parseInt(e.date.slice(0, 4), 10);
      return e.date.slice(5) === todayMonthDay && entryYear < todayYear && (e.content?.trim() || e.mood);
    });
  }, [entries, todayStr]);

  // Available unique months for filtering
  const availableMonths = useMemo(() => {
    const set = new Set<string>();
    entries.forEach((e) => {
      set.add(e.date.slice(0, 7)); // 'YYYY-MM'
    });
    return Array.from(set).sort((a, b) => b.localeCompare(a));
  }, [entries]);

  // Check if today already has an entry
  const todayEntry = useMemo(() => {
    return entries.find((e) => e.date === todayStr);
  }, [entries, todayStr]);

  // Check for "Để đó, mai đọc lại" alerts (entries with readLaterDate <= today and not yet opened)
  const pendingReadLaterEntries = useMemo(() => {
    return entries.filter((e) => e.readLaterDate && e.readLaterDate <= todayStr && !e.readLaterUnlocked);
  }, [entries, todayStr]);

  // Handle opening an entry
  const handleOpenDate = (dateString: string) => {
    setSelectedDate(dateString);
    setIsEditorOpen(true);
  };

  // Handle saving entry - guaranteed single entry per date, no duplicates (LỖI 8)
  const handleSaveEntry = (newEntry: JournalEntry) => {
    setEntries((prev) => {
      const idx = prev.findIndex((e) => e.id === newEntry.id || e.date === newEntry.date);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = {
          ...prev[idx],
          ...newEntry,
          id: prev[idx].id || newEntry.id,
          date: newEntry.date,
          updatedAt: new Date().toISOString()
        };
        return next;
      }
      return [newEntry, ...prev];
    });
  };

  // Handle deleting entry
  const handleDeleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  // Handle capsule actions
  const handleAddCapsule = (newCapsule: TimeCapsule) => {
    setCapsules((prev) => [newCapsule, ...prev]);
  };

  const handleOpenCapsule = (id: string) => {
    setCapsules((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isOpened: true, openedAt: new Date().toISOString() } : c))
    );
  };

  const handleDeleteCapsule = (id: string) => {
    setCapsules((prev) => prev.filter((c) => c.id !== id));
  };

  // Export entries to file
  const handleExportJournal = () => {
    const dataStr = JSON.stringify({ entries, capsules, exportedAt: new Date().toISOString() }, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nhat-ky-cua-minh-${todayStr}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Clear all entries
  const handleClearAll = () => {
    setEntries([]);
    setCapsules([]);
    setShowClearConfirm(false);
  };

  // Filtered entries for Timeline / Đọc lại
  const filteredEntries = useMemo(() => {
    return entries.filter((e) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesContent = e.content.toLowerCase().includes(q);
        const matchesTitle = e.title?.toLowerCase().includes(q) || false;
        const matchesTag = e.tags?.some((t) => t.toLowerCase().includes(q)) || false;
        if (!matchesContent && !matchesTitle && !matchesTag) return false;
      }
      if (selectedMonthFilter && !e.date.startsWith(selectedMonthFilter)) return false;
      if (selectedMoodFilter && e.mood !== selectedMoodFilter) return false;
      if (selectedTagFilter && !e.tags?.includes(selectedTagFilter)) return false;
      if (lockStatusFilter === 'locked' && !isJournalLocked(e)) return false;
      if (lockStatusFilter === 'unlocked' && isJournalLocked(e)) return false;
      return true;
    }).sort((a, b) => b.date.localeCompare(a.date));
  }, [entries, searchQuery, selectedMonthFilter, selectedMoodFilter, selectedTagFilter, lockStatusFilter]);

  // Section 10: Group entries by Month (e.g. September 2026, August 2026)
  const groupedTimelineByMonth = useMemo(() => {
    const map = new Map<string, { monthKey: string; monthLabel: string; items: JournalEntry[] }>();

    filteredEntries.forEach((entry) => {
      const [yearStr, monthStr] = entry.date.split('-');
      const monthKey = `${yearStr}-${monthStr}`;

      if (!map.has(monthKey)) {
        const dateObj = new Date(parseInt(yearStr, 10), parseInt(monthStr, 10) - 1, 1);
        const englishMonth = dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        const viMonth = `Tháng ${parseInt(monthStr, 10)}, ${yearStr}`;
        map.set(monthKey, {
          monthKey,
          monthLabel: `${viMonth} · ${englishMonth}`,
          items: []
        });
      }

      map.get(monthKey)!.items.push(entry);
    });

    return Array.from(map.values());
  }, [filteredEntries]);

  // Extract all unique tags
  const allUniqueTags = useMemo(() => {
    const set = new Set<string>();
    entries.forEach((e) => {
      e.tags?.forEach((t) => set.add(t));
    });
    return Array.from(set);
  }, [entries]);

  // If locked by PIN, show Lock Screen
  if (pin && !isUnlocked) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white border border-rose-100 shadow-xl text-center space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto text-3xl font-bold">
            🔒
          </div>
          <div className="space-y-1.5">
            <h2 className="text-2xl font-black text-slate-900">Nhật ký riêng tư</h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
              Không gian này đã được khóa bằng mã PIN bảo mật cá nhân. Những gì bạn viết chỉ dành cho riêng bạn.
            </p>
          </div>
          <button
            onClick={() => setIsPinModalOpen(true)}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
          >
            Nhập mã PIN để mở khóa
          </button>
          <JournalPinModal
            isOpen={isPinModalOpen}
            onClose={() => setIsPinModalOpen(false)}
            currentPin={pin}
            onSetPin={handleSetPin}
            isUnlocked={isUnlocked}
            onUnlockSuccess={() => setIsUnlocked(true)}
          />
        </div>
      </div>
    );
  }

  const selectedEntryObj = entries.find((e) => e.date === selectedDate);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-300">

      {/* Guest Mode Notice Banner */}
      {!isLoggedIn && (
        <div className="p-4 rounded-2xl bg-[#FFF8EE] border border-[#F0DFCD] text-[#7A4B2A] text-xs sm:text-sm flex items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-start sm:items-center gap-2.5">
            <span className="text-xl shrink-0">🍃</span>
            <div className="leading-relaxed">
              <strong className="font-serif font-bold text-[#5A351D]">Bạn đang ở Chế độ khách:</strong>{' '}
              <span className="text-[#6E472D]">
                Mọi trang nhật ký viết trong phiên này chỉ lưu tạm thời trong bộ nhớ và sẽ được làm mới sạch sẽ khi bạn tải lại trang (F5) hoặc thoát ra. Hãy đăng nhập tài khoản chính thức để lưu trữ bền vững vào sổ tay nhé!
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 1. Header Hero Card with Daily Quote */}
      <div className="relative overflow-hidden bg-gradient-to-br from-rose-100/70 via-amber-50/70 to-emerald-50/60 rounded-3xl p-6 sm:p-8 border border-rose-200/80 shadow-xs">
        
        {/* Decorative soft backdrop shapes */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-rose-300/30 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-amber-200/30 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-rose-200 text-xs font-bold text-rose-700 shadow-2xs">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Không gian riêng tư • Chỉ dành cho bạn</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>📖 Nhật ký của mình</span>
            </h1>

            <p className="text-base sm:text-lg font-bold text-slate-800 italic">
              “{getDailyJournalQuote()}”
            </p>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Một chỗ nhỏ để cất lại những điều đã xảy ra, suy nghĩ, cảm xúc hay chuyện nhảm nhí trong ngày. Viết lại hôm nay, để một ngày nào đó quay lại gặp phiên bản mình của ngày hôm nay. 🌱
            </p>
          </div>

          {/* Quick Header Actions */}
          <div className="flex flex-col sm:flex-row md:flex-col items-stretch gap-2.5 shrink-0 w-full md:w-auto">
            <button
              onClick={() => handleOpenDate(todayStr)}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer transform active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>{todayEntry ? 'Mở nhật ký hôm nay 📖' : 'Viết cho hôm nay ✍️'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPinModalOpen(true)}
                title={pin ? 'Đang bật mã PIN bảo vệ' : 'Đặt mã PIN riêng tư'}
                className={`flex-1 px-3 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  pin
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-white/80 hover:bg-white text-slate-700 border-slate-200'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{pin ? 'Đã khóa PIN' : 'Cài mã PIN'}</span>
              </button>

              <button
                onClick={handleExportJournal}
                title="Tải bản sao lưu nhật ký về máy"
                className="px-3 py-2 rounded-xl bg-white/80 hover:bg-white text-slate-700 text-xs font-semibold border border-slate-200 transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sao lưu</span>
              </button>

              <button
                onClick={() => setShowClearConfirm(true)}
                title="Quản lý / Xóa toàn bộ nhật ký"
                className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* 2. "Để đó, mai đọc lại" Notification Banner if ready */}
      {pendingReadLaterEntries.length > 0 && (
        <div className="p-4 sm:p-5 rounded-3xl bg-amber-50 border border-amber-300 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-bounce-short">
          <div className="flex items-center gap-3">
            <span className="text-3xl">💌</span>
            <div className="space-y-0.5">
              <h4 className="font-extrabold text-sm sm:text-base text-amber-950">
                Bạn có một điều mình của ngày trước để lại!
              </h4>
              <p className="text-xs text-amber-800">
                Trang nhật ký ngày {formatVietnameseDateFull(pendingReadLaterEntries[0].date)} đã đến lúc mở ra đọc lại rồi nè.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              handleSaveEntry({
                ...pendingReadLaterEntries[0],
                readLaterUnlocked: true
              });
              handleOpenDate(pendingReadLaterEntries[0].date);
            }}
            className="px-5 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <span>Mở ra ngay 💌</span>
          </button>
        </div>
      )}

      {/* SECTION 11: "Ngày này năm ấy" (Only if real entry exists for this day in past years) */}
      {onThisDayEntry && (
        <div className="p-4 sm:p-5 rounded-3xl bg-amber-50/90 border border-amber-200/90 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl sm:text-3xl p-2 rounded-2xl bg-amber-100 text-amber-900 shrink-0">
              📸
            </span>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase text-amber-900 tracking-wider">
                  Ngày này năm ấy
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-200/70 text-amber-900">
                  {formatVietnameseDateFull(onThisDayEntry.date)}
                </span>
                {onThisDayEntry.mood && <span>{onThisDayEntry.mood}</span>}
              </div>
              <p className="text-xs sm:text-sm text-stone-800 font-medium line-clamp-2 italic">
                “{onThisDayEntry.content}”
              </p>
            </div>
          </div>
          <button
            onClick={() => handleOpenDate(onThisDayEntry.date)}
            className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all shrink-0 cursor-pointer"
          >
            Mở lại trang này 📖
          </button>
        </div>
      )}

      {/* 3. Today's Dedicated Status Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-rose-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-50 to-amber-50 border border-rose-200/80 flex flex-col items-center justify-center text-slate-800 shrink-0 shadow-2xs">
            <span className="text-[10px] font-bold text-rose-600 uppercase">Hôm nay</span>
            <span className="text-lg font-black leading-none">{formatVietnameseShortDate(todayStr)}</span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm sm:text-base text-slate-900">
                Trang của ngày {formatVietnameseDateFull(todayStr)}
              </span>
              {todayEntry && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" /> Đã ghi lại
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              {todayEntry
                ? `Bạn đã để lại một điều cho ngày hôm nay ${todayEntry.mood ? `(${todayEntry.mood})` : ''}. Bấm để xem hoặc viết thêm.`
                : 'Một trang mới còn trống. Hôm nay có gì vui, buồn hay nhảm nhí, để lại một vài dòng nhé! 🌱'}
            </p>
          </div>
        </div>

        <button
          onClick={() => handleOpenDate(todayStr)}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
        >
          {todayEntry ? <span>📖 Mở nhật ký</span> : <span>✍️ Viết vài dòng</span>}
        </button>
      </div>

      {/* 4. Sub-Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-rose-100 pb-2">
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1 max-w-full">
          {[
            { id: 'timeline', label: '📖 Đọc lại nhật ký' },
            { id: 'calendar', label: '🗓️ Lịch nhật ký' },
            { id: 'capsule', label: '💌 Gửi tương lai' },
            { id: 'reflection', label: '🪞 Nhìn lại & Kỷ niệm' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeSubTab === tab.id
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Active Sub-View Body */}

      {/* VIEW A: Calendar Grid */}
      {activeSubTab === 'calendar' && (
        <div className="space-y-6">
          <JournalCalendar
            currentMonth={currentCalendarMonth}
            onMonthChange={setCurrentCalendarMonth}
            entries={entries}
            selectedDate={selectedDate}
            onSelectDate={handleCalendarSelectDate}
            onOpenToday={() => handleCalendarSelectDate(todayStr)}
          />

          {/* Quick instructions reassurance */}
          <div className="p-4 rounded-2xl bg-white border border-rose-100/70 text-xs text-slate-500 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="text-base">💡</span>
              <span>
                Nhật ký không ép bạn viết dài. Một từ như <em>“Mệt.”</em> hay chỉ một chiếc emoji <em>“🥲”</em> cũng là một ngày trọn vẹn.
              </span>
            </span>
            <span className="hidden sm:inline text-rose-600 font-semibold">100% Ẩn danh</span>
          </div>
        </div>
      )}

      {/* VIEW B: Đọc lại nhật ký & Future Diary */}
      {activeSubTab === 'timeline' && (
        <div className="space-y-6">
          
          {/* Header title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-stone-900 flex items-center gap-2">
                <span>📖 Đọc lại nhật ký</span>
                <span className="text-xs font-bold text-stone-400">({filteredEntries.length} trang)</span>
              </h3>
              <p className="text-xs text-stone-500 font-medium">
                Những trang nhật ký đã qua và các trang hẹn giờ mở lại (Time-locked Diary) cho tương lai.
              </p>
            </div>

            {/* Quick Lock Filter Pills */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-stone-100 border border-stone-200/80 text-xs shrink-0 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setLockStatusFilter('all')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  lockStatusFilter === 'all'
                    ? 'bg-white text-stone-900 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Tất cả
              </button>
              <button
                type="button"
                onClick={() => setLockStatusFilter('locked')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  lockStatusFilter === 'locked'
                    ? 'bg-amber-700 text-white shadow-2xs'
                    : 'text-amber-800 hover:text-amber-950'
                }`}
              >
                <Lock className="w-3 h-3" />
                <span>Đang bị khóa</span>
              </button>
              <button
                type="button"
                onClick={() => setLockStatusFilter('unlocked')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  lockStatusFilter === 'unlocked'
                    ? 'bg-stone-900 text-white shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Unlock className="w-3 h-3" />
                <span>Đã mở khóa</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-2xs space-y-3.5">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm trong nhật ký..."
                  className="w-full pl-10 pr-4 py-2 rounded-2xl border border-stone-200 text-xs sm:text-sm focus:outline-hidden focus:border-stone-400 bg-stone-50/60"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700 cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Month selector dropdown / pill */}
              {availableMonths.length > 0 && (
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 shrink-0">
                  <button
                    onClick={() => setSelectedMonthFilter(null)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border transition-all cursor-pointer ${
                      selectedMonthFilter === null
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    Tất cả các tháng
                  </button>
                  {availableMonths.map((m) => {
                    const [y, mo] = m.split('-');
                    return (
                      <button
                        key={m}
                        onClick={() => setSelectedMonthFilter(selectedMonthFilter === m ? null : m)}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border transition-all cursor-pointer ${
                          selectedMonthFilter === m
                            ? 'bg-stone-900 text-white border-stone-900 shadow-2xs'
                            : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        Tháng {parseInt(mo, 10)}/{y}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Mood Filter Pill Row (All 9 moods) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <span className="text-stone-400 shrink-0 font-medium mr-1">Mood:</span>
              <button
                onClick={() => setSelectedMoodFilter(null)}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedMoodFilter === null
                    ? 'bg-stone-200 text-stone-900 font-bold'
                    : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
                }`}
              >
                Tất cả
              </button>
              {JOURNAL_MOODS.map((m) => (
                <button
                  key={m.emoji}
                  onClick={() => setSelectedMoodFilter(selectedMoodFilter === m.emoji ? null : m.emoji)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                    selectedMoodFilter === m.emoji
                      ? 'bg-stone-900 text-white shadow-2xs'
                      : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border border-stone-100'
                  }`}
                >
                  <span>{m.emoji}</span>
                  <span>{m.label}</span>
                </button>
              ))}
            </div>

            {/* Tag Filter Pills */}
            {allUniqueTags.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-stone-100 text-xs">
                <span className="text-stone-400 flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  <span>Tag:</span>
                </span>
                {allUniqueTags.map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTagFilter(selectedTagFilter === t ? null : t)}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      selectedTagFilter === t
                        ? 'bg-stone-900 text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
                {selectedTagFilter && (
                  <button
                    onClick={() => setSelectedTagFilter(null)}
                    className="text-xs text-stone-400 hover:text-stone-700 underline ml-1"
                  >
                    Bỏ lọc tag
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Month Grouped Timeline */}
          {groupedTimelineByMonth.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white border border-dashed border-stone-200 text-center space-y-2">
              <span className="text-3xl">🍃</span>
              <p className="text-sm font-bold text-stone-800">Chưa có trang nhật ký nào</p>
              <p className="text-xs text-stone-500">
                Thử chọn mốc thời gian khác hoặc bắt đầu viết cho hôm nay nhé.
              </p>
            </div>
          ) : (
            groupedTimelineByMonth.map((group) => (
              <div key={group.monthKey} className="space-y-4">
                <div className="flex items-center gap-2 pt-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-stone-800"></span>
                  <h4 className="font-black text-base text-stone-900 tracking-tight">
                    {group.monthLabel}
                  </h4>
                  <span className="text-xs font-semibold text-stone-400">({group.items.length})</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {group.items.map((item) => {
                    const dateObj = new Date(item.date);
                    const dayNum = String(dateObj.getDate()).padStart(2, '0');
                    const englishWeekday = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                    const isLocked = isJournalLocked(item);
                    const effectiveUnlock = item.unlockDate || item.readLaterDate;

                    if (isLocked) {
                      return (
                        <div
                          key={item.id}
                          onClick={() => handleEntryCardClick(item)}
                          className="p-5 rounded-3xl bg-amber-50/50 hover:bg-amber-100/60 border border-amber-200/90 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between space-y-3 group relative overflow-hidden"
                          title="Trang nhật ký đang bị khóa hẹn giờ. Bấm để xem mốc thời gian hoặc mở khóa."
                        >
                          <div className="space-y-2.5">
                            {/* Day & Weekday + Locked Status badge */}
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-amber-950 group-hover:text-amber-900 transition-colors">
                                {dayNum} · {englishWeekday}
                              </span>
                              <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[11px] flex items-center gap-1 shadow-2xs">
                                <Lock className="w-3 h-3 text-amber-700" />
                                <span>Đang bị khóa</span>
                              </span>
                            </div>

                            {/* Locked Title Placeholder */}
                            <div className="font-extrabold text-sm text-amber-950 flex items-center gap-1.5">
                              <span>🔒</span>
                              <span className="line-clamp-1">
                                {item.title ? 'Bài viết niêm phong hẹn giờ' : 'Trang nhật ký gửi tương lai'}
                              </span>
                            </div>

                            {/* Unlock target and blurred content */}
                            <div className="space-y-2 py-0.5">
                              <div className="p-2.5 rounded-2xl bg-white/90 border border-amber-200 text-amber-950 text-[11px] space-y-0.5 shadow-2xs">
                                <div className="font-bold flex items-center gap-1 text-amber-900">
                                  <span>⏳ Mở khóa vào:</span>
                                  <span className="text-amber-950 font-extrabold">{formatUnlockDateLabel(effectiveUnlock!)}</span>
                                </div>
                                <div className="text-amber-700 font-semibold text-[10px]">
                                  {formatRemainingTimeText(effectiveUnlock!)}
                                </div>
                              </div>

                              {/* Blurred preview to hide confidential details until unlocked */}
                              <div className="relative overflow-hidden rounded-xl p-1 bg-amber-50/30">
                                <p className="text-xs text-stone-400 select-none filter blur-[3.5px] leading-relaxed line-clamp-2 pointer-events-none opacity-60">
                                  Hôm nay mình có những dòng suy nghĩ muốn gửi lại cho bản thân ngày sau. Khi thời gian trôi qua đến đúng ngày hẹn, trang này mới mở ra.
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Footer with lock notice */}
                          <div className="flex items-center justify-between gap-1 pt-2 border-t border-amber-200/60 text-[11px] text-amber-800 font-medium">
                            <span className="flex items-center gap-1 text-amber-700 font-semibold">
                              <Clock className="w-3 h-3" />
                              <span>Hẹn giờ mở lại</span>
                            </span>
                            <span className="text-amber-900 font-bold group-hover:underline flex items-center gap-0.5">
                              <span>Bấm để xem</span>
                              <span className="text-xs">›</span>
                            </span>
                          </div>
                        </div>
                      );
                    }

                    // Regular / Unlocked entry
                    const wasTimeLocked = !!effectiveUnlock;
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleEntryCardClick(item)}
                        className="p-5 rounded-3xl bg-white hover:bg-stone-50/80 border border-stone-200/90 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
                      >
                        <div className="space-y-2">
                          {/* Day & Weekday + Mood */}
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-stone-600 group-hover:text-stone-900 transition-colors">
                              {dayNum} · {englishWeekday}
                            </span>
                            <div className="flex items-center gap-1.5">
                              {wasTimeLocked && (
                                <span 
                                  className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold flex items-center gap-1"
                                  title={`Đã đến hạn mở khóa (${formatUnlockDateLabel(effectiveUnlock)})`}
                                >
                                  <Unlock className="w-2.5 h-2.5" />
                                  <span>Đã mở</span>
                                </span>
                              )}
                              <span className="text-xl group-hover:scale-110 transition-transform">
                                {item.mood || '📝'}
                              </span>
                            </div>
                          </div>

                          {item.title && (
                            <div className="font-extrabold text-sm text-stone-900 group-hover:text-amber-700 transition-colors line-clamp-1">
                              {item.title}
                            </div>
                          )}

                          <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed font-medium">
                            {item.content || <span className="italic text-stone-400">(Chưa có nội dung chữ)</span>}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-1 pt-2 border-t border-stone-100 text-[11px] text-stone-400">
                          <div className="flex items-center gap-1">
                            {item.tags && item.tags.slice(0, 2).map((t, i) => (
                              <span key={i} className="text-stone-600 font-semibold">{t}</span>
                            ))}
                          </div>
                          {item.isFavorite && <span className="text-amber-500 font-bold">⭐ Kỷ niệm</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}

        </div>
      )}

      {/* VIEW C: Time Capsule */}
      {activeSubTab === 'capsule' && (
        <JournalTimeCapsule
          capsules={capsules}
          onAddCapsule={handleAddCapsule}
          onOpenCapsule={handleOpenCapsule}
          onDeleteCapsule={handleDeleteCapsule}
        />
      )}

      {/* VIEW D: Reflections & Milestones */}
      {activeSubTab === 'reflection' && (
        <JournalReflections
          entries={entries}
          onOpenEntry={handleOpenDate}
        />
      )}

      {/* Editor / Viewer Modal */}
      <JournalEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        dateStr={selectedDate}
        existingEntry={selectedEntryObj}
        initialPromptText={initialPromptText}
        onSaveEntry={handleSaveEntry}
        onDeleteEntry={handleDeleteEntry}
        onAskChatbotWithText={onAskChatbotWithText}
      />

      {/* Time-locked Diary Modal */}
      {timeLockedEntry && (
        <JournalTimeLockModal
          isOpen={isTimeLockModalOpen}
          onClose={() => {
            setIsTimeLockModalOpen(false);
            setTimeLockedEntry(null);
          }}
          entry={timeLockedEntry}
          savedPin={pin}
          onUnlockSuccess={() => {
            const entryToOpen = timeLockedEntry;
            setIsTimeLockModalOpen(false);
            setTimeLockedEntry(null);
            handleOpenDate(entryToOpen.date);
          }}
        />
      )}

      {/* PIN Security Modal */}
      <JournalPinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        currentPin={pin}
        onSetPin={handleSetPin}
        isUnlocked={isUnlocked}
        onUnlockSuccess={() => setIsUnlocked(true)}
      />

      {/* Clear All Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 text-center border border-red-200 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto text-2xl font-bold">
              🗑️
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900">Xóa toàn bộ nhật ký?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Bạn chắc chắn muốn xóa toàn bộ nhật ký? Hành động này không thể hoàn tác. Mọi trang viết và thư gửi tương lai sẽ bị xóa sạch khỏi trình duyệt.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2.5 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                Giữ lại
              </button>
              <button
                onClick={handleClearAll}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Xóa toàn bộ
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
