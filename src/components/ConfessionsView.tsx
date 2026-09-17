import React, { useState, useEffect } from 'react';
import { Confession, Comment } from '../types';
import { getRandomNickname, checkContentModeration } from '../utils/moderation';
import { formatRealTimeAgo } from '../utils/timeAgo';
import { getUserProgress, saveUserProgress } from '../utils/userProgressStore';
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
  Clock,
  Bookmark,
  Flag,
  Bot,
  User,
  AlertTriangle,
  X,
  CheckCircle2,
  Trash2,
  RefreshCw,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ConfessionsViewProps {
  confessions: Confession[];
  onOpenCreateModal: () => void;
  onReact: (id: string, type: 'empathy' | 'meToo') => void;
  onAddComment: (confessionId: string, comment: Comment) => void;
  onDeleteConfession?: (id: string) => void;
  currentUserId?: string;
  currentUserRole?: string;
  isLoading?: boolean;
  onRefresh?: () => void;
}

export const ConfessionsView: React.FC<ConfessionsViewProps> = ({
  confessions,
  onOpenCreateModal,
  onReact,
  onAddComment,
  onDeleteConfession,
  currentUserId,
  currentUserRole,
  isLoading,
  onRefresh
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'most_empathy' | 'bookmarked'>('newest');
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [newCommentText, setNewCommentText] = useState<Record<string, string>>({});
  const [commentError, setCommentError] = useState<Record<string, string | null>>({});
  const [isSubmittingComment, setIsSubmittingComment] = useState<Record<string, boolean>>({});

  // Bookmarks
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(() => {
    const progress = getUserProgress(currentUserId);
    return new Set(progress.bookmarkedConfessionIds || []);
  });

  // Report Modal
  const [reportingConfessionId, setReportingConfessionId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('Nội dung tiêu cực hoặc không phù hợp');
  const [reportSuccessMsg, setReportSuccessMsg] = useState<string | null>(null);

  const categories = currentUserId
    ? ['Tất cả', 'Của tôi', 'Gia đình', 'Học tập', 'Tình bạn', 'Bản thân', 'Trường học', 'Tình cảm', 'Khác']
    : ['Tất cả', 'Gia đình', 'Học tập', 'Tình bạn', 'Bản thân', 'Trường học', 'Tình cảm', 'Khác'];

  // Keep bookmarks in sync when user progress updates
  useEffect(() => {
    const handleProgressUpdate = () => {
      const progress = getUserProgress(currentUserId);
      setBookmarkedIds(new Set(progress.bookmarkedConfessionIds || []));
    };
    window.addEventListener('teen_progress_updated', handleProgressUpdate);
    window.addEventListener('teen_account_changed', handleProgressUpdate);
    return () => {
      window.removeEventListener('teen_progress_updated', handleProgressUpdate);
      window.removeEventListener('teen_account_changed', handleProgressUpdate);
    };
  }, [currentUserId]);

  const toggleBookmark = (id: string) => {
    const next = new Set(bookmarkedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
      confetti({
        particleCount: 15,
        spread: 40,
        origin: { y: 0.8 }
      });
    }
    setBookmarkedIds(next);
    saveUserProgress(currentUserId, {
      bookmarkedConfessionIds: Array.from(next)
    });
  };

  const handleOpenReport = (id: string) => {
    setReportingConfessionId(id);
    setReportReason('Nội dung tiêu cực hoặc không phù hợp');
    setReportSuccessMsg(null);
  };

  const handleSubmitReport = () => {
    if (!reportingConfessionId) return;

    fetch(`/api/confessions/${reportingConfessionId}/report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: reportReason })
    }).catch(() => {});

    setReportSuccessMsg('Cảm ơn bạn đã báo cáo. Đội ngũ kiểm duyệt sẽ rà soát bài viết này để giữ không gian an toàn.');
    setTimeout(() => {
      setReportingConfessionId(null);
      setReportSuccessMsg(null);
    }, 2500);
  };

  const handleDeletePost = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bài viết tâm sự này không? Hành động này không thể hoàn tác.')) {
      return;
    }
    try {
      const token = localStorage.getItem('teen_mind_auth_token') || sessionStorage.getItem('teen_mind_auth_token');
      const res = await fetch(`/api/confessions/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = await res.json();
      if (data && data.success) {
        if (onDeleteConfession) onDeleteConfession(id);
      } else {
        alert(data.error || 'Không thể xóa bài viết. Bạn chỉ có thể xóa bài viết của chính mình.');
      }
    } catch (err) {
      console.error('Error deleting confession:', err);
      alert('Đã xảy ra lỗi khi kết nối với máy chủ.');
    }
  };

  const filteredConfessions = confessions.filter((conf) => {
    let matchCat = true;
    if (selectedCategory === 'Của tôi') {
      matchCat = Boolean(currentUserId && conf.userId === currentUserId);
    } else if (selectedCategory !== 'Tất cả') {
      matchCat = conf.category === selectedCategory;
    }

    const matchSearch = conf.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        conf.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchBookmark = sortBy !== 'bookmarked' || bookmarkedIds.has(conf.id);
    return matchCat && matchSearch && matchBookmark;
  }).sort((a, b) => {
    if (sortBy === 'most_empathy') {
      return (b.empathyCount + b.meTooCount) - (a.empathyCount + a.meTooCount);
    }
    // Default newest first using createdAt
    const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    if (timeA && timeB) {
      return timeB - timeA;
    }
    return 0;
  });

  const toggleComments = (id: string) => {
    setExpandedComments((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePostComment = async (confessionId: string) => {
    const text = (newCommentText[confessionId] || '').trim();
    if (!text || isSubmittingComment[confessionId]) return;

    // Moderation check on comment
    const modResult = checkContentModeration(text);
    if (!modResult.isSafe) {
      setCommentError((prev) => ({
        ...prev,
        [confessionId]: modResult.warning || 'Bình luận chứa từ ngữ chưa phù hợp.'
      }));
      return;
    }

    try {
      setIsSubmittingComment((prev) => ({ ...prev, [confessionId]: true }));
      const token = localStorage.getItem('teen_mind_auth_token') || sessionStorage.getItem('teen_mind_auth_token');
      
      const res = await fetch(`/api/confessions/${confessionId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          content: text
        })
      });

      const data = await res.json();
      if (data && data.success && data.comment) {
        onAddComment(confessionId, data.comment);
      } else {
        const now = new Date().toISOString();
        const fallbackComment: Comment = {
          id: `c-${Date.now()}`,
          author: 'Người bạn nhỏ',
          authorType: 'user',
          avatarSeed: 'seed-' + Math.floor(Math.random() * 50),
          content: text,
          createdAt: now,
          timestamp: 'Vừa xong',
          likes: 1
        };
        onAddComment(confessionId, fallbackComment);
      }

      setNewCommentText((prev) => ({ ...prev, [confessionId]: '' }));
      setCommentError((prev) => ({ ...prev, [confessionId]: null }));
      setExpandedComments((prev) => ({ ...prev, [confessionId]: true }));

      confetti({
        particleCount: 20,
        spread: 50,
        origin: { y: 0.7 }
      });
    } catch (err) {
      console.error('Error posting comment:', err);
      setCommentError((prev) => ({
        ...prev,
        [confessionId]: 'Không thể gửi bình luận lúc này. Vui lòng thử lại.'
      }));
    } finally {
      setIsSubmittingComment((prev) => ({ ...prev, [confessionId]: false }));
    }
  };

  return (
    <section className="py-10 md:py-16 max-w-5xl mx-auto px-4 sm:px-6" id="section-confessions">
      
      {/* Header & Reassurance */}
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-100">
          <Lock className="w-3.5 h-3.5" />
          <span>Góc tâm sự học đường • Nơi chia sẻ những điều khó nói</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Lắng nghe những tiếng lòng
        </h2>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Mỗi dòng tâm sự ở đây là một câu chuyện tuổi teen thực tế. Bài viết từ cộng đồng và các góc nhìn đồng cảm từ AI được phân định rõ ràng để bạn luôn có một người bạn thấu hiểu bên cạnh.
        </p>

        <div className="pt-2">
          <button
            onClick={onOpenCreateModal}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-bold text-sm shadow-sm hover:shadow-md transition-all cursor-pointer transform active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Viết tâm sự của bạn</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-rose-100/80 shadow-xs mb-8 space-y-4">
        
        {/* Search & Sort Row */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm tâm sự theo từ khóa (áp lực, điểm số, bạn bè, gia đình...)"
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
              <option value="newest">Mới nhất (Thời gian thật)</option>
              <option value="most_empathy">Nhiều đồng cảm nhất</option>
              <option value="bookmarked">Bài viết đã lưu ({bookmarkedIds.size})</option>
            </select>

            {onRefresh && (
              <button
                type="button"
                onClick={onRefresh}
                title="Làm mới bài viết từ máy chủ"
                className={`p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer ${
                  isLoading ? 'animate-spin text-rose-500' : ''
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            )}
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
      {isLoading && filteredConfessions.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 p-8 space-y-3">
          <Loader2 className="w-6 h-6 text-rose-500 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-700">Đang tải danh sách bài tâm sự từ hệ thống...</p>
        </div>
      ) : filteredConfessions.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 p-8">
          <p className="text-base font-bold text-slate-700">Chưa tìm thấy câu chuyện nào phù hợp.</p>
          <p className="text-xs text-slate-600 mt-1">
            {sortBy === 'bookmarked' 
              ? 'Bạn chưa lưu bài viết nào. Hãy bấm biểu tượng Bookmark ở góc mỗi bài để lưu lại đọc khi cần nhé.'
              : 'Hãy là người đầu tiên chia sẻ về chủ đề này nhé!'}
          </p>
          <button
            onClick={onOpenCreateModal}
            className="mt-4 px-5 py-2.5 rounded-xl bg-rose-500 text-white font-bold text-xs hover:bg-rose-600 cursor-pointer"
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
            const isBookmarked = bookmarkedIds.has(conf.id);
            const timeDisplay = formatRealTimeAgo(conf.createdAt || conf.timestamp);

            return (
              <article
                key={conf.id}
                id={`confession-card-${conf.id}`}
                className="bg-white rounded-3xl p-5 sm:p-7 border border-rose-100/90 shadow-xs hover:shadow-md transition-shadow duration-200"
              >
                {/* Author & Meta */}
                <div className="flex items-start sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold select-none border ${
                      conf.authorType === 'ai'
                        ? 'bg-purple-100 text-purple-800 border-purple-200'
                        : 'bg-gradient-to-br from-rose-100 to-amber-100 text-rose-700 border-rose-200'
                    }`}>
                      {conf.authorType === 'ai' ? '🤖' : conf.author.charAt(0)}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">
                          {conf.author}
                        </span>

                        {/* Origin Badges */}
                        {conf.authorType === 'ai' ? (
                          <span className="px-2 py-0.5 rounded-md bg-purple-100 text-[10px] font-bold text-purple-700 border border-purple-200 flex items-center gap-1">
                            <Bot className="w-3 h-3" /> Bài viết đồng cảm từ AI
                          </span>
                        ) : conf.isAnonymous ? (
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-semibold text-slate-600 flex items-center gap-0.5">
                            <Lock className="w-2.5 h-2.5" /> Ẩn danh
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-[10px] font-semibold text-emerald-700 border border-emerald-100 flex items-center gap-0.5">
                            <User className="w-2.5 h-2.5" /> Thành viên
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {timeDisplay}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-100 shrink-0">
                      {conf.category}
                    </span>

                    {/* Delete button for author or admin */}
                    {((Boolean(currentUserId) && conf.userId === currentUserId) || currentUserRole === 'admin') && (
                      <button
                        onClick={() => handleDeletePost(conf.id)}
                        className="p-1.5 rounded-xl border border-rose-200 text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer"
                        title="Xóa bài viết của bạn"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Bookmark Button */}
                    <button
                      onClick={() => toggleBookmark(conf.id)}
                      className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
                        isBookmarked
                          ? 'bg-amber-500 text-white border-amber-600'
                          : 'bg-slate-50 text-slate-400 hover:text-slate-700 border-slate-200'
                      }`}
                      title={isBookmarked ? 'Đã lưu vào danh sách của bạn' : 'Lưu bài viết này'}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-white' : ''}`} />
                    </button>
                  </div>
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

                {/* Interactions Row: ❤️ Đồng cảm | 🫂 "Mình cũng từng như vậy" | 💬 Bình luận | 🚩 Báo cáo */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    
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

                  <div className="flex items-center gap-2">
                    {/* Report button */}
                    <button
                      onClick={() => handleOpenReport(conf.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 text-xs rounded-lg transition-colors cursor-pointer"
                      title="Báo cáo bài viết không phù hợp"
                    >
                      <Flag className="w-3.5 h-3.5" />
                    </button>

                    {/* Comment Toggle */}
                    <button
                      onClick={() => toggleComments(conf.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-slate-600" />
                      <span>{conf.comments.length} Lời động viên</span>
                    </button>
                  </div>
                </div>

                {/* Expanded Comments Section */}
                {isCommentsOpen && (
                  <div className="mt-5 pt-4 border-t border-slate-100 space-y-4 animate-in fade-in duration-150">
                    
                    {/* Existing Comments List */}
                    {conf.comments.length > 0 ? (
                      <div className="space-y-3">
                        {conf.comments.map((comment) => {
                          const commentTime = formatRealTimeAgo(comment.createdAt || comment.timestamp);
                          return (
                            <div
                              key={comment.id}
                              className={`rounded-2xl p-3.5 border text-xs sm:text-sm space-y-1 ${
                                comment.authorType === 'ai'
                                  ? 'bg-purple-50/60 border-purple-200/80'
                                  : 'bg-slate-50/80 border-slate-200/60'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                                  {comment.authorType === 'ai' ? (
                                    <span className="px-1.5 py-0.5 rounded bg-purple-100 text-[10px] font-bold text-purple-800 flex items-center gap-0.5">
                                      <Bot className="w-2.5 h-2.5" /> AI gợi ý
                                    </span>
                                  ) : (
                                    <span>💬</span>
                                  )}
                                  <span>{comment.author}</span>
                                </span>
                                <span className="text-[11px] text-slate-500">{commentTime}</span>
                              </div>
                              <p className="text-slate-700 leading-relaxed pl-5 whitespace-pre-line">
                                {comment.content}
                              </p>
                            </div>
                          );
                        })}
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
                        disabled={isSubmittingComment[conf.id]}
                        className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                      >
                        {isSubmittingComment[conf.id] ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Send className="w-3.5 h-3.5" />
                        )}
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

      {/* Report Modal */}
      {reportingConfessionId && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Báo cáo bài viết</span>
              </div>
              <button
                onClick={() => setReportingConfessionId(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {reportSuccessMsg ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-xs sm:text-sm flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
                <span>{reportSuccessMsg}</span>
              </div>
            ) : (
              <>
                <p className="text-xs sm:text-sm text-slate-600">
                  Hãy cho chúng mình biết lý do bạn cảm thấy bài viết này cần được kiểm duyệt lại:
                </p>

                <div className="space-y-2">
                  {[
                    'Nội dung tiêu cực hoặc không phù hợp',
                    'Dấu hiệu bắt nạt hoặc thù ghét',
                    'Lộ thông tin cá nhân của người khác',
                    'Nội dung nguy hiểm hoặc tự hại',
                    'Spam hoặc nội dung quảng cáo'
                  ].map((r) => (
                    <label key={r} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer p-2 rounded-xl hover:bg-slate-50">
                      <input
                        type="radio"
                        name="report_reason"
                        checked={reportReason === r}
                        onChange={() => setReportReason(r)}
                        className="text-rose-500 focus:ring-rose-400"
                      />
                      <span>{r}</span>
                    </label>
                  ))}
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReportingConfessionId(null)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmitReport}
                    className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold cursor-pointer"
                  >
                    Gửi báo cáo
                  </button>
                </div>
              </>
            )}
          </div>
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
