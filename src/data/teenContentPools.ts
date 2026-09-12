// Extensive Content Pool for "Bạn ơi, mình nói nè"
// Covering Greetings, Questions, Mini Games, Micro-Tasks, Teen Situations, Messages, Reflections, and Daily Themes

export interface GreetingItem {
  id: string;
  text: string;
  subtext?: string;
  tag?: string;
}

export interface DailyThemeConfig {
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  dayName: string;
  themeTitle: string;
  moodBadge: string;
  description: string;
  accentColor: string;
}

export interface MicroTaskItem {
  id: string;
  title: string;
  duration: string;
  description: string;
  category: 'self-care' | 'kindness' | 'study' | 'relax';
  icon: string;
}

export interface ReflectionItem {
  id: string;
  question: string;
  prompt: string;
  moodHint?: string;
}

export interface TeenMessageItem {
  id: string;
  title: string;
  message: string;
  author: string;
  category: 'cheer' | 'reassure' | 'humor' | 'perspective';
}

export interface BrainThoughtItem {
  id: string;
  question: string;
  followUp: string;
  category: 'curious' | 'deep' | 'fun';
}

export interface TeenScenarioQuick {
  id: string;
  title: string;
  situation: string;
  options: {
    label: string;
    text: string;
    reaction: string;
    advice: string;
  }[];
}

export interface MiniGameQuickPick {
  id: string;
  type: 'ab' | 'would_you_rather';
  question: string;
  optionA: { text: string; emoji: string };
  optionB: { text: string; emoji: string };
  funComment: string;
}

// 1. DYNAMIC GREETINGS POOL
export const GREETINGS_POOL: GreetingItem[] = [
  { id: 'g1', text: 'Ê, hôm nay sao rồi? 👀', subtext: 'Có chuyện gì kể mình nghe với!', tag: 'bạn_thân' },
  { id: 'g2', text: 'Hôm nay có chuyện gì muốn kể không?', subtext: 'Chuyện to chuyện nhỏ gì cũng được hết á.', tag: 'lắng_nghe' },
  { id: 'g3', text: 'Một ngày nữa đã qua rồi. Bạn ổn chứ? 🌱', subtext: 'Thở phào một cái nào, bạn đã cố gắng nhiều rồi.', tag: 'ấm_áp' },
  { id: 'g4', text: 'Nay mood nào đây? 🎨', subtext: '100% không phán xét, mood nào cũng được chào đón.', tag: 'tò_mò' },
  { id: 'g5', text: 'Ghét hôm nay hay yêu hôm nay? =)))', subtext: 'Nếu ghét thì vào đây trút giận một tẹo nè.', tag: 'vui_vẻ' },
  { id: 'g6', text: 'Không cần có chuyện mới được ghé đây đâu.', subtext: 'Vào ngồi không, chơi mini game hoặc thở một tí thôi cũng được.', tag: 'thư_giãn' },
  { id: 'g7', text: 'Hôm nay mình làm gì nhỉ? ✨', subtext: 'Tâm sự, chơi một ván hay làm một việc nhỏ?', tag: 'khám_phá' },
  { id: 'g8', text: 'Cúp máy học xong có thở phào được tí nào không? 📚', subtext: 'Gác bài vở sang bên một chút, ở đây an toàn nè.', tag: 'học_đường' },
  { id: 'g9', text: 'Vừa lướt thấy bạn ghé, mừng quá nè! 🌷', subtext: 'Hôm nay thế giới có làm bạn mệt không?', tag: 'ấm_áp' },
  { id: 'g10', text: 'Nếu hôm nay hơi tệ, cho phép nó tệ một tí cũng được. 🌧️', subtext: 'Ngày mai tính tiếp, giờ cứ nghỉ ngơi đã nhé.', tag: 'an_ủi' },
  { id: 'g11', text: 'Alo alo, có ai cần một người nghe không phán xét không? 🎧', subtext: 'Mình vẫn ở đây nè, bạn cứ tự nhiên.', tag: 'bạn_thân' },
  { id: 'g12', text: 'Hôm nay bạn đã ăn gì ngon chưa? 🧋', subtext: 'Chăm sóc cái bụng trước, chuyện khác gỡ sau.', tag: 'nhẹ_nhàng' },
  { id: 'g13', text: 'Đến đây rồi thì cởi bớt gánh nặng xuống nhé. 🎒', subtext: 'Không ai chấm điểm bạn ở đây đâu!', tag: 'an_toàn' },
  { id: 'g14', text: 'Một góc bình yên dành riêng cho bạn hôm nay. 🛋️', subtext: 'Chỉ bạn và những suy nghĩ của chính mình.', tag: 'riêng_tư' }
];

