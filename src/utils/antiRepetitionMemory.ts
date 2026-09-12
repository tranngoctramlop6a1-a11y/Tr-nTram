// Conversation Anti-Repetition Memory types and utilities for "Bạn ơi, mình nói nè"

export interface ResponseMemoryTurn {
  turn_index: number;
  opening_style: 'dong_cam' | 'hoi_nhe' | 'nhan_xet' | 'tran_an' | 'teen_friendly' | 'truc_tiep' | 'khong_biet_cam_xuc' | 'khac';
  opening_phrase: string;
  closing_style: 'hoi_mo_tiep' | 'goi_y_buoc_mot' | 'khong_hoi' | 'cung_nghi' | 'huong_xu_ly' | 'khac';
  closing_phrase: string;
  empathy_phrase_used?: string;
  advice_style_used?: string;
  question_style_used?: string;
  emojis_used: string[];
  important_phrases_used: string[];
  response_structure: string;
  topics_discussed: string[];
  advice_already_given: string[];
}

export interface AntiRepetitionMemory {
  history: ResponseMemoryTurn[]; // max 5 recent turns
}

// Banned repeated phrases that should never appear mechanically
export const BANNED_REPETITIVE_PHRASES = [
  'mình hiểu cảm giác của bạn',
  'mình hiểu rằng bạn đang',
  'mình hiểu rằng',
  'điều đó chắc hẳn rất khó khăn',
  'bạn không cần phải',
  'mình ở đây để lắng nghe',
  'cảm xúc của bạn là hoàn toàn bình thường',
  'hãy nhớ rằng',
  'bạn có thể thử',
  'nếu bạn muốn, mình có thể'
];

