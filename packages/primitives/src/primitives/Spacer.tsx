import React from 'react';
import clsx from 'clsx';
import type { SpacerProps } from './types';
import { spacing } from '../tokens/spacing';

/**
 * Spacer primitive - Empty space component
 * Fixed size or flexible (fills available space)
 */
export function Spacer({
  size = 'flex',
  direction = 'vertical',
  className,
  style,
}: SpacerProps) {
  const isFlexible = size === 'flex';

  const computedStyle: React.CSSProperties = {
    ...(isFlexible
      ? {
          flex: 1,
          minWidth: 0,
          minHeight: 0,
        }
      : direction === 'vertical'
        ? {
            height: spacing[size],
            width: '100%',
          }
        : {
            width: spacing[size],
            height: '100%',
          }),
    ...style,
  };

  return (
    <div
      className={clsx('swiss-spacer', isFlexible && 'swiss-spacer--flex', className)}
      style={computedStyle}
      aria-hidden="true"
    />
  );
}
