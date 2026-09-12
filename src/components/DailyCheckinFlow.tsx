import React, { useState } from 'react';
import { 
  EMOTIONS_LIST, 
  EMOTION_TOPICS, 
  getStep3Config, 
  getPersonalizedAdvice,
  EmotionItem, 
  TopicItem, 
  ReasonItem,
  CheckinResultSummary 
} from '../data/emotionFlowData';
import { 
  ArrowLeft, 
  RotateCcw, 
  MessageCircle, 
  Heart, 
  Sparkles, 
  Check, 
  ChevronRight,
  ShieldCheck,
  BookOpen,
  RefreshCw,
  Moon,
  Zap,
  Smile
} from 'lucide-react';
import { BotMascot } from './BotMascot';
import confetti from 'canvas-confetti';
import { GREETINGS_POOL, TEEN_MESSAGES_POOL, MICRO_TASKS_POOL } from '../data/teenContentPools';
import { unlockBadge } from '../utils/userExperienceStore';

interface DailyCheckinFlowProps {
  onOpenChatWithContext: (context: {
    emotion: string;
    topic: string;
    reason: string;
    summaryText: string;
    mode?: string;
  }) => void;
  onGoToHelp?: () => void;
  onGoToJournal?: (note?: string) => void;
  onOpenSurpriseMe?: () => void;
}

type FlowStep = 1 | 2 | 3 | 4 | 'quiet';

