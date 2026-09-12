import { ChatTopicItem, SupportMode } from '../types';

export interface QuickStarter {
  id: string;
  icon: string;
  label: string;
  prompt: string;
  mode?: SupportMode;
  category?: string;
}

export const QUICK_STARTERS: QuickStarter[] = [
  {
    id: 'lazy-study',
    icon: '⚡',
    label: 'Mình lười học quá',
    prompt: 'Mình lười học quá, nhìn đống bài tập mà không có chút động lực nào...',
    category: 'Học tập'
  },
  {
    id: 'exam-tomorrow',
    icon: '⏳',
    label: 'Mai kiểm tra chưa học gì',
    prompt: 'Mai kiểm tra mà mình chưa học gì cả 😭',
    category: 'Học tập'
  },
  {
    id: 'seen-no-reply',
    icon: '👀',
    label: 'Bạn kia seen không rep',
    prompt: 'Nó không rep mình 2 tiếng rồi, chắc nó ghét mình rồi...',
    category: 'Tình cảm'
  },
  {
    id: 'dont-know',
    icon: '💭',
    label: 'Không biết nữa...',
    prompt: 'Không biết nữa... tự nhiên thấy lòng trống rỗng và chán quá.',
    category: 'Cảm xúc'
  },
  {
    id: 'tired-today',
    icon: '🪫',
    label: 'Hôm nay mệt quá',
    prompt: 'Hôm nay mệt quá, hết sạch pin rồi =))',
    category: 'Cảm xúc'
  },
  {
    id: 'combo-stress',
    icon: '🌪️',
    label: 'Combo 3 tầng: học, bạn, gia đình',
    prompt: 'Mình vừa áp lực học, vừa cãi nhau với bạn, vừa bị bố mẹ mắng...',
    category: 'Quá tải'
  },
  {
    id: 'listen-only',
    icon: '🫂',
    label: 'Chỉ nghe mình thôi',
    prompt: 'Đoạn này mình chỉ muốn được lắng nghe thôi, không cần lời khuyên đâu nhé.',
    mode: 'listen'
  },
  {
    id: 'small-things',
    icon: '👕',
    label: 'Mai mặc gì?',
    prompt: 'Mai chẳng biết mặc gì đi học luôn á.',
    category: 'Đời sống'
  }
];

