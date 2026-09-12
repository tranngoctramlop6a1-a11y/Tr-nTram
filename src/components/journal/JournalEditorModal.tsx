import React, { useState, useEffect, useRef } from 'react';
import { JournalEntry, JournalTheme, JournalMessageItem } from '../../types';
import { 
  JOURNAL_MOODS, 
  JOURNAL_STICKERS, 
  JOURNAL_DEFAULT_TAGS, 
  DONT_KNOW_WHAT_TO_WRITE_PROMPTS, 
  CATEGORIZED_PROMPTS,
  formatVietnameseDateFull,
  formatEnglishDate,
  formatDayHeader,
  getDailyJournalThought,
  getJournalDraft,
  saveJournalDraft,
  clearJournalDraft
} from '../../data/journalData';
import { 
  X, 
  Check, 
  Trash2, 
  Heart, 
  MessageCircle, 
  Send,
  Plus,
  Clock,
  Sparkles,
  ChevronDown,
  Lock
} from 'lucide-react';
import { JournalStyleDisplay, JournalScrapbookStyle } from './JournalStyleDisplay';

interface JournalEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  dateStr: string; // 'YYYY-MM-DD'
  existingEntry?: JournalEntry;
  initialPromptText?: string;
  onSaveEntry: (entry: JournalEntry) => void;
  onDeleteEntry: (id: string) => void;
  onAskChatbotWithText?: (text: string) => void;
}