// 2. DAILY THEMES (ROTATION BY DAY OF WEEK)
export const DAILY_THEMES: Record<number, DailyThemeConfig> = {
  1: {
    dayOfWeek: 1,
    dayName: 'Thứ Hai',
    themeTitle: '🎯 Reset tuần mới',
    moodBadge: 'Bắt đầu từ tốn thôi, không vội',
    description: 'Đầu tuần mới không nhất thiết phải hoàn hảo. Chỉ cần từng bước nhỏ một thôi nhé!',
    accentColor: 'from-blue-500/10 to-indigo-500/10'
  },
  2: {
    dayOfWeek: 2,
    dayName: 'Thứ Ba',
    themeTitle: '🎲 Một câu hỏi random',
    moodBadge: 'Tò mò & khám phá',
    description: 'Hôm nay thử kích hoạt não bộ bằng một câu hỏi ngẫu hứng và không có đáp án đúng sai.',
    accentColor: 'from-purple-500/10 to-pink-500/10'
  },
  3: {
    dayOfWeek: 3,
    dayName: 'Thứ Tư',
    themeTitle: '🧠 Thử nhìn chuyện này theo cách khác',
    moodBadge: 'Đổi góc nhìn xíu',
    description: 'Giữa tuần rồi, có chuyện gì đang làm bạn kẹt lại? Cùng lật ngược vấn đề xem sao nhé!',
    accentColor: 'from-teal-500/10 to-emerald-500/10'
  },
  4: {
    dayOfWeek: 4,
    dayName: 'Thứ Năm',
    themeTitle: '💬 Có chuyện gì muốn kể không?',
    moodBadge: 'Xả bớt cho nhẹ đầu',
    description: 'Có những ấm ức hay chuyện vụn vặt tích tụ mấy ngày nay, kể ra cho nhẹ nhõm nha.',
    accentColor: 'from-amber-500/10 to-orange-500/10'
  },
  5: {
    dayOfWeek: 5,
    dayName: 'Thứ Sáu',
    themeTitle: '😂 Cuối tuần tới rồi!',
    moodBadge: 'Sống sót qua tuần học rồi!',
    description: 'Đã đi hết cả tuần học căng thẳng! Bạn xứng đáng nhận một tràng pháo tay cực to!',
    accentColor: 'from-rose-500/10 to-pink-500/10'
  },
  6: {
    dayOfWeek: 6,
    dayName: 'Thứ Bảy',
    themeTitle: '🌱 Làm một điều nhỏ cho bản thân',
    moodBadge: 'Tự thưởng & chill',
    description: 'Hôm nay dành trọn thời gian để làm những điều bạn thật sự thấy thích và thoải mái.',
    accentColor: 'from-emerald-500/10 to-teal-500/10'
  },
  0: {
    dayOfWeek: 0,
    dayName: 'Chủ Nhật',
    themeTitle: '🪞 Tuần này của bạn thế nào?',
    moodBadge: 'Nhìn lại & thảnh thơi',
    description: 'Một khoảng lặng êm đềm trước khi bắt đầu chặng tiếp theo. Giữ lại những điều dịu dàng.',
    accentColor: 'from-sky-500/10 to-blue-500/10'
  }
};

