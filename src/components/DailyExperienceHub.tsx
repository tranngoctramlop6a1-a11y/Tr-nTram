import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Zap, 
  Shuffle, 
  Heart, 
  MessageCircle, 
  BookOpen, 
  Check, 
  Award, 
  RefreshCw, 
  Trash2, 
  Smile, 
  ArrowRight,
  ShieldCheck,
  Send,
  Coffee,
  HelpCircle,
  Eye,
  Compass,
  Wind
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  GREETINGS_POOL, 
  DAILY_THEMES, 
  MICRO_TASKS_POOL, 
  REFLECTIONS_POOL, 
  TEEN_MESSAGES_POOL, 
  BRAIN_THOUGHTS_POOL, 
  TEEN_SCENARIOS_QUICK, 
  MINI_GAMES_POOL,
  EMOJI_MOOD_OPTIONS,
  diagnoseEmojiMood,
  EmojiMoodResult
} from '../data/teenContentPools';
import { 
  getUserExperienceData, 
  saveUserExperienceData, 
  recordGreetingSeen, 
  recordQuestionSeen, 
  completeMicroTask, 
  unlockBadge,
  INITIAL_BADGES,
  GentleBadge,
  clearAllUserData,
  getGentleInsights
} from '../utils/userExperienceStore';
import { BotMascot } from './BotMascot';

interface DailyExperienceHubProps {
  onGoToChatbot: (initialPrompt?: string, mode?: string) => void;
  onGoToJournal: (note?: string) => void;
  onGoToConfessions: () => void;
  onGoToHelp: () => void;
  onOpenFast30s: () => void;
  onOpenSurpriseMe: () => void;
}

