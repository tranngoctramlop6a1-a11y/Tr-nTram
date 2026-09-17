import { 
  MoodOption, 
  Confession, 
  Scenario, 
  Quiz, 
  ParentTalkTopic, 
  SchoolIssueTopic, 
  StickyNote 
} from '../types';

export const MOOD_OPTIONS: MoodOption[] = [
  {
    id: 'happy',
    emoji: '😊',
    label: 'Vui',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:border-emerald-300',
    response: 'Thật tuyệt vời! Một ngày vui vẻ tiếp thêm thật nhiều năng lượng tích cực cho bạn.',
    suggestion: 'Hãy lưu giữ khoảnh khắc dễ thương này vào nhật ký, hoặc chia sẻ nụ cười ấm áp với một người bạn nhé!'
  },
  {
    id: 'fine',
    emoji: '🙂',
    label: 'Ổn',
    color: 'bg-teal-50 text-teal-700 border-teal-200 hover:border-teal-300',
    response: 'Một ngày êm ả và bình yên là một điều rất đáng trân trọng.',
    suggestion: 'Duy trì nhịp điệu thoải mái này, uống đủ nước và thưởng cho mình một bài hát yêu thích nhé.'
  },
  {
    id: 'neutral',
    emoji: '😐',
    label: 'Bình thường',
    color: 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300',
    response: 'Không sao cả, có những ngày trôi qua chậm rãi và không có gì đặc biệt.',
    suggestion: 'Đôi khi sự bình lặng chính là khoảng nghỉ ngơi cần thiết giữa những tuần học tập bận rộn.'
  },
  {
    id: 'sad',
    emoji: '😔',
    label: 'Buồn',
    color: 'bg-blue-50 text-blue-700 border-blue-200 hover:border-blue-300',
    response: 'Nỗi buồn cũng là một cảm xúc tự nhiên của con người. Bạn không cần phải luôn gượng cười.',
    suggestion: 'Hãy cho phép bản thân được nghỉ ngơi, ôm một chiếc gối ấm hoặc viết vài dòng tâm sự ra giấy.'
  },
  {
    id: 'stressed',
    emoji: '😣',
    label: 'Áp lực',
    color: 'bg-amber-50 text-amber-700 border-amber-200 hover:border-amber-300',
    response: 'Bạn không cần phải giải quyết mọi thứ ngay hôm nay. Hãy cho bản thân một chút thời gian.',
    suggestion: 'Thử buông bút xuống trong 5 phút, hít thở sâu theo nhịp và uống một ngụm nước ấm bạn nhé.'
  },
  {
    id: 'angry',
    emoji: '😡',
    label: 'Bực bội',
    color: 'bg-rose-50 text-rose-700 border-rose-200 hover:border-rose-300',
    response: 'Cơn tức giận cho thấy có điều gì đó đang làm bạn tổn thương hoặc vi phạm ranh giới của bạn.',
    suggestion: 'Đừng vội nhắn tin hay quyết định lúc này. Hãy đi dạo vài bước hoặc rửa mặt bằng nước mát trước.'
  },
  {
    id: 'anxious',
    emoji: '😰',
    label: 'Lo lắng',
    color: 'bg-purple-50 text-purple-700 border-purple-200 hover:border-purple-300',
    response: 'Tương lai chưa tới, và lúc này bạn vẫn đang an toàn ở đây. Từng bước nhỏ một thôi nhé.',
    suggestion: 'Hãy thử bài tập tiếp đất 5-4-3-2-1 tại trang "Cần giúp đỡ" để tâm trí được dịu lại.'
  },
  {
    id: 'lonely',
    emoji: '🥺',
    label: 'Cô đơn',
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:border-indigo-300',
    response: 'Có những lúc chúng ta cảm thấy lẻ loi dù ở giữa đám đông. Nhưng bạn không cô độc một mình.',
    suggestion: 'Ở góc tâm sự và góc bạn không cô đơn, có rất nhiều bạn bè đồng trang lứa đang lắng nghe bạn.'
  }
];

export const INITIAL_CONFESSIONS: Confession[] = [
  {
    id: 'conf-1',
    title: 'Dạo này mình cảm thấy bố mẹ chỉ quan tâm đến điểm số',
    content: 'Dạo này mình cảm thấy bố mẹ chỉ quan tâm đến điểm số. Mỗi khi về nhà, câu đầu tiên mẹ hỏi không phải là "Hôm nay con có mệt không?" mà luôn là "Hôm nay có kiểm tra không, được mấy điểm?". Mình muốn nói với bố mẹ rằng mình đã rất cố gắng rồi, nhưng mình sợ bố mẹ sẽ bảo mình bao biện hoặc lười biếng. Mình cảm thấy ngột ngạt trong chính ngôi nhà của mình...',
    category: 'Gia đình',
    author: 'Mây Nhỏ Lạc Đường #312',
    avatarSeed: 'cloud',
    isAnonymous: true,
    timestamp: '2 giờ trước',
    empathyCount: 48,
    meTooCount: 65,
    comments: [
      {
        id: 'c-1',
        author: 'Trà Sữa Ấm Áp #104',
        avatarSeed: 'tea',
        content: 'Ôi mình cũng từng y hệt bạn năm lớp 10 luôn! Sau đó mình thử viết một bức thư tay để trên bàn làm việc của mẹ, nói thật lòng là con cũng muốn đạt điểm cao nhưng con thấy áp lực quá. Bố mẹ đã thay đổi cách nói chuyện một chút đấy. Bạn thử xem sao nha!',
        timestamp: '1 giờ trước',
        likes: 19
      },
      {
        id: 'c-2',
        author: 'Gió Mùa Thu #892',
        avatarSeed: 'leaf',
        content: 'Gửi bạn một cái ôm thật chặt 🫂 Bạn đã nỗ lực hết sức rồi, điểm số không định nghĩa giá trị con người bạn đâu.',
        timestamp: '45 phút trước',
        likes: 12
      }
    ]
  },
  {
    id: 'conf-2',
    title: 'Nhóm bạn thân 3 năm bỗng dưng lập group riêng không có mình',
    content: 'Hôm nay mình vô tình thấy trên màn hình điện thoại của bạn cùng bàn có một nhóm chat gồm tất cả các bạn trong nhóm thân, trừ mình ra. Cảm giác lúc đó như bị rơi xuống hố sâu vậy. Mình không biết mình đã làm sai điều gì, có nên hỏi thẳng họ hay giả vờ như không biết?',
    category: 'Tình bạn',
    author: 'Cậu Bạn Nghe Nhạc #741',
    avatarSeed: 'headphones',
    isAnonymous: true,
    timestamp: '5 giờ trước',
    empathyCount: 82,
    meTooCount: 94,
    comments: [
      {
        id: 'c-3',
        author: 'Hạt Mầm Xanh #220',
        avatarSeed: 'sprout',
        content: 'Mình hiểu cảm giác này, đau lòng kinh khủng. Nhưng nhớ là nếu họ chọn cách gạt bạn ra thay vì nói chuyện thẳng thắn thì đó là vấn đề của họ, không phải lỗi của bạn. Bạn xứng đáng có những người bạn trân trọng bạn thật lòng.',
        timestamp: '3 giờ trước',
        likes: 27
      }
    ]
  },
  {
    id: 'conf-3',
    title: 'Áp lực khi nhìn bạn bè trên Facebook ai cũng giỏi và đẹp',
    content: 'Mỗi lần lướt story thấy bạn thì đạt giải quốc gia, bạn thì đi du lịch, chụp ảnh xinh xắn, nhận học bổng... mình lại thấy bản thân thật tầm thường và vô dụng. Dù biết mạng xã hội chỉ khoe những gì đẹp nhất nhưng mình vẫn không ngăn được cảm giác tự ti.',
    category: 'Bản thân',
    author: 'Ngôi Sao Nhỏ #518',
    avatarSeed: 'star',
    isAnonymous: true,
    timestamp: 'Hôm qua',
    empathyCount: 115,
    meTooCount: 140,
    comments: [
      {
        id: 'c-4',
        author: 'Mèo Lười Sưởi Nắng #402',
        avatarSeed: 'cat',
        content: 'Mỗi bông hoa nở vào một mùa khác nhau mà bạn ơi! Bạn đang so sánh hậu trường đầy mệt mỏi của mình với thước phim đẹp nhất đã qua chỉnh sửa của người khác thôi. Tắt mạng xã hội 2 ngày và đi ăn món bạn thích xem, sẽ thấy nhẹ lòng hơn nhiều.',
        timestamp: '18 giờ trước',
        likes: 31
      }
    ]
  },
  {
    id: 'conf-4',
    title: 'Sợ thầy cô gọi lên bảng kiểm tra miệng',
    content: 'Cứ đến tiết Toán là tim mình đập thình thịch, tay chân lạnh ngắt dù tối qua mình đã học bài rồi. Mình rất sợ bị gọi lên bảng rồi đứng đơ ra, cả lớp sẽ cười hoặc thầy cô sẽ lắc đầu thất vọng. Có ai bị hội chứng sợ nói trước lớp như mình không?',
    category: 'Học tập',
    author: 'Bút Chì Gỗ #661',
    avatarSeed: 'pencil',
    isAnonymous: true,
    timestamp: '1 ngày trước',
    empathyCount: 76,
    meTooCount: 103,
    comments: [
      {
        id: 'c-5',
        author: 'Trang Sách Cũ #119',
        avatarSeed: 'book',
        content: 'Y chang mình luôn á, có lần mình còn run đến mức đánh rơi phấn. Sau đó mình tập nhìn vào bức tường phía sau lớp thay vì nhìn vào mắt thầy cô, và hít 3 hơi thở chậm trước khi đứng lên. Đỡ run hơn hẳn đó.',
        timestamp: '20 giờ trước',
        likes: 14
      }
    ]
  },
  {
    id: 'conf-5',
    title: 'Bị bạn bè body-shaming về cân nặng và chiều cao',
    content: 'Các bạn nam trong lớp hay gọi mình bằng biệt danh gắn liền với ngoại hình. Mỗi khi mình bước vào lớp lại có tiếng xì xầm trêu chọc. Họ nghĩ đó chỉ là đùa vui, nhưng với mình mỗi lời nói đó như một vết cắt. Mình không biết làm sao để họ dừng lại mà không bị bảo là "làm quá lên".',
    category: 'Trường học',
    author: 'Cánh Hoa Rơi #804',
    avatarSeed: 'flower',
    isAnonymous: true,
    timestamp: '2 ngày trước',
    empathyCount: 134,
    meTooCount: 78,
    comments: [
      {
        id: 'c-6',
        author: 'Chiếc Lá Ấm #335',
        avatarSeed: 'leaf',
        content: 'Đùa vui chỉ vui khi cả hai cùng cười. Nếu bạn cảm thấy tổn thương thì đó là quấy rối rồi, bạn hoàn toàn có quyền bảo vệ mình! Bạn hãy thử nhìn thẳng vào bạn đó và nói với giọng bình tĩnh nghiêm túc: "Mình không thấy chuyện này buồn cười chút nào cả, xin bạn dừng lại". Nếu họ tiếp tục, đừng ngại báo cô giáo chủ nhiệm nhé.',
        timestamp: '1 ngày trước',
        likes: 42
      }
    ]
  }
];

