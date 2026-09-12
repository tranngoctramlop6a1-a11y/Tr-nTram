export interface EmotionItem {
  id: string;
  emoji: string;
  label: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  hoverClass: string;
  description: string;
}

export interface TopicItem {
  id: string;
  icon: string;
  label: string;
  categoryHint?: string;
}

export interface ReasonItem {
  id: string;
  icon: string;
  label: string;
}

export interface TopicReasonConfig {
  question: string;
  reasons: ReasonItem[];
}

export interface CheckinResultSummary {
  emotion: EmotionItem;
  topic: TopicItem;
  reason: ReasonItem;
  advice: {
    title: string;
    quote: string;
    content: string[];
    actionTakeaway?: string;
  };
}

export const EMOTIONS_LIST: EmotionItem[] = [
  {
    id: 'happy',
    emoji: '😊',
    label: 'Vui',
    colorClass: 'text-amber-600',
    bgClass: 'bg-amber-50/80',
    borderClass: 'border-amber-200',
    hoverClass: 'hover:border-amber-400 hover:bg-amber-100/60',
    description: 'Thấy vui vẻ, hứng khởi hoặc có điều dễ thương'
  },
  {
    id: 'fine',
    emoji: '🙂',
    label: 'Ổn áp',
    colorClass: 'text-emerald-600',
    bgClass: 'bg-emerald-50/80',
    borderClass: 'border-emerald-200',
    hoverClass: 'hover:border-emerald-400 hover:bg-emerald-100/60',
    description: 'Mọi việc diễn ra suôn sẻ, khá thoải mái'
  },
  {
    id: 'neutral',
    emoji: '😐',
    label: 'Bình thường',
    colorClass: 'text-slate-600',
    bgClass: 'bg-slate-50/80',
    borderClass: 'border-slate-200',
    hoverClass: 'hover:border-slate-400 hover:bg-slate-100/60',
    description: 'Một ngày trôi qua đều đều, không có gì mới'
  },
  {
    id: 'sad',
    emoji: '😔',
    label: 'Hơi buồn',
    colorClass: 'text-sky-600',
    bgClass: 'bg-sky-50/80',
    borderClass: 'border-sky-200',
    hoverClass: 'hover:border-sky-400 hover:bg-sky-100/60',
    description: 'Tâm trạng chùng xuống, có chút hụt hẫng'
  },
  {
    id: 'stressed',
    emoji: '😣',
    label: 'Áp lực',
    colorClass: 'text-rose-600',
    bgClass: 'bg-rose-50/80',
    borderClass: 'border-rose-200',
    hoverClass: 'hover:border-rose-400 hover:bg-rose-100/60',
    description: 'Nặng đầu, quá tải hoặc bị kỳ vọng dồn nén'
  },
  {
    id: 'anxious',
    emoji: '😰',
    label: 'Lo lắng',
    colorClass: 'text-violet-600',
    bgClass: 'bg-violet-50/80',
    borderClass: 'border-violet-200',
    hoverClass: 'hover:border-violet-400 hover:bg-violet-100/60',
    description: 'Bồn chồn, sợ điều gì đó không hay sắp tới'
  },
  {
    id: 'lonely',
    emoji: '🥺',
    label: 'Cô đơn',
    colorClass: 'text-pink-600',
    bgClass: 'bg-pink-50/80',
    borderClass: 'border-pink-200',
    hoverClass: 'hover:border-pink-400 hover:bg-pink-100/60',
    description: 'Cảm giác lạc lõng, không ai thực sự hiểu mình'
  },
  {
    id: 'angry',
    emoji: '😡',
    label: 'Bực mình',
    colorClass: 'text-orange-600',
    bgClass: 'bg-orange-50/80',
    borderClass: 'border-orange-200',
    hoverClass: 'hover:border-orange-400 hover:bg-orange-100/60',
    description: 'Khó chịu, bức xúc vì một việc không như ý'
  },
  {
    id: 'confused',
    emoji: '🤷',
    label: 'Mình cũng không biết nữa',
    colorClass: 'text-teal-600',
    bgClass: 'bg-teal-50/80',
    borderClass: 'border-teal-200',
    hoverClass: 'hover:border-teal-400 hover:bg-teal-100/60',
    description: 'Cảm xúc hỗn độn, trống rỗng hoặc mơ hồ'
  }
];

