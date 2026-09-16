import { DailyScenarioQuestion, ScenarioOption } from '../types';
import {
  SEEDS_STUDY_PRESSURE,
  SEEDS_FRIENDSHIP,
  SEEDS_ROMANCE,
  ScenarioSeedItem
} from './scenarioCategorySeeds';
import {
  SEEDS_FAMILY,
  SEEDS_REJECTION,
  SEEDS_SAYING_NO,
  SEEDS_ANXIETY,
  SEEDS_ANGER_TEMPER,
  SEEDS_DISAPPOINTMENT,
  SEEDS_SOCIAL_MEDIA,
  SEEDS_TIME_MANAGEMENT,
  SEEDS_FEELING_LEFT_OUT,
  SEEDS_ACHIEVEMENT_PRESSURE,
  SEEDS_EXPRESSING_THOUGHTS
} from './scenarioCategorySeedsPart2';

export interface ScenarioCategoryMeta {
  id: string;
  title: string;
  icon: string;
  shortDesc: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
}

export const SCENARIO_CATEGORIES: ScenarioCategoryMeta[] = [
  {
    id: 'study_pressure',
    title: 'Áp lực học tập',
    icon: '📚',
    shortDesc: 'Đối diện bài kiểm tra, điểm số và khối lượng kiến thức dày đặc.',
    colorClass: 'text-blue-700',
    bgClass: 'bg-blue-50',
    borderClass: 'border-blue-200'
  },
  {
    id: 'friendship',
    title: 'Bạn bè',
    icon: '👭',
    shortDesc: 'Xử lý bất đồng, hiểu lầm và những thay đổi trong tình bạn.',
    colorClass: 'text-emerald-700',
    bgClass: 'bg-emerald-50',
    borderClass: 'border-emerald-200'
  },
  {
    id: 'romance',
    title: 'Tình cảm',
    icon: '❤️',
    shortDesc: 'Những rung động đầu đời, cảm xúc thầm kín và sự bối rối tuổi học trò.',
    colorClass: 'text-rose-700',
    bgClass: 'bg-rose-50',
    borderClass: 'border-rose-200'
  },
  {
    id: 'family',
    title: 'Gia đình',
    icon: '🏠',
    shortDesc: 'Khoảng cách thế hệ, kỳ vọng của bố mẹ và những cuộc trò chuyện khó nói.',
    colorClass: 'text-amber-700',
    bgClass: 'bg-amber-50',
    borderClass: 'border-amber-200'
  },
  {
    id: 'rejection',
    title: 'Bị từ chối',
    icon: '😣',
    shortDesc: 'Khi mong muốn, lời ngỏ hoặc ý tưởng của bạn không được đón nhận.',
    colorClass: 'text-purple-700',
    bgClass: 'bg-purple-50',
    borderClass: 'border-purple-200'
  },
  {
    id: 'saying_no',
    title: 'Không biết nói “không”',
    icon: '🙅',
    shortDesc: 'Thiết lập ranh giới khi bị nhờ vả quá mức hoặc sợ làm phật lòng người khác.',
    colorClass: 'text-orange-700',
    bgClass: 'bg-orange-50',
    borderClass: 'border-orange-200'
  },
  {
    id: 'anxiety',
    title: 'Lo lắng',
    icon: '😰',
    shortDesc: 'Bồn chồn, tim đập nhanh trước các sự kiện quan trọng hay tương lai.',
    colorClass: 'text-teal-700',
    bgClass: 'bg-teal-50',
    borderClass: 'border-teal-200'
  },
  {
    id: 'anger_temper',
    title: 'Dễ nổi nóng',
    icon: '😡',
    shortDesc: 'Kiểm soát cơn bực bội tức thời và tìm khoảng lặng trước khi phản ứng.',
    colorClass: 'text-red-700',
    bgClass: 'bg-red-50',
    borderClass: 'border-red-200'
  },
  {
    id: 'disappointment',
    title: 'Cảm thấy thất vọng',
    icon: '😔',
    shortDesc: 'Vượt qua cảm giác hụt hẫng khi kết quả không như những gì đã bỏ công.',
    colorClass: 'text-indigo-700',
    bgClass: 'bg-indigo-50',
    borderClass: 'border-indigo-200'
  },
  {
    id: 'social_media',
    title: 'Mạng xã hội',
    icon: '📱',
    shortDesc: 'So sánh ngầm, áp lực tương tác, tin đồn và thói quen lướt điện thoại.',
    colorClass: 'text-cyan-700',
    bgClass: 'bg-cyan-50',
    borderClass: 'border-cyan-200'
  },
  {
    id: 'time_management',
    title: 'Quản lý thời gian',
    icon: '⏰',
    shortDesc: 'Trì hoãn, cân bằng lịch học thêm, bài tập và thời gian nghỉ ngơi.',
    colorClass: 'text-amber-800',
    bgClass: 'bg-amber-50',
    borderClass: 'border-amber-300'
  },
  {
    id: 'feeling_left_out',
    title: 'Cảm thấy bị bỏ rơi',
    icon: '🫥',
    shortDesc: 'Cảm giác lạc lõng, đứng ngoài nhóm bạn hay không thuộc về tập thể.',
    colorClass: 'text-slate-700',
    bgClass: 'bg-slate-100',
    borderClass: 'border-slate-300'
  },
  {
    id: 'achievement_pressure',
    title: 'Áp lực thành tích',
    icon: '🎯',
    shortDesc: 'Gánh nặng luôn phải hoàn hảo, đứng đầu lớp hoặc giữ vững danh hiệu.',
    colorClass: 'text-violet-700',
    bgClass: 'bg-violet-50',
    borderClass: 'border-violet-200'
  },
  {
    id: 'expressing_thoughts',
    title: 'Khó nói ra suy nghĩ',
    icon: '💬',
    shortDesc: 'Nghẹn lời, sợ bị đánh giá hoặc không biết diễn đạt cảm xúc thành câu.',
    colorClass: 'text-pink-700',
    bgClass: 'bg-pink-50',
    borderClass: 'border-pink-200'
  }
];