export const CHAT_TOPICS: ChatTopicItem[] = [
  {
    id: 'study',
    name: 'Học tập',
    icon: '📚',
    description: 'Lười học, mất động lực, sợ kiểm tra, áp lực điểm số và cách chia nhỏ bài vở',
    starterPrompt: 'Mình lười học quá, cứ ngồi vào bàn là mất tập trung...',
    subtopics: [
      'Lười học & mất động lực',
      'Mai kiểm tra chưa học gì',
      'Áp lực điểm số & kỳ vọng',
      'Học mãi mà điểm vẫn thấp',
      'Trì hoãn (procrastination)',
      'Không hiểu bài, ngại hỏi thầy cô',
      'Quản lý thời gian học'
    ]
  },
  {
    id: 'romance',
    name: 'Tình cảm & Crush',
    icon: '💌',
    description: 'Thích một người, crush seen không rep, sợ bị từ chối và giữ sự tỉnh táo',
    starterPrompt: 'Bạn kia seen tin nhắn của mình 2 tiếng rồi không rep...',
    subtopics: [
      'Crush seen không rep / lạnh nhạt',
      'Thích một người nhưng sợ tỏ tình',
      'Không biết người ta có thích mình không',
      'Phân biệt tín hiệu thật vs suy đoán',
      'Muốn nhắn tin nhưng không biết nói gì',
      'Cảm giác ghen hoặc hụt hẫng'
    ]
  },
  {
    id: 'friends',
    name: 'Bạn bè',
    icon: '🫂',
    description: 'Cãi nhau, bạn thân thay đổi, bị bỏ rơi và cách trò chuyện thẳng thắn',
    starterPrompt: 'Bạn thân của mình dạo này không nói chuyện với mình nữa.',
    subtopics: [
      'Cãi nhau với bạn thân',
      'Bạn thân dần xa cách / có bạn mới',
      'Cảm giác không thuộc về nhóm',
      'Bị trêu chọc / nói xấu sau lưng',
      'Hiểu lầm chưa giải quyết',
      'Khó kết bạn mới'
    ]
  },
  {
    id: 'family',
    name: 'Gia đình',
    icon: '🏠',
    description: 'Bố mẹ so sánh, bất đồng quan điểm, cảm giác bị kiểm soát',
    starterPrompt: 'Bố mẹ lúc nào cũng so sánh mình với con nhà người ta.',
    subtopics: [
      'Bị so sánh với người khác',
      'Bố mẹ không hiểu và không lắng nghe',
      'Cảm giác bị kiểm soát quá mức',
      'Tranh cãi chuyện định hướng tương lai',
      'Khó mở lời tâm sự với người thân'
    ]
  },
  {
    id: 'emotions',
    name: 'Cảm xúc & Tâm trạng',
    icon: '💗',
    description: 'Buồn, stress, quá tải, combo nhiều tầng hoặc chỉ đơn giản là "không biết nữa"',
    starterPrompt: 'Không biết nữa... tự nhiên thấy lòng nặng trĩu mà không rõ là vì sao.',
    subtopics: [
      '"Không biết nữa" / Trống rỗng',
      'Combo 3 tầng: học + bạn + nhà',
      'Hôm nay mệt quá / hết pin',
      'Tự ti về ngoại hình / năng lực',
      'Lo lắng về tương lai',
      'Tức giận nhưng không nói ra được'
    ]
  },
  {
    id: 'daily-life',
    name: 'Đời sống & Chuyện nhỏ',
    icon: '🌱',
    description: 'Chán, lười, mất ngủ, mai mặc gì, những chuyện rất nhỏ không cần bi kịch hóa',
    starterPrompt: 'Hôm nay chán quá, chẳng biết làm gì luôn...',
    subtopics: [
      'Mai mặc gì đi học?',
      'Hôm nay chán quá không biết làm gì',
      'Mất ngủ / thức khuya lướt web',
      'Lịch sinh hoạt lộn xộn',
      'Kể chuyện vui / chuyện quê hôm nay',
      'Chơi random question / đố vui'
    ]
  },
  {
    id: 'social-media',
    name: 'Mạng xã hội & FOMO',
    icon: '📱',
    description: 'Áp lực hình ảnh, so sánh bản thân trên mạng, drama và bình luận tiêu cực',
    starterPrompt: 'Lướt mạng xã hội nhiều làm mình cảm thấy bất an và so sánh bản thân quá.',
    subtopics: [
      'Hội chứng sợ bỏ lỡ (FOMO)',
      'So sánh mình với ảnh lung linh của người khác',
      'Đọc bình luận tiêu cực / drama',
      'Nghiện điện thoại và mất tập trung',
      'Áp lực phải có nhiều tương tác/like'
    ]
  }
];

export interface ConversationPreset {
  id: string;
  title: string;
  tag: string;
  userPrompt: string;
  botReply: string;
}

