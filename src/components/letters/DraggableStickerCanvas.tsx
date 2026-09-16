import React, { useState, useRef, useEffect, useCallback } from 'react';
import { RotateCw, RotateCcw, Trash2, ZoomIn, ZoomOut, ArrowUpCircle } from 'lucide-react';
import { PlacedSticker, STICKER_LIBRARY, StickerDefinition } from './letterStickersData';

interface DraggableStickerCanvasProps {
  stickers: PlacedSticker[];
  onUpdateStickers?: (stickers: PlacedSticker[]) => void;
  isReadOnly?: boolean;
  className?: string;
  selectedId?: string | null;
  onSelectId?: (id: string | null) => void;
}

export const DraggableStickerCanvas: React.FC<DraggableStickerCanvasProps> = ({
  stickers,
  onUpdateStickers = () => {},
  isReadOnly = false,
  className = '',
  selectedId: controlledSelectedId,
  onSelectId
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(null);
  const selectedId = controlledSelectedId !== undefined ? controlledSelectedId : internalSelectedId;

  const setSelectedId = useCallback((id: string | null) => {
    setInternalSelectedId(id);
    if (onSelectId) onSelectId(id);
  }, [onSelectId]);

  const [draggingId, setDraggingId] = useState<string | null>(null);
  const stickersRef = useRef<PlacedSticker[]>(stickers);
  stickersRef.current = stickers;

  const onUpdateStickersRef = useRef(onUpdateStickers);
  onUpdateStickersRef.current = onUpdateStickers;

  const dragStartRef = useRef<{
    startX: number;
    startY: number;
    initialStickerX: number;
    initialStickerY: number;
    rectWidth: number;
    rectHeight: number;
    stickerId: string;
  } | null>(null);

  // Close selection when clicking outside
  useEffect(() => {
    if (isReadOnly) return;
    const handleGlobalClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setSelectedId(null);
      }
    };
    window.addEventListener('mousedown', handleGlobalClick);
    return () => window.removeEventListener('mousedown', handleGlobalClick);
  }, [isReadOnly, setSelectedId]);

  // Handle Drag Move & End with stable listeners that never unbind/rebind mid-drag
  const handlePointerMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!dragStartRef.current) return;

    // Prevent default scroll when dragging
    if (e.cancelable) {
      e.preventDefault();
    }

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const { startX, startY, initialStickerX, initialStickerY, rectWidth, rectHeight, stickerId } = dragStartRef.current;
    if (rectWidth <= 0 || rectHeight <= 0) return;

    const deltaXPixels = clientX - startX;
    const deltaYPixels = clientY - startY;

    // Convert pixel delta into percentage delta
    const deltaXPercent = (deltaXPixels / rectWidth) * 100;
    const deltaYPercent = (deltaYPixels / rectHeight) * 100;

    // Clamp coordinates so sticker stays comfortably inside the letter sheet (2% - 98%)
    const newX = Math.max(2, Math.min(98, initialStickerX + deltaXPercent));
    const newY = Math.max(2, Math.min(98, initialStickerY + deltaYPercent));

    const currentList = stickersRef.current;
    const updated = currentList.map(stk =>
      stk.id === stickerId
        ? { ...stk, x: Math.round(newX * 10) / 10, y: Math.round(newY * 10) / 10 }
        : stk
    );
    onUpdateStickersRef.current(updated);
  }, []);

  const handlePointerUp = useCallback(() => {
    setDraggingId(null);
    dragStartRef.current = null;
    document.body.style.userSelect = '';
  }, []);

  useEffect(() => {
    if (draggingId) {
      document.body.style.userSelect = 'none';
      window.addEventListener('mousemove', handlePointerMove, { passive: false });
      window.addEventListener('mouseup', handlePointerUp);
      window.addEventListener('touchmove', handlePointerMove, { passive: false });
      window.addEventListener('touchend', handlePointerUp);
      window.addEventListener('touchcancel', handlePointerUp);

      return () => {
        document.body.style.userSelect = '';
        window.removeEventListener('mousemove', handlePointerMove);
        window.removeEventListener('mouseup', handlePointerUp);
        window.removeEventListener('touchmove', handlePointerMove);
        window.removeEventListener('touchend', handlePointerUp);
        window.removeEventListener('touchcancel', handlePointerUp);
      };
    }
  }, [draggingId, handlePointerMove, handlePointerUp]);

  // Start dragging a sticker
  const handleStartDrag = (
    e: React.MouseEvent | React.TouchEvent,
    stk: PlacedSticker
  ) => {
    if (isReadOnly) return;
    e.stopPropagation();
    if ('preventDefault' in e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }

    setSelectedId(stk.id);
    setDraggingId(stk.id);

    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    dragStartRef.current = {
      startX: clientX,
      startY: clientY,
      initialStickerX: stk.x,
      initialStickerY: stk.y,
      rectWidth: rect.width || 1,
      rectHeight: rect.height || 1,
      stickerId: stk.id
    };
  };

  // Sticker actions: Rotate, Scale, Delete, Bring to Front
  const handleRotate = (id: string, deltaDegrees: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    onUpdateStickersRef.current(
      stickersRef.current.map(stk => {
        if (stk.id !== id) return stk;
        let nextRotate = stk.rotate + deltaDegrees;
        if (nextRotate > 180) nextRotate -= 360;
        if (nextRotate < -180) nextRotate += 360;
        return { ...stk, rotate: nextRotate };
      })
    );
  };

  const handleScale = (id: string, factorDelta: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    onUpdateStickersRef.current(
      stickersRef.current.map(stk => {
        if (stk.id !== id) return stk;
        const newScale = Math.max(0.6, Math.min(1.8, stk.scale + factorDelta));
        return { ...stk, scale: Math.round(newScale * 100) / 100 };
      })
    );
  };

  const handleDelete = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    onUpdateStickersRef.current(stickersRef.current.filter(stk => stk.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const handleBringToFront = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const maxZ = Math.max(...stickersRef.current.map(s => s.zIndex || 1), 1);
    onUpdateStickersRef.current(
      stickersRef.current.map(stk => (stk.id === id ? { ...stk, zIndex: maxZ + 1 } : stk))
    );
  };

  // Helper to render proportional sticker graphic
  const renderStickerGraphic = (stk: PlacedSticker, def?: StickerDefinition) => {
    if (def) {
      if (def.type === 'washi') {
        return (
          <div className="w-20 h-5 sm:w-22 sm:h-5.5 flex items-center justify-center select-none pointer-events-none">
            {def.renderIcon({ className: 'w-full h-full object-contain pointer-events-none' })}
          </div>
        );
      }
      if (def.type === 'postage') {
        return (
          <div className="w-9 h-11 sm:w-10 sm:h-12 flex items-center justify-center select-none pointer-events-none">
            {def.renderIcon({ className: 'w-full h-full object-contain pointer-events-none' })}
          </div>
        );
      }
      if (def.type === 'cute') {
        return (
          <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center select-none pointer-events-none">
            {def.renderIcon({ className: 'w-full h-full object-contain pointer-events-none' })}
          </div>
        );
      }
      return (
        <div className="w-8 h-8 flex items-center justify-center select-none pointer-events-none">
          {def.renderIcon({ className: 'w-full h-full object-contain pointer-events-none' })}
        </div>
      );
    }

    if (stk.char) {
      return (
        <span className="text-xl sm:text-2xl leading-none select-none block drop-shadow-xs pointer-events-none">
          {stk.char}
        </span>
      );
    }

    return (
      <span className="text-[11px] font-serif px-1.5 py-0.5 bg-amber-50 rounded border border-amber-200 text-amber-900 select-none pointer-events-none">
        {stk.name}
      </span>
    );
  };

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{ zIndex: 12 }}
    >
      {stickers.map(stk => {
        const isSelected = selectedId === stk.id;
        const isDragging = draggingId === stk.id;
        const def = STICKER_LIBRARY.find(item => item.id === stk.stickerId);

        return (
          <div
            key={stk.id}
            id={`placed-sticker-${stk.id}`}
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
            style={{
              position: 'absolute',
              left: `${stk.x}%`,
              top: `${stk.y}%`,
              transform: `translate(-50%, -50%) rotate(${stk.rotate}deg) scale(${stk.scale})`,
              zIndex: stk.zIndex || 10,
              touchAction: 'none'
            }}
            className={`group select-none pointer-events-auto transition-shadow ${
              isReadOnly ? 'cursor-default' : isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            onMouseDown={e => handleStartDrag(e, stk)}
            onTouchStart={e => handleStartDrag(e, stk)}
            onClick={e => {
              if (!isReadOnly) {
                e.stopPropagation();
                setSelectedId(stk.id);
              }
            }}
          >
            {/* Sticker Graphic Presentation with strict maximum boundaries */}
            <div
              className={`relative p-0.5 rounded-sm flex items-center justify-center select-none pointer-events-none ${
                isSelected && !isReadOnly
                  ? 'ring-2 ring-[#8C5A4B] ring-offset-2 ring-offset-transparent shadow-lg bg-[#FAF6EE]/40 backdrop-blur-[1px]'
                  : 'hover:drop-shadow-md'
              } ${isDragging ? 'scale-105 drop-shadow-xl opacity-95 transition-none' : 'transition-all duration-150'}`}
              style={{
                maxWidth: '85px',
                maxHeight: '56px'
              }}
            >
              {renderStickerGraphic(stk, def)}
            </div>

            {/* Interactive Control Floating Bubble (Only when selected and not in read-only mode) */}
            {isSelected && !isReadOnly && (
              <div
                className="absolute -top-11 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-[#2A1F18]/95 text-white px-2 py-1 rounded-full shadow-2xl backdrop-blur-md border border-[#8C6D58]/50 animate-fadeIn pointer-events-auto z-50 text-[11px] font-sans"
                style={{
                  transform: `translateX(-50%) rotate(${-stk.rotate}deg)`, // Counter-rotate so buttons remain straight
                  transformOrigin: 'center center'
                }}
                onMouseDown={e => e.stopPropagation()}
                onTouchStart={e => e.stopPropagation()}
              >
                {/* Rotate Left */}
                <button
                  type="button"
                  onClick={e => handleRotate(stk.id, -15, e)}
                  className="p-1 hover:bg-white/20 rounded-full text-amber-200 transition-colors cursor-pointer"
                  title="Xoay ngược chiều kim đồng hồ (-15°)"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                {/* Rotate Right */}
                <button
                  type="button"
                  onClick={e => handleRotate(stk.id, 15, e)}
                  className="p-1 hover:bg-white/20 rounded-full text-amber-200 transition-colors cursor-pointer"
                  title="Xoay theo chiều kim đồng hồ (+15°)"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>

                <div className="w-[1px] h-3 bg-white/25 mx-0.5" />

                {/* Scale Up */}
                <button
                  type="button"
                  onClick={e => handleScale(stk.id, 0.15, e)}
                  className="p-1 hover:bg-white/20 rounded-full text-white transition-colors cursor-pointer"
                  title="Phóng to sticker"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>

                {/* Scale Down */}
                <button
                  type="button"
                  onClick={e => handleScale(stk.id, -0.15, e)}
                  className="p-1 hover:bg-white/20 rounded-full text-white transition-colors cursor-pointer"
                  title="Thu nhỏ sticker"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>

                <div className="w-[1px] h-3 bg-white/25 mx-0.5" />

                {/* Bring to Front */}
                <button
                  type="button"
                  onClick={e => handleBringToFront(stk.id, e)}
                  className="p-1 hover:bg-white/20 rounded-full text-emerald-300 transition-colors cursor-pointer"
                  title="Đưa lên lớp trên cùng"
                >
                  <ArrowUpCircle className="w-3.5 h-3.5" />
                </button>

                {/* Delete */}
                <button
                  type="button"
                  onClick={e => handleDelete(stk.id, e)}
                  className="p-1 hover:bg-red-500/80 rounded-full text-red-200 transition-colors ml-0.5 cursor-pointer"
                  title="Xóa sticker này"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

