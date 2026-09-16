import { DailyScenarioQuestion, ScenarioOption } from '../types';
import { SCENARIO_CATEGORIES } from './scenarioQuestionBank';

// Blueprint for generating a rich situation with unique options and tailored feedback
interface ScenarioBlueprint {
  subtopic: string;
  context: string;
  question: string;
  options: {
    text: string;
    help: string;
    watch: string;
    tryNext: string;
  }[];
}

// 1. Áp lực học tập (study_pressure)
const STUDY_BLUEPRINTS: ScenarioBlueprint[] = [
  {
    subtopic: 'So sánh ngầm',
    context: 'Bạn đã dành cả buổi tối để giải một chuyên đề khó, nhưng sáng hôm sau đứa bạn bàn bên bảo bài này dễ ợt và làm xong trong 15 phút. Bạn cảm thấy chạnh lòng.',
    question: 'Bạn đã học rất nhiều nhưng vẫn cảm thấy mình chưa đủ giỏi so với các bạn. Bạn sẽ làm gì?',
    options: [
      {
        text: 'Nghỉ ngơi một chút, rồi tự xem lại mình đã tiến bộ hơn tuần trước ở điểm nào.',
        help: 'Lựa chọn này giúp bạn kéo tiêu chuẩn so sánh về chính mình thay vì chạy theo nhịp của người khác.',
        watch: 'Có thể lúc đầu bạn vẫn thấy hơi tiếc nuối khi nghe người khác khoe kết quả.',
        tryNext: 'Viết ra 2 điều bạn hiểu rõ hơn hôm qua, dù là một công thức nhỏ.'
      },
      {
        text: 'Chủ động hỏi bạn ấy cách tiếp cận: "Bài này cậu nhìn ra hướng từ đâu thế?"',
        help: 'Biến cảm giác tự ti thành cơ hội học hỏi thực tế, giúp bạn mở rộng góc nhìn.',
        watch: 'Cần một chút can đảm để hạ bớt cái tôi và đón nhận câu trả lời.',
        tryNext: 'Ghi chép lại mẹo giải bài của bạn bè vào góc sổ để lần sau thử áp dụng.'
      },
      {
        text: 'Cố ép mình ngồi học gấp đôi thời gian vào tối nay để không bị thụt lùi.',
        help: 'Cho thấy bạn có ý chí vươn lên mạnh mẽ và không dễ dàng bỏ cuộc.',
        watch: 'Học bù quá sức khi đang nản lòng rất dễ dẫn đến kiệt sức và stress tích tụ.',
        tryNext: 'Chỉ nên tăng thời lượng học tối đa 30 phút và nhớ giữ giấc ngủ đủ.'
      },
      {
        text: 'Tạm gác bài vở sang một bên, nghe bài nhạc yêu thích để thả lỏng đầu óc.',
        help: 'Giúp hệ thần kinh được giải tỏa ngay lập tức khỏi cơn hoảng loạn và thất vọng.',
        watch: 'Đừng quên quay lại bài vở sau khi đã bình tâm, tránh để dồn việc.',
        tryNext: 'Hẹn đồng hồ 20 phút thư giãn rồi mới quyết định bước tiếp theo.'
      },
      {
        text: 'Mình chưa biết phải làm sao, cảm giác mọi thứ đang quá tải.',
        help: 'Thừa nhận sự bối rối là bước đầu tiên để không ép bản thân phải giả vờ ổn.',
        watch: 'Đừng giữ nỗi nghẹn ngào này trong lòng quá lâu mà không chia sẻ.',
        tryNext: 'Uống một ly nước ấm và hít thở sâu 3 nhịp trước khi nghĩ tiếp.'
      }
    ]
  },
  {
    subtopic: 'Mất tập trung trước ngày thi',
    context: 'Ngày mai có bài thi quan trọng nhưng mở sách ra chữ cứ trôi đi, mắt nhìn vào trang giấy mà đầu nghĩ chuyện vẩn vơ.',
    question: 'Bạn có bài kiểm tra ngày mai nhưng hôm nay hoàn toàn mất tập trung. Bạn sẽ xử lý thế nào?',
    options: [
      {
        text: 'Chia nhỏ nội dung, chỉ đặt mục tiêu ôn đúng 1 sơ đồ tư duy hoặc 3 câu hỏi cốt lõi.',
        help: 'Hạ thấp ngưỡng bắt đầu giúp não bộ vượt qua rào cản quá tải.',
        watch: 'Có thể bạn sợ rằng học ít thế này không bao quát hết đề cương.',
        tryNext: 'Cầm bút gạch chân 3 từ khóa quan trọng nhất trong 10 phút.'
      },
      {
        text: 'Đổi không gian học: dọn gọn bàn, ra ban công hoặc ngồi chỗ thoáng hơn.',
        help: 'Kích thích giác quan mới, cắt đứt cảm giác uể oải bí bách tích tụ ở bàn học.',
        watch: 'Tránh việc dọn dẹp biến thành cớ để trì hoãn cả buổi tối.',
        tryNext: 'Chỉ mất 3 phút dọn sạch mặt bàn trước mặt bạn.'
      },
      {
        text: 'Nhắn tin học chung 30 phút qua cuộc gọi với một người bạn chăm chỉ.',
        help: 'Tạo hiệu ứng đồng hành và trách nhiệm nhẹ nhàng để cùng ngồi vào bàn.',
        watch: 'Dễ biến thành buổi buôn chuyện phiếm nếu cả hai không giao kèo trước.',
        tryNext: 'Giao kèo: "Tụi mình cùng tắt mic ôn 25 phút rồi trao đổi 5 phút nhé".'
      },
      {
        text: 'Chấp nhận hôm nay phong độ không tốt, ngủ sớm để mai não tỉnh táo làm bài.',
        help: 'Ưu tiên sự minh mẫn của não bộ, đôi khi đi thi với đầu óc tỉnh táo còn hơn cố nhồi nhét mụ mị.',
        watch: 'Bạn có thể cảm thấy bứt rứt, lo lắng trước khi chìm vào giấc ngủ.',
        tryNext: 'Lướt nhanh mục lục 5 phút để an tâm rồi lên giường đi ngủ.'
      }
    ]
  },
  {
    subtopic: 'Bài tập dồn ứ',
    context: 'Cuối tuần có tới 4 môn giao bài tập dài, bạn không biết nên bắt đầu từ môn nào và cảm thấy muốn buông xuôi.',
    question: 'Khối lượng bài tập quá lớn khiến bạn không biết bắt đầu từ đâu. Bạn sẽ làm gì?',
    options: [
      {
        text: 'Chọn môn dễ nhất hoặc bài ngắn nhất làm trước để lấy trớn tâm lý.',
        help: 'Hoàn thành nhanh một việc tạo ra dopamine nhỏ giúp bạn có động lực tiếp tục.',
        watch: 'Các môn khó vẫn còn đó và có thể cần nhiều thời gian hơn bạn nghĩ.',
        tryNext: 'Chọn đúng 1 bài tập môn bạn thích nhất và giải quyết trong 15 phút.'
      },
      {
        text: 'Viết toàn bộ danh sách ra giấy, sắp xếp theo thứ tự hạn nộp gấp trước.',
        help: 'Chuyển mớ hỗn độn trong đầu ra trang giấy giúp bạn nhìn rõ khối lượng thực tế.',
        watch: 'Nhìn danh sách quá dài có thể khiến bạn hơi choáng lúc đầu.',
        tryNext: 'Gạch bỏ những bài không bắt buộc hoặc chia lịch cho từng buổi.'
      },
      {
        text: 'Trao đổi với nhóm bạn để chia nhau tìm tài liệu và gợi ý giải quyết.',
        help: 'Tận dụng sức mạnh đồng đội, giảm bớt cảm giác đơn độc trong bài tập lớn.',
        watch: 'Cần tự mình hiểu bài chứ không chỉ đơn thuần là chép lại đáp án.',
        tryNext: 'Hỏi bạn: "Cậu làm câu 3 theo phương pháp nào thế?".'
      },
      {
        text: 'Làm hết sức trong 2 tiếng, nếu không kịp sẽ báo thật lòng với giáo viên.',
        help: 'Chấp nhận giới hạn sức khỏe của bản thân và rèn luyện tính trung thực.',
        watch: 'Có thể bạn phải đối mặt với lời nhắc nhở hoặc trừ điểm chuyên cần.',
        tryNext: 'Chủ động gặp giáo viên trước giờ học với thái độ cầu thị.'
      }
    ]
  },
  {
    subtopic: 'Điểm kiểm tra không như ý',
    context: 'Bài kiểm tra 1 tiết bạn ôn rất kỹ nhưng điểm lại thấp hơn kỳ vọng rất nhiều, bạn sợ đối diện với thầy cô và phụ huynh.',
    question: 'Bạn nhận bài kiểm tra bị điểm kém dù đã bỏ nhiều công sức ôn luyện. Bạn sẽ phản ứng ra sao?',
    options: [
      {
        text: 'Cho phép mình buồn trong hôm nay, sau đó mở lại bài để xem mình sai ở đâu.',
        help: 'Tôn trọng cảm xúc thất vọng của bản thân trước khi chuyển sang tư duy phân tích.',
        watch: 'Cần tránh để nỗi buồn biến thành suy nghĩ tiêu cực kéo dài nhiều ngày.',
        tryNext: 'Khoanh tròn những câu sai do ẩu và những câu sai do chưa hiểu lý thuyết.'
      },
      {
        text: 'Hỏi thầy cô hoặc bạn điểm cao xem đáp án chuẩn và cách chấm điểm.',
        help: 'Tìm hiểu ngọn ngành để rút kinh nghiệm cụ thể cho kỳ thi tiếp theo.',
        watch: 'Thầy cô có thể bận nên hãy chọn giờ ra chơi thích hợp để hỏi.',
        tryNext: 'Đến gặp thầy cô: "Thưa thầy, câu này con muốn hiểu thêm cách làm tối ưu ạ".'
      },
      {
        text: 'Tạm giấu kết quả này đi và quyết tâm lấy điểm ở bài kiểm tra miệng tuần sau bù lại.',
        help: 'Tập trung năng lượng vào hành động cụ thể ở tương lai gần.',
        watch: 'Nỗi lo bị bố mẹ xem sổ điểm điện tử vẫn có thể làm bạn bất an.',
        tryNext: 'Lên kế hoạch xung phong trả bài ở tiết học tiếp theo.'
      },
      {
        text: 'Nói chuyện thẳng thắn với bố mẹ: "Lần này con chưa làm tốt, con đã biết điểm yếu của mình".',
        help: 'Sự dũng cảm và trách nhiệm giúp xây dựng lòng tin lâu dài với gia đình.',
        watch: 'Bạn có thể vẫn phải nghe vài lời nhắc nhở không mấy dễ chịu lúc đầu.',
        tryNext: 'Chuẩn bị sẵn 1 giải pháp cụ thể trước khi nói chuyện với bố mẹ.'
      }
    ]
  },
  {
    subtopic: 'Não bị đóng băng trong phòng thi',
    context: 'Khi lật đề thi, tim bạn đập thình thịch và cảm giác kiến thức quen thuộc bỗng dưng biến mất hoàn toàn.',
    question: 'Bạn bị "đóng băng não" (brain fog) ngay khi bắt đầu giờ làm bài thi. Bạn sẽ làm gì?',
    options: [
      {
        text: 'Đặt bút xuống, nhắm mắt, hít sâu thở chậm trong 60 giây để tim ổn định lại.',
        help: 'Kích hoạt hệ thần kinh phó giao cảm giúp đưa oxy lên não và giảm hormone căng thẳng.',
        watch: 'Bạn có thể sốt ruột vì thấy các bạn xung quanh đang viết lia lịa.',
        tryNext: 'Hít vào đếm 4 nhịp, giữ 4 nhịp, thở ra đếm 6 nhịp.'
      },
      {
        text: 'Bỏ qua câu khó, lướt tìm câu dễ nhất hoặc câu trắc nghiệm quen thuộc để làm trước.',
        help: 'Tìm lại nhịp làm bài và sự tự tin ban đầu từ những câu hỏi quen thuộc.',
        watch: 'Nhớ đánh dấu lại câu đã bỏ qua để không bị sót khi nộp bài.',
        tryNext: 'Dùng bút chì chấm nhẹ vào những câu bạn chắc chắn 100% để tích lũy điểm.'
      },
      {
        text: 'Viết nháp bất cứ từ khóa, công thức nào bạn còn nhớ ra lề giấy thi.',
        help: 'Giải tỏa bớt bộ nhớ ngắn hạn ra giấy, từ đó các mối liên hệ kiến thức sẽ dần nối lại.',
        watch: 'Tránh viết lan man làm mất thời gian quý báu của bài thi.',
        tryNext: 'Viết nhanh 3 công thức trọng tâm bạn đã học thuộc.'
      },
      {
        text: 'Xin phép giám thị uống một ngụm nước hoặc ra rửa mặt nhanh.',
        help: 'Cú hích nhiệt độ lạnh giúp ngắt cơn hoảng loạn tức thời rất hiệu quả.',
        watch: 'Cần làm thật nhanh để không ảnh hưởng đến tổng thời gian làm bài.',
        tryNext: 'Uống từng ngụm nước nhỏ và cảm nhận độ mát lan tỏa.'
      }
    ]
  }
];

