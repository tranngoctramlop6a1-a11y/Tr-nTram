import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  RotateCcw,
  Eraser,
  Paintbrush,
  Sparkles,
  Heart,
  Send,
  Check,
  CheckCircle2,
  Trash2,
  Palette
} from 'lucide-react';
import { SeedGrowthEffect } from '../../types';

interface CircularCanvasModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSow: (drawingDataUrl: string, effect: SeedGrowthEffect) => void;
}

// Grouped palettes matching requirements
export const PALETTES = {
  basic: [
    { id: 'red', hex: '#EF4444', label: 'Đỏ' },
    { id: 'orange', hex: '#F97316', label: 'Cam' },
    { id: 'yellow', hex: '#EAB308', label: 'Vàng' },
    { id: 'green', hex: '#22C55E', label: 'Xanh lá' },
    { id: 'blue', hex: '#3B82F6', label: 'Xanh dương' },
    { id: 'purple', hex: '#A855F7', label: 'Tím' },
    { id: 'pink', hex: '#EC4899', label: 'Hồng' }
  ],
  pastel: [
    { id: 'pastel_pink', hex: '#FBCFE8', label: 'Hồng pastel' },
    { id: 'pastel_purple', hex: '#E9D5FF', label: 'Tím pastel' },
    { id: 'pastel_blue', hex: '#BAE6FD', label: 'Xanh pastel' },
    { id: 'pastel_yellow', hex: '#FEF08A', label: 'Vàng pastel' },
    { id: 'pastel_orange', hex: '#FED7AA', label: 'Cam pastel' },
    { id: 'pastel_green', hex: '#BBF7D0', label: 'Xanh lá pastel' }
  ],
  special: [
    { id: 'charcoal', hex: '#1E293B', label: 'Xanh đêm' },
    { id: 'night_purple', hex: '#4C1D95', label: 'Tím đêm' },
    { id: 'silver', hex: '#94A3B8', label: 'Bạc' },
    { id: 'golden_light', hex: '#FDE047', label: 'Vàng ánh sáng' }
  ]
};

const BRUSH_SIZES = [
  { size: 3, label: 'Thanh mảnh' },
  { size: 6, label: 'Vừa vặn' },
  { size: 14, label: 'Đậm nét' },
  { size: 28, label: 'Mảng lớn' }
];

const OPTIONAL_EFFECTS: { id: SeedGrowthEffect; emoji: string; label: string }[] = [
  { id: 'leaf', emoji: '🍃', label: 'Chiếc lá non' },
  { id: 'flower', emoji: '🌸', label: 'Bông hoa nở' },
  { id: 'branch', emoji: '🌿', label: 'Cành cây vươn' },
  { id: 'fruit', emoji: '🍎', label: 'Trái ngọt lành' },
  { id: 'firefly', emoji: '✨', label: 'Đốm sáng lấp lánh' },
  { id: 'sprout', emoji: '🌱', label: 'Tự nhiên lớn' }
];

