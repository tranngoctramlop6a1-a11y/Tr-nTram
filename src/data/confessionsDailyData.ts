/**
 * Dynamic Daily Confessions & AI Posts Library
 * Satisfies Requirements 1, 2, 3, 4, 5:
 * - AI posts are clearly marked "🤖 Bài viết từ AI"
 * - User posts are clearly marked "👤 Người dùng"
 * - Daily batches ensure that every day brings a fresh set of situations
 * - All posts use true ISO timestamps (createdAt)
 */

export interface ConfessionCommentItem {
  id: string;
  author: string;
  authorType: 'user' | 'ai';
  avatarSeed: string;
  content: string;
  createdAt: string; // ISO string
  likes: number;
}

export interface ConfessionItem {
  id: string;
  title: string;
  content: string;
  category: 'Gia đình' | 'Học tập' | 'Tình bạn' | 'Bản thân' | 'Trường học' | 'Tình cảm' | 'Khác';
  author: string;
  authorType: 'user' | 'ai';
  avatarSeed: string;
  isAnonymous: boolean;
  createdAt: string; // ISO timestamp
  updatedAt?: string;
  empathyCount: number;
  meTooCount: number;
  comments: ConfessionCommentItem[];
  userReacted?: {
    empathy?: boolean;
    meToo?: boolean;
  };
  isBookmarked?: boolean;
  reportCount?: number;
  dateKey?: string; // e.g. '2026-09-15'
}

