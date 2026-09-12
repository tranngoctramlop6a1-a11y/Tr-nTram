import React, { useState } from 'react';
import { NavigationTab } from '../types';
import { 
  HeartHandshake, 
  MessageCircleHeart, 
  Sparkles, 
  BrainCircuit, 
  Home as HomeIcon, 
  GraduationCap, 
  LifeBuoy, 
  Menu, 
  X, 
  PhoneCall, 
  PlusCircle,
  StickyNote,
  MessageCircle,
  BookOpen,
  Users,
  LogIn,
  Sprout
} from 'lucide-react';
import { BotMascot } from './BotMascot';
import { useAuth } from '../context/AuthContext';
import { UserAvatar } from './common/UserAvatar';
import { DailyAdviceSparkle } from './common/DailyAdviceSparkle';

interface NavbarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  onOpenCreateConfession: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenCreateConfession
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isGuest, openLoginModal, openProfileModal } = useAuth();

  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode; isSpecial?: boolean }[] = [
    { id: 'chatbot', label: 'Bạn ơi, mình nói nè', icon: <MessageCircle className="w-4 h-4 text-rose-500" />, isSpecial: true },
    { id: 'home', label: 'Trang chủ', icon: <HomeIcon className="w-4 h-4" /> },
    { id: 'plant', label: 'Cây cảm xúc', icon: <Sprout className="w-4 h-4 text-emerald-600" /> },
    { id: 'journal', label: 'Nhật ký', icon: <BookOpen className="w-4 h-4 text-amber-600" /> },
    { id: 'friends', label: 'Bạn bè', icon: <Users className="w-4 h-4 text-teal-600" /> },
    { id: 'confessions', label: 'Góc tâm sự', icon: <MessageCircleHeart className="w-4 h-4" /> },
    { id: 'scenarios', label: 'Mình nên làm gì?', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'quizzes', label: 'Hiểu bản thân', icon: <BrainCircuit className="w-4 h-4" /> },
    { id: 'parents', label: 'Gia đình', icon: <HeartHandshake className="w-4 h-4" /> },
    { id: 'school', label: 'Trường học', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'stories', label: 'Bạn không cô đơn', icon: <StickyNote className="w-4 h-4" /> },
    { id: 'help', label: 'Cần giúp đỡ', icon: <LifeBuoy className="w-4 h-4 text-rose-500" /> }
  ];

  const handleNavClick = (tab: NavigationTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-rose-100/80 shadow-xs transition-all">
      {/* Top micro announcement bar */}
      <div className="bg-gradient-to-r from-rose-50 via-amber-50 to-teal-50 px-4 py-1.5 text-xs text-slate-600 flex items-center justify-between border-b border-rose-100/50">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-medium text-slate-700">Không gian an toàn • 100% Ẩn danh • Không phán xét</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavClick('chatbot')}
              className="hidden sm:inline-flex items-center gap-1 font-bold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
            >
              <span>💬 Chatbot AI: “Có chuyện gì, cứ kể mình nghe”</span>
            </button>
            <button
              onClick={() => handleNavClick('help')}
              className="flex items-center gap-1.5 font-bold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5 text-rose-500 animate-bounce" />
              <span>Gọi 111 (Miễn phí 24/7)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
            id="nav-brand-logo"
          >
            <BotMascot mood="happy" size="md" className="group-hover:scale-105 transition-transform" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg sm:text-xl text-slate-900 tracking-tight">
                  Bạn ơi, mình nói nè
                </span>
                <span className="hidden sm:inline-block text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                  Safe Space
                </span>
              </div>
              <p className="text-[11px] text-slate-600 hidden md:block">
                “Có chuyện gì, cứ kể mình nghe.”
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              const isHelp = item.id === 'help';
              const isChatbot = item.id === 'chatbot';
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all duration-150 cursor-pointer ${
                    isActive
                      ? isHelp 
                        ? 'bg-rose-500 text-white shadow-sm'
                        : isChatbot
                          ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold shadow-xs'
                          : 'bg-rose-50 text-rose-700 font-bold shadow-xs'
                      : isHelp
                        ? 'text-rose-600 hover:bg-rose-50 font-bold'
                        : isChatbot
                          ? 'text-rose-600 bg-rose-50/70 hover:bg-rose-100/70 font-bold border border-rose-200/70'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action Button & Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* User Account / Login Button with Daily Advice (✨ →) */}
            {user ? (
              <div className="flex items-center rounded-xl bg-teal-50 hover:bg-teal-100/70 border border-teal-200/80 text-teal-800 transition-all text-xs font-semibold shadow-2xs p-0.5 sm:p-1 gap-0.5 sm:gap-1">
                <button
                  type="button"
                  id="nav-btn-profile"
                  onClick={openProfileModal}
                  className="flex items-center gap-1.5 px-1.5 py-0.5 sm:py-1 rounded-lg hover:bg-teal-100/80 transition-colors cursor-pointer"
                  title="Mở hồ sơ cá nhân"
                >
                  <UserAvatar avatar={user.avatar} name={user.nickname} id={user.friend_id} size="xs" rounded="rounded-lg" />
                  <span className="font-bold max-w-[85px] sm:max-w-[110px] truncate">{user.nickname}</span>
                  <span className="text-[10px] font-mono text-teal-600 bg-teal-200/60 px-1.5 py-0.5 rounded-md hidden lg:inline">
                    {user.friend_id}
                  </span>
                </button>
                {/* Micro-feature: Lời khuyên siêu tích cực ✨ → */}
                <DailyAdviceSparkle popupAlign="right" />
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <DailyAdviceSparkle popupAlign="right" />
                <button
                  type="button"
                  id="nav-btn-login"
                  onClick={openLoginModal}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 hover:text-gray-900 transition-all text-xs font-semibold cursor-pointer shadow-2xs"
                >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Đăng nhập</span>
              </button>
            </div>
          )}

            <button
              id="nav-btn-open-chatbot"
              onClick={() => handleNavClick('chatbot')}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow-md hover:from-rose-600 hover:to-amber-600 transition-all duration-200 cursor-pointer transform active:scale-95"
            >
              <BotMascot mood="happy" size="sm" className="w-5 h-5 -my-1 shadow-none border-0" />
              <span className="hidden sm:inline">Tâm sự với AI</span>
              <span className="sm:hidden">Chat</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Toggle menu"
              id="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-200">
          {/* User Account Bar in Mobile Drawer */}
          {user ? (
            <div className="p-3 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-between">
              <div 
                onClick={() => {
                  setMobileMenuOpen(false);
                  openProfileModal();
                }}
                className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0"
              >
                <UserAvatar avatar={user.avatar} name={user.nickname} id={user.friend_id} size="md" rounded="rounded-xl" />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-gray-800 truncate">{user.nickname}</div>
                  <div className="text-[10px] font-mono text-teal-600">{user.friend_id}</div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <DailyAdviceSparkle popupAlign="right" />
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openProfileModal();
                  }}
                  className="text-xs font-semibold text-teal-700 bg-white px-2.5 py-1 rounded-lg border border-teal-200/80 shadow-2xs cursor-pointer"
                >
                  Hồ sơ
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                openLoginModal();
              }}
              className="w-full p-3 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm"
            >
              <LogIn className="w-4 h-4" />
              <span>Đăng nhập với Google để kết bạn</span>
            </button>
          )}

          <div className="grid grid-cols-2 gap-2 pt-1">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              const isHelp = item.id === 'help';
              const isChatbot = item.id === 'chatbot';
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 p-3 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer text-left ${
                    isActive
                      ? isHelp 
                        ? 'bg-rose-500 text-white font-bold'
                        : isChatbot
                          ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold'
                          : 'bg-rose-50 text-rose-700 font-bold'
                      : isChatbot
                        ? 'text-rose-700 bg-rose-50 font-bold border border-rose-200'
                        : isHelp
                          ? 'text-rose-600 bg-rose-50/50 font-semibold'
                          : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleNavClick('chatbot');
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold text-sm shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Mở phòng chat: “Bạn ơi, mình nói nè”</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCreateConfession();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Gửi tâm sự ẩn danh lên tường</span>
            </button>

            <button
              onClick={() => handleNavClick('help')}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-rose-50 text-rose-700 font-bold text-xs"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Tổng đài bảo vệ trẻ em: Gọi 111</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