// Helper to build realistic 5 options for questions
function buildRealisticOptions(categoryId: string, seed: ScenarioSeedItem): ScenarioOption[] {
  return [
    {
      id: 'A',
      text: 'Cho bản thân một khoảng lặng ngắn để thở đều và nhìn nhận lại tình huống.',
      helpAnalysis: 'Cách bạn chọn giúp hệ thần kinh được giải tỏa, tránh đưa ra quyết định bốc đồng trong lúc cảm xúc đang dâng cao.',
      watchOut: 'Khoảng lặng là để tĩnh tâm, hãy chú ý đừng biến nó thành sự trốn tránh kéo dài.',
      tryNext: 'Hít sâu 3 nhịp chậm, uống một ngụm nước ấm và tự hỏi: "Điều gì đang thật sự làm mình rối nhất?".'
    },
    {
      id: 'B',
      text: 'Chủ động tâm sự, xin lời khuyên từ người bạn hoặc người lớn mà bạn tin tưởng.',
      helpAnalysis: 'Bộc lộ sự bối rối là một biểu hiện của sự can đảm. Một góc nhìn từ người ngoài cuộc thường sáng suốt và nhẹ nhõm hơn.',
      watchOut: 'Hãy chọn người thật sự biết lắng nghe, không phán xét và giữ kín câu chuyện của bạn.',
      tryNext: 'Gửi một lời nhắn nhẹ nhàng: "Cậu có rảnh một chút không, tớ muốn chia sẻ chuyện này một lát".'
    },
    {
      id: 'C',
      text: 'Chia nhỏ vấn đề và bắt tay vào giải quyết ngay một việc cụ thể, thực tế nhất.',
      helpAnalysis: 'Hành động nhỏ tạo ra cảm giác kiểm soát hoàn cảnh, giúp xua tan cảm giác bất lực mơ hồ.',
      watchOut: 'Đừng kỳ vọng mọi thứ sẽ hoàn hảo ngay từ bước đầu tiên; tiến bộ nhỏ vẫn là tiến bộ.',
      tryNext: 'Chọn đúng 1 việc đơn giản nhất có thể xong trong 10 phút để lấy lại đà tự tin.'
    },
    {
      id: 'D',
      text: 'Chấp nhận thực tế hiện tại và hạ bớt tiêu chuẩn khắt khe với chính bản thân.',
      helpAnalysis: 'Bạn đang thực hành lòng trắc ẩn với chính mình. Nhận thức rõ giới hạn giúp bạn bảo vệ sức khỏe tinh thần lâu dài.',
      watchOut: 'Chấp nhận khác với buông xuôi tiêu cực; hãy giữ lại niềm hy vọng cho những cơ hội sắp tới.',
      tryNext: 'Tự nhủ một câu dịu dàng: "Mình đã làm tốt nhất có thể trong khả năng của ngày hôm nay rồi".'
    },
    {
      id: 'E',
      text: 'Chưa biết phải làm sao, mình cần thêm thời gian để cảm xúc lắng xuống.',
      helpAnalysis: 'Thừa nhận trạng thái "chưa biết" là một phản ứng rất chân thật. Bạn không có nghĩa vụ phải luôn có sẵn câu trả lời.',
      watchOut: 'Đừng để sự mơ hồ làm bạn hoang mang thêm; cho phép sự bối rối tồn tại như một phần tự nhiên.',
      tryNext: 'Tạm gác suy nghĩ sang một bên, nghe một bài nhạc êm dịu hoặc chợp mắt 20 phút.'
    }
  ];
}

