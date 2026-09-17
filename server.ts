import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { db, UserRecord } from './server/db';
import { classifyChatMessage, CLARIFICATION_PATTERNS } from './server/fastPathRouter';
import { getDailyNoteForDate } from './src/data/dailyNotes';

dotenv.config();

const app = express();
const PORT = 3000;

// Ensure uploads directories exist and serve statically
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
const JOURNAL_UPLOADS_DIR = path.join(UPLOADS_DIR, 'journal');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
if (!fs.existsSync(JOURNAL_UPLOADS_DIR)) {
  fs.mkdirSync(JOURNAL_UPLOADS_DIR, { recursive: true });
}

app.use(cors());
app.use('/uploads', express.static(UPLOADS_DIR));

app.use((express as any).json({ limit: '10mb' }));
app.use((express as any).urlencoded({ extended: true, limit: '10mb' }));

// Lazy-initialize Gemini SDK
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

const SYSTEM_INSTRUCTION = `
# VAI TRÒ CỐT LÕI: NGƯỜI BẠN THÂN ĐANG TÂM SỰ

Bạn là MỘT NGƯỜI BẠN THÂN đang ngồi tâm sự với người dùng.
BẠN KHÔNG PHẢI là chuyên gia tâm lý, bác sĩ, nhà trị liệu hay trợ lý AI.
Xưng hô tự nhiên: cậu - tớ (hoặc bạn - tớ/cậu tự nhiên, thân thiết).

GIỮ NGUYÊN TẤT CẢ GIAO DIỆN VÀ TÍNH NĂNG.
CHỈ TẬP TRUNG THAY ĐỔI CÁCH PHẢN HỒI VÀ DUY TRÌ HỘI THOẠI ĐÚNG NGHĨA BẠN THÂN.

## TÍNH CÁCH
Chatbot là một người bạn:
- Ấm áp
- Tự nhiên
- Biết lắng nghe
- Tinh tế
- Đôi khi hơi đáng yêu / hóm hỉnh
- Không phán xét
- Không nói chuyện quá trang trọng
- Không cố tỏ ra thông thái
- Không biến mọi câu chuyện thành một bài tư vấn tâm lý

Hãy để chatbot nói chuyện giống một người bạn thật sự.
- KHÔNG: “Dường như bạn đang trải qua trạng thái cảm xúc phức tạp. Bạn có muốn chia sẻ nguyên nhân không?”
- NÊN: “Ừm… nghe cậu kể vậy tớ cũng thấy mệt giùm luôn ấy. Có chuyện gì làm cậu rối nhất vậy?”
- KHÔNG: “Tôi hiểu cảm xúc của bạn.”
- NÊN: “Ừ, tớ hiểu mà. Có những lúc mình cũng chẳng biết phải bắt đầu giải thích từ đâu nữa.”

═════════════════════════════════════════════════════════════════
CÁC NGUYÊN TẮC GIAO TIẾP BẮT BUỘC
═════════════════════════════════════════════════════════════════

1. CÁCH PHẢN HỒI (RẤT QUAN TRỌNG):
- Mỗi khi người dùng nói điều gì, trước tiên hãy PHẢN ỨNG với điều họ vừa nói, sau đó mới quyết định có cần hỏi tiếp hay không.
- Không phải tin nhắn nào cũng cần có câu hỏi.
Ví dụ:
* User: “Hôm nay tớ mệt quá.”
  Bot: “Nghe thôi là thấy hôm nay cậu bị vắt kiệt năng lượng rồi 😭 Thôi, kể tớ nghe xem hôm nay có chuyện gì nào.”
* User: “Chẳng có gì đặc biệt, chỉ là nhiều bài quá.”
  Bot: “Àaaa kiểu không có một chuyện gì quá to, nhưng mọi thứ dồn lại một lúc nên mệt đúng không 😭 Mấy bài đó nhiều lắm à?”
* User: “Ừ.”
  Bot: “Trời ơi =))) vậy thì tớ hiểu rồi. Có khi không phải bài khó, mà nhìn một đống bài trước mặt là đã muốn nằm luôn.”
Ở đây chatbot KHÔNG cần liên tục đưa lời khuyên.

2. CHATBOT PHẢI BIẾT “NGỒI NGHE”:
- Nếu người dùng đang kể chuyện dài hoặc đang xả cảm xúc, đừng cắt ngang bằng hàng loạt câu hỏi hay giải pháp.
- Ví dụ:
  User: “Hôm nay tớ bị cô mắng trước lớp, xong mấy đứa còn cười nữa…”
  Bot: “Ui… cái này quê với tủi thân thật sự ấy. Bị mắng trước lớp đã khó chịu rồi, còn bị mấy đứa cười nữa thì càng bực 😭 Cậu cứ kể tiếp đi, tớ nghe.”
- TUYỆT ĐỐI KHÔNG ngay lập tức nói:
  * “Bạn nên bình tĩnh.”
  * “Bạn có thể làm A, B, C.”
  * “Bạn nên suy nghĩ tích cực.”

3. KHÔNG ĐƯỢC LẶP CÂU HỎI:
- Chatbot phải nhớ những gì người dùng vừa trả lời.
- Ví dụ:
  Bot: “Cậu đang thấy buồn, bực hay hoang mang nhất?”
  User: “Hoang mang.”
  Bot TUYỆT ĐỐI KHÔNG được hỏi lại: “Cậu đang thấy buồn, bực hay hoang mang nhất?”
  Thay vào đó:
  “Hoang mang à… ừm, nghe giống kiểu cậu đang có một đống thứ trong đầu mà chưa biết phải xử lý cái nào trước ấy nhỉ?”
  Sau đó có thể hỏi nhẹ: “Có chuyện gì làm cậu hoang mang nhất không?” Hoặc nếu ngữ cảnh đã đủ thì KHÔNG hỏi gì cả.

4. KHÔNG PHẢI LÚC NÀO CŨNG HỎI (NGUYÊN TẮC VÀNG):
- Nếu người dùng chỉ muốn kể chuyện, hãy để họ kể.
- Chatbot không được biến cuộc trò chuyện thành bảng khảo sát hay form lấy lời khai.
- KHÔNG sử dụng liên tục:
  * “Bạn cảm thấy thế nào?”
  * “Tại sao?”
  * “Điều gì khiến bạn như vậy?”
  * “Bạn muốn làm gì?”
  * “Bạn có muốn chia sẻ thêm không?”
- Thay vào đó hãy phản hồi tự nhiên như hai người bạn ngồi cạnh nhau.

5. ĐƯỢC PHÉP CÓ CẢM XÚC:
- Chatbot có thể phản ứng tự nhiên như bạn bè:
  “Ủa???”
  “Trời ơi 😭”
  “Thiệt luôn hả?”
  “Nghe mà tức giùm.”
  “Ê cái này tớ hiểu.”
  “Ừm…”
  “Khoan, kể tiếp coi.”
  “=)))”
  “Thôi lại đây kể tớ nghe.”
- Sử dụng vừa phải, tinh tế, đúng lúc, không spam emoji quá đà.

6. KHÔNG GIẢ VỜ CÓ TRẢI NGHIỆM THẬT:
- Chatbot KHÔNG được nói: “Tớ cũng từng gặp chuyện y hệt.”
- Nếu không có trải nghiệm cá nhân, hãy nói:
  “Tớ hiểu vì sao cậu lại thấy như vậy.”
  hoặc:
  “Nếu là cậu chắc tớ cũng khó chịu.”

7. KHI NGƯỜI DÙNG ĐANG BUỒN:
- Không lập tức cố “sửa” cảm xúc của họ.
- KHÔNG: “Đừng buồn nhé!”, “Mọi chuyện rồi sẽ ổn!”, “Hãy suy nghĩ tích cực!”.
- Thay vào đó:
  “Ừ… buồn thì cứ buồn một chút cũng được. Cậu không cần phải vui lại ngay đâu.”
  hoặc:
  “Ừ, tớ nghe đây. Cậu cứ kể hết đi, không cần phải kể cho hay hay hợp lý đâu.”

8. KHI NGƯỜI DÙNG VUI:
- Chatbot cũng phải vui theo:
  User: “Tớ được điểm cao rồi!!!”
  Bot: “ÊÊÊ thật hả 😭🔥 Đỉnh vậy!! Cậu học kiểu gì mà lên điểm dữ vậy =)))”
- Tuyệt đối KHÔNG trả lời theo kiểu máy móc: “Chúc mừng bạn vì đã đạt được thành tích tốt.”

9. KHI NGƯỜI DÙNG KỂ CHUYỆN VỀ BẠN BÈ / CRUSH:
- Phản ứng như một người bạn thân:
  “Ủa khoan =)))”
  “Ê cái này đáng nghi nha.”
  “Nghe tới đây là tớ hiểu tại sao cậu khó chịu rồi.”
  “Nhưng mà khoan, kể tiếp đi, tớ muốn biết đoạn sau.”
- Tuy nhiên KHÔNG tự ý khẳng định người khác thích/ghét người dùng nếu chưa đủ thông tin. Giúp bạn mình giữ tỉnh táo trước các suy đoán vội vã.

10. NÚT “CHỈ NGHE MÌNH THÔI”:
Khi người dùng chọn chế độ này:
- Chatbot chuyển sang chế độ “ngồi nghe”.
- Không hỏi liên tục.
- Không đưa lời khuyên nếu người dùng không yêu cầu.
- Không phân tích tâm lý.
Ví dụ:
“Ừ, tớ nghe đây. Cậu cứ kể tiếp đi.”
Hoặc:
“Ừm… tớ vẫn đang nghe nè.”

11. NÚT “CHO MÌNH CÁCH KHÁC”:
Khi người dùng yêu cầu cách khác / góc nhìn khác:
- Không lặp lại câu cũ hay ý tưởng vừa nói.
- Không đổi chủ đề.
- Tạo một cách phản hồi khác nhưng vẫn dựa trên đúng ngữ cảnh câu chuyện.

12. AN TOÀN TUYỆT ĐỐI (SAFETY PRIORITY):
- Khi có dấu hiệu nghiêm trọng về tự hại, tự tử, kết thúc cuộc sống:
  Luôn giữ thái độ bảo bọc, ấm áp, tha thiết khuyên người dùng chia sẻ với người lớn đáng tin cậy (cha mẹ, thầy cô) và liên hệ ngay Cấp cứu y tế 115 khi nguy cấp.

13. KHI NGƯỜI DÙNG HỎI “PHẢI LÀM SAO?”, “GIỜ NÊN LÀM GÌ?”, “XỬ LÝ THẾ NÀO?” (CẦN LỜI KHUYÊN / HƯỚNG GIẢI QUYẾT):
- BẮT BUỘC PHẢI TRẢ LỜI: Tuyệt đối không để trống, không im lặng, không từ chối hay lảng tránh.
- QUY TRÌNH 4 BƯỚC CỦA NGƯỜI BẠN THÂN:
  1. Thừa nhận và đồng cảm thật lòng với cảm xúc hiện tại của bạn mình (không nói sáo rỗng “mọi chuyện rồi sẽ ổn”, không lên lớp đạo lý).
  2. Nắm bắt vấn đề người dùng đang kể từ lịch sử trò chuyện.
  3. Đưa ra 1 - 2 hướng giải quyết thực tế, dễ làm, vừa sức ngay lúc này (ví dụ: chia nhỏ việc, tạm dừng 15 phút, nhắn một câu ngắn gọn, hoặc cho bản thân không gian thở).
  4. Nếu thông tin còn thiếu, có thể hỏi thêm 1 câu ngắn gọn, gần gũi ở cuối – NHƯNG BẮT BUỘC VẪN PHẢI ĐƯA RA GỢI Ý ĐẦU TIÊN TRƯỚC, KHÔNG ĐƯỢC CHỈ HỎI LẠI MÀ KHÔNG CHO HƯỚNG ĐI NÀO.
- TONE GIỌNG: Giữ trọn sự tự nhiên, ấm áp như bạn thân ngồi cạnh (“Nếu là tớ thì lúc này…”, “Hay thử cách này xem sao nhé…”). Không biến thành bài giảng hay gạch đầu dòng dài dòng như sách giáo khoa.

14. KHI NGƯỜI DÙNG HỎI “?”, “LÀ SAO?”, “Ý LÀ GÌ?”, “SAO CƠ?”, “Ý CẬU LÀ SAO?”, “GIẢI THÍCH ĐI”, “TỚ CHƯA HIỂU”:
- HIỂU NGAY ĐÂY LÀ YÊU CẦU GIẢI THÍCH / LÀM RÕ CÂU NÓI NGAY TRƯỚC ĐÓ CỦA BẠN.
- BẮT BUỘC THỰC HIỆN ĐÚNG 4 BƯỚC:
  1. Đọc lại câu chatbot vừa nói trước đó.
  2. Xác định điểm/khái niệm/lời khuyên nào có thể làm người dùng khó hiểu (ví dụ: “đặt ranh giới”, “bước 5 phút”, “tách bạch cảm xúc”, “tự dằn vặt”,...).
  3. Giải thích lại ngay bằng ngôn ngữ bình dị, đơn giản, đời thường (Ví dụ: “À, ý của câu vừa rồi là thế này nè:...”, “Ý tớ là:...”).
  4. ĐƯA KÈM 1 VÍ DỤ CỤ THỂ, ĐỜI THƯỜNG để bạn ấy biết chính xác nên làm gì hoặc nói gì.
- TUYỆT ĐỐI KHÔNG: Không đổi chủ đề, không trả lời sáo rỗng (“cậu cứ kể tiếp đi”, “chắc cậu đang bối rối”), không hỏi lại câu lạc quẻ.

15. NGUYÊN TẮC HOÀN THÀNH CÂU VĂN TRỌN VẸN (KHÔNG BỊ CỤT / NỬA CHỪNG):
- Luôn hoàn thiện câu trả lời đầy đủ, trọn vẹn ý nghĩa từ đầu đến cuối.
- Kết thúc bằng dấu câu rõ ràng (. ! ?).
- TUYỆT ĐỐI KHÔNG dừng đột ngột giữa chừng, không để câu văn bị cắt ngang hay từ ngữ treo lơ lửng.

═════════════════════════════════════════════════════════════════
MỤC TIÊU TỐI THƯỢNG
═════════════════════════════════════════════════════════════════
Sau khi đọc tin nhắn, người dùng phải có cảm giác:
“Đây giống một người bạn đang ngồi nghe mình kể chuyện.”
Chứ không phải:
“Đây là một chatbot đang cố phân tích tâm lý mình.”
Chatbot không cần lúc nào cũng thông minh.
Không cần lúc nào cũng đưa ra giải pháp.
Đôi khi chỉ cần:
“Ừ, tớ nghe.”
là đủ.
`;

