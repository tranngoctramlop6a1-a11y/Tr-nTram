import React, { useState } from 'react';
import { Check, Palette, Sparkles, Pipette, SlidersHorizontal } from 'lucide-react';
import { PaperStyle } from '../../types';
import {
  PAPER_THEMES,
  PAPER_PALETTE_CATEGORIES,
  QUICK_CUSTOM_COLORS,
  PaperThemeConfig,
  isColorDark
} from './letterThemeConfig';

interface PaperColorPickerProps {
  currentPaperStyle: PaperStyle;
  customBgColor?: string | null;
  onSelectPaperStyle: (style: PaperStyle, customHex?: string) => void;
  className?: string;
}

export const PaperColorPicker: React.FC<PaperColorPickerProps> = ({
  currentPaperStyle,
  customBgColor,
  onSelectPaperStyle,
  className = ''
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [customHexInput, setCustomHexInput] = useState<string>(customBgColor || '#FAF3E0');
  const [rawText, setRawText] = useState<string>((customBgColor || '#FAF3E0').replace('#', ''));

  // Sync if customBgColor changes from outside
  React.useEffect(() => {
    if (customBgColor) {
      setCustomHexInput(customBgColor);
      setRawText(customBgColor.replace('#', ''));
    }
  }, [customBgColor]);

  const themesList = Object.values(PAPER_THEMES);

  const filteredThemes = themesList.filter(item => {
    if (item.id === 'custom') return false; // Handled separately in custom section
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  const handleApplyCustomHex = (hex: string) => {
    let clean = hex.trim();
    if (!clean.startsWith('#')) clean = `#${clean}`;
    setCustomHexInput(clean);
    setRawText(clean.replace('#', ''));
    if (/^#[0-9A-Fa-f]{6}$/.test(clean) || /^#[0-9A-Fa-f]{3}$/.test(clean)) {
      onSelectPaperStyle('custom', clean);
    }
  };

  const handleRawTextChange = (val: string) => {
    const clean = val.replace('#', '').trim();
    setRawText(clean);
    if (clean.length === 6 || clean.length === 3) {
      const full = `#${clean}`;
      setCustomHexInput(full);
      onSelectPaperStyle('custom', full);
    }
  };

  return (
    <div
      id="advanced-paper-color-picker"
      className={`bg-[#FAF7F2] rounded-2xl border border-[#8C6D58]/20 p-4 sm:p-5 shadow-xs space-y-4 ${className}`}
    >
      {/* Picker Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#8C6D58]/15 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#8C5A4B]/15 text-[#8C5A4B] flex items-center justify-center">
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm text-[#2A1F18]">
              Bảng chọn màu giấy nền
            </h4>
            <p className="text-[11px] text-[#7A6455]">
              Thay đổi sắc thái và không khí cảm xúc cho bức thư
            </p>
          </div>
        </div>

        {/* Current Theme Pill */}
        <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-[#8C6D58]/20 text-xs font-serif shadow-xs">
          <span className="text-[#7A6455]">Đang chọn:</span>
          <span
            className="w-3.5 h-3.5 rounded-full border border-black/15 shadow-2xs"
            style={{
              backgroundColor:
                currentPaperStyle === 'custom' && customBgColor
                  ? customBgColor
                  : PAPER_THEMES[currentPaperStyle]?.sheetBg || '#F7F2E8'
            }}
          />
          <strong className="text-[#2A1F18]">
            {currentPaperStyle === 'custom'
              ? `Tự chọn (${customBgColor || '#FAF3E0'})`
              : PAPER_THEMES[currentPaperStyle]?.name || 'Be giấy mộc'}
          </strong>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {PAPER_PALETTE_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-serif transition-all flex items-center gap-1.5 shrink-0 ${
              activeCategory === cat.id
                ? 'bg-[#8C5A4B] text-white shadow-xs font-semibold'
                : 'bg-white hover:bg-[#F3ECE0] text-[#5A4537] border border-[#8C6D58]/15'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.title}</span>
          </button>
        ))}
      </div>

      {/* Theme Swatches Grid (Vintage, Cream, Pastel, Deep) */}
      {activeCategory !== 'custom' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {filteredThemes.map(theme => {
            const isSelected = currentPaperStyle === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                id={`paper-swatch-${theme.id}`}
                onClick={() => onSelectPaperStyle(theme.id)}
                className={`group relative text-left p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#8C5A4B] ring-2 ring-[#8C5A4B]/30 shadow-md bg-white'
                    : 'border-[#8C6D58]/15 hover:border-[#8C5A4B]/60 bg-white/70 hover:bg-white hover:shadow-xs'
                }`}
              >
                {/* Paper mini preview */}
                <div
                  className="w-full h-12 rounded-lg border border-black/10 relative overflow-hidden shadow-inner mb-2 flex flex-col justify-center px-2"
                  style={{
                    backgroundColor: theme.sheetBg,
                    backgroundImage: `linear-gradient(to bottom, transparent 9px, ${theme.ruledLineColor} 10px)`,
                    backgroundSize: '100% 10px'
                  }}
                >
                  {/* Active Checkmark Pill */}
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#8C5A4B] text-white flex items-center justify-center shadow-xs">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                  {/* Subtle Stamp Badge in Preview */}
                  <div
                    className="w-2.5 h-3 rounded-xs border opacity-70"
                    style={{
                      backgroundColor: theme.stampBg,
                      borderColor: theme.stampBorder
                    }}
                  />
                </div>

                {/* Theme Name & Emotion */}
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold text-[#2A1F18] flex items-center justify-between">
                    <span className="truncate">{theme.name}</span>
                  </div>
                  <div className="text-[10px] text-[#7A6455] line-clamp-1">
                    {theme.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Freeform Visual Color Picker Section */}
      {(activeCategory === 'custom' || activeCategory === 'all') && (
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-[#8C6D58]/15 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#2A1F18] font-serif">
              <Pipette className="w-3.5 h-3.5 text-[#8C5A4B]" />
              <span>Bảng pha màu tự do (Custom Color Picker)</span>
            </div>
            <span className="text-[10px] text-[#8C6D58]/80 font-mono">
              {customHexInput.toUpperCase()}
            </span>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            {/* Color Swatch / Native HTML5 Color Picker Trigger */}
            <div className="relative shrink-0">
              <label
                htmlFor="custom-letter-color-input"
                className="w-12 h-12 rounded-xl border-2 border-[#8C6D58]/30 flex items-center justify-center cursor-pointer shadow-inner relative overflow-hidden group hover:scale-105 transition-transform"
                style={{ backgroundColor: customHexInput }}
                title="Bấm để mở bảng chọn màu toàn phổ"
              >
                <input
                  id="custom-letter-color-input"
                  type="color"
                  value={customHexInput}
                  onChange={e => handleApplyCustomHex(e.target.value)}
                  className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                />
                <Pipette
                  className={`w-4 h-4 opacity-75 group-hover:opacity-100 ${
                    isColorDark(customHexInput) ? 'text-white' : 'text-[#2A1F18]'
                  }`}
                />
              </label>
            </div>

            {/* Hex input and apply button */}
            <div className="flex-1 min-w-[180px] flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-[#8C6D58] font-mono">
                  #
                </span>
                <input
                  type="text"
                  value={rawText}
                  maxLength={6}
                  onChange={e => handleRawTextChange(e.target.value)}
                  placeholder="FAF3E0"
                  className="w-full pl-6 pr-3 py-1.5 text-xs font-mono rounded-lg bg-[#FAF7F2] border border-[#8C6D58]/20 text-[#2A1F18] uppercase focus:outline-none focus:ring-1 focus:ring-[#8C5A4B]"
                />
              </div>

              <button
                type="button"
                onClick={() => handleApplyCustomHex(rawText)}
                className={`px-3 py-1.5 rounded-lg text-xs font-serif transition-colors whitespace-nowrap cursor-pointer ${
                  currentPaperStyle === 'custom'
                    ? 'bg-[#8C5A4B] text-white shadow-xs'
                    : 'bg-[#F2ECE1] hover:bg-[#E8DFC9] text-[#4A382A]'
                }`}
              >
                Áp dụng
              </button>
            </div>
          </div>

          {/* Quick Pastel Palette Swatches */}
          <div className="pt-2 border-t border-[#8C6D58]/10">
            <div className="text-[10.5px] text-[#7A6455] font-serif mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>Gợi ý các gam màu trang nhã, dịu mắt:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_CUSTOM_COLORS.map(c => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => handleApplyCustomHex(c.hex)}
                  className="group flex items-center gap-1.5 px-2 py-1 rounded-lg border border-black/10 hover:border-[#8C5A4B] bg-white hover:bg-black/5 text-[11px] font-serif transition-all"
                  title={`${c.name} (${c.hex})`}
                >
                  <span
                    className="w-3 h-3 rounded-full border border-black/15 shadow-2xs shrink-0"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className="text-[#3E2D20] text-[10.5px]">{c.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
