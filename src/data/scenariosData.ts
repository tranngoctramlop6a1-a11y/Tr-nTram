import { Scenario } from '../types';

export interface ScenarioCategoryGroup {
  id: string;
  category: string;
  icon: string;
  description: string;
  sets: Scenario[];
}

export const SCENARIO_CATEGORIES: ScenarioCategoryGroup[] = [
  {
    id: 'cat-study',
    category: 'Áp lực học tập',
    icon: '📚',
    description: 'Ứng phó với điểm số, kỳ vọng thi cử, làm việc nhóm và chọn ban ngành.',
    sets: [
      {
        id: 'scen-study-a',
        category: 'Áp lực học tập',
        title: 'Bộ A: Bạn bị điểm thấp và sợ bố mẹ thất vọng',
        description: 'Kỳ thi vừa qua kết quả môn sở đoản của bạn bị điểm dưới trung bình. Bố mẹ từng đặt rất nhiều kỳ vọng vào kỳ thi này. Bạn cầm bài kiểm tra về nhà với cảm giác lo sợ tột cùng.',
        generalAdvice: 'Sự thất vọng của bố mẹ thường xuất phát từ sự lo lắng cho tương lai của bạn, chứ không đồng nghĩa với việc họ hết yêu thương bạn. Đối diện với sự thật một cách chủ động và có trách nhiệm luôn mang lại kết quả nhẹ nhõm nhất về lâu dài.',
        options: [
          {
            id: 'A',
            text: 'Giấu bài kiểm tra và không nói cho bố mẹ biết',
            analysis: 'Bạn cất bài kiểm tra vào tận đáy cặp hoặc nói dối là cô chưa trả bài.',
            pros: 'Tránh được cơn giận hoặc sự khiển trách ngay trong hôm nay. Tạm thời giữ được không khí yên ổn.',
            cons: 'Bạn sẽ phải sống trong cảm giác lo sợ bị phát hiện bất cứ lúc nào khi họp phụ huynh. Sự dối trá khi vỡ lở sẽ làm mất đi niềm tin của bố mẹ.',
            takeaway: 'Trốn tránh chỉ kéo dài nỗi sợ hãi và làm vấn đề trở nên nghiêm trọng hơn khi sự thật bị phát hiện.'
          },
          {
            id: 'B',
            text: 'Không nói gì, chờ đến khi bố mẹ tự hỏi thì mới trả lời qua loa',
            analysis: 'Bạn giữ im lặng thụ động, mong rằng bố mẹ sẽ bận rộn quên mất kỳ thi này.',
            pros: 'Không trực tiếp nói dối, giảm cảm giác tội lỗi hơn so với việc giấu giếm hoàn toàn.',
            cons: 'Bạn ở trong thế bị động. Khi bố mẹ biết chuyện qua người khác, họ sẽ nghĩ bạn không thành thật và vô trách nhiệm với việc học.',
            takeaway: 'Sự im lặng bị động vẫn mang rủi ro lớn khiến niềm tin bị rạn nứt.'
          },
          {
            id: 'C',
            text: 'Chọn thời điểm thích hợp, nói thật với bố mẹ kèm kế hoạch cải thiện',
            analysis: 'Bạn chủ động đến gặp bố mẹ lúc rảnh rỗi: "Con muốn báo kết quả môn này con làm chưa tốt. Con đã xem lại những lỗi sai và con định làm bài tập bù vào tuần tới..."',
            pros: 'Thể hiện bạn là người dũng cảm, trung thực và có trách nhiệm. Bố mẹ có thể buồn nhưng sẽ trân trọng sự trưởng thành của bạn.',
            cons: 'Bạn có thể vẫn phải nghe bố mẹ cằn nhằn hoặc thất vọng trong chốc lát.',
            takeaway: 'Đây là giải pháp bền vững nhất: Biến thất bại thành cơ hội chứng minh sự có trách nhiệm của bản thân.'
          },
          {
            id: 'D',
            text: 'Nhờ một người đáng tin cậy (anh/chị hoặc giáo viên) hỗ trợ trò chuyện cùng',
            analysis: 'Nếu bạn quá sợ hãi phản ứng tiêu cực hoặc đòn roi, bạn nhờ anh chị lớn hoặc cô giáo chủ nhiệm nhắn trước với bố mẹ.',
            pros: 'Có người thứ ba giữ vai trò cầu nối ôn hòa, giúp cuộc trò chuyện diễn ra bình tĩnh hơn.',
            cons: 'Cần tìm được đúng người thấu hiểu và kín đáo để không làm mọi chuyện phức tạp thêm.',
            takeaway: 'Rất phù hợp nếu môi trường gia đình bạn quá khắt khe hoặc bạn cảm thấy không an toàn khi đối diện một mình.'
          }
        ]
      },
      {
        id: 'scen-study-b',
        category: 'Áp lực học tập',
        title: 'Bộ B: Bạn cùng bàn học ngày đêm khiến bạn hoảng loạn vì sợ tụt lại',
        description: 'Bạn cùng bàn với bạn giải hết các tập đề nâng cao, đi học thêm kín cả tuần và liên tục khoe điểm các bài kiểm tra thử. Bạn cảm thấy mình bị bỏ lại phía sau và bắt đầu mất ngủ vì tự so sánh.',
        generalAdvice: 'Học tập là một cuộc chạy việt dã marathon theo nhịp độ của riêng bạn, không phải cuộc chạy nước rút để đọ tốc độ với người bên cạnh.',
        options: [
          {
            id: 'A',
            text: 'Cố thức thâu đêm học theo cho bằng bạn',
            analysis: 'Bạn cắt giảm giấc ngủ xuống còn 4 tiếng, nhồi nhét bài vở để không cảm thấy thua kém.',
            pros: 'Cảm thấy mình đang nỗ lực như người khác, tạm xoa dịu cảm giác thua kém.',
            cons: 'Cơ thể kiệt sức, trí não giảm khả năng ghi nhớ và dễ dẫn tới hội chứng kiệt sức (burnout) ngay trước kỳ thi.',
            takeaway: 'Học theo lối sống của người khác mà bỏ qua giới hạn sinh học của bản thân sẽ dẫn đến suy sụp.'
          },
          {
            id: 'B',
            text: 'Rút lui, chán nản và nghĩ rằng mình kém cỏi bẩm sinh',
            analysis: 'Bạn buông xuôi, ngừng cố gắng và cho rằng mình sinh ra đã không thông minh bằng người ta.',
            pros: 'Tránh được cảm giác mệt mỏi vì phải tranh đua.',
            cons: 'Đánh mất hoàn toàn tiềm năng của chính mình và để lại sự tiếc nuối lớn.',
            takeaway: 'Tự ti và từ bỏ sớm là cái bẫy lớn nhất của tâm lý so sánh.'
          },
          {
            id: 'C',
            text: 'Lập kế hoạch học tập theo đúng năng lực và mục tiêu cá nhân của mình',
            analysis: 'Tập trung vào những môn mình cần cải thiện, giữ lịch ngủ đủ giấc và đo lường sự tiến bộ so với chính mình ngày hôm qua.',
            pros: 'Tâm lý vững vàng, học tập có chiều sâu và bền bỉ trong suốt chặng đường dài.',
            cons: 'Đòi hỏi sự kiên định và kỷ luật để không bị lung lay bởi tiếng ồn xung quanh.',
            takeaway: 'Bạn chỉ cần giỏi hơn chính bạn của ngày hôm qua là đã thành công lớn.'
          },
          {
            id: 'D',
            text: 'Chủ động biến bạn thành bạn đồng hành học tập cùng tiến',
            analysis: 'Hỏi bạn những phương pháp học hiệu quả, chia sẻ tài liệu và cùng nhau thảo luận những câu khó.',
            pros: 'Biến áp lực ganh đua tiêu cực thành mối quan hệ hợp tác cùng tiến bộ.',
            cons: 'Cần gạt bỏ cái tôi và sự tự ái ban đầu.',
            takeaway: 'Muốn đi nhanh hãy đi một mình, muốn đi xa hãy đi cùng nhau.'
          }
        ]
      },
      {
        id: 'scen-study-c',
        category: 'Áp lực học tập',
        title: 'Bộ C: Bạn làm nhóm trưởng nhưng các thành viên ỷ lại và không chịu nộp bài',
        description: 'Hạn nộp bài thuyết trình là sáng mai nhưng các thành viên trong nhóm vẫn chưa gửi slide hoặc gửi những nội dung sơ sài sao chép từ mạng.',
        generalAdvice: 'Làm việc nhóm đòi hỏi sự rõ ràng về quy tắc và ranh giới. Làm hộ người khác không phải là lòng tốt mà là dung túng cho sự vô trách nhiệm.',
        options: [
          {
            id: 'A',
            text: 'Tự mình thức trắng đêm làm lại toàn bộ cho cả nhóm để lấy điểm cao',
            analysis: 'Bạn ôm hết mọi việc vào người, không dám làm mếch lòng ai.',
            pros: 'Bài nộp đúng hạn, chất lượng đảm bảo theo ý bạn.',
            cons: 'Bạn kiệt sức, ấm ức trong lòng và tạo tiền lệ xấu cho các bạn khác ỷ lại ở những lần sau.',
            takeaway: 'Ôm đồm công việc chỉ giải quyết điểm số nhất thời nhưng làm tổn hại sức khỏe và cảm xúc của chính bạn.'
          },
          {
            id: 'B',
            text: 'Cãi nhau to trong nhóm chat và bỏ mặc không nộp bài nữa',
            analysis: 'Bạn bùng nổ cơn giận, trách móc các bạn rồi buông xuôi bài tập.',
            pros: 'Xả được cơn giận tức thời.',
            cons: 'Cả nhóm bị điểm 0, mối quan hệ bạn bè rạn nứt và giáo viên đánh giá bạn thiếu kỹ năng lãnh đạo.',
            takeaway: 'Mất bình tĩnh và buông xuôi biến bạn từ nạn nhân thành người có lỗi trong mắt người khác.'
          },
          {
            id: 'C',
            text: 'Đặt hạn chót rõ ràng, sau đó báo cáo trung thực sự phân công công việc cho giáo viên',
            analysis: 'Gửi thông báo: "Nếu trước 21h hôm nay ai chưa nộp phần việc của mình, mình sẽ gửi bài với phần đóng góp thực tế và ghi rõ tên những người hoàn thành".',
            pros: 'Công bằng, văn minh, bảo vệ quyền lợi của người làm thật và rèn luyện tính chịu trách nhiệm cho các bạn khác.',
            cons: 'Có thể bị một số bạn thiếu hiểu biết giận dỗi trong chốc lát.',
            takeaway: 'Sự minh bạch và ranh giới rõ ràng là kỹ năng làm việc nhóm chuyên nghiệp nhất.'
          },
          {
            id: 'D',
            text: 'Chủ động gặp trực tiếp từng bạn để hỏi lý do và hỗ trợ tháo gỡ khó khăn',
            analysis: 'Hỏi xem bạn có gặp khó khăn gì ở phần nội dung được giao không để hướng dẫn bạn hoàn thành.',
            pros: 'Gắn kết tinh thần đồng đội nếu lý do các bạn chậm trễ là do chưa hiểu bài.',
            cons: 'Mất nhiều thời gian và không hiệu quả với những bạn cố tình lười biếng.',
            takeaway: 'Hỗ trợ đồng đội là tốt, nhưng phải đi kèm với việc người đó có thiện chí cố gắng.'
          }
        ]
      },
      {
        id: 'scen-study-d',
        category: 'Áp lực học tập',
        title: 'Bộ D: Bạn đam mê nghệ thuật/viết lách nhưng bố mẹ ép thi khối Tự nhiên',
        description: 'Bạn có năng khiếu và tình yêu lớn với hội họa/thiết kế đồ họa, nhưng bố mẹ kiên quyết bắt bạn phải học khối A để thi trường kinh tế hoặc kỹ thuật cho "ổn định".',
        generalAdvice: 'Khoảng cách thế hệ thường khiến bố mẹ lo lắng cho sự an toàn kinh tế của con cái. Thuyết phục bằng kết quả và sự chuẩn bị nghiêm túc luôn hiệu quả hơn việc đối đầu gay gắt.',
        options: [
          {
            id: 'A',
            text: 'Đối đầu gay gắt, tuyên bố bỏ học nếu không được làm theo ý mình',
            analysis: 'Bạn đập bàn, to tiếng và chống đối mọi quy định của bố mẹ trong nhà.',
            pros: 'Bộc lộ được cảm xúc bức bối dồn nén bấy lâu.',
            cons: 'Không khí gia đình đóng băng, bố mẹ càng tin rằng bạn còn nông nổi và chưa đủ trưởng thành để tự quyết tương lai.',
            takeaway: 'Phản kháng bằng sự nóng nảy chỉ củng cố định kiến của phụ huynh rằng con chưa đủ chín chắn.'
          },
          {
            id: 'B',
            text: 'Hoàn toàn cam chịu, từ bỏ ước mơ để làm hài lòng bố mẹ',
            analysis: 'Bạn cất hết cọ vẽ, sách truyện vào ngăn tủ và chấp nhận học những môn mình ghét.',
            pros: 'Tránh được xung đột gia đình, được bố mẹ khen ngoan ngoãn.',
            cons: 'Sống trong sự chán nản, mất động lực sống và dễ hối hận suốt nhiều năm sau này.',
            takeaway: 'Từ bỏ ước mơ chân chính sẽ để lại nỗi trống rỗng lớn trong tâm hồn.'
          },
          {
            id: 'C',
            text: 'Xây dựng kế hoạch thực tế, tìm hiểu cơ hội nghề nghiệp và kiên nhẫn đối thoại',
            analysis: 'Tìm hiểu các trường đào tạo, mức thu nhập của ngành thiết kế, các tấm gương thành công và xin bố mẹ một khoảng thời gian thử thách.',
            pros: 'Chứng minh bằng số liệu và sự chuẩn bị chu đáo, giúp bố mẹ yên tâm về mặt an toàn tương lai.',
            cons: 'Cần nhiều thời gian và sự kiên trì thuyết phục nhiều lần.',
            takeaway: 'Sự chuẩn bị kỹ lưỡng và thái độ chín chắn là chìa khóa mở cánh cửa thấu hiểu từ cha mẹ.'
          },
          {
            id: 'D',
            text: 'Học song song: Hoàn thành mức cơ bản khối của bố mẹ, dành thời gian rảnh trau dồi đam mê',
            analysis: 'Đảm bảo điểm số trên lớp ở mức an toàn để bố mẹ yên tâm, đồng thời tự học vẽ/viết vào cuối tuần để xây dựng portfolio cá nhân.',
            pros: 'Giữ được hòa khí gia đình vừa không từ bỏ ngọn lửa đam mê.',
            cons: 'Đòi hỏi sự nỗ lực gấp đôi và kỷ luật thời gian rất cao.',
            takeaway: 'Hành động âm thầm và chứng minh bằng năng lực thực tế là chiến lược bền bỉ.'
          }
        ]
      }
    ]
  },
  {
    id: 'cat-boundaries',
    category: 'Khó nói "Không"',
    icon: '🛡️',
    description: 'Bảo vệ ranh giới cá nhân, học cách từ chối tử tế và không để người khác lợi dụng.',
    sets: [
      {
        id: 'scen-bound-a',
        category: 'Khó nói "Không"',
        title: 'Bộ A: Bạn thân mượn bài tập về nhà chép để nộp cho cô',
        description: 'Người bạn thân nhất của bạn không làm bài tập và nhắn tin xin chụp vở bài tập bạn vừa mất cả tối để làm, hẹn sáng mai sẽ nộp cho cô.',
        generalAdvice: 'Giúp bạn hiểu bài là lòng tốt, cho bạn chép bài để đối phó là làm hại sự tiến bộ của bạn và tạo rủi ro cho cả hai.',
        options: [
          {
            id: 'A',
            text: 'Chụp gửi ngay không do dự vì sợ bạn giận',
            analysis: 'Bạn gửi toàn bộ bài làm của mình cho bạn chép.',
            pros: 'Giữ được hòa khí ngay lúc đó, được bạn khen là "tốt bụng".',
            cons: 'Bạn sẽ phụ thuộc vào bạn ở những lần sau. Nếu cô giáo phát hiện hai bài giống nhau, cả hai sẽ bị phạt điểm 0.',
            takeaway: 'Dễ dãi nhất thời tạo ra thói quen ỷ lại lâu dài.'
          },
          {
            id: 'B',
            text: 'Nói dối là mình chưa làm xong',
            analysis: 'Bạn bịa ra lý do mình cũng chưa làm để không phải cho mượn.',
            pros: 'Từ chối được mà không phải trực tiếp đối đầu.',
            cons: 'Khi lên lớp bạn vẫn phải nộp bài, sự dối trá bị lộ sẽ làm rạn nứt niềm tin tình bạn.',
            takeaway: 'Lời nói dối che đậy sự sợ hãi và không giải quyết được gốc rễ của vấn đề ranh giới.'
          },
          {
            id: 'C',
            text: 'Từ chối cho chép nhưng đề nghị giảng bài hoặc gợi ý cách làm',
            analysis: 'Nhắn lại: "Mình không chụp vở cho cậu chép được vì cô sẽ phạt cả hai. Nhưng cậu vướng câu nào thì bảo mình, mình chụp gợi ý cách giải cho cậu làm theo nha".',
            pros: 'Vừa giữ được ranh giới liêm chính trong học tập, vừa thể hiện sự quan tâm chân thành đến việc bạn hiểu bài.',
            cons: 'Bạn có thể hơi thất vọng một chút nếu bạn chỉ muốn ăn sẵn.',
            takeaway: 'Từ chối hành vi sai nhưng mở ra cánh cửa hỗ trợ đúng đắn là đỉnh cao của sự thấu đáo.'
          },
          {
            id: 'D',
            text: 'Thẳng thừng mắng bạn lười biếng và từ chối cộc lốc',
            analysis: 'Bạn buông lời chỉ trích nặng nề khiến bạn xấu hổ.',
            pros: 'Ranh giới được khẳng định tuyệt đối.',
            cons: 'Làm tổn thương lòng tự trọng của bạn và dễ đẩy mối quan hệ vào ngõ cụt.',
            takeaway: 'Cương quyết không đồng nghĩa với việc thô lỗ hay xúc phạm người khác.'
          }
        ]
      },
      {
        id: 'scen-bound-b',
        category: 'Khó nói "Không"',
        title: 'Bộ B: Nhóm bạn rủ đi chơi trốn học thêm, sợ từ chối sẽ bị tẩy chay',
        description: 'Nhóm bạn chơi thân rủ bạn bùng buổi học thêm buổi chiều để đi ăn vặt và chơi net. Các bạn bảo: "Không đi là không nể anh em, lần sau không rủ nữa đâu đấy!".',
        generalAdvice: 'Những người bạn chân chính sẽ tôn trọng mục tiêu và ranh giới an toàn của bạn. Tình bạn xây dựng trên sự ép buộc vi phạm kỷ luật không phải là nơi an toàn.',
        options: [
          {
            id: 'A',
            text: 'Tặc lưỡi đi theo để không bị cô lập khỏi nhóm',
            analysis: 'Bạn bùng học theo các bạn dù lòng đầy bất an lo sợ bố mẹ phát hiện.',
            pros: 'Được nhóm bạn tung hô là "chịu chơi", không bị ra rìa hôm đó.',
            cons: 'Mất kiến thức bài học, luôn sống trong lo sợ bị lộ và dần trượt dốc theo những rủ rê nguy hiểm hơn.',
            takeaway: 'Cố gắng hòa nhập bằng cách đánh mất nguyên tắc cá nhân luôn mang lại cái giá rất đắt.'
          },
          {
            id: 'B',
            text: 'Báo cáo ngay với giáo viên để giáo viên bắt quả tang các bạn',
            analysis: 'Bạn đi mách thầy cô ngay lập tức.',
            pros: 'Ngăn chặn được hành vi trốn học của các bạn.',
            cons: 'Bạn sẽ bị coi là người chỉ điểm và gặp xung đột gay gắt với cả lớp.',
            takeaway: 'Báo cáo vi phạm cần đúng lúc và đúng cách, tránh biến mình thành tâm điểm thù hằn khi chưa cần thiết.'
          },
          {
            id: 'C',
            text: 'Từ chối dứt khoát với nụ cười thân thiện và hẹn dịp cuối tuần',
            analysis: 'Bạn bảo: "Hôm nay mình cần nghe bài này trên lớp thầy giảng. Thứ Bảy tụi mình đi ăn chè sau nhé!".',
            pros: 'Bảo vệ được việc học của bản thân mà vẫn giữ thái độ hòa nhã, không biến cuộc trò chuyện thành căng thẳng.',
            cons: 'Có thể bị các bạn trêu chọc "mọt sách" trong vài phút.',
            takeaway: 'Tự tin từ chối với thái độ thoải mái sẽ khiến người khác dần phải tôn trọng bạn.'
          },
          {
            id: 'D',
            text: 'Nói thật về nỗi sợ bố mẹ buồn lòng nếu mình trốn học',
            analysis: 'Chia sẻ chân thành: "Bố mẹ tớ vất vả đóng tiền học cho tớ, tớ trốn học tớ cắn rứt lắm, các cậu thông cảm cho tớ nha".',
            pros: 'Đánh vào sự thấu hiểu tình cảm, những người bạn tốt sẽ lập tức tôn trọng bạn.',
            cons: 'Cần sự cởi mở và dũng cảm bộc lộ cảm xúc thật.',
            takeaway: 'Chân thành luôn là cầu nối vững chắc nhất để giữ gìn mối quan hệ.'
          }
        ]
      },
      {
        id: 'scen-bound-c',
        category: 'Khó nói "Không"',
        title: 'Bộ C: Bị nhờ trực nhật và làm việc vặt hộ liên tục nhiều ngày',
        description: 'Một bạn trong lớp thường xuyên đến muộn hoặc viện cớ bận việc riêng để nhờ bạn quét lớp hoặc đổ rác hộ, dù bạn cũng có việc phải về sớm.',
        generalAdvice: 'Sự nhiệt tình nếu không có ranh giới sẽ vô tình biến bạn thành nơi người khác trút bỏ trách nhiệm.',
        options: [
          {
            id: 'A',
            text: 'Âm thầm làm hộ hết ngày này qua ngày khác rồi về nhà ấm ức',
            analysis: 'Bạn không dám từ chối vì sợ người ta nghĩ mình keo kiệt.',
            pros: 'Được tiếng là người dễ tính, không ai trách.',
            cons: 'Bạn bị bòn rút thời gian, mệt mỏi và cảm thấy bất công tột độ.',
            takeaway: 'Tử tế không đồng nghĩa với việc để người khác giẫm đạp lên quyền lợi của mình.'
          },
          {
            id: 'B',
            text: 'Quát mắng và ném chổi vào mặt bạn giữa lớp',
            analysis: 'Bạn bùng nổ cơn tức giận tích tụ bấy lâu.',
            pros: 'Bạn kia sẽ sợ và không dám nhờ nữa.',
            cons: 'Hình ảnh của bạn trở nên nóng nảy, hung dữ trong mắt tập thể.',
            takeaway: 'Phản ứng thái quá làm mất đi tính chính danh của yêu cầu chính đáng.'
          },
          {
            id: 'C',
            text: 'Bình tĩnh nói rõ: "Hôm nay đến phiên cậu, mình đã làm hộ 2 lần rồi nên hôm nay cậu tự làm nhé"',
            analysis: 'Giao tiếp rõ ràng, nhìn thẳng vào mắt bạn với thái độ bình thản, không nhượng bộ.',
            pros: 'Khẳng định ranh giới vững chắc mà không gây gổ, người kia tự khắc phải hiểu và làm việc của mình.',
            cons: 'Cần vượt qua cảm giác ngại ngùng ban đầu.',
            takeaway: 'Rõ ràng là tử tế nhất: Nói đúng sự thật với giọng điệu điềm đạm luôn có sức mạnh lớn nhất.'
          },
          {
            id: 'D',
            text: 'Đề xuất đổi ca công bằng trong bảng phân công trực nhật',
            analysis: 'Gặp cán sự lớp để ghi rõ ai đổi ca với ai, nếu bạn nhờ thì bạn phải trực bù ngày hôm sau.',
            pros: 'Có sự chứng kiến của tập thể, tạo sự ràng buộc minh bạch.',
            cons: 'Đòi hỏi thủ tục và nhờ đến ban cán sự lớp.',
            takeaway: 'Dựa vào quy định tập thể là cách thông minh để giải quyết sự ỷ lại cá nhân.'
          }
        ]
      },
      {
        id: 'scen-bound-d',
        category: 'Khó nói "Không"',
        title: 'Bộ D: Người khác đọc lén tin nhắn hoặc nhật ký riêng của bạn',
        description: 'Bạn để quên điện thoại hoặc cuốn sổ tay trên bàn trong giờ ra chơi. Khi quay lại, bạn thấy một bạn trong lớp đang cầm đọc và cười đùa với mấy bạn xung quanh.',
        generalAdvice: 'Không gian riêng tư và bí mật cá nhân là quyền bất khả xâm phạm. Cần có phản ứng dứt khoát để chặn đứng hành vi thiếu tôn trọng này.',
        options: [
          {
            id: 'A',
            text: 'Cười trừ cho qua chuyện coi như một trò đùa vô hại',
            analysis: 'Bạn giả vờ như không có gì nghiêm trọng để giữ không khí vui vẻ.',
            pros: 'Không làm không khí trong lớp bị căng thẳng.',
            cons: 'Họ sẽ nghĩ bạn không coi trọng quyền riêng tư của mình và tiếp tục lặp lại hành vi đó trong tương lai.',
            takeaway: 'Cười trừ trước sự xâm phạm là tự hạ thấp giá trị ranh giới của bản thân.'
          },
          {
            id: 'B',
            text: 'Lao vào giật lại và đánh bạn kia một trận',
            analysis: 'Bạo lực bộc phát do quá tức giận.',
            pros: 'Lấy lại được đồ ngay lập tức.',
            cons: 'Vi phạm nội quy trường học, bạn có thể bị kỷ luật nặng hơn hành vi đọc lén của bạn kia.',
            takeaway: 'Dùng bạo lực để giải quyết sự vô duyên luôn khiến bạn rơi vào thế bất lợi.'
          },
          {
            id: 'C',
            text: 'Yêu cầu trả lại ngay với giọng nghiêm túc: "Đây là đồ riêng tư của mình, các bạn đang vi phạm ranh giới cá nhân"',
            analysis: 'Bước lại, chìa tay lấy lại tài sản, nói dứt khoát đủ để những người xung quanh nghe thấy.',
            pros: 'Chấm dứt ngay hành vi sai trái, khiến đối phương nhận thức được sự thiếu đứng đắn của họ.',
            cons: 'Có thể đối phương sẽ ngượng và nói câu chữa ngượng: "Làm gì căng thế!".',
            takeaway: 'Đứng lên bảo vệ quyền riêng tư một cách đàng hoàng là bản lĩnh của người trưởng thành.'
          },
          {
            id: 'D',
            text: 'Cài mật khẩu mạnh cho thiết bị và cất sổ tay vào cặp có khóa',
            analysis: 'Chủ động gia cố biện pháp an toàn vật lý và kỹ thuật số cho tài sản cá nhân.',
            pros: 'Ngăn chặn triệt để nguy cơ tái diễn trong tương lai.',
            cons: 'Không giải quyết được cảm xúc ấm ức của lần vi phạm vừa rồi.',
            takeaway: 'Phòng bệnh hơn chữa bệnh: Hãy luôn bảo vệ thông tin cá nhân cẩn thận.'
          }
        ]
      }
    ]
  },
  {
    id: 'cat-friends',
    category: 'Tình bạn & Xung đột',
    icon: '🫂',
    description: 'Xử lý rạn nứt, hiểu lầm, chọn phe và cảm giác bị cô lập giữa tập thể.',
    sets: [
      {
        id: 'scen-friend-a',
        category: 'Tình bạn & Xung đột',
        title: 'Bộ A: Bạn thân bắt đầu lạnh nhạt và đi chơi với nhóm bạn mới',
        description: 'Người bạn thân nhất của bạn gần đây thường xuyên từ chối lời rủ đi chơi của bạn, trả lời tin nhắn cộc lốc và hay xuất hiện trong ảnh của một nhóm bạn mới nổi bật hơn.',
        generalAdvice: 'Tình bạn ở tuổi teen luôn biến đổi khi mỗi người phát triển sở thích và tính cách mới. Đừng vội trách mình không đủ tốt, và cũng đừng biến mâu thuẫn thành cuộc chiến tranh lạnh.',
        options: [
          {
            id: 'A',
            text: 'Lạnh nhạt lại, unfriend và coi như không quen biết để giữ lòng tự trọng',
            analysis: 'Bạn cố tình làm lơ bạn ấy ở trường để chứng minh mình không cần bạn.',
            pros: 'Bảo vệ cái tôi nhất thời.',
            cons: 'Cắt đứt hoàn toàn cơ hội hiểu nguyên nhân, để lại sự ấm ức và tiếc nuối một tình bạn đẹp.',
            takeaway: 'Chiến tranh lạnh chỉ làm sâu thêm vết nứt mà không giải quyết được cảm xúc bên trong.'
          },
          {
            id: 'B',
            text: 'Gặp riêng và chia sẻ cảm xúc chân thành, không trách móc',
            analysis: 'Rủ bạn đi dạo: "Dạo này mình thấy tụi mình ít nói chuyện, mình rất nhớ những lúc nói chuyện cùng bạn. Có chuyện gì đang xảy ra giữa tụi mình không?".',
            pros: 'Cho cả hai cơ hội thẳng thắn, hiểu được góc nhìn của nhau mà không tạo không khí đối đầu.',
            cons: 'Cần sự dũng cảm đối diện với sự thật có thể làm bạn buồn.',
            takeaway: 'Một cuộc trò chuyện chân thành luôn là liều thuốc thử tốt nhất cho mọi mối quan hệ.'
          },
          {
            id: 'C',
            text: 'Đăng status bóng gió trách móc trên mạng xã hội',
            analysis: 'Đăng những câu châm biếm về "bạn bè phản bội", "thay lòng đổi dạ".',
            pros: 'Thu hút sự chú ý và thương hại từ người ngoài.',
            cons: 'Làm tổn hại danh dự của cả hai và biến mâu thuẫn riêng tư thành trò bàn tán của thiên hạ.',
            takeaway: 'Bóng gió trên mạng xã hội là cách tệ nhất để giải quyết mâu thuẫn tình cảm.'
          },
          {
            id: 'D',
            text: 'Mở rộng vòng tròn kết nối, tham gia các câu lạc bộ và làm quen những người bạn mới',
            analysis: 'Chấp nhận rằng khoảng cách có thể xảy ra, bạn chủ động tìm kiếm những sở thích và môi trường bạn bè mới.',
            pros: 'Tâm lý tự do, khám phá thêm nhiều khía cạnh mới của bản thân, không bị phụ thuộc cảm xúc vào một người.',
            cons: 'Cần thời gian để xây dựng những tình bạn sâu sắc mới.',
            takeaway: 'Cuộc sống là một dòng chảy: Khi một cánh cửa khép lại, hãy chủ động mở những cánh cửa mới.'
          }
        ]
      },
      {
        id: 'scen-friend-b',
        category: 'Tình bạn & Xung đột',
        title: 'Bộ B: Phát hiện bạn thân nói xấu mình sau lưng với người khác',
        description: 'Một bạn khác cho bạn xem ảnh chụp màn hình tin nhắn người bạn thân của bạn đang chê bai cách ăn mặc và hoàn cảnh gia đình của bạn với người ngoài.',
        generalAdvice: 'Phát hiện sự phản bội từ người mình tin tưởng là cú sốc lớn. Hãy bình tĩnh xác minh sự thật trước khi phản ứng và học cách buông bỏ những mối quan hệ độc hại.',
        options: [
          {
            id: 'A',
            text: 'Đến trường tát bạn hoặc giật tóc trả thù',
            analysis: 'Dùng bạo lực để giải tỏa cơn giận dữ.',
            pros: 'Hả giận trong vài giây.',
            cons: 'Bạn sẽ bị kỷ luật ghi học bạ, phụ huynh bị mời lên và câu chuyện trở nên tồi tệ hơn.',
            takeaway: 'Hạ thấp bản thân bằng hành vi thô bạo không bao giờ mang lại chiến thắng thực sự.'
          },
          {
            id: 'B',
            text: 'Gặp trực tiếp bạn, đưa bằng chứng và lắng nghe giải thích với thái độ bình thản',
            analysis: 'Hỏi thẳng: "Mình thấy những tin nhắn này. Đây có đúng là những lời bạn nói về mình không?".',
            pros: 'Xác minh chính xác nguồn tin (tránh bị người thứ ba kích động, cắt ghép) và cho đối phương cơ hội đối chất.',
            cons: 'Cần giữ được sự bình tĩnh tuyệt đối trong khi tim đang đập mạnh.',
            takeaway: 'Đối diện trực tiếp với sự thật giúp bạn có câu trả lời dứt khoát để quyết định có nên tiếp tục mối quan hệ hay không.'
          },
          {
            id: 'C',
            text: 'Im lặng rút lui, giữ khoảng cách lịch sự và không bao giờ tâm sự chuyện riêng nữa',
            analysis: 'Không làm ầm ĩ, chỉ nhẹ nhàng hạ bạn xuống thành "bạn xã giao bình thường".',
            pros: 'Tránh được tranh cãi ồn ào, bảo vệ sự bình yên trong tâm hồn của bạn.',
            cons: 'Có thể bạn ấy không nhận ra lỗi sai của mình.',
            takeaway: 'Rút lui trong im lặng và giữ khoảng cách an toàn đôi khi là cách đáp trả thanh lịch nhất.'
          },
          {
            id: 'D',
            text: 'Tìm đến một người bạn đáng tin cậy khác hoặc người thân để giãi bày cảm xúc',
            analysis: 'Không giữ nỗi đau trong lòng một mình, tìm nơi an toàn để trút bỏ ấm ức.',
            pros: 'Giảm bớt gánh nặng cảm xúc, nhận được lời khuyên khách quan và cái ôm ấm áp.',
            cons: 'Cần chọn đúng người thực sự kín đáo.',
            takeaway: 'Chia sẻ nỗi đau với người an toàn giúp vết thương mau lành hơn.'
          }
        ]
      }
    ]
  },
  {
    id: 'cat-family',
    category: 'Bố mẹ & Gia đình',
    icon: '🏡',
    description: 'Thu hẹp khoảng cách thế hệ, xử lý mâu thuẫn gia đình và giải tỏa áp lực kỳ vọng.',
    sets: [
      {
        id: 'scen-fam-a',
        category: 'Bố mẹ & Gia đình',
        title: 'Bộ A: Bố mẹ so sánh bạn với "con nhà người ta" trong bữa cơm',
        description: 'Trong bữa cơm tối, bố mẹ liên tục khen con của đồng nghiệp vừa học giỏi vừa ngoan, rồi quay sang chê trách bạn chậm chạp và vô tích sự.',
        generalAdvice: 'Nhiều bậc cha mẹ nhầm tưởng so sánh sẽ tạo ra động lực phấn đấu, mà không biết rằng nó gây tổn thương lòng tự trọng của con cái. Đối thoại bình tĩnh vào lúc thích hợp sẽ giúp bố mẹ hiểu ra.',
        options: [
          {
            id: 'A',
            text: 'Bỏ đũa xuống, đứng dậy chạy vào phòng đóng sầm cửa lại',
            analysis: 'Phản ứng tức giận bằng hành động tiêu cực.',
            pros: 'Cắt đứt ngay cuộc nói chuyện khó chịu.',
            cons: 'Bữa cơm gia đình tan vỡ, bố mẹ cho rằng bạn bất hiếu và càng mắng gay gắt hơn.',
            takeaway: 'Đóng sầm cửa chỉ tạo thêm bức tường ngăn cách giữa hai thế hệ.'
          },
          {
            id: 'B',
            text: 'Nuốt nước mắt ăn hết bữa cơm, sau đó viết một bức thư tay ngắn gửi bố mẹ',
            analysis: 'Đợi khi mọi người đã nguội giận, bạn viết: "Bố mẹ ơi, con biết bố mẹ muốn con tiến bộ. Nhưng mỗi lần bố mẹ so sánh con với người khác, con thấy rất tủi thân và tự ti. Con đang cố gắng từng ngày vì tương lai của con...".',
            pros: 'Viết thư giúp bạn diễn đạt đầy đủ cảm xúc mà không bị cắt lời hay mất bình tĩnh. Người lớn đọc thư sẽ có thời gian ngẫm nghĩ.',
            cons: 'Đòi hỏi sự kiên nhẫn và lòng can đảm bộc lộ cảm xúc.',
            takeaway: 'Thư tay là chiếc cầu nối tuyệt vời khi lời nói trực tiếp dễ bị bóp méo bởi cảm xúc nóng giận.'
          },
          {
            id: 'C',
            text: 'So sánh ngược lại: "Bố mẹ người ta giàu có, chiều chuộng con cái, sao bố mẹ không được như thế?"',
            analysis: 'Dùng sự so sánh cay nghiệt để trả đũa.',
            pros: 'Làm bố mẹ nghẹn lời trong giây lát.',
            cons: 'Gây tổn thương sâu sắc đến tình cảm cha mẹ, biến mâu thuẫn thành cuộc chiến xúc phạm lẫn nhau.',
            takeaway: 'Trả thù bằng lời nói độc hại chỉ nhân đôi nỗi đau cho cả hai phía.'
          },
          {
            id: 'D',
            text: 'Tập trung xây dựng giá trị của riêng mình và chứng minh bằng những nỗ lực cụ thể',
            analysis: 'Lắng nghe những góp ý đúng, gạt bỏ những so sánh tiêu cực và kiên trì rèn luyện bản thân.',
            pros: 'Tâm lý vững vàng, không bị phụ thuộc vào sự phán xét của người khác.',
            cons: 'Cần nội lực tinh thần mạnh mẽ.',
            takeaway: 'Bạn là phiên bản độc nhất vô nhị: Cuộc đời bạn không cần phải sao chép từ bất kỳ ai.'
          }
        ]
      }
    ]
  }
];

export const ALL_SCENARIOS_FLAT: Scenario[] = SCENARIO_CATEGORIES.flatMap(cat => cat.sets);
