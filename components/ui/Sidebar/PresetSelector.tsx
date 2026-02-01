'use client';

import { useDesign } from '@/context/DesignContext';
import { presetSchemas } from '@/schemas/presetSchemas';
import styles from './Sidebar.module.css';

export function PresetSelector() {
  const { activeDesign, addDesignFromPreset } = useDesign();
  const { activePreset } = activeDesign;

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Presets</h3>
      <div className={styles.presetList}>
        {Object.values(presetSchemas).map((schema) => (
          <button
            key={schema.id}
            className={`${styles.presetButton} ${activePreset === schema.id ? styles.presetButtonActive : ''}`}
            onClick={() => addDesignFromPreset(schema.id)}
          >
            <span className={styles.presetName}>{schema.name}</span>
            <span className={styles.presetDescription}>{schema.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
