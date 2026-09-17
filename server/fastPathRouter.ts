/**
 * Fast Path Decision Engine for Teen Chatbot "Bạn ơi, mình nói nè"
 * 
 * Strict Decision Hierarchy:
 * 1. SAFETY MODE: Highest priority - critical danger / distress
 * 2. CONCRETE REQUEST: Specific questions, tasks, help requests -> NORMAL AI
 * 3. EMOTIONAL / PROBLEM SIGNAL: Sadness, anxiety, fear, exhaustion, conflict -> NORMAL AI
 * 4. CONTEXT MODE: Ambiguous, continuation of ongoing issue -> CONTEXT MODE
 * 5. FAST PATH: Simple greetings, calls, reactions, thanks, goodbyes, confirmations -> FAST PATH
 * 6. ELSE: NORMAL AI / CONTEXT MODE
 */

export type DecisionType = 'SAFETY' | 'NORMAL_AI' | 'CONTEXT_MODE' | 'FAST_PATH';

export type FastPathCategory =
  | 'greeting'
  | 'call'
  | 'reaction'
  | 'thanks'
  | 'goodbye'
  | 'acknowledgment';

export interface DecisionResult {
  decision: DecisionType;
  category?: FastPathCategory;
  reason?: string;
  response?: string;
  isCorrection?: boolean;
  isAnsweringQuestion?: boolean;
  isTopicSwitch?: boolean;
  isAdviceRequest?: boolean;
  isClarificationRequest?: boolean;
}

export interface ChatMessageContext {
  role: string;
  content: string;
}

// 1. SAFETY SIGNALS (🚨 Priority 1)
const SAFETY_PATTERNS = [
  /t[ựu]\s*t[ửu]/i,
  /mu[ốo]n\s*ch[ếe]t/i,
  /t[ựu]\s*h[ạa]i/i,
  /r[ạa]ch\s*tay/i,
  /u[ốo]ng\s*thu[ốo]c\s*(ng[ủu]|s[âa]u|chu[ộo]t)/i,
  /k[ếe]t\s*th[úu]c\s*cu[ộo]c\s*s[ốo]ng/i,
  /kh[ôo]ng\s*mu[ốo]n\s*s[ốo]ng/i,
  /ch[ếe]t\s*đi\s*cho\s*xong/i,
  /c[ứu]u\s*(tui|m[ìi]nh|em|tao)/i,
  /(tui|m[ìi]nh|em)\s*mu[ốo]n\s*bi[ếe]n\s*m[ấa]t/i,
  /mu[ốo]n\s*bi[ếe]n\s*m[ấa]t\s*kh[ỏo]i\s*th[ếe]\s*gi[ớo]i/i,
  /nh[ảa]y\s*(c[ầa]u|l[ầa]u)/i,
  /kh[ôo]ng\s*thi[ếe]t\s*s[ốo]ng/i,
  /gi[ảa]i\s*tho[áa]t\s*kh[ỏo]i\s*cu[ộo]c\s*đ[ờo]i/i
];

// 2. CLARIFICATION & EXPLANATION SIGNALS (Section Lỗi 2: YÊU CẦU GIẢI THÍCH / LÀM RÕ)
// Explicit clarification phrases ("?", "là sao?", "ý là gì?", "sao cơ?", "giải thích đi", "tớ chưa hiểu", etc.)
export const CLARIFICATION_PATTERNS = [
  /^\?+$/,
  /^l[àa]\s*sao(\s*(c[ơo]|[áa]|v[ậa]y|ta|h[ảa]|nh[ỉi]|b[ạa]n|c[ậa]u|đ[óo]|n[èe]))?[\?!\.]*$/iu,
  /^[ýy]\s*(l[àa]\s*g[ìi]|c[ậa]u|b[ạa]n|l[àa]\s*sao|l[àa]\s*nh[ư\s]*\s*n[àa]o|l[àa]\s*th[ếe]\s*n[àa]o)[\?!\.]*$/iu,
  /^sao\s*(c[ơo]|d[ạa]|[áa]|nh[ỉi])[\?!\.]*$/iu,
  /^[ýy]\s*(c[ậa]u|b[ạa]n|m[ìi]nh)\s*l[àa]\s*(sao|g[ìi]|th[ếe]\s*n[àa]o|nh[ư\s]*\s*n[àa]o)[\?!\.]*$/iu,
  /^gi[ảa]i\s*th[íi]ch\s*(đi|h[ộo]|cho|r[õo]|l[ạa]i|h[ơo]n|xem)[\?!\.]*$/iu,
  /^(m[ìi]nh|t[ớo]|em|tui|tao)?\s*(ch[ư\s]*a|kh[ôo]ng|h[ổo]ng|h[ôo]ng|ko|ch[ảa]|ch[ẳa]ng)\s*hi[ểe]u(\s*(l[ắa]m|g[ìi]|h[ếe]t))?[\?!\.]*$/iu,
  /^c[ụu]\s*th[ểe]\s*(l[àa]\s*g[ìi]|h[ơo]n|l[àa]\s*sao|h[ơo]n\s*đi)[\?!\.]*$/iu,
  /^nh[ư\s]*ng\s*(t[ạa]i\s*sao|sao|sao\s*l[ạa]i\s*th[ếe]|sao\s*l[ạa]i\s*v[ậa]y)[\?!\.]*$/iu,
  /^sao\s*l[ạa]i\s*(th[ếe]|v[ậa]y|nh[ư\s]*\s*th[ếe]|nh[ư\s]*\s*v[ậa]y)[\?!\.]*$/iu,
  /^t[ạa]i\s*sao\s*(l[ạa]i\s*)?(th[ếe]|v[ậa]y)[\?!\.]*$/iu,
  /^ngh[ĩi]a\s*l[àa]\s*(sao|g[ìi])[\?!\.]*$/iu,
  /^n[óo]i\s*r[õo]\s*(h[ơo]n)?\s*(h[ộo]|đi|xem)?[\?!\.]*$/iu
];

