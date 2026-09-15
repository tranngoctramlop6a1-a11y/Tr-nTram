import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { 
  X, 
  ShieldCheck, 
  Sparkles, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  ArrowRight, 
  KeyRound, 
  User, 
  CheckCircle2 
} from 'lucide-react';

type AuthMode = 'login' | 'register' | 'forgot' | 'reset';

export const GoogleLoginModal: React.FC = () => {
  const { 
    isLoginModalOpen, 
    closeLoginModal, 
    loginWithGoogle, 
    loginWithEmailPassword, 
    registerWithEmailPassword, 
    requestPasswordReset, 
    confirmPasswordReset, 
    enterAsGuest 
  } = useAuth();

  const [mode, setMode] = useState<AuthMode>('login');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [resetCode, setResetCode] = useState('');

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Google quick sign-in toggle
  const [showGoogleCustomInput, setShowGoogleCustomInput] = useState(false);
  const [googleCustomEmail, setGoogleCustomEmail] = useState('');

  // Loading & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isLoginModalOpen) return null;

  const resetFormState = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setPassword('');
    setConfirmPassword('');
  };

  const switchMode = (newMode: AuthMode) => {
    resetFormState();
    setMode(newMode);
  };

  // 1. Google Sign-In
  const handleGoogleSignIn = async (targetEmail: string, suggestedName?: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    const res = await loginWithGoogle(targetEmail, suggestedName);
    setIsLoading(false);
    if (!res.success) {
      setErrorMessage(res.error || 'Đăng nhập Google không thành công.');
    }
  };

  // 2. Email + Website Password Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMessage('Vui lòng nhập địa chỉ email hợp lệ.');
      return;
    }
    if (!password) {
      setErrorMessage('Vui lòng nhập mật khẩu tài khoản website.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    const res = await loginWithEmailPassword(email.trim(), password);
    setIsLoading(false);

    if (!res.success) {
      setErrorMessage(res.error || 'Email hoặc mật khẩu không chính xác.');
    }
  };

  // 3. Register Website Account
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMessage('Vui lòng nhập địa chỉ email hợp lệ.');
      return;
    }
    if (password.length < 8) {
      setErrorMessage('Mật khẩu website phải có ít nhất 8 ký tự.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Mật khẩu chưa khớp.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    const res = await registerWithEmailPassword(email.trim(), password, nickname.trim());
    setIsLoading(false);

    if (!res.success) {
      setErrorMessage(res.error || 'Không thể tạo tài khoản.');
    }
  };

  // 4. Request Password Reset Code
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMessage('Vui lòng nhập địa chỉ email bạn đã dùng để đăng ký.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    const res = await requestPasswordReset(email.trim());
    setIsLoading(false);

    if (res.success) {
      if (res.resetCode) {
        setResetCode(res.resetCode);
      }
      setSuccessMessage(res.message || 'Mã xác thực đã được tạo.');
      setMode('reset');
    } else {
      setErrorMessage(res.error || 'Không thể gửi yêu cầu đặt lại mật khẩu.');
    }
  };

  // 5. Confirm Password Reset (preserves UID & all data)
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetCode.trim()) {
      setErrorMessage('Vui lòng nhập mã xác thực 6 chữ số.');
      return;
    }
    if (password.length < 8) {
      setErrorMessage('Mật khẩu mới phải có ít nhất 8 ký tự.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Mật khẩu chưa khớp.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    const res = await confirmPasswordReset(email.trim(), resetCode.trim(), password);
    setIsLoading(false);

    if (!res.success) {
      setErrorMessage(res.error || 'Đặt lại mật khẩu thất bại. Vui lòng kiểm tra lại mã xác thực.');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-gray-100 overflow-hidden my-6"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={closeLoginModal}
            className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-5 pt-1">
            <div className="inline-flex items-center justify-center w-13 h-13 rounded-2xl bg-teal-50 text-teal-600 border border-teal-100 mb-2.5 shadow-xs">
              {mode === 'login' && <Sparkles className="w-6 h-6" />}
              {mode === 'register' && <User className="w-6 h-6" />}
              {(mode === 'forgot' || mode === 'reset') && <KeyRound className="w-6 h-6" />}
            </div>

            {mode === 'login' && (
              <>
                <h3 className="text-xl font-bold text-gray-800">Chào bạn 👋</h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Đăng nhập để lưu lại những điều bạn đã tạo.
                </p>
              </>
            )}

            {mode === 'register' && (
              <>
                <h3 className="text-xl font-bold text-gray-800">Tạo tài khoản mới 🌱</h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Tạo mật khẩu riêng của website để bảo vệ và sao lưu dữ liệu cá nhân.
                </p>
              </>
            )}

            {mode === 'forgot' && (
              <>
                <h3 className="text-xl font-bold text-gray-800">Quên mật khẩu? 🔑</h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Nhập email để nhận mã đặt lại mật khẩu tài khoản website.
                </p>
              </>
            )}

            {mode === 'reset' && (
              <>
                <h3 className="text-xl font-bold text-gray-800">Đặt lại mật khẩu mới 🔒</h3>
                <p className="text-xs sm:text-sm text-teal-700 mt-1">
                  Dữ liệu của bạn (nhật ký, cây cảm xúc, điểm số...) sẽ được giữ nguyên 100%.
                </p>
              </>
            )}
          </div>

          {/* Feedback messages */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-100 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-2xl bg-teal-50 border border-teal-100 text-teal-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-teal-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* MODE: LOGIN */}
          {mode === 'login' && (
            <div className="space-y-4">
              {/* Option 1: Continue with Google */}
              <div>
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleGoogleSignIn('tranngoctramlop6a1@gmail.com', 'Trâm Ngọc')}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-gray-200 hover:border-teal-400 hover:bg-teal-50/20 transition-all text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-xs">
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-gray-800">🔵 Tiếp tục với Google</div>
                      <div className="text-[11px] text-gray-500 truncate">tranngoctramlop6a1@gmail.com</div>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-teal-600 px-2.5 py-1 rounded-full bg-teal-50 group-hover:bg-teal-100 transition-colors shrink-0">
                    Vào ngay
                  </span>
                </button>

                {!showGoogleCustomInput ? (
                  <button
                    type="button"
                    onClick={() => setShowGoogleCustomInput(true)}
                    className="w-full mt-2 text-[11px] text-gray-500 hover:text-teal-600 hover:underline transition-colors text-center cursor-pointer"
                  >
                    Đăng nhập tài khoản Google khác
                  </button>
                ) : (
                  <div className="mt-2 p-3 rounded-2xl bg-gray-50 border border-gray-200">
                    <label className="block text-[11px] font-medium text-gray-700 mb-1">Email Google:</label>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={googleCustomEmail}
                        onChange={(e) => setGoogleCustomEmail(e.target.value)}
                        placeholder="tenban@gmail.com"
                        className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-white border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-teal-400"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (googleCustomEmail.includes('@')) {
                            handleGoogleSignIn(googleCustomEmail.trim());
                          }
                        }}
                        className="px-3 py-1.5 text-xs rounded-xl bg-teal-500 text-white font-medium hover:bg-teal-600 cursor-pointer"
                      >
                        Vào
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Separator */}
              <div className="relative flex items-center justify-center my-2">
                <div className="border-t border-gray-200 w-full" />
                <span className="bg-white px-3 text-[11px] text-gray-400 uppercase tracking-wider font-medium shrink-0">
                  hoặc
                </span>
              </div>

              {/* Option 2: Email + Dedicated Website Password */}
              <form onSubmit={handleLoginSubmit} className="space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                  <Mail className="w-3.5 h-3.5 text-teal-600" />
                  <span>✉️ Đăng nhập bằng Email & Mật khẩu website</span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Nhập email của bạn"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-teal-400 bg-gray-50/50"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-gray-600">Mật khẩu</label>
                    <button
                      type="button"
                      onClick={() => switchMode('forgot')}
                      className="text-[11px] text-teal-600 hover:text-teal-700 hover:underline cursor-pointer"
                    >
                      Quên mật khẩu?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Nhập mật khẩu"
                      className="w-full px-3.5 py-2.5 pr-10 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-teal-400 bg-gray-50/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                      tabIndex={-1}
                      title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-medium text-xs shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>Đăng nhập</span>
                  )}
                </button>
              </form>

              {/* Separator */}
              <div className="relative flex items-center justify-center my-3">
                <div className="border-t border-gray-200 w-full" />
                <span className="bg-white px-3 text-[11px] text-gray-400 uppercase tracking-wider font-medium shrink-0">
                  hoặc
                </span>
              </div>

              {/* Create Account Button */}
              <button
                type="button"
                onClick={() => switchMode('register')}
                className="w-full py-2.5 rounded-xl border border-teal-200 text-teal-700 bg-teal-50/40 hover:bg-teal-50 text-xs font-semibold transition-colors cursor-pointer"
              >
                Tạo tài khoản
              </button>

              {/* Divider & Guest Access */}
              <div className="pt-2 border-t border-gray-100 text-center space-y-2">
                <button
                  type="button"
                  onClick={enterAsGuest}
                  className="text-xs text-gray-500 hover:text-gray-800 underline transition-colors cursor-pointer"
                >
                  Vào thẳng, không cần tài khoản
                </button>

                <p className="text-[11px] text-gray-400 leading-tight">
                  Mật khẩu này là mật khẩu riêng của website, không liên quan đến mật khẩu Gmail.
                </p>
              </div>
            </div>
          )}

          {/* MODE: REGISTER */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập email của bạn"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-teal-400 bg-gray-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Mật khẩu website <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu (ít nhất 8 ký tự)"
                    className="w-full px-3.5 py-2.5 pr-10 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-teal-400 bg-gray-50/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    tabIndex={-1}
                    title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex items-center gap-1.5 mt-1 text-[11px]">
                  <span className={password.length >= 8 ? 'text-teal-600' : 'text-gray-400'}>
                    • Tối thiểu 8 ký tự ({password.length}/8)
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Nhập lại mật khẩu <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu"
                    className="w-full px-3.5 py-2.5 pr-10 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-teal-400 bg-gray-50/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    tabIndex={-1}
                    title={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-[11px] text-rose-500 mt-1 font-medium">Mật khẩu chưa khớp.</p>
                )}
                {confirmPassword && password === confirmPassword && (
                  <p className="text-[11px] text-teal-600 mt-1 font-medium">✓ Mật khẩu đã khớp</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Nickname / Tên hiển thị (Tùy chọn)
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Ví dụ: Bạn nhỏ, Mây bay..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-teal-400 bg-gray-50/50"
                />
              </div>

              <div className="p-3 rounded-2xl bg-teal-50/60 border border-teal-100 text-[11px] text-teal-800 space-y-1">
                <div className="font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span>Cam kết bảo mật mật khẩu</span>
                </div>
                <p>• Mật khẩu này chỉ dùng để đăng nhập website này, KHÔNG phải mật khẩu Gmail.</p>
                <p>• Được mã hóa an toàn bằng tiêu chuẩn mật mã chuẩn, không lưu dạng văn bản thô.</p>
              </div>

              <button
                type="submit"
                disabled={isLoading || password.length < 8 || password !== confirmPassword}
                className="w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white font-medium text-xs shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Tạo tài khoản</span>
                )}
              </button>

              <div className="text-center pt-2 border-t border-gray-100 space-y-2">
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="text-xs text-teal-600 hover:text-teal-700 font-medium cursor-pointer"
                >
                  Đã có tài khoản? Đăng nhập ngay
                </button>
                <div>
                  <button
                    type="button"
                    onClick={enterAsGuest}
                    className="text-xs text-gray-500 hover:text-gray-800 underline transition-colors cursor-pointer"
                  >
                    Vào thẳng, không cần tài khoản
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* MODE: FORGOT PASSWORD */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Nhập địa chỉ email tài khoản website của bạn:
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tenban@email.com"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-teal-400 bg-gray-50/50"
                  autoFocus
                />
              </div>

              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                💡 Hệ thống sẽ cấp mã xác thực an toàn để bạn đặt mật khẩu mới. Toàn bộ nhật ký, cây và điểm số của bạn sẽ được giữ nguyên hoàn toàn.
              </div>

              <button
                type="submit"
                disabled={isLoading || !email}
                className="w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white font-medium text-xs shadow-xs transition-colors cursor-pointer"
              >
                {isLoading ? 'Đang kiểm tra...' : 'Tiếp tục nhận mã xác thực'}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="text-xs text-gray-600 hover:text-gray-800 underline cursor-pointer"
                >
                  Quay lại Đăng nhập
                </button>
              </div>
            </form>
          )}

          {/* MODE: RESET PASSWORD */}
          {mode === 'reset' && (
            <form onSubmit={handleResetSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Mã xác thực 6 chữ số:
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  placeholder="Nhập mã 6 chữ số"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-teal-400 bg-gray-50/50 tracking-widest font-mono text-center text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Mật khẩu website mới (ít nhất 8 ký tự):
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu mới"
                    className="w-full px-3.5 py-2.5 pr-10 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-teal-400 bg-gray-50/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Nhập lại mật khẩu mới:
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Xác nhận mật khẩu mới"
                    className="w-full px-3.5 py-2.5 pr-10 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-teal-400 bg-gray-50/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-[11px] text-rose-500 mt-1 font-medium">Mật khẩu chưa khớp.</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || password.length < 8 || password !== confirmPassword}
                className="w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white font-medium text-xs shadow-xs transition-colors cursor-pointer"
              >
                {isLoading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu mới'}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="text-xs text-gray-600 hover:text-gray-800 underline cursor-pointer"
                >
                  Quay lại Đăng nhập
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export const AuthLoginModal = GoogleLoginModal;
