import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Inbox,
  PenTool,
  Heart,
  ShieldCheck,
  Info,
  Calendar,
  Layers,
  HelpCircle,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { EmotionSeedItem, SeedGrowthEffect, PlantCareMessage, PlantPermissions } from '../../types';
import { PlantCanvasSvg } from './PlantCanvasSvg';
import { SeedBoxSvg } from './SeedBoxSvg';
import { CircularCanvasModal } from './CircularCanvasModal';
import { EmotionHistoryModal } from './EmotionHistoryModal';
import { PlantMessagesModal } from './PlantMessagesModal';

const STORAGE_KEY = 'emotion_plant_seeds_v1';

const REASSURANCE_MESSAGES = [
  '🌱 Một cảm xúc nữa đã được gieo xuống.',
  '🍃 Cây của bạn vừa nhận được một điều mới.',
  'Hôm nay cũng được tính.',
  'Cảm xúc nào cũng xứng đáng có một chỗ trú ngụ.',
  'Bạn đã ở đây, và bạn đã dịu dàng với chính mình.',
  'Không có cảm xúc nào là cảm xúc sai.',
  'Cứ gieo xuống, rồi bạn sẽ thấy mình lớn lên cùng cái cây.'
];

// Helper to determine stage from seed count
export function calculatePlantStage(seedCount: number): number {
  if (seedCount <= 2) return 1;
  if (seedCount <= 6) return 2;
  if (seedCount <= 12) return 3;
  if (seedCount <= 20) return 4;
  return 5;
}

export function getStageTitle(stage: number): { emoji: string; title: string; desc: string } {
  switch (stage) {
    case 1:
      return {
        emoji: '🌱',
        title: 'Hạt giống / Mầm nhỏ',
        desc: 'Mầm cây đang lắng nghe những nét vẽ đầu tiên của bạn.'
      };
    case 2:
      return {
        emoji: '🌿',
        title: 'Cây non',
        desc: 'Những chiếc lá non đầu tiên đang vươn lên đón ánh sáng.'
      };
    case 3:
      return {
        emoji: '🌳',
        title: 'Cây lớn hơn',
        desc: 'Tán cây sum suê vững chãi theo từng ngày bạn đi qua.'
      };
    case 4:
      return {
        emoji: '🌳🌸',
        title: 'Cây trưởng thành',
        desc: 'Hoa và trái ngọt bắt đầu nở rộ từ những trải nghiệm chân thật.'
      };
    case 5:
    default:
      return {
        emoji: '🌳✨',
        title: 'Cây đặc biệt / Đầy sức sống',
        desc: 'Cái cây lấp lánh đốm sáng, mang theo trọn vẹn hành trình cảm xúc của bạn.'
      };
  }
}

