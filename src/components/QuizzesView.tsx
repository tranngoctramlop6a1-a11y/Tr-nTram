import React, { useState, useEffect, useMemo } from 'react';
import { TEEN_COMPREHENSIVE_QUIZZES } from '../data/quizzesData';
import { getDailyQuizInfo, generateDynamicQuizForDay, DailyQuizInfo } from '../data/dailyQuizEngine';
import { Quiz, QuizResultLevel } from '../types';
import { getUserProgress, recordQuizResult } from '../utils/userProgressStore';
import { formatRealTimeAgo } from '../utils/timeAgo';
import { 
  BrainCircuit, 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw, 
  Sparkles, 
  ShieldAlert, 
  Lightbulb, 
  History, 
  Calendar, 
  Flame, 
  RefreshCw, 
  BookOpen, 
  ChevronRight,
  Award,
  Sparkle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizzesViewProps {
  currentUserId?: string;
}

export const QuizzesView: React.FC<QuizzesViewProps> = ({ currentUserId }) => {
  // Navigation tabs: 'today' | 'all' | 'history'
  const [activeTab, setActiveTab] = useState<'today' | 'all' | 'history'>('today');
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const [variantOffset, setVariantOffset] = useState<number>(0);
  const [userProgress, setUserProgress] = useState(() => getUserProgress(currentUserId));

  // Sync user progress updates
  useEffect(() => {
    const handleUpdate = () => {
      setUserProgress(getUserProgress(currentUserId));
    };
    window.addEventListener('teen_progress_updated', handleUpdate);
    window.addEventListener('teen_account_changed', handleUpdate);
    return () => {
      window.removeEventListener('teen_progress_updated', handleUpdate);
      window.removeEventListener('teen_account_changed', handleUpdate);
    };
  }, [currentUserId]);

  // Daily Quiz Info based on current day and variant offset
  const dailyInfo: DailyQuizInfo = useMemo(() => {
    const base = getDailyQuizInfo();
    if (variantOffset === 0) {
      return base;
    }
    const dynamicQuiz = generateDynamicQuizForDay(variantOffset);
    return {
      ...base,
      themeTitle: dynamicQuiz.title.replace(/^\[.*?\]\s*/, ''),
      quiz: dynamicQuiz
    };
  }, [variantOffset]);

  // Combined pool of available quizzes
  const allAvailableQuizzes = useMemo(() => {
    const map = new Map<string, Quiz>();
    map.set(dailyInfo.quiz.id, dailyInfo.quiz);
    TEEN_COMPREHENSIVE_QUIZZES.forEach((q) => {
      map.set(q.id, q);
    });
    return Array.from(map.values());
  }, [dailyInfo.quiz]);

  const activeQuiz: Quiz | undefined = allAvailableQuizzes.find((q) => q.id === activeQuizId);

  // Check if today's quiz has been completed
  const quizHistory = userProgress.quizHistory || [];
  const todayDatePrefix = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  
  const todayCompletedQuizzes = useMemo(() => {
    return quizHistory.filter((item) => {
      const itemDate = new Date(item.completedAt).toISOString().split('T')[0];
      return itemDate === todayDatePrefix;
    });
  }, [quizHistory, todayDatePrefix]);

  const isTodayCompleted = todayCompletedQuizzes.length > 0;

  // Compute daily streak (consecutive days with at least 1 quiz completed)
  const streakDays = useMemo(() => {
    if (quizHistory.length === 0) return 0;
    const completedDates = new Set(
      quizHistory.map((item) => new Date(item.completedAt).toISOString().split('T')[0])
    );
    
    let streak = 0;
    const checkDate = new Date();
    
    // Check today first
    const todayStr = checkDate.toISOString().split('T')[0];
    if (completedDates.has(todayStr)) {
      streak++;
    }

    // Check backwards from yesterday
    let daysBack = 1;
    while (true) {
      const prevDate = new Date();
      prevDate.setDate(prevDate.getDate() - daysBack);
      const prevStr = prevDate.toISOString().split('T')[0];
      if (completedDates.has(prevStr)) {
        streak++;
        daysBack++;
      } else {
        break;
      }
    }
    return streak;
  }, [quizHistory]);

  const handleStartQuiz = (quizId: string) => {
    setActiveQuizId(quizId);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setQuizCompleted(false);
  };

  const handleSelectAnswer = (questionId: number, score: number) => {
    const updated = { ...userAnswers, [questionId]: score };
    setUserAnswers(updated);

    if (activeQuiz) {
      if (currentQuestionIndex < activeQuiz.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Complete the quiz!
        setQuizCompleted(true);
        const result = calculateResult(activeQuiz, updated);
        
        // Save to user progress store (and sync to server)
        const scores: number[] = Object.values(updated);
        const totalScore = scores.reduce((sum, val) => sum + val, 0);
        const maxScore = activeQuiz.questions.length * 4;

        recordQuizResult(currentUserId, {
          quizId: activeQuiz.id,
          quizTitle: activeQuiz.title,
          score: totalScore,
          maxScore: maxScore,
          resultLevel: result.level,
          resultTitle: result.title,
          advice: result.actionAdvice
        });

        confetti({
          particleCount: 65,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    }
  };

  const handleReset = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setQuizCompleted(false);
  };

  const handleBackToQuizzes = () => {
    setActiveQuizId(null);
    handleReset();
  };

  const handleCycleDailyQuiz = () => {
    setVariantOffset((prev) => (prev + 1) % 7);
    confetti({
      particleCount: 25,
      spread: 50,
      origin: { y: 0.4 }
    });
  };

  // Calculate result level
  const calculateResult = (quiz: Quiz, answers = userAnswers): QuizResultLevel => {
    const scores: number[] = Object.values(answers);
    const totalScore = scores.reduce((sum: number, val: number) => sum + val, 0);
    const maxScore = quiz.questions.length * 4;
    const minScore = quiz.questions.length * 1;
    const range = maxScore - minScore;
    const normalized = range > 0 ? (totalScore - minScore) / range : 0; // 0 to 1

    if (normalized <= 0.25) return quiz.results.low;
    if (normalized <= 0.55) return quiz.results.medium;
    if (normalized <= 0.8) return quiz.results.high;
    return quiz.results.veryHigh;
  };

  return (
    <section className="py-8 md:py-14 max-w-5xl mx-auto px-4 sm:px-6" id="section-quizzes">
      
      {/* View Header */}
      {!activeQuizId && (
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200 shadow-2xs">
            <BrainCircuit className="w-4 h-4 text-teal-600" />
            <span>Trắc nghiệm tâm lý học đường • Chuẩn 10 câu mỗi chủ đề</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Thấu hiểu cảm xúc & Khám phá bản thân
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Mỗi chủ đề gồm <strong>10 câu hỏi tiêu chuẩn</strong> giúp bạn nhận diện áp lực và học cách lắng nghe chính mình. Đặc biệt, <strong>nội dung bài kiểm tra được cập nhật mới mỗi ngày</strong> để bạn luôn có góc nhìn mới mẻ!
          </p>

          {/* Navigation tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
            <button
              id="tab-daily-quiz"
              onClick={() => setActiveTab('today')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'today'
                  ? 'bg-rose-500 text-white shadow-sm ring-2 ring-rose-200'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Calendar className="w-4 h-4 text-amber-300" />
              <span>Bài kiểm tra hôm nay</span>
              {isTodayCompleted ? (
                <span className="w-2 h-2 rounded-full bg-emerald-300"></span>
              ) : (
                <span className="w-2 h-2 rounded-full bg-amber-300 animate-pulse"></span>
              )}
            </button>

            <button
              id="tab-all-quizzes"
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'all'
                  ? 'bg-rose-500 text-white shadow-sm ring-2 ring-rose-200'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Tất cả chủ đề (10 câu/bài)</span>
            </button>

            <button
              id="tab-history"
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-rose-500 text-white shadow-sm ring-2 ring-rose-200'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Lịch sử ({quizHistory.length})</span>
            </button>
          </div>

          <p className="text-xs text-slate-500 italic bg-amber-50/90 max-w-xl mx-auto p-2.5 rounded-xl border border-amber-200/70 mt-2">
            ⚠️ Lưu ý: Đây là bài trắc nghiệm tự suy ngẫm dành cho học sinh, không thay thế cho chẩn đoán y khoa hay tâm thần học.
          </p>
        </div>
      )}

      {/* TAB 1: BÀI KIỂM TRA HÔM NAY (DAILY TEST) */}
      {!activeQuizId && activeTab === 'today' && (
        <div className="space-y-6">
          
          {/* Daily Feature Card */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-50 via-amber-50/50 to-orange-50 border-2 border-rose-200 p-6 sm:p-8 shadow-sm">
            
            {/* Top Bar: Date + Streak */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/90 border border-rose-200 text-rose-800 text-xs font-extrabold shadow-2xs">
                <Calendar className="w-3.5 h-3.5 text-rose-500" />
                <span>{dailyInfo.fullFormattedDate}</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold shadow-2xs">
                <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                <span>Chuỗi phản chiếu: {streakDays} ngày</span>
              </div>
            </div>

            {/* Main Daily Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              <div className="lg:col-span-8 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-rose-200 shadow-xs flex items-center justify-center text-3xl">
                    {dailyInfo.quiz.icon}
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
                      Chủ đề hôm nay ({dailyInfo.quiz.questions.length} câu)
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                      {dailyInfo.themeTitle}
                    </h3>
                  </div>
                </div>

                <p className="text-sm text-slate-700 leading-relaxed font-medium">
                  {dailyInfo.quiz.description}
                </p>

                {/* Daily Quote & Tip */}
                <div className="space-y-2 pt-1">
                  <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-3.5 border border-rose-100 text-xs text-slate-700 italic">
                    <span className="font-bold text-rose-700 not-italic mr-1.5">“</span>
                    {dailyInfo.dailyQuote.quote}
                    <span className="font-bold text-rose-700 not-italic ml-1.5">”</span>
                    <span className="not-italic block mt-1 text-slate-500 font-semibold text-right">
                      — {dailyInfo.dailyQuote.author}
                    </span>
                  </div>

                  <div className="bg-amber-100/60 rounded-xl p-3 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2 font-medium">
                    <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Mẹo nhỏ hôm nay:</strong> {dailyInfo.dailyTip}</span>
                  </div>
                </div>
              </div>

              {/* Action Column */}
              <div className="lg:col-span-4 flex flex-col justify-center items-stretch gap-3 bg-white/90 p-5 rounded-2xl border border-rose-100">
                {isTodayCompleted ? (
                  <div className="space-y-2 text-center">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Bạn đã hoàn thành bài kiểm tra hôm nay!
                    </h4>
                    <p className="text-xs text-slate-500">
                      Hôm nay bạn đã làm {todayCompletedQuizzes.length} lượt kiểm tra tâm lý.
                    </p>
                    <button
                      onClick={() => handleStartQuiz(dailyInfo.quiz.id)}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Làm lại bài hôm nay</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 text-center">
                    <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Sẵn sàng 10 câu cho hôm nay?
                    </h4>
                    <p className="text-xs text-slate-500">
                      Chỉ mất 3 phút để thấu hiểu bản thân và nạp năng lượng bình yên.
                    </p>
                    <button
                      id="btn-start-daily-quiz"
                      onClick={() => handleStartQuiz(dailyInfo.quiz.id)}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white text-xs sm:text-sm font-extrabold shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>Bắt đầu bài trắc nghiệm (10 câu)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Refresh / Dynamic quiz generator button */}
                <button
                  id="btn-cycle-daily-quiz"
                  onClick={handleCycleDailyQuiz}
                  className="w-full py-2.5 px-3 rounded-xl border border-dashed border-rose-300 hover:border-rose-400 bg-rose-50/60 hover:bg-rose-100/70 text-rose-800 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  title="Nhận một bộ đề 10 câu hỏi độc đáo khác cho ngày hôm nay"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-rose-600" />
                  <span>Đổi sang đề kiểm tra mới khác hôm nay</span>
                </button>
              </div>

            </div>

          </div>

          {/* Quick links to explore all other 10-question topics */}
          <div className="flex items-center justify-between pt-2">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <span>Các chủ đề kiểm tra tâm lý chuyên biệt</span>
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                10 câu / chủ đề
              </span>
            </h3>
            <button
              onClick={() => setActiveTab('all')}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
            >
              <span>Xem tất cả</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {TEEN_COMPREHENSIVE_QUIZZES.slice(0, 3).map((quiz) => (
              <div
                key={quiz.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-sm hover:border-rose-300 transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{quiz.icon}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold bg-teal-50 text-teal-800 border border-teal-200">
                      10 câu hỏi
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 leading-snug">
                    {quiz.title}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {quiz.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">~3-5 phút</span>
                  <button
                    onClick={() => handleStartQuiz(quiz.id)}
                    className="px-3.5 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold cursor-pointer transition-colors flex items-center gap-1"
                  >
                    <span>Làm bài</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 2: TẤT CẢ CÁC CHỦ ĐỀ (10 CÂU / BÀI) */}
      {!activeQuizId && activeTab === 'all' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-rose-50/70 p-4 rounded-2xl border border-rose-100">
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-5 h-5 text-rose-600" />
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  Kho bộ đề trắc nghiệm tâm lý học đường chuẩn hóa
                </h3>
                <p className="text-xs text-slate-600">
                  Mỗi chủ đề được thiết kế đúng <strong>10 câu hỏi</strong> bám sát thực tế tâm lý lứa tuổi học sinh.
                </p>
              </div>
            </div>
            <div className="text-xs font-bold text-rose-700 bg-white px-3 py-1.5 rounded-xl border border-rose-200 shrink-0 self-start sm:self-center">
              Tổng cộng: {TEEN_COMPREHENSIVE_QUIZZES.length} chủ đề chuẩn 10 câu
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TEEN_COMPREHENSIVE_QUIZZES.map((quiz) => (
              <div
                key={quiz.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs hover:shadow-md hover:border-rose-300 transition-all duration-200 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-2xl shadow-2xs">
                      {quiz.icon}
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-teal-50 text-teal-800 border border-teal-200">
                      10 câu hỏi
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {quiz.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {quiz.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">
                    10 câu • ~3-5 phút
                  </span>
                  <button
                    onClick={() => handleStartQuiz(quiz.id)}
                    className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <span>Bắt đầu</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: LỊCH SỬ LÀM BÀI */}
      {!activeQuizId && activeTab === 'history' && (
        <div className="space-y-4 max-w-3xl mx-auto">
          {quizHistory.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 p-8 space-y-3">
              <History className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-base font-bold text-slate-800">Bạn chưa làm bài trắc nghiệm nào.</p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Hãy làm bài kiểm tra 10 câu hôm nay để bắt đầu theo dõi sức khỏe cảm xúc và xây dựng chuỗi ngày tự chăm sóc bản thân nhé!
              </p>
              <button
                onClick={() => setActiveTab('today')}
                className="mt-2 px-5 py-2.5 rounded-xl bg-rose-500 text-white text-xs font-bold cursor-pointer"
              >
                Làm bài kiểm tra hôm nay
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Tổng số bài đã làm: {quizHistory.length}
                </span>
                <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-amber-500" />
                  Chuỗi hiện tại: {streakDays} ngày
                </span>
              </div>

              {quizHistory.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-5 border border-rose-100 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm sm:text-base text-slate-900">
                        {item.quizTitle}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                        {item.resultTitle}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatRealTimeAgo(item.completedAt)}
                      </span>
                      <span>• Điểm: {item.score}/{item.maxScore}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleStartQuiz(item.quizId)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold self-start sm:self-center cursor-pointer transition-colors shrink-0"
                  >
                    Làm lại bài này
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ACTIVE QUIZ QUESTION SESSION */}
      {activeQuiz && !quizCompleted && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-rose-100 shadow-md max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
          
          {/* Top Bar with Back button & Progress */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleBackToQuizzes}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
            >
              ← Trở về danh sách
            </button>
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
              Câu {currentQuestionIndex + 1} / {activeQuiz.questions.length}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 transition-all duration-300 rounded-full"
                style={{ width: `${((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-2xs text-slate-400 px-0.5">
              <span>Bắt đầu</span>
              <span>Đã hoàn thành {Math.round(((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100)}%</span>
              <span>10 câu</span>
            </div>
          </div>

          {/* Question text */}
          <div className="space-y-2 pt-1">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
              <span>{activeQuiz.icon}</span>
              <span>{activeQuiz.title}</span>
            </span>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
              {activeQuiz.questions[currentQuestionIndex].question}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-3 pt-2">
            {activeQuiz.questions[currentQuestionIndex].options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectAnswer(activeQuiz.questions[currentQuestionIndex].id, opt.score)}
                className="w-full p-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 hover:bg-rose-50/80 hover:border-rose-300 text-left transition-all duration-150 cursor-pointer flex items-center justify-between group transform active:scale-98"
              >
                <span className="text-sm font-semibold text-slate-800 group-hover:text-rose-950 pr-2 leading-relaxed">
                  {opt.label}
                </span>
                <span className="w-7 h-7 rounded-full border border-slate-300 group-hover:border-rose-500 group-hover:bg-rose-500 group-hover:text-white flex items-center justify-center text-xs font-bold text-slate-600 shrink-0 ml-2 transition-colors">
                  {idx + 1}
                </span>
              </button>
            ))}
          </div>

          {/* Navigation helpers */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            {currentQuestionIndex > 0 ? (
              <button
                onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                className="text-slate-600 hover:text-slate-900 font-bold cursor-pointer"
              >
                ← Quay lại câu trước
              </button>
            ) : <span />}
            <span>Hãy chọn đáp án đúng với cảm nhận chân thật của bạn nhất.</span>
          </div>

        </div>
      )}

      {/* QUIZ RESULT DISPLAY */}
      {activeQuiz && quizCompleted && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-rose-200 shadow-lg max-w-2xl mx-auto space-y-6 animate-in zoom-in-95 duration-200">
          
          {(() => {
            const result = calculateResult(activeQuiz);
            return (
              <>
                {/* Result Badge */}
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 rounded-3xl bg-rose-50 border border-rose-100 flex items-center justify-center text-3xl mx-auto shadow-xs">
                    {activeQuiz.icon}
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Đã hoàn thành bộ 10 câu hỏi
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                      Kết quả tự đánh giá của bạn
                    </h3>
                  </div>
                  <div className="inline-block">
                    <span className={`px-4 py-1.5 rounded-full text-sm font-extrabold border shadow-2xs ${result.badgeColor}`}>
                      {result.title}
                    </span>
                  </div>
                </div>

                {/* Summary Card */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 text-sm sm:text-base text-slate-800 leading-relaxed font-medium">
                  {result.summary}
                </div>

                {/* Actionable suggestions */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-rose-700 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    <span>Gợi ý chăm sóc bản thân dành riêng cho bạn:</span>
                  </h4>
                  <div className="space-y-2">
                    {result.actionAdvice.map((adv, i) => (
                      <div
                        key={i}
                        className="bg-rose-50/60 rounded-xl p-3.5 border border-rose-100 text-xs sm:text-sm text-slate-800 flex items-start gap-2.5"
                      >
                        <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <span className="font-medium">{adv}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Safety & Empathy Disclaimer */}
                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900 space-y-1">
                  <span className="font-bold block flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    <span>Lời dặn dò an toàn & thấu cảm:</span>
                  </span>
                  <p className="leading-relaxed">
                    Kết quả đã được lưu tự động vào mục <strong>Lịch sử của bạn</strong> để theo dõi diễn biến tâm trạng. Nếu cảm thấy bất an hay quá tải, đừng ngần ngại tâm sự với chuyên viên tư vấn học đường hoặc người lớn đáng tin cậy.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    onClick={handleReset}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Làm lại bài kiểm tra này</span>
                  </button>

                  <button
                    onClick={handleBackToQuizzes}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <span>Khám phá các bài test khác</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </>
            );
          })()}

        </div>
      )}

    </section>
  );
};