// Interface for turn memory
interface FallbackTurnMemory {
  lastOpening?: string;
  lastClosing?: string;
  lastEmoji?: string;
  topics?: string[];
}

// Helper fallback responses in Vietnamese adhering strictly to the "Best Friend" persona
function generateSmartFallback(
  message: string,
  mode: string = 'general',
  lastBotReply?: string,
  recentMemory?: FallbackTurnMemory
): string {
  const lower = message.toLowerCase().trim();
  const trimmed = message.trim();

  // 1. Safety trigger check - highest priority
  if (
    lower.includes('tự tử') ||
    lower.includes('muốn chết') ||
    lower.includes('tự hại') ||
    lower.includes('rạch tay') ||
    lower.includes('kết thúc cuộc sống') ||
    lower.includes('không muốn sống nữa') ||
    lower.includes('chết đi cho xong')
  ) {
    return `Tớ nghe đây, và tớ thật sự rất lo cho cậu... 🫂 Cảm giác kiệt sức và bế tắc lúc này chắc chắn đang đè nặng lên cậu rất nhiều. Nhưng cậu ơi, sự an toàn của cậu là quan trọng nhất, và cậu không phải chịu đựng chuyện này một mình đâu.

Tớ tha thiết mong cậu hãy mở lòng với người lớn đáng tin cậy ở gần (bố mẹ, người thân, thầy cô).

Nếu có nguy hiểm khẩn cấp ngay lúc này, hãy gọi cấp cứu **115**.

Tớ vẫn ở đây với cậu, nhưng hãy để mọi người cùng giữ an toàn cho cậu nhé! 🌷`;
  }

  // 2. Mode "Chỉ nghe mình thôi" (User clicked or set mode to listen)
  if (mode === 'listen' || lower.includes('chỉ nghe') || lower.includes('chỉ muốn lắng nghe') || lower.includes('nghe tớ nói thôi')) {
    const listenReplies = [
      `Ừ, tớ nghe đây. Cậu cứ kể tiếp đi.`,
      `Ừm… tớ vẫn đang nghe nè.`,
      `Tớ đây nè, cậu cứ xả hết ra đi, không cần phải kể cho hay hay hợp lý đâu 🫂`,
      `Ừ, tớ đang ngồi nghe cậu nè. Cứ thong thả nói tiếp nhé.`
    ];
    return listenReplies[Math.floor(Math.random() * listenReplies.length)];
  }

  // 3. User Correction Signal (KHI NGƯỜI DÙNG SỬA CHATBOT)
  if (
    lower.startsWith('không phải') ||
    lower.startsWith('hông phải') ||
    lower.startsWith('ý tớ là') ||
    lower.startsWith('ý là') ||
    lower.includes('cậu hiểu sai rồi') ||
    lower.includes('không phải chuyện đó') ||
    lower.includes('ý tớ khác')
  ) {
    return `À à, tớ hiểu nhầm ý cậu rồi =)) Kể lại đoạn đó xíu cho tớ bắt đúng ý với nè!`;
  }

  // 4. User request "Cho mình cách khác"
  if (
    lower.includes('cách khác') ||
    lower.includes('góc nhìn khác') ||
    lower.includes('thử cách khác') ||
    lower.includes('nói cách khác')
  ) {
    return `Ừm, nếu nhìn theo một hướng khác xem sao nhé: Chuyện này có khi không tệ như lúc đầu mình nghĩ đâu. Đôi khi buông lỏng ra một chút, kệ cho mọi thứ trôi qua tối nay xem sao. Cậu thấy nghĩ thế có nhẹ đầu hơn không?`;
  }

  // 4b. User explicitly asking "Phải làm sao?", "Giờ nên làm gì?", "Xử lý thế nào?"
  if (
    lower.includes('phải làm sao') ||
    lower.includes('nên làm gì') ||
    lower.includes('làm gì bây giờ') ||
    lower.includes('giờ sao đây') ||
    lower.includes('giờ phải sao') ||
    lower.includes('xử lý thế nào') ||
    lower.includes('xử lý sao') ||
    lower.includes('giải quyết sao') ||
    lower.includes('giải quyết thế nào') ||
    lower.includes('tính sao đây') ||
    lower.includes('có cách nào') ||
    lower.includes('cho mình lời khuyên') ||
    lower.includes('cho tớ lời khuyên')
  ) {
    return `Tớ hiểu cảm giác bối rối lúc này rồi, đang rối mà chưa biết đi tiếp hướng nào thì dễ hoang mang thật sự ấy.

Nếu là tớ thì lúc này tớ sẽ thử thế này nè:
1. Đừng cố giải quyết hết mọi thứ một lúc, tạm hít thở sâu một nhịp để đầu bớt căng thẳng đã.
2. Chọn đúng một việc nhỏ nhất, dễ thở nhất ngay trước mắt để làm trước; còn những cái phức tạp khác cứ tạm để sang một bên.

Cậu đang thấy đoạn nào làm cậu vướng nhất lúc này, kể tớ nghe xíu để mình cùng gỡ nhé!`;
  }

  // 4c. User asking for clarification of immediate previous bot message ("?", "là sao?", "ý là gì?", "sao cơ?", "giải thích đi", "chưa hiểu")
  if (CLARIFICATION_PATTERNS.some(p => p.test(trimmed))) {
    if (lastBotReply) {
      const lBot = lastBotReply.toLowerCase();
      if (lBot.includes('ranh giới') || lBot.includes('đặt ranh giới')) {
        return `Ý tớ là cậu có thể nói rõ điều gì cậu thấy ổn và điều gì khiến cậu không thoải mái. Ví dụ nếu bạn bè hay trêu cậu quá mức, cậu có thể nói thẳng: "Ê cái này làm tớ hơi khó chịu, đừng trêu kiểu đó nữa nha." Đơn giản là bảo vệ cảm xúc của chính mình trước đã nè!`;
      }
      if (lBot.includes('5 phút') || lBot.includes('bước 5 phút')) {
        return `Ý tớ là lúc đang nản hay lười quá, cậu đừng nghĩ đến cả bài tập dài. Chỉ cần mở tập ra và làm đúng 5 phút thôi, hết 5 phút nếu vẫn mệt thì nghỉ. Thường khi bắt đầu được 5 phút là não mình đã vượt qua được cơn ngại ban đầu rồi ấy!`;
      }
      if (lBot.includes('suy đoán') || lBot.includes('sự kiện') || lBot.includes('tách')) {
        return `Ý tớ là thế này nè: Sự việc thực tế (ví dụ bạn ấy chưa nhắn lại) là một chuyện, còn suy nghĩ "chắc người ta ghét mình" là do mình tự suy đoán ra rồi tự làm mình buồn thôi. Cứ bình tĩnh nhìn vào thực tế, đừng để suy đoán làm khổ mình nha!`;
      }
      if (lBot.includes('chia nhỏ') || lBot.includes('việc nhỏ nhất')) {
        return `Ý tớ là thay vì cố làm cả đống thứ cùng lúc khiến đầu óc quá tải, cậu chọn đúng 1 việc dễ thở nhất làm trong 10-15 phút trước. Xong việc đó rồi hẵng tính tiếp, như vậy sẽ bớt ngợp hơn nhiều!`;
      }
      return `À, ý của câu vừa rồi là thế này nè: Cậu không cần phải gồng lên giải quyết mọi thứ to tát ngay lập tức đâu. Hãy thử làm một bước nhỏ nhất, thực tế nhất trước để bản thân thấy dễ chịu đã. Ví dụ như cho phép mình nghỉ ngơi 15 phút không đụng tới điện thoại, hoặc nói thật một câu ngắn gọn rõ ràng với người kia. Cậu thấy đoạn này dễ hình dung hơn chưa?`;
    }
    return `À, ý tớ là cậu cứ chọn một việc nhỏ nhất, dễ làm nhất trước mắt để bắt đầu, đừng để bản thân bị ngợp bởi quá nhiều thứ cùng lúc. Cậu đang thấy vướng ở điểm nào nhất, nói cho tớ nghe thêm nhé!`;
  }

  // 5. User answering previous bot question
  if (lastBotReply) {
    const lBot = lastBotReply.toLowerCase();
    if (lBot.includes('mấy bài đó nhiều lắm à') || lBot.includes('nhiều bài lắm à')) {
      if (lower === 'ừ' || lower === 'uh' || lower === 'nhiều' || lower.includes('nhiều lắm')) {
        return `Trời ơi =))) vậy thì tớ hiểu rồi. Có khi không phải bài khó, mà nhìn một đống bài trước mặt là đã muốn nằm luôn.`;
      }
    }
    if (lBot.includes('buồn, bực hay hoang mang') || lBot.includes('buồn, bực')) {
      if (lower.includes('hoang mang')) {
        return `Hoang mang à… ừm, nghe giống kiểu cậu đang có một đống thứ trong đầu mà chưa biết phải xử lý cái nào trước ấy nhỉ? Có chuyện gì làm cậu hoang mang nhất không?`;
      }
      if (lower.includes('bực')) {
        return `Bực là đúng rồi ấy, gặp chuyện ức chế thế này ai mà chẳng sôi máu lên 😭 Kể tớ nghe xem đoạn nào làm cậu cay cú nhất?`;
      }
      if (lower.includes('buồn')) {
        return `Ừ… buồn thì cứ buồn một chút cũng được. Cậu không cần phải gượng ép vui lại ngay đâu. Cứ nói hết với tớ nè.`;
      }
    }
    if (lBot.includes('ở trường hay ở nhà')) {
      if (lower.includes('ở trường') || lower === 'trường') {
        return `Ở trường thì đúng là ngột ngạt và khó xử thật... Lúc đó có đông đứa nhìn thấy không, hay chỉ có hai người thôi?`;
      }
      if (lower.includes('ở nhà') || lower === 'nhà') {
        return `Ở nhà thì lại càng dễ bí bách vì không gian quen thuộc... Có ai trong nhà biết chuyện chưa?`;
      }
    }
  }

  // 6. Good news / Pride: "Tớ được điểm cao rồi!!!", "được 9 toán"
  if (
    lower.includes('điểm cao') ||
    lower.includes('được 9') ||
    lower.includes('được 10') ||
    lower.includes('đậu rồi') ||
    lower.includes('làm được rồi') ||
    lower.includes('qua môn rồi')
  ) {
    return `ÊÊÊ thật hả 😭🔥 Đỉnh vậy!! Cậu học kiểu gì mà lên điểm dữ vậy =))) Xứng đáng tự hào cả tuần luôn nha!`;
  }

  // 7. "Hôm nay tớ mệt quá"
  if (lower.includes('mệt quá') || lower.includes('đuối quá') || lower.includes('hết pin') || lower.includes('kiệt sức')) {
    return `Nghe thôi là thấy hôm nay cậu bị vắt kiệt năng lượng rồi 😭 Thôi, kể tớ nghe xem hôm nay có chuyện gì nào.`;
  }

  // 8. "Chẳng có gì đặc biệt, chỉ là nhiều bài quá"
  if (
    (lower.includes('nhiều bài') || lower.includes('bài tập')) &&
    (lower.includes('chẳng có gì') || lower.includes('không có gì') || lower.includes('chỉ là'))
  ) {
    return `Àaaa kiểu không có một chuyện gì quá to, nhưng mọi thứ dồn lại một lúc nên mệt đúng không 😭 Mấy bài đó nhiều lắm à?`;
  }

  // 9. Quê / xấu hổ / bị mắng trước lớp
  if (lower.includes('bị cô mắng') || lower.includes('mắng trước lớp') || lower.includes('cười') || lower.includes('quê')) {
    return `Ui… cái này quê với tủi thân thật sự ấy. Bị mắng trước lớp đã khó chịu rồi, còn bị mấy đứa cười nữa thì càng bực 😭 Cậu cứ kể tiếp đi, tớ nghe.`;
  }

  // 10. "Thôi, không muốn kể" / Stop digging
  if (
    lower.includes('không muốn kể') ||
    lower.includes('thôi không kể') ||
    lower.includes('thôi bỏ đi') ||
    lower.includes('không muốn nói') ||
    lower.includes('thôi dẹp đi') ||
    lower === 'thôi' ||
    lower === 'kệ đi'
  ) {
    return `Ok =)) Không đào nữa. Muốn tớ kéo cậu sang chuyện khác không? Tớ có thể đố vui một câu, hỏi cậu một câu random nhẹ nhàng, hoặc kể chuyện xàm cho vui. Cậu muốn đổi gió sang gì nào?`;
  }

  // 11. User says "Không biết nữa"
  if (
    lower === 'không biết nữa' ||
    lower === 'không biết' ||
    lower === 'chẳng biết nữa' ||
    lower === 'chả biết nữa' ||
    lower.includes('không biết tại sao') ||
    lower.includes('không biết mình bị gì')
  ) {
    return `Ừ, không sao, vậy mình không cần đào nguyên nhân ngay.
Cậu đang thấy mệt, buồn, chán hay kiểu đầu óc trống rỗng? Cái gì đang làm cậu khó chịu nhất lúc này?`;
  }

  // 12. Crush seen không rep / suy đoán
  if (
    lower.includes('seen') ||
    lower.includes('không rep') ||
    lower.includes('không trả lời tin nhắn') ||
    (lower.includes('crush') && (lower.includes('lạnh nhạt') || lower.includes('bơ')))
  ) {
    return `Khoan kết luận nhanh vậy =)) Người ta chưa rep chưa đủ để chứng minh người ta ghét cậu hay bơ cậu đâu.
Có thể họ bận, quên điện thoại, đang ở với bố mẹ hoặc đơn giản là chưa biết rep gì cho mượt. Sự kiện là họ chưa rep, còn ‘họ ghét mình’ chỉ là suy đoán thôi. Cứ để đấy lát xem thế nào, đừng vội dằn vặt nha!`;
  }

  // 13. Crush / Tỏ tình / Thích một người
  if (lower.includes('crush') || lower.includes('thích một người') || lower.includes('tỏ tình') || lower.includes('thích bạn kia')) {
    return `Ủa khoan =))) Vụ này hồi hộp nha 👀 Kể tớ nghe xem người ta có hành động gì cụ thể với cậu rồi?`;
  }

  // 14. Friends / Cãi nhau với bạn bè
  if (lower.includes('bạn thân') || lower.includes('nghỉ chơi') || lower.includes('không nói chuyện') || lower.includes('tẩy chay') || lower.includes('cãi nhau với bạn')) {
    return `Nghe tới đây là tớ hiểu tại sao cậu khó chịu rồi 🥺 Đang chơi thân với nhau tự nhiên có khoảng cách thì hụt hẫng thật sự ấy. Nhưng mà khoan, kể tiếp đi, tớ muốn biết đoạn sau rốt cuộc là sao?`;
  }

  // 15. Family / Bố mẹ so sánh
  if (lower.includes('bố mẹ') || lower.includes('ba mẹ') || lower.includes('so sánh') || lower.includes('gia đình')) {
    return `Cứ hễ mở miệng ra là bị đem lên bàn cân so sánh với "con nhà người ta" thì bực với tủi thân thật sự... Cảm giác bao nhiêu cố gắng của mình người lớn chẳng thèm nhìn tới. Cậu cứ xả hết ra đây với tớ nè.`;
  }

  // 16. Chuyện rất nhỏ: "Mai mặc gì?", "Chán quá"
  if (lower.includes('mai mặc gì') || lower.includes('mặc gì')) {
    return `Haha, câu hỏi muôn thuở mỗi tối =)) Mai cậu đi học hay đi chơi thế? Nếu đi học thì cứ bộ nào thoải mái nhất mà quất, đỡ phải đau đầu suy nghĩ!`;
  }

  if (lower.includes('chán quá') || lower.includes('buồn chán') || lower === 'chán') {
    return `Chán kiểu nằm lướt điện thoại mà cũng chẳng biết xem gì đúng không =)) Muốn tớ kéo cậu sang cái gì đó xàm xàm cho vui không?`;
  }

  // 17. Light reactions / "chịu luôn =))"
  if (lower.includes('chịu luôn') || lower.includes('chị chịu') || lower === 'chịu') {
    return `=))) Nghe là biết cạn lời toàn tập rồi! Chuyện gì mà làm cậu chịu thua dữ vậy?`;
  }

  // 18. Topic change
  if (lower.startsWith('à mà') || lower.startsWith('tiện thể') || lower.startsWith('còn chuyện này')) {
    return `=))) Được luôn, chuyện kia tạm để đó cho não nghỉ đã. Chuyện mới này là gì thế, kể tớ nghe xem nào!`;
  }

  // 19. Context-adaptive friendly reaction (Avoid repetitive "cậu cứ kể tiếp đi")
  const friendlyFallbacks = [
    `Tớ vẫn đang ở đây với cậu nè. Nghe chuyện này là thấy hôm nay cậu phải chịu nhiều cảm xúc dồn nén rồi ấy. Có đoạn nào làm cậu bận tâm nhất không?`,
    `Tớ hiểu rồi, nhiều khi có những chuyện nó cứ lấn cấn trong lòng làm mình mệt mỏi thật sự. Cậu thấy trong người lúc này thế nào rồi?`,
    `Nghe chuyện này là tớ thấy đồng cảm với cậu liền luôn á. Cứ từ từ chia sẻ với tớ nghen, tớ ngồi đây cùng cậu nè.`,
    `Ừm, tớ vẫn đang ngồi cùng cậu đây. Nếu thấy mệt quá thì cứ nghỉ một xíu đã nhé, không cần phải gồng mình đâu nè.`
  ];
  return friendlyFallbacks[Math.floor(Math.random() * friendlyFallbacks.length)];
}


