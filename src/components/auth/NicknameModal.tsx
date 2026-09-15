import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth, AVATAR_PRESETS } from '../../context/AuthContext';
import { Sparkles, Check, Smile, ShieldCheck } from 'lucide-react';

export const NicknameModal: React.FC = () => {
  const { user, isNicknameModalOpen, closeNicknameModal, updateProfile } = useAuth();
  const [nickname, setNickname] = useState(user?.nickname || 'Trâm');
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || '🌸');
  const [isSaving, setIsSaving] = useState(false);

  if (!isNicknameModalOpen || !user) return null;

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
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 mb-3 shadow-inner ring-4 ring-amber-50/60 text-2xl">
              {selectedAvatar}
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
                placeholder="Ví dụ: Trâm, An Nhiên, Mây..."
                className="w-full px-4 py-3 text-sm rounded-2xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-teal-400 font-medium text-gray-800 bg-gray-50/50"
                required
                autoFocus
              />
            </div>

            {/* Avatar Selector */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2 flex items-center justify-between">
                <span>Chọn biểu tượng đại diện:</span>
                <span className="text-[11px] text-gray-400 font-normal">Chạm để chọn</span>
              </label>
              <div className="grid grid-cols-6 gap-2 p-2 rounded-2xl bg-gray-50 border border-gray-150">
                {AVATAR_PRESETS.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => setSelectedAvatar(av)}
                    className={`h-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                      selectedAvatar === av
                        ? 'bg-white shadow-md ring-2 ring-teal-500 scale-110'
                        : 'hover:bg-gray-200/60'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
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
