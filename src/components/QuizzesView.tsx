import React, { useState, useEffect } from 'react';
import { TEEN_COMPREHENSIVE_QUIZZES, ComprehensiveQuiz } from '../data/quizzesData';
import { QuizResultLevel } from '../types';
import { getUserProgress, recordQuizResult } from '../utils/userProgressStore';
import { formatRealTimeAgo } from '../utils/timeAgo';
import { 
  BrainCircuit, 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw, 
  Sparkles, 
  ShieldAlert, 
  HelpCircle,
  Lightbulb,
  ListOrdered,
  History,
  Calendar,
  Award,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizzesViewProps {
  currentUserId?: string;
}

export const QuizzesView: React.FC<QuizzesViewProps> = ({ currentUserId }) => {
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const [historyTab, setHistoryTab] = useState<boolean>(false);
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

  const activeQuiz: ComprehensiveQuiz | undefined = TEEN_COMPREHENSIVE_QUIZZES.find((q) => q.id === activeQuizId);

  const handleStartQuiz = (quizId: string) => {
    setActiveQuizId(quizId);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setQuizCompleted(false);
    setHistoryTab(false);
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
          particleCount: 50,
          spread: 70,
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

  // Calculate result level
  const calculateResult = (quiz: ComprehensiveQuiz, answers = userAnswers): QuizResultLevel => {
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

  const quizHistory = userProgress.quizHistory || [];

  return (
    <section className="py-10 md:py-16 max-w-5xl mx-auto px-4 sm:px-6" id="section-quizzes">
      
      {/* View Header */}
      {!activeQuizId && (
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
            <BrainCircuit className="w-3.5 h-3.5 text-teal-600" />
            <span>Góc tự suy ngẫm • Thấu hiểu cảm xúc bản thân</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Bộ câu hỏi trắc nghiệm tâm lý học đường
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Mỗi bộ 10 câu hỏi tiêu chuẩn giúp bạn nhận diện những áp lực đang đè nặng và tìm ra cách tháo gỡ an toàn. Dữ liệu làm bài được lưu giữ riêng tư trên tài khoản của bạn.
          </p>

          {/* Tab buttons: Danh sách bài test / Lịch sử của bạn */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              onClick={() => setHistoryTab(false)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                !historyTab
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tất cả bài trắc nghiệm (6 chủ đề)
            </button>
            <button
              onClick={() => setHistoryTab(true)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                historyTab
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Lịch sử của bạn ({quizHistory.length})</span>
            </button>
          </div>

          <p className="text-xs text-slate-600 italic bg-amber-50/80 max-w-xl mx-auto p-2.5 rounded-xl border border-amber-200/60 mt-3">
            ⚠️ Quan trọng: Đây là công cụ tự đánh giá giúp bạn chăm sóc bản thân, không phải chẩn đoán y tế hay bệnh lý tâm thần.
          </p>
        </div>
      )}

      {/* History view */}
      {!activeQuizId && historyTab && (
        <div className="space-y-4 max-w-3xl mx-auto">
          {quizHistory.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 p-8 space-y-3">
              <History className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">Bạn chưa làm bài trắc nghiệm nào.</p>
              <p className="text-xs text-slate-500">
                Hãy chọn một chủ đề bất kỳ để nhận diện và thấu hiểu trạng thái hiện tại của mình nhé.
              </p>
              <button
                onClick={() => setHistoryTab(false)}
                className="mt-2 px-5 py-2.5 rounded-xl bg-rose-500 text-white text-xs font-bold cursor-pointer"
              >
                Xem danh sách bài trắc nghiệm
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {quizHistory.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-5 border border-rose-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
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
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold self-start sm:self-center cursor-pointer transition-colors"
                  >
                    Làm lại bài này
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Grid of Quizzes if none active and not on history tab */}
      {!activeQuizId && !historyTab && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEEN_COMPREHENSIVE_QUIZZES.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white rounded-3xl p-6 border border-rose-100 shadow-xs hover:shadow-md hover:border-rose-300 transition-all duration-200 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-2xl shadow-xs">
                  {quiz.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                  {quiz.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {quiz.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  {quiz.questions.length} câu hỏi • ~3 phút
                </span>
                <button
                  onClick={() => handleStartQuiz(quiz.id)}
                  className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Bắt đầu</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Active Quiz Question Session */}
      {activeQuiz && !quizCompleted && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-rose-100 shadow-md max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
          
          {/* Top Bar with Back button & Progress */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleBackToQuizzes}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
            >
              ← Chọn bài test khác
            </button>
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
              Câu {currentQuestionIndex + 1} / {activeQuiz.questions.length}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-300 rounded-full"
              style={{ width: `${((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100}%` }}
            ></div>
          </div>

          {/* Question text */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <span>{activeQuiz.icon}</span>
              <span>{activeQuiz.title}</span>
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
              {activeQuiz.questions[currentQuestionIndex].question}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-3 pt-2">
            {activeQuiz.questions[currentQuestionIndex].options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectAnswer(activeQuiz.questions[currentQuestionIndex].id, opt.score)}
                className="w-full p-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 hover:bg-rose-50 hover:border-rose-300 text-left transition-all duration-150 cursor-pointer flex items-center justify-between group transform active:scale-98"
              >
                <span className="text-sm font-semibold text-slate-800 group-hover:text-rose-900">
                  {opt.label}
                </span>
                <span className="w-6 h-6 rounded-full border border-slate-300 group-hover:border-rose-500 flex items-center justify-center text-xs text-slate-600 group-hover:text-rose-600 shrink-0 ml-2">
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
                ← Câu trước
              </button>
            ) : <span />}
            <span>Hãy chọn đáp án phản ánh đúng nhất cảm nhận thực tế của bạn.</span>
          </div>

        </div>
      )}

      {/* Quiz Result Display */}
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
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                    Kết quả tự đánh giá của bạn
                  </h3>
                  <div className="inline-block">
                    <span className={`px-4 py-1.5 rounded-full text-sm font-extrabold border shadow-xs ${result.badgeColor}`}>
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
                    <span>Gợi ý hành động cụ thể dành cho bạn:</span>
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

                {/* Important Disclaimer Reminder */}
                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900 space-y-1">
                  <span className="font-bold block flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    <span>Lời nhắc an toàn & thấu cảm:</span>
                  </span>
                  <p className="leading-relaxed">
                    Kết quả đã được lưu tự động vào tài khoản của bạn để tiện theo dõi diễn biến tâm trạng theo thời gian. Nếu bạn cảm thấy cần người lắng nghe, hãy thử trò chuyện với Chatbot hoặc liên hệ Tổng đài Quốc gia Bảo vệ Trẻ em 111.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    onClick={handleReset}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Làm lại bài test này</span>
                  </button>

                  <button
                    onClick={handleBackToQuizzes}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
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
