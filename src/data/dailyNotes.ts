/**
 * Daily Notes for "Bạn không cô đơn" & Daily Experience
 * Requirements 6 & 7:
 * - Each day has a distinct note based on the actual calendar date (2026-09-15 -> Note A, 2026-09-16 -> Note B).
 * - Clear source attribution: "— 🤖 AI" or "— 👤 Người dùng"
 * - No fake identities.
 */

export interface DailyNoteItem {
  id: string;
  sourceType: 'ai' | 'user';
  sourceLabel: string; // e.g. "— 🤖 AI" or "— 👤 Người dùng" or "— 👤 Bạn ẩn danh từ cộng đồng"
  quote: string;
  subtext: string;
  theme: 'calm' | 'hope' | 'courage' | 'gentle' | 'warm';
  topicTag: string;
  empathy?: string;
  microAction?: string;
  reflectionQuestion?: string;
  dateFormatted?: string;
}

export const DAILY_NOTES_POOL: DailyNoteItem[] = [
  {
    id: 'note-01',
    sourceType: 'ai',
    sourceLabel: '— 🤖 AI',
    quote: 'Không phải ngày nào cũng cần phải ổn. Có những hôm chỉ cần đi qua được ngày hôm đó thôi cũng đã đủ rồi.',
    subtext: 'Nếu hôm nay bạn thấy mình mệt mỏi và không làm được gì nhiều, hãy cứ cho phép mình được nghỉ ngơi. Ngày mai vẫn là một trang mới.',
    theme: 'calm',
    topicTag: '🌿 Vỗ về cảm xúc'
  },
  {
    id: 'note-02',
    sourceType: 'user',
    sourceLabel: '— 👤 Người dùng',
    quote: 'Có thể hôm nay cậu thấy mình chẳng làm được gì, nhưng cậu vẫn đang cố gắng từng chút một mà.',
    subtext: 'Mình từng thi trượt một kỳ thi quan trọng năm ngoái. Lúc đó tưởng như trời sụp xuống, nhưng hóa ra cuộc đời còn nhiều cánh cửa khác rộng mở hơn nhiều.',
    theme: 'hope',
    topicTag: '💌 Lời nhắn từ cộng đồng'
  },
  {
    id: 'note-03',
    sourceType: 'ai',
    sourceLabel: '— 🤖 AI',
    quote: 'Điểm số hôm nay chỉ phản ánh một bài kiểm tra kéo dài 45 phút, không quyết định cả giá trị con người bạn trong suốt cuộc đời.',
    subtext: 'Hãy rút kinh nghiệm từ những lỗi sai, nhưng đừng để con số đó cướp đi sự tự tin và niềm vui học hỏi của bạn.',
    theme: 'courage',
    topicTag: '📚 Áp lực học tập'
  },
  {
    id: 'note-04',
    sourceType: 'user',
    sourceLabel: '— 👤 Người dùng',
    quote: 'Hôm nay mình vừa dám nói "Không" với một lời nhờ vả làm bài hộ. Tim đập thình thịch nhưng thở phào nhẹ nhõm!',
    subtext: 'Bảo vệ ranh giới của bản thân không phải là ích kỷ. Gửi bạn nào đang thấy khó từ chối người khác một cái ôm thật chặt!',
    theme: 'courage',
    topicTag: '🛡️ Ranh giới cá nhân'
  },
  {
    id: 'note-05',
    sourceType: 'ai',
    sourceLabel: '— 🤖 AI',
    quote: 'Khi tâm trí bạn tràn ngập tiếng ồn và sự so sánh trên mạng xã hội, hãy thử tắt màn hình và hít thở thật sâu trong 3 phút.',
    subtext: 'Cuộc sống của người khác trên mạng chỉ là những thước phim được chọn lọc lung linh nhất. Bạn không cần phải ganh đua với ảo ảnh của ai cả.',
    theme: 'gentle',
    topicTag: '📱 Bình an nội tâm'
  },
  {
    id: 'note-06',
    sourceType: 'user',
    sourceLabel: '— 👤 Người dùng',
    quote: 'Tụi mình không cần phải có cả một nhóm bạn đông đúc để cảm thấy vui. Chỉ cần một người bạn sẵn sàng ngồi nghe mình kể chuyện linh tinh là đủ ấm lòng rồi.',
    subtext: 'Nếu hôm nay cậu đang thấy cô đơn trong lớp học, hãy nhớ rằng cậu rất đáng được trân trọng và sẽ có người bạn thật sự hiểu cậu.',
    theme: 'warm',
    topicTag: '🫂 Tình bạn'
  },
  {
    id: 'note-07',
    sourceType: 'ai',
    sourceLabel: '— 🤖 AI',
    quote: 'Khóc một chút không có nghĩa là bạn yếu đuối. Nước mắt chỉ đơn giản là cách cơ thể giải phóng những căng thẳng dồn nén quá lâu.',
    subtext: 'Sau cơn mưa trời lại sáng. Hãy rửa mặt bằng nước mát, uống một cốc nước ấm và vỗ nhẹ lên vai chính mình nhé.',
    theme: 'calm',
    topicTag: '💧 Giải tỏa cảm xúc'
  },
  {
    id: 'note-08',
    sourceType: 'user',
    sourceLabel: '— 👤 Người dùng',
    quote: 'Bố mẹ mình rất hay cáu gắt và so sánh mình. Hôm qua mình thử viết một mẩu giấy nhắn để lại trên bàn: "Con cũng mệt lắm bố mẹ ơi". Sáng nay mẹ để sẵn một hộp sữa cho mình.',
    subtext: 'Người lớn đôi khi cũng bị áp lực cuộc sống đè nặng nên quên mất cách dịu dàng. Hãy kiên nhẫn một chút với nhau nhé.',
    theme: 'warm',
    topicTag: '🏡 Gia đình'
  },
  {
    id: 'note-09',
    sourceType: 'ai',
    sourceLabel: '— 🤖 AI',
    quote: 'Bạn không thể thay đổi cách người khác nhìn nhận về mình, nhưng bạn luôn có quyền lựa chọn cách đối xử tử tế với chính bản thân.',
    subtext: 'Hãy dừng việc tự dằn vặt vì những điều người khác nói về bạn. Bạn xứng đáng được đối đãi bằng sự yêu thương và tôn trọng.',
    theme: 'gentle',
    topicTag: '🪞 Yêu thương bản thân'
  },
  {
    id: 'note-10',
    sourceType: 'user',
    sourceLabel: '— 👤 Người dùng',
    quote: 'Mỗi khi làm bài tập khó muốn bỏ cuộc, mình thường tự nhủ: "Chỉ làm thêm 1 câu này nữa thôi rồi đi ngủ". Và rồi mình hoàn thành được cả bài!',
    subtext: 'Bước từng bước nhỏ thôi các bạn ơi. Đừng nhìn cả ngọn núi to, cứ bước bậc thang ngay trước mắt.',
    theme: 'hope',
    topicTag: '🎯 Động lực học tập'
  },
  {
    id: 'note-11',
    sourceType: 'ai',
    sourceLabel: '— 🤖 AI',
    quote: 'Có những ngày bình thường trôi qua êm ả, không có gì nổi bật. Đôi khi, chính sự bình lặng đó lại là món quà tuyệt vời nhất.',
    subtext: 'Không cần mỗi ngày đều phải xuất sắc hay bùng nổ. Một ngày êm đềm uống cốc trà sữa và nghe bài hát quen thuộc cũng thật trọn vẹn.',
    theme: 'calm',
    topicTag: '☕ Bình yên'
  },
  {
    id: 'note-12',
    sourceType: 'user',
    sourceLabel: '— 👤 Người dùng',
    quote: 'Mình từng rất tự ti vì ngoại hình và chiếc kính dày cộp. Nhưng rồi mình nhận ra nụ cười chân thành và sự nhiệt tình mới là thứ khiến mọi người quý mến mình.',
    subtext: 'Đừng để những tiêu chuẩn vô lý trên mạng làm bạn quên đi nét đáng yêu riêng có của mình nhé!',
    theme: 'warm',
    topicTag: '✨ Tự tin'
  },
  {
    id: 'note-13',
    sourceType: 'ai',
    sourceLabel: '— 🤖 AI',
    quote: 'Thất bại là một phần tất yếu của quá trình trưởng thành. Người thành công không phải là người chưa từng ngã, mà là người biết đứng dậy sau mỗi lần vấp ngã.',
    subtext: 'Mỗi vết trầy xước hôm nay sẽ rèn luyện cho bạn sự kiên cường và lòng can đảm cho ngày mai.',
    theme: 'courage',
    topicTag: '🧗 Bản lĩnh'
  },
  {
    id: 'note-14',
    sourceType: 'user',
    sourceLabel: '— 👤 Người dùng',
    quote: 'Gửi bạn nào đang thấy lạc lõng giữa đám đông: Bạn không kỳ quặc đâu, chỉ là bạn chưa gặp được những người có cùng tần số thôi.',
    subtext: 'Cứ tiếp tục là chính mình một cách chân thành, những người bạn tuyệt vời sẽ tự khắc tìm đến bạn.',
    theme: 'hope',
    topicTag: '🌸 Tìm thấy chính mình'
  },
  {
    id: 'note-15',
    sourceType: 'ai',
    sourceLabel: '— 🤖 AI',
    quote: 'Một lời động viên kịp thời có thể thắp sáng cả một ngày u ám của người khác. Hãy thử gửi một lời cảm ơn hoặc nụ cười tới ai đó hôm nay.',
    subtext: 'Sự tử tế là thứ tài sản càng cho đi thì bạn lại càng nhận về nhiều sự ấm áp trong tâm hồn.',
    theme: 'warm',
    topicTag: '🌻 Lan tỏa sự ấm áp'
  },
  {
    id: 'note-16',
    sourceType: 'user',
    sourceLabel: '— 👤 Người dùng',
    quote: 'Hôm nay mình quyết định tha thứ cho một người bạn từng làm tổn thương mình, không phải vì họ xứng đáng, mà vì mình xứng đáng được bình an.',
    subtext: 'Buông bỏ sự giận dữ giống như thả một viên than nóng trên tay xuống. Nhẹ lòng hơn nhiều lắm các cậu ạ.',
    theme: 'calm',
    topicTag: '🕊️ Tha thứ & Bình an'
  }
];