export const PRESET_CONVERSATIONS: ConversationPreset[] = [
  {
    id: 'lazy-study-sample',
    title: 'Mình lười học quá',
    tag: 'Học tập',
    userPrompt: 'Tớ lười học quá.',
    botReply: `Vậy đừng bắt đầu bằng ‘hôm nay phải học thật nhiều’. Chọn đúng một bài hoặc một câu thôi. Làm xong rồi mới quyết định có làm tiếp không. Não thường ngại cái mốc ‘3 tiếng học’, chứ 5 phút thì dễ bắt đầu hơn.

Cậu đang lười vì mệt thật hay nhìn đống bài là tự thấy ngợp vậy?`
  },
  {
    id: 'exam-tomorrow-sample',
    title: 'Mai kiểm tra mà chưa học gì',
    tag: 'Học tập',
    userPrompt: 'Mai kiểm tra mà tớ chưa học gì cả 😭',
    botReply: `Ok, vậy giờ đừng cố cày hết nữa nha. Mình cứu phần dễ ăn điểm trước:
1. Xem lại công thức hoặc ý chính tóm tắt.
2. Làm 2–3 câu cơ bản cho chắc tay.
3. Đánh dấu phần chưa hiểu để mai ngó nhanh lại.

Có 30 phút vẫn cứu được kha khá điểm ấy. Mai cậu kiểm tra môn gì thế?`
  },
  {
    id: 'crush-seen-sample',
    title: 'Nó không rep 2 tiếng = nó ghét mình',
    tag: 'Tình cảm',
    userPrompt: 'Nó không rep tớ 2 tiếng rồi, chắc nó ghét tớ rồi...',
    botReply: `Khoan kết luận nhanh vậy =)) Người ta chưa rep chưa đủ để chứng minh người ta ghét cậu hay bơ cậu đâu.

Có thể họ bận, quên điện thoại hoặc đơn giản là chưa biết rep gì cho mượt. Sự kiện là họ chưa rep, còn ‘họ ghét mình’ chỉ là suy đoán thôi. Cứ để đấy lát xem sao, đừng vội tự dằn vặt nha!`
  },
  {
    id: 'dont-know-sample',
    title: 'Khi cậu nói: "Không biết nữa"',
    tag: 'Cảm xúc',
    userPrompt: 'Không biết nữa...',
    botReply: `Ừ, không sao, vậy mình không cần đào nguyên nhân ngay.
Cậu đang thấy mệt, buồn, chán hay kiểu đầu óc trống rỗng? Cái gì đang làm cậu khó chịu nhất lúc này?`
  },
  {
    id: 'combo-sample',
    title: 'Combo 3 tầng: học + bạn + gia đình',
    tag: 'Quá tải',
    userPrompt: 'Tớ vừa áp lực học vừa cãi nhau với bạn vừa bị bố mẹ mắng...',
    botReply: `Ok, hôm nay hơi bị combo nhiều tầng rồi 😭 Đừng ôm đồm giải quyết cả ba cùng lúc.
Mình xử cái đang gấp nhất trước.

Chuyện nào đang khiến cậu nặng đầu nhất ngay lúc này: chuyện học, bạn bè hay gia đình?`
  },
  {
    id: 'tired-stay-sample',
    title: 'Hôm nay mệt quá',
    tag: 'Lắng nghe',
    userPrompt: 'Hôm nay mệt quá.',
    botReply: `Nghe thôi là thấy hôm nay cậu bị vắt kiệt năng lượng rồi 😭 Thôi, kể tớ nghe xem hôm nay có chuyện gì nào.`
  },
  {
    id: 'dont-want-tell-sample',
    title: 'Thôi, không muốn kể',
    tag: 'Tôn trọng',
    userPrompt: 'Thôi, không muốn kể.',
    botReply: `Ok =)) Không đào nữa. Muốn tớ kéo cậu sang chuyện khác không? Tớ có thể đố vui một câu, hỏi cậu một câu random nhẹ nhàng, hoặc kể chuyện xàm cho vui!`
  },
  {
    id: 'family-compare-sample',
    title: 'Bố mẹ lúc nào cũng so sánh',
    tag: 'Gia đình',
    userPrompt: 'Bố mẹ lúc nào cũng so sánh tớ với con nhà người ta.',
    botReply: `Cứ hễ mở miệng ra là bị đem lên bàn cân so sánh với "con nhà người ta" thì bực với tủi thân thật sự... Cảm giác bao nhiêu cố gắng của mình người lớn chẳng thèm nhìn tới. Cậu cứ xả hết ra đây với tớ nè.`
  }
];

