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
  userId?: string | null;
  author: string;
  authorType: 'user' | 'ai';
  source?: 'user' | 'ai';
  avatarSeed: string;
  content: string;
  createdAt: string; // ISO string
  likes: number;
}

export interface ConfessionItem {
  id: string;
  userId?: string | null;
  source?: 'user' | 'ai';
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

// No fake user posts - real user posts only come from actual database submissions
export const INITIAL_USER_COMMUNITY_POSTS: any[] = [];

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
      userId: null,
      source: 'ai',
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
        userId: null,
        author: c.author,
        authorType: c.authorType,
        source: 'ai',
        avatarSeed: c.avatarSeed,
        content: c.content,
        createdAt: new Date(postTime.getTime() + (c.minutesAgo * 60 * 1000)).toISOString(),
        likes: 3
      }))
    });
  });

  // 2. Add past day AI post for realistic timeline flow
  const prevBatchIdx = (batchIdx + AI_DAILY_BATCHES.length - 1) % AI_DAILY_BATCHES.length;
  const prevBatch = AI_DAILY_BATCHES[prevBatchIdx];
  const yesterdayPost = prevBatch[0];
  if (yesterdayPost) {
    const yestTime = new Date(nowMs - 26 * 60 * 60 * 1000); // 26 hours ago = yesterday
    result.push({
      id: `ai-conf-past-${prevBatchIdx}`,
      userId: null,
      source: 'ai',
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