// 3. MICRO-TASKS POOL (1 - 5 MINUTES)
export const MICRO_TASKS_POOL: MicroTaskItem[] = [
  {
    id: 'task_water',
    title: 'Uống một ngụm nước ấm & vươn vai 30 giây',
    duration: '1 phút',
    description: 'Rời mắt khỏi màn hình điện thoại/sách vở, uống một ngụm nước thật chậm và duỗi thẳng lưng.',
    category: 'self-care',
    icon: '💧'
  },
  {
    id: 'task_tidy',
    title: 'Dọn một góc nhỏ xíu trên bàn học',
    duration: '2 phút',
    description: 'Chỉ cần xếp lại 3 quyển sách hoặc bỏ đi mấy tờ giấy nháp cũ. Bàn gọn một chút, đầu óc thoáng một chút.',
    category: 'study',
    icon: '🧹'
  },
  {
    id: 'task_kind_message',
    title: 'Gửi một tin nhắn ngắn/meme vui cho một người bạn',
    duration: '1 phút',
    description: 'Một câu "Ê dạo này sao rồi?" hoặc thả một chiếc meme bựa. Đôi khi ai đó cũng đang cần kết nối như bạn.',
    category: 'kindness',
    icon: '💌'
  },
  {
    id: 'task_music',
    title: 'Nghe trọn vẹn 1 bài hát mà không làm gì khác',
    duration: '3 phút',
    description: 'Đeo tai nghe vào, nhắm mắt lại và chỉ lắng nghe giai điệu. Không lướt feed, không trả lời tin nhắn.',
    category: 'relax',
    icon: '🎧'
  },
  {
    id: 'task_write_not_bad',
    title: 'Viết ra 1 điều hôm nay không quá tệ',
    duration: '1 phút',
    description: 'Không cần chuyện vĩ đại. Một chiếc bánh ngon, tiết học trôi qua nhanh, hoặc thời tiết dễ chịu.',
    category: 'self-care',
    icon: '📝'
  },
  {
    id: 'task_window_gaze',
    title: 'Nhìn ra ngoài cửa sổ tìm 3 đồ vật màu xanh lá',
    duration: '2 phút',
    description: 'Giúp đôi mắt thư giãn sau hàng giờ nhìn màn hình hoặc trang sách, để tâm trí trôi nhẹ.',
    category: 'relax',
    icon: '🌿'
  },
  {
    id: 'task_forgive_self',
    title: 'Nói thầm một câu: "Hôm nay mình đã cố hết sức rồi"',
    duration: '30 giây',
    description: 'Những việc chưa xong thì để mai. Tối nay đừng tự dằn vặt hay so sánh mình với ai khác nữa.',
    category: 'self-care',
    icon: '🫂'
  },
  {
    id: 'task_breathe_478',
    title: 'Hít sâu bằng mũi 4 giây, thở ra bằng miệng 6 giây',
    duration: '1 phút',
    description: 'Lặp lại 3 lần. Nhịp tim sẽ chậm lại và cảm giác bồn chồn lo lắng sẽ dịu đi rõ rệt.',
    category: 'relax',
    icon: '🌬️'
  }
];

// 4. SHORT REFLECTIONS POOL (ONE QUESTION ONLY)
export const REFLECTIONS_POOL: ReflectionItem[] = [
  {
    id: 'ref_1',
    question: 'Hôm nay điều gì khiến bạn bất ngờ nhất?',
    prompt: 'Dù là một tin nhắn bất ngờ, một câu nói của ai đó, hay một phát hiện về chính mình...'
  },
  {
    id: 'ref_2',
    question: 'Có điều gì bạn muốn làm khác đi vào ngày mai?',
    prompt: 'Không phải tự trách, mà là một cơ hội mới để bạn thử một cách tiếp cận khác.'
  },
  {
    id: 'ref_3',
    question: 'Điều gì hôm nay đáng được giữ lại trong ký ức?',
    prompt: 'Một nụ cười, một lời khen, một khoảnh khắc bạn thấy lòng mình yên ả.'
  },
  {
    id: 'ref_4',
    question: 'Bạn đang nghĩ về chuyện gì nhiều nhất lúc này?',
    prompt: 'Viết nó ra đây để nó không còn chạy vòng quanh trong đầu bạn nữa.'
  },
  {
    id: 'ref_5',
    question: 'Một điều nhỏ xíu mà bạn đã làm tốt hôm nay?',
    prompt: 'Đã dậy đúng giờ, đã hoàn thành bài tập, hay đơn giản là đã kiên nhẫn vượt qua một ngày khó khăn.'
  },
  {
    id: 'ref_6',
    question: 'Nếu được gửi một lời nhắn cho chính bạn sáng nay, bạn sẽ nói gì?',
    prompt: 'Ví dụ: "Đừng lo, mọi chuyện rồi sẽ ổn cả thôi", hoặc "Nhớ uống nước nha!".'
  },
  {
    id: 'ref_7',
    question: 'Ai là người đã làm bạn thấy dễ chịu nhất trong ngày?',
    prompt: 'Nghĩ về họ một giây để thấy ấm áp hơn một chút.'
  }
];

