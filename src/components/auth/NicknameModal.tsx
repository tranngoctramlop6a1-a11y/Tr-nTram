import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth, AVATAR_PRESETS } from '../../context/AuthContext';
import { Plus, Check, ShieldCheck, Upload, AlertCircle } from 'lucide-react';
import { isImageAvatar, validateAvatarFile, processAndOptimizeAvatar } from '../../utils/avatarUtils';

export const NicknameModal: React.FC = () => {
  const { user, isNicknameModalOpen, closeNicknameModal, updateProfile } = useAuth();
  const [nickname, setNickname] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || '🌸');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New account modal always starts with empty nickname and fresh state
  useEffect(() => {
    if (isNicknameModalOpen) {
      setNickname('');
      setSelectedAvatar(user?.avatar || '🌸');
      setUploadError(null);
    }
  }, [isNicknameModalOpen, user?.avatar]);

  if (!isNicknameModalOpen || !user) return null;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateAvatarFile(file);
    if (!validation.isValid) {
      setUploadError(validation.error || 'Tệp hình ảnh không hợp lệ.');
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      const base64 = await processAndOptimizeAvatar(file, 320);
      setSelectedAvatar(base64);
    } catch (err: any) {
      setUploadError(err?.message || 'Không thể xử lý tệp ảnh này.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) return;

    setIsSaving(true);
    await updateProfile(nickname.trim(), selectedAvatar);
    setIsSaving(false);
    closeNicknameModal();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-rose-100 overflow-hidden"
        >
          {/* Header Preview */}
          <div className="text-center mb-6">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-50 text-amber-500 mb-3 shadow-inner ring-4 ring-amber-100/70 overflow-hidden relative cursor-pointer hover:ring-teal-400 transition-all group"
              title="Bấm để tải ảnh đại diện từ thiết bị"
            >
              {isImageAvatar(selectedAvatar) ? (
                <img
                  src={selectedAvatar}
                  alt="Ảnh đại diện"
                  className="w-full h-full object-cover rounded-2xl"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="text-3xl select-none">{selectedAvatar}</span>
              )}
              <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-2xl">
                <Upload className="w-5 h-5 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-800">
              Bạn muốn mọi người gọi bạn là gì? ✨
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Bạn có thể chọn một biệt danh dễ thương và đổi lại bất cứ lúc nào.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nickname Input */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Biệt danh của bạn:
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={30}
                placeholder="Nhập nickname của bạn"
                className="w-full px-4 py-3 text-sm rounded-2xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-teal-400 font-medium text-gray-800 bg-gray-50/50"
                required
                autoFocus
              />
            </div>

            {/* Avatar Selector with (+) Upload button */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-gray-700">
                  Chọn biểu tượng đại diện:
                </label>
                <span className="text-[11px] text-gray-400 font-normal">
                  Chọn icon hoặc tải ảnh riêng (+)
                </span>
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
                id="nickname-avatar-file-input"
              />

              <div className="grid grid-cols-6 gap-2 p-2.5 rounded-2xl bg-gray-50 border border-gray-150">
                {/* Plus (+) Button for personal photo upload */}
                <button
                  type="button"
                  id="btn-upload-personal-avatar"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className={`h-11 rounded-xl flex flex-col items-center justify-center border-2 border-dashed transition-all cursor-pointer relative group ${
                    isImageAvatar(selectedAvatar)
                      ? 'border-teal-500 bg-teal-50/80 ring-2 ring-teal-400 text-teal-700 shadow-xs'
                      : 'border-teal-300 hover:border-teal-500 bg-teal-50/50 hover:bg-teal-100/60 text-teal-700'
                  }`}
                  title="Tải ảnh cá nhân lên từ thiết bị (Dấu +)"
                >
                  {isUploading ? (
                    <div className="w-4 h-4 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
                  ) : isImageAvatar(selectedAvatar) ? (
                    <div className="relative w-full h-full p-0.5">
                      <img
                        src={selectedAvatar}
                        alt="Avatar đã tải"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-teal-500 text-white rounded-full flex items-center justify-center text-[9px] font-bold shadow-xs">
                        ✓
                      </span>
                      <div className="absolute inset-0 bg-black/25 rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Plus className="w-3.5 h-3.5 text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-0.5">
                      <Plus className="w-4 h-4 text-teal-600 group-hover:scale-110 transition-transform" />
                      <span className="text-[9px] font-bold text-teal-800 leading-none">Tải ảnh</span>
                    </div>
                  )}
                </button>

                {/* Preset emojis */}
                {AVATAR_PRESETS.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => {
                      setSelectedAvatar(av);
                      setUploadError(null);
                    }}
                    className={`h-11 rounded-xl text-xl flex items-center justify-center transition-all cursor-pointer ${
                      selectedAvatar === av
                        ? 'bg-white shadow-md ring-2 ring-teal-500 scale-105'
                        : 'hover:bg-gray-200/60'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>

              {/* Error Alert */}
              {uploadError && (
                <div className="mt-2 p-2.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2 text-xs text-rose-700">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Status Note */}
              {isImageAvatar(selectedAvatar) && (
                <p className="mt-1.5 text-[11px] text-teal-700 font-medium flex items-center gap-1">
                  <span>✨ Đang dùng ảnh cá nhân tải lên. Bấm ô (+) nếu muốn đổi ảnh khác.</span>
                </p>
              )}
            </div>

            {/* Backup & Security badge */}
            <div className="p-3 rounded-2xl bg-teal-50/70 border border-teal-100 flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
              <div className="text-xs text-teal-800">
                <span className="font-semibold">Đồng bộ an toàn:</span> Nhật ký và tiến trình của bạn sẽ được lưu bảo mật cho riêng tài khoản này.
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSaving || !nickname.trim()}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-semibold text-sm shadow-md shadow-teal-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {isSaving ? 'Đang lưu...' : 'Hoàn tất & Bắt đầu'}
              <Check className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
