import React from 'react';
import clsx from 'clsx';
import type { StackProps } from './types';
import { spacing } from '@/lib/tokens/spacing';

// Alignment mappings
const alignMap = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
};

const justifyMap = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
};

/**
 * Stack primitive - Flex layout component
 * Vertical or horizontal stacking with consistent gaps
 */
export function Stack({
  children,
  direction = 'vertical',
  gap,
  align = 'stretch',
  justify = 'start',
  wrap = false,
  flex,
  className,
  style,
}: StackProps) {
  const computedStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: direction === 'vertical' ? 'column' : 'row',
    alignItems: alignMap[align],
    justifyContent: justifyMap[justify],
    flexWrap: wrap ? 'wrap' : 'nowrap',
    gap: gap ? spacing[gap] : undefined,
    flex: flex,
    ...style,
  };

  return (
    <div className={clsx('swiss-stack', `swiss-stack--${direction}`, className)} style={computedStyle}>
      {children}
    </div>
  );
}
