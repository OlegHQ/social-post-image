import React from 'react';
import clsx from 'clsx';
import type { BoxProps } from './types';
import { spacing } from '../tokens/spacing';

// Border thickness in pixels
const borderWidths = {
  thin: '1px',
  medium: '2px',
  thick: '4px',
};

/**
 * Box primitive - Container component
 * Used for backgrounds, borders, padding, and containing other elements
 */
export function Box({
  children,
  padding,
  paddingX,
  paddingY,
  color,
  border,
  borderWidth = 'medium',
  borderColor,
  width,
  height,
  minHeight,
  className,
  style,
}: BoxProps) {
  const computedStyle: React.CSSProperties = {
    // Padding
    ...(padding && { padding: spacing[padding] }),
    ...(paddingX && {
      paddingLeft: spacing[paddingX],
      paddingRight: spacing[paddingX],
    }),
    ...(paddingY && {
      paddingTop: spacing[paddingY],
      paddingBottom: spacing[paddingY],
    }),
    // Background color
    backgroundColor: color
      ? color.startsWith('#') || color.startsWith('rgb')
        ? color
        : `var(--color-${color})`
      : undefined,
    // Border
    ...(border && {
      border: `${borderWidths[borderWidth]} solid ${
        borderColor
          ? borderColor.startsWith('#') || borderColor.startsWith('rgb')
            ? borderColor
            : `var(--color-${borderColor})`
          : 'var(--color-foreground)'
      }`,
    }),
    // Dimensions
    width,
    height,
    minHeight,
    // Box sizing
    boxSizing: 'border-box',
    ...style,
  };

  return (
    <div className={clsx('swiss-box', className)} style={computedStyle}>
      {children}
    </div>
  );
}
