'use client';

import { useDesign } from '@/context/DesignContext';
import styles from './Sidebar.module.css';

export function DesignsPanel() {
  const { state, activeDesign, setActiveDesign, deleteDesign } = useDesign();

  const handleDelete = (e: React.MouseEvent, designId: string) => {
    e.stopPropagation();
    if (state.designs.length > 1) {
      deleteDesign(designId);
    }
  };

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Designs</h3>
      <div className={styles.presetList}>
        {state.designs.map((d, index) => (
          <div
            key={d.id}
            className={`${styles.designItem} ${activeDesign.id === d.id ? styles.designItemActive : ''}`}
            onClick={() => setActiveDesign(d.id)}
            title={d.activePreset}
          >
            <span className={styles.presetName}>{d.name || `Design ${index + 1}`}</span>
            <span className={styles.presetDescription}>{d.activePreset}</span>
            <button
              type="button"
              className={styles.designDeleteButton}
              onClick={(e) => handleDelete(e, d.id)}
              disabled={state.designs.length <= 1}
              title={state.designs.length <= 1 ? 'Cannot delete the last design' : 'Delete design'}
            >
              x
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
