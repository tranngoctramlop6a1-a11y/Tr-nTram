import React, { useState, useEffect } from 'react';
import { Heart, Plus, Send, Sparkles, MessageSquareHeart } from 'lucide-react';
import { checkContentModeration } from '../utils/moderation';
import confetti from 'canvas-confetti';

export interface StickyNoteItem {
  id: string;
  content: string;
  author: string;
  authorType?: 'user' | 'ai';
  color: string;
  likes: number;
  createdAt: string;
}

const COLOR_PALETTES = [
  'bg-amber-100 text-amber-900 border-amber-200 shadow-amber-100/50',
  'bg-rose-100 text-rose-900 border-rose-200 shadow-rose-100/50',
  'bg-sky-100 text-sky-900 border-sky-200 shadow-sky-100/50',
  'bg-emerald-100 text-emerald-900 border-emerald-200 shadow-emerald-100/50',
  'bg-purple-100 text-purple-900 border-purple-200 shadow-purple-100/50'
];

export const StickyNoteWall: React.FC = () => {
  const [notes, setNotes] = useState<StickyNoteItem[]>([]);
  const [isComposing, setIsComposing] = useState(false);
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLOR_PALETTES[0]);
  const [likedNoteIds, setLikedNoteIds] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem('teen_liked_sticky_notes');
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // Load notes from server or fallback
    fetch('/api/sticky-notes')
      .then(r => r.json())
      .then(data => {
        if (data && data.success && Array.isArray(data.notes)) {
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
    const fallback: StickyNoteItem[] = [
      {
        id: 'note_1',
        content: 'Có thể hôm nay cậu thấy mình chưa hoàn hảo, nhưng cậu đã rất dũng cảm khi cố gắng rồi!',
        author: 'Minh Thư',
        authorType: 'user',
        color: COLOR_PALETTES[0],
        likes: 38,
        createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
      },
      {
        id: 'note_2',
        content: 'Không phải ngày nào cũng cần phải nở hoa. Có những ngày chỉ cần rễ cắm sâu xuống đất là đã đủ tuyệt vời.',
        author: 'AI Đồng Cảm',
        authorType: 'ai',
        color: COLOR_PALETTES[3],
        likes: 54,
        createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString()
      },
      {
        id: 'note_3',
        content: 'Đừng để điểm số một bài kiểm tra làm lu mờ đi sự tử tế và ấm áp trong tim cậu nhé!',
        author: 'Quốc Bảo',
        authorType: 'user',
        color: COLOR_PALETTES[2],
        likes: 29,
        createdAt: new Date(Date.now() - 9 * 3600 * 1000).toISOString()
      },
      {
        id: 'note_4',
        content: 'Thở một hơi thật sâu nào. Mọi giông bão rồi cũng sẽ qua thôi, cậu sẽ ổn mà.',
        author: 'Hoàng Lan',
        authorType: 'user',
        color: COLOR_PALETTES[1],
        likes: 41,
        createdAt: new Date(Date.now() - 15 * 3600 * 1000).toISOString()
      }
    ];
    setNotes(fallback);
  };

  const handleLike = async (noteId: string) => {
    if (likedNoteIds.has(noteId)) return;

    const newLiked = new Set(likedNoteIds).add(noteId);
    setLikedNoteIds(newLiked);
    try {
      localStorage.setItem('teen_liked_sticky_notes', JSON.stringify(Array.from(newLiked)));
    } catch {}

    setNotes(prev =>
      prev.map(n => (n.id === noteId ? { ...n, likes: n.likes + 1 } : n))
    );

    // Call server API
    fetch(`/api/sticky-notes/${noteId}/like`, { method: 'POST' }).catch(() => {});

    confetti({
      particleCount: 15,
      spread: 45,
      origin: { y: 0.7 }
    });
  };

  const handlePostNote = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const text = content.trim();
    if (!text) {
      setErrorMsg('Hãy viết một thông điệp nhỏ để gửi gắm nhé.');
      return;
    }

    const modResult = checkContentModeration(text);
    if (!modResult.isSafe) {
      setErrorMsg(modResult.warning || 'Nội dung chưa phù hợp với nguyên tắc yêu thương cộng đồng.');
      return;
    }

    const authorName = author.trim() || 'Một người bạn nhỏ';
    const newNote: StickyNoteItem = {
      id: 'sn_' + Date.now(),
      content: text,
      author: authorName,
      authorType: 'user',
      color: selectedColor,
      likes: 1,
      createdAt: new Date().toISOString()
    };

    setNotes(prev => [newNote, ...prev]);
    setContent('');
    setIsComposing(false);

    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.6 }
    });

    // Sync to server
    const token = localStorage.getItem('teen_mind_auth_token') || sessionStorage.getItem('teen_mind_auth_token');
    fetch('/api/sticky-notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({
        content: text,
        author: authorName,
        color: selectedColor
      })
    }).catch(() => {});
  };

  return (
    <div className="bg-gradient-to-br from-amber-50/70 via-rose-50/40 to-sky-50/60 rounded-3xl p-5 sm:p-7 border border-amber-200/60 shadow-xs mb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 text-amber-800 text-xs font-bold border border-amber-200 mb-1.5">
            <MessageSquareHeart className="w-3.5 h-3.5 text-rose-500" />
            <span>Bạn không cô đơn • Góc lưu bút động viên</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Những mảnh giấy truyền năng lượng 💌
          </h3>
          <p className="text-xs sm:text-sm text-slate-600">
            Dán một mảnh giấy nhỏ để gửi chút ấm áp tới bất kỳ ai đang cảm thấy chùn bước hôm nay.
          </p>
        </div>

        <button
          onClick={() => setIsComposing(!isComposing)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm shadow-xs hover:shadow-md transition-all cursor-pointer self-start sm:self-center shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{isComposing ? 'Đóng lại' : 'Dán giấy nhắn'}</span>
        </button>
      </div>

      {/* Composing Box */}
      {isComposing && (
        <form
          onSubmit={handlePostNote}
          className="bg-white rounded-2xl p-5 border border-amber-200 shadow-sm mb-6 space-y-4 animate-in fade-in duration-200"
        >
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Lời nhắn gửi gắm (tối đa 180 ký tự):
            </label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value.slice(0, 180))}
              placeholder="Ví dụ: 'Cố lên nhé các bạn ơi! Dù hôm nay có mệt mỏi thế nào thì ngày mai mặt trời vẫn sẽ mọc...'"
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:border-amber-400"
            />
            <div className="text-right text-[11px] text-slate-600 mt-1">
              {content.length}/180 ký tự
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tên hoặc biệt danh của bạn:
              </label>
              <input
                type="text"
                value={author}
                onChange={e => setAuthor(e.target.value)}
                placeholder="Để trống sẽ ghi 'Một người bạn nhỏ'"
                maxLength={30}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Chọn màu giấy:
              </label>
              <div className="flex items-center gap-2">
                {COLOR_PALETTES.map((c, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                      c.split(' ')[0]
                    } ${selectedColor === c ? 'scale-115 border-slate-900 shadow-xs' : 'border-transparent'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {errorMsg && (
            <p className="text-xs text-rose-600 font-medium">⚠️ {errorMsg}</p>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsComposing(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Dán lên bảng ngay</span>
            </button>
          </div>
        </form>
      )}

      {/* Sticky Notes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {notes.slice(0, 8).map(note => {
          const isLiked = likedNoteIds.has(note.id);
          return (
            <div
              key={note.id}
              className={`rounded-2xl p-4 border flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-md ${note.color}`}
            >
              <p className="text-xs sm:text-sm font-medium leading-relaxed mb-4 whitespace-pre-line">
                “{note.content}”
              </p>

              <div className="pt-2 border-t border-black/10 flex items-center justify-between text-[11px]">
                <span className="font-bold truncate max-w-[120px] flex items-center gap-1">
                  {note.authorType === 'ai' && (
                    <span className="text-[10px] bg-white/70 px-1 rounded text-purple-700 font-extrabold">
                      🤖 AI
                    </span>
                  )}
                  {note.author}
                </span>

                <button
                  onClick={() => handleLike(note.id)}
                  disabled={isLiked}
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isLiked
                      ? 'bg-rose-500 text-white'
                      : 'bg-white/80 hover:bg-white text-slate-700 hover:text-rose-600'
                  }`}
                  title={isLiked ? 'Đã thả tim' : 'Thả tim thông điệp này'}
                >
                  <Heart className={`w-3 h-3 ${isLiked ? 'fill-white' : 'text-rose-500'}`} />
                  <span>{note.likes}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