// 5. TEEN MESSAGES POOL (RANDOM & PERSONALIZED)
export const TEEN_MESSAGES_POOL: TeenMessageItem[] = [
  {
    id: 'msg_1',
    title: 'Gửi bạn đang lo điểm số',
    message: 'Một bài kiểm tra điểm chưa như ý không có nghĩa là bạn kém cỏi. Nó chỉ nói rằng có một phần kiến thức cần xem lại thôi. Bạn có giá trị hơn rất nhiều so với những con số trên giấy kiểm tra.',
    author: 'Người bạn ở đây 🌱',
    category: 'reassure'
  },
  {
    id: 'msg_2',
    title: 'Gửi bạn đang thấy mình bị bỏ lại',
    message: 'Ai cũng có một nhịp độ riêng. Có bạn hoa nở mùa xuân, có bạn hoa nở mùa hạ. Đừng lấy thước đo của người khác để đo con đường của chính mình nhé!',
    author: 'Bạn ơi, mình nói nè',
    category: 'perspective'
  },
  {
    id: 'msg_3',
    title: 'Hôm nay lười một tí cũng không sao =)))',
    message: 'Robot còn cần sạc pin mà! Nếu hôm nay bạn không muốn làm gì vĩ đại thì cứ cuộn chăn nằm nghỉ đi. Năng lượng hồi phục rồi mai mình lại chiến tiếp.',
    author: 'Đồng minh của bạn 👀',
    category: 'humor'
  },
  {
    id: 'msg_4',
    title: 'Về những lời nhận xét vô duyên',
    message: 'Người ta nói gì về bạn phản ánh cách họ nhìn thế giới, chứ không phải con người thật của bạn. Bạn không có nghĩa vụ phải vừa lòng tất cả mọi người trên đời.',
    author: 'Lá chắn bình yên 🛡️',
    category: 'perspective'
  },
  {
    id: 'msg_5',
    title: 'Gửi những ngày không có gì vui',
    message: 'Không sao cả. Một ngày bình thường, thậm chí hơi chán một chút, cũng là một ngày thành công vì bạn đã vượt qua nó an toàn.',
    author: 'Góc nhỏ bình yên ☁️',
    category: 'cheer'
  },
  {
    id: 'msg_6',
    title: 'Nếu tin nhắn bị "seen" không trả lời',
    message: 'Đừng tự nghĩ ra 10 kịch bản xem mình đã làm sai gì. Có khi bạn ấy bận mẹ gọi đi ăn cơm, hoặc đang tắt mạng ôn thi thôi. Đừng làm khổ tâm trí mình nha!',
    author: 'Kinh nghiệm xương máu =)))',
    category: 'humor'
  }
];

