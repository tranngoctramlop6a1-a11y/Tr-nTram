import React, { useState, useEffect } from 'react';
import { getDailyNoteForDate, DailyNoteItem } from '../data/dailyNotes';
import { formatRealTimeAgo } from '../utils/timeAgo';
import { getRandomNickname, checkContentModeration } from '../utils/moderation';
import { 
  Heart, 
  Plus, 
  StickyNote as StickyIcon, 
  Sparkles, 
  Send, 
  X,
  BookOpen,
  ArrowRight,
  Sun,
  Compass,
  HelpCircle,
  Lightbulb,
  Bot
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface StoriesViewProps {
  onGoToJournal?: (promptText: string) => void;
}

interface LocalStickyNote {
  id: string;
  content: string;
  author: string;
  authorType?: 'user' | 'ai';
  color: string;
  likes: number;
  createdAt: string;
}

export const StoriesView: React.FC<StoriesViewProps> = ({ onGoToJournal }) => {
  const [dailyNote, setDailyNote] = useState<DailyNoteItem>(() => getDailyNoteForDate(new Date()));
  const [notes, setNotes] = useState<LocalStickyNote[]>([]);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [noteAuthor, setNoteAuthor] = useState(getRandomNickname());
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [likedNoteIds, setLikedNoteIds] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem('teen_stories_liked_notes');
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  const colorOptions = [
    { name: 'Vàng kem', class: 'bg-amber-100 text-amber-950 border-amber-200 shadow-amber-100/50' },
    { name: 'Hồng phấn', class: 'bg-rose-100 text-rose-950 border-rose-200 shadow-rose-100/50' },
    { name: 'Bạc hà', class: 'bg-emerald-100 text-emerald-950 border-emerald-200 shadow-emerald-100/50' },
    { name: 'Da trời', class: 'bg-sky-100 text-sky-950 border-sky-200 shadow-sky-100/50' },
    { name: 'Oải hương', class: 'bg-purple-100 text-purple-950 border-purple-200 shadow-purple-100/50' },
  ];

  // Fetch daily note & sticky notes
  useEffect(() => {
    fetch('/api/daily-note')
      .then(r => r.json())
      .then(data => {
        if (data && data.success && data.note) {
          setDailyNote(data.note);
        }
      })
      .catch(() => {});

    fetch('/api/sticky-notes')
      .then(r => r.json())
      .then(data => {
        if (data && data.success && Array.isArray(data.notes) && data.notes.length > 0) {
          setNotes(data.notes);
        } else {
          loadFallbackNotes();
        }
      })
      .catch(() => {
        loadFallbackNotes();
      });
  }, []);

  const loadFallbackNotes = () => {
    const fallback: LocalStickyNote[] = [
      {
        id: 'sn_init_1',
        content: 'Đừng tự so sánh bản thân với bất kỳ ai, bạn đang đi trên con đường của riêng mình và bạn làm rất tốt!',
        author: 'Tuệ Mẫn',
        authorType: 'user',
        color: colorOptions[0].class,
        likes: 24,
        createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString()
      },
      {
        id: 'sn_init_2',
        content: 'Một ngày tồi tệ không có nghĩa là cả cuộc đời tồi tệ. Hãy ôm lấy chính mình nhé.',
        author: 'AI Đồng Cảm',
        authorType: 'ai',
        color: colorOptions[4].class,
        likes: 42,
        createdAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString()
      },
      {
        id: 'sn_init_3',
        content: 'Cố lên các bạn chuẩn bị thi giữa kỳ nhé! Mình tin tụi mình sẽ làm bài thật tốt!',
        author: 'Đăng Khoa',
        authorType: 'user',
        color: colorOptions[3].class,
        likes: 31,
        createdAt: new Date(Date.now() - 11 * 3600 * 1000).toISOString()
      }
    ];
    setNotes(fallback);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmed = noteContent.trim();
    if (!trimmed) {
      setErrorMsg('Vui lòng viết lời nhắn động viên của bạn.');
      return;
    }

    const mod = checkContentModeration(trimmed);
    if (!mod.isSafe) {
      setErrorMsg(mod.warning || 'Nội dung chưa phù hợp với không gian an toàn.');
      return;
    }

    const newNote: LocalStickyNote = {
      id: `sn-${Date.now()}`,
      content: trimmed,
      author: noteAuthor.trim() || 'Người bạn ấm áp',
      authorType: 'user',
      color: colorOptions[selectedColorIdx].class,
      likes: 1,
      createdAt: new Date().toISOString()
    };

    setNotes([newNote, ...notes]);
    setNoteContent('');
    setIsAddingNote(false);

    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.6 }
    });

    // Sync to server API
    const token = localStorage.getItem('teen_mind_auth_token') || sessionStorage.getItem('teen_mind_auth_token');
    fetch('/api/sticky-notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({
        content: newNote.content,
        author: newNote.author,
        color: newNote.color
      })
    }).catch(() => {});
  };

  const handleLike = (id: string) => {
    if (likedNoteIds.has(id)) return;

    const next = new Set(likedNoteIds).add(id);
    setLikedNoteIds(next);
    try {
      localStorage.setItem('teen_stories_liked_notes', JSON.stringify(Array.from(next)));
    } catch {}

    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, likes: n.likes + 1 } : n))
    );

    fetch(`/api/sticky-notes/${id}/like`, { method: 'POST' }).catch(() => {});

    confetti({
      particleCount: 15,
      spread: 40,
      origin: { y: 0.7 }
    });
  };

  return (
    <section className="py-10 md:py-16 max-w-6xl mx-auto px-4 sm:px-6" id="section-stories">
      
      {/* 1. DAILY NOTE OF TODAY */}
      <div className="bg-gradient-to-br from-amber-50 via-rose-50 to-orange-50 rounded-3xl p-6 sm:p-9 border border-amber-200/80 shadow-sm mb-12 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-200/60 text-amber-900 text-xs font-bold border border-amber-300">
              <Sun className="w-3.5 h-3.5 text-amber-600" />
              <span>Bức thư đầu ngày • Cập nhật mỗi sáng theo ngày thật</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {dailyNote.theme}
            </h2>
          </div>

          <div className="text-xs font-semibold text-slate-500 bg-white/70 px-3.5 py-1.5 rounded-xl border border-amber-100 self-start md:self-center">
            {dailyNote.dateFormatted}
          </div>
        </div>

        {/* Quote Card */}
        <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-5 sm:p-6 border border-amber-200/70 shadow-xs mb-6">
          <div className="text-rose-500 text-3xl font-serif leading-none mb-1">“</div>
          <p className="text-base sm:text-lg font-bold text-slate-800 leading-relaxed italic pl-3">
            {dailyNote.quote}
          </p>
          <p className="text-xs sm:text-sm text-slate-600 mt-3 pl-3 leading-relaxed">
            {dailyNote.empathy}
          </p>
        </div>

        {/* Suggestions and Journal Prompt Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Micro Action */}
          <div className="bg-white/80 rounded-2xl p-4 sm:p-5 border border-amber-100 flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                Gợi ý nhỏ cho ngày hôm nay
              </span>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {dailyNote.microAction}
              </p>
            </div>
          </div>

          {/* Reflection Question */}
          <div className="bg-white/80 rounded-2xl p-4 sm:p-5 border border-rose-100 flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-rose-900 uppercase tracking-wider">
                Câu hỏi để bạn tự suy ngẫm
              </span>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {dailyNote.reflectionQuestion}
              </p>
            </div>
          </div>
        </div>

        {/* Action to Journal */}
        {onGoToJournal && (
          <div className="flex justify-end">
            <button
              onClick={() => onGoToJournal(dailyNote.reflectionQuestion)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Viết về điều này vào Nhật ký</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* 2. STICKY NOTES SECTION HEADER */}
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
          <StickyIcon className="w-3.5 h-3.5 text-amber-600" />
          <span>Bức tường khích lệ • Những lời nhắn sưởi ấm tâm hồn</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Bạn không cô đơn
        </h2>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Những mẩu giấy ghi lại lời động viên của bạn bè cùng trang lứa và gợi ý từ AI. Thời gian hiển thị chuẩn xác theo thời điểm dán.
        </p>

        <div className="pt-2">
          <button
            onClick={() => setIsAddingNote(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-sm hover:shadow-md transition-all cursor-pointer transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Dán một mảnh giấy động viên</span>
          </button>
        </div>
      </div>

      {/* Add Sticky Note Modal */}
      {isAddingNote && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-xl border border-amber-200 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsAddingNote(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-500 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 mb-1">
              Gửi một lời động viên tới cộng đồng
            </h3>
            <p className="text-xs text-slate-600 mb-5">
              Một câu nói tử tế của bạn có thể cứu rỗi cả một ngày u ám của một người bạn khác.
            </p>

            {errorMsg && (
              <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                ⚠️ {errorMsg}
              </div>
            )}

            <form onSubmit={handleAddNote} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nội dung lời nhắn (tối đa 180 ký tự):
                </label>
                <textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value.slice(0, 180))}
                  placeholder="Ví dụ: 'Cố lên nhé các bạn ơi! Dù hôm nay có mệt mỏi thế nào thì ngày mai mặt trời vẫn sẽ mọc...'"
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:border-amber-400 bg-white"
                />
                <div className="text-right text-[11px] text-slate-400 mt-1">
                  {noteContent.length}/180 ký tự
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tên hoặc biệt danh của bạn:
                </label>
                <input
                  type="text"
                  value={noteAuthor}
                  onChange={(e) => setNoteAuthor(e.target.value)}
                  maxLength={30}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:border-amber-400 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Chọn màu giấy:
                </label>
                <div className="flex items-center gap-2">
                  {colorOptions.map((opt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedColorIdx(idx)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${opt.class} ${
                        selectedColorIdx === idx ? 'ring-2 ring-slate-900 scale-105' : 'opacity-80 hover:opacity-100'
                      }`}
                    >
                      {opt.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingNote(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Dán lên tường ngay</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sticky Notes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map((note) => {
          const isLiked = likedNoteIds.has(note.id);
          const timeDisplay = formatRealTimeAgo(note.createdAt);

          return (
            <div
              key={note.id}
              id={`sticky-note-${note.id}`}
              className={`p-6 rounded-3xl border shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4 ${note.color}`}
            >
              {/* Note Pin simulation */}
              <div className="flex items-center justify-between">
                <span className="w-3.5 h-3.5 rounded-full bg-rose-400 shadow-inner border border-rose-500/40 inline-block"></span>
                <span className="text-[11px] font-semibold opacity-75">{timeDisplay}</span>
              </div>

              {/* Content text */}
              <p className="text-sm sm:text-base font-semibold leading-relaxed whitespace-pre-line italic">
                “{note.content}”
              </p>

              {/* Author and Like Button */}
              <div className="pt-3 border-t border-black/10 flex items-center justify-between text-xs">
                <span className="font-extrabold truncate max-w-[150px] flex items-center gap-1">
                  {note.authorType === 'ai' && (
                    <span className="text-[10px] bg-white/80 text-purple-700 px-1 rounded flex items-center gap-0.5 font-bold">
                      <Bot className="w-2.5 h-2.5" /> AI
                    </span>
                  )}
                  — {note.author}
                </span>

                <button
                  onClick={() => handleLike(note.id)}
                  disabled={isLiked}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                    isLiked
                      ? 'bg-rose-500 text-white'
                      : 'bg-white/80 hover:bg-white text-slate-800'
                  }`}
                  title={isLiked ? 'Đã thả tim' : 'Thả tim ấm áp'}
                >
                  <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-white text-white' : 'fill-rose-500 text-rose-500'}`} />
                  <span>{note.likes}</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
};
