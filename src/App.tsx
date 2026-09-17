import React, { useState, useEffect } from 'react';
import { NavigationTab, Confession, Comment } from './types';
import { INITIAL_CONFESSIONS as CONFESSIONS } from './data/initialData';
import { buildDynamicConfessions } from './data/confessionsDailyData';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { DailyCheckinFlow } from './components/DailyCheckinFlow';
import { ConfessionsView } from './components/ConfessionsView';
import { CreateConfessionModal } from './components/CreateConfessionModal';
import { ScenariosView } from './components/ScenariosView';
import { QuizzesView } from './components/QuizzesView';
import { ParentsView } from './components/ParentsView';
import { SchoolView } from './components/SchoolView';
import { HelpView } from './components/HelpView';
import { StoriesView } from './components/StoriesView';
import { ChatbotView } from './components/ChatbotView';
import { JournalView } from './components/JournalView';
import { EmotionPlantView } from './components/plant/EmotionPlantView';
import { SelfLettersView } from './components/letters/SelfLettersView';
import { FastMathGame } from './components/FastMathGame';
import { FloatingChatbotWidget } from './components/FloatingChatbotWidget';
import { BotMascot } from './components/BotMascot';
import { Footer } from './components/Footer';
import { getDailyJournalQuote } from './data/journalData';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WelcomeModal } from './components/auth/WelcomeModal';
import { GoogleLoginModal } from './components/auth/GoogleLoginModal';
import { NicknameModal } from './components/auth/NicknameModal';
import { MigrationModal } from './components/auth/MigrationModal';
import { ProfileModal } from './components/auth/ProfileModal';
import { 
  Heart, 
  ArrowRight, 
  Sparkles, 
  PhoneCall, 
  ShieldCheck, 
  Lock,
  MessageCircle,
  Headphones,
  CheckCircle2,
  BookOpen,
  Sprout,
  Mail
} from 'lucide-react';

