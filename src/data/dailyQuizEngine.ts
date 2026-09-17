import { Quiz, QuizQuestion, QuizResultLevel } from '../types';

export interface DailyQuizInfo {
  dateKey: string; // YYYY-MM-DD
  dayOfWeekName: string; // Thứ Hai, Thứ Ba...
  fullFormattedDate: string; // Thứ Tư, 16 tháng 09, 2026
  themeTitle: string;
  dailyQuote: {
    quote: string;
    author: string;
  };
  dailyTip: string;
  quiz: Quiz;
}

// 7 Daily Thematic Quizzes - 10 questions each, tailored for each day of the week
export const WEEKDAY_QUIZZES: Record<number, {
  themeTitle: string;
  icon: string;
  description: string;
  quote: { quote: string; author: string };
  dailyTip: string;
  questions: QuizQuestion[];
  results: {
    low: QuizResultLevel;
    medium: QuizResultLevel;
    high: QuizResultLevel;
    veryHigh: QuizResultLevel;
  };
}> = {
  // 1: Thứ Hai (Monday)
  1: {
    themeTitle: 'Năng lượng đầu tuần & Vượt qua trì hoãn học tập',
    icon: '🚀',
    description: 'Kiểm tra mức độ sẵn sàng, cảm xúc khởi động tuần mới và cách bạn đối diện với khối lượng bài vở sắp tới.',
    quote: {
      quote: 'Bí mật của việc tiến lên phía trước là hãy bắt đầu từ những bước đi nhỏ nhất.',
      author: 'Mark Twain'
    },
    dailyTip: 'Sáng thứ Hai, hãy chọn ra 1 việc quan trọng nhất cần hoàn thành thay vì ôm đồm cả danh sách dài.',
    questions: [
      {
        id: 1,
        question: 'Tối Chủ nhật hoặc sáng thứ Hai thức dậy, cảm xúc đầu tiên xuất hiện trong bạn là:',
        options: [
          { label: 'Hào hứng, mong được gặp bạn bè và học những điều mới', score: 1 },
          { label: 'Hơi tiếc nuối ngày nghỉ nhưng sẵn sàng khởi động', score: 2 },
          { label: 'Uể oải, thở dài ngao ngán khi nghĩ đến chuỗi ngày học', score: 3 },
          { label: 'Hoảng sợ, ngột ngạt và muốn trốn tránh thực tại', score: 4 }
        ]
      },
      {
        id: 2,
        question: 'Khi nhìn vào thời khóa biểu và danh sách bài tập của tuần này, bạn:',
        options: [
          { label: 'Ghi chép kế hoạch rõ ràng và thấy mọi thứ trong tầm tay', score: 1 },
          { label: 'Có chút áp lực nhưng tự tin sẽ sắp xếp được', score: 2 },
          { label: 'Cảm thấy ngập đầu và không biết nên bắt đầu từ đâu', score: 3 },
          { label: 'Hoàn toàn tê liệt, muốn bỏ mặc tất cả', score: 4 }
        ]
      },
      {
        id: 3,
        question: 'Mức độ bạn trì hoãn việc bắt tay vào làm bài tập đầu tuần:',
        options: [
          { label: 'Bắt tay vào làm ngay đúng giờ đã định', score: 1 },
          { label: 'Trì hoãn khoảng 15-30 phút rồi cũng ngồi vào bàn', score: 2 },
          { label: 'Lướt mạng xã hội hàng tiếng đồng hồ để trốn tránh việc học', score: 3 },
          { label: 'Để dồn bài tập đến đêm muộn sát hạn nộp mới cuống cuồng làm', score: 4 }
        ]
      },
      {
        id: 4,
        question: 'Năng lượng thể chất của bạn trong những tiết học đầu tiên của ngày thứ Hai:',
        options: [
          { label: 'Tỉnh táo, tập trung và năng nổ phát biểu', score: 1 },
          { label: 'Hơi ngáp ngủ lúc đầu nhưng sau đó bắt nhịp tốt', score: 2 },
          { label: 'Mệt mỏi, mắt đờ đẫn và phải uống nước ngọt/cà phê để tỉnh', score: 3 },
          { label: 'Gục xuống bàn ngủ li bì hoặc đau đầu, mệt lả', score: 4 }
        ]
      },
      {
        id: 5,
        question: 'Khi thầy cô giao một dự án nhóm hoặc bài thuyết trình mới vào đầu tuần, bạn:',
        options: [
          { label: 'Hào hứng đón nhận và chủ động kết nối bạn bè', score: 1 },
          { label: 'Thấy bình thường, coi như nhiệm vụ phải hoàn thành', score: 2 },
          { label: 'Thấy phiền toái và lo sợ không ai hợp tác với mình', score: 3 },
          { label: 'Cực kỳ ám ảnh, sợ hãi vì áp lực phải gánh team hoặc bị cô lập', score: 4 }
        ]
      },
      {
        id: 6,
        question: 'Bạn có mục tiêu cụ thể nào muốn hoàn thành trong tuần này không?',
        options: [
          { label: 'Có mục tiêu rõ ràng và lộ trình từng ngày cụ thể', score: 1 },
          { label: 'Có vài ý định chung chung trong đầu', score: 2 },
          { label: 'Chỉ trôi theo thời khóa biểu, đến đâu hay đến đó', score: 3 },
          { label: 'Mất hết phương hướng, không biết mình học để làm gì', score: 4 }
        ]
      },
      {
        id: 7,
        question: 'Khi gặp sự cố nhỏ đầu tuần (quên đồ dùng, đi học muộn, bị điểm trừ), bạn:',
        options: [
          { label: 'Bình tĩnh tìm cách khắc phục và rút kinh nghiệm', score: 1 },
          { label: 'Hơi buồn một chút rồi cho qua nhanh', score: 2 },
          { label: 'Nghĩ rằng "cả tuần này coi như xui xẻo rồi" và ủ rũ cả ngày', score: 3 },
          { label: 'Tức giận dữ dội, tự trách móc bản thân thậm tệ', score: 4 }
        ]
      },
      {
        id: 8,
        question: 'Khả năng tập trung của não bộ bạn khi ngồi học bài tối thứ Hai:',
        options: [
          { label: 'Tập trung sâu 45-60 phút mà không bị phân tâm', score: 1 },
          { label: 'Thỉnh thoảng nhìn điện thoại nhưng vẫn hoàn thành tốt', score: 2 },
          { label: 'Đầu óc bay bổng, nghĩ miên man và mất hàng giờ cho 1 bài tập nhỏ', score: 3 },
          { label: 'Không thể tiếp thu chữ nào, ngồi nhìn sách trong vô vọng', score: 4 }
        ]
      },
      {
        id: 9,
        question: 'Bạn có cảm thấy bản thân có đủ khả năng hoàn thành tốt các bài kiểm tra tuần này không?',
        options: [
          { label: 'Hoàn toàn tự tin vào sự chăm chỉ của mình', score: 1 },
          { label: 'Khá tự tin nếu ôn tập kỹ càng', score: 2 },
          { label: 'Luôn nghi ngờ bản thân, sợ mình không bằng bạn bè', score: 3 },
          { label: 'Tuyệt vọng, nghĩ rằng mình chắc chắn sẽ thất bại', score: 4 }
        ]
      },
      {
        id: 10,
        question: 'Bạn có dành ít nhất 15 phút đầu tuần để làm điều mình yêu thích (nghe bài hát hay, đi dạo) không?',
        options: [
          { label: 'Luôn dành thời gian nạp niềm vui cho tâm hồn', score: 1 },
          { label: 'Thỉnh thoảng nếu còn thời gian', score: 2 },
          { label: 'Hiếm khi, lịch học cuốn phăng mọi sở thích', score: 3 },
          { label: 'Hoàn toàn không, cảm thấy có lỗi nếu dám giải trí', score: 4 }
        ]
      }
    ],
    results: {
      low: {
        level: 'low',
        title: 'Năng lượng đầu tuần: Bứt phá & Đầy hứng khởi 🟢',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        summary: 'Bạn đang có một tinh thần khởi động tuần mới vô cùng tích cực và tràn đầy sinh lực. Sự chủ động này là chìa khóa giúp bạn học tập nhẹ nhàng mà hiệu quả.',
        actionAdvice: [
          'Duy trì thói quen viết 3 việc quan trọng nhất cần làm mỗi ngày.',
          'Lan tỏa nụ cười và năng lượng ấm áp này tới các bạn trong lớp nhé.'
        ]
      },
      medium: {
        level: 'medium',
        title: 'Năng lượng đầu tuần: Ổn định, cần thêm chút động lực 🟡',
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
        summary: 'Bạn bắt nhịp tuần mới khá tốt dù đôi lúc còn chút bỡ ngỡ và thói quen trì hoãn nhỏ. Chỉ cần một cú hích nhẹ là bạn sẽ vào phom học tập ngay.',
        actionAdvice: [
          'Áp dụng quy tắc "2 phút": Việc gì tốn dưới 2 phút hãy làm ngay lập tức.',
          'Uống một ly nước ấm và giãn cơ nhẹ nhàng trước khi ngồi vào bàn học.'
        ]
      },
      high: {
        level: 'high',
        title: 'Năng lượng đầu tuần: Quá tải & Trì hoãn báo động 🟠',
        badgeColor: 'bg-orange-100 text-orange-800 border-orange-300',
        summary: 'Tâm trí bạn đang bị đè nặng bởi danh sách bài vở và nỗi sợ thất bại. Việc trì hoãn thực chất là cơ chế phòng vệ của não bộ khi cảm thấy quá tải.',
        actionAdvice: [
          'Đừng cố làm hết cả núi bài tập! Hãy chia nhỏ bài tập thành từng mẩu 15 phút.',
          'Cất điện thoại sang phòng khác trong 45 phút học đầu tiên tối nay.'
        ]
      },
      veryHigh: {
        level: 'very-high',
        title: 'Năng lượng đầu tuần: Kiệt sức & Ngột ngạt tâm lý 🔴',
        badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
        summary: 'Bạn đang rơi vào trạng thái "tê liệt vì áp lực" (Analysis Paralysis). Đầu tuần không mang lại hy vọng mà như một gánh nặng khổng lồ chực đè bẹp bạn.',
        actionAdvice: [
          'Hãy cho phép bản thân nghỉ ngơi 1 buổi tối hôm nay không chạm vào sách vở.',
          'Tâm sự thật lòng với người bạn tin cậy hoặc giáo viên chủ nhiệm về khối lượng bài vở.',
          'Nhớ rằng bạn không đơn độc, hãy tìm kiếm sự trợ giúp nếu cảm thấy quá bế tắc.'
        ]
      }
    }
  },

  // 2: Thứ Ba (Tuesday)
  2: {
    themeTitle: 'Giải tỏa áp lực bài vở & Kỹ năng giữ bình tĩnh',
    icon: '⚡',
    description: 'Đánh giá cách bạn đối diện với chuỗi bài kiểm tra 15 phút, bài tập về nhà và áp lực điểm số giữa tuần.',
    quote: {
      quote: 'Không phải hoàn cảnh làm ta kiệt sức, mà chính là cách ta gồng mình chống chọi.',
      author: 'Lời khuyên học đường'
    },
    dailyTip: 'Khi cảm thấy căng thẳng, hãy hít sâu 4 giây, giữ 4 giây và thở ra từ từ 6 giây.',
    questions: [
      {
        id: 1,
        question: 'Khi giáo viên bất ngờ thông báo "Cả lớp lấy giấy ra kiểm tra 15 phút", bạn phản ứng ra sao?',
        options: [
          { label: 'Bình tĩnh lật giấy làm bài với những gì mình đã nắm được', score: 1 },
          { label: 'Hơi giật mình nhưng nhanh chóng tập trung vào đề', score: 2 },
          { label: 'Tim đập thình thịch, tay run và toát mồ hôi hột', score: 3 },
          { label: 'Đầu óc hoàn toàn trống rỗng, muốn khóc hoặc muốn chạy trốn', score: 4 }
        ]
      },
      {
        id: 2,
        question: 'Số lượng bài tập về nhà trong ngày hôm nay khiến bạn cảm thấy:',
        options: [
          { label: 'Vừa sức và có thể hoàn thành trong 1-2 tiếng', score: 1 },
          { label: 'Hơi nhiều một chút nhưng thức thêm một tí là xong', score: 2 },
          { label: 'Quá tải, cảm giác như làm mãi không bao giờ hết', score: 3 },
          { label: 'Ác mộng kinh hoàng, làm đến nửa đêm vẫn còn một nửa', score: 4 }
        ]
      },
      {
        id: 3,
        question: 'Khi làm sai một bài tập quan trọng mà bạn đã ôn kỹ, suy nghĩ đầu tiên của bạn là:',
        options: [
          { label: 'Xem lại mình nhầm ở bước nào để lần sau không lặp lại', score: 1 },
          { label: 'Hơi tiếc nuối và tự dặn mình cẩn thận hơn', score: 2 },
          { label: 'Tự mắng mình sao mà bất cẩn và ngốc nghếch thế', score: 3 },
          { label: 'Thấy mình là kẻ thất bại, mất hết hy vọng vào môn học này', score: 4 }
        ]
      },
      {
        id: 4,
        question: 'Bạn có cảm thấy áp lực phải luôn đạt điểm 9, điểm 10 từ gia đình không?',
        options: [
          { label: 'Bố mẹ khuyến khích nỗ lực chứ không ép buộc điểm số', score: 1 },
          { label: 'Bố mẹ có kỳ vọng nhưng không quá khắt khe', score: 2 },
          { label: 'Chỉ cần bị điểm dưới 8 là không khí gia đình trở nên u ám', score: 3 },
          { label: 'Điểm số quyết định mọi sự tôn trọng và tình thương trong nhà', score: 4 }
        ]
      },
      {
        id: 5,
        question: 'Bạn có thường xuyên cắn móng tay, rung đùi hoặc bứt tóc khi ngồi học bài không?',
        options: [
          { label: 'Không có các thói quen này, cơ thể thả lỏng', score: 1 },
          { label: 'Thỉnh thoảng rung đùi khi suy nghĩ bài khó', score: 2 },
          { label: 'Thường xuyên cắn móng tay hoặc nghiến răng vô thức', score: 3 },
          { label: 'Cơ thể căng cứng, đau dạ dày hoặc khó thở khi gặp bài khó', score: 4 }
        ]
      },
      {
        id: 6,
        question: 'Khi bạn bè cùng bàn làm bài xong trước bạn rất lâu, bạn cảm thấy:',
        options: [
          { label: 'Mừng cho bạn, mình tiếp tục làm theo tốc độ của mình', score: 1 },
          { label: 'Hơi sốt ruột một chút nhưng vẫn bình tĩnh', score: 2 },
          { label: 'Rất hoang mang, sợ mình chậm chạp và kém cỏi hơn', score: 3 },
          { label: 'Hoảng loạn, cuống cuồng khoanh bừa để nộp cho kịp bạn', score: 4 }
        ]
      },
      {
        id: 7,
        question: 'Thời gian bạn nghỉ ngơi giữa các ca học bài ở nhà:',
        options: [
          { label: 'Cứ học 45 phút lại đứng dậy đi lại thư giãn 5-10 phút', score: 1 },
          { label: 'Nghỉ giải lao khi hoàn thành xong một môn', score: 2 },
          { label: 'Ngồi lì một chỗ 3-4 tiếng liên tục không dám đứng dậy', score: 3 },
          { label: 'Vừa học vừa sợ hãi thời gian trôi qua, không dám thở phào', score: 4 }
        ]
      },
      {
        id: 8,
        question: 'Bạn có dám hỏi lại thầy cô khi nghe giảng chưa hiểu bài trên lớp không?',
        options: [
          { label: 'Tự tin giơ tay hỏi ngay hoặc hỏi thầy cô giờ ra chơi', score: 1 },
          { label: 'Hỏi bạn bè ngồi bên cạnh để nhờ giải thích lại', score: 2 },
          { label: 'Không dám hỏi vì sợ thầy cô mắng hoặc bạn bè cười chê', score: 3 },
          { label: 'Im lặng giấu dốt hoàn toàn dù trong lòng đang rất hoang mang', score: 4 }
        ]
      },
      {
        id: 9,
        question: 'Mức độ bạn lo sợ về kỳ thi giữa kỳ hoặc cuối kỳ sắp diễn ra:',
        options: [
          { label: 'Bình thường, chỉ cần ôn bài đầy đủ là sẽ ổn', score: 1 },
          { label: 'Hơi lo lắng ở những môn mình chưa chắc kiến thức', score: 2 },
          { label: 'Rất lo âu, đêm nào cũng nghĩ về đề thi khó', score: 3 },
          { label: 'Ám ảnh kinh hoàng, cảm giác tương lai phụ thuộc hoàn toàn vào bài thi', score: 4 }
        ]
      },
      {
        id: 10,
        question: 'Khi hoàn thành xong bài vở của ngày hôm nay, bạn có tự khen ngợi bản thân một câu không?',
        options: [
          { label: 'Luôn tự mỉm cười và tự hào vì mình đã rất cố gắng', score: 1 },
          { label: 'Thỉnh thoảng thấy nhẹ nhõm', score: 2 },
          { label: 'Hiếm khi, chỉ nghĩ đến ngày mai còn cả đống bài khác', score: 3 },
          { label: 'Không bao giờ, luôn thấy mình chưa làm đủ tốt', score: 4 }
        ]
      }
    ],
    results: {
      low: {
        level: 'low',
        title: 'Áp lực học tập: Làm chủ tuyệt vời 🟢',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        summary: 'Bạn có kỹ năng giữ bình tĩnh và quản lý cảm xúc trước bài vở rất tốt. Điểm số với bạn là thước đo kiến thức chứ không phải thước đo giá trị bản thân.',
        actionAdvice: [
          'Duy trì phương pháp học ngắt quãng Pomodoro.',
          'Hướng dẫn bí quyết giữ bình tĩnh cho các bạn cùng bàn nhé.'
        ]
      },
      medium: {
        level: 'medium',
        title: 'Áp lực học tập: Căng thẳng vừa phải 🟡',
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
        summary: 'Bạn có chút lo âu trước các bài kiểm tra nhưng vẫn kiểm soát được hành vi. Đừng quá khắt khe nếu có một vài bài kiểm tra chưa như ý.',
        actionAdvice: [
          'Tập thở sâu trước khi mở đề thi.',
          'Nhắc nhở bản thân: "Một bài kiểm tra không định nghĩa tương lai của mình".'
        ]
      },
      high: {
        level: 'high',
        title: 'Áp lực học tập: Nguy cơ quá tải cao 🟠',
        badgeColor: 'bg-orange-100 text-orange-800 border-orange-300',
        summary: 'Bộ não của bạn đang chịu tải quá mức. Nỗi sợ hãi điểm kém đang làm suy giảm khả năng ghi nhớ và tư duy logic của bạn.',
        actionAdvice: [
          'Tuyệt đối không học dồn thâu đêm.',
          'Chia nhỏ môn học khó ra làm nhiều phiên ngắn 20 phút.'
        ]
      },
      veryHigh: {
        level: 'very-high',
        title: 'Áp lực học tập: Báo động kiệt sức 🔴',
        badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
        summary: 'Bạn đang bị hoảng loạn thi cử (Test Anxiety). Áp lực này đang ảnh hưởng trực tiếp đến hệ tiêu hóa, giấc ngủ và tinh thần của bạn.',
        actionAdvice: [
          'Dừng việc học thêm nếu lịch học đang làm bạn ngạt thở.',
          'Nói chuyện với phòng tâm lý học đường của trường ngay hôm nay.'
        ]
      }
    }
  },

  // 3: Thứ Tư (Wednesday)
  3: {
    themeTitle: 'Kết nối bạn bè & Nhận diện sự cô đơn học đường',
    icon: '🫂',
    description: 'Khám phá mức độ an toàn trong các mối quan hệ lớp học, cảm giác thuộc về và cách bạn chữa lành sự cô đơn giữa đám đông.',
    quote: {
      quote: 'Một người bạn chân thành là người hiểu được nỗi buồn ẩn sau nụ cười của bạn.',
      author: 'Thông điệp tình bạn'
    },
    dailyTip: 'Hôm nay, hãy mỉm cười hoặc hỏi thăm chân thành một người bạn mà lâu rồi bạn chưa trò chuyện.',
    questions: [
      {
        id: 1,
        question: 'Vào giờ ra chơi giữa buổi học, bạn thường làm gì?',
        options: [
          { label: 'Tụ tập nói cười, chơi thể thao hoặc chia sẻ đồ ăn cùng bạn bè', score: 1 },
          { label: 'Ngồi trò chuyện nhẹ nhàng với 1-2 bạn thân bên cạnh', score: 2 },
          { label: 'Cắm mặt vào điện thoại hoặc giả vờ ngủ để không phải tiếp xúc', score: 3 },
          { label: 'Ngồi một góc cô độc, cảm thấy mình hoàn toàn vô hình trong lớp', score: 4 }
        ]
      },
      {
        id: 2,
        question: 'Khi lớp có hoạt động chia nhóm làm bài tập hoặc văn nghệ, bạn thường:',
        options: [
          { label: 'Được nhiều bạn rủ vào nhóm ngay lập tức', score: 1 },
          { label: 'Chủ động xin vào nhóm của người bạn mình quen', score: 2 },
          { label: 'Ngồi chờ giáo viên chỉ định nhóm vì không ai rủ mình', score: 3 },
          { label: 'Cảm giác bị bỏ rơi, không nhóm nào chịu nhận mình', score: 4 }
        ]
      },
      {
        id: 3,
        question: 'Bạn có cảm thấy có người bạn nào trong trường thực sự hiểu và lắng nghe bạn không?',
        options: [
          { label: 'Có ít nhất 1-2 người bạn tri kỷ để tâm sự mọi điều', score: 1 },
          { label: 'Có bạn chơi cùng nhưng ít khi chia sẻ chuyện thầm kín', score: 2 },
          { label: 'Hiếm khi, cảm thấy mọi người chỉ chơi xã giao bề nổi', score: 3 },
          { label: 'Hoàn toàn không có ai, xung quanh toàn là sự phán xét', score: 4 }
        ]
      },
      {
        id: 4,
        question: 'Khi bạn vắng mặt một buổi học vì ốm, chuyện gì thường xảy ra?',
        options: [
          { label: 'Nhiều bạn nhắn tin hỏi thăm và chủ động gửi vở chép bài giúp', score: 1 },
          { label: 'Có bạn thân hỏi han và hỗ trợ bài vở', score: 2 },
          { label: 'Chỉ có lớp trưởng hỏi lý do xin nghỉ', score: 3 },
          { label: 'Không một ai nhận ra hay bận tâm đến sự vắng mặt của bạn', score: 4 }
        ]
      },
      {
        id: 5,
        question: 'Bạn có bao giờ phải chịu đựng những lời trêu chọc ác ý về ngoại hình, giọng nói hoặc gia cảnh không?',
        options: [
          { label: 'Chưa từng, bạn bè luôn đối xử tôn trọng và văn minh', score: 1 },
          { label: 'Thỉnh thoảng có đùa vui nhẹ nhưng không ác ý', score: 2 },
          { label: 'Khá thường xuyên bị lấy làm trò cười sau lưng', score: 3 },
          { label: 'Bị bạo lực lời nói (Body shaming) liên tục, cảm thấy đau đớn', score: 4 }
        ]
      },
      {
        id: 6,
        question: 'Khi nhóm bạn có những trò đùa tiêu cực hoặc nói xấu người khác, bạn:',
        options: [
          { label: 'Khuyên can hoặc từ chối tham gia câu chuyện độc hại', score: 1 },
          { label: 'Im lặng không hưởng ứng và đổi chủ đề khác', score: 2 },
          { label: 'Cười hùa theo cho xong vì sợ bị coi là "khác người"', score: 3 },
          { label: 'Cảm thấy sợ hãi rằng ngày mai mình sẽ là nạn nhân tiếp theo', score: 4 }
        ]
      },
      {
        id: 7,
        question: 'Bạn có cảm thấy mệt mỏi vì phải gồng mình đeo một chiếc "mặt nạ vui vẻ" khi đến lớp?',
        options: [
          { label: 'Không, mình sống thật với cảm xúc của mình', score: 1 },
          { label: 'Đôi lúc phải che giấu nỗi buồn riêng', score: 2 },
          { label: 'Rất thường xuyên, lúc nào cũng phải tỏ ra ổn dù bên trong đang vỡ vụn', score: 3 },
          { label: 'Kiệt sức hoàn toàn vì cả ngày phải đóng kịch làm người hoạt bát', score: 4 }
        ]
      },
      {
        id: 8,
        question: 'Khi tan học bước ra khỏi cổng trường, cảm xúc đọng lại trong bạn là:',
        options: [
          { label: 'Vui vẻ, tiếc nuối vì một ngày học trôi qua quá nhanh', score: 1 },
          { label: 'Thoải mái nhẹ nhõm như bình thường', score: 2 },
          { label: 'Thấy trống trải và hơi cô đơn trên đường về', score: 3 },
          { label: 'Thở phào như vừa thoát khỏi một trận địa ngục tinh thần', score: 4 }
        ]
      },
      {
        id: 9,
        question: 'Bạn có dám mở lời kết bạn với một người bạn mới trong trường không?',
        options: [
          { label: 'Rất tự nhiên và cởi mở làm quen', score: 1 },
          { label: 'Hơi ngại ngùng lúc đầu nhưng vẫn làm quen được', score: 2 },
          { label: 'Rất sợ bị từ chối nên hầu như không bao giờ mở lời trước', score: 3 },
          { label: 'Ám ảnh sợ hãi giao tiếp xã hội, luôn co cụm phòng thủ', score: 4 }
        ]
      },
      {
        id: 10,
        question: 'Bạn nghĩ gì về giá trị của chính mình trong mắt tập thể lớp?',
        options: [
          { label: 'Mình là một mảnh ghép độc đáo, đáng quý và được tôn trọng', score: 1 },
          { label: 'Mình có vị trí riêng trong nhóm nhỏ của mình', score: 2 },
          { label: 'Mình cảm thấy mình mờ nhạt và thừa thãi trong lớp', score: 3 },
          { label: 'Mình nghĩ mọi người đều ghét bỏ hoặc coi thường mình', score: 4 }
        ]
      }
    ],
    results: {
      low: {
        level: 'low',
        title: 'Mối quan hệ bạn bè: Gắn kết ấm áp 🟢',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        summary: 'Bạn đang có một môi trường tình bạn rất lành mạnh và an toàn. Bạn biết cách chọn bạn tốt và có sự đồng cảm tuyệt vời với mọi người.',
        actionAdvice: [
          'Tiếp tục nuôi dưỡng những tình bạn chân thành này.',
          'Hãy mở rộng vòng tay giúp đỡ những bạn đang có vẻ cô đơn trong lớp.'
        ]
      },
      medium: {
        level: 'medium',
        title: 'Mối quan hệ bạn bè: An toàn nhưng còn chút khoảng cách 🟡',
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
        summary: 'Bạn có bạn bè bên cạnh nhưng đôi khi vẫn có những khoảnh khắc cảm thấy chưa được thấu hiểu sâu sắc.',
        actionAdvice: [
          'Dũng cảm chia sẻ một chút cảm xúc thật của mình với người bạn tin cậy nhất.',
          'Học cách lắng nghe chủ động khi bạn bè tâm sự.'
        ]
      },
      high: {
        level: 'high',
        title: 'Mối quan hệ bạn bè: Cảm giác cô đơn & Áp lực hòa nhập 🟠',
        badgeColor: 'bg-orange-100 text-orange-800 border-orange-300',
        summary: 'Bạn đang cảm thấy cô độc giữa tập thể và có xu hướng thu mình lại. Nỗi sợ bị từ chối đang ngăn cản bạn tìm thấy những người bạn tâm đầu ý hợp.',
        actionAdvice: [
          'Tìm kiếm bạn bè qua các câu lạc bộ sở thích (vẽ tranh, sách, thể thao).',
          'Nhớ rằng: Thà có 1 người bạn chân thành còn hơn có 10 người bạn giả tạo.'
        ]
      },
      veryHigh: {
        level: 'very-high',
        title: 'Mối quan hệ bạn bè: Bị cô lập & Tổn thương học đường 🔴',
        badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
        summary: 'Bạn đang trải qua sự tổn thương sâu sắc do bị xa lánh hoặc bạo lực tinh thần trong trường học. Đây là điều không một ai đáng phải chịu đựng!',
        actionAdvice: [
          'Nói ngay với giáo viên chủ nhiệm hoặc chuyên viên tâm lý của trường.',
          'Nếu bị bắt nạt, hãy lưu lại bằng chứng và liên hệ phòng tư vấn học đường hoặc đường dây nóng phòng chống bạo lực (1800 1567).'
        ]
      }
    }
  },

  // 4: Thứ Năm (Thursday)
  4: {
    themeTitle: 'Tháo gỡ kỳ vọng điểm số & Đối thoại cùng gia đình',
    icon: '🎯',
    description: 'Đo lường sức nặng của kỳ vọng gia đình, sự so sánh ngầm và kỹ năng bày tỏ tiếng nói riêng một cách văn minh.',
    quote: {
      quote: 'Con đường của bạn không nhất thiết phải giống bản đồ mà người khác đã vẽ sẵn.',
      author: 'Khích lệ bản thân'
    },
    dailyTip: 'Thử nói với bố mẹ một câu: "Con cảm ơn bố/mẹ đã nấu bữa cơm ngon cho con hôm nay nhé".',
    questions: [
      {
        id: 1,
        question: 'Khi bố mẹ hỏi về điểm số kiểm tra, cảm xúc đầu tiên của bạn là:',
        options: [
          { label: 'Thoải mái kể vì bố mẹ luôn động viên dù điểm cao hay thấp', score: 1 },
          { label: 'Hơi lo lắng một chút nếu điểm chưa được như mong đợi', score: 2 },
          { label: 'Nơm nớp lo sợ, chỉ muốn giấu bài kiểm tra đi', score: 3 },
          { label: 'Kinh hoàng tột độ, sợ bị trừng phạt nặng nề hoặc mắng mỏ', score: 4 }
        ]
      },
      {
        id: 2,
        question: 'Mức độ bố mẹ bạn nhắc tới cụm từ "Con nhà người ta" hoặc anh chị em khác:',
        options: [
          { label: 'Hầu như không bao giờ so sánh', score: 1 },
          { label: 'Thỉnh thoảng nhắc nhở để làm gương', score: 2 },
          { label: 'Khá thường xuyên, khiến bạn thấy mình luôn thua kém', score: 3 },
          { label: 'Mỗi ngày đều bị đem ra so sánh và hạ thấp phẩm giá', score: 4 }
        ]
      },
      {
        id: 3,
        question: 'Bạn có cảm thấy mình đang học vì đam mê của mình hay học để làm hài lòng bố mẹ?',
        options: [
          { label: 'Học vì mục tiêu và ước mơ tương lai của chính bản thân', score: 1 },
          { label: 'Vừa vì bản thân vừa muốn bố mẹ vui lòng', score: 2 },
          { label: 'Phần lớn là học để bố mẹ không thất vọng và cằn nhằn', score: 3 },
          { label: 'Hoàn toàn sống và học theo kịch bản áp đặt của người lớn', score: 4 }
        ]
      },
      {
        id: 4,
        question: 'Khi bạn và bố mẹ có mâu thuẫn về định hướng hoặc lối sống, bạn thường:',
        options: [
          { label: 'Bình tĩnh trình bày lý lẽ và tìm giải pháp dung hòa', score: 1 },
          { label: 'Im lặng nghe bố mẹ nói hết rồi mới giải thích sau', score: 2 },
          { label: 'Nuốt nước mắt vào trong và đóng chặt cửa phòng', score: 3 },
          { label: 'Bùng nổ tranh cãi gay gắt, cảm giác không ai chịu hiểu mình', score: 4 }
        ]
      },
      {
        id: 5,
        question: 'Bố mẹ có biết được những sở thích thầm kín (viết lách, vẽ, game, âm nhạc) của bạn không?',
        options: [
          { label: 'Biết rất rõ và luôn ủng hộ nhiệt tình', score: 1 },
          { label: 'Biết một phần nhưng không quan tâm sâu', score: 2 },
          { label: 'Cho rằng sở thích đó là tốn thời gian và vô bổ', score: 3 },
          { label: 'Bạn phải giấu kín tuyệt đối vì sợ bị cấm đoán, tiêu hủy', score: 4 }
        ]
      },
      {
        id: 6,
        question: 'Không khí bữa cơm gia đình vào các buổi tối trong tuần:',
        options: [
          { label: 'Ấm cúng, rộn ràng tiếng cười và hỏi han lẫn nhau', score: 1 },
          { label: 'Bình thường, đôi khi có nhắc nhở việc học nhẹ nhàng', score: 2 },
          { label: 'Căng thẳng, bữa ăn biến thành phiên tòa xét xử điểm số', score: 3 },
          { label: 'Ngột ngạt tột độ, chỉ muốn ăn thật nhanh để chạy trốn về phòng', score: 4 }
        ]
      },
      {
        id: 7,
        question: 'Bạn có cảm thấy có lỗi khi bản thân muốn nghỉ ngơi vào cuối tuần không?',
        options: [
          { label: 'Không, nghỉ ngơi là quyền lợi chính đáng của cơ thể', score: 1 },
          { label: 'Đôi lúc thấy hơi bồn chồn nếu còn bài tập dở', score: 2 },
          { label: 'Rất tội lỗi, sợ bố mẹ thấy mình ngồi không sẽ mắng là lười', score: 3 },
          { label: 'Luôn phải giả vờ ngồi trước bàn học để bố mẹ không la mắng', score: 4 }
        ]
      },
      {
        id: 8,
        question: 'Khi bạn đạt thành tích tốt, bố mẹ công nhận bạn ra sao?',
        options: [
          { label: 'Ôm chúc mừng, khen ngợi nỗ lực và thưởng cho bạn', score: 1 },
          { label: 'Mỉm cười gật đầu và dặn tiếp tục cố gắng', score: 2 },
          { label: 'Coi đó là điều hiển nhiên ("Có gì đâu mà tự mãn")', score: 3 },
          { label: 'Vẫn chê bai ("Sao không được điểm tối đa như bạn kia")', score: 4 }
        ]
      },
      {
        id: 9,
        question: 'Mức độ bạn tin tưởng có thể chia sẻ một bí mật cá nhân với bố mẹ:',
        options: [
          { label: 'Hoàn toàn tin tưởng bố mẹ sẽ giữ kín và thông cảm', score: 1 },
          { label: 'Có thể chia sẻ một số chuyện không quá nhạy cảm', score: 2 },
          { label: 'Sợ bị bố mẹ mang ra chê trách hoặc kể cho họ hàng', score: 3 },
          { label: 'Tuyệt đối không bao giờ chia sẻ bất cứ điều gì', score: 4 }
        ]
      },
      {
        id: 10,
        question: 'Nếu được nhắn nhủ một câu thật lòng với bố mẹ lúc này, bạn muốn nói:',
        options: [
          { label: '"Con cảm ơn bố mẹ vì đã luôn thấu hiểu và yêu thương con"', score: 1 },
          { label: '"Con mong bố mẹ bớt lo lắng về con hơn một chút"', score: 2 },
          { label: '"Con mong bố mẹ hãy lắng nghe con nói trọn vẹn một lần"', score: 3 },
          { label: '"Con mệt mỏi quá rồi, xin hãy dừng việc ép buộc con lại"', score: 4 }
        ]
      }
    ],
    results: {
      low: {
        level: 'low',
        title: 'Mối quan hệ gia đình: Thấu hiểu & Nâng đỡ 🟢',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        summary: 'Bạn rất may mắn khi có gia đình là hậu phương vững chắc. Sự cởi mở và tôn trọng hai chiều giúp bạn phát triển lành mạnh.',
        actionAdvice: [
          'Duy trì những bữa cơm ấm áp và những cái ôm dành cho bố mẹ.',
          'Chủ động cảm ơn bố mẹ sau những nỗ lực chăm sóc gia đình.'
        ]
      },
      medium: {
        level: 'medium',
        title: 'Mối quan hệ gia đình: Có khoảng cách thế hệ nhẹ 🟡',
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
        summary: 'Người lớn có cách thể hiện tình yêu đôi khi hơi vụng về và áp đặt, nhưng sâu thẳm vẫn mong điều tốt cho bạn.',
        actionAdvice: [
          'Thử dùng phương pháp viết thư tay hoặc nhắn tin nếu nói trực tiếp dễ cãi nhau.',
          'Xem mục "Nói chuyện với bố mẹ" trong ứng dụng để có kịch bản mở lời khéo léo.'
        ]
      },
      high: {
        level: 'high',
        title: 'Mối quan hệ gia đình: Áp lực kỳ vọng nặng nề 🟠',
        badgeColor: 'bg-orange-100 text-orange-800 border-orange-300',
        summary: 'Bạn đang phải gánh trên vai những kỳ vọng vượt quá sức chịu đựng. Cảm giác không được lắng nghe đang khiến bạn khép chặt lòng mình.',
        actionAdvice: [
          'Tìm một người lớn uy tín trong họ hàng (cô chú, anh chị lớn) để làm cầu nối.',
          'Học cách thiết lập ranh giới cảm xúc lành mạnh.'
        ]
      },
      veryHigh: {
        level: 'very-high',
        title: 'Mối quan hệ gia đình: Khủng hoảng & Tổn thương sâu 🔴',
        badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
        summary: 'Môi trường gia đình đang gây ra những vết thương tâm lý nghiêm trọng cho bạn. Bạn cảm thấy ngột ngạt và tuyệt vọng.',
        actionAdvice: [
          'Ưu tiên giữ an toàn cho sức khỏe tinh thần và thể chất của mình.',
          'Liên hệ ngay với chuyên gia tâm lý học đường hoặc đường dây tư vấn tâm lý (1900 6233) để được tư vấn bảo vệ an toàn.'
        ]
      }
    }
  },

  // 5: Thứ Sáu (Friday)
  5: {
    themeTitle: 'Detox mạng xã hội & Giải phóng tâm trí cuối tuần',
    icon: '🌿',
    description: 'Đánh giá mức độ phụ thuộc vào màn hình điện thoại, thói quen lướt TikTok/Instagram và cách lấy lại sự tự chủ cho tâm trí.',
    quote: {
      quote: 'Đừng để cuộc sống trên mạng của người khác cướp mất khoảnh khắc thực tại của chính bạn.',
      author: 'Lời nhắc nhở số'
    },
    dailyTip: 'Tối nay, hãy thử để điện thoại cách xa giường ngủ ít nhất 2 mét trước khi chợp mắt.',
    questions: [
      {
        id: 1,
        question: 'Trung bình một ngày, thời gian sử dụng màn hình (Screen Time) cho mạng xã hội của bạn là:',
        options: [
          { label: 'Dưới 1.5 tiếng/ngày, chỉ dùng khi rảnh', score: 1 },
          { label: 'Từ 2 - 3 tiếng/ngày', score: 2 },
          { label: 'Từ 4 - 6 tiếng/ngày, lướt liên tục các video ngắn', score: 3 },
          { label: 'Trên 7 tiếng/ngày, mắt dán vào màn hình hầu như cả ngày', score: 4 }
        ]
      },
      {
        id: 2,
        question: 'Khi đăng một bức ảnh hoặc dòng trạng thái mới, hành động tiếp theo của bạn là:',
        options: [
          { label: 'Đăng xong rồi cất máy, không bận tâm nhiều', score: 1 },
          { label: 'Thỉnh thoảng mở xem có ai bình luận không', score: 2 },
          { label: 'Cứ 5 phút lại mở ra đếm like, nếu ít like sẽ thấy bồn chồn', score: 3 },
          { label: 'Nếu sau 15 phút không được nhiều tương tác sẽ xóa ngay vì xấu hổ', score: 4 }
        ]
      },
      {
        id: 3,
        question: 'Cảm giác của bạn sau khi lướt mạng xã hội xem cuộc sống của những "idol", rich kid hoặc bạn bè:',
        options: [
          { label: 'Bình thường, vui vẻ tiếp nhận thông tin thú vị', score: 1 },
          { label: 'Có chút ngưỡng mộ lành mạnh', score: 2 },
          { label: 'Thấy tự ti về ngoại hình, vóc dáng hoặc điều kiện sống của mình', score: 3 },
          { label: 'Rơi vào trầm cảm, thấy đời mình sao mà tăm tối và thất bại thảm hại', score: 4 }
        ]
      },
      {
        id: 4,
        question: 'Bạn có thói quen vừa ăn cơm, vừa đi vệ sinh, vừa học bài mà mắt vẫn dán vào điện thoại không?',
        options: [
          { label: 'Không bao giờ, mình ăn ra ăn, học ra học', score: 1 },
          { label: 'Thỉnh thoảng bật nhạc hoặc xem video ngắn lúc ăn cơm', score: 2 },
          { label: 'Luôn luôn phải có video chạy trước mặt mới ăn hay làm việc được', score: 3 },
          { label: 'Không thể chịu nổi 5 phút im lặng nếu thiếu điện thoại bên cạnh', score: 4 }
        ]
      },
      {
        id: 5,
        question: 'Mức độ bạn bị lôi cuốn vào những vụ tranh cãi (drama, bóc phốt) trên mạng:',
        options: [
          { label: 'Lướt qua bỏ qua ngay, không phí thời gian vào năng lượng tiêu cực', score: 1 },
          { label: 'Đọc lướt cho biết rồi thôi', score: 2 },
          { label: 'Bị cuốn vào đọc hết các bình luận tranh cãi hàng tiếng đồng hồ', score: 3 },
          { label: 'Tham gia gõ phím cãi nhau tới khuya, tức giận ấm ức cả ngày', score: 4 }
        ]
      },
      {
        id: 6,
        question: 'Khi điện thoại báo pin yếu dưới 10% hoặc mất kết nối mạng internet, bạn:',
        options: [
          { label: 'Thấy bình thường, đây là dịp tốt để nghỉ ngơi', score: 1 },
          { label: 'Tìm đồ sạc một cách từ tốn', score: 2 },
          { label: 'Bứt rứt, lo âu và phải đi tìm chỗ sạc ngay lập tức', score: 3 },
          { label: 'Hoảng loạn tột độ, cảm giác bị cắt đứt liên lạc với cả thế giới', score: 4 }
        ]
      },
      {
        id: 7,
        question: 'Bạn có bao giờ thức đến 1-2 giờ sáng chỉ vì ngón tay lướt video ngắn không có điểm dừng không?',
        options: [
          { label: 'Không, mình luôn đi ngủ đúng giờ trước 23h', score: 1 },
          { label: 'Thỉnh thoảng vào đêm thứ Sáu hoặc thứ Bảy', score: 2 },
          { label: 'Khá thường xuyên trong tuần, sáng dậy mắt thâm quầng', score: 3 },
          { label: 'Đêm nào cũng thức trắng đến 3-4h sáng vì nghiện lướt máy', score: 4 }
        ]
      },
      {
        id: 8,
        question: 'Mức độ bạn tự tin xuất hiện trước camera mà không cần dùng bất kỳ bộ lọc (filter) làm đẹp nào:',
        options: [
          { label: 'Rất tự tin, mình yêu vẻ đẹp tự nhiên của mình', score: 1 },
          { label: 'Khá tự tin nếu ánh sáng tốt', score: 2 },
          { label: 'Rất sợ người khác thấy mặt mộc của mình qua camera', score: 3 },
          { label: 'Ám ảnh kinh hoàng, cảm thấy mình xấu xí tột cùng nếu không có filter', score: 4 }
        ]
      },
      {
        id: 9,
        question: 'Bạn có thường xuyên cảm thấy thông báo điện thoại "rung ảo" (tưởng có tin nhắn nhưng thực ra không có) không?',
        options: [
          { label: 'Hiếm khi hoặc không bao giờ', score: 1 },
          { label: 'Thỉnh thoảng có ảo giác rung nhẹ', score: 2 },
          { label: 'Thường xuyên giật mình kiểm tra túi quần', score: 3 },
          { label: 'Liên tục bị ám ảnh, tay lúc nào cũng phải cầm chặt điện thoại', score: 4 }
        ]
      },
      {
        id: 10,
        question: 'Nếu thử thách bản thân: "Tắt mạng xã hội trọn vẹn 24 giờ cuối tuần này", bạn nghĩ mình có làm được không?',
        options: [
          { label: 'Chắc chắn làm được và sẽ thấy rất sảng khoái', score: 1 },
          { label: 'Có thể làm được nếu có kế hoạch đi chơi cùng gia đình/bạn', score: 2 },
          { label: 'Rất khó, chắc chỉ nhịn được 3-4 tiếng là phải mở ra', score: 3 },
          { label: 'Không thể nào làm được, thà nhịn ăn còn hơn nhịn điện thoại', score: 4 }
        ]
      }
    ],
    results: {
      low: {
        level: 'low',
        title: 'Mạng xã hội: Làm chủ công nghệ xuất sắc 🟢',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        summary: 'Bạn có mối quan hệ rất lành mạnh với thế giới số. Bạn dùng điện thoại như một công cụ hỗ trợ chứ không để các thuật toán chi phối tâm lý.',
        actionAdvice: [
          'Duy trì thói quen đọc sách giấy hoặc thể thao vào cuối tuần.',
          'Chia sẻ mẹo cai nghiện điện thoại cho bạn bè nhé.'
        ]
      },
      medium: {
        level: 'medium',
        title: 'Mạng xã hội: Có dấu hiệu xao nhãng 🟡',
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
        summary: 'Các video ngắn đang bắt đầu lấy cắp một lượng thời gian đáng kể của bạn và làm giảm khả năng chú ý sâu.',
        actionAdvice: [
          'Bật chế độ Grayscale (màn hình đen trắng) để giảm độ hấp dẫn của điện thoại.',
          'Đặt giới hạn thời gian 60 phút cho các app giải trí.'
        ]
      },
      high: {
        level: 'high',
        title: 'Mạng xã hội: Nguy cơ phụ thuộc cao 🟠',
        badgeColor: 'bg-orange-100 text-orange-800 border-orange-300',
        summary: 'Bạn đang bị cuốn vào cái bẫy so sánh và dopamine ảo của mạng xã hội. Thói quen này đang trực tiếp tàn phá giấc ngủ và sự tự tin của bạn.',
        actionAdvice: [
          'Xóa app mạng xã hội gây nghiện nhất khỏi màn hình chính trong 3 ngày.',
          'Tắt toàn bộ thông báo (push notifications).'
        ]
      },
      veryHigh: {
        level: 'very-high',
        title: 'Mạng xã hội: Nghiện nặng & Nguy cơ trầm cảm số 🔴',
        badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
        summary: 'Thế giới ảo đang hoàn toàn xâm chiếm đời thực của bạn. Bạn cảm thấy trống rỗng và bất an tột cùng mỗi khi phải rời xa màn hình.',
        actionAdvice: [
          'Thực hiện ngay một đợt Digital Detox (Cai nghiện số) có sự hỗ trợ của người thân.',
          'Tham gia các hoạt động ngoại khóa ngoài trời để tái kết nối với cuộc sống thực.'
        ]
      }
    }
  },

  // 6: Thứ Bảy (Saturday)
  6: {
    themeTitle: 'Tái tạo năng lượng sáng tạo & Chăm sóc giấc ngủ',
    icon: '🎨',
    description: 'Đo lường mức độ phục hồi thể chất, chất lượng giấc ngủ và cách bạn giải phóng những ức chế tích tụ sau một tuần học.',
    quote: {
      quote: 'Nghỉ ngơi không phải là lười biếng. Đó là bước chuẩn bị cần thiết cho hành trình xa hơn.',
      author: 'Chăm sóc bản thân'
    },
    dailyTip: 'Hôm nay, hãy ra ngoài hít thở không khí tự nhiên và ngắm nhìn một cái cây xanh ít nhất 15 phút.',
    questions: [
      {
        id: 1,
        question: 'Chất lượng giấc ngủ trong tuần vừa qua của bạn như thế nào?',
        options: [
          { label: 'Ngủ sâu giấc 7-8 tiếng, sáng dậy sảng khoái', score: 1 },
          { label: 'Tương đối ổn, thỉnh thoảng có đêm trằn trọc nhẹ', score: 2 },
          { label: 'Khó vào giấc ngủ, hay giật mình mơ thấy bài kiểm tra', score: 3 },
          { label: 'Mất ngủ triền miên, thức trắng hoặc ngủ chập chờn ác mộng', score: 4 }
        ]
      },
      {
        id: 2,
        question: 'Vào sáng thứ Bảy, bạn thường cảm thấy cơ thể mình:',
        options: [
          { label: 'Khỏe khoắn, tràn đầy năng lượng cho các sở thích riêng', score: 1 },
          { label: 'Hơi mệt mỏi chút đỉnh nhưng nghỉ ngơi là hồi', score: 2 },
          { label: 'Cổ vai gáy đau nhức, mắt khô mỏi và lưng căng cứng', score: 3 },
          { label: 'Kiệt quệ rã rời, không muốn nhấc mình ra khỏi giường', score: 4 }
        ]
      },
      {
        id: 3,
        question: 'Bạn có một niềm đam mê hoặc sở thích sáng tạo (vẽ tranh, viết lách, chơi đàn, làm đồ thủ công) không?',
        options: [
          { label: 'Thường xuyên đắm chìm vào sở thích và thấy rất hạnh phúc', score: 1 },
          { label: 'Thỉnh thoảng thực hiện khi có thời gian rảnh', score: 2 },
          { label: 'Đã từ rất lâu rồi không còn thời gian đụng vào sở thích', score: 3 },
          { label: 'Mất hết hứng thú với mọi thứ, không còn thấy điều gì làm mình vui', score: 4 }
        ]
      },
      {
        id: 4,
        question: 'Mức độ bạn tiếp xúc với ánh nắng mặt trời và thiên nhiên trong tuần:',
        options: [
          { label: 'Mỗi ngày đều có thời gian đi dạo ngoài trời', score: 1 },
          { label: 'Thỉnh thoảng vào những giờ thể dục hoặc cuối tuần', score: 2 },
          { label: 'Hầu như chỉ ngồi trong phòng kín bật điều hòa từ sáng tới đêm', score: 3 },
          { label: 'Sợ ánh sáng, luôn kéo rèm tối mịt trong phòng kín', score: 4 }
        ]
      },
      {
        id: 5,
        question: 'Thói quen ăn uống nạp dinh dưỡng của bạn vào những ngày nghỉ:',
        options: [
          { label: 'Ăn uống đủ chất, nhiều rau xanh và hoa quả tươi', score: 1 },
          { label: 'Ăn uống bình thường cùng gia đình', score: 2 },
          { label: 'Ăn vặt thất thường, bỏ bữa chính hoặc lạm dụng đồ cay nóng', score: 3 },
          { label: 'Chán ăn hoàn toàn hoặc ăn vô độ không kiểm soát để giải tỏa stress', score: 4 }
        ]
      },
      {
        id: 6,
        question: 'Khi có một buổi chiều hoàn toàn rảnh rỗi không bài tập, bạn sẽ:',
        options: [
          { label: 'Đi chơi với bạn bè, chơi thể thao hoặc làm điều mình thích', score: 1 },
          { label: 'Xem một bộ phim hay hoặc nghe nhạc thư giãn', score: 2 },
          { label: 'Nằm lướt điện thoại vô định và thấy thời gian trôi qua uổng phí', score: 3 },
          { label: 'Cảm thấy bồn chồn hoảng sợ vì không biết phải làm gì khi không học', score: 4 }
        ]
      },
      {
        id: 7,
        question: 'Bạn có cho phép mình được phép "nghỉ ngơi mà không cần cảm thấy tội lỗi" không?',
        options: [
          { label: 'Hoàn toàn cho phép, mình xứng đáng được nghỉ ngơi', score: 1 },
          { label: 'Thỉnh thoảng hơi lăn tăn một chút', score: 2 },
          { label: 'Rất khó thư giãn, trong đầu lúc nào cũng có tiếng nói giục giã', score: 3 },
          { label: 'Cực kỳ ám ảnh, bất kỳ phút giây nghỉ nào cũng biến thành sự dằn vặt', score: 4 }
        ]
      },
      {
        id: 8,
        question: 'Khả năng cười sảng khoái của bạn trong tuần vừa rồi:',
        options: [
          { label: 'Cười rất nhiều cùng bạn bè và người thân', score: 1 },
          { label: 'Có những nụ cười vui vẻ tự nhiên', score: 2 },
          { label: 'Chỉ cười gượng gạo cho qua chuyện', score: 3 },
          { label: 'Mặt lúc nào cũng ủ rũ, không nhớ nổi lần cuối mình cười thật lòng là khi nào', score: 4 }
        ]
      },
      {
        id: 9,
        question: 'Bạn có thói quen viết nhật ký hoặc tâm sự với bản thân để xả những cảm xúc tích tụ không?',
        options: [
          { label: 'Thường xuyên viết nhật ký hoặc dùng góc viết thư để giải tỏa', score: 1 },
          { label: 'Thỉnh thoảng khi có chuyện quá bức bối', score: 2 },
          { label: 'Nuốt tất cả vào trong lòng, không dám bộc lộ ra ngoài', score: 3 },
          { label: 'Cảm xúc dồn nén đến mức như một quả bom nổ chậm chực phát nổ', score: 4 }
        ]
      },
      {
        id: 10,
        question: 'Nếu tự thưởng cho bản thân một món quà tinh thần hôm nay, bạn chọn:',
        options: [
          { label: 'Một giấc ngủ thật sâu không đặt chuông báo thức', score: 1 },
          { label: 'Một ly trà sữa hoặc món ăn vặt yêu thích cùng bạn thân', score: 2 },
          { label: 'Một cuốn truyện tranh hoặc một bộ phim hoạt hình ấm áp', score: 3 },
          { label: 'Một cái ôm thật chặt từ người hiểu mình nhất', score: 4 }
        ]
      }
    ],
    results: {
      low: {
        level: 'low',
        title: 'Năng lượng tái tạo: Tràn đầy sức sống 🟢',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        summary: 'Bạn biết cách yêu thương và chăm sóc bản thân rất tuyệt vời. Khả năng tự chữa lành này giúp bạn luôn giữ được sự tươi mới.',
        actionAdvice: [
          'Tiếp tục dành trọn vẹn ngày thứ Bảy cho các hoạt động nuôi dưỡng tâm hồn.',
          'Ngủ đủ giấc để não bộ được thanh lọc độc tố nhé.'
        ]
      },
      medium: {
        level: 'medium',
        title: 'Năng lượng tái tạo: Cần thêm thời gian hồi phục 🟡',
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
        summary: 'Cơ thể bạn có chút mệt mỏi tích tụ sau tuần học nhưng chưa đến mức quá tải nghiêm trọng.',
        actionAdvice: [
          'Dành ít nhất 30 phút vận động nhẹ hoặc ngâm chân nước ấm trước khi ngủ.',
          'Hạn chế nhìn màn hình xanh sau 22h tối nay.'
        ]
      },
      high: {
        level: 'high',
        title: 'Năng lượng tái tạo: Kiệt quệ thể chất & Thiếu ngủ 🟠',
        badgeColor: 'bg-orange-100 text-orange-800 border-orange-300',
        summary: 'Cơ thể bạn đang phát đi những tín hiệu cảnh báo rõ ràng: nhức đầu, mỏi mắt, mất ngủ. Đừng tiếp tục vắt kiệt sức mình!',
        actionAdvice: [
          'Bù đắp giấc ngủ ngay trong ngày hôm nay.',
          'Ăn uống đủ chất và uống nhiều nước lọc.'
        ]
      },
      veryHigh: {
        level: 'very-high',
        title: 'Năng lượng tái tạo: Cháy sạch năng lượng (Total Burnout) 🔴',
        badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
        summary: 'Pin năng lượng của bạn đã cạn kiệt đến 0%. Tình trạng mất ngủ và kiệt sức kéo dài này cần được chăm sóc khẩn cấp!',
        actionAdvice: [
          'Hãy dừng tất cả mọi công việc và bài vở lại ngay lập tức.',
          'Nói chuyện với bố mẹ để đi kiểm tra sức khỏe và nghỉ ngơi phục hồi.'
        ]
      }
    }
  },

  // 0: Chủ Nhật (Sunday)
  0: {
    themeTitle: 'Chiêm nghiệm cảm xúc: Lòng tự trắc ẩn & Chuẩn bị tâm thế mới',
    icon: '🌙',
    description: 'Nhìn lại một tuần đã qua với sự bao dung, buông bỏ những điều chưa hoàn hảo và nuôi dưỡng sự bình an trong tâm hồn.',
    quote: {
      quote: 'Bạn không cần phải hoàn hảo để xứng đáng được yêu thương và tôn trọng.',
      author: 'Lòng tự trắc ẩn'
    },
    dailyTip: 'Dành 10 phút tối nay để viết ra 3 điều bạn cảm thấy biết ơn hoặc tự hào về bản thân trong tuần qua.',
    questions: [
      {
        id: 1,
        question: 'Khi nhìn lại tuần vừa qua, cảm xúc bao trùm trong bạn là:',
        options: [
          { label: 'Hài lòng và tự hào vì mình đã rất nỗ lực', score: 1 },
          { label: 'Bình thường, có lúc vui lúc buồn nhưng đều đã vượt qua', score: 2 },
          { label: 'Hối tiếc vì nhiều việc chưa làm được như kỳ vọng', score: 3 },
          { label: 'Thất vọng cay đắng, chỉ thấy toàn lỗi lầm và sự thất bại', score: 4 }
        ]
      },
      {
        id: 2,
        question: 'Khi bạn mắc một lỗi sai trong tuần, giọng nói bên trong đầu bạn thường nói gì:',
        options: [
          { label: '"Không sao cả, ai cũng có lúc sai, lần sau mình sẽ làm tốt hơn"', score: 1 },
          { label: '"Hơi tiếc nhưng rút kinh nghiệm là được"', score: 2 },
          { label: '"Sao mình lại ngu ngốc và bất cẩn đến thế chứ?"', score: 3 },
          { label: '"Mình vô tích sự, chẳng làm được tích sự gì ra hồn cả"', score: 4 }
        ]
      },
      {
        id: 3,
        question: 'Bạn đối xử với bản thân mình như thế nào so với cách bạn đối xử với một người bạn thân:',
        options: [
          { label: 'Dịu dàng và thấu hiểu bản thân y như với bạn thân', score: 1 },
          { label: 'Khá công bằng', score: 2 },
          { label: 'Khắt khe với bản thân hơn rất nhiều so với người khác', score: 3 },
          { label: 'Luôn tàn nhẫn sỉ nhục bản thân trong khi luôn tha thứ cho người khác', score: 4 }
        ]
      },
      {
        id: 4,
        question: 'Bạn có cảm thấy giá trị con người mình phụ thuộc hoàn toàn vào những con số (điểm số, thứ hạng, số like) không?',
        options: [
          { label: 'Không, giá trị của mình nằm ở nhân cách, lòng trắc ẩn và sự cố gắng', score: 1 },
          { label: 'Điểm số chỉ là một phần nhỏ', score: 2 },
          { label: 'Khá phụ thuộc, nếu điểm kém là thấy mình chẳng có giá trị gì', score: 3 },
          { label: 'Hoàn toàn phụ thuộc, chỉ cần một con số xấu là thấy mình là rác rưởi', score: 4 }
        ]
      },
      {
        id: 5,
        question: 'Mức độ bạn buông bỏ được những ấm ức, tức giận hoặc tổn thương trong tuần:',
        options: [
          { label: 'Dễ dàng tha thứ và buông bỏ để giữ tâm hồn thanh thản', score: 1 },
          { label: 'Mất một vài ngày để nguôi ngoai', score: 2 },
          { label: 'Ghim sâu trong lòng và liên tục nghĩ đi nghĩ lại về chuyện đó', score: 3 },
          { label: 'Nung nấu sự thù hận hoặc dằn vặt bản thân không dứt', score: 4 }
        ]
      },
      {
        id: 6,
        question: 'Chiều tối Chủ nhật, tâm trạng bạn khi nghĩ đến việc ngày mai lại phải đi học:',
        options: [
          { label: 'Sẵn sàng, đón chờ một tuần mới với những cơ hội mới', score: 1 },
          { label: 'Hơi lưu luyến ngày nghỉ nhưng tâm lý vững vàng', score: 2 },
          { label: 'Hội chứng "Sunday Scaries" (Bồn chồn, âu lo khi Chủ nhật tàn)', score: 3 },
          { label: 'Cực kỳ hoảng loạn, đau bụng hoặc nghẹt thở vì nỗi sợ trường học', score: 4 }
        ]
      },
      {
        id: 7,
        question: 'Bạn có thói quen chuẩn bị sẵn sách vở, quần áo từ tối Chủ nhật để sáng mai không vội vã không?',
        options: [
          { label: 'Luôn chuẩn bị chu đáo từ tối hôm trước', score: 1 },
          { label: 'Thường chuẩn bị trước', score: 2 },
          { label: 'Sáng mai dậy mới cuống cuồng tìm đồ', score: 3 },
          { label: 'Bỏ mặc tất cả, không còn tâm trí đâu để chuẩn bị', score: 4 }
        ]
      },
      {
        id: 8,
        question: 'Bạn có cảm thấy mình xứng đáng được hạnh phúc và bình yên không?',
        options: [
          { label: 'Chắc chắn có, mọi đứa trẻ sinh ra đều xứng đáng được hạnh phúc', score: 1 },
          { label: 'Có lẽ là có', score: 2 },
          { label: 'Đôi lúc thấy mình không xứng đáng vì chưa đủ giỏi giang', score: 3 },
          { label: 'Tin rằng mình sinh ra là một sai lầm và chỉ mang lại phiền toái', score: 4 }
        ]
      },
      {
        id: 9,
        question: 'Khi bạn thấy mệt mỏi, bạn có dám nói lời từ chối với những lời nhờ vả làm phiền không?',
        options: [
          { label: 'Dám từ chối lịch sự để bảo vệ năng lượng của mình', score: 1 },
          { label: 'Khéo léo hoãn lại lúc khác', score: 2 },
          { label: 'Ngại từ chối nên lại ôm đồm việc vào người dù kiệt sức', score: 3 },
          { label: 'Luôn phải làm hài lòng người khác (People Pleaser) đến cùng cực', score: 4 }
        ]
      },
      {
        id: 10,
        question: 'Gửi đến bản thân của tuần tới: Bạn muốn gửi gắm điều gì nhất?',
        options: [
          { label: '"Hãy tự tin, hít thở sâu và tin vào chính mình nhé!"', score: 1 },
          { label: '"Cố gắng từng ngày một, mọi chuyện rồi sẽ ổn thôi"', score: 2 },
          { label: '"Hy vọng tuần tới sẽ bớt áp lực hơn"', score: 3 },
          { label: '"Chỉ mong sống sót qua tuần tới mà không bị sụp đổ"', score: 4 }
        ]
      }
    ],
    results: {
      low: {
        level: 'low',
        title: 'Tự trắc ẩn & Bình an nội tại: Rất cao 🟢',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        summary: 'Bạn có lòng bao dung và sự thấu hiểu chính mình rất sâu sắc. Bạn hiểu rằng thất bại là một phần của trưởng thành, và bạn luôn là người bạn tốt nhất của chính mình.',
        actionAdvice: [
          'Viết một lời cảm ơn ngắn cho bản thân trước khi đi ngủ tối nay.',
          'Bước vào tuần mới với nụ cười nhẹ nhõm và an nhiên.'
        ]
      },
      medium: {
        level: 'medium',
        title: 'Tự trắc ẩn: Khá ổn, đôi khi còn tự trách 🟡',
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
        summary: 'Bạn bắt đầu học cách lắng nghe bản thân nhưng đôi khi tiêu chuẩn khắt khe vẫn khiến bạn tự làm khổ mình.',
        actionAdvice: [
          'Thực hành bài tập "Đặt tay lên ngực trái, hít sâu và tự nhủ: Mình đang làm tốt nhất có thể rồi".',
          'Nghe một bản nhạc không lời êm dịu trước giờ ngủ.'
        ]
      },
      high: {
        level: 'high',
        title: 'Tự trắc ẩn: Quá khắt khe & Hội chứng Sunday Scaries 🟠',
        badgeColor: 'bg-orange-100 text-orange-800 border-orange-300',
        summary: 'Bạn đang là quan tòa khắt khe nhất đối với chính mình. Nỗi sợ hãi ngày thứ Hai đang cướp đi sự bình yên của ngày Chủ nhật.',
        actionAdvice: [
          'Tách biệt giá trị con người bạn khỏi điểm số và thành tích.',
          'Uống một tách trà ấm và tâm sự với một người bạn chân thành tối nay.'
        ]
      },
      veryHigh: {
        level: 'very-high',
        title: 'Tự trắc ẩn: Tự ghét bỏ bản thân (Self-loathing) 🔴',
        badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
        summary: 'Bạn đang chìm trong sự tự trách móc tàn nhẫn và cảm giác tuyệt vọng. Xin hãy nhớ: Bạn xứng đáng được đối xử dịu dàng, bắt đầu từ chính suy nghĩ của bạn!',
        actionAdvice: [
          'Tìm kiếm sự trợ giúp từ chuyên viên tâm lý hoặc thầy cô/bố mẹ ngay.',
          'Gửi một bức thư tâm sự cho chính mình trong mục "Bức thư cho bản thân" để giải tỏa.'
        ]
      }
    }
  }
};

