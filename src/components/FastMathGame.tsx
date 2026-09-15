import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Check, 
  X, 
  RotateCcw, 
  Trophy, 
  Clock, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Play, 
  Minus, 
  Plus,
  Flame
} from 'lucide-react';
import { 
  MathQuestion, 
  generateMathQuestion, 
  getTimeLimitForScore, 
  playSound 
} from '../utils/mathGameUtils';
import { useAuth } from '../context/AuthContext';

const BEST_SCORE_STORAGE_KEY = 'fast_math_best_score';
const SOUND_SETTING_STORAGE_KEY = 'fast_math_sound_enabled';

export const FastMathGame: React.FC = () => {
  const { user, token } = useAuth();

  // Widget Open/Collapse state
  const [isOpen, setIsOpen] = useState(false);

  // Sound preference (default is false/muted as requested)
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem(SOUND_SETTING_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // Game state
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [score, setScore] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(BEST_SCORE_STORAGE_KEY);
      return stored ? parseInt(stored, 10) || 0 : 0;
    } catch {
      return 0;
    }
  });

  const [currentQuestion, setCurrentQuestion] = useState<MathQuestion | null>(null);
  const [lastQuestion, setLastQuestion] = useState<MathQuestion | null>(null);
  const [gameOverReason, setGameOverReason] = useState<'wrong_answer' | 'timeout' | null>(null);
  const [isNewRecord, setIsNewRecord] = useState<boolean>(false);
  const [justScoredAnim, setJustScoredAnim] = useState<boolean>(false);
  const [cardShake, setCardShake] = useState<boolean>(false);

  // Timer state
  const [timeLeft, setTimeLeft] = useState<number>(5.0);
  const [timeLimit, setTimeLimit] = useState<number>(5.0);

  // Synchronization refs for instant, single-instance execution
  const timerRafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const durationMsRef = useRef<number>(5000);
  const isSubmittingRef = useRef<boolean>(false);
  const gameStateRef = useRef<'idle' | 'playing' | 'gameover'>('idle');
  const scoreRef = useRef<number>(0);
  const bestScoreRef = useRef<number>(bestScore);

  gameStateRef.current = gameState;
  scoreRef.current = score;
  bestScoreRef.current = bestScore;

  // Toggle sound
  const toggleSound = () => {
    setIsSoundEnabled(prev => {
      const next = !prev;
      try {
        localStorage.setItem(SOUND_SETTING_STORAGE_KEY, String(next));
      } catch {}
      return next;
    });
  };

  // Safe sound trigger
  const triggerSound = useCallback((type: 'correct' | 'wrong' | 'best' | 'start') => {
    if (isSoundEnabled) {
      playSound(type);
    }
  }, [isSoundEnabled]);

  // Load and sync Best Score with user account & localStorage
  useEffect(() => {
    const userKey = user?.id ? `${BEST_SCORE_STORAGE_KEY}_${user.id}` : BEST_SCORE_STORAGE_KEY;
    try {
      const localVal = localStorage.getItem(userKey) || localStorage.getItem(BEST_SCORE_STORAGE_KEY);
      if (localVal) {
        const parsed = parseInt(localVal, 10) || 0;
        if (parsed > bestScore) {
          setBestScore(parsed);
          bestScoreRef.current = parsed;
        }
      }
    } catch {}

    // Fetch from server if logged in
    if (token) {
      fetch('/api/user/fast-math-best', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data?.success && typeof data.bestScore === 'number') {
            setBestScore(prev => {
              const maxVal = Math.max(prev, data.bestScore);
              bestScoreRef.current = maxVal;
              try {
                localStorage.setItem(BEST_SCORE_STORAGE_KEY, String(maxVal));
                if (user?.id) localStorage.setItem(`${BEST_SCORE_STORAGE_KEY}_${user.id}`, String(maxVal));
              } catch {}
              return maxVal;
            });
          }
        })
        .catch(() => {});
    }
  }, [token, user?.id]);

  // Save new best score
  const persistBestScore = useCallback((newBest: number) => {
    setBestScore(newBest);
    bestScoreRef.current = newBest;
    try {
      localStorage.setItem(BEST_SCORE_STORAGE_KEY, String(newBest));
      if (user?.id) {
        localStorage.setItem(`${BEST_SCORE_STORAGE_KEY}_${user.id}`, String(newBest));
      }
    } catch {}

    if (token) {
      fetch('/api/user/fast-math-best', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ bestScore: newBest })
      }).catch(() => {});
    }
  }, [token, user?.id]);

  // Clean timer RAF
  const clearTimer = useCallback(() => {
    if (timerRafRef.current !== null) {
      cancelAnimationFrame(timerRafRef.current);
      timerRafRef.current = null;
    }
  }, []);

  // Trigger Game Over
  const triggerGameOver = useCallback((reason: 'wrong_answer' | 'timeout') => {
    clearTimer();
    isSubmittingRef.current = false;
    setGameState('gameover');
    setGameOverReason(reason);
    setCardShake(true);
    setTimeout(() => setCardShake(false), 400);
    triggerSound('wrong');
  }, [clearTimer, triggerSound]);

  // Start continuous single timer for a question
  const startQuestionTimer = useCallback((seconds: number) => {
    clearTimer();
    setTimeLimit(seconds);
    setTimeLeft(seconds);
    durationMsRef.current = seconds * 1000;
    startTimeRef.current = performance.now();

    const tick = () => {
      if (gameStateRef.current !== 'playing') return;

      const elapsed = performance.now() - startTimeRef.current;
      const remainingMs = Math.max(0, durationMsRef.current - elapsed);
      const remainingSec = remainingMs / 1000;

      setTimeLeft(remainingSec);

      if (remainingMs <= 0) {
        // Time ran out!
        triggerGameOver('timeout');
      } else {
        timerRafRef.current = requestAnimationFrame(tick);
      }
    };

    timerRafRef.current = requestAnimationFrame(tick);
  }, [clearTimer, triggerGameOver]);

  // Start / Restart game
  const handleStartGame = useCallback(() => {
    clearTimer();
    isSubmittingRef.current = false;
    setScore(0);
    scoreRef.current = 0;
    setIsNewRecord(false);
    setGameOverReason(null);

    const firstQuestion = generateMathQuestion();
    setCurrentQuestion(firstQuestion);
    setLastQuestion(firstQuestion);
    setGameState('playing');

    triggerSound('start');

    // Initial time is 5.0 seconds
    const initialTime = getTimeLimitForScore(0);
    startQuestionTimer(initialTime);
  }, [clearTimer, startQuestionTimer, triggerSound]);

  // Answer handler (Đúng / Sai) - CONTINUOUS GAMEPLAY LOOP
  const handleAnswer = useCallback((playerChoice: boolean) => {
    // Prevent double clicking or action when not in playing state
    if (isSubmittingRef.current || gameStateRef.current !== 'playing' || !currentQuestion) {
      return;
    }
    isSubmittingRef.current = true;

    // Is the player's choice correct?
    const isCorrect = (playerChoice === currentQuestion.isCorrect);

    if (isCorrect) {
      // 1. Correct sound
      triggerSound('correct');

      // 2. Score increment
      const nextScore = scoreRef.current + 1;
      setScore(nextScore);
      scoreRef.current = nextScore;

      // 3. Quick +1 visual pop
      setJustScoredAnim(true);
      setTimeout(() => setJustScoredAnim(false), 300);

      // 4. Check Best Score record
      if (nextScore > bestScoreRef.current) {
        if (!isNewRecord) {
          setIsNewRecord(true);
          triggerSound('best');
        }
        persistBestScore(nextScore);
      }

      // 5. Generate NEXT equation IMMEDIATELY with no delays or loading
      const nextQuestion = generateMathQuestion(currentQuestion.equationString);
      setCurrentQuestion(nextQuestion);
      setLastQuestion(nextQuestion);

      // 6. Calculate next question duration based on updated score
      const nextDuration = getTimeLimitForScore(nextScore);

      // 7. Restart timer immediately
      startQuestionTimer(nextDuration);

      // 8. Unlock click handler
      isSubmittingRef.current = false;
    } else {
      // Wrong answer -> Stop timer and Game Over instantly!
      setLastQuestion(currentQuestion);
      triggerGameOver('wrong_answer');
    }
  }, [currentQuestion, isNewRecord, persistBestScore, startQuestionTimer, triggerGameOver, triggerSound]);

  // Keyboard controls listener (D: Đúng, S: Sai, Space/Enter: Bắt đầu / Chơi lại)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input field anywhere on the site
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') return;

      if (gameState === 'playing') {
        if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowLeft') {
          e.preventDefault();
          handleAnswer(true);
        } else if (e.key === 's' || e.key === 'S' || e.key === 'ArrowRight') {
          e.preventDefault();
          handleAnswer(false);
        }
      } else if (gameState === 'idle' || gameState === 'gameover') {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          handleStartGame();
        }
      }

      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, gameState, handleAnswer, handleStartGame]);

  // Clean up timer on unmount or when closed
  useEffect(() => {
    if (!isOpen) {
      clearTimer();
      if (gameState === 'playing') {
        setGameState('idle');
      }
    }
    return () => {
      clearTimer();
    };
  }, [isOpen, clearTimer, gameState]);

  // Timer percentage for progress bar
  const timerPercent = Math.max(0, Math.min(100, (timeLeft / timeLimit) * 100));
  const isTimeUrgent = timeLeft <= 1.2;

  return (
    <div className="fixed bottom-5 left-5 z-40 flex flex-col items-start select-none">
      
      {/* 1. Main Game Card Popover (shown when isOpen) */}
      {isOpen && (
        <div 
          id="fast-math-card"
          className={`mb-3 w-[92vw] max-w-[340px] sm:w-[350px] bg-[#FFFDF9] rounded-3xl shadow-2xl border-2 border-amber-200/90 overflow-hidden flex flex-col transition-all duration-200 backdrop-blur-md animate-in fade-in slide-in-from-bottom-3 ${
            cardShake ? 'animate-bounce' : ''
          }`}
        >
          {/* Card Header */}
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-4 py-3 text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-xl">🧠</span>
              <div>
                <h3 className="font-black text-sm tracking-wide leading-tight">Phép tính nhanh</h3>
                <p className="text-[10.5px] text-amber-100 font-medium leading-none">Phản xạ phép tính liên tục</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Sound toggle button */}
              <button
                type="button"
                onClick={toggleSound}
                className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
                title={isSoundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
              >
                {isSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 opacity-75" />}
              </button>

              {/* Close Button (−) */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Thu nhỏ mini game"
              >
                <Minus className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </div>

          {/* Subheader: Score & Best Score bar */}
          <div className="bg-[#FAF3E7] px-4 py-2 border-b border-amber-200/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-extrabold text-[#3B2A1E]">
              <span className="text-amber-800">Score:</span>
              <span className="text-base font-black text-orange-600 relative">
                {score}
                {justScoredAnim && (
                  <span className="absolute -top-3.5 -right-3.5 text-[11px] font-black text-emerald-600 animate-ping">
                    +1
                  </span>
                )}
              </span>
            </div>

            <div className="flex items-center gap-1.5 font-semibold text-[#6C5343]">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>Best:</span>
              <span className="font-black text-amber-700">{bestScore}</span>
              {isNewRecord && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[9.5px] font-black animate-pulse">
                  KỶ LỤC!
                </span>
              )}
            </div>
          </div>

          {/* Card Body */}
          <div className="p-4 sm:p-5 flex flex-col items-center justify-center min-h-[220px]">

            {/* STATE 1: IDLE / START SCREEN */}
            {gameState === 'idle' && (
              <div className="w-full flex flex-col items-center text-center space-y-4 py-2">
                <div className="w-14 h-14 rounded-2xl bg-amber-100/90 text-amber-700 flex items-center justify-center text-2xl shadow-inner border border-amber-200">
                  ⚡
                </div>

                <div>
                  <h4 className="font-black text-lg text-[#2A1F18]">Phép tính nhanh</h4>
                  <p className="text-xs text-[#7A6455] italic mt-0.5">Bạn đúng được bao nhiêu câu?</p>
                </div>

                <div className="w-full bg-[#FAF3E7] rounded-2xl p-2.5 border border-amber-200/50 text-[11.5px] text-[#5C4231] space-y-1">
                  <div className="flex items-center justify-between font-semibold">
                    <span>⏱ Thời gian bắt đầu:</span>
                    <span className="font-bold text-amber-700">5.0 giây/câu</span>
                  </div>
                  <div className="flex items-center justify-between text-[#8A6A55] text-[11px]">
                    <span>Càng đúng nhiều:</span>
                    <span className="font-bold text-orange-600">Thời gian càng giảm</span>
                  </div>
                </div>

                <button
                  type="button"
                  id="fast-math-start-btn"
                  onClick={handleStartGame}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:opacity-95 text-white font-black text-base shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Bắt đầu</span>
                </button>

                <p className="text-[10px] text-[#A38A78]">
                  Mẹo: Nhấn <span className="font-bold text-[#5C4231]">[D]</span> cho Đúng, <span className="font-bold text-[#5C4231]">[S]</span> cho Sai
                </p>
              </div>
            )}

            {/* STATE 2: PLAYING SCREEN (CONTINUOUS GAMEPLAY) */}
            {gameState === 'playing' && currentQuestion && (
              <div className="w-full flex flex-col items-center space-y-4">
                
                {/* Timer Bar & Countdown */}
                <div className="w-full space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-[#5C4231]">
                    <div className="flex items-center gap-1">
                      <Clock className={`w-3.5 h-3.5 ${isTimeUrgent ? 'text-rose-600 animate-spin' : 'text-amber-600'}`} />
                      <span className="text-[11px]">Thời gian</span>
                    </div>
                    <span className={`font-mono text-sm font-black ${isTimeUrgent ? 'text-rose-600 animate-pulse' : 'text-[#3B2A1E]'}`}>
                      ⏱ {timeLeft.toFixed(1)}s
                    </span>
                  </div>

                  <div className="w-full h-2.5 bg-amber-100 rounded-full overflow-hidden border border-amber-200/60 p-0.5">
                    <div 
                      className={`h-full rounded-full transition-all duration-75 ${
                        isTimeUrgent ? 'bg-gradient-to-r from-rose-500 to-red-600' : 'bg-gradient-to-r from-amber-500 to-orange-500'
                      }`}
                      style={{ width: `${timerPercent}%` }}
                    />
                  </div>
                </div>

                {/* Big Math Equation */}
                <div className="w-full py-4 px-2 my-1 bg-white/95 rounded-2xl border-2 border-amber-200/80 shadow-sm flex items-center justify-center">
                  <span className="text-3xl sm:text-4xl font-black text-[#2A1F18] tracking-wider font-mono">
                    {currentQuestion.equationString}
                  </span>
                </div>

                {/* Two Large Action Buttons (Đúng / Sai) */}
                <div className="w-full grid grid-cols-2 gap-3 pt-1">
                  {/* Đúng Button */}
                  <button
                    type="button"
                    id="fast-math-btn-correct"
                    onClick={() => handleAnswer(true)}
                    className="py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-black text-base sm:text-lg shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Check className="w-5 h-5 stroke-[3]" />
                    <span>Đúng</span>
                  </button>

                  {/* Sai Button */}
                  <button
                    type="button"
                    id="fast-math-btn-wrong"
                    onClick={() => handleAnswer(false)}
                    className="py-3.5 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-black text-base sm:text-lg shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <X className="w-5 h-5 stroke-[3]" />
                    <span>Sai</span>
                  </button>
                </div>

                {/* Hotkey hint */}
                <div className="text-[10px] text-[#A38A78] flex items-center gap-2">
                  <span>Phím: <b>[D]</b> Đúng • <b>[S]</b> Sai</span>
                  {score >= 10 && (
                    <span className="text-orange-600 font-bold flex items-center gap-0.5">
                      <Flame className="w-3 h-3" /> Cấp tốc độ!
                    </span>
                  )}
                </div>

              </div>
            )}

            {/* STATE 3: GAME OVER SCREEN */}
            {gameState === 'gameover' && (
              <div className="w-full flex flex-col items-center text-center space-y-3.5 py-1">
                
                {/* Icon & Title */}
                <div className="space-y-1">
                  <div className="text-3xl">
                    {gameOverReason === 'timeout' ? '⏰' : '💥'}
                  </div>
                  <h4 className="font-black text-lg text-rose-600">
                    {gameOverReason === 'timeout' ? 'Hết giờ!' : 'GAME OVER'}
                  </h4>
                  <p className="text-xs text-[#7A6455]">
                    {gameOverReason === 'timeout' 
                      ? 'Thời gian suy nghĩ đã hết rồi!' 
                      : 'Bạn đã chọn sai đáp án!'}
                  </p>
                </div>

                {/* Last Equation Explanation */}
                {lastQuestion && (
                  <div className="w-full bg-[#FAF3E7] p-2.5 rounded-2xl border border-amber-200/70 text-xs">
                    <div className="font-mono font-bold text-sm text-[#2A1F18]">
                      {lastQuestion.equationString}
                    </div>
                    <div className="mt-1 text-[11px] text-[#8A5A40]">
                      Đáp án đúng: <span className="font-extrabold text-[#3B2A1E]">{lastQuestion.isCorrect ? 'Đúng' : 'Sai'}</span>
                      <div className="text-[10.5px] text-[#7A6455] italic">({lastQuestion.explanation})</div>
                    </div>
                  </div>
                )}

                {/* Score Summary Box */}
                <div className="w-full bg-white rounded-2xl p-3 border border-amber-200 shadow-sm flex items-center justify-around">
                  <div>
                    <div className="text-[10.5px] text-[#8C6D58] font-bold">Điểm của bạn</div>
                    <div className="text-2xl font-black text-orange-600">{score}</div>
                  </div>
                  <div className="w-px h-8 bg-amber-200" />
                  <div>
                    <div className="text-[10.5px] text-[#8C6D58] font-bold flex items-center gap-1">
                      <Trophy className="w-3 h-3 text-amber-500" />
                      <span>Best Score</span>
                    </div>
                    <div className="text-2xl font-black text-amber-700">{bestScore}</div>
                  </div>
                </div>

                {/* New Record Banner if applicable */}
                {isNewRecord && (
                  <div className="w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-300 text-amber-800 text-xs font-black flex items-center justify-center gap-1.5 animate-pulse">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>XUẤT SẮC! KỶ LỤC MỚI CỦA BẠN!</span>
                  </div>
                )}

                {/* Chơi lại Button */}
                <button
                  type="button"
                  id="fast-math-restart-btn"
                  onClick={handleStartGame}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:opacity-95 text-white font-black text-base shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 stroke-[2.5]" />
                  <span>Chơi lại</span>
                </button>

                <p className="text-[10px] text-[#A38A78]">
                  Nhấn <span className="font-bold text-[#5C4231]">[Space]</span> hoặc <span className="font-bold text-[#5C4231]">[Enter]</span> để chơi lại ngay
                </p>
              </div>
            )}

          </div>

          {/* Footer note */}
          <div className="bg-[#FAF3E7] px-4 py-1.5 border-t border-amber-200/50 text-[10px] text-[#A38A78] text-center">
            Càng đúng nhiều, thời gian càng rút ngắn (nhanh nhất 1.0s/câu)
          </div>
        </div>
      )}

      {/* 2. Floating Toggle Button (Fixed at bottom-left) */}
      <button
        type="button"
        id="fast-math-toggle-btn"
        onClick={() => setIsOpen(prev => !prev)}
        className={`group relative flex items-center justify-center rounded-full shadow-xl transition-all duration-200 active:scale-95 cursor-pointer backdrop-blur-md ${
          isOpen 
            ? 'w-10 h-10 bg-amber-100/95 border-2 border-amber-300 text-amber-800 hover:bg-amber-200' 
            : 'w-12 h-12 sm:w-13 sm:h-13 bg-white/95 border-2 border-amber-300 text-amber-600 hover:border-amber-400 hover:scale-105 hover:shadow-2xl'
        }`}
        title={isOpen ? 'Đóng mini game' : 'Mở mini game 🧠 Phép tính nhanh'}
        aria-label={isOpen ? 'Đóng mini game' : 'Mở mini game Phép tính nhanh'}
      >
        {isOpen ? (
          <Minus className="w-5 h-5 stroke-[3]" />
        ) : (
          <>
            <Plus className="w-6 h-6 stroke-[3]" />
            {/* Cute Brain Badge */}
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full flex items-center justify-center text-[10.5px] shadow-sm border border-white">
              🧠
            </span>
            {/* Tooltip on Desktop hover */}
            <span className="absolute left-full ml-3 px-2.5 py-1 bg-[#2A1F18] text-white text-xs font-bold rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md hidden sm:block">
              🧠 Phép tính nhanh
            </span>
          </>
        )}
      </button>

    </div>
  );
};
