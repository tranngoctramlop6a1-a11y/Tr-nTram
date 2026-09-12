import React, { useState } from 'react';
import { PARENT_TOPICS } from '../data/initialData';
import { ParentTalkTopic } from '../types';
import { 
  HeartHandshake, 
  Copy, 
  Check, 
  MessageSquareText, 
  Mail, 
  Lightbulb, 
  AlertCircle, 
  Clock, 
  Sparkles,
  SmilePlus,
  Send
} from 'lucide-react';

export const ParentsView: React.FC = () => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>(PARENT_TOPICS[0].id);
  const [copiedType, setCopiedType] = useState<'script' | 'text' | null>(null);

  const currentTopic: ParentTalkTopic = PARENT_TOPICS.find((t) => t.id === selectedTopicId) || PARENT_TOPICS[0];

  const handleCopy = (text: string, type: 'script' | 'text') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  return (
    <section className="py-10 md:py-16 max-w-6xl mx-auto px-4 sm:px-6" id="section-parents">
      
      {/* Header */}
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-100">
          <HeartHandshake className="w-3.5 h-3.5" />
          <span>Thu hẹp khoảng cách thế hệ • Đối thoại yêu thương</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          “Có những chuyện nói với bố mẹ thật khó.”
        </h2>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Bố mẹ và chúng ta lớn lên ở hai thời đại khác nhau. Đôi khi không phải bố mẹ không thương, mà là cả hai bên chưa tìm được cách mở lời thấu hiểu.
        </p>
      </div>

      {/* 4 Golden Rules Bar */}
      <div className="bg-gradient-to-r from-amber-50 via-rose-50 to-teal-50 rounded-3xl p-6 border border-rose-100/80 shadow-xs mb-10">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>4 Bí quyết vàng giúp cuộc trò chuyện bớt căng thẳng:</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs sm:text-sm">
          <div className="bg-white/90 p-4 rounded-2xl border border-rose-100/60 shadow-xs space-y-1">
            <span className="font-bold text-slate-900 block flex items-center gap-1.5">
              <span>⏰</span> 1. Chọn thời điểm phù hợp
            </span>
            <p className="text-slate-600 text-xs leading-relaxed">
              Tránh lúc bố mẹ vừa đi làm về mệt mỏi hoặc đang bận rộn. Hãy chọn sau bữa cơm hoặc cuối tuần.
            </p>
          </div>

          <div className="bg-white/90 p-4 rounded-2xl border border-rose-100/60 shadow-xs space-y-1">
            <span className="font-bold text-slate-900 block flex items-center gap-1.5">
              <span>❤️</span> 2. Nói về cảm xúc, không đổ lỗi
            </span>
            <p className="text-slate-600 text-xs leading-relaxed">
              Dùng câu “Con cảm thấy buồn/áp lực...” thay vì “Bố mẹ lúc nào cũng không hiểu con”.
            </p>
          </div>

          <div className="bg-white/90 p-4 rounded-2xl border border-rose-100/60 shadow-xs space-y-1">
            <span className="font-bold text-slate-900 block flex items-center gap-1.5">
              <span>🎯</span> 3. Nói cụ thể vấn đề
            </span>
            <p className="text-slate-600 text-xs leading-relaxed">
              Nêu rõ điều bạn cần: Bạn chỉ muốn được lắng nghe trước, hay cần bố mẹ hỗ trợ tìm giải pháp.
            </p>
          </div>

          <div className="bg-white/90 p-4 rounded-2xl border border-rose-100/60 shadow-xs space-y-1">
            <span className="font-bold text-slate-900 block flex items-center gap-1.5">
              <span>💌</span> 4. Viết thư nếu ngại nói trực tiếp
            </span>
            <p className="text-slate-600 text-xs leading-relaxed">
              Một tin nhắn Zalo chân thành hoặc mẩu giấy nhỏ trên bàn cũng là cách mở đầu tuyệt vời.
            </p>
          </div>
        </div>
      </div>

      {/* Situations Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 scrollbar-none">
        {PARENT_TOPICS.map((topic) => {
          const isSelected = selectedTopicId === topic.id;
          return (
            <button
              key={topic.id}
              onClick={() => setSelectedTopicId(topic.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-rose-500 text-white shadow-sm scale-102'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {topic.title}
            </button>
          );
        })}
      </div>

      {/* Selected Topic Content Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Dialogue Starters & Letter Template */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Situation Context */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-xs space-y-5">
            <div>
              <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-100">
                Tình huống: {currentTopic.title}
              </span>
              <p className="text-sm sm:text-base text-slate-700 font-medium mt-3 leading-relaxed">
                {currentTopic.situation}
              </p>
            </div>

            {/* Starter Script (Nói trực tiếp) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <MessageSquareText className="w-4 h-4 text-rose-500" />
                  <span>Cách bắt đầu cuộc trò chuyện trực tiếp:</span>
                </h4>
                <button
                  onClick={() => handleCopy(currentTopic.starterScript, 'script')}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition-colors"
                >
                  {copiedType === 'script' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">Đã sao chép!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-600" />
                      <span>Sao chép mẫu</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-rose-50/70 p-4 sm:p-5 rounded-2xl border border-rose-100 text-sm sm:text-base text-slate-800 font-medium leading-relaxed italic relative">
                <span className="text-2xl text-rose-300 absolute top-2 left-2">“</span>
                <p className="pl-4 pr-2">{currentTopic.starterScript}</p>
              </div>
            </div>

            {/* Alternative Text Message / Letter Template */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-amber-500" />
                  <span>Nếu ngại nói trực tiếp: Mẫu gửi tin nhắn hoặc viết thư:</span>
                </h4>
                <button
                  onClick={() => handleCopy(currentTopic.alternativeTextMsg, 'text')}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition-colors"
                >
                  {copiedType === 'text' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">Đã sao chép!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-600" />
                      <span>Sao chép tin nhắn</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-amber-50/70 p-4 sm:p-5 rounded-2xl border border-amber-100 text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                {currentTopic.alternativeTextMsg}
              </div>
              <p className="text-[11px] text-slate-600 italic">
                *Bạn có thể chỉnh sửa lại cho phù hợp với cách xưng hô thường ngày của gia đình mình nhé.
              </p>
            </div>

          </div>

        </div>

        {/* Right Column: Why Parents React this way + Dos & Don'ts */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Psychology of Parents */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-indigo-500" />
              <span>Góc nhìn của người lớn: Tại sao bố mẹ lại phản ứng như vậy?</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/70">
              {currentTopic.whyParentsReactThisWay}
            </p>
          </div>

          {/* Dos & Don'ts */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
            
            {/* Nên làm */}
            <div>
              <h5 className="text-xs font-bold text-emerald-700 uppercase mb-2 flex items-center gap-1">
                <span>✅</span> Nên làm:
              </h5>
              <ul className="space-y-2 text-xs text-slate-700">
                {currentTopic.dos.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100/60">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Không nên làm */}
            <div className="pt-2">
              <h5 className="text-xs font-bold text-rose-700 uppercase mb-2 flex items-center gap-1">
                <span>❌</span> Nên tránh:
              </h5>
              <ul className="space-y-2 text-xs text-slate-700">
                {currentTopic.donts.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 bg-rose-50/50 p-2.5 rounded-xl border border-rose-100/60">
                    <span className="text-rose-600 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
};