// Step 2 topics mapped by emotion
export const EMOTION_TOPICS: Record<string, TopicItem[]> = {
  stressed: [
    { id: 'study', icon: '📚', label: 'Học tập' },
    { id: 'family', icon: '🏠', label: 'Gia đình' },
    { id: 'friends', icon: '🫂', label: 'Bạn bè' },
    { id: 'romance', icon: '💗', label: 'Chuyện tình cảm' },
    { id: 'social_media', icon: '📱', label: 'Mạng xã hội' },
    { id: 'no_rest', icon: '⏰', label: 'Không có thời gian nghỉ' },
    { id: 'overwhelmed', icon: '🤯', label: 'Quá nhiều thứ cùng lúc' },
    { id: 'unknown', icon: '❓', label: 'Mình cũng không biết' }
  ],
  sad: [
    { id: 'friends', icon: '🫂', label: 'Bạn bè' },
    { id: 'family', icon: '🏠', label: 'Gia đình' },
    { id: 'study', icon: '📚', label: 'Học tập' },
    { id: 'romance', icon: '💗', label: 'Một mối quan hệ' },
    { id: 'social_media', icon: '📱', label: 'Mạng xã hội' },
    { id: 'personal', icon: '🌧️', label: 'Chuyện cá nhân' },
    { id: 'unknown', icon: '❓', label: 'Không biết vì sao' }
  ],
  anxious: [
    { id: 'exam_scores', icon: '📚', label: 'Bài kiểm tra / điểm số' },
    { id: 'presentation', icon: '🎤', label: 'Thuyết trình / giao tiếp' },
    { id: 'friends', icon: '🫂', label: 'Bạn bè' },
    { id: 'family', icon: '🏠', label: 'Gia đình' },
    { id: 'future', icon: '🔮', label: 'Lo về tương lai' },
    { id: 'current_event', icon: '💭', label: 'Một chuyện đang xảy ra' },
    { id: 'unknown', icon: '❓', label: 'Không biết vì sao' }
  ],
  lonely: [
    { id: 'friends', icon: '🫂', label: 'Bạn bè & nhóm chơi' },
    { id: 'family', icon: '🏠', label: 'Ở nhà với bố mẹ' },
    { id: 'school', icon: '🏫', label: 'Môi trường lớp học' },
    { id: 'social_media', icon: '📱', label: 'Lướt mạng xã hội' },
    { id: 'differing', icon: '🌱', label: 'Tự thấy mình khác biệt' },
    { id: 'no_confidant', icon: '🤐', label: 'Không có ai để trút bỏ' },
    { id: 'unknown', icon: '❓', label: 'Không rõ lý do' }
  ],
  angry: [
    { id: 'misunderstood', icon: '😤', label: 'Bị hiểu lầm / oan ức' },
    { id: 'comparison', icon: '👥', label: 'Bị so sánh hoặc áp đặt' },
    { id: 'disrespect', icon: '💔', label: 'Bạn bè không tôn trọng' },
    { id: 'family_conflict', icon: '🏠', label: 'Bất đồng với người lớn' },
    { id: 'unfair_rules', icon: '📚', label: 'Quy định / chuyện ở trường' },
    { id: 'failed_plan', icon: '🌪️', label: 'Mọi việc đổ vỡ ngoài ý muốn' },
    { id: 'unknown', icon: '❓', label: 'Tự nhiên thấy bực bội' }
  ],
  confused: [
    { id: 'hazy', icon: '🌫️', label: 'Mọi thứ cứ mông lung' },
    { id: 'empty', icon: '🕳️', label: 'Cảm thấy trống rỗng' },
    { id: 'drained', icon: '🔋', label: 'Mệt mỏi không rõ nguyên cớ' },
    { id: 'too_many_little_things', icon: '🧩', label: 'Nhiều chuyện vụn vặt dồn lại' },
    { id: 'need_quiet', icon: '🛋️', label: 'Chỉ muốn được ngồi yên' },
    { id: 'unknown', icon: '❓', label: 'Không thể gọi tên được' }
  ],
  happy: [
    { id: 'study_success', icon: '🎉', label: 'Điểm tốt / được ghi nhận' },
    { id: 'friends_fun', icon: '🫂', label: 'Khoảnh khắc vui với bạn bè' },
    { id: 'hobby_done', icon: '🎨', label: 'Hoàn thành việc mình yêu thích' },
    { id: 'family_warm', icon: '🏠', label: 'Gia đình đầm ấm, vui vẻ' },
    { id: 'cute_moment', icon: '🌸', label: 'Một điều nhỏ nhắn dễ thương' },
    { id: 'peaceful', icon: '☀️', label: 'Tâm trạng nhẹ nhõm, tự do' }
  ],
  fine: [
    { id: 'smooth_day', icon: '☀️', label: 'Mọi việc diễn ra suôn sẻ' },
    { id: 'resting', icon: '☕', label: 'Đang được nghỉ ngơi' },
    { id: 'balanced_study', icon: '📖', label: 'Học hành vừa sức' },
    { id: 'good_talk', icon: '💬', label: 'Vừa nói chuyện vui vẻ' },
    { id: 'peaceful', icon: '🍃', label: 'Không vướng bận điều gì' }
  ],
  neutral: [
    { id: 'routine', icon: '📅', label: 'Một ngày trôi qua bình thường' },
    { id: 'nothing_special', icon: '☕', label: 'Chưa có gì đặc biệt' },
    { id: 'a_bit_bored', icon: '☁️', label: 'Hơi buồn chán một chút' },
    { id: 'waiting', icon: '⏳', label: 'Đang chờ một điều gì mới' },
    { id: 'just_existing', icon: '🌱', label: 'Chỉ đang thả trôi ngày dài' }
  ]
};

