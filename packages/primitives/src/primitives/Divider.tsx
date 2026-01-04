import React from 'react';
import clsx from 'clsx';
import type { DividerProps } from './types';
import { spacing } from '../tokens/spacing';

// Thickness in pixels
const thicknessMap = {
  thin: '1px',
  medium: '2px',
  thick: '4px',
};

/**
 * Divider primitive - Horizontal rule
 * Swiss-style separator line
 */
export function Divider({
  color,
  thickness = 'medium',
  margin,
  className,
  style,
}: DividerProps) {
  const computedStyle: React.CSSProperties = {
    width: '100%',
    height: thicknessMap[thickness],
    backgroundColor: color
      ? color.startsWith('#') || color.startsWith('rgb')
        ? color
        : `var(--color-${color})`
      : 'var(--color-foreground)',
    border: 'none',
    margin: margin ? `${spacing[margin]} 0` : 0,
    ...style,
  };

  return (
    <hr className={clsx('swiss-divider', className)} style={computedStyle} />
  );
}