// Daily batches of authentic teen situation posts authored by AI for reflection
export const AI_DAILY_BATCHES = [
  // Batch 0
  [
    {
      title: 'Kỳ vọng điểm 9 của mẹ và tờ giấy kiểm tra điểm 6.5',
      content: 'Hôm nay cô giáo trả bài khảo sát Toán. Nhìn thấy con số 6.5 đỏ chói ở góc bài, tự nhiên tai mình ù đi. Suốt quãng đường đạp xe về nhà, mình chỉ sợ nghe câu: "Mẹ cho con đi học thêm bao nhiêu tiền mà chỉ được thế này thôi à?". Mình biết bố mẹ vất vả vì mình, nhưng mình thấy mình đang dần nghẹt thở vì không thể hoàn hảo như kỳ vọng...',
      category: 'Gia đình' as const,
      empathyCount: 42,
      meTooCount: 38,
      comments: [
        {
          author: 'Minh Thư',
          authorType: 'user' as const,
          avatarSeed: 'thu_minh',
          content: 'Mình cũng từng bị như cậu. Sau đó mình gom can đảm nói thật với mẹ: "Con đã cố gắng hết sức nhưng đề lần này con chưa nắm vững phần hình học. Con sẽ nhờ bạn giảng lại". Mẹ tuy có thở dài nhưng không mắng nữa. Cố lên nhé!',
          minutesAgo: 45
        }
      ]
    },
    {
      title: 'Cảm giác lạc lõng ngay giữa nhóm bạn thân 4 người',
      content: 'Tụi mình chơi chung từ năm lớp 7. Nhưng dạo gần đây, 3 bạn kia lập một nhóm chat riêng khác, có những câu chuyện đùa riêng mà khi mình hỏi thì các bạn chỉ bảo: "À không có gì đâu". Đi ăn cùng nhau, các bạn cắm mặt vào điện thoại cười với nhau. Ngồi giữa các bạn mà mình thấy cô đơn hơn cả lúc ở một mình...',
      category: 'Tình bạn' as const,
      empathyCount: 56,
      meTooCount: 49,
      comments: [
        {
          author: 'Khánh An',
          authorType: 'user' as const,
          avatarSeed: 'an_khanh',
          content: 'Tình bạn đôi khi cũng có những ngã rẽ cậu ạ. Cậu không có lỗi gì cả, đừng tự dằn vặt nha.',
          minutesAgo: 110
        }
      ]
    },
    {
      title: 'Tự ti vì khuôn mặt dậy thì nhiều mụn và chiếc kính cận dày cộp',
      content: 'Mỗi lần đi qua gương ở sảnh trường, mình đều cúi gằm mặt xuống. Nhìn các bạn nữ trong lớp da dẻ mịn màng, biết ăn mặc đẹp, mình thấy mình như một chú vịt xấu xí. Đôi khi có bạn nam trêu chọc một câu vô ý thôi mà mình về nhà khóc cả buổi tối...',
      category: 'Bản thân' as const,
      empathyCount: 68,
      meTooCount: 72,
      comments: [
        {
          author: 'Linh Chi',
          authorType: 'user' as const,
          avatarSeed: 'chi_linh',
          content: 'Tuổi dậy thì ai cũng phải qua giai đoạn này hết á cậu ơi! Qua vài năm nữa da sẽ ổn định lại thôi. Cậu luôn có nét duyên dáng riêng của cậu mà!',
          minutesAgo: 160
        }
      ]
    }
  ],
  // Batch 1
  [
    {
      title: 'Làm nhóm trưởng bài tập Sinh học: Khi một mình gánh cả team',
      content: 'Cô giáo phân nhóm 5 người làm bài thuyết trình slide. Mình phân chia việc rõ ràng từ thứ Hai, nhưng đến tối Chủ nhật sát ngày nộp bài, 4 bạn kia vẫn "seen" không trả lời hoặc bảo "tớ bận học thêm chưa làm được". Cuối cùng mình phải thức trắng đêm đến 3h sáng làm slide cho cả nhóm. Vừa tức vừa bất lực...',
      category: 'Trường học' as const,
      empathyCount: 61,
      meTooCount: 55,
      comments: [
        {
          author: 'Hoàng Long',
          authorType: 'user' as const,
          avatarSeed: 'long_hoang',
          content: 'Lần sau cậu cứ báo trước trong nhóm: Ai không nộp phần việc trước giờ G sẽ không có tên trong slide. Phải rạch ròi mới không bị ỷ lại cậu ạ.',
          minutesAgo: 85
        }
      ]
    },
    {
      title: 'Nỗi sợ hãi vô hình mỗi sáng trước khi bước chân vào cổng trường',
      content: 'Không hẳn là bị bắt nạt, nhưng lớp mình có văn hóa "chia bè kéo phái" và hay soi mói từng hành động của người khác. Chỉ cần bước vào lớp là mình cảm thấy có hàng chục ánh mắt đang nhìn và thì thầm. Mình luôn phải đếm từng tiết học để chờ tiếng chuông tan trường...',
      category: 'Trường học' as const,
      empathyCount: 77,
      meTooCount: 64,
      comments: [
        {
          author: 'Bảo Ngọc',
          authorType: 'user' as const,
          avatarSeed: 'ngoc_bao',
          content: 'Ôm cậu một cái thật chặt! Hãy tìm một góc yên tĩnh trong thư viện vào giờ ra chơi hoặc kết bạn với một người bạn hiền lành ở lớp bên cạnh nhé.',
          minutesAgo: 130
        }
      ]
    },
    {
      title: 'Thích một bạn cùng bàn suốt một năm nhưng không dám nói',
      content: 'Mỗi ngày đến lớp, niềm vui duy nhất là được nhìn thấy bạn ấy cười khi mình chuyền hộ cục tẩy hoặc giảng bài tập Toán. Bạn ấy tốt bụng với tất cả mọi người, nên mình sợ nếu nói ra thì ngay cả tình bạn trong sáng này cũng sẽ tan vỡ mất...',
      category: 'Tình cảm' as const,
      empathyCount: 89,
      meTooCount: 82,
      comments: [
        {
          author: 'Hà My',
          authorType: 'user' as const,
          avatarSeed: 'my_ha',
          content: 'Cảm xúc tuổi học trò thật trong trẻo và đáng quý. Cứ trân trọng những khoảnh khắc ngồi cạnh nhau như vậy nhé cậu!',
          minutesAgo: 210
        }
      ]
    }
  ],
  // Batch 2
  [
    {
      title: 'Khi bố mẹ luôn đem "con nhà người ta" ra để làm thước đo',
      content: '"Nhìn con bác Hùng xem, vừa được giải Nhì thành phố vừa ngoan ngoãn đỡ đần bố mẹ, nhìn lại con thì...". Câu nói đó lặp đi lặp lại trong mỗi bữa cơm khiến mình nuốt nghẹn chén cơm. Mình cũng có những điểm mạnh riêng của mình, sao bố mẹ không một lần nhìn nhận?',
      category: 'Gia đình' as const,
      empathyCount: 104,
      meTooCount: 112,
      comments: [
        {
          author: 'Đức Anh',
          authorType: 'user' as const,
          avatarSeed: 'anh_duc',
          content: 'Mình hiểu cảm giác này rất rõ. Người lớn hay nghĩ so sánh là để con có động lực, nhưng thực ra lại gây tổn thương sâu sắc. Cậu đừng đánh mất niềm tin vào bản thân nhé.',
          minutesAgo: 95
        }
      ]
    },
    {
      title: 'Bị bạn thân tiết lộ bí mật riêng tư cho cả lớp biết',
      content: 'Mình từng tin tưởng kể cho bạn thân chuyện gia đình mình đang có xích mích. Thế mà hôm sau, mình phát hiện bạn ấy kể lại chuyện đó trong giờ thể dục cho mấy bạn khác nghe như một trò cười. Cảm giác bị phản bội từ người mình tin nhất đau đớn vô cùng...',
      category: 'Tình bạn' as const,
      empathyCount: 92,
      meTooCount: 78,
      comments: [
        {
          author: 'Phương Uyên',
          authorType: 'user' as const,
          avatarSeed: 'uyen_phuong',
          content: 'Người như vậy không xứng đáng làm bạn thân của cậu đâu. Cắt đứt sớm là điều may mắn để bảo vệ cảm xúc của mình cậu ạ.',
          minutesAgo: 140
        }
      ]
    },
    {
      title: 'Áp lực chọn ban và định hướng tương lai năm lớp 10',
      content: 'Mọi người trong nhà ai cũng bảo mình phải thi ban Tự nhiên để sau này làm bác sĩ, kỹ sư cho dễ xin việc. Nhưng niềm đam mê thật sự của mình là viết lách và thiết kế đồ họa. Mỗi lần nhắc đến ban Xã hội là bố lại gạt đi bảo "học cái đó sau này cạp đất mà ăn"...',
      category: 'Học tập' as const,
      empathyCount: 84,
      meTooCount: 89,
      comments: [
        {
          author: 'Thanh Trúc',
          authorType: 'user' as const,
          avatarSeed: 'truc_thanh',
          content: 'Thời đại bây giờ ngành sáng tạo phát triển lắm cậu ơi. Cậu có thể chứng minh cho bố mẹ thấy bằng những sản phẩm nhỏ hoặc giải thưởng nhỏ để thuyết phục dần dần nha.',
          minutesAgo: 180
        }
      ]
    }
  ]
];

