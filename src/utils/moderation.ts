export interface ModerationResult {
  isSafe: boolean;
  warning?: string;
  isEmergency?: boolean;
}

const EMERGENCY_KEYWORDS = [
  'tự tử',
  'tự sát',
  'muốn chết',
  'kết thúc cuộc đời',
  'rạch tay',
  'tự hại',
  'không muốn sống',
  'chết đi cho xong'
];

const TOXIC_KEYWORDS = [
  'đồ ngu',
  'chết tiệt',
  'đm',
  'đcm',
  'vcl',
  'thằng điên',
  'con điên',
  'chửi',
  'đánh chết',
  'bitch',
  'cút đi',
  'đồ vô dụng',
  'thằng chó',
  'con khốn'
];

export function checkContentModeration(text: string): ModerationResult {
  const normalized = text.toLowerCase();

  for (const keyword of EMERGENCY_KEYWORDS) {
    if (normalized.includes(keyword)) {
      return {
        isSafe: true, // Allow sharing their distress, but flag an emergency banner
        isEmergency: true,
        warning: 'Chúng mình nhận thấy bạn đang trải qua cảm xúc vô cùng nặng nề. Xin bạn nhớ rằng bạn không phải chịu đựng một mình. Hãy chia sẻ ngay với thầy cô, cha mẹ hoặc người lớn đáng tin cậy nhé!'
      };
    }
  }

  for (const keyword of TOXIC_KEYWORDS) {
    if (normalized.includes(keyword)) {
      return {
        isSafe: false,
        warning: 'Nội dung có chứa từ ngữ xúc phạm hoặc chưa phù hợp với nguyên tắc an toàn, không phán xét của cộng đồng teen. Bạn vui lòng chỉnh sửa lại bằng ngôn từ nhẹ nhàng hơn nhé!'
      };
    }
  }

  return { isSafe: true };
}

export const CUTE_NICKNAMES = [
  'Mèo lười sưởi nắng',
  'Mây trắng bay bổng',
  'Chiếc lá mùa thu',
  'Cậu bạn nghe nhạc',
  'Hạt dẻ ấm áp',
  'Sao băng nhỏ',
  'Trà sữa ít đường',
  'Gấu bông biết lắng nghe',
  'Mầm cây hy vọng',
  'Hành tinh bí mật',
  'Nốt nhạc dịu êm',
  'Cơn mưa rào mùa hạ',
  'Cáo nhỏ hiền lành',
  'Bồ công anh đón gió'
];

export function getRandomNickname(): string {
  const index = Math.floor(Math.random() * CUTE_NICKNAMES.length);
  const randomNum = Math.floor(100 + Math.random() * 900);
  return `${CUTE_NICKNAMES[index]} #${randomNum}`;
}
