import React from 'react';
import clsx from 'clsx';
import type { GridProps } from './types';
import { spacing } from '@/lib/tokens/spacing';

/**
 * Grid primitive - CSS Grid layout component
 * Enables Swiss-style 12-column grid layouts
 */
export function Grid({
  children,
  columns = 12,
  rows,
  gap,
  columnGap,
  rowGap,
  areas,
  className,
  style,
  dataNodeId,
}: GridProps) {
  const computedStyle: React.CSSProperties = {
    display: 'grid',
    // Columns - number becomes repeat(), string is used directly
    gridTemplateColumns:
      typeof columns === 'number' ? `repeat(${columns}, 1fr)` : columns,
    gridTemplateRows: rows,
    gridTemplateAreas: areas,
    // Gap handling
    gap: gap ? spacing[gap] : undefined,
    columnGap: columnGap ? spacing[columnGap] : undefined,
    rowGap: rowGap ? spacing[rowGap] : undefined,
    ...style,
  };

  return (
    <div className={clsx('swiss-grid', className)} style={computedStyle} data-node-id={dataNodeId}>
      {children}
    </div>
  );
}

// Grid Item component for positioning within grid
interface GridItemProps {
  children: React.ReactNode;
  column?: string;  // e.g., "1 / 4" or "span 3"
  row?: string;     // e.g., "1 / 2" or "span 2"
  area?: string;    // Named grid area
  className?: string;
  style?: React.CSSProperties;
}

export function GridItem({
  children,
  column,
  row,
  area,
  className,
  style,
}: GridItemProps) {
  const computedStyle: React.CSSProperties = {
    gridColumn: column,
    gridRow: row,
    gridArea: area,
    ...style,
  };

  return (
    <div className={clsx('swiss-grid-item', className)} style={computedStyle}>
      {children}
    </div>
  );
}
