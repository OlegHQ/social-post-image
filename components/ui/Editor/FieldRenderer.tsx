'use client';

import type { FieldSchema } from '@/schemas/presetSchemas';
import { TextField, TextAreaField, NumberField, ToggleField, ArrayField, StringArrayField, ObjectField, SelectField } from './fields';

interface FieldRendererProps {
  field: FieldSchema;
  value: unknown;
  onChange: (value: unknown) => void;
  compact?: boolean;
}

export function FieldRenderer({ field, value, onChange, compact }: FieldRendererProps) {
  const commonProps = {
    label: compact ? '' : field.label,
    value,
    onChange,
    required: field.required,
    placeholder: field.placeholder,
    helpText: compact ? undefined : field.helpText,
  };

  switch (field.type) {
    case 'text':
      return <TextField {...commonProps} value={value as string} />;

    case 'textarea':
      return <TextAreaField {...commonProps} value={value as string} />;

    case 'number':
      return <NumberField {...commonProps} value={value as number} />;

    case 'toggle':
      return (
        <ToggleField
          label={field.label}
          value={value as boolean}
          onChange={onChange as (v: boolean) => void}
          helpText={compact ? undefined : field.helpText}
        />
      );

    case 'array':
      return (
        <ArrayField
          label={field.label}
          value={value as unknown[]}
          onChange={onChange as (v: unknown[]) => void}
          itemSchema={field.itemSchema || []}
          helpText={compact ? undefined : field.helpText}
        />
      );

    case 'stringArray':
      return (
        <StringArrayField
          label={compact ? '' : field.label}
          value={value as string[]}
          onChange={onChange as (v: string[]) => void}
          placeholder={field.placeholder}
          helpText={compact ? undefined : field.helpText}
        />
      );

    case 'object':
      return (
        <ObjectField
          label={compact ? '' : field.label}
          value={value as Record<string, unknown>}
          onChange={onChange as (v: Record<string, unknown>) => void}
          properties={field.properties || []}
          helpText={compact ? undefined : field.helpText}
        />
      );

    case 'select':
      return (
        <SelectField
          label={compact ? '' : field.label}
          value={value as string}
          onChange={onChange as (v: string) => void}
          options={field.options || []}
          helpText={compact ? undefined : field.helpText}
          required={field.required}
        />
      );

    default:
      return null;
  }
}
