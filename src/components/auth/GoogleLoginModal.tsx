import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { X, ShieldCheck, Lock, Sparkles, Check, AlertCircle } from 'lucide-react';

export const GoogleLoginModal: React.FC = () => {
  const { isLoginModalOpen, closeLoginModal, loginWithGoogle, enterAsGuest } = useAuth();
  const [customEmail, setCustomEmail] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isLoginModalOpen) return null;

  const handleSignIn = async (email: string, nickname?: string) => {
    setLoadingEmail(email);
    setErrorMessage(null);
    const res = await loginWithGoogle(email, nickname);
    setLoadingEmail(null);
    if (!res.success) {
      setErrorMessage(res.error || 'Đăng nhập không thành công. Vui lòng thử lại!');
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail || !customEmail.includes('@')) {
      setErrorMessage('Vui lòng nhập địa chỉ email Google hợp lệ.');
      return;
    }
    handleSignIn(customEmail.trim());
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-gray-100 overflow-hidden"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={closeLoginModal}
            className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-6 pt-1">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white shadow-sm border border-gray-100 mb-3 ring-4 ring-gray-50">
              <svg className="w-7 h-7" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800">Đăng nhập với Google</h3>
            <p className="text-sm text-gray-500 mt-1">
              Đăng nhập để kết bạn và lưu giữ nhật ký riêng tư của bạn.
            </p>
          </div>

          {/* Error notice if any */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Account Chooser */}
          <div className="space-y-3 mb-5">
            {/* Verified Default Google Account */}
            <button
              type="button"
              disabled={!!loadingEmail}
              onClick={() => handleSignIn('tranngoctramlop6a1@gmail.com', 'Trâm')}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-gray-200 hover:border-teal-400 hover:bg-teal-50/30 transition-all text-left group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-400 to-amber-300 text-white flex items-center justify-center font-bold text-base shrink-0 shadow-xs">
                  T
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-gray-800 truncate">
                    Trâm Ngọc
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    tranngoctramlop6a1@gmail.com
                  </div>
                </div>
              </div>
              {loadingEmail === 'tranngoctramlop6a1@gmail.com' ? (
                <div className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin shrink-0" />
              ) : (
                <span className="text-xs font-medium text-teal-600 px-2.5 py-1 rounded-full bg-teal-50 group-hover:bg-teal-100 transition-colors shrink-0">
                  Tiếp tục
                </span>
              )}
            </button>

            {/* Custom Google Account option */}
            {!showCustomInput ? (
              <button
                type="button"
                onClick={() => setShowCustomInput(true)}
                className="w-full py-2.5 px-3 rounded-xl text-xs font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 border border-dashed border-gray-300 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Đăng nhập với tài khoản Google khác</span>
              </button>
            ) : (
              <form onSubmit={handleCustomSubmit} className="space-y-2 p-3 rounded-2xl bg-gray-50 border border-gray-200">
                <label className="block text-xs font-medium text-gray-700">
                  Địa chỉ email Google:
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="tenban@gmail.com"
                    className="flex-1 px-3 py-2 text-xs rounded-xl bg-white border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-teal-400"
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={!!loadingEmail || !customEmail}
                    className="px-3.5 py-2 text-xs font-medium rounded-xl bg-teal-500 hover:bg-teal-600 text-white disabled:opacity-50 transition-colors"
                  >
                    {loadingEmail === customEmail ? '...' : 'Vào'}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Privacy Commitments */}
          <div className="p-3.5 rounded-2xl bg-teal-50/60 border border-teal-100/80 mb-5 space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-teal-900 font-medium">
              <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
              <span>Cam kết an toàn & bảo mật cho tuổi teen</span>
            </div>
            <ul className="text-[11px] text-teal-800/80 space-y-1 pl-6 list-disc">
              <li>Không yêu cầu và không lưu mật khẩu Google</li>
              <li>Email và danh tính thật được bảo mật tuyệt đối</li>
              <li>Nhật ký cá nhân hoàn toàn riêng tư, bạn bè không thể xem</li>
            </ul>
          </div>

          {/* Footer actions */}
          <div className="text-center">
            <button
              type="button"
              onClick={enterAsGuest}
              className="text-xs text-gray-500 hover:text-gray-800 underline transition-colors"
            >
              Hoặc tiếp tục với tư cách Khách (Vào thẳng)
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
