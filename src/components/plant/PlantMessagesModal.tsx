import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PlantCareMessage, PlantPermissions } from '../../types';
import { X, Heart, Shield, Check, MessageSquare, Sparkles, Eye, Lock } from 'lucide-react';

interface PlantMessagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: PlantCareMessage[];
  permissions: PlantPermissions;
  onMarkRead: (messageId: string) => void;
  onUpdatePermissions: (newPerms: Partial<PlantPermissions>) => Promise<void>;
}

export const PlantMessagesModal: React.FC<PlantMessagesModalProps> = ({
  isOpen,
  onClose,
  messages,
  permissions,
  onMarkRead,
  onUpdatePermissions
}) => {
  const [activeTab, setActiveTab] = useState<'messages' | 'privacy'>('messages');
  const [isUpdatingPerms, setIsUpdatingPerms] = useState(false);

  if (!isOpen) return null;

  const unreadCount = messages.filter((m) => !m.readAt).length;

  const handleToggleCare = async () => {
    setIsUpdatingPerms(true);
    await onUpdatePermissions({ allowFriendsToCare: !permissions.allowFriendsToCare });
    setIsUpdatingPerms(false);
  };

  const handleToggleEncourage = async () => {
    setIsUpdatingPerms(true);
    await onUpdatePermissions({ allowEncouragementMessages: !permissions.allowEncouragementMessages });
    setIsUpdatingPerms(false);
  };

  const getEffectBadge = (effect: string) => {
    switch (effect) {
      case 'flower':
        return { icon: '🌸', text: 'Bông hoa nở', bg: 'bg-rose-50 text-rose-700 border-rose-200' };
      case 'leaf':
        return { icon: '🍃', text: 'Chiếc lá xanh', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'sun':
        return { icon: '☀️', text: 'Ánh nắng ấm', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'dew':
        return { icon: '💧', text: 'Giọt sương mát', bg: 'bg-sky-50 text-sky-700 border-sky-200' };
      default:
        return { icon: '🍎', text: 'Quả ngọt lành', bg: 'bg-orange-50 text-orange-700 border-orange-200' };
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/50 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-xl bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-gray-100 my-auto overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors z-20"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="pb-3 border-b border-gray-100 pr-10 shrink-0">
            <h3 className="font-bold text-gray-800 text-base sm:text-lg flex items-center gap-2">
              <span>💌 Lời nhắn từ bạn bè</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-xs font-bold">
                  {unreadCount} mới
                </span>
              )}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Những món quà và lời động viên bạn bè đã gửi tặng cho cái cây của bạn.
            </p>

            {/* Tabs */}
            <div className="flex items-center gap-2 mt-3">
              <button
                type="button"
                onClick={() => setActiveTab('messages')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'messages'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200/70'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Hộp thư ({messages.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('privacy')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'privacy'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200/70'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Quyền riêng tư cây</span>
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto py-4 space-y-3">
            {activeTab === 'messages' ? (
              messages.length === 0 ? (
                <div className="py-14 text-center text-gray-400">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl mb-3 shadow-2xs">
                    🌱
                  </div>
                  <h4 className="font-bold text-gray-700 text-sm">Chưa có lời động viên nào</h4>
                  <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
                    Khi bạn bè kết bạn và ghé trông cây giúp bạn, những lời chúc ấm áp sẽ được lưu giữ tại đây.
                  </p>
                </div>
              ) : (
                messages.map((msg) => {
                  const badge = getEffectBadge(msg.visualEffect);
                  const isUnread = !msg.readAt;

                  return (
                    <div
                      key={msg.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        isUnread
                          ? 'bg-emerald-50/30 border-emerald-200 shadow-xs'
                          : 'bg-white border-gray-100'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-xl shadow-2xs shrink-0">
                            {msg.senderAvatar || '🌱'}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-800 text-xs sm:text-sm">
                                {msg.senderNickname}
                              </span>
                              <span className="text-[10px] font-mono text-gray-400">
                                {msg.senderFriendId}
                              </span>
                            </div>
                            <span className="text-[10px] text-gray-400">
                              {new Date(msg.createdAt).toLocaleDateString('vi-VN', {
                                hour: '2-digit',
                                minute: '2-digit',
                                day: 'numeric',
                                month: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>

                        {/* Visual Effect Badge */}
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${badge.bg}`}>
                            <span>{badge.icon}</span>
                            <span>{badge.text}</span>
                          </span>

                          {isUnread && (
                            <button
                              type="button"
                              onClick={() => onMarkRead(msg.id)}
                              className="px-2 py-1 text-[10px] font-semibold rounded-lg bg-teal-100 text-teal-700 hover:bg-teal-200 transition-colors"
                            >
                              Đã đọc
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Handwritten Message Content */}
                      <div className="mt-2.5 p-3 rounded-xl bg-white/80 border border-gray-100 text-xs text-gray-700 italic leading-relaxed">
                        "{msg.message}"
                      </div>
                    </div>
                  );
                })
              )
            ) : (
              /* Privacy Settings */
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex items-start gap-3 text-xs text-emerald-900">
                  <Lock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold">Bảo vệ sự riêng tư của bạn:</strong>
                    <p className="text-emerald-800 mt-1 leading-relaxed">
                      Bạn bè khi "trông cây giúp bạn" chỉ có thể ngắm dáng cây lớn dần và gửi lời chúc tinh thần. Từng nét vẽ cảm xúc và bài viết nhật ký của bạn luôn được giữ kín tuyệt đối.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Toggle 1: Allow friends to care */}
                  <div className="p-4 rounded-2xl bg-white border border-gray-100 flex items-center justify-between gap-4">
                    <div>
                      <div className="font-bold text-gray-800 text-xs sm:text-sm">
                        Cho phép bạn bè trông cây giúp
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Bạn bè có thể nhấn vào nút "Trông cây" để ngắm cái cây của bạn.
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={isUpdatingPerms}
                      onClick={handleToggleCare}
                      className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                        permissions.allowFriendsToCare ? 'bg-emerald-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`block w-5 h-5 rounded-full bg-white shadow-xs transform transition-transform ${
                          permissions.allowFriendsToCare ? 'translate-x-6' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Toggle 2: Allow encouragement messages */}
                  <div className="p-4 rounded-2xl bg-white border border-gray-100 flex items-center justify-between gap-4">
                    <div>
                      <div className="font-bold text-gray-800 text-xs sm:text-sm">
                        Cho phép gửi lời động viên
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Bạn bè có thể viết lời chúc để nở hoa hoặc thêm lá trên cây của bạn.
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={isUpdatingPerms}
                      onClick={handleToggleEncourage}
                      className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                        permissions.allowEncouragementMessages ? 'bg-emerald-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`block w-5 h-5 rounded-full bg-white shadow-xs transform transition-transform ${
                          permissions.allowEncouragementMessages ? 'translate-x-6' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
