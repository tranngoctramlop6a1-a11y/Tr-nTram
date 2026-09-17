import React, { useState, useEffect } from 'react';
import { EMERGENCY_CONTACTS } from '../data/initialData';
import { 
  LifeBuoy, 
  PhoneCall, 
  Heart, 
  ShieldCheck, 
  Wind, 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  HelpCircle,
  Eye,
  Hand,
  Volume2,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const HelpView: React.FC = () => {
  // Box breathing state: inhale (4s), hold (4s), exhale (4s), rest (4s)
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Hít vào' | 'Giữ hơi thở' | 'Thở ra từ từ' | 'Nghỉ ngơi'>('Hít vào');
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState(4);

  useEffect(() => {
    let timer: any = null;
    if (breathingActive) {
      timer = setInterval(() => {
        setPhaseSecondsLeft((prev) => {
          if (prev > 1) return prev - 1;

          // Transition to next phase
          setBreathPhase((current) => {
            if (current === 'Hít vào') return 'Giữ hơi thở';
            if (current === 'Giữ hơi thở') return 'Thở ra từ từ';
            if (current === 'Thở ra từ từ') return 'Nghỉ ngơi';
            return 'Hít vào';
          });
          return 4;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [breathingActive]);

  const toggleBreathing = () => {
    setBreathingActive(!breathingActive);
    if (!breathingActive) {
      setBreathPhase('Hít vào');
      setPhaseSecondsLeft(4);
    }
  };

  return (
    <section className="py-10 md:py-16 max-w-5xl mx-auto px-4 sm:px-6" id="section-help">
      
      {/* Header */}
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold border border-rose-200">
          <LifeBuoy className="w-3.5 h-3.5 text-rose-600" />
          <span>Hỗ trợ an toàn & Khẩn cấp</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Bạn không cần phải giải quyết mọi chuyện một mình.
        </h2>
        <p className="text-sm sm:text-base text-slate-700 max-w-2xl mx-auto leading-relaxed">
          Nếu bạn đang ở trong một tình huống khó khăn, đau đớn hoặc cảm thấy bế tắc, việc tìm kiếm sự giúp đỡ là một hành động dũng cảm, tuyệt đối không phải là sự yếu đuối.
        </p>
      </div>

      {/* Emergency Alert Banner */}
      <div className="bg-gradient-to-r from-rose-500 via-pink-600 to-amber-500 rounded-3xl p-6 sm:p-8 text-white shadow-lg mb-10 space-y-4">
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full bg-white animate-ping"></span>
          <span className="text-xs font-extrabold uppercase tracking-wider text-rose-100">
            Hỗ trợ an toàn & Hướng dẫn khi quá tải
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-2xl sm:text-3xl font-black">
              Bạn luôn có những người sẵn sàng lắng nghe
            </h3>
            <p className="text-xs sm:text-sm text-rose-100 font-medium">
              Khi cảm thấy ngột ngạt hay bế tắc, hãy dừng lại một nhịp, hít thở sâu và mở lòng với người lớn bạn tin tưởng.
            </p>
          </div>

          <button
            onClick={toggleBreathing}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-rose-600 hover:bg-rose-50 font-black text-base shadow-md hover:shadow-lg transition-all shrink-0 cursor-pointer transform active:scale-95"
          >
            <Sparkles className="w-5 h-5 text-rose-600" />
            <span>Thực hành điều hòa nhịp thở</span>
          </button>
        </div>
      </div>

      {/* Emergency Helplines Cards */}
      <div className="mb-12">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span>📞</span>
          <span>Các đường dây nóng và kênh hỗ trợ chuyên môn</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {EMERGENCY_CONTACTS.map((contact, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-rose-100 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${contact.badgeColor}`}>
                  {contact.badge}
                </span>
                <span className="text-sm font-black text-slate-900">
                  {contact.number}
                </span>
              </div>
              <h4 className="font-extrabold text-base text-slate-900">
                {contact.name}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {contact.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* People You Can Reach Out To */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-xs mb-12 space-y-6">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <span>🤝</span>
          <span>Những người lớn đáng tin cậy bạn có thể tìm đến lúc này:</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="text-2xl">👨‍👩‍👧</div>
            <h4 className="font-bold text-sm text-slate-900">Bố mẹ hoặc người thân</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Cô, dì, chú, bác, hoặc anh chị lớn tuổi trong nhà mà bạn cảm thấy an toàn và lắng nghe bạn.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="text-2xl">👩‍🏫</div>
            <h4 className="font-bold text-sm text-slate-900">Giáo viên bạn tin cậy</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Thầy cô chủ nhiệm hoặc bất kỳ giáo viên bộ môn nào bạn cảm thấy hiểu và tôn trọng bạn.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="text-2xl">🏫</div>
            <h4 className="font-bold text-sm text-slate-900">Phòng tham vấn học đường</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Nơi có chuyên viên tâm lý tại trường được đào tạo để lắng nghe và giữ kín câu chuyện của bạn.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="text-2xl">🩺</div>
            <h4 className="font-bold text-sm text-slate-900">Bác sĩ / Chuyên gia tâm lý</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Các khoa chăm sóc sức khỏe vị thành niên tại các bệnh viện nhi hoặc trung tâm y tế gần bạn.
            </p>
          </div>
        </div>

        {/* Script on how to ask for help */}
        <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-100 text-xs sm:text-sm text-slate-800 space-y-1">
          <span className="font-bold text-rose-800 block">
            💡 Gợi ý câu mở lời khi bạn đang rất sợ hãi hoặc rối bời:
          </span>
          <p className="italic leading-relaxed">
            “Thầy/Cô/Bố/Mẹ ơi, con đang gặp một chuyện rất khó khăn và con không thể tự chịu đựng một mình được nữa. Con thực sự cần sự giúp đỡ của người lớn ạ...”
          </p>
        </div>
      </div>

      {/* Interactive Emergency Calming Tools: 
          1. Interactive Box Breathing
          2. 5-4-3-2-1 Grounding Method 
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Interactive Calming Breath Box */}
        <div className="bg-gradient-to-br from-teal-50 via-white to-sky-50 rounded-3xl p-6 sm:p-8 border border-teal-200/70 shadow-xs space-y-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-teal-100 text-teal-800 text-xs font-bold">
              <Wind className="w-3.5 h-3.5 text-teal-600" />
              <span>Sơ cứu cảm xúc tại chỗ</span>
            </div>
            <h4 className="text-xl font-bold text-slate-900">
              Bài tập Hộp thở 4-4-4-4
            </h4>
            <p className="text-xs text-slate-600">
              Giúp nhịp tim đập chậm lại, xua tan cơn hoảng loạn và lấy lại bình tĩnh trong 1 phút.
            </p>
          </div>

          {/* Animated visual circle */}
          <div className="flex flex-col items-center justify-center py-4">
            <div className={`w-36 h-36 rounded-full flex flex-col items-center justify-center transition-all duration-1000 border-4 ${
              breathingActive
                ? breathPhase === 'Hít vào'
                  ? 'scale-125 bg-teal-100/80 border-teal-400 shadow-lg'
                  : breathPhase === 'Giữ hơi thở'
                  ? 'scale-125 bg-amber-100/80 border-amber-400 shadow-md'
                  : breathPhase === 'Thở ra từ từ'
                  ? 'scale-90 bg-rose-100/80 border-rose-400'
                  : 'scale-95 bg-slate-100 border-slate-300'
                : 'bg-white border-teal-200'
            }`}>
              <span className="text-xs font-bold text-slate-600">
                {breathingActive ? breathPhase : 'Sẵn sàng'}
              </span>
              <span className="text-2xl font-black text-slate-900 mt-0.5">
                {breathingActive ? `${phaseSecondsLeft}s` : 'Bắt đầu'}
              </span>
            </div>

            <p className="text-xs text-slate-600 mt-4 text-center h-5 font-medium">
              {breathingActive 
                ? (breathPhase === 'Hít vào' ? 'Hít không khí vào qua mũi...' :
                   breathPhase === 'Giữ hơi thở' ? 'Giữ hơi lại trong lồng ngực...' :
                   breathPhase === 'Thở ra từ từ' ? 'Thở ra thật êm qua miệng...' : 'Thư giãn toàn thân...')
                : 'Bấm nút bên dưới để thở cùng đồng hồ'}
            </p>
          </div>

          <div className="flex justify-center">
            <button
              onClick={toggleBreathing}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-xs ${
                breathingActive
                  ? 'bg-slate-700 hover:bg-slate-800 text-white'
                  : 'bg-teal-600 hover:bg-teal-700 text-white'
              }`}
            >
              {breathingActive ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Tạm dừng</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Bắt đầu bài tập thở</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 5-4-3-2-1 Grounding Method */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Kỹ thuật tiếp đất (Grounding)</span>
            </div>
            <h4 className="text-xl font-bold text-slate-900">
              Phương pháp Ngũ giác quan 5-4-3-2-1
            </h4>
            <p className="text-xs text-slate-600">
              Khi tâm trí bị cuốn vào lo âu, hãy nhìn xung quanh căn phòng và lần lượt tìm:
            </p>
          </div>

          <div className="space-y-2.5 text-xs sm:text-sm">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center shrink-0">5</span>
              <span className="font-medium text-slate-800">5 thứ bạn có thể <strong>nhìn thấy</strong> trước mắt</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 font-bold flex items-center justify-center shrink-0">4</span>
              <span className="font-medium text-slate-800">4 thứ bạn có thể <strong>chạm vào</strong> (mặt bàn, áo len, tóc...)</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0">3</span>
              <span className="font-medium text-slate-800">3 <strong>âm thanh</strong> bạn đang nghe thấy (tiếng quạt, chim hót...)</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center shrink-0">2</span>
              <span className="font-medium text-slate-800">2 <strong>mùi hương</strong> bạn có thể ngửi thấy (mùi sách, dầu gội...)</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center shrink-0">1</span>
              <span className="font-medium text-slate-800">1 <strong>điều tốt đẹp</strong> bạn biết ơn về bản thân hôm nay</span>
            </div>
          </div>
        </div>

      </div>

    </section>
  );
};