// 3. CONCRETE REQUEST SIGNALS (🧠 Priority 3)
// Explicit advice-seeking phrases, direction requests, and practical guidance asks
export const ADVICE_SEEKING_PATTERNS = [
  /ph[ảa]i\s*l[àa]m\s*sao/iu,
  /n[êe]n\s*l[àa]m\s*g[ìi]/iu,
  /l[àa]m\s*g[ìi]\s*b[âa]y\s*gi[ờo]/iu,
  /gi[ờo]\s*(m[ìi]nh|t[ớo]|em|tao)\s*n[êe]n\s*l[àa]m\s*g[ìi]/iu,
  /gi[ờo]\s*sao\s*đ[âa]y/iu,
  /gi[ờo]\s*ph[ảa]i\s*sao/iu,
  /x[ửu]\s*l[ýy]\s*(th[ếe]\s*n[àa]o|sao|nh[ư\s]*\s*n[àa]o)/iu,
  /gi[ảa]i\s*quy[ếe]t\s*(sao|th[ếe]\s*n[àa]o|nh[ư\s]*\s*n[àa]o)/iu,
  /c[óo]\s*c[áa]ch\s*n[àa]o/iu,
  /t[íi]nh\s*sao\s*(đ[âa]y|gi[ờo])/iu,
  /n[êe]n\s*(l[àa]m|ch[ọo]n|n[óo]i|nh[ắa]n|x[ửu]\s*l[ýy]|h[ỏo]i)\s*(g[ìi]|sao|th[ếe]\s*n[àa]o)/iu,
  /cho\s*(m[ìi]nh|t[ớo]|em|tao)\s*(l[ờo]i\s*khuy[êe]n|h[ư\s]*[ớo]ng\s*gi[ảa]i\s*quy[ếe]t|c[áa]ch\s*gi[ảa]i\s*quy[ếe]t|g[ợo]i\s*[ýy])/iu
];

const CONCRETE_REQUEST_PATTERNS = [
  ...ADVICE_SEEKING_PATTERNS,
  /gi[úu]p\s*(tui|m[ìi]nh|em|tao)(\s*(l[àa]m|gi[ảa]i|ch[ọo]n|v[ớo]i|c[áa]i\s*n[àa]y))?/i,
  /ch[ỉi]\s*(tui|m[ìi]nh|em|tao)\s*(c[áa]ch|l[àa]m\s*sao|v[ớo]i)/i,
  /l[àa]m\s*sao\s*đ[ểe]/i,
  /l[àa]m\s*th[ếe]\s*n[àa]o\s*đ[ểe]/i,
  /h[ư\s]*[ớo]ng\s*d[ẫa]n/i,
  /ch[ọo]n\s*tr[ư\s]*[ờo]ng/i,
  /gi[ảa]i\s*(b[àa]i|to[áa]n|đ[ềe])/i,
  /b[àa]i\s*t[ậa]p/i,
  /ch[ỉi]\s*gi[áa]o/i,
  /b[àa]y\s*(tui|m[ìi]nh|em|tao)\s*c[áa]ch/i,
  /gi[úu]p\s*(tui|m[ìi]nh|em)\s*v[ớo]i/i,
  /c[óo]\s*th[ểe]\s*cho\s*(tui|m[ìi]nh)\s*l[ờo]i\s*khuy[êe]n/i,
  /h[ỏo]i\s*(t[íi]|c[áa]i\s*n[àa]y|chuy[ệe]n\s*n[àa]y)/i
];

