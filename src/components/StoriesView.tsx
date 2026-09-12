import React, { useState } from 'react';
import { STICKY_NOTES } from '../data/initialData';
import { StickyNote } from '../types';
import { getRandomNickname, checkContentModeration } from '../utils/moderation';
import { 
  Heart, 
  Plus, 
  StickyNote as StickyIcon, 
  Sparkles, 
  Send, 
  ThumbsUp, 
  X,
  MessageSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const StoriesView: React.FC = () => {
  const [notes, setNotes] = useState<StickyNote[]>(STICKY_NOTES);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [noteAuthor, setNoteAuthor] = useState(getRandomNickname());
  const [noteColor, setNoteColor] = useState('bg-amber-100 text-amber-900 border-amber-200');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const colorOptions = [
    { name: 'Vàng kem', value: 'bg-amber-100 text-amber-950 border-amber-200' },
    { name: 'Hồng phấn', value: 'bg-rose-100 text-rose-950 border-rose-200' },
    { name: 'Xanh bạc hà', value: 'bg-emerald-100 text-emerald-950 border-emerald-200' },
    { name: 'Xanh da trời', value: 'bg-sky-100 text-sky-950 border-sky-200' },
    { name: 'Tím oải hương', value: 'bg-purple-100 text-purple-950 border-purple-200' },
  ];

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

    const newNote: StickyNote = {
      id: `sn-${Date.now()}`,
      content: trimmed.startsWith('“') ? trimmed : `“${trimmed}”`,
      author: noteAuthor.trim() || 'Người bạn ấm áp',
      color: `${noteColor} rotate-[${(Math.random() * 4 - 2).toFixed(1)}deg]`,
      likes: 1,
      timestamp: 'Vừa xong'
    };

    setNotes([newNote, ...notes]);
    setNoteContent('');
    setIsAddingNote(false);

    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const handleLike = (id: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, likes: n.likes + 1 } : n))
    );
  };

  return (
    <section className="py-10 md:py-16 max-w-6xl mx-auto px-4 sm:px-6" id="section-stories">
      
      {/* Header */}
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
          <StickyIcon className="w-3.5 h-3.5 text-amber-600" />
          <span>Bức tường khích lệ • Những lời nhắn sưởi ấm tâm hồn</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Bạn không cô đơn
        </h2>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Những mẩu giấy ghi lại trải nghiệm vượt qua thử thách của những người bạn cùng lứa. Đọc để thấy rằng những gì bạn đang đối mặt cũng từng có người vượt qua.
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

      {/* Add Sticky Note Modal / Form */}
      {isAddingNote && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-xl border border-amber-200 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsAddingNote(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-600 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
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
              <p className="text-xs text-rose-600 font-medium mb-3 p-2.5 bg-rose-50 rounded-xl">
                ⚠️ {errorMsg}
              </p>
            )}

            <form onSubmit={handleAddNote} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nội dung lời nhắn của bạn:
                </label>
                <textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Ví dụ: Đừng buồn vì một bài kiểm tra, bạn đã rất nỗ lực rồi! Hãy tin vào chính mình nhé..."
                  rows={3}
                  maxLength={300}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-amber-400 bg-slate-50 focus:bg-white resize-none"
                  required
                />
              </div>

              {/* Color picker */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Chọn màu giấy dán yêu thích:
                </label>
                <div className="flex gap-2">
                  {colorOptions.map((c, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setNoteColor(c.value)}
                      className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer ${
                        c.value.split(' ')[0]
                      } ${noteColor === c.value ? 'scale-120 border-slate-800' : 'border-transparent'}`}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              {/* Author name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ký tên (bí danh):
                </label>
                <input
                  type="text"
                  value={noteAuthor}
                  onChange={(e) => setNoteAuthor(e.target.value)}
                  maxLength={25}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-amber-400"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingNote(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Dán lên tường</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Sticky Notes Masonry / Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map((note) => (
          <div
            key={note.id}
            id={`sticky-note-${note.id}`}
            className={`p-6 rounded-3xl border shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4 ${note.color}`}
          >
            {/* Note Pin simulation */}
            <div className="flex items-center justify-between">
              <span className="w-3.5 h-3.5 rounded-full bg-red-400/80 shadow-inner border border-red-500/40 inline-block"></span>
              <span className="text-[11px] font-semibold opacity-75">{note.timestamp}</span>
            </div>

            {/* Content text */}
            <p className="text-sm sm:text-base font-semibold leading-relaxed whitespace-pre-line italic">
              {note.content}
            </p>

            {/* Author and Like Button */}
            <div className="pt-3 border-t border-black/10 flex items-center justify-between text-xs">
              <span className="font-extrabold truncate max-w-[150px]">
                — {note.author}
              </span>

              <button
                onClick={() => handleLike(note.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 hover:bg-white text-slate-800 font-bold text-xs transition-colors cursor-pointer shadow-2xs"
                title="Thả tim ấm áp"
              >
                <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                <span>{note.likes}</span>
              </button>
            </div>

          </div>
        ))}
      </div>

    </section>
  );
};