// Extract emojis from a text string
export function extractEmojis(text: string): string[] {
  const emojiRegex = /[\p{Extended_Pictographic}\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;
  const matches = text.match(emojiRegex);
  return matches ? Array.from(new Set(matches)) : [];
}

// Detect opening style from text
export function detectOpeningStyle(text: string): { style: ResponseMemoryTurn['opening_style']; phrase: string } {
  const trimmed = text.trim();
  const firstSentence = trimmed.split(/[.!?\n]/)[0] || '';
  const lower = firstSentence.toLowerCase();

  if (lower.startsWith('=)))') || lower.startsWith('ui') || lower.startsWith('trời') || lower.includes('tụt mood') || lower.includes('quê')) {
    return { style: 'teen_friendly', phrase: firstSentence.slice(0, 40) };
  }
  if (lower.startsWith('khoan') || lower.startsWith('đừng') || lower.startsWith('bình tĩnh')) {
    return { style: 'tran_an', phrase: firstSentence.slice(0, 40) };
  }
  if (lower.startsWith('nghe') || lower.startsWith('ừ') || lower.startsWith('thấy')) {
    return { style: 'dong_cam', phrase: firstSentence.slice(0, 40) };
  }
  if (lower.includes('?') || lower.startsWith('chuyện này') || lower.startsWith('bạn có')) {
    return { style: 'hoi_nhe', phrase: firstSentence.slice(0, 40) };
  }
  if (lower.startsWith('à') || lower.startsWith('vậy thì') || lower.startsWith('cái này')) {
    return { style: 'nhan_xet', phrase: firstSentence.slice(0, 40) };
  }
  if (lower.startsWith('nếu là') || lower.startsWith('tối nay') || lower.startsWith('với')) {
    return { style: 'truc_tiep', phrase: firstSentence.slice(0, 40) };
  }
  if (lower.includes('không sao') || lower.includes('không nhất thiết')) {
    return { style: 'khong_biet_cam_xuc', phrase: firstSentence.slice(0, 40) };
  }

  return { style: 'khac', phrase: firstSentence.slice(0, 40) };
}

// Detect closing style from text
export function detectClosingStyle(text: string): { style: ResponseMemoryTurn['closing_style']; phrase: string } {
  const lines = text.trim().split('\n').filter(l => l.trim().length > 0);
  const lastLine = (lines[lines.length - 1] || '').trim();
  const lower = lastLine.toLowerCase();

  if (lower.includes('nếu bạn muốn, mình có thể') || lower.includes('nếu bạn muốn')) {
    return { style: 'khac', phrase: lastLine.slice(-50) };
  }
  if (lower.includes('kể tiếp') || lower.includes('nghe tiếp') || lower.includes('bạn cứ kể')) {
    return { style: 'hoi_mo_tiep', phrase: lastLine.slice(-50) };
  }
  if (lower.includes('từng bước') || lower.includes('trước mắt')) {
    return { style: 'goi_y_buoc_mot', phrase: lastLine.slice(-50) };
  }
  if (lower.includes('cùng bạn') || lower.includes('nghĩ cùng')) {
    return { style: 'cung_nghi', phrase: lastLine.slice(-50) };
  }
  if (lastLine.endsWith('?') || lower.includes('sao') || lower.includes('không?')) {
    return { style: 'huong_xu_ly', phrase: lastLine.slice(-50) };
  }

  return { style: 'khong_hoi', phrase: lastLine.slice(-50) };
}

// Build a memory turn object from a completed assistant reply
export function buildMemoryTurn(
  turnIndex: number,
  userMessage: string,
  botReply: string,
  extractedTopic?: string
): ResponseMemoryTurn {
  const opening = detectOpeningStyle(botReply);
  const closing = detectClosingStyle(botReply);
  const emojis = extractEmojis(botReply);

  const adviceList: string[] = [];
  const lowerReply = botReply.toLowerCase();
  if (lowerReply.includes('hỏi thẳng') || lowerReply.includes('nhắn tin')) adviceList.push('giao tiếp trực tiếp');
  if (lowerReply.includes('khoảng lặng') || lowerReply.includes('cho thời gian')) adviceList.push('cho thời gian');
  if (lowerReply.includes('chia nhỏ') || lowerReply.includes('2 phần')) adviceList.push('chia nhỏ bài học');
  if (lowerReply.includes('ngủ') || lowerReply.includes('nghỉ ngơi')) adviceList.push('nghỉ ngơi');

  const topics: string[] = [];
  if (extractedTopic) topics.push(extractedTopic);
  const lowerUser = userMessage.toLowerCase();
  if (lowerUser.includes('bạn') || lowerUser.includes('nghỉ chơi')) topics.push('tình bạn');
  if (lowerUser.includes('học') || lowerUser.includes('thi') || lowerUser.includes('điểm') || lowerUser.includes('kiểm tra')) topics.push('học tập');
  if (lowerUser.includes('bố') || lowerUser.includes('mẹ') || lowerUser.includes('gia đình')) topics.push('gia đình');
  if (lowerUser.includes('mạng') || lowerUser.includes('fomo') || lowerUser.includes('tiktok') || lowerUser.includes('facebook')) topics.push('mạng xã hội');

  return {
    turn_index: turnIndex,
    opening_style: opening.style,
    opening_phrase: opening.phrase,
    closing_style: closing.style,
    closing_phrase: closing.phrase,
    emojis_used: emojis,
    important_phrases_used: [opening.phrase, closing.phrase].filter(Boolean),
    response_structure: botReply.length < 150 ? 'short_chat' : botReply.includes('\n-') || botReply.includes('\n•') ? 'bullet_advice' : 'conversational_dialogue',
    topics_discussed: topics,
    advice_already_given: adviceList
  };
}

// Post-check and clean any candidate reply to eliminate forbidden repetitive templates
export function sanitizeChatResponse(
  rawText: string,
  memory: AntiRepetitionMemory
): string {
  let cleaned = rawText.trim();

  // 1. Remove greeting self-introduction if user didn't ask "bạn là ai"
  cleaned = cleaned.replace(/^chào bạn,?\s*mình là\s*["“]?Bạn ơi,?\s*mình nói nè["”]?.{0,50}?[.\n]/i, '');
  cleaned = cleaned.replace(/^mình là\s*["“]?Bạn ơi,?\s*mình nói nè["”]?[,.]\s*/i, '');

  // 2. Remove robot paraphrasing at the beginning if present
  cleaned = cleaned.replace(/^mình hiểu rằng bạn đang [^.!?\n]+[.!?\n]\s*/i, '');
  cleaned = cleaned.replace(/^mình hiểu cảm giác của bạn khi [^.!?\n]+[.!?\n]\s*/i, '');
  cleaned = cleaned.replace(/^mình hiểu cảm giác của bạn[.!?\n]\s*/i, '');
  cleaned = cleaned.replace(/^tôi hiểu cảm xúc của bạn[.!?\n]\s*/i, '');
  cleaned = cleaned.replace(/^dường như bạn đang trải qua [^.!?\n]+[.!?\n]\s*/i, '');
  cleaned = cleaned.replace(/^bạn nên bình tĩnh[.!?\n]\s*/i, '');
  cleaned = cleaned.replace(/^hãy suy nghĩ tích cực[.!?\n]\s*/i, '');
  cleaned = cleaned.replace(/^chúc mừng bạn vì đã đạt được thành tích tốt[.!?\n]\s*/i, 'Ê đỉnh vậy! Chúc mừng cậu nha 🎉\n');

  // 3. Fix repetitive ending "Nếu bạn muốn, mình có thể..."
  const hadRecentRepetitiveClosing = memory.history.slice(-3).some(
    (t) => t.closing_phrase.toLowerCase().includes('nếu bạn muốn') || t.closing_phrase.toLowerCase().includes('nếu cậu muốn')
  );

  if (hadRecentRepetitiveClosing || cleaned.toLowerCase().includes('nếu bạn muốn, mình có thể') || cleaned.toLowerCase().includes('nếu cậu muốn, tớ có thể')) {
    const alternativeClosings = [
      'Cậu muốn kể tiếp đoạn này không?',
      'Cậu thấy sao?',
      'Nếu là tớ chắc tớ cũng muốn nghỉ một chút cho đỡ mệt.',
      'Cậu cứ thong thả nói tiếp nhé, tớ vẫn ngồi đây nè.'
    ];
    const chosen = alternativeClosings[Math.floor(Math.random() * alternativeClosings.length)];

    cleaned = cleaned.replace(
      /nếu bạn muốn,?\s*mình có thể[^.!?\n]*[.!?]?$/i,
      chosen
    );
    cleaned = cleaned.replace(
      /nếu bạn thích,?\s*mình có thể[^.!?\n]*[.!?]?$/i,
      chosen
    );
    cleaned = cleaned.replace(
      /nếu cậu muốn,?\s*tớ có thể[^.!?\n]*[.!?]?$/i,
      chosen
    );
  }

  // 4. Limit heavy repetition of 🫂
  const lastTurn = memory.history[memory.history.length - 1];
  if (lastTurn && lastTurn.emojis_used.includes('🫂')) {
    const occurrences = (cleaned.match(/🫂/g) || []).length;
    if (occurrences > 1) {
      cleaned = cleaned.replace(/🫂/g, (match, offset) => (offset === cleaned.indexOf('🫂') ? match : ''));
    }
  }

  // 5. Fallback safeguard: Never allow sanitization to completely wipe out or truncate response
  if (!cleaned || cleaned.length < 15) {
    cleaned = rawText.trim();
  }

  // 6. Ensure the response does not end abruptly mid-sentence with dangling commas or conjunctions
  if (cleaned.length > 0 && !/[.!?…~:)"'\`]$/.test(cleaned)) {
    let fixed = cleaned.replace(/[,;]\s*$/, '');
    fixed = fixed.replace(/\b(và|nhưng|hoặc|vì|bởi vì|do|nên|là|rằng|nếu|khi|đang|với|của|ở|trong|thì)\s*$/i, '');
    if (!/[.!?…~:)"'\`]$/.test(fixed.trim())) {
      fixed = fixed.trim() + '.';
    }
    cleaned = fixed;
  }

  return cleaned.trim();
}
