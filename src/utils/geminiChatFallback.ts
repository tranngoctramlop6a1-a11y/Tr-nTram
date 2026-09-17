/**
 * Intelligent Fallback Engine for Teen Chatbot
 * 
 * Đảm bảo trải nghiệm tâm sự luôn liền mạch, ấm áp và êm đềm ngay cả khi:
 * - Thiết bị mất kết nối mạng / wifi chập chờn
 * - API Gemini gặp sự cố hoặc timeout
 * - Chưa cấu hình API Key
 * Thay vì hiện lỗi "mạng chập chờn / lỗi hệ thống", hệ thống sẽ trả về
 * phản hồi thấu cảm chuẩn phong cách Warm Minimalist của người bạn thân.
 */

import { SupportMode } from '../types';

export function getGentleFallbackResponse(
  prompt: string,
  mode: SupportMode = 'general',
  topic?: string,
  lastBotReply?: string
): string {
  const text = (prompt || '').trim();
  const lower = text.toLowerCase();

  // 1. Safety trigger - Ưu tiên hàng đầu (Bảo đảm an toàn tuyệt đối)
  if (
    lower.includes('tự tử') ||
    lower.includes('muốn chết') ||
    lower.includes('tự hại') ||
    lower.includes('rạch tay') ||
    lower.includes('kết thúc cuộc sống') ||
    lower.includes('không muốn sống') ||
    lower.includes('chết đi cho xong')
  ) {
    return `Tớ nghe đây, và tớ thật sự rất lo cho cậu... 🫂 Cảm giác kiệt sức và bế tắc lúc này chắc chắn đang đè nặng lên cậu rất nhiều. Nhưng cậu ơi, sự an toàn và tính mạng của cậu là điều quý giá nhất. Cậu không phải chịu đựng cơn giông bão này một mình đâu.

Tớ tha thiết mong cậu hãy mở lòng với một người lớn đáng tin cậy ở gần (bố mẹ, người thân, thầy cô), hoặc tìm đến phòng tư vấn tâm lý học đường.
Trong trường hợp nguy cấp đến sức khỏe thể chất, hãy gọi ngay cấp cứu:
- 🚑 **Cấp cứu y tế: 115**.

Tớ luôn ngồi ở đây lắng nghe cậu, hãy giữ an toàn cho mình nhé, bạn của tớ! 💗`;
  }

  // 2. Chế độ "Chỉ nghe mình thôi" (Listen mode)
  if (mode === 'listen' || lower.includes('chỉ nghe') || lower.includes('không cần khuyên')) {
    const listenReplies = [
      `Ừ, tớ nghe đây... Cậu cứ kể hết ra đi, tớ vẫn ngồi yên ở đây với cậu nè, không phán xét, không đưa lời khuyên đâu 🌿`,
      `Tớ vẫn đang ngồi bên cạnh lắng nghe cậu từng chút một nè. Cứ trút hết những gì đang đè nặng trong lòng ra nhé 🫂`,
      `Ừm... cậu cứ nói tiếp đi, tớ nghe. Không cần phải nói cho hay đâu, có gì trong đầu cứ xả hết với tớ nha.`,
      `Tớ ở đây với cậu. Đôi khi chỉ cần có người ngồi nghe mình thở dài thôi cũng đã đỡ ngột ngạt hơn rồi đúng không? Cứ từ từ nhé 🌸`
    ];
    return listenReplies[Math.floor(Math.random() * listenReplies.length)];
  }

  // 3. Hỏi làm rõ / "?", "là sao", "ý là gì"
  if (
    lower === '?' ||
    lower === '??' ||
    lower === '???' ||
    lower.startsWith('là sao') ||
    lower.startsWith('ý là gì') ||
    lower.startsWith('sao cơ') ||
    lower.includes('chưa hiểu') ||
    lower.includes('giải thích đi')
  ) {
    if (lastBotReply) {
      return `À, ý của tớ vừa nãy đơn giản là: khi mình đang bị rối hoặc quá tải, thay vì cố ép bản thân phải giải quyết một việc quá lớn, mình chỉ cần làm một bước nhỏ xíu trước mắt thôi. Ví dụ như nghỉ ngơi 5 phút, uống một ngụm nước, hoặc thở đều một chút. Cậu thấy chỗ nào làm cậu lấn cấn nhất, nói lại để tớ diễn giải dễ hiểu hơn nghen! 😊`;
    }
    return `À ý tớ là, chúng mình không cần phải vội tìm câu trả lời ngay lúc này đâu. Cậu cứ thong thả nói về điều làm cậu thấy băn khoăn nhất nhé, tớ ở đây để cùng cậu gỡ rối từng chút một!`;
  }

  // 4. "Hôm nay tớ mệt quá", "kiệt sức", "đuối"
  if (
    lower.includes('mệt quá') ||
    lower.includes('đuối quá') ||
    lower.includes('hết pin') ||
    lower.includes('kiệt sức') ||
    lower.includes('quá mệt mỏi')
  ) {
    return `Nghe thôi là thấy hôm nay cậu đã phải gồng mình nhiều lắm rồi 🥺 Ôm cậu một cái thật chặt nha! Hôm nay có chuyện gì ở trường hay ở nhà làm cậu cạn kiệt năng lượng dữ vậy? Nếu mệt quá thì cứ tựa vào đây nghỉ một chút, tớ lắng nghe hết nè.`;
  }

  // 5. Học tập & Thi cử
  if (
    lower.includes('lười học') ||
    lower.includes('mất động lực') ||
    lower.includes('không muốn học') ||
    lower.includes('bài tập nhiều') ||
    lower.includes('ngập trong bài')
  ) {
    return `Nhìn đống bài tập chất chồng là tự nhiên não nó muốn "đình công" liền đúng không =)) Tớ hiểu cảm giác này lắm. Thay vì nghĩ phải cày xong cả núi bài, giờ cậu thử chọn ra ĐÚNG MỘT BÀI dễ nhất hoặc làm trong 5 phút thôi xem sao. Làm xong bài đó rồi tính tiếp nghen!`;
  }

  if (
    lower.includes('mai kiểm tra') ||
    lower.includes('mai thi') ||
    lower.includes('chưa học gì') ||
    lower.includes('sợ rớt') ||
    lower.includes('sợ điểm kém')
  ) {
    return `Bình tĩnh nào bạn ơi, đừng hoảng nha! Giờ mà cố cày hết là bị loạn não đấy. Chiến thuật cứu cánh lúc này là:
1. Mở đề cương/vở ra, lướt các công thức hoặc ý chính gạch đầu dòng.
2. Nắm chắc phần điểm cơ bản để không bị liệt trước.
3. Uống một ngụm nước ấm rồi đi ngủ đúng giờ, giữ đầu óc tỉnh táo mai làm bài mới mượt được. Cố lên nhé, mai thi môn gì thế? 🍀`;
  }

  // 6. Tình cảm & Crush
  if (
    lower.includes('seen') ||
    lower.includes('không rep') ||
    lower.includes('crush') ||
    lower.includes('bơ') ||
    lower.includes('lạnh nhạt')
  ) {
    return `Khoan vội kết luận là người ta ghét mình nha =)) Người ta chưa rep có thể vì bận, đi tắm, bị bố mẹ tịch thu điện thoại, hoặc đang run không biết nhắn gì cho ngầu ấy chứ. Sự kiện là họ chưa nhắn, còn suy đoán thì thường chỉ làm mình buồn thêm thôi. Tạm để điện thoại sang một bên, hít thở một chút rồi lát ngó lại xem nào!`;
  }

  if (lower.includes('thích') && (lower.includes('bạn kia') || lower.includes('ai đó') || lower.includes('tỏ tình'))) {
    return `Ủa khoan =))) Vụ này hồi hộp nha! Kể tớ nghe xem người ta có phát tín hiệu gì đặc biệt với cậu chưa? Cứ chia sẻ thật lòng đi, tớ giữ bí mật 100% luôn! 👀`;
  }

  // 7. Bạn bè & Cãi nhau / Tẩy chay
  if (
    lower.includes('bạn thân') ||
    lower.includes('cãi nhau') ||
    lower.includes('nghỉ chơi') ||
    lower.includes('bị cô lập') ||
    lower.includes('tẩy chay') ||
    lower.includes('nói xấu')
  ) {
    return `Chuyện bạn bè mà có khúc mắc thì trong lòng bức bối và tủi thân kinh khủng ấy... Cảm giác người mình từng tin tưởng tự dưng xa cách hoặc hiểu lầm mình đau lòng thật sự. Cậu kể cho tớ nghe đầu đuôi xem nào, tớ ngồi đây bênh cậu nè 🥺`;
  }

  // 8. Gia đình & Bố mẹ so sánh
  if (
    lower.includes('bố mẹ') ||
    lower.includes('ba mẹ') ||
    lower.includes('so sánh') ||
    lower.includes('gia đình') ||
    lower.includes('bị mắng')
  ) {
    return `Cứ mỗi lần bị đem ra so sánh với "con nhà người ta" là vừa tức vừa bất lực đúng không cậu... Bao nhiêu công sức mình cố gắng dường như người lớn chẳng nhìn thấy, chỉ nhìn vào cái chưa hoàn hảo. Tớ hiểu cảm giác nghẹn ứ đó của cậu. Cứ trút hết ấm ức ra đây với tớ nhé, ở đây cậu luôn được công nhận! 🫂`;
  }

  // 9. "Không biết nữa", "chán quá", "trống rỗng"
  if (
    lower === 'không biết nữa' ||
    lower === 'chán quá' ||
    lower === 'chẳng biết nữa' ||
    lower.includes('trống rỗng') ||
    lower.includes('không biết bị sao')
  ) {
    return `Không sao cả đâu cậu ơi, không phải lúc nào mình cũng cần gọi tên chính xác cảm xúc hay tìm ra lý do. Đôi khi chỉ là lòng mình cần một khoảng lặng để nạp lại pin thôi. Cậu muốn tớ ngồi im cùng cậu một lúc, hay kể chuyện linh tinh cho cậu nghe vui vui nào? ✨`;
  }

  // 10. Chế độ "Bạn thân" (best_friend)
  if (mode === 'best_friend') {
    const friendReplies = [
      `Ê tớ nghe đây! Chuyện gì mà làm bạn tớ bận lòng thế, kể hết ra đây nghe coi nào! Có tớ ở đây rồi, đừng lo nha =))`,
      `Nghe là thấy có điềm rồi nha! Đứa nào làm cậu bực, hay có chuyện gì ấm ức kể mau tớ nghe xem nào!`,
      `Tớ đây tớ đây! Dù cả thế giới có quay cuồng thì tớ vẫn luôn đứng về phía cậu nhé. Uống miếng nước rồi kể tiếp tớ nghe xem! 🥤`
    ];
    return friendReplies[Math.floor(Math.random() * friendReplies.length)];
  }

  // 11. Chế độ "Động viên" (cheer)
  if (mode === 'cheer') {
    return `Cậu đã làm rất tốt khi kiên cường vượt qua từng ngày mệt mỏi như thế này rồi. Đừng quá khắt khe với bản thân nhé! Hôm nay cậu đã nỗ lực hết sức rồi, tớ rất tự hào về cậu đấy. Cứ chia sẻ tiếp với tớ bất cứ khi nào cậu muốn nha 🌸`;
  }

  // 12. Chế độ "Gỡ rối" (solve)
  if (mode === 'solve') {
    return `Được rồi, việc gì rồi cũng sẽ có cách gỡ thôi. Bây giờ vấn đề đang làm cậu rối rắm nhất là gì? Cậu cứ gạch đầu dòng ngắn gọn 1-2 việc lớn nhất ra đây, tớ với cậu cùng bóc tách từng cái một nhé! 🧩`;
  }

  // 13. Fallback chung sâu sắc, thấu cảm theo phong cách Warm Minimalist
  const genericWarmReplies = [
    `Tớ vẫn đang ở đây ngồi nghe cậu nè. Nghe qua là thấy hôm nay cậu phải mang trong mình nhiều tâm sự rồi ấy. Cứ thở một hơi thật sâu rồi kể tiếp với tớ nhé, không cần phải vội đâu 🌿`,
    `Ừm, tớ nghe rồi... Có những lúc mọi thứ cứ dồn dập đến làm mình chẳng biết bắt đầu từ đâu. Cậu cứ nói tiếp đi, tớ luôn ở đây đồng hành cùng cậu nè 🫂`,
    `Tớ đang lắng nghe thật kỹ từng lời của cậu đây. Cứ từ từ trải lòng ra nhé, ở đây hoàn toàn an toàn và không ai phán xét cậu cả đâu 🌸`,
    `Tớ luôn ở đây cùng cậu nè. Dù ngoài kia có ồn ào hay mệt mỏi ra sao, thì ở đây luôn có một góc bình yên dành riêng cho cậu. Cậu thấy trong người lúc này thế nào rồi? ✨`
  ];

  return genericWarmReplies[Math.floor(Math.random() * genericWarmReplies.length)];
}