// 3. EMOTIONAL OR PROBLEM SIGNALS (🧠 Priority 3)
// Notice: Use boundary checks (^|[^\p{L}]) and ([^\p{L}]|$) for short words like lo, sợ, mệt, buồn to prevent matching inside 'hello', 'alo', etc.
const EMOTION_PROBLEM_PATTERNS = [
  /(?:^|[^\p{L}])bu[ồo]n(?:\s*(?:qu[áa]|l[ắa]m|thiu|ng[ủu]))?(?:[^\p{L}]|$)/iu,
  /(?:^|[^\p{L}])ch[áa]n(?:\s*(?:qu[áa]|đ[ờo]i|n[ảa]n|ch[ư\s]*[ờo]ng))?(?:[^\p{L}]|$)/iu,
  /(?:^|[^\p{L}])m[ệe]t(?:\s*(?:qu[áa]|m[ỏo]i|l[ắa]m|nho[àa]i))?(?:[^\p{L}]|$)/iu,
  /ki[ệe]t\s*s[ứu]c/iu,
  /(?:^|[^\p{L}])s[ợo](?:\s*(?:qu[áa]|h[ãa]i))?(?:[^\p{L}]|$)/iu,
  /(?:^|[^\p{L}])lo(?:\s*(?:qu[áa]|l[ắa]ng|s[ốo]t\s*v[óo]|ngh[ĩi]))?(?:[^\p{L}]|$)/iu,
  /[áa]p\s*l[ựu]c/iu,
  /(?:^|[^\p{L}])stress(?:[^\p{L}]|$)/iu,
  /c[ăa]ng\s*th[ẳa]ng/iu,
  /b[ếe]\s*t[ắa]c/iu,
  /(?:^|[^\p{L}])t[ứu]c(?:\s*(?:qu[áa]|gi[ậa]n|đi[êe]n))?(?:[^\p{L}]|$)/iu,
  /b[ựu]c(\s*m[ìi]nh)?/iu,
  /cay\s*c[úu]/iu,
  /(?:^|[^\p{L}])kh[óo]c(?:\s*s[ư\s]*ng\s*m[ắa]t)?(?:[^\p{L}]|$)/iu,
  /r[ơo]i\s*n[ư\s]*[ớo]c\s*m[ắa]t/iu,
  /c[ãa]i\s*nhau/iu,
  /chia\s*tay/iu,
  /b[ịi]\s*(m[ắa]ng|ch[ửu]i|ph[ạa]t|t[ừu]\s*ch[ốo]i|t[ẩa]y\s*chay|c[ôo]\s*l[ậa]p|đ[áa]nh|b[ắa]t\s*n[ạa]t|l[ừu]a)/iu,
  /c[ôo]\s*đ[ơo]n/iu,
  /t[ủu]i\s*th[âa]n/iu,
  /t[ụu]t\s*mood/iu,
  /h[ụu]t\s*h[ẫa]ng/iu,
  /th[ấa]t\s*v[ọo]ng/iu,
  /b[ấa]t\s*l[ựu]c/iu,
  /đi[ểe]m\s*k[ée]m/iu,
  /r[ớo]t\s*m[ôo]n/iu,
  /thi\s*tr[ư\s]*[ợo]t/iu,
  /qu[áa]\s*t[ảa]i/iu,
  /qu[êe]\s*x[ệe]/iu,
  /ngh[ỉi]\s*ch[ơo]i/iu,
  /kh[ôo]ng\s*n[óo]i\s*chuy[ệe]n\s*n[ữư]a/iu,
  /crush\s*(kh[ôo]ng\s*rep|seen|th[íi]ch\s*ng[ư\s]*[ờo]i\s*kh[áa]c)/iu,
  /b[ốo]\s*m[ẹe]\s*(so\s*s[áa]nh|c[ấa]m|m[ắa]ng)/iu
];

// 4. CONTEXT / TOPIC CONTINUATION SIGNALS (🧠 Priority 4)
const CONTEXT_CONTINUATION_PATTERNS = [
  /^kh[ôo]ng\s*bi[ếe]t(\s*n[ữư]a)?$/i,
  /^ch[ẳa]ng\s*bi[ếe]t(\s*n[ữư]a)?$/i,
  /^ch[ảa]\s*bi[ếe]t(\s*n[ữư]a)?$/i,
  /kh[ôo]ng\s*bi[ếe]t\s*(t[ạa]i\s*sao|m[ìi]nh\s*b[ịi]\s*g[ìi])/i,
  /^sao\s*gi[ờo](\s*nh[ĩi])?$/i,
  /^sao\s*đ[âa]y$/i,
  /^th[ìi]\s*v[ậa]y\s*đ[óo]$/i,
  /^ừ\s*nh[ư\s]*ng\s*m[àa]/i,
  /^nh[ư\s]*ng\s*m[àa]/i,
  /^v[ậa]y\s*th[ìi]/i,
  /^th[ếe]\s*[àa]$/i,
  /^v[ậa]y\s*[áa]$/i,
  /^th[ậa]t\s*[áa]$/i,
  /^r[ồo]i\s*sao\s*n[ữư]a$/i,
  /^ti[ếe]p\s*theo\s*l[àa]\s*g[ìi]$/i
];