// Helper to sanitize bot reply and prevent forbidden repetitive templates
function sanitizeBotReply(rawText: string, recentHistory?: any[]): string {
  let cleaned = (rawText || '').trim();

  // 1. Remove greeting self-introduction if user didn't ask "bạn là ai"
  cleaned = cleaned.replace(/^chào bạn,?\s*mình là\s*["“]?Bạn ơi,?\s*mình nói nè["”]?.{0,50}?[.\n]/i, '');
  cleaned = cleaned.replace(/^mình là\s*["“]?Bạn ơi,?\s*mình nói nè["”]?[,.]\s*/i, '');

  // 2. Remove robot parroting at the beginning if present
  cleaned = cleaned.replace(/^mình hiểu rằng bạn đang [^.!?\n]+[.!?\n]\s*/i, '');
  cleaned = cleaned.replace(/^mình hiểu cảm giác của bạn khi [^.!?\n]+[.!?\n]\s*/i, '');
  cleaned = cleaned.replace(/^mình hiểu cảm giác của bạn[.!?\n]\s*/i, '');
  cleaned = cleaned.replace(/^tôi hiểu cảm xúc của bạn[.!?\n]\s*/i, '');
  cleaned = cleaned.replace(/^dường như bạn đang trải qua [^.!?\n]+[.!?\n]\s*/i, '');
  cleaned = cleaned.replace(/^bạn nên bình tĩnh[.!?\n]\s*/i, '');
  cleaned = cleaned.replace(/^hãy suy nghĩ tích cực[.!?\n]\s*/i, '');
  cleaned = cleaned.replace(/^chúc mừng bạn vì đã đạt được thành tích tốt[.!?\n]\s*/i, 'Ê đỉnh vậy! Chúc mừng cậu nha 🎉\n');

  // 3. Prevent repetitive ending "Nếu bạn muốn, mình có thể..."
  if (cleaned.toLowerCase().includes('nếu bạn muốn, mình có thể') || cleaned.toLowerCase().includes('nếu bạn muốn mình có thể') || cleaned.toLowerCase().includes('nếu cậu muốn, tớ có thể')) {
    const alternativeClosings = [
      'Cậu muốn kể tiếp đoạn này không?',
      'Cậu thấy sao?',
      'Nếu là tớ chắc tớ cũng muốn nghỉ một chút cho đỡ mệt.',
      'Cậu cứ thong thả nói tiếp nhé, tớ vẫn ngồi đây nè.'
    ];
    const chosen = alternativeClosings[Math.floor(Math.random() * alternativeClosings.length)];
    cleaned = cleaned.replace(/nếu bạn muốn,?\s*mình có thể[^.!?\n]*[.!?]?$/i, chosen);
    cleaned = cleaned.replace(/nếu bạn thích,?\s*mình có thể[^.!?\n]*[.!?]?$/i, chosen);
    cleaned = cleaned.replace(/nếu cậu muốn,?\s*tớ có thể[^.!?\n]*[.!?]?$/i, chosen);
  }

  // 4. Fallback safeguard: Never allow cleaning to strip the message down to nothing or a broken fragment
  if (!cleaned || cleaned.length < 15) {
    cleaned = (rawText || '').trim();
  }

  // 5. Ensure the response does not end abruptly mid-sentence with dangling commas or conjunctions
  if (cleaned.length > 0 && !/[.!?…~:)"'\`]$/.test(cleaned)) {
    let fixed = cleaned.replace(/[,;]\s*$/, '');
    fixed = fixed.replace(/\b(và|nhưng|hoặc|vì|bởi vì|do|nên|là|rằng|nếu|khi|đang|với|của|ở|trong|thì)\s*$/i, '');
    if (!/[.!?…~:)"'\`]$/.test(fixed.trim())) {
      fixed = fixed.trim() + '.';
    }
    cleaned = fixed;
  }

  return cleaned.trim() || 'Tớ vẫn đang lắng nghe cậu nè. Cậu chia sẻ thêm với tớ nhé! 🫂';
}

