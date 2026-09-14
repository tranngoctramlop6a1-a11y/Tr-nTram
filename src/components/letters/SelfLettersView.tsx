import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  Mail, 
  Lock, 
  Calendar, 
  Sparkles, 
  X, 
  Check, 
  RotateCcw,
  Eraser,
  PenTool,
  Palette,
  Search,
  ArrowRight,
  Info,
  CalendarDays,
  Trash2,
  Brush,
  Type,
  ScrollText,
  Clock,
  Feather,
  HeartHandshake,
  Smile
} from 'lucide-react';
import { SelfLetterRecord, SelfLetterSummary, PaperStyle, LetterFont } from '../../types';
import { useAuth } from '../../context/AuthContext';
import {
  PAPER_THEMES,
  getPaperThemeConfig,
  PaperThemeConfig
} from './letterThemeConfig';
import {
  PlacedSticker,
  StickerDefinition,
  STICKER_LIBRARY
} from './letterStickersData';
import { DraggableStickerCanvas } from './DraggableStickerCanvas';
import { StickerDrawer } from './StickerDrawer';
import { PaperColorPicker } from './PaperColorPicker';

export interface VintageSticker {
  char: string;
  name: string;
  desc?: string;
}

export interface VintageStickerCategory {
  id: string;
  title: string;
  icon: string;
  stickers: VintageSticker[];
}

export const VINTAGE_STICKER_CATEGORIES: VintageStickerCategory[] = [
  {
    id: 'postage',
    title: 'Tem thư & Bưu chính',
    icon: '💌',
    stickers: [
      { char: '💌', name: 'Thư tình cảm' },
      { char: '📮', name: 'Hòm thư đỏ' },
      { char: '✉️', name: 'Bìa thư cổ' },
      { char: '🏷️', name: 'Nhãn tem giấy' },
      { char: '📜', name: 'Cuộn giấy da' },
      { char: '📯', name: 'Kèn bưu chính' },
      { char: '🕊️', name: 'Bồ câu đưa thư' },
      { char: '🪶', name: 'Bút lông chim' }
    ]
  },
  {
    id: 'hearts',
    title: 'Trái tim & Line Art',
    icon: '🤍',
    stickers: [
      { char: '🤍', name: 'Trái tim trắng' },
      { char: '🤎', name: 'Trái tim nâu mộc' },
      { char: '💖', name: 'Tâm tình ấm áp' },
      { char: '🧸', name: 'Gấu bông ôm' },
      { char: '☕', name: 'Tách cà phê' },
      { char: '🫖', name: 'Bình trà nóng' },
      { char: '🧶', name: 'Cuộn len ấm' },
      { char: '🪞', name: 'Gương soi' }
    ]
  },
  {
    id: 'botanical',
    title: 'Nhành lá & Thiên nhiên',
    icon: '🌿',
    stickers: [
      { char: '🌿', name: 'Nhành ô-liu' },
      { char: '🍃', name: 'Chiếc lá bay' },
      { char: '🌸', name: 'Hoa anh đào' },
      { char: '🌾', name: 'Bông lúa vàng' },
      { char: '🍂', name: 'Lá phong khô' },
      { char: '🌻', name: 'Hoa hướng dương' },
      { char: '🍀', name: 'Cỏ bốn lá' },
      { char: '🪴', name: 'Chậu cây con' }
    ]
  },
  {
    id: 'stars',
    title: 'Ngôi sao & Ánh sáng',
    icon: '✨',
    stickers: [
      { char: '✨', name: 'Ánh sao lấp lánh' },
      { char: '🕯️', name: 'Ngọn nến sáp' },
      { char: '🌙', name: 'Trăng lưỡi liềm' },
      { char: '⭐', name: 'Ngôi sao nhỏ' },
      { char: '🌤️', name: 'Nắng sớm mai' },
      { char: '💫', name: 'Vệt sao băng' },
      { char: '🗝️', name: 'Chìa khóa kỷ niệm' },
      { char: '🕰️', name: 'Đồng hồ cát' }
    ]
  },
  {
    id: 'seals',
    title: 'Con dấu & Niêm phong',
    icon: '🏵️',
    stickers: [
      { char: '🏵️', name: 'Dấu sáp hoa' },
      { char: '🔏', name: 'Khóa mực bảo mật' },
      { char: '🔖', name: 'Ruy băng đánh dấu' },
      { char: '📌', name: 'Ghim giữ góc' },
      { char: '📎', name: 'Kẹp giấy đồng' },
      { char: '🖋️', name: 'Bút mực ký tên' },
      { char: '🎨', name: 'Bảng pha màu' },
      { char: '📖', name: 'Sổ tay lưu niệm' }
    ]
  }
];

export const INK_COLORS = [
  { id: '#3B2A1E', name: 'Nâu Sepia', hex: '#3B2A1E', desc: 'Mực cổ điển ấm áp' },
  { id: '#1C1917', name: 'Đen than', hex: '#1C1917', desc: 'Mực đen tối giản' },
  { id: '#1E3A5F', name: 'Xanh chàm', hex: '#1E3A5F', desc: 'Trầm tư, sâu lắng' },
  { id: '#253D32', name: 'Xanh rêu', hex: '#253D32', desc: 'Nhẹ nhàng, thanh thoát' },
  { id: '#5C252D', name: 'Đỏ gạch trầm', hex: '#5C252D', desc: 'Cảm xúc nồng ấm' }
];

export interface FontOptionConfig {
  id: LetterFont;
  name: string;
  category: 'handwriting' | 'serif' | 'sans';
  fontClass: string;
  cssFamily: string;
  sample: string;
  desc: string;
  fontSizeClass: string;
  lineHeightClass: string;
  letterSpacing?: string;
}

export const FONT_OPTIONS: FontOptionConfig[] = [
  { 
    id: 'cursive', 
    name: 'Thư tay mềm mại (Lora Nghiêng)', 
    category: 'handwriting',
    fontClass: "font-['Lora',Georgia,serif] italic", 
    cssFamily: "'Lora', Georgia, serif",
    sample: 'Gửi tôi của những ngày bình yên ấm áp...',
    desc: 'Nét chữ nghiêng lãng mạn, thanh thoát và chuẩn dấu tiếng Việt',
    fontSizeClass: 'text-xl sm:text-2xl',
    lineHeightClass: 'leading-[40px]',
    letterSpacing: 'tracking-normal'
  },
  { 
    id: 'serif', 
    name: 'Cổ điển văn học (Lora Serif)', 
    category: 'serif',
    fontClass: "font-['Lora',Georgia,serif]", 
    cssFamily: "'Lora', Georgia, serif",
    sample: 'Thời gian trôi, lòng người vẫn an nhiên...',
    desc: 'Trang nhã, đĩnh đạc, dấu tiếng Việt gắn kết tuyệt đối',
    fontSizeClass: 'text-lg sm:text-xl',
    lineHeightClass: 'leading-[38px]',
    letterSpacing: 'tracking-normal'
  },
  { 
    id: 'playfair', 
    name: 'Hoài cổ đài các (Playfair Display)', 
    category: 'serif',
    fontClass: "font-['Playfair_Display',Georgia,serif]", 
    cssFamily: "'Playfair Display', Georgia, serif",
    sample: 'Những ước mơ xưa xin gửi lại mai sau...',
    desc: 'Đài các, hoài niệm, tiêu đề thư sang trọng và chuẩn mực',
    fontSizeClass: 'text-lg sm:text-xl',
    lineHeightClass: 'leading-[38px]',
    letterSpacing: 'tracking-normal'
  },
  { 
    id: 'handwriting', 
    name: 'Nét bút thi ca (Playfair Nghiêng)', 
    category: 'handwriting',
    fontClass: "font-['Playfair_Display',Georgia,serif] italic", 
    cssFamily: "'Playfair Display', Georgia, serif",
    sample: 'Mong cậu luôn kiên định và mỉm cười...',
    desc: 'Nét bút kiêu sa, dấu câu thanh thoát không lo rớt dấu',
    fontSizeClass: 'text-xl sm:text-2xl',
    lineHeightClass: 'leading-[40px]',
    letterSpacing: 'tracking-normal'
  },
  { 
    id: 'sans', 
    name: 'Tối giản hiện đại (Be Vietnam Pro)', 
    category: 'sans',
    fontClass: "font-['Be_Vietnam_Pro',sans-serif]", 
    cssFamily: "'Be Vietnam Pro', sans-serif",
    sample: 'Mọi chuyện rồi sẽ ổn thôi mà...',
    desc: 'Thiết kế riêng cho tiếng Việt, thanh lịch và mạch lạc',
    fontSizeClass: 'text-base sm:text-lg',
    lineHeightClass: 'leading-[34px]',
    letterSpacing: 'tracking-normal'
  },
  { 
    id: 'patrick', 
    name: 'Mộc mạc gần gũi (Be Vietnam Pro Nghiêng)', 
    category: 'sans',
    fontClass: "font-['Be_Vietnam_Pro',sans-serif] italic font-medium", 
    cssFamily: "'Be Vietnam Pro', sans-serif",
    sample: 'Có chuyện gì, cứ viết ra hết cùng mình nhé...',
    desc: 'Nét chữ nghiêng hiện đại, đều nét và tròn trịa',
    fontSizeClass: 'text-base sm:text-lg',
    lineHeightClass: 'leading-[34px]',
    letterSpacing: 'tracking-normal'
  },
  { 
    id: 'charm', 
    name: 'Thư pháp uyển chuyển (Charm)', 
    category: 'handwriting',
    fontClass: "font-['Charm',cursive]", 
    cssFamily: "'Charm', cursive",
    sample: 'Có một khoảng lặng để thấy lòng bình an...',
    desc: 'Nét chữ viết tay tròn trịa, dịu dàng chuẩn nét Việt',
    fontSizeClass: 'text-xl sm:text-2xl',
    lineHeightClass: 'leading-[40px]',
    letterSpacing: 'tracking-wide'
  }
];

