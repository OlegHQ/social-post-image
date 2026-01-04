'use client';

import styles from '../Editor.module.css';

interface StringArrayFieldProps {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  helpText?: string;
}

export function StringArrayField({
  label,
  value = [],
  onChange,
  placeholder,
  helpText,
}: StringArrayFieldProps) {
  const addItem = () => {
    onChange([...value, '']);
  };

  const removeItem = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, newValue: string) => {
    const newArray = [...value];
    newArray[index] = newValue;
    onChange(newArray);
  };

  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      {helpText && <span className={styles.helpText}>{helpText}</span>}

      <div className={styles.arrayItems}>
        {value.map((item, index) => (
          <div key={index} className={styles.arrayItem}>
            <input
              type="text"
              className={styles.input}
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
              placeholder={placeholder}
            />
            <button
              type="button"
              className={styles.removeButton}
              onClick={() => removeItem(index)}
              aria-label="Remove item"
            >
              x
            </button>
          </div>
        ))}
      </div>

      <button type="button" className={styles.addButton} onClick={addItem}>
        + Add Item
      </button>
    </div>
  );
}