// 6. BRAIN THOUGHTS / "NÃO NGHĨ GÌ?"
export const BRAIN_THOUGHTS_POOL: BrainThoughtItem[] = [
  {
    id: 'bt_1',
    question: 'Nếu được nghỉ học một ngày bất thình lình mà không bị tính phép, bạn sẽ làm gì từ sáng đến tối?',
    followUp: 'Ngủ nướng đến trưa, đi cà phê một mình, hay cày nát bộ phim yêu thích?',
    category: 'fun'
  },
  {
    id: 'bt_2',
    question: 'Có điều gì bạn từng nghĩ là cực kỳ quan trọng năm lớp 6-7, nhưng giờ nhìn lại thấy buồn cười không?',
    followUp: 'Con người chúng ta lớn lên nhanh hơn mình tưởng rất nhiều.',
    category: 'deep'
  },
  {
    id: 'bt_3',
    question: 'Nếu mood hôm nay của bạn là một bài hát, thì đó sẽ là bài gì?',
    followUp: 'Một bản ballad êm dịu, một bài pop sôi động hay nhạc lofi chill chill?',
    category: 'fun'
  },
  {
    id: 'bt_4',
    question: 'Khi buồn, bạn thích được người khác hỏi han quan tâm hay muốn được để yên một mình?',
    followUp: 'Biết rõ nhu cầu của mình là bước đầu tiên để thấy dễ chịu hơn.',
    category: 'deep'
  },
  {
    id: 'bt_5',
    question: 'Điều gì nhỏ xíu có thể ngay lập tức làm cho một ngày đi học trở nên dễ thở hơn?',
    followUp: 'Ví dụ: thầy cô quên kiểm tra bài cũ, bạn thân đem cho cây kẹo, hoặc tiết học được tan sớm 5 phút?',
    category: 'curious'
  }
];

// 7. REAL TEEN SITUATIONS / "CHUYỆN NÀY THÌ SAO?"
export const TEEN_SCENARIOS_QUICK: TeenScenarioQuick[] = [
  {
    id: 'scen_food_share',
    title: 'Bạn thân lấy đồ ăn của bạn rồi bảo: "Của bạn là của chung =)))"',
    situation: 'Bạn vừa mua chiếc bánh yêu thích, bạn thân xông vào cắn ngay một miếng to đùng rồi cười huề. Bạn hơi quạu nhưng không biết nên nói thế nào.',
    options: [
      {
        label: 'A',
        text: 'Cười trừ cho qua nhưng trong lòng cay cú cả buổi',
        reaction: '🫠 Kiểu này dễ làm bạn ôm ấm ức, lần sau bạn ấy lại làm tiếp!',
        advice: 'Tình bạn thân mấy thì ranh giới cá nhân vẫn quan trọng. Đừng nén sự khó chịu vào trong nhé.'
      },
      {
        label: 'B',
        text: 'Nói nửa đùa nửa thật: "Của chung cái đầu cậu ấy! Bắt đền trà sữa ngay =)))"',
        reaction: '✨ Chuẩn bài! Vừa đặt ranh giới vừa không làm căng thẳng bầu không khí.',
        advice: 'Cách này giữ được sự vui vẻ của bạn bè mà vẫn nhắc khéo rằng bạn không thích bị lấy tự nhiên như thế.'
      },
      {
        label: 'C',
        text: 'Quạu mặt giật lại, không nói chuyện suốt cả tiết học',
        reaction: '⚡ Hơi căng thẳng, bạn kia có thể thấy ngơ ngác không hiểu sao bạn giận dữ vậy.',
        advice: 'Nếu bạn đang mệt sẵn từ chuyện khác, phản ứng này dễ bùng nổ thành cãi nhau to.'
      }
    ]
  },
  {
    id: 'scen_seen_message',
    title: 'Gửi tin nhắn hẹn bạn nhưng bị "Seen" suốt 3 tiếng không rep',
    situation: 'Bạn nhắn tin rủ bạn đi học nhóm hoặc hỏi bài, màn hình hiện "Đã xem" từ 2 giờ trước nhưng đối phương vẫn im bặt.',
    options: [
      {
        label: 'A',
        text: 'Spam liên tục dấu chấm hỏi và hỏi: "Sao seen không rep?"',
        reaction: '👀 Dễ tạo cảm giác ngột ngạt hoặc đòi hỏi đối với người kia.',
        advice: 'Đôi khi người ta mở xem lúc đang dở tay rồi quên mất. Cứ thong thả đã.'
      },
      {
        label: 'B',
        text: 'Nghĩ chắc bạn ấy ghét mình rồi, tự dằn vặt bản thân',
        reaction: '💔 Não bộ chúng ta rất hay tự vẽ ra kịch bản tồi tệ nhất.',
        advice: '90% lý do người khác chưa rep là vì họ bận hoặc quên, không liên quan gì đến giá trị của bạn cả.'
      },
      {
        label: 'C',
        text: 'Đi làm việc khác, nếu việc gấp thì 1-2 tiếng sau chấm nhẹ một cái',
        reaction: '🌱 Cực kỳ bình thản và trưởng thành!',
        advice: 'Cuộc sống của bạn không dừng lại ở một thông báo tin nhắn. Cứ tập trung vào việc của mình trước.'
      }
    ]
  },
  {
    id: 'scen_low_score_parent',
    title: 'Vừa nhận bài kiểm tra 5 điểm, chiều về không biết mở lời với bố mẹ thế nào',
    situation: 'Bình thường môn này bạn được 7-8 điểm, lần này lỡ tay làm hỏng và biết chắc bố mẹ sẽ thất vọng.',
    options: [
      {
        label: 'A',
        text: 'Giấu nhẹm bài kiểm tra vào đáy cặp, đợi khi nào bị hỏi mới khai',
        reaction: '💣 Quả bom nổ chậm! Giấu càng lâu thì lúc bị phát hiện bố mẹ càng giận hơn.',
        advice: 'Sự thất vọng về điểm số không đáng sợ bằng việc mất lòng tin vì giấu giếm.'
      },
      {
        label: 'B',
        text: 'Chủ động đưa bài kèm lời giải thích: "Bài này con làm ẩu phần này, con đã xem lại cách giải rồi ạ"',
        reaction: '👑 Đỉnh cao của sự chủ động!',
        advice: 'Khi bạn đi kèm giải pháp và nhận trách nhiệm, người lớn sẽ thấy bạn đã thực sự nghiêm túc nhìn nhận.'
      },
      {
        label: 'C',
        text: 'Đổ lỗi: "Đề cô cho khó quá, cả lớp ai cũng điểm thấp"',
        reaction: '😐 Bố mẹ nghe câu này quen quá rồi nên thường sẽ không thông cảm đâu.',
        advice: 'So sánh với lớp chỉ làm câu chuyện thêm căng thẳng. Tập trung vào bài làm của chính mình sẽ tốt hơn.'
      }
    ]
  }
];