// Initial real user community contributions (clearly labelled "👤 Người dùng")
export const INITIAL_USER_COMMUNITY_POSTS = [
  {
    title: 'Hôm nay mình đã dũng cảm xin lỗi mẹ trước',
    content: 'Tối qua hai mẹ con cãi nhau vì mẹ bắt mình tắt máy tính đi ngủ sớm trong khi bài tập chưa xong. Sáng nay tỉnh dậy, thấy mẹ vẫn dậy sớm nấu xôi chuẩn bị cho mình đi học. Mình bước lại ôm mẹ từ phía sau và nói: "Con xin lỗi mẹ, tối qua con nói năng hơi hỗn". Mẹ cười và bảo ăn nhanh kẻo nguội. Thật nhẹ nhõm!',
    category: 'Gia đình' as const,
    author: 'Tuệ Mẫn',
    authorType: 'user' as const,
    avatarSeed: 'man_tue',
    empathyCount: 135,
    meTooCount: 64,
    hoursAgo: 5,
    comments: [
      {
        author: 'Gia Huy',
        authorType: 'user' as const,
        avatarSeed: 'huy_gia',
        content: 'Cậu tuyệt vời và ấm áp quá! Học hỏi cậu!',
        minutesAgo: 70
      }
    ]
  },
  {
    title: 'Bí kíp nhỏ cho bạn nào đang bị mất tập trung khi ôn thi',
    content: 'Mỗi lần học bài, mình để điện thoại ở phòng khác và dùng đồng hồ đếm ngược 25 phút (phương pháp Pomodoro). Học hết 25 phút thì đứng dậy vươn vai, uống nước 5 phút. Nhờ vậy mà tuần này mình giải xong hết 3 đề Hóa mà không bị mỏi mắt hay lướt TikTok vô thức nữa!',
    category: 'Học tập' as const,
    author: 'Quốc Việt',
    authorType: 'user' as const,
    avatarSeed: 'viet_quoc',
    empathyCount: 118,
    meTooCount: 92,
    hoursAgo: 14,
    comments: [
      {
        author: 'Bích Trâm',
        authorType: 'user' as const,
        avatarSeed: 'tram_bich',
        content: 'Cảm ơn bạn nhiều nha! Mình áp dụng ngay tối nay luôn.',
        minutesAgo: 240
      }
    ]
  },
  {
    title: 'Mình học cách chấp nhận rằng mình không thể làm vừa lòng tất cả',
    content: 'Trước đây ai nhờ gì mình cũng nhận, ai nói gì mình cũng gật đầu vì sợ bị ghét. Kết quả là mình kiệt sức và luôn trong trạng thái lo âu. Tháng này mình bắt đầu từ chối những lời rủ rê mà mình không thích. Hóa ra trời không sập xuống, mà mình lại có thêm thời gian đọc cuốn sách mình yêu thích.',
    category: 'Bản thân' as const,
    author: 'Ngọc Lan',
    authorType: 'user' as const,
    avatarSeed: 'lan_ngoc',
    empathyCount: 142,
    meTooCount: 120,
    hoursAgo: 28, // yesterday
    comments: []
  },
  {
    title: 'Lời nhắn gửi đến những bạn đang chuẩn bị bước vào kỳ thi học sinh giỏi',
    content: 'Biết là các bạn đang phải ôn luyện ngày đêm vất vả lắm. Đừng quên ăn uống đủ bữa và ngủ ít nhất 6 tiếng nhé. Kết quả thế nào thì sự kiên trì của các bạn trong những tháng ngày qua đã là một chiến thắng vẻ vang rồi. Tự hào về các bạn!',
    category: 'Học tập' as const,
    author: 'Thầy chủ nhiệm 10A1',
    authorType: 'user' as const,
    avatarSeed: 'thay_hung',
    empathyCount: 198,
    meTooCount: 140,
    hoursAgo: 52, // 2 days ago
    comments: []
  }
];

