import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PlantCanvasSvg } from './PlantCanvasSvg';
import { EncouragementEffect, FriendPlantData, PlantCareMessage } from '../../types';
import { X, Heart, Sparkles, Send, ShieldCheck, Sun, Droplets, Leaf, Flower2, AlertCircle } from 'lucide-react';
import { UserAvatar } from '../common/UserAvatar';

interface FriendPlantCareModalProps {
  friendUserId: string;
  friendNickname: string;
  friendAvatar: string;
  friendIdCode: string;
  isOpen: boolean;
  onClose: () => void;
}

const GIFT_OPTIONS: Array<{
  type: EncouragementEffect;
  label: string;
  icon: string;
  desc: string;
  color: string;
}> = [
  { type: 'flower', label: 'Bông hoa nở', icon: '🌸', desc: 'Gửi niềm vui & sẻ chia', color: 'border-rose-300 bg-rose-50 text-rose-700' },
  { type: 'leaf', label: 'Chiếc lá xanh', icon: '🍃', desc: 'Gửi bình an & nhẹ nhõm', color: 'border-emerald-300 bg-emerald-50 text-emerald-700' },
  { type: 'sun', label: 'Ánh nắng ấm', icon: '☀️', desc: 'Gửi năng lượng tích cực', color: 'border-amber-300 bg-amber-50 text-amber-700' },
  { type: 'dew', label: 'Giọt sương mát', icon: '💧', desc: 'Vỗ về & chăm sóc', color: 'border-sky-300 bg-sky-50 text-sky-700' }
];

