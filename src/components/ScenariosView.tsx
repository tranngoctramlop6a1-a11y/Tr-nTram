import React, { useState } from 'react';
import { SCENARIOS } from '../data/initialData';
import { Scenario, ScenarioOption } from '../types';
import { 
  Sparkles, 
  HelpCircle, 
  CheckCircle, 
  AlertTriangle, 
  Lightbulb, 
  ChevronRight, 
  Compass,
  Layers,
  ArrowRight
} from 'lucide-react';

export const ScenariosView: React.FC = () => {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<'A' | 'B' | 'C' | 'D' | null>(null);

  const currentScenario: Scenario = SCENARIOS[selectedScenarioIndex];
  const selectedOption: ScenarioOption | undefined = currentScenario.options.find(
    (opt) => opt.id === selectedOptionId
  );

  const handleSelectScenario = (index: number) => {
    setSelectedScenarioIndex(index);
    setSelectedOptionId(null);
  };

  const handleSelectOption = (optId: 'A' | 'B' | 'C' | 'D') => {
    setSelectedOptionId(optId);
  };

  return (
    <section className="py-10 md:py-16 max-w-6xl mx-auto px-4 sm:px-6" id="section-scenarios">
      
      {/* Header */}
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
          <Compass className="w-3.5 h-3.5 text-amber-600" />
          <span>Tương tác tình huống • Rèn luyện tư duy thấu cảm</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          “Mình nên làm gì?”
        </h2>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Không có một đáp án duy nhất đúng cho mọi chuyện. Hãy cùng xem qua các góc nhìn, phân tích ưu và nhược điểm để tìm ra hướng đi an toàn và bình an nhất cho bạn.
        </p>
      </div>

      {/* Scenarios Carousel / Pill Navigation */}
      <div className="mb-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {SCENARIOS.map((scen, idx) => {
            const isSelected = selectedScenarioIndex === idx;
            return (
              <button
                key={scen.id}
                onClick={() => handleSelectScenario(idx)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? 'bg-rose-500 text-white shadow-sm scale-102'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {idx + 1}
                </span>
                <span>{scen.category}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column: Scenario Card & Options */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-xs space-y-4">
            
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
                Tình huống {selectedScenarioIndex + 1}: {currentScenario.category}
              </span>
              <span className="text-xs text-slate-600 font-medium">
                10 tình huống thực tế
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
              {currentScenario.title}
            </h3>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
              {currentScenario.description}
            </p>

            {/* Prompt */}
            <div className="pt-2">
              <p className="text-xs font-bold uppercase tracking-wider text-rose-600 mb-3 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4" />
                <span>Nếu là bạn, bạn sẽ chọn hướng đi nào? (Nhấp chọn để xem phân tích)</span>
              </p>

              {/* Options A, B, C, D */}
              <div className="space-y-3">
                {currentScenario.options.map((opt) => {
                  const isChosen = selectedOptionId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-150 cursor-pointer flex items-start gap-3.5 transform active:scale-98 ${
                        isChosen
                          ? 'border-rose-500 bg-rose-50/80 shadow-xs ring-2 ring-rose-200'
                          : 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 mt-0.5 ${
                        isChosen
                          ? 'bg-rose-500 text-white'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {opt.id}
                      </span>
                      <div className="flex-1">
                        <span className={`text-sm sm:text-base font-bold ${
                          isChosen ? 'text-rose-900' : 'text-slate-800'
                        }`}>
                          {opt.text}
                        </span>
                      </div>
                      <ChevronRight className={`w-5 h-5 shrink-0 mt-0.5 transition-transform ${
                        isChosen ? 'rotate-90 text-rose-600' : 'text-slate-600'
                      }`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Insight Note */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span>💡 Thử chọn lần lượt các phương án để so sánh kết quả</span>
              <button
                onClick={() => handleSelectScenario((selectedScenarioIndex + 1) % SCENARIOS.length)}
                className="font-bold text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Tình huống tiếp theo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>

        {/* Right column: Dynamic Analysis & Reflection */}
        <div className="lg:col-span-5 space-y-6">
          {selectedOption ? (
            <div className="bg-gradient-to-br from-white via-rose-50/30 to-amber-50/30 rounded-3xl p-6 sm:p-7 border-2 border-rose-200/80 shadow-md space-y-5 animate-in fade-in zoom-in-95 duration-200">
              
              <div className="flex items-center justify-between border-b border-rose-100 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-100 px-3 py-1 rounded-full">
                  Phân tích phương án {selectedOption.id}
                </span>
                <span className="text-xs font-medium text-slate-600">Đa chiều • Không phán xét</span>
              </div>

              {/* What happens */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase text-slate-600 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-500" />
                  <span>Điều gì sẽ xảy ra?</span>
                </h4>
                <p className="text-sm text-slate-800 leading-relaxed bg-white/90 p-3.5 rounded-xl border border-slate-100">
                  {selectedOption.analysis}
                </p>
              </div>

              {/* Pros */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase text-emerald-700 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Mặt tích cực (Ưu điểm):</span>
                </h4>
                <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-100 text-xs sm:text-sm text-emerald-900 leading-relaxed font-medium">
                  {selectedOption.pros}
                </div>
              </div>

              {/* Cons */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase text-amber-700 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Rủi ro & Mặt hạn chế (Nhược điểm):</span>
                </h4>
                <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-100 text-xs sm:text-sm text-amber-900 leading-relaxed font-medium">
                  {selectedOption.cons}
                </div>
              </div>

              {/* Takeaway */}
              <div className="space-y-1.5 pt-1">
                <h4 className="text-xs font-bold uppercase text-rose-700 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-rose-600" />
                  <span>Đúc kết suy ngẫm:</span>
                </h4>
                <div className="bg-white p-4 rounded-xl border border-rose-200 text-sm font-bold text-slate-800 leading-relaxed shadow-xs">
                  “{selectedOption.takeaway}”
                </div>
              </div>

            </div>
          ) : (
            /* Prompt to click an option */
            <div className="bg-white rounded-3xl p-8 border border-dashed border-rose-200 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 mx-auto flex items-center justify-center text-2xl">
                👆
              </div>
              <h4 className="text-lg font-bold text-slate-800">
                Hãy chọn một phương án (A, B, C hoặc D)
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                Để xem phân tích sâu sắc về những điều có thể xảy ra, ưu điểm, nhược điểm và lời khuyên ấm áp dành cho bạn.
              </p>
              
              {/* General situation advice */}
              <div className="pt-4 border-t border-slate-100 text-left bg-slate-50/70 p-4 rounded-2xl">
                <span className="text-xs font-bold text-slate-700 block mb-1">
                  💬 Lời nhắn chung cho tình huống này:
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {currentScenario.generalAdvice}
                </p>
              </div>
            </div>
          )}

          {/* Quick List of Other Situations */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Các chủ đề tình huống khác:
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {SCENARIOS.map((sc, i) => (
                <button
                  key={sc.id}
                  onClick={() => handleSelectScenario(i)}
                  className={`p-2.5 rounded-xl text-left font-medium transition-colors cursor-pointer truncate ${
                    selectedScenarioIndex === i
                      ? 'bg-rose-50 text-rose-700 font-bold border border-rose-200'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {i + 1}. {sc.category}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

    </section>
  );
};