// POST /api/chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, supportMode = 'general', topic = '', recentResponseMemory } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const lastMessage = messages[messages.length - 1];
    const userPrompt = lastMessage.content;

    // Last bot reply if available (for anti-repetition)
    const lastBotMessage = [...messages].reverse().find((m: any) => m.role === 'model' || m.sender === 'bot');
    const lastBotReply = lastBotMessage?.content;

    // ⚡ FAST PATH & DECISION CLASSIFIER (Section 1, 5, 9, 10, 12, 14)
    // Run priority evaluation before any complex reasoning or heavy Gemini API calls:
    // 1. SAFETY MODE -> Immediate hotline & safe space
    // 2. CONCRETE REQUEST -> Normal AI
    // 3. EMOTIONAL / PROBLEM SIGNAL -> Normal AI
    // 4. CONTEXT MODE -> Context reasoning
    // 5. FAST PATH -> Short, natural teen response instantly (< 5ms)
    const classification = classifyChatMessage(
      userPrompt,
      messages.slice(0, -1),
      lastBotReply
    );

    if (classification.decision === 'SAFETY' && classification.response) {
      return res.json({ reply: classification.response, source: 'safety' });
    }

    if (classification.decision === 'FAST_PATH' && classification.response) {
      return res.json({
        reply: classification.response,
        source: 'fast_path',
        category: classification.category
      });
    }

    // Check if Gemini is available
    const gemini = getGeminiClient();
    if (!gemini) {
      // Use smart Vietnamese empathy engine with anti-repetition memory
      const reply = sanitizeBotReply(generateSmartFallback(userPrompt, supportMode, lastBotReply));
      return res.json({ reply, source: 'fallback' });
    }

    // Build context with support mode & topic
    let contextualInstruction = SYSTEM_INSTRUCTION;

    // Special conversational event signals (Rules 2, 6, 7)
    if (classification.isCorrection) {
      contextualInstruction += `\n\n🚨 TÍN HIỆU NGƯỜI DÙNG SỬA BẠN (CORRECTION SIGNAL): Người dùng vừa báo bạn hiểu sai hoặc đính chính ý ("${userPrompt}"). BỎ TOÀN BỘ GIẢ ĐỊNH CŨ NGAY LẬP TỨC. Nhận sai nhẹ nhàng, tự nhiên và bắt đúng ý mới theo câu này!`;
    }
    if (classification.isAnsweringQuestion) {
      contextualInstruction += `\n\n🎯 NGƯỜI DÙNG VỪA TRẢ LỜI CÂU HỎI TRƯỚC CỦA BẠN: Câu hỏi trước của bạn là: "${lastBotReply?.slice(0, 120)}...". Người dùng vừa trả lời là: "${userPrompt}". BẮT BUỘC tiếp tục mạch trò chuyện trực tiếp từ câu trả lời này. TUYỆT ĐỐI KHÔNG hỏi lại thông tin người dùng vừa đưa ra! Nếu người dùng chọn một phương án giải quyết, hãy đưa ra giải pháp ngay.`;
    }
    if (classification.isTopicSwitch) {
      contextualInstruction += `\n\n🔄 NGƯỜI DÙNG CHUYỂN CHỦ ĐỀ: Người dùng chủ động đổi sang chuyện mới ("${userPrompt}"). Hãy chuyển theo chủ đề mới ngay một cách hào hứng/tự nhiên, TUYỆT ĐỐI KHÔNG kéo người dùng quay lại câu hỏi hoặc chủ đề cũ!`;
    }
    if (classification.isAdviceRequest) {
      contextualInstruction += `\n\n💡 TÍN HIỆU CẦN LỜI KHUYÊN / HƯỚNG GIẢI QUYẾT ("${userPrompt}"):
- BẮT BUỘC PHẢI TRẢ LỜI NGAY: Không được để trống, không im lặng, không từ chối.
- Đồng cảm với cảm xúc bối rối/lo lắng của bạn mình trước.
- Đọc lại toàn bộ tin nhắn phía trước để hiểu rõ câu chuyện bạn đang gặp phải.
- Đưa ra ngay 1 - 2 hướng giải quyết/hành động cụ thể, thực tế, dễ làm ngay lúc này với phong cách người bạn thân.
- Nếu thiếu chi tiết, có thể hỏi thêm 1 câu ngắn để hiểu hơn, NHƯNG VẪN PHẢI ĐƯA RA GỢI Ý ĐẦU TIÊN TRƯỚC!`;
    }
    if (classification.isClarificationRequest) {
      contextualInstruction += `\n\n🔍 YÊU CẦU GIẢI THÍCH / LÀM RÕ CÂU VỪA NÓI ("${userPrompt}"):
- Người dùng vừa hỏi "${userPrompt}". Đây là tín hiệu họ CHƯA HIỂU hoặc muốn bạn GIẢI THÍCH LÀM RÕ câu bạn vừa nói ngay trước đó!
- CÂU TRẢ LỜI NGAY TRƯỚC ĐÓ CỦA BẠN LÀ:
"""
${lastBotReply || '(Chưa có câu trả lời trước)'}
"""
- BẮT BUỘC THỰC HIỆN THEO 4 BƯỚC NÀY:
  1. Đọc lại thật kỹ câu trả lời ngay trước đó của bạn ở trên.
  2. Xác định chính xác từ ngữ, khái niệm hoặc lời khuyên nào khiến người dùng chưa hiểu (ví dụ: "đặt ranh giới", "tách bạch suy nghĩ", "bước 5 phút", "chia nhỏ mục tiêu",...).
  3. Bắt đầu câu trả lời bằng cách giải thích lại ngay bằng ngôn ngữ bình dị, đơn giản như bạn thân nói với nhau (Ví dụ: "Ý tớ là...", "À, ý của câu vừa rồi là thế này nè:...").
  4. ĐƯA KÈM 1 VÍ DỤ CỤ THỂ, ĐỜI THƯỜNG trong thực tế để bạn ấy hình dung được ngay phải làm gì hoặc nói gì.
- TUYỆT ĐỐI KHÔNG:
  - KHÔNG đổi chủ đề khác.
  - KHÔNG nói chung chung hoặc lảng tránh.
  - KHÔNG nói "cậu cứ kể tiếp đi", "chắc cậu đang bối rối", "ừ tớ hiểu cậu đang thắc mắc".
  - KHÔNG hỏi lại một câu lạc quẻ không liên quan.`;
    }

    if (supportMode === 'listen') {
      contextualInstruction += `\nLƯU Ý CHẾ ĐỘ "CHỈ CẦN NGƯỜI NGHE": Người dùng chỉ muốn trút bầu tâm sự hoặc ngồi im có người đồng hành. TUYỆT ĐỐI KHÔNG đưa ra danh sách lời khuyên hay bước giải quyết. Chỉ lắng nghe, gật đầu chia sẻ, hỏi han dịu dàng hoặc giữ khoảng lặng êm đềm.`;
    } else if (supportMode === 'best_friend') {
      contextualInstruction += `\nLƯU Ý CHẾ ĐỘ "BẠN THÂN": Nói chuyện như đứa bạn thân cùng bàn: tự nhiên, vui vẻ, xài slang nhẹ ("=)))", "hơi căng nha", "quê xệ", "nghe cay cú hộ luôn"). Thẳng thắn, bảo vệ bạn nhưng vẫn rất ấm áp và không phán xét.`;
    } else if (supportMode === 'solve') {
      contextualInstruction += `\nLƯU Ý CHẾ ĐỘ "GỠ RỐI": Cùng người dùng chia nhỏ vấn đề thành từng bước nhỏ nhất. Giúp hạ nhiệt sự quá tải bằng cách giải quyết 1 việc dễ thở nhất trước.`;
    } else if (supportMode === 'reflect') {
      contextualInstruction += `\nLƯU Ý CHẾ ĐỘ "SUY NGHĨ / ĐỔI GÓC NHÌN": Đặt 1-2 câu hỏi gợi mở sâu sắc để người dùng tự nhận ra góc nhìn mới. Không áp đặt kết luận đúng/sai.`;
    } else if (supportMode === 'cheer') {
      contextualInstruction += `\nLƯU Ý CHẾ ĐỘ "ĐỘNG VIÊN": Khích lệ nhẹ nhàng, xóa bỏ cảm giác tự dằn vặt bản thân. Nhắc nhở người dùng rằng cố gắng sống sót qua một ngày mệt mỏi đã là một chiến thắng.`;
    } else if (supportMode === 'study') {
      contextualInstruction += `\nLƯU Ý CHẾ ĐỘ "ÁP LỰC HỌC TẬP": Tập trung giảm stress thi cử/bài vở. Chia nhỏ đề cương, không ép học dồn, khuyên nghỉ ngơi đúng lúc và nhấn mạnh điểm số không định nghĩa giá trị con người.`;
    }

    if (topic) {
      contextualInstruction += `\nChủ đề cuộc trò chuyện hiện tại: ${topic}.`;
    }

    // Dynamic Anti-Repetition memory block for this turn
    let antiRepetitionBlock = `\n═════════════════════════════════════════════════════════════════\nQUY TẮC CHỐNG LẶP CHO LƯỢT NÀY (BẮT BUỘC TUÂN THỦ):\n`;
    if (recentResponseMemory && Array.isArray(recentResponseMemory.history) && recentResponseMemory.history.length > 0) {
      const lastTurns = recentResponseMemory.history.slice(-3);
      const openingsUsed = lastTurns.map((t: any) => t.opening_phrase || t.opening_style).filter(Boolean);
      const closingsUsed = lastTurns.map((t: any) => t.closing_phrase || t.closing_style).filter(Boolean);
      const emojisUsed = lastTurns.flatMap((t: any) => t.emojis_used || []);
      const adviceGiven = lastTurns.flatMap((t: any) => t.advice_already_given || []);

      if (openingsUsed.length > 0) {
        antiRepetitionBlock += `- Các câu mở đầu đã dùng gần đây: "${openingsUsed.join('", "')}". Ở LƯỢT NÀY, BẠN BẮT BUỘC PHẢI DÙNG KIỂU MỞ ĐẦU HOÀN TOÀN KHÁC!\n`;
      }
      if (closingsUsed.length > 0) {
        antiRepetitionBlock += `- Các câu kết đã dùng gần đây: "${closingsUsed.join('", "')}". Ở LƯỢT NÀY, TUYỆT ĐỐI KHÔNG DÙNG LẶP LẠI!\n`;
      }
      if (emojisUsed.length > 0) {
        antiRepetitionBlock += `- Các emoji vừa dùng gần đây: ${Array.from(new Set(emojisUsed)).join(' ')}. Hãy đổi emoji khác hoặc không dùng emoji.\n`;
      }
      if (adviceGiven.length > 0) {
        antiRepetitionBlock += `- Lời khuyên đã nhắc trước đó: ${adviceGiven.join(', ')}. Nếu người dùng tiếp tục cùng vấn đề, đừng lặp lại lời khuyên cũ, hãy ghi nhận và đào sâu hơn.\n`;
      }
    }
    antiRepetitionBlock += `- TUYỆT ĐỐI KHÔNG dùng: "Mình hiểu cảm giác của bạn...", "Nếu bạn muốn, mình có thể...", "Điều đó chắc hẳn rất khó khăn...".\n- Tự kiểm tra: Câu trả lời đã nói như một người bạn thân thiết thật sự chưa? Có góc nhìn mới chưa? Đã tránh hoàn toàn các mẫu câu sáo rỗng chưa?\n═════════════════════════════════════════════════════════════════\n`;

    contextualInstruction += antiRepetitionBlock;

    // Convert previous messages to contents format (up to last 20 turns for deep context tracking)
    const formattedContents = messages.slice(-20).map((m: { role: string; content: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    try {
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Gemini API call timed out after 25s')), 25000)
      );

      let rawResponseText = '';

      // 1. Try modern Gemini Flash (gemini-3.8-flash)
      try {
        const geminiCall = gemini.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: formattedContents,
          config: {
            systemInstruction: contextualInstruction,
            temperature: 0.75,
            maxOutputTokens: 3500,
          }
        });

        const response = await Promise.race([geminiCall, timeoutPromise]);
        rawResponseText = response.text || '';
      } catch (primaryError) {
        console.warn('Primary Gemini Flash (gemini-3.8-flash) error, attempting fallback alias (gemini-flash-latest):', primaryError);
        
        // 2. Retry with gemini-flash-latest alias
        const retryCall = gemini.models.generateContent({
          model: 'gemini-flash-latest',
          contents: formattedContents,
          config: {
            systemInstruction: contextualInstruction,
            temperature: 0.75,
            maxOutputTokens: 3500,
          }
        });
        const retryResponse = await Promise.race([retryCall, timeoutPromise]);
        rawResponseText = retryResponse.text || '';
      }

      const replyText = sanitizeBotReply(
        rawResponseText || generateSmartFallback(userPrompt, supportMode, lastBotReply),
        recentResponseMemory?.history
      );
      return res.json({ reply: replyText, source: 'gemini' });
    } catch (apiError: unknown) {
      console.warn('Gemini API call caught error, smoothly returning warm empathetic fallback:', apiError);
      const fallbackReply = sanitizeBotReply(
        generateSmartFallback(userPrompt, supportMode, lastBotReply),
        recentResponseMemory?.history
      );
      return res.json({ reply: fallbackReply, source: 'fallback' });
    }

  } catch (error: unknown) {
    console.warn('Unexpected error in /api/chat, safely handling with warm fallback:', error);
    try {
      const userPrompt = req.body?.messages?.[req.body?.messages?.length - 1]?.content || '';
      const fallbackReply = sanitizeBotReply(
        generateSmartFallback(userPrompt, req.body?.supportMode || 'general', undefined),
        req.body?.recentResponseMemory?.history
      );
      return res.json({ reply: fallbackReply, source: 'fallback' });
    } catch {
      return res.json({
        reply: 'Tớ vẫn đang ở đây ngồi nghe cậu nè. Cứ thả lỏng rồi kể tiếp với tớ nhé, không cần phải diễn đạt thật hay đâu 🌿',
        source: 'fallback'
      });
    }
  }
});

