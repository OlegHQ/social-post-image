'use client';

import type { CanvasPreset } from '@/lib/types';
import { useDesign } from '@/context/DesignContext';
import styles from './Sidebar.module.css';

const canvasOptions: Array<{ id: CanvasPreset; name: string; dimensions: string }> = [
  { id: 'linkedin-portrait', name: 'LinkedIn Portrait', dimensions: '1080 x 1350' },
  { id: 'linkedin-square', name: 'LinkedIn Square', dimensions: '1080 x 1080' },
  { id: 'instagram-portrait', name: 'Instagram Portrait', dimensions: '1080 x 1350' },
  { id: 'instagram-square', name: 'Instagram Square', dimensions: '1080 x 1080' },
  { id: 'twitter', name: 'Twitter', dimensions: '1200 x 675' },
];

export function CanvasSelector() {
  const { state, setCanvas } = useDesign();
  const currentCanvas = state.definition.canvas.preset || 'linkedin-portrait';

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Canvas Size</h3>
      <div className={styles.canvasList}>
        {canvasOptions.map((option) => (
          <button
            key={option.id}
            className={`${styles.canvasOption} ${currentCanvas === option.id ? styles.canvasOptionActive : ''}`}
            onClick={() => setCanvas(option.id)}
          >
            <span className={styles.canvasName}>{option.name}</span>
            <span className={styles.canvasDimensions}>{option.dimensions}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
