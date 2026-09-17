import React, { useState, useEffect, useRef } from 'react';
import Markdown from 'react-markdown';
import { 
  Send, 
  Mic, 
  MicOff, 
  Trash2, 
  RotateCcw, 
  Heart, 
  Sparkles, 
  ShieldCheck, 
  PhoneCall, 
  BookOpen, 
  HelpCircle, 
  ChevronDown, 
  Info, 
  Check, 
  X,
  MessageCircle,
  Lightbulb,
  Puzzle,
  Ear,
  Smile,
  GraduationCap,
  AlertCircle,
  RefreshCw,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { BotMascot } from './BotMascot';
import { ChatMessage, SupportMode, BotMascotMood } from '../types';
import { 
  QUICK_STARTERS, 
  CHAT_TOPICS, 
  PRESET_CONVERSATIONS, 
  QuickStarter 
} from '../data/chatbotData';
import { 
  AntiRepetitionMemory, 
  buildMemoryTurn, 
  sanitizeChatResponse 
} from '../utils/antiRepetitionMemory';
import { recordDiscussedTopic, unlockBadge } from '../utils/userExperienceStore';
import { getGentleFallbackResponse } from '../utils/geminiChatFallback';

interface ChatbotViewProps {
  onClose?: () => void;
  onGoToHelp?: () => void;
  onGoToConfessions?: () => void;
  onGoToJournal?: (initialPromptText?: string) => void;
  checkinContext?: {
    emotion: string;
    topic: string;
    reason: string;
    summaryText: string;
    mode?: string;
  } | null;
  defaultFullscreen?: boolean;
}

const STORAGE_KEY = 'ban_oi_minh_noi_ne_chat_history';
const MEMORY_STORAGE_KEY = 'teen_chatbot_anti_rep_memory';

// Check if user input indicates risk
const checkIsCriticalEmergency = (text: string): boolean => {
  const lower = text.toLowerCase();
  return (
    lower.includes('tự tử') ||
    lower.includes('muốn chết') ||
    lower.includes('tự hại') ||
    lower.includes('rạch tay') ||
    lower.includes('kết thúc cuộc sống') ||
    lower.includes('không muốn sống')
  );
};

export interface ClassifiedChatError {
  type: 'network' | 'timeout' | 'api' | 'empty' | 'abort' | 'unknown';
  message: string;
}

// Granular error classifier: distinguishes network, timeout, API, empty, and abort
export const classifyChatError = (error: any, responseStatus?: number): ClassifiedChatError => {
  if (error?.message === 'ABORT' || (error?.name === 'AbortError' && error?.message !== 'TIMEOUT')) {
    return {
      type: 'abort',
      message: 'Yêu cầu đã được dừng.'
    };
  }

  // 1. Explicit Network Error (offline or browser network failure)
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return {
      type: 'network',
      message: 'Có vẻ thiết bị đang mất kết nối mạng. Bạn kiểm tra lại wifi/4G và thử gửi lại nhé.'
    };
  }

  const isNetworkFailure =
    error instanceof TypeError &&
    /failed to fetch|networkerror|load failed|network request failed|net::err/i.test(
      error?.message || ''
    );

  if (isNetworkFailure) {
    return {
      type: 'network',
      message: 'Có vẻ kết nối mạng đang gặp vấn đề. Bạn kiểm tra lại đường truyền và thử gửi lại nhé.'
    };
  }

  // 2. Timeout
  if (
    error?.message === 'TIMEOUT' ||
    error?.name === 'TimeoutError' ||
    /timeout|timed out|exceeded/i.test(error?.message || '')
  ) {
    return {
      type: 'timeout',
      message: 'Tớ mất hơi lâu để trả lời 😭 Bạn bấm thử lại giúp tớ một lần nữa nhé.'
    };
  }

  // 3. HTTP status error
  if (responseStatus) {
    if (responseStatus === 429) {
      return {
        type: 'api',
        message: 'Hệ thống đang hơi bận một chút. Bạn đợi vài giây rồi thử lại nhé!'
      };
    }
    if (responseStatus >= 500) {
      return {
        type: 'api',
        message: 'Tớ đang gặp chút trục trặc khi xử lý tin nhắn. Bạn bấm thử lại tin này nhé.'
      };
    }
    if (responseStatus >= 400) {
      return {
        type: 'api',
        message: 'Tin nhắn chưa gửi được đến hệ thống. Bạn bấm thử lại nhé.'
      };
    }
  }

  // 4. Empty Response
  if (error?.message === 'EMPTY_RESPONSE') {
    return {
      type: 'empty',
      message: 'Tớ chưa nhận được câu trả lời trọn vẹn. Bạn thử gửi lại nhé.'
    };
  }

  // 5. Unknown fallback
  return {
    type: 'unknown',
    message: 'Có chút trục trặc nhỏ ngoài ý muốn. Bạn bấm thử lại tin này nhé.'
  };
};