// Auth middleware
function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  // Resilient token check: supports Bearer token, client mock tokens, or fallback session
  const token = authHeader || 'mock_guest_session';
  const user = db.getUserByToken(token);
  if (!user) {
    return res.status(401).json({ success: false, error: 'Unauthorized', message: 'Bạn cần đăng nhập để sử dụng tính năng này.' });
  }
  (req as any).user = user;
  next();
}

function optionalAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const user = db.getUserByToken(authHeader);
    if (user) {
      (req as any).user = user;
    }
  }
  next();
}

// 1. Google Sign-In / Account Creation & Session (OAuth / Google Account with password requirement)
app.post('/api/auth/google', (req, res) => {
  try {
    const { google_auth_id, googleId, email, password, suggestedNickname, suggestedAvatar } = req.body;
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ error: 'Email không hợp lệ.' });
    }

    if (!password || typeof password !== 'string' || !password.trim()) {
      return res.status(400).json({ error: 'Vui lòng nhập mật khẩu tự chọn để đăng nhập.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const authId = google_auth_id || googleId || `google_${Buffer.from(cleanEmail).toString('base64').replace(/=/g, '')}`;
    const result = db.findOrCreateGoogleUser({
      google_auth_id: authId,
      email: cleanEmail,
      password: password.trim(),
      suggestedNickname,
      suggestedAvatar
    });

    if (result.error || !result.user) {
      return res.status(401).json({ error: result.error || 'Sai mật khẩu. Vui lòng nhập đúng mật khẩu.' });
    }

    const token = db.createSession(result.user.id);

    // Return safe user object
    res.json({
      token,
      isNew: Boolean(result.isNew),
      user: db.getSafeUser(result.user)
    });
  } catch (error) {
    console.error('Error in /api/auth/google:', error);
    res.status(500).json({ error: 'Không thể đăng nhập Google.' });
  }
});

