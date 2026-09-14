import React, { useState } from 'react';
import { JournalMessageItem, JournalImageItem } from '../../types';
import { Trash2, Edit2, Check, X, Sparkles, Heart } from 'lucide-react';
import { JournalImageGallery } from './JournalImageGallery';

export type JournalScrapbookStyle = 'auto' | 'chat' | 'paper' | 'memory' | 'minimal';

interface JournalStyleDisplayProps {
  content: string;
  messages: JournalMessageItem[];
  images?: JournalImageItem[];
  editable?: boolean;
  onDeleteImage?: (id: string) => void;
  title?: string;
  mood?: string;
  moodLabel?: string;
  tags: string[];
  isFavorite?: boolean;
  dateStr: string;
  activeStyleOverride?: JournalScrapbookStyle;
  onDeleteMessage?: (id: string) => void;
  onEditMessage?: (id: string, newText: string) => void;
  onStartWriting?: () => void;
}

export const JournalStyleDisplay: React.FC<JournalStyleDisplayProps> = ({
  content,
  messages,
  images = [],
  editable = false,
  onDeleteImage,
  title,
  mood,
  moodLabel,
  tags,
  isFavorite,
  dateStr,
  activeStyleOverride = 'auto',
  onDeleteMessage,
  onEditMessage,
  onStartWriting
}) => {
  const [editingMsgId, setEditingMsgId] = useState<string | null>(null);
  const [editingMsgText, setEditingMsgText] = useState('');

  // 1. Determine effective messages list
  const effectiveMessages: JournalMessageItem[] = React.useMemo(() => {
    if (messages && messages.length > 0) {
      return messages;
    }
    if (!content.trim()) return [];
    
    // Split plain content by double newlines into blocks
    const chunks = content.split(/\n\n+/).filter((c) => c.trim().length > 0);
    return chunks.map((chunk, idx) => ({
      id: `chunk-${idx}`,
      time: idx === 0 ? 'Hôm nay' : `Ghi chép #${idx + 1}`,
      text: chunk.trim()
    }));
  }, [messages, content]);

  const totalWords = React.useMemo(() => {
    return content.trim().split(/\s+/).filter(Boolean).length;
  }, [content]);

  // 2. Determine effective style
  const detectedStyle: 'chat' | 'paper' | 'memory' | 'minimal' = React.useMemo(() => {
    if (activeStyleOverride && activeStyleOverride !== 'auto') {
      return activeStyleOverride;
    }
    // Style C: Memory card (if favorite, tagged #memory or #goodday, or has title)
    if (isFavorite || tags.includes('#memory') || tags.includes('#goodday') || (title && title.trim().length > 0)) {
      return 'memory';
    }
    // Style D: Minimal day (<= 12 words, 1 message, no photos)
    if (totalWords <= 12 && effectiveMessages.length <= 1 && images.length === 0) {
      return 'minimal';
    }
    // Style A: Chat Diary (>= 2 messages / chunks)
    if (effectiveMessages.length >= 2) {
      return 'chat';
    }
    // Style B: Paper Note (single longer chunk or photos)
    return 'paper';
  }, [activeStyleOverride, isFavorite, tags, title, totalWords, effectiveMessages.length, images.length]);

  const handleStartEdit = (msg: JournalMessageItem) => {
    setEditingMsgId(msg.id);
    setEditingMsgText(msg.text);
  };

  const handleSaveEdit = (id: string) => {
    if (onEditMessage && editingMsgText.trim()) {
      onEditMessage(id, editingMsgText.trim());
    }
    setEditingMsgId(null);
  };

  // EMPTY STATE (Section 12) - Only when no text, no title, no mood AND no photos
  if (effectiveMessages.length === 0 && !title && !mood && images.length === 0) {
    return (
      <div className="py-12 px-4 text-center space-y-4 max-w-sm mx-auto">
        <div className="w-16 h-16 rounded-3xl bg-stone-100/90 border border-stone-200/80 flex items-center justify-center mx-auto text-2xl shadow-2xs select-none">
          🌱
        </div>
        <div className="space-y-1.5">
          <h4 className="font-extrabold text-stone-800 text-base">
            Ngày này vẫn còn trắng.
          </h4>
          <p className="text-xs text-stone-500 font-medium">
            Muốn để lại một chút gì ở đây không?
          </p>
        </div>
        {onStartWriting && (
          <button
            type="button"
            onClick={onStartWriting}
            className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5 active:scale-95"
          >
            <span>✍️ Viết vài dòng</span>
          </button>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // STYLE A — CHAT DIARY (Cuộc trò chuyện với chính mình)
  // -------------------------------------------------------------
  if (detectedStyle === 'chat') {
    return (
      <div className="space-y-4 max-w-2xl mx-auto py-2">
        <div className="flex items-center justify-between pb-1 border-b border-stone-100/80 text-[11px] text-stone-400 font-medium">
          <span>💬 Trò chuyện cùng chính mình trong ngày</span>
          <span>{effectiveMessages.length} tin nhắn</span>
        </div>

        {/* Photos in Chat style */}
        {images.length > 0 && (
          <div className="mb-3">
            <JournalImageGallery
              images={images}
              editable={editable}
              onDeleteImage={onDeleteImage}
              dateFormatted={dateStr}
            />
          </div>
        )}

        <div className="space-y-3.5">
          {effectiveMessages.map((msg) => {
            const isEditingThis = editingMsgId === msg.id;

            return (
              <div
                key={msg.id}
                className="group flex flex-col items-end sm:items-start space-y-1 transition-all"
              >
                {/* Timestamp & actions bar on hover */}
                <div className="flex items-center justify-between w-full px-1 text-[11px] text-stone-400">
                  <span className="font-semibold">{msg.time}</span>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!isEditingThis && onEditMessage && (
                      <button
                        type="button"
                        onClick={() => handleStartEdit(msg)}
                        title="Sửa tin nhắn này"
                        className="text-stone-400 hover:text-stone-700 p-0.5 cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    )}
                    {!isEditingThis && onDeleteMessage && (
                      <button
                        type="button"
                        onClick={() => onDeleteMessage(msg.id)}
                        title="Xóa tin nhắn này"
                        className="text-stone-400 hover:text-rose-600 p-0.5 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Message Bubble */}
                {isEditingThis ? (
                  <div className="w-full p-3 rounded-2xl bg-white border border-stone-300 shadow-sm space-y-2">
                    <textarea
                      value={editingMsgText}
                      onChange={(e) => setEditingMsgText(e.target.value)}
                      rows={3}
                      className="w-full text-xs sm:text-sm text-stone-800 focus:outline-hidden resize-none bg-transparent"
                    />
                    <div className="flex items-center justify-end gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => setEditingMsgId(null)}
                        className="px-2 py-1 rounded-lg text-xs font-semibold text-stone-500 hover:bg-stone-100"
                      >
                        Hủy
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(msg.id)}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold bg-stone-900 text-white flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        <span>Lưu</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="max-w-[90%] sm:max-w-[85%] p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-white/95 border border-stone-200/80 shadow-2xs text-xs sm:text-sm text-stone-800 leading-relaxed font-medium whitespace-pre-wrap">
                    {msg.text}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // STYLE C — MEMORY CARD (Kỷ niệm đáng nhớ)
  // -------------------------------------------------------------
  if (detectedStyle === 'memory') {
    const mainText = effectiveMessages.map((m) => m.text).join('\n\n') || content;
    const highlightQuote = mainText.split('\n')[0] || mainText;

    return (
      <div className="py-2 max-w-xl mx-auto">
        <div className="relative rounded-3xl bg-gradient-to-b from-amber-50/70 via-white to-amber-50/40 p-6 sm:p-8 border border-amber-200/80 shadow-xs space-y-5">
          {/* Decorative scrapbook bookmark / badge */}
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 text-amber-900 text-xs font-bold border border-amber-300/80">
              <Heart className="w-3.5 h-3.5 fill-current text-amber-600" />
              <span>Kỷ niệm đáng nhớ</span>
            </div>

            {mood && (
              <span className="text-2xl drop-shadow-2xs select-none">
                {mood}
              </span>
            )}
          </div>

          {/* Title or Highlight Quote */}
          <div className="space-y-2">
            {title ? (
              <h3 className="text-lg sm:text-xl font-black text-stone-900 tracking-tight">
                {title}
              </h3>
            ) : null}

            {highlightQuote && (
              <div className="p-4 rounded-2xl bg-white/90 border border-amber-100/90 text-sm sm:text-base font-semibold text-amber-950 italic leading-relaxed">
                “{highlightQuote}”
              </div>
            )}
          </div>

          {/* Photos in Memory style */}
          {images.length > 0 && (
            <div className="pt-1">
              <JournalImageGallery
                images={images}
                editable={editable}
                onDeleteImage={onDeleteImage}
                dateFormatted={dateStr}
              />
            </div>
          )}

          {/* Full Content if longer */}
          {mainText && mainText !== highlightQuote && (
            <div className="text-xs sm:text-sm text-stone-700 leading-relaxed whitespace-pre-wrap font-medium pt-2 border-t border-amber-100">
              {mainText}
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-2">
              {tags.map((t, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-full bg-amber-100/60 text-amber-900 text-[11px] font-semibold"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // STYLE D — MINIMAL DAY (Tối giản, khoảng trống thanh lịch)
  // -------------------------------------------------------------
  if (detectedStyle === 'minimal') {
    const shortText = effectiveMessages.map((m) => m.text).join(' ') || content;

    return (
      <div className="py-8 sm:py-12 px-6 max-w-md mx-auto text-center space-y-4">
        {mood && (
          <div className="text-3xl select-none mx-auto drop-shadow-2xs">
            {mood}
          </div>
        )}

        {/* Photos in Minimal style */}
        {images.length > 0 && (
          <div className="text-left my-3">
            <JournalImageGallery
              images={images}
              editable={editable}
              onDeleteImage={onDeleteImage}
              dateFormatted={dateStr}
            />
          </div>
        )}

        {shortText && (
          <div className="text-base sm:text-lg font-bold text-stone-800 leading-relaxed tracking-tight px-4">
            “{shortText}”
          </div>
        )}

        {tags.length > 0 && (
          <div className="flex items-center justify-center gap-1.5 pt-2">
            {tags.map((t, idx) => (
              <span
                key={idx}
                className="text-[11px] text-stone-400 font-medium"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // STYLE B — PAPER NOTE (Trang vở ghi chép kỹ thuật số)
  // -------------------------------------------------------------
  const fullText = effectiveMessages.map((m) => m.text).join('\n\n') || content;

  return (
    <div className="max-w-xl mx-auto py-2">
      <div className="rounded-3xl bg-white/95 border border-stone-200/90 p-6 sm:p-7 shadow-2xs space-y-4">
        {title && (
          <h3 className="text-base sm:text-lg font-black text-stone-900 border-b border-stone-100 pb-2">
            {title}
          </h3>
        )}

        {/* Photos in Paper Note style */}
        {images.length > 0 && (
          <div className="mb-4">
            <JournalImageGallery
              images={images}
              editable={editable}
              onDeleteImage={onDeleteImage}
              dateFormatted={dateStr}
            />
          </div>
        )}

        {fullText && (
          <div className="text-xs sm:text-sm text-stone-800 leading-relaxed whitespace-pre-wrap font-medium">
            {fullText}
          </div>
        )}

        {tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-stone-100 text-xs">
            {tags.map((t, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[11px] font-semibold"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