export const CircularCanvasModal: React.FC<CircularCanvasModalProps> = ({
  isOpen,
  onClose,
  onSow
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef<boolean>(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const activePointerIdRef = useRef<number | null>(null);
  const canvasSizeRef = useRef<number>(288);

  const [activeTab, setActiveTab] = useState<'basic' | 'pastel' | 'special'>('basic');
  const [currentColor, setCurrentColor] = useState<string>('#EF4444');
  const [customColor, setCustomColor] = useState<string>('#059669');
  const [currentSize, setCurrentSize] = useState<number>(6);
  const [isEraser, setIsEraser] = useState<boolean>(false);
  const [selectedEffect, setSelectedEffect] = useState<SeedGrowthEffect>('sprout');
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [hasDrawn, setHasDrawn] = useState<boolean>(false);
  const [history, setHistory] = useState<ImageData[]>([]);

  // Synchronized refs to prevent stale closures in pointer listeners
  const currentColorRef = useRef<string>(currentColor);
  const currentSizeRef = useRef<number>(currentSize);
  const isEraserRef = useRef<boolean>(isEraser);

  useEffect(() => {
    currentColorRef.current = currentColor;
  }, [currentColor]);

  useEffect(() => {
    currentSizeRef.current = currentSize;
  }, [currentSize]);

  useEffect(() => {
    isEraserRef.current = isEraser;
  }, [isEraser]);

  // Animation phase: 'drawing' | 'folding' | 'dropping'
  const [animPhase, setAnimPhase] = useState<'drawing' | 'folding' | 'dropping'>('drawing');
  const [foldedSeedImage, setFoldedSeedImage] = useState<string | null>(null);

  // Initialize Canvas
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Reset stroke tracking states
    isDrawingRef.current = false;
    lastPointRef.current = null;
    activePointerIdRef.current = null;
    setIsDrawing(false);

    const clientSize = canvas.clientWidth || canvas.offsetWidth || 0;
    const size = clientSize > 0 ? clientSize : 288;
    canvasSizeRef.current = size;

    const dpr = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = Math.round(size * dpr);
    canvas.height = Math.round(size * dpr);

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    // Textured circular paper background
    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = '#FAF7F2';
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.fill();

    // Subtle paper edge border
    ctx.strokeStyle = '#E7DEC8';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Clip to circle so drawing is strictly confined
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 1, 0, Math.PI * 2);
    ctx.clip();
    // Critical: Close path immediately so it doesn't linger
    ctx.beginPath();

    const initialData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory([initialData]);
    setHasDrawn(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setAnimPhase('drawing');
      setFoldedSeedImage(null);
      const t = setTimeout(initCanvas, 50);
      return () => clearTimeout(t);
    }
  }, [isOpen, initCanvas]);

  // Coordinate helper relative to canvas
  const getCanvasCoords = (e: React.PointerEvent<HTMLCanvasElement>): { x: number; y: number } => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const logicalSize = canvasSizeRef.current || 288;

    const scaleX = rect.width > 0 ? logicalSize / rect.width : 1;
    const scaleY = rect.height > 0 ? logicalSize / rect.height : 1;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (animPhase !== 'drawing') return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
      activePointerIdRef.current = e.pointerId;
    } catch {
      // Safe fallback
    }

    const point = getCanvasCoords(e);

    // Brand new independent stroke
    isDrawingRef.current = true;
    lastPointRef.current = point;
    setIsDrawing(true);
    setHasDrawn(true);

    ctx.strokeStyle = isEraserRef.current ? '#FAF7F2' : currentColorRef.current;
    ctx.lineWidth = currentSizeRef.current;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Strictly isolated start
    ctx.beginPath();
    ctx.arc(point.x, point.y, currentSizeRef.current / 2, 0, Math.PI * 2);
    ctx.fillStyle = isEraserRef.current ? '#FAF7F2' : currentColorRef.current;
    ctx.fill();
    ctx.beginPath();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !lastPointRef.current || animPhase !== 'drawing') {
      return;
    }

    if (e.pointerType === 'mouse' && e.buttons === 0) {
      handlePointerEnd(e);
      return;
    }

    if (activePointerIdRef.current !== null && e.pointerId !== activePointerIdRef.current) {
      return;
    }

    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentPoint = getCanvasCoords(e);
    const prevPoint = lastPointRef.current;

    // Segment drawing - isolated stroke
    ctx.beginPath();
    ctx.strokeStyle = isEraserRef.current ? '#FAF7F2' : currentColorRef.current;
    ctx.lineWidth = currentSizeRef.current;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.moveTo(prevPoint.x, prevPoint.y);
    ctx.lineTo(currentPoint.x, currentPoint.y);
    ctx.stroke();
    ctx.beginPath(); // Reset immediately

    lastPointRef.current = currentPoint;
  };

  const handlePointerEnd = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;

    if (activePointerIdRef.current !== null) {
      try {
        if (e.currentTarget.hasPointerCapture(activePointerIdRef.current)) {
          e.currentTarget.releasePointerCapture(activePointerIdRef.current);
        }
      } catch {
        // Safe fallback
      }
      activePointerIdRef.current = null;
    }

    isDrawingRef.current = false;
    lastPointRef.current = null;
    setIsDrawing(false);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath(); // Close and reset path

    try {
      const currentData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setHistory((prev) => [...prev.slice(-20), currentData]);
    } catch (err) {
      console.error('Failed to capture canvas snapshot', err);
    }
  };

  const handlePointerLeave = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (activePointerIdRef.current === null && isDrawingRef.current) {
      handlePointerEnd(e);
    }
  };

  const handleUndo = () => {
    if (history.length <= 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    isDrawingRef.current = false;
    lastPointRef.current = null;
    activePointerIdRef.current = null;
    setIsDrawing(false);

    const newHistory = history.slice(0, -1);
    const prevData = newHistory[newHistory.length - 1];
    ctx.putImageData(prevData, 0, 0);
    ctx.beginPath();
    setHistory(newHistory);
    if (newHistory.length <= 1) {
      setHasDrawn(false);
    }
  };

  const handleClear = () => {
    initCanvas();
  };

  // "Gấp lại và gieo"
  const handleFoldAndSow = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    setFoldedSeedImage(dataUrl);

    // 1. Fold animation phase
    setAnimPhase('folding');

    setTimeout(() => {
      // 2. Drop animation phase
      setAnimPhase('dropping');

      setTimeout(() => {
        // 3. Complete and notify parent
        onSow(dataUrl, selectedEffect);
        onClose();
      }, 500);
    }, 450);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-amber-100 overflow-hidden my-auto"
      >
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-amber-50/80 via-emerald-50/60 to-amber-50/80 border-b border-amber-100/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 text-sm font-bold shadow-2xs">
              🌱
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-800">
                Tờ giấy cảm xúc hình tròn
              </h3>
              <p className="text-xs text-slate-500">
                Vẽ tự do mọi nét vẽ. Không có cảm xúc nào là sai.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={animPhase !== 'drawing'}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors border border-slate-200/60 cursor-pointer disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Canvas Body */}
        <div className="p-4 sm:p-5 flex flex-col items-center">
          {/* Circular Paper Container */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-amber-900/5 to-amber-900/15 blur-md pointer-events-none" />

            <AnimatePresence mode="wait">
              {animPhase === 'drawing' ? (
                <motion.div
                  key="drawing-canvas"
                  className="relative w-full h-full rounded-full overflow-hidden border-2 border-amber-200/70 shadow-inner bg-[#FAF7F2] cursor-crosshair touch-none"
                  style={{ touchAction: 'none' }}
                >
                  <canvas
                    ref={canvasRef}
                    className="w-full h-full block touch-none select-none"
                    style={{ touchAction: 'none' }}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerEnd}
                    onPointerCancel={handlePointerEnd}
                    onPointerLeave={handlePointerLeave}
                  />

                  {!hasDrawn && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center p-4">
                      <Paintbrush className="w-6 h-6 text-amber-300/80 mb-1" />
                      <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-[180px]">
                        Chạm hoặc kéo bút để vẽ bất cứ điều gì bạn đang cảm thấy...
                      </p>
                    </div>
                  )}
                </motion.div>
              ) : animPhase === 'folding' ? (
                <motion.div
                  key="folding-paper"
                  initial={{ rotate: 0, scale: 1, rotateY: 0 }}
                  animate={{
                    scale: [1, 0.6, 0.35],
                    rotateY: [0, 90, 180],
                    rotateZ: [0, 15, 30],
                    borderRadius: ['50%', '30%', '16px']
                  }}
                  transition={{ duration: 0.45, ease: 'easeInOut' }}
                  className="w-44 h-44 rounded-full bg-[#FAF7F2] border-2 border-amber-300 shadow-xl flex items-center justify-center overflow-hidden"
                >
                  {foldedSeedImage && (
                    <img
                      src={foldedSeedImage}
                      alt="folding"
                      className="w-full h-full object-cover opacity-80"
                    />
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="dropping-seed"
                  initial={{ y: 0, scale: 0.35, opacity: 1 }}
                  animate={{ y: 160, scale: 0.2, opacity: [1, 1, 0] }}
                  transition={{ duration: 0.45, ease: 'easeIn' }}
                  className="w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-100 to-emerald-200 border border-emerald-400 shadow-lg flex items-center justify-center text-xl font-bold"
                >
                  🌱
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Canvas Controls */}
          {animPhase === 'drawing' && (
            <div className="w-full mt-4 space-y-3.5">
              {/* Tool bar: Brush / Eraser / Brush Sizes / Undo / Clear */}
              <div className="flex items-center justify-between gap-2 px-1">
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setIsEraser(false)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      !isEraser
                        ? 'bg-white text-slate-800 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Paintbrush className="w-3.5 h-3.5" />
                    <span>Bút</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsEraser(true)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isEraser
                        ? 'bg-white text-slate-800 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Eraser className="w-3.5 h-3.5" />
                    <span>Tẩy</span>
                  </button>
                </div>

                {/* Size picker */}
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                  {BRUSH_SIZES.map((b) => (
                    <button
                      key={b.size}
                      type="button"
                      onClick={() => setCurrentSize(b.size)}
                      title={b.label}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                        currentSize === b.size
                          ? 'bg-white shadow-2xs text-slate-900'
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      <div
                        className="rounded-full bg-current"
                        style={{ width: Math.max(3, b.size / 2.2), height: Math.max(3, b.size / 2.2) }}
                      />
                    </button>
                  ))}
                </div>

                {/* Actions: Undo & Clear */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleUndo}
                    disabled={history.length <= 1}
                    title="Hoàn tác"
                    className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleClear}
                    title="Xóa hết vẽ lại"
                    className="p-2 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Categorized Color Palette Tabs & Color Circles */}
              {!isEraser && (
                <div className="space-y-2 bg-slate-50/80 rounded-2xl p-2.5 border border-slate-100">
                  {/* Palette category switcher */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[11px] font-bold">
                      <button
                        type="button"
                        onClick={() => setActiveTab('basic')}
                        className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                          activeTab === 'basic'
                            ? 'bg-white text-slate-900 shadow-2xs'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        🌈 Cơ bản
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('pastel')}
                        className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                          activeTab === 'pastel'
                            ? 'bg-white text-slate-900 shadow-2xs'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        🌷 Pastel
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('special')}
                        className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                          activeTab === 'special'
                            ? 'bg-white text-slate-900 shadow-2xs'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        🌌 Đặc biệt
                      </button>
                    </div>

                    {/* Native Custom Color Picker */}
                    <label
                      title="Chọn màu tự do"
                      className="relative flex items-center gap-1 px-2 py-1 bg-white hover:bg-amber-50 rounded-lg border border-slate-200 text-[11px] font-semibold text-slate-700 cursor-pointer shadow-2xs"
                    >
                      <Palette className="w-3.5 h-3.5 text-slate-500" />
                      <span>Tự chọn</span>
                      <input
                        type="color"
                        value={customColor}
                        onChange={(e) => {
                          setCustomColor(e.target.value);
                          setCurrentColor(e.target.value);
                        }}
                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                      />
                    </label>
                  </div>

                  {/* Color dots for active category */}
                  <div className="flex items-center gap-2 py-1 px-1 overflow-x-auto">
                    {PALETTES[activeTab].map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setCurrentColor(c.hex)}
                        title={c.label}
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-transform cursor-pointer relative shrink-0 flex items-center justify-center ${
                          currentColor.toLowerCase() === c.hex.toLowerCase()
                            ? 'scale-110 ring-2 ring-offset-2 ring-emerald-500 shadow-xs'
                            : 'hover:scale-105'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      >
                        {currentColor.toLowerCase() === c.hex.toLowerCase() && (
                          <Check
                            className={`w-3.5 h-3.5 ${
                              c.id.includes('yellow') || c.id === 'silver' ? 'text-slate-900' : 'text-white'
                            }`}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Optional Subtle Seed Effect Selection */}
              <div className="pt-1">
                <div className="text-[11px] text-slate-500 font-medium mb-1.5 flex items-center justify-between">
                  <span>Tâm tình gửi gắm theo hạt giống:</span>
                  <span className="text-[10px] text-emerald-700 font-semibold">
                    Cây luôn lớn, không có cảm xúc sai
                  </span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                  {OPTIONAL_EFFECTS.map((eff) => (
                    <button
                      key={eff.id}
                      type="button"
                      onClick={() => setSelectedEffect(eff.id)}
                      className={`px-2 py-1.5 rounded-xl text-[11px] font-medium border flex items-center justify-center gap-1 transition-all cursor-pointer ${
                        selectedEffect === eff.id
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold shadow-2xs'
                          : 'bg-slate-50 border-slate-200/70 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span>{eff.emoji}</span>
                      <span className="truncate">{eff.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Button: "Gấp lại và gieo" */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleFoldAndSow}
                  disabled={!hasDrawn}
                  className="w-full py-3 sm:py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  <span>Gấp lại và gieo vào chậu</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
