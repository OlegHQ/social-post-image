import styles from '../Editor.module.css';

interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  helpText?: string;
  required?: boolean;
  min?: number;
  max?: number;
}

export function NumberField({
  label,
  value,
  onChange,
  placeholder,
  helpText,
  required,
  min,
  max,
}: NumberFieldProps) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>
        {label}
        {required && <span className={styles.required}>*</span>}
      </label>
      <input
        type="number"
        className={styles.input}
        value={value ?? ''}
        onChange={(e) => onChange(Number(e.target.value))}
        placeholder={placeholder}
        min={min}
        max={max}
      />
      {helpText && <span className={styles.helpText}>{helpText}</span>}
    </div>
  );
}
