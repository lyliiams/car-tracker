import { useCallback } from 'react';
import html2canvas from 'html2canvas';

export function useScreenshot() {
  const captureScreen = useCallback(async (): Promise<Blob> => {
    const canvas = await html2canvas(document.body);
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob from canvas'));
        }
      }, 'image/jpeg', 0.95);
    });
  }, []);

  return { captureScreen };
}