import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Inbox,
  PenTool,
  Heart,
  ShieldCheck,
  CloudCheck,
  Gift,
  HelpCircle,
  MessageCircle,
  Sun,
  CloudRain,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  EmotionSeedItem,
  SeedGrowthEffect,
  PlantWeatherType,
  PlantEmotionType,
  GardenDecorationItem,
  PlantRewardItem,
  DailyPlantLog,
  FullPlantState
} from '../../types';
import { PlantCanvasSvg } from './PlantCanvasSvg';
import { SeedBoxSvg } from './SeedBoxSvg';
import { CircularCanvasModal } from './CircularCanvasModal';
import { EmotionHistoryModal } from './EmotionHistoryModal';
import { EmotionBar } from './EmotionBar';
import { FertilizerSection } from './FertilizerSection';
import { RewardGiftModal } from './RewardGiftModal';
import { GardenDecorationsModal } from './GardenDecorationsModal';
import { RemoveSeedModal } from './RemoveSeedModal';
import {
  PLANT_EMOTIONS,
  WEATHER_CONFIG,
  getBaseWeatherForDate,
  getRequiredFertilizerForDate,
  getTodayDateString,
  getRandomSowingMessage,
  getDailyPlantGreeting,
  calculatePlantStage,
  getStageDetails,
  pickSmartReward
} from './plantUtils';

const getPlantStorageKey = (userId?: string) =>
  userId ? `teen_plant_${userId}_full_state` : 'teen_plant_guest_full_state';

// Legacy key for migration
const getLegacyPlantStorageKey = (userId?: string) =>
  userId ? `teen_plant_${userId}_seeds` : 'teen_plant_guest_seeds';

export const EmotionPlantView: React.FC = () => {
  const { user, token } = useAuth();
  const todayStr = useMemo(() => getTodayDateString(), []);

  // Core state
  const [seeds, setSeeds] = useState<EmotionSeedItem[]>([]);
  const [currentWeather, setCurrentWeather] = useState<PlantWeatherType>(() =>
    getBaseWeatherForDate(todayStr)
  );
  const [todayEmotion, setTodayEmotion] = useState<PlantEmotionType | undefined>(undefined);
  const [todayFertilizer, setTodayFertilizer] = useState<{
    date: string;
    requiredKg: number;
    currentKg: number;
    isCompleted: boolean;
  }>(() => ({
    date: todayStr,
    requiredKg: getRequiredFertilizerForDate(todayStr),
    currentKg: 0,
    isCompleted: false
  }));
  const [dailyLogs, setDailyLogs] = useState<Record<string, DailyPlantLog>>({});
  const [unlockedDecorations, setUnlockedDecorations] = useState<GardenDecorationItem[]>([]);
  const [activeDecorations, setActiveDecorations] = useState<string[]>([]);
  const [rewards, setRewards] = useState<PlantRewardItem[]>([]);
  const [rewardHistory, setRewardHistory] = useState<string[]>([]);
  const [hasPendingGift, setHasPendingGift] = useState<boolean>(false);
  const [lastVisitedDate, setLastVisitedDate] = useState<string>(todayStr);

  // Plant Speech Bubble
  const [plantSpeech, setPlantSpeech] = useState<string>('Chào buổi sáng 🌱 Chúc cậu ngày mới an lành!');

  // Modals & animations
  const [isCanvasOpen, setIsCanvasOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isDecorationsOpen, setIsDecorationsOpen] = useState<boolean>(false);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState<boolean>(false);
  const [activeGift, setActiveGift] = useState<PlantRewardItem | null>(null);
  const [isSowingAnim, setIsSowingAnim] = useState<boolean>(false);
  const [isBoxOpen, setIsBoxOpen] = useState<boolean>(false);
  const [recentEffect, setRecentEffect] = useState<SeedGrowthEffect | null>(null);
  const [isRemoveSeedModalOpen, setIsRemoveSeedModalOpen] = useState<boolean>(false);

  // Check if today has a sown paper seed
  const hasTodayPaperSeed = useMemo(() => {
    return seeds.some((s) => {
      try {
        const d = new Date(s.createdAt).toISOString().split('T')[0];
        return d === todayStr;
      } catch {
        return false;
      }
    });
  }, [seeds, todayStr]);

  // Load state helper
  const loadState = useCallback(() => {
    // STRICT GUEST ISOLATION: In guest mode, NEVER read from localStorage
    if (!user || !user.id || user.id === 'guest') {
      setSeeds([]);
      setCurrentWeather(getBaseWeatherForDate(todayStr));
      setTodayEmotion(undefined);
      setTodayFertilizer({
        date: todayStr,
        requiredKg: getRequiredFertilizerForDate(todayStr),
        currentKg: 0,
        isCompleted: false
      });
      setDailyLogs({});
      setUnlockedDecorations([]);
      setActiveDecorations([]);
      setRewards([]);
      setRewardHistory([]);
      setHasPendingGift(false);
      setLastVisitedDate(null);
      setPlantSpeech(getDailyPlantGreeting(true));
      return;
    }

    try {
      const storageKey = getPlantStorageKey(user.id);
      const local = localStorage.getItem(storageKey);

      if (local) {
        const parsed: FullPlantState = JSON.parse(local);
        if (parsed && typeof parsed === 'object') {
          if (Array.isArray(parsed.seeds)) setSeeds(parsed.seeds);
          if (parsed.currentWeather) setCurrentWeather(parsed.currentWeather);
          if (parsed.todayEmotion) setTodayEmotion(parsed.todayEmotion);
          if (parsed.todayFertilizer && parsed.todayFertilizer.date === todayStr) {
            setTodayFertilizer(parsed.todayFertilizer);
          } else {
            // New day fertilizer target
            setTodayFertilizer({
              date: todayStr,
              requiredKg: getRequiredFertilizerForDate(todayStr),
              currentKg: 0,
              isCompleted: false
            });
          }
          if (parsed.dailyLogs) setDailyLogs(parsed.dailyLogs);
          if (Array.isArray(parsed.unlockedDecorations)) setUnlockedDecorations(parsed.unlockedDecorations);
          if (Array.isArray(parsed.activeDecorations)) {
            setActiveDecorations(parsed.activeDecorations);
          } else if (Array.isArray(parsed.unlockedDecorations)) {
            setActiveDecorations(parsed.unlockedDecorations.map((d) => d.id));
          }
          if (Array.isArray(parsed.rewards)) setRewards(parsed.rewards);
          if (Array.isArray(parsed.rewardHistory)) setRewardHistory(parsed.rewardHistory);
          if (typeof parsed.pendingGift === 'boolean') setHasPendingGift(parsed.pendingGift);
          if (parsed.lastVisitedDate) setLastVisitedDate(parsed.lastVisitedDate);

          // Plant greeting based on visit
          const greeting = getDailyPlantGreeting(false, parsed.lastVisitedDate);
          setPlantSpeech(greeting);
          return;
        }
      }

      // Check legacy seeds key for migration
      const legacyKey = getLegacyPlantStorageKey(user.id);
      const legacyLocal = localStorage.getItem(legacyKey);
      if (legacyLocal) {
        const legacySeeds = JSON.parse(legacyLocal);
        if (Array.isArray(legacySeeds)) {
          setSeeds(legacySeeds);
        }
      }

      // Default greeting for new visit
      setPlantSpeech(getDailyPlantGreeting(true));
    } catch (e) {
      console.warn('Could not read local plant state:', e);
    }
  }, [user?.id, todayStr]);

  useEffect(() => {
    loadState();
  }, [loadState]);

  // Account switch listener
  useEffect(() => {
    const handleAccountChange = () => {
      loadState();
    };
    window.addEventListener('teen_account_changed', handleAccountChange);
    return () => window.removeEventListener('teen_account_changed', handleAccountChange);
  }, [loadState]);

  // Fetch from server if logged in
  useEffect(() => {
    if (!token || !user?.id || user.id === 'guest') return;
    let isMounted = true;

    const fetchServerData = async () => {
      try {
        const res = await fetch('/api/emotion-plant/my', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok && isMounted) {
          const data = await res.json();
          if (data.plant && typeof data.plant === 'object') {
            const p = data.plant;
            if (Array.isArray(p.seeds)) setSeeds(p.seeds);
            if (p.currentWeather) setCurrentWeather(p.currentWeather);
            if (p.todayEmotion) setTodayEmotion(p.todayEmotion);
            if (p.todayFertilizer && p.todayFertilizer.date === todayStr) {
              setTodayFertilizer(p.todayFertilizer);
            }
            if (p.dailyLogs) setDailyLogs(p.dailyLogs);
            if (Array.isArray(p.unlockedDecorations)) setUnlockedDecorations(p.unlockedDecorations);
            if (Array.isArray(p.activeDecorations)) {
              setActiveDecorations(p.activeDecorations);
            } else if (Array.isArray(p.unlockedDecorations)) {
              setActiveDecorations(p.unlockedDecorations.map((d: any) => d.id));
            }
            if (Array.isArray(p.rewards)) setRewards(p.rewards);
            if (Array.isArray(p.rewardHistory)) setRewardHistory(p.rewardHistory);
            if (typeof p.pendingGift === 'boolean') setHasPendingGift(p.pendingGift);
          } else if (Array.isArray(data.seeds) && data.seeds.length > 0) {
            setSeeds(data.seeds);
          }
        }
      } catch (err) {
        console.warn('Sync plant error:', err);
      }
    };

    fetchServerData();
    return () => {
      isMounted = false;
    };
  }, [token, user?.id, todayStr]);

  // Save current state to local storage & server
  const persistFullState = useCallback(
    async (override?: Partial<FullPlantState>) => {
      const currentState: FullPlantState = {
        seeds,
        currentWeather,
        todayEmotion,
        todayFertilizer,
        dailyLogs,
        unlockedDecorations,
        activeDecorations,
        rewards,
        rewardHistory,
        pendingGift: hasPendingGift,
        lastVisitedDate: todayStr,
        ...override
      };

      // STRICT GUEST CHECK: In Guest Mode, do NOT save to localStorage!
      // In-memory state allows the plant to interact during this session, but on F5 it resets cleanly.
      if (!user?.id || user.id === 'guest') {
        return;
      }

      const storageKey = getPlantStorageKey(user.id);
      try {
        localStorage.setItem(storageKey, JSON.stringify(currentState));
      } catch (e) {
        console.warn('Failed to save state to localStorage:', e);
      }

      if (token && user.id !== 'guest') {
        try {
          await fetch('/api/emotion-plant/sync', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              seeds: currentState.seeds,
              plantState: currentState
            })
          });
        } catch (e) {
          console.warn('Failed to sync plant with server:', e);
        }
      }
    },
    [
      seeds,
      currentWeather,
      todayEmotion,
      todayFertilizer,
      dailyLogs,
      unlockedDecorations,
      activeDecorations,
      rewards,
      rewardHistory,
      hasPendingGift,
      todayStr,
      token,
      user?.id
    ]
  );

  // Handle Emotion selection
  const handleSelectEmotion = (emotion: PlantEmotionType) => {
    setTodayEmotion(emotion);
    const emotionOpt = PLANT_EMOTIONS.find((e) => e.id === emotion);
    if (emotionOpt) {
      setCurrentWeather(emotionOpt.weatherInfluence);
    }

    // Plant speaks a warm reaction
    const plantReactions: Record<PlantEmotionType, string> = {
      happy: 'Trời nắng ấm chan hòa rồi! Thấy cậu vui tớ cũng tươi tắn theo 🌱',
      fine: 'Nắng nhẹ dịu êm ghê. Cứ thong thả từng bước nhé 🌱',
      neutral: 'Mây lững lờ bình yên quá. Một ngày êm đềm như thế này thật quý.',
      sad: 'Cơn mưa tưới mát cho đất rồi. Buồn thì cứ thả lỏng, tớ vẫn ở đây che mát cho cậu.',
      stressed: 'Áp lực quá thì để xuống đây một chút nhé. Mưa rơi sẽ gột rửa bớt mệt mỏi.',
      anxious: 'Đừng lo nhé, có tớ ở bên đây rồi. Cậu luôn an toàn ở góc nhỏ này.',
      angry: 'Gió mát rượi thổi qua rồi đó. Thở ra một hơi thật dài nhé 🌱',
      lonely: 'Đêm thanh bình, cậu không hề một mình đâu. Tớ luôn đợi cậu ở đây.',
      unknown: 'Không sao cả, không cần gọi tên đâu. Cứ để mọi thứ tự nhiên như cầu vồng nhé 🌈'
    };

    setPlantSpeech(plantReactions[emotion] || 'Tớ nghe rồi nha 🌱');

    // Update daily log
    const updatedLogs = {
      ...dailyLogs,
      [todayStr]: {
        date: todayStr,
        weather: emotionOpt?.weatherInfluence || currentWeather,
        emotion,
        sowedSeed: dailyLogs[todayStr]?.sowedSeed || false,
        fertilizerKg: todayFertilizer.currentKg,
        fertilizerRequiredKg: todayFertilizer.requiredKg,
        fertilizerDone: todayFertilizer.isCompleted
      }
    };
    setDailyLogs(updatedLogs);

    persistFullState({
      todayEmotion: emotion,
      currentWeather: emotionOpt?.weatherInfluence || currentWeather,
      dailyLogs: updatedLogs
    });
  };

  // Handle Sowing new Emotion Paper Seed
  const handleSow = (drawingDataUrl: string, effect: SeedGrowthEffect) => {
    const stageAtTime = calculatePlantStage(
      seeds.length,
      Object.values(dailyLogs).filter((l) => l.fertilizerDone).length
    );

    const newSeed: EmotionSeedItem = {
      id: 'seed_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      createdAt: new Date().toISOString(),
      drawingDataUrl,
      growthEffect: effect,
      stageAtSowing: stageAtTime,
      emotion: todayEmotion,
      weather: currentWeather
    };

    const updatedSeeds = [...seeds, newSeed];
    setSeeds(updatedSeeds);

    // Box opening and plant animation
    setIsBoxOpen(true);
    setIsSowingAnim(true);
    setRecentEffect(effect);

    // Plant speaks! Short, natural, warm (Requirement)
    const reply = getRandomSowingMessage();
    setPlantSpeech(reply);

    // Update daily log
    const updatedLogs = {
      ...dailyLogs,
      [todayStr]: {
        date: todayStr,
        weather: currentWeather,
        emotion: todayEmotion,
        sowedSeed: true,
        fertilizerKg: todayFertilizer.currentKg,
        fertilizerRequiredKg: todayFertilizer.requiredKg,
        fertilizerDone: todayFertilizer.isCompleted
      }
    };
    setDailyLogs(updatedLogs);

    // Chance for surprise gift drop (milestone or random)
    let pendingGiftTriggered = hasPendingGift;
    if (updatedSeeds.length % 3 === 0 || !hasPendingGift) {
      pendingGiftTriggered = true;
      setHasPendingGift(true);
    }

    persistFullState({
      seeds: updatedSeeds,
      dailyLogs: updatedLogs,
      pendingGift: pendingGiftTriggered
    });

    setTimeout(() => {
      setIsBoxOpen(false);
      setIsSowingAnim(false);
    }, 1200);
  };

  // Handle Fertilizer Update
  const handleFertilizerUpdate = (newKg: number, delta: number) => {
    const isCompleted = Math.abs(newKg - todayFertilizer.requiredKg) < 0.01;

    const nextFertilizer = {
      ...todayFertilizer,
      currentKg: newKg,
      isCompleted
    };
    setTodayFertilizer(nextFertilizer);

    // Plant reacts to fertilizer amount
    if (newKg > todayFertilizer.requiredKg + 0.01) {
      setPlantSpeech('Ơ, hơi nhiều rồi =)) Cậu bấm "Lấy bớt" nhé!');
    } else if (newKg < todayFertilizer.requiredKg - 0.01) {
      setPlantSpeech('Tớ vẫn cần thêm một chút dinh dưỡng nữa 🌱');
    }

    // Update log
    const updatedLogs = {
      ...dailyLogs,
      [todayStr]: {
        date: todayStr,
        weather: currentWeather,
        emotion: todayEmotion,
        sowedSeed: dailyLogs[todayStr]?.sowedSeed || false,
        fertilizerKg: newKg,
        fertilizerRequiredKg: todayFertilizer.requiredKg,
        fertilizerDone: isCompleted
      }
    };
    setDailyLogs(updatedLogs);

    persistFullState({
      todayFertilizer: nextFertilizer,
      dailyLogs: updatedLogs
    });
  };

  // Handle Fertilizer Hit Exact Target
  const handleFertilizerCompleted = () => {
    // Shake plant happily and speak
    setIsSowingAnim(true);
    setTimeout(() => setIsSowingAnim(false), 1200);

    const happyMessages = [
      'Vừa đủ luôn! Cảm ơn cậu nha 🌱',
      'Chuẩn rồi! Tớ khỏe hơn một chút rồi.',
      'Đủ dinh dưỡng rồi nè! Mát lành ghê.',
      'Đất ấm và mềm rồi, tớ vươn cao thêm xíu đây!'
    ];
    setPlantSpeech(happyMessages[Math.floor(Math.random() * happyMessages.length)]);

    // Trigger surprise gift if not already present
    setHasPendingGift(true);

    persistFullState({
      pendingGift: true
    });
  };

  // Open Surprise Gift
  const handleOpenGift = () => {
    const unlockedIds = unlockedDecorations.map((d) => d.id);
    const reward = pickSmartReward(unlockedIds, rewardHistory);
    setActiveGift(reward);
    setIsGiftModalOpen(true);
    setHasPendingGift(false);

    const updatedHistory = [reward.id, ...rewardHistory.slice(0, 10)];
    setRewardHistory(updatedHistory);

    // If it's advice or quote, save to rewards history immediately
    const updatedRewards = [reward, ...rewards];
    setRewards(updatedRewards);

    persistFullState({
      pendingGift: false,
      rewardHistory: updatedHistory,
      rewards: updatedRewards
    });
  };

  // User applies physical reward item to garden
  const handleApplyGift = (reward: PlantRewardItem) => {
    if (reward.decoration) {
      const dec = reward.decoration;
      const exists = unlockedDecorations.some((d) => d.id === dec.id);
      const nextUnlocked = exists ? unlockedDecorations : [dec, ...unlockedDecorations];
      const nextActive = activeDecorations.includes(dec.id)
        ? activeDecorations
        : [...activeDecorations, dec.id];

      setUnlockedDecorations(nextUnlocked);
      setActiveDecorations(nextActive);
      setPlantSpeech(`Woa, ${dec.name} đã ghé thăm và ở lại góc vườn cùng chúng mình rồi nè! ✨`);

      persistFullState({
        unlockedDecorations: nextUnlocked,
        activeDecorations: nextActive
      });
    }
    setIsGiftModalOpen(false);
    setActiveGift(null);
  };

  // User stores physical reward item in inventory without applying to tree
  const handleDeclineGift = (reward: PlantRewardItem) => {
    if (reward.decoration) {
      const dec = reward.decoration;
      const exists = unlockedDecorations.some((d) => d.id === dec.id);
      const nextUnlocked = exists ? unlockedDecorations : [dec, ...unlockedDecorations];
      const nextActive = activeDecorations.filter((id) => id !== dec.id);

      setUnlockedDecorations(nextUnlocked);
      setActiveDecorations(nextActive);
      setPlantSpeech(`Tớ đã cất ${dec.name} vào kho Góc vườn cho cậu rồi nha 🌱`);

      persistFullState({
        unlockedDecorations: nextUnlocked,
        activeDecorations: nextActive
      });
    }
    setIsGiftModalOpen(false);
    setActiveGift(null);
  };

  // Toggle decoration active state from Garden Modal
  const handleToggleDecoration = (id: string) => {
    setActiveDecorations((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      persistFullState({ activeDecorations: next });
      return next;
    });
  };

  // Delete seed from history
  const handleDeleteSeed = (seedId: string) => {
    const updated = seeds.filter((s) => s.id !== seedId);
    setSeeds(updated);
    persistFullState({ seeds: updated });
  };

  // Remove active emotion seed from pot (returning pot to empty state)
  const handleRemoveEmotionSeed = (deleteTodayPaperSeed: boolean = false) => {
    setTodayEmotion(undefined);
    const baseWeather = getBaseWeatherForDate(todayStr);
    setCurrentWeather(baseWeather);

    const currentTodayLog = dailyLogs[todayStr];
    const updatedLogs: Record<string, DailyPlantLog> = {
      ...dailyLogs,
      [todayStr]: {
        ...currentTodayLog,
        date: todayStr,
        weather: baseWeather,
        emotion: undefined,
        sowedSeed: deleteTodayPaperSeed ? false : (currentTodayLog?.sowedSeed || false)
      }
    };
    setDailyLogs(updatedLogs);

    let updatedSeeds = seeds;
    if (deleteTodayPaperSeed) {
      const todaySeeds = seeds.filter((s) => {
        try {
          const d = new Date(s.createdAt).toISOString().split('T')[0];
          return d === todayStr;
        } catch {
          return false;
        }
      });
      if (todaySeeds.length > 0) {
        const lastTodaySeedId = todaySeeds[todaySeeds.length - 1].id;
        updatedSeeds = seeds.filter((s) => s.id !== lastTodaySeedId);
        setSeeds(updatedSeeds);
      }
    }

    setPlantSpeech('Tớ đã dọn sạch chậu rồi nhé 🌱 Đất mềm sẵn sàng đón nhận hạt mầm cảm xúc mới của cậu.');

    persistFullState({
      todayEmotion: undefined,
      currentWeather: baseWeather,
      dailyLogs: updatedLogs,
      seeds: updatedSeeds
    });

    setIsRemoveSeedModalOpen(false);
  };

  // Remove a single floating gift/decoration when user clicks 'x' on the emoji
  const handleRemoveDecoration = (id: string) => {
    const removedItem = unlockedDecorations.find((d) => d.id === id);
    setActiveDecorations((prev) => {
      const next = prev.filter((itemId) => itemId !== id);
      persistFullState({ activeDecorations: next });
      return next;
    });
    if (removedItem) {
      setPlantSpeech(`Tớ đã cất ${removedItem.name} vào Góc vườn cho không gian thoáng đãng rồi nhé! 🌱`);
    }
  };

  // Current stage calculation
  const completedFertilizerDays = Object.values(dailyLogs).filter(
    (l) => l.fertilizerDone
  ).length;
  const currentStage = calculatePlantStage(seeds.length, completedFertilizerDays);
  const stageDetails = getStageDetails(currentStage);

  // Weather visuals
  const weatherConfig = WEATHER_CONFIG[currentWeather] || WEATHER_CONFIG.sunny;

  return (
    <div
      className={`min-h-screen bg-gradient-to-b ${weatherConfig.skyClass} text-slate-800 pb-24 select-none transition-colors duration-700`}
    >
      {/* ════════════════ TOP WEATHER & GARDEN BAR ════════════════ */}
      <div className="border-b border-amber-200/50 bg-white/60 backdrop-blur-xs py-2 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Weather status */}
          <div className="flex items-center gap-2">
            <span className="text-xl">{weatherConfig.emoji}</span>
            <div>
              <span className="font-extrabold text-slate-900">
                Thời tiết hôm nay: {weatherConfig.name}
              </span>
              <span className="text-slate-500 hidden sm:inline ml-1.5 font-medium">
                • {weatherConfig.description}
              </span>
            </div>
          </div>

          {/* Quick Stats & Action Pills */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDecorationsOpen(true)}
              className="px-3 py-1.5 rounded-full bg-amber-100/90 hover:bg-amber-200 text-amber-900 font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              title="Xem bộ sưu tập trang trí"
            >
              <span>🏡 Góc vườn</span>
              <span className="bg-amber-200/80 px-1.5 py-0.2 rounded-full text-[10px]">
                {unlockedDecorations.length}
              </span>
            </button>

            <button
              onClick={() => setIsHistoryOpen(true)}
              className="px-3 py-1.5 rounded-full bg-white hover:bg-amber-50 text-slate-700 border border-slate-200 font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <Inbox className="w-3.5 h-3.5 text-amber-700" />
              <span>Đã gieo ({seeds.length})</span>
            </button>

            {user && user.id !== 'guest' ? (
              <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200/60 font-semibold">
                <CloudCheck className="w-3.5 h-3.5 text-teal-600" />
                <span>Đồng bộ tài khoản</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60 font-semibold">
                <span>🍃 Chế độ khách (tạm thời)</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Guest Mode Notice Banner */}
      {(!user || !user.id || user.id === 'guest') && (
        <div className="bg-[#FFF8EE] border-b border-[#F0DFCD] text-[#7A4B2A] py-2 px-4 sm:px-6 text-xs text-center shadow-2xs">
          <span className="font-serif font-bold text-[#5A351D]">Chế độ khách:</span> Cây cảm xúc và hoa trái lớn lên trong phiên này và sẽ tự làm mới sạch sẽ khi tải lại trang (F5). Hãy đăng nhập để lưu trữ hành trình chăm cây bền lâu nhé! 🌱
        </div>
      )}

      {/* ════════════════ TITLE & GENTLE INTRO ════════════════ */}
      <header className="pt-6 sm:pt-10 pb-4 px-4 sm:px-6 max-w-4xl mx-auto text-center space-y-2.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-300/80 text-[11px] font-extrabold text-emerald-900 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
          <span>Góc chăm cây hằng ngày • Thư giãn & Giải tỏa tâm trí</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          🌱 Hộp Cây Cảm Xúc
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-md mx-auto leading-relaxed">
          Ghé thăm cây mỗi ngày, đặt một chút cảm xúc xuống đất mềm và rời đi với tâm trạng nhẹ hơn.
        </p>
      </header>

      {/* ════════════════ MAIN INTERACTIVE PLAYGROUND ════════════════ */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Emotion Selector Bar */}
        <div id="emotion-bar-section">
          <EmotionBar
            selectedEmotion={todayEmotion}
            onSelectEmotion={handleSelectEmotion}
            onRemoveEmotion={() => setIsRemoveSeedModalOpen(true)}
          />
        </div>

        {/* Primary Play Screen: Split into Garden / Plant Stage and Daily Fertilizer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left / Main Column: Plant Canvas & Speech */}
          <div className="lg:col-span-7 bg-white/85 backdrop-blur-xs rounded-3xl p-5 sm:p-7 border border-amber-100/90 shadow-sm flex flex-col items-center relative overflow-hidden">
            {/* Stage Indicator Pill */}
            <div className="w-full flex items-center justify-between border-b border-amber-100/80 pb-3 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{stageDetails.emoji}</span>
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-slate-800">
                    Giai đoạn {currentStage}: {stageDetails.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {stageDetails.desc}
                  </p>
                </div>
              </div>

              <div className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                {seeds.length} hạt đã gieo
              </div>
            </div>

            {/* Plant Speech Bubble (Floating above plant) */}
            <div className="w-full max-w-sm mt-2 mb-1">
              <motion.div
                key={plantSpeech}
                initial={{ opacity: 0, y: 6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="relative bg-gradient-to-r from-amber-50 via-white to-emerald-50 rounded-2xl p-3 sm:p-3.5 border border-amber-200/90 shadow-2xs text-center"
              >
                <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm font-bold text-slate-800">
                  <span className="text-sm">💬</span>
                  <span>{plantSpeech}</span>
                </div>
                {/* Speech triangle */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-amber-100" />
              </motion.div>
            </div>

            {/* Plant Canvas SVG */}
            <div className="w-full relative flex flex-col items-center justify-center my-2">
              <PlantCanvasSvg
                seedCount={seeds.length}
                stage={currentStage}
                weather={currentWeather}
                decorations={unlockedDecorations}
                activeDecorations={activeDecorations}
                todayEmotion={todayEmotion}
                hasPendingGift={hasPendingGift}
                isSowingAnim={isSowingAnim}
                recentlyAddedEffect={recentEffect}
                onPlantClick={() => {
                  setIsSowingAnim(true);
                  const gentleQuotes = [
                    'Cậu ở đây, tớ rất vui 🌱',
                    'Lá cây rung rinh chào cậu nè!',
                    'Hôm nay làm được gì cũng đáng tự hào.',
                    'Thở sâu một nhịp nhé bạn thương.'
                  ];
                  setPlantSpeech(gentleQuotes[Math.floor(Math.random() * gentleQuotes.length)]);
                  setTimeout(() => setIsSowingAnim(false), 800);
                }}
                onOpenGift={handleOpenGift}
                onOpenRemoveEmotionModal={() => setIsRemoveSeedModalOpen(true)}
                onOpenEmotionPicker={() => {
                  const el = document.getElementById('emotion-bar-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                onRemoveDecoration={handleRemoveDecoration}
              />

              {/* Seed box below */}
              <div className="mt-3">
                <SeedBoxSvg
                  isOpen={isBoxOpen}
                  seedCount={seeds.length}
                  isReceivingSeed={isSowingAnim}
                  onClick={() => setIsHistoryOpen(true)}
                />
              </div>
            </div>

            {/* Primary Action Button: "✏️ Vẽ cảm xúc" */}
            <div className="w-full max-w-sm mt-4 flex flex-col items-center gap-2">
              <button
                onClick={() => setIsCanvasOpen(true)}
                className="w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.99]"
              >
                <PenTool className="w-5 h-5" />
                <span>✏️ Vẽ cảm xúc hôm nay</span>
              </button>
              <p className="text-[11px] text-center text-slate-500 font-medium">
                Vẽ tự do mọi nét vẽ • Gấp lại thành hạt mầm gieo vào chậu
              </p>
            </div>
          </div>

          {/* Right Column: Daily Fertilizer & Garden Care */}
          <div className="lg:col-span-5 space-y-4">
            {/* Daily Fertilizer Section */}
            <FertilizerSection
              requiredKg={todayFertilizer.requiredKg}
              currentKg={todayFertilizer.currentKg}
              isCompleted={todayFertilizer.isCompleted}
              onUpdateKg={handleFertilizerUpdate}
              onFertilizerCompleted={handleFertilizerCompleted}
            />

            {/* Daily Care Checklist */}
            <div className="bg-white/80 backdrop-blur-xs rounded-3xl p-5 border border-amber-100/90 shadow-xs space-y-3">
              <h4 className="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-1.5">
                <span>🗓️</span>
                <span>Nhật ký chăm sóc hôm nay</span>
              </h4>

              <div className="space-y-2 text-xs">
                {/* Step 1: Emotion */}
                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50/90 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-base">💭</span>
                    <span className="font-semibold text-slate-700">Chọn cảm xúc hôm nay</span>
                  </div>
                  {todayEmotion ? (
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 text-[10px]">
                      Đã chọn
                    </span>
                  ) : (
                    <span className="text-slate-400 font-medium text-[10px]">Chưa chọn</span>
                  )}
                </div>

                {/* Step 2: Drawing Seed */}
                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50/90 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🌱</span>
                    <span className="font-semibold text-slate-700">Gieo hạt cảm xúc</span>
                  </div>
                  {dailyLogs[todayStr]?.sowedSeed ? (
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 text-[10px]">
                      Đã gieo
                    </span>
                  ) : (
                    <button
                      onClick={() => setIsCanvasOpen(true)}
                      className="text-emerald-800 font-bold hover:underline text-[10px] cursor-pointer"
                    >
                      + Vẽ ngay
                    </button>
                  )}
                </div>

                {/* Step 3: Fertilizer */}
                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50/90 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🪣</span>
                    <span className="font-semibold text-slate-700">Bón đủ phân hôm nay</span>
                  </div>
                  {todayFertilizer.isCompleted ? (
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 text-[10px]">
                      Đã hoàn thành ✨
                    </span>
                  ) : (
                    <span className="text-amber-800 font-bold text-[10px]">
                      {todayFertilizer.currentKg}/{todayFertilizer.requiredKg} kg
                    </span>
                  )}
                </div>
              </div>

              <div className="text-[11px] text-slate-500 pt-1 leading-relaxed">
                Hoàn thành chăm sóc mỗi ngày sẽ giúp cây lớn nhanh hơn và mở khóa các vật phẩm trang trí ngẫu nhiên!
              </div>
            </div>

            {/* Growth Stages Preview Card */}
            <div className="bg-white/80 backdrop-blur-xs rounded-3xl p-5 border border-amber-100/90 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Cấp bậc phát triển cây (6 giai đoạn)</span>
                </h4>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 text-center">
                {[
                  { s: 1, em: '🌰', name: 'Hạt giống' },
                  { s: 2, em: '🌱', name: 'Mầm nhỏ' },
                  { s: 3, em: '🌿', name: 'Cây non' },
                  { s: 4, em: '🪴', name: 'Cây lớn' },
                  { s: 5, em: '🌳', name: 'Trưởng thành' },
                  { s: 6, em: '✨', name: 'Kỳ diệu' }
                ].map((item) => {
                  const isCurrent = currentStage === item.s;
                  const isPast = currentStage > item.s;
                  return (
                    <div
                      key={item.s}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        isCurrent
                          ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-400/40 shadow-2xs font-bold'
                          : isPast
                          ? 'bg-amber-50/60 border-amber-200/60 text-slate-600'
                          : 'bg-slate-50 border-slate-200/50 opacity-50'
                      }`}
                    >
                      <div className="text-base sm:text-lg">{item.em}</div>
                      <div className="text-[10px] truncate text-slate-800">{item.name}</div>
                      {isCurrent && (
                        <div className="text-[8px] text-emerald-700 font-extrabold uppercase mt-0.5">
                          Hiện tại
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Anti-guilt guarantee banner */}
        <section className="bg-gradient-to-r from-amber-50/90 via-emerald-50/80 to-amber-50/90 rounded-3xl p-4 sm:p-5 border border-amber-200/80 flex items-start gap-3.5 shadow-2xs">
          <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <p className="font-bold text-slate-900">
              Góc bình yên không áp lực:
            </p>
            <p className="text-slate-600">
              Không có chuỗi ngày bắt buộc (streak), không trách móc khi bạn vắng mặt. Cây không bao giờ chết hay héo. Cảm xúc buồn hay mệt mỏi cũng quý giá như niềm vui, và tất cả đều nuôi cái cây lớn lên theo cách tự nhiên nhất.
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
        dailyLogs={dailyLogs}
        onDeleteSeed={handleDeleteSeed}
      />

      <GardenDecorationsModal
        isOpen={isDecorationsOpen}
        unlockedDecorations={unlockedDecorations}
        activeDecorations={activeDecorations}
        rewards={rewards}
        onToggleDecoration={handleToggleDecoration}
        onClose={() => setIsDecorationsOpen(false)}
      />

      <RewardGiftModal
        isOpen={isGiftModalOpen}
        reward={activeGift}
        onApplyGift={handleApplyGift}
        onDeclineGift={handleDeclineGift}
        onClose={() => {
          setIsGiftModalOpen(false);
          setActiveGift(null);
        }}
      />

      <RemoveSeedModal
        isOpen={isRemoveSeedModalOpen}
        onClose={() => setIsRemoveSeedModalOpen(false)}
        onConfirmRemove={handleRemoveEmotionSeed}
        todayEmotion={todayEmotion}
        hasTodayPaperSeed={hasTodayPaperSeed}
      />
    </div>
  );
};
