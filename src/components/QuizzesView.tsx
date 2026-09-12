import React, { useState } from 'react';
import { QUIZZES } from '../data/initialData';
import { Quiz, QuizQuestion, QuizResultLevel } from '../types';
import { 
  BrainCircuit, 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw, 
  Sparkles, 
  ShieldAlert, 
  HelpCircle,
  Lightbulb,
  ListOrdered
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const QuizzesView: React.FC = () => {
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);

  const activeQuiz: Quiz | undefined = QUIZZES.find((q) => q.id === activeQuizId);

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
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 }
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
  const calculateResult = (quiz: Quiz): QuizResultLevel => {
    const scores: number[] = Object.values(userAnswers) as number[];
    const totalScore = scores.reduce((sum: number, val: number) => sum + val, 0);
    const maxScore = quiz.questions.length * 4;
    const minScore = quiz.questions.length * 1;
    const range = maxScore - minScore;
    const normalized = (totalScore - minScore) / range; // 0 to 1

    if (normalized <= 0.25) return quiz.results.low;
    if (normalized <= 0.55) return quiz.results.medium;
    if (normalized <= 0.8) return quiz.results.high;
    return quiz.results.veryHigh;
  };

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
            Thử hiểu bản thân hơn
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Các bài trắc nghiệm ngắn (5 câu) giúp bạn nhận diện những điều đang ảnh hưởng đến mình. Không có câu trả lời nào là xấu hay sai.
          </p>
          <p className="text-xs text-slate-600 italic bg-amber-50/80 max-w-xl mx-auto p-2.5 rounded-xl border border-amber-200/60">
            ⚠️ Quan trọng: Đây là công cụ tự đánh giá giúp bạn chăm sóc bản thân, không phải chẩn đoán y tế hay bệnh lý tâm thần.
          </p>
        </div>
      )}

      {/* Grid of 6 Quizzes if none active */}
      {!activeQuizId && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {QUIZZES.map((quiz) => (
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
                <span className="text-xs text-slate-600 font-medium">
                  {quiz.questions.length} câu hỏi • ~2 phút
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
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
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

          {/* Disclaimer reminder */}
          <div className="pt-4 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-600">
              Hãy chọn phương án tự nhiên nhất với cảm nhận của bạn lúc này.
            </p>
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
                    <span>Gợi ý tích cực dành cho bạn:</span>
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
                    Kết quả này là gợi ý giúp bạn thấu hiểu bản thân hơn, không phải chẩn đoán y tế. Nếu bạn đang cảm thấy quá tải hoặc kiệt sức, đừng ngại chia sẻ với người lớn đáng tin cậy hoặc liên hệ Tổng đài 111.
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
                    <span>Khám phá 5 bài test khác</span>
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