// 5. USER CORRECTION SIGNALS (🚨 Priority 2 - Section 7: KHI NGƯỜI DÙNG SỬA CHATBOT)
export const CORRECTION_PATTERNS = [
  /^(kh[ôo]ng\s*ph[ảa]i|h[ôo]ng\s*ph[ảa]i|h[ơo]m\s*ph[ảa]i)(\s*([!?.😭=):;~]+|nha|nh[ée]|đ[âa]u))?$/i,
  /^(kh[ôo]ng\s*ph[ảa]i|h[ôo]ng\s*ph[ảa]i|h[ơo]m\s*ph[ảa]i)\b/i,
  /^([ýy]\s*(t[ớo]|tui|m[ìi]nh|em)\s*l[àa]|[ýy]\s*l[àa](?!\s*(g[ìi]|sao|nh[ư\s]*\s*n[àa]o|th[ếe]\s*n[àa]o)))/iu,
  /^kh[ôo]ng\s*,\s*(c[áa]i\s*đ[óo]|chuy[ệe]n\s*đ[óo]|t[ạa]i|t[ớo]|m[ìi]nh)/i,
  /c[ậa]u\s*hi[ểe]u\s*sai\s*r[ồo]i/i,
  /(t[ớo]|tui|m[ìi]nh|em)\s*đang\s*n[óo]i\s*v[ềe]/i,
  /kh[ôo]ng\s*ph[ảa]i\s*(chuy[ệe]n\s*đ[óo]|v[ậa]y|th[ếe]|c[áa]i\s*đ[óo])/i,
  /[ýy]\s*(t[ớo]|tui|m[ìi]nh|em)\s*kh[áa]c/i,
  /tr[ờo]i\s*ơi\s*kh[ôo]ng(\s*(=|\)|:|😭|!|\?)+)?/i,
  /kh[ôo]ng\s*nha/i,
  /tui\s*n[óo]i\s*l[àa]/i,
  /ai\s*b[ảa]o\s*th[ếe]/i,
  /đ[âa]u\s*ph[ảa]i\s*v[ậa]y/i,
  /hi[ểe]u\s*l[ầa]m\s*r[ồo]i/i
];

// 6. TOPIC SWITCH SIGNALS (Section 6: PHÂN BIỆT TRẢ LỜI VÀ CHUYỂN CHỦ ĐỀ)
export const TOPIC_SWITCH_PATTERNS = [
  /^([àa]|a)\s*m[àa](?:[^\p{L}]|$)/iu,
  /^ti[ệe]n\s*th[ểe](?:[^\p{L}]|$)/iu,
  /^c[òo]n\s*chuy[ệe]n\s*n[àa]y(?:[^\p{L}]|$)/iu,
  /^m[àa]\s*n[àa]y(?:[^\p{L}]|$)/iu,
  /^k[ểe]\s*(c[ậa]u|b[ạa]n|nghe)\s*(c[áa]i\s*n[àa]y|chuy[ệe]n\s*n[àa]y)/iu,
  /^chuy[ệe]n\s*kh[áa]c\s*n[èe](?:[^\p{L}]|$)/iu,
  /^th[ôo]i\s*n[óo]i\s*chuy[ệe]n\s*kh[áa]c/iu
];

// Check if bot's previous message was asking a question
export function isBotQuestion(botMessage?: string): boolean {
  if (!botMessage) return false;
  const t = botMessage.trim();
  if (t.includes('?')) return true;
  if (/hay\s+(l[àa]|ở|c[ùu]ng|m[ìi]nh)\b/i.test(t)) return true;
  if (/ch[ọo]n\s+(c[áa]i|c[áa]ch|h[ư\s]*[ớo]ng|m[ôo]n)\b/i.test(t)) return true;
  if (/b[ạa]n\s+mu[ốo]n\s+/i.test(t)) return true;
  return false;
}

