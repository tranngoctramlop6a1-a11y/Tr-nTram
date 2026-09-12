import React, { useState } from 'react';
import { TimeCapsule } from '../../types';
import { formatVietnameseDateFull } from '../../data/journalData';
import { Mail, Clock, Lock, Unlock, Sparkles, Send, Trash2, Heart } from 'lucide-react';

interface JournalTimeCapsuleProps {
  capsules: TimeCapsule[];
  onAddCapsule: (capsule: TimeCapsule) => void;
  onOpenCapsule: (id: string) => void;
  onDeleteCapsule: (id: string) => void;
}

export const JournalTimeCapsule: React.FC<JournalTimeCapsuleProps> = ({
  capsules,
  onAddCapsule,
  onOpenCapsule,
  onDeleteCapsule
}) => {
  const [isWriting, setIsWriting] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [unlockPreset, setUnlockPreset] = useState<'tomorrow' | '1month' | '6months' | '1year' | 'custom'>('1year');
  const [customDate, setCustomDate] = useState('');
  const [mood, setMood] = useState('💌');
  const [readingCapsule, setReadingCapsule] = useState<TimeCapsule | null>(null);

  const calculateUnlockDate = () => {
    const d = new Date();
    if (unlockPreset === 'tomorrow') d.setDate(d.getDate() + 1);
    else if (unlockPreset === '1month') d.setMonth(d.getMonth() + 1);
    else if (unlockPreset === '6months') d.setMonth(d.getMonth() + 6);
    else if (unlockPreset === '1year') d.setFullYear(d.getFullYear() + 1);
    else if (unlockPreset === 'custom' && customDate) return customDate;

    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const handleSaveCapsule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const dateStr = calculateUnlockDate();
    const newCapsule: TimeCapsule = {
      id: `capsule-${Date.now()}`,
      createdAt: new Date().toISOString(),
      unlockDate: dateStr,
      title: title.trim() || 'Gửi cho mình của tương lai',
      content: content.trim(),
      mood,
      isOpened: false
    };

    onAddCapsule(newCapsule);
    setTitle('');
    setContent('');
    setIsWriting(false);
  };

  const todayStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };
  const today = todayStr();

  return (
    <div className="space-y-6">
      {/* Intro banner */}
      <div className="bg-gradient-to-r from-amber-100/70 via-rose-100/60 to-purple-100/60 rounded-3xl p-6 sm:p-7 border border-amber-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 text-xs font-bold text-amber-900 border border-amber-200 shadow-2xs">
            <Mail className="w-3.5 h-3.5 text-rose-500" />
            <span>Thư gửi tương lai • Time Capsule</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900">
            “Gửi cho mình của một ngày mai.” 💌
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Viết một lá thư cho phiên bản bạn của 1 tháng, 6 tháng hay 1 năm sau. Thư sẽ được niêm phong cho tới đúng ngày mở!
          </p>
        </div>

        <button
          onClick={() => setIsWriting(!isWriting)}
          className="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{isWriting ? 'Thu gọn' : '+ Viết thư mới'}</span>
        </button>
      </div>

      {/* Writing Form */}
      {isWriting && (
        <form onSubmit={handleSaveCapsule} className="bg-white rounded-3xl p-6 border border-rose-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-rose-50 pb-3">
            <span className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Mail className="w-4 h-4 text-rose-500" />
              <span>Gửi một phong thư đến tương lai</span>
            </span>
            <button
              type="button"
              onClick={() => setIsWriting(false)}
              className="text-xs text-slate-400 hover:text-slate-700"
            >
              Hủy
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">Tiêu đề thư:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ví dụ: Gửi mình của 1 năm sau, ngày nhận bằng tốt nghiệp..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-300"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">Nội dung thư:</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Bạn muốn nhắn nhủ điều gì? Lúc này bạn đang mong ước điều gì? Cứ viết hết ra nhé, chỉ mình bạn của tương lai mới được đọc thôi..."
              rows={5}
              className="w-full p-3.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-300 resize-none leading-relaxed"
              required
            />
          </div>

          {/* Unlock Date Presets */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">Chọn ngày mở thư:</label>
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'tomorrow', label: 'Ngày mai' },
                { id: '1month', label: '1 tháng sau' },
                { id: '6months', label: '6 tháng sau' },
                { id: '1year', label: '1 năm sau (Chuẩn)' },
                { id: 'custom', label: 'Tự chọn ngày' }
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setUnlockPreset(p.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    unlockPreset === p.id
                      ? 'bg-rose-500 text-white border-rose-600 shadow-2xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {p.label}
                </button>
              ))}

              {unlockPreset === 'custom' && (
                <input
                  type="date"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  min={today}
                  className="px-3 py-1.5 rounded-xl text-xs border border-slate-200"
                  required
                />
              )}
            </div>
            <p className="text-[11px] text-slate-500 italic">
              Thư sẽ được niêm phong và mở vào ngày: <strong className="text-rose-600">{formatVietnameseDateFull(calculateUnlockDate())}</strong>
            </p>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 text-white text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Niêm phong và gửi thư 💌</span>
            </button>
          </div>
        </form>
      )}

      {/* Capsules List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {capsules.length === 0 ? (
          <div className="col-span-full p-8 rounded-3xl bg-white border border-dashed border-slate-200 text-center space-y-2">
            <span className="text-3xl">📭</span>
            <p className="text-sm font-bold text-slate-700">Chưa có lá thư nào được niêm phong</p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Hãy viết một vài dòng gửi cho chính bạn của tương lai. Sau này khi mở ra, bạn sẽ thấy mình đã trưởng thành biết bao.
            </p>
          </div>
        ) : (
          capsules.map((cap) => {
            const isReadyToOpen = today >= cap.unlockDate;
            const isUnlocked = cap.isOpened;

            return (
              <div
                key={cap.id}
                className={`rounded-3xl p-5 border transition-all relative overflow-hidden flex flex-col justify-between space-y-4 ${
                  isUnlocked
                    ? 'bg-white border-slate-200 shadow-2xs'
                    : isReadyToOpen
                    ? 'bg-gradient-to-br from-rose-50 via-white to-amber-50 border-rose-300 shadow-md ring-2 ring-rose-300/50'
                    : 'bg-slate-50/70 border-slate-200/80 shadow-xs'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{cap.mood || '💌'}</span>
                    <div>
                      <h4 className="font-bold text-sm sm:text-base text-slate-900 leading-tight">
                        {cap.title}
                      </h4>
                      <span className="text-[11px] text-slate-500">
                        Đã viết lúc {formatVietnameseDateFull(cap.createdAt.split('T')[0])}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {isUnlocked ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                        <Unlock className="w-3 h-3" /> Đã mở
                      </span>
                    ) : isReadyToOpen ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500 text-white text-[11px] font-bold animate-pulse">
                        <Sparkles className="w-3 h-3" /> Có thể mở ngay!
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-200 text-slate-700 text-[11px] font-bold">
                        <Lock className="w-3 h-3" /> Niêm phong
                      </span>
                    )}
                  </div>
                </div>

                {/* Content teaser or full */}
                <div className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-white/70 p-3.5 rounded-2xl border border-slate-100">
                  {isUnlocked ? (
                    <p className="whitespace-pre-wrap">{cap.content}</p>
                  ) : (
                    <div className="space-y-1 text-slate-500">
                      <p className="italic">
                        🔒 Lá thư này đang được khóa kín. Sẽ mở vào ngày:
                      </p>
                      <p className="font-extrabold text-slate-800 text-sm">
                        📅 {formatVietnameseDateFull(cap.unlockDate)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Bottom action */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                  <button
                    onClick={() => onDeleteCapsule(cap.id)}
                    className="text-slate-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                    title="Xóa phong thư"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {!isUnlocked && isReadyToOpen && (
                    <button
                      onClick={() => {
                        onOpenCapsule(cap.id);
                        setReadingCapsule(cap);
                      }}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 text-white font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer transform active:scale-95"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Mở thư ra đọc 💌</span>
                    </button>
                  )}

                  {isUnlocked && (
                    <button
                      onClick={() => setReadingCapsule(cap)}
                      className="text-rose-600 hover:underline font-bold"
                    >
                      Đọc lại thư
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Reading Letter Modal with Animation */}
      {readingCapsule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-[#FFFDF7] rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-amber-200 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-300 relative">
            <div className="text-center space-y-2 border-b border-amber-100 pb-4">
              <span className="text-4xl inline-block animate-bounce">💌</span>
              <h3 className="text-xl font-black text-slate-900">
                {readingCapsule.title}
              </h3>
              <p className="text-xs text-slate-500">
                Lá thư được bạn viết vào ngày <strong>{formatVietnameseDateFull(readingCapsule.createdAt.split('T')[0])}</strong>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/90 border border-amber-100/80 text-sm leading-relaxed text-slate-800 whitespace-pre-wrap max-h-60 overflow-y-auto">
              {readingCapsule.content}
            </div>

            <div className="text-center p-3 rounded-xl bg-amber-50 text-xs text-amber-900 italic font-medium">
              “Một chặng đường đã qua rồi đó. Cảm ơn bạn vì đã luôn cố gắng bước tiếp!” 🌱
            </div>

            <div className="flex justify-center pt-2">
              <button
                onClick={() => setReadingCapsule(null)}
                className="px-6 py-2.5 rounded-2xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Gấp thư lại
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