export const WAX_SEALS = [
  { id: 'terracotta', name: 'Sáp Đỏ Đất', color: '#B2533E', border: '#8E3E2E', motif: '🌿' },
  { id: 'brass', name: 'Sáp Vàng Đồng', color: '#C08A3E', border: '#9E6E2A', motif: '✨' },
  { id: 'forest', name: 'Sáp Xanh Rêu', color: '#3F614D', border: '#2D4737', motif: '🍃' },
  { id: 'indigo', name: 'Sáp Chàm Đêm', color: '#3A4D6B', border: '#2B3950', motif: '🌙' },
  { id: 'vintage_plum', name: 'Sáp Mận Cổ', color: '#743B52', border: '#582B3E', motif: '🕊️' }
];

const DRAWING_BRUSH_COLORS = [
  { hex: '#3B2A1E', name: 'Sepia' },
  { hex: '#8C5A4B', name: 'Nâu đất' },
  { hex: '#3F614D', name: 'Rêu trầm' },
  { hex: '#C08A3E', name: 'Vàng nến' },
  { hex: '#743B52', name: 'Hồng khô' },
  { hex: '#FFFFFF', name: 'Phấn trắng' }
];

export const SelfLettersView: React.FC = () => {
  const { user, token } = useAuth();
  const [letters, setLetters] = useState<SelfLetterSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<'all' | 'locked' | 'unlocked'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. CLEAN SLATE: Creation State starts 100% empty
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [senderName, setSenderName] = useState('Tôi của hôm nay');
  const [receiverName, setReceiverName] = useState('Tôi của ngày mai');
  const [paperStyle, setPaperStyle] = useState<PaperStyle>('parchment');
  const [customBgColor, setCustomBgColor] = useState<string | null>(null);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [inkColor, setInkColor] = useState('#3B2A1E');
  // Default to handwriting cursive font as requested
  const [fontFamily, setFontFamily] = useState<LetterFont>('cursive');
  const [waxSeal, setWaxSeal] = useState('terracotta');
  const [openDate, setOpenDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Sticker Drawer & Free Draggable Sticker System State
  const [isStickerDrawerOpen, setIsStickerDrawerOpen] = useState(false);
  const [placedStickers, setPlacedStickers] = useState<PlacedSticker[]>([]);
  const [activeStickerCatId, setActiveStickerCatId] = useState<string>('postage');
  const [stickerApplyMode, setStickerApplyMode] = useState<'both' | 'text' | 'paper'>('both');
  const [lastStickerToast, setLastStickerToast] = useState<string | null>(null);
  const [paperStickers, setPaperStickers] = useState<{ id: string; char: string; name: string; x: number; y: number; rotate: number }[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Drawing Canvas State
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [brushColor, setBrushColor] = useState('#3B2A1E');
  const [brushSize, setBrushSize] = useState(2);
  const [isEraser, setIsEraser] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hasDrawingStrokes, setHasDrawingStrokes] = useState(false);
  const [drawingHistory, setDrawingHistory] = useState<string[]>([]);
  const isPaintingRef = useRef(false);

  // Reader Modal State
  const [selectedLetterId, setSelectedLetterId] = useState<string | null>(null);
  const [viewingLetter, setViewingLetter] = useState<SelfLetterRecord | null>(null);
  const [readingLoading, setReadingLoading] = useState(false);
  const [unfoldingStep, setUnfoldingStep] = useState<'closed' | 'flap_opening' | 'paper_sliding' | 'open'>('closed');

  // Deletion State
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Locked Notice Modal
  const [lockedNotice, setLockedNotice] = useState<{
    visible: boolean;
    title: string;
    message: string;
    openDate: string;
    daysRemaining: number;
    waxSeal: string;
    paperStyle: PaperStyle;
  } | null>(null);

  // Fetch summaries
  const fetchSummaries = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/letters/summaries');
      const data = await res.json();
      if (data.success && Array.isArray(data.summaries)) {
        setLetters(data.summaries);
      }
    } catch (err) {
      console.error('Error fetching letter summaries:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummaries();
  }, [fetchSummaries]);

  // Set sender name if user is logged in
  useEffect(() => {
    if (user?.nickname) {
      setSenderName(`${user.nickname} của hôm nay`);
      setReceiverName(`${user.nickname} của ngày mai`);
    }
  }, [user]);

  // ================= CANVAS DRAWING LOGIC =================
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  useEffect(() => {
    if (isCreating) {
      const timer = setTimeout(() => {
        initCanvas();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isCreating, initCanvas]);

  const saveCanvasState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL();
    setDrawingHistory(prev => [...prev.slice(-10), dataUrl]);
    setHasDrawingStrokes(true);
  };

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  const handleStartDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingMode) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    isPaintingRef.current = true;
    const { x, y } = getCanvasCoordinates(e);

    ctx.beginPath();
    ctx.moveTo(x, y);

    if (isEraser) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = brushSize * 4;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = brushSize;
    }
  };

  const handleMoveDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isPaintingRef.current || !isDrawingMode) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCanvasCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handleEndDraw = () => {
    if (!isPaintingRef.current) return;
    isPaintingRef.current = false;
    saveCanvasState();
  };

  const handleUndo = () => {
    const canvas = canvasRef.current;
    if (!canvas || drawingHistory.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newHistory = [...drawingHistory];
    newHistory.pop();
    setDrawingHistory(newHistory);

    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

    if (newHistory.length > 0) {
      const prevImg = new Image();
      prevImg.src = newHistory[newHistory.length - 1];
      prevImg.onload = () => {
        ctx.drawImage(prevImg, 0, 0, canvas.width / dpr, canvas.height / dpr);
      };
    } else {
      setHasDrawingStrokes(false);
    }
  };

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    setDrawingHistory([]);
    setHasDrawingStrokes(false);
  };

  // Quick preset doodle stamps
  const addQuickDoodle = (symbol: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    ctx.globalCompositeOperation = 'source-over';
    ctx.font = '28px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const rx = (canvas.width / dpr) - 60 - Math.random() * 40;
    const ry = (canvas.height / dpr) - 70 - Math.random() * 40;
    ctx.fillText(symbol, rx, ry);
    saveCanvasState();
  };

  // ================= STAMP & STICKER ACTIONS =================
  const handleAddGraphicSticker = (stkDef: StickerDefinition) => {
    const id = `stk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const count = placedStickers.length;
    // Calculate initial natural placement on paper
    const x = Math.max(16, Math.min(84, 72 - (count % 3) * 16 + (Math.random() * 8 - 4)));
    const y = Math.max(12, Math.min(82, 14 + Math.floor(count / 3) * 15 + (Math.random() * 8 - 4)));
    const rotate = Math.round((Math.random() * 20 - 10) * 10) / 10;
    const scale = stkDef.defaultScale || 1.0;
    const maxZ = placedStickers.length > 0 ? Math.max(...placedStickers.map(s => s.zIndex || 1)) : 1;

    const newPlaced: PlacedSticker = {
      id,
      stickerId: stkDef.id,
      type: stkDef.type,
      name: stkDef.name,
      char: stkDef.char,
      x,
      y,
      rotate,
      scale,
      zIndex: maxZ + 1
    };

    setPlacedStickers(prev => [...prev, newPlaced]);

    // If text insertion is desired and char exists, also insert into text
    if ((stickerApplyMode === 'text' || stickerApplyMode === 'both') && stkDef.char) {
      const textarea = textareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart ?? content.length;
        const end = textarea.selectionEnd ?? content.length;
        const before = content.substring(0, start);
        const after = content.substring(end);
        const needsPreSpace = before.length > 0 && !before.endsWith(' ') && !before.endsWith('\n');
        const inserted = `${needsPreSpace ? ' ' : ''}${stkDef.char} `;
        const nextContent = before + inserted + after;
        setContent(nextContent);
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start + inserted.length, start + inserted.length);
        }, 10);
      } else {
        setContent(prev => (prev ? `${prev} ${stkDef.char} ` : `${stkDef.char} `));
      }
    }

    setLastStickerToast(`Đã đính "${stkDef.name}" lên thư! Kéo thả tự do để đổi vị trí.`);
    setTimeout(() => setLastStickerToast(null), 2500);
  };

  const handleApplySticker = (sticker: VintageSticker) => {
    // 1. Insert into textarea at current cursor position (or append if none)
    if (stickerApplyMode === 'text' || stickerApplyMode === 'both') {
      const textarea = textareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart ?? content.length;
        const end = textarea.selectionEnd ?? content.length;
        const before = content.substring(0, start);
        const after = content.substring(end);
        const needsPreSpace = before.length > 0 && !before.endsWith(' ') && !before.endsWith('\n');
        const inserted = `${needsPreSpace ? ' ' : ''}${sticker.char} `;
        const nextContent = before + inserted + after;
        setContent(nextContent);
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start + inserted.length, start + inserted.length);
        }, 10);
      } else {
        setContent(prev => (prev ? `${prev} ${sticker.char} ` : `${sticker.char} `));
      }
    }

    // 2. Place sticker as draggable item on paper sheet
    if (stickerApplyMode === 'paper' || stickerApplyMode === 'both') {
      const matchingStk: StickerDefinition = STICKER_LIBRARY.find(s => s.char === sticker.char) || {
        id: `emoji-${sticker.name}`,
        name: sticker.name,
        type: 'emoji',
        char: sticker.char,
        category: 'emojis',
        desc: sticker.name,
        renderIcon: ({ className }: { className?: string }) => (
          <span className={className || 'text-2xl'}>{sticker.char}</span>
        )
      };
      handleAddGraphicSticker(matchingStk);
    }
  };

  const handleRemovePaperSticker = (id: string) => {
    setPaperStickers(prev => prev.filter(s => s.id !== id));
    setPlacedStickers(prev => prev.filter(s => s.id !== id));
  };

  // Start fresh draft
  const handleStartCleanLetter = () => {
    setTitle('');
    setContent('');
    setFormError(null);
    handleClearCanvas();
    setPaperStickers([]);
    setPlacedStickers([]);
    setLastStickerToast(null);
    setIsCreating(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Clear current draft
  const handleClearDraft = () => {
    setTitle('');
    setContent('');
    handleClearCanvas();
    setPaperStickers([]);
    setPlacedStickers([]);
    setLastStickerToast(null);
    setFormError(null);
  };

  // ================= SUBMIT NEW LETTER =================
  const handleCreateLetter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('Xin hãy đặt một tiêu đề cho bức thư nhé (ví dụ: Mở ra khi cậu thấy cô đơn, Mở ra vào ngày sinh nhật...).');
      return;
    }
    if (!content.trim()) {
      setFormError('Đừng để trang giấy trống rỗng nhé, hãy tự do viết nên những dòng tâm sự chân thật của chính mình.');
      return;
    }

    setSubmitting(true);
    setFormError(null);

    try {
      let drawingDataUrl: string | null = null;
      if (hasDrawingStrokes && canvasRef.current) {
        drawingDataUrl = canvasRef.current.toDataURL();
      }

      const res = await fetch('/api/letters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: token } : {})
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          sender_name: senderName.trim() || 'Tôi của hôm nay',
          receiver_name: receiverName.trim() || 'Tôi của ngày mai',
          paper_style: paperStyle,
          ink_color: inkColor,
          font_family: fontFamily,
          drawing_data: drawingDataUrl,
          open_date: openDate,
          wax_seal: waxSeal,
          stickers_data: placedStickers.length > 0 ? JSON.stringify(placedStickers) : undefined,
          theme_color: customBgColor || undefined
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Không thể niêm phong bức thư lúc này.');
      }

      // Reset clean slate
      setTitle('');
      setContent('');
      handleClearCanvas();
      setPlacedStickers([]);
      setPaperStickers([]);
      setIsCreating(false);
      await fetchSummaries();
    } catch (err: unknown) {
      const errorObj = err as Error;
      setFormError(errorObj.message || 'Đã có lỗi xảy ra khi niêm phong bức thư.');
    } finally {
      setSubmitting(false);
    }
  };

  // ================= DELETE LETTER =================
  const handleDeleteLetter = async (id: string) => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/letters/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: token } : {})
        }
      });
      const data = await res.json();
      if (data.success) {
        setDeleteConfirmId(null);
        if (selectedLetterId === id) {
          handleCloseReader();
        }
        await fetchSummaries();
      }
    } catch (err) {
      console.error('Error deleting letter:', err);
    } finally {
      setDeleting(false);
    }
  };

  // ================= OPEN / READ LETTER =================
  const handleClickEnvelope = async (letterSummary: SelfLetterSummary) => {
    // If locked, show tranquil locked message
    if (letterSummary.is_locked) {
      setLockedNotice({
        visible: true,
        title: letterSummary.title,
        message: letterSummary.lock_message || `Bức thư này được hẹn ngày ${formatDateDisplay(letterSummary.open_date)} mới mở. Hãy kiên nhẫn chờ đợi nhé...`,
        openDate: letterSummary.open_date,
        daysRemaining: letterSummary.days_remaining || 1,
        waxSeal: letterSummary.wax_seal || 'terracotta',
        paperStyle: letterSummary.paper_style || 'parchment'
      });
      return;
    }

    // Unlocked or reached open date: initiate slow unfold animation
    setSelectedLetterId(letterSummary.id);
    setReadingLoading(true);
    setUnfoldingStep('closed');

    try {
      const res = await fetch(`/api/letters/${letterSummary.id}`);
      const data = await res.json();

      if (data.locked) {
        setLockedNotice({
          visible: true,
          title: letterSummary.title,
          message: data.lock_message || `Bức thư này được hẹn ngày ${formatDateDisplay(data.open_date || letterSummary.open_date)} mới mở. Hãy kiên nhẫn chờ đợi nhé...`,
          openDate: data.open_date || letterSummary.open_date,
          daysRemaining: data.days_remaining || 1,
          waxSeal: letterSummary.wax_seal || 'terracotta',
          paperStyle: letterSummary.paper_style || 'parchment'
        });
        setSelectedLetterId(null);
        return;
      }

      if (data.success && data.letter) {
        setViewingLetter(data.letter);

        // Sequence of slow gentle unfolding
        setUnfoldingStep('flap_opening');
        setTimeout(() => {
          setUnfoldingStep('paper_sliding');
        }, 500);
        setTimeout(() => {
          setUnfoldingStep('open');
        }, 1100);

        fetchSummaries();
      }
    } catch (err) {
      console.error('Error opening letter:', err);
    } finally {
      setReadingLoading(false);
    }
  };

  const handleCloseReader = () => {
    setUnfoldingStep('closed');
    setTimeout(() => {
      setViewingLetter(null);
      setSelectedLetterId(null);
    }, 250);
  };

  // Helper date formatter
  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
      const d = new Date(dateStr);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return dateStr;
    }
  };

  // Filter letters
  const filteredLetters = letters.filter(ltr => {
    if (filterTab === 'locked' && !ltr.is_locked) return false;
    if (filterTab === 'unlocked' && ltr.is_locked) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return ltr.title.toLowerCase().includes(q) || (ltr.sender_name && ltr.sender_name.toLowerCase().includes(q));
    }
    return true;
  });

  const activePaperConfig = getPaperThemeConfig(paperStyle, customBgColor);
  const activeFontConfig = FONT_OPTIONS.find(f => f.id === fontFamily) || FONT_OPTIONS[0];
  const activeSealConfig = WAX_SEALS.find(s => s.id === waxSeal) || WAX_SEALS[0];

  const viewingStickers: PlacedSticker[] = useMemo(() => {
    if (!viewingLetter?.stickers_data) return [];
    try {
      const parsed = JSON.parse(viewingLetter.stickers_data);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [viewingLetter?.stickers_data]);

  const viewingPaperConfig = useMemo(() => {
    if (!viewingLetter) return PAPER_THEMES.parchment;
    return getPaperThemeConfig(viewingLetter.paper_style, viewingLetter.theme_color);
  }, [viewingLetter?.paper_style, viewingLetter?.theme_color]);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#3B2A1E] font-['Be_Vietnam_Pro',sans-serif] selection:bg-[#E8DACB] selection:text-[#3B2A1E] pb-24">
      {/* Header Bar - Vintage Warm Minimalist */}
      <header className="border-b border-[#E8DFC8]/70 bg-[#FAF7F2]/90 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EDE4D8] border border-[#D9CBB9] flex items-center justify-center shadow-xs">
              <ScrollText className="w-5 h-5 text-[#8C5A4B]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#2A1F18] tracking-tight">
                  Bức thư cho bản thân
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#EDE4D8] text-[#6B4E3D] border border-[#DFCFC0]">
                  Gửi tương lai
                </span>
              </div>
              <p className="text-xs text-[#7A6455] mt-0.5">
                Điềm đạm lắng đọng • Nét chữ viết tay hoài niệm • Hẹn ngày hội ngộ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {!isCreating ? (
              <button
                id="btn-open-create-letter"
                onClick={handleStartCleanLetter}
                className="px-4 py-2.5 rounded-xl bg-[#3B2A1E] hover:bg-[#2A1F18] text-[#FAF8F5] text-sm font-medium shadow-sm hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Feather className="w-4 h-4 text-[#DFC8B4]" />
                <span>Viết thư gửi chính mình</span>
              </button>
            ) : (
              <button
                id="btn-back-to-mailbox"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 rounded-xl bg-[#EFE9DF] hover:bg-[#E5DDCF] text-[#4A3B32] text-sm font-medium border border-[#DCD2C4] transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                <span>Về hộp thư tĩnh lặng</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8">
        {/* ========================================================================= */}
        {/* VIEW 1: VIẾT VÀ TRANG TRÍ THƯ (CREATION & HANDCRAFTED STATIONERY DESK) */}
        {/* ========================================================================= */}
        {isCreating ? (
          <div className="space-y-8 animate-fadeIn">
            {/* Top Calm Guidance */}
            <div className="text-center max-w-2xl mx-auto space-y-2 pt-2">
              <span className="text-xs uppercase tracking-widest font-serif text-[#8C7365] flex items-center justify-center gap-1.5">
                <Feather className="w-3.5 h-3.5 text-[#8C5A4B]" />
                Trang giấy thủ công • Tự do chắp bút
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2A1F18]">
                Gửi gắm chút bình yên đến những ngày sắp tới
              </h2>
              <p className="text-sm text-[#7A6455] leading-relaxed">
                Trang giấy đang hoàn toàn để trống để bạn tự do viết nên những dòng tâm sự chân thật nhất.
                Hãy hẹn một ngày trên lịch để con dấu sáp tan ra.
              </p>
            </div>

            {/* Customization Toolbar Dock (Palette, Paper, Font, Date) */}
            <div className="bg-[#FAF8F5] rounded-2xl border border-[#E8DFC8] p-4 sm:p-5 shadow-xs space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-[#EFE7DA]">
                {/* 1. Paper Style Selector - Vintage Color Palette */}
                <div className="space-y-2 pt-1 md:pt-0">
                  <label className="text-xs font-serif font-bold text-[#5A4537] flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-[#8C5A4B]" />
                    <span>Màu giấy thư</span>
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {(Object.keys(PAPER_THEMES) as PaperStyle[]).map(ps => {
                      const pConfig = PAPER_THEMES[ps];
                      const isSelected = paperStyle === ps;
                      return (
                        <button
                          key={ps}
                          type="button"
                          title={`${pConfig.name} (${pConfig.sheetBg})`}
                          onClick={() => setPaperStyle(ps)}
                          style={{ backgroundColor: pConfig.sheetBg }}
                          className={`w-7 h-7 mx-auto rounded-full border transition-all duration-300 transform hover:scale-115 active:scale-95 flex items-center justify-center cursor-pointer shadow-2xs ${
                            isSelected 
                              ? 'ring-2 ring-offset-2 ring-[#3B2A1E] scale-110 border-[#3B2A1E]' 
                              : 'border-[#D9CBB9] hover:border-[#8C7365]'
                          }`}
                        >
                          {isSelected && <Check className={`w-3.5 h-3.5 ${ps === 'indigo' ? 'text-white' : 'text-[#3B2A1E]'}`} />}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[11px] text-[#8C7365] truncate font-serif text-center">{activePaperConfig.name}</p>
                </div>

                {/* 2. Ink Color Selector */}
                <div className="space-y-2 pt-3 md:pt-0 md:pl-4">
                  <label className="text-xs font-serif font-bold text-[#5A4537] flex items-center gap-1.5">
                    <Brush className="w-3.5 h-3.5 text-[#8C5A4B]" />
                    <span>Màu mực chữ</span>
                  </label>
                  <div className="flex items-center gap-2">
                    {INK_COLORS.map(ink => {
                      const isSelected = inkColor === ink.hex;
                      return (
                        <button
                          key={ink.id}
                          type="button"
                          title={ink.name}
                          onClick={() => setInkColor(ink.hex)}
                          style={{ backgroundColor: ink.hex }}
                          className={`w-7 h-7 rounded-full border transition-all flex items-center justify-center cursor-pointer ${
                            isSelected ? 'ring-2 ring-offset-2 ring-[#3B2A1E] scale-110' : 'opacity-80 hover:opacity-100'
                          } border-white/40 shadow-xs`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[11px] text-[#8C7365] font-serif">
                    {INK_COLORS.find(i => i.hex === inkColor)?.name || 'Mực nâu'}
                  </p>
                </div>

                {/* 3. Typography Selector - Handwriting & Vintage Serif */}
                <div className="space-y-2 pt-3 md:pt-0 md:pl-4">
                  <label className="text-xs font-serif font-bold text-[#5A4537] flex items-center gap-1.5">
                    <Type className="w-3.5 h-3.5 text-[#8C5A4B]" />
                    <span>Kiểu chữ viết tay & Serif</span>
                  </label>
                  
                  {/* Select dropdown with preview */}
                  <select
                    id="select-letter-font"
                    value={fontFamily}
                    onChange={e => setFontFamily(e.target.value as LetterFont)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-[#F0EAE1] border border-[#DDD3C4] text-[#2A1F18] font-medium outline-none focus:border-[#8C5A4B] cursor-pointer"
                  >
                    <optgroup label="✍️ Chữ viết tay & Thư từ hoài niệm (Vietnamese Safe)">
                      <option value="cursive">Lora Nghiêng (Thư tay lãng mạn, mềm mại)</option>
                      <option value="handwriting">Playfair Nghiêng (Nét bút thi ca, kiêu sa)</option>
                      <option value="patrick">Be Vietnam Pro Nghiêng (Mộc mạc, gần gũi)</option>
                      <option value="charm">Charm (Thư pháp uyển chuyển)</option>
                    </optgroup>
                    <optgroup label="📖 Chữ cổ điển văn học (Serif)">
                      <option value="serif">Lora Serif (Trang sách văn học cổ điển)</option>
                      <option value="playfair">Playfair Display (Hoài cổ đài các)</option>
                    </optgroup>
                    <optgroup label="🌿 Khác">
                      <option value="sans">Be Vietnam Pro (Tối giản chuẩn tiếng Việt)</option>
                    </optgroup>
                  </select>

                  <p className="text-[11px] text-[#8C7365] truncate font-serif">
                    {activeFontConfig.desc}
                  </p>
                </div>

                {/* 4. Wax Seal Stamp Selector */}
                <div className="space-y-2 pt-3 md:pt-0 md:pl-4">
                  <label className="text-xs font-serif font-bold text-[#5A4537] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#8C5A4B]" />
                    <span>Dấu sáp niêm phong</span>
                  </label>
                  <div className="flex items-center gap-1.5">
                    {WAX_SEALS.map(seal => {
                      const isSelected = waxSeal === seal.id;
                      return (
                        <button
                          key={seal.id}
                          type="button"
                          title={seal.name}
                          onClick={() => setWaxSeal(seal.id)}
                          style={{ backgroundColor: seal.color, borderColor: seal.border }}
                          className={`w-7 h-7 rounded-full border text-xs flex items-center justify-center transition-all cursor-pointer shadow-xs ${
                            isSelected ? 'ring-2 ring-offset-2 ring-[#3B2A1E] scale-110' : 'opacity-85 hover:opacity-100'
                          }`}
                        >
                          <span>{seal.motif}</span>
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[11px] text-[#8C7365] truncate font-serif">{activeSealConfig.name}</p>
                </div>
              </div>

              {/* Font Quick Switcher Pills for Instant Comparison */}
              <div className="pt-2 border-t border-[#EFE7DA] flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-serif font-medium text-[#7A6455] mr-1">
                  Đổi nhanh phông chữ:
                </span>
                {FONT_OPTIONS.map(f => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFontFamily(f.id)}
                    className={`px-3 py-1 rounded-full text-xs transition-all cursor-pointer border ${
                      fontFamily === f.id
                        ? 'bg-[#3B2A1E] text-white border-[#3B2A1E] font-bold shadow-xs scale-105'
                        : 'bg-white/80 text-[#5A4537] border-[#D9CBB9] hover:bg-white'
                    } ${f.fontClass}`}
                  >
                    {f.name.split(' (')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* BẢNG CHỌN MÀU GIẤY THƯ & KHO STICKER TRANG TRÍ (LETTER BACKGROUND COLOR PICKER & STICKER DRAWER TOOLBAR) */}
            <div className="bg-[#FAF7F2] rounded-2xl border border-[#E8DEC8] p-3.5 sm:p-4 shadow-xs space-y-3 transition-all">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                {/* 1. Letter Background Color Selector & Quick Swatches */}
                <div className="flex items-center flex-wrap gap-2.5">
                  <div className="flex items-center gap-2 pr-2 border-r border-[#E2D5C3]">
                    <div className="w-6 h-6 rounded-full bg-[#8C5A4B]/10 flex items-center justify-center text-[#8C5A4B]">
                      <Palette className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-serif font-bold text-[#3B2A1E] whitespace-nowrap">
                      Màu giấy:
                    </span>
                  </div>

                  {/* Quick Color Swatches */}
                  <div className="flex items-center flex-wrap gap-1.5">
                    {(['kraft', 'rose', 'sky', 'lavender', 'matcha', 'warm_ivory', 'parchment', 'butter'] as PaperStyle[]).map(ps => {
                      const pConfig = PAPER_THEMES[ps] || PAPER_THEMES.parchment;
                      const isSelected = paperStyle === ps;
                      return (
                        <button
                          key={ps}
                          type="button"
                          id={`quick-color-${ps}`}
                          title={`${pConfig.name} (${pConfig.sheetBg})`}
                          onClick={() => {
                            setPaperStyle(ps);
                            setCustomBgColor(null);
                          }}
                          style={{ backgroundColor: pConfig.sheetBg }}
                          className={`group relative w-7 h-7 rounded-full border transition-all duration-300 transform hover:scale-115 active:scale-95 flex items-center justify-center cursor-pointer shadow-2xs ${
                            isSelected 
                              ? 'ring-2 ring-offset-2 ring-[#3B2A1E] scale-110 border-[#3B2A1E] z-10' 
                              : 'border-[#D9CBB9] hover:border-[#8C7365]'
                          }`}
                        >
                          {isSelected && (
                            <Check className="w-3.5 h-3.5 text-[#3B2A1E]" />
                          )}
                          <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-[#2A1F18] text-[#F7F2E8] text-[10px] px-2 py-0.5 rounded-md whitespace-nowrap z-30 shadow-md font-sans">
                            {pConfig.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Button to toggle advanced color picker */}
                  <button
                    type="button"
                    id="btn-toggle-color-picker"
                    onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-serif font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer border ${
                      isColorPickerOpen
                        ? 'bg-[#3B2A1E] text-white border-[#3B2A1E] shadow-xs'
                        : 'bg-white hover:bg-[#FAF5EE] text-[#5A4537] border-[#D9CBB9]'
                    }`}
                  >
                    <Palette className="w-3.5 h-3.5 text-[#8C5A4B]" />
                    <span>Bảng màu mở rộng</span>
                    <span className="text-[10px] opacity-70">
                      {isColorPickerOpen ? '▲ Đóng' : '▼ Mở'}
                    </span>
                  </button>

                  <span className="text-xs text-[#8C7365] font-serif italic hidden xl:inline">
                    {activePaperConfig.name}
                  </span>
                </div>

                {/* 2. Nút Bấm "Dán sticker kéo thả" */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    id="btn-toggle-sticker-drawer"
                    onClick={() => setIsStickerDrawerOpen(true)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-serif font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-xs border ${
                      isStickerDrawerOpen
                        ? 'bg-[#8C5A4B] text-white border-[#8C5A4B] ring-2 ring-[#8C5A4B]/30'
                        : 'bg-[#FAF2E8] hover:bg-[#F2E5D5] text-[#5A4537] border-[#D9CBB9]'
                    }`}
                  >
                    <Smile className="w-4 h-4 text-amber-600" />
                    <span>Kho Sticker kéo thả</span>
                    <span className="px-1.5 py-0.2 text-[10px] rounded-full font-sans bg-[#8C5A4B] text-white">
                      {placedStickers.length > 0 ? placedStickers.length : 'Mới'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Advanced Background Color Picker (Expandable Section) */}
              {isColorPickerOpen && (
                <div className="pt-2 animate-fadeIn">
                  <PaperColorPicker
                    currentPaperStyle={paperStyle}
                    customBgColor={customBgColor}
                    onSelectPaperStyle={(style, hex) => {
                      setPaperStyle(style);
                      if (hex) setCustomBgColor(hex);
                    }}
                  />
                </div>
              )}

              {/* Toast Feedback Notification when sticker is applied */}
              {lastStickerToast && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-serif flex items-center justify-between animate-fadeIn">
                  <span className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    {lastStickerToast}
                  </span>
                  <span className="text-[10px] text-emerald-600 italic">Kéo thả để di chuyển &bull; Bấm để xoay/phóng to/xóa</span>
                </div>
              )}
            </div>

            {/* Writing Form & Realistic Handcrafted Stationery Sheet */}
            <form onSubmit={handleCreateLetter} className="space-y-6">
              {/* The Realistic Stationery Sheet Container with Smooth Color Transition */}
              <div 
                className={`relative rounded-3xl border-2 ${activePaperConfig.borderClass} ${activePaperConfig.bgClass} stationery-sheet shadow-lg overflow-hidden transition-colors duration-500 ease-in-out p-6 sm:p-12 md:p-16`}
                style={{
                  backgroundColor: activePaperConfig.sheetBg,
                  backgroundImage: `linear-gradient(to bottom, transparent 35px, ${activePaperConfig.ruledLineColor} 36px)`,
                  backgroundSize: '100% 36px'
                }}
              >
                {/* Decorative Vintage Paper Edge Flourishes */}
                <div className="absolute top-4 left-4 w-7 h-7 border-t-2 border-l-2 border-[#8C7365]/35 pointer-events-none rounded-tl-sm" />
                <div className="absolute top-4 right-4 w-7 h-7 border-t-2 border-r-2 border-[#8C7365]/35 pointer-events-none rounded-tr-sm" />
                <div className="absolute bottom-4 left-4 w-7 h-7 border-b-2 border-l-2 border-[#8C7365]/35 pointer-events-none rounded-bl-sm" />
                <div className="absolute bottom-4 right-4 w-7 h-7 border-b-2 border-r-2 border-[#8C7365]/35 pointer-events-none rounded-br-sm" />

                {/* Draggable and Rotatable Sticker Canvas Layer */}
                <DraggableStickerCanvas
                  stickers={placedStickers}
                  onUpdateStickers={setPlacedStickers}
                  isReadOnly={isDrawingMode}
                />

                {/* Hand-Drawing Overlay Canvas */}
                <canvas
                  ref={canvasRef}
                  onMouseDown={handleStartDraw}
                  onMouseMove={handleMoveDraw}
                  onMouseUp={handleEndDraw}
                  onMouseLeave={handleEndDraw}
                  onTouchStart={handleStartDraw}
                  onTouchMove={handleMoveDraw}
                  onTouchEnd={handleEndDraw}
                  className={`absolute inset-0 w-full h-full z-10 touch-none ${
                    isDrawingMode ? 'cursor-crosshair pointer-events-auto' : 'pointer-events-none'
                  }`}
                />

                {/* Draw Mode Tool floating on top of paper */}
                <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 mb-8 pb-4 border-b border-[#8C7365]/20">
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsDrawingMode(!isDrawingMode)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-serif font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                        isDrawingMode 
                          ? 'bg-[#8C5A4B] text-white ring-2 ring-[#8C5A4B]/40' 
                          : 'bg-white/80 hover:bg-white text-[#5A4537] border border-[#D9CBB9]'
                      }`}
                    >
                      <PenTool className="w-3.5 h-3.5" />
                      <span>{isDrawingMode ? '✓ Đang mở bút vẽ tay' : 'Vẽ tay / Trang trí lên giấy'}</span>
                    </button>

                    {/* Quick Dán Sticker Toggle inside paper header too */}
                    <button
                      type="button"
                      onClick={() => setIsStickerDrawerOpen(!isStickerDrawerOpen)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-serif font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs border ${
                        isStickerDrawerOpen 
                          ? 'bg-[#8C5A4B] text-white border-[#8C5A4B]' 
                          : 'bg-white/80 hover:bg-white text-[#5A4537] border-[#D9CBB9]'
                      }`}
                    >
                      <Smile className="w-3.5 h-3.5 text-amber-500" />
                      <span>Dán sticker mini</span>
                    </button>

                    {isDrawingMode && (
                      <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-xs p-1 rounded-xl border border-[#D9CBB9] text-xs shadow-xs">
                        {/* Brush Colors */}
                        <div className="flex items-center gap-1 px-1">
                          {DRAWING_BRUSH_COLORS.map(c => (
                            <button
                              key={c.hex}
                              type="button"
                              title={c.name}
                              onClick={() => {
                                setBrushColor(c.hex);
                                setIsEraser(false);
                              }}
                              style={{ backgroundColor: c.hex }}
                              className={`w-5 h-5 rounded-full border border-black/20 transition-all ${
                                !isEraser && brushColor === c.hex ? 'scale-125 ring-2 ring-[#8C5A4B]' : 'opacity-80'
                              }`}
                            />
                          ))}
                        </div>

                        <div className="h-4 w-px bg-slate-300 mx-1" />

                        {/* Brush Size */}
                        <button
                          type="button"
                          onClick={() => { setBrushSize(1.5); setIsEraser(false); }}
                          className={`px-2 py-0.5 rounded text-[11px] ${!isEraser && brushSize === 1.5 ? 'bg-[#8C5A4B] text-white font-bold' : 'text-[#5A4537]'}`}
                        >
                          Mảnh
                        </button>
                        <button
                          type="button"
                          onClick={() => { setBrushSize(3.5); setIsEraser(false); }}
                          className={`px-2 py-0.5 rounded text-[11px] ${!isEraser && brushSize === 3.5 ? 'bg-[#8C5A4B] text-white font-bold' : 'text-[#5A4537]'}`}
                        >
                          Vừa
                        </button>

                        <div className="h-4 w-px bg-slate-300 mx-1" />

                        {/* Eraser */}
                        <button
                          type="button"
                          title="Tẩy nét vẽ"
                          onClick={() => setIsEraser(!isEraser)}
                          className={`p-1 rounded ${isEraser ? 'bg-[#8C5A4B] text-white' : 'text-[#6B5749] hover:bg-slate-200'}`}
                        >
                          <Eraser className="w-3.5 h-3.5" />
                        </button>

                        {/* Undo */}
                        <button
                          type="button"
                          title="Hoàn tác"
                          onClick={handleUndo}
                          disabled={drawingHistory.length === 0}
                          className="p-1 rounded text-[#6B5749] hover:bg-slate-200 disabled:opacity-30"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>

                        {/* Clear */}
                        <button
                          type="button"
                          title="Xóa hết nét vẽ"
                          onClick={handleClearCanvas}
                          disabled={!hasDrawingStrokes}
                          className="p-1 rounded text-red-600 hover:bg-red-50 disabled:opacity-30"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Clear Draft / Reset */}
                  <div className="flex items-center gap-2">
                    {(title || content || hasDrawingStrokes || paperStickers.length > 0) && (
                      <button
                        type="button"
                        onClick={handleClearDraft}
                        className="px-2.5 py-1 text-xs text-[#8C5A4B] hover:text-[#5A352B] hover:underline flex items-center gap-1 cursor-pointer"
                        title="Xóa sạch để viết lại từ đầu"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Làm sạch trang giấy</span>
                      </button>
                    )}

                    {/* Quick Stamp Badges */}
                    <div className="flex items-center gap-1 text-xs text-[#8C7365]">
                      {['🌿', '✨', '☕', '🍂', '🤎'].map(sym => (
                        <button
                          key={sym}
                          type="button"
                          title={`Đóng dấu nhỏ ${sym}`}
                          onClick={() => addQuickDoodle(sym)}
                          className="px-1.5 py-0.5 rounded bg-white/70 hover:bg-white border border-[#D9CBB9] text-xs cursor-pointer shadow-2xs"
                        >
                          {sym}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Letter Header Fields (Sender / Date) */}
                <div className="relative z-0 space-y-4 mb-8">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#7A6455] font-serif border-b border-[#8C7365]/15 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#5A4537]">Người gửi:</span>
                      <input
                        type="text"
                        value={senderName}
                        onChange={e => setSenderName(e.target.value)}
                        placeholder="Tôi của hôm nay..."
                        className="bg-transparent border-b border-[#8C7365]/40 focus:border-[#3B2A1E] outline-none px-1 text-[#2A1F18] font-medium"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#5A4537]">Người nhận:</span>
                      <input
                        type="text"
                        value={receiverName}
                        onChange={e => setReceiverName(e.target.value)}
                        placeholder="Tôi của ngày mai..."
                        className="bg-transparent border-b border-[#8C7365]/40 focus:border-[#3B2A1E] outline-none px-1 text-[#2A1F18] font-medium"
                      />
                    </div>
                  </div>

                  {/* Clean Slate: Title Field */}
                  <div className="pt-2">
                    <label htmlFor="letter-title-input" className="block text-[11px] font-serif uppercase tracking-widest text-[#8C7365] mb-1">
                      Tiêu đề bức thư
                    </label>
                    <input
                      id="letter-title-input"
                      type="text"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      placeholder="Nhập tiêu đề thư (ví dụ: Mở ra khi cậu thấy cô đơn, Mở ra vào ngày sinh nhật, Mở ra khi cần động lực...)"
                      className={`w-full bg-transparent text-xl sm:text-2xl font-bold placeholder-[#8C7365]/40 border-b border-[#8C7365]/25 focus:border-[#8C5A4B] outline-none pb-2 transition-colors ${activeFontConfig.fontClass}`}
                      style={{ color: inkColor }}
                    />
                  </div>
                </div>

                {/* Clean Slate: Content Textarea with Handwriting Font & Stationery Line Grid */}
                <div className="relative z-0 min-h-[380px] mb-8">
                  <label htmlFor="letter-content-textarea" className="block text-[11px] font-serif uppercase tracking-widest text-[#8C7365] mb-2">
                    Những dòng tâm sự gửi chính mình
                  </label>
                  <textarea
                    ref={textareaRef}
                    id="letter-content-textarea"
                    rows={12}
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    placeholder="Tự do viết nên những dòng tâm sự chân thật của chính mình..."
                    className={`w-full bg-transparent border-none outline-none resize-y ${activeFontConfig.fontSizeClass} ${activeFontConfig.lineHeightClass} ${activeFontConfig.letterSpacing || ''} placeholder-[#8C7365]/35 transition-colors ${activeFontConfig.fontClass}`}
                    style={{ 
                      color: inkColor,
                      lineHeight: '36px'
                    }}
                  />
                </div>

                {/* Letter Signature Footnote */}
                <div className="relative z-0 pt-6 border-t border-[#8C7365]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="text-xs text-[#8C7365] font-serif italic flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Viết vào ngày {formatDateDisplay(new Date().toISOString().split('T')[0])}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div 
                      className="w-8 h-8 rounded-full border shadow-xs flex items-center justify-center text-sm"
                      style={{ backgroundColor: activeSealConfig.color, borderColor: activeSealConfig.border }}
                    >
                      <span>{activeSealConfig.motif}</span>
                    </div>
                    <span className="text-xs font-serif text-[#5A4537] font-semibold">
                      Niêm phong bởi {activeSealConfig.name}
                    </span>
                  </div>
                </div>
              </div>

              {/* Date Picker Component (Chọn ngày mở trang nhã, lịch sự) */}
              <div className="bg-[#FAF8F5] rounded-2xl border border-[#E8DFC8] p-5 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-[#2A1F18] font-serif font-bold text-base">
                      <CalendarDays className="w-4 h-4 text-[#8C5A4B]" />
                      <span>Chọn ngày mở phong bì (Hẹn ngày tương lai)</span>
                    </div>
                    <p className="text-xs text-[#7A6455] mt-0.5">
                      Bạn hoàn toàn tự chủ chọn thời điểm mở thư. Bức thư sẽ được niêm phong cho tới đúng ngày hẹn.
                    </p>
                  </div>

                  {/* Quick Presets */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {[
                      { days: 7, label: '1 tuần sau' },
                      { days: 30, label: '1 tháng sau' },
                      { days: 90, label: '3 tháng sau' },
                      { days: 180, label: 'Nửa năm sau' },
                      { days: 365, label: '1 năm sau' }
                    ].map(preset => (
                      <button
                        key={preset.days}
                        type="button"
                        onClick={() => {
                          const d = new Date();
                          d.setDate(d.getDate() + preset.days);
                          setOpenDate(d.toISOString().split('T')[0]);
                        }}
                        className="px-2.5 py-1 text-xs rounded-lg bg-[#EFE9DF] hover:bg-[#E5DDCF] text-[#5A4537] border border-[#DCD2C4] transition-all cursor-pointer font-serif"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#F5EFEB] p-4 rounded-xl border border-[#E0D4C5]">
                  <div className="w-full sm:w-auto flex-1 flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-[#8C5A4B] shrink-0" />
                    <div className="flex-1">
                      <span className="block text-xs font-semibold text-[#6B5749] mb-1 font-serif">
                        Ngày ấn định mở thư trên lịch:
                      </span>
                      <input
                        id="letter-opendate-picker"
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={openDate}
                        onChange={e => setOpenDate(e.target.value)}
                        className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-white border border-[#D5C7B7] text-[#2A1F18] font-serif font-semibold text-sm outline-none focus:border-[#8C5A4B] shadow-2xs cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="w-full sm:w-auto text-xs text-[#7A6455] bg-white/80 p-3 rounded-lg border border-[#E3D8CB] flex items-center gap-2 font-serif">
                    <Lock className="w-4 h-4 text-[#8C5A4B] shrink-0" />
                    <span>
                      Sẽ mở vào ngày: <strong className="text-[#3B2A1E] font-bold">{formatDateDisplay(openDate)}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Error Message if any */}
              {formError && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
                  <Info className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Submit Action */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div className="text-xs text-[#8C7365] flex items-center gap-1.5 font-serif">
                  <Sparkles className="w-3.5 h-3.5 text-[#C08A3E]" />
                  <span>Nội dung, phông chữ viết tay và nét vẽ sẽ được lưu giữ nguyên vẹn trên trang giấy.</span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-[#EFE9DF] hover:bg-[#E5DDCF] text-[#5A4537] text-sm font-medium border border-[#DCD2C4] transition-all cursor-pointer"
                  >
                    Hủy bỏ
                  </button>

                  <button
                    id="btn-submit-seal-letter"
                    type="submit"
                    disabled={submitting}
                    className="flex-1 sm:flex-none px-7 py-3 rounded-xl bg-[#3B2A1E] hover:bg-[#251A13] text-[#FAF8F5] text-sm font-serif font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? (
                      <span>Đang đóng dấu sáp...</span>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 text-[#DFC8B4]" />
                        <span>Niêm phong & Cất giữ bức thư</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        ) : (
          /* ========================================================================= */
          /* VIEW 2: HỘP THƯ TĨNH LẶNG (QUIET MAILBOX - LIST OF ENVELOPES) */
          /* ========================================================================= */
          <div className="space-y-8 animate-fadeIn">
            {/* Intro Banner - Vintage Shelf Atmosphere */}
            <div className="bg-gradient-to-r from-[#F5EFEB] via-[#FAF8F5] to-[#F2ECE4] rounded-3xl border border-[#E5DACB] p-6 sm:p-8 shadow-xs relative overflow-hidden">
              <div className="max-w-2xl space-y-3 relative z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDE4D8] border border-[#DFCFC0] text-xs font-serif font-bold text-[#6B4E3D]">
                  <ScrollText className="w-3.5 h-3.5 text-[#8C5A4B]" />
                  <span>Hộp thư thời gian • Lắng đọng tâm tư</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2A1F18] tracking-tight">
                  Những phong bì thư tĩnh lặng
                </h2>
                <p className="text-sm text-[#7A6455] leading-relaxed">
                  Mỗi phong bì dưới đây là một lời nhắn nhủ, một cái ôm dịu dàng được gửi gắm từ quá khứ đến tương lai. 
                  Hãy kiên nhẫn đợi đúng ngày để con dấu sáp tan ra nhé.
                </p>
              </div>

              {/* Decorative Subtle Stamp */}
              <div className="absolute -right-6 -bottom-6 w-36 h-36 rounded-full border-2 border-dashed border-[#8C7365]/15 flex items-center justify-center pointer-events-none opacity-40">
                <span className="text-xs uppercase tracking-widest font-serif text-[#8C7365]">TIME CAPSULE</span>
              </div>
            </div>

            {/* Filter & Search Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#E8DFC8] pb-4">
              <div className="flex items-center gap-1 bg-[#EFE9DF] p-1 rounded-xl border border-[#E0D5C6] w-full sm:w-auto">
                <button
                  id="tab-all-letters"
                  onClick={() => setFilterTab('all')}
                  className={`px-4 py-1.5 text-xs font-serif rounded-lg transition-all cursor-pointer flex-1 sm:flex-none text-center ${
                    filterTab === 'all'
                      ? 'bg-white text-[#2A1F18] font-bold shadow-2xs'
                      : 'text-[#6B5749] hover:text-[#2A1F18]'
                  }`}
                >
                  Tất cả phong bì ({letters.length})
                </button>
                <button
                  id="tab-locked-letters"
                  onClick={() => setFilterTab('locked')}
                  className={`px-4 py-1.5 text-xs font-serif rounded-lg transition-all cursor-pointer flex-1 sm:flex-none text-center ${
                    filterTab === 'locked'
                      ? 'bg-white text-[#2A1F18] font-bold shadow-2xs'
                      : 'text-[#6B5749] hover:text-[#2A1F18]'
                  }`}
                >
                  Đang niêm phong 🔒 ({letters.filter(l => l.is_locked).length})
                </button>
                <button
                  id="tab-unlocked-letters"
                  onClick={() => setFilterTab('unlocked')}
                  className={`px-4 py-1.5 text-xs font-serif rounded-lg transition-all cursor-pointer flex-1 sm:flex-none text-center ${
                    filterTab === 'unlocked'
                      ? 'bg-white text-[#2A1F18] font-bold shadow-2xs'
                      : 'text-[#6B5749] hover:text-[#2A1F18]'
                  }`}
                >
                  Đã đến ngày mở 📜 ({letters.filter(l => !l.is_locked).length})
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-[#8C7365] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm phong bì..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-[#DDD3C5] text-xs text-[#2A1F18] placeholder-[#8C7365]/60 outline-none focus:border-[#8C5A4B] shadow-2xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* List / Grid of Envelopes */}
            {loading ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-10 h-10 border-2 border-[#8C5A4B] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm font-serif text-[#7A6455]">Đang sắp xếp các phong bì thư...</p>
              </div>
            ) : filteredLetters.length === 0 ? (
              /* Clean Slate: Empty Mailbox View */
              <div className="py-20 text-center bg-[#FAF8F5] rounded-3xl border border-dashed border-[#D9CBB9] p-8 sm:p-12 space-y-5">
                <div className="w-16 h-16 rounded-2xl bg-[#EDE4D8] text-[#8C5A4B] border border-[#DFCFC0] flex items-center justify-center mx-auto shadow-xs">
                  <Feather className="w-8 h-8" />
                </div>
                <div className="max-w-md mx-auto space-y-2">
                  <h3 className="text-xl font-serif font-bold text-[#2A1F18]">
                    {searchQuery ? 'Không tìm thấy phong bì phù hợp' : 'Hộp thư đang để trống'}
                  </h3>
                  <p className="text-sm text-[#7A6455] leading-relaxed">
                    {searchQuery 
                      ? 'Hãy thử tìm kiếm với từ khóa khác nhé.'
                      : 'Không có thư mẫu nào cài sẵn. Bạn hoàn toàn làm chủ từ đầu: đặt bút viết bức thư đầu tiên gửi gắm đến chính mình của ngày tương lai!'}
                  </p>
                </div>
                {!searchQuery && (
                  <button
                    onClick={handleStartCleanLetter}
                    className="px-6 py-3 rounded-xl bg-[#3B2A1E] text-[#FAF8F5] text-sm font-serif font-bold hover:bg-[#2A1F18] transition-all cursor-pointer inline-flex items-center gap-2 shadow-sm hover:shadow-md"
                  >
                    <PenTool className="w-4 h-4 text-[#DFC8B4]" />
                    <span>Viết bức thư đầu tiên ngay</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLetters.map(ltr => {
                  const pConfig = PAPER_THEMES[ltr.paper_style] || PAPER_THEMES.parchment;
                  const sealConfig = WAX_SEALS.find(s => s.id === ltr.wax_seal) || WAX_SEALS[0];
                  const fontCfg = FONT_OPTIONS.find(f => f.id === ltr.font_family) || FONT_OPTIONS[0];

                  return (
                    <div
                      key={ltr.id}
                      onClick={() => handleClickEnvelope(ltr)}
                      className={`group relative rounded-2xl border ${pConfig.envelopeClass} p-6 flex flex-col justify-between min-h-[220px] transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer overflow-hidden`}
                    >
                      {/* Envelope Flap Triangular Visual at Top */}
                      <div 
                        className={`absolute top-0 left-0 right-0 h-10 border-b ${pConfig.envelopeFlap} opacity-90 transition-transform group-hover:scale-y-95 origin-top`}
                        style={{
                          clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)'
                        }}
                      />

                      {/* Top Bar: Seal Motif & Lock Status & Delete Option */}
                      <div className="relative z-10 flex items-start justify-between gap-2">
                        {/* Wax Seal / Stamp */}
                        <div 
                          className="w-9 h-9 rounded-full border shadow-sm flex items-center justify-center text-sm transition-transform group-hover:scale-110"
                          style={{ backgroundColor: sealConfig.color, borderColor: sealConfig.border }}
                          title={`Dấu sáp ${sealConfig.name}`}
                        >
                          <span>{sealConfig.motif}</span>
                        </div>

                        {/* Status Badges & Delete Button */}
                        <div className="flex items-center gap-1.5">
                          {ltr.is_locked ? (
                            <div className="px-2.5 py-1 rounded-full bg-white/80 backdrop-blur-2xs border border-[#D5C8BA] text-[11px] font-serif text-[#6B4E3D] flex items-center gap-1 shadow-2xs">
                              <Lock className="w-3 h-3 text-[#8C5A4B]" />
                              <span>Còn {ltr.days_remaining} ngày</span>
                            </div>
                          ) : (
                            <div className="px-2.5 py-1 rounded-full bg-[#EAF2EC] border border-[#C5D9C8] text-[11px] font-serif text-[#2D5A38] font-semibold flex items-center gap-1 shadow-2xs">
                              <Sparkles className="w-3 h-3 text-[#2D5A38]" />
                              <span>{ltr.is_opened ? 'Đã mở đọc' : 'Đã đến ngày mở!'}</span>
                            </div>
                          )}

                          <button
                            type="button"
                            title="Xóa phong bì này"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirmId(ltr.id);
                            }}
                            className="w-7 h-7 rounded-full bg-white/60 hover:bg-red-50 text-[#8C7365] hover:text-red-600 border border-[#D5C8BA] flex items-center justify-center transition-all opacity-60 hover:opacity-100"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Middle: Title with calligraphic elegance */}
                      <div className="relative z-10 my-4 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-serif text-[#8C7365]">
                          <span>{ltr.sender_name || 'Tôi của hôm nay'}</span>
                          <span className="italic">{fontCfg.name.split(' (')[0]}</span>
                        </div>
                        <h4 
                          className={`text-base sm:text-lg font-bold text-[#2A1F18] line-clamp-2 leading-snug group-hover:text-[#8C5A4B] transition-colors ${fontCfg.fontClass}`}
                        >
                          {ltr.title}
                        </h4>
                      </div>

                      {/* Bottom Footer: Open Date Info */}
                      <div className="relative z-10 pt-3 border-t border-[#8C7365]/15 flex items-center justify-between text-xs text-[#7A6455] font-serif">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#8C5A4B]" />
                          <span>Hẹn mở: <strong>{formatDateDisplay(ltr.open_date)}</strong></span>
                        </div>

                        <span className="text-[11px] font-medium text-[#8C7365] group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                          {ltr.is_locked ? 'Xem ngày hẹn' : 'Mở phong bì'}
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* MODAL 1: THÔNG BÁO NHẸ NHÀNG KHI CHƯA ĐẾN NGÀY HẸN (LOCKED DIALOG) */}
      {/* ========================================================================= */}
      {lockedNotice?.visible && (
        <div 
          id="locked-letter-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-fadeIn"
          onClick={() => setLockedNotice(null)}
        >
          <div 
            onClick={e => e.stopPropagation()}
            className="w-full max-w-md bg-[#FAF8F5] rounded-3xl border-2 border-[#DECFC3] p-7 sm:p-8 shadow-2xl space-y-6 text-center animate-scaleUp"
          >
            {/* Wax Seal Stamp Centerpiece */}
            <div className="relative mx-auto w-16 h-16 flex items-center justify-center">
              <div 
                className="w-16 h-16 rounded-full border-2 shadow-md flex items-center justify-center text-2xl animate-pulse"
                style={{
                  backgroundColor: WAX_SEALS.find(s => s.id === lockedNotice.waxSeal)?.color || '#B2533E',
                  borderColor: WAX_SEALS.find(s => s.id === lockedNotice.waxSeal)?.border || '#8E3E2E'
                }}
              >
                <span>{WAX_SEALS.find(s => s.id === lockedNotice.waxSeal)?.motif || '🌿'}</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border border-[#DECFC3] flex items-center justify-center text-[#8C5A4B] shadow-xs">
                <Lock className="w-3 h-3" />
              </div>
            </div>

            {/* Letter Title */}
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest font-serif text-[#8C7365]">
                Con dấu thời gian chưa tan
              </span>
              <h3 className="text-lg sm:text-xl font-serif font-bold text-[#2A1F18] px-2">
                "{lockedNotice.title}"
              </h3>
            </div>

            {/* Gentle Lock Message */}
            <div className="p-4 rounded-2xl bg-[#F5EFEB] border border-[#E5DACB] space-y-2">
              <p className="text-sm sm:text-base font-serif text-[#4A3B32] font-semibold leading-relaxed">
                {lockedNotice.message}
              </p>
              <p className="text-xs text-[#7A6455] leading-relaxed">
                Còn khoảng <strong className="text-[#8C5A4B]">{lockedNotice.daysRemaining} ngày</strong> nữa thôi. 
                Hãy sống thật trọn vẹn và bình yên qua từng ngày này nhé.
              </p>
            </div>

            {/* Action Button */}
            <button
              id="btn-close-locked-notice"
              onClick={() => setLockedNotice(null)}
              className="w-full py-3 rounded-xl bg-[#3B2A1E] hover:bg-[#251A13] text-[#FAF8F5] text-sm font-serif font-bold shadow-sm transition-all cursor-pointer"
            >
              Mình sẽ kiên nhẫn chờ đợi
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: HIỆU ỨNG MỞ THƯ TỪ TỪ & TRÌNH ĐỌC THƯ (UNFOLDING & READING LETTER) */}
      {/* ========================================================================= */}
      {selectedLetterId && viewingLetter && (
        <div 
          id="reader-letter-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fadeIn"
          onClick={handleCloseReader}
        >
          <div 
            onClick={e => e.stopPropagation()}
            className="w-full max-w-2xl my-auto transition-all duration-700"
          >
            {/* Unfolding Stage Container */}
            {unfoldingStep !== 'open' ? (
              <div className="bg-[#EBDDCF] rounded-3xl border-2 border-[#D4BFAC] p-8 text-center space-y-6 shadow-2xl relative overflow-hidden min-h-[300px] flex flex-col items-center justify-center">
                {/* Visual Wax Seal Cracking */}
                <div 
                  className={`w-16 h-16 rounded-full border-2 shadow-lg flex items-center justify-center text-2xl transition-all duration-500 ${
                    unfoldingStep === 'flap_opening' ? 'scale-125 rotate-12 opacity-80' : 'scale-100'
                  }`}
                  style={{
                    backgroundColor: WAX_SEALS.find(s => s.id === viewingLetter.wax_seal)?.color || '#B2533E',
                    borderColor: WAX_SEALS.find(s => s.id === viewingLetter.wax_seal)?.border || '#8E3E2E'
                  }}
                >
                  <span>{WAX_SEALS.find(s => s.id === viewingLetter.wax_seal)?.motif || '🌿'}</span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-serif font-bold text-[#2A1F18]">
                    {unfoldingStep === 'flap_opening' ? 'Con dấu sáp nhẹ nhàng mở ra...' : 'Trang giấy thư đang lật mở...'}
                  </h3>
                  <p className="text-xs text-[#7A6455] font-serif">
                    Gửi gắm từ {formatDateDisplay(viewingLetter.created_at)}
                  </p>
                </div>

                <div className="w-12 h-1 bg-[#8C5A4B]/30 rounded-full animate-pulse mx-auto" />
              </div>
            ) : (
              /* Fully Open Stationery Letter */
              <div 
                className={`relative rounded-3xl border-2 ${viewingPaperConfig.borderClass || 'border-[#DECFC3]'} ${
                  viewingPaperConfig.bgClass || 'bg-[#F7F2E8]'
                } stationery-sheet shadow-2xl p-6 sm:p-12 md:p-16 animate-scaleUp overflow-hidden max-h-[88vh] flex flex-col`}
                style={{
                  backgroundColor: viewingPaperConfig.sheetBg,
                  backgroundImage: `linear-gradient(to bottom, transparent 35px, ${
                    viewingPaperConfig.ruledLineColor || 'rgba(140, 115, 101, 0.12)'
                  } 36px)`,
                  backgroundSize: '100% 36px'
                }}
              >
                {/* Vintage Corner Flourishes */}
                <div className="absolute top-4 left-4 w-7 h-7 border-t-2 border-l-2 border-[#8C7365]/35 pointer-events-none rounded-tl-sm" />
                <div className="absolute top-4 right-4 w-7 h-7 border-t-2 border-r-2 border-[#8C7365]/35 pointer-events-none rounded-tr-sm" />
                <div className="absolute bottom-4 left-4 w-7 h-7 border-b-2 border-l-2 border-[#8C7365]/35 pointer-events-none rounded-bl-sm" />
                <div className="absolute bottom-4 right-4 w-7 h-7 border-b-2 border-r-2 border-[#8C7365]/35 pointer-events-none rounded-br-sm" />

                {/* Draggable/Placed Stickers Display on Stored Letter */}
                {viewingStickers.length > 0 && (
                  <DraggableStickerCanvas
                    stickers={viewingStickers}
                    isReadOnly={true}
                  />
                )}

                {/* Close Button at top right */}
                <button
                  onClick={handleCloseReader}
                  className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-[#5A4537] transition-all cursor-pointer"
                  title="Gấp lại phong bì"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Hand Drawing Layer (if exists) */}
                {viewingLetter.drawing_data && (
                  <img
                    src={viewingLetter.drawing_data}
                    alt="Nét vẽ tay trang trí"
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none z-10 opacity-95"
                  />
                )}

                {/* Scrollable Letter Content */}
                <div className="relative z-0 overflow-y-auto pr-2 space-y-6 flex-1">
                  {/* Letter Header */}
                  <div className="border-b border-[#8C7365]/20 pb-4 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#7A6455] font-serif">
                      <span>Người gửi: <strong className="text-[#2A1F18]">{viewingLetter.sender_name}</strong></span>
                      <span>Hẹn mở ngày: <strong className="text-[#2A1F18]">{formatDateDisplay(viewingLetter.open_date)}</strong></span>
                    </div>

                    <h2 
                      className={`text-2xl sm:text-3xl font-bold tracking-tight leading-snug ${
                        FONT_OPTIONS.find(f => f.id === viewingLetter.font_family)?.fontClass || "font-['Lora',Georgia,serif] italic"
                      }`}
                      style={{ color: viewingLetter.ink_color }}
                    >
                      {viewingLetter.title}
                    </h2>
                  </div>

                  {/* Letter Body Text with Handwriting Font & Handcrafted Rhythm */}
                  {(() => {
                    const fontCfg = FONT_OPTIONS.find(f => f.id === viewingLetter.font_family) || FONT_OPTIONS[0];
                    return (
                      <div 
                        className={`whitespace-pre-wrap ${fontCfg.fontSizeClass} ${fontCfg.lineHeightClass} ${fontCfg.letterSpacing || ''} ${fontCfg.fontClass}`}
                        style={{ 
                          color: viewingLetter.ink_color,
                          lineHeight: '36px'
                        }}
                      >
                        {viewingLetter.content}
                      </div>
                    );
                  })()}

                  {/* Letter Footer */}
                  <div className="pt-8 border-t border-[#8C7365]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-serif text-xs text-[#7A6455]">
                    <div className="space-y-0.5">
                      <div>Đã viết: {formatDateDisplay(viewingLetter.created_at)}</div>
                      <div className="text-[11px] text-[#8C7365]">
                        Đã mở vào: {formatDateDisplay(viewingLetter.opened_at || new Date().toISOString())}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div 
                        className="w-7 h-7 rounded-full border shadow-xs flex items-center justify-center text-xs"
                        style={{
                          backgroundColor: WAX_SEALS.find(s => s.id === viewingLetter.wax_seal)?.color || '#B2533E',
                          borderColor: WAX_SEALS.find(s => s.id === viewingLetter.wax_seal)?.border || '#8E3E2E'
                        }}
                      >
                        <span>{WAX_SEALS.find(s => s.id === viewingLetter.wax_seal)?.motif || '🌿'}</span>
                      </div>
                      <span className="font-semibold text-[#3B2A1E]">Con dấu kỷ niệm</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="relative z-20 pt-4 mt-2 border-t border-[#8C7365]/15 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCloseReader}
                      className="px-4 py-2 rounded-xl bg-white/70 hover:bg-white text-[#5A4537] text-xs font-serif font-bold border border-[#D9CBB9] transition-all cursor-pointer"
                    >
                      Gấp lại phong bì
                    </button>

                    <button
                      onClick={() => setDeleteConfirmId(viewingLetter.id)}
                      className="px-3 py-2 rounded-xl bg-white/70 hover:bg-red-50 text-red-700 text-xs font-serif font-medium border border-red-200 transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Xóa bức thư</span>
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      handleCloseReader();
                      handleStartCleanLetter();
                    }}
                    className="px-4 py-2 rounded-xl bg-[#3B2A1E] hover:bg-[#251A13] text-[#FAF8F5] text-xs font-serif font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <PenTool className="w-3.5 h-3.5 text-[#DFC8B4]" />
                    <span>Viết bức thư tiếp theo</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: XÁC NHẬN XÓA THƯ (DELETE CONFIRMATION) */}
      {/* ========================================================================= */}
      {deleteConfirmId && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-fadeIn"
          onClick={() => setDeleteConfirmId(null)}
        >
          <div 
            onClick={e => e.stopPropagation()}
            className="w-full max-w-sm bg-[#FAF8F5] rounded-2xl border border-[#DECFC3] p-6 shadow-xl space-y-4 text-center"
          >
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-serif font-bold text-[#2A1F18]">
                Xóa phong bì thư này?
              </h4>
              <p className="text-xs text-[#7A6455] leading-relaxed">
                Sau khi xóa, nội dung bức thư và những nét vẽ tay sẽ không thể phục hồi lại được nữa.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 rounded-xl bg-[#EFE9DF] hover:bg-[#E5DDCF] text-[#5A4537] text-xs font-serif font-semibold border border-[#DCD2C4] cursor-pointer"
              >
                Giữ lại
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={() => handleDeleteLetter(deleteConfirmId)}
                className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-serif font-semibold cursor-pointer disabled:opacity-50"
              >
                {deleting ? 'Đang xóa...' : 'Xác nhận xóa'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Slide-out / Bottom-Sheet Sticker Drawer */}
      <StickerDrawer
        isOpen={isStickerDrawerOpen}
        onClose={() => setIsStickerDrawerOpen(false)}
        onSelectSticker={handleAddGraphicSticker}
        placedStickers={placedStickers}
        placedCount={placedStickers.length}
        onClearAllStickers={() => setPlacedStickers([])}
      />
    </div>
  );
};
