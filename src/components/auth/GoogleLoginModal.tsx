import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { X, ShieldCheck, Sparkles, Check, AlertCircle } from 'lucide-react';

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
      setErrorMessage(res.error || 'Đăng nhập không thành công.');
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
          <button
            type="button"
            onClick={closeLoginModal}
            className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-6 pt-1">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white shadow-xs border border-gray-100 mb-3 ring-4 ring-gray-50">
              <Sparkles className="w-7 h-7 text-teal-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Đăng nhập với Google</h3>
            <p className="text-sm text-gray-500 mt-1">
              Đăng nhập để kết bạn và lưu giữ nhật ký riêng tư của bạn.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="space-y-3 mb-5">
            <button
              type="button"
              disabled={!!loadingEmail}
              onClick={() => handleSignIn('tranngoctramlop6a1@gmail.com', 'Trâm')}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-gray-200 hover:border-teal-400 hover:bg-teal-50/30 transition-all text-left group cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-400 to-amber-300 text-white flex items-center justify-center font-bold text-base shrink-0 shadow-xs">
                  T
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-gray-800 truncate">Trâm Ngọc</div>
                  <div className="text-xs text-gray-500 truncate">tranngoctramlop6a1@gmail.com</div>
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

            {!showCustomInput ? (
              <button
                type="button"
                onClick={() => setShowCustomInput(true)}
                className="w-full py-2.5 px-3 rounded-xl text-xs font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 border border-dashed border-gray-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Đăng nhập với tài khoản Google khác</span>
              </button>
            ) : (
              <form onSubmit={handleCustomSubmit} className="space-y-2 p-3 rounded-2xl bg-gray-50 border border-gray-200">
                <label className="block text-xs font-medium text-gray-700">Địa chỉ email Google:</label>
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
                    className="px-3.5 py-2 text-xs font-medium rounded-xl bg-teal-500 hover:bg-teal-600 text-white disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    {loadingEmail === customEmail ? '...' : 'Vào'}
                  </button>
                </div>
              </form>
            )}
          </div>

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

          <div className="text-center">
            <button
              type="button"
              onClick={enterAsGuest}
              className="text-xs text-gray-500 hover:text-gray-800 underline transition-colors cursor-pointer"
            >
              Hoặc tiếp tục với tư cách Khách (Vào thẳng)
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};