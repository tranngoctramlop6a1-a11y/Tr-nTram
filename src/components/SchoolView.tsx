import React, { useState } from 'react';
import { SCHOOL_ISSUES } from '../data/initialData';
import { SchoolIssueTopic } from '../types';
import { 
  GraduationCap, 
  AlertCircle, 
  ShieldCheck, 
  UserCheck, 
  ArrowRight, 
  PhoneCall, 
  HelpCircle,
  Eye,
  Shield
} from 'lucide-react';

interface SchoolViewProps {
  onGoToHelp: () => void;
}

export const SchoolView: React.FC<SchoolViewProps> = ({ onGoToHelp }) => {
  const [selectedIssueId, setSelectedIssueId] = useState<string>(SCHOOL_ISSUES[0].id);

  const currentIssue: SchoolIssueTopic = SCHOOL_ISSUES.find((i) => i.id === selectedIssueId) || SCHOOL_ISSUES[0];

  return (
    <section className="py-10 md:py-16 max-w-6xl mx-auto px-4 sm:px-6" id="section-school">
      
      {/* Header */}
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold border border-blue-200">
          <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
          <span>Đời sống học đường • Vững vàng & An toàn</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Góc “Ở trường thì sao?”
        </h2>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Trường học là nơi lưu giữ nhiều kỷ niệm đẹp, nhưng đôi khi cũng mang lại những áp lực và mâu thuẫn khó gọi tên. Bạn không cần phải đối mặt một mình.
        </p>
      </div>

      {/* Grid of Issues Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-8">
        {SCHOOL_ISSUES.map((issue) => {
          const isSelected = selectedIssueId === issue.id;
          return (
            <button
              key={issue.id}
              onClick={() => setSelectedIssueId(issue.id)}
              className={`p-3 rounded-2xl text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 border-2 ${
                isSelected
                  ? 'border-rose-500 bg-rose-50/70 shadow-sm scale-102'
                  : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className="text-2xl">{issue.icon}</span>
              <span className={`text-xs font-bold leading-tight ${
                isSelected ? 'text-rose-900' : 'text-slate-700'
              }`}>
                {issue.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Detailed Card for Selected Issue */}
      <div className="bg-white rounded-3xl p-6 sm:p-9 border border-rose-100 shadow-md space-y-8">
        
        {/* Title & Summary */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-3xl shadow-xs shrink-0">
              {currentIssue.icon}
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                {currentIssue.title}
              </h3>
              <p className="text-sm text-slate-600 font-medium mt-0.5">
                {currentIssue.summary}
              </p>
            </div>
          </div>

          <button
            onClick={onGoToHelp}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 cursor-pointer shrink-0 transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Cần trợ giúp khẩn cấp</span>
          </button>
        </div>

        {/* 2 Column Details: Signs & Safe Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Dấu hiệu nhận biết */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-amber-600" />
              <span>Dấu hiệu nhận biết bạn hoặc bạn bè đang gặp phải:</span>
            </h4>
            <div className="space-y-2">
              {currentIssue.signs.map((sign, idx) => (
                <div
                  key={idx}
                  className="bg-amber-50/50 p-3.5 rounded-2xl border border-amber-100/70 text-xs sm:text-sm text-slate-800 flex items-start gap-2.5"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-1.5"></span>
                  <span className="leading-relaxed">{sign}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cách xử lý an toàn */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Một số cách xử lý an toàn & chủ động:</span>
            </h4>
            <div className="space-y-2">
              {currentIssue.safeActions.map((act, idx) => (
                <div
                  key={idx}
                  className="bg-emerald-50/50 p-3.5 rounded-2xl border border-emerald-100/70 text-xs sm:text-sm text-slate-800 flex items-start gap-2.5"
                >
                  <span className="text-emerald-600 font-bold shrink-0">✓</span>
                  <span className="leading-relaxed font-medium">{act}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* When to Seek Adults & Who to turn to */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4 border-t border-slate-100">
          
          {/* Khi nào nên tìm người lớn */}
          <div className="md:col-span-7 bg-rose-50/70 p-5 rounded-2xl border border-rose-100 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Khi nào nhất định PHẢI tìm đến người lớn?</span>
            </h4>
            <p className="text-xs sm:text-sm text-rose-950 leading-relaxed font-medium">
              {currentIssue.whenToSeekAdults}
            </p>
          </div>

          {/* Người có thể tìm đến */}
          <div className="md:col-span-5 bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-slate-600 shrink-0" />
              <span>Người bạn có thể tìm đến:</span>
            </h4>
            <ul className="space-y-1 text-xs text-slate-700 font-medium">
              {currentIssue.whoToTurnTo.map((person, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>{person}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>

    </section>
  );
};
