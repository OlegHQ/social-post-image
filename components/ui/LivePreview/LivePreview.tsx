'use client';

import { useRef } from 'react';
import { LayoutRenderer } from '@/components/composer';
import { useDesign } from '@/context/DesignContext';
import { useExport } from '@/hooks/useExport';
import styles from './LivePreview.module.css';

export function LivePreview() {
  const { state, toggleGrid, setPreviewScale } = useDesign();
  const { exportImage, isExporting } = useExport();
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleExport = async () => {
    if (canvasRef.current) {
      const canvasElement = canvasRef.current.querySelector('.swiss-canvas') as HTMLElement;
      if (canvasElement) {
        await exportImage(canvasElement, {
          format: 'png',
          scale: 2,
          filename: state.definition.name || 'swiss-poster',
        });
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <button
            className={`${styles.button} ${state.showGrid ? styles.buttonActive : ''}`}
            onClick={toggleGrid}
            title="Toggle Grid"
          >
            Grid
          </button>
          <select
            className={styles.select}
            value={state.previewScale}
            onChange={(e) => setPreviewScale(parseFloat(e.target.value))}
          >
            <option value={0.25}>25%</option>
            <option value={0.5}>50%</option>
            <option value={0.75}>75%</option>
            <option value={1}>100%</option>
          </select>
        </div>
        <div className={styles.toolbarRight}>
          <button
            className={`${styles.button} ${styles.buttonPrimary}`}
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? 'Exporting...' : 'Export PNG'}
          </button>
        </div>
      </div>

      <div className={styles.canvasContainer}>
        <div ref={canvasRef} className={styles.canvasWrapper}>
          <LayoutRenderer
            definition={state.definition}
            showGrid={state.showGrid}
            scale={state.previewScale}
          />
        </div>
      </div>
    </div>
  );
}