// Helper to remove diacritics and repeated characters for fuzzy match
function cleanText(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[.,?!~:;'"/\-_=+*#@$%^&()[\]{}<>]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function collapseRepeatedLetters(str: string): string {
  // e.g. "hiiiii" -> "hii", "hahahaha" -> "haha", "êêê" -> "ê"
  return str.replace(/(.)\1{2,}/g, '$1$1');
}

/**
 * Check if the text matches FAST PATH categories purely (no substantive extra text).
 */
export function matchFastPathCategory(text: string): FastPathCategory | null {
  const cleaned = cleanText(text);
  const collapsed = collapseRepeatedLetters(cleaned);

  // A. GREETINGS
  // e.g. hi, hii, hello, hey, chào, hế lô, hí, halo, chào bạn, hi bạn, hello nha
  const greetingExact = [
    'hi', 'hii', 'hiii', 'hello', 'helo', 'heloo', 'hey', 'heyy', 'chao', 'chao ban',
    'chao cau', 'chao nha', 'chao ban nha', 'he lo', 'he looo', 'he lu', 'hi ban',
    'hi cau', 'hello ban', 'hello nha', 'hi nha', 'halo', 'hallo', 'hola'
  ];
  if (
    greetingExact.includes(cleaned) ||
    greetingExact.includes(collapsed) ||
    /^(hi+|he+y+|he+l+o+|h[aá]lo|h[ií]|h[ếe]\s*l[ôo]|ch[àa]o)(\s+(b[ạa]n|c[ậa]u|nha|nh[ée]|n[èe]|nhe|nghen|ơ+i|iu|m[ìi]nh|m|m[àa]y)){0,2}$/i.test(cleaned) ||
    /^(hi+|he+y+|he+l+o+|h[ếe]\s*l[ôo]|ch[àa]o)(\s+(b[ạa]n|c[ậa]u|nha|nh[ée]|n[èe]|nhe|nghen|ơ+i|iu|m[ìi]nh|m|m[àa]y)){0,2}$/i.test(collapsed)
  ) {
    return 'greeting';
  }

  // B. CALLS / PINGS
  // e.g. ê, alo, này, bạn ơi, cậu ơi, alo bạn, ê bot, nghe nè
  const callExact = [
    'e', 'ee', 'eee', 'alo', 'alo alo', 'nay', 'ne', 'ban oi', 'cau oi', 'e ban',
    'e ban oi', 'alo ban', 'alo ban oi', 'e bot', 'bot oi', 'minh noi ne', 'nghe ne',
    'nghe tui noi ne', 'oi', 'oi ban'
  ];
  if (
    callExact.includes(cleaned) ||
    callExact.includes(collapsed) ||
    /^(ê+|ee+|alo+|alô+|n[àa]y|n[èe]|ơ+i)(\s+(b[ạa]n|c[ậa]u|ơ+i|n[èe]|nha|bot|tui|m[ìi]nh|m|m[àa]y|nghe|n[óo]i\s*n[èe])){0,3}$/i.test(cleaned) ||
    /^(ê+|ee+|alo+|alô+|n[àa]y|n[èe]|ơ+i)(\s+(b[ạa]n|c[ậa]u|ơ+i|n[èe]|nha|bot|tui|m[ìi]nh|m|m[àa]y|nghe|n[óo]i\s*n[èe])){0,3}$/i.test(collapsed) ||
    /^(b[ạa]n|c[ậa]u|bot)\s+ơ+i$/i.test(cleaned)
  ) {
    return 'call';
  }

  // C. REACTIONS
  // e.g. haha, hehe, hihi, huhu, keke, wow, ối dồi, u là trời, :)), =))
  const reactionExact = [
    'haha', 'hahaha', 'hehe', 'hehehe', 'hihi', 'hihihi', 'huhu', 'huhuhu',
    'keke', 'kekeke', 'wow', 'oi doi', 'u la troi', 'choi oi', 'troi oi',
    'vai', 'vui ghe', 'hai z', 'hai qua', 'khoai khoai'
  ];
  if (
    reactionExact.includes(cleaned) ||
    reactionExact.includes(collapsed) ||
    /^(ha+ha+|he+he+|hi+hi+|hu+hu+|ke+ke+|wo+w|u\s*l[àa]\s*tr[ờo]i|ch[ờo]i\s*ơi|tr[ờo]i\s*ơi|h[àa]i\s*z|vui\s*gh[êe])$/i.test(cleaned) ||
    /^(ha+ha+|he+he+|hi+hi+|hu+hu+|ke+ke+|wo+w|u\s*l[àa]\s*tr[ờo]i|ch[ờo]i\s*ơi|tr[ờo]i\s*ơi|h[àa]i\s*z|vui\s*gh[êe])$/i.test(collapsed)
  ) {
    return 'reaction';
  }
  // Emoticons check on raw input
  const emoticonRegex = /^(\s*[:=;xX8B]-?[\)\(\]\[DPpvdDoO3*><c~^]{1,6}\s*|\s*(\^\^|\^_\^|\(y\)|<3|:\)\)+|=\)\)+)\s*)+$/;
  if (emoticonRegex.test(text.trim())) {
    return 'reaction';
  }

  // D. THANKS
  // e.g. cảm ơn, cảm ơn nha, thanks, thank you, tks, cảm ơn bạn
  const thanksExact = [
    'cam on', 'cam on nha', 'cam on nhieu', 'cam on ban', 'cam on cau',
    'thanks', 'thank you', 'tks', 'thank', 'iu ban', 'thuong ghe', 'doi on'
  ];
  if (
    thanksExact.includes(cleaned) ||
    /^(c[ảa]m\s*ơ+n|thanks?|thank\s*you|tks)(\s*(nha|nh[ée]|n[èe]|b[ạa]n|c[ậa]u|nhi[ềe]u|nh[ìi]u|nghen|nhe|ạ))?$/i.test(cleaned) ||
    /^(iu|th[ư\s]*[ơo]ng)\s*(b[ạa]n|c[ậa]u)(\s*gh[êe]|\s*nha)?$/i.test(cleaned)
  ) {
    return 'thanks';
  }

  // E. GOODBYES
  // e.g. bye, bye bye, bai nha, tạm biệt, đi ngủ đây, gặp lại sau
  const goodbyeExact = [
    'bye', 'bye bye', 'bai', 'bai nha', 'bai bai', 'bai nha ban', 'tam biet',
    'tam biet nha', 'tam biet ban', 'gap lai sau', 'di ngu day', 'ngu day',
    'di hoc day', 'bibi'
  ];
  if (
    goodbyeExact.includes(cleaned) ||
    /^(bye+|bai+|b[áa]i\s*bai|t[ạa]m\s*bi[ệe]t|bi\s*bi)(\s*(nha|nh[ée]|n[èe]|b[ạa]n|c[ậa]u|nghen|nhe))?$/i.test(cleaned) ||
    /^(đi\s*ng[ủu]|ng[ủu]|đi\s*h[ọo]c)\s*đ[âa]y(\s*nha)?$/i.test(cleaned) ||
    /^g[ặa]p\s*l[ạa]i\s*sau(\s*nha)?$/i.test(cleaned)
  ) {
    return 'goodbye';
  }

  // F. ACKNOWLEDGMENTS / CONFIRMATIONS
  // e.g. ok, oke, okie, ok bạn, uk, uh, dạ, vâng, rồi, được
  const ackExact = [
    'ok', 'oke', 'okie', 'oki', 'ok ban', 'oke ban', 'ok nha', 'oke nha',
    'uk', 'uh', 'da', 'roi', 'vang', 'duoc', 'duoc roi', 'yes', 'yep',
    'ro roi', 'hieu roi', 'chot', 'oke ne', 'ok ne'
  ];
  if (
    ackExact.includes(cleaned) ||
    ackExact.includes(collapsed) ||
    /^(o+k+e*|o+k+i+e*|u+k+|u+h+|d[ạa]|v[âa]ng|r[ồo]i|đ[ư\s]*[ợo]c)(\s*(n[èe]|nha|nh[ée]|b[ạa]n|c[ậa]u|r[ồo]i|lu[ôo]n|ạ))?$/i.test(cleaned) ||
    /^(r[õo]|hi[ểe]u|đ[ư\s]*[ợo]c)\s*r[ồo]i(\s*nha)?$/i.test(cleaned)
  ) {
    return 'acknowledgment';
  }

  return null;
}

