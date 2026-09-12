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
  Trash2
} from 'lucide-react';
import { SeedGrowthEffect } from '../../types';

interface CircularCanvasModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSow: (drawingDataUrl: string, effect: SeedGrowthEffect) => void;
}

const COLOR_PALETTE = [
  { id: 'charcoal', hex: '#2D3748', label: 'Than chì' },
  { id: 'terracotta', hex: '#EA580C', label: 'Đất nung' },
  { id: 'rose', hex: '#E11D48', label: 'Hoa hồng' },
  { id: 'amber', hex: '#D97706', label: 'Mật ong' },
  { id: 'sun', hex: '#FACC15', label: 'Nắng ấm' },
  { id: 'sage', hex: '#059669', label: 'Xanh lá' },
  { id: 'sky', hex: '#0284C7', label: 'Bầu trời' },
  { id: 'indigo', hex: '#4F46E5', label: 'Hoàng hôn' },
  { id: 'violet', hex: '#9333EA', label: 'Mơ mộng' },
  { id: 'rain', hex: '#64748B', label: 'Mây mưa' }
];

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

  const [currentColor, setCurrentColor] = useState<string>('#2D3748');
  const [currentSize, setCurrentSize] = useState<number>(6);
  const [isEraser, setIsEraser] = useState<boolean>(false);
  const [selectedEffect, setSelectedEffect] = useState<SeedGrowthEffect>('sprout');
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [hasDrawn, setHasDrawn] = useState<boolean>(false);
  const [history, setHistory] = useState<ImageData[]>([]);

  // Synchronized refs to prevent stale closure in pointer event listeners
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

    // Determine layout size accurately, avoiding transform-scaling distortions
    const clientSize = canvas.clientWidth || canvas.offsetWidth || 0;
    const size = clientSize > 0 ? clientSize : 288;
    canvasSizeRef.current = size;

    const dpr = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = Math.round(size * dpr);
    canvas.height = Math.round(size * dpr);

    // Reset transform before scaling by DPR
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    // Warm textured paper background
    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = '#FAF7F2';
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.fill();

    // Subtle paper edge border
    ctx.strokeStyle = '#E7DEC8';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Clip to circle so drawing operations are strictly confined to the paper
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 1, 0, Math.PI * 2);
    ctx.clip();
    // CRITICAL: Reset the path immediately so the circle arc is NOT left in the path
    ctx.beginPath();

    // Save initial state for history
    const initialData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory([initialData]);
    setHasDrawn(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setAnimPhase('drawing');
      setFoldedSeedImage(null);
      // Small timeout to allow DOM layout to settle
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
    // Only accept primary button (e.button === 0) or touch/pen
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Capture pointer so fast movements or dragging outside canvas remain tracked
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
      activePointerIdRef.current = e.pointerId;
    } catch {
      // Safe fallback
    }

    // 1. Get exact canvas coordinates at contact point
    const point = getCanvasCoords(e);

    // 2. Reset previous stroke state - THIS IS A COMPLETELY NEW STROKE
    isDrawingRef.current = true;
    lastPointRef.current = point;
    setIsDrawing(true);
    setHasDrawn(true);

    // 3. Configure stroke appearance
    ctx.strokeStyle = isEraserRef.current ? '#FAF7F2' : currentColorRef.current;
    ctx.lineWidth = currentSizeRef.current;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // 4. Start fresh path and draw immediate dot at contact position
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    // 5. Do not draw when not in drawing state
    if (!isDrawingRef.current || !lastPointRef.current || animPhase !== 'drawing') {
      return;
    }

    // If mouse button was released outside the window
    if (e.pointerType === 'mouse' && e.buttons === 0) {
      handlePointerEnd(e);
      return;
    }

    // If multi-touch, ignore other pointers
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

    // Segment drawing - each segment is cleanly stroked independently
    ctx.beginPath();
    ctx.moveTo(prevPoint.x, prevPoint.y);
    ctx.lineTo(currentPoint.x, currentPoint.y);
    ctx.stroke();

    lastPointRef.current = currentPoint;
  };

  const handlePointerEnd = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;

    // Release pointer capture
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
    // If pointer capture is NOT active and pointer leaves, end stroke
    if (activePointerIdRef.current === null && isDrawingRef.current) {
      handlePointerEnd(e);
    }
  };

  // Undo
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

  // Clear / Làm lại
  const handleClear = () => {
    initCanvas();
  };

  // "Gấp lại và gieo"
  const handleFoldAndSow = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Get circular drawing data URL
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
                Cứ vẽ tự do mọi nét vẽ. Không có cảm xúc nào là sai.
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
        <div className="p-4 sm:p-6 flex flex-col items-center">
          {/* Circular Paper Container */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
            {/* Soft shadow ring simulating paper sitting on wooden table */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-amber-900/5 to-amber-900/15 blur-md pointer-events-none" />

            {/* Folding animation container */}
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

                  {/* Empty state prompt on paper when untouched */}
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
                // Step 1: Paper folds in half then folds into a small seed packet
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
                // Step 2: Seed pellet drops down smoothly into the box below
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

          {/* Canvas Controls (only shown when drawing) */}
          {animPhase === 'drawing' && (
            <div className="w-full mt-5 space-y-4">
              {/* Tool bar: Brush / Eraser / Undo / Clear */}
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
                    <span>Bút vẽ</span>
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

              {/* Color Palette (10 delicate shades) */}
              {!isEraser && (
                <div className="flex items-center justify-between gap-1.5 py-1 px-1 overflow-x-auto">
                  {COLOR_PALETTE.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCurrentColor(c.hex)}
                      title={c.label}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-transform cursor-pointer relative shrink-0 flex items-center justify-center ${
                        currentColor === c.hex
                          ? 'scale-110 ring-2 ring-offset-2 ring-emerald-500 shadow-xs'
                          : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    >
                      {currentColor === c.hex && (
                        <Check
                          className={`w-3.5 h-3.5 ${
                            c.id === 'sun' || c.id === 'amber' ? 'text-slate-900' : 'text-white'
                          }`}
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Optional Subtle Effect Selection */}
              <div className="pt-2 border-t border-slate-100">
                <div className="text-[11px] text-slate-400 font-medium mb-1.5 flex items-center justify-between">
                  <span>Lời chúc gửi theo hạt giống (tùy chọn):</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">
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
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                >
                  <Send className="w-4 h-4" />
                  <span>📮 Gấp lại và gieo</span>
                </button>
                <p className="text-[11px] text-center text-slate-400 mt-2">
                  Tờ giấy sẽ được gấp lại thành một hạt giống nhỏ và cất vào chiếc hộp cảm xúc.
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