// Step 3 question and reasons generator
export function getStep3Config(emotionId: string, topicId: string): TopicReasonConfig {
  // Stressed -> Study
  if (topicId === 'study' || topicId === 'exam_scores') {
    return {
      question: 'Điều gì đang khiến chuyện học tập trở nên nặng nề với bạn?',
      reasons: [
        { id: 'too_much_homework', icon: '📚', label: 'Mình có quá nhiều bài' },
        { id: 'fear_low_grades', icon: '😰', label: 'Mình sợ điểm thấp' },
        { id: 'disappoint_parents', icon: '👨‍👩‍👧', label: 'Mình sợ làm bố mẹ thất vọng' },
        { id: 'achievement_pressure', icon: '🏆', label: 'Mình đang bị áp lực thành tích' },
        { id: 'poor_time_management', icon: '⏰', label: 'Mình không biết sắp xếp thời gian' },
        { id: 'hard_to_focus', icon: '😵', label: 'Mình học nhưng không vào' },
        { id: 'other_reason', icon: '❓', label: 'Một lý do khác' }
      ]
    };
  }

  // Friends
  if (topicId === 'friends' || topicId === 'friends_fun' || topicId === 'disrespect') {
    return {
      question: 'Chuyện gì đang xảy ra với tình bạn của bạn?',
      reasons: [
        { id: 'argued', icon: '💬', label: 'Tụi mình cãi nhau' },
        { id: 'silent_treatment', icon: '🥺', label: 'Bạn ấy không nói chuyện với mình nữa' },
        { id: 'left_out', icon: '👥', label: 'Mình cảm thấy bị bỏ rơi' },
        { id: 'hard_to_fit_in', icon: '😶', label: 'Mình khó hòa nhập với nhóm' },
        { id: 'best_friend_closer_to_other', icon: '💔', label: 'Bạn thân có người khác thân hơn' },
        { id: 'unspoken_secret', icon: '🤐', label: 'Có một chuyện mình không dám nói' },
        { id: 'other_reason', icon: '❓', label: 'Một chuyện khác' }
      ]
    };
  }

  // Family
  if (topicId === 'family' || topicId === 'family_conflict' || topicId === 'comparison') {
    return {
      question: 'Điều gì trong gia đình đang khiến bạn bận tâm?',
      reasons: [
        { id: 'compared_to_others', icon: '👥', label: 'Bị so sánh với "con nhà người ta"' },
        { id: 'parents_dont_understand', icon: '🗣️', label: 'Bố mẹ không chịu lắng nghe mình' },
        { id: 'high_expectations', icon: '📈', label: 'Kỳ vọng quá lớn từ người lớn' },
        { id: 'family_tension', icon: '⚡', label: 'Không khí trong nhà căng thẳng' },
        { id: 'no_privacy', icon: '🚪', label: 'Thiếu không gian riêng tư' },
        { id: 'afraid_to_confide', icon: '🤐', label: 'Không dám nói thật cảm xúc với bố mẹ' },
        { id: 'other_reason', icon: '❓', label: 'Một chuyện trong nhà khác' }
      ]
    };
  }

  // Romance
  if (topicId === 'romance') {
    return {
      question: 'Có điều gì đang làm rung động hoặc xáo trộn trái tim bạn?',
      reasons: [
        { id: 'crush_unreturned', icon: '💌', label: 'Thích một người nhưng không dám nói' },
        { id: 'misunderstanding', icon: '💔', label: 'Có hiểu lầm giữa hai đứa' },
        { id: 'drifted_apart', icon: '🍂', label: 'Cảm giác người ấy dần xa cách' },
        { id: 'rumors', icon: '🗣️', label: 'Mọi người bàn tán hoặc trêu chọc' },
        { id: 'confused_feelings', icon: '💭', label: 'Không chắc cảm xúc của mình là gì' },
        { id: 'other_reason', icon: '❓', label: 'Một chuyện khó nói khác' }
      ]
    };
  }

  // Social Media
  if (topicId === 'social_media') {
    return {
      question: 'Điều gì trên mạng xã hội đang tác động đến tâm trạng bạn?',
      reasons: [
        { id: 'fomo', icon: '👀', label: 'Thấy ai cũng giỏi và vui hơn mình' },
        { id: 'waiting_likes', icon: '👍', label: 'Bận tâm về like hay tin nhắn rep chậm' },
        { id: 'toxic_comments', icon: '💬', label: 'Đọc phải bình luận ác ý hoặc thị phi' },
        { id: 'screen_fatigue', icon: '📱', label: 'Lướt quá nhiều khiến đầu óc mệt mỏi' },
        { id: 'fear_of_missing_out', icon: '⚡', label: 'Sợ bị tụt hậu nếu không online' },
        { id: 'other_reason', icon: '❓', label: 'Một điều khác trên mạng' }
      ]
    };
  }

  // Presentation / Communication
  if (topicId === 'presentation') {
    return {
      question: 'Điều gì trong việc giao tiếp hay phát biểu làm bạn lo nhất?',
      reasons: [
        { id: 'fear_mistakes', icon: '🥶', label: 'Sợ nói sai rồi bị cười' },
        { id: 'crowd_anxiety', icon: '👥', label: 'Đứng trước đông người là tim đập nhanh' },
        { id: 'forgot_words', icon: '📑', label: 'Sợ bị quên mất những gì đã chuẩn bị' },
        { id: 'awkward_social', icon: '🤐', label: 'Không biết bắt đầu cuộc trò chuyện thế nào' },
        { id: 'other_reason', icon: '❓', label: 'Một lý do giao tiếp khác' }
      ]
    };
  }

  // Future
  if (topicId === 'future') {
    return {
      question: 'Bạn đang băn khoăn điều gì nhất về chặng đường sắp tới?',
      reasons: [
        { id: 'dont_know_passions', icon: '🧭', label: 'Chưa biết mình thích hay giỏi điều gì' },
        { id: 'career_choice', icon: '🎯', label: 'Áp lực chọn ban, chọn ngành, chọn trường' },
        { id: 'fear_failure', icon: '🌧️', label: 'Sợ sau này mình không thành công' },
        { id: 'falling_behind_peers', icon: '🏃', label: 'Sợ đi chậm hơn bạn bè cùng lứa' },
        { id: 'other_reason', icon: '❓', label: 'Một nỗi lo tương lai khác' }
      ]
    };
  }

  // Overwhelmed or No rest
  if (topicId === 'overwhelmed' || topicId === 'no_rest' || topicId === 'drained') {
    return {
      question: 'Cảm giác quá tải này đang đè nặng lên bạn như thế nào?',
      reasons: [
        { id: 'packed_schedule', icon: '⏰', label: 'Lịch học và lịch thêm kín mít cả tuần' },
        { id: 'sleep_deprived', icon: '🥱', label: 'Thiếu ngủ triền miên, dậy là thấy mệt' },
        { id: 'cant_say_no', icon: '🤝', label: 'Cố nhận thêm việc vì sợ từ chối' },
        { id: 'mentally_exhausted', icon: '🧠', label: 'Đầu óc lúc nào cũng phải suy nghĩ' },
        { id: 'other_reason', icon: '❓', label: 'Một nguyên nhân làm kiệt sức khác' }
      ]
    };
  }

  // Positive: Happy / Fine reasons
  if (emotionId === 'happy' || emotionId === 'fine') {
    return {
      question: 'Điều gì đã thắp sáng khoảnh khắc ấm áp này của bạn vậy?',
      reasons: [
        { id: 'achieved_goal', icon: '🎯', label: 'Vừa hoàn thành một mục tiêu nho nhỏ' },
        { id: 'shared_laughter', icon: '😂', label: 'Có những tràng cười sảng khoái' },
        { id: 'felt_appreciated', icon: '❤️', label: 'Cảm nhận được sự yêu thương và công nhận' },
        { id: 'simple_treat', icon: '🍦', label: 'Một món ăn ngon hoặc bài nhạc hay' },
        { id: 'rested_well', icon: '✨', label: 'Được nghỉ ngơi thảnh thơi thực sự' },
        { id: 'other_reason', icon: '🌸', label: 'Một niềm vui giản dị khác' }
      ]
    };
  }

  // Default fallback for any other topic
  return {
    question: 'Điều gì đang tác động sâu nhất đến tâm trạng hiện tại của bạn?',
    reasons: [
      { id: 'sudden_wave', icon: '🌊', label: 'Cảm giác này tự nhiên ùa đến' },
      { id: 'unresolved_thought', icon: '💭', label: 'Một chuyện cứ luẩn quẩn trong đầu' },
      { id: 'physical_tiredness', icon: '🔋', label: 'Cơ thể mệt nên tinh thần cũng chùng theo' },
      { id: 'hard_to_name', icon: '🌫️', label: 'Nhiều thứ trộn lẫn vào nhau' },
      { id: 'other_reason', icon: '❓', label: 'Một lý do khác' }
    ]
  };
}

