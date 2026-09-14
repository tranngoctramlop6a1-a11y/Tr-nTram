import React, { useState, useEffect, useCallback } from 'react';
import { JournalImageItem } from '../../types';
import { Trash2, X, ChevronLeft, ChevronRight, Maximize2, Sparkles } from 'lucide-react';

interface JournalImageGalleryProps {
  images: JournalImageItem[];
  editable?: boolean;
  onDeleteImage?: (id: string) => void;
  dateFormatted?: string;
}

export const JournalImageGallery: React.FC<JournalImageGalleryProps> = ({
  images,
  editable = false,
  onDeleteImage,
  dateFormatted
}) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const total = images.length;
  if (total === 0) return null;

  const activeImage = lightboxIndex !== null ? images[lightboxIndex] : null;

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : total - 1));
  }, [total]);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLightboxIndex((prev) => (prev !== null && prev < total - 1 ? prev + 1 : 0));
  }, [total]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxIndex(null);
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, handlePrev, handleNext]);

  return (
    <div className="space-y-2">
      {/* 
        AUTOMATIC RESPONSIVE LAYOUTS (Requirement 3):
        - 1 photo: large display
        - 2 photos: side by side (2 columns)
        - 3 photos: 1 large + 2 small
        - 4 photos: 2x2 grid
      */}
      {total === 1 && (
        <div className="relative group overflow-hidden rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-xs bg-stone-100">
          <img
            src={images[0].url}
            alt={images[0].caption || 'Ảnh nhật ký'}
            onClick={() => setLightboxIndex(0)}
            className="w-full h-64 sm:h-80 md:h-96 object-cover cursor-pointer hover:scale-[1.015] transition-transform duration-300"
            loading="lazy"
          />
          {/* Action overlay */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3.5">
            <span className="text-white text-xs font-semibold flex items-center gap-1.5 drop-shadow-sm">
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Xem phóng to</span>
            </span>
            {editable && onDeleteImage && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteImage(images[0].id);
                }}
                className="pointer-events-auto p-2 rounded-xl bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-bold transition-all shadow-md cursor-pointer active:scale-95"
                title="Xóa ảnh này"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          {/* Direct touch delete for mobile if in edit mode */}
          {editable && onDeleteImage && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteImage(images[0].id);
              }}
              className="sm:hidden absolute top-2.5 right-2.5 p-2 rounded-xl bg-black/60 text-white text-xs cursor-pointer shadow-md"
              title="Xóa ảnh này"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {total === 2 && (
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 h-48 sm:h-64">
          {images.slice(0, 2).map((img, idx) => (
            <div
              key={img.id}
              className="relative group overflow-hidden rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-xs bg-stone-100 h-full"
            >
              <img
                src={img.url}
                alt={img.caption || `Ảnh nhật ký #${idx + 1}`}
                onClick={() => setLightboxIndex(idx)}
                className="w-full h-full object-cover cursor-pointer hover:scale-[1.02] transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                <span className="text-white text-xs font-semibold flex items-center gap-1 drop-shadow-sm">
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Xem lớn</span>
                </span>
                {editable && onDeleteImage && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteImage(img.id);
                    }}
                    className="pointer-events-auto p-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                    title="Xóa ảnh này"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              {editable && onDeleteImage && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteImage(img.id);
                  }}
                  className="sm:hidden absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white text-xs cursor-pointer shadow-md"
                  title="Xóa ảnh này"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {total === 3 && (
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3 h-56 sm:h-72">
          {/* Photo 1: Large left side (2 columns wide) */}
          <div className="col-span-2 relative group overflow-hidden rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-xs bg-stone-100 h-full">
            <img
              src={images[0].url}
              alt={images[0].caption || 'Ảnh nhật ký #1'}
              onClick={() => setLightboxIndex(0)}
              className="w-full h-full object-cover cursor-pointer hover:scale-[1.02] transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
              <span className="text-white text-xs font-semibold flex items-center gap-1 drop-shadow-sm">
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Xem lớn</span>
              </span>
              {editable && onDeleteImage && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteImage(images[0].id);
                  }}
                  className="pointer-events-auto p-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-bold cursor-pointer"
                  title="Xóa ảnh này"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            {editable && onDeleteImage && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteImage(images[0].id);
                }}
                className="sm:hidden absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white text-xs cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Photos 2 & 3: Stacked on right side (1 column, 2 rows) */}
          <div className="col-span-1 flex flex-col gap-2.5 sm:gap-3 h-full">
            {images.slice(1, 3).map((img, idx) => (
              <div
                key={img.id}
                className="relative group flex-1 overflow-hidden rounded-xl sm:rounded-2xl border border-stone-200/90 shadow-xs bg-stone-100 h-[calc(50%-5px)]"
              >
                <img
                  src={img.url}
                  alt={img.caption || `Ảnh nhật ký #${idx + 2}`}
                  onClick={() => setLightboxIndex(idx + 1)}
                  className="w-full h-full object-cover cursor-pointer hover:scale-[1.03] transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 pointer-events-none bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Maximize2 className="w-4 h-4 text-white drop-shadow-sm" />
                  {editable && onDeleteImage && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteImage(img.id);
                      }}
                      className="pointer-events-auto absolute top-1.5 right-1.5 p-1.5 rounded-md bg-rose-600/90 hover:bg-rose-600 text-white text-[11px] font-bold cursor-pointer"
                      title="Xóa ảnh này"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
                {editable && onDeleteImage && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteImage(img.id);
                    }}
                    className="sm:hidden absolute top-1 right-1 p-1 rounded-md bg-black/60 text-white cursor-pointer"
                  >
                    <Trash2 className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {total >= 4 && (
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 h-64 sm:h-80">
          {images.slice(0, 4).map((img, idx) => (
            <div
              key={img.id}
              className="relative group overflow-hidden rounded-xl sm:rounded-2xl border border-stone-200/90 shadow-xs bg-stone-100 h-full"
            >
              <img
                src={img.url}
                alt={img.caption || `Ảnh nhật ký #${idx + 1}`}
                onClick={() => setLightboxIndex(idx)}
                className="w-full h-full object-cover cursor-pointer hover:scale-[1.02] transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-2.5">
                <span className="text-white text-[11px] font-semibold flex items-center gap-1 drop-shadow-sm">
                  <Maximize2 className="w-3 h-3" />
                  <span>#{idx + 1}</span>
                </span>
                {editable && onDeleteImage && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteImage(img.id);
                    }}
                    className="pointer-events-auto p-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                    title="Xóa ảnh này"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              {editable && onDeleteImage && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteImage(img.id);
                  }}
                  className="sm:hidden absolute top-1.5 right-1.5 p-1.5 rounded-md bg-black/60 text-white text-xs cursor-pointer shadow-md"
                  title="Xóa ảnh này"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 
        LIGHTBOX MODAL (Requirement 7):
        - Bấm vào ảnh -> xem lớn
        - Vuốt/chuyển giữa các ảnh trong cùng entry (Previous/Next)
        - Bấm ra ngoài (backdrop) hoặc nhấn ✕ hoặc Escape -> đóng
        - Không tự động mở toàn màn hình
      */}
      {lightboxIndex !== null && activeImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-3 sm:p-6 select-none animate-in fade-in duration-200"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Top toolbar */}
          <div
            className="w-full max-w-4xl flex items-center justify-between text-white/80 px-2 py-3 mb-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold bg-white/10 px-3 py-1 rounded-full text-white">
                {lightboxIndex + 1} / {total}
              </span>
              {dateFormatted && (
                <span className="text-xs text-white/60 hidden sm:inline">
                  • {dateFormatted}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {editable && onDeleteImage && (
                <button
                  type="button"
                  onClick={() => {
                    onDeleteImage(activeImage.id);
                    setLightboxIndex((prev) => {
                      if (total <= 1) return null;
                      if (prev !== null && prev >= total - 1) return prev - 1;
                      return prev;
                    });
                  }}
                  className="px-3 py-1.5 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa ảnh</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setLightboxIndex(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Đóng (Escape hoặc bấm ra ngoài)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main image container */}
          <div
            className="relative flex items-center justify-center max-w-4xl max-h-[80vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Prev arrow button */}
            {total > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-2 sm:-left-6 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-black/80 text-white transition-all cursor-pointer shadow-lg active:scale-95 z-10"
                title="Ảnh trước (Mũi tên trái)"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            )}

            <img
              src={activeImage.url}
              alt={activeImage.caption || 'Ảnh nhật ký phóng to'}
              className="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl border border-white/10"
            />

            {/* Next arrow button */}
            {total > 1 && (
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-2 sm:-right-6 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-black/80 text-white transition-all cursor-pointer shadow-lg active:scale-95 z-10"
                title="Ảnh tiếp theo (Mũi tên phải)"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            )}
          </div>

          {/* Bottom Caption & hint */}
          <div
            className="w-full max-w-xl text-center mt-3 px-4"
            onClick={(e) => e.stopPropagation()}
          >
            {activeImage.caption && (
              <p className="text-white text-xs sm:text-sm font-medium bg-black/40 py-1.5 px-4 rounded-xl inline-block">
                {activeImage.caption}
              </p>
            )}
            <p className="text-[11px] text-white/40 mt-1">
              Bấm ra ngoài hoặc nhấn phím Escape để khép lại
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