/**
 * Extract context topics from the last user turns
 */
function extractContextTopic(previousMessages: ChatMessageContext[]): 'exam' | 'relationship' | 'sadness' | null {
  if (!previousMessages || previousMessages.length === 0) return null;

  // Look back at the last 2 user messages
  const userMessages = previousMessages.filter(m => m.role === 'user').slice(-2);
  const combined = userMessages.map(m => m.content.toLowerCase()).join(' ');

  if (/(thi|ki[ểe]m\s*tra|b[àa]i\s*t[ậa]p|[ôo]n\s*thi|đ[ốo]i\s*ph[óo]\s*thi)/i.test(combined)) {
    return 'exam';
  }
  if (/(b[ạa]n\s*th[âa]n|c[ãa]i\s*nhau|crush|ngh[ỉi]\s*ch[ơo]i|t[ẩa]y\s*chay|ng[ư\s]*[ờo]i\s*y[êe]u|seen)/i.test(combined)) {
    return 'relationship';
  }
  if (/(bu[ồo]n|m[ệe]t|[áa]p\s*l[ựu]c|kh[óo]c|stress|ki[ệe]t\s*s[ứu]c)/i.test(combined)) {
    return 'sadness';
  }

  return null;
}

/**
 * Pick a varied response from candidates avoiding the last bot response
 */
