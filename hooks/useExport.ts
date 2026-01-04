'use client';

import { useCallback, useState } from 'react';
import { toPng, toJpeg } from 'html-to-image';

export interface ExportOptions {
  format?: 'png' | 'jpeg';
  quality?: number;
  scale?: number;
  filename?: string;
}

export function useExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportImage = useCallback(
    async (element: HTMLElement, options: ExportOptions = {}) => {
      const {
        format = 'png',
        quality = 1,
        scale = 2,
        filename = `swiss-poster-${Date.now()}`,
      } = options;

      setIsExporting(true);
      setError(null);

      try {
        const width = parseInt(element.dataset.width || '1080', 10);
        const height = parseInt(element.dataset.height || '1350', 10);

        const exportFn = format === 'png' ? toPng : toJpeg;

        const dataUrl = await exportFn(element, {
          width: width,
          height: height,
          pixelRatio: scale,
          quality: format === 'jpeg' ? quality : undefined,
          style: {
            transform: 'scale(1)',
            transformOrigin: 'top left',
          },
        });

        const link = document.createElement('a');
        link.download = `${filename}.${format}`;
        link.href = dataUrl;
        link.click();

        setIsExporting(false);
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Export failed';
        setError(message);
        setIsExporting(false);
        return false;
      }
    },
    []
  );

  return { exportImage, isExporting, error };
}