export const EmotionPlantView: React.FC = () => {
  const { user, token } = useAuth();
  const [seeds, setSeeds] = useState<EmotionSeedItem[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Social Plant Care: Messages from friends & permissions
  const [messages, setMessages] = useState<PlantCareMessage[]>([]);
  const [permissions, setPermissions] = useState<PlantPermissions>({
    allowFriendsToCare: true,
    allowEncouragementMessages: true
  });
  const [isMessagesModalOpen, setIsMessagesModalOpen] = useState<boolean>(false);

  // Modals & animations
  const [isCanvasOpen, setIsCanvasOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isSowingAnim, setIsSowingAnim] = useState<boolean>(false);
  const [isBoxOpen, setIsBoxOpen] = useState<boolean>(false);
  const [reassuranceText, setReassuranceText] = useState<string>('');
  const [showToast, setShowToast] = useState<boolean>(false);
  const [recentEffect, setRecentEffect] = useState<SeedGrowthEffect | null>(null);

  // Load seeds on mount (localStorage first, then sync with server if logged in)
  useEffect(() => {
    try {
      const local = localStorage.getItem(STORAGE_KEY);
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed)) {
          setSeeds(parsed);
        }
      }
    } catch (e) {
      console.warn('Could not read local seeds:', e);
    }
    setIsLoaded(true);
  }, []);

  // Fetch from server if logged in
  useEffect(() => {
    if (!token) return;

    const fetchServerData = async () => {
      try {
        const res = await fetch('/api/emotion-plant/my', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.seeds) && data.seeds.length > 0) {
            setSeeds(data.seeds);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data.seeds));
          } else {
            // If server has no seeds yet, but local does, sync local to server
            const local = localStorage.getItem(STORAGE_KEY);
            if (local) {
              const parsed = JSON.parse(local);
              if (Array.isArray(parsed) && parsed.length > 0) {
                await fetch('/api/emotion-plant/sync', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                  },
                  body: JSON.stringify({ seeds: parsed })
                });
              }
            }
          }

          // Parse friend messages and permissions
          const rawMessages = Array.isArray(data.messages) ? data.messages : (data.plant && Array.isArray(data.plant.messages)) ? data.plant.messages : null;
          if (rawMessages) {
            setMessages(
              rawMessages.map((m: any) => ({
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
              }))
            );
          }

          const rawPermissions = data.permissions || data.plant?.permissions;
          if (rawPermissions) {
            setPermissions({
              allowFriendsToCare: rawPermissions.allow_friends_to_care ?? true,
              allowEncouragementMessages: rawPermissions.allow_encouragement_messages ?? true
            });
          }
        }
      } catch (err) {
        console.warn('Sync plant error:', err);
      }
    };

    fetchServerData();
  }, [token]);

  // Mark message as read
  const handleMarkMessageRead = async (msgId: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, readAt: new Date().toISOString() } : m))
    );
    if (token) {
      try {
        await fetch(`/api/plant/my/messages/${msgId}/read`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        console.warn('Mark message read error:', err);
      }
    }
  };

  // Update privacy permissions
  const handleUpdatePermissions = async (newPerms: Partial<PlantPermissions>) => {
    const updated = { ...permissions, ...newPerms };
    setPermissions(updated);
    if (token) {
      try {
        await fetch('/api/plant/my/permissions', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            allow_friends_to_care: updated.allowFriendsToCare,
            allow_encouragement_messages: updated.allowEncouragementMessages
          })
        });
      } catch (err) {
        console.warn('Update plant permissions error:', err);
      }
    }
  };

  // Persist seeds helper
  const persistSeeds = useCallback(
    async (updatedSeeds: EmotionSeedItem[]) => {
      setSeeds(updatedSeeds);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSeeds));
      } catch (e) {
        console.warn('Failed to save to localStorage:', e);
      }

      if (token) {
        try {
          await fetch('/api/emotion-plant/sync', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ seeds: updatedSeeds })
          });
        } catch (e) {
          console.warn('Failed to sync seeds with server:', e);
        }
      }
    },
    [token]
  );

  // Handle sowing new emotion seed
  const handleSow = (drawingDataUrl: string, effect: SeedGrowthEffect) => {
    const stageAtTime = calculatePlantStage(seeds.length);

    const newSeed: EmotionSeedItem = {
      id: 'seed_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      createdAt: new Date().toISOString(),
      drawingDataUrl,
      growthEffect: effect,
      stageAtSowing: stageAtTime
    };

    const updated = [...seeds, newSeed];

    // Trigger box opening & plant rustle animation
    setIsBoxOpen(true);
    setIsSowingAnim(true);
    setRecentEffect(effect);

    // Pick random warm reassurance message
    const msg = REASSURANCE_MESSAGES[Math.floor(Math.random() * REASSURANCE_MESSAGES.length)];
    setReassuranceText(msg);
    setShowToast(true);

    // Save
    persistSeeds(updated);

    // Close box after 1.2s
    setTimeout(() => {
      setIsBoxOpen(false);
      setIsSowingAnim(false);
    }, 1200);

    // Hide toast after 4s
    setTimeout(() => {
      setShowToast(false);
    }, 4500);
  };

  // Delete a seed from history
  const handleDeleteSeed = (seedId: string) => {
    const updated = seeds.filter((s) => s.id !== seedId);
    persistSeeds(updated);
  };

  const currentStage = calculatePlantStage(seeds.length);
  const stageInfo = getStageTitle(currentStage);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF8F5] via-[#F6F3EE] to-[#FAF8F5] text-slate-800 pb-24 select-none">
      {/* ════════════════ TOP HEADER ════════════════ */}
      <header className="pt-8 sm:pt-12 pb-4 px-4 sm:px-6 max-w-4xl mx-auto text-center space-y-3">
        {/* Safe Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-xs font-bold text-emerald-800 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Không gian gieo hạt riêng tư • Không phán xét • Không điểm số</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
          🌱 Hộp Cây Cảm Xúc
        </h1>

        <div className="space-y-1 max-w-xl mx-auto">
          <p className="text-base sm:text-lg font-bold text-emerald-800">
            Hôm nay bạn cảm thấy thế nào?
          </p>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Không cần gọi tên cảm xúc. Cứ vẽ nó. Bất kỳ nét vẽ nào cũng được đón nhận.
          </p>
        </div>

        {/* Action pills: History button & Messages button */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
          <button
            onClick={() => setIsHistoryOpen(true)}
            className="px-4 py-2 rounded-2xl bg-white hover:bg-amber-50 border border-amber-200/90 text-xs sm:text-sm font-bold text-amber-900 shadow-2xs hover:shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Inbox className="w-4 h-4 text-amber-700" />
            <span>📦 Những điều đã gieo ({seeds.length})</span>
          </button>

          <button
            onClick={() => setIsMessagesModalOpen(true)}
            className="px-4 py-2 rounded-2xl bg-white hover:bg-rose-50 border border-rose-200/90 text-xs sm:text-sm font-bold text-rose-900 shadow-2xs hover:shadow-xs transition-all flex items-center gap-2 cursor-pointer relative"
          >
            <span>💌 Lời nhắn bạn bè ({messages.length})</span>
            {messages.filter((m) => !m.readAt).length > 0 && (
              <span className="inline-flex items-center justify-center px-2 py-0.5 text-[10px] font-black text-white bg-rose-500 rounded-full shadow-xs animate-pulse">
                {messages.filter((m) => !m.readAt).length} mới
              </span>
            )}
          </button>
        </div>
      </header>

      {/* ════════════════ MAIN STAGE: PLANT & BOX ════════════════ */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Toast / Notification after sowing */}
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: -15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.95 }}
              className="max-w-md mx-auto p-3 sm:p-4 rounded-2xl bg-emerald-700 text-white shadow-lg flex items-center gap-3 text-xs sm:text-sm font-semibold"
            >
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-lg shrink-0">
                🌱
              </div>
              <p className="flex-1 leading-snug">{reassuranceText}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stage Card with Potted Plant & Emotion Box */}
        <div className="relative bg-gradient-to-b from-white to-[#FBF9F5] rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-sm overflow-hidden flex flex-col items-center">
          {/* Stage pill at top of card */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full border-b border-amber-100/80 pb-4 mb-2">
            <div className="flex items-center gap-2.5">
              <span className="text-xl sm:text-2xl">{stageInfo.emoji}</span>
              <div>
                <div className="text-xs sm:text-sm font-black text-slate-800">
                  Giai đoạn {currentStage}: {stageInfo.title}
                </div>
                <div className="text-[11px] sm:text-xs text-slate-500 font-medium">
                  {stageInfo.desc}
                </div>
              </div>
            </div>

            {/* Seed count progress pill */}
            <div className="px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 shrink-0">
              {seeds.length === 0
                ? '0 hạt giống • Hãy bắt đầu mầm đầu tiên'
                : `${seeds.length} hạt giống đã gieo`}
            </div>
          </div>

          {/* Plant Canvas Area */}
          <div className="w-full relative flex flex-col items-center justify-center my-2">
            {/* Initial Empty State Banner if 0 seeds */}
            {seeds.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-1 max-w-xs px-3 py-2 rounded-2xl bg-amber-50/80 border border-amber-200/60 text-xs text-amber-900 font-medium leading-relaxed"
              >
                <p>🌱 Cây này chưa có câu chuyện nào cả.</p>
                <p className="text-[11px] text-amber-700/80">Bạn có thể bắt đầu bằng một nét vẽ.</p>
              </motion.div>
            )}

            {/* Plant SVG */}
            <PlantCanvasSvg
              seedCount={seeds.length}
              stage={currentStage}
              isSowingAnim={isSowingAnim}
              recentlyAddedEffect={recentEffect}
              encouragementMessages={messages}
              onPlantClick={() => {
                // Friendly interaction
                setIsSowingAnim(true);
                setTimeout(() => setIsSowingAnim(false), 800);
              }}
            />

            {/* Emotion Seed Box sitting beside or beneath the plant */}
            <div className="mt-4 sm:mt-6">
              <SeedBoxSvg
                isOpen={isBoxOpen}
                seedCount={seeds.length}
                isReceivingSeed={isSowingAnim}
                onClick={() => setIsHistoryOpen(true)}
              />
            </div>
          </div>

          {/* Primary Action Button: "✏️ Vẽ cảm xúc" */}
          <div className="w-full max-w-sm mt-6 flex flex-col items-center gap-2">
            <button
              onClick={() => setIsCanvasOpen(true)}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-base sm:text-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.99]"
            >
              <PenTool className="w-5 h-5" />
              <span>✏️ Vẽ cảm xúc</span>
            </button>
            <p className="text-[11px] sm:text-xs text-center text-slate-500 font-medium">
              Vẽ bất cứ điều gì bạn muốn • Không bắt buộc phải giải thích
            </p>
          </div>
        </div>

        {/* ════════════════ PHILOSOPHY & STORY ════════════════ */}
        <section className="bg-white/80 rounded-3xl p-6 sm:p-7 border border-amber-100 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 text-emerald-800 font-black text-sm sm:text-base">
            <Heart className="w-4 h-4 text-emerald-600 fill-emerald-600" />
            <span>Mọi cảm xúc đều được chấp nhận</span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
            “Mỗi cảm xúc bạn vẽ hôm nay là một hạt giống. Bạn không cần phải biết nó sẽ trở thành gì. Cứ gieo xuống, rồi một ngày nhìn lại — bạn sẽ thấy mình đã lớn lên cùng nó.”
          </p>

          {/* Growth stages progression roadmap */}
          <div className="pt-2 border-t border-slate-100">
            <div className="text-xs font-bold text-slate-700 mb-3 flex items-center justify-between">
              <span>Hành trình phát triển của cây:</span>
              <span className="text-[11px] text-emerald-700 font-semibold">
                Không áp lực • Cây không bao giờ chết
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
              {[
                { s: 1, em: '🌱', name: 'Mầm nhỏ', req: '0–2 hạt' },
                { s: 2, em: '🌿', name: 'Cây non', req: '3–6 hạt' },
                { s: 3, em: '🌳', name: 'Cây lớn', req: '7–12 hạt' },
                { s: 4, em: '🌳🌸', name: 'Trưởng thành', req: '13–20 hạt' },
                { s: 5, em: '🌳✨', name: 'Sức sống', req: '21+ hạt' }
              ].map((item) => {
                const isActive = currentStage === item.s;
                const isPassed = currentStage > item.s;
                return (
                  <div
                    key={item.s}
                    className={`p-3 rounded-2xl border transition-all ${
                      isActive
                        ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-400/40 shadow-xs'
                        : isPassed
                        ? 'bg-amber-50/60 border-amber-200/80 opacity-90'
                        : 'bg-slate-50 border-slate-200/60 opacity-60'
                    }`}
                  >
                    <div className="text-xl mb-1">{item.em}</div>
                    <div className="text-xs font-bold text-slate-800">{item.name}</div>
                    <div className="text-[10px] text-slate-500 font-medium mt-0.5">{item.req}</div>
                    {isActive && (
                      <div className="text-[10px] font-bold text-emerald-700 mt-1">
                        Hiện tại
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Anti-guilt guarantee banner */}
        <section className="bg-gradient-to-r from-amber-50 via-emerald-50 to-amber-50 rounded-2xl p-4 sm:p-5 border border-amber-200/80 flex items-start gap-3.5">
          <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <p className="font-bold text-slate-900">
              Cam kết dịu dàng với cảm xúc của bạn:
            </p>
            <p className="text-slate-600">
              Không có chuỗi ngày bắt buộc (streak), không trách móc khi bạn vắng mặt. Ngay cả khi bạn quay lại sau nhiều ngày hoặc nhiều tuần, cái cây vẫn kiên nhẫn đứng đợi bạn ở đây. Cảm xúc buồn hay mệt mỏi cũng quý giá như niềm vui, và tất cả đều nuôi cái cây lớn lên.
            </p>
          </div>
        </section>
      </main>

      {/* ════════════════ MODALS ════════════════ */}
      <CircularCanvasModal
        isOpen={isCanvasOpen}
        onClose={() => setIsCanvasOpen(false)}
        onSow={handleSow}
      />

      <EmotionHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        seeds={seeds}
        onDeleteSeed={handleDeleteSeed}
      />

      <PlantMessagesModal
        isOpen={isMessagesModalOpen}
        onClose={() => setIsMessagesModalOpen(false)}
        messages={messages}
        permissions={permissions}
        onMarkRead={handleMarkMessageRead}
        onUpdatePermissions={handleUpdatePermissions}
      />
    </div>
  );
};
