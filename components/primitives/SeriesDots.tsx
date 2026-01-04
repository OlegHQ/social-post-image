import React from 'react';
import clsx from 'clsx';
import type { SeriesDotsProps } from './types';
import { spacing } from '@/lib/tokens/spacing';

// Size mappings
const sizeMap = {
  sm: '8px',
  md: '12px',
  lg: '16px',
};

/**
 * SeriesDots primitive - Dot indicators
 * Used for series progress (e.g., ●●● ●●)
 */
export function SeriesDots({
  filled = 3,
  total = 5,
  color,
  filledColor,
  size = 'md',
  gap = 2,
  className,
  style,
}: SeriesDotsProps) {
  const dotSize = sizeMap[size];

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[gap],
    ...style,
  };

  const getDotStyle = (isFilled: boolean): React.CSSProperties => ({
    width: dotSize,
    height: dotSize,
    borderRadius: '50%',
    backgroundColor: isFilled
      ? filledColor
        ? filledColor.startsWith('#') || filledColor.startsWith('rgb')
          ? filledColor
          : `var(--color-${filledColor})`
        : 'var(--color-accent)'
      : color
        ? color.startsWith('#') || color.startsWith('rgb')
          ? color
          : `var(--color-${color})`
        : 'var(--color-muted)',
    flexShrink: 0,
  });

  return (
    <div className={clsx('swiss-series-dots', className)} style={containerStyle}>
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={clsx('swiss-series-dot', i < filled && 'swiss-series-dot--filled')}
          style={getDotStyle(i < filled)}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