export const DailyCheckinFlow: React.FC<DailyCheckinFlowProps> = ({
  onOpenChatWithContext,
  onGoToHelp,
  onGoToJournal,
  onOpenSurpriseMe
}) => {
  const [currentStep, setCurrentStep] = useState<FlowStep>(1);
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionItem | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<TopicItem | null>(null);
  const [selectedReason, setSelectedReason] = useState<ReasonItem | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  // Dynamic greeting rotation
  const [greetingIndex, setGreetingIndex] = useState(() => Math.floor(Math.random() * GREETINGS_POOL.length));
  const currentGreeting = GREETINGS_POOL[greetingIndex] || GREETINGS_POOL[0];

  const handleShuffleGreeting = () => {
    setGreetingIndex((prev) => (prev + 1) % GREETINGS_POOL.length);
  };

  // Quiet mode random message & task
  const [quietMessage, setQuietMessage] = useState(() => TEEN_MESSAGES_POOL[Math.floor(Math.random() * TEEN_MESSAGES_POOL.length)]);
  const [quietTask, setQuietTask] = useState(() => MICRO_TASKS_POOL[Math.floor(Math.random() * MICRO_TASKS_POOL.length)]);
  const [quietTaskDone, setQuietTaskDone] = useState(false);

  // Helper to get topics for current emotion
  const currentTopics: TopicItem[] = selectedEmotion 
    ? (EMOTION_TOPICS[selectedEmotion.id] || EMOTION_TOPICS['confused'])
    : [];

  // Helper to get step 3 config
  const step3Config = (selectedEmotion && selectedTopic)
    ? getStep3Config(selectedEmotion.id, selectedTopic.id)
    : { question: 'Điều gì đang làm bạn bận tâm nhất?', reasons: [] };

  // Helper to get personalized advice
  const adviceData = (selectedEmotion && selectedTopic && selectedReason)
    ? getPersonalizedAdvice(selectedEmotion, selectedTopic, selectedReason)
    : null;

  // Handlers
  const handleSelectEmotion = (emotion: EmotionItem) => {
    setSelectedEmotion(emotion);
    setSelectedTopic(null);
    setSelectedReason(null);
    setIsFinished(false);

    if (emotion.id === 'happy' || emotion.id === 'fine') {
      try {
        confetti({
          particleCount: 30,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#F43F5E', '#F59E0B', '#10B981']
        });
      } catch {
        // ignore
      }
    }

    setCurrentStep(2);
  };

  const handleSelectTopic = (topic: TopicItem) => {
    setSelectedTopic(topic);
    setSelectedReason(null);
    setCurrentStep(3);
  };

  const handleSelectReason = (reason: ReasonItem) => {
    setSelectedReason(reason);
    setCurrentStep(4);
  };

  const handleBack = () => {
    if (currentStep === 'quiet') {
      setCurrentStep(1);
    } else if (currentStep === 4) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const handleReset = () => {
    setSelectedEmotion(null);
    setSelectedTopic(null);
    setSelectedReason(null);
    setIsFinished(false);
    setCurrentStep(1);
  };

  const handleTellMoreChat = (mode?: string) => {
    if (selectedEmotion && selectedTopic && selectedReason) {
      const summaryText = `Hôm nay mình đang cảm thấy ${selectedEmotion.emoji} ${selectedEmotion.label} vì chuyện ${selectedTopic.icon} ${selectedTopic.label} (${selectedReason.label}).`;
      onOpenChatWithContext({
        emotion: `${selectedEmotion.emoji} ${selectedEmotion.label}`,
        topic: `${selectedTopic.icon} ${selectedTopic.label}`,
        reason: `${selectedReason.icon} ${selectedReason.label}`,
        summaryText,
        mode
      });
    } else {
      onOpenChatWithContext({
        emotion: 'Chưa rõ',
        topic: 'Chưa rõ',
        reason: 'Chưa rõ',
        summaryText: mode === 'listen' 
          ? 'Chào bạn, hôm nay mình mệt quá, chỉ muốn có người nghe thôi...' 
          : 'Chào bạn, mình muốn tâm sự đôi chút...',
        mode
      });
    }
  };

  return (
    <section 
      id="daily-emotion-checkin-flow" 
      className="relative overflow-hidden py-10 sm:py-14 bg-gradient-to-b from-rose-50/50 via-white to-[#FAF9F6] border-b border-rose-100/60"
    >
      {/* Decorative gentle blobs */}
      <div className="absolute -top-10 left-10 w-72 h-72 bg-pink-200/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-20 right-10 w-80 h-80 bg-amber-200/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">

        {/* Progress indicator */}
        <div className="mb-8 max-w-xl mx-auto">
          {typeof currentStep === 'number' ? (
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-500">
              <div className={`flex items-center gap-1.5 transition-colors ${currentStep >= 1 ? 'text-rose-600' : ''}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${currentStep >= 1 ? 'bg-rose-500 text-white shadow-xs' : 'bg-slate-200 text-slate-600'}`}>
                  1
                </span>
                <span>Cảm xúc</span>
              </div>

              <div className={`h-0.5 flex-1 mx-2 transition-colors ${currentStep >= 2 ? 'bg-rose-400' : 'bg-slate-200'}`} />

              <div className={`flex items-center gap-1.5 transition-colors ${currentStep >= 2 ? 'text-rose-600' : ''}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${currentStep >= 2 ? 'bg-rose-500 text-white shadow-xs' : 'bg-slate-200 text-slate-600'}`}>
                  2
                </span>
                <span>Chuyện gì?</span>
              </div>

              <div className={`h-0.5 flex-1 mx-2 transition-colors ${currentStep >= 3 ? 'bg-rose-400' : 'bg-slate-200'}`} />

              <div className={`flex items-center gap-1.5 transition-colors ${currentStep >= 3 ? 'text-rose-600' : ''}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${currentStep >= 3 ? 'bg-rose-500 text-white shadow-xs' : 'bg-slate-200 text-slate-600'}`}>
                  3
                </span>
                <span>Vì sao?</span>
              </div>

              <div className={`h-0.5 flex-1 mx-2 transition-colors ${currentStep >= 4 ? 'bg-rose-400' : 'bg-slate-200'}`} />

              <div className={`flex items-center gap-1.5 transition-colors ${currentStep >= 4 ? 'text-rose-600' : ''}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${currentStep >= 4 ? 'bg-rose-500 text-white shadow-xs' : 'bg-slate-200 text-slate-600'}`}>
                  4
                </span>
                <span>Lời nhắn</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-500">
              <span>🌙 Không gian nghỉ ngơi yên tĩnh</span>
            </div>
          )}
        </div>

        {/* Back button container (Shown on steps 2, 3, 4 or quiet) */}
        {(currentStep === 'quiet' || (typeof currentStep === 'number' && currentStep > 1)) && !isFinished && (
          <div className="mb-4 flex items-center justify-between">
            <button
              id="checkin-back-button"
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200 shadow-2xs transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại</span>
            </button>

            <button
              onClick={handleReset}
              className="text-xs text-slate-600 hover:text-rose-600 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Bắt đầu lại</span>
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* BƯỚC 1 — Hỏi thăm cảm xúc */}
        {/* ========================================================================= */}
        {currentStep === 1 && (
          <div className="text-center space-y-6 animate-in fade-in duration-300">
            
            <div className="space-y-3">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-2">
                <span>“{currentGreeting.text}”</span>
                <button
                  onClick={handleShuffleGreeting}
                  title="Đổi câu hỏi khác"
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </h1>
              <p className="text-sm sm:text-base text-slate-600 font-medium max-w-xl mx-auto leading-relaxed">
                {currentGreeting.subtext || 'Không cần phải ổn mọi lúc đâu. Chọn điều gần với bạn nhất hôm nay nhé.'}
              </p>
            </div>

            {/* 9 Emotion Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 pt-2">
              {EMOTIONS_LIST.map((emotion) => (
                <button
                  key={emotion.id}
                  id={`emotion-card-${emotion.id}`}
                  onClick={() => handleSelectEmotion(emotion)}
                  className={`group relative p-4 sm:p-5 rounded-3xl border-2 transition-all duration-200 flex flex-col items-center justify-center gap-2 cursor-pointer shadow-xs hover:shadow-md transform hover:-translate-y-1 active:scale-95 text-center ${emotion.bgClass} ${emotion.borderClass} ${emotion.hoverClass}`}
                >
                  <span className="text-4xl sm:text-5xl group-hover:scale-115 transition-transform duration-200 select-none">
                    {emotion.emoji}
                  </span>
                  <div>
                    <h3 className={`font-extrabold text-base sm:text-lg text-slate-900 ${emotion.colorClass}`}>
                      {emotion.label}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5 line-clamp-1">
                      {emotion.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Special "Hôm nay không muốn nói" card */}
            <div className="pt-2">
              <button
                id="checkin-btn-quiet-mode"
                onClick={() => setCurrentStep('quiet')}
                className="w-full max-w-md mx-auto p-4 rounded-3xl bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200/80 text-slate-700 flex items-center justify-between gap-3 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3 text-left">
                  <span className="p-2.5 rounded-2xl bg-white text-slate-600 group-hover:scale-110 transition-transform">
                    <Moon className="w-5 h-5" />
                  </span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-800">
                      🌙 Hôm nay mình không muốn nói gì cả...
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Hoàn toàn ổn! Ở đây không ai ép bạn phải giải thích hay chia sẻ.
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="pt-1 flex items-center justify-center gap-2 text-xs text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Không phán xét • 100% Ẩn danh • Lắng nghe nhẹ nhàng</span>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* CHẾ ĐỘ: “HÔM NAY KHÔNG MUỐN NÓI” */}
        {/* ========================================================================= */}
        {currentStep === 'quiet' && (
          <div className="max-w-xl mx-auto space-y-6 text-center animate-in fade-in duration-300">
            <div className="space-y-2">
              <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center mx-auto text-2xl">
                🌙
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                “Oke. Vậy hôm nay không kể cũng được.”
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Ở đây không ai ép bạn phải mở lòng. Nếu bạn mệt, bạn cứ thả lỏng và chọn một trong những điều nhẹ nhàng này nhé:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-left">
              {/* Option 1: Chơi nhẹ */}
              <button
                onClick={() => {
                  if (onOpenSurpriseMe) onOpenSurpriseMe();
                }}
                className="p-4 rounded-3xl bg-white border border-amber-200 hover:border-amber-300 hover:bg-amber-50/50 shadow-xs transition-all cursor-pointer space-y-1.5"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🎲</span>
                  <h4 className="text-xs sm:text-sm font-black text-amber-950">Chơi một cái nhẹ?</h4>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Một câu hỏi vui, chọn A hay B để giải phóng tâm trí một phút.
                </p>
              </button>

              {/* Option 2: Nhận lời nhắn */}
              <div className="p-4 rounded-3xl bg-white border border-rose-200 shadow-xs space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">💌</span>
                  <h4 className="text-xs sm:text-sm font-black text-rose-950">Một lời nhắn cho bạn:</h4>
                </div>
                <p className="text-[11px] text-slate-700 italic font-medium leading-relaxed bg-rose-50/70 p-2 rounded-xl">
                  “{quietMessage.message}”
                </p>
              </div>

              {/* Option 3: Một việc nhỏ */}
              <div className="p-4 rounded-3xl bg-white border border-emerald-200 shadow-xs space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{quietTask.icon}</span>
                  <h4 className="text-xs sm:text-sm font-black text-emerald-950">Việc nhỏ 1 phút:</h4>
                </div>
                <p className="text-[11px] text-slate-600">
                  {quietTask.title}
                </p>
                <button
                  onClick={() => {
                    setQuietTaskDone(true);
                    unlockBadge('badge_micro_action');
                  }}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    quietTaskDone ? 'bg-emerald-500 text-white' : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                  }`}
                >
                  {quietTaskDone ? '✓ Đã xong rồi' : '✓ Xong rồi'}
                </button>
              </div>

              {/* Option 4: Thôi, mai gặp */}
              <button
                onClick={handleReset}
                className="p-4 rounded-3xl bg-white border border-slate-200 hover:bg-slate-50 shadow-xs transition-all cursor-pointer space-y-1.5 flex flex-col justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">👋</span>
                  <h4 className="text-xs sm:text-sm font-black text-slate-800">Thôi, mai gặp nhé!</h4>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Gác lại mọi thứ, chúc bạn có một buổi tối thật êm đềm và ngon giấc 🌱
                </p>
              </button>
            </div>

            <div className="pt-3">
              <button
                onClick={() => setCurrentStep(1)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer underline"
              >
                ← Quay lại bảng chọn cảm xúc
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* BƯỚC 2 — “Có chuyện gì vậy?” */}
        {/* ========================================================================= */}
        {currentStep === 2 && selectedEmotion && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-rose-200 text-xs font-bold text-rose-700 shadow-2xs">
                <span>Bạn đang cảm thấy:</span>
                <span className="text-base">{selectedEmotion.emoji}</span>
                <span>{selectedEmotion.label}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                “Ừm... mình hiểu rồi. Có chuyện gì khiến bạn cảm thấy như vậy?”
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
                Chọn một khía cạnh đang chiếm nhiều suy nghĩ của bạn lúc này nhé.
              </p>
            </div>

            {/* Topics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {currentTopics.map((topic) => (
                <button
                  key={topic.id}
                  id={`topic-card-${topic.id}`}
                  onClick={() => handleSelectTopic(topic)}
                  className="p-4 sm:p-5 rounded-3xl bg-white hover:bg-rose-50/60 border border-slate-200/90 hover:border-rose-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:scale-95 text-center group"
                >
                  <span className="text-3xl sm:text-4xl group-hover:scale-115 transition-transform duration-200 select-none">
                    {topic.icon}
                  </span>
                  <span className="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-rose-600 transition-colors">
                    {topic.label}
                  </span>
                </button>
              ))}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* BƯỚC 3 — Tìm hiểu nguyên nhân */}
        {/* ========================================================================= */}
        {currentStep === 3 && selectedEmotion && selectedTopic && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-rose-200 text-xs font-bold text-rose-700 shadow-2xs">
                <span>{selectedEmotion.emoji} {selectedEmotion.label}</span>
                <span>•</span>
                <span>{selectedTopic.icon} {selectedTopic.label}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-2">
                <span>“Mình thử tìm xem vì sao nhé?”</span>
                <span className="text-2xl sm:text-3xl">🔎</span>
              </h2>
              <p className="text-sm sm:text-base font-semibold text-rose-600 max-w-xl mx-auto">
                {step3Config.question}
              </p>
            </div>

            {/* Reasons List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {step3Config.reasons.map((reason) => (
                <button
                  key={reason.id}
                  id={`reason-btn-${reason.id}`}
                  onClick={() => handleSelectReason(reason)}
                  className="p-4 rounded-2xl bg-white hover:bg-rose-50/70 border border-slate-200 hover:border-rose-300 shadow-xs hover:shadow-md transition-all duration-150 flex items-center justify-between gap-3 text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl select-none group-hover:scale-110 transition-transform">
                      {reason.icon}
                    </span>
                    <span className="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-rose-700 transition-colors">
                      {reason.label}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-rose-500 transition-colors shrink-0" />
                </button>
              ))}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* BƯỚC 4, 5, 6 — Hiển thị kết quả & Lời khuyên nhỏ cá nhân hóa */}
        {/* ========================================================================= */}
        {currentStep === 4 && selectedEmotion && selectedTopic && selectedReason && adviceData && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {!isFinished ? (
              <>
                {/* Result Heading */}
                <div className="text-center space-y-2">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-2">
                    <span>“À... mình hiểu hơn rồi.”</span>
                    <span className="text-2xl sm:text-3xl">🫂</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Cảm ơn bạn vì đã gọi tên được cảm xúc của mình một cách chân thật.
                  </p>
                </div>

                {/* Summary Card (Không chẩn đoán y khoa) */}
                <div className="bg-white rounded-3xl p-5 sm:p-6 border border-rose-100 shadow-sm space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Tóm tắt trạng thái của bạn</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-100 space-y-1">
                      <div className="text-xs text-slate-600 font-semibold">Hôm nay bạn:</div>
                      <div className="text-sm font-extrabold text-rose-700 flex items-center gap-1.5">
                        <span className="text-lg">{selectedEmotion.emoji}</span>
                        <span>{selectedEmotion.label}</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-1">
                      <div className="text-xs text-slate-600 font-semibold">Điều khiến bạn khó chịu:</div>
                      <div className="text-sm font-extrabold text-amber-700 flex items-center gap-1.5">
                        <span className="text-lg">{selectedTopic.icon}</span>
                        <span>{selectedTopic.label}</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-sky-50/60 border border-sky-100 space-y-1">
                      <div className="text-xs text-slate-600 font-semibold">Điều bạn đang lo/nghĩ:</div>
                      <div className="text-sm font-extrabold text-sky-700 flex items-center gap-1.5">
                        <span className="text-lg">{selectedReason.icon}</span>
                        <span>{selectedReason.label}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* BƯỚC 5: Lời khuyên nhỏ cá nhân hóa */}
                <div className="bg-gradient-to-br from-rose-50/80 via-white to-amber-50/60 rounded-3xl p-6 sm:p-8 border border-rose-200/80 shadow-md space-y-4">
                  
                  <div className="flex items-center gap-3">
                    <BotMascot mood="empathy" size="sm" />
                    <div>
                      <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                        🌱 Lời nhắn nhỏ cho bạn
                      </span>
                      <h4 className="text-base sm:text-lg font-black text-slate-900">
                        {adviceData.title}
                      </h4>
                    </div>
                  </div>

                  {/* Empathetic Quote */}
                  <div className="p-3.5 rounded-2xl bg-white/90 border border-rose-100 text-rose-800 text-xs sm:text-sm font-semibold italic">
                    {adviceData.quote}
                  </div>

                  {/* Body paragraphs */}
                  <div className="space-y-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                    {adviceData.content.map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>

                  {adviceData.actionTakeaway && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-semibold">
                      {adviceData.actionTakeaway}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-rose-100/80 space-y-2.5">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5">
                      <button
                        id="checkin-btn-understood"
                        onClick={() => setIsFinished(true)}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer transform active:scale-95"
                      >
                        <Heart className="w-4 h-4 fill-white" />
                        <span>💗 “Mình hiểu rồi”</span>
                      </button>

                      <button
                        id="checkin-btn-tell-more"
                        onClick={() => handleTellMoreChat()}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-bold text-xs shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer transform active:scale-95"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>💬 “Mình muốn kể thêm”</span>
                      </button>
                    </div>

                    {/* Secondary Contextual Options */}
                    <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
                      <button
                        onClick={() => handleTellMoreChat('listen')}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <span>🫂 Chỉ cần người nghe (không lời khuyên)</span>
                      </button>

                      <button
                        onClick={() => handleTellMoreChat('solve')}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <span>🧩 Giúp mình gỡ từng việc</span>
                      </button>
                    </div>
                  </div>

                </div>
              </>
            ) : (
              /* SAU KHI HOÀN THÀNH */
              <div className="bg-white rounded-3xl p-8 sm:p-10 border border-rose-200 text-center space-y-6 shadow-sm animate-in zoom-in-95 duration-200">
                <div className="flex justify-center">
                  <BotMascot mood="cheer" size="lg" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center justify-center gap-2">
                    <span>“Cảm ơn bạn đã dành một chút thời gian cho chính mình hôm nay.”</span>
                    <span>🌷</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    Dù hôm nay thế nào, bạn cũng đã rất cố gắng rồi. Đừng quên rằng không gian này luôn ở đây để lắng nghe bạn bất cứ lúc nào.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  {onGoToJournal && (
                    <button
                      id="finish-btn-save-journal"
                      onClick={() => onGoToJournal(`Hôm nay mình cảm thấy ${selectedEmotion?.label.toLowerCase() || '...'}. Chủ đề: ${selectedTopic?.label || ''}. ${selectedReason ? `Chi tiết: ${selectedReason.label}` : ''}`)}
                      className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <BookOpen className="w-4 h-4 text-amber-600" />
                      <span>📖 Ghi lại vào nhật ký</span>
                    </button>
                  )}

                  <button
                    id="finish-btn-tell-more"
                    onClick={() => handleTellMoreChat()}
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>💬 Mình muốn nói thêm</span>
                  </button>

                  <button
                    id="finish-btn-reset"
                    onClick={handleReset}
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>🔄 Mình muốn làm lại</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </section>
  );
};
