import React, { useState } from 'react';
import { Lock, Unlock, ShieldCheck, Key, X, Check, AlertCircle } from 'lucide-react';

interface JournalPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPin: string | null;
  onSetPin: (pin: string | null) => void;
  isUnlocked: boolean;
  onUnlockSuccess: () => void;
}

export const JournalPinModal: React.FC<JournalPinModalProps> = ({
  isOpen,
  onClose,
  currentPin,
  onSetPin,
  isUnlocked,
  onUnlockSuccess
}) => {
  const [pinInput, setPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [isSettingMode, setIsSettingMode] = useState(!currentPin);
  const [errorMsg, setErrorMsg] = useState('');
  const [step, setStep] = useState<'enter' | 'set' | 'confirm'>('enter');

  if (!isOpen) return null;

  const handleKeyPress = (num: string) => {
    setErrorMsg('');
    if (step === 'enter') {
      if (pinInput.length < 4) {
        const next = pinInput + num;
        setPinInput(next);
        if (next.length === 4) {
          if (next === currentPin) {
            onUnlockSuccess();
            onClose();
          } else {
            setErrorMsg('Mã PIN chưa đúng, bạn thử lại nhé!');
            setPinInput('');
          }
        }
      }
    } else if (step === 'set') {
      if (pinInput.length < 4) {
        const next = pinInput + num;
        setPinInput(next);
        if (next.length === 4) {
          setStep('confirm');
        }
      }
    } else if (step === 'confirm') {
      if (confirmPinInput.length < 4) {
        const next = confirmPinInput + num;
        setConfirmPinInput(next);
        if (next.length === 4) {
          if (next === pinInput) {
            onSetPin(next);
            onUnlockSuccess();
            onClose();
          } else {
            setErrorMsg('Mã xác nhận chưa khớp, hãy đặt lại từ đầu nhé.');
            setPinInput('');
            setConfirmPinInput('');
            setStep('set');
          }
        }
      }
    }
  };

  const handleDelete = () => {
    setErrorMsg('');
    if (step === 'confirm') {
      setConfirmPinInput(prev => prev.slice(0, -1));
    } else {
      setPinInput(prev => prev.slice(0, -1));
    }
  };

  const handleRemovePin = () => {
    onSetPin(null);
    onUnlockSuccess();
    onClose();
  };

  const activeInput = step === 'confirm' ? confirmPinInput : pinInput;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full border border-rose-100 shadow-2xl space-y-5 text-center relative animate-in fade-in zoom-in duration-200">
        
        {/* Close if unlocked */}
        {isUnlocked && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Mascot & Icon */}
        <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto text-2xl font-bold shadow-xs">
          <Lock className="w-7 h-7" />
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h3 className="text-lg font-black text-slate-900">
            {currentPin && !isUnlocked
              ? 'Mở khóa Nhật ký riêng tư'
              : step === 'confirm'
              ? 'Xác nhận lại mã PIN'
              : currentPin
              ? 'Quản lý mã PIN riêng tư'
              : 'Đặt mã PIN 4 số'}
          </h3>
          <p className="text-xs text-slate-500">
            {currentPin && !isUnlocked
              ? 'Nhập 4 số PIN của bạn để mở các trang nhật ký'
              : step === 'confirm'
              ? 'Nhập lại 4 số vừa rồi để chắc chắn không bị nhầm'
              : 'Mã PIN bảo vệ nhật ký khi người khác mượn máy của bạn'}
          </p>
        </div>

        {/* Dots visualization */}
        <div className="flex items-center justify-center gap-3 py-2">
          {[0, 1, 2, 3].map((idx) => {
            const filled = activeInput.length > idx;
            return (
              <div
                key={idx}
                className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                  filled ? 'bg-rose-500 scale-125' : 'bg-slate-200'
                }`}
              />
            );
          })}
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="text-xs font-bold text-red-500 flex items-center justify-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-2.5 max-w-[240px] mx-auto pt-1">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleKeyPress(num)}
              className="w-16 h-12 rounded-2xl bg-slate-50 hover:bg-rose-50 hover:text-rose-600 font-bold text-lg text-slate-800 transition-all border border-slate-100 active:scale-90 flex items-center justify-center cursor-pointer"
            >
              {num}
            </button>
          ))}
          
          <button
            type="button"
            onClick={() => {
              setPinInput('');
              setConfirmPinInput('');
              setErrorMsg('');
            }}
            className="w-16 h-12 rounded-2xl bg-slate-50 text-slate-400 hover:text-slate-700 text-xs font-bold transition-all flex items-center justify-center cursor-pointer"
          >
            Xóa hết
          </button>

          <button
            type="button"
            onClick={() => handleKeyPress('0')}
            className="w-16 h-12 rounded-2xl bg-slate-50 hover:bg-rose-50 hover:text-rose-600 font-bold text-lg text-slate-800 transition-all border border-slate-100 active:scale-90 flex items-center justify-center cursor-pointer"
          >
            0
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="w-16 h-12 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-sm transition-all flex items-center justify-center cursor-pointer"
          >
            ⌫
          </button>
        </div>

        {/* Bottom Options */}
        <div className="pt-2 border-t border-slate-100 text-xs space-y-2">
          {isUnlocked && currentPin && (
            <button
              onClick={handleRemovePin}
              className="text-red-500 hover:underline font-semibold block mx-auto cursor-pointer"
            >
              Tắt mã PIN (Không khóa nữa)
            </button>
          )}

          {isUnlocked && !currentPin && (
            <button
              onClick={() => {
                setStep('set');
                setPinInput('');
                setConfirmPinInput('');
              }}
              className="text-rose-600 hover:underline font-bold block mx-auto cursor-pointer"
            >
              Thiết lập mã PIN mới
            </button>
          )}

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Dữ liệu lưu 100% trên thiết bị của bạn</span>
          </div>
        </div>

      </div>
    </div>
  );
};
