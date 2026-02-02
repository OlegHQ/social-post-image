'use client';

import { useRef } from 'react';
import { LayoutRenderer } from '@/components/composer';
import { useDesign } from '@/context/DesignContext';
import { useExport } from '@/hooks/useExport';
import styles from './LivePreview.module.css';

export function LivePreview() {
  const {
    state,
    activeDesign,
    displayedDefinition,
    toggleGrid,
    setPreviewScale,
    selectNode,
    nudgeNode,
  } = useDesign();
  const { exportImage, isExporting } = useExport();
  const canvasRef = useRef<HTMLDivElement>(null);

  const dragRef = useRef<{ nodeId: string; startX: number; startY: number } | null>(null);

  const handleExport = async () => {
    if (canvasRef.current) {
      const canvasElement = canvasRef.current.querySelector('.swiss-canvas') as HTMLElement;
      if (canvasElement) {
        await exportImage(canvasElement, {
          format: 'png',
          scale: 2,
          filename: displayedDefinition.name || 'swiss-poster',
        });
      }
    }
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (state.previewDefinition) return;
    const target = e.target as HTMLElement | null;
    const el = target?.closest?.('[data-node-id]') as HTMLElement | null;
    const nodeId = el?.dataset?.nodeId;
    if (!nodeId) {
      selectNode(null);
      return;
    }

    selectNode(nodeId);
    dragRef.current = { nodeId, startX: e.clientX, startY: e.clientY };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    if (activeDesign.selectedNodeId !== dragRef.current.nodeId) return;

    const dx = (e.clientX - dragRef.current.startX) / state.previewScale;
    const dy = (e.clientY - dragRef.current.startY) / state.previewScale;
    if (dx === 0 && dy === 0) return;

    dragRef.current.startX = e.clientX;
    dragRef.current.startY = e.clientY;
    nudgeNode(dragRef.current.nodeId, dx, dy);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    dragRef.current = null;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
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
        <div
          ref={canvasRef}
          className={styles.canvasWrapper}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          {activeDesign.selectedNodeId && (
            <style>{`
              [data-node-id="${activeDesign.selectedNodeId.replace(/"/g, '\\"')}"] {
                outline: 2px solid rgba(255, 0, 0, 0.9);
                outline-offset: 2px;
              }
            `}</style>
          )}
          <LayoutRenderer
            definition={displayedDefinition}
            showGrid={state.showGrid}
            scale={state.previewScale}
          />
        </div>
      </div>
    </div>
  );
}
