import React from 'react';
import clsx from 'clsx';
import type { SeriesNumberProps } from './types';
import { typography } from '@/lib/tokens/typography';

// Size mappings
const sizeMap = {
  sm: '48px',
  md: '72px',
  lg: '96px',
  xl: '120px',
};

/**
 * SeriesNumber primitive - Large number display
 * Used for series/post numbering (01, 02, etc.)
 */
export function SeriesNumber({
  number,
  size = 'md',
  color,
  padZero = true,
  className,
  style,
  dataNodeId,
}: SeriesNumberProps) {
  // Format number - pad with zero if needed
  const displayNumber =
    typeof number === 'number' && padZero && number < 10
      ? `0${number}`
      : String(number);

  const computedStyle: React.CSSProperties = {
    fontSize: sizeMap[size],
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeight.regular,
    lineHeight: 1,
    letterSpacing: typography.letterSpacing.tight,
    color: color
      ? color.startsWith('#') || color.startsWith('rgb')
        ? color
        : `var(--color-${color})`
      : 'var(--color-accent)',
    margin: 0,
    ...style,
  };

  return (
    <div className={clsx('swiss-series-number', className)} style={computedStyle} data-node-id={dataNodeId}>
      {displayNumber}
    </div>
  );
}