function pickResponse(candidates: string[], lastBotReply?: string): string {
  const filtered = lastBotReply
    ? candidates.filter(c => c.trim().toLowerCase() !== lastBotReply.trim().toLowerCase())
    : candidates;
  const pool = filtered.length > 0 ? filtered : candidates;
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Generate Fast Path response based on category and lightweight context
 */
export function generateFastPathResponse(
  category: FastPathCategory,
  previousMessages: ChatMessageContext[] = [],
  lastBotReply?: string
): string {
  const recentTopic = extractContextTopic(previousMessages);

  switch (category) {
    case 'greeting': {
      // Light contextual touch if previous topic was recent
      if (recentTopic === 'exam') {
        const examCandidates = [
          'hiii, vẫn còn sống sót sau vụ bài vở thi cử đó hả =))',
          'heyy! Vụ bài vở hôm trước tới đâu rồi cậu ơi? 👀',
          'hiii :)) nay đã đỡ ngợp hơn miếng nào chưa?'
        ];
        return pickResponse(examCandidates, lastBotReply);
      }
      if (recentTopic === 'relationship') {
        const relCandidates = [
          'hiii, chuyện hôm trước êm hơn tí nào chưa nè? 👀',
          'heyy tớ đây =)) Mọi chuyện đỡ rối hơn xíu nào chưa cậu?'
        ];
        return pickResponse(relCandidates, lastBotReply);
      }
      if (recentTopic === 'sadness') {
        const sadCandidates = [
          'hiii :)) nay tâm trạng có đỡ hơn xíu nào chưa cậu ơi?',
          'heyy, tớ đây =)) Hôm nay nạp lại được chút năng lượng nào chưa nè?'
        ];
        return pickResponse(sadCandidates, lastBotReply);
      }

      // Default fresh greetings (warm, natural close-friend style)
      const greetingCandidates = [
        'hii :)) nay sao rồi cậu?',
        'heyy, tớ đây =))',
        'hiii, có chuyện gì kể tớ nghe coi 👀',
        'hế lô! Nay có biến gì mới kể tớ nghe liền nè =)))',
        'tớ nghe nè, hôm nay của cậu thế nào?',
        'heyy cậu ơi, tớ đang ngồi đây nè =))',
        'chào cậu =)) nay có chuyện gì kể tớ nghe với!'
      ];
      return pickResponse(greetingCandidates, lastBotReply);
    }

    case 'call': {
      const callCandidates = [
        'gì đó =))',
        'alo alo, tớ nghe nè 👀',
        'tớ đây, có biến gì kể lẹ coi =))',
        'ơi tớ nghe nè, có chuyện gì á?',
        'nghe rõ mười mươi, nói đi tớ hóng nè =))',
        'thôi lại đây kể tớ nghe =)))'
      ];
      return pickResponse(callCandidates, lastBotReply);
    }

    case 'reaction': {
      const reactionCandidates = [
        'cười gì zui z =))',
        'haha gì á, kể tớ cười ké coi =))',
        'thấy cậu cười là thấy vui lây rồi đó :D',
        'vui vẻ dữ ta =)) có chuyện gì kể nghe coi?',
        'gì mà khoái chí dữ thần vậy nè =)))',
        '=))) cười tít mắt luôn hả cậu'
      ];
      return pickResponse(reactionCandidates, lastBotReply);
    }

    case 'thanks': {
      const thanksCandidates = [
        'hông có chi đâu nè :D Bạn bè với nhau mà!',
        'có gì đâu nè =)) Thấy cậu nhẹ nhõm hơn xíu là tớ vui rồi á 🌸',
        'khách sáo quá nha =)) Có gì cứ ới tớ tiếp nghen!',
        'thương cậu ghê, có gì cứ tâm sự với tớ nha :D'
      ];
      return pickResponse(thanksCandidates, lastBotReply);
    }

    case 'goodbye': {
      const goodbyeCandidates = [
        'bai bai nha! Đi nghỉ ngơi cho lại sức nghen 🌷',
        'bái bai, khi nào rảnh lại ghé buôn chuyện với tớ tiếp nha 👀',
        'bye bye nè, nhớ giữ gìn sức khỏe nghen :D',
        'okie bai cậu, có chuyện gì lại ới tớ bất cứ lúc nào nha!',
        'bai nha, tớ vẫn luôn ở đây nghe cậu nói đó :D'
      ];
      return pickResponse(goodbyeCandidates, lastBotReply);
    }

    case 'acknowledgment': {
      const ackCandidates = [
        'okie nè cậu =))',
        'ừm, tớ vẫn đang ngồi đây nè.',
        'oke luôn =)) cứ từ từ nha, tớ nghe hết nè.',
        'okie, cậu cứ thong thả nha :D'
      ];
      return pickResponse(ackCandidates, lastBotReply);
    }
  }
}

/**
 * Main Master Classifier implementing Section 9 & 12 Table strictly.
 */
export function classifyChatMessage(
  message: string,
  previousMessages: ChatMessageContext[] = [],
  lastBotReply?: string
): DecisionResult {
  const trimmed = message.trim();
  if (!trimmed) {
    return { decision: 'FAST_PATH', category: 'greeting', response: 'heyy, tui đây =))' };
  }

  // ─────────────────────────────────────────────────────────────
  // 1. SAFETY MODE (🚨 HIGHEST PRIORITY)
  // ─────────────────────────────────────────────────────────────
  for (const pattern of SAFETY_PATTERNS) {
    if (pattern.test(trimmed)) {
      const safetyResponse = `Mình nghe đây, và mình thực sự rất lo lắng cho bạn. 🫂 Cảm giác kiệt sức và bế tắc lúc này chắc chắn đang đè nặng lên bạn rất nhiều... Nhưng bạn ơi, sự an toàn của bạn là điều quan trọng nhất, và bạn không hề phải chịu đựng điều này một mình đâu.

Mình tha thiết mong bạn hãy mở lòng với một người lớn đáng tin cậy ở gần (bố mẹ, thầy cô, người thân).

Nếu có nguy hiểm khẩn cấp ngay lúc này, hãy gọi cấp cứu **115**.

Mình vẫn ở đây lắng nghe bạn, nhưng hãy để người lớn cùng bảo vệ bạn an toàn nhé! 🌷`;
      return {
        decision: 'SAFETY',
        reason: 'Critical safety concern detected',
        response: safetyResponse
      };
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 2. CORRECTION SIGNALS (🚨 Priority 2 - Section 7: KHI NGƯỜI DÙNG SỬA CHATBOT)
  // ─────────────────────────────────────────────────────────────
  for (const pattern of CORRECTION_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        decision: 'NORMAL_AI',
        reason: 'User correction signal detected - discard old false assumption immediately',
        isCorrection: true
      };
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 2b. CLARIFICATION & EXPLANATION REQUESTS (🔍 Priority 2b)
  // When user asks "?", "là sao?", "ý là gì?", "sao cơ?", "giải thích đi", "chưa hiểu", v.v.
  // Must clarify the IMMEDIATE PREVIOUS BOT REPLY with simple words & concrete examples!
  // ─────────────────────────────────────────────────────────────
  for (const pattern of CLARIFICATION_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        decision: 'NORMAL_AI',
        reason: 'User asks for clarification of immediate previous bot message ("?", "là sao?", "ý là gì?")',
        isClarificationRequest: true
      };
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 3. TOPIC SWITCH SIGNALS (Section 6: CHUYỂN CHỦ ĐỀ)
  // ─────────────────────────────────────────────────────────────
  for (const pattern of TOPIC_SWITCH_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        decision: 'NORMAL_AI',
        reason: 'User topic switch detected - follow new topic',
        isTopicSwitch: true
      };
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 4. CONCRETE REQUEST / ADVICE SEEKING (🧠 NORMAL AI)
  // ─────────────────────────────────────────────────────────────
  for (const pattern of ADVICE_SEEKING_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        decision: 'NORMAL_AI',
        reason: 'Explicit advice or solution seeking query ("phải làm sao", "nên làm gì")',
        isAdviceRequest: true
      };
    }
  }

  for (const pattern of CONCRETE_REQUEST_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        decision: 'NORMAL_AI',
        reason: 'Concrete request / explicit help needed'
      };
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 5. EMOTIONAL OR PROBLEM SIGNAL (🧠 NORMAL AI - Section 11: NGẮN ≠ ĐƠN GIẢN)
  // ─────────────────────────────────────────────────────────────
  for (const pattern of EMOTION_PROBLEM_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        decision: 'NORMAL_AI',
        reason: 'Emotional distress or problem signal detected'
      };
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 6. ANSWERING PREVIOUS BOT QUESTION (Section 2 & 10)
  // ─────────────────────────────────────────────────────────────
  const botAsked = isBotQuestion(lastBotReply);
  const fastPathCat = matchFastPathCategory(trimmed);

  // If bot just asked a question, an acknowledgment ("ok", "được", "rồi", "ừ")
  // or a concise answer ("ở trường", "cùng nghĩ cách", "toán", etc.) is an ANSWER to that question!
  if (botAsked) {
    // If it is acknowledgment or not greeting/goodbye/reaction, treat as answer to previous question
    if (fastPathCat === 'acknowledgment' || (!fastPathCat && trimmed.length < 80)) {
      return {
        decision: 'CONTEXT_MODE',
        reason: 'User is answering bot previous question - proceed from this answer without re-asking',
        isAnsweringQuestion: true
      };
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 7. CLEARLY CONTINUES PREVIOUS TOPIC (🧠 CONTEXT MODE)
  // ─────────────────────────────────────────────────────────────
  for (const pattern of CONTEXT_CONTINUATION_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        decision: 'CONTEXT_MODE',
        reason: 'Context continuation / ambiguous intent in ongoing conversation'
      };
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 8. FAST PATH (⚡ SIMPLE GREETING / CALL / REACTION / THANKS / GOODBYE / STANDALONE ACK)
  // ─────────────────────────────────────────────────────────────
  if (fastPathCat) {
    const reply = generateFastPathResponse(fastPathCat, previousMessages, lastBotReply);
    return {
      decision: 'FAST_PATH',
      category: fastPathCat,
      response: reply
    };
  }

  // ─────────────────────────────────────────────────────────────
  // 9. ELSE: CONTEXT MODE / NORMAL AI
  // ─────────────────────────────────────────────────────────────
  return {
    decision: 'CONTEXT_MODE',
    reason: 'Standard conversational turn requiring full reasoning'
  };
}