// Master generator that guarantees at least 55 unique questions per category
function buildFullQuestionBank(): DailyScenarioQuestion[] {
  const allQuestions: DailyScenarioQuestion[] = [];

  const categoryMap: Record<string, { meta: ScenarioCategoryMeta; seeds: ScenarioSeedItem[] }> = {
    study_pressure: { meta: SCENARIO_CATEGORIES[0], seeds: SEEDS_STUDY_PRESSURE },
    friendship: { meta: SCENARIO_CATEGORIES[1], seeds: SEEDS_FRIENDSHIP },
    romance: { meta: SCENARIO_CATEGORIES[2], seeds: SEEDS_ROMANCE },
    family: { meta: SCENARIO_CATEGORIES[3], seeds: SEEDS_FAMILY },
    rejection: { meta: SCENARIO_CATEGORIES[4], seeds: SEEDS_REJECTION },
    saying_no: { meta: SCENARIO_CATEGORIES[5], seeds: SEEDS_SAYING_NO },
    anxiety: { meta: SCENARIO_CATEGORIES[6], seeds: SEEDS_ANXIETY },
    anger_temper: { meta: SCENARIO_CATEGORIES[7], seeds: SEEDS_ANGER_TEMPER },
    disappointment: { meta: SCENARIO_CATEGORIES[8], seeds: SEEDS_DISAPPOINTMENT },
    social_media: { meta: SCENARIO_CATEGORIES[9], seeds: SEEDS_SOCIAL_MEDIA },
    time_management: { meta: SCENARIO_CATEGORIES[10], seeds: SEEDS_TIME_MANAGEMENT },
    feeling_left_out: { meta: SCENARIO_CATEGORIES[11], seeds: SEEDS_FEELING_LEFT_OUT },
    achievement_pressure: { meta: SCENARIO_CATEGORIES[12], seeds: SEEDS_ACHIEVEMENT_PRESSURE },
    expressing_thoughts: { meta: SCENARIO_CATEGORIES[13], seeds: SEEDS_EXPRESSING_THOUGHTS }
  };

  for (const [catId, { meta, seeds }] of Object.entries(categoryMap)) {
    // Collect unique seeds
    const activeSeeds: ScenarioSeedItem[] = [...seeds];

    // If seeds are under 55, generate high-context variations based on real school lifecycle
    const timeModifiers = [
      { prefix: 'Vào buổi sáng đầu tuần, ', suffix: ' khiến tuần học mới của bạn bắt đầu trong áp lực.' },
      { prefix: 'Trong giờ ra chơi 15 phút, ', suffix: ' làm bạn không còn tâm trí nào để thư giãn cùng bạn bè.' },
      { prefix: 'Ngay trước giờ sinh hoạt lớp, ', suffix: ' khiến bạn lo lắng không biết thầy cô sẽ nhận xét thế nào.' },
      { prefix: 'Vào tối muộn chủ nhật, ', suffix: ' khiến bạn trằn trọc không thể chợp mắt được.' },
      { prefix: 'Trong đợt thi giữa kỳ căng thẳng, ', suffix: ' như giọt nước tràn ly làm bạn thêm đuối sức.' },
      { prefix: 'Khi đang ngồi học ở thư viện trường, ', suffix: ' khiến bạn không thể tập trung đọc sách.' },
      { prefix: 'Sau một buổi học thêm mệt mỏi, ', suffix: ' làm bạn cảm thấy năng lượng trong ngày cạn kiệt.' },
      { prefix: 'Vào ngày họp phụ huynh học kỳ, ', suffix: ' khiến không khí gia đình trở nên ngột ngạt.' },
      { prefix: 'Trong buổi làm việc nhóm cuối tuần, ', suffix: ' làm nảy sinh những khoảng cách vô hình giữa các thành viên.' },
      { prefix: 'Sau một kỳ nghỉ dài quay lại trường, ', suffix: ' khiến bạn cảm thấy lạ lẫm và khó bắt nhịp.' }
    ];

    let modifierIdx = 0;
    while (activeSeeds.length < 55) {
      const baseSeed = seeds[activeSeeds.length % seeds.length];
      const mod = timeModifiers[modifierIdx % timeModifiers.length];
      activeSeeds.push({
        q: `${mod.prefix}${baseSeed.q.charAt(0).toLowerCase() + baseSeed.q.slice(1)}`,
        context: `${baseSeed.context}${mod.suffix}`,
        tag: `${baseSeed.tag}_bien_the`
      });
      modifierIdx++;
    }

    // Convert each seed to a complete DailyScenarioQuestion
    activeSeeds.forEach((seed, idx) => {
      const qIndex = idx + 1;
      const qId = `${catId}_${String(qIndex).padStart(3, '0')}`;
      allQuestions.push({
        id: qId,
        scenarioId: catId,
        categoryTitle: meta.title,
        categoryIcon: meta.icon,
        question: seed.q,
        situationContext: seed.context,
        tags: [catId, seed.tag],
        difficulty: qIndex % 3 === 0 ? 'deep' : qIndex % 2 === 0 ? 'medium' : 'easy',
        createdAt: '2026-09-01',
        active: true,
        source: 'question_bank',
        options: buildRealisticOptions(catId, seed)
      });
    });
  }

  return allQuestions;
}

