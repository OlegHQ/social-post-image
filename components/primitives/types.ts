/**
 * Swiss Design System - Primitive Types
 */

import type { SpacingKey } from '@/lib/tokens/spacing';
import type { ColorToken } from '@/lib/themes/types';

// Text variants with their corresponding styles
export type TextVariant =
  | 'hero'      // 120px, black weight, tight tracking, uppercase
  | 'display'   // 90px, black weight, tight tracking
  | 'headline'  // 67px, black weight
  | 'title'     // 50px, bold weight
  | 'subhead'   // 38px, regular weight
  | 'body'      // 21px, regular weight
  | 'label'     // 16px, bold, wide tracking, uppercase
  | 'meta'      // 12px, regular
  | 'number';   // 72px, regular weight (for series numbers)

// Border thickness options
export type BorderThickness = 'thin' | 'medium' | 'thick';

// Color value can be a token or custom hex
export type ColorValue = ColorToken | string;

// Common primitive props
export interface PrimitiveProps {
  className?: string;
  style?: React.CSSProperties;
}

// Text component props
export interface TextProps extends PrimitiveProps {
  children: React.ReactNode;
  variant?: TextVariant;
  color?: ColorValue;
  uppercase?: boolean;
  italic?: boolean;
  align?: 'left' | 'right' | 'center';
  maxWidth?: string;
  as?: 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div';
}

// Box component props
export interface BoxProps extends PrimitiveProps {
  children?: React.ReactNode;
  padding?: SpacingKey;
  paddingX?: SpacingKey;
  paddingY?: SpacingKey;
  color?: ColorValue;
  border?: boolean;
  borderWidth?: BorderThickness;
  borderColor?: ColorValue;
  width?: string;
  height?: string;
  minHeight?: string;
}

// Stack component props
export interface StackProps extends PrimitiveProps {
  children: React.ReactNode;
  direction?: 'vertical' | 'horizontal';
  gap?: SpacingKey;
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  wrap?: boolean;
  flex?: number | string;
}

// Grid component props
export interface GridProps extends PrimitiveProps {
  children: React.ReactNode;
  columns?: number | string;
  rows?: string;
  gap?: SpacingKey;
  columnGap?: SpacingKey;
  rowGap?: SpacingKey;
  areas?: string;
}

// Divider component props
export interface DividerProps extends PrimitiveProps {
  color?: ColorValue;
  thickness?: BorderThickness;
  margin?: SpacingKey;
}

// Spacer component props
export interface SpacerProps extends PrimitiveProps {
  size?: SpacingKey | 'flex';
  direction?: 'vertical' | 'horizontal';
}

// SeriesNumber component props
export interface SeriesNumberProps extends PrimitiveProps {
  number: number | string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: ColorValue;
  padZero?: boolean;
}

// SeriesDots component props
export interface SeriesDotsProps extends PrimitiveProps {
  filled?: number;
  total?: number;
  color?: ColorValue;
  filledColor?: ColorValue;
  size?: 'sm' | 'md' | 'lg';
  gap?: SpacingKey;
}