export const DailyExperienceHub: React.FC<DailyExperienceHubProps> = ({
  onGoToChatbot,
  onGoToJournal,
  onGoToConfessions,
  onGoToHelp,
  onOpenFast30s,
  onOpenSurpriseMe
}) => {
  // Experience memory state
  const [expData, setExpData] = useState(() => getUserExperienceData());
  const [showBadgesModal, setShowBadgesModal] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Day theme
  const dayOfWeek = new Date().getDay();
  const dayTheme = DAILY_THEMES[dayOfWeek] || DAILY_THEMES[1];

  // 1. Dynamic greeting selection (avoids recent repeats)
  const [greeting, setGreeting] = useState(() => {
    const memory = getUserExperienceData();
    const available = GREETINGS_POOL.filter(g => !memory.recentGreetingIds.includes(g.id));
    const pool = available.length > 0 ? available : GREETINGS_POOL;
    const picked = pool[Math.floor(Math.random() * pool.length)];
    recordGreetingSeen(picked.id);
    return picked;
  });

  const handleShuffleGreeting = () => {
    const available = GREETINGS_POOL.filter(g => g.id !== greeting.id);
    const picked = available[Math.floor(Math.random() * available.length)];
    setGreeting(picked);
    recordGreetingSeen(picked.id);
  };

  // 2. Micro-task state
  const [currentTask, setCurrentTask] = useState(() => {
    const available = MICRO_TASKS_POOL.filter(t => !expData.completedTaskIds.includes(t.id));
    return available.length > 0 ? available[0] : MICRO_TASKS_POOL[0];
  });
  const [isTaskDone, setIsTaskDone] = useState(() => expData.completedTaskIds.includes(currentTask.id));

  const handleDoneTask = () => {
    setIsTaskDone(true);
    completeMicroTask(currentTask.id);
    unlockBadge('badge_micro_action');
    try {
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
    } catch {}
  };

  // 3. Mini-game selector on card
  const [miniGameTab, setMiniGameTab] = useState<'wyr' | 'emoji' | 'word' | 'card'>('wyr');
  const [currentWYR, setCurrentWYR] = useState(() => MINI_GAMES_POOL[0]);
  const [selectedWYROption, setSelectedWYROption] = useState<string | null>(null);

  // Emoji mood game state
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);
  const [emojiDiagnosis, setEmojiDiagnosis] = useState<EmojiMoodResult | null>(null);

  // One-word today state
  const [oneWordInput, setOneWordInput] = useState('');
  const [oneWordReaction, setOneWordReaction] = useState<string | null>(null);

  // Random Card flip state
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [randomCardMessage, setRandomCardMessage] = useState(() => TEEN_MESSAGES_POOL[0]);

  // 4. Short reflection state
  const [currentReflection] = useState(() => REFLECTIONS_POOL[Math.floor(Math.random() * REFLECTIONS_POOL.length)]);
  const [reflectionAnswer, setReflectionAnswer] = useState('');
  const [reflectionSaved, setReflectionSaved] = useState(false);

  // 5. Brain thought
  const [brainThought] = useState(() => BRAIN_THOUGHTS_POOL[Math.floor(Math.random() * BRAIN_THOUGHTS_POOL.length)]);

  // 6. Teen scenario
  const [currentScenario] = useState(() => TEEN_SCENARIOS_QUICK[Math.floor(Math.random() * TEEN_SCENARIOS_QUICK.length)]);
  const [scenarioAnswer, setScenarioAnswer] = useState<string | null>(null);

  // 7. Low-energy breathing state
  const [breathPhase, setBreathPhase] = useState<'in' | 'hold' | 'out'>('in');
  const [isBreathingActive, setIsBreathingActive] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isBreathingActive) {
      if (breathPhase === 'in') {
        timer = setTimeout(() => setBreathPhase('hold'), 4000);
      } else if (breathPhase === 'hold') {
        timer = setTimeout(() => setBreathPhase('out'), 4000);
      } else {
        timer = setTimeout(() => setBreathPhase('in'), 4000);
      }
    }
    return () => clearTimeout(timer);
  }, [isBreathingActive, breathPhase]);

  // Handle emoji selection toggle
  const toggleEmoji = (emoji: string) => {
    let next: string[];
    if (selectedEmojis.includes(emoji)) {
      next = selectedEmojis.filter(e => e !== emoji);
    } else {
      if (selectedEmojis.length >= 3) {
        next = [...selectedEmojis.slice(1), emoji];
      } else {
        next = [...selectedEmojis, emoji];
      }
    }
    setSelectedEmojis(next);
    if (next.length === 3) {
      setEmojiDiagnosis(diagnoseEmojiMood(next));
      unlockBadge('badge_caring');
    } else {
      setEmojiDiagnosis(null);
    }
  };

  const handleOneWordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oneWordInput.trim()) return;
    const word = oneWordInput.trim();
    setOneWordReaction(`“${word}” — Cảm ơn bạn đã gói ghém hôm nay vào một từ thật chân thật. Dù từ đó là gì, bạn cũng đã trải qua ngày hôm nay trọn vẹn rồi 🌱`);
    unlockBadge('badge_reflection');
  };

  const handleSaveReflection = () => {
    if (!reflectionAnswer.trim()) return;
    setReflectionSaved(true);
    unlockBadge('badge_reflection');
    if (onGoToJournal) {
      onGoToJournal(`${currentReflection.question}\n\nTrả lời: ${reflectionAnswer.trim()}`);
    }
  };

  // Gentle insights
  const gentleInsights = getGentleInsights(expData);

  return (
    <section className="py-6 sm:py-10 max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
      
      {/* 🌟 1. DYNAMIC HEADER & GREETING BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 p-6 sm:p-8 text-white shadow-lg">
        {/* Glow circles */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/15 rounded-full blur-2xl pointer-events-none transform translate-x-20 -translate-y-20"></div>
        <div className="absolute bottom-0 left-1/4 w-60 h-60 bg-amber-300/20 rounded-full blur-xl pointer-events-none"></div>

        <div className="relative z-10 space-y-5">
          {/* Top Bar inside Banner: Day theme & Gentle visit stats */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs font-black tracking-wide flex items-center gap-1.5 shadow-2xs">
                <span>{dayTheme.themeTitle}</span>
              </span>
              <span className="hidden sm:inline-block text-rose-100 italic">
                • {dayTheme.moodBadge}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {expData.daysSinceLastVisit > 2 ? (
                <span className="px-2.5 py-1 rounded-full bg-amber-400/30 text-amber-100 font-bold">
                  Lâu rồi mới gặp 👀
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full bg-white/20 text-rose-100 font-bold flex items-center gap-1">
                  <span>🌱 Ghé {expData.visitCountRecent || 1} lần gần đây</span>
                </span>
              )}
              <button
                onClick={() => setShowBadgesModal(true)}
                className="px-2.5 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold transition-colors cursor-pointer flex items-center gap-1"
                title="Xem huy hiệu"
              >
                <Award className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline">Huy hiệu</span>
              </button>
            </div>
          </div>

          {/* Main Greeting & Subtext */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-1">
            <div className="lg:col-span-8 space-y-2.5">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/20 backdrop-blur-xs p-1.5 flex items-center justify-center shrink-0 shadow-md">
                  <BotMascot mood="happy" size="md" className="w-12 h-12 sm:w-14 sm:h-14 shadow-none border-0" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight flex items-center gap-2">
                    <span>{greeting.text}</span>
                    <button
                      onClick={handleShuffleGreeting}
                      title="Đổi câu chào khác"
                      className="p-1 rounded-full hover:bg-white/20 text-rose-100 hover:text-white transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </h2>
                  <p className="text-xs sm:text-sm text-rose-100 font-medium pt-1">
                    {greeting.subtext || 'Không gian riêng tư, nhẹ nhàng và 100% không phán xét.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons on Header */}
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-2.5">
              <button
                id="header-btn-surprise-me"
                onClick={onOpenSurpriseMe}
                className="w-full py-3 px-4 rounded-2xl bg-white text-rose-600 font-extrabold text-xs sm:text-sm shadow-md hover:bg-rose-50 transition-all flex items-center justify-center gap-2 cursor-pointer transform active:scale-98"
              >
                <Sparkles className="w-4 h-4 text-rose-500" />
                <span>✨ Bất ngờ mình đi</span>
              </button>

              <button
                id="header-btn-fast-30s"
                onClick={onOpenFast30s}
                className="w-full py-2.5 px-4 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>⚡ Mình chỉ có 30 giây</span>
              </button>
            </div>
          </div>

          {/* Gentle insight bar */}
          {gentleInsights.length > 0 && (
            <div className="pt-2 border-t border-white/20 flex items-center gap-2 text-xs text-rose-100 font-medium">
              <span className="text-sm">💡</span>
              <span className="italic">{gentleInsights[0]}</span>
            </div>
          )}
        </div>
      </div>

      {/* 🎨 2. GRID OF INTERACTIVE "TODAY'S EXPERIENCES" */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* CARD 1: 🎲 HÔM NAY CHƠI GÌ? (Mini-game suite with tabs) */}
        <div className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold flex items-center gap-1.5">
                <span>🎲 Hôm nay chơi gì?</span>
              </span>
              <span className="text-[11px] font-bold text-slate-500">
                Giải trí 1 phút
              </span>
            </div>

            {/* Mini tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-[11px] font-bold text-slate-600">
              <button
                onClick={() => setMiniGameTab('wyr')}
                className={`flex-1 py-1 rounded-lg transition-colors cursor-pointer ${miniGameTab === 'wyr' ? 'bg-white text-slate-900 shadow-2xs' : 'hover:text-slate-900'}`}
              >
                Thà... hơn
              </button>
              <button
                onClick={() => setMiniGameTab('emoji')}
                className={`flex-1 py-1 rounded-lg transition-colors cursor-pointer ${miniGameTab === 'emoji' ? 'bg-white text-slate-900 shadow-2xs' : 'hover:text-slate-900'}`}
              >
                3 Emoji
              </button>
              <button
                onClick={() => setMiniGameTab('word')}
                className={`flex-1 py-1 rounded-lg transition-colors cursor-pointer ${miniGameTab === 'word' ? 'bg-white text-slate-900 shadow-2xs' : 'hover:text-slate-900'}`}
              >
                1 từ thôi
              </button>
              <button
                onClick={() => setMiniGameTab('card')}
                className={`flex-1 py-1 rounded-lg transition-colors cursor-pointer ${miniGameTab === 'card' ? 'bg-white text-slate-900 shadow-2xs' : 'hover:text-slate-900'}`}
              >
                Lật thẻ
              </button>
            </div>

            {/* Tab: Would You Rather */}
            {miniGameTab === 'wyr' && (
              <div className="space-y-3 pt-1">
                <p className="text-xs sm:text-sm font-bold text-slate-800">
                  {currentWYR.question}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedWYROption('A')}
                    className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                      selectedWYROption === 'A'
                        ? 'bg-amber-100 border-amber-400 text-amber-950'
                        : 'bg-slate-50 border-slate-200 hover:bg-amber-50/50'
                    }`}
                  >
                    <span className="text-xl">{currentWYR.optionA.emoji}</span>
                    <span>{currentWYR.optionA.text}</span>
                  </button>

                  <button
                    onClick={() => setSelectedWYROption('B')}
                    className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                      selectedWYROption === 'B'
                        ? 'bg-amber-100 border-amber-400 text-amber-950'
                        : 'bg-slate-50 border-slate-200 hover:bg-amber-50/50'
                    }`}
                  >
                    <span className="text-xl">{currentWYR.optionB.emoji}</span>
                    <span>{currentWYR.optionB.text}</span>
                  </button>
                </div>
                {selectedWYROption && (
                  <p className="text-[11px] text-amber-800 italic bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                    💡 {currentWYR.funComment}
                  </p>
                )}
              </div>
            )}

            {/* Tab: 3 Emojis */}
            {miniGameTab === 'emoji' && (
              <div className="space-y-2 pt-1">
                <p className="text-xs font-semibold text-slate-600">
                  Chọn 3 emoji mô tả bạn hôm nay ({selectedEmojis.length}/3):
                </p>
                <div className="grid grid-cols-4 gap-1.5">
                  {EMOJI_MOOD_OPTIONS.slice(0, 8).map(item => (
                    <button
                      key={item.emoji}
                      onClick={() => toggleEmoji(item.emoji)}
                      className={`p-1.5 rounded-xl text-center border transition-all cursor-pointer ${
                        selectedEmojis.includes(item.emoji)
                          ? 'bg-amber-100 border-amber-400 scale-105 shadow-2xs'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-xl block">{item.emoji}</span>
                      <span className="text-[9px] font-bold text-slate-600 truncate block">{item.label}</span>
                    </button>
                  ))}
                </div>
                {emojiDiagnosis && (
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs space-y-1 animate-in fade-in">
                    <p className="font-extrabold text-amber-900">{emojiDiagnosis.title}</p>
                    <p className="text-slate-600 text-[11px]">{emojiDiagnosis.advice}</p>
                  </div>
                )}
              </div>
            )}

            {/* Tab: 1 Từ Thôi */}
            {miniGameTab === 'word' && (
              <div className="space-y-2 pt-1">
                <p className="text-xs font-semibold text-slate-600">
                  Mô tả hôm nay bằng đúng 1 từ duy nhất:
                </p>
                <form onSubmit={handleOneWordSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={oneWordInput}
                    onChange={(e) => setOneWordInput(e.target.value)}
                    placeholder="vd: Hỗn_loạn, Buồn_ngủ..."
                    maxLength={20}
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 rounded-xl bg-amber-500 text-white font-bold text-xs hover:bg-amber-600 cursor-pointer"
                  >
                    Gửi
                  </button>
                </form>
                {oneWordReaction && (
                  <p className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium leading-relaxed animate-in fade-in">
                    {oneWordReaction}
                  </p>
                )}
              </div>
            )}

            {/* Tab: Lật thẻ ngẫu nhiên */}
            {miniGameTab === 'card' && (
              <div className="pt-1">
                <div
                  onClick={() => {
                    setIsCardFlipped(!isCardFlipped);
                    if (!isCardFlipped) {
                      const item = TEEN_MESSAGES_POOL[Math.floor(Math.random() * TEEN_MESSAGES_POOL.length)];
                      setRandomCardMessage(item);
                    }
                  }}
                  className="w-full p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 text-center cursor-pointer hover:border-amber-400 transition-all min-h-[110px] flex flex-col items-center justify-center"
                >
                  {!isCardFlipped ? (
                    <div className="space-y-1">
                      <span className="text-2xl">🃏</span>
                      <p className="text-xs font-bold text-amber-900">Chạm để lật thẻ thông điệp hôm nay</p>
                      <p className="text-[10px] text-amber-700 italic">Bất ngờ đang đợi bạn</p>
                    </div>
                  ) : (
                    <div className="space-y-1 text-left">
                      <p className="text-xs font-black text-amber-900">{randomCardMessage.title}</p>
                      <p className="text-[11px] text-slate-700 leading-relaxed font-medium">“{randomCardMessage.message}”</p>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Luân phiên mỗi ngày</span>
            <button
              onClick={() => {
                const next = MINI_GAMES_POOL[(MINI_GAMES_POOL.indexOf(currentWYR) + 1) % MINI_GAMES_POOL.length];
                setCurrentWYR(next);
                setSelectedWYROption(null);
              }}
              className="text-amber-700 font-bold hover:underline cursor-pointer flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Đổi câu hỏi</span>
            </button>
          </div>
        </div>

        {/* CARD 2: 🌱 MỘT VIỆC NHỎ HÔM NAY (Micro task 1-5 mins) */}
        <div className="bg-white rounded-3xl p-6 border border-emerald-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-extrabold flex items-center gap-1.5">
                <span>🌱 Một việc nhỏ hôm nay</span>
              </span>
              <span className="text-[11px] font-bold text-emerald-700">
                {currentTask.duration}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-2">
              <div className="flex items-center gap-2.5">
                <span className="text-3xl">{currentTask.icon}</span>
                <h4 className="text-sm font-black text-slate-900 leading-snug">
                  {currentTask.title}
                </h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {currentTask.description}
              </p>
            </div>

            <button
              onClick={handleDoneTask}
              disabled={isTaskDone}
              className={`w-full py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all ${
                isTaskDone
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm active:scale-98'
              }`}
            >
              {isTaskDone ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Đã xong rồi! Tuyệt lắm ✨</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>✓ Xong rồi</span>
                </>
              )}
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Không phạt • Không áp lực</span>
            <button
              onClick={() => {
                const next = MICRO_TASKS_POOL[(MICRO_TASKS_POOL.indexOf(currentTask) + 1) % MICRO_TASKS_POOL.length];
                setCurrentTask(next);
                setIsTaskDone(expData.completedTaskIds.includes(next.id));
              }}
              className="text-emerald-700 font-bold hover:underline cursor-pointer flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Nhiệm vụ khác</span>
            </button>
          </div>
        </div>

        {/* CARD 3: 🪞 NHÌN LẠI MỘT CHÚT (Short 1-question reflection) */}
        <div className="bg-white rounded-3xl p-6 border border-purple-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-extrabold flex items-center gap-1.5">
                <span>🪞 Nhìn lại một chút</span>
              </span>
              <span className="text-[11px] font-bold text-slate-500">
                1 câu hỏi thôi
              </span>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-black text-slate-900 leading-snug">
                “{currentReflection.question}”
              </h4>
              <p className="text-[11px] text-slate-500">
                {currentReflection.prompt}
              </p>

              <textarea
                value={reflectionAnswer}
                onChange={(e) => setReflectionAnswer(e.target.value)}
                rows={2}
                placeholder="Viết một dòng ngắn thôi cũng được..."
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-purple-400 bg-slate-50 resize-none"
              />

              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={handleSaveReflection}
                  disabled={!reflectionAnswer.trim() || reflectionSaved}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    reflectionSaved
                      ? 'bg-purple-200 text-purple-900'
                      : 'bg-purple-600 hover:bg-purple-700 text-white shadow-2xs'
                  }`}
                >
                  {reflectionSaved ? 'Đã lưu vào nhật ký ✨' : 'Lưu vào nhật ký 📖'}
                </button>
                <span className="text-[10px] text-slate-400 italic">Hoặc chỉ cần nghĩ trong đầu</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Không chấm điểm</span>
            <button
              onClick={() => onGoToJournal()}
              className="text-purple-700 font-bold hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>Xem nhật ký</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* CARD 4: 🧠 NÃO NGHĨ GÌ? (Brain question) */}
        <div className="bg-white rounded-3xl p-6 border border-sky-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-900 text-xs font-extrabold flex items-center gap-1.5">
                <span>🧠 Não nghĩ gì?</span>
              </span>
              <span className="text-[11px] font-bold text-sky-700">
                Góc suy nghĩ
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100 space-y-2">
              <h4 className="text-sm font-black text-slate-900 leading-snug">
                {brainThought.question}
              </h4>
              <p className="text-xs text-slate-600">
                {brainThought.followUp}
              </p>
            </div>

            <button
              onClick={() => onGoToChatbot(`Chào chatbot! Hôm nay mình thấy câu hỏi này thú vị nè: "${brainThought.question}". Bạn nghĩ sao?`)}
              className="w-full py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Bàn luận chuyện này với Chatbot</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Không có đáp án sai</span>
            <span className="text-sky-600 font-bold">Thử nhìn khác đi</span>
          </div>
        </div>

        {/* CARD 5: 👀 CHUYỆN NÀY THÌ SAO? (Teen dilemma scenario) */}
        <div className="bg-white rounded-3xl p-6 border border-teal-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-900 text-xs font-extrabold flex items-center gap-1.5">
                <span>👀 Chuyện này thì sao?</span>
              </span>
              <span className="text-[11px] font-bold text-slate-500">
                Tình huống teen
              </span>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs sm:text-sm font-black text-slate-900">
                {currentScenario.title}
              </h4>
              <div className="space-y-1.5">
                {currentScenario.options.map(opt => (
                  <button
                    key={opt.label}
                    onClick={() => setScenarioAnswer(opt.label)}
                    className={`w-full p-2 text-left rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      scenarioAnswer === opt.label
                        ? 'bg-teal-50 border-teal-400 text-teal-950 font-bold'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span className="font-black text-teal-600 mr-1.5">[{opt.label}]</span>
                    <span>{opt.text}</span>
                  </button>
                ))}
              </div>

              {scenarioAnswer && (
                <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200 text-xs animate-in fade-in">
                  <p className="font-extrabold text-teal-900 text-[11px]">
                    {currentScenario.options.find(o => o.label === scenarioAnswer)?.reaction}
                  </p>
                  <p className="text-slate-600 text-[11px] pt-0.5">
                    {currentScenario.options.find(o => o.label === scenarioAnswer)?.advice}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Tình huống đời thật</span>
            <span className="text-teal-700 font-bold">Không phán xét</span>
          </div>
        </div>

        {/* CARD 6: 🫠 GÓC "HÔM NAY MỆT QUÁ" (Low energy unwind) */}
        <div className="bg-gradient-to-br from-slate-50 to-rose-50/50 rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-slate-200 text-slate-800 text-xs font-extrabold flex items-center gap-1.5">
                <span>🫠 Hôm nay mệt quá</span>
              </span>
              <span className="text-[11px] font-bold text-rose-500">
                0% áp lực
              </span>
            </div>

            <div className="text-center space-y-3 py-1">
              <p className="text-xs font-semibold text-slate-700">
                Không cần làm gì cả. Chỉ cần hít thở cùng vòng tròn này:
              </p>

              {/* Breathing Circle */}
              <div className="flex flex-col items-center justify-center py-2">
                <div
                  onClick={() => setIsBreathingActive(!isBreathingActive)}
                  className={`w-24 h-24 rounded-full flex flex-col items-center justify-center transition-all duration-1000 cursor-pointer shadow-md ${
                    isBreathingActive
                      ? breathPhase === 'in'
                        ? 'scale-115 bg-rose-400 text-white'
                        : breathPhase === 'hold'
                        ? 'scale-115 bg-amber-400 text-slate-900'
                        : 'scale-90 bg-emerald-400 text-white'
                      : 'bg-white text-slate-700 hover:scale-105'
                  }`}
                >
                  <Wind className="w-5 h-5 mb-1" />
                  <span className="text-[11px] font-black uppercase tracking-wider">
                    {!isBreathingActive
                      ? 'Chạm để thở'
                      : breathPhase === 'in'
                      ? 'Hít vào...'
                      : breathPhase === 'hold'
                      ? 'Giữ nhẹ...'
                      : 'Thở ra...'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 italic pt-2">
                  {isBreathingActive ? 'Lặp lại 4s nhịp thở êm dịu' : 'Bấm vào vòng tròn để bắt đầu'}
                </span>
              </div>

              <p className="text-[11px] text-slate-600 italic bg-white/80 p-2 rounded-xl border border-slate-100">
                “Hôm nay không cần productive. Sống sót qua một ngày mệt mỏi đã là một chiến thắng lớn rồi.”
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
            <span>Chăm sóc pin tinh thần</span>
            <button
              onClick={() => onGoToChatbot("Hôm nay mình mệt quá, chỉ muốn ngồi im một chút thôi...", "listen")}
              className="text-rose-600 font-bold hover:underline cursor-pointer"
            >
              Chỉ cần người nghe 🫂
            </button>
          </div>
        </div>

      </div>

      {/* 🏆 GENTLE BADGES MODAL */}
      {showBadgesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-rose-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-black text-slate-900">
                  Huy hiệu nhẹ nhàng
                </h3>
              </div>
              <button
                onClick={() => setShowBadgesModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Không bảng xếp hạng, không ganh đua, không ép đăng nhập mỗi ngày. Đây chỉ là những cột mốc dịu dàng ghi nhận bạn đã dành thời gian cho chính mình.
            </p>

            <div className="space-y-2.5 pt-1">
              {INITIAL_BADGES.map((b) => {
                const isUnlocked = !!expData.earnedBadges?.[b.id];
                return (
                  <div
                    key={b.id}
                    className={`p-3 rounded-2xl border flex items-center gap-3 transition-all ${
                      isUnlocked
                        ? 'bg-amber-50/80 border-amber-200 text-slate-900'
                        : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                    }`}
                  >
                    <span className="text-2xl">{b.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black">{b.name}</h4>
                        {isUnlocked && (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                            Đã nhận ✓
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 leading-tight pt-0.5">
                        {b.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
              <button
                onClick={() => setShowClearConfirm(true)}
                className="text-red-500 hover:text-red-600 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa dữ liệu & làm mới</span>
              </button>
              <button
                onClick={() => setShowBadgesModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-white font-bold cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ⚠️ CLEAR DATA CONFIRMATION MODAL */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-red-100 space-y-4">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto text-xl">
                🗑️
              </div>
              <h3 className="text-base font-black text-slate-900">
                Xóa lịch sử & làm mới?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Hành động này sẽ xóa các ghi nhớ tạm thời trên máy bạn (lịch sử chat, huy hiệu, nhật ký nháp). Dữ liệu cá nhân của bạn hoàn toàn nằm trong quyền kiểm soát của bạn.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => {
                  clearAllUserData();
                  setShowClearConfirm(false);
                  setShowBadgesModal(false);
                  window.location.reload();
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs cursor-pointer"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
