import React, { useState } from 'react';
import { X, Sparkles, Check, Heart, Smile, Meh, Frown, Coffee, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { completeMicroTask, unlockBadge } from '../utils/userExperienceStore';

interface FastCheckinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToChatbot?: () => void;
}

const FAST_MOODS = [
  { id: 'happy', label: 'Vui vẻ', emoji: '😄', message: 'Năng lượng tuyệt vời! Hãy giữ nụ cười này cả ngày nhé! ✨' },
  { id: 'ok', label: 'Bình thường', emoji: '🙂', message: 'Một ngày êm đềm bình thản cũng là một ngày rất đẹp rồi 🌱' },
  { id: 'tired', label: 'Hơi mệt', emoji: '🫠', message: 'Hôm nay bạn vất vả rồi. Tối nay nhớ cho phép bản thân nghỉ ngơi sớm nha 🛋️' },
  { id: 'stressed', label: 'Áp lực', emoji: '😣', message: 'Gác lại âu lo một chút, hít một hơi thật sâu. Mọi chuyện sẽ có cách gỡ mà 🫂' },
  { id: 'sad', label: 'Hơi buồn', emoji: '🌧️', message: 'Buồn một tí cũng chẳng sao, cảm xúc nào của bạn cũng đáng được trân trọng 🌷' }
];

const FAST_TASKS = [
  { text: 'Uống một ngụm nước ấm và vươn vai thư giãn', emoji: '💧' },
  { text: 'Nhắm mắt lại hít sâu 3 nhịp thật chậm', emoji: '🌬️' },
  { text: 'Thả lỏng hai vai và buông hàm xuống', emoji: '🧘' },
  { text: 'Nói thầm: "Hôm nay mình đã làm rất tốt rồi"', emoji: '💖' }
];

export const FastCheckinModal: React.FC<FastCheckinModalProps> = ({ isOpen, onClose, onGoToChatbot }) => {
  const [selectedMood, setSelectedMood] = useState<typeof FAST_MOODS[0] | null>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [randomTask] = useState(() => FAST_TASKS[Math.floor(Math.random() * FAST_TASKS.length)]);
  const [taskDone, setTaskDone] = useState(false);

  if (!isOpen) return null;

  const handleSelectMood = (mood: typeof FAST_MOODS[0]) => {
    setSelectedMood(mood);
    setStep(2);
  };

  const handleCompleteTask = () => {
    setTaskDone(true);
    completeMicroTask('task_30s_fast');
    unlockBadge('badge_micro_action');
    try {
      confetti({
        particleCount: 40,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}
    setTimeout(() => {
      setStep(3);
    }, 600);
  };

  const handleClose = () => {
    setSelectedMood(null);
    setStep(1);
    setTaskDone(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-rose-100 relative overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-amber-100 text-amber-600 font-bold text-xs flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>Chế độ 30 giây</span>
            </span>
            <span className="text-xs text-slate-500 font-medium">Nhanh gọn • Không áp lực</span>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: Chọn Mood */}
        {step === 1 && (
          <div className="py-5 space-y-4">
            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-slate-900">
                Mood của bạn lúc này thế nào?
              </h3>
              <p className="text-xs text-slate-500">
                Chạm 1 giây để chọn, không cần đắn đo suy nghĩ!
              </p>
            </div>

            <div className="grid grid-cols-5 gap-2 pt-2">
              {FAST_MOODS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => handleSelectMood(m)}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-2xl border border-slate-200 hover:border-rose-300 hover:bg-rose-50/50 transition-all cursor-pointer transform active:scale-95 group"
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform">
                    {m.emoji}
                  </span>
                  <span className="text-[11px] font-bold text-slate-700 whitespace-nowrap">
                    {m.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Nhận lời nhắn & việc nhỏ */}
        {step === 2 && selectedMood && (
          <div className="py-4 space-y-4">
            {/* Message card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-50 to-amber-50 border border-rose-100 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{selectedMood.emoji}</span>
                <span className="text-xs font-bold text-rose-800">
                  Một lời nhắn nhanh cho bạn:
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                {selectedMood.message}
              </p>
            </div>

            {/* Micro Task */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-600 block">
                🌱 Một việc nhỏ 30 giây ngay bây giờ:
              </span>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{randomTask.emoji}</span>
                <span className="text-xs sm:text-sm font-bold text-slate-800">
                  {randomTask.text}
                </span>
              </div>

              <button
                onClick={handleCompleteTask}
                disabled={taskDone}
                className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  taskDone
                    ? 'bg-emerald-500 text-white'
                    : 'bg-rose-500 hover:bg-rose-600 text-white shadow-xs active:scale-98'
                }`}
              >
                {taskDone ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Đã làm xong rồi! ✨</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>✓ Xong rồi</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Hoàn thành */}
        {step === 3 && (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl">
              🎉
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900">
                Xong rồi đó, chúc bạn một ngày nhẹ nhõm!
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Chỉ 30 giây thôi nhưng bạn đã dành thời gian để chăm sóc chính mình. Vậy là tuyệt lắm rồi!
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={handleClose}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
              >
                Đóng lại & tiếp tục ngày của bạn 🌱
              </button>
              {onGoToChatbot && (
                <button
                  onClick={() => {
                    handleClose();
                    onGoToChatbot();
                  }}
                  className="w-full py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  Muốn tâm sự thêm với chatbot?
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
