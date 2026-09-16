import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  Lightbulb, 
  Calendar, 
  History, 
  Compass, 
  Layers, 
  BookOpen, 
  ArrowRight,
  RefreshCw,
  Check,
  ChevronDown,
  Info,
  Clock,
  HeartHandshake
} from 'lucide-react';
import { 
  SCENARIO_CATEGORIES, 
  ScenarioCategoryMeta, 
  getQuestionsForCategory, 
  getBankStats 
} from '../data/scenarioQuestionBank';
import { DailyScenarioQuestion, ScenarioOption } from '../types';
import { 
  getDailyQuestionForScenario, 
  getTodayDateString, 
  formatDisplayDate, 
  isDailyScenarioCompleted 
} from '../utils/dailyScenarioEngine';
import { 
  getUserProgress, 
  recordScenarioResult, 
  ScenarioHistoryRecord 
} from '../utils/userProgressStore';

interface ScenariosViewProps {
  currentUserId?: string;
}

export const ScenariosView: React.FC<ScenariosViewProps> = ({ currentUserId }) => {
  // Navigation tabs: 'today' | 'history'
  const [activeTab, setActiveTab] = useState<'today' | 'history'>('today');
  
  // Selected category id (default: 'study_pressure')
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('study_pressure');
  
  // Selected option on the current question
  const [selectedOptionId, setSelectedOptionId] = useState<'A' | 'B' | 'C' | 'D' | 'E' | null>(null);

  // Expanded history item for viewing details
  const [expandedHistoryId, setExpandedHistoryId] = useState<string | null>(null);

  // Category filter for history tab
  const [historyCategoryFilter, setHistoryCategoryFilter] = useState<string>('all');

  // Trigger state update when progress changes
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const todayStr = useMemo(() => getTodayDateString(), []);
  const todayFormatted = useMemo(() => formatDisplayDate(todayStr), [todayStr]);

  // Current active category metadata
  const currentCategory = useMemo(() => {
    return (
      SCENARIO_CATEGORIES.find((c) => c.id === selectedCategoryId) ||
      SCENARIO_CATEGORIES[0]
    );
  }, [selectedCategoryId]);

  // Daily question for current category & user (strictly deterministic: reload = same question)
  const currentQuestion: DailyScenarioQuestion | null = useMemo(() => {
    return getDailyQuestionForScenario(selectedCategoryId, currentUserId, todayStr);
  }, [selectedCategoryId, currentUserId, todayStr, refreshTrigger]);

  // Check if answered today
  const completionStatus = useMemo(() => {
    return isDailyScenarioCompleted(selectedCategoryId, currentUserId, todayStr);
  }, [selectedCategoryId, currentUserId, todayStr, refreshTrigger]);

  // Get user history
  const userHistory: ScenarioHistoryRecord[] = useMemo(() => {
    const progress = getUserProgress(currentUserId);
    return progress.scenarioHistory || [];
  }, [currentUserId, refreshTrigger]);

  // Set default selected option to today's answered option if already completed
  useEffect(() => {
    if (completionStatus.completed && completionStatus.answeredOptionId) {
      setSelectedOptionId(completionStatus.answeredOptionId);
    } else {
      setSelectedOptionId(null);
    }
  }, [selectedCategoryId, completionStatus.completed, completionStatus.answeredOptionId]);

  // Listen to progress updates and account changes
  useEffect(() => {
    const handleProgressUpdate = () => {
      setRefreshTrigger((prev) => prev + 1);
    };

    window.addEventListener('teen_progress_updated', handleProgressUpdate);
    window.addEventListener('teen_account_changed', handleProgressUpdate);

    return () => {
      window.removeEventListener('teen_progress_updated', handleProgressUpdate);
      window.removeEventListener('teen_account_changed', handleProgressUpdate);
    };
  }, []);

  const handleSelectOption = (optId: 'A' | 'B' | 'C' | 'D' | 'E') => {
    setSelectedOptionId(optId);

    // If not answered today, automatically record choice smoothly
    if (currentQuestion && !completionStatus.completed) {
      const chosenOpt = currentQuestion.options.find((o) => o.id === optId);
      if (chosenOpt) {
        recordScenarioResult(currentUserId, {
          questionId: currentQuestion.id,
          scenarioId: currentQuestion.scenarioId,
          category: currentQuestion.categoryTitle,
          question: currentQuestion.question,
          chosenOptionId: optId,
          chosenOptionText: chosenOpt.text,
          helpAnalysis: chosenOpt.helpAnalysis || chosenOpt.analysis || '',
          watchOut: chosenOpt.watchOut || chosenOpt.cons || '',
          tryNext: chosenOpt.tryNext || chosenOpt.takeaway || '',
          date: todayStr,
          source: currentQuestion.source || 'question_bank'
        });
        setRefreshTrigger((prev) => prev + 1);
      }
    }
  };

  const selectedOption: ScenarioOption | undefined = currentQuestion?.options.find(
    (opt) => opt.id === selectedOptionId
  );

  // Bank stats for badge
  const bankStats = useMemo(() => getBankStats(), []);

  // Filtered history list
  const filteredHistory = useMemo(() => {
    if (historyCategoryFilter === 'all') {
      return userHistory;
    }
    return userHistory.filter((h) => h.scenarioId === historyCategoryFilter);
  }, [userHistory, historyCategoryFilter]);

  return (
    <section className="py-8 md:py-14 max-w-6xl mx-auto px-4 sm:px-6" id="section-scenarios">
      
      {/* Top Header */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 text-rose-800 text-xs font-semibold border border-rose-200/80 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
          <span>✨ Câu hỏi hôm nay</span>
          <span className="text-rose-400">•</span>
          <span className="flex items-center gap-1 text-slate-700">
            <Calendar className="w-3 h-3 text-rose-500" />
            {todayFormatted}
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          “🧠 Mình nên làm gì?”
        </h2>
        
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Không có đáp án đúng hay sai. Mỗi lựa chọn đều là một góc nhìn giúp bạn hiểu rõ mình hơn.
        </p>

        {/* Navigation Tabs (Hôm nay / Lịch sử) */}
        <div className="pt-2 flex items-center justify-center gap-2">
          <button
            onClick={() => setActiveTab('today')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'today'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Tình huống hôm nay</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'history'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <History className="w-4 h-4" />
            <span>📚 Những câu mình đã làm</span>
            {userHistory.length > 0 && (
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === 'history' ? 'bg-white text-rose-600' : 'bg-rose-100 text-rose-700'
              }`}>
                {userHistory.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {activeTab === 'today' ? (
        <>
          {/* Category Chips Bar (Horizontal Scroll) */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2.5 px-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                <span>14 chủ đề đời sống học đường ({bankStats.total}+ câu hỏi phong phú)</span>
              </span>
              <span className="text-xs text-slate-600 hidden sm:inline">
                Mỗi ngày một câu hỏi mới • Reload không đổi câu
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {SCENARIO_CATEGORIES.map((cat) => {
                const isSelected = selectedCategoryId === cat.id;
                const completedToday = isDailyScenarioCompleted(cat.id, currentUserId, todayStr).completed;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategoryId(cat.id)}
                    className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 border shrink-0 ${
                      isSelected
                        ? 'bg-rose-500 text-white border-rose-500 shadow-sm scale-102'
                        : completedToday
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                        : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <span className="text-sm">{cat.icon}</span>
                    <span>{cat.title}</span>
                    {completedToday && (
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${
                        isSelected ? 'bg-white text-rose-600' : 'bg-emerald-600 text-white'
                      }`}>
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Stage */}
          {currentQuestion ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              
              {/* Left Column: Daily Question & Options */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-xs space-y-5">
                  
                  {/* Question Header Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1.5">
                        <span>{currentCategory.icon}</span>
                        <span>{currentCategory.title}</span>
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600">
                        Mã câu: #{currentQuestion.id}
                      </span>
                    </div>

                    {completionStatus.completed ? (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Đã làm hôm nay</span>
                      </span>
                    ) : (
                      <span className="text-xs text-amber-700 font-semibold flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                        <Clock className="w-3 h-3 text-amber-500" />
                        <span>Chờ bạn suy ngẫm</span>
                      </span>
                    )}
                  </div>

                  {/* Context Backdrop */}
                  {currentQuestion.situationContext && (
                    <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100 text-slate-700 text-sm leading-relaxed flex items-start gap-3">
                      <BookOpen className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                      <div>
                        <span className="font-semibold text-amber-900 block mb-1">Bối cảnh tình huống:</span>
                        <p>{currentQuestion.situationContext}</p>
                      </div>
                    </div>
                  )}

                  {/* Main Question */}
                  <div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
                      {currentQuestion.question}
                    </h3>
                  </div>

                  {/* Prompt */}
                  <div className="pt-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-rose-600 mb-3 flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4" />
                      <span>Bạn sẽ chọn hướng xử lý nào? (Nhấp chọn để xem phản hồi)</span>
                    </p>

                    {/* Options List */}
                    <div className="space-y-3">
                      {currentQuestion.options.map((opt) => {
                        const isChosen = selectedOptionId === opt.id;
                        const isTodaySubmitted = completionStatus.completed && completionStatus.answeredOptionId === opt.id;

                        return (
                          <button
                            key={opt.id}
                            onClick={() => handleSelectOption(opt.id)}
                            className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-150 cursor-pointer flex items-start gap-3.5 transform active:scale-99 ${
                              isChosen
                                ? 'border-rose-500 bg-rose-50/80 shadow-xs ring-2 ring-rose-200'
                                : 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                            }`}
                          >
                            <span
                              className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                                isChosen
                                  ? 'bg-rose-500 text-white shadow-xs'
                                  : 'bg-slate-100 text-slate-600 border border-slate-200'
                              }`}
                            >
                              {opt.id}
                            </span>
                            <div className="flex-1 pr-2">
                              <p className={`text-sm leading-relaxed ${isChosen ? 'font-semibold text-slate-900' : 'text-slate-700'}`}>
                                {opt.text}
                              </p>
                              {isTodaySubmitted && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 mt-1">
                                  <Check className="w-3 h-3" /> Lựa chọn của bạn hôm nay
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Completion Notice & Anti-Pressure Note */}
                  {completionStatus.completed && (
                    <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
                      <div className="flex items-center gap-2 text-emerald-800 text-xs sm:text-sm font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Đã lưu suy ngẫm hôm nay cho chủ đề này.</span>
                      </div>
                      <span className="text-xs text-slate-500 font-medium text-center sm:text-right">
                        Mai quay lại nhé, câu tiếp theo đang chờ cậu 🌱
                      </span>
                    </div>
                  )}

                </div>
              </div>

              {/* Right Column: Feedback & Reflection */}
              <div className="lg:col-span-5 space-y-6">
                {selectedOption ? (
                  <div className="bg-white rounded-3xl p-6 sm:p-7 border border-rose-100 shadow-xs space-y-5 animate-in fade-in duration-200">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Lightbulb className="w-4 h-4 text-amber-500" />
                        <span>Góc nhìn suy ngẫm • Lựa chọn {selectedOption.id}</span>
                      </span>
                    </div>

                    {/* Feedback 1: 💭 Cách bạn chọn có thể giúp bạn… */}
                    <div className="space-y-1.5 p-4 rounded-2xl bg-sky-50/80 border border-sky-100">
                      <div className="flex items-center gap-2 text-sky-900 font-bold text-xs uppercase tracking-wide">
                        <HeartHandshake className="w-3.5 h-3.5 text-sky-600" />
                        <span>💭 Cách bạn chọn có thể giúp bạn…</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pt-1">
                        {selectedOption.helpAnalysis || selectedOption.analysis || 'Giúp bạn có thêm một góc nhìn hữu ích cho hoàn cảnh này.'}
                      </p>
                    </div>

                    {/* Feedback 2: ⚠️ Điều cần để ý… */}
                    <div className="space-y-1.5 p-4 rounded-2xl bg-amber-50/80 border border-amber-100">
                      <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wide">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                        <span>⚠️ Điều cần để ý…</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pt-1">
                        {selectedOption.watchOut || selectedOption.cons || 'Lưu ý lắng nghe sức chịu đựng và cảm xúc của chính bạn.'}
                      </p>
                    </div>

                    {/* Feedback 3: 🌱 Bạn có thể thử… */}
                    <div className="space-y-1.5 p-4 rounded-2xl bg-emerald-50/80 border border-emerald-100">
                      <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wide">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        <span>🌱 Bạn có thể thử…</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pt-1">
                        {selectedOption.tryNext || selectedOption.takeaway || 'Một bước đi nhỏ, nhẹ nhàng nhưng vững chắc cho ngày hôm nay.'}
                      </p>
                    </div>

                    {/* Gentle Philosophy Banner */}
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500 leading-relaxed flex items-center gap-2">
                      <Info className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>Không có lựa chọn nào là tuyệt đối đúng hay sai. Trải nghiệm là để bạn hiểu rõ lòng mình hơn.</span>
                    </div>

                  </div>
                ) : (
                  /* Empty state placeholder when no option is clicked yet */
                  <div className="bg-white rounded-3xl p-8 border border-slate-200/70 text-center space-y-4 shadow-2xs">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center">
                      <Compass className="w-7 h-7" />
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="font-bold text-slate-800 text-base">
                        Chưa chọn hướng đi nào
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
                        Hãy nhấp vào một trong các phương án bên trái để cùng phân tích điều tích cực và điều cần lưu ý nhé.
                      </p>
                    </div>
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-3xl border border-slate-200">
              <p className="text-slate-600">Đang tải câu hỏi hôm nay...</p>
            </div>
          )}
        </>
      ) : (
        /* History Tab View */
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Lọc theo chủ đề:
              </span>
              <select
                value={historyCategoryFilter}
                onChange={(e) => setHistoryCategoryFilter(e.target.value)}
                className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-rose-400 cursor-pointer"
              >
                <option value="all">Tất cả chủ đề ({userHistory.length})</option>
                {SCENARIO_CATEGORIES.map((cat) => {
                  const count = userHistory.filter((h) => h.scenarioId === cat.id).length;
                  return (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.title} ({count})
                    </option>
                  );
                })}
              </select>
            </div>

            <span className="text-xs text-slate-500 font-medium">
              Đã ghi nhận {filteredHistory.length} câu trả lời
            </span>
          </div>

          {/* History List */}
          {filteredHistory.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center">
                <BookOpen className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 text-lg">
                  Chưa có lịch sử câu hỏi nào
                </h4>
                <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                  Hãy quay lại tab “Tình huống hôm nay”, chọn một chủ đề và chia sẻ góc nhìn của bạn nhé.
                </p>
                <button
                  onClick={() => setActiveTab('today')}
                  className="mt-3 px-5 py-2 rounded-xl bg-rose-500 text-white text-xs font-bold hover:bg-rose-600 transition-colors inline-flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Compass className="w-4 h-4" />
                  <span>Làm câu hỏi hôm nay</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredHistory.map((item, index) => {
                const isExpanded = expandedHistoryId === (item.id || String(index));
                const catMeta = SCENARIO_CATEGORIES.find((c) => c.id === item.scenarioId);

                return (
                  <div
                    key={item.id || index}
                    className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden transition-all"
                  >
                    <div
                      onClick={() => setExpandedHistoryId(isExpanded ? null : (item.id || String(index)))}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/70 transition-colors"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            {catMeta?.icon || '💡'} {item.category || catMeta?.title || 'Tình huống'}
                          </span>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                            <Calendar className="w-3 h-3" />
                            {item.date ? formatDisplayDate(item.date) : new Date(item.completedAt).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                        <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                          {item.question || 'Câu hỏi tình huống'}
                        </h4>
                        <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
                          <span className="font-bold">Bạn đã chọn {item.chosenOptionId || item.chosenOption}:</span>
                          <span className="line-clamp-1">{item.chosenOptionText || ''}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <span className="text-xs font-semibold text-rose-600">
                          {isExpanded ? 'Thu gọn' : 'Xem lại lời khuyên'}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </div>

                    {/* Expanded details */}
                    {isExpanded && (
                      <div className="p-4 sm:p-6 bg-slate-50/70 border-t border-slate-100 space-y-4 animate-in fade-in duration-150">
                        {item.chosenOptionText && (
                          <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-800">
                            <span className="font-bold text-rose-600 block mb-1">Phương án bạn đã chọn:</span>
                            <p>{item.chosenOptionText}</p>
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-100 text-xs text-slate-700 space-y-1">
                            <span className="font-bold text-sky-900 block">💭 Cách bạn chọn giúp bạn:</span>
                            <p>{item.helpAnalysis || 'Giúp bạn cân bằng lại cảm xúc.'}</p>
                          </div>

                          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-100 text-xs text-slate-700 space-y-1">
                            <span className="font-bold text-amber-900 block">⚠️ Điều cần để ý:</span>
                            <p>{item.watchOut || 'Lắng nghe giới hạn của bản thân.'}</p>
                          </div>

                          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 text-xs text-slate-700 space-y-1">
                            <span className="font-bold text-emerald-900 block">🌱 Bạn có thể thử:</span>
                            <p>{item.tryNext || 'Thực hiện từng bước nhỏ một.'}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

    </section>
  );
};
