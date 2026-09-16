/**
 * Time-locked Diary (Nhật ký hẹn giờ mở lại) Utilities
 * 
 * Cung cấp logic so sánh mốc thời gian unlockDate chính xác bằng JavaScript Date,
 * tính toán số ngày còn lại và định dạng hiển thị tiếng Việt tinh tế.
 */

import { formatVietnameseDateFull } from '../data/journalData';

/**
 * Chuyển đổi chuỗi YYYY-MM-DD thành đối tượng Date theo giờ địa phương
 * tại thời điểm 00:00:00.000 để tránh sai lệch múi giờ (UTC vs Local Time).
 */
export function parseLocalDate(dateStr: string): Date {
  if (!dateStr) return new Date();
  const parts = dateStr.split('-').map((v) => parseInt(v, 10));
  if (parts.length < 3 || isNaN(parts[0]) || isNaN(parts[1]) || isNaN(parts[2])) {
    return new Date();
  }
  return new Date(parts[0], parts[1] - 1, parts[2], 0, 0, 0, 0);
}

/**
 * Lấy mốc thời gian bắt đầu của ngày hiện tại (00:00:00.000).
 */
export function getTodayLocalDate(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
}

/**
 * Lấy chuỗi định dạng YYYY-MM-DD của ngày hôm nay.
 */
export function getTodayDateString(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Lấy chuỗi định dạng YYYY-MM-DD của ngày mai (dùng làm min cho date picker).
 */
export function getTomorrowDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

/**
 * Lấy mốc thời gian mở khóa hiệu lực của bài nhật ký (ưu tiên unlockDate, dự phòng readLaterDate).
 */
export function getEffectiveUnlockDate(entry?: {
  unlockDate?: string;
  readLaterDate?: string;
} | null): string | undefined {
  if (!entry) return undefined;
  return entry.unlockDate || entry.readLaterDate;
}

/**
 * Kiểm tra xem bài nhật ký có đang ở trạng thái "Đang bị khóa" hay không.
 * Điều kiện: Có unlockDate (hoặc readLaterDate) VÀ ngày mở lớn hơn ngày hiện tại (targetDate > today).
 * Chỉ khi ngày hiện tại đã qua hoặc bằng unlockDate (targetDate <= today), bài viết mới mở khóa.
 */
export function isJournalLocked(entry?: {
  unlockDate?: string;
  readLaterDate?: string;
} | null): boolean {
  const targetDateStr = getEffectiveUnlockDate(entry);
  if (!targetDateStr) return false;

  const targetDate = parseLocalDate(targetDateStr);
  const today = getTodayLocalDate();

  // unlockDate > today: Đang bị khóa
  return targetDate.getTime() > today.getTime();
}

/**
 * Tính số ngày còn lại cho đến mốc mở khóa.
 */
export function getRemainingDays(unlockDateStr: string): number {
  const targetDate = parseLocalDate(unlockDateStr);
  const today = getTodayLocalDate();
  const diffTime = targetDate.getTime() - today.getTime();
  if (diffTime <= 0) return 0;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Định dạng khoảng thời gian còn lại dưới dạng ngôn ngữ tự nhiên tiếng Việt.
 */
export function formatRemainingTimeText(unlockDateStr: string): string {
  const days = getRemainingDays(unlockDateStr);
  if (days <= 0) return 'Đã đến ngày mở khóa';
  if (days === 1) return 'Còn 1 ngày nữa (Ngày mai)';
  if (days < 7) return `Còn ${days} ngày nữa`;
  if (days === 7) return 'Còn đúng 1 tuần nữa';
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    const rem = days % 7;
    return rem === 0 ? `Còn ${weeks} tuần nữa` : `Còn khoảng ${weeks} tuần ${rem} ngày nữa`;
  }
  const months = Math.floor(days / 30);
  return `Còn khoảng ${months} tháng nữa (${days} ngày)`;
}

/**
 * Định dạng ngày mở khóa đầy đủ bằng tiếng Việt.
 */
export function formatUnlockDateLabel(dateStr: string): string {
  return formatVietnameseDateFull(dateStr);
}
