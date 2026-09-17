import React, { useState } from 'react';
import { NavigationTab } from '../types';
import { 
  MessageCircleHeart, 
  ShieldCheck, 
  Heart, 
  PhoneCall, 
  FileText, 
  Lock, 
  Users, 
  Mail, 
  X 
} from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: NavigationTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  const [activeModal, setActiveModal] = useState<'about' | 'privacy' | 'community' | 'contact' | null>(null);

  return (
    <footer className="bg-white border-t border-rose-100 pt-12 pb-16 text-slate-600 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-slate-100">
          
          {/* Brand & Slogan */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-rose-400 to-amber-300 p-0.5 shadow-xs">
                <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                  <MessageCircleHeart className="w-4 h-4 text-rose-500" />
                </div>
              </div>
              <span className="font-extrabold text-lg text-slate-800 tracking-tight">
                Teen ơi!
              </span>
            </div>

            <p className="text-sm font-semibold text-rose-600 italic">
              “Có chuyện gì, cứ kể mình nghe.”
            </p>

            <p className="text-xs text-slate-600 leading-relaxed max-w-sm">
              Không gian an toàn trực tuyến và chatbot AI thân thiện dành riêng cho học sinh tuổi teen. Nơi bạn được lắng nghe, không bị phán xét, và bắt đầu bước đầu tiên bằng việc chia sẻ.
            </p>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Ẩn danh • Không thu thập dữ liệu cá nhân</span>
            </div>
          </div>

          {/* Quick Nav */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Điều hướng nhanh
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onSelectTab('chatbot')}
                  className="font-bold text-rose-600 hover:text-rose-700 transition-colors cursor-pointer"
                >
                  💬 Bạn ơi, mình nói nè (Chatbot)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('home')}
                  className="hover:text-rose-600 transition-colors cursor-pointer"
                >
                  Trang chủ
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('plant')}
                  className="hover:text-emerald-700 font-semibold text-emerald-800 transition-colors cursor-pointer"
                >
                  🌱 Hộp cây cảm xúc
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('journal')}
                  className="hover:text-rose-600 font-semibold text-amber-900 transition-colors cursor-pointer"
                >
                  📖 Nhật ký của mình
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('confessions')}
                  className="hover:text-rose-600 transition-colors cursor-pointer"
                >
                  Góc tâm sự ẩn danh
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('scenarios')}
                  className="hover:text-rose-600 transition-colors cursor-pointer"
                >
                  Mình nên làm gì?
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('quizzes')}
                  className="hover:text-rose-600 transition-colors cursor-pointer"
                >
                  Thử hiểu bản thân hơn
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('parents')}
                  className="hover:text-rose-600 transition-colors cursor-pointer"
                >
                  Nói chuyện với bố mẹ
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('school')}
                  className="hover:text-rose-600 transition-colors cursor-pointer"
                >
                  Ở trường thì sao?
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('stories')}
                  className="hover:text-rose-600 transition-colors cursor-pointer"
                >
                  Bạn không cô đơn
                </button>
              </li>
            </ul>
          </div>

          {/* Guidelines & Support */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Về dự án & Trợ giúp
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActiveModal('about')}
                  className="hover:text-rose-600 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-600" />
                  <span>Về dự án “Teen có điều muốn nói”</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('privacy')}
                  className="hover:text-rose-600 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5 text-slate-600" />
                  <span>Chính sách quyền riêng tư</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('community')}
                  className="hover:text-rose-600 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Users className="w-3.5 h-3.5 text-slate-600" />
                  <span>Nguyên tắc cộng đồng văn minh</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('help')}
                  className="font-bold text-rose-600 hover:text-rose-700 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Cần giúp đỡ khẩn cấp</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('contact')}
                  className="hover:text-rose-600 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-slate-600" />
                  <span>Liên hệ & Đóng góp ý kiến</span>
                </button>
              </li>
            </ul>

            <div className="pt-2">
              <div id="footer-credits-box" className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-[11px] text-rose-800 space-y-1">
                <span id="footer-credits-title" className="font-bold block">Ý tưởng của:</span>
                <span id="footer-credits-authors" className="block font-medium text-slate-700">Ngọc Trâm, Phương Nhi, Đức Thảo</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-2">
          <div>
            © 2026 Teen có điều muốn nói. Được xây dựng vì một môi trường lớn lên an toàn và yêu thương cho teen Việt Nam.
          </div>
          <div className="flex items-center gap-1 text-[11px]">
            <span>Dành cho học sinh tuổi teen từ 13–18 tuổi</span>
            <span>•</span>
            <span className="text-rose-500 font-semibold">Safe Space</span>
          </div>
        </div>

      </div>

      {/* Info Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-xl border border-rose-100 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-600 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {activeModal === 'about' && (
              <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <h3 className="text-xl font-bold text-slate-900">Về dự án “Teen có điều muốn nói”</h3>
                <p>
                  Dự án ra đời từ sự thấu hiểu sâu sắc rằng: <strong>“Nhiều teen đang gặp áp lực và khó khăn nhưng không biết nói với ai hoặc ngại chia sẻ.”</strong>
                </p>
                <p>
                  Chúng mình từ chối biến không gian này thành một trang web bệnh viện hay tư vấn tâm lý khô khan. Thay vào đó, đây là một ngôi nhà nhỏ ấm áp, gần gũi, nơi mỗi bạn trẻ được là chính mình, được lắng nghe và học cách tự thấu hiểu cảm xúc của bản thân.
                </p>
                <div className="p-3.5 bg-rose-50 rounded-2xl border border-rose-100 text-rose-900 font-medium">
                  Ở đây, bạn không bị phán xét, không bị so sánh với bất kỳ ai, và không bao giờ phải gồng mình một mình.
                </div>
              </div>
            )}

            {activeModal === 'privacy' && (
              <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <h3 className="text-xl font-bold text-slate-900">Quyền riêng tư & Bảo mật</h3>
                <p>
                  <strong>1. Không bắt buộc đăng nhập:</strong> Bạn có thể đọc nội dung, làm test, đọc tình huống và viết tâm sự mà không cần tài khoản hay thông tin cá nhân.
                </p>
                <p>
                  <strong>2. Ẩn danh hoàn toàn:</strong> Khi bạn đăng bài hoặc bình luận, hệ thống chỉ hiển thị bí danh ngẫu nhiên (ví dụ: Mèo Lười #429). Chúng mình không lưu địa chỉ IP hay danh tính của bạn.
                </p>
                <p>
                  <strong>3. Dữ liệu lưu cục bộ:</strong> Nhật ký cảm xúc hàng ngày và kết quả làm test được lưu trữ an toàn ngay trên trình duyệt máy bạn (Local Storage) để bảo đảm sự riêng tư tối đa.
                </p>
              </div>
            )}

            {activeModal === 'community' && (
              <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <h3 className="text-xl font-bold text-slate-900">Nguyên tắc cộng đồng văn minh</h3>
                <ul className="space-y-2.5">
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">•</span>
                    <span><strong>Không phán xét:</strong> Tôn trọng cảm xúc và hoàn cảnh riêng biệt của mỗi bạn.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">•</span>
                    <span><strong>Không bắt nạt, xúc phạm:</strong> Mọi ngôn từ thô tục, công kích ngoại hình hoặc tẩy chay đều bị hệ thống từ chối đăng tải.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">•</span>
                    <span><strong>Bảo vệ danh tính người khác:</strong> Không nhắc đến tên trường, họ tên thật hoặc số điện thoại của người khác trong bài viết.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">•</span>
                    <span><strong>Đồng cảm và xây dựng:</strong> Hãy để lại những lời an ủi, động viên chân thành.</span>
                  </li>
                </ul>
              </div>
            )}

            {activeModal === 'contact' && (
              <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <h3 className="text-xl font-bold text-slate-900">Liên hệ & Đóng góp ý kiến</h3>
                <p>
                  Bạn có sáng kiến, muốn chia sẻ thêm câu chuyện hoặc gợi ý một tình huống mới cho mục “Mình nên làm gì?”?
                </p>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="font-semibold text-slate-800">Email ban biên tập dự án:</div>
                  <div className="text-rose-600 font-mono text-xs">teen.codieu.muonnoi@safespace.org.vn</div>
                </div>
                <p className="text-xs text-slate-600">
                  Chúng mình luôn lắng nghe mọi phản hồi để hoàn thiện không gian an toàn này tốt hơn mỗi ngày.
                </p>
              </div>
            )}

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-900 cursor-pointer"
              >
                Đóng lại
              </button>
            </div>
          </div>
        </div>
      )}

    </footer>
  );
};
