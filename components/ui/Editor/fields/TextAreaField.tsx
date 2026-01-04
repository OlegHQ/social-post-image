'use client';

import styles from '../Editor.module.css';

interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  helpText?: string;
  required?: boolean;
}

export function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  helpText,
  required,
}: TextAreaFieldProps) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>
        {label}
        {required && <span className={styles.required}>*</span>}
      </label>
      <textarea
        className={`${styles.input} ${styles.textarea}`}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
      />
      {helpText && <span className={styles.helpText}>{helpText}</span>}
    </div>
  );
}