export const FriendPlantCareModal: React.FC<FriendPlantCareModalProps> = ({
  friendUserId,
  friendNickname,
  friendAvatar,
  friendIdCode,
  isOpen,
  onClose
}) => {
  const [plantData, setPlantData] = useState<FriendPlantData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [selectedEffect, setSelectedEffect] = useState<EncouragementEffect>('flower');
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);

  // Fetch friend plant data
  useEffect(() => {
    if (!isOpen || !friendUserId) return;

    const fetchPlant = async () => {
      setIsLoading(true);
      setError(null);
      setSendSuccess(null);
      try {
        const token = localStorage.getItem('teen_auth_token');
        const res = await fetch(`/api/plant/friend/${friendUserId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          setError(data.reason || data.error || 'Không thể tải cây của bạn.');
        } else {
          setPlantData({
            ownerNickname: data.plant.owner_nickname,
            ownerAvatar: data.plant.owner_avatar,
            ownerFriendId: data.plant.owner_friend_id,
            stage: data.plant.stage,
            seedCount: data.plant.seed_count,
            messages: (data.plant.messages || []).map((m: any) => ({
              id: m.id,
              plantOwnerUserId: m.plant_owner_user_id,
              senderUserId: m.sender_user_id,
              senderNickname: m.sender_nickname,
              senderAvatar: m.sender_avatar,
              senderFriendId: m.sender_friend_id,
              message: m.message,
              visualEffect: m.visual_effect,
              createdAt: m.created_at,
              readAt: m.read_at
            })),
            permissions: {
              allowFriendsToCare: data.plant.permissions?.allow_friends_to_care ?? true,
              allowEncouragementMessages: data.plant.permissions?.allow_encouragement_messages ?? true
            },
            isAllowed: data.isAllowed ?? true,
            reason: data.reason
          });
        }
      } catch (err: any) {
        setError(err.message || 'Lỗi kết nối máy chủ.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlant();
  }, [isOpen, friendUserId]);

  const handleSendEncouragement = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanMsg = messageText.trim();
    if (!cleanMsg) {
      setSendError('Vui lòng viết vài lời nhắn gửi tới bạn nhé!');
      return;
    }

    setIsSending(true);
    setSendError(null);
    try {
      const token = localStorage.getItem('teen_auth_token');
      const res = await fetch(`/api/plant/friend/${friendUserId}/encourage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          message: cleanMsg,
          visualEffect: selectedEffect
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setSendError(data.error || 'Không thể gửi lời nhắn.');
      } else {
        const newMsg: PlantCareMessage = {
          id: data.message.id,
          plantOwnerUserId: data.message.plant_owner_user_id,
          senderUserId: data.message.sender_user_id,
          senderNickname: data.message.sender_nickname,
          senderAvatar: data.message.sender_avatar,
          senderFriendId: data.message.sender_friend_id,
          message: data.message.message,
          visualEffect: data.message.visual_effect,
          createdAt: data.message.created_at,
          readAt: null
        };

        // Update local plant state immediately with new gift on tree!
        setPlantData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            messages: [newMsg, ...prev.messages]
          };
        });

        setMessageText('');
        const giftName = GIFT_OPTIONS.find((g) => g.type === selectedEffect)?.label || 'món quà';
        setSendSuccess(`Đã gửi lời động viên! Một ${giftName.toLowerCase()} vừa nở trên cây của ${friendNickname} 🌱`);
      }
    } catch (err: any) {
      setSendError(err.message || 'Lỗi kết nối máy chủ.');
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/50 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-emerald-100 my-auto overflow-hidden"
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
          <div className="flex items-center gap-3.5 pb-4 border-b border-gray-100 pr-10">
            <UserAvatar
              avatar={friendAvatar}
              name={friendNickname}
              id={friendIdCode}
              size="lg"
              rounded="rounded-2xl"
              className="border border-emerald-200 shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-800 text-base sm:text-lg">
                  Cây cảm xúc của {friendNickname}
                </h3>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-200/60">
                  {friendIdCode}
                </span>
              </div>
              <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                <span>Bạn đang cùng chăm sóc và nuôi dưỡng cây của bạn bè</span>
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-gray-400">
              <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
              <p className="text-xs">Đang mở khu vườn của {friendNickname}...</p>
            </div>
          ) : error ? (
            <div className="py-12 px-4 text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                <AlertCircle className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-gray-800 text-sm">{error}</h4>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                Không gian cây riêng tư được bảo vệ theo mong muốn của bạn ấy.
              </p>
            </div>
          ) : plantData && (
            <div className="space-y-5 pt-4">
              {/* Plant View Stage */}
              <div className="relative rounded-2xl bg-gradient-to-b from-amber-50/40 via-emerald-50/20 to-teal-50/40 border border-emerald-100/70 p-4 overflow-hidden flex flex-col items-center justify-center">
                {/* Visual Plant Canvas */}
                <PlantCanvasSvg
                  seedCount={plantData.seedCount}
                  stage={plantData.stage}
                  encouragementMessages={plantData.messages}
                />

                {/* Friendly Plant Stat Banner */}
                <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-[11px] text-gray-600">
                  <span className="px-3 py-1 rounded-full bg-white/80 border border-emerald-200/70 shadow-2xs font-medium">
                    🌱 Giai đoạn {plantData.stage} / 5
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/80 border border-emerald-200/70 shadow-2xs">
                    🌾 {plantData.seedCount} hạt giống đã gieo
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/80 border border-rose-200/70 text-rose-700 shadow-2xs font-medium">
                    💌 {plantData.messages.length} lời động viên trên cây
                  </span>
                </div>
              </div>

              {/* Privacy Shield Notice */}
              <div className="p-3 rounded-xl bg-teal-50/70 border border-teal-100 flex items-start gap-2.5 text-xs text-teal-800">
                <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Không gian an toàn:</strong> Bạn bè cùng ngắm tán cây và gửi quà động viên. Nội dung từng tờ giấy vẽ cảm xúc và nhật ký của {friendNickname} luôn được bảo mật 100%.
                </span>
              </div>

              {/* Send Encouragement Section */}
              {plantData.permissions.allowEncouragementMessages ? (
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="text-base">💌</span>
                    <h4 className="font-bold text-gray-800 text-sm">
                      Gửi lời động viên đến {friendNickname}
                    </h4>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">
                    Chọn một món quà tinh thần và viết một lời chúc chân thành bằng chính tay bạn. Lời nhắn sẽ hóa thành một phần của cái cây!
                  </p>

                  {/* Gift selection */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                    {GIFT_OPTIONS.map((opt) => (
                      <button
                        key={opt.type}
                        type="button"
                        onClick={() => setSelectedEffect(opt.type)}
                        className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                          selectedEffect === opt.type
                            ? `${opt.color} ring-2 ring-emerald-400 shadow-xs`
                            : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xl">{opt.icon}</span>
                          {selectedEffect === opt.type && (
                            <span className="text-[10px] font-bold">Đang chọn</span>
                          )}
                        </div>
                        <div className="mt-1">
                          <div className="text-xs font-bold leading-tight">{opt.label}</div>
                          <div className="text-[10px] text-gray-400 leading-tight mt-0.5 truncate">{opt.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Message Input */}
                  <form onSubmit={handleSendEncouragement} className="space-y-2.5">
                    <div className="relative">
                      <textarea
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        maxLength={200}
                        rows={2}
                        placeholder={`Gửi lời nhắn động viên ấm áp đến ${friendNickname}... (ví dụ: Chúc bạn tuần mới nhiều niềm vui nha!)`}
                        className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200/50 outline-none resize-none bg-white transition-all"
                      />
                      <span className="absolute bottom-2 right-2.5 text-[10px] text-gray-400">
                        {messageText.length}/200
                      </span>
                    </div>

                    {sendError && (
                      <div className="p-2 rounded-lg bg-rose-50 border border-rose-100 text-rose-700 text-xs flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{sendError}</span>
                      </div>
                    )}

                    {sendSuccess && (
                      <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{sendSuccess}</span>
                      </div>
                    )}

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isSending || !messageText.trim()}
                        className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{isSending ? 'Đang gửi...' : 'Gửi vào cây của bạn'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-center text-xs text-gray-500">
                  🌱 {friendNickname} hiện đang tạm đóng nhận lời động viên. Cảm ơn bạn đã ghé thăm cây!
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
