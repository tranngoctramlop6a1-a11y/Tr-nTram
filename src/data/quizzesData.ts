import { Quiz, QuizQuestion, QuizResultLevel } from '../types';
import { QUIZZES } from './initialData';

export interface QuizQuestionSet {
  setId: string;
  setName: string;
  questions: QuizQuestion[]; // MUST BE EXACTLY 10 QUESTIONS
}

export interface ComprehensiveQuiz {
  id: string;
  title: string;
  situationTitle: string;
  icon: string;
  description: string;
  disclaimer: string;
  sets: QuizQuestionSet[];
  results: {
    low: QuizResultLevel;
    medium: QuizResultLevel;
    high: QuizResultLevel;
    veryHigh: QuizResultLevel;
  };
}

export const COMPREHENSIVE_QUIZZES: ComprehensiveQuiz[] = [
  {
    id: 'quiz-pressure-reaction',
    title: 'Phản ứng trước áp lực & Căng thẳng',
    situationTitle: 'Tình huống: Bạn thường phản ứng thế nào khi bị áp lực?',
    icon: '⚡',
    description: 'Khám phá cách tâm trí và cơ thể bạn thường phản ứng khi đối diện với bài vở, kỳ vọng và những tình huống ngoài ý muốn.',
    disclaimer: 'Đây là bài tự suy ngẫm giúp bạn nhận diện xu hướng hành vi của bản thân để điều chỉnh lành mạnh hơn, không phải chẩn đoán tâm lý hay y khoa.',
    sets: [
      {
        setId: 'set-1',
        setName: 'Bộ 1: Nhận diện phản ứng cảm xúc & cơ thể (10 câu)',
        questions: [
          {
            id: 1,
            question: 'Khi nhận thông báo một bài kiểm tra đột xuất hoặc hạn nộp gấp, phản ứng đầu tiên của bạn là gì?',
            options: [
              { label: 'Bình tĩnh xem lại kiến thức và lên kế hoạch làm', score: 1 },
              { label: 'Hơi bồn chồn nhưng nhanh chóng bắt tay vào làm', score: 2 },
              { label: 'Tim đập thình thịch, toát mồ hôi và muốn trốn tránh', score: 3 },
              { label: 'Hoảng loạn, đầu óc trống rỗng và không thể tập trung', score: 4 }
            ]
          },
          {
            id: 2,
            question: 'Khi một ngày có quá nhiều việc dồn dập, bạn thường đối phó ra sao?',
            options: [
              { label: 'Liệt kê danh sách việc cần làm theo mức độ ưu tiên', score: 1 },
              { label: 'Làm việc dễ trước, cố gắng giải quyết từng việc', score: 2 },
              { label: 'Lướt điện thoại vô thức để quên đi sự căng thẳng', score: 3 },
              { label: 'Bực bội, cáu gắt với mọi người xung quanh', score: 4 }
            ]
          },
          {
            id: 3,
            question: 'Cơ thể bạn có thường xuất hiện những dấu hiệu vật lý nào khi bị căng thẳng?',
            options: [
              { label: 'Hầu như không có triệu chứng bất thường', score: 1 },
              { label: 'Đôi khi hơi đau đầu nhẹ hoặc căng cơ vai', score: 2 },
              { label: 'Đau bụng, đau dạ dày hoặc khó thở nhẹ', score: 3 },
              { label: 'Mất ngủ liên tục, mệt mỏi rã rời kéo dài', score: 4 }
            ]
          },
          {
            id: 4,
            question: 'Khi một kế hoạch quan trọng bị đổ vỡ bất ngờ, bạn phản ứng như thế nào?',
            options: [
              { label: 'Tìm ngay phương án B thay thế', score: 1 },
              { label: 'Thất vọng một chút rồi tìm cách thích nghi', score: 2 },
              { label: 'Tự trách bản thân thậm tệ và thấy mình vô dụng', score: 3 },
              { label: 'Buông xuôi hoàn toàn và không muốn làm gì nữa', score: 4 }
            ]
          },
          {
            id: 5,
            question: 'Bạn có thường cảm thấy nghẹt thở trước kỳ vọng của người khác không?',
            options: [
              { label: 'Không, mình chỉ cố gắng theo năng lực của mình', score: 1 },
              { label: 'Thỉnh thoảng, khi người thân kỳ vọng quá cao', score: 2 },
              { label: 'Thường xuyên, luôn sợ làm ai đó thất vọng', score: 3 },
              { label: 'Luôn bị ám ảnh bởi ánh nhìn và đánh giá của người khác', score: 4 }
            ]
          },
          {
            id: 6,
            question: 'Khi gặp một bài toán hoặc một vấn đề rất khó, phản xạ của bạn là:',
            options: [
              { label: 'Hào hứng thử các cách giải khác nhau', score: 1 },
              { label: 'Suy nghĩ một lúc rồi nhờ bạn bè hoặc thầy cô giảng hộ', score: 2 },
              { label: 'Nhanh chóng nản lòng và gấp sách lại', score: 3 },
              { label: 'Tự giận bản thân và nghĩ mình sinh ra đã kém cỏi', score: 4 }
            ]
          },
          {
            id: 7,
            question: 'Bạn thường làm gì khi cảm xúc tiêu cực ập đến?',
            options: [
              { label: 'Đi dạo, nghe nhạc hoặc viết nhật ký để giải tỏa', score: 1 },
              { label: 'Tâm sự với một người bạn thân tin cậy', score: 2 },
              { label: 'Cố nén cảm xúc vào trong và giả vờ như vẫn ổn', score: 3 },
              { label: 'Bùng nổ cơn giận hoặc tự làm tổn thương mình', score: 4 }
            ]
          },
          {
            id: 8,
            question: 'Bạn có cảm thấy khó khăn khi phải nghỉ ngơi mà không làm gì?',
            options: [
              { label: 'Mình rất tận hưởng thời gian nghỉ ngơi trọn vẹn', score: 1 },
              { label: 'Đôi khi hơi bứt rứt nhưng vẫn nghỉ được', score: 2 },
              { label: 'Thường cảm thấy tội lỗi nếu không ngồi vào bàn học', score: 3 },
              { label: 'Hoàn toàn không thể thả lỏng, luôn trong trạng thái báo động', score: 4 }
            ]
          },
          {
            id: 9,
            question: 'Khi người khác đưa ra nhận xét hoặc góp ý thẳng thắn cho bạn:',
            options: [
              { label: 'Lắng nghe khách quan và rút kinh nghiệm', score: 1 },
              { label: 'Hơi buồn một lúc rồi suy ngẫm lại', score: 2 },
              { label: 'Cảm thấy bị tấn công cá nhân và dựng rào phòng thủ', score: 3 },
              { label: 'Tự ti tột cùng và nghĩ người đó ghét bỏ mình', score: 4 }
            ]
          },
          {
            id: 10,
            question: 'Sau khi vượt qua một đợt áp lực lớn (kỳ thi, biến cố), bạn thường cảm thấy:',
            options: [
              { label: 'Nhẹ nhõm, tự hào và nạp lại năng lượng nhanh chóng', score: 1 },
              { label: 'Hơi mệt một vài ngày rồi hồi phục bình thường', score: 2 },
              { label: 'Vẫn còn nỗi lo lắng âm ỉ về việc tiếp theo', score: 3 },
              { label: 'Trống rỗng, kiệt sức kéo dài và mất hết hứng thú', score: 4 }
            ]
          }
        ]
      },
      {
        setId: 'set-2',
        setName: 'Bộ 2: Thói quen ứng phó & Cơ chế phòng vệ (10 câu)',
        questions: [
          {
            id: 1,
            question: 'Khi có một việc quan trọng nhưng khó khăn, bạn thường bắt đầu khi nào?',
            options: [
              { label: 'Bắt tay vào làm từ sớm để chia nhỏ thời gian', score: 1 },
              { label: 'Lên kế hoạch và hoàn thành trước hạn vài ngày', score: 2 },
              { label: 'Chần chừ, nước đến chân mới nhảy', score: 3 },
              { label: 'Trì hoãn đến sát nút rồi làm trong trạng thái hoảng loạn', score: 4 }
            ]
          },
          {
            id: 2,
            question: 'Khi ai đó làm bạn tức giận hoặc tổn thương, bạn có xu hướng:',
            options: [
              { label: 'Bình tĩnh nói rõ cảm xúc của mình với họ', score: 1 },
              { label: 'Tạm lánh đi để nguội giận rồi mới nói chuyện', score: 2 },
              { label: 'Chiến tranh lạnh, im lặng và không thèm nhìn mặt', score: 3 },
              { label: 'Nói những lời cay độc để trả đũa đối phương', score: 4 }
            ]
          },
          {
            id: 3,
            question: 'Bạn có hay tự so sánh bản thân với sự thành công của bạn bè cùng lớp?',
            options: [
              { label: 'Hiếm khi, mình chỉ tập trung vào con đường của mình', score: 1 },
              { label: 'Thỉnh thoảng, nhưng xem đó là động lực tích cực', score: 2 },
              { label: 'Thường xuyên, thấy mình kém cỏi mỗi khi bạn được khen', score: 3 },
              { label: 'Luôn luôn ghen tị và dằn vặt bản thân dữ dội', score: 4 }
            ]
          },
          {
            id: 4,
            question: 'Trong những ngày áp lực, chế độ ăn uống của bạn thay đổi thế nào?',
            options: [
              { label: 'Vẫn duy trì ăn uống điều độ đúng bữa', score: 1 },
              { label: 'Đôi khi ăn nhanh hoặc ăn ít hơn một chút', score: 2 },
              { label: 'Ăn vặt liên tục đồ ngọt/đồ cay để xả stress', score: 3 },
              { label: 'Bỏ bữa hoàn toàn hoặc ăn vô độ không kiểm soát', score: 4 }
            ]
          },
          {
            id: 5,
            question: 'Bạn có hay suy nghĩ quá mức (overthinking) về những việc đã xảy ra?',
            options: [
              { label: 'Hiếm khi, việc qua rồi thì thôi', score: 1 },
              { label: 'Chỉ nghĩ lại khi cần rút kinh nghiệm cụ thể', score: 2 },
              { label: 'Thường tua lại những câu nói ngớ ngẩn của mình trước khi ngủ', score: 3 },
              { label: 'Bị mắc kẹt trong vòng lặp lo âu và suy diễn những kịch bản tệ nhất', score: 4 }
            ]
          },
          {
            id: 6,
            question: 'Khi bạn mắc một lỗi sai trước tập thể lớp:',
            options: [
              { label: 'Cười trừ, xin lỗi và sửa lại cho đúng', score: 1 },
              { label: 'Ngại ngùng một lúc rồi qua đi', score: 2 },
              { label: 'Đỏ mặt, xấu hổ và muốn có cái lỗ nẻ để chui xuống', score: 3 },
              { label: 'Ám ảnh suốt nhiều tuần, sợ mọi người đang khinh thường mình', score: 4 }
            ]
          },
          {
            id: 7,
            question: 'Bạn có cảm thấy khó khăn khi phải nhờ vả hoặc xin sự giúp đỡ?',
            options: [
              { label: 'Sẵn sàng hỏi khi mình thật sự không làm được', score: 1 },
              { label: 'Cố tự làm trước, nếu bế tắc thì mới hỏi', score: 2 },
              { label: 'Rất ngại vì sợ làm phiền hoặc bị coi là yếu kém', score: 3 },
              { label: 'Tuyệt đối không bao giờ nhờ ai, thà chịu đựng một mình', score: 4 }
            ]
          },
          {
            id: 8,
            question: 'Mức độ kiên nhẫn của bạn khi xếp hàng hoặc gặp sự cố mạng chậm lúc đang vội:',
            options: [
              { label: 'Vẫn bình thản, kiên nhẫn chờ đợi', score: 1 },
              { label: 'Hơi sốt ruột nhưng vẫn kiềm chế được', score: 2 },
              { label: 'Khó chịu, thở dài thườn thượt và nhấp nhổm', score: 3 },
              { label: 'Bực tức tột độ, muốn đập phá hoặc buông lời cáu gắt', score: 4 }
            ]
          },
          {
            id: 9,
            question: 'Khi bạn bè cùng nhóm rủ nhau làm điều vi phạm kỷ luật:',
            options: [
              { label: 'Dứt khoát từ chối và khuyên bạn dừng lại', score: 1 },
              { label: 'Tìm cớ khéo léo để không tham gia', score: 2 },
              { label: 'Lưỡng lự rất lâu rồi đi theo vì sợ mất bạn', score: 3 },
              { label: 'Không dám nói một lời nào và phục tùng theo nhóm', score: 4 }
            ]
          },
          {
            id: 10,
            question: 'Bạn nhìn nhận tương lai của mình trong 3 năm tới thế nào?',
            options: [
              { label: 'Lạc quan, có mục tiêu rõ ràng và tin tưởng bản thân', score: 1 },
              { label: 'Có chút mơ hồ nhưng tin mọi chuyện sẽ ổn', score: 2 },
              { label: 'Khá lo âu, cảm thấy tương lai đầy bất trắc và áp lực', score: 3 },
              { label: 'Tăm tối, bế tắc và không nhìn thấy tia hy vọng nào', score: 4 }
            ]
          }
        ]
      }
    ],
    results: {
      low: {
        level: 'low',
        title: 'Mức độ kiểm soát áp lực: Vững vàng 🟢',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        summary: 'Bạn có cơ chế phản hồi cảm xúc rất lành mạnh. Khi sóng gió đến, bạn biết cách tách bạch giữa vấn đề thực tế và cảm xúc cá nhân, không để nỗi sợ làm tê liệt hành động.',
        actionAdvice: [
          'Tiếp tục duy trì thói quen viết nhật ký, thể thao và ngủ đủ giấc.',
          'Lan tỏa sự điềm tĩnh này để hỗ trợ những người bạn xung quanh đang gặp bối rối.',
          'Khi gặp thử thách lớn hơn, hãy giữ vững niềm tin vào năng lực giải quyết vấn đề của mình.'
        ],
        tendencyInsight: 'Xu hướng nổi bật: Bạn thiên về nhóm "Giải quyết vấn đề chủ động" (Problem-focused coping). Bạn hiếm khi để cảm xúc tiêu cực chi phối quá lâu.'
      },
      medium: {
        level: 'medium',
        title: 'Mức độ kiểm soát áp lực: Trung bình 🙂',
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
        summary: 'Bạn có khả năng thích nghi khá tốt với áp lực thường ngày. Tuy nhiên vào những giai đoạn dồn dập (mùa thi cử, bất đồng bạn bè), bạn vẫn có xu hướng suy nghĩ quá nhiều hoặc trì hoãn nhẹ.',
        actionAdvice: [
          'Tập bài tập hít thở 4-7-8 (hít vào 4 giây, giữ 7 giây, thở ra 8 giây) khi bắt đầu thấy tim đập nhanh.',
          'Chia nhỏ bài tập lớn thành các phần việc 25 phút để tránh cảm giác bị ngợp.',
          'Cho phép bản thân có những khoảng lặng nghỉ ngơi mà không cảm thấy tội lỗi.'
        ],
        tendencyInsight: 'Xu hướng nổi bật: Bạn dễ bị dao động cảm xúc khi khối lượng công việc tăng đột ngột, nhưng có khả năng tự lấy lại thăng bằng sau một giấc ngủ ngon.'
      },
      high: {
        level: 'high',
        title: 'Mức độ kiểm soát áp lực: Cần chú ý 🟠',
        badgeColor: 'bg-orange-100 text-orange-800 border-orange-300',
        summary: 'Bạn đang chịu một lượng áp lực tương đối lớn và cơ thể đã phát ra những tín hiệu báo động (khó ngủ, lo âu, tự trách). Bạn thường có xu hướng kìm nén hoặc suy diễn quá mức kịch bản tiêu cực.',
        actionAdvice: [
          'Hạn chế tiếp xúc với mạng xã hội trước khi đi ngủ ít nhất 45 phút.',
          'Tìm một người bạn hoặc người lớn đáng tin cậy để tâm sự, đừng ôm một mình.',
          'Thực hành lòng trắc ẩn với chính mình: Bạn đang làm tốt nhất những gì có thể rồi.'
        ],
        tendencyInsight: 'Xu hướng nổi bật: Xu hướng phòng vệ "Kìm nén & Tự trách" (Emotional internalization). Bạn thường gánh trách nhiệm về mình nhiều hơn thực tế.'
      },
      veryHigh: {
        level: 'very-high',
        title: 'Mức độ kiểm soát áp lực: Quá tải 🔴',
        badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
        summary: 'Tâm trí và cơ thể bạn đang ở trong trạng thái kiệt sức cảm xúc (Burnout). Áp lực kéo dài đang làm cạn kiệt năng lượng và niềm vui của bạn.',
        actionAdvice: [
          'Hãy dừng lại ngay hôm nay: Cho phép bản thân được nghỉ ngơi một ngày không đụng tới sách vở.',
          'Chia sẻ trung thực với bố mẹ hoặc thầy cô về tình trạng quá tải hiện tại.',
          'Nếu cảm thấy bế tắc, hãy tìm đến phòng tham vấn tâm lý học đường hoặc đường dây nóng tư vấn tâm lý (1900 6233).'
        ],
        tendencyInsight: 'Xu hướng nổi bật: Báo động kiệt sức. Cần ưu tiên phục hồi sức khỏe thể chất và tinh thần trước khi đặt ra bất kỳ mục tiêu điểm số nào.'
      }
    }
  },
  {
    id: 'quiz-study-burnout',
    title: 'Áp lực học tập & Nguy cơ kiệt sức',
    situationTitle: 'Tình huống: Bạn có đang bị quá tải trong việc học?',
    icon: '📚',
    description: 'Đo lường mức độ ảnh hưởng của bài tập, thi cử và kỳ vọng điểm số lên sức khỏe tinh thần của bạn.',
    disclaimer: 'Bài trắc nghiệm mang tính chất tự phản chiếu và chăm sóc tinh thần cá nhân, không thay thế tư vấn y khoa chuyên sâu.',
    sets: [
      {
        setId: 'set-1',
        setName: 'Bộ 1: Nhận diện dấu hiệu kiệt sức học đường (10 câu)',
        questions: [
          {
            id: 1,
            question: 'Bạn có cảm thấy mệt mỏi ngay từ khi thức dậy vào buổi sáng chuẩn bị đi học không?',
            options: [
              { label: 'Hiếm khi, mình thường thức dậy tràn đầy năng lượng', score: 1 },
              { label: 'Thỉnh thoảng vào những ngày có tiết học khó', score: 2 },
              { label: 'Khá thường xuyên trong tuần', score: 3 },
              { label: 'Hầu như mỗi ngày, cảm giác như kiệt sức triền miên', score: 4 }
            ]
          },
          {
            id: 2,
            question: 'Khi ngồi vào bàn học, khả năng tập trung của bạn ra sao?',
            options: [
              { label: 'Tập trung sâu và hoàn thành bài vở nhanh chóng', score: 1 },
              { label: 'Mất khoảng 10 phút khởi động rồi tập trung tốt', score: 2 },
              { label: 'Rất dễ xao nhãng, đọc một trang sách phải đọc đi đọc lại 3 lần', score: 3 },
              { label: 'Đầu óc trống rỗng, không thể tiếp thu thêm bất cứ kiến thức nào', score: 4 }
            ]
          },
          {
            id: 3,
            question: 'Thời gian rảnh rỗi dành cho sở thích cá nhân (đọc truyện, vẽ, thể thao) của bạn hiện nay:',
            options: [
              { label: 'Vẫn có ít nhất 1-2 tiếng mỗi ngày', score: 1 },
              { label: 'Khoảng 30 phút hoặc chỉ có vào cuối tuần', score: 2 },
              { label: 'Hầu như bị cắt giảm hết để đi học thêm', score: 3 },
              { label: 'Hoàn toàn không còn thời gian, lịch học kín mít từ sáng tới khuya', score: 4 }
            ]
          },
          {
            id: 4,
            question: 'Mức độ lo âu của bạn về kết quả thi cử và xếp hạng học lực:',
            options: [
              { label: 'Bình tĩnh, điểm số chỉ phản ánh mức độ tiếp thu', score: 1 },
              { label: 'Hơi lo lắng một chút trước ngày thi', score: 2 },
              { label: 'Rất sợ bị tụt hạng và sợ bố mẹ phiền lòng', score: 3 },
              { label: 'Ám ảnh kinh hoàng, chỉ cần tụt nửa điểm là thấy tương lai sụp đổ', score: 4 }
            ]
          },
          {
            id: 5,
            question: 'Bạn có bị mất ngủ hoặc mơ thấy mình đang làm bài thi kiểm tra không?',
            options: [
              { label: 'Ngủ ngon giấc, hiếm khi mơ mộng bài vở', score: 1 },
              { label: 'Chỉ trằn trọc vào đêm trước ngày thi học kỳ', score: 2 },
              { label: 'Thường xuyên giật mình thức giấc và nghĩ về bài tập chưa làm', score: 3 },
              { label: 'Mất ngủ kinh niên, mơ thấy bị trễ giờ thi hoặc quên kiến thức', score: 4 }
            ]
          },
          {
            id: 6,
            question: 'Cảm giác của bạn đối với các môn học mà mình từng rất yêu thích:',
            options: [
              { label: 'Vẫn giữ trọn vẹn niềm đam mê và tò mò', score: 1 },
              { label: 'Hơi giảm hứng thú một chút vì bài tập nhiều', score: 2 },
              { label: 'Thấy môn học đó trở thành gánh nặng bắt buộc', score: 3 },
              { label: 'Mất hết cảm xúc, cảm thấy chán ghét mọi môn học', score: 4 }
            ]
          },
          {
            id: 7,
            question: 'Khi nhận điểm kém hơn mong đợi, phản ứng tâm lý của bạn là:',
            options: [
              { label: 'Tìm lỗi sai để làm lại cho đúng', score: 1 },
              { label: 'Buồn một buổi tối rồi cố gắng ở bài sau', score: 2 },
              { label: 'Khóc lóc, dằn vặt và nghi ngờ trí tuệ của bản thân', score: 3 },
              { label: 'Sợ hãi cực độ, nghĩ đến những điều tiêu cực nhất', score: 4 }
            ]
          },
          {
            id: 8,
            question: 'Bạn có cảm thấy việc học hiện tại đang phục vụ cho mục tiêu của chính mình hay của người khác?',
            options: [
              { label: 'Cho tương lai và ước mơ của chính mình', score: 1 },
              { label: 'Phần lớn cho mình, một phần để bố mẹ yên tâm', score: 2 },
              { label: 'Học chủ yếu vì áp lực từ gia đình và xã hội', score: 3 },
              { label: 'Học như một cỗ máy vô hồn chỉ để làm vừa lòng người khác', score: 4 }
            ]
          },
          {
            id: 9,
            question: 'Tần suất bạn cảm thấy đau đầu, mỏi mắt, đau mỏi cổ vai gáy do ngồi học:',
            options: [
              { label: 'Hiếm khi, mình có tập thể dục đều đặn', score: 1 },
              { label: 'Thỉnh thoảng sau những buổi học dài', score: 2 },
              { label: 'Thường xuyên hầu hết các buổi tối', score: 3 },
              { label: 'Đau mỏi liên tục không dứt, dùng thuốc giảm đau thường xuyên', score: 4 }
            ]
          },
          {
            id: 10,
            question: 'Nếu ngày mai được nghỉ trọn vẹn một ngày không có bài tập, bạn sẽ:',
            options: [
              { label: 'Rất vui vẻ đi dã ngoại hoặc làm điều mình thích', score: 1 },
              { label: 'Ngủ bù một giấc thật sâu rồi xem phim thư giãn', score: 2 },
              { label: 'Vẫn cảm thấy bất an và lén lấy sách ra đọc', score: 3 },
              { label: 'Quá kiệt sức đến mức nằm bẹp trên giường và không muốn động đậy', score: 4 }
            ]
          }
        ]
      }
    ],
    results: {
      low: {
        level: 'low',
        title: 'Cân bằng học tập: Lành mạnh 🟢',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        summary: 'Bạn đang duy trì nhịp độ học tập rất khoa học. Bạn biết cách đặt mục tiêu thực tế và dành thời gian hồi phục thể chất.',
        actionAdvice: [
          'Duy trì phương pháp học ngắt quãng Pomodoro để giữ não bộ luôn tỉnh táo.',
          'Chia sẻ bí quyết cân bằng cuộc sống với các bạn đang bị áp lực trong lớp.',
          'Tiếp tục nuôi dưỡng sở thích cá nhân bên cạnh việc học.'
        ],
        tendencyInsight: 'Bạn không đồng nhất giá trị con người mình với con số trên bài thi.'
      },
      medium: {
        level: 'medium',
        title: 'Cân bằng học tập: Có dấu hiệu mệt mỏi nhẹ 🟡',
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
        summary: 'Áp lực học tập bắt đầu tăng lên, đặc biệt trong những giai đoạn kiểm tra dồn dập. Bạn đang có xu hướng hy sinh giấc ngủ hoặc thời gian nghỉ ngơi.',
        actionAdvice: [
          'Tuyệt đối không thức quá 23h30 để nhồi nhét bài tập.',
          'Uống đủ 1.5 - 2 lít nước mỗi ngày và vận động nhẹ giữa các ca học.',
          'Rà soát lại lịch học thêm và cắt giảm những lớp học không thực sự cần thiết.'
        ],
        tendencyInsight: 'Bạn có tinh thần trách nhiệm cao nhưng cần học cách yêu thương cơ thể mình hơn.'
      },
      high: {
        level: 'high',
        title: 'Cân bằng học tập: Nguy cơ kiệt sức cao 🟠',
        badgeColor: 'bg-orange-100 text-orange-800 border-orange-300',
        summary: 'Bộ não của bạn đang phát tín hiệu quá tải nghiêm trọng. Học tập không còn là niềm vui khám phá mà đã biến thành cuộc chạy trốn nỗi sợ hãi.',
        actionAdvice: [
          'Nói chuyện thẳng thắn với bố mẹ về việc giảm bớt tải học thêm.',
          'Dành trọn vẹn 1 ngày cuối tuần để ngủ đủ giấc và ra ngoài thiên nhiên.',
          'Nhớ rằng: Sức khỏe tinh thần của bạn quý giá hơn bất kỳ tấm giấy khen nào.'
        ],
        tendencyInsight: 'Xu hướng cầu toàn tiêu cực (Maladaptive perfectionism). Bạn đang đặt ra những tiêu chuẩn quá khắt khe cho bản thân.'
      },
      veryHigh: {
        level: 'very-high',
        title: 'Cân bằng học tập: Đang kiệt sức (Burnout) 🔴',
        badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
        summary: 'Bạn đang bị kiệt sức học đường nghiêm trọng. Cả thể xác và tinh thần đều đã cạn kiệt năng lượng dự trữ.',
        actionAdvice: [
          'Cần có sự can thiệp và hỗ trợ từ gia đình ngay lập tức để giảm tải toàn diện.',
          'Tạm dừng các kỳ thi thử không bắt buộc.',
          'Liên hệ chuyên gia tâm lý học đường hoặc đường dây tư vấn tâm lý (1900 6233) để được hỗ trợ chuyên sâu.'
        ],
        tendencyInsight: 'Tình trạng quá tải khẩn cấp. Cần ưu tiên tuyệt đối cho việc nghỉ ngơi và hồi phục sức khỏe.'
      }
    }
  }
];

export const TEEN_COMPREHENSIVE_QUIZZES: Quiz[] = [
  ...QUIZZES,
  ...COMPREHENSIVE_QUIZZES.flatMap((cq) =>
    cq.sets.map((s, idx) => ({
      id: `${cq.id}-${s.setId}`,
      title: `${cq.title} - ${s.setName.split(':')[0]}`,
      icon: cq.icon,
      description: cq.description,
      disclaimer: cq.disclaimer,
      questions: s.questions,
      results: cq.results
    }))
  )
];
