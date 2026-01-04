import type { FieldSchema } from '../../../schemas/presetSchemas';
import { FieldRenderer } from '../FieldRenderer';
import styles from '../Editor.module.css';

interface ArrayFieldProps {
  label: string;
  value: unknown[];
  onChange: (value: unknown[]) => void;
  itemSchema: FieldSchema[];
  helpText?: string;
}

export function ArrayField({
  label,
  value = [],
  onChange,
  itemSchema,
  helpText,
}: ArrayFieldProps) {
  const addItem = () => {
    const newItem = itemSchema.reduce(
      (acc, field) => ({
        ...acc,
        [field.key]: field.defaultValue ?? '',
      }),
      {}
    );
    onChange([...value, newItem]);
  };

  const removeItem = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, key: string, newValue: unknown) => {
    const newArray = [...value];
    newArray[index] = { ...(newArray[index] as object), [key]: newValue };
    onChange(newArray);
  };

  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      {helpText && <span className={styles.helpText}>{helpText}</span>}

      <div className={styles.arrayItems}>
        {value.map((item, index) => (
          <div key={index} className={styles.arrayItem}>
            <div className={styles.arrayItemFields}>
              {itemSchema.map((field) => (
                <div key={field.key} className={styles.arrayItemField}>
                  <FieldRenderer
                    field={field}
                    value={(item as Record<string, unknown>)[field.key]}
                    onChange={(val) => updateItem(index, field.key, val)}
                    compact
                  />
                </div>
              ))}
            </div>
            <button
              type="button"
              className={styles.removeButton}
              onClick={() => removeItem(index)}
              aria-label="Remove item"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <button type="button" className={styles.addButton} onClick={addItem}>
        + Add {label.replace(/s$/, '')}
      </button>
    </div>
  );
}
