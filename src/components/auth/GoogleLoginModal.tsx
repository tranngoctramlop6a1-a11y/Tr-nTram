import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { 
  verifyStoredPassword, 
  hasStoredPassword, 
  normalizeEmail 
} from '../../utils/authStorage';
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

  // Loading & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Clear form state when modal opens or closes, or when account logs out
  useEffect(() => {
    if (isLoginModalOpen) {
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setNickname('');
      setResetCode('');
      setErrorMessage(null);
      setSuccessMessage(null);
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }, [isLoginModalOpen]);

  useEffect(() => {
    const handleAccountChanged = (e: any) => {
      if (e.detail?.action === 'logout') {
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setNickname('');
        setResetCode('');
        setErrorMessage(null);
        setSuccessMessage(null);
      }
    };
    window.addEventListener('teen_account_changed', handleAccountChanged);
    return () => window.removeEventListener('teen_account_changed', handleAccountChanged);
  }, []);

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

  // 1. Strict Gmail / Email + Password Login
  // Requires both email and password, verifies against localStorage & server
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = normalizeEmail(email);

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMessage('Vui lòng nhập địa chỉ Gmail hoặc email hợp lệ.');
      return;
    }

    const trimmedPassword = password.trim();
    if (!trimmedPassword) {
      setErrorMessage('Vui lòng nhập mật khẩu tự chọn của tài khoản.');
      return;
    }

    // 1. Check local storage credentials directly
    const localCheck = verifyStoredPassword(cleanEmail, trimmedPassword);
    if (!localCheck.success) {
      setErrorMessage(localCheck.error || 'Sai mật khẩu. Vui lòng nhập đúng mật khẩu đã lưu.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    // 2. Perform authentication with email and password
    const res = await loginWithGoogle(cleanEmail, trimmedPassword, nickname.trim() || undefined);
    setIsLoading(false);

    if (!res.success) {
      setErrorMessage(res.error || 'Sai mật khẩu. Vui lòng nhập đúng mật khẩu.');
    } else {
      closeLoginModal();
    }
  };

  // 3. Register Website Account
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = normalizeEmail(email);
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMessage('Vui lòng nhập địa chỉ Gmail hoặc email hợp lệ.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Mật khẩu tự chọn phải có ít nhất 6 ký tự.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Mật khẩu xác nhận chưa khớp.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    const res = await registerWithEmailPassword(cleanEmail, password.trim(), nickname.trim());
    setIsLoading(false);

    if (!res.success) {
      setErrorMessage(res.error || 'Không thể tạo tài khoản.');
    } else {
      closeLoginModal();
    }
  };

  // 4. Request Password Reset Code
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = normalizeEmail(email);
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMessage('Vui lòng nhập địa chỉ Gmail hoặc email bạn đã dùng.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    const res = await requestPasswordReset(cleanEmail);
    setIsLoading(false);

    if (res.success) {
      if (res.resetCode) {
        setResetCode(res.resetCode);
      }
      setSuccessMessage(res.message || 'Mã xác thực đã được gửi.');
      setMode('reset');
    } else {
      setErrorMessage(res.error || 'Không thể gửi yêu cầu đặt lại mật khẩu.');
    }
  };

  // 5. Confirm Password Reset (preserves UID & all data)
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = normalizeEmail(email);
    if (!resetCode.trim()) {
      setErrorMessage('Vui lòng nhập mã xác thực 6 chữ số.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Mật khẩu xác nhận chưa khớp.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    const res = await confirmPasswordReset(cleanEmail, resetCode.trim(), password.trim());
    setIsLoading(false);

    if (!res.success) {
      setErrorMessage(res.error || 'Đặt lại mật khẩu thất bại. Vui lòng kiểm tra lại mã xác thực.');
    } else {
      closeLoginModal();
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
              {/* Security Policy Badge */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-amber-950 text-xs flex items-start gap-2.5 shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <span className="font-semibold text-amber-900">Bảo mật bắt buộc: </span>
                  Hệ thống yêu cầu nhập đầy đủ <span className="font-semibold text-amber-900">Gmail</span> và <span className="font-semibold text-amber-900">Mật khẩu tự chọn</span>. Mật khẩu phải khớp với dữ liệu đã lưu trong thiết bị mới được phép đăng nhập.
                </div>
              </div>

              {/* Strict Gmail + Password Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-3.5 pt-1">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Gmail hoặc Email tài khoản <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setErrorMessage(null);
                      }}
                      placeholder="nguyenvanA@gmail.com"
                      className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-teal-400 bg-gray-50/50"
                    />
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  {email && hasStoredPassword(email) && (
                    <p className="text-[11px] text-teal-700 font-medium mt-1 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-teal-600" />
                      Tài khoản này đã có mật khẩu lưu trên máy. Vui lòng nhập đúng mật khẩu.
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-gray-700">
                      Mật khẩu tự chọn <span className="text-rose-500">*</span>
                    </label>
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
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setErrorMessage(null);
                      }}
                      placeholder="Nhập mật khẩu tự chọn của bạn"
                      className="w-full pl-9 pr-10 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-teal-400 bg-gray-50/50"
                    />
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer p-1"
                      tabIndex={-1}
                      title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[10.5px] text-gray-400 mt-1">
                    Mật khẩu này là mật khẩu riêng bảo vệ dữ liệu website, không hiển thị cho bất kỳ ai.
                  </p>
                </div>

                {/* Submit button requiring BOTH Gmail & Password */}
                <button
                  type="submit"
                  disabled={isLoading || !email.trim() || !password.trim()}
                  className="w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-xs shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Đăng nhập bằng Gmail</span>
                    </>
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
                Tạo tài khoản mới 🌱
              </button>

              {/* Divider & Guest Access */}
              <div className="pt-2 border-t border-gray-100 text-center space-y-1.5">
                <button
                  type="button"
                  onClick={enterAsGuest}
                  className="text-xs text-gray-500 hover:text-gray-800 underline transition-colors cursor-pointer"
                >
                  Vào thẳng, không cần tài khoản
                </button>

                <p className="text-[10.5px] text-gray-400 leading-tight">
                  Tất cả nhật ký và cây cảm xúc luôn được mã hóa và bảo mật trên trình duyệt của bạn.
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
                  placeholder="nguyenvanA@gmail.com"
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
                  placeholder="Nhập nickname của bạn"
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
