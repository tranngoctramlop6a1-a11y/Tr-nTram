import React, { useState } from 'react';
import { X, Search, Sparkles, Plus, Trash2, Info, Move } from 'lucide-react';
import { STICKER_LIBRARY, STICKER_CATEGORIES, StickerDefinition, PlacedSticker } from './letterStickersData';

export interface StickerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSticker?: (sticker: StickerDefinition) => void;
  onSelectSticker?: (sticker: StickerDefinition) => void;
  placedStickers?: PlacedSticker[];
  placedCount?: number;
  onClearAllStickers?: () => void;
}

export const StickerDrawer: React.FC<StickerDrawerProps> = ({
  isOpen,
  onClose,
  onAddSticker,
  onSelectSticker,
  placedStickers = [],
  placedCount,
  onClearAllStickers = () => {}
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  const handleAdd = onSelectSticker || onAddSticker || (() => {});
  const displayCount = placedCount ?? placedStickers.length;

  const filteredStickers = STICKER_LIBRARY.filter(stk => {
    const matchesCategory = activeCategory === 'all' || stk.category === activeCategory;
    const matchesQuery = !searchQuery.trim() || 
      stk.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (stk.desc && stk.desc.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  return (
    <div
      id="sticker-drawer-panel"
      className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-[#FAF7F2] border-l border-[#8C6D58]/20 shadow-2xl flex flex-col animate-slideLeft transition-all"
    >
      {/* Drawer Header */}
      <div className="p-4 sm:p-5 border-b border-[#8C6D58]/15 bg-[#F4EFE6] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#8C5A4B]/15 text-[#8C5A4B] flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif text-base font-bold text-[#2A1F18]">
              Kho Sticker & Tem Vintage
            </h3>
            <p className="text-[11px] text-[#7A6455]">
              Chạm để đính lên thư, sau đó kéo thả tự do
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-black/5 text-[#7A6455] hover:text-[#2A1F18] transition-colors"
          title="Đóng bảng sticker"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Guide Bar */}
      <div className="px-4 py-2.5 bg-[#FAF1E4] border-b border-[#E8D7C0] flex items-center justify-between text-xs text-[#8C5A4B]">
        <div className="flex items-center gap-1.5 font-medium">
          <Move className="w-3.5 h-3.5" />
          <span>Kéo thả, xoay & phóng to tự do</span>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <span className="font-semibold px-2 py-0.5 rounded-full bg-[#8C5A4B]/10">
            {displayCount} đã đính
          </span>
          {displayCount > 0 && (
            <button
              type="button"
              onClick={onClearAllStickers}
              className="text-red-700 hover:text-red-900 underline flex items-center gap-0.5 transition-colors"
              title="Gỡ tất cả sticker trên giấy"
            >
              <Trash2 className="w-3 h-3" />
              <span>Gỡ hết</span>
            </button>
          )}
        </div>
      </div>

      {/* Search Input */}
      <div className="p-3 border-b border-[#8C6D58]/10 bg-[#FAF7F2]">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C6D58]/60" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm washi, tem thư, hình vẽ..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white border border-[#8C6D58]/20 focus:outline-none focus:ring-1 focus:ring-[#8C5A4B] text-[#2A1F18] placeholder:text-[#8C6D58]/50"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8C6D58]/60 hover:text-[#2A1F18]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Category Pills */}
      <div className="px-3 py-2 border-b border-[#8C6D58]/10 flex gap-1.5 overflow-x-auto no-scrollbar bg-[#F7F3EB]">
        {STICKER_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`whitespace-nowrap px-2.5 py-1 rounded-full text-xs font-serif transition-all flex items-center gap-1 shrink-0 ${
              activeCategory === cat.id
                ? 'bg-[#8C5A4B] text-white shadow-xs font-semibold'
                : 'bg-white/80 hover:bg-white text-[#5A4537] border border-[#8C6D58]/15'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.title}</span>
          </button>
        ))}
      </div>

      {/* Sticker Grid List */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4">
        {filteredStickers.length === 0 ? (
          <div className="text-center py-12 text-[#8C6D58]/70">
            <Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs">Không tìm thấy sticker phù hợp</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
            {filteredStickers.map(stk => (
              <button
                key={stk.id}
                type="button"
                id={`sticker-library-item-${stk.id}`}
                onClick={() => handleAdd(stk)}
                className="group relative p-3 rounded-2xl bg-white border border-[#8C6D58]/15 hover:border-[#8C5A4B] hover:shadow-md transition-all flex flex-col items-center justify-between min-h-[96px] text-center cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                {/* Floating Add Badge */}
                <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#8C5A4B]/10 group-hover:bg-[#8C5A4B] text-[#8C5A4B] group-hover:text-white flex items-center justify-center transition-colors">
                  <Plus className="w-3 h-3" />
                </span>

                {/* Graphic Icon Render */}
                <div className="w-full flex-1 flex items-center justify-center p-1">
                  {stk.renderIcon({
                    className: 'transition-transform duration-200 group-hover:scale-105'
                  })}
                </div>

                {/* Name & Desc */}
                <div className="w-full mt-2 pt-1.5 border-t border-[#8C6D58]/10">
                  <div className="text-[11px] font-medium text-[#2A1F18] truncate">
                    {stk.name}
                  </div>
                  {stk.desc && (
                    <div className="text-[9.5px] text-[#8C6D58]/80 line-clamp-1">
                      {stk.desc}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Drawer Footer Tips */}
      <div className="p-3 bg-[#F4EFE6] border-t border-[#8C6D58]/15 text-[11px] text-[#7A6455] text-center font-serif">
        ✨ <em>Mẹo: Chạm vào sticker trên tờ giấy để xoay góc hoặc chỉnh kích cỡ</em>
      </div>
    </div>
  );
};
