import React, { useState } from 'react';
import { JournalEntry } from '../../types';
import { 
  getEffectiveUnlockDate, 
  getRemainingDays, 
  formatRemainingTimeText, 
  formatUnlockDateLabel 
} from '../../utils/journalTimeLock';
import { formatVietnameseDateFull } from '../../data/journalData';
import { Lock, KeyRound, Calendar, Clock, Sparkles, X, ShieldAlert } from 'lucide-react';

interface JournalTimeLockModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: JournalEntry | null;
  savedPin?: string | null;
  onUnlockSuccess?: (entry: JournalEntry) => void;
}

export const JournalTimeLockModal: React.FC<JournalTimeLockModalProps> = ({
  isOpen,
  onClose,
  entry,
  savedPin,
  onUnlockSuccess
}) => {
  const [pinInput, setPinInput] = useState('');
  const [showPinInput, setShowPinInput] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);

  if (!isOpen || !entry) return null;

  const unlockDate = getEffectiveUnlockDate(entry);
  const remainingDays = unlockDate ? getRemainingDays(unlockDate) : 0;
  const unlockDateFormatted = unlockDate ? formatUnlockDateLabel(unlockDate) : 'Chưa xác định';
  const remainingText = unlockDate ? formatRemainingTimeText(unlockDate) : '';

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!savedPin) {
      setPinError('Bạn chưa cài đặt mã PIN cho ứng dụng nhật ký.');
      return;
    }

    if (pinInput.trim() === savedPin.trim()) {
      setPinError(null);
      setPinInput('');
      setShowPinInput(false);
      if (onUnlockSuccess) {
        onUnlockSuccess(entry);
      }
      onClose();
    } else {
      setPinError('Mã PIN chưa chính xác. Vui lòng thử lại!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md rounded-3xl bg-[#FAF8F5] border border-amber-200/90 shadow-2xl p-6 sm:p-7 space-y-5 text-stone-900 relative overflow-hidden"
        style={{
          boxShadow: '0 25px 50px -12px rgba(120, 53, 15, 0.25)'
        }}
      >
        {/* Close icon */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Wax Seal / Lock visual */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-amber-100 to-amber-200 text-amber-800 flex items-center justify-center mx-auto shadow-inner border border-amber-300">
            <Lock className="w-8 h-8" />
          </div>
          
          <h3 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
            Nhật ký đang được niêm phong
          </h3>

          <p className="text-xs sm:text-sm text-stone-600">
            Trang viết ngày <span className="font-semibold text-stone-800">{formatVietnameseDateFull(entry.date)}</span>
          </p>
        </div>

        {/* Time-Lock Info Box (Vintage Parchment aesthetic) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white/90 border border-amber-200 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900">
            <Clock className="w-4 h-4 text-amber-700" />
            <span>Thời gian mở khóa dự kiến</span>
          </div>

          <div className="space-y-1">
            <div className="text-base sm:text-lg font-black text-amber-950 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-700 shrink-0" />
              <span>{unlockDateFormatted}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/90 text-amber-900 text-xs font-extrabold">
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>{remainingText}</span>
            </div>
          </div>

          <p className="text-xs text-stone-600 leading-relaxed italic pt-1 border-t border-amber-100">
            “Bài viết này đã được hẹn giờ khóa để gửi gắm cho tương lai. Hãy kiên nhẫn chờ đến ngày hẹn nhé, khi đó đọc lại bạn sẽ thấy trân quý cảm xúc của ngày hôm nay hơn rất nhiều.”
          </p>
        </div>

        {/* Security PIN Override Section */}
        {savedPin && (
          <div className="pt-1">
            {!showPinInput ? (
              <button
                type="button"
                onClick={() => setShowPinInput(true)}
                className="w-full py-2 text-xs font-semibold text-stone-500 hover:text-stone-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Bạn là chủ nhân và cần mở sớm bằng mã PIN?</span>
              </button>
            ) : (
              <form onSubmit={handleVerifyPin} className="p-3.5 rounded-2xl bg-stone-100/80 border border-stone-200 space-y-2.5 animate-in fade-in duration-150">
                <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                  <span className="flex items-center gap-1">
                    <KeyRound className="w-3.5 h-3.5 text-stone-600" />
                    <span>Nhập mã PIN bảo mật để mở bài viết:</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPinInput(false);
                      setPinError(null);
                      setPinInput('');
                    }}
                    className="text-stone-400 hover:text-stone-700 text-xs"
                  >
                    Đóng
                  </button>
                </div>

                <div className="flex gap-2">
                  <input
                    type="password"
                    maxLength={10}
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder="Nhập mã PIN..."
                    autoFocus
                    className="flex-1 px-3 py-2 text-xs bg-white rounded-xl border border-stone-300 focus:outline-hidden focus:border-stone-500 text-stone-800 font-mono text-center tracking-widest"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Mở khóa
                  </button>
                </div>

                {pinError && (
                  <div className="text-[11px] text-rose-600 font-semibold flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" />
                    <span>{pinError}</span>
                  </div>
                )}
              </form>
            )}
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Tôi sẽ kiên nhẫn chờ đến ngày hẹn 🌿</span>
          </button>
        </div>

      </div>
    </div>
  );
};