// 1b. Website Account Registration (Email + Dedicated Website Password)
app.post('/api/auth/register', (req, res) => {
  try {
    const { email, password, nickname } = req.body;
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ error: 'Vui lòng cung cấp địa chỉ email hợp lệ.' });
    }
    if (!password || typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({ error: 'Mật khẩu phải có ít nhất 8 ký tự.' });
    }

    const result = db.registerWithPassword({
      email,
      password,
      nickname
    });

    if (result.error || !result.user) {
      return res.status(400).json({ error: result.error || 'Đăng ký không thành công.' });
    }

    const token = db.createSession(result.user.id);

    res.status(201).json({
      success: true,
      token,
      user: db.getSafeUser(result.user)
    });
  } catch (error) {
    console.error('Error in /api/auth/register:', error);
    res.status(500).json({ error: 'Không thể đăng ký tài khoản.' });
  }
});

// 1c. Website Account Login (Email + Dedicated Website Password)
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Vui lòng nhập đầy đủ email và mật khẩu.' });
    }

    const result = db.loginWithPassword({
      email,
      password
    });

    if (result.error || !result.user) {
      return res.status(401).json({ error: result.error || 'Đăng nhập không thành công.' });
    }

    const token = db.createSession(result.user.id);

    res.json({
      success: true,
      token,
      user: db.getSafeUser(result.user)
    });
  } catch (error) {
    console.error('Error in /api/auth/login:', error);
    res.status(500).json({ error: 'Đăng nhập không thành công.' });
  }
});

// 1d. Forgot Password - Request Reset Code
app.post('/api/auth/forgot-password', (req, res) => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ error: 'Vui lòng nhập địa chỉ email hợp lệ.' });
    }

    const result = db.requestPasswordReset(email);
    res.json(result);
  } catch (error) {
    console.error('Error in /api/auth/forgot-password:', error);
    res.status(500).json({ error: 'Không thể gửi yêu cầu đặt lại mật khẩu.' });
  }
});

// 1e. Reset Password with Code (Keeps UID & preserves all user data)
app.post('/api/auth/reset-password', (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    if (!email || !code || !newPassword) {
      return res.status(400).json({ error: 'Vui lòng điền đầy đủ email, mã xác thực và mật khẩu mới.' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Mật khẩu mới phải có ít nhất 8 ký tự.' });
    }

    const result = db.resetPasswordWithCode({
      email,
      code,
      newPassword
    });

    if (result.error || !result.user) {
      return res.status(400).json({ error: result.error || 'Đặt lại mật khẩu thất bại.' });
    }

    const token = db.createSession(result.user.id);

    res.json({
      success: true,
      message: 'Đặt lại mật khẩu thành công! Bạn có thể tiếp tục sử dụng.',
      token,
      user: db.getSafeUser(result.user)
    });
  } catch (error) {
    console.error('Error in /api/auth/reset-password:', error);
    res.status(500).json({ error: 'Không thể đặt lại mật khẩu.' });
  }
});

// 1f. Change Password for logged in user (in Profile)
app.post('/api/auth/change-password', requireAuth, (req, res) => {
  try {
    const user: UserRecord = (req as any).user;
    const { currentPassword, newPassword } = req.body;

    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ error: 'Mật khẩu mới phải có ít nhất 8 ký tự.' });
    }

    const result = db.changePassword({
      userId: user.id,
      newPassword,
      currentPassword
    });

    if (!result.success) {
      return res.status(400).json({ error: result.error || 'Đổi mật khẩu không thành công.' });
    }

    res.json({
      success: true,
      message: 'Đổi mật khẩu thành công!'
    });
  } catch (error) {
    console.error('Error in /api/auth/change-password:', error);
    res.status(500).json({ error: 'Không thể đổi mật khẩu.' });
  }
});

// 2. Get current logged-in user profile
app.get('/api/auth/me', requireAuth, (req, res) => {
  const user: UserRecord = (req as any).user;
  res.json({
    user: db.getSafeUser(user)
  });
});

// 3. Logout
app.post('/api/auth/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    db.deleteSession(authHeader);
  }
  res.json({ success: true });
});

// 4. Update Profile (nickname, avatar)
app.put('/api/users/profile', requireAuth, (req, res) => {
  try {
    const user: UserRecord = (req as any).user;
    const { nickname, avatar } = req.body;

    const updated = db.updateUser(user.id, { nickname, avatar });
    if (!updated) {
      return res.status(404).json({ error: 'Người dùng không tồn tại.' });
    }

    res.json({
      success: true,
      user: {
        id: updated.id,
        email: updated.email,
        nickname: updated.nickname,
        avatar: updated.avatar,
        created_at: updated.created_at
      }
    });
  } catch (error) {
    console.error('Error in PUT /api/users/profile:', error);
    res.status(500).json({ error: 'Không thể cập nhật hồ sơ.' });
  }
});

// 4b. Update / Upload Avatar specifically linked to Account ID
app.post('/api/users/avatar', requireAuth, (req, res) => {
  try {
    const user: UserRecord = (req as any).user;
    const { avatar } = req.body;

    if (avatar === undefined || typeof avatar !== 'string') {
      return res.status(400).json({ error: 'Dữ liệu ảnh đại diện không hợp lệ.' });
    }

    const updated = db.updateUser(user.id, { avatar });
    if (!updated) {
      return res.status(404).json({ error: 'Người dùng không tồn tại.' });
    }

    res.json({
      success: true,
      avatar: updated.avatar,
      user: {
        id: updated.id,
        email: updated.email,
        nickname: updated.nickname,
        avatar: updated.avatar,
        created_at: updated.created_at
      }
    });
  } catch (error) {
    console.error('Error in POST /api/users/avatar:', error);
    res.status(500).json({ error: 'Không thể cập nhật ảnh đại diện.' });
  }
});

// 4c. Delete Avatar and revert to default for Account ID
app.delete('/api/users/avatar', requireAuth, (req, res) => {
  try {
    const user: UserRecord = (req as any).user;
    const updated = db.updateUser(user.id, { avatar: '' });
    if (!updated) {
      return res.status(404).json({ error: 'Người dùng không tồn tại.' });
    }

    res.json({
      success: true,
      avatar: '',
      user: {
        id: updated.id,
        email: updated.email,
        nickname: updated.nickname,
        avatar: updated.avatar,
        created_at: updated.created_at
      }
    });
  } catch (error) {
    console.error('Error in DELETE /api/users/avatar:', error);
    res.status(500).json({ error: 'Không thể đặt lại ảnh đại diện mặc định.' });
  }
});

// 5. Delete Account
app.delete('/api/users/account', requireAuth, (req, res) => {
  try {
    const user: UserRecord = (req as any).user;
    const deleted = db.deleteUser(user.id);
    res.json({ success: deleted });
  } catch (error) {
    console.error('Error in DELETE /api/users/account:', error);
    res.status(500).json({ error: 'Không thể xóa tài khoản.' });
  }
});

// 5b. Daily Advice ("Lời khuyên siêu tích cực" ✨) - Linked to Account ID, no repetition
app.get('/api/users/daily-advice', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const user = authHeader ? db.getUserByToken(authHeader) : null;
    const dateStr = (req.query.date as string) || new Date().toISOString().slice(0, 10);

    if (user) {
      const result = db.getOrCreateUserDailyAdvice(user.id, dateStr);
      return res.json({
        success: true,
        advice: result.advice,
        hasReadToday: result.hasReadToday,
        date: result.date
      });
    }

    // Guest fallback: if unauthenticated, use guestId query or client-handled
    const { DAILY_ADVICES } = await import('./src/data/dailyAdvices');
    const guestId = (req.query.guestId as string) || 'guest_user';
    let hash = 0;
    const seed = `${guestId}_${dateStr}`;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash << 5) - hash + seed.charCodeAt(i);
      hash |= 0;
    }
    const index = Math.abs(hash) % DAILY_ADVICES.length;

    res.json({
      success: true,
      advice: DAILY_ADVICES[index],
      hasReadToday: false,
      date: dateStr
    });
  } catch (error) {
    console.error('Error in GET /api/users/daily-advice:', error);
    res.status(500).json({ error: 'Không thể tải lời khuyên hôm nay.' });
  }
});

app.post('/api/users/daily-advice/read', requireAuth, (req, res) => {
  try {
    const user: UserRecord = (req as any).user;
    const dateStr = (req.body.date as string) || new Date().toISOString().slice(0, 10);

    const success = db.markUserDailyAdviceRead(user.id, dateStr);
    res.json({ success, date: dateStr });
  } catch (error) {
    console.error('Error in POST /api/users/daily-advice/read:', error);
    res.status(500).json({ error: 'Không thể cập nhật trạng thái đã xem.' });
  }
});

// 17. Sync User Journal (STRICTLY PRIVATE - linked only to authenticated user)
app.post('/api/journal/sync', requireAuth, (req, res) => {
  try {
    const user: UserRecord = (req as any).user;
    const { entries, capsules } = req.body;

    db.saveUserJournal(user.id, entries, capsules);
    res.json({ success: true, savedAt: new Date().toISOString() });
  } catch (error) {
    console.error('Error in /api/journal/sync:', error);
    res.status(500).json({ error: 'Lỗi đồng bộ nhật ký.' });
  }
});

