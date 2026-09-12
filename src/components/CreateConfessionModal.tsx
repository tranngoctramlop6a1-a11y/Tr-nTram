import React, { useState } from 'react';
import { Confession } from '../types';
import { checkContentModeration, getRandomNickname } from '../utils/moderation';
import { 
  X, 
  Send, 
  ShieldCheck, 
  RefreshCw, 
  AlertCircle, 
  HeartHandshake, 
  Sparkles,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CreateConfessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddConfession: (newConfession: Confession) => void;
  onGoToHelp: () => void;
}

export const CreateConfessionModal: React.FC<CreateConfessionModalProps> = ({
  isOpen,
  onClose,
  onAddConfession,
  onGoToHelp
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Confession['category']>('Gia đình');
  const [authorNickname, setAuthorNickname] = useState(getRandomNickname());
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [isEmergency, setIsEmergency] = useState(false);

  if (!isOpen) return null;

  const handleGenerateNewName = () => {
    setAuthorNickname(getRandomNickname());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWarningMessage(null);
    setIsEmergency(false);

    if (!title.trim() || !content.trim()) {
      setWarningMessage('Bạn vui lòng nhập tiêu đề và nội dung tâm sự nhé.');
      return;
    }

    // Run moderation check
    const modResult = checkContentModeration(`${title} ${content}`);
    if (modResult.isEmergency) {
      setIsEmergency(true);
      setWarningMessage(modResult.warning || null);
      // Still allow submission or guide to support
    } else if (!modResult.isSafe) {
      setWarningMessage(modResult.warning || 'Nội dung chưa phù hợp với nguyên tắc cộng đồng.');
      return;
    }

    const newConf: Confession = {
      id: `conf-${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      category,
      author: isAnonymous ? authorNickname : (authorNickname || 'Bạn nhỏ ẩn danh'),
      avatarSeed: 'seed-' + Math.floor(Math.random() * 100),
      isAnonymous,
      timestamp: 'Vừa xong',
      empathyCount: 1,
      meTooCount: 0,
      comments: []
    };

    onAddConfession(newConf);

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Reset & close
    setTitle('');
    setContent('');
    setWarningMessage(null);
    setIsEmergency(false);
    onClose();
  };

  const categories: Confession['category'][] = [
    'Gia đình', 
    'Học tập', 
    'Tình bạn', 
    'Bản thân', 
    'Trường học', 
    'Tình cảm', 
    'Khác'
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-xl border border-rose-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-600 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1.5 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold">
            <Lock className="w-3.5 h-3.5" />
            <span>100% Ẩn danh & Bảo mật</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight">
            Góc tâm sự: Nói ra điều khó nói
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Hãy viết những gì đang trĩu nặng trong lòng bạn. Ở đây bạn luôn được lắng nghe không phán xét.
          </p>
        </div>

        {/* Emergency Alert Banner if triggered */}
        {isEmergency && (
          <div className="mb-5 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs sm:text-sm space-y-2">
            <div className="flex items-center gap-2 font-bold text-rose-700">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
              <span>Chúng mình luôn ở đây cùng bạn!</span>
            </div>
            <p>{warningMessage}</p>
            <div className="pt-1 flex gap-2">
              <button
                type="button"
                onClick={onGoToHelp}
                className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700"
              >
                Xem Tổng đài hỗ trợ 111 & Hướng dẫn bình tâm
              </button>
            </div>
          </div>
        )}

        {/* Warning banner if not emergency */}
        {warningMessage && !isEmergency && (
          <div className="mb-5 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
            <span>{warningMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Category selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Chủ đề câu chuyện:
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    category === cat
                      ? 'bg-rose-500 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tiêu đề ngắn gọn:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ví dụ: Dạo này mình thấy bố mẹ chỉ quan tâm đến điểm số..."
              maxLength={100}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-rose-400 bg-slate-50/50 focus:bg-white transition-colors"
              required
            />
          </div>

          {/* Content */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold text-slate-700">
                Chia sẻ chi tiết điều bạn muốn nói:
              </label>
              <span className="text-[11px] text-slate-600">{content.length}/1000 từ</span>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Chuyện gì đã xảy ra hôm nay? Bạn đang cảm thấy thế nào? Điều gì bạn chưa dám nói với gia đình hay thầy cô?..."
              rows={4}
              maxLength={2000}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-rose-400 bg-slate-50/50 focus:bg-white transition-colors resize-none leading-relaxed"
              required
            />
          </div>

          {/* Pseudonym & Anonymous Option */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="checkbox-anonymous"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 text-rose-500 rounded-sm border-slate-300 focus:ring-rose-400 cursor-pointer"
                />
                <label htmlFor="checkbox-anonymous" className="text-xs font-bold text-slate-800 cursor-pointer">
                  Đăng ẩn danh (Khuyên dùng cho teen)
                </label>
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Không lộ danh tính
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-600 shrink-0 font-medium">Bí danh đáng yêu:</span>
              <input
                type="text"
                value={authorNickname}
                onChange={(e) => setAuthorNickname(e.target.value)}
                maxLength={30}
                className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-700 focus:outline-hidden focus:border-rose-400"
              />
              <button
                type="button"
                onClick={handleGenerateNewName}
                title="Đổi bí danh ngẫu nhiên khác"
                className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-semibold cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-bold text-sm shadow-sm flex items-center gap-2 cursor-pointer transform active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Gửi tâm sự an toàn</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
