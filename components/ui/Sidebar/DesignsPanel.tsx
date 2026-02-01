'use client';

import { useDesign } from '@/context/DesignContext';
import styles from './Sidebar.module.css';

export function DesignsPanel() {
  const { state, activeDesign, setActiveDesign } = useDesign();

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Designs</h3>
      <div className={styles.presetList}>
        {state.designs.map((d, index) => (
          <button
            key={d.id}
            type="button"
            className={`${styles.presetButton} ${activeDesign.id === d.id ? styles.presetButtonActive : ''}`}
            onClick={() => setActiveDesign(d.id)}
            title={d.activePreset}
          >
            <span className={styles.presetName}>{d.name || `Design ${index + 1}`}</span>
            <span className={styles.presetDescription}>{d.activePreset}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
