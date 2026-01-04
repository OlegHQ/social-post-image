import type { FieldSchema } from '../../../schemas/presetSchemas';
import { FieldRenderer } from '../FieldRenderer';
import styles from '../Editor.module.css';

interface ObjectFieldProps {
  label: string;
  value: Record<string, unknown>;
  onChange: (value: Record<string, unknown>) => void;
  properties: FieldSchema[];
  helpText?: string;
}

export function ObjectField({
  label,
  value = {},
  onChange,
  properties,
  helpText,
}: ObjectFieldProps) {
  const updateProperty = (key: string, newValue: unknown) => {
    onChange({ ...value, [key]: newValue });
  };

  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      {helpText && <span className={styles.helpText}>{helpText}</span>}

      <div className={styles.objectProperties}>
        {properties.map((prop) => (
          <div key={prop.key} className={styles.objectProperty}>
            <FieldRenderer
              field={prop}
              value={value[prop.key]}
              onChange={(val) => updateProperty(prop.key, val)}
              compact
            />
          </div>
        ))}
      </div>
    </div>
  );
}
