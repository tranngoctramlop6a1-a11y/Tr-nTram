/**
 * Utility functions for validating, cropping and optimizing user avatar images.
 */

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_AVATAR_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates selected file format and size
 */
export function validateAvatarFile(file: File): FileValidationResult {
  if (!file) {
    return { isValid: false, error: 'Chưa có tệp nào được chọn.' };
  }

  // Check MIME type or file extension
  const isTypeAllowed = ALLOWED_IMAGE_TYPES.includes(file.type.toLowerCase()) ||
    /\.(jpe?g|png|webp)$/i.test(file.name);

  if (!isTypeAllowed) {
    return {
      isValid: false,
      error: 'Định dạng ảnh không được hỗ trợ. Vui lòng chọn ảnh JPG, PNG hoặc WEBP.'
    };
  }

  if (file.size > MAX_AVATAR_FILE_SIZE) {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      isValid: false,
      error: `Ảnh có dung lượng ${sizeInMB}MB (vượt quá giới hạn 5MB). Bạn vui lòng chọn ảnh nhẹ hơn nhé!`
    };
  }

  return { isValid: true };
}

/**
 * Crops image to a square and resizes to target dimension (default: 320x320)
 * Returns a lightweight, high-quality base64 data URL (~25KB - 50KB)
 */
export async function processAndOptimizeAvatar(
  file: File,
  targetSize: number = 320
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error('Không thể đọc tệp ảnh từ thiết bị.'));
    };

    reader.onload = () => {
      const img = new Image();

      img.onerror = () => {
        reject(new Error('Ảnh bị lỗi hoặc không thể hiển thị.'));
      };

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = targetSize;
          canvas.height = targetSize;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Trình duyệt không hỗ trợ xử lý hình ảnh.'));
            return;
          }

          // Calculate center square crop
          const { width, height } = img;
          const minDim = Math.min(width, height);
          const startX = (width - minDim) / 2;
          const startY = (height - minDim) / 2;

          // Enable smooth image rendering
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // Draw cropped center square to target dimension
          ctx.drawImage(
            img,
            startX,
            startY,
            minDim,
            minDim,
            0,
            0,
            targetSize,
            targetSize
          );

          // Try exporting as image/webp, fallback to image/jpeg
          let dataUrl = '';
          try {
            dataUrl = canvas.toDataURL('image/webp', 0.88);
            if (!dataUrl.startsWith('data:image/webp')) {
              dataUrl = canvas.toDataURL('image/jpeg', 0.88);
            }
          } catch {
            dataUrl = canvas.toDataURL('image/jpeg', 0.88);
          }

          resolve(dataUrl);
        } catch (err: any) {
          reject(new Error(err?.message || 'Lỗi khi tối ưu hóa ảnh.'));
        }
      };

      img.src = reader.result as string;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Checks if an avatar string is an image URL (data URL, web URL, or local path)
 */
export function isImageAvatar(avatar?: string | null): boolean {
  if (!avatar) return false;
  return (
    avatar.startsWith('data:image/') ||
    avatar.startsWith('http://') ||
    avatar.startsWith('https://') ||
    avatar.startsWith('blob:') ||
    avatar.startsWith('/')
  );
}

/**
 * Generates an initial letter for default avatar
 */
export function getAvatarInitial(name?: string, id?: string): string {
  if (name && name.trim().length > 0) {
    const trimmed = name.trim();
    // Return first char uppercase
    return trimmed.charAt(0).toUpperCase();
  }
  if (id && id.trim().length > 0) {
    const cleanId = id.replace(/[^a-zA-Z0-9]/g, '');
    if (cleanId.length > 0) {
      return cleanId.charAt(0).toUpperCase();
    }
  }
  return 'U';
}