export const SCENARIOS: Scenario[] = [
  {
    id: 'scen-1',
    category: 'Áp lực học tập',
    title: 'Bạn bị điểm thấp và sợ bố mẹ thất vọng. Bạn sẽ làm gì?',
    description: 'Kỳ thi vừa qua kết quả môn sở đoản của bạn bị điểm dưới trung bình. Bố mẹ từng đặt rất nhiều kỳ vọng vào kỳ thi này. Bạn cầm bài kiểm tra về nhà với cảm giác lo sợ tột cùng.',
    generalAdvice: 'Sự thất vọng của bố mẹ thường xuất phát từ sự lo lắng cho tương lai của bạn, chứ không đồng nghĩa với việc họ hết yêu thương bạn. Đối diện với sự thật một cách chủ động và có trách nhiệm luôn mang lại kết quả nhẹ nhõm nhất về lâu dài.',
    options: [
      {
        id: 'A',
        text: 'Giấu bài kiểm tra và không nói cho bố mẹ biết',
        analysis: 'Bạn cất bài kiểm tra vào tận đáy cặp hoặc nói dối là cô chưa trả bài.',
        pros: 'Tránh được cơn giận hoặc sự khiển trách ngay trong hôm nay. Tạm thời giữ được không khí yên ổn.',
        cons: 'Bạn sẽ phải sống trong cảm giác lo sợ bị phát hiện bất cứ lúc nào (khi họp phụ huynh hoặc xem sổ liên lạc điện tử). Sự dối trá khi vỡ lở sẽ làm mất đi niềm tin của bố mẹ.',
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
    id: 'scen-2',
    category: 'Tình bạn',
    title: 'Bạn thân bắt đầu lạnh nhạt và đi chơi với nhóm bạn khác',
    description: 'Người bạn thân nhất của bạn gần đây thường xuyên từ chối lời rủ đi chơi của bạn, trả lời tin nhắn cộc lốc và hay xuất hiện trong ảnh của một nhóm bạn mới nổi bật hơn.',
    generalAdvice: 'Tình bạn ở tuổi teen luôn biến đổi khi mỗi người phát triển sở thích và tính cách mới. Đừng vội trách mình không đủ tốt, và cũng đừng biến mâu thuẫn thành cuộc chiến tranh lạnh.',
    options: [
      {
        id: 'A',
        text: 'Lạnh nhạt lại, coi như không quen biết để giữ lòng tự trọng',
        analysis: 'Bạn unfriend, không chào hỏi và cố tình làm lơ bạn ấy ở trường.',
        pros: 'Cảm thấy mình không bị "kèo dưới", bảo vệ cái tôi nhất thời.',
        cons: 'Cắt đứt hoàn toàn cơ hội hiểu nguyên nhân, để lại sự ấm ức và tiếc nuối một tình bạn đẹp.',
        takeaway: 'Chiến tranh lạnh chỉ làm sâu thêm vết nứt mà không giải quyết được cảm xúc bên trong.'
      },
      {
        id: 'B',
        text: 'Gặp riêng và chia sẻ cảm xúc chân thành, không trách móc',
        analysis: 'Rủ bạn đi dạo và nhẹ nhàng: "Dạo này mình thấy tụi mình ít nói chuyện, mình rất nhớ những lúc nói chuyện cùng bạn. Có chuyện gì đang xảy ra giữa tụi mình không?"',
        pros: 'Cho cả hai cơ hội thẳng thắn, hiểu được góc nhìn của nhau mà không tạo không khí đối đầu.',
        cons: 'Có thể bạn sẽ phải nghe câu trả lời rằng bạn ấy thật sự muốn mở rộng nhóm bạn mới.',
        takeaway: 'Chân thành giúp bạn tìm được câu trả lời rõ ràng để hoặc là hàn gắn, hoặc là thanh thản bước tiếp.'
      },
      {
        id: 'C',
        text: 'Cố gắng thay đổi bản thân để giống nhóm bạn mới của bạn ấy',
        analysis: 'Bắt chước cách ăn mặc, cách nói chuyện của nhóm kia để được tham gia cùng.',
        pros: 'Có cơ hội hòa nhập ngắn hạn.',
        cons: 'Đánh mất cá tính thật của mình, luôn phải gồng mình để làm vừa lòng người khác.',
        takeaway: 'Một tình bạn chân chính không bao giờ đòi hỏi bạn phải biến thành một người khác.'
      },
      {
        id: 'D',
        text: 'Chấp nhận mở rộng vòng tròn kết nối và tìm kiếm những người bạn mới',
        analysis: 'Cho bạn ấy không gian riêng, đồng thời tham gia các câu lạc bộ, lớp học khác để tìm những người bạn cùng tần số.',
        pros: 'Giúp bạn bớt phụ thuộc cảm xúc vào một người, mở rộng thế giới quan và tăng sự tự tin.',
        cons: 'Cần thời gian và dũng khí để bước ra khỏi vùng an toàn.',
        takeaway: 'Mỗi người bước qua đời ta đều để lại một bài học. Mở rộng lòng mình sẽ giúp bạn tìm thấy những người trân trọng bạn.'
      }
    ]
  },
  {
    id: 'scen-3',
    category: 'Trường học',
    title: 'Bị bạn bè lập nhóm chat chế giễu hoặc lan truyền tin đồn thất thiệt',
    description: 'Bạn phát hiện có một nhóm chat kín đang chia sẻ ảnh chụp lén hoặc bịa đặt chuyện tình cảm không đúng về bạn trong lớp.',
    generalAdvice: 'Bắt nạt qua mạng (cyberbullying) để lại tổn thương rất lớn nhưng bạn tuyệt đối KHÔNG ĐƯỢC im lặng chịu đựng một mình. Bạn không làm gì sai để phải xấu hổ.',
    options: [
      {
        id: 'A',
        text: 'Lên mạng chửi lại thật gắt để dằn mặt nhóm bạn kia',
        analysis: 'Đăng đàn đáp trả bằng những lời lẽ gay gắt tương tự.',
        pros: 'Xả được cơn giận tức thời.',
        cons: 'Biến bạn thành một bên trong cuộc khẩu chiến, nhóm kia có thêm cớ để công kích và nhà trường sẽ phạt cả hai bên.',
        takeaway: 'Lấy bạo lực đáp trả bạo lực chỉ làm đám cháy bùng phát dữ dội hơn.'
      },
      {
        id: 'B',
        text: 'Chụp lại bằng chứng tin nhắn và báo ngay với giáo viên/bố mẹ',
        analysis: 'Lưu ảnh màn hình có ngày giờ, tên tài khoản, rồi đưa cho người lớn có thẩm quyền giải quyết.',
        pros: 'Có bằng chứng xác thực, người bắt nạt không thể chối cãi, bảo vệ sự an toàn và danh dự cho bạn.',
        cons: 'Bạn có thể sợ bị nhóm kia gán mác "mách lẻo".',
        takeaway: 'Tìm kiếm sự can thiệp của người lớn khi bị quấy rối là hành động thông minh và dũng cảm, không phải mách lẻo.'
      },
      {
        id: 'C',
        text: 'Im lặng xóa mạng xã hội và vờ như không quan tâm',
        analysis: 'Rời xa mạng xã hội, nhẫn nhịn mong tin đồn tự chìm xuống.',
        pros: 'Bảo vệ mắt và tâm trí khỏi những nội dung độc hại trước mắt.',
        cons: 'Kẻ bắt nạt nghĩ bạn dễ bắt nạt và có thể tiếp tục leo thang hành vi ở ngoài đời.',
        takeaway: 'Tạm ngắt kết nối là tốt để bình tâm, nhưng vẫn cần can thiệp để hành vi bắt nạt chấm dứt.'
      },
      {
        id: 'D',
        text: 'Nhờ hội bạn thân hoặc ban cán sự lớp lên tiếng bảo vệ',
        analysis: 'Kêu gọi những người bạn hiểu sự thật hỗ trợ đính chính và làm chỗ dựa tinh thần.',
        pros: 'Không cảm thấy cô độc, tạo áp lực dư luận tích cực phản đối hành vi xấu.',
        cons: 'Bạn bè có thể ngần ngại nếu kẻ bắt nạt là nhân vật có ảnh hưởng tiêu cực trong trường.',
        takeaway: 'Sự đoàn kết của những người tử tế là liều thuốc mạnh mẽ chống lại bắt nạt.'
      }
    ]
  },
  {
    id: 'scen-4',
    category: 'Mâu thuẫn với bố mẹ',
    title: 'Bố mẹ liên tục so sánh bạn với "con nhà người ta"',
    description: 'Mỗi bữa cơm, bố mẹ đều nhắc đến con của cô hàng xóm: vừa học giỏi, vừa ngoan ngoãn, vừa biết phụ giúp gia đình, rồi nhìn bạn thở dài.',
    generalAdvice: 'Bố mẹ Việt Nam thường dùng sự so sánh như một cách vụng về để khích lệ, mà không nhận ra nó gây tổn thương lòng tự trọng của con cái thế nào.',
    options: [
      {
        id: 'A',
        text: 'Bực tức hét lên và đập cửa bỏ vào phòng',
        analysis: 'Phản ứng dữ dội: "Sao bố mẹ không nhận bạn đó làm con luôn đi!"',
        pros: 'Bộc lộ ngay được nỗi uất ức đang dồn nén.',
        cons: 'Bố mẹ sẽ chỉ nhìn thấy thái độ hỗn láo, cuộc trò chuyện biến thành trận cãi vã lớn.',
        takeaway: 'Cơn giận che mờ thông điệp thật sự bạn muốn truyền tải.'
      },
      {
        id: 'B',
        text: 'Nuốt giận vào trong và ngấm ngầm ghét bạn "con nhà người ta"',
        analysis: 'Không nói gì nhưng thấy cay đắng và xa lánh cả người bạn vô tội kia.',
        pros: 'Tránh xung đột tức thì trên bàn ăn.',
        cons: 'Tích tụ độc tố tâm lý, sinh ra lòng đố kỵ và giảm sút niềm tin vào bản thân.',
        takeaway: 'Ghen tỵ với người khác chỉ làm lãng phí năng lượng phát triển của chính bạn.'
      },
      {
        id: 'C',
        text: 'Bình tĩnh nói về cảm xúc của mình vào một lúc cả nhà vui vẻ',
        analysis: '"Bố mẹ ơi, khi bố mẹ so sánh con với bạn X, con cảm thấy những nỗ lực của con không được nhìn nhận và con rất buồn. Con muốn cố gắng theo phiên bản tốt hơn của chính con."',
        pros: 'Giúp bố mẹ nhận ra tác động tiêu cực của thói quen so sánh mà không kích hoạt sự phòng thủ.',
        cons: 'Bố mẹ có thể cần thời gian nhiều lần mới thay đổi được thói quen cũ.',
        takeaway: 'Giao tiếp thấu cảm từ góc nhìn cảm xúc của con cái có sức mạnh lay động người lớn.'
      },
      {
        id: 'D',
        text: 'Tập trung phát huy thế mạnh riêng biệt của bản thân',
        analysis: 'Nhận thức rõ bạn giỏi ở lĩnh vực gì (nghệ thuật, thể thao, tính cách chu đáo...) và phát triển nó.',
        pros: 'Xây dựng sự tự tin từ gốc rễ, không phụ thuộc vào thước đo điểm số đơn thuần.',
        cons: 'Cần sự kiên trì và vững vàng trước những lời nhận xét bên ngoài.',
        takeaway: 'Bạn sinh ra là một bản thể độc nhất vô nhị, không phải bản sao của bất kỳ ai.'
      }
    ]
  },
  {
    id: 'scen-5',
    category: 'Không biết nói "không"',
    title: 'Bạn bè nhờ cho chép bài kiểm tra hoặc nhờ vả việc quá sức',
    description: 'Một người bạn thân trong lớp chưa học bài và nài nỉ bạn cho nhìn bài thi, hoặc nhờ bạn gánh toàn bộ bài thuyết trình nhóm.',
    generalAdvice: 'Học cách từ chối tử tế và kiên quyết là kỹ năng sống quan trọng nhất để bảo vệ ranh giới cá nhân và xây dựng sự tôn trọng lẫn nhau.',
    options: [
      {
        id: 'A',
        text: 'Đồng ý cho chép bài vì sợ mất bạn',
        analysis: 'Để bạn nhìn bài thi dù biết nếu giám thị bắt được cả hai sẽ bị 0 điểm.',
        pros: 'Giữ được sự hòa khí tạm thời với người bạn đó.',
        cons: 'Chịu rủi ro bị kỷ luật học tập, và người bạn kia sẽ tiếp tục ỷ lại vào bạn những lần sau.',
        takeaway: 'Làm hài lòng người khác bằng sự vi phạm quy tắc là một tình bạn độc hại.'
      },
      {
        id: 'B',
        text: 'Từ chối thẳng thừng, nói lớn tiếng giữa lớp',
        analysis: 'Nói gay gắt: "Không bao giờ, ai mượn lười học!"',
        pros: 'Rõ ràng, không ai dám nhờ vả nữa.',
        cons: 'Làm bẽ mặt bạn bè trước đám đông, dễ biến bạn thành kẻ thù.',
        takeaway: 'Ranh giới cần sự kiên định, không cần sự thô lỗ.'
      },
      {
        id: 'C',
        text: 'Từ chối việc cho chép bài trong giờ, nhưng đề nghị hỗ trợ kèm bạn trước kỳ thi',
        analysis: '"Trong giờ thi mình không thể cho chép được vì rất nguy hiểm cho cả hai. Nhưng chiều nay sau giờ học mình có thể tóm tắt lại công thức giúp bạn."',
        pros: 'Vừa giữ vững nguyên tắc đạo đức, vừa thể hiện sự quan tâm chân thành tới người bạn.',
        cons: 'Nếu bạn kia chỉ muốn lợi dụng, họ có thể vẫn sẽ tỏ thái độ giận dỗi.',
        takeaway: 'Cách này giúp bạn phân loại ai là bạn chân chính và ai chỉ đang muốn lợi dụng bạn.'
      },
      {
        id: 'D',
        text: 'Lấy lý do khách quan (thầy cô ngồi ngay bàn đầu, giám thị rất gắt)',
        analysis: 'Khéo léo từ chối bằng hoàn cảnh bên ngoài.',
        pros: 'Tránh xung đột trực tiếp mà vẫn bảo vệ được bài thi của mình.',
        cons: 'Chưa thực sự rèn luyện được dũng khí nói "Không" từ chính bản thân mình.',
        takeaway: 'Là bước đệm an toàn nếu bạn chưa đủ tự tin từ chối trực diện.'
      }
    ]
  },
  {
    id: 'scen-6',
    category: 'Áp lực ngoại hình',
    title: 'Tự ti vì mặt nhiều mụn và cơ thể thay đổi tuổi dậy thì',
    description: 'Bước vào tuổi dậy thì, bạn bị nổi mụn nhiều, vỡ giọng hoặc vóc dáng thay đổi khiến bạn luôn muốn cúi gằm mặt khi đi trên sân trường và ghét nhìn vào gương.',
    generalAdvice: 'Cơ thể tuổi dậy thì đang trải qua những cơn bão nội tiết tố cực lớn. Hơn 85% thanh thiếu niên đều trải qua giai đoạn này, chỉ là mức độ khác nhau.',
    options: [
      {
        id: 'A',
        text: 'Tự ý mua các loại kem trộn, thuốc trị mụn trôi nổi trên mạng',
        analysis: 'Tin theo các quảng cáo hết mụn sau 3 ngày trên TikTok.',
        pros: 'Cảm giác hy vọng giải quyết vấn đề cấp tốc.',
        cons: 'Nguy cơ phá hủy hàng rào bảo vệ da, viêm da nghiêm trọng và tốn kém.',
        takeaway: 'Nôn nóng với sức khỏe thể chất luôn dẫn đến những hậu quả đáng tiếc.'
      },
      {
        id: 'B',
        text: 'Thu mình lại, đeo khẩu trang 24/7 và không dám giao tiếp',
        analysis: 'Tránh né mọi ánh nhìn của mọi người xung quanh.',
        pros: 'Che chắn được khuyết điểm trước mắt.',
        cons: 'Gia tăng cảm giác lo âu xã hội, bí da làm mụn nặng hơn và bỏ lỡ các kỷ niệm thanh xuân.',
        takeaway: 'Khẩu trang che được khuôn mặt nhưng lại vô tình giam cầm tâm hồn bạn.'
      },
      {
        id: 'C',
        text: 'Tâm sự với mẹ hoặc người lớn để đi khám bác sĩ da liễu chuẩn y khoa',
        analysis: 'Tìm kiếm sự tư vấn y tế đúng đắn kết hợp chế độ ăn ngủ điều độ.',
        pros: 'Điều trị an toàn, dứt điểm từ nguyên nhân khoa học, có sự đồng hành của gia đình.',
        cons: 'Cần thời gian 3-6 tháng kiên trì mới thấy kết quả rõ rệt.',
        takeaway: 'Chăm sóc bản thân một cách khoa học và kiên nhẫn là cách yêu thương cơ thể tốt nhất.'
      },
      {
        id: 'D',
        text: 'Thực hành chấp nhận: Tập trung vào nụ cười, sự tử tế và phong thái tự tin',
        analysis: 'Nhận thức rằng người khác chú ý đến sự vui vẻ, hòa đồng của bạn nhiều hơn là vài nốt mụn.',
        pros: 'Xây dựng sức hút từ nội hàm và năng lượng tích cực.',
        cons: 'Cần luyện tập tâm lý hàng ngày trước gương.',
        takeaway: 'Nhan sắc thay đổi theo thời gian, nhưng nét duyên dáng và sự tử tế sẽ luôn tỏa sáng.'
      }
    ]
  },
  {
    id: 'scen-7',
    category: 'FOMO & Mạng xã hội',
    title: 'Hội chứng sợ bỏ lỡ (FOMO) khi cuối tuần ở nhà một mình',
    description: 'Tối thứ Bảy bạn ngồi làm bài tập ở nhà và lướt story thấy các bạn cùng lớp tụ tập đi trà sữa, check-in rôm rả mà không rủ bạn. Bạn thấy cồn cào và bất an.',
    generalAdvice: 'Mạng xã hội tạo ra ảo giác rằng mọi người đang có cuộc sống hoàn hảo hơn bạn. Nhưng thực tế một buổi tối ở nhà yên bình cũng có giá trị phục hồi tuyệt vời.',
    options: [
      {
        id: 'A',
        text: 'Tiếp tục lướt từng story, phóng to từng bức ảnh để xem họ nói gì',
        analysis: 'Dành cả buổi tối theo dõi mọi động thái của nhóm bạn.',
        pros: 'Biết được họ đang làm gì.',
        cons: 'Tự tra tấn cảm xúc của bản thân, lãng phí thời gian và làm tâm trạng tồi tệ thêm.',
        takeaway: 'Đừng biến mình thành khán giả trong vở kịch của người khác trong khi cuộc đời mình bị bỏ quên.'
      },
      {
        id: 'B',
        text: 'Đăng story tâm trạng bóng gió để mong ai đó hỏi thăm',
        analysis: 'Đăng ảnh nền đen kèm bài hát buồn hoặc câu nói ẩn ý.',
        pros: 'Hy vọng nhận được sự chú ý tức thời.',
        cons: 'Dễ tạo ấn tượng tiêu cực, và nếu không ai hỏi thăm bạn sẽ càng thấy hụt hẫng hơn.',
        takeaway: 'Trông chờ sự an ủi từ những phản ứng vu vơ trên mạng xã hội hiếm khi mang lại sự xoa dịu thật lòng.'
      },
      {
        id: 'C',
        text: 'Để điện thoại sang phòng khác, bật một bộ phim hoặc làm một việc bạn thích',
        analysis: 'Thực hành "JOMO" (Joy of Missing Out - Niềm vui khi không bỏ lỡ chính mình).',
        pros: 'Tận hưởng trọn vẹn khoảng thời gian cho riêng mình, thư giãn sâu và ngủ ngon.',
        cons: 'Phải vượt qua cảm giác bứt rứt muốn mở điện thoại trong 15 phút đầu.',
        takeaway: 'Học cách làm bạn với chính mình là một trong những món quà lớn nhất của tuổi trưởng thành.'
      },
      {
        id: 'D',
        text: 'Chủ động nhắn tin rủ một người bạn khác trò chuyện hoặc xem phim online',
        analysis: 'Tìm kiếm kết nối 1-1 chất lượng thay vì quan sát đám đông.',
        pros: 'Tạo nên một kết nối sâu sắc, chân thực mà không cần tiệc tùng ồn ào.',
        cons: 'Đôi khi bạn kia cũng có thể bận.',
        takeaway: 'Một người bạn thật sự cùng chia sẻ sâu sắc quý hơn mười cuộc gặp gỡ xã giao ồn ào.'
      }
    ]
  },
  {
    id: 'scen-8',
    category: 'Cảm thấy mình không đủ tốt',
    title: 'Cảm giác mình vụng về, làm gì cũng hỏng và là gánh nặng',
    description: 'Sau khi làm bài thi không như ý và lỡ tay làm vỡ chiếc bình hoa của mẹ, bạn ngồi thu lu trong góc phòng và nghĩ: "Mình thật vô dụng, không làm được trò trống gì".',
    generalAdvice: 'Những suy nghĩ tiêu cực cực đoan (Tất cả hoặc Không có gì) thường xuất hiện khi não bộ bạn đang kiệt sức. Sai lầm là một phần tất yếu của quá trình học hỏi.',
    options: [
      {
        id: 'A',
        text: 'Tự mắng chửi và trừng phạt bản thân',
        analysis: 'Nghĩ rằng mình đáng bị như vậy và nhốt mình trong phòng nhịn ăn.',
        pros: 'Không có lợi ích nào cả.',
        cons: 'Tàn phá sức khỏe thể chất lẫn tinh thần, đào sâu thêm chiếc hố tự ti.',
        takeaway: 'Bạn sẽ không bao giờ nói những lời cay độc đó với một người bạn thân, vậy tại sao lại đối xử như vậy với chính mình?'
      },
      {
        id: 'B',
        text: 'Tách biệt hành động khỏi giá trị con người: "Mình phạm sai lầm, nhưng mình không phải là kẻ vô dụng"',
        analysis: 'Nói với bản thân: "Bình hoa vỡ là một tai nạn. Mình có thể dọn sạch nó và xin lỗi mẹ. Nó không có nghĩa là cả cuộc đời mình hỏng bét."',
        pros: 'Giữ được sự sáng suốt, hạ bớt mức độ hoảng sợ và bắt tay vào sửa chữa sai lầm.',
        cons: 'Cần sự thực hành chánh niệm và lòng trắc ẩn với bản thân.',
        takeaway: 'Sai lầm là sự kiện, không phải danh tính của bạn.'
      },
      {
        id: 'C',
        text: 'Chủ động dọn dẹp và nói lời xin lỗi chân thành với mẹ',
        analysis: 'Cầm chổi dọn sạch mảnh vỡ, mua một bông hoa nhỏ cắm vào cốc nước thay thế kèm lời xin lỗi.',
        pros: 'Chuyển hóa năng lượng tiêu cực thành hành động thiết thực, mẹ sẽ cảm thông ngay.',
        cons: 'Phải đối diện với sự ngượng ngùng lúc mở lời.',
        takeaway: 'Hành động cụ thể luôn đánh tan nỗi sợ mơ hồ trong tâm trí.'
      },
      {
        id: 'D',
        text: 'Viết ra 3 điều nhỏ bạn đã làm tốt trong ngày hôm nay',
        analysis: 'Ghi lại: "Hôm nay mình đã dắt bà cụ qua đường, tưới cây cho mẹ, và hoàn thành bài tập Sinh học".',
        pros: 'Giúp não bộ cân bằng lại góc nhìn thiên vị tiêu cực.',
        cons: 'Lúc đang buồn rất khó để nghĩ ra điều tích cực, cần cố gắng một chút.',
        takeaway: 'Não bộ có xu hướng phóng đại lỗi lầm; việc ghi nhận điều tích cực giúp bạn nhìn thấy bức tranh toàn cảnh.'
      }
    ]
  },
  {
    id: 'scen-9',
    category: 'Tình cảm',
    title: 'Thích thầm (crush) một người nhưng sợ bị từ chối hoặc bạn bè trêu chọc',
    description: 'Bạn có tình cảm với một bạn cùng khóa đã lâu. Mỗi ngày đến trường được nhìn thấy bạn ấy là niềm vui lớn, nhưng bạn luôn bối rối không biết nên giữ trong lòng hay thổ lộ.',
    generalAdvice: 'Những rung động tuổi học trò là cảm xúc trong sáng và đẹp đẽ nhất. Dù kết quả thế nào, việc bạn có khả năng rung động và yêu mến một người đã là điều kỳ diệu.',
    options: [
      {
        id: 'A',
        text: 'Tỏ tình hoành tráng giữa sân trường trước sự chứng kiến của mọi người',
        analysis: 'Nhờ bạn bè vây quanh, tặng hoa và bật nhạc lớn.',
        pros: 'Rất kịch tính và dũng cảm.',
        cons: 'Tạo áp lực tâm lý khủng khiếp cho đối phương, nếu bị từ chối sẽ trở thành chủ đề bàn tán của cả trường.',
        takeaway: 'Tình cảm cần sự tinh tế và tôn trọng không gian riêng của người khác hơn là một màn trình diễn.'
      },
      {
        id: 'B',
        text: 'Giữ kín hoàn toàn trong nhật ký suốt những năm cấp 3',
        analysis: 'Không làm gì cả, chỉ âm thầm quan sát từ xa.',
        pros: 'An toàn 100%, không bao giờ sợ bị từ chối hay ngượng ngùng.',
        cons: 'Có thể để lại sự tiếc nuối "giá như ngày ấy..." sau khi tốt nghiệp.',
        takeaway: 'Thanh thản nhưng đôi khi sự im lặng đồng nghĩa với việc bạn tự tước đi cơ hội của chính mình.'
      },
      {
        id: 'C',
        text: 'Bắt đầu từ những tương tác tự nhiên: Hỏi bài, chào hỏi thân thiện, tìm điểm chung',
        analysis: 'Làm bạn trước, rủ cùng tham gia hoạt động ngoại khóa, nói chuyện về gu âm nhạc, sở thích.',
        pros: 'Hiểu rõ con người thật của crush (không chỉ là hình tượng bạn tự vẽ ra), xây dựng tình cảm tự nhiên và bền vững.',
        cons: 'Cần thời gian và kiên nhẫn.',
        takeaway: 'Nền tảng của mọi mối quan hệ đẹp đều bắt đầu từ một tình bạn chân thành và thấu hiểu.'
      },
      {
        id: 'D',
        text: 'Nhờ bạn thân đi "thăm dò" cảm nghĩ của crush về bạn',
        analysis: 'Gửi "đặc phái viên" đi hỏi khéo xem bạn ấy đã có người yêu chưa và nghĩ gì về bạn.',
        pros: 'Biết trước tín hiệu đèn xanh hay đèn đỏ trước khi tiến tới.',
        cons: 'Dễ bị lộ thông tin nếu người bạn thân không đủ kín miệng.',
        takeaway: 'Cách này khá phổ biến và vui, nhưng hãy chọn người bạn thực sự đáng tin cậy nhé.'
      }
    ]
  },
  {
    id: 'scen-10',
    category: 'Mâu thuẫn với bố mẹ',
    title: 'Bố mẹ muốn bạn thi ban Tự nhiên/Kinh tế, nhưng đam mê của bạn là Nghệ thuật/Xã hội',
    description: 'Năm nay là năm chọn ban và định hướng nghề nghiệp. Bố mẹ kiên quyết bắt bạn thi khối A để làm kỹ sư hay kinh tế cho "ổn định", trong khi bạn chỉ say mê vẽ hoặc viết lách.',
    generalAdvice: 'Sự xung đột này là bài toán muôn thuở giữa hai thế hệ: Bố mẹ ưu tiên "sự an toàn tài chính", còn teen ưu tiên "sự thỏa mãn đam mê cá nhân".',
    options: [
      {
        id: 'A',
        text: 'Thuận theo ý bố mẹ hoàn toàn dù trong lòng vô cùng đau khổ',
        analysis: 'Cố gắng học ngành mình ghét chỉ để bố mẹ vui lòng.',
        pros: 'Bố mẹ hài lòng, không khí gia đình êm ấm trước mắt.',
        cons: 'Dễ chán nản, kiệt sức khi lên đại học, có nguy cơ bỏ dở giữa chừng sau nhiều năm lãng phí.',
        takeaway: 'Cuộc đời là của bạn, sống theo giấc mơ của người khác là cái giá rất đắt.'
      },
      {
        id: 'B',
        text: 'Cãi nhau quyết liệt và tuyên bố bỏ học nếu không được theo ý mình',
        analysis: 'Chiến tranh nóng: Bỏ ăn, không học bài để gây sức ép.',
        pros: 'Thể hiện thái độ quyết liệt với đam mê.',
        cons: 'Đẩy bố mẹ vào thế đối đầu, khiến bố mẹ càng tin rằng bạn còn quá bốc đồng và chưa đủ chín chắn để tự quyết định tương lai.',
        takeaway: 'Muốn người lớn trao quyền tự quyết, bạn phải chứng minh bằng hành động chín chắn, không phải bằng sự hờn dỗi trẻ con.'
      },
      {
        id: 'C',
        text: 'Lập một kế hoạch nghề nghiệp nghiêm túc và thuyết trình với bố mẹ',
        analysis: 'Nghiên cứu thị trường việc làm của ngành bạn thích, các trường đào tạo, lộ trình phát triển và các dự án/sản phẩm thực tế bạn đã làm được.',
        pros: 'Chứng minh đam mê của bạn không phải là sở thích nhất thời mà là một định hướng có cơ sở thực tế.',
        cons: 'Đòi hỏi bạn phải bỏ nhiều công sức tìm hiểu nghiêm túc.',
        takeaway: 'Sự chuẩn bị kỹ lưỡng và tinh thần trách nhiệm là vũ khí thuyết phục bố mẹ mạnh mẽ nhất.'
      },
      {
        id: 'D',
        text: 'Thương lượng phương án dung hòa: Ngành chính an toàn + Theo đuổi đam mê song song',
        analysis: 'Học một chuyên ngành ứng dụng (ví dụ Thiết kế đồ họa ứng dụng, Truyền thông đa phương tiện) kết hợp giữa kinh tế và nghệ thuật.',
        pros: 'Đạt được sự đồng thuận của cả gia đình, giảm thiểu rủi ro kinh tế.',
        cons: 'Khối lượng học tập có thể nặng hơn.',
        takeaway: 'Thế giới hiện đại có rất nhiều ngành nghề giao thoa sáng tạo, đừng tự giới hạn mình ở hai thái cực nhị nguyên.'
      }
    ]
  }
];

export const QUIZZES: Quiz[] = [
  {
    id: 'quiz-study',
    title: 'Áp lực học tập & Kỳ vọng thi cử',
    icon: '🧠',
    description: 'Đo lường mức độ căng thẳng của bạn đối với điểm số, bài tập và áp lực từ thầy cô, gia đình.',
    disclaimer: 'Đây là bài tự suy ngẫm giúp bạn nhận diện mức độ áp lực hiện tại, không phải chẩn đoán y tế.',
    questions: [
      {
        id: 1,
        question: 'Bạn có thường cảm thấy lo lắng hoặc tim đập nhanh trước các buổi kiểm tra hay trả bài không?',
        options: [
          { label: 'Hiếm khi hoặc không bao giờ', score: 1 },
          { label: 'Thỉnh thoảng, với những môn quan trọng', score: 2 },
          { label: 'Thường xuyên, hầu hết các môn', score: 3 },
          { label: 'Rất thường xuyên, luôn bị ám ảnh', score: 4 }
        ]
      },
      {
        id: 2,
        question: 'Bạn có cảm thấy khó ngủ vì suy nghĩ về lượng bài tập và kỳ thi sắp tới?',
        options: [
          { label: 'Hầu như ngủ ngon giấc', score: 1 },
          { label: 'Đôi khi trằn trọc vào tuần thi', score: 2 },
          { label: 'Khó ngủ nhiều đêm trong tuần', score: 3 },
          { label: 'Mất ngủ triền miên và luôn mệt mỏi', score: 4 }
        ]
      },
      {
        id: 3,
        question: 'Khi nhận điểm kém hơn kỳ vọng, bạn phản ứng ra sao?',
        options: [
          { label: 'Buồn một chút rồi xem lại lỗi sai', score: 1 },
          { label: 'Áy náy và lo sợ bố mẹ buồn', score: 2 },
          { label: 'Tự trách bản thân thậm tệ và thấy mình kém cỏi', score: 3 },
          { label: 'Hoảng loạn, cảm thấy tương lai sụp đổ', score: 4 }
        ]
      },
      {
        id: 4,
        question: 'Bạn có phải hy sinh sở thích, thời gian thư giãn hoặc gặp bạn bè để học thêm không?',
        options: [
          { label: 'Vẫn cân đối được thời gian vui chơi', score: 1 },
          { label: 'Thỉnh thoảng phải bớt giờ chơi', score: 2 },
          { label: 'Hầu như không còn thời gian cho sở thích riêng', score: 3 },
          { label: 'Lịch học kín mít từ sáng tới khuya, kiệt sức', score: 4 }
        ]
      },
      {
        id: 5,
        question: 'Bạn cảm thấy áp lực lớn nhất đến từ đâu?',
        options: [
          { label: 'Không thấy áp lực quá mức', score: 1 },
          { label: 'Từ kỳ vọng của bố mẹ và thầy cô', score: 2 },
          { label: 'Từ việc so sánh với bạn bè cùng lớp', score: 3 },
          { label: 'Từ chính tiêu chuẩn khắt khe tự đặt ra cho mình', score: 4 }
        ]
      },
      {
        id: 6,
        question: 'Khi gặp một dạng bài tập hoặc đề thi quá khó không làm được, cảm xúc bên trong bạn thế nào?',
        options: [
          { label: 'Tạm gác lại làm câu khác, sau đó nhờ bạn bè hoặc thầy cô hướng dẫn', score: 1 },
          { label: 'Hơi sốt ruột nhưng vẫn cố gắng tìm cách giải', score: 2 },
          { label: 'Cảm thấy tức giận, thất vọng về bản thân và mất hết tự tin', score: 3 },
          { label: 'Bật khóc hoặc muốn xé bỏ bài vở vì thấy mình bất lực, kém cỏi', score: 4 }
        ]
      },
      {
        id: 7,
        question: 'Bạn có xu hướng trì hoãn bài tập đến sát giờ nộp mới cuống cuồng làm không?',
        options: [
          { label: 'Hiếm khi, mình luôn phân bổ thời gian hợp lý từ sớm', score: 1 },
          { label: 'Đôi khi với những môn học mình không hứng thú', score: 2 },
          { label: 'Khá thường xuyên, vừa trì hoãn vừa cảm thấy cắn rứt lương tâm', score: 3 },
          { label: 'Luôn luôn nước đến chân mới nhảy, thức trắng đêm làm trong hoảng loạn', score: 4 }
        ]
      },
      {
        id: 8,
        question: 'Khi được thầy cô gọi lên bảng kiểm tra bài cũ hoặc giải bài đột xuất, bạn:',
        options: [
          { label: 'Bình tĩnh, chuẩn bị bài tốt nên tự tin trả lời', score: 1 },
          { label: 'Hơi giật mình một chút nhưng lấy lại bình tĩnh nhanh', score: 2 },
          { label: 'Run rẩy, tim đập thình thịch dù có học bài nhưng dễ quên sạch', score: 3 },
          { label: 'Choáng váng, sợ hãi tột độ vì sợ bị chê cười trước cả lớp', score: 4 }
        ]
      },
      {
        id: 9,
        question: 'Bạn có thường so sánh điểm số của mình với bạn bè hoặc "con nhà người ta" không?',
        options: [
          { label: 'Không, mình chỉ tập trung vào sự tiến bộ của chính mình', score: 1 },
          { label: 'Thỉnh thoảng xem để biết mức độ học lực chung', score: 2 },
          { label: 'Thường xuyên so sánh và luôn cảm thấy mình thua thiệt, kém cỏi', score: 3 },
          { label: 'Ám ảnh ghen tỵ và tự dằn vặt mỗi khi điểm số thấp hơn người khác', score: 4 }
        ]
      },
      {
        id: 10,
        question: 'Bạn nghĩ gì về việc xin sự trợ giúp hoặc nói thật với bố mẹ/thầy cô khi việc học quá tải?',
        options: [
          { label: 'Sẵn sàng trao đổi thẳng thắn để cùng tìm giải pháp giảm tải', score: 1 },
          { label: 'Cần chút thời gian suy nghĩ nhưng sẽ mở lời khi cần', score: 2 },
          { label: 'Rất e ngại vì sợ bị đánh giá là lười biếng hoặc thiếu ý chí', score: 3 },
          { label: 'Tuyệt đối không dám nói, thà chịu đựng một mình đến kiệt sức', score: 4 }
        ]
      }
    ],
    results: {
      low: {
        level: 'low',
        title: 'Mức độ áp lực: Thấp 🟢',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        summary: 'Bạn đang có thái độ học tập rất lành mạnh và biết cách cân bằng cảm xúc tốt. Điểm số với bạn là động lực chứ không phải gánh nặng đè bẹp niềm vui tuổi trẻ.',
        actionAdvice: [
          'Tiếp tục duy trì thời gian biểu cân bằng giữa học tập và sở thích cá nhân.',
          'Lan tỏa tinh thần lạc quan và giúp đỡ những bạn bè đang bị áp lực xung quanh.',
          'Khi gặp bài thi khó, tiếp tục tin tưởng vào sự nỗ lực kiên trì của bản thân.'
        ]
      },
      medium: {
        level: 'medium',
        title: 'Mức độ áp lực: Trung bình 🟡',
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
        summary: 'Bạn cảm nhận được áp lực thi cử ở mức độ tự nhiên của học sinh. Đôi khi bạn thấy căng thẳng nhưng vẫn đang cố gắng kiểm soát.',
        actionAdvice: [
          'Thử kỹ thuật chia nhỏ thời gian học Pomodoro (25 phút học, 5 phút nghỉ) để tránh kiệt sức não bộ.',
          'Tập thói quen nói về lỗi sai bài tập như một bài học kinh nghiệm hơn là một thất bại cá nhân.',
          'Dành ít nhất 30 phút mỗi ngày vận động nhẹ hoặc nghe nhạc không lời.'
        ]
      },
      high: {
        level: 'high',
        title: 'Mức độ áp lực: Khá cao 🟠',
        badgeColor: 'bg-orange-100 text-orange-800 border-orange-300',
        summary: 'Việc học đang chiếm trọn tâm trí và bắt đầu ảnh hưởng tới giấc ngủ cũng như tâm trạng hàng ngày của bạn. Bạn đang gánh trên vai quá nhiều kỳ vọng.',
        actionAdvice: [
          'Hãy dũng cảm nói chuyện với bố mẹ về việc giãn bớt lịch học thêm.',
          'Học cách chấp nhận "điểm 8 tốt vừa đủ" thay vì lúc nào cũng tự ép mình phải đạt điểm 10 tuyệt đối.',
          'Chia sẻ với bạn bè hoặc giáo viên bộ môn khi gặp bài tập quá tải.'
        ]
      },
      veryHigh: {
        level: 'very-high',
        title: 'Mức độ áp lực: Rất cao 🔴',
        badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
        summary: 'Báo động đỏ: Bạn đang ở trong tình trạng kiệt sức (burnout). Cơ thể và tinh thần bạn đang kêu cứu vì quá tải bài vở và nỗi sợ thất bại.',
        actionAdvice: [
          'Dừng lại và cho phép bản thân nghỉ trọn vẹn 1-2 ngày cuối tuần để hồi phục năng lượng.',
          'Gặp ngay cô giáo tư vấn tâm lý học đường hoặc nói chuyện thẳng thắn với người lớn bạn tin cậy.',
          'Nhớ rằng: Sức khỏe tinh thần và tính mạng của bạn quan trọng hơn bất kỳ tấm bằng khen hay kỳ thi nào!'
        ]
      }
    }
  },
  {
    id: 'quiz-social',
    title: 'Ảnh hưởng của mạng xã hội',
    icon: '📱',
    description: 'Khám phá xem TikTok, Facebook, Instagram đang mang lại niềm vui hay khiến bạn bất an, so sánh bản thân.',
    disclaimer: 'Bài đánh giá thói quen sử dụng mạng xã hội, giúp bạn làm chủ công nghệ thay vì để công nghệ làm chủ bạn.',
    questions: [
      {
        id: 1,
        question: 'Hành động đầu tiên của bạn vào buổi sáng thức dậy và buổi tối trước khi ngủ là gì?',
        options: [
          { label: 'Vươn vai, rửa mặt / đọc sách', score: 1 },
          { label: 'Xem giờ và lướt tin tức nhanh 5 phút', score: 2 },
          { label: 'Lướt TikTok/Instagram hơn 30 phút trên giường', score: 3 },
          { label: 'Dán mắt vào màn hình hàng giờ, không dứt ra được', score: 4 }
        ]
      },
      {
        id: 2,
        question: 'Khi đăng ảnh hoặc story, bạn có liên tục kiểm tra số lượt like/view không?',
        options: [
          { label: 'Đăng cho vui, không bận tâm ai like', score: 1 },
          { label: 'Thỉnh thoảng xem ai xem', score: 2 },
          { label: 'Khá hồi hộp, nếu ít like sẽ thấy thất vọng', score: 3 },
          { label: 'Nếu không được nhiều like như mong đợi sẽ xóa bài ngay', score: 4 }
        ]
      },
      {
        id: 3,
        question: 'Sau khi lướt mạng xã hội xem cuộc sống của người khác, bạn cảm thấy thế nào?',
        options: [
          { label: 'Bình thường, coi như giải trí', score: 1 },
          { label: 'Đôi lúc thấy họ giỏi và ngưỡng mộ nhẹ', score: 2 },
          { label: 'Thấy ghen tỵ và tự ti về ngoại hình/hoàn cảnh của mình', score: 3 },
          { label: 'Cảm thấy mình thật thất bại, trống rỗng và bất an', score: 4 }
        ]
      },
      {
        id: 4,
        question: 'Bạn có cảm thấy khó chịu, bồn chồn khi điện thoại hết pin hoặc không có mạng Wi-Fi?',
        options: [
          { label: 'Thấy thoải mái vì được yên tĩnh', score: 1 },
          { label: 'Hơi bất tiện một chút', score: 2 },
          { label: 'Bồn chồn, luôn tìm chỗ sạc ngay lập tức', score: 3 },
          { label: 'Hoảng loạn, cảm giác bị ngắt kết nối với thế giới', score: 4 }
        ]
      },
      {
        id: 5,
        question: 'Mạng xã hội có làm bạn xao nhãng việc học bài hoặc trễ giờ ngủ không?',
        options: [
          { label: 'Không, mình tắt thông báo khi học', score: 1 },
          { label: 'Thỉnh thoảng lướt quá 15 phút', score: 2 },
          { label: 'Thường xuyên thức khuya đến 1-2h sáng vì lướt video ngắn', score: 3 },
          { label: 'Ngày nào cũng thức thâu đêm vì nghiện màn hình', score: 4 }
        ]
      },
      {
        id: 6,
        question: 'Khi thấy bài đăng của bạn bè khoe thành tích, giải thưởng hoặc cuộc sống hoàn hảo, bạn thường:',
        options: [
          { label: 'Thả tim chúc mừng thật lòng cho bạn', score: 1 },
          { label: 'Lướt qua bình thường, coi như thông tin tham khảo', score: 2 },
          { label: 'Cảm thấy chạnh lòng, tự ti về hoàn cảnh hoặc năng lực bản thân', score: 3 },
          { label: 'Bị ám ảnh suy nghĩ tiêu cực cả ngày, ghét bỏ cuộc sống hiện tại của mình', score: 4 }
        ]
      },
      {
        id: 7,
        question: 'Bạn có bao giờ cảm thấy phải chỉnh sửa ảnh (dùng filter bóp mặt, kéo chân) thật kỹ mới dám đăng lên mạng?',
        options: [
          { label: 'Để mặt mộc tự nhiên hoặc chụp sao đăng vậy', score: 1 },
          { label: 'Chỉnh màu nhẹ nhàng cho sáng sủa', score: 2 },
          { label: 'Mất hàng tiếng đồng hồ chọn góc và sửa từng chi tiết mới dám đăng', score: 3 },
          { label: 'Cực kỳ sợ người khác thấy nhan sắc thật ngoài đời của mình', score: 4 }
        ]
      },
      {
        id: 8,
        question: 'Bạn có thói quen vừa học bài vừa để điện thoại bên cạnh mở mạng xã hội không?',
        options: [
          { label: 'Mình cất điện thoại ở phòng khác hoặc bật chế độ tập trung', score: 1 },
          { label: 'Để gần nhưng chỉ mở khi có thông báo quan trọng', score: 2 },
          { label: 'Cứ 5-10 phút lại mở máy lướt một lần vô thức', score: 3 },
          { label: 'Hoàn toàn không thể học nổi vì tay luôn dính chặt vào màn hình', score: 4 }
        ]
      },
      {
        id: 9,
        question: 'Khi đọc phải những bình luận ác ý hoặc tranh cãi tiêu cực trên mạng, bạn:',
        options: [
          { label: 'Bỏ qua ngay hoặc block tài khoản độc hại', score: 1 },
          { label: 'Hơi bực mình một chút nhưng không tham gia tranh cãi', score: 2 },
          { label: 'Trằn trọc suy nghĩ và bận tâm suốt cả buổi', score: 3 },
          { label: 'Bị tổn thương sâu sắc, thức đêm đôi co hoặc suy sụp tinh thần', score: 4 }
        ]
      },
      {
        id: 10,
        question: 'Nếu phải rời xa điện thoại và mạng xã hội trong vòng 2 ngày cuối tuần, bạn sẽ:',
        options: [
          { label: 'Thấy rất tuyệt vời vì có dịp nghỉ ngơi và hòa mình vào đời thực', score: 1 },
          { label: 'Hơi bỡ ngỡ lúc đầu nhưng sẽ tìm được việc vui khác để làm', score: 2 },
          { label: 'Cảm thấy bứt rứt, trống rỗng và liên tục tìm cách lén dùng', score: 3 },
          { label: 'Cực kỳ hoảng loạn, cảm thấy thế giới như sụp đổ nếu không có mạng', score: 4 }
        ]
      }
    ],
    results: {
      low: {
        level: 'low',
        title: 'Mức độ ảnh hưởng: Nhẹ 🟢',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        summary: 'Tuyệt vời! Bạn là người dùng mạng xã hội thông minh và tỉnh táo. Bạn coi điện thoại là công cụ giải trí chứ không để thuật toán thao túng cảm xúc.',
        actionAdvice: [
          'Duy trì thói quen để điện thoại xa giường ngủ vào ban đêm.',
          'Tiếp tục đầu tư thời gian vào các mối quan hệ thực tế ngoài đời.'
        ]
      },
      medium: {
        level: 'medium',
        title: 'Mức độ ảnh hưởng: Trung bình 🟡',
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
        summary: 'Mạng xã hội bắt đầu chiếm kha khá thời gian rảnh của bạn và đôi khi gieo vào đầu bạn những so sánh ngầm.',
        actionAdvice: [
          'Cài đặt tính năng giới hạn thời gian màn hình (Screen Time) tối đa 1.5 tiếng/ngày cho các app giải trí.',
          'Thẳng tay nhấn "Không quan tâm" (Not Interested) hoặc unfollow những tài khoản khiến bạn thấy tự ti.'
        ]
      },
      high: {
        level: 'high',
        title: 'Mức độ ảnh hưởng: Khá cao 🟠',
        badgeColor: 'bg-orange-100 text-orange-800 border-orange-300',
        summary: 'Bạn đang bị cuốn sâu vào vòng xoáy so sánh và phụ thuộc vào sự công nhận ảo qua những nút like.',
        actionAdvice: [
          'Thử thách "Cai nghiện số" (Digital Detox) 24 giờ vào ngày Chủ nhật.',
          'Tắt toàn bộ thông báo (push notifications) của các app mạng xã hội.',
          'Gặp gỡ bạn bè trực tiếp để trò chuyện thay vì chỉ nhắn tin qua filter.'
        ]
      },
      veryHigh: {
        level: 'very-high',
        title: 'Mức độ ảnh hưởng: Rất cao 🔴',
        badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
        summary: 'Mạng xã hội đang thao túng nghiêm trọng chất lượng giấc ngủ, sự tự tin và thời gian của bạn.',
        actionAdvice: [
          'Xóa bớt app mạng xã hội gây nghiện nhất khỏi màn hình chính trong 1 tuần.',
          'Đổi màn hình điện thoại sang chế độ Đen Trắng (Grayscale) để giảm kích thích thị giác.',
          'Tìm một sở thích thể chất mới: chơi cầu lông, vẽ tranh, nấu ăn.'
        ]
      }
    }
  },
  {
    id: 'quiz-family',
    title: 'Giao tiếp & Thấu hiểu với gia đình',
    icon: '💬',
    description: 'Đánh giá mức độ cởi mở và khoảng cách thế hệ giữa bạn và bố mẹ.',
    disclaimer: 'Bài trắc nghiệm giúp nhận diện rào cản trò chuyện để tìm cách mở lời tốt hơn.',
    questions: [
      {
        id: 1,
        question: 'Khi gặp chuyện buồn ở trường, bạn có muốn kể cho bố mẹ nghe không?',
        options: [
          { label: 'Luôn sẵn sàng kể vì bố mẹ lắng nghe', score: 1 },
          { label: 'Chỉ kể những chuyện nhẹ nhàng', score: 2 },
          { label: 'Ngại kể vì sợ bố mẹ mắng hoặc xem thường', score: 3 },
          { label: 'Tuyệt đối không bao giờ kể bất cứ chuyện gì', score: 4 }
        ]
      },
      {
        id: 2,
        question: 'Không khí trong bữa cơm gia đình bạn thường như thế nào?',
        options: [
          { label: 'Vui vẻ, nhiều tiếng cười và trò chuyện', score: 1 },
          { label: 'Bình thường, ai nấy ăn xong việc', score: 2 },
          { label: 'Căng thẳng vì bố mẹ hay nhắc chuyện học hành/so sánh', score: 3 },
          { label: 'Rất ngột ngạt, chỉ muốn ăn thật nhanh để về phòng', score: 4 }
        ]
      },
      {
        id: 3,
        question: 'Bố mẹ có tôn trọng không gian riêng tư (phòng ngủ, điện thoại, nhật ký) của bạn không?',
        options: [
          { label: 'Rất tôn trọng, luôn gõ cửa trước khi vào', score: 1 },
          { label: 'Thỉnh thoảng hỏi han quan tâm vừa phải', score: 2 },
          { label: 'Hay kiểm tra phòng hoặc điện thoại không xin phép', score: 3 },
          { label: 'Hoàn toàn không có quyền riêng tư, bị giám sát gắt gao', score: 4 }
        ]
      },
      {
        id: 4,
        question: 'Khi bạn và bố mẹ bất đồng quan điểm, chuyện gì thường xảy ra?',
        options: [
          { label: 'Cả hai cùng ngồi xuống nói chuyện và tìm tiếng nói chung', score: 1 },
          { label: 'Im lặng một thời gian rồi tự làm hòa', score: 2 },
          { label: 'Bố mẹ áp đặt "bố mẹ nói là phải nghe", không cho giải thích', score: 3 },
          { label: 'Tranh cãi gay gắt, to tiếng hoặc đập phá đồ đạc', score: 4 }
        ]
      },
      {
        id: 5,
        question: 'Bạn có cảm thấy bố mẹ thực sự hiểu con người và sở thích của bạn không?',
        options: [
          { label: 'Có, bố mẹ rất ủng hộ con người thật của mình', score: 1 },
          { label: 'Hiểu được một phần', score: 2 },
          { label: 'Bố mẹ chỉ nhìn thấy những gì họ muốn thấy', score: 3 },
          { label: 'Bố mẹ hoàn toàn không hiểu gì về mình, như hai người xa lạ', score: 4 }
        ]
      },
      {
        id: 6,
        question: 'Bố mẹ có bao giờ so sánh bạn với anh chị em trong nhà hoặc "con nhà người ta" không?',
        options: [
          { label: 'Hầu như không, bố mẹ tôn trọng sự khác biệt của mỗi người', score: 1 },
          { label: 'Thỉnh thoảng nhắc nhở với mục đích động viên nhẹ', score: 2 },
          { label: 'Khá thường xuyên, khiến bạn thấy mình luôn là cái bóng kém cỏi', score: 3 },
          { label: 'Bị so sánh liên tục mỗi ngày, biến thành đòn roi tinh thần gây tổn thương sâu sắc', score: 4 }
        ]
      },
      {
        id: 7,
        question: 'Khi bạn bày tỏ ước mơ hoặc sở thích cá nhân (nghệ thuật, thể thao, ngành học), phản ứng của bố mẹ là:',
        options: [
          { label: 'Lắng nghe, tôn trọng và tạo điều kiện hết lòng', score: 1 },
          { label: 'Lắng nghe nhưng vẫn khuyên nên chọn con đường an toàn hơn', score: 2 },
          { label: 'Gạt phắt đi, cho rằng đó là viển vông, vô bổ và bắt phải theo ý bố mẹ', score: 3 },
          { label: 'Chế giễu, cấm đoán gay gắt và xem thường đam mê của bạn', score: 4 }
        ]
      },
      {
        id: 8,
        question: 'Bạn có cảm giác an toàn và được nâng đỡ khi ở trong chính ngôi nhà của mình không?',
        options: [
          { label: 'Ngôi nhà là bến đỗ bình yên nhất sau những giờ học căng thẳng', score: 1 },
          { label: 'Phần lớn thời gian cảm thấy an tâm', score: 2 },
          { label: 'Đôi khi thấy ngột ngạt và muốn tìm cớ ra ngoài', score: 3 },
          { label: 'Cảm giác như một nơi giam cầm cảm xúc, lúc nào cũng phải đề phòng', score: 4 }
        ]
      },
      {
        id: 9,
        question: 'Lần gần nhất bạn và bố mẹ có một cuộc trò chuyện chân thành, không cãi vã là khi nào?',
        options: [
          { label: 'Trong vài ngày gần đây', score: 1 },
          { label: 'Khoảng 1 - 2 tuần trước', score: 2 },
          { label: 'Đã vài tháng rồi không thể nói chuyện quá 3 câu mà không cãi nhau', score: 3 },
          { label: 'Không nhớ nổi, dường như chưa bao giờ có một cuộc nói chuyện tử tế', score: 4 }
        ]
      },
      {
        id: 10,
        question: 'Bạn có dám khóc hoặc bộc lộ sự yếu đuối trước mặt bố mẹ khi gặp khủng hoảng không?',
        options: [
          { label: 'Hoàn toàn dám, vì bố mẹ sẽ ôm lấy và an ủi bạn', score: 1 },
          { label: 'Đôi khi dám, nhưng thường chỉ với mẹ hoặc bố', score: 2 },
          { label: 'Không dám, sợ bị mắng là "kém cỏi", "có thế mà cũng khóc"', score: 3 },
          { label: 'Luôn phải gồng mình giả vờ mạnh mẽ, chỉ dám khóc thầm trong bóng tối', score: 4 }
        ]
      }
    ],
    results: {
      low: {
        level: 'low',
        title: 'Khoảng cách thế hệ: Rất gần gũi 🟢',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        summary: 'Gia đình bạn là một chỗ dựa tinh thần tuyệt vời! Mối quan hệ giữa bạn và bố mẹ có sự tôn trọng và lắng nghe hai chiều.',
        actionAdvice: [
          'Hãy trân trọng và duy trì những cuộc trò chuyện ấm áp này.',
          'Đừng quên nói những lời cảm ơn và yêu thương nho nhỏ với bố mẹ nhé.'
        ]
      },
      medium: {
        level: 'medium',
        title: 'Khoảng cách thế hệ: Trung bình 🟡',
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
        summary: 'Có sự khác biệt quan điểm nhất định giữa tuổi teen và người lớn, nhưng nền tảng tình cảm vẫn rất tốt.',
        actionAdvice: [
          'Thử chủ động chia sẻ những câu chuyện nhỏ vui vẻ trong ngày để tạo thói quen lắng nghe.',
          'Tham khảo các mẫu mở lời ở trang "Nói chuyện với bố mẹ" khi cần bàn chuyện quan trọng.'
        ]
      },
      high: {
        level: 'high',
        title: 'Khoảng cách thế hệ: Khá xa cách 🟠',
        badgeColor: 'bg-orange-100 text-orange-800 border-orange-300',
        summary: 'Bạn đang cảm thấy khó kết nối và thường xuyên bị áp đặt. Sự ngột ngạt này khiến bạn có xu hướng khép kín lòng mình.',
        actionAdvice: [
          'Nếu khó nói trực tiếp, hãy thử viết thư tay hoặc nhắn một tin nhắn chân thành.',
          'Tìm một người lớn trung gian (cô dì, anh chị lớn) để làm cầu nối giải thích góc nhìn của bạn.'
        ]
      },
      veryHigh: {
        level: 'very-high',
        title: 'Khoảng cách thế hệ: Căng thẳng cao 🔴',
        badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
        summary: 'Không khí gia đình đang gây tổn thương sâu sắc tới sức khỏe tinh thần của bạn.',
        actionAdvice: [
          'Ưu tiên bảo vệ an toàn cảm xúc của bản thân, tránh đối đầu trực diện khi cả hai bên đang nóng giận.',
          'Tìm kiếm sự hỗ trợ từ chuyên viên tư vấn học đường hoặc phòng tham vấn tâm lý để được hướng dẫn cách giải tỏa.'
        ]
      }
    }
  },
  {
    id: 'quiz-fomo',
    title: 'Hội chứng FOMO (Sợ bỏ lỡ)',
    icon: '👥',
    description: 'Đo lường mức độ bạn sợ bị tụt lại phía sau hoặc bị gạt ra ngoài các xu hướng và cuộc vui của bạn bè.',
    disclaimer: 'Bài đánh giá mức độ tự chủ cảm xúc trước các xu hướng xã hội.',
    questions: [
      {
        id: 1,
        question: 'Khi bạn bè bàn về một trend mới trên mạng mà bạn chưa biết, bạn cảm thấy thế nào?',
        options: [
          { label: 'Tò mò hỏi thử, không biết cũng chẳng sao', score: 1 },
          { label: 'Hơi quê một chút nhưng quên ngay', score: 2 },
          { label: 'Khá ngượng ngùng và vội vã về nhà tra cứu để bắt kịp', score: 3 },
          { label: 'Cực kỳ lo sợ bị coi là "tối cổ" và bị cho ra rìa', score: 4 }
        ]
      },
      {
        id: 2,
        question: 'Bạn có nhận lời tham gia các buổi đi chơi dù bản thân đang rất mệt mỏi chỉ vì sợ bỏ lỡ chuyện vui?',
        options: [
          { label: 'Không, mệt là mình từ chối thẳng', score: 1 },
          { label: 'Thỉnh thoảng cố đi', score: 2 },
          { label: 'Hầu như luôn nhận lời vì sợ mọi người nói xấu sau lưng', score: 3 },
          { label: 'Luôn luôn đi dù phải kiệt sức, không bao giờ dám vắng mặt', score: 4 }
        ]
      },
      {
        id: 3,
        question: 'Bạn có thường xuyên lo lắng rằng bạn bè đang có những trải nghiệm tuyệt vời hơn mình?',
        options: [
          { label: 'Hiếm khi nghĩ tới', score: 1 },
          { label: 'Đôi lúc vào những ngày buồn', score: 2 },
          { label: 'Thường xuyên thấy bất an', score: 3 },
          { label: 'Liên tục bị ám ảnh và thấy đời mình tẻ nhạt', score: 4 }
        ]
      },
      {
        id: 4,
        question: 'Bạn có cảm thấy phải mua đồ theo trend (quần áo, đồ uống, phụ kiện) để hòa nhập?',
        options: [
          { label: 'Chỉ mua thứ mình thật sự thích và cần', score: 1 },
          { label: 'Đôi khi mua theo bạn bè cho vui', score: 2 },
          { label: 'Rất áp lực phải có đồ giống nhóm bạn', score: 3 },
          { label: 'Bằng mọi giá phải xin bố mẹ mua bằng được để không bị chê', score: 4 }
        ]
      },
      {
        id: 5,
        question: 'Khi bạn không thể tham gia một sự kiện của lớp/trường, tâm trạng bạn thế nào?',
        options: [
          { label: 'Bình tĩnh, còn nhiều dịp khác', score: 1 },
          { label: 'Hơi tiếc nuối một chút', score: 2 },
          { label: 'Cả ngày hôm đó bồn chồn, liên tục nhắn tin hỏi bạn bè', score: 3 },
          { label: 'Khóc hoặc buồn bã cả tuần vì cảm giác bị bỏ rơi', score: 4 }
        ]
      },
      {
        id: 6,
        question: 'Khi thấy một nhóm bạn tụ tập hoặc lập nhóm chat riêng mà không có tên bạn, bạn cảm thấy:',
        options: [
          { label: 'Bình thường, ai cũng có những nhóm bạn bè và sở thích riêng', score: 1 },
          { label: 'Hơi tò mò một chút nhưng không quá bận tâm', score: 2 },
          { label: 'Cảm thấy tủi thân, lo lắng rằng mọi người đang bàn tán hoặc xa lánh mình', score: 3 },
          { label: 'Suy sụp, suy diễn đủ điều tiêu cực và cảm thấy mình bị cả lớp cô lập', score: 4 }
        ]
      },
      {
        id: 7,
        question: 'Bạn có bao giờ nói dối về sở thích, gu âm nhạc hoặc hoàn cảnh gia đình chỉ để "hòa nhập" với nhóm bạn không?',
        options: [
          { label: 'Không bao giờ, mình tự hào về con người thật của mình', score: 1 },
          { label: 'Thỉnh thoảng hùa theo một vài câu chuyện cười cho vui', score: 2 },
          { label: 'Thường xuyên giả vờ thích những thứ mình ghét để không bị coi là dị biệt', score: 3 },
          { label: 'Hoàn toàn đánh mất chính mình, nói dối nhiều đến mức bản thân cũng thấy sợ', score: 4 }
        ]
      },
      {
        id: 8,
        question: 'Mức độ bạn kiểm tra tin nhắn và thông báo trong các hội nhóm lớp/bạn bè:',
        options: [
          { label: 'Rảnh thì đọc, không để thông báo làm phiền giờ học hay giờ ngủ', score: 1 },
          { label: 'Kiểm tra sau mỗi buổi học hoặc giờ giải lao', score: 2 },
          { label: 'Cứ có tiếng chuông là giật mình bấm xem ngay lập tức', score: 3 },
          { label: 'Luôn trong trạng thái căng thẳng thường trực, sợ bỏ lỡ bất kỳ drama nào', score: 4 }
        ]
      },
      {
        id: 9,
        question: 'Bạn có dám từ chối một lời rủ rê trốn học, hút thuốc, chơi game hoặc làm điều trái nguyên tắc từ nhóm bạn không?',
        options: [
          { label: 'Dứt khoát từ chối ngay và giữ vững nguyên tắc của mình', score: 1 },
          { label: 'Tìm lý do chính đáng để khéo léo từ chối', score: 2 },
          { label: 'Ngập ngừng, sợ bị bạn bè chê là "hèn" nên rất khó nói không', score: 3 },
          { label: 'Nhắm mắt làm theo dù biết sai chỉ vì sợ bị tẩy chay hoặc đuổi khỏi nhóm', score: 4 }
        ]
      },
      {
        id: 10,
        question: 'Sau một ngày dài cố gắng hòa nhập và làm hài lòng bạn bè ở trường, khi về đến nhà bạn thấy thế nào?',
        options: [
          { label: 'Vui vẻ, tràn đầy năng lượng tích cực', score: 1 },
          { label: 'Hơi mệt một chút như bình thường', score: 2 },
          { label: 'Cảm thấy trống rỗng, kiệt sức vì cả ngày phải đóng vai người khác', score: 3 },
          { label: 'Vô cùng đau khổ, cảm giác cô độc giữa biển người dù xung quanh rất đông đúc', score: 4 }
        ]
      }
    ],
    results: {
      low: {
        level: 'low',
        title: 'Mức độ FOMO: Thấp 🟢',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        summary: 'Bạn có sự độc lập cao và định hình bản thân vững vàng. Bạn không cần phải chạy theo mọi xu hướng để cảm thấy có giá trị.',
        actionAdvice: [
          'Giữ vững cá tính riêng biệt và lòng tự tin đáng ngưỡng mộ này.',
          'Lắng nghe những nhu cầu thực sự của cơ thể và tâm trí mình.'
        ]
      },
      medium: {
        level: 'medium',
        title: 'Mức độ FOMO: Trung bình 🟡',
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
        summary: 'Tâm lý muốn hòa nhập ở lứa tuổi học trò là hoàn toàn bình thường, đôi khi bạn thấy hơi lăn tăn nhưng không quá mức.',
        actionAdvice: [
          'Nhớ rằng những trào lưu đến nhanh rồi cũng sẽ đi rất nhanh.',
          'Tập nói "Không" một cách nhẹ nhàng khi bản thân cảm thấy cần nghỉ ngơi.'
        ]
      },
      high: {
        level: 'high',
        title: 'Mức độ FOMO: Khá cao 🟠',
        badgeColor: 'bg-orange-100 text-orange-800 border-orange-300',
        summary: 'Nỗi sợ bị bỏ rơi đang khiến bạn hao tổn rất nhiều năng lượng và tiền bạc để chạy theo người khác.',
        actionAdvice: [
          'Tìm hiểu về khái niệm JOMO (Joy of Missing Out - Niềm vui khi ở một mình).',
          'Tự hỏi bản thân: "Nếu không có ai nhìn thấy, mình có thực sự muốn làm việc này không?"'
        ]
      },
      veryHigh: {
        level: 'very-high',
        title: 'Mức độ FOMO: Rất cao 🔴',
        badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
        summary: 'Bạn đang đánh mất chính mình vì nỗi sợ hãi bị từ chối và ám ảnh phải làm hài lòng đám đông.',
        actionAdvice: [
          'Dừng lại việc gồng mình làm hài lòng tất cả mọi người.',
          'Kết nối với 1-2 người bạn thực sự thấu hiểu bạn thay vì cố gắng bám theo một nhóm đông.'
        ]
      }
    }
  },
  {
    id: 'quiz-friendship',
    title: 'Tình bạn & Cảm giác thuộc về',
    icon: '🫂',
    description: 'Nhận diện chất lượng các mối quan hệ bạn bè xung quanh bạn: lành mạnh hay độc hại?',
    disclaimer: 'Bài đánh giá mối quan hệ giúp bạn trân trọng những người bạn tử tế.',
    questions: [
      {
        id: 1,
        question: 'Khi ở bên cạnh nhóm bạn thân, bạn có được là chính mình không?',
        options: [
          { label: 'Hoàn toàn tự nhiên, nói cười thoải mái', score: 1 },
          { label: 'Khá thoải mái, chỉ kiềm chế một số thói quen', score: 2 },
          { label: 'Phải luôn để ý lời ăn tiếng nói, sợ bị chê', score: 3 },
          { label: 'Phải đeo một chiếc mặt nạ hoàn toàn khác con người thật', score: 4 }
        ]
      },
      {
        id: 2,
        question: 'Bạn bè có bảo vệ và ủng hộ bạn khi bạn gặp khó khăn không?',
        options: [
          { label: 'Luôn sát cánh và đứng về phía mình', score: 1 },
          { label: 'Có an ủi, động viên', score: 2 },
          { label: 'Thường im lặng hoặc đứng ngoài cuộc', score: 3 },
          { label: 'Thậm chí còn hùa theo người khác trêu chọc mình', score: 4 }
        ]
      },
      {
        id: 3,
        question: 'Bạn có cảm thấy năng lượng của mình như thế nào sau mỗi lần đi chơi cùng bạn bè về?',
        options: [
          { label: 'Vui vẻ, phấn khởi và tràn đầy năng lượng', score: 1 },
          { label: 'Bình thường, hơi mệt thể chất nhẹ', score: 2 },
          { label: 'Thấy mệt mỏi tinh thần và trống rỗng', score: 3 },
          { label: 'Cảm thấy kiệt sức, ấm ức hoặc tổn thương', score: 4 }
        ]
      },
      {
        id: 4,
        question: 'Bạn bè có giữ bí mật khi bạn tin tưởng tâm sự không?',
        options: [
          { label: 'Tuyệt đối kín miệng và tôn trọng', score: 1 },
          { label: 'Hầu hết là giữ kín', score: 2 },
          { label: 'Có lần mang chuyện của mình kể cho người khác', score: 3 },
          { label: 'Biến chuyện riêng của mình thành trò cười cho cả lớp', score: 4 }
        ]
      },
      {
        id: 5,
        question: 'Có sự cân bằng trong việc lắng nghe và chia sẻ giữa bạn và bạn bè không?',
        options: [
          { label: 'Cả hai cùng lắng nghe và quan tâm nhau', score: 1 },
          { label: 'Khá cân bằng', score: 2 },
          { label: 'Mình luôn phải là người lắng nghe than thở mà ít được chia sẻ', score: 3 },
          { label: 'Họ chỉ tìm đến mình khi cần nhờ vả việc học/tiền bạc', score: 4 }
        ]
      },
      {
        id: 6,
        question: 'Khi bạn đạt được thành tích cao hoặc nhận được lời khen từ thầy cô, phản ứng của bạn bè là:',
        options: [
          { label: 'Chân thành chúc mừng và chia vui cùng bạn', score: 1 },
          { label: 'Vui vẻ bình thường, trêu đùa một chút', score: 2 },
          { label: 'Lạnh nhạt, buông những câu bóng gió mỉa mai ("May mắn thôi")', score: 3 },
          { label: 'Tỏ thái độ ghen ghét ra mặt, nói xấu và cô lập bạn', score: 4 }
        ]
      },
      {
        id: 7,
        question: 'Bạn có cảm thấy mình phải "bao tiền ăn uống" hoặc cho bạn bè chép bài để duy trì tình bạn không?',
        options: [
          { label: 'Không, tình bạn dựa trên sự bình đẳng và tôn trọng lẫn nhau', score: 1 },
          { label: 'Thỉnh thoảng mời nhau đồ ăn vặt cho vui vẻ', score: 2 },
          { label: 'Khá thường xuyên, nếu không cho chép bài là bị bạn giận dỗi', score: 3 },
          { label: 'Luôn luôn bị lợi dụng, nếu không đáp ứng sẽ bị dọa tẩy chay ngay', score: 4 }
        ]
      },
      {
        id: 8,
        question: 'Khi xảy ra mâu thuẫn hay hiểu lầm trong nhóm bạn, cách giải quyết thường là:',
        options: [
          { label: 'Thẳng thắn nhắn tin hoặc gặp mặt trực tiếp để giải tỏa khúc mắc', score: 1 },
          { label: 'Để vài hôm cho nguôi giận rồi nói chuyện lại', score: 2 },
          { label: 'Lập nhóm nói xấu sau lưng và chiến tranh lạnh kéo dài', score: 3 },
          { label: 'Đăng status bóng gió lên mạng xã hội, bóc phốt và công kích cá nhân', score: 4 }
        ]
      },
      {
        id: 9,
        question: 'Bạn có một người bạn thân thực sự để có thể tâm sự những góc khuất thầm kín nhất không?',
        options: [
          { label: 'Có ít nhất 1-2 người bạn tri kỷ như vậy', score: 1 },
          { label: 'Có bạn bè chơi cùng nhưng chưa thật sự sâu sắc', score: 2 },
          { label: 'Rất khó tìm được ai tin tưởng được hoàn toàn', score: 3 },
          { label: 'Hoàn toàn cô độc, không có bất kỳ ai để chia sẻ nỗi lòng', score: 4 }
        ]
      },
      {
        id: 10,
        question: 'Bạn có dám nói ra ý kiến trái ngược với số đông trong nhóm bạn của mình không?',
        options: [
          { label: 'Dám bộc lộ quan điểm một cách văn minh và tôn trọng', score: 1 },
          { label: 'Tùy tình huống, nếu không quá quan trọng thì xuôi theo', score: 2 },
          { label: 'Ngại nói vì sợ bị bạn bè phản bác hoặc cười nhạo', score: 3 },
          { label: 'Tuyệt đối không dám, luôn phải gật đầu đồng ý dù trong lòng phản đối', score: 4 }
        ]
      }
    ],
    results: {
      low: {
        level: 'low',
        title: 'Mối quan hệ bạn bè: Rất lành mạnh 🟢',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        summary: 'Bạn thật may mắn khi có những người bạn chân thành, tử tế và biết tôn trọng lẫn nhau. Đây là chỗ dựa tinh thần vô giá của tuổi học trò.',
        actionAdvice: [
          'Gửi lời cảm ơn ấm áp tới người bạn thân của bạn hôm nay.',
          'Tiếp tục cùng nhau tạo nên những kỷ niệm đẹp thời thanh xuân.'
        ]
      },
      medium: {
        level: 'medium',
        title: 'Mối quan hệ bạn bè: Khá tốt 🟡',
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
        summary: 'Tình bạn nhìn chung tốt đẹp, tuy nhiên đôi lúc vẫn có chút hiểu lầm hoặc thiếu sự lắng nghe sâu sắc.',
        actionAdvice: [
          'Hãy dũng cảm góp ý nhẹ nhàng khi bạn cảm thấy có điều chưa thoải mái.',
          'Dành thời gian chất lượng nói chuyện 1-1 thay vì chỉ tương tác nhóm.'
        ]
      },
      high: {
        level: 'high',
        title: 'Mối quan hệ bạn bè: Báo động độc hại 🟠',
        badgeColor: 'bg-orange-100 text-orange-800 border-orange-300',
        summary: 'Có những dấu hiệu của một tình bạn một chiều hoặc lợi dụng. Bạn đang cho đi quá nhiều mà nhận lại sự tổn thương.',
        actionAdvice: [
          'Học cách đặt ranh giới: Bạn không có nghĩa vụ phải giải quyết mọi rắc rối của người khác.',
          'Giãn dần khoảng cách với những người luôn làm bạn thấy kiệt sức.'
        ]
      },
      veryHigh: {
        level: 'very-high',
        title: 'Mối quan hệ bạn bè: Độc hại nghiêm trọng 🔴',
        badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
        summary: 'Nhóm bạn hiện tại đang bào mòn lòng tự trọng và gây tổn thương tâm lý cho bạn một cách có hệ thống.',
        actionAdvice: [
          'Dứt khoát rời khỏi mối quan hệ này. Ở một mình vẫn tốt hơn ở cạnh những người khiến bạn thấy cô độc.',
          'Tìm kiếm những người bạn mới ở câu lạc bộ, lớp năng khiếu cùng đam mê.'
        ]
      }
    }
  },
  {
    id: 'quiz-balance',
    title: 'Cân bằng học tập & Nghỉ ngơi',
    icon: '⏰',
    description: 'Kiểm tra xem bạn có đang phân bổ thời gian hợp lý hay đang rơi vào tình trạng quá tải thể chất.',
    disclaimer: 'Bài đánh giá kỹ năng quản lý thời gian và chăm sóc bản thân.',
    questions: [
      {
        id: 1,
        question: 'Trung bình một đêm bạn ngủ được bao nhiêu tiếng?',
        options: [
          { label: 'Từ 7 - 9 tiếng, ngủ đủ giấc', score: 1 },
          { label: 'Khoảng 6 - 7 tiếng', score: 2 },
          { label: 'Dưới 5 tiếng, hay thức khuya', score: 3 },
          { label: 'Ngủ chập chờn 3-4 tiếng, ngày gật gà gật gù', score: 4 }
        ]
      },
      {
        id: 2,
        question: 'Bạn có thường xuyên bỏ bữa sáng hoặc ăn uống qua loa mì gói/đồ ăn nhanh không?',
        options: [
          { label: 'Hiếm khi, luôn ăn đủ chất', score: 1 },
          { label: 'Thỉnh thoảng vào những sáng vội', score: 2 },
          { label: 'Thường xuyên bỏ bữa vì mệt hoặc bận học', score: 3 },
          { label: 'Hầu như ngày nào cũng ăn uống thất thường, đau dạ dày', score: 4 }
        ]
      },
      {
        id: 3,
        question: 'Vào cuối tuần, bạn dành thời gian làm gì?',
        options: [
          { label: 'Nghỉ ngơi, chơi thể thao, dã ngoại cùng gia đình/bạn', score: 1 },
          { label: 'Vừa học vừa xem phim thư giãn', score: 2 },
          { label: 'Ngập đầu trong bài tập và các ca học thêm', score: 3 },
          { label: 'Chỉ nằm li bì trên giường vì kiệt sức hoàn toàn', score: 4 }
        ]
      },
      {
        id: 4,
        question: 'Bạn có cảm thấy tội lỗi khi ngồi không thư giãn mà không học bài không?',
        options: [
          { label: 'Không, nghỉ ngơi là để nạp lại năng lượng', score: 1 },
          { label: 'Thỉnh thoảng hơi bồn chồn', score: 2 },
          { label: 'Rất tội lỗi, luôn thấy mình đang lười biếng', score: 3 },
          { label: 'Cực kỳ ám ảnh, không thể thư giãn nổi dù chỉ 10 phút', score: 4 }
        ]
      },
      {
        id: 5,
        question: 'Cơ thể bạn có thường xuất hiện các triệu chứng đau đầu, đau vai gáy, mỏi mắt không?',
        options: [
          { label: 'Khỏe khoắn, không có triệu chứng', score: 1 },
          { label: 'Thỉnh thoảng mỏi mắt sau khi học bài', score: 2 },
          { label: 'Đau đầu, mỏi cổ vai gáy thường xuyên', score: 3 },
          { label: 'Kiệt quệ triền miên, hay hoa mắt chóng mặt', score: 4 }
        ]
      },
      {
        id: 6,
        question: 'Bạn có dành thời gian vận động thể chất (thể thao, đi bộ, đạp xe) trong tuần không?',
        options: [
          { label: 'Đều đặn ít nhất 30 phút mỗi ngày', score: 1 },
          { label: 'Khoảng 2 - 3 lần mỗi tuần', score: 2 },
          { label: 'Rất hiếm khi, hầu như cả ngày chỉ ngồi học và nằm lướt máy', score: 3 },
          { label: 'Hoàn toàn không bao giờ vận động, cơ thể luôn nặng nề uể oải', score: 4 }
        ]
      },
      {
        id: 7,
        question: 'Thói quen uống nước và nạp năng lượng trong ngày của bạn ra sao?',
        options: [
          { label: 'Uống đủ 1.5 - 2 lít nước lọc và ăn uống điều độ', score: 1 },
          { label: 'Uống nước khi khát, ăn uống tương đối đủ bữa', score: 2 },
          { label: 'Hay quên uống nước, hay dùng trà sữa/nước ngọt thay nước lọc', score: 3 },
          { label: 'Lạm dụng cà phê hoặc nước tăng lực liều cao để ép cơ thể thức học đêm', score: 4 }
        ]
      },
      {
        id: 8,
        question: 'Bạn có những khoảnh khắc tĩnh lặng cho riêng mình (viết nhật ký, nghe nhạc thiền, ngắm cây cối) không?',
        options: [
          { label: 'Ngày nào cũng có một khoảng lặng bình yên cho tâm trí', score: 1 },
          { label: 'Vài lần trong tuần khi rảnh rỗi', score: 2 },
          { label: 'Hiếm khi, tâm trí lúc nào cũng chạy đua với bài vở hoặc mạng xã hội', score: 3 },
          { label: 'Không bao giờ, cảm giác yên tĩnh khiến bạn thấy bất an và hoảng sợ', score: 4 }
        ]
      },
      {
        id: 9,
        question: 'Khi cơ thể bạn lên tiếng báo động (cảm cúm, đau bụng, mệt lả), bạn thường:',
        options: [
          { label: 'Xin phép nghỉ ngơi, uống thuốc và chăm sóc cơ thể chu đáo', score: 1 },
          { label: 'Nghỉ ngơi một lúc rồi học tiếp', score: 2 },
          { label: 'Uống thuốc giảm đau tức thời để tiếp tục ngồi vào bàn học', score: 3 },
          { label: 'Phớt lờ hoàn toàn, cố gượng ép bản thân học thêm vì sợ tụt lại', score: 4 }
        ]
      },
      {
        id: 10,
        question: 'Bạn đánh giá mức độ hài lòng và niềm hạnh phúc với cuộc sống hiện tại của mình ở mức nào?',
        options: [
          { label: 'Rất hài lòng, cảm thấy cuộc sống cân bằng và ý nghĩa', score: 1 },
          { label: 'Khá ổn, có những niềm vui nhỏ mỗi ngày', score: 2 },
          { label: 'Thường xuyên thấy mệt mỏi, áp lực lấn át niềm vui', score: 3 },
          { label: 'Cực kỳ bế tắc, cảm thấy kiệt sức và mất phương hướng sống', score: 4 }
        ]
      }
    ],
    results: {
      low: {
        level: 'low',
        title: 'Mức độ mất cân bằng: Tốt 🟢',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        summary: 'Nhịp sống của bạn rất điều độ và khoa học! Bạn biết trân trọng sức khỏe thể chất bên cạnh việc trau dồi kiến thức.',
        actionAdvice: [
          'Tiếp tục duy trì chế độ ngủ 8 tiếng và uống đủ nước mỗi ngày.',
          'Thói quen này sẽ là bệ phóng sức khỏe vững chắc cho bạn trong các kỳ thi lớn.'
        ]
      },
      medium: {
        level: 'medium',
        title: 'Mức độ mất cân bằng: Trung bình 🟡',
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
        summary: 'Có những giai đoạn bạn hơi lơ là việc chăm sóc bản thân do lịch kiểm tra dày đặc.',
        actionAdvice: [
          'Thử đặt báo thức đi ngủ cố định trước 11 giờ đêm.',
          'Đứng dậy đi lại và nhìn xa ra ngoài cửa sổ sau mỗi 45 phút ngồi bàn học.'
        ]
      },
      high: {
        level: 'high',
        title: 'Mức độ mất cân bằng: Khá cao 🟠',
        badgeColor: 'bg-orange-100 text-orange-800 border-orange-300',
        summary: 'Cơ thể bạn đang bắt đầu phát đi những tín hiệu quá tải qua các cơn đau đầu và mất ngủ.',
        actionAdvice: [
          'Nhớ rằng: Nghỉ ngơi cũng là một phần bắt buộc của quá trình học tập hiệu quả.',
          'Hãy loại bỏ ít nhất một việc không thực sự cấp thiết khỏi danh sách việc cần làm.'
        ]
      },
      veryHigh: {
        level: 'very-high',
        title: 'Mức độ mất cân bằng: Nghiêm trọng 🔴',
        badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
        summary: 'Bạn đang rút cạn sức lực của mình như một ngọn nến cháy ở cả hai đầu.',
        actionAdvice: [
          'Hãy dừng lại ngay lập tức và ngủ một giấc thật sâu.',
          'Báo với bố mẹ về tình trạng sức khỏe suy giảm để sắp xếp lại thời gian biểu kịp thời.'
        ]
      }
    }
  }
];

export const PARENT_TOPICS: ParentTalkTopic[] = [
  {
    id: 'pt-1',
    title: '“Con bị điểm thấp.”',
    situation: 'Bạn vừa nhận điểm kém một bài kiểm tra quan trọng và sợ bố mẹ nổi giận, thất vọng hoặc cấm đoán điện thoại.',
    starterScript: '“Mẹ ơi, lát nữa mẹ rảnh 5 phút không? Con muốn kể mẹ nghe chuyện điểm kiểm tra hôm nay. Con biết kết quả này chưa tốt và mẹ sẽ buồn, nhưng con muốn nói thật với mẹ để cùng tìm cách sửa đổi...”',
    alternativeTextMsg: '“Mẹ ơi, hôm nay bài kiểm tra Toán của con kết quả không như kỳ vọng. Con rất buồn và lo mẹ thất vọng. Tối nay con sẽ tự xem lại những câu làm sai, mẹ con mình cùng bàn cách để con học chắc hơn ở kỳ tới nhé.”',
    whyParentsReactThisWay: 'Bố mẹ thường la mắng không phải vì ghét bỏ bạn, mà vì nỗi sợ hãi tiềm thức: Sợ con mình thụt lùi, sợ sau này con vất vả mưu sinh. Khi hiểu được nỗi sợ đó, bạn sẽ thấy lời trách mắng bớt nặng nề hơn.',
    dos: [
      'Chọn lúc bố mẹ đang thư thả (sau bữa tối, ngày cuối tuần), tránh lúc bố mẹ vừa đi làm về mệt mỏi.',
      'Nhận trách nhiệm trước, không đổ lỗi cho đề khó hay thầy cô chấm gắt.',
      'Đưa ra sẵn 1-2 giải pháp bạn dự định làm để tiến bộ.'
    ],
    donts: [
      'Không so sánh ngược lại: “Bạn A lớp con còn được có 3 điểm kìa!”',
      'Không cãi ngang hoặc thở dài vùng vằng khi bố mẹ bắt đầu nhắc nhở.',
      'Không nói dối hoặc che giấu sổ điểm.'
    ]
  },
  {
    id: 'pt-2',
    title: '“Con đang bị áp lực.”',
    situation: 'Bạn thấy ngột ngạt vì lịch học thêm quá dày, kỳ vọng thành tích quá cao và không có thời gian thở.',
    starterScript: '“Bố ơi, con muốn chia sẻ thật lòng điều này với bố. Con biết bố mẹ đầu tư cho con học là vì thương con. Nhưng dạo này con thấy kiệt sức và đầu óc lúc nào cũng căng như dây đàn. Con sợ nếu cứ tiếp tục thế này con sẽ bị sụp đổ mất...”',
    alternativeTextMsg: '“Bố mẹ ơi, dạo này con thấy mình bị quá tải và hay mất ngủ vì bài vở. Con rất cần một khoảng nghỉ ngắn hoặc giảm bớt 1 môn học thêm để lấy lại tinh thần. Bố mẹ lắng nghe con được không?”',
    whyParentsReactThisWay: 'Thế hệ của bố mẹ từng trải qua nhiều thiếu thốn, nên họ tin rằng “càng học nhiều, càng chịu khổ giỏi thì sau này càng thành công”. Họ chưa quen với việc sức khỏe tinh thần cũng cần được chăm sóc như sức khỏe thể chất.',
    dos: [
      'Dùng cấu trúc "Con cảm thấy...": nói về cảm giác cơ thể của mình (mất ngủ, đau đầu, sợ hãi).',
      'Công nhận sự vất vả kiếm tiền của bố mẹ trước khi đề xuất giảm tải.',
      'Đề xuất cụ thể: ví dụ xin nghỉ 1 lớp học thêm chưa thực sự cần thiết.'
    ],
    donts: [
      'Không nói câu tiêu cực mang tính buông xuôi: "Con không muốn học nữa, bố mẹ ép chết con đi".',
      'Không so sánh gia đình mình với gia đình bạn bè dễ tính hơn.'
    ]
  },
  {
    id: 'pt-3',
    title: '“Con muốn bố mẹ hiểu con hơn.”',
    situation: 'Bố mẹ luôn áp đặt suy nghĩ của thế hệ trước lên sở thích, gu âm nhạc, phong cách ăn mặc hoặc ước mơ của bạn.',
    starterScript: '“Mẹ ơi, con muốn kể mẹ nghe về những điều con thực sự thích. Con không cần mẹ phải đồng ý ngay tất cả, nhưng con mong mẹ kiên nhẫn nghe con giải thích tại sao điều đó lại có ý nghĩa với con...”',
    alternativeTextMsg: '“Mẹ ơi, con biết có nhiều thứ ở lứa tuổi của con khác với thời của bố mẹ ngày xưa. Con rất mong mẹ con mình có thể hiểu nhau hơn. Cuối tuần này mẹ con mình đi uống trà sữa và nói chuyện nhé?”',
    whyParentsReactThisWay: 'Thế giới công nghệ và xã hội thay đổi quá nhanh khiến bố mẹ cảm thấy bối rối và sợ bị mất kết nối với con cái. Họ áp đặt vì đó là cách duy nhất họ biết để giữ bạn trong vùng an toàn.',
    dos: [
      'Mời bố mẹ cùng trải nghiệm một góc nhỏ thế giới của bạn: cho mẹ nghe bài hát bạn thích, giải thích một thuật ngữ vui vẻ.',
      'Lắng nghe câu chuyện tuổi thơ của bố mẹ ngày xưa để tạo sự đồng cảm hai chiều.'
    ],
    donts: [
      'Không dùng từ mang tính xúc phạm: "Bố mẹ cổ hủ, lạc hậu, không biết gì".',
      'Không đóng sầm cửa mỗi khi thấy bất đồng ý kiến.'
    ]
  },
  {
    id: 'pt-4',
    title: '“Con không thích bị so sánh.”',
    situation: 'Bố mẹ thường xuyên đem "con nhà người ta" ra để chê bai bạn, làm bạn thấy tủi thân và tự ti.',
    starterScript: '“Bố mẹ ơi, mỗi lần bố mẹ khen bạn X rồi nhìn con thở dài, con cảm thấy mọi nỗ lực của con đều vô nghĩa. Con biết bố mẹ muốn con tiến bộ, nhưng cách so sánh đó làm con rất buồn và tổn thương...”',
    alternativeTextMsg: '“Bố mẹ ơi, con đang cố gắng từng ngày để tốt hơn phiên bản ngày hôm qua của chính mình. Con mong bố mẹ ghi nhận những nỗ lực nhỏ của con thay vì so sánh con với người khác, được không bố mẹ?”',
    whyParentsReactThisWay: 'Nhiều phụ huynh xem việc so sánh là phương pháp sư phạm truyền thống nhằm kích thích ý chí phấn đấu, mà không nhận ra tác dụng phụ phá hủy lòng tự trọng của con.',
    dos: [
      'Nói rõ mong muốn: "Con muốn được bố mẹ khen ngợi khi con đạt điểm 7 môn Sử, vì con đã rất cố gắng."',
      'Bình tĩnh, chân thành, thể hiện mong muốn nhận được sự khích lệ ấm áp từ gia đình.'
    ],
    donts: [
      'Không so sánh ngược lại bố mẹ: "Sao bố mẹ không giàu như bố mẹ bạn ấy?" (Câu này sẽ gây tổn thương rất sâu cho phụ huynh).'
    ]
  },
  {
    id: 'pt-5',
    title: '“Con muốn có thêm không gian riêng.”',
    situation: 'Bố mẹ tự ý vào phòng không gõ cửa, đọc trộm tin nhắn hoặc tra khảo chi tiết từng cuộc gọi của bạn.',
    starterScript: '“Bố mẹ ơi, con đang lớn dần và có những suy nghĩ riêng tư. Con muốn xin phép bố mẹ gõ cửa trước khi vào phòng con, và cho con một chút không gian để con học cách tự lập và chịu trách nhiệm...”',
    alternativeTextMsg: '“Bố mẹ ơi, con hứa sẽ luôn chia sẻ những chuyện quan trọng và an toàn với bố mẹ. Nhưng con cũng mong bố mẹ tin tưởng và tôn trọng không gian riêng tư của con hơn một chút nha.”',
    whyParentsReactThisWay: 'Bố mẹ lo lắng trước những hiểm họa trên mạng xã hội hoặc người xấu lôi kéo, nên việc kiểm soát là phản ứng bảo vệ quá mức vì thiếu an tâm.',
    dos: [
      'Chủ động tạo dựng niềm tin trước: Giới thiệu bạn bè với bố mẹ, báo trước khi về muộn, trung thực trong các việc lớn.',
      'Giải thích nhẹ nhàng rằng không gian riêng giúp bạn tập trung học tập tốt hơn.'
    ],
    donts: [
      'Không đặt mật khẩu lén lút rồi có thái độ giấu giếm khả nghi, điều đó càng kích thích sự tò mò của phụ huynh.'
    ]
  },
  {
    id: 'pt-6',
    title: '“Con đang gặp vấn đề với bạn bè.”',
    situation: 'Bạn bị cô lập ở lớp hoặc xích mích với bạn thân nhưng sợ bố mẹ bảo "Có mỗi chuyện cỏn con thế cũng không xong".',
    starterScript: '“Mẹ ơi, dạo này ở trường con đang gặp một chuyện buồn với nhóm bạn mà con không biết cách giải quyết. Con kể mẹ nghe được không? Con chỉ cần mẹ lắng nghe và cho con lời khuyên thôi, đừng vội gọi cho cô giáo nhé...”',
    alternativeTextMsg: '“Mẹ ơi, con đang có chuyện bế tắc ở lớp cần người có nhiều kinh nghiệm như mẹ tư vấn. Tối nay con nấu cơm cùng mẹ rồi tâm sự với mẹ nhé?”',
    whyParentsReactThisWay: 'Người lớn thường nhìn vấn đề bạn bè tuổi teen qua lăng kính của người đã trải đời nên dễ buông câu "Sau này ra đời còn gặp chuyện lớn hơn", vô tình dập tắt nhu cầu được an ủi của bạn.',
    dos: [
      'Nhắc trước bố mẹ: "Con chỉ cần mẹ lắng nghe thôi, chưa cần mẹ hành động can thiệp ngay."',
      'Kể sự việc rõ ràng, trung thực theo trình tự thời gian.'
    ],
    donts: [
      'Không che giấu nếu sự việc có dấu hiệu bạo lực học đường hoặc đe dọa an toàn.'
    ]
  }
];

export const SCHOOL_ISSUES: SchoolIssueTopic[] = [
  {
    id: 'si-1',
    title: 'Áp lực học tập & Thi cử',
    icon: '📚',
    color: 'from-amber-400 to-orange-500',
    summary: 'Khối lượng bài tập khổng lồ, các kỳ thi liên miên và nỗi ám ảnh về bảng điểm xếp hạng.',
    signs: [
      'Thường xuyên mất ngủ, đau đầu, đau dạ dày trước mỗi đợt thi.',
      'Sợ hãi khi bước vào cổng trường hoặc tiết học của giáo viên nghiêm khắc.',
      'Mất hứng thú với mọi sở thích khác, cảm giác học bao nhiêu cũng không đủ.',
      'Có cảm giác tê liệt hoặc đờ đẫn khi nhìn vào đề bài kiểm tra.'
    ],
    safeActions: [
      'Lập bảng kế hoạch học tập theo ma trận Eisenhower (Ưu tiên việc quan trọng & khẩn cấp trước).',
      'Áp dụng quy tắc 50-10: Học tập trung 50 phút, đứng dậy vận động 10 phút.',
      'Tập trung vào sự tiến bộ của bản thân qua từng tuần thay vì so sánh điểm với bạn nhất lớp.'
    ],
    whenToSeekAdults: 'Khi bạn mất ngủ liên tục quá 1 tuần, có triệu chứng hoảng loạn khó thở hoặc xuất hiện ý nghĩ tiêu cực muốn buông xuôi tất cả.',
    whoToTurnTo: [
      'Thầy cô bộ môn mà bạn cảm thấy gần gũi nhất.',
      'Chuyên viên tâm lý tại Phòng tham vấn học đường của trường.',
      'Bố mẹ hoặc anh chị đã từng vượt qua giai đoạn thi cử này.'
    ]
  },
  {
    id: 'si-2',
    title: 'Mâu thuẫn bạn bè & Xích mích nhóm',
    icon: '👥',
    color: 'from-blue-400 to-indigo-500',
    summary: 'Hiểu lầm lời nói, chia bè kéo phái hoặc cảm giác bị bạn bè ruồng rẫy, tẩy chay ngầm.',
    signs: [
      'Khi bạn bước đến thì nhóm bạn đột ngột ngừng nói chuyện và tản đi chỗ khác.',
      'Bị loại khỏi các bài tập nhóm hoặc hoạt động ngoại khóa chung.',
      'Những lời nói móc mỉa, châm chọc xuất hiện thường xuyên trong lớp.',
      'Bị hủy kết bạn hoặc chặn tin nhắn hàng loạt trên mạng xã hội.'
    ],
    safeActions: [
      'Bình tĩnh xác minh: Nói chuyện riêng 1-1 với người bạn cảm thấy còn thiện chí nhất để hiểu nguyên nhân.',
      'Giữ thái độ lịch sự, không tham gia vào các cuộc đấu khẩu qua lại trên mạng xã hội.',
      'Tập trung năng lượng vào những người bạn thực sự và các hoạt động câu lạc bộ khác.'
    ],
    whenToSeekAdults: 'Khi mâu thuẫn leo thang thành đe dọa vũ lực, hẹn đánh nhau sau giờ học hoặc phá hoại đồ dùng cá nhân.',
    whoToTurnTo: [
      'Giáo viên chủ nhiệm lớp.',
      'Cán bộ Đoàn / Đội trường học.',
      'Bố mẹ để có sự hỗ trợ bảo vệ kịp thời.'
    ]
  },
  {
    id: 'si-3',
    title: 'Bắt nạt học đường (Trực tiếp)',
    icon: '🚫',
    color: 'from-rose-400 to-red-500',
    summary: 'Hành vi cố ý gây tổn hại thể chất, trấn lột tiền bạc, ép làm bài hộ hoặc đe dọa tinh thần lặp đi lặp lại.',
    signs: [
      'Bị chặn đường đi học về, bị đe dọa đòi tiền ăn sáng hoặc đồ dùng.',
      'Bị xô đẩy, giật tóc, đánh lén hoặc nhốt trong nhà vệ sinh.',
      'Quần áo, sách vở thường xuyên bị rách, bẩn hoặc mất tích không lý do.',
      'Viện cớ đau bụng, sốt để trốn tránh không muốn đến trường.'
    ],
    safeActions: [
      'Đi cùng nhóm bạn hoặc đi đường đông người, tránh các góc khuất vắng vẻ.',
      'Nói rõ ràng và dõng dạc: "Dừng lại ngay, hành vi này là phạm luật" rồi nhanh chóng đi đến nơi có bảo vệ hoặc thầy cô.',
      'Ghi chép lại thời gian, địa điểm và tên những người tham gia bắt nạt.'
    ],
    whenToSeekAdults: 'BẮT BUỘC VÀ NGAY LẬP TỨC! Đừng bao giờ im lặng chịu đựng vì sự nhẫn nhịn chỉ khiến kẻ bắt nạt lấn tới.',
    whoToTurnTo: [
      'Ban giám hiệu và bảo vệ nhà trường.',
      'Bố mẹ và người thân.',
      'Phòng tham vấn tâm lý học đường hoặc đường dây nóng phòng chống bạo lực học đường (1800 1567).'
    ]
  },
  {
    id: 'si-4',
    title: 'Bắt nạt trên không gian mạng (Cyberbullying)',
    icon: '💻',
    color: 'from-purple-400 to-violet-500',
    summary: 'Tung ảnh dìm, lập group kín nói xấu, giả mạo tài khoản mạng xã hội để bôi nhọ danh dự.',
    signs: [
      'Nhận hàng loạt tin nhắn nặc danh đe dọa hoặc chửi bới.',
      'Hình ảnh riêng tư bị cắt ghép ác ý và lan truyền trong các hội nhóm học sinh.',
      'Bị gắn thẻ vào các bài viết công kích công khai trên Facebook/TikTok.',
      'Cảm giác lo sợ mỗi khi nghe tiếng chuông thông báo điện thoại.'
    ],
    safeActions: [
      'KHÔNG XÓA: Chụp màn hình tất cả bằng chứng có hiển thị rõ link, tên tài khoản và ngày giờ.',
      'Chặn (Block) và Báo cáo (Report) ngay các tài khoản vi phạm cho nền tảng mạng xã hội.',
      'Không phản hồi, không đôi co với những bình luận khiêu khích.'
    ],
    whenToSeekAdults: 'Khi thông tin cá nhân của bạn bị lộ công khai (doxxing), bị tống tiền hoặc bị đe dọa bạo lực ngoài đời.',
    whoToTurnTo: [
      'Bố mẹ và thầy cô chủ nhiệm.',
      'Bộ phận an ninh mạng hoặc Công an khu vực nếu có dấu hiệu vu khống nghiêm trọng.',
      'Đường dây nóng hỗ trợ tâm lý và pháp lý trẻ em.'
    ]
  },
  {
    id: 'si-5',
    title: 'Áp lực thành tích & Kỳ vọng thầy cô',
    icon: '🏆',
    color: 'from-yellow-400 to-amber-500',
    summary: 'Áp lực phải duy trì danh hiệu học sinh giỏi, thi học sinh giỏi các cấp hoặc làm gương mẫu cho lớp.',
    signs: [
      'Luôn sợ hãi việc làm thầy cô thất vọng nếu lỡ bị điểm 8.',
      'Phải gánh vác quá nhiều chức vụ (lớp trưởng, bí thư, đội tuyển) mà không dám từ chối.',
      'Cảm thấy mình chỉ có giá trị khi mang lại thành tích cho tập thể.'
    ],
    safeActions: [
      'Học cách trò chuyện thẳng thắn với thầy cô về năng lực và mong muốn thực sự của bạn.',
      'Dũng cảm xin rút bớt khỏi một số đội tuyển nếu thấy bản thân đang bị kiệt sức.',
      'Nhớ rằng thầy cô tâm huyết sẽ luôn coi trọng sự hạnh phúc và trưởng thành của bạn hơn là những tấm huy chương.'
    ],
    whenToSeekAdults: 'Khi áp lực thành tích biến thành sự ám ảnh tâm lý khiến bạn không thể ăn ngủ bình thường.',
    whoToTurnTo: [
      'Thầy cô cố vấn học tập.',
      'Chuyên viên tâm lý học đường.',
      'Bố mẹ.'
    ]
  },
  {
    id: 'si-6',
    title: 'Cảm giác bị cô lập, lẻ loi giữa lớp học',
    icon: '😶',
    color: 'from-cyan-400 to-teal-500',
    summary: 'Không có ai để trò chuyện vào giờ ra chơi, phải ngồi ăn trưa một mình và cảm thấy vô hình giữa đám đông.',
    signs: [
      'Luôn là người cuối cùng còn lại khi chia cặp làm bài tập nhóm.',
      'Giờ ra chơi chỉ biết giả vờ ngủ hoặc cắm mặt vào điện thoại để đỡ ngượng.',
      'Không ai nhớ đến ngày sinh nhật hoặc rủ tham gia các buổi đi chơi chung của lớp.'
    ],
    safeActions: [
      'Bắt đầu từ những bước nhỏ: Mỉm cười, chào hỏi bạn cùng bàn hoặc cho bạn mượn cây bút.',
      'Tham gia các câu lạc bộ ngoại khóa theo sở thích (vẽ, bóng rổ, guitar) để gặp những người cùng đam mê.',
      'Nhận thức rằng tính cách hướng nội không phải là khuyết điểm; bạn chỉ cần 1 người bạn chất lượng thay vì một đám đông ồn ào.'
    ],
    whenToSeekAdults: 'Khi cảm giác cô lập kéo dài nhiều tháng khiến bạn rơi vào trạng thái trầm uất và chán ghét trường học.',
    whoToTurnTo: [
      'Phòng tham vấn học đường.',
      'Thầy cô phụ trách hoạt động Đoàn/Đội (họ có thể tạo cơ hội giúp bạn hòa nhập).',
      'Người thân trong gia đình.'
    ]
  }
];

export const STICKY_NOTES: StickyNote[] = [
  {
    id: 'sn-1',
    content: '“Mình từng nghĩ chỉ có một mình mình cảm thấy lạc lõng và kém cỏi như vậy. Nhưng khi đọc tâm sự của các bạn ở đây, mình nhận ra chúng ta đều đang cùng nhau lớn lên. Cố lên nhé!”',
    author: 'Cậu bạn lớp 11',
    color: 'bg-amber-100 text-amber-900 border-amber-200 rotate-[-1deg]',
    likes: 89,
    timestamp: 'Hôm nay'
  },
  {
    id: 'sn-2',
    content: '“Mình đã rất sợ nói chuyện với mẹ về bài thi thử tệ hại hôm trước. Nhưng khi mình lấy hết can đảm nói thật, mẹ đã ôm mình và bảo: ‘Mẹ thấy con vất vả rồi, không sao đâu’. Đừng giữ một mình bạn nhé!”',
    author: 'Mèo Con Dũng Cảm',
    color: 'bg-rose-100 text-rose-900 border-rose-200 rotate-[2deg]',
    likes: 124,
    timestamp: 'Hôm qua'
  },
  {
    id: 'sn-3',
    content: '“Điểm số thấp chỉ phản ánh một bài kiểm tra trong 45 phút, nó không phản ánh giá trị và tương lai của cả cuộc đời bạn. Hít thở sâu và mỉm cười nào!”',
    author: 'Cựu học sinh 18 tuổi',
    color: 'bg-emerald-100 text-emerald-900 border-emerald-200 rotate-[-2deg]',
    likes: 96,
    timestamp: '2 ngày trước'
  },
  {
    id: 'sn-4',
    content: '“Năm ngoái mình từng bị cả nhóm bạn tẩy chay vì không chịu hùa theo nói xấu người khác. Lúc đó đau đớn lắm, nhưng giờ nhìn lại mình thấy biết ơn vì đã dũng cảm giữ đúng lương tâm.”',
    author: 'Hoa Hướng Dương',
    color: 'bg-sky-100 text-sky-900 border-sky-200 rotate-[1deg]',
    likes: 142,
    timestamp: '3 ngày trước'
  },
  {
    id: 'sn-5',
    content: '“Bạn xinh đẹp nhất khi bạn là chính mình, không phải khi bạn cố gồng mình ép vào một tiêu chuẩn chỉnh sửa ảnh trên mạng xã hội đâu nha!”',
    author: 'Cô bạn đeo kính cận',
    color: 'bg-purple-100 text-purple-900 border-purple-200 rotate-[-1.5deg]',
    likes: 78,
    timestamp: '4 ngày trước'
  },
  {
    id: 'sn-6',
    content: '“Nếu hôm nay bạn chưa làm được việc gì to tát thì việc bạn vẫn kiên cường thức dậy và bước tiếp đã là một chiến thắng đáng tự hào rồi!”',
    author: 'Mầm Cây Nhỏ',
    color: 'bg-teal-100 text-teal-900 border-teal-200 rotate-[1.5deg]',
    likes: 165,
    timestamp: '5 ngày trước'
  }
];

export const EMERGENCY_CONTACTS = [
  {
    name: 'Đường dây nóng Tư vấn Tâm lý Ngày Đêm',
    number: '1900 6233',
    description: 'Tư vấn tâm lý chuyên sâu về các vấn đề trầm cảm, lo âu, mâu thuẫn gia đình và học đường cho thanh thiếu niên.',
    badge: 'Chuyên gia tâm lý',
    badgeColor: 'bg-blue-100 text-blue-800'
  },
  {
    name: 'Tổng đài Quốc gia Phòng chống Bạo lực Học đường',
    number: '1800 1567',
    description: 'Hỗ trợ can thiệp khẩn cấp khi gặp các trường hợp bị bạo lực, bắt nạt hoặc uy hiếp tại trường học.',
    badge: 'Hỗ trợ học đường',
    badgeColor: 'bg-amber-100 text-amber-800'
  },
  {
    name: 'Phòng Tham vấn Tâm lý Học đường',
    number: 'Tại trường của bạn',
    description: 'Nơi có thầy cô tư vấn tâm lý được đào tạo chuyên môn. Mọi câu chuyện bạn chia sẻ đều được bảo mật an toàn.',
    badge: 'Trực tiếp tại trường',
    badgeColor: 'bg-emerald-100 text-emerald-800'
  },
  {
    name: 'Cấp cứu Y tế Khẩn cấp',
    number: '115',
    description: 'Hỗ trợ y tế và cấp cứu tức thời trong các tình huống nguy cấp đến sức khỏe và tính mạng.',
    badge: 'Cấp cứu 24/7',
    badgeColor: 'bg-rose-100 text-rose-800'
  }
];