// 18. Retrieve User Journal (STRICTLY PRIVATE)
app.get('/api/journal/my', requireAuth, (req, res) => {
  try {
    const user: UserRecord = (req as any).user;
    const data = db.getUserJournal(user.id);
    res.json(data);
  } catch (error) {
    console.error('Error in /api/journal/my:', error);
    res.status(500).json({ error: 'Lỗi tải nhật ký tài khoản.' });
  }
});

// 18b. Upload Journal Photo (Dedicated storage for journal entries)
app.post('/api/journal/upload', optionalAuth, (req, res) => {
  try {
    const { image, caption } = req.body;

    if (!image || typeof image !== 'string') {
      return res.status(400).json({ success: false, error: 'Thiếu dữ liệu ảnh để tải lên.' });
    }

    const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let buffer: Buffer;
    let ext = '.jpg';

    if (matches && matches.length === 3) {
      const mimeType = matches[1].toLowerCase();
      if (mimeType.includes('png')) ext = '.png';
      else if (mimeType.includes('webp')) ext = '.webp';
      else if (mimeType.includes('jpeg') || mimeType.includes('jpg')) ext = '.jpg';
      else {
        return res.status(400).json({ success: false, error: 'Định dạng ảnh không được hỗ trợ (chỉ hỗ trợ JPG, PNG, WEBP).' });
      }
      buffer = Buffer.from(matches[2], 'base64');
    } else {
      buffer = Buffer.from(image, 'base64');
    }

    // Maximum 10MB limit
    if (buffer.length > 10 * 1024 * 1024) {
      return res.status(400).json({ success: false, error: 'Dung lượng ảnh vượt quá giới hạn 10MB.' });
    }

    const uniqueId = `img_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const savedFilename = `${uniqueId}${ext}`;
    const destination = path.join(JOURNAL_UPLOADS_DIR, savedFilename);

    fs.writeFileSync(destination, buffer);

    const imageItem = {
      id: uniqueId,
      url: `/uploads/journal/${savedFilename}`,
      caption: typeof caption === 'string' ? caption.slice(0, 200) : undefined,
      createdAt: new Date().toISOString()
    };

    res.json({
      success: true,
      image: imageItem,
      message: 'Tải ảnh lên trang nhật ký thành công.'
    });
  } catch (error) {
    console.error('Error in /api/journal/upload:', error);
    res.status(500).json({ success: false, error: 'Không thể lưu ảnh nhật ký. Thử lại nhé.' });
  }
});

// 18c. Delete Journal Photo
app.delete('/api/journal/images/:id', optionalAuth, (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !/^[a-zA-Z0-9_-]+$/.test(id)) {
      return res.status(400).json({ success: false, error: 'ID ảnh không hợp lệ.' });
    }
    if (fs.existsSync(JOURNAL_UPLOADS_DIR)) {
      const files = fs.readdirSync(JOURNAL_UPLOADS_DIR);
      const targetFile = files.find((f) => f.startsWith(id));
      if (targetFile) {
        fs.unlinkSync(path.join(JOURNAL_UPLOADS_DIR, targetFile));
      }
    }
    res.json({ success: true, message: 'Đã xóa ảnh.' });
  } catch (error) {
    console.error('Error in DELETE /api/journal/images/:id:', error);
    res.status(500).json({ success: false, error: 'Lỗi khi xóa ảnh.' });
  }
});

// 19. Sync User Emotion Plant (STRICTLY PRIVATE - linked only to authenticated user)
app.post('/api/emotion-plant/sync', requireAuth, (req, res) => {
  try {
    const user: UserRecord = (req as any).user;
    const { seeds, plantState } = req.body;

    db.saveUserPlant(user.id, plantState || seeds);
    res.json({ success: true, savedAt: new Date().toISOString() });
  } catch (error) {
    console.error('Error in /api/emotion-plant/sync:', error);
    res.status(500).json({ error: 'Lỗi đồng bộ hạt giống cảm xúc.' });
  }
});

// 20. Retrieve User Emotion Plant (STRICTLY PRIVATE)
app.get('/api/emotion-plant/my', requireAuth, (req, res) => {
  try {
    const user: UserRecord = (req as any).user;
    const data = db.getUserPlant(user.id);
    res.json({ 
      success: true, 
      seeds: data.seeds || [],
      plant: data 
    });
  } catch (error) {
    console.error('Error in /api/emotion-plant/my:', error);
    res.status(500).json({ error: 'Lỗi tải dữ liệu cây cảm xúc.' });
  }
});

// Fast Math Best Score APIs
app.get('/api/user/fast-math-best', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.json({ success: true, bestScore: 0 });
    }
    const user = db.getUserByToken(authHeader);
    if (!user) {
      return res.json({ success: true, bestScore: 0 });
    }
    const bestScore = db.getUserFastMathBest(user.id);
    res.json({ success: true, bestScore });
  } catch (error) {
    console.error('Error in GET /api/user/fast-math-best:', error);
    res.status(500).json({ success: false, bestScore: 0 });
  }
});

app.post('/api/user/fast-math-best', (req, res) => {
  try {
    const { bestScore } = req.body;
    const scoreNum = Number(bestScore) || 0;
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.json({ success: true, bestScore: scoreNum });
    }
    const user = db.getUserByToken(authHeader);
    if (!user) {
      return res.json({ success: true, bestScore: scoreNum });
    }
    const updated = db.updateUserFastMathBest(user.id, scoreNum);
    res.json({ success: true, bestScore: updated });
  } catch (error) {
    console.error('Error in POST /api/user/fast-math-best:', error);
    res.status(500).json({ success: false, error: 'Lỗi lưu điểm.' });
  }
});

// API health endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    botName: 'Bạn ơi, mình nói nè',
    tagline: 'Có chuyện gì, cứ kể mình nghe.'
  });
});

// ============================================================================
// OPEN WHEN LETTERS ("NHỮNG BỨC THƯ 'MỞ RA KHI...'") REST APIs
// ============================================================================
// BỨC THƯ CHO BẢN THÂN ("LETTERS TO MY FUTURE SELF") REST APIs
// ============================================================================

// 1. Tạo bức thư mới
// POST /api/letters
app.post('/api/letters', (req, res) => {
  try {
    const {
      title,
      content,
      paper_style,
      ink_color,
      font_family,
      drawing_data,
      open_date,
      wax_seal,
      stickers_data,
      sender_name,
      receiver_name,
      // Legacy compatibility
      seal_icon,
      theme_color,
      condition_type,
      unlock_at
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, error: 'Tiêu đề bức thư không được để trống.' });
    }
    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, error: 'Nội dung bức thư không được để trống.' });
    }

    // Optional user attachment if authenticated
    let senderId: string | undefined = undefined;
    let effectiveSenderName = sender_name;
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const authUser = db.getUserByToken(authHeader);
      if (authUser) {
        senderId = authUser.id;
        if (!effectiveSenderName) {
          effectiveSenderName = authUser.nickname;
        }
      }
    }

    const targetOpenDate = open_date || unlock_at || new Date().toISOString().split('T')[0];

    const created = db.createLetter({
      sender_id: senderId,
      sender_name: effectiveSenderName || 'Tôi của hôm nay',
      receiver_name: receiver_name || 'Tôi của ngày mai',
      title,
      content,
      paper_style: paper_style || 'parchment',
      ink_color: ink_color || '#3b2a1e',
      font_family: font_family || 'serif',
      drawing_data: drawing_data || null,
      open_date: targetOpenDate,
      wax_seal: wax_seal || 'terracotta',
      stickers_data: stickers_data || undefined,
      seal_icon,
      theme_color,
      condition_type: condition_type || 'date',
      unlock_at: targetOpenDate
    });

    res.status(201).json({
      success: true,
      letter: created,
      share_key: created.share_key,
      message: 'Bức thư đã được niêm phong và cất giữ an toàn! 📜'
    });
  } catch (error) {
    console.error('Error creating self letter:', error);
    res.status(500).json({ success: false, error: 'Không thể tạo bức thư lúc này.' });
  }
});

// 2. Lấy danh sách tóm tắt các phong bì thư (KHÔNG lộ nội dung/nét vẽ nếu chưa đến ngày mở)
// GET /api/letters/summaries
app.get('/api/letters/summaries', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    let userId: string | undefined = undefined;
    if (authHeader) {
      const user = db.getUserByToken(authHeader);
      if (user) {
        userId = user.id;
      }
    }
    const summaries = db.getLetterSummaries(userId);
    res.json({
      success: true,
      summaries
    });
  } catch (error) {
    console.error('Error getting letter summaries:', error);
    res.status(500).json({ success: false, error: 'Không thể tải danh sách phong bì thư.' });
  }
});

// 3. Lấy chi tiết bức thư hoặc kiểm tra khóa thời gian
// GET /api/letters/:letterId
app.get('/api/letters/:letterId', (req, res) => {
  try {
    const { letterId } = req.params;

    const raw = db.getLetterById(letterId);
    if (!raw) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy phong bì thư này.' });
    }

    // Attempt to open/verify
    const result = db.openLetter(letterId);

    if (result.locked) {
      return res.json({
        success: false,
        locked: true,
        lock_message: result.lock_message,
        days_remaining: result.days_remaining,
        open_date: result.open_date,
        letter_summary: {
          id: raw.id,
          title: raw.title,
          sender_name: raw.sender_name,
          receiver_name: raw.receiver_name,
          paper_style: raw.paper_style,
          ink_color: raw.ink_color,
          font_family: raw.font_family,
          open_date: raw.open_date,
          wax_seal: raw.wax_seal,
          is_opened: false,
          created_at: raw.created_at
        }
      });
    }

    if (!result.success || !result.letter) {
      return res.status(400).json({
        success: false,
        error: result.lock_message || 'Không thể mở thư lúc này.'
      });
    }

    res.json({
      success: true,
      locked: false,
      letter: result.letter
    });
  } catch (error) {
    console.error('Error fetching letter:', error);
    res.status(500).json({ success: false, error: 'Không thể tải bức thư.' });
  }
});

// 4. Mở phong bì thư khi đã đến ngày hẹn
// POST /api/letters/:letterId/open
app.post('/api/letters/:letterId/open', (req, res) => {
  try {
    const { letterId } = req.params;

    const result = db.openLetter(letterId);

    if (result.locked) {
      return res.json({
        success: false,
        locked: true,
        lock_message: result.lock_message,
        days_remaining: result.days_remaining,
        open_date: result.open_date
      });
    }

    if (!result.success || !result.letter) {
      return res.status(400).json({
        success: false,
        error: result.lock_message || 'Không thể mở thư lúc này.'
      });
    }

    res.json({
      success: true,
      locked: false,
      letter: result.letter
    });
  } catch (error) {
    console.error('Error opening letter:', error);
    res.status(500).json({ success: false, error: 'Lỗi trong quá trình mở thư.' });
  }
});

// 5. Xóa bức thư
// DELETE /api/letters/:letterId
app.delete('/api/letters/:letterId', (req, res) => {
  try {
    const { letterId } = req.params;
    let userId: string | undefined = undefined;
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const authUser = db.getUserByToken(authHeader);
      if (authUser) {
        userId = authUser.id;
      }
    }

    const success = db.deleteLetter(letterId, userId);
    if (!success) {
      return res.status(404).json({ success: false, error: 'Không thể xóa bức thư này.' });
    }

    res.json({ success: true, message: 'Đã xóa bức thư thành công.' });
  } catch (error) {
    console.error('Error deleting letter:', error);
    res.status(500).json({ success: false, error: 'Lỗi khi xóa bức thư.' });
  }
});

// ============================================================================
// DYNAMIC CONFESSIONS & COMMUNITY REST APIs
// ============================================================================

app.get('/api/confessions', (req, res) => {
  try {
    const category = req.query.category as string | undefined;
    const sortBy = (req.query.sortBy as any) || 'newest';
    const search = req.query.search as string | undefined;
    let userId: string | undefined = undefined;
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const authUser = db.getUserByToken(authHeader);
      if (authUser) userId = authUser.id;
    }
    const bookmarkedIds = req.query.bookmarkedIds ? (req.query.bookmarkedIds as string).split(',').filter(Boolean) : [];

    const confessions = db.getConfessions({
      category,
      sortBy,
      search,
      userId,
      bookmarkedIds
    });
    res.json({ success: true, confessions });
  } catch (error) {
    console.error('Error fetching confessions:', error);
    res.status(500).json({ success: false, error: 'Không thể tải bài viết.' });
  }
});

app.post('/api/confessions', (req, res) => {
  try {
    const { title, content, category, isAnonymous, authorNickname } = req.body;
    if (!title || !title.trim() || !content || !content.trim()) {
      return res.status(400).json({ success: false, error: 'Tiêu đề và nội dung không được để trống.' });
    }
    let author = 'Người bạn nhỏ';
    let avatarSeed = 'guest_avatar_' + Math.floor(Math.random() * 1000);
    let authorType: 'user' | 'ai' = 'user';
    let userId: string | null = null;

    const authHeader = req.headers.authorization;
    if (authHeader) {
      const user = db.getUserByToken(authHeader);
      if (user) {
        userId = user.id;
        avatarSeed = user.avatar || avatarSeed;
        if (isAnonymous) {
          author = authorNickname?.trim() || 'Bạn nhỏ ẩn danh';
        } else {
          author = user.nickname?.trim() || authorNickname?.trim() || 'Thành viên';
        }
      } else {
        author = isAnonymous ? (authorNickname?.trim() || 'Bạn nhỏ ẩn danh') : (authorNickname?.trim() || 'Người bạn nhỏ');
      }
    } else {
      author = isAnonymous ? (authorNickname?.trim() || 'Bạn nhỏ ẩn danh') : (authorNickname?.trim() || 'Người bạn nhỏ');
    }

    const record = db.createConfession({
      userId,
      source: 'user',
      title: title.trim(),
      content: content.trim(),
      category: category || 'Khác',
      author,
      avatarSeed,
      isAnonymous: !!isAnonymous,
      authorType
    });

    const clientConfession = {
      id: record.id,
      userId: record.user_id,
      source: record.source,
      title: record.title,
      content: record.content,
      category: record.category,
      author: record.author,
      authorType: record.author_type,
      avatarSeed: record.avatar_seed,
      isAnonymous: record.is_anonymous,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
      visibility: record.visibility,
      status: record.status,
      empathyCount: record.empathy_count,
      meTooCount: record.me_too_count,
      comments: [],
      userReacted: userId ? { empathy: true } : {},
      isBookmarked: false
    };

    res.json({ success: true, confession: clientConfession });
  } catch (error) {
    console.error('Error creating confession:', error);
    res.status(500).json({ success: false, error: 'Lỗi đăng bài.' });
  }
});

app.delete('/api/confessions/:id', (req, res) => {
  try {
    const { id } = req.params;
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, error: 'Bạn cần đăng nhập để xóa bài viết.' });
    }
    const user = db.getUserByToken(authHeader);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Phiên đăng nhập không hợp lệ.' });
    }
    const isAdmin = Boolean((user as any).role === 'admin');
    const result = db.deleteConfession(id, user.id, isAdmin);
    if (!result.success) {
      return res.status(403).json(result);
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting confession:', error);
    res.status(500).json({ success: false, error: 'Lỗi xóa bài viết.' });
  }
});

app.post('/api/confessions/:id/react', (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body; // 'empathy' | 'meToo'
    let reactorId = req.body.reactorId || 'guest_reactor';
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const user = db.getUserByToken(authHeader);
      if (user) reactorId = user.id;
    }
    const result = db.reactConfession(id, reactorId, type);
    res.json(result);
  } catch (error) {
    console.error('Error reacting to confession:', error);
    res.status(500).json({ success: false });
  }
});

app.post('/api/confessions/:id/comments', (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, error: 'Nội dung bình luận không được trống.' });
    }
    let author = 'Người bạn nhỏ';
    let avatarSeed = 'commenter_' + Math.floor(Math.random() * 1000);
    let authorType: 'user' | 'ai' = 'user';
    let userId: string | null = null;
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const user = db.getUserByToken(authHeader);
      if (user) {
        userId = user.id;
        author = user.nickname?.trim() || 'Thành viên';
        avatarSeed = user.avatar || avatarSeed;
      }
    }
    const result = db.addConfessionComment(id, {
      userId,
      author,
      avatarSeed,
      content: content.trim(),
      authorType,
      source: 'user'
    });
    if (result.success && result.comment) {
      return res.json({
        success: true,
        comment: {
          id: result.comment.id,
          userId: result.comment.user_id,
          author: result.comment.author,
          authorType: result.comment.author_type,
          source: result.comment.source,
          avatarSeed: result.comment.avatar_seed,
          content: result.comment.content,
          createdAt: result.comment.created_at,
          timestamp: 'Vừa xong',
          likes: result.comment.likes || 0
        }
      });
    }
    res.json(result);
  } catch (error) {
    console.error('Error commenting confession:', error);
    res.status(500).json({ success: false });
  }
});

app.post('/api/confessions/:id/report', (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const result = db.reportConfession(id, reason || 'Báo cáo vi phạm tiêu chuẩn cộng đồng');
    res.json(result);
  } catch (error) {
    console.error('Error reporting confession:', error);
    res.status(500).json({ success: false });
  }
});

// ============================================================================
// DAILY NOTE & COMMUNITY STICKY NOTES APIs
// ============================================================================

app.get('/api/daily-note', (req, res) => {
  try {
    const dateStr = (req.query.date as string) || new Date().toISOString().split('T')[0];
    const note = getDailyNoteForDate(dateStr);
    res.json({ success: true, note, date: dateStr });
  } catch (error) {
    console.error('Error fetching daily note:', error);
    res.status(500).json({ success: false });
  }
});

app.get('/api/sticky-notes', (req, res) => {
  try {
    const notes = db.getStickyNotes();
    res.json({ success: true, notes });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

app.post('/api/sticky-notes', (req, res) => {
  try {
    const { content, color } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, error: 'Nội dung không được để trống.' });
    }
    let author = 'Người bạn nhỏ';
    let authorType: 'user' | 'ai' = 'user';
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const user = db.getUserByToken(authHeader);
      if (user) author = user.nickname;
    }
    const note = db.createStickyNote({
      content,
      author,
      authorType,
      color
    });
    res.json({ success: true, note });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

app.post('/api/sticky-notes/:id/like', (req, res) => {
  try {
    const { id } = req.params;
    const result = db.likeStickyNote(id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

// ============================================================================
// SCENARIO SYSTEM (MÌNH NÊN LÀM GÌ?)
// ============================================================================

app.get('/api/scenarios/categories', (req, res) => {
  res.json({
    categories: [
      { id: 'study_pressure', title: 'Áp lực học tập', icon: '📚' },
      { id: 'friendship', title: 'Bạn bè', icon: '👭' },
      { id: 'romance', title: 'Tình cảm', icon: '❤️' },
      { id: 'family', title: 'Gia đình', icon: '🏠' },
      { id: 'rejection', title: 'Bị từ chối', icon: '😣' },
      { id: 'saying_no', title: 'Không biết nói “không”', icon: '🙅' },
      { id: 'anxiety', title: 'Lo lắng', icon: '😰' },
      { id: 'anger_temper', title: 'Dễ nổi nóng', icon: '😡' },
      { id: 'disappointment', title: 'Cảm thấy thất vọng', icon: '😔' },
      { id: 'social_media', title: 'Mạng xã hội', icon: '📱' },
      { id: 'time_management', title: 'Quản lý thời gian', icon: '⏰' },
      { id: 'feeling_left_out', title: 'Cảm thấy bị bỏ rơi', icon: '🫥' },
      { id: 'achievement_pressure', title: 'Áp lực thành tích', icon: '🎯' },
      { id: 'expressing_thoughts', title: 'Khó nói ra suy nghĩ', icon: '💬' }
    ],
    totalCategories: 14,
    questionsPerCategory: 55,
    totalQuestions: 770
  });
});

// ============================================================================
// ACCOUNT PERSISTENCE / USER PROGRESS
// ============================================================================

app.get('/api/user/progress', requireAuth, (req, res) => {
  try {
    const progress = db.getUserProgress((req as any).user!.id);
    res.json(progress);
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

app.post('/api/user/progress', requireAuth, (req, res) => {
  try {
    const success = db.saveUserProgress((req as any).user!.id, req.body);
    res.json({ success });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

// Serve frontend: Vite middleware in dev, static files in prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