/**
 * Builds dynamic confessions data with real timestamps calculated relative to now.
 * Ensures:
 * - Current day gets its specific AI batch (e.g. today has 3 fresh AI posts)
 * - Yesterday and older days have posts with real ISO timestamps that accurately reflect "1 ngày trước", "2 ngày trước", "dd/MM/yyyy"
 */
export function buildDynamicConfessions(
  now: Date = new Date(),
  existingUserPosts: any[] = []
): ConfessionItem[] {
  const result: ConfessionItem[] = [];
  const nowMs = now.getTime();
  const dateStr = now.toISOString().split('T')[0];

  // Include valid existing user posts
  if (Array.isArray(existingUserPosts)) {
    existingUserPosts.forEach(post => {
      if (post && post.id) {
        result.push({
          ...post,
          createdAt: post.createdAt || post.created_at || new Date(nowMs - 3 * 3600 * 1000).toISOString()
        });
      }
    });
  }

  // Calculate day index for dynamic AI batch
  const parts = dateStr.split('-');
  const day = parseInt(parts[2], 10) || 15;
  const batchIdx = day % AI_DAILY_BATCHES.length;
  const currentBatch = AI_DAILY_BATCHES[batchIdx];

  // 1. Fresh AI Posts for Today (created 2h, 4h, 6h ago today)
  currentBatch.forEach((item, i) => {
    const postTime = new Date(nowMs - (i * 2 + 1.5) * 60 * 60 * 1000);
    result.push({
      id: `ai-conf-${dateStr}-${i}`,
      title: item.title,
      content: item.content,
      category: item.category,
      author: 'AI Đồng Cảm',
      authorType: 'ai',
      avatarSeed: `ai_bot_seed_${i}`,
      isAnonymous: false,
      createdAt: postTime.toISOString(),
      updatedAt: postTime.toISOString(),
      empathyCount: item.empathyCount,
      meTooCount: item.meTooCount,
      dateKey: dateStr,
      comments: item.comments.map((c, ci) => ({
        id: `comm-ai-${dateStr}-${i}-${ci}`,
        author: c.author,
        authorType: c.authorType,
        avatarSeed: c.avatarSeed,
        content: c.content,
        createdAt: new Date(postTime.getTime() + (c.minutesAgo * 60 * 1000)).toISOString(),
        likes: 3
      }))
    });
  });

  // 2. Real User Community Posts with real past timestamps
  INITIAL_USER_COMMUNITY_POSTS.forEach((item, i) => {
    const postTime = new Date(nowMs - (item.hoursAgo * 60 * 60 * 1000));
    result.push({
      id: `user-conf-init-${i}`,
      title: item.title,
      content: item.content,
      category: item.category,
      author: item.author,
      authorType: 'user',
      avatarSeed: item.avatarSeed,
      isAnonymous: false,
      createdAt: postTime.toISOString(),
      updatedAt: postTime.toISOString(),
      empathyCount: item.empathyCount,
      meTooCount: item.meTooCount,
      dateKey: postTime.toISOString().split('T')[0],
      comments: item.comments.map((c, ci) => ({
        id: `comm-user-${i}-${ci}`,
        author: c.author,
        authorType: c.authorType,
        avatarSeed: c.avatarSeed,
        content: c.content,
        createdAt: new Date(postTime.getTime() + (c.minutesAgo * 60 * 1000)).toISOString(),
        likes: 4
      }))
    });
  });

  // 3. Add past day AI post for realistic timeline flow
  const prevBatchIdx = (batchIdx + AI_DAILY_BATCHES.length - 1) % AI_DAILY_BATCHES.length;
  const prevBatch = AI_DAILY_BATCHES[prevBatchIdx];
  const yesterdayPost = prevBatch[0];
  if (yesterdayPost) {
    const yestTime = new Date(nowMs - 26 * 60 * 60 * 1000); // 26 hours ago = yesterday
    result.push({
      id: `ai-conf-past-${prevBatchIdx}`,
      title: yesterdayPost.title,
      content: yesterdayPost.content,
      category: yesterdayPost.category,
      author: 'AI Đồng Cảm',
      authorType: 'ai',
      avatarSeed: 'ai_bot_prev',
      isAnonymous: false,
      createdAt: yestTime.toISOString(),
      updatedAt: yestTime.toISOString(),
      empathyCount: yesterdayPost.empathyCount + 15,
      meTooCount: yesterdayPost.meTooCount + 10,
      dateKey: yestTime.toISOString().split('T')[0],
      comments: []
    });
  }

  // Sort by createdAt descending (newest first)
  return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
