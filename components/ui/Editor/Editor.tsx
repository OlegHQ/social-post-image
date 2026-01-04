'use client';

import { useDesign } from '@/context/DesignContext';
import { presetSchemas } from '@/schemas/presetSchemas';
import { FieldRenderer } from './FieldRenderer';
import styles from './Editor.module.css';

export function Editor() {
  const { state, updatePresetOption } = useDesign();
  const { activePreset, presetOptions } = state;

  if (!activePreset) {
    return (
      <div className={styles.editor}>
        <div className={styles.emptyState}>
          <p>Select a preset to start editing</p>
        </div>
      </div>
    );
  }

  const schema = presetSchemas[activePreset];
  if (!schema) {
    return (
      <div className={styles.editor}>
        <div className={styles.emptyState}>
          <p>Unknown preset: {activePreset}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.editor}>
      <div className={styles.header}>
        <h3 className={styles.title}>Content</h3>
        <p className={styles.description}>{schema.description}</p>
      </div>

      <div className={styles.fields}>
        {schema.fields.map((field) => (
          <FieldRenderer
            key={field.key}
            field={field}
            value={presetOptions[field.key]}
            onChange={(value) => updatePresetOption(field.key, value)}
          />
        ))}
      </div>
    </div>
  );
}
