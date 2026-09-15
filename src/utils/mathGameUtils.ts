// Fast Math Reflex Game Utility Functions & Audio Synthesizer

export interface MathQuestion {
  id: string;
  num1: number;
  num2: number;
  operator: '+' | '-';
  trueResult: number;
  displayedResult: number;
  isCorrect: boolean; // true if displayedResult === trueResult
  equationString: string;
  explanation: string;
}

/**
 * Difficulty time scaling based on current score in the active game.
 * 0–9:   5.0s
 * 10–19: 4.5s
 * 20–29: 4.0s
 * 30–39: 3.5s
 * 40–49: 3.0s
 * 50–59: 2.5s
 * 60–69: 2.0s
 * 70–79: 1.5s
 * 80+:   1.0s (maximum speed limit, never below 1.0s)
 */
export function getTimeLimitForScore(score: number): number {
  if (score < 10) return 5.0;
  if (score < 20) return 4.5;
  if (score < 30) return 4.0;
  if (score < 40) return 3.5;
  if (score < 50) return 3.0;
  if (score < 60) return 2.5;
  if (score < 70) return 2.0;
  if (score < 80) return 1.5;
  return 1.0;
}

/**
 * Generates an equation following strict constraints:
 * - Only + and -
 * - No multiplication, division, fractions, decimals, or negative numbers
 * - True result strictly within [0, 20]
 * - Balanced 50/50 True vs False answers
 * - Plausible false answers (close delta, within [0, 20])
 * - Avoid repeating the exact previous equation
 */
export function generateMathQuestion(lastEquationKey?: string): MathQuestion {
  for (let attempt = 0; attempt < 50; attempt++) {
    // 50% addition, 50% subtraction
    const isAddition = Math.random() < 0.5;
    let num1: number;
    let num2: number;
    let trueResult: number;
    let operator: '+' | '-';

    if (isAddition) {
      operator = '+';
      // True result between 0 and 20
      trueResult = Math.floor(Math.random() * 21); // 0 to 20
      num1 = Math.floor(Math.random() * (trueResult + 1));
      num2 = trueResult - num1;
    } else {
      operator = '-';
      num1 = Math.floor(Math.random() * 21); // 0 to 20
      num2 = Math.floor(Math.random() * (num1 + 1)); // 0 to num1
      trueResult = num1 - num2;
    }

    // 50% chance displayed answer is correct, 50% false
    const willBeCorrect = Math.random() < 0.5;
    let displayedResult = trueResult;

    if (!willBeCorrect) {
      // Plausible offsets: ±1, ±2, ±3, ±4
      const potentialOffsets = [-1, 1, -2, 2, -3, 3, -4, 4];
      const validOffsets = potentialOffsets.filter(
        d => trueResult + d >= 0 && trueResult + d <= 20
      );

      if (validOffsets.length > 0) {
        // Pick random plausible offset
        const chosenOffset = validOffsets[Math.floor(Math.random() * validOffsets.length)];
        displayedResult = trueResult + chosenOffset;
      } else {
        // Fallback offset
        displayedResult = trueResult === 0 ? 1 : (trueResult === 20 ? 19 : trueResult + 1);
      }
    }

    const equationKey = `${num1}${operator}${num2}=${displayedResult}`;
    if (equationKey !== lastEquationKey || attempt > 25) {
      const isCorrect = displayedResult === trueResult;
      const equationString = `${num1} ${operator} ${num2} = ${displayedResult}`;
      const explanation = isCorrect
        ? `${num1} ${operator} ${num2} = ${trueResult} là ĐÚNG`
        : `${num1} ${operator} ${num2} = ${trueResult} (không phải ${displayedResult})`;

      return {
        id: `math_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        num1,
        num2,
        operator,
        trueResult,
        displayedResult,
        isCorrect,
        equationString,
        explanation
      };
    }
  }

  // Guaranteed safe fallback
  return {
    id: `math_${Date.now()}`,
    num1: 7,
    num2: 5,
    operator: '+',
    trueResult: 12,
    displayedResult: 13,
    isCorrect: false,
    equationString: '7 + 5 = 13',
    explanation: '7 + 5 = 12 (không phải 13)'
  };
}

// ----------------------------------------------------------------------------
// Audio Synthesis (Web Audio API - No external assets required)
// ----------------------------------------------------------------------------
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!audioCtx && AudioCtxClass) {
      audioCtx = new AudioCtxClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  } catch {
    return null;
  }
}

export function playSound(type: 'correct' | 'wrong' | 'best' | 'start') {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    if (type === 'correct') {
      // Crisp, friendly "ting" bell
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08); // A5

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.16);
    } else if (type === 'wrong') {
      // Low subtle buzz
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(140, now + 0.25);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.29);
    } else if (type === 'best') {
      // Small celebratory arpeggio
      const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = now + idx * 0.07;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.22);
      });
    } else if (type === 'start') {
      // Upbeat ready-go tone
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.12);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.19);
    }
  } catch {
    // Graceful fallback if audio is disabled by browser policies
  }
}
