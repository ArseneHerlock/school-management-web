'use client';

/**
 * Kích hoạt rung phản hồi xúc giác (Haptic Feedback) trên thiết bị di động
 * Giúp người dùng cảm nhận rõ rệt mỗi khi bấm/chạm vào các nút hoặc thanh điều hướng.
 */
export function triggerHaptic(type: 'light' | 'medium' | 'heavy' = 'light') {
  if (typeof window === 'undefined') return;
  try {
    if ('vibrate' in navigator) {
      const duration = type === 'light' ? 14 : type === 'medium' ? 28 : 50;
      navigator.vibrate(duration);
    }
  } catch {
    // Trình duyệt không hỗ trợ Vibration API (iOS Safari hoặc Desktop), bỏ qua an toàn
  }
}