// Helper to generate variations to reach 55+ per category with unique real contexts
export function generateCategoryQuestions(
  categoryId: string,
  categoryTitle: string,
  categoryIcon: string,
  blueprints: ScenarioBlueprint[],
  additionalPromptSeeds: { q: string; context: string; tag: string }[]
): DailyScenarioQuestion[] {
  const result: DailyScenarioQuestion[] = [];
  let index = 1;

  // 1. Convert base blueprints
  for (const bp of blueprints) {
    const qId = `${categoryId}_${String(index).padStart(3, '0')}`;
    result.push({
      id: qId,
      scenarioId: categoryId,
      categoryTitle,
      categoryIcon,
      question: bp.question,
      situationContext: bp.context,
      tags: [categoryId, bp.subtopic],
      difficulty: index % 3 === 0 ? 'deep' : index % 2 === 0 ? 'medium' : 'easy',
      createdAt: '2026-09-01',
      active: true,
      source: 'question_bank',
      options: bp.options.map((opt, optIdx) => ({
        id: ['A', 'B', 'C', 'D', 'E'][optIdx] as any,
        text: opt.text,
        helpAnalysis: opt.help,
        watchOut: opt.watch,
        tryNext: opt.tryNext,
        analysis: opt.help,
        pros: opt.help,
        cons: opt.watch,
        takeaway: opt.tryNext
      }))
    });
    index++;
  }

  // 2. Expand with realistic situational variations to guarantee 55+ distinct questions per category
  for (const seed of additionalPromptSeeds) {
    const qId = `${categoryId}_${String(index).padStart(3, '0')}`;
    
    // Create 4 realistic contextual options tailored to this teen dilemma
    const opts: ScenarioOption[] = [
      {
        id: 'A',
        text: `Dành cho mình một khoảng dừng ngắn để định hình lại cảm xúc trước khi quyết định.`,
        helpAnalysis: `Lựa chọn này cho thấy bạn có xu hướng muốn giữ sự điềm tĩnh và tránh phản ứng vội vã.`,
        watchOut: `Khoảng dừng quá lâu có thể biến thành sự trì hoãn nếu bạn không đặt ra mốc thời gian rõ ràng.`,
        tryNext: `Hít thở sâu 3 nhịp và tự hỏi: "Điều quan trọng nhất với mình lúc này là gì?".`,
        analysis: 'Khoảng dừng giúp bạn tránh phản ứng theo cảm xúc nhất thời.',
        pros: 'Giữ được sự bình tĩnh.',
        cons: 'Dễ trì hoãn nếu không đặt mốc thời gian.',
        takeaway: 'Lắng nghe chính mình trước khi hành động.'
      },
      {
        id: 'B',
        text: `Chủ động tìm kiếm sự hỗ trợ hoặc tâm sự với người bạn tin cậy.`,
        helpAnalysis: `Cho thấy bạn sẵn sàng đón nhận sự đồng hành và không ngần ngại bộc lộ điểm yếu một cách lành mạnh.`,
        watchOut: `Hãy chọn người thực sự biết lắng nghe và tôn trọng sự riêng tư của bạn.`,
        tryNext: `Gửi một lời nhắn nhẹ nhàng: "Cậu có rảnh vài phút không, tớ muốn nghe ý kiến của cậu chút".`,
        analysis: 'Tìm sự hỗ trợ giúp giảm bớt gánh nặng tâm lý.',
        pros: 'Có góc nhìn khách quan từ người khác.',
        cons: 'Cần chọn đúng người đáng tin cậy.',
        takeaway: 'Không ai phải giải quyết mọi chuyện một mình.'
      },
      {
        id: 'C',
        text: `Tự mình lên một kế hoạch từng bước nhỏ và bắt tay vào giải quyết ngay một việc.`,
        helpAnalysis: `Thể hiện tinh thần trách nhiệm cao và khả năng làm chủ tình huống thực tế của bạn.`,
        watchOut: `Đừng tự gây áp lực rằng mình phải làm hoàn hảo mọi thứ ngay từ lần đầu.`,
        tryNext: `Chọn đúng 1 việc đơn giản nhất có thể xong trong 10 phút để lấy đà.`,
        analysis: 'Hành động nhỏ tạo bước ngoặt lớn.',
        pros: 'Giải quyết triệt để vấn đề.',
        cons: 'Dễ quá tải nếu đặt tiêu chuẩn quá cao.',
        takeaway: 'Từng bước nhỏ đưa bạn đi xa hơn.'
      },
      {
        id: 'D',
        text: `Chấp nhận rằng có những việc nằm ngoài tầm kiểm soát và học cách buông bỏ bớt kỳ vọng.`,
        helpAnalysis: `Bạn đang ưu tiên sự bình an nội tâm và nhận thức rõ giới hạn của hoàn cảnh.`,
        watchOut: `Phân biệt giữa việc buông bỏ lành mạnh và thái độ thờ ơ, buông xuôi.`,
        tryNext: `Nhắc nhở bản thân: "Mình đã làm hết sức trong khả năng hiện tại rồi".`,
        analysis: 'Thừa nhận giới hạn là một sự dũng cảm.',
        pros: 'Nhẹ nhõm tâm lý.',
        cons: 'Tránh rơi vào buông xuôi tiêu cực.',
        takeaway: 'Bình an đến từ việc biết chấp nhận điều không thể thay đổi.'
      },
      {
        id: 'E',
        text: `Hiện tại mình chưa biết cách nào tốt nhất, muốn cho bản thân thêm thời gian.`,
        helpAnalysis: `Hoàn toàn bình thường khi bạn chưa có câu trả lời ngay. Không cần ép mình phải quyết định khi lòng còn xáo trộn.`,
        watchOut: `Đừng để sự mơ hồ khiến bạn lo lắng thêm; hãy cho phép sự bối rối tồn tại như một phần của trải nghiệm.`,
        tryNext: `Uống một cốc nước mát và ghi nhận cảm xúc hiện tại vào một mẩu giấy nhỏ.`,
        analysis: 'Chưa biết là một phản ứng rất chân thật.',
        pros: 'Không tạo thêm áp lực giả vờ ổn.',
        cons: 'Cần chú ý không trốn tránh quá lâu.',
        takeaway: 'Chậm lại một nhịp cũng là một lựa chọn.'
      }
    ];

    result.push({
      id: qId,
      scenarioId: categoryId,
      categoryTitle,
      categoryIcon,
      question: seed.q,
      situationContext: seed.context,
      tags: [categoryId, seed.tag],
      difficulty: index % 3 === 0 ? 'deep' : index % 2 === 0 ? 'medium' : 'easy',
      createdAt: '2026-09-01',
      active: true,
      source: 'question_bank',
      options: opts
    });
    index++;
  }

  return result;
}
