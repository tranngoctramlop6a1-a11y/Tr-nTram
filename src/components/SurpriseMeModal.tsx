import React, { useState, useEffect } from 'react';
import { X, Sparkles, Shuffle, ArrowRight, Heart, CheckCircle2, MessageCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  BRAIN_THOUGHTS_POOL, 
  TEEN_MESSAGES_POOL, 
  MINI_GAMES_POOL, 
  MICRO_TASKS_POOL, 
  TEEN_SCENARIOS_QUICK 
} from '../data/teenContentPools';
import { unlockBadge } from '../utils/userExperienceStore';

interface SurpriseMeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToChatbot?: (prompt?: string) => void;
  onGoToJournal?: (note?: string) => void;
}

type SurpriseType = 'would_you_rather' | 'brain_thought' | 'message' | 'task' | 'scenario';

export const SurpriseMeModal: React.FC<SurpriseMeModalProps> = ({
  isOpen,
  onClose,
  onGoToChatbot,
  onGoToJournal
}) => {
  const [surpriseType, setSurpriseType] = useState<SurpriseType>('would_you_rather');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [surpriseData, setSurpriseData] = useState<any>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const rollSurprise = () => {
    setSelectedOption(null);
    const types: SurpriseType[] = ['would_you_rather', 'brain_thought', 'message', 'task', 'scenario'];
    const chosenType = types[Math.floor(Math.random() * types.length)];
    setSurpriseType(chosenType);

    if (chosenType === 'would_you_rather') {
      const item = MINI_GAMES_POOL[Math.floor(Math.random() * MINI_GAMES_POOL.length)];
      setSurpriseData(item);
    } else if (chosenType === 'brain_thought') {
      const item = BRAIN_THOUGHTS_POOL[Math.floor(Math.random() * BRAIN_THOUGHTS_POOL.length)];
      setSurpriseData(item);
      unlockBadge('badge_brain_spark');
    } else if (chosenType === 'message') {
      const item = TEEN_MESSAGES_POOL[Math.floor(Math.random() * TEEN_MESSAGES_POOL.length)];
      setSurpriseData(item);
    } else if (chosenType === 'task') {
      const item = MICRO_TASKS_POOL[Math.floor(Math.random() * MICRO_TASKS_POOL.length)];
      setSurpriseData(item);
    } else {
      const item = TEEN_SCENARIOS_QUICK[Math.floor(Math.random() * TEEN_SCENARIOS_QUICK.length)];
      setSurpriseData(item);
    }

    try {
      confetti({
        particleCount: 25,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {}
  };

  useEffect(() => {
    if (isOpen) {
      rollSurprise();
    }
  }, [isOpen]);

  if (!isOpen || !surpriseData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-rose-100 relative overflow-hidden space-y-5">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-rose-100 text-rose-600 font-bold text-xs flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-rose-500" />
              <span>Bất ngờ dành cho bạn ✨</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={rollSurprise}
              title="Đổi món khác"
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Món khác</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body based on type */}
        <div className="py-2">
          
          {/* 1. Would You Rather */}
          {surpriseType === 'would_you_rather' && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-extrabold uppercase tracking-wide">
                  🎲 Thử thách: Thà... hơn...
                </span>
                <h3 className="text-lg font-black text-slate-900 pt-1">
                  {surpriseData.question}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => setSelectedOption('A')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                    selectedOption === 'A'
                      ? 'bg-rose-50 border-rose-400 ring-2 ring-rose-200'
                      : 'bg-white border-slate-200 hover:border-rose-200 hover:bg-rose-50/40'
                  }`}
                >
                  <span className="text-3xl">{surpriseData.optionA.emoji}</span>
                  <span className="text-sm font-bold text-slate-800">
                    {surpriseData.optionA.text}
                  </span>
                </button>

                <button
                  onClick={() => setSelectedOption('B')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                    selectedOption === 'B'
                      ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-200'
                      : 'bg-white border-slate-200 hover:border-amber-200 hover:bg-amber-50/40'
                  }`}
                >
                  <span className="text-3xl">{surpriseData.optionB.emoji}</span>
                  <span className="text-sm font-bold text-slate-800">
                    {surpriseData.optionB.text}
                  </span>
                </button>
              </div>

              {selectedOption && (
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 animate-in fade-in duration-200">
                  <p className="text-xs font-semibold text-slate-700 italic text-center">
                    💡 {surpriseData.funComment}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 2. Brain Thought */}
          {surpriseType === 'brain_thought' && (
            <div className="space-y-4 text-center">
              <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-[11px] font-extrabold uppercase tracking-wide">
                🧠 Não nghĩ gì?
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                “{surpriseData.question}”
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                {surpriseData.followUp}
              </p>

              {onGoToJournal && (
                <div className="pt-2">
                  <button
                    onClick={() => {
                      onClose();
                      onGoToJournal(`Suy ngẫm hôm nay: ${surpriseData.question}`);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Viết câu trả lời vào Nhật ký 📖
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 3. Personalized Message */}
          {surpriseType === 'message' && (
            <div className="p-5 rounded-3xl bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50 border border-rose-100 space-y-3">
              <span className="px-3 py-1 rounded-full bg-white/90 text-rose-700 text-[11px] font-bold border border-rose-200 inline-block shadow-2xs">
                💌 Một lời nhắn gửi bạn
              </span>
              <h4 className="text-base font-black text-slate-900">
                {surpriseData.title}
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed font-medium">
                “{surpriseData.message}”
              </p>
              <div className="pt-2 flex justify-between items-center text-xs text-slate-500 italic">
                <span>— {surpriseData.author}</span>
                <span className="text-rose-500 font-bold">♥ Cứ là chính mình nhé</span>
              </div>
            </div>
          )}

          {/* 4. Micro Task */}
          {surpriseType === 'task' && (
            <div className="space-y-4 text-center">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-extrabold uppercase tracking-wide">
                🌱 Nhiệm vụ 1–3 phút
              </span>
              <div className="text-4xl">{surpriseData.icon}</div>
              <h3 className="text-lg font-black text-slate-900">
                {surpriseData.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
                {surpriseData.description}
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    setSelectedOption('done');
                    unlockBadge('badge_micro_action');
                  }}
                  className={`px-6 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    selectedOption === 'done'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                  }`}
                >
                  {selectedOption === 'done' ? '✓ Tuyệt vời! Bạn đã làm xong' : '✓ Xong rồi'}
                </button>
              </div>
            </div>
          )}

          {/* 5. Teen Scenario */}
          {surpriseType === 'scenario' && (
            <div className="space-y-3">
              <div className="text-center space-y-1">
                <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-[11px] font-extrabold uppercase tracking-wide">
                  👀 Chuyện này thì sao?
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  {surpriseData.title}
                </h3>
                <p className="text-xs text-slate-600">
                  {surpriseData.situation}
                </p>
              </div>

              <div className="space-y-2 pt-2">
                {surpriseData.options.map((opt: any) => (
                  <button
                    key={opt.label}
                    onClick={() => setSelectedOption(opt.label)}
                    className={`w-full p-3 rounded-2xl border text-left text-xs font-bold transition-all cursor-pointer ${
                      selectedOption === opt.label
                        ? 'bg-teal-50 border-teal-400 text-teal-900 ring-2 ring-teal-200'
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="font-black mr-2 text-teal-600">[{opt.label}]</span>
                    {opt.text}
                  </button>
                ))}
              </div>

              {selectedOption && (
                <div className="p-3.5 rounded-2xl bg-teal-50/70 border border-teal-200 text-xs space-y-1 animate-in fade-in duration-200">
                  {(() => {
                    const opt = surpriseData.options.find((o: any) => o.label === selectedOption);
                    if (!opt) return null;
                    return (
                      <>
                        <p className="font-bold text-teal-900">{opt.reaction}</p>
                        <p className="text-slate-600">{opt.advice}</p>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
          <button
            onClick={rollSurprise}
            className="w-full sm:w-auto text-xs font-bold text-slate-600 hover:text-slate-800 cursor-pointer flex items-center justify-center gap-1.5 py-1.5"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Thử bất ngờ khác</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {onGoToChatbot && (
              <button
                onClick={() => {
                  onClose();
                  onGoToChatbot();
                }}
                className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Tâm sự thêm</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Đóng lại
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
