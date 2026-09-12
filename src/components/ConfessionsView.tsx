import React, { useState } from 'react';
import { Confession, Comment } from '../types';
import { getRandomNickname, checkContentModeration } from '../utils/moderation';
import { 
  Heart, 
  Users, 
  MessageCircle, 
  Send, 
  Filter, 
  Search, 
  PlusCircle, 
  ShieldCheck, 
  Sparkles,
  Lock,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ConfessionsViewProps {
  confessions: Confession[];
  onOpenCreateModal: () => void;
  onReact: (id: string, type: 'empathy' | 'meToo') => void;
  onAddComment: (confessionId: string, comment: Comment) => void;
}

export const ConfessionsView: React.FC<ConfessionsViewProps> = ({
  confessions,
  onOpenCreateModal,
  onReact,
  onAddComment
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'most_empathy'>('newest');
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [newCommentText, setNewCommentText] = useState<Record<string, string>>({});
  const [commentError, setCommentError] = useState<Record<string, string | null>>({});

  const categories = ['Tất cả', 'Gia đình', 'Học tập', 'Tình bạn', 'Bản thân', 'Trường học', 'Tình cảm'];

  const filteredConfessions = confessions.filter((conf) => {
    const matchCat = selectedCategory === 'Tất cả' || conf.category === selectedCategory;
    const matchSearch = conf.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        conf.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  }).sort((a, b) => {
    if (sortBy === 'most_empathy') {
      return (b.empathyCount + b.meTooCount) - (a.empathyCount + a.meTooCount);
    }
    return 0; // maintain list order
  });

  const toggleComments = (id: string) => {
    setExpandedComments((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePostComment = (confessionId: string) => {
    const text = (newCommentText[confessionId] || '').trim();
    if (!text) return;

    // Moderation check on comment
    const modResult = checkContentModeration(text);
    if (!modResult.isSafe) {
      setCommentError((prev) => ({
        ...prev,
        [confessionId]: modResult.warning || 'Bình luận chứa từ ngữ chưa phù hợp.'
      }));
      return;
    }

    const comment: Comment = {
      id: `c-${Date.now()}`,
      author: getRandomNickname(),
      avatarSeed: 'seed-' + Math.floor(Math.random() * 50),
      content: text,
      timestamp: 'Vừa xong',
      likes: 1
    };

    onAddComment(confessionId, comment);
    setNewCommentText((prev) => ({ ...prev, [confessionId]: '' }));
    setCommentError((prev) => ({ ...prev, [confessionId]: null }));
    
    // Auto-open comments if not already
    setExpandedComments((prev) => ({ ...prev, [confessionId]: true }));

    confetti({
      particleCount: 20,
      spread: 50,
      origin: { y: 0.7 }
    });
  };

  return (
    <section className="py-10 md:py-16 max-w-5xl mx-auto px-4 sm:px-6" id="section-confessions">
      
      {/* Header & Reassurance */}
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-100">
          <Lock className="w-3.5 h-3.5" />
          <span>Góc tâm sự ẩn danh • Nơi chia sẻ những điều khó nói</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Lắng nghe những tiếng lòng
        </h2>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Mỗi dòng tâm sự ở đây là một câu chuyện có thật của một người bạn tuổi teen. Hãy cùng gửi trao sự đồng cảm và những lời động viên tử tế.
        </p>

        <div className="pt-2">
          <button
            onClick={onOpenCreateModal}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-bold text-sm shadow-sm hover:shadow-md transition-all cursor-pointer transform active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Viết tâm sự ẩn danh của bạn</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-rose-100/80 shadow-xs mb-8 space-y-3">
        
        {/* Search & Sort Row */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm tâm sự theo từ khóa (áp lực, điểm số, bạn thân, bố mẹ...)"
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:border-rose-400 bg-slate-50/50"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
            <span className="text-xs text-slate-600 font-medium flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Sắp xếp:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:outline-hidden focus:border-rose-400 cursor-pointer"
            >
              <option value="newest">Mới nhất</option>
              <option value="most_empathy">Nhiều đồng cảm nhất</option>
            </select>
          </div>
        </div>

        {/* Categories Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Confessions List */}
      {filteredConfessions.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 p-8">
          <p className="text-base font-bold text-slate-700">Chưa tìm thấy câu chuyện nào phù hợp.</p>
          <p className="text-xs text-slate-600 mt-1">Hãy là người đầu tiên chia sẻ về chủ đề này nhé!</p>
          <button
            onClick={onOpenCreateModal}
            className="mt-4 px-5 py-2.5 rounded-xl bg-rose-500 text-white font-bold text-xs hover:bg-rose-600"
          >
            Đăng tâm sự ngay
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredConfessions.map((conf) => {
            const isCommentsOpen = !!expandedComments[conf.id];
            const hasReactedEmpathy = conf.userReacted?.empathy;
            const hasReactedMeToo = conf.userReacted?.meToo;

            return (
              <article
                key={conf.id}
                id={`confession-card-${conf.id}`}
                className="bg-white rounded-3xl p-5 sm:p-7 border border-rose-100/90 shadow-xs hover:shadow-md transition-shadow duration-200"
              >
                {/* Author & Meta */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-100 to-amber-100 border border-rose-200 flex items-center justify-center text-sm font-bold text-rose-700 select-none">
                      {conf.author.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-800">
                          {conf.author}
                        </span>
                        {conf.isAnonymous && (
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-semibold text-slate-600 flex items-center gap-0.5">
                            <Lock className="w-2.5 h-2.5" /> Ẩn danh
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {conf.timestamp}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-100">
                    {conf.category}
                  </span>
                </div>

                {/* Confession Title & Body */}
                <div className="space-y-2 mb-5">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {conf.title}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-700 font-normal leading-relaxed whitespace-pre-line">
                    {conf.content}
                  </p>
                </div>

                {/* Interactions Row: ❤️ Đồng cảm | 🫂 "Mình cũng từng như vậy" | 💬 Bình luận */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2">
                    
                    {/* Empathy button */}
                    <button
                      onClick={() => onReact(conf.id, 'empathy')}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        hasReactedEmpathy
                          ? 'bg-rose-500 text-white shadow-xs'
                          : 'bg-rose-50 hover:bg-rose-100 text-rose-700'
                      }`}
                      title="Gửi sự đồng cảm ấm áp"
                    >
                      <Heart className={`w-3.5 h-3.5 ${hasReactedEmpathy ? 'fill-white' : 'text-rose-500'}`} />
                      <span>Đồng cảm ({conf.empathyCount})</span>
                    </button>

                    {/* Me Too button */}
                    <button
                      onClick={() => onReact(conf.id, 'meToo')}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        hasReactedMeToo
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'bg-amber-50 hover:bg-amber-100 text-amber-800'
                      }`}
                      title="Bạn không một mình, mình cũng từng như vậy"
                    >
                      <Users className={`w-3.5 h-3.5 ${hasReactedMeToo ? 'text-white' : 'text-amber-600'}`} />
                      <span>Mình cũng từng như vậy ({conf.meTooCount})</span>
                    </button>

                  </div>

                  {/* Comment Toggle */}
                  <button
                    onClick={() => toggleComments(conf.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-slate-600" />
                    <span>{conf.comments.length} Lời động viên</span>
                  </button>
                </div>

                {/* Expanded Comments Section */}
                {isCommentsOpen && (
                  <div className="mt-5 pt-4 border-t border-slate-100 space-y-4 animate-in fade-in duration-150">
                    
                    {/* Existing Comments List */}
                    {conf.comments.length > 0 ? (
                      <div className="space-y-3">
                        {conf.comments.map((comment) => (
                          <div
                            key={comment.id}
                            className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-200/60 text-xs sm:text-sm space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                                <span>💬</span>
                                <span>{comment.author}</span>
                              </span>
                              <span className="text-[11px] text-slate-600">{comment.timestamp}</span>
                            </div>
                            <p className="text-slate-700 leading-relaxed pl-5">
                              {comment.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-600 italic text-center py-2">
                        Chưa có lời động viên nào. Hãy là người đầu tiên gửi gắm sự ấm áp tới bạn ấy nhé!
                      </p>
                    )}

                    {/* Comment Error message if moderation rejects */}
                    {commentError[conf.id] && (
                      <p className="text-xs text-rose-600 font-medium">
                        ⚠️ {commentError[conf.id]}
                      </p>
                    )}

                    {/* Add Comment Input */}
                    <div className="flex gap-2 pt-1">
                      <input
                        type="text"
                        value={newCommentText[conf.id] || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setNewCommentText((prev) => ({ ...prev, [conf.id]: val }));
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handlePostComment(conf.id);
                        }}
                        placeholder="Viết lời động viên tử tế, an ủi hoặc chia sẻ kinh nghiệm vượt qua..."
                        className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:border-rose-400 bg-white"
                      />
                      <button
                        onClick={() => handlePostComment(conf.id)}
                        className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Gửi</span>
                      </button>
                    </div>

                  </div>
                )}

              </article>
            );
          })}
        </div>
      )}

      {/* Reassurance Footer note */}
      <div className="mt-10 p-5 rounded-3xl bg-rose-50/60 border border-rose-100 text-center text-xs text-slate-600 max-w-xl mx-auto flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>Mọi bài viết đều qua bộ lọc văn minh nhằm bảo đảm một không gian an toàn, lành mạnh và không bắt nạt.</span>
      </div>

    </section>
  );
};