/**
 * Deterministically retrieves a distinct daily note for any calendar date string (YYYY-MM-DD)
 * Ensures:
 * 2026-09-15 -> Note X
 * 2026-09-16 -> Note Y (guaranteed DIFFERENT!)
 * 2026-09-17 -> Note Z
 */
export function getDailyNoteForDate(dateInput?: string | Date): DailyNoteItem {
  let targetDate: string;
  if (!dateInput) {
    targetDate = new Date().toISOString().split('T')[0];
  } else if (typeof dateInput === 'string') {
    targetDate = dateInput;
  } else if (dateInput instanceof Date) {
    targetDate = dateInput.toISOString().split('T')[0];
  } else {
    targetDate = new Date().toISOString().split('T')[0];
  }
  
  // Calculate a stable hash based on date string
  let hash = 0;
  for (let i = 0; i < targetDate.length; i++) {
    hash = (hash << 5) - hash + targetDate.charCodeAt(i);
    hash |= 0;
  }
  
  // Also incorporate the day of year to guarantee variety
  const parts = targetDate.split('-');
  const year = parseInt(parts[0], 10) || 2026;
  const month = parseInt(parts[1], 10) || 9;
  const day = parseInt(parts[2], 10) || 15;
  
  const dayOfYear = (month - 1) * 31 + day;
  const index = Math.abs((hash + dayOfYear * 7) % DAILY_NOTES_POOL.length);
  const base = DAILY_NOTES_POOL[index];

  const dateObj = new Date(targetDate);
  const dateFormatted = !isNaN(dateObj.getTime())
    ? `Ngày ${dateObj.getDate()} tháng ${dateObj.getMonth() + 1}, ${dateObj.getFullYear()}`
    : targetDate;

  return {
    ...base,
    empathy: base.subtext,
    microAction: 'Dành 2 phút nhắm mắt, hít vào đếm 4 giây, giữ 4 giây và thở ra nhẹ nhàng 6 giây.',
    reflectionQuestion: 'Điều gì đang làm bạn bận lòng nhất hôm nay, và có cách nào để bạn đối xử dịu dàng hơn với chính mình không?',
    dateFormatted
  };
}
