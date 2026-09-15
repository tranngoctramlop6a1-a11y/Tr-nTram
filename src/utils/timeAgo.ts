/**
 * Utility for formatting real-time timestamps
 * Strictly respects actual time elapsed:
 * < 1 phút: "vừa xong"
 * 1–59 phút: "X phút trước"
 * 1–23 giờ: "X giờ trước"
 * 1–6 ngày: "X ngày trước"
 * >= 7 ngày: formatted as "dd/MM/yyyy" (e.g. 15/09/2026)
 * No hardcoded fake time strings.
 */

export function formatRealTimeAgo(timestamp: string | number | Date | undefined | null): string {
  if (!timestamp) return 'vừa xong';

  const date = new Date(timestamp);
  if (isNaN(date.getTime())) {
    return 'vừa xong';
  }

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  // If timestamp is slightly in the future due to clock drift, or less than 60 seconds ago
  if (diffMs < 60 * 1000) {
    return 'vừa xong';
  }

  const diffMinutes = Math.floor(diffMs / (60 * 1000));
  if (diffMinutes < 60) {
    return `${diffMinutes} phút trước`;
  }

  const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
  if (diffHours < 24) {
    return `${diffHours} giờ trước`;
  }

  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  if (diffDays < 7) {
    return `${diffDays} ngày trước`;
  }

  // Format as dd/MM/yyyy
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export function formatFullDateVn(dateOrStr?: string | Date): string {
  const d = dateOrStr ? new Date(dateOrStr) : new Date();
  if (isNaN(d.getTime())) return '';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}
