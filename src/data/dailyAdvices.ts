export interface DailyAdvice {
  id: string;
  topic: string;
  tag: string;
  icon: string;
  content: string;
}

export const DAILY_ADVICES: DailyAdvice[] = [
  // 1. Học tập & Điểm số
  {
    id: 'adv_001',
    topic: 'Học tập',
    tag: '📚 Học tập',
    icon: '✏️',
    content: 'Một bài kiểm tra điểm chưa như ý không định nghĩa bạn kém cỏi. Nó chỉ cho thấy bài học đó cần bạn thêm một chút thời gian nữa thôi. Hít thở sâu và ôn lại nhé!'
  },
  {
    id: 'adv_002',
    topic: 'Học tập',
    tag: '📚 Học tập',
    icon: '📖',
    content: 'Hôm nay nếu thấy bài tập quá nhiều và ngợp, hãy chọn đúng một bài nhỏ nhất để làm trước. Bắt đầu từ 5 phút đầu tiên luôn là phép màu đánh tan sự trì hoãn.'
  },
  {
    id: 'adv_003',
    topic: 'Học tập',
    tag: '📚 Học tập',
    icon: '💡',
    content: 'Hiểu được bản chất một câu hỏi quan trọng hơn việc học thuộc mười câu để đối phó. Hãy tò mò như một đứa trẻ, việc học sẽ bớt áp lực hơn rất nhiều.'
  },

  // 2. Áp lực & Khen chê
  {
    id: 'adv_004',
    topic: 'Áp lực',
    tag: '🌿 Áp lực',
    icon: '🍃',
    content: 'Bạn không cần phải hoàn hảo trong mắt tất cả mọi người. Sự kỳ vọng của người khác là góc nhìn của họ, còn cuộc sống và năng lượng này là của chính bạn.'
  },
  {
    id: 'adv_005',
    topic: 'Áp lực',
    tag: '🌿 Áp lực',
    icon: '☕',
    content: 'Khi lồng ngực thấy nặng trĩu, hãy thả lỏng hai vai, uống một ngụm nước ấm và nhìn ra ngoài cửa sổ 2 phút. Mọi việc rồi sẽ có cách giải quyết từng chút một.'
  },
  {
    id: 'adv_006',
    topic: 'Áp lực',
    tag: '🌿 Áp lực',
    icon: '🌱',
    content: 'Đừng tự gánh cả tương lai 5 hay 10 năm nữa lên đôi vai hôm nay. Việc của bạn ngày hôm nay chỉ đơn giản là sống trọn vẹn và nhẹ lòng với ngày hôm nay thôi.'
  },

  // 3. Thất bại & Sai lầm
  {
    id: 'adv_007',
    topic: 'Thất bại',
    tag: '🧗 Bắt đầu lại',
    icon: '🌈',
    content: 'Làm sai một lần không biến bạn thành kẻ thất bại. Đó là bằng chứng cho thấy bạn đã đủ dũng cảm để thử sức thay vì chỉ ngồi yên sợ hãi.'
  },
  {
    id: 'adv_008',
    topic: 'Thất bại',
    tag: '🧗 Bắt đầu lại',
    icon: '🌱',
    content: 'Chiếc bút chì nào cũng có cục tẩy ở đầu đuôi. Cuộc đời cho phép chúng ta phạm sai lầm, xóa đi và vẽ lại nét mới đẹp đẽ hơn bất cứ lúc nào.'
  },
  {
    id: 'adv_009',
    topic: 'Thất bại',
    tag: '🧗 Bắt đầu lại',
    icon: '🌦️',
    content: 'Cú vấp ngã hôm nay có thể đau, nhưng nó đang dạy cho đôi chân bạn biết cách giữ thăng bằng vững vàng hơn cho những chặng đường xa phía trước.'
  },

  // 4. Thành công nhỏ
  {
    id: 'adv_010',
    topic: 'Thành công nhỏ',
    tag: '⭐ Niềm vui nhỏ',
    icon: '✨',
    content: 'Dậy đúng giờ, gấp gọn chăn gối hay uống đủ nước cũng là những chiến thắng đáng khen. Đừng đợi đạt giải thưởng lớn mới cho phép mình tự hào về bản thân.'
  },
  {
    id: 'adv_011',
    topic: 'Thành công nhỏ',
    tag: '⭐ Niềm vui nhỏ',
    icon: '🌻',
    content: 'Hãy đếm những việc bạn đã làm được hôm nay, dù chỉ là kiên nhẫn nghe hết một tiết học buồn ngủ. Bạn đang nỗ lực nhiều hơn bạn nghĩ đấy!'
  },
  {
    id: 'adv_012',
    topic: 'Thành công nhỏ',
    tag: '⭐ Niềm vui nhỏ',
    icon: '🎯',
    content: 'Mỗi bước tiến dù chỉ dài nửa gang tay vẫn là đang tiến về phía trước. Hãy mỉm cười và tặng mình một lời khen vì đã không bỏ cuộc.'
  },

  // 5. Tự tin
  {
    id: 'adv_013',
    topic: 'Tự tin',
    tag: '🦁 Tự tin',
    icon: '🌟',
    content: 'Bạn không cần phải hoạt ngôn như người khác để được yêu quý. Sự chân thành, điềm tĩnh và biết lắng nghe của bạn chính là một loại sức hút rất riêng.'
  },
  {
    id: 'adv_014',
    topic: 'Tự tin',
    tag: '🦁 Tự tin',
    icon: '🦋',
    content: 'Giọng nói của bạn có giá trị, suy nghĩ của bạn đáng được lắng nghe. Đừng ngần ngại giơ tay hay nói lên ý kiến của mình chỉ vì sợ khác biệt.'
  },
  {
    id: 'adv_015',
    topic: 'Tự tin',
    tag: '🦁 Tự tin',
    icon: '☀️',
    content: 'Tự tin không phải là nghĩ rằng ai cũng sẽ thích mình. Tự tin là khi biết rằng dù ai đó không thích, bản thân mình vẫn hoàn toàn ổn và vững vàng.'
  },

  // 6. Tình bạn & Bạn bè
  {
    id: 'adv_016',
    topic: 'Tình bạn',
    tag: '🤝 Tình bạn',
    icon: '🌻',
    content: 'Một người bạn thật sự là người khiến bạn cảm thấy thoải mái được là chính mình, không cần gồng mình hay đeo mặt nạ để hòa nhập vào nhóm.'
  },
  {
    id: 'adv_017',
    topic: 'Tình bạn',
    tag: '🤝 Tình bạn',
    icon: '💬',
    content: 'Nếu có hiểu lầm với bạn thân, hãy thử nói chuyện trực tiếp thay vì im lặng đoán ý nhau. Đôi khi chỉ một câu hỏi han chân thành là khúc mắc tan biến.'
  },
  {
    id: 'adv_018',
    topic: 'Tình bạn',
    tag: '🤝 Tình bạn',
    icon: '🎈',
    content: 'Đừng ngại từ chối một cuộc đi chơi nếu cơ thể bạn đang kiệt sức. Bạn bè tốt sẽ luôn tôn trọng khoảng lặng và sức khỏe của bạn.'
  },
  {
    id: 'adv_019',
    topic: 'Tình bạn',
    tag: '🤝 Tình bạn',
    icon: '💌',
    content: 'Vòng tròn bạn bè ít hay nhiều không quan trọng bằng việc ở bên họ, bạn cảm thấy lòng mình ấm áp và được tôn trọng.'
  },

  // 7. Rung động tuổi teen & Tình cảm
  {
    id: 'adv_020',
    topic: 'Tình cảm tuổi teen',
    tag: '💌 Cảm xúc',
    icon: '🌸',
    content: 'Thích một ai đó là cảm xúc rất dễ thương của tuổi học trò. Hãy để nó làm động lực để bạn cùng người ấy học tốt hơn và trở thành phiên bản rạng rỡ hơn.'
  },
  {
    id: 'adv_021',
    topic: 'Tình cảm tuổi teen',
    tag: '💌 Cảm xúc',
    icon: '🍃',
    content: 'Nếu tình cảm đơn phương không được đáp lại, đừng tự ti về bản thân. Trái tim bạn biết rung động đã là một điều đẹp đẽ, người trân trọng bạn thật sự đang ở phía trước.'
  },
  {
    id: 'adv_022',
    topic: 'Tình cảm tuổi teen',
    tag: '💌 Cảm xúc',
    icon: '🌷',
    content: 'Trước khi muốn ai đó yêu quý mình thật nhiều, hãy dành thời gian chăm sóc và dịu dàng với chính bản thân mình trước đã nhé.'
  },

  // 8. Gia đình & Bất đồng
  {
    id: 'adv_023',
    topic: 'Gia đình',
    tag: '🏡 Gia đình',
    icon: '🍵',
    content: 'Bố mẹ đôi khi nói lời làm ta phật ý vì khoảng cách thế hệ, nhưng sự lo lắng cho bạn thì luôn có thật. Hãy chia sẻ với bố mẹ từ những điều nhỏ mỗi ngày.'
  },
  {
    id: 'adv_024',
    topic: 'Gia đình',
    tag: '🏡 Gia đình',
    icon: '🕯️',
    content: 'Khi không khí gia đình căng thẳng, im lặng chờ cơn giận qua đi tốt hơn ngàn lời cãi vã. Bạn có quyền giữ ranh giới bình yên cho tâm trí mình.'
  },
  {
    id: 'adv_025',
    topic: 'Gia đình',
    tag: '🏡 Gia đình',
    icon: '🥣',
    content: 'Một lời cảm ơn nhỏ sau bữa cơm hay một câu hỏi han khi bố mẹ đi làm về có thể làm tan biến rất nhiều mỏi mệt trong nhà.'
  },

  // 9. Nghỉ ngơi & Nạp năng lượng
  {
    id: 'adv_026',
    topic: 'Nghỉ ngơi',
    tag: '🌙 Nghỉ ngơi',
    icon: '🛌',
    content: 'Nghỉ ngơi không phải là lười biếng. Chiếc điện thoại cần sạc pin để hoạt động thì tâm trí và cơ thể bạn cũng cần được ngủ đủ giấc để tỏa sáng.'
  },
  {
    id: 'adv_027',
    topic: 'Nghỉ ngơi',
    tag: '🌙 Nghỉ ngơi',
    icon: '🎵',
    content: 'Tối nay hãy thử tắt thông báo sớm hơn 30 phút, nghe một bản nhạc êm dịu và thả lỏng cơ thể. Bạn xứng đáng có một giấc ngủ thật ngon lành.'
  },
  {
    id: 'adv_028',
    topic: 'Nghỉ ngơi',
    tag: '🌙 Nghỉ ngơi',
    icon: '🛋️',
    content: 'Có những ngày cách nỗ lực tốt nhất đơn giản là: không làm gì cả, để bản thân được lười một chút mà không cảm thấy tội lỗi.'
  },

  // 10. Yêu bản thân & Ngoại hình
  {
    id: 'adv_029',
    topic: 'Yêu bản thân',
    tag: '💖 Yêu bản thân',
    icon: '🪞',
    content: 'Khuôn mặt, mái tóc hay nụ cười của bạn đều mang nét độc nhất vô nhị. Đừng để những bộ lọc trên mạng xã hội làm bạn quên mất vẻ đẹp tự nhiên của mình.'
  },
  {
    id: 'adv_030',
    topic: 'Yêu bản thân',
    tag: '💖 Yêu bản thân',
    icon: '🎀',
    content: 'Mặc bộ quần áo khiến bạn thấy thoải mái, buộc kiểu tóc làm bạn thấy tự tin. Bạn sinh ra để tận hưởng cuộc sống, không phải để làm vừa mắt tất cả.'
  },
  {
    id: 'adv_031',
    topic: 'Yêu bản thân',
    tag: '💖 Yêu bản thân',
    icon: '🌷',
    content: 'Hãy nói chuyện với chính mình bằng sự dịu dàng như cách bạn đang an ủi một người bạn thân nhất khi họ buồn. Bạn đáng được đối xử tử tế như vậy.'
  },

  // 11. Không so sánh bản thân
  {
    id: 'adv_032',
    topic: 'Không so sánh',
    tag: '🌿 Bình yên',
    icon: '🌻',
    content: 'Bông hoa hướng dương không cần tranh đua với hoa sen, mỗi loài hoa đều có mùa rực rỡ của riêng mình. Bạn có hành trình và nhịp độ riêng, đừng vội.'
  },
  {
    id: 'adv_033',
    topic: 'Không so sánh',
    tag: '🌿 Bình yên',
    icon: '📱',
    content: 'Những gì người khác khoe trên mạng xã hội chỉ là thước phim nổi bật nhất của họ. Đừng lấy hậu trường của mình đem so với sân khấu rực rỡ của người ta.'
  },
  {
    id: 'adv_034',
    topic: 'Không so sánh',
    tag: '🌿 Bình yên',
    icon: '🧭',
    content: 'Đối thủ duy nhất đáng để bạn để tâm là phiên bản của chính mình ngày hôm qua: hiểu biết hơn một chút, bao dung hơn một chút là bạn đã thắng rồi.'
  },

  // 12. Kiên trì & Chậm mà chắc
  {
    id: 'adv_035',
    topic: 'Kiên trì',
    tag: '🌱 Bền bỉ',
    icon: '🐢',
    content: 'Mỗi ngày tích lũy thêm 1 từ vựng mới, 1 công thức toán hay 1 trang sách. Nhìn thì ít, nhưng 1 năm sau bạn sẽ bất ngờ trước sự thay đổi vĩ đại ấy.'
  },
  {
    id: 'adv_036',
    topic: 'Kiên trì',
    tag: '🌱 Bền bỉ',
    icon: '💧',
    content: 'Nước chảy đá mòn không phải nhờ sức mạnh ghê gớm, mà nhờ sự kiên trì không đứt đoạn qua từng ngày. Cứ từng bước nhỏ một bạn nhé!'
  },
  {
    id: 'adv_037',
    topic: 'Kiên trì',
    tag: '🌱 Bền bỉ',
    icon: '🎋',
    content: 'Cây tre dành 4 năm chỉ để phát triển bộ rễ dưới lòng đất trước khi vươn cao vút. Giai đoạn bạn thấy mình dậm chân tại chỗ có thể là lúc rễ đang bén sâu.'
  },

  // 13. Mất động lực & Trì trệ
  {
    id: 'adv_038',
    topic: 'Mất động lực',
    tag: '⚡ Tiếp sức',
    icon: '🔋',
    content: 'Không có động lực là chuyện hết sức bình thường của con người. Không cần phải luôn hừng hực khí thế, chỉ cần giữ thói quen làm một chút mỗi ngày là đủ.'
  },
  {
    id: 'adv_039',
    topic: 'Mất động lực',
    tag: '⚡ Tiếp sức',
    icon: '🚶',
    content: 'Nếu không chạy được thì đi bộ, nếu không đi được thì bò từng bước. Miễn là bạn không quay đầu bỏ cuộc, bạn vẫn đang tiến gần đến mục tiêu.'
  },
  {
    id: 'adv_040',
    topic: 'Mất động lực',
    tag: '⚡ Tiếp sức',
    icon: '🎯',
    content: 'Nhớ lại lý do ban đầu bạn từng háo hức muốn bắt đầu. Ngọn lửa nhỏ đó vẫn còn âm ỉ bên trong, chỉ đang đợi một hơi thở ấm để bùng lên lại.'
  },

  // 14. Bắt đầu lại
  {
    id: 'adv_041',
    topic: 'Bắt đầu lại',
    tag: '🌅 Khởi đầu mới',
    icon: '✨',
    content: 'Mỗi buổi sáng thức dậy là một trang giấy hoàn toàn mới toanh. Hôm qua dù có tồi tệ hay ngổn ngang thế nào, hôm nay bạn có quyền vẽ lại nét mới.'
  },
  {
    id: 'adv_042',
    topic: 'Bắt đầu lại',
    tag: '🌅 Khởi đầu mới',
    icon: '🕊️',
    content: 'Không có thời điểm nào là quá muộn để làm lại một thói quen tốt. Bất kể là giữa tuần, giữa tháng hay chiều muộn, bấm nút "Bắt đầu" ngay bây giờ luôn đúng.'
  },
  {
    id: 'adv_043',
    topic: 'Bắt đầu lại',
    tag: '🌅 Khởi đầu mới',
    icon: '🌿',
    content: 'Lá vàng rụng xuống để chồi non xanh mướt mọc lên. Hãy để những nỗi buồn cũ ở lại phía sau và đón nhận những điều tươi mới đang tới.'
  },

  // 15. Dám thử & Vượt qua vùng an toàn
  {
    id: 'adv_044',
    topic: 'Dám thử',
    tag: '🚀 Dũng cảm',
    icon: '🔥',
    content: 'Cảm giác hồi hộp trước khi thử một điều mới chính là dấu hiệu bạn đang bắt đầu lớn lên. Hãy hít thật sâu và dấn bước, bạn mạnh mẽ hơn bạn tưởng.'
  },
  {
    id: 'adv_045',
    topic: 'Dám thử',
    tag: '🚀 Dũng cảm',
    icon: '🎤',
    content: 'Một lần dám đứng lên phát biểu trước lớp có thể run rẩy, nhưng sau đó bạn sẽ nhận ra: "Hóa ra cũng chẳng có gì đáng sợ như mình từng nghĩ!"'
  },
  {
    id: 'adv_046',
    topic: 'Dám thử',
    tag: '🚀 Dũng cảm',
    icon: '🎨',
    content: 'Thử vẽ một bức tranh, học một loại nhạc cụ hay thử một môn thể thao mới. Đừng sợ vẽ xấu hay chơi dở, niềm vui nằm ở quá trình bạn trải nghiệm.'
  },

  // 16. Trưởng thành & Những biến đổi tâm lý
  {
    id: 'adv_047',
    topic: 'Trưởng thành',
    tag: '🌱 Trưởng thành',
    icon: '🪴',
    content: 'Đôi khi bạn thấy mình thật mâu thuẫn: vừa muốn làm người lớn tự do, vừa thèm được bé lại như ngày xưa. Đó là nốt chuyển mình tự nhiên của tuổi dậy thì.'
  },
  {
    id: 'adv_048',
    topic: 'Trưởng thành',
    tag: '🌱 Trưởng thành',
    icon: '🧭',
    content: 'Trưởng thành không phải là học cách kìm nén cảm xúc cho chai sạn, mà là biết gọi tên cảm xúc của mình và học cách ôm lấy nó bằng sự thấu hiểu.'
  },
  {
    id: 'adv_049',
    topic: 'Trưởng thành',
    tag: '🌱 Trưởng thành',
    icon: '🌟',
    content: 'Biết nói lời "Cảm ơn" khi được giúp và "Xin lỗi" khi làm sai là hai chìa khóa vàng giúp bạn trở thành một người thật sự chững chạc và đáng tin cậy.'
  },

  // 17. Tha thứ cho bản thân
  {
    id: 'adv_050',
    topic: 'Tha thứ',
    tag: '🕊️ Bao dung',
    icon: '💛',
    content: 'Đừng tự dằn vặt mình mãi vì một câu nói lỡ lời hay một quyết định vụng về ngày hôm qua. Lúc đó bạn đã hành động với hiểu biết tốt nhất bạn có rồi.'
  },
  {
    id: 'adv_051',
    topic: 'Tha thứ',
    tag: '🕊️ Bao dung',
    icon: '🌧️',
    content: 'Cơn mưa nào rồi cũng phải tạnh để bầu trời hửng nắng. Hãy mở rộng lòng mình, tha thứ cho những lỗi lầm cũ để bước tiếp nhẹ nhõm hơn.'
  },
  {
    id: 'adv_052',
    topic: 'Tha thứ',
    tag: '🕊️ Bao dung',
    icon: '🤲',
    content: 'Bạn luôn sẵn lòng tha thứ cho bạn bè khi họ lỡ làm bạn buồn, vậy tại sao lại khắt khe với chính mình? Hãy ôm lấy bản thân và nói: "Không sao đâu nhé!"'
  },

  // 18. Những ngày tồi tệ & Buồn bã
  {
    id: 'adv_053',
    topic: 'Ngày tồi tệ',
    tag: '🌧️ Vỗ về',
    icon: '☔',
    content: 'Có những ngày mọi thứ dường như đều chống lại bạn. Cứ khóc nếu muốn, nước mắt sẽ rửa trôi bụi bặm trong lòng. Ngày mai trời lại sáng thôi.'
  },
  {
    id: 'adv_054',
    topic: 'Ngày tồi tệ',
    tag: '🌧️ Vỗ về',
    icon: '🍵',
    content: 'Hôm nay chỉ là một ngày tồi tệ, không phải cả cuộc đời tồi tệ. Hãy nhớ rằng những đám mây đen giông bão nhất cũng không thể che mãi ánh mặt trời.'
  },
  {
    id: 'adv_055',
    topic: 'Ngày tồi tệ',
    tag: '🌧️ Vỗ về',
    icon: '🛌',
    content: 'Nếu hôm nay bạn chỉ đủ sức để tồn tại và thở đều qua hết ngày, điều đó cũng là một sự kiên cường to lớn rồi. Nghỉ ngơi nhé, ngày mai sẽ tốt hơn.'
  },

  // 19. Biết ơn & Góc nhìn tích cực
  {
    id: 'adv_056',
    topic: 'Biết ơn',
    tag: '🌻 Tích cực',
    icon: '☀️',
    content: 'Tìm thấy một góc ban công mát mẻ, ăn một món kem ngon hay nghe thấy tiếng cười của ai đó. Hạnh phúc thường lấp lánh ở những khoảnh khắc rất giản dị.'
  },
  {
    id: 'adv_057',
    topic: 'Biết ơn',
    tag: '🌻 Tích cực',
    icon: '💌',
    content: 'Thử nói với một người xung quanh rằng bạn trân trọng họ hôm nay. Khi gieo niềm vui cho người khác, chính tim bạn cũng sẽ ngập tràn ánh sáng.'
  },
  {
    id: 'adv_058',
    topic: 'Biết ơn',
    tag: '🌻 Tích cực',
    icon: '🌱',
    content: 'Thay vì than phiền vì bài tập nhiều, hãy nghĩ rằng ta may mắn vì còn có cơ hội được học hỏi và tiếp cận tri thức mỗi ngày.'
  },

  // 20. Quản lý cảm xúc & Nóng giận
  {
    id: 'adv_059',
    topic: 'Cảm xúc',
    tag: '🧘 Cân bằng',
    icon: '🌊',
    content: 'Khi cơn giận bốc lên đầu, đếm ngược từ 10 về 1 trước khi mở lời. Một phút kiềm chế lúc nóng nảy sẽ cứu bạn khỏi hàng tuần ân hận sau này.'
  },
  {
    id: 'adv_060',
    topic: 'Cảm xúc',
    tag: '🧘 Cân bằng',
    icon: '🌬️',
    content: 'Cảm xúc chỉ như những vị khách ghé thăm nhà bạn rồi rời đi. Bạn không cần xua đuổi chúng, chỉ cần quan sát và thở đều, cảm xúc sẽ tự lắng xuống.'
  },

  // 21. Lắng nghe trực giác & Định hướng
  {
    id: 'adv_061',
    topic: 'Định hướng',
    tag: '🧭 Bản lĩnh',
    icon: '⭐',
    content: 'Chưa biết mình thích gì hay muốn làm nghề gì trong tương lai là điều hoàn toàn bình thường ở tuổi này. Cứ tò mò khám phá, câu trả lời sẽ hé lộ dần.'
  },
  {
    id: 'adv_062',
    topic: 'Định hướng',
    tag: '🧭 Bản lĩnh',
    icon: '🎨',
    content: 'Đừng chọn ước mơ chỉ vì nó nghe oách trong mắt bạn bè. Hãy chọn thứ khiến đôi mắt bạn sáng lên mỗi khi được bắt tay vào tìm tòi, sáng tạo.'
  },

  // 22. Mạng xã hội & Không gian số
  {
    id: 'adv_063',
    topic: 'Không gian mạng',
    tag: '📵 Thư giãn',
    icon: '🌿',
    content: 'Một ngày không lướt mạng xã hội sẽ không làm bạn tụt hậu, nhưng chắc chắn sẽ trả lại cho bạn sự yên bình hiếm hoi trong tâm trí. Thử xem nhé!'
  },
  {
    id: 'adv_064',
    topic: 'Không gian mạng',
    tag: '📵 Thư giãn',
    icon: '🛡️',
    content: 'Nếu một bài đăng hay một người trên mạng khiến bạn thấy mình kém cỏi và khó chịu, hãy mạnh dạn bấm ẩn hoặc bỏ theo dõi. Bạn có quyền bảo vệ năng lượng của mình.'
  },

  // 23. Những thói quen tốt
  {
    id: 'adv_065',
    topic: 'Thói quen',
    tag: '🌱 Thói quen tốt',
    icon: '💧',
    content: 'Mỗi sáng thức dậy, uống một cốc nước đầy và vươn vai chào ngày mới. Cơ thể bạn sẽ cảm ơn bạn vì sự khởi đầu tươi tắn này.'
  },
  {
    id: 'adv_066',
    topic: 'Thói quen',
    tag: '🌱 Thói quen tốt',
    icon: '🧹',
    content: 'Góc học tập gọn gàng sẽ giúp bộ não suy nghĩ thông suốt hơn. Dành 3 phút dọn lại bàn học trước khi bắt đầu bài tập hôm nay nhé.'
  },

  // 24. Lòng tốt & Sự tử tế
  {
    id: 'adv_067',
    topic: 'Tử tế',
    tag: '💖 Lan tỏa',
    icon: '🌸',
    content: 'Một lời khen thật lòng, một cái nhường đường hay một nụ cười ấm áp với cô lao công có thể thắp sáng cả một ngày u ám của ai đó. Sự tử tế luôn miễn phí.'
  },
  {
    id: 'adv_068',
    topic: 'Tử tế',
    tag: '💖 Lan tỏa',
    icon: '✨',
    content: 'Thế giới này đã có đủ người thích phán xét rồi, hãy chọn trở thành người biết lắng nghe và gieo sự ấm áp ở những nơi bạn bước qua.'
  },

  // 25. Vượt qua nỗi sợ bị từ chối
  {
    id: 'adv_069',
    topic: 'Vượt qua nỗi sợ',
    tag: '🦁 Dũng cảm',
    icon: '🚪',
    content: 'Một cánh cửa đóng lại không có nghĩa là ngõ cụt. Nó chỉ đang dẫn bạn đi tìm cánh cửa khác mở ra bầu trời phù hợp hơn với bạn.'
  },
  {
    id: 'adv_070',
    topic: 'Vượt qua nỗi sợ',
    tag: '🦁 Dũng cảm',
    icon: '🦅',
    content: 'Người chưa từng bị từ chối là người chưa bao giờ dám bước ra khỏi vỏ bọc an toàn. Mỗi lần bị từ chối là một lần da thịt tâm hồn dày thêm dũng khí.'
  },

  // 26. Thư giãn cùng thiên nhiên
  {
    id: 'adv_071',
    topic: 'Thiên nhiên',
    tag: '🍃 Chữa lành',
    icon: '🌳',
    content: 'Ngắm nhìn một vòm cây xanh đung đưa trong gió hay bầu trời hoàng hôn rực rỡ có thể xoa dịu những nhức nhối trong đầu nhanh hơn bạn tưởng.'
  },
  {
    id: 'adv_072',
    topic: 'Thiên nhiên',
    tag: '🍃 Chữa lành',
    icon: '🌾',
    content: 'Hít sâu mùi đất sau cơn mưa, lắng nghe tiếng chim hót sớm mai. Thế giới tự nhiên luôn có một nhịp điệu bình thản sẵn sàng đón nhận bạn trở về.'
  },

  // 27. Sống thật với bản thân
  {
    id: 'adv_073',
    topic: 'Chính mình',
    tag: '✨ Độc bản',
    icon: '💎',
    content: 'Bạn không cần phải cố tỏ ra hiểu biết về thứ mình không thích chỉ để "bắt trend". Cá tính thực sự nằm ở việc dám yêu những sở thích chân thật của riêng mình.'
  },
  {
    id: 'adv_074',
    topic: 'Chính mình',
    tag: '✨ Độc bản',
    icon: '🦄',
    content: 'Thế giới cần phiên bản nguyên bản là chính bạn, không cần thêm một bản sao chép hoàn hảo của bất kỳ ai khác. Hãy tự hào về nét riêng ấy!'
  },

  // 28. Giao tiếp & Thấu cảm
  {
    id: 'adv_075',
    topic: 'Giao tiếp',
    tag: '🤝 Kết nối',
    icon: '👂',
    content: 'Lắng nghe không phải là chờ đến lượt mình nói, mà là thực sự để tâm vào câu chuyện của người đối diện. Ai cũng khao khát được thấu hiểu chân thành.'
  },
  {
    id: 'adv_076',
    topic: 'Giao tiếp',
    tag: '🤝 Kết nối',
    icon: '💬',
    content: 'Nói những lời dịu dàng không làm bạn yếu thế đi. Ngược lại, chỉ những người có nội tâm vững vàng mới có thể giữ được giọng nói hòa nhã giữa bất đồng.'
  },

  // 29. Khám phá & Tò mò
  {
    id: 'adv_077',
    topic: 'Khám phá',
    tag: '🔭 Tò mò',
    icon: '📚',
    content: 'Mở một cuốn sách về đề tài bạn chưa từng đọc bao giờ. Mỗi trang sách là một tấm vé đưa bạn chu du vào một góc nhìn mới lạ của cuộc đời.'
  },
  {
    id: 'adv_078',
    topic: 'Khám phá',
    tag: '🔭 Tò mò',
    icon: '🌍',
    content: 'Hãy giữ cho mình đôi mắt luôn ngạc nhiên trước thế giới. Người luôn tò mò học hỏi sẽ không bao giờ cảm thấy buồn tẻ hay đơn độc.'
  },

  // 30. Trách nhiệm & Tự lập
  {
    id: 'adv_079',
    topic: 'Tự lập',
    tag: '⚓ Vững vàng',
    icon: '🗝️',
    content: 'Tự giặt bộ đồng phục, tự xếp góc bàn hay tự cài chuông báo thức. Tự lập bắt đầu từ những việc cỏn con nhất trao cho bạn quyền tự chủ cuộc đời.'
  },
  {
    id: 'adv_080',
    topic: 'Tự lập',
    tag: '⚓ Vững vàng',
    icon: '🛡️',
    content: 'Dám chịu trách nhiệm về lời nói và việc làm của mình là bước đi dũng cảm nhất của tuổi trẻ. Ai cũng kính trọng người dám nhận trách nhiệm.'
  },

  // 31. Thư thái giữa kỳ thi
  {
    id: 'adv_081',
    topic: 'Mùa thi',
    tag: '📚 Mùa thi cử',
    icon: '☕',
    content: 'Khi bước vào phòng thi, hãy hít sâu và thở dài một hơi thật chậm. Bạn đã chuẩn bị chu đáo rồi, giờ là lúc bình tĩnh thể hiện những gì mình biết.'
  },
  {
    id: 'adv_082',
    topic: 'Mùa thi',
    tag: '📚 Mùa thi cử',
    icon: '🍫',
    content: 'Ăn một mẩu sô-cô-la nhỏ, uống đủ nước và ngủ đủ 7 tiếng trước ngày thi. Bộ não sáng suốt khi cơ thể bạn được đối đãi tử tế.'
  },

  // 32. Trân trọng hiện tại
  {
    id: 'adv_083',
    topic: 'Hiện tại',
    tag: '🌸 Ở đây và bây giờ',
    icon: '⏳',
    content: 'Đừng mãi nuối tiếc hôm qua hay lo lắng thái quá về ngày mai. Món quà duy nhất có thật trong tay bạn là giây phút này. Hít thở và tận hưởng nó nhé!'
  },
  {
    id: 'adv_084',
    topic: 'Hiện tại',
    tag: '🌸 Ở đây và bây giờ',
    icon: '🍵',
    content: 'Cốc trà sữa bạn đang uống, làn gió mát đang thổi qua tóc, tiếng cười bạn bè giờ ra chơi... Hãy để tâm trí ở đây để cảm nhận trọn vẹn tuổi thanh xuân.'
  },

  // 33. Khi bạn cảm thấy cô đơn
  {
    id: 'adv_085',
    topic: 'Cô đơn',
    tag: '💙 Đồng hành',
    icon: '🌙',
    content: 'Nếu có lúc bạn thấy lạc lõng giữa đám đông, hãy nhớ bạn không bao giờ đơn độc. Luôn có những người trân quý bạn, và ít nhất, chính bạn vẫn luôn có mình bên cạnh.'
  },
  {
    id: 'adv_086',
    topic: 'Cô đơn',
    tag: '💙 Đồng hành',
    icon: '🕯️',
    content: 'Khoảng lặng một mình không phải là sự cô lập, mà là cơ hội quý giá để bạn trò chuyện và làm thân lại với chính tâm hồn của mình.'
  },

  // 34. Hy vọng & Lạc quan
  {
    id: 'adv_087',
    topic: 'Hy vọng',
    tag: '✨ Niềm tin',
    icon: '🌟',
    content: 'Những điều tuyệt vời nhất thường xuất hiện khi ta ít ngờ tới nhất. Cứ tiếp tục gieo những hạt giống chăm chỉ và thiện lành, hoa sẽ nở đúng mùa.'
  },
  {
    id: 'adv_088',
    topic: 'Hy vọng',
    tag: '✨ Niềm tin',
    icon: '🌈',
    content: 'Bầu trời sau cơn bão luôn là bầu trời trong xanh nhất. Giữ vững niềm tin trong tim nhé, ngày mai nắng ấm sẽ lại về ngập tràn ô cửa sổ của bạn.'
  },

  // 35. Nuôi dưỡng ước mơ
  {
    id: 'adv_089',
    topic: 'Ước mơ',
    tag: '🚀 Hoài bão',
    icon: '✨',
    content: 'Ước mơ của bạn dù nhỏ bé hay vĩ đại đều xứng đáng được nâng niu. Đừng để ai dập tắt ngọn lửa ấy chỉ vì họ chưa từng dám mơ lớn.'
  },
  {
    id: 'adv_090',
    topic: 'Ước mơ',
    tag: '🚀 Hoài bão',
    icon: '🌠',
    content: 'Hôm nay hãy làm một việc thật nhỏ hướng tới điều bạn từng ao ước: đọc một trang sách, viết một dòng ghi chú. Cánh buồm ước mơ bắt đầu từ chính ngọn gió nhỏ này.'
  }
];
