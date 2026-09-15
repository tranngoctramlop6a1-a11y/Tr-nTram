import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { Heart, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export const WelcomeModal: React.FC = () => {
  const { isWelcomeModalOpen, enterAsGuest, openLoginModal } = useAuth();

  if (!isWelcomeModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-rose-100/60 overflow-hidden"
        >
          {/* Decorative background blobs */}
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-rose-100 rounded-full blur-2xl pointer-events-none opacity-60" />
          <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-teal-100 rounded-full blur-2xl pointer-events-none opacity-60" />

          {/* Content */}
          <div className="relative text-center">
            {/* Cute Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 mb-4 shadow-inner ring-4 ring-rose-50/50">
              <Heart className="w-8 h-8 fill-rose-400 stroke-rose-500" />
            </div>

            {/* Greeting */}
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight mb-2">
              Bạn ơi, mình nói nè 👋
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
              Một góc nhỏ ấm áp để nói chuyện, viết nhật ký và ở cạnh nhau một chút.
            </p>

            {/* Two Main Choices */}
            <div className="space-y-3 mb-6 text-left">
              {/* Option 1: Google Login (Primary) */}
              <button
                type="button"
                onClick={() => openLoginModal()}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-medium shadow-md shadow-teal-500/20 hover:from-teal-600 hover:to-emerald-600 transition-all group"
              >
                <div className="flex items-center gap-3">
                  {/* Google Icon Symbol */}
                  <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                  <div>
                    <div className="font-semibold text-sm sm:text-base leading-tight">
                      Đăng nhập / Tạo tài khoản
                    </div>
                    <div className="text-xs text-teal-100 mt-0.5">
                      Tiếp tục với Google hoặc Email & Mật khẩu website
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-white/80 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Option 2: Guest Mode (No Account Required) */}
              <button
                type="button"
                onClick={enterAsGuest}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-200/80 text-gray-700 font-medium transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-xs text-base">
                    🌱
                  </div>
                  <div>
                    <div className="font-semibold text-sm sm:text-base text-gray-800 leading-tight">
                      Vào thẳng
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      Không cần tài khoản, trải nghiệm ngay
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Reassurance */}
            <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Bạn vẫn có thể dùng web mà không cần đăng nhập.</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