const DAY_NAMES_VI = [
  'Chủ Nhật',
  'Thứ Hai',
  'Thứ Ba',
  'Thứ Tư',
  'Thứ Năm',
  'Thứ Sáu',
  'Thứ Bảy'
];

/**
 * Get the daily psychological quiz info for any specified date (defaulting to today)
 */
export function getDailyQuizInfo(date: Date = new Date()): DailyQuizInfo {
  const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday ...
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  const dateKey = `${year}-${pad(month)}-${pad(day)}`;
  const dayOfWeekName = DAY_NAMES_VI[dayOfWeek];
  const fullFormattedDate = `${dayOfWeekName}, ${pad(day)} tháng ${pad(month)}, ${year}`;

  const config = WEEKDAY_QUIZZES[dayOfWeek] || WEEKDAY_QUIZZES[1];

  const dailyQuiz: Quiz = {
    id: `daily-quiz-${dateKey}`,
    title: `[Hôm nay • ${dayOfWeekName}] ${config.themeTitle}`,
    icon: config.icon,
    description: `Bài kiểm tra tâm lý ngày ${fullFormattedDate}: ${config.description}`,
    disclaimer: 'Bài kiểm tra chuyên sâu 10 câu được cập nhật mỗi ngày, giúp học sinh nhận diện cảm xúc và tự chăm sóc sức khỏe tinh thần.',
    questions: config.questions,
    results: config.results
  };

  return {
    dateKey,
    dayOfWeekName,
    fullFormattedDate,
    themeTitle: config.themeTitle,
    dailyQuote: config.quote,
    dailyTip: config.dailyTip,
    quiz: dailyQuiz
  };
}

/**
 * Generate a dynamic alternative quiz for today with 10 questions
 * Allows the user to refresh and get another unique 10-question test for today
 */
export function generateDynamicQuizForDay(offset = 1, baseDate: Date = new Date()): Quiz {
  const dayOfWeek = (baseDate.getDay() + offset) % 7;
  const config = WEEKDAY_QUIZZES[dayOfWeek] || WEEKDAY_QUIZZES[0];
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  const dateKey = `${baseDate.getFullYear()}-${pad(baseDate.getMonth() + 1)}-${pad(baseDate.getDate())}`;

  return {
    id: `daily-quiz-${dateKey}-variant-${offset}`,
    title: `[Đề mới hôm nay #${offset + 1}] ${config.themeTitle}`,
    icon: config.icon,
    description: `Bộ 10 câu hỏi bổ sung hôm nay: ${config.description}`,
    disclaimer: 'Bộ câu hỏi trắc nghiệm tự phản chiếu tâm lý học đường hàng ngày.',
    questions: config.questions,
    results: config.results
  };
}