// 8. MINI GAMES: CHỌN NHANH & WOULD YOU RATHER
export const MINI_GAMES_POOL: MiniGameQuickPick[] = [
  {
    id: 'wyr_1',
    type: 'would_you_rather',
    question: 'Bạn thà chọn điều nào hơn?',
    optionA: { text: 'Bị gọi lên bảng nhưng làm được bài', emoji: '🧑‍🏫' },
    optionB: { text: 'Không bị gọi nhưng thấp thỏm lo suốt cả tiết', emoji: '🫣' },
    funComment: 'Thà đau một lần rồi ngồi chill còn hơn tim đập chân run suốt 45 phút đúng không? =)))'
  },
  {
    id: 'wyr_2',
    type: 'would_you_rather',
    question: 'Bạn thà chọn...',
    optionA: { text: 'Quên đem bài tập về nhà đã làm xong', emoji: '😭' },
    optionB: { text: 'Nhớ đem bài tập nhưng chưa làm chữ nào', emoji: '📝' },
    funComment: 'Cái cảm giác làm rồi mà để quên ở nhà nó cay đắng gấp mười lần chưa làm =)))'
  },
  {
    id: 'wyr_3',
    type: 'ab',
    question: 'Gu học tập của bạn:',
    optionA: { text: 'Bật nhạc không lời/lofi để tập trung', emoji: '🎧' },
    optionB: { text: 'Im lặng tuyệt đối không một tiếng động', emoji: '🤫' },
    funComment: 'Mỗi người có một tần số não bộ riêng, miễn là bạn thấy dễ vào đầu nhất là chuẩn!'
  },
  {
    id: 'wyr_4',
    type: 'ab',
    question: 'Khi tan học về nhà, việc đầu tiên bạn làm:',
    optionA: { text: 'Quăng cặp rồi nằm ườn trên giường lướt điện thoại', emoji: '🛏️' },
    optionB: { text: 'Đi tắm hoặc ăn một thứ gì đó ngay lập tức', emoji: '🍜' },
    funComment: 'Chiếc giường sau một ngày học mệt mỏi có lực hút mạnh hơn cả trọng lực Trái Đất =)))'
  },
  {
    id: 'wyr_5',
    type: 'would_you_rather',
    question: 'Bạn thà...',
    optionA: { text: 'Một tuần không dùng mạng xã hội', emoji: '📵' },
    optionB: { text: 'Một tuần ăn toàn những món mình không thích', emoji: '🥦' },
    funComment: 'Cai mạng xã hội có khi lại giúp đầu óc bớt drama và ngủ ngon hơn hẳn đấy!'
  }
];