function AppContent() {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');
  const [activeCheckinContext, setActiveCheckinContext] = useState<{
    emotion: string;
    topic: string;
    reason: string;
    summaryText: string;
  } | null>(null);
  const [journalPromptNote, setJournalPromptNote] = useState<string | undefined>(undefined);

  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [isConfessionsLoading, setIsConfessionsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchConfessions = React.useCallback(async () => {
    try {
      setIsConfessionsLoading(true);
      const token = localStorage.getItem('teen_mind_auth_token') || sessionStorage.getItem('teen_mind_auth_token');
      const res = await fetch('/api/confessions', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = await res.json();
      if (data && data.success && Array.isArray(data.confessions)) {
        setConfessions(data.confessions);
      }
    } catch (err) {
      console.error('Error fetching confessions from server:', err);
    } finally {
      setIsConfessionsLoading(false);
    }
  }, []);

  // Fetch confessions on mount and whenever the active user changes
  useEffect(() => {
    fetchConfessions();
  }, [fetchConfessions, user?.id]);

  // Refetch confessions when account switch or login/logout events fire
  useEffect(() => {
    const handleAccountChange = () => {
      fetchConfessions();
    };
    window.addEventListener('teen_account_changed', handleAccountChange);
    return () => {
      window.removeEventListener('teen_account_changed', handleAccountChange);
    };
  }, [fetchConfessions]);

  // Scroll to top whenever tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentTab]);

  // Check URL params for direct letter links
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('tab') === 'letters' || params.has('letter')) {
      setCurrentTab('letters');
    }
  }, []);

  const handleOpenChatWithContext = (context: {
    emotion: string;
    topic: string;
    reason: string;
    summaryText: string;
  }) => {
    setActiveCheckinContext(context);
    setCurrentTab('chatbot');
  };

  const handleAddConfession = (newConfession: Confession) => {
    setConfessions((prev) => [newConfession, ...prev.filter(c => c.id !== newConfession.id)]);
  };

  const handleDeleteConfession = (id: string) => {
    setConfessions((prev) => prev.filter((c) => c.id !== id));
  };

  const handleReactConfession = (id: string, type: 'empathy' | 'meToo') => {
    setConfessions((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const userReacted = c.userReacted || {};
        
        if (type === 'empathy') {
          const already = !!userReacted.empathy;
          return {
            ...c,
            empathyCount: already ? Math.max(0, c.empathyCount - 1) : c.empathyCount + 1,
            userReacted: { ...userReacted, empathy: !already }
          };
        } else {
          const already = !!userReacted.meToo;
          return {
            ...c,
            meTooCount: already ? Math.max(0, c.meTooCount - 1) : c.meTooCount + 1,
            userReacted: { ...userReacted, meToo: !already }
          };
        }
      })
    );

    // Call server API with token
    const token = localStorage.getItem('teen_mind_auth_token') || sessionStorage.getItem('teen_mind_auth_token');
    fetch(`/api/confessions/${id}/react`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ type })
    }).catch(() => {});
  };

  const handleAddComment = (confessionId: string, comment: Comment) => {
    setConfessions((prev) =>
      prev.map((c) => {
        if (c.id !== confessionId) return c;
        // Avoid duplicate comment id
        const existing = c.comments || [];
        if (existing.some(item => item.id === comment.id)) return c;
        return {
          ...c,
          comments: [...existing, comment]
        };
      })
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-slate-800 font-['Nunito',sans-serif] selection:bg-rose-100 selection:text-rose-900">
      
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenCreateConfession={() => setIsCreateModalOpen(true)}
      />

      {/* Main View Body */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <div>
            {/* 1. Primary Emotion Checkin Flow: "Bạn ơi, hôm nay như nào?" 🌷 */}
            <DailyCheckinFlow
              onOpenChatWithContext={handleOpenChatWithContext}
              onGoToHelp={() => setCurrentTab('help')}
              onGoToJournal={(note) => {
                setJournalPromptNote(note);
                setCurrentTab('journal');
              }}
            />

            {/* 2. Hero Section & Key Features */}
            <HeroSection
              onGoToChatbot={() => setCurrentTab('chatbot')}
              onGoToJournal={() => setCurrentTab('journal')}
              onGoToConfessions={() => setCurrentTab('confessions')}
              onGoToScenarios={() => setCurrentTab('scenarios')}
              onGoToHelp={() => setCurrentTab('help')}
            />

            {/* 📖 NỔI BẬT: "Nhật ký của mình" - Yêu cầu người dùng số 1 */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
              <div className="bg-gradient-to-r from-amber-50 via-rose-50 to-emerald-50 rounded-3xl p-6 sm:p-8 border border-amber-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-md transition-shadow">
                <div className="space-y-2 max-w-xl">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-amber-200 text-xs font-bold text-amber-900 shadow-2xs">
                    <Lock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Không gian riêng tư • 100% Của bạn</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                    📖 Nhật ký của mình
                  </h3>
                  <p className="text-base sm:text-lg font-bold text-rose-600 italic">
                    “{getDailyJournalQuote()}”
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Hôm nay bạn muốn để lại điều gì? Có những chuyện chỉ cần viết xuống là nhẹ đi một chút. Viết lại hôm nay, để một ngày nào đó quay lại gặp phiên bản mình của ngày hôm nay. 🌱
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0 w-full md:w-auto">
                  <button
                    onClick={() => setCurrentTab('journal')}
                    className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer transform active:scale-95"
                  >
                    <BookOpen className="w-4 h-4 text-amber-200" />
                    <span>Mở nhật ký 📖</span>
                  </button>
                  <span className="text-center text-[11px] text-slate-500 italic">
                    Không ép viết dài • Lưu an toàn trên máy
                  </span>
                </div>
              </div>
            </section>

            {/* 3. Dedicated Chatbot Feature Banner on Home */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 pb-10">
              <div className="relative overflow-hidden bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 rounded-3xl p-6 sm:p-8 text-white shadow-lg">
                
                {/* Background decorative circles */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none transform translate-x-20 -translate-y-20"></div>
                <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-amber-400/20 rounded-full blur-xl pointer-events-none"></div>

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  
                  {/* Left mascot and text */}
                  <div className="lg:col-span-8 flex flex-col sm:flex-row items-start sm:items-center gap-5">
                    <div className="relative shrink-0">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white/20 backdrop-blur-xs p-2 flex items-center justify-center shadow-md">
                        <BotMascot mood="happy" size="lg" className="w-16 h-16 sm:w-20 sm:h-20 shadow-none border-0" />
                      </div>
                      <span className="absolute -bottom-1 -right-1 bg-emerald-400 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
                        ONLINE 24/7
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold tracking-wide">
                        <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                        <span>Chatbot AI: “Bạn ơi, mình nói nè”</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight leading-tight">
                        “Có chuyện gì, cứ kể mình nghe.”
                      </h3>
                      <p className="text-xs sm:text-sm text-rose-100 max-w-xl leading-relaxed">
                        Bạn không cần phải có câu trả lời ngay. Đôi khi, bắt đầu bằng việc nói ra đã là một bước rất lớn. Trò chuyện 100% ẩn danh, nhẹ nhàng và không hề phán xét.
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-rose-100">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" /> 3 chế độ hỗ trợ
                        </span>
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" /> Giọng nói tiếng Việt
                        </span>
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" /> Không cần đăng nhập
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Action Trigger */}
                  <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-stretch justify-center gap-3">
                    <button
                      id="home-banner-open-chatbot-btn"
                      onClick={() => setCurrentTab('chatbot')}
                      className="w-full py-4 px-6 rounded-2xl bg-white hover:bg-rose-50 text-rose-600 font-extrabold text-sm sm:text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer transform active:scale-95"
                    >
                      <MessageCircle className="w-5 h-5 text-rose-500" />
                      <span>Trò chuyện ngay bây giờ</span>
                    </button>

                    <button
                      onClick={() => setCurrentTab('help')}
                      className="w-full py-2.5 px-4 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Kênh hỗ trợ khẩn cấp</span>
                    </button>
                  </div>

                </div>

              </div>
            </section>

            {/* 🌱 Spotlight: "Hộp Cây Cảm Xúc" */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 py-2">
              <div className="bg-gradient-to-r from-emerald-50 via-amber-50/70 to-emerald-50 rounded-3xl p-6 sm:p-7 border border-emerald-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-md transition-shadow">
                <div className="space-y-2 max-w-xl">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-emerald-200 text-xs font-bold text-emerald-800 shadow-2xs">
                    <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Tính năng mới • Gieo hạt cảm xúc • Cây lớn dần theo thời gian</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                    🌱 Hộp Cây Cảm Xúc
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Không cần gọi tên cảm xúc. Cứ vẽ nó lên tờ giấy hình tròn, gấp lại và gieo vào chiếc hộp. Mọi cảm xúc vui, buồn, giận hay mệt mỏi đều được đón nhận để nuôi lớn cái cây của bạn.
                  </p>
                </div>

                <button
                  onClick={() => setCurrentTab('plant')}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all flex items-center gap-2 shrink-0 cursor-pointer"
                >
                  <Sprout className="w-4 h-4" />
                  <span>Ghé thăm Hộp Cây</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Spotlight: Bức Thư Cho Bản Thân */}
              <div className="mt-6 bg-gradient-to-r from-[#F5EFEB] via-[#FAF8F5] to-[#EFE7DC] rounded-3xl p-6 sm:p-7 border border-[#DFCFC0] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-md transition-shadow">
                <div className="space-y-2 max-w-xl">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-[#DFCFC0] text-xs font-serif font-bold text-[#6B4E3D] shadow-2xs">
                    <Mail className="w-3.5 h-3.5 text-[#8C5A4B]" />
                    <span>Bức thư cho bản thân • Phong ấn thời gian • Hẹn ngày hội ngộ</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#2A1F18]">
                    📜 Bức Thư Cho Bản Thân
                  </h3>
                  <p className="text-xs sm:text-sm text-[#7A6455] leading-relaxed">
                    Viết lên trang giấy cũ, tự tay vẽ những nét trang trí mộc mạc và ấn định ngày mở thư. Một cái ôm dịu dàng được gửi gắm từ bạn của hôm nay đến chính mình trong tương lai.
                  </p>
                </div>

                <button
                  id="home-self-letters-btn"
                  onClick={() => setCurrentTab('letters')}
                  className="px-5 py-3 rounded-2xl bg-[#3B2A1E] hover:bg-[#251A13] text-[#FAF8F5] font-serif font-bold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all flex items-center gap-2 shrink-0 cursor-pointer"
                >
                  <Mail className="w-4 h-4 text-[#DFC8B4]" />
                  <span>Khám phá các phong bì</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </section>

            {/* 4. Featured Confessions Spotlight */}
            <section className="py-12 max-w-6xl mx-auto px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-100 mb-2">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Lắng nghe những tiếng lòng</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    Góc tâm sự mới nhất
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    Những câu chuyện có thật được chia sẻ hoàn toàn ẩn danh.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    + Viết tâm sự
                  </button>
                  <button
                    onClick={() => setCurrentTab('confessions')}
                    className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <span>Xem tất cả</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Confessions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {confessions.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-3xl p-6 border border-rose-100/70 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700">{item.author}</span>
                        <span className="text-slate-600">{item.timestamp}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-base line-clamp-1">
                        {item.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                        {item.content}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                      <span className="flex items-center gap-1 text-rose-500 font-semibold">
                        <Heart className="w-3.5 h-3.5 fill-rose-500" />
                        <span>{item.empathyCount} đồng cảm</span>
                      </span>
                      <button
                        onClick={() => setCurrentTab('confessions')}
                        className="text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <span>Đọc tiếp</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 5. Feature Cards: "Mình nên làm gì?" & "Thử hiểu bản thân hơn" & "Nói chuyện với bố mẹ" */}
            <section className="py-12 bg-white/70 border-t border-rose-100/60">
              <div className="max-w-6xl mx-auto px-4 sm:px-6">
                
                <div className="text-center space-y-2 mb-10">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
                    Góc chia sẻ & Rèn luyện
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    Bạn đang tìm câu trả lời cho điều gì?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
                    Chọn một góc không gian phù hợp với những băn khoăn bạn đang gặp phải.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Card 1: Mình nên làm gì? */}
                  <div
                    onClick={() => setCurrentTab('scenarios')}
                    className="bg-gradient-to-br from-amber-50/50 via-white to-orange-50/40 rounded-3xl p-6 sm:p-7 border border-amber-200/80 shadow-xs hover:shadow-md hover:border-amber-300 transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-2xl shadow-xs group-hover:scale-110 transition-transform">
                        🧭
                      </div>
                      <h4 className="text-lg font-bold text-slate-900">
                        “Mình nên làm gì?”
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        10 tình huống tuổi teen (điểm thấp, FOMO, bạn thân xa cách, mâu thuẫn...) cùng phân tích ưu và nhược điểm của từng lựa chọn.
                      </p>
                    </div>

                    <div className="pt-2 flex items-center text-xs font-bold text-amber-700 gap-1 group-hover:gap-2 transition-all">
                      <span>Khám phá 10 tình huống</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Card 2: Thử hiểu bản thân hơn (Mini tests) */}
                  <div
                    onClick={() => setCurrentTab('quizzes')}
                    className="bg-gradient-to-br from-teal-50/50 via-white to-emerald-50/40 rounded-3xl p-6 sm:p-7 border border-teal-200/80 shadow-xs hover:shadow-md hover:border-teal-300 transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center text-2xl shadow-xs group-hover:scale-110 transition-transform">
                        🧠
                      </div>
                      <h4 className="text-lg font-bold text-slate-900">
                        Thử hiểu bản thân hơn
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        6 bài trắc nghiệm ngắn giúp tự nhận diện áp lực học tập, ảnh hưởng mạng xã hội và kỹ năng cân bằng cuộc sống.
                      </p>
                    </div>

                    <div className="pt-2 flex items-center text-xs font-bold text-teal-700 gap-1 group-hover:gap-2 transition-all">
                      <span>Làm bài trắc nghiệm</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Card 3: Nói chuyện với bố mẹ */}
                  <div
                    onClick={() => setCurrentTab('parents')}
                    className="bg-gradient-to-br from-rose-50/50 via-white to-pink-50/40 rounded-3xl p-6 sm:p-7 border border-rose-200/80 shadow-xs hover:shadow-md hover:border-rose-300 transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center text-2xl shadow-xs group-hover:scale-110 transition-transform">
                        👨‍👩‍👧
                      </div>
                      <h4 className="text-lg font-bold text-slate-900">
                        Nói chuyện với bố mẹ
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        Bí quyết mở lời và mẫu câu tin nhắn chân thành khi bạn muốn tâm sự về điểm số, áp lực hay sự so sánh.
                      </p>
                    </div>

                    <div className="pt-2 flex items-center text-xs font-bold text-rose-700 gap-1 group-hover:gap-2 transition-all">
                      <span>Xem mẫu câu mở lời</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>

                </div>

              </div>
            </section>

            {/* 6. Safe Space Reassurance & Emergency banner */}
            <section className="py-12 max-w-5xl mx-auto px-4 sm:px-6">
              <div className="bg-gradient-to-r from-rose-500 to-amber-500 rounded-3xl p-6 sm:p-10 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center sm:text-left">
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 text-xs font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Luôn có người đồng hành cùng bạn</span>
                  </div>
                  <h4 className="text-xl sm:text-2xl font-black">
                    Bạn đang cảm thấy quá tải hoặc cần người lắng nghe ngay?
                  </h4>
                  <p className="text-xs sm:text-sm text-rose-100 max-w-xl">
                    Đừng giữ mọi thứ một mình. Bạn có thể trò chuyện cùng chatbot “Có chuyện gì, cứ kể mình nghe” hoặc tìm kiếm trợ giúp từ người lớn đáng tin cậy.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                  <button
                    onClick={() => setCurrentTab('chatbot')}
                    className="px-5 py-3 rounded-2xl bg-white text-rose-600 hover:bg-rose-50 font-bold text-sm shadow-md transition-all cursor-pointer"
                  >
                    💬 Chat cùng AI
                  </button>
                  <button
                    onClick={() => setCurrentTab('help')}
                    className="px-5 py-3 rounded-2xl bg-rose-700/60 hover:bg-rose-700/80 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                  >
                    Trợ giúp khẩn cấp
                  </button>
                </div>
              </div>
            </section>

          </div>
        )}

        {/* Tab: Chatbot "Bạn ơi, mình nói nè" */}
        {currentTab === 'chatbot' && (
          <ChatbotView 
            onClose={() => setCurrentTab('home')}
            onGoToHelp={() => setCurrentTab('help')} 
            onGoToConfessions={() => setCurrentTab('confessions')}
            onGoToJournal={(note) => {
              setJournalPromptNote(note);
              setCurrentTab('journal');
            }}
            checkinContext={activeCheckinContext}
          />
        )}

        {/* Tab: 📖 Nhật ký của mình */}
        {currentTab === 'journal' && (
          <JournalView
            initialPromptText={journalPromptNote}
            onAskChatbotWithText={(text) => {
              setActiveCheckinContext({
                emotion: 'confused',
                topic: 'Nhật ký cá nhân',
                reason: 'Tâm sự chuyện trong nhật ký',
                summaryText: text
              });
              setCurrentTab('chatbot');
            }}
          />
        )}

        {/* Tab 2: Confessions */}
        {currentTab === 'confessions' && (
          <ConfessionsView
            confessions={confessions}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
            onReact={handleReactConfession}
            onAddComment={handleAddComment}
            onDeleteConfession={handleDeleteConfession}
            currentUserId={user?.id}
            currentUserRole={(user as any)?.role}
            isLoading={isConfessionsLoading}
            onRefresh={fetchConfessions}
          />
        )}

        {/* Tab 3: Scenarios */}
        {currentTab === 'scenarios' && <ScenariosView currentUserId={user?.id} />}

        {/* Tab 4: Quizzes */}
        {currentTab === 'quizzes' && <QuizzesView currentUserId={user?.id} />}

        {/* Tab 5: Parents */}
        {currentTab === 'parents' && <ParentsView />}

        {/* Tab 6: School */}
        {currentTab === 'school' && (
          <SchoolView onGoToHelp={() => setCurrentTab('help')} />
        )}

        {/* Tab 7: Help */}
        {currentTab === 'help' && <HelpView />}

        {/* Tab 8: Stories */}
        {currentTab === 'stories' && (
          <StoriesView
            onGoToJournal={(prompt) => {
              setJournalPromptNote(prompt);
              setCurrentTab('journal');
            }}
          />
        )}

        {/* Tab: 🌱 Hộp cây cảm xúc */}
        {currentTab === 'plant' && <EmotionPlantView />}

        {/* Tab: 📜 Bức thư cho bản thân (Letters to My Future Self) */}
        {currentTab === 'letters' && <SelfLettersView />}
      </main>

      {/* Floating Mini Game: 🧠 Phép tính nhanh (Bottom Left) */}
      <FastMathGame />

      {/* Floating Chatbot Launcher Widget (Bottom Right) */}
      <FloatingChatbotWidget 
        onOpenFullChat={() => setCurrentTab('chatbot')}
        isFullChatActive={currentTab === 'chatbot'}
      />

      {/* Create Confession Modal */}
      <CreateConfessionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onAddConfession={handleAddConfession}
        onGoToHelp={() => {
          setIsCreateModalOpen(false);
          setCurrentTab('help');
        }}
      />

      {/* Account & Onboarding Modals */}
      <WelcomeModal />
      <GoogleLoginModal />
      <NicknameModal />
      <MigrationModal />
      <ProfileModal />

      {/* Footer */}
      <Footer onSelectTab={setCurrentTab} />

    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
