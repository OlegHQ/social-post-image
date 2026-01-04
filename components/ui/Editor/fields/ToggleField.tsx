'use client';

import styles from '../Editor.module.css';

interface ToggleFieldProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  helpText?: string;
}

export function ToggleField({
  label,
  value,
  onChange,
  helpText,
}: ToggleFieldProps) {
  return (
    <div className={styles.field}>
      <div className={styles.toggleRow}>
        <button
          type="button"
          className={`${styles.toggle} ${value ? styles.toggleActive : ''}`}
          onClick={() => onChange(!value)}
          aria-pressed={value}
        >
          <span className={styles.toggleTrack}>
            <span className={styles.toggleThumb} />
          </span>
        </button>
        <label className={styles.toggleLabel}>{label}</label>
      </div>
      {helpText && <span className={styles.helpText}>{helpText}</span>}
    </div>
  );
}
