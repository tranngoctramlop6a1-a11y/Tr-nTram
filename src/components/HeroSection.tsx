import React from 'react';
import { Sparkles, HeartHandshake, ShieldCheck, UserCheck, MessageSquareHeart, ArrowRight, MessageCircle, BookOpen } from 'lucide-react';
import { BotMascot } from './BotMascot';

interface HeroSectionProps {
  onGoToChatbot: () => void;
  onGoToJournal?: () => void;
  onGoToConfessions: () => void;
  onGoToScenarios: () => void;
  onGoToHelp: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onGoToChatbot,
  onGoToJournal,
  onGoToConfessions,
  onGoToScenarios,
  onGoToHelp
}) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-12 md:pt-14 md:pb-20 bg-gradient-to-b from-rose-50/70 via-amber-50/40 to-[#FAF9F6]">
      {/* Subtle decorative background blobs */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-rose-200/40 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse"></div>
      <div className="absolute top-12 right-1/4 w-80 h-80 bg-amber-200/40 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 right-10 w-64 h-64 bg-teal-100/40 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Friendly Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-rose-200/80 shadow-xs text-xs font-semibold text-rose-700 mx-auto lg:mx-0">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Không gian lắng nghe & đồng hành dành riêng cho lứa tuổi teen</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.2]">
              Bạn ơi, <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 bg-clip-text text-transparent">
                mình nói nè
              </span>
            </h1>

            {/* Subheading / Tagline */}
            <p className="text-lg sm:text-xl md:text-2xl text-slate-800 font-bold max-w-2xl leading-relaxed mx-auto lg:mx-0">
              “Có chuyện gì, cứ kể mình nghe.” 🌸
            </p>

            {/* Trust Quote / Message */}
            <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-xs border border-rose-100 shadow-xs max-w-xl mx-auto lg:mx-0">
              <p className="text-xs sm:text-sm font-semibold text-slate-700 italic flex items-center justify-center lg:justify-start gap-2">
                <span className="text-xl">🌱</span>
                <span>“Bạn không cần phải có câu trả lời ngay. Đôi khi, bắt đầu bằng việc nói ra đã là một bước rất lớn.”</span>
              </p>
            </div>

            {/* Main Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              <button
                id="hero-btn-open-chatbot"
                onClick={onGoToChatbot}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-bold text-base shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer transform active:scale-95"
              >
                <BotMascot mood="happy" size="sm" className="w-6 h-6 -my-1 shadow-none border-0" />
                <span>Trò chuyện cùng Chatbot</span>
              </button>

              <button
                id="hero-btn-confessions"
                onClick={onGoToConfessions}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-200 shadow-xs hover:shadow-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquareHeart className="w-4 h-4 text-rose-500" />
                <span>Góc tâm sự ẩn danh</span>
              </button>

              {onGoToJournal && (
                <button
                  id="hero-btn-journal"
                  onClick={onGoToJournal}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-sm border border-amber-200 shadow-xs hover:shadow-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-amber-600" />
                  <span>Nhật ký của mình 📖</span>
                </button>
              )}

              <button
                id="hero-btn-scenarios"
                onClick={onGoToScenarios}
                className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-white/70 hover:bg-white text-slate-700 font-semibold text-xs border border-slate-200 shadow-2xs hover:shadow-xs transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Mình nên làm gì?</span>
              </button>
            </div>

            {/* Micro reassurance line */}
            <div className="flex items-center justify-center lg:justify-start gap-2 text-xs font-semibold text-slate-600 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Ẩn danh • Không cần đăng nhập hay để lại thông tin cá nhân</span>
            </div>

            {/* Feature Pills */}
            <div className="pt-4 border-t border-rose-100/80 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-medium text-slate-600">
              <span className="flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-rose-500" /> Không phán xét
              </span>
              <span className="flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-amber-500" /> Đồng cảm & ấm áp
              </span>
              <button 
                onClick={onGoToChatbot}
                className="flex items-center gap-1 text-rose-600 hover:text-rose-700 font-bold hover:underline cursor-pointer"
              >
                <span>Hỏi chatbot bất cứ điều gì</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

          {/* Gentle Graphic Illustration with Mascot */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md">
              {/* Soft decorative glow card behind */}
              <div className="absolute inset-0 bg-gradient-to-tr from-rose-200/50 via-amber-200/40 to-teal-200/50 rounded-3xl transform rotate-2 scale-102 filter blur-sm"></div>
              
              <div className="relative bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-md border border-rose-100">
                
                {/* Visual Artwork & Chat Preview */}
                <div className="w-full bg-gradient-to-b from-rose-50/60 to-amber-50/60 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden border border-rose-100/60 space-y-4">
                  
                  {/* Floating Cute Badges */}
                  <div className="flex justify-between items-center z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 text-xs font-bold text-slate-700 shadow-xs">
                      💬 Chatbot AI tuổi teen
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-xs font-bold text-rose-700">
                      ❤️ Không phán xét
                    </span>
                  </div>

                  {/* Interactive Mascot Spotlight */}
                  <div className="flex flex-col items-center py-2 space-y-2">
                    <BotMascot mood="happy" size="lg" className="shadow-sm" />
                    <div className="text-center">
                      <div className="font-extrabold text-sm text-slate-800">
                        “Bạn ơi, mình nói nè”
                      </div>
                      <div className="text-xs text-slate-600 italic">
                        Có chuyện gì, cứ kể mình nghe nhé!
                      </div>
                    </div>
                  </div>

                  {/* Mini conversation snippet mockup */}
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-end">
                      <div className="bg-rose-500 text-white px-3.5 py-2 rounded-2xl rounded-br-xs font-medium max-w-[85%] shadow-xs">
                        Dạo này mình học mãi mà điểm vẫn không cao... 🥺
                      </div>
                    </div>
                    <div className="flex justify-start gap-2">
                      <BotMascot mood="empathy" size="sm" />
                      <div className="bg-white text-slate-800 px-3.5 py-2 rounded-2xl rounded-bl-xs border border-rose-100 max-w-[85%] shadow-xs leading-relaxed">
                        Mình hiểu cảm giác đó... Nhưng điểm số của một bài thi không quyết định giá trị của bạn đâu. 🫂 Mình cùng tìm cách nhé!
                      </div>
                    </div>
                  </div>

                  {/* Bottom reassurance caption */}
                  <button
                    onClick={onGoToChatbot}
                    className="w-full bg-white/95 hover:bg-white rounded-xl p-2.5 flex items-center justify-between border border-rose-100 text-xs transition-colors cursor-pointer group"
                  >
                    <span className="text-slate-600 font-medium truncate">
                      🌸 Bấm vào đây để trò chuyện ngay...
                    </span>
                    <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg shrink-0 group-hover:bg-rose-100">
                      Mở chat ➤
                    </span>
                  </button>

                </div>

                {/* Micro stats counter */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100 text-center">
                  <div>
                    <div className="text-lg font-bold text-slate-800">100%</div>
                    <div className="text-[11px] text-slate-600 font-medium">Bảo mật ẩn danh</div>
                  </div>
                  <div className="border-x border-slate-100">
                    <div className="text-lg font-bold text-rose-600">3 chế độ</div>
                    <div className="text-[11px] text-slate-600 font-medium">Lắng nghe & gợi ý</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-amber-600">24/7</div>
                    <div className="text-[11px] text-slate-600 font-medium">Luôn lắng nghe</div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