export const ChatbotView: React.FC<ChatbotViewProps> = ({ 
  onClose,
  onGoToHelp, 
  onGoToConfessions, 
  onGoToJournal, 
  checkinContext,
  defaultFullscreen = true
}) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(defaultFullscreen);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return [];
  });

  const [inputVal, setInputVal] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [activeMode, setActiveMode] = useState<SupportMode>('general');
  const [mascotMood, setMascotMood] = useState<BotMascotMood>('happy');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [isListeningVoice, setIsListeningVoice] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showNewMessagePill, setShowNewMessagePill] = useState(false);
  const [isLongThinking, setIsLongThinking] = useState(false);
  const [antiRepetitionMemory, setAntiRepetitionMemory] = useState<AntiRepetitionMemory>(() => {
    try {
      const storedMem = localStorage.getItem(MEMORY_STORAGE_KEY);
      if (storedMem) return JSON.parse(storedMem);
    } catch {
      // ignore
    }
    return { history: [] };
  });

  // Dedicated Chat Container & Scroll references - strictly inside container only
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const speechRecognitionRef = useRef<any>(null);
  const inFlightRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isNearBottomRef = useRef(true);

  // Dedicated Chat Container scroll function - NEVER calls window.scrollTo or scrollIntoView!
  const scrollChatToBottom = (smooth = true) => {
    const container = chatContainerRef.current;
    if (!container) return;
    container.scrollTo({
      top: container.scrollHeight,
      behavior: smooth ? 'smooth' : 'auto'
    });
    setShowNewMessagePill(false);
  };

  // Track scroll position inside chat container only (Smart Auto-Scroll)
  const handleChatContainerScroll = () => {
    const container = chatContainerRef.current;
    if (!container) return;
    const distanceToBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    const isNear = distanceToBottom <= 120;
    isNearBottomRef.current = isNear;
    if (isNear) {
      setShowNewMessagePill(false);
    }
  };

  // Handle incoming checkin context
  useEffect(() => {
    if (checkinContext) {
      if (checkinContext.mode) {
        setActiveMode(checkinContext.mode as SupportMode);
      }
      if (checkinContext.topic) {
        setSelectedTopic(checkinContext.topic);
        recordDiscussedTopic(checkinContext.topic, checkinContext.summaryText);
      }

      setMessages((prev) => {
        const lastMsg = prev[prev.length - 1];
        if (lastMsg && lastMsg.text.includes("Mình đang nghe đây")) {
          return prev;
        }
        return [
          ...prev,
          {
            id: 'checkin_intro_' + Date.now(),
            sender: 'bot',
            text: `Chào bạn nhé! 🫂 ${checkinContext.summaryText ? `Mình biết là: *${checkinContext.summaryText}*\n\n` : ''}**“Mình đang nghe đây. Bạn muốn kể thêm chuyện gì không?”**`,
            timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
            suggestModes: true
          }
        ];
      });
      setMascotMood('empathy');
      unlockBadge('badge_storyteller');
      setTimeout(() => {
        scrollChatToBottom(false);
      }, 50);
    }
  }, [checkinContext]);

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  // Initial mount scroll only within chat container
  useEffect(() => {
    const timer = setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Handle ESC key for modals, fullscreen exit, or close
  useEffect(() => {
    const handleKeyDownEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isTopicModalOpen) {
          setIsTopicModalOpen(false);
        } else if (showClearConfirm) {
          setShowClearConfirm(false);
        } else if (onClose) {
          onClose();
        } else {
          setIsFullscreen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDownEsc);
    return () => window.removeEventListener('keydown', handleKeyDownEsc);
  }, [isTopicModalOpen, showClearConfirm, onClose]);

  // Clean up abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort('ABORT');
        abortControllerRef.current = null;
      }
    };
  }, []);

  // Handle Speech Recognition
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'vi-VN';

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputVal((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListeningVoice(false);
        setVoiceNotice('Đã nghe thấy bạn rồi nè!');
        setTimeout(() => setVoiceNotice(null), 3000);
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListeningVoice(false);
        setVoiceNotice('Không bắt được giọng nói. Bạn thử lại hoặc gõ chữ nhé!');
        setTimeout(() => setVoiceNotice(null), 3500);
      };

      recognition.onend = () => {
        setIsListeningVoice(false);
      };

      speechRecognitionRef.current = recognition;
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!speechRecognitionRef.current) {
      setVoiceNotice('Trình duyệt hiện tại chưa hỗ trợ ghi âm tiếng Việt.');
      setTimeout(() => setVoiceNotice(null), 3000);
      return;
    }

    if (isListeningVoice) {
      speechRecognitionRef.current.stop();
      setIsListeningVoice(false);
    } else {
      try {
        speechRecognitionRef.current.start();
        setIsListeningVoice(true);
        setVoiceNotice('Đang lắng nghe bạn nói... Bạn hãy nói tự nhiên nhé! 🌱');
      } catch (err) {
        console.warn('Cannot start recognition:', err);
      }
    }
  };

  // Dynamic mascot mood
  useEffect(() => {
    if (isThinking) {
      setMascotMood('thinking');
    } else if (activeMode === 'listen') {
      setMascotMood('empathy');
    } else if (activeMode === 'advice') {
      setMascotMood('idea');
    } else if (activeMode === 'solve') {
      setMascotMood('cheer');
    } else {
      setMascotMood('happy');
    }
  }, [isThinking, activeMode]);

  // Send message handler or retry existing failed message
  const handleSendMessage = async (
    textToSend?: string,
    overrideMode?: SupportMode,
    retryMsgId?: string
  ) => {
    // Prevent duplicate concurrent requests
    if (inFlightRef.current) return;

    let targetUserMsgId = retryMsgId;
    let targetText = '';
    const mode = overrideMode || activeMode;

    if (retryMsgId) {
      // RETRY FLOW: Do NOT create a duplicate user message!
      const existing = messages.find((m) => m.id === retryMsgId);
      if (!existing) return;
      targetText = existing.text;

      // Reset state of the message to sending
      setMessages((prev) =>
        prev.map((m) =>
          m.id === retryMsgId
            ? { ...m, status: 'sending', errorMessage: undefined, errorType: undefined }
            : m
        )
      );
    } else {
      const text = (textToSend !== undefined ? textToSend : inputVal).trim();
      if (!text) return;
      targetText = text;

      const userMsg: ChatMessage = {
        id: Date.now().toString(),
        sender: 'user',
        text: targetText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        supportMode: mode,
        topic: selectedTopic || undefined,
        status: 'sending'
      };
      targetUserMsgId = userMsg.id;

      setMessages((prev) => [...prev, userMsg]);
      setInputVal('');

      // Auto-scroll chat container to bottom when user explicitly sends a message
      setTimeout(() => {
        scrollChatToBottom(true);
      }, 40);
    }

    inFlightRef.current = true;
    setIsThinking(true);
    setIsLongThinking(false);

    // Warm reassuring notice after 12s of processing
    const slowNoticeTimer = setTimeout(() => {
      setIsLongThinking(true);
    }, 12000);

    // Abort controller with generous 45s timeout
    const abortCtrl = new AbortController();
    abortControllerRef.current = abortCtrl;
    const timeoutTimer = setTimeout(() => {
      try {
        abortCtrl.abort('TIMEOUT');
      } catch {}
    }, 45000);

    try {
      // Build previous messages up to this message
      const messagesPayload: Array<{ role: 'user' | 'model'; content: string }> = [];
      for (const m of messages) {
        if (m.id === targetUserMsgId) break;
        if (m.status !== 'error') {
          messagesPayload.push({
            role: m.sender === 'user' ? 'user' : 'model',
            content: m.text
          });
        }
      }
      messagesPayload.push({
        role: 'user',
        content: targetText
      });

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messagesPayload,
          supportMode: mode,
          topic: selectedTopic || '',
          recentResponseMemory: antiRepetitionMemory
        }),
        signal: abortCtrl.signal
      });

      clearTimeout(timeoutTimer);
      clearTimeout(slowNoticeTimer);

      let replyText = '';

      if (response.ok) {
        try {
          const data = await response.json();
          replyText = data?.reply || '';
        } catch {
          replyText = '';
        }
      }

      // If server returned non-200 or empty, or network fallback is needed:
      if (!replyText || typeof replyText !== 'string' || !replyText.trim()) {
        replyText = getGentleFallbackResponse(
          targetText,
          mode,
          selectedTopic || undefined,
          messages.slice().reverse().find((m) => m.sender === 'bot')?.text
        );
      }

      // Always mark the user message as sent smoothly
      setMessages((prev) =>
        prev.map((m) =>
          m.id === targetUserMsgId
            ? { ...m, status: 'sent', errorMessage: undefined, errorType: undefined }
            : m
        )
      );

      // Sanitize and register in anti-repetition memory
      replyText = sanitizeChatResponse(replyText, antiRepetitionMemory);
      const newTurn = buildMemoryTurn(
        antiRepetitionMemory.history.length + 1,
        targetText,
        replyText,
        selectedTopic || undefined
      );
      const nextMemory: AntiRepetitionMemory = {
        history: [...antiRepetitionMemory.history.slice(-4), newTurn]
      };
      setAntiRepetitionMemory(nextMemory);
      try {
        localStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(nextMemory));
      } catch {}

      // Suggest modes logic
      const shouldSuggestModes =
        Boolean(
          replyText.toLowerCase().includes('bạn muốn mình giúp theo cách nào') ||
          replyText.toLowerCase().includes('chọn 1 trong các cách sau')
        ) && !checkIsCriticalEmergency(targetText);

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        supportMode: mode,
        suggestModes: shouldSuggestModes,
        status: 'sent'
      };

      setMessages((prev) => [...prev, botMsg]);

      // Smart Auto-Scroll: only if user is near bottom
      setTimeout(() => {
        if (isNearBottomRef.current) {
          scrollChatToBottom(true);
        } else {
          setShowNewMessagePill(true);
        }
      }, 50);

    } catch (error: any) {
      clearTimeout(timeoutTimer);
      clearTimeout(slowNoticeTimer);

      if (abortCtrl.signal.aborted && abortCtrl.signal.reason !== 'TIMEOUT') {
        // Deliberate user action or component unmount; do nothing
        return;
      }

      // In case of network interruption, timeout or fetch failure:
      // Smoothly fall back to an empathetic friend response instead of a jarring network error
      const fallbackReply = getGentleFallbackResponse(
        targetText,
        mode,
        selectedTopic || undefined,
        messages.slice().reverse().find((m) => m.sender === 'bot')?.text
      );

      // Mark user message as sent
      setMessages((prev) =>
        prev.map((m) =>
          m.id === targetUserMsgId
            ? { ...m, status: 'sent', errorMessage: undefined, errorType: undefined }
            : m
        )
      );

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        supportMode: mode,
        suggestModes: false,
        status: 'sent'
      };

      setMessages((prev) => [...prev, botMsg]);

      if (isNearBottomRef.current) {
        setTimeout(() => scrollChatToBottom(true), 50);
      }
    } finally {
      clearTimeout(timeoutTimer);
      clearTimeout(slowNoticeTimer);
      inFlightRef.current = false;
      setIsThinking(false);
      setIsLongThinking(false);
      abortControllerRef.current = null;
    }
  };

  // Quick Starter Click
  const handleQuickStarterClick = (starter: QuickStarter) => {
    if (starter.mode) {
      setActiveMode(starter.mode);
    }
    if (starter.category) {
      setSelectedTopic(starter.category);
    }
    handleSendMessage(starter.prompt, starter.mode);
  };

  // Load Preset Sample
  const handleLoadPreset = (presetId: string) => {
    const found = PRESET_CONVERSATIONS.find((p) => p.id === presetId);
    if (!found) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: found.userPrompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      topic: found.tag
    };

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      sender: 'bot',
      text: found.botReply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestModes: true
    };

    setMessages([userMsg, botMsg]);
  };

  // Clear Chat History
  const handleClearChat = () => {
    setMessages([]);
    setAntiRepetitionMemory({ history: [] });
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(MEMORY_STORAGE_KEY);
    setShowClearConfirm(false);
    setSelectedTopic(null);
    setActiveMode('general');
  };

  // Feedback Toggle
  const toggleHelpful = (msgId: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, isHelpful: !m.isHelpful } : m))
    );
  };

  // Request Another Perspective
  const handleRequestAnotherWay = (botMessage: ChatMessage) => {
    handleSendMessage(`Bạn cho mình thử một góc nhìn hoặc cách tiếp cận khác xem sao nhé? 🌱`, 'advice');
  };

  // Switch to Listen Mode directly from a message
  const handleSwitchToListenMode = () => {
    setActiveMode('listen');
    handleSendMessage(`Mình cảm ơn nhé. Đoạn này mình chỉ muốn được lắng nghe thôi, không cần lời khuyên đâu 🫂`, 'listen');
  };

  // Select Mode from bot question
  const handleSelectSupportMode = (mode: SupportMode) => {
    setActiveMode(mode);
    let prompt = '';
    if (mode === 'listen') prompt = 'Mình muốn bạn chỉ lắng nghe và đồng cảm với mình thôi nhé 🫂';
    if (mode === 'advice') prompt = 'Cho mình xin một vài lời khuyên thực tế nhé 💡';
    if (mode === 'solve') prompt = 'Cùng mình phân tích và tháo gỡ vấn đề này từng bước nhé 🧩';
    handleSendMessage(prompt, mode);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const hasCriticalIssue = messages.some(
    (m) => m.sender === 'user' && checkIsCriticalEmergency(m.text)
  );

  return (
    <div
      className={
        isFullscreen
          ? "fixed inset-0 z-50 flex flex-col bg-[#FAF8F5] text-stone-800 w-full h-full overflow-hidden animate-in fade-in duration-200"
          : "w-full max-w-5xl mx-auto px-2 sm:px-4 py-2 sm:py-3 flex flex-col h-[calc(100dvh-5rem)] min-h-[580px] max-h-[960px] bg-[#FAF8F5] rounded-3xl border border-stone-200/90 shadow-xs overflow-hidden"
      }
    >
      {/* Top Banner / Privacy & Safe Reassurance */}
      <div className="bg-gradient-to-r from-rose-50 via-amber-50 to-emerald-50 rounded-3xl p-3 sm:p-4 border border-rose-100/90 shadow-xs mb-3 shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <BotMascot mood={mascotMood} isThinking={isThinking} size="md" />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                  Bạn ơi, mình nói nè
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-xs font-bold flex items-center gap-1">
                  <span>Safe Space</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                “Có chuyện gì, cứ kể mình nghe. Mình luôn ở đây.” 🌸
              </p>
            </div>
          </div>

          {/* Quick action buttons on top bar */}
          <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
            {/* Topic selector trigger */}
            <button
              id="btn-choose-chat-topic"
              onClick={() => setIsTopicModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-rose-300 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-2xs hover:bg-rose-50/40 transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-rose-500" />
              <span>{selectedTopic ? `Chủ đề: ${selectedTopic}` : 'Chọn chủ đề'}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {/* Clear button */}
            {messages.length > 0 && (
              <button
                id="btn-clear-chat-history"
                onClick={() => setShowClearConfirm(true)}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-red-50 hover:text-red-600 text-slate-600 text-xs font-semibold flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                title="Xóa cuộc trò chuyện"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Xóa trò chuyện</span>
              </button>
            )}

            {/* Fullscreen Toggle button */}
            <button
              id="btn-toggle-fullscreen-chat"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
              title={isFullscreen ? "Thu nhỏ giao diện" : "Mở rộng toàn màn hình"}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              <span className="hidden md:inline">{isFullscreen ? "Thu nhỏ" : "Toàn màn hình"}</span>
            </button>

            {/* Close Button */}
            {onClose && (
              <button
                id="btn-close-fullscreen-chat"
                onClick={onClose}
                className="px-2.5 py-1.5 rounded-xl bg-rose-100/90 hover:bg-rose-200 text-rose-800 text-xs font-bold flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                title="Đóng khung chat (Esc)"
              >
                <X className="w-3.5 h-3.5" />
                <span>Đóng</span>
              </button>
            )}
          </div>

        </div>

        {/* Message Mode Tabs */}
        <div className="mt-3 pt-3 border-t border-rose-100/70 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
              <span>Chế độ:</span>
            </span>

            <button
              onClick={() => setActiveMode('general')}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeMode === 'general'
                  ? 'bg-slate-800 text-white shadow-2xs'
                  : 'bg-white/80 text-slate-600 hover:bg-white border border-slate-200'
              }`}
            >
              🌿 Tự nhiên
            </button>

            <button
              onClick={() => setActiveMode('listen')}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                activeMode === 'listen'
                  ? 'bg-rose-500 text-white shadow-2xs'
                  : 'bg-white/80 text-rose-700 hover:bg-white border border-rose-200'
              }`}
            >
              <Ear className="w-3 h-3" />
              <span>🫂 Chỉ nghe mình thôi</span>
            </button>

            <button
              onClick={() => setActiveMode('best_friend')}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                activeMode === 'best_friend'
                  ? 'bg-pink-500 text-white shadow-2xs'
                  : 'bg-white/80 text-pink-700 hover:bg-white border border-pink-200'
              }`}
            >
              <Smile className="w-3 h-3" />
              <span>😂 Bạn thân</span>
            </button>

            <button
              onClick={() => setActiveMode('solve')}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                activeMode === 'solve'
                  ? 'bg-teal-600 text-white shadow-2xs'
                  : 'bg-white/80 text-teal-700 hover:bg-white border border-teal-200'
              }`}
            >
              <Puzzle className="w-3 h-3" />
              <span>🎯 Gỡ rối</span>
            </button>

            <button
              onClick={() => setActiveMode('reflect')}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                activeMode === 'reflect'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-white/80 text-indigo-700 hover:bg-white border border-indigo-200'
              }`}
            >
              <Lightbulb className="w-3 h-3" />
              <span>🧠 Đổi góc nhìn</span>
            </button>

            <button
              onClick={() => setActiveMode('cheer')}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                activeMode === 'cheer'
                  ? 'bg-amber-500 text-white shadow-2xs'
                  : 'bg-white/80 text-amber-700 hover:bg-white border border-amber-200'
              }`}
            >
              <span>🌱 Động viên</span>
            </button>

            <button
              onClick={() => setActiveMode('study')}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                activeMode === 'study'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-white/80 text-blue-700 hover:bg-white border border-blue-200'
              }`}
            >
              <GraduationCap className="w-3 h-3" />
              <span>📝 Bài vở & Thi cử</span>
            </button>
          </div>

          <span className="text-[11px] text-slate-600 italic">
            {activeMode === 'listen' && 'Bot sẽ chú trọng lắng nghe, vỗ về, tuyệt đối không xả lời khuyên'}
            {activeMode === 'best_friend' && 'Nói chuyện như bạn thân cùng bàn, tự nhiên và thấu hiểu'}
            {activeMode === 'solve' && 'Bot sẽ cùng bạn chia nhỏ việc cần làm, giải quyết từng bước'}
            {activeMode === 'reflect' && 'Đặt câu hỏi gợi mở để bạn tự nhìn nhận sâu sắc hơn'}
            {activeMode === 'cheer' && 'Tập trung vào bước nhỏ nhất có thể làm ngay, giảm tự trách'}
            {activeMode === 'study' && 'Hạ nhiệt áp lực thi cử, chia nhỏ đề cương và nhắc nhở nghỉ ngơi'}
            {activeMode === 'general' && 'Lắng nghe, công nhận cảm xúc và phản hồi chân thành'}
          </span>
        </div>
      </div>

      {/* Critical Emergency Banner if triggered */}
      {hasCriticalIssue && (
        <div className="bg-rose-600 text-white rounded-2xl p-4 mb-4 shadow-md flex items-start gap-3 animate-bounce">
          <PhoneCall className="w-6 h-6 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-sm sm:text-base">
              Bạn ơi, bạn rất quan trọng và sự an toàn của bạn là trên hết! 💗
            </h4>
            <p className="text-xs sm:text-sm text-rose-100 leading-relaxed">
              Nếu bạn đang cảm thấy muốn tự làm tổn thương bản thân hoặc gặp nguy hiểm, hãy mở lòng với một người lớn bạn tin tưởng ngay bên cạnh, hoặc liên hệ cơ sở y tế gần nhất:
            </p>
            <div className="pt-1 flex items-center gap-3">
              <a
                href="tel:115"
                className="px-4 py-1.5 bg-white text-rose-600 font-extrabold text-xs rounded-xl shadow-xs hover:bg-rose-50"
              >
                📞 Cấp cứu khẩn cấp: 115
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Main Chat Conversation Box */}
      <div className={`flex-1 min-h-0 ${isFullscreen ? 'bg-[#FAF8F5]' : 'bg-white/80 backdrop-blur-sm rounded-3xl border border-rose-100/90 shadow-xs'} flex flex-col overflow-hidden relative`}>
        
        {/* Messages Container - Strictly scrolls inside container only */}
        <div
          id="chat-messages-container"
          ref={chatContainerRef}
          onScroll={handleChatContainerScroll}
          className="chat-container flex-1 min-h-0 overflow-y-auto px-3 sm:px-6 py-4 sm:py-6 space-y-6 overscroll-contain relative scroll-smooth"
        >
          <div className="max-w-4xl mx-auto w-full space-y-6">
          
          {/* Welcome Screen when conversation is empty */}
          {messages.length === 0 && (
            <div className="max-w-2xl mx-auto text-center py-6 sm:py-10 space-y-6">
              
              <div className="flex flex-col items-center space-y-3">
                <BotMascot mood="happy" size="xl" className="shadow-md" />
                <div className="space-y-1">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    💬 Bạn ơi, mình nói nè
                  </h3>
                  <p className="text-sm sm:text-base text-slate-700 font-medium max-w-md mx-auto leading-relaxed">
                    “Có chuyện gì muốn kể mình nghe không? Bạn cứ nói theo cách của bạn nhé. Không cần phải diễn đạt thật hay đâu.”
                  </p>
                </div>
              </div>

              {/* Core Reassurance Message */}
              <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-100 text-xs text-rose-800 font-medium max-w-lg mx-auto">
                🌸 “Bạn không cần phải có câu trả lời ngay. Đôi khi, bắt đầu bằng việc nói ra đã là một bước rất lớn rồi.”
              </div>

              {/* Section 3: 8 Quick Starter Chips */}
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Lựa chọn nhanh để bắt đầu:
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {QUICK_STARTERS.map((starter) => (
                    <button
                      key={starter.id}
                      onClick={() => handleQuickStarterClick(starter)}
                      className="px-3.5 py-2 rounded-2xl bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 hover:border-rose-300 text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-2xs hover:shadow-xs transition-all cursor-pointer transform active:scale-95"
                    >
                      <span>{starter.icon}</span>
                      <span>{starter.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preset Conversation Samples Section */}
              <div className="pt-4 border-t border-rose-100/80 space-y-2">
                <p className="text-xs font-bold text-slate-600">
                  Hoặc thử xem qua các cuộc trò chuyện mẫu:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                  {PRESET_CONVERSATIONS.map((preset) => (
                    <div
                      key={preset.id}
                      onClick={() => handleLoadPreset(preset.id)}
                      className="p-3 rounded-2xl bg-slate-50 hover:bg-rose-50/60 border border-slate-200/80 hover:border-rose-200 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-slate-800 group-hover:text-rose-600">
                          {preset.title}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-white text-slate-600 text-[10px] font-semibold border border-slate-200">
                          {preset.tag}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 italic line-clamp-1">
                        “{preset.userPrompt}”
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* Rendered Messages */}
          {messages.map((msg, index) => {
            const isUser = msg.sender === 'user';
            const isBot = msg.sender === 'bot';

            return (
              <div
                key={msg.id || index}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {/* Bot Mascot Avatar */}
                {isBot && (
                  <div className="shrink-0 mt-1">
                    <BotMascot mood={msg.supportMode === 'listen' ? 'empathy' : msg.supportMode === 'advice' ? 'idea' : 'happy'} size="sm" />
                  </div>
                )}

                {/* Message Bubble Container */}
                <div className={`max-w-[85%] sm:max-w-[78%] space-y-2`}>
                  
                  {/* Bubble Content */}
                  <div
                    className={`rounded-3xl p-4 sm:p-5 shadow-xs text-sm sm:text-[15px] leading-relaxed relative ${
                      isUser
                        ? 'bg-gradient-to-br from-rose-500 to-amber-500 text-white rounded-br-xs font-medium'
                        : 'bg-white text-slate-800 border border-rose-100/90 rounded-bl-xs'
                    }`}
                  >
                    {/* Optional Mode Tag */}
                    {isBot && msg.supportMode && msg.supportMode !== 'general' && (
                      <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[11px] font-bold mb-2 border border-rose-100">
                        {msg.supportMode === 'listen' && '🫂 Chế độ: Chỉ nghe mình thôi'}
                        {msg.supportMode === 'advice' && '💡 Chế độ: Cho lời khuyên'}
                        {msg.supportMode === 'solve' && '🧩 Chế độ: Cùng giải quyết'}
                      </div>
                    )}

                    {/* Formatted Markdown Content */}
                    <div className="prose prose-sm max-w-none text-inherit leading-relaxed">
                      <Markdown>{msg.text}</Markdown>
                    </div>

                    {/* Timestamp & Status */}
                    <div
                      className={`text-[10px] font-medium flex items-center justify-end gap-1.5 mt-2 ${
                        isUser ? 'text-rose-100' : 'text-slate-600'
                      }`}
                    >
                      <span>{msg.timestamp}</span>
                      {isUser && msg.status === 'sending' && (
                        <span className="inline-block animate-pulse text-[10px]" title="Đang gửi...">⏳</span>
                      )}
                      {isUser && msg.status === 'error' && (
                        <span className="inline-flex items-center text-amber-200 text-[10px] font-bold">⚠️ Chưa gửi được</span>
                      )}
                    </div>
                  </div>

                  {/* If user message encountered an error, display inline error card with Retry button */}
                  {isUser && msg.status === 'error' && (
                    <div className="w-full bg-rose-50 border border-rose-200/90 rounded-2xl p-3 text-xs text-rose-900 shadow-2xs space-y-2 animate-in fade-in">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-bold text-rose-900">
                            {msg.errorMessage || 'Tin nhắn chưa gửi được đến hệ thống.'}
                          </p>
                          <p className="text-[11px] text-rose-700 mt-0.5">
                            {msg.errorType === 'network'
                              ? 'Bạn kiểm tra lại đường truyền mạng hoặc bấm thử lại nhé.'
                              : msg.errorType === 'timeout'
                              ? 'Phản hồi mất nhiều thời gian hơn dự kiến, bạn bấm thử lại nhé.'
                              : 'Bạn có thể bấm nút Thử lại bên dưới để gửi lại tin nhắn này mà không cần gõ lại.'}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-end pt-0.5">
                        <button
                          type="button"
                          onClick={() => handleSendMessage(undefined, msg.supportMode, msg.id)}
                          className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Thử lại</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Section 5: Specific Question from Bot "Bạn muốn mình giúp theo cách nào?" */}
                  {isBot && msg.suggestModes && (
                    <div className="bg-rose-50/70 rounded-2xl p-3.5 border border-rose-100 space-y-2 animate-in fade-in duration-300">
                      <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5 text-rose-500" />
                        <span>Bạn muốn mình giúp theo cách nào?</span>
                      </p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <button
                          onClick={() => handleSelectSupportMode('listen')}
                          className="p-2 rounded-xl bg-white hover:bg-rose-100/70 border border-rose-200 text-left text-xs font-bold text-slate-800 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                        >
                          <span className="text-base">🫂</span>
                          <div>
                            <div>Chỉ nghe mình thôi</div>
                            <div className="text-[10px] text-slate-600 font-normal">Lắng nghe, không khuyên</div>
                          </div>
                        </button>

                        <button
                          onClick={() => handleSelectSupportMode('advice')}
                          className="p-2 rounded-xl bg-white hover:bg-amber-100/70 border border-amber-200 text-left text-xs font-bold text-slate-800 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                        >
                          <span className="text-base">💡</span>
                          <div>
                            <div>Cho mình lời khuyên</div>
                            <div className="text-[10px] text-slate-600 font-normal">Gợi ý thực tế</div>
                          </div>
                        </button>

                        <button
                          onClick={() => handleSelectSupportMode('solve')}
                          className="p-2 rounded-xl bg-white hover:bg-teal-100/70 border border-teal-200 text-left text-xs font-bold text-slate-800 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                        >
                          <span className="text-base">🧩</span>
                          <div>
                            <div>Cùng tìm cách giải quyết</div>
                            <div className="text-[10px] text-slate-600 font-normal">Phân tích từng bước</div>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Bot Interactive Actions: Section 11 of user prompt */}
                  {isBot && (
                    <div className="flex items-center gap-1.5 flex-wrap text-xs text-slate-600 pt-0.5">
                      
                      {/* Helpful Button */}
                      <button
                        onClick={() => toggleHelpful(msg.id)}
                        className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                          msg.isHelpful
                            ? 'bg-rose-100 text-rose-700 font-bold'
                            : 'hover:bg-slate-100 text-slate-600'
                        }`}
                        title="Câu trả lời này hữu ích"
                      >
                        <Heart className={`w-3.5 h-3.5 ${msg.isHelpful ? 'fill-rose-500 text-rose-500' : ''}`} />
                        <span>{msg.isHelpful ? 'Đã cảm ơn' : '❤️ Câu trả lời này hữu ích'}</span>
                      </button>

                      {/* Request Another Perspective */}
                      <button
                        onClick={() => handleRequestAnotherWay(msg)}
                        className="px-2.5 py-1 rounded-xl hover:bg-slate-100 text-slate-600 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        title="Cho mình một cách khác"
                      >
                        <RotateCcw className="w-3 h-3 text-slate-500" />
                        <span>🔄 Cho mình cách khác</span>
                      </button>

                      {/* Quick Listen Only Request */}
                      {msg.supportMode !== 'listen' && (
                        <button
                          onClick={handleSwitchToListenMode}
                          className="px-2.5 py-1 rounded-xl hover:bg-slate-100 text-slate-600 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          title="Chỉ muốn được lắng nghe"
                        >
                          <span>🫂 Chỉ nghe mình thôi</span>
                        </button>
                      )}

                    </div>
                  )}

                </div>

                {/* User Avatar Placeholder */}
                {isUser && (
                  <div className="shrink-0 mt-1">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-rose-400 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                      Bạn
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Section 9: Typing indicator (Fast Path shows quick response, Complex shows thoughtful state) */}
          {isThinking && (
            <div className="flex gap-3 justify-start items-center animate-in fade-in duration-200">
              <BotMascot mood="thinking" isThinking={true} size="sm" />
              <div className="bg-white rounded-2xl px-4 py-3 border border-rose-100/90 shadow-2xs flex items-center gap-2 text-xs font-bold text-slate-700">
                <span className="inline-block animate-pulse">🌸</span>
                <span>
                  {isLongThinking
                    ? 'Đang mất thêm một chút thời gian để suy nghĩ câu trả lời cho bạn nè...'
                    : /^(hi+|hello|helo|hey|heyy|chào|hế lô|hí|alo|ê+|này|nè|bạn ơi|haha|hehe|hihi|keke|ok|oke|okie|cảm ơn|thanks|bye|bai|bai nha)(\s+(bạn|cậu|nha|nhé|nè|ơi|luôn))*$/i.test(
                        (messages[messages.length - 1]?.text || '').trim().toLowerCase()
                      ) ||
                      /^[:=;xX8B]-?[\)\(\]\[DPpvdDoO3*><c~^]{1,6}$/.test(
                        (messages[messages.length - 1]?.text || '').trim()
                      )
                    ? 'Đang trả lời nè...'
                    : 'Bạn ơi, mình đang nghĩ nè...'}
                </span>
                <span className="flex gap-1 ml-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              </div>
            </div>
          )}

          {/* Suggestion to write to Journal: User prompt requirement 28 */}
          {messages.length >= 2 && onGoToJournal && (
            <div className="mx-auto my-3 p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/90 max-w-md text-center space-y-2 animate-in fade-in">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-900">
                <span>💌</span>
                <span>Muốn để lại chuyện này vào Nhật ký không?</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Lưu giữ lại một chút suy nghĩ hôm nay để sau này nhìn lại xem mình đã đi qua như thế nào.
              </p>
              <button
                type="button"
                onClick={() => {
                  const lastUser = [...messages].reverse().find(m => m.sender === 'user');
                  const promptNote = lastUser ? `Hôm nay mình trò chuyện với Bạn ơi, mình nói nè về chuyện: "${lastUser.text.slice(0, 150)}..."` : '';
                  onGoToJournal(promptNote);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-2xs transition-all cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>📖 Viết vào nhật ký</span>
              </button>
            </div>
          )}
          </div>
        </div>

        {/* Floating pill when user is reading older messages and a new message arrives */}
        {showNewMessagePill && (
          <button
            type="button"
            onClick={() => scrollChatToBottom(true)}
            className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5 animate-in fade-in slide-in-from-bottom-2 transition-all cursor-pointer"
          >
            <span>↓ Có tin nhắn mới</span>
            <span className="text-rose-200">• Bấm để xem</span>
          </button>
        )}

        {/* Voice Recognition Notification Pill */}
        {voiceNotice && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white text-xs px-4 py-2 rounded-full shadow-lg z-20 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
            <Mic className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span>{voiceNotice}</span>
          </div>
        )}

        {/* Section 10: Input Area */}
        <div className={`p-3 sm:p-4 shrink-0 ${isFullscreen ? 'bg-white/95 backdrop-blur-md border-t border-stone-200/90' : 'bg-white border-t border-rose-100/80'}`}>
          <div className="max-w-4xl mx-auto w-full space-y-2.5">
          
            {/* Quick interactive helpers when conversation is ongoing */}
            {messages.length > 0 && !isThinking && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
                <span className="text-[11px] text-stone-500 font-semibold shrink-0">Gợi ý nhanh:</span>
                <button
                  type="button"
                  onClick={() => handleSendMessage('Thôi, tự nhiên không muốn kể chuyện đó nữa.')}
                  className="px-2.5 py-1 rounded-xl bg-stone-100 hover:bg-rose-50 text-stone-700 hover:text-rose-700 text-[11px] font-semibold shrink-0 border border-stone-200 transition-colors cursor-pointer"
                >
                  🙅 Thôi không muốn kể
                </button>
                <button
                  type="button"
                  onClick={() => handleSendMessage('Đố vui mình một câu nhẹ nhàng đi!')}
                  className="px-2.5 py-1 rounded-xl bg-stone-100 hover:bg-amber-50 text-stone-700 hover:text-amber-800 text-[11px] font-semibold shrink-0 border border-stone-200 transition-colors cursor-pointer"
                >
                  ✨ Đố vui một câu
                </button>
                <button
                  type="button"
                  onClick={() => handleSendMessage('Hỏi mình một câu random question để đổi gió đi!')}
                  className="px-2.5 py-1 rounded-xl bg-stone-100 hover:bg-teal-50 text-stone-700 hover:text-teal-800 text-[11px] font-semibold shrink-0 border border-stone-200 transition-colors cursor-pointer"
                >
                  🎲 Random question
                </button>
                <button
                  type="button"
                  onClick={() => handleSendMessage('Mình lười quá, cho mình thử bước 5 phút xem nào!')}
                  className="px-2.5 py-1 rounded-xl bg-stone-100 hover:bg-blue-50 text-stone-700 hover:text-blue-800 text-[11px] font-semibold shrink-0 border border-stone-200 transition-colors cursor-pointer"
                >
                  ⚡ Bước 5 phút lười học
                </button>
              </div>
            )}

            <div className="relative flex items-end gap-2 sm:gap-2.5 bg-[#FAF9F6] rounded-2xl sm:rounded-3xl p-2 sm:p-2.5 border border-stone-300 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-200/60 transition-all">
              
              {/* Voice Input Button: Section 10 ("🎤 Nói thay vì gõ") */}
              <button
                id="btn-chat-voice-input"
                type="button"
                onClick={toggleVoiceInput}
                className={`p-2.5 sm:p-3 rounded-2xl transition-all cursor-pointer ${
                  isListeningVoice
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'text-stone-500 hover:text-rose-600 hover:bg-rose-50'
                }`}
                title={isListeningVoice ? 'Đang nghe... Bấm để dừng' : '🎤 Nói thay vì gõ'}
              >
                {isListeningVoice ? <MicOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Mic className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>

              {/* Textarea */}
              <textarea
                id="chat-input-textarea"
                ref={inputRef}
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Bạn muốn kể chuyện gì với mình? Cứ viết tự nhiên nhé... (Enter để gửi, Shift+Enter xuống dòng)"
                rows={1}
                className="flex-1 max-h-36 min-h-[44px] py-2 px-2 bg-transparent text-stone-900 text-sm sm:text-base placeholder:text-stone-400 focus:outline-none resize-none leading-relaxed"
              />

              {/* Send Button: Section 10 ("➤") */}
              <button
                id="btn-chat-send-message"
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!inputVal.trim() || isThinking}
                className={`px-4 py-2.5 sm:py-3 rounded-2xl font-bold transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
                  inputVal.trim() && !isThinking
                    ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-xs hover:shadow-md transform active:scale-95'
                    : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                }`}
                title="Gửi tin nhắn (Enter)"
              >
                <span className="hidden sm:inline text-xs font-bold">Gửi</span>
                <Send className="w-4 h-4" />
              </button>

            </div>

            {/* Privacy & Safe Note Under Input */}
            <div className="flex flex-wrap items-center justify-between text-[11px] text-stone-500 px-1 gap-2">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Hoàn toàn ẩn danh • Không yêu cầu họ tên • Không phán xét</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="hidden md:inline text-stone-400">Nhấn Enter để gửi, Shift + Enter xuống dòng</span>
                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowClearConfirm(true)}
                    className="text-rose-600 hover:underline cursor-pointer font-medium"
                  >
                    Bắt đầu phiên mới
                  </button>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Topics Drawer / Modal (Section 8 of prompt) */}
      {isTopicModalOpen && (
        <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl border border-rose-100 space-y-5">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">📚</span>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900">
                    Chọn chủ đề bạn muốn tâm sự
                  </h3>
                  <p className="text-xs text-slate-600">
                    Bấm vào một chủ đề hoặc vấn đề nhỏ để chatbot gợi ý cách trò chuyện phù hợp.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsTopicModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Grid of 6 Main Categories from Section 8 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CHAT_TOPICS.map((topic) => (
                <div
                  key={topic.id}
                  className="p-4 rounded-2xl bg-[#FAF9F6] border border-slate-200/80 hover:border-rose-300 hover:bg-rose-50/30 transition-all space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                      <span>{topic.icon}</span>
                      <span>{topic.name}</span>
                    </span>
                    <button
                      onClick={() => {
                        setSelectedTopic(topic.name);
                        setIsTopicModalOpen(false);
                        handleSendMessage(topic.starterPrompt);
                      }}
                      className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
                    >
                      Bắt đầu nói
                    </button>
                  </div>
                  
                  <p className="text-xs text-slate-600">
                    {topic.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {topic.subtopics.map((sub, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setSelectedTopic(`${topic.name} - ${sub}`);
                          setIsTopicModalOpen(false);
                          handleSendMessage(`Mình đang băn khoăn về vấn đề: ${sub}.`);
                        }}
                        className="px-2 py-1 rounded-lg bg-white text-[11px] text-slate-700 font-medium border border-slate-200 hover:border-rose-300 hover:text-rose-700 transition-colors cursor-pointer"
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsTopicModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-900 transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Clear Chat Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-xl border border-rose-100 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto text-xl">
              🗑️
            </div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-base text-slate-900">
                Xóa toàn bộ cuộc trò chuyện?
              </h4>
              <p className="text-xs text-slate-600">
                Tất cả tin nhắn trong phiên này sẽ được dọn sạch để đảm bảo quyền riêng tư cho bạn. Bạn có thể bắt đầu lại bất cứ lúc nào!
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Giữ lại
              </button>
              <button
                onClick={handleClearChat}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition-colors cursor-pointer"
              >
                Xóa sạch
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
