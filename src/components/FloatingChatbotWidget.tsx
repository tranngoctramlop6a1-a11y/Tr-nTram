import React, { useState } from 'react';
import { MessageCircle, X, Maximize2, Sparkles, Send } from 'lucide-react';
import { BotMascot } from './BotMascot';

interface FloatingChatbotWidgetProps {
  onOpenFullChat: () => void;
  isFullChatActive: boolean;
}

export const FloatingChatbotWidget: React.FC<FloatingChatbotWidgetProps> = ({
  onOpenFullChat,
  isFullChatActive
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [quickInput, setQuickInput] = useState('');

  // If already on the full chatbot tab, do not show the floating widget
  if (isFullChatActive) return null;

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
      
      {/* Mini Chat Popover */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-rose-100 overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-200">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <BotMascot mood="happy" size="sm" />
              <div>
                <h4 className="font-extrabold text-sm leading-tight">Bạn ơi, mình nói nè</h4>
                <p className="text-[11px] text-rose-100">“Có chuyện gì, cứ kể mình nghe.”</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenFullChat();
                }}
                className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Mở toàn màn hình"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Thu gọn"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-4 bg-[#FAF9F6] space-y-3 text-xs">
            <div className="flex gap-2">
              <BotMascot mood="happy" size="sm" />
              <div className="bg-white p-3 rounded-2xl border border-rose-100/80 shadow-xs text-slate-800 leading-relaxed">
                Chào bạn nhé! 🫂 Có điều gì đang làm bạn bận tâm hay muốn trút bỏ không? Bạn cứ nói tự nhiên nhé!
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-100 text-rose-800 text-[11px]">
              💡 Không gian an toàn 100% ẩn danh, không phán xét.
            </div>

            {/* Quick buttons */}
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenFullChat();
                }}
                className="p-2 rounded-xl bg-white hover:bg-rose-50 border border-slate-200 text-slate-700 font-semibold text-center transition-colors cursor-pointer"
              >
                🫂 Muốn được lắng nghe
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenFullChat();
                }}
                className="p-2 rounded-xl bg-white hover:bg-amber-50 border border-slate-200 text-slate-700 font-semibold text-center transition-colors cursor-pointer"
              >
                💡 Cần lời khuyên
              </button>
            </div>
          </div>

          {/* Footer Jump Button */}
          <div className="p-3 bg-white border-t border-slate-100">
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenFullChat();
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold text-xs shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Mở phòng trò chuyện riêng tư</span>
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      )}

      {/* Launcher Button */}
      <button
        id="floating-chat-launcher-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white font-extrabold text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer"
        aria-label="Trò chuyện với Bạn ơi, mình nói nè"
      >
        <BotMascot mood="happy" size="sm" className="shadow-none border-0" />
        <span className="hidden sm:inline">Bạn ơi, mình nói nè</span>
        <span className="sm:hidden font-bold">Chat</span>
        <span className="flex h-2.5 w-2.5 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
        </span>
      </button>

    </div>
  );
};