// Step 5 & 6: Personalized advice builder based on Emotion + Topic + Reason
export function getPersonalizedAdvice(
  emotion: EmotionItem,
  topic: TopicItem,
  reason: ReasonItem
): {
  title: string;
  quote: string;
  content: string[];
  actionTakeaway?: string;
} {
  const eId = emotion.id;
  const tId = topic.id;
  const rId = reason.id;

  // Case 1: Buồn + Bạn bè + "Cảm thấy bị bỏ rơi" (Exact example in prompt)
  if (eId === 'sad' && tId === 'friends' && rId === 'left_out') {
    return {
      title: 'Gửi bạn đang thấy hụt hẫng trong tình bạn',
      quote: '“Một bước lùi tạm thời không có nghĩa là bạn bị bỏ lại mãi mãi.”',
      content: [
        'Cảm giác bị bỏ lại phía sau thật sự không dễ chịu chút nào. Đừng vội nghĩ rằng bạn không đủ tốt nhé.',
        'Đôi khi các bạn ấy vô tình mải mê một chuyện gì đó mà không kịp để ý xung quanh, chứ không phải vì ghét bỏ bạn.',
        'Nếu tình bạn này quan trọng với bạn, có thể thử nói chuyện với bạn ấy một cách nhẹ nhàng và nói về cảm xúc của mình.'
      ],
      actionTakeaway: '🌱 Gợi ý nhỏ: Thử rủ riêng người bạn bạn thấy tin cậy nhất đi uống trà sữa hoặc dạo quanh sân trường để mở lời.'
    };
  }

  // Case 2: Lo lắng + Học tập + "Sợ điểm thấp" (Exact example in prompt)
  if (eId === 'anxious' && (tId === 'study' || tId === 'exam_scores') && rId === 'fear_low_grades') {
    return {
      title: 'Gửi bạn đang lo lắng trước bài kiểm tra',
      quote: '“Điều bạn đang sợ có thể chưa chắc đã xảy ra.”',
      content: [
        'Điều bạn đang sợ có thể chưa chắc đã xảy ra. Thay vì nghĩ về kết quả ngay lúc này, thử tập trung vào việc bạn có thể làm hôm nay: ôn một phần nhỏ, chuẩn bị đồ dùng và ngủ đủ.',
        'Bạn không cần hoàn hảo, chỉ cần tiến thêm một chút. Điểm số của một bài kiểm tra chỉ phản ánh kiến thức ở thời điểm đó, hoàn toàn không quyết định toàn bộ con người hay tương lai của bạn.'
      ],
      actionTakeaway: '🌱 Gợi ý nhỏ: Đặt mục tiêu học 25 phút một mục kiến thức quan trọng nhất, sau đó dừng lại uống một ngụm nước và nghỉ ngơi.'
    };
  }

  // Case 3: Cô đơn + Bạn bè + "Khó hòa nhập" (Exact example in prompt)
  if (eId === 'lonely' && (tId === 'friends' || tId === 'school') && (rId === 'hard_to_fit_in' || rId === 'left_out')) {
    return {
      title: 'Gửi bạn đang thấy lạc lõng giữa đám đông',
      quote: '“Bạn không cần phải hòa tan để được hòa nhập.”',
      content: [
        'Bạn không cần phải trở thành một người khác để được mọi người thích. 🌷',
        'Mỗi người đều có một tần số và nhịp điệu riêng. Hãy thử bắt đầu bằng một người mà bạn cảm thấy dễ nói chuyện nhất.',
        'Một cuộc trò chuyện nhỏ, một nụ cười chào buổi sáng cũng có thể là bước đầu của một tình bạn mới chân thành.'
      ],
      actionTakeaway: '🌱 Gợi ý nhỏ: Tìm một người bạn ngồi gần có sở thích chung (như đọc truyện, vẽ, nghe nhạc) để mượn đồ hoặc hỏi bài một cách tự nhiên.'
    };
  }

  // Case 4: Áp lực + Học tập + "Có quá nhiều bài" / "Sợ làm bố mẹ thất vọng"
  if (eId === 'stressed' && (tId === 'study' || tId === 'exam_scores')) {
    return {
      title: 'Một lời nhắn nhỏ cho bạn',
      quote: '“Bạn không cần giải quyết tất cả mọi thứ trong một ngày.”',
      content: [
        'Nếu đang quá áp lực vì bài vở hay kỳ vọng, thử chọn một việc nhỏ nhất để làm trước. Hoàn thành một bước nhỏ vẫn là tiến về phía trước.',
        'Và nhớ nhé: một điểm số hay một bài kiểm tra không thể nói hết bạn là người như thế nào.',
        'Bố mẹ đôi khi biểu đạt sự quan tâm bằng sự sốt sắng, nhưng giá trị và sức khỏe của bạn luôn là điều quan trọng nhất.'
      ],
      actionTakeaway: '🌱 Gợi ý nhỏ: Viết ra 3 việc cần làm nhất, gạch bớt 2 việc chưa gấp, chỉ tập trung giải quyết 1 việc duy nhất trong hôm nay.'
    };
  }

  // Case 5: Bực mình (Angry)
  if (eId === 'angry') {
    return {
      title: 'Gửi bạn đang có một ngọn lửa bực bội trong lòng',
      quote: '“Tức giận là một phản ứng bình thường khi cảm thấy không được tôn trọng.”',
      content: [
        'Cảm xúc bực mình là hoàn toàn tự nhiên khi bạn cảm thấy bị hiểu lầm hoặc đối xử bất công. Bạn không cần phải cố kìm nén hay tỏ ra mình ổn ngay lập tức.',
        'Tuy nhiên, đừng để cơn tức giận làm bạn nói ra những lời khiến bạn phải hối hận sau này.',
        'Hãy cho bản thân vài phút tách ra khỏi không gian đó, rửa mặt bằng nước mát hoặc nghe một bài nhạc êm dịu trước khi quyết định phản hồi.'
      ],
      actionTakeaway: '🌱 Gợi ý nhỏ: Hít sâu 4 giây, giữ 4 giây, thở chậm 6 giây. Thử viết hết những ấm ức ra một mảnh giấy rồi xé đi.'
    };
  }

  // Case 6: Cô đơn (Lonely) general
  if (eId === 'lonely') {
    return {
      title: 'Ôm bạn một cái thật ấm',
      quote: '“Cô đơn không có nghĩa là bạn không xứng đáng được yêu thương.”',
      content: [
        'Những lúc một mình có thể rất dài và trống trải. Nhưng đây cũng là lúc bạn được kết nối sâu sắc nhất với chính tâm hồn mình.',
        'Hãy làm một điều gì đó dịu dàng cho bản thân: uống một cốc sữa ấm, đắp chăn mềm, hoặc viết vài dòng gửi cho chính mình của tương lai.',
        'Ở đây luôn có một góc an toàn sẵn sàng lắng nghe bạn bất cứ khi nào bạn cần.'
      ],
      actionTakeaway: '🌱 Gợi ý nhỏ: Nhắn tin cho một người bạn cũ đã lâu chưa gặp hoặc trò chuyện cùng chatbot Bạn ơi, mình nói nè.'
    };
  }

  // Case 7: Lo lắng (Anxious) general
  if (eId === 'anxious') {
    return {
      title: 'Gửi bạn một chút bình yên',
      quote: '“Hãy tập trung vào hơi thở ngay trong khoảnh khắc này.”',
      content: [
        'Bộ não của chúng ta rất giỏi tưởng tượng ra những kịch bản tồi tệ nhất. Nhưng hầu hết những điều bạn đang lo sợ chưa thực sự xảy ra.',
        'Hãy tự hỏi: "Trong ngày hôm nay, điều tồi tệ nhất có xảy ra không? Mình có thể kiểm soát được phần nào của việc này?"',
        'Buông bỏ những điều nằm ngoài tầm kiểm soát và chỉ chăm sóc cho những bước chân nhỏ ngay trước mắt bạn.'
      ],
      actionTakeaway: '🌱 Gợi ý nhỏ: Nhìn xung quanh và gọi tên 5 đồ vật màu xanh lá, chạm vào 4 bề mặt khác nhau để kéo tâm trí về hiện tại.'
    };
  }

  // Case 8: Hơi buồn (Sad) general
  if (eId === 'sad') {
    return {
      title: 'Dành tặng bạn một chiếc ôm dịu dàng',
      quote: '“Cứ cho phép mình buồn một chút, trời mưa rồi cũng sẽ tạnh.”',
      content: [
        'Bạn không cần phải gượng cười hay cố tỏ ra mạnh mẽ khi trong lòng đang trĩu nặng.',
        'Nỗi buồn giống như một vị khách ghé thăm, nhắc chúng ta rằng có những điều thực sự quan trọng với mình.',
        'Hôm nay, hãy nhẹ nhàng hơn với chính mình một chút nhé. Ăn một món ngon, đi ngủ sớm hơn thường ngày một chút.'
      ],
      actionTakeaway: '🌱 Gợi ý nhỏ: Cho phép bản thân nghỉ ngơi tối nay mà không cần ép mình phải làm việc quá sức.'
    };
  }

  // Case 9: Mình cũng không biết nữa (Confused)
  if (eId === 'confused') {
    return {
      title: 'Không biết cũng là một câu trả lời hoàn toàn ổn',
      quote: '“Đôi khi, tâm trí chỉ đang cần được nghỉ giải lao.”',
      content: [
        'Cảm xúc của tuổi teen giống như thời tiết vậy, đôi khi sương mù che kín và ta chẳng biết mình đang muốn gì hay cảm thấy ra sao.',
        'Điều đó hoàn toàn bình thường. Bạn không cần phải luôn luôn tìm ra lý do cho mọi thứ.',
        'Chỉ cần hít thở sâu, thả lỏng đôi vai, và cho phép ngày hôm nay trôi qua một cách chậm rãi.'
      ],
      actionTakeaway: '🌱 Gợi ý nhỏ: Tắt thông báo điện thoại trong 30 phút, nhìn ra cửa sổ hoặc nằm thư giãn nghe tiếng quạt quay.'
    };
  }

  // Case 10: Vui / Ổn áp (Happy / Fine)
  if (eId === 'happy' || eId === 'fine') {
    return {
      title: 'Thật tuyệt vời vì bạn đang có một ngày tươi sáng!',
      quote: '“Hãy gói ghém niềm vui nhỏ này vào tim như một món quà.”',
      content: [
        'Cảm giác ấm áp và vui vẻ hôm nay là một năng lượng vô cùng quý giá. Bạn đã rất xứng đáng được tận hưởng trọn vẹn khoảnh khắc này.',
        'Hãy ghi nhớ cảm xúc dễ chịu này để những ngày có mây đen kéo tới, bạn sẽ nhớ ra rằng cầu vồng luôn có thật.',
        'Nếu có thể, hãy chia sẻ một nụ cười hoặc một lời động viên tới một người bạn xung quanh nhé!'
      ],
      actionTakeaway: '🌱 Gợi ý nhỏ: Chụp lại một bức ảnh hoặc ghi một dòng vào sổ tay để lưu giữ khoảnh khắc đáng yêu này.'
    };
  }

  // Default neutral advice
  return {
    title: 'Một ngày bình yên trôi qua',
    quote: '“Mỗi ngày bình thường đều là một viên gạch nhỏ vững chãi.”',
    content: [
      'Không phải ngày nào cũng cần có sự kiện rực rỡ hay kịch tính. Một ngày trôi qua êm ả, bình lặng chính là một điều may mắn.',
      'Hãy dành buổi tối hôm nay để làm điều gì đó bạn thích, đọc vài trang sách hoặc nghe playlist yêu thích.',
      'Cảm ơn bạn vì đã luôn kiên trì và đồng hành cùng chính mình qua từng ngày.'
    ],
    actionTakeaway: '🌱 Gợi ý nhỏ: Thưởng cho mình một ly nước ấm và chuẩn bị một giấc ngủ thật ngon.'
  };
}