// 9. FUN EMOJI DIAGNOSIS / "MOOD BẰNG 3 EMOJI"
export interface EmojiMoodResult {
  title: string;
  reaction: string;
  advice: string;
}

export const EMOJI_MOOD_OPTIONS = [
  { emoji: '😴', label: 'Thiếu ngủ' },
  { emoji: '🫠', label: 'Tan chảy/Mệt' },
  { emoji: '🤯', label: 'Nổ não' },
  { emoji: '✨', label: 'Có hy vọng' },
  { emoji: '🧋', label: 'Thèm ngọt' },
  { emoji: '😭', label: 'Muốn khóc' },
  { emoji: '🙃', label: 'Cười gượng' },
  { emoji: '🎧', label: 'Trốn vào nhạc' },
  { emoji: '🌱', label: 'Thấy yên ổn' },
  { emoji: '🔥', label: 'Bốc hỏa' },
  { emoji: '🛋️', label: 'Chỉ muốn nằm' },
  { emoji: '👀', label: 'Hóng biến' }
];

export function diagnoseEmojiMood(emojis: string[]): EmojiMoodResult {
  if (emojis.includes('😴') || emojis.includes('🫠') || emojis.includes('🛋️')) {
    return {
      title: 'Mood: "Pin yếu 5% cần cắm sạc khẩn cấp"',
      reaction: 'Cơ thể và tâm trí bạn đang biểu tình đòi nghỉ ngơi rồi kìa! =)))',
      advice: 'Tối nay tắm nước ấm sớm, buông điện thoại trước 23h và cho phép bản thân ngủ bù nhé.'
    };
  }
  if (emojis.includes('🤯') || emojis.includes('🔥')) {
    return {
      title: 'Mood: "Bộ nhớ quá tải, CPU đang bốc khói"',
      reaction: 'Có quá nhiều thứ dồn dập đổ ập xuống cùng một lúc đúng không?',
      advice: 'Đừng cố giải quyết mọi thứ trong tối nay. Viết ra 3 việc quan trọng nhất, làm 1 việc thôi, 2 việc kia để mai tính.'
    };
  }
  if (emojis.includes('✨') || emojis.includes('🌱') || emojis.includes('🧋')) {
    return {
      title: 'Mood: "Tươi tắn & Có chút ngọt ngào"',
      reaction: 'Năng lượng hôm nay dễ thương quá chừng! Giữ vững rung cảm tích cực này nha.',
      advice: 'Chia sẻ niềm vui nhỏ xíu này với một người bạn hoặc ghi nó vào nhật ký để lưu giữ lại.'
    };
  }
  return {
    title: 'Mood: "Hơi hỗn loạn nhưng vẫn ổn áp"',
    reaction: 'Một ngày nhiều sắc thái cảm xúc đan xen, chuyện rất đỗi bình thường của tuổi teen!',
    advice: 'Uống một ngụm nước, nghe một bài hát êm dịu để cân bằng lại nhịp thở nha.'
  };
}
