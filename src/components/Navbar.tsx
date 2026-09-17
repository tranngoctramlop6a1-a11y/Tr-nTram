import React, { useState, useRef, useEffect } from 'react';
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
  Sprout,
  Mail,
  ChevronDown,
  PanelLeft,
  Compass,
  ArrowRight
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

interface NavItemConfig {
  id: NavigationTab;
  label: string;
  shortLabel?: string;
  description?: string;
  icon: React.ReactNode;
  category: 'core' | 'self' | 'community' | 'life' | 'support';
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenCreateConfession
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, openLoginModal, openProfileModal } = useAuth();

  // Primary navigation tabs kept outside for direct 1-click access
  const primaryNavItems: NavItemConfig[] = [
    { 
      id: 'home', 
      label: 'Trang chủ', 
      icon: <HomeIcon className="w-4 h-4" />,
      category: 'core'
    },
    { 
      id: 'plant', 
      label: 'Cây cảm xúc', 
      icon: <Sprout className="w-4 h-4 text-emerald-600" />,
      category: 'core'
    },
    { 
      id: 'letters', 
      label: 'Thư cho bản thân', 
      icon: <Mail className="w-4 h-4 text-[#8C5A4B]" />,
      category: 'core'
    },
    { 
      id: 'journal', 
      label: 'Nhật ký', 
      icon: <BookOpen className="w-4 h-4 text-amber-600" />,
      category: 'core'
    },
    { 
      id: 'confessions', 
      label: 'Góc tâm sự', 
      icon: <MessageCircleHeart className="w-4 h-4 text-rose-500" />,
      category: 'community'
    }
  ];

  interface DropdownGroup {
    groupTitle: string;
    items: NavItemConfig[];
  }

  // Secondary discovery tabs organized inside the "Khám phá" dropdown
  const dropdownNavGroups: DropdownGroup[] = [
    {
      groupTitle: 'Thấu hiểu & Nuôi dưỡng',
      items: [
        {
          id: 'quizzes',
          label: 'Hiểu bản thân',
          description: 'Trắc nghiệm cảm xúc, nhận diện tính cách',
          icon: <BrainCircuit className="w-4 h-4 text-purple-600" />,
          category: 'self'
        },
        {
          id: 'scenarios',
          label: 'Mình nên làm gì?',
          description: 'Tình huống ứng xử, góc nhìn giải tỏa',
          icon: <Sparkles className="w-4 h-4 text-amber-500" />,
          category: 'self'
        }
      ]
    },
    {
      groupTitle: 'Kết nối & Đời sống',
      items: [
        {
          id: 'stories',
          label: 'Bạn không cô đơn',
          description: 'Góc chia sẻ câu chuyện đồng cảm',
          icon: <StickyNote className="w-4 h-4 text-blue-500" />,
          category: 'community'
        },
        {
          id: 'parents',
          label: 'Gia đình',
          description: 'Lắng nghe & thấu hiểu giữa các thế hệ',
          icon: <HeartHandshake className="w-4 h-4 text-rose-500" />,
          category: 'life'
        },
        {
          id: 'school',
          label: 'Trường học',
          description: 'Học tập, thi cử & mối quan hệ thầy trò',
          icon: <GraduationCap className="w-4 h-4 text-indigo-500" />,
          category: 'life'
        }
      ]
    },
    {
      groupTitle: 'Hỗ trợ an toàn',
      items: [
        {
          id: 'help',
          label: 'Cần giúp đỡ khẩn cấp',
          description: 'Trợ giúp tâm lý & tư vấn tức thì',
          icon: <LifeBuoy className="w-4 h-4 text-red-600" />,
          category: 'support'
        }
      ]
    }
  ];

  // All items inside dropdown groups
  const dropdownItems: NavItemConfig[] = dropdownNavGroups.reduce<NavItemConfig[]>(
    (acc, group) => acc.concat(group.items),
    []
  );

  // Check if current tab is one of the dropdown items
  const isCurrentTabInDropdown = dropdownItems.some((i) => i.id === currentTab);
  const activeDropdownItem = dropdownItems.find((i) => i.id === currentTab);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (tab: NavigationTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
    setDropdownOpen(false);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E8DFC8] shadow-2xs transition-all">
        {/* Top Tranquil Micro Announcement Bar */}
        <div className="bg-[#F5EFEB] px-4 py-1.5 text-xs text-[#6B5749] border-b border-[#E8DFC8]/60">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-serif font-medium text-[#4A3B32] hidden sm:inline">
                Không gian an toàn • 100% Ẩn danh • Điềm đạm & Không phán xét
              </span>
              <span className="font-serif font-medium text-[#4A3B32] sm:hidden">
                Không gian an toàn • Ẩn danh
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleNavClick('chatbot')}
                className="hidden sm:inline-flex items-center gap-1.5 font-medium text-[#8C5A4B] hover:text-[#5A3528] transition-colors cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#8C5A4B]" />
                <span>Chatbot lắng nghe: “Có chuyện gì, cứ kể mình nghe”</span>
              </button>
              <button
                onClick={() => handleNavClick('help')}
                className="flex items-center gap-1.5 font-serif font-bold text-rose-700 hover:text-rose-800 transition-colors cursor-pointer bg-white/80 px-2.5 py-0.5 rounded-full border border-rose-200/80 shadow-2xs"
              >
                <PhoneCall className="w-3.5 h-3.5 text-rose-600 animate-bounce" />
                <span>Trợ giúp khẩn cấp</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Navbar Row */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left: Brand Logo & Sidebar Drawer Trigger */}
            <div className="flex items-center gap-3">
              {/* Sidebar toggle button for desktop/tablet */}
              <button
                type="button"
                id="btn-toggle-left-sidebar"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hidden lg:flex items-center justify-center w-9 h-9 rounded-xl bg-[#F0EAE1] hover:bg-[#E5DDCF] text-[#5A4537] border border-[#DCD2C4] transition-all cursor-pointer shadow-2xs"
                title="Mở toàn bộ danh mục dạng Sidebar"
                aria-label="Mở Sidebar menu"
              >
                <PanelLeft className="w-4 h-4 text-[#6B5749]" />
              </button>

              {/* Logo & Brand Title */}
              <div 
                onClick={() => handleNavClick('home')}
                className="flex items-center gap-2.5 cursor-pointer group select-none"
                id="nav-brand-logo"
              >
                <BotMascot mood="happy" size="md" className="group-hover:scale-105 transition-transform" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-lg sm:text-xl text-[#2A1F18] tracking-tight whitespace-nowrap">
                      Teen ơi!
                    </span>
                  </div>
                  <p className="text-[11px] text-[#7A6455] font-serif hidden xl:block">
                    “Có chuyện gì, cứ kể mình nghe.”
                  </p>
                </div>
              </div>
            </div>

            {/* Middle: Streamlined Desktop Navigation (Only essential core tabs) */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
              {primaryNavItems.map((item) => {
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-link-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center gap-1.5 px-2.5 xl:px-3.5 py-2 rounded-xl text-xs xl:text-sm font-serif font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                      isActive
                        ? 'bg-[#3B2A1E] text-[#FAF8F5] shadow-xs'
                        : 'text-[#5A4537] hover:text-[#2A1F18] hover:bg-[#EFE7DC]/60'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                );
              })}

              {/* Smart "Khám phá thêm" Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  id="nav-dropdown-explore-btn"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs xl:text-sm font-serif font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                    isCurrentTabInDropdown
                      ? 'bg-[#EFE7DC] text-[#3B2A1E] border border-[#D9CBB9] shadow-2xs font-bold'
                      : 'text-[#5A4537] hover:text-[#2A1F18] hover:bg-[#EFE7DC]/60 border border-transparent'
                  }`}
                  aria-expanded={dropdownOpen}
                >
                  <Compass className={`w-4 h-4 ${isCurrentTabInDropdown ? 'text-[#8C5A4B]' : 'text-[#7A6455]'}`} />
                  <span>
                    {isCurrentTabInDropdown && activeDropdownItem ? activeDropdownItem.label : 'Khám phá thêm'}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Card */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-[#FAF8F5] rounded-2xl border border-[#E0D4C5] shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="space-y-3">
                      {dropdownNavGroups.map((group, gIdx) => (
                        <div key={gIdx} className={gIdx > 0 ? 'pt-2 border-t border-[#EFE7DA]' : ''}>
                          <div className="px-2.5 py-1 text-[11px] font-serif font-bold uppercase tracking-wider text-[#8C7365]">
                            {group.groupTitle}
                          </div>
                          <div className="space-y-1 mt-1">
                            {group.items.map((subItem) => {
                              const isSubActive = currentTab === subItem.id;
                              const isHelp = subItem.id === 'help';
                              return (
                                <button
                                  key={subItem.id}
                                  id={`nav-link-${subItem.id}`}
                                  onClick={() => handleNavClick(subItem.id)}
                                  className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition-all cursor-pointer group ${
                                    isSubActive
                                      ? 'bg-[#EFE7DC] text-[#2A1F18] font-bold border border-[#DFCFC0]'
                                      : isHelp
                                        ? 'hover:bg-rose-50 text-rose-700'
                                        : 'hover:bg-[#F2ECE4] text-[#4A3B32]'
                                  }`}
                                >
                                  <div className="mt-0.5 p-1.5 rounded-lg bg-white border border-[#E0D4C5] shadow-3xs group-hover:scale-105 transition-transform">
                                    {subItem.icon}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-xs font-serif font-semibold text-[#2A1F18] flex items-center justify-between">
                                      <span>{subItem.label}</span>
                                      {isSubActive && <span className="w-1.5 h-1.5 rounded-full bg-[#8C5A4B]" />}
                                    </div>
                                    <p className="text-[11px] text-[#7A6455] line-clamp-1 mt-0.5">
                                      {subItem.description}
                                    </p>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Footer note in dropdown */}
                    <div className="mt-2 pt-2 border-t border-[#EFE7DA] px-2 flex items-center justify-between text-[11px] text-[#8C7365]">
                      <span>Xem dạng cột dọc</span>
                      <button
                        type="button"
                        onClick={() => {
                          setDropdownOpen(false);
                          setSidebarOpen(true);
                        }}
                        className="font-serif font-bold text-[#8C5A4B] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>Mở Sidebar</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </nav>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* User Account / Profile */}
              {user ? (
                <div className="flex items-center rounded-xl bg-[#EFE7DC] hover:bg-[#E5DACB] border border-[#DFCFC0] text-[#3B2A1E] transition-all text-xs font-semibold shadow-2xs p-0.5 sm:p-1 gap-0.5 sm:gap-1">
                  <button
                    type="button"
                    id="nav-btn-profile"
                    onClick={openProfileModal}
                    className="flex items-center gap-1.5 px-1.5 py-0.5 sm:py-1 rounded-lg hover:bg-white/70 transition-colors cursor-pointer"
                    title="Mở hồ sơ cá nhân"
                  >
                    <UserAvatar avatar={user.avatar} name={user.nickname} id={user.id} size="xs" rounded="rounded-lg" />
                    <span className="font-serif font-bold max-w-[80px] sm:max-w-[100px] truncate">{user.nickname}</span>
                  </button>
                  <DailyAdviceSparkle popupAlign="right" />
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <DailyAdviceSparkle popupAlign="right" />
                  <button
                    type="button"
                    id="nav-btn-login"
                    onClick={openLoginModal}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#D5C7B7] text-[#4A3B32] hover:text-[#2A1F18] transition-all text-xs font-serif font-bold cursor-pointer shadow-2xs whitespace-nowrap"
                  >
                    <LogIn className="w-3.5 h-3.5 text-[#8C5A4B]" />
                    <span>Đăng nhập</span>
                  </button>
                </div>
              )}

              {/* Chatbot CTA Button */}
              <button
                id="nav-btn-open-chatbot"
                onClick={() => handleNavClick('chatbot')}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-[#3B2A1E] hover:bg-[#251A13] text-[#FAF8F5] font-serif font-bold text-xs sm:text-sm shadow-xs hover:shadow-md transition-all duration-150 cursor-pointer whitespace-nowrap"
              >
                <BotMascot mood="happy" size="sm" className="w-4 h-4 -my-1 shadow-none border-0" />
                <span className="hidden sm:inline">Tâm sự với AI</span>
                <span className="sm:hidden">Chat</span>
              </button>

              {/* Mobile / Small Screen Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-[#5A4537] hover:text-[#2A1F18] hover:bg-[#EFE9DF] transition-colors cursor-pointer border border-transparent"
                aria-label="Toggle menu"
                id="mobile-menu-toggle"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Categorized Drawer Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FAF8F5] border-b border-[#E0D4C5] px-4 pt-3 pb-6 space-y-4 shadow-lg animate-in slide-in-from-top-2 duration-200 max-h-[80vh] overflow-y-auto">
            {/* User Account Bar in Mobile Drawer */}
            {user ? (
              <div className="p-3 rounded-2xl bg-[#F2ECE4] border border-[#DFCFC0] flex items-center justify-between">
                <div 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openProfileModal();
                  }}
                  className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0"
                >
                  <UserAvatar avatar={user.avatar} name={user.nickname} id={user.id} size="md" rounded="rounded-xl" />
                  <div className="min-w-0">
                    <div className="text-xs font-serif font-bold text-[#2A1F18] truncate">{user.nickname}</div>
                    <div className="text-[10px] font-serif text-[#8C5A4B]">Dữ liệu đã đồng bộ</div>
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
                    className="text-xs font-serif font-bold text-[#5A4537] bg-white px-2.5 py-1 rounded-lg border border-[#D5C7B7] shadow-2xs cursor-pointer"
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
                className="w-full p-3 rounded-2xl bg-[#3B2A1E] text-white font-serif font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
              >
                <LogIn className="w-4 h-4" />
                <span>Đăng nhập để sao lưu & đồng bộ dữ liệu</span>
              </button>
            )}

            {/* Mobile Nav Tabs grouped cleanly */}
            <div className="space-y-3">
              {/* Group 1: Core Items */}
              <div>
                <span className="text-[11px] font-serif font-bold uppercase tracking-wider text-[#8C7365] px-1">
                  Trọng tâm & Cảm xúc
                </span>
                <div className="grid grid-cols-2 gap-1.5 mt-1.5">
                  {primaryNavItems.slice(0, 4).map((item) => {
                    const isActive = currentTab === item.id;
                    return (
                      <button
                        key={item.id}
                        id={`nav-link-${item.id}`}
                        onClick={() => handleNavClick(item.id)}
                        className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-serif font-medium transition-colors cursor-pointer text-left ${
                          isActive
                            ? 'bg-[#3B2A1E] text-white font-bold shadow-xs'
                            : 'bg-white/80 hover:bg-white text-[#4A3B32] border border-[#E8DFC8]'
                        }`}
                      >
                        {item.icon}
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Group 2: Community */}
              <div>
                <span className="text-[11px] font-serif font-bold uppercase tracking-wider text-[#8C7365] px-1">
                  Kết nối & Tâm sự
                </span>
                <div className="grid grid-cols-2 gap-1.5 mt-1.5">
                  {primaryNavItems.slice(4).concat([
                    { id: 'stories', label: 'Bạn không cô đơn', icon: <StickyNote className="w-4 h-4 text-blue-500" />, category: 'community' }
                  ]).map((item) => {
                    const isActive = currentTab === item.id;
                    return (
                      <button
                        key={item.id}
                        id={`nav-link-${item.id}`}
                        onClick={() => handleNavClick(item.id)}
                        className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-serif font-medium transition-colors cursor-pointer text-left ${
                          isActive
                            ? 'bg-[#3B2A1E] text-white font-bold shadow-xs'
                            : 'bg-white/80 hover:bg-white text-[#4A3B32] border border-[#E8DFC8]'
                        }`}
                      >
                        {item.icon}
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Group 3: Exploration & Deep Dives */}
              <div>
                <span className="text-[11px] font-serif font-bold uppercase tracking-wider text-[#8C7365] px-1">
                  Thấu hiểu & Đời sống
                </span>
                <div className="grid grid-cols-2 gap-1.5 mt-1.5">
                  {[
                    { id: 'quizzes' as NavigationTab, label: 'Hiểu bản thân', icon: <BrainCircuit className="w-4 h-4 text-purple-600" /> },
                    { id: 'scenarios' as NavigationTab, label: 'Mình nên làm gì?', icon: <Sparkles className="w-4 h-4 text-amber-500" /> },
                    { id: 'parents' as NavigationTab, label: 'Gia đình', icon: <HeartHandshake className="w-4 h-4 text-rose-500" /> },
                    { id: 'school' as NavigationTab, label: 'Trường học', icon: <GraduationCap className="w-4 h-4 text-indigo-500" /> }
                  ].map((item) => {
                    const isActive = currentTab === item.id;
                    return (
                      <button
                        key={item.id}
                        id={`nav-link-${item.id}`}
                        onClick={() => handleNavClick(item.id)}
                        className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-serif font-medium transition-colors cursor-pointer text-left ${
                          isActive
                            ? 'bg-[#3B2A1E] text-white font-bold shadow-xs'
                            : 'bg-white/80 hover:bg-white text-[#4A3B32] border border-[#E8DFC8]'
                        }`}
                      >
                        {item.icon}
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Emergency Assistance Tab */}
              <button
                id="nav-link-help"
                onClick={() => handleNavClick('help')}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer ${
                  currentTab === 'help'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <LifeBuoy className="w-4 h-4 text-red-600" />
                  <span>Cần giúp đỡ khẩn cấp</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Actions */}
            <div className="pt-3 border-t border-[#E8DFC8] flex flex-col gap-2">
              <button
                id="nav-link-chatbot"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleNavClick('chatbot');
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#3B2A1E] text-white font-serif font-bold text-xs shadow-xs"
              >
                <MessageCircle className="w-4 h-4 text-[#DFC8B4]" />
                <span>Mở phòng chat: “Bạn ơi, mình nói nè”</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCreateConfession();
                }}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-[#EFE9DF] hover:bg-[#E5DDCF] text-[#5A4537] font-serif font-bold text-xs border border-[#DCD2C4]"
              >
                <PlusCircle className="w-4 h-4 text-[#8C5A4B]" />
                <span>Gửi tâm sự ẩn danh lên tường</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ========================================================================= */}
      {/* EXPANDABLE LEFT SIDEBAR (VERTICAL NAVIGATION DRAWER / PANEL) */}
      {/* ========================================================================= */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex animate-in fade-in duration-200">
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-xs transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Sliding Left Sidebar Container */}
          <aside className="relative w-80 max-w-[85vw] bg-[#FAF8F5] h-full shadow-2xl flex flex-col z-10 border-r border-[#E0D4C5] animate-in slide-in-from-left duration-200">
            {/* Sidebar Header */}
            <div className="p-4 sm:p-5 border-b border-[#E8DFC8] flex items-center justify-between bg-[#F5EFEB]">
              <div className="flex items-center gap-2.5">
                <BotMascot mood="happy" size="sm" />
                <div>
                  <h3 className="font-serif font-bold text-base text-[#2A1F18]">
                    Mục lục điều hướng
                  </h3>
                  <p className="text-[11px] text-[#7A6455] font-serif">
                    Chọn chuyên mục bạn muốn đến
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 rounded-lg text-[#6B5749] hover:bg-[#E8DFC8] transition-colors cursor-pointer"
                title="Đóng thanh bên"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sidebar Nav List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              {/* Category: Trọng tâm & Tự thấu hiểu */}
              <div>
                <span className="text-[11px] font-serif font-bold uppercase tracking-widest text-[#8C7365] px-2 block mb-2">
                  Tự thấu hiểu & Cảm xúc
                </span>
                <div className="space-y-1">
                  {[
                    { id: 'home' as NavigationTab, label: 'Trang chủ', desc: 'Nhật ký cảm xúc & bài viết hôm nay', icon: <HomeIcon className="w-4 h-4" /> },
                    { id: 'plant' as NavigationTab, label: 'Cây cảm xúc', desc: 'Chăm sóc mầm xanh tâm trạng', icon: <Sprout className="w-4 h-4 text-emerald-600" /> },
                    { id: 'letters' as NavigationTab, label: 'Thư cho bản thân', desc: 'Bức thư gửi tương lai, hẹn ngày mở', icon: <Mail className="w-4 h-4 text-[#8C5A4B]" /> },
                    { id: 'journal' as NavigationTab, label: 'Nhật ký cá nhân', desc: 'Không gian riêng tư viết lại ngày qua', icon: <BookOpen className="w-4 h-4 text-amber-600" /> },
                    { id: 'quizzes' as NavigationTab, label: 'Hiểu bản thân', desc: 'Trắc nghiệm cảm xúc & tính cách', icon: <BrainCircuit className="w-4 h-4 text-purple-600" /> },
                    { id: 'scenarios' as NavigationTab, label: 'Mình nên làm gì?', desc: 'Tình huống ứng xử, lời khuyên tĩnh lặng', icon: <Sparkles className="w-4 h-4 text-amber-500" /> }
                  ].map((item) => {
                    const isActive = currentTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#3B2A1E] text-white shadow-xs font-bold'
                            : 'hover:bg-[#F2ECE4] text-[#4A3B32]'
                        }`}
                      >
                        <div className={`mt-0.5 p-1.5 rounded-lg ${isActive ? 'bg-white/20' : 'bg-white border border-[#E0D4C5]'}`}>
                          {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`text-xs font-serif font-bold ${isActive ? 'text-white' : 'text-[#2A1F18]'}`}>
                            {item.label}
                          </div>
                          <p className={`text-[11px] truncate mt-0.5 ${isActive ? 'text-[#FAF8F5]/80' : 'text-[#7A6455]'}`}>
                            {item.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Category: Kết nối & Cộng đồng */}
              <div>
                <span className="text-[11px] font-serif font-bold uppercase tracking-widest text-[#8C7365] px-2 block mb-2">
                  Kết nối & Cộng đồng
                </span>
                <div className="space-y-1">
                  {[
                    { id: 'confessions' as NavigationTab, label: 'Góc tâm sự', desc: 'Tường sẻ chia cảm xúc ẩn danh', icon: <MessageCircleHeart className="w-4 h-4 text-rose-500" /> },
                    { id: 'stories' as NavigationTab, label: 'Bạn không cô đơn', desc: 'Câu chuyện lắng lòng & đồng cảm', icon: <StickyNote className="w-4 h-4 text-blue-500" /> },
                    { id: 'parents' as NavigationTab, label: 'Gia đình', desc: 'Góc lắng nghe & cầu nối yêu thương', icon: <HeartHandshake className="w-4 h-4 text-rose-500" /> },
                    { id: 'school' as NavigationTab, label: 'Trường học', desc: 'Bạn bè, áp lực thi cử & lớp học', icon: <GraduationCap className="w-4 h-4 text-indigo-500" /> }
                  ].map((item) => {
                    const isActive = currentTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#3B2A1E] text-white shadow-xs font-bold'
                            : 'hover:bg-[#F2ECE4] text-[#4A3B32]'
                        }`}
                      >
                        <div className={`mt-0.5 p-1.5 rounded-lg ${isActive ? 'bg-white/20' : 'bg-white border border-[#E0D4C5]'}`}>
                          {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`text-xs font-serif font-bold ${isActive ? 'text-white' : 'text-[#2A1F18]'}`}>
                            {item.label}
                          </div>
                          <p className={`text-[11px] truncate mt-0.5 ${isActive ? 'text-[#FAF8F5]/80' : 'text-[#7A6455]'}`}>
                            {item.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Category: An toàn & Hỗ trợ */}
              <div>
                <span className="text-[11px] font-serif font-bold uppercase tracking-widest text-[#8C7365] px-2 block mb-2">
                  Trợ giúp khẩn cấp
                </span>
                <button
                  onClick={() => handleNavClick('help')}
                  className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                    currentTab === 'help'
                      ? 'bg-red-600 text-white shadow-xs font-bold'
                      : 'bg-red-50 hover:bg-red-100/70 text-red-800 border border-red-200'
                  }`}
                >
                  <div className={`mt-0.5 p-1.5 rounded-lg ${currentTab === 'help' ? 'bg-white/20' : 'bg-white border border-red-200'}`}>
                    <LifeBuoy className="w-4 h-4 text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-serif font-bold">
                      Cần giúp đỡ khẩn cấp
                    </div>
                    <p className="text-[11px] mt-0.5 opacity-80">
                      Đường dây nóng & liên hệ hỗ trợ tâm lý 24/7
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-[#E8DFC8] bg-[#F5EFEB] space-y-2">
              <button
                onClick={() => handleNavClick('chatbot')}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#3B2A1E] text-white font-serif font-bold text-xs shadow-xs"
              >
                <BotMascot mood="happy" size="sm" className="w-4 h-4 -my-1 shadow-none border-0" />
                <span>Trò chuyện cùng AI Mascot</span>
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};