export const JournalEditorModal: React.FC<JournalEditorModalProps> = ({
  isOpen,
  onClose,
  dateStr,
  existingEntry,
  initialPromptText,
  onSaveEntry,
  onDeleteEntry,
  onAskChatbotWithText
}) => {
  // Primary diary data states
  const [content, setContent] = useState('');
  const [messages, setMessages] = useState<JournalMessageItem[]>([]);
  const [title, setTitle] = useState('');
  const [mood, setMood] = useState<string | undefined>(undefined);
  const [moodLabel, setMoodLabel] = useState<string | undefined>(undefined);
  const [tags, setTags] = useState<string[]>([]);
  const [stickers, setStickers] = useState<string[]>([]);
  const [theme, setTheme] = useState<JournalTheme>('gentle');
  const [readLaterDate, setReadLaterDate] = useState<string | undefined>(undefined);
  const [reflectionNote, setReflectionNote] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  // Chat-diary input state
  const [inputText, setInputText] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Visual scrapbook style toggle
  const [activeStyle, setActiveStyle] = useState<JournalScrapbookStyle>('auto');

  // Interactive header dropdowns
  const [showMoodSelector, setShowMoodSelector] = useState(false);
  const [showTagSelector, setShowTagSelector] = useState(false);
  const [showCustomTagInput, setShowCustomTagInput] = useState(false);
  const [customTag, setCustomTag] = useState('');

  // Status & autosave
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'idle'>('idle');
  const [showPromptCategories, setShowPromptCategories] = useState(false);
  const [currentPromptIdx, setCurrentPromptIdx] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showReadLaterPicker, setShowReadLaterPicker] = useState(false);

  const autoSaveTimerRef = useRef<any>(null);
  const prevOpenRef = useRef<boolean>(false);
  const prevDateRef = useRef<string | null>(null);

  const getTodayStr = () => {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${mm}-${dd}`;
  };
  const todayStr = getTodayStr();
  const isOldEntry = dateStr < todayStr;

  // Header formatted information
  const dayHeader = formatDayHeader(dateStr);
  const englishDate = formatEnglishDate(dateStr);
  const dailyThought = getDailyJournalThought(dateStr);

  // Helper to parse content into messages if messages is empty
  const parseMessagesFromContent = (text: string, existingMsgs?: JournalMessageItem[]): JournalMessageItem[] => {
    if (existingMsgs && existingMsgs.length > 0) return existingMsgs;
    if (!text.trim()) return [];
    const chunks = text.split(/\n\n+/).filter((c) => c.trim().length > 0);
    return chunks.map((chunk, idx) => ({
      id: `init-msg-${idx}-${Date.now()}`,
      time: idx === 0 ? 'Đầu ngày' : `Đoạn #${idx + 1}`,
      text: chunk.trim()
    }));
  };

  // State synchronization when opened or date changes
  useEffect(() => {
    if (!isOpen) {
      prevOpenRef.current = false;
      return;
    }

    const isFirstOpen = !prevOpenRef.current;
    const isDifferentDate = prevDateRef.current !== dateStr;

    if (isFirstOpen || isDifferentDate) {
      prevOpenRef.current = true;
      prevDateRef.current = dateStr;

      // 1. Check local draft
      const draft = getJournalDraft(dateStr);

      if (draft && (draft.content?.trim() || draft.title?.trim() || draft.mood || (draft.messages && draft.messages.length > 0))) {
        const rawContent = draft.content || '';
        setContent(rawContent);
        setMessages(draft.messages && draft.messages.length > 0 ? draft.messages : parseMessagesFromContent(rawContent));
        setTitle(draft.title || '');
        setMood(draft.mood);
        setMoodLabel(draft.moodLabel || JOURNAL_MOODS.find((m) => m.emoji === draft.mood)?.label);
        setTags(draft.tags || []);
        setStickers(draft.stickers || []);
        setTheme(draft.theme || 'gentle');
        setReadLaterDate(draft.readLaterDate);
        setReflectionNote(draft.reflectionNote || '');
        setIsFavorite(!!draft.isFavorite);
        setSaveStatus('saved');
      } else if (existingEntry && (existingEntry.content?.trim() || existingEntry.mood || (existingEntry.messages && existingEntry.messages.length > 0))) {
        // 2. Existing entry
        const rawContent = existingEntry.content || '';
        setContent(rawContent);
        setMessages(existingEntry.messages && existingEntry.messages.length > 0 ? existingEntry.messages : parseMessagesFromContent(rawContent, existingEntry.messages));
        setTitle(existingEntry.title || '');
        setMood(existingEntry.mood);
        setMoodLabel(existingEntry.moodLabel || JOURNAL_MOODS.find((m) => m.emoji === existingEntry.mood)?.label);
        setTags(existingEntry.tags || []);
        setStickers(existingEntry.stickers || []);
        setTheme(existingEntry.theme || 'gentle');
        setReadLaterDate(existingEntry.readLaterDate);
        setReflectionNote(existingEntry.reflectionNote || '');
        setIsFavorite(!!existingEntry.isFavorite);
        setSaveStatus('saved');
      } else {
        // 3. Completely empty
        const initialText = initialPromptText ? `🌱 ${initialPromptText}\n\n` : '';
        setContent(initialText);
        setMessages(initialText ? [{ id: `init-${Date.now()}`, time: 'Gợi ý', text: initialText.trim() }] : []);
        setTitle('');
        setMood(undefined);
        setMoodLabel(undefined);
        setTags([]);
        setStickers([]);
        setTheme('gentle');
        setReadLaterDate(undefined);
        setReflectionNote('');
        setIsFavorite(false);
        setSaveStatus('idle');
      }

      setInputText('');
      setShowMoodSelector(false);
      setShowTagSelector(false);
    }
  }, [isOpen, dateStr]);

  // Section 8: Atmospheric mood background and accents
  const getAtmosphereClasses = () => {
    switch (mood) {
      case '😊':
        return {
          wrapper: 'bg-[#FCFAF6] border-amber-200/90 text-stone-900',
          headerBadge: 'bg-amber-100/80 text-amber-900 border-amber-300/80',
          accent: 'text-amber-700'
        };
      case '🙂':
        return {
          wrapper: 'bg-[#F8FAF9] border-teal-200/80 text-stone-900',
          headerBadge: 'bg-teal-100/80 text-teal-900 border-teal-300/80',
          accent: 'text-teal-700'
        };
      case '😔':
      case '🥺':
        return {
          wrapper: 'bg-[#F7F9FB] border-sky-200/80 text-stone-900',
          headerBadge: 'bg-sky-100/80 text-sky-900 border-sky-300/80',
          accent: 'text-sky-700'
        };
      case '😣':
      case '😰':
      case '😡':
        return {
          wrapper: 'bg-[#FAF8FB] border-indigo-200/80 text-stone-900',
          headerBadge: 'bg-indigo-100/80 text-indigo-900 border-indigo-300/80',
          accent: 'text-indigo-700'
        };
      case '😐':
      case '🤷':
      default:
        return {
          wrapper: 'bg-[#FAFAFA] border-stone-200 text-stone-900',
          headerBadge: 'bg-stone-100 text-stone-800 border-stone-200',
          accent: 'text-stone-700'
        };
    }
  };

  const atmosphere = getAtmosphereClasses();

  // Debounced Auto-save and draft sync
  // CRITICAL: NEVER closes editor, NEVER sets read-only, pausing does not exit!
  const triggerAutoSave = (
    newContent: string,
    newMessages: JournalMessageItem[],
    newTitle: string,
    newMood?: string,
    newTags?: string[],
    newStickers?: string[],
    newTheme?: JournalTheme,
    newReadLater?: string,
    newReflection?: string,
    newFav?: boolean
  ) => {
    // 1. Instant sync to localStorage draft
    saveJournalDraft(dateStr, {
      content: newContent,
      messages: newMessages,
      title: newTitle,
      mood: newMood,
      moodLabel: JOURNAL_MOODS.find((m) => m.emoji === newMood)?.label,
      tags: newTags ?? tags,
      stickers: newStickers ?? stickers,
      theme: newTheme ?? theme,
      readLaterDate: newReadLater ?? readLaterDate,
      reflectionNote: newReflection ?? reflectionNote,
      isFavorite: typeof newFav === 'boolean' ? newFav : isFavorite
    });

    if (!newContent.trim() && !newTitle.trim() && !newMood && newMessages.length === 0) {
      setSaveStatus('idle');
      return;
    }

    setSaveStatus('saving');

    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);

    autoSaveTimerRef.current = setTimeout(() => {
      const nowIso = new Date().toISOString();
      const updated: JournalEntry = {
        id: existingEntry?.id || `journal-${dateStr}`,
        date: dateStr,
        createdAt: existingEntry?.createdAt || nowIso,
        updatedAt: nowIso,
        title: newTitle.trim() || undefined,
        content: newContent,
        messages: newMessages,
        mood: newMood,
        moodLabel: JOURNAL_MOODS.find((m) => m.emoji === newMood)?.label,
        tags: newTags ?? tags,
        stickers: newStickers ?? stickers,
        theme: newTheme ?? theme,
        readLaterDate: newReadLater ?? readLaterDate,
        reflectionNote: (newReflection ?? reflectionNote)?.trim() || undefined,
        isFavorite: typeof newFav === 'boolean' ? newFav : isFavorite
      };

      onSaveEntry(updated);
      setSaveStatus('saved');
    }, 600);
  };

  // Section 6: Sending a new message/thought in the chat diary
  const handleSendMessage = () => {
    const text = inputText.trim();
    if (!text) return;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newMsg: JournalMessageItem = {
      id: `msg-${Date.now()}`,
      time: timeStr,
      text
    };

    const nextMessages = [...messages, newMsg];
    const nextContent = nextMessages.map((m) => m.text).join('\n\n');

    setMessages(nextMessages);
    setContent(nextContent);
    setInputText('');

    // Trigger instant autosave without closing or exiting!
    triggerAutoSave(nextContent, nextMessages, title, mood, tags, stickers, theme, readLaterDate, reflectionNote, isFavorite);

    // Keep focus on input for typing next thoughts immediately
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  // Keyboard shortcut: Enter sends message, Shift+Enter makes newline
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Edit an existing message
  const handleEditMessage = (id: string, newText: string) => {
    const nextMessages = messages.map((m) => (m.id === id ? { ...m, text: newText } : m));
    const nextContent = nextMessages.map((m) => m.text).join('\n\n');
    setMessages(nextMessages);
    setContent(nextContent);
    triggerAutoSave(nextContent, nextMessages, title, mood, tags, stickers, theme, readLaterDate, reflectionNote, isFavorite);
  };

  // Delete a message
  const handleDeleteMessage = (id: string) => {
    const nextMessages = messages.filter((m) => m.id !== id);
    const nextContent = nextMessages.map((m) => m.text).join('\n\n');
    setMessages(nextMessages);
    setContent(nextContent);
    triggerAutoSave(nextContent, nextMessages, title, mood, tags, stickers, theme, readLaterDate, reflectionNote, isFavorite);
  };

  // Section 4: Mood selection
  const handleSelectMood = (emoji: string, label: string) => {
    const nextMood = mood === emoji ? undefined : emoji;
    const nextLabel = nextMood ? label : undefined;
    setMood(nextMood);
    setMoodLabel(nextLabel);
    setShowMoodSelector(false);
    triggerAutoSave(content, messages, title, nextMood, tags, stickers, theme, readLaterDate, reflectionNote, isFavorite);
  };

  // Section 5: Tag toggling
  const handleToggleTag = (tag: string) => {
    let nextTags: string[];
    if (tags.includes(tag)) {
      nextTags = tags.filter((t) => t !== tag);
    } else {
      nextTags = [...tags, tag];
    }
    setTags(nextTags);
    triggerAutoSave(content, messages, title, mood, nextTags, stickers, theme, readLaterDate, reflectionNote, isFavorite);
  };

  const handleAddCustomTag = () => {
    let formatted = customTag.trim();
    if (!formatted) return;
    if (!formatted.startsWith('#')) formatted = '#' + formatted;
    if (!tags.includes(formatted)) {
      const nextTags = [...tags, formatted];
      setTags(nextTags);
      triggerAutoSave(content, messages, title, mood, nextTags, stickers, theme, readLaterDate, reflectionNote, isFavorite);
    }
    setCustomTag('');
    setShowCustomTagInput(false);
  };

  // Toggle favorite
  const handleToggleFavorite = () => {
    const nextFav = !isFavorite;
    setIsFavorite(nextFav);
    triggerAutoSave(content, messages, title, mood, tags, stickers, theme, readLaterDate, reflectionNote, nextFav);
  };

  // "Không biết viết gì" random prompt
  const handleInsertPrompt = (promptText: string) => {
    setInputText((prev) => (prev ? `${prev}\n${promptText}` : promptText));
    setShowPromptCategories(false);
    inputRef.current?.focus();
  };

  const handleRandomPrompt = () => {
    const nextIdx = (currentPromptIdx + 1) % DONT_KNOW_WHAT_TO_WRITE_PROMPTS.length;
    setCurrentPromptIdx(nextIdx);
    const p = DONT_KNOW_WHAT_TO_WRITE_PROMPTS[nextIdx];
    handleInsertPrompt(p);
  };

  // Explicit completion handler
  const handleFinishAndClose = () => {
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);

    if (content.trim() || title.trim() || mood || messages.length > 0) {
      const nowIso = new Date().toISOString();
      const updated: JournalEntry = {
        id: existingEntry?.id || `journal-${dateStr}`,
        date: dateStr,
        createdAt: existingEntry?.createdAt || nowIso,
        updatedAt: nowIso,
        title: title.trim() || undefined,
        content: content,
        messages: messages,
        mood: mood,
        moodLabel: moodLabel || JOURNAL_MOODS.find((m) => m.emoji === mood)?.label,
        tags: tags,
        stickers: stickers,
        theme: theme,
        readLaterDate: readLaterDate,
        reflectionNote: reflectionNote.trim() || undefined,
        isFavorite: isFavorite
      };
      onSaveEntry(updated);
      clearJournalDraft(dateStr);
    }
    onClose();
  };

  // Modal close handler (persists draft)
  const handleModalClose = () => {
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);

    if (content.trim() || title.trim() || mood || messages.length > 0) {
      saveJournalDraft(dateStr, {
        content,
        messages,
        title,
        mood,
        moodLabel,
        tags,
        stickers,
        theme,
        readLaterDate,
        reflectionNote,
        isFavorite,
        updatedAt: new Date().toISOString()
      });

      const nowIso = new Date().toISOString();
      const updated: JournalEntry = {
        id: existingEntry?.id || `journal-${dateStr}`,
        date: dateStr,
        createdAt: existingEntry?.createdAt || nowIso,
        updatedAt: nowIso,
        title: title.trim() || undefined,
        content: content,
        messages: messages,
        mood: mood,
        moodLabel: moodLabel || JOURNAL_MOODS.find((m) => m.emoji === mood)?.label,
        tags: tags,
        stickers: stickers,
        theme: theme,
        readLaterDate: readLaterDate,
        reflectionNote: reflectionNote.trim() || undefined,
        isFavorite: isFavorite
      };
      onSaveEntry(updated);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className={`w-full max-w-2xl rounded-3xl border shadow-2xl my-auto transition-colors flex flex-col max-h-[94vh] overflow-hidden ${atmosphere.wrapper}`}
      >
        {/* Top Navbar */}
        <div className="px-5 py-3.5 border-b border-stone-200/80 flex items-center justify-between shrink-0 bg-white/70">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-500">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Nhật ký riêng tư</span>
            <span className="hidden sm:inline">•</span>
            <span>{englishDate}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Auto save indicator */}
            <span className="text-[11px] font-semibold text-stone-500 hidden sm:inline-flex items-center gap-1">
              {saveStatus === 'saving' ? (
                <span className="text-amber-600 flex items-center gap-1 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  Đang lưu...
                </span>
              ) : (content.trim() || mood || messages.length > 0) ? (
                <span className="text-emerald-600 flex items-center gap-0.5">
                  <Check className="w-3 h-3" /> Đã lưu
                </span>
              ) : null}
            </span>

            {/* Favorite button */}
            <button
              type="button"
              onClick={handleToggleFavorite}
              title={isFavorite ? 'Bỏ yêu thích' : 'Đánh dấu kỷ niệm'}
              className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                isFavorite ? 'bg-amber-100 text-amber-500' : 'text-stone-400 hover:text-amber-500 hover:bg-stone-100'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>

            {/* Close button */}
            <button
              type="button"
              onClick={handleModalClose}
              className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Diary Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1">
          
          {/* SECTION 7: Header của mỗi ngày */}
          <div className="p-5 rounded-3xl bg-white/90 border border-stone-200/80 shadow-2xs space-y-3.5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight leading-tight">
                  {dayHeader.dayOfWeek}
                </h2>
                <div className="text-xs sm:text-sm font-semibold text-stone-500">
                  {dayHeader.dateFormatted}
                </div>
              </div>

              {/* Section 9: Daily Detail thought */}
              <div className="text-left sm:text-right">
                <span className="text-xs text-stone-400 font-medium italic block">
                  “{dailyThought}”
                </span>
              </div>
            </div>

            {/* Mood pill and Tags row in Header */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100">
              {/* Mood Pill Selector Button */}
              <button
                type="button"
                onClick={() => setShowMoodSelector(!showMoodSelector)}
                className={`px-3 py-1.5 rounded-full border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                  mood
                    ? atmosphere.headerBadge
                    : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <span>{mood || '🙂'}</span>
                <span>{moodLabel || 'Chọn mood'}</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {/* Selected Tags Display */}
              {tags.map((t) => (
                <span
                  key={t}
                  onClick={() => handleToggleTag(t)}
                  title="Nhấn để gỡ tag"
                  className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-semibold hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer inline-flex items-center gap-1"
                >
                  <span>{t}</span>
                  <span className="text-[10px] text-stone-400">✕</span>
                </span>
              ))}

              {/* Add Tag Button */}
              <button
                type="button"
                onClick={() => setShowTagSelector(!showTagSelector)}
                className="px-2.5 py-1 rounded-full border border-dashed border-stone-300 text-stone-500 text-xs font-semibold hover:bg-stone-50 hover:text-stone-800 transition-colors cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Tag</span>
              </button>

              {/* Read later badge if active */}
              {readLaterDate && (
                <span className="ml-auto text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 flex items-center gap-1">
                  <span>💌</span>
                  <span>Đọc lại: {readLaterDate}</span>
                </span>
              )}
            </div>

            {/* SECTION 4: Mood Selector Drawer (The 9 pills) */}
            {showMoodSelector && (
              <div className="pt-3 border-t border-stone-100 space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-xs text-stone-500 font-semibold">
                  <span>Hôm nay bạn thấy thế nào?</span>
                  {mood && (
                    <button
                      type="button"
                      onClick={() => handleSelectMood('', '')}
                      className="text-stone-400 hover:text-stone-700 underline text-[11px]"
                    >
                      Bỏ chọn
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {JOURNAL_MOODS.map((m) => {
                    const isSelected = mood === m.emoji;
                    return (
                      <button
                        key={m.emoji}
                        type="button"
                        onClick={() => handleSelectMood(m.emoji, m.label)}
                        className={`px-3 py-1.5 rounded-2xl border text-xs font-semibold transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? `${m.color} ring-2 ring-stone-800 scale-105 shadow-xs font-bold`
                            : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        <span className="text-base">{m.emoji}</span>
                        <span>{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SECTION 5: Tags Selector Drawer */}
            {showTagSelector && (
              <div className="pt-3 border-t border-stone-100 space-y-2.5 animate-in fade-in duration-200">
                <span className="text-xs text-stone-500 font-semibold block">Gắn chủ đề cho ngày:</span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {JOURNAL_DEFAULT_TAGS.map((t) => {
                    const isSelected = tags.includes(t);
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => handleToggleTag(t)}
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-stone-900 text-white shadow-2xs'
                            : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}

                  {/* Custom tag input */}
                  {showCustomTagInput ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={customTag}
                        onChange={(e) => setCustomTag(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddCustomTag()}
                        placeholder="#tag..."
                        className="w-20 px-2 py-1 text-xs bg-white rounded-lg border border-stone-300 focus:outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomTag}
                        className="px-2 py-1 bg-stone-900 text-white text-xs rounded-lg cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowCustomTagInput(true)}
                      className="px-2 py-1 rounded-full text-xs font-semibold text-stone-500 hover:text-stone-900 border border-dashed border-stone-300 hover:bg-stone-50"
                    >
                      + Tạo tag
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Style switcher pills */}
          <div className="flex items-center justify-between text-xs px-1 text-stone-400">
            <span className="font-semibold">Nội dung trang viết</span>
            <div className="flex items-center gap-1">
              {[
                { id: 'auto', label: 'Tự động' },
                { id: 'chat', label: '💬 Chat' },
                { id: 'paper', label: '📄 Giấy' },
                { id: 'memory', label: '⭐ Kỷ niệm' }
              ].map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setActiveStyle(st.id as JournalScrapbookStyle)}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                    activeStyle === st.id
                      ? 'bg-stone-900 text-white font-bold'
                      : 'text-stone-500 hover:bg-stone-100'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* SECTION 3 & 12: Diary Content rendered in selected scrapbook style */}
          <JournalStyleDisplay
            content={content}
            messages={messages}
            title={title}
            mood={mood}
            moodLabel={moodLabel}
            tags={tags}
            isFavorite={isFavorite}
            dateStr={dateStr}
            activeStyleOverride={activeStyle}
            onDeleteMessage={handleDeleteMessage}
            onEditMessage={handleEditMessage}
            onStartWriting={() => inputRef.current?.focus()}
          />

          {/* Past Reflection Section ("Mình của ngày hôm đó") */}
          {isOldEntry && existingEntry && (
            <div className="p-4 sm:p-5 rounded-3xl bg-stone-100/70 border border-stone-200/80 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🕰️</span>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-stone-900">
                    Mình của ngày hôm đó...
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    Nếu được nói với bạn của ngày {formatVietnameseDateFull(dateStr)} một câu, bạn sẽ nhắn gì?
                  </p>
                </div>
              </div>

              {reflectionNote && (
                <div className="p-3 rounded-2xl bg-white border border-stone-200/80 text-xs sm:text-sm text-stone-800 italic">
                  “{reflectionNote}”
                </div>
              )}

              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={reflectionNote}
                  onChange={(e) => setReflectionNote(e.target.value)}
                  placeholder="Ví dụ: Cảm ơn bạn vì ngày hôm đó đã kiên nhẫn..."
                  className="flex-1 px-3 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:outline-hidden text-stone-800"
                />
                <button
                  type="button"
                  onClick={() => triggerAutoSave(content, messages, title, mood, tags, stickers, theme, readLaterDate, reflectionNote.trim(), isFavorite)}
                  className="px-3 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition-colors"
                >
                  Lưu
                </button>
              </div>
            </div>
          )}

          {/* AI Chatbot Companion Prompt */}
          {onAskChatbotWithText && content && (
            <div className="flex items-center justify-between p-3 rounded-2xl bg-rose-50/60 border border-rose-100 text-xs text-rose-800">
              <span className="font-medium">Có chuyện gì trong trang này bạn muốn tâm sự thêm không?</span>
              <button
                type="button"
                onClick={() => onAskChatbotWithText(content)}
                className="px-3 py-1.5 rounded-xl bg-white text-rose-700 font-bold border border-rose-200 hover:bg-rose-50 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Trò chuyện cùng AI</span>
              </button>
            </div>
          )}

        </div>

        {/* SECTION 6: The Chat + Diary Editor Dock (Anchored at bottom) */}
        <div className="p-4 sm:p-5 border-t border-stone-200/80 bg-white/95 shrink-0 space-y-3">
          
          {/* Quick prompt helper buttons */}
          <div className="flex items-center justify-between text-xs text-stone-400">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleRandomPrompt}
                className="px-2.5 py-1 rounded-lg bg-stone-50 hover:bg-stone-100 text-stone-600 text-[11px] font-semibold border border-stone-200 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>💭 Gợi ý viết</span>
              </button>

              <button
                type="button"
                onClick={() => setShowPromptCategories(!showPromptCategories)}
                className="px-2.5 py-1 rounded-lg bg-stone-50 hover:bg-stone-100 text-stone-600 text-[11px] font-semibold border border-stone-200 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>🎲 Chủ đề</span>
              </button>

              <button
                type="button"
                onClick={() => setShowReadLaterPicker(!showReadLaterPicker)}
                className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-[11px] font-semibold border border-amber-200 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>💌 Đọc lại</span>
              </button>
            </div>

            <span className="text-[11px] hidden sm:inline text-stone-400">
              Nhấn Enter để gửi tin nhắn nhật ký
            </span>
          </div>

          {/* Categorized Prompt drawer */}
          {showPromptCategories && (
            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold text-stone-700">
                <span>Chọn câu hỏi để bắt đầu:</span>
                <button type="button" onClick={() => setShowPromptCategories(false)} className="text-stone-400 hover:text-stone-700">
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto">
                {CATEGORIZED_PROMPTS.map((cat) => (
                  <div key={cat.id} className="p-2 rounded-xl bg-white border border-stone-100 space-y-1">
                    <span className="font-bold text-stone-800 text-[11px] flex items-center gap-1">
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                    </span>
                    {cat.prompts.slice(0, 1).map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleInsertPrompt(p)}
                        className="text-left text-[11px] text-stone-600 hover:text-stone-900 block truncate w-full"
                      >
                        • {p}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Read later date picker drawer */}
          {showReadLaterPicker && (
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs space-y-2">
              <div className="flex items-center justify-between font-bold text-amber-950">
                <span>💌 Hẹn ngày mở lại trang này:</span>
                <button type="button" onClick={() => setShowReadLaterPicker(false)} className="text-amber-600">✕</button>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { label: 'Không hẹn', days: 0 },
                  { label: 'Ngày mai', days: 1 },
                  { label: '7 ngày sau', days: 7 },
                  { label: '30 ngày sau', days: 30 }
                ].map((opt) => {
                  let targetVal: string | undefined = undefined;
                  if (opt.days > 0) {
                    const d = new Date();
                    d.setDate(d.getDate() + opt.days);
                    targetVal = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                  }
                  const isCur = readLaterDate === targetVal;
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => {
                        setReadLaterDate(targetVal);
                        setShowReadLaterPicker(false);
                        triggerAutoSave(content, messages, title, mood, tags, stickers, theme, targetVal, reflectionNote, isFavorite);
                      }}
                      className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                        isCur ? 'bg-amber-600 text-white' : 'bg-white text-amber-900 border border-amber-200'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* The Chat-Style Diary Input Box */}
          <div className="flex items-end gap-2 bg-stone-50/80 p-2 rounded-2xl border border-stone-200/80 focus-within:border-stone-400 focus-within:bg-white transition-all">
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Viết gì đó cho ngày hôm nay..."
              rows={2}
              className="flex-1 bg-transparent p-1 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-hidden resize-none leading-relaxed"
            />
            <button
              type="button"
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
              title="Gửi tin nhắn nhật ký (Enter)"
              className="p-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 disabled:opacity-30 disabled:hover:bg-stone-900 text-white transition-all cursor-pointer shrink-0 active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          {/* Bottom Action Row: Finish & Close */}
          <div className="flex items-center justify-between pt-1 text-xs">
            {existingEntry && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="text-stone-400 hover:text-rose-600 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa trang</span>
              </button>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={handleFinishAndClose}
                className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Xong & Khép lại trang</span>
              </button>
            </div>
          </div>

        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 bg-slate-900/70 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-5 max-w-xs w-full space-y-4 shadow-2xl border border-stone-200 text-center">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto text-xl font-bold">
                🗑️
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-stone-900">Xóa trang này?</h4>
                <p className="text-xs text-stone-500">
                  Trang nhật ký của ngày {formatVietnameseDateFull(dateStr)} sẽ bị xóa.
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 text-xs font-bold hover:bg-stone-200"
                >
                  Giữ lại
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (existingEntry) {
                      onDeleteEntry(existingEntry.id);
                    }
                    clearJournalDraft(dateStr);
                    setShowDeleteConfirm(false);
                    onClose();
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
