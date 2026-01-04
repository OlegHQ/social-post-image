import styles from '../Editor.module.css';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  helpText?: string;
  required?: boolean;
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  helpText,
  required,
}: SelectFieldProps) {
  return (
    <div className={styles.field}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <select
        className={styles.input}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {helpText && <span className={styles.helpText}>{helpText}</span>}
    </div>
  );
}
