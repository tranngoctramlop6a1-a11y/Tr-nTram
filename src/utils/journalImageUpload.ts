import { JournalImageItem } from '../types';

/**
 * Resizes and compresses an image file using an offscreen canvas.
 * Keeps resolution high (up to 1600px) while reducing payload to ~200-400KB.
 */
export async function compressJournalImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    // Basic file type validation
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      reject(new Error('Chỉ hỗ trợ ảnh định dạng JPG, JPEG, PNG hoặc WEBP.'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Không thể đọc tệp ảnh từ thiết bị.'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Tệp ảnh bị lỗi hoặc không hợp lệ.'));
      img.onload = () => {
        try {
          const maxDim = 1600;
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            // Fallback to raw data url if canvas context unavailable
            resolve(e.target?.result as string);
            return;
          }

          // Draw image onto canvas
          ctx.drawImage(img, 0, 0, width, height);

          // Choose output mime type
          let outputType = 'image/jpeg';
          let quality = 0.85;
          if (file.type === 'image/webp') {
            outputType = 'image/webp';
          } else if (file.type === 'image/png') {
            // Check if png has transparency or use webp/jpeg if huge
            outputType = 'image/png';
          }

          const dataUrl = canvas.toDataURL(outputType, quality);
          resolve(dataUrl);
        } catch (err) {
          // Fallback to raw data url if canvas fails
          resolve(e.target?.result as string);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads a compressed image to backend storage (/api/journal/upload)
 */
export async function uploadJournalImage(
  file: File,
  token?: string | null,
  caption?: string
): Promise<JournalImageItem> {
  const compressedBase64 = await compressJournalImage(file);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch('/api/journal/upload', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      image: compressedBase64,
      filename: file.name,
      caption: caption || ''
    })
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || 'Ảnh chưa được thêm thành công. Thử lại nhé.');
  }

  const data = await response.json();
  if (!data.success || !data.image) {
    throw new Error(data.error || 'Ảnh chưa được thêm thành công. Thử lại nhé.');
  }

  return data.image;
}