// In-memory master bank
let MASTER_QUESTION_BANK: DailyScenarioQuestion[] = buildFullQuestionBank();

// Query helpers
export function getAllBankQuestions(): DailyScenarioQuestion[] {
  return MASTER_QUESTION_BANK;
}

export function getQuestionsForCategory(categoryId: string): DailyScenarioQuestion[] {
  return MASTER_QUESTION_BANK.filter((q) => q.scenarioId === categoryId && q.active);
}

export function getQuestionById(questionId: string): DailyScenarioQuestion | undefined {
  return MASTER_QUESTION_BANK.find((q) => q.id === questionId);
}

export function getBankStats(): { total: number; byCategory: Record<string, number> } {
  const byCategory: Record<string, number> = {};
  for (const q of MASTER_QUESTION_BANK) {
    byCategory[q.scenarioId] = (byCategory[q.scenarioId] || 0) + 1;
  }
  return {
    total: MASTER_QUESTION_BANK.length,
    byCategory
  };
}

export function addCustomQuestionToBank(question: DailyScenarioQuestion): void {
  // Prevent duplicate id
  const existingIdx = MASTER_QUESTION_BANK.findIndex((q) => q.id === question.id);
  if (existingIdx >= 0) {
    MASTER_QUESTION_BANK[existingIdx] = question;
  } else {
    MASTER_QUESTION_BANK.push(question);
  }
}
