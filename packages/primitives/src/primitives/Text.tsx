import React from 'react';
import clsx from 'clsx';
import type { TextProps, TextVariant } from './types';
import { typography } from '../tokens/typography';

// Style mappings for each variant
const variantStyles: Record<TextVariant, React.CSSProperties> = {
  hero: {
    fontSize: typography.fontSize['5xl'],
    fontWeight: typography.fontWeight.black,
    lineHeight: typography.lineHeight.none,
    letterSpacing: typography.letterSpacing.tighter,
    textTransform: 'uppercase',
  },
  display: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.black,
    lineHeight: typography.lineHeight.tight,
    letterSpacing: typography.letterSpacing.tight,
  },
  headline: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.black,
    lineHeight: typography.lineHeight.tight,
    letterSpacing: typography.letterSpacing.tight,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.lineHeight.snug,
  },
  subhead: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.regular,
    lineHeight: typography.lineHeight.snug,
  },
  body: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.regular,
    lineHeight: typography.lineHeight.normal,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.lineHeight.normal,
    letterSpacing: typography.letterSpacing.wide,
    textTransform: 'uppercase',
  },
  meta: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.regular,
    lineHeight: typography.lineHeight.relaxed,
  },
  number: {
    fontSize: '72px',
    fontWeight: typography.fontWeight.regular,
    lineHeight: 1,
    letterSpacing: typography.letterSpacing.tight,
  },
};

/**
 * Text primitive - Core typography component
 * Follows Swiss design principles: left-aligned, strong hierarchy
 */
export function Text({
  children,
  variant = 'body',
  color,
  uppercase,
  italic,
  align = 'left',
  maxWidth,
  as: Component = 'p',
  className,
  style,
}: TextProps) {
  const baseStyles = variantStyles[variant];

  const computedStyle: React.CSSProperties = {
    ...baseStyles,
    fontFamily: typography.fontFamily.primary,
    textAlign: align,
    margin: 0,
    // Color handling - use CSS variable if token, otherwise direct value
    color: color
      ? color.startsWith('#') || color.startsWith('rgb')
        ? color
        : `var(--color-${color})`
      : 'var(--color-foreground)',
    // Override text-transform if uppercase prop is explicitly set
    textTransform: uppercase !== undefined
      ? uppercase ? 'uppercase' : 'none'
      : baseStyles.textTransform,
    fontStyle: italic ? 'italic' : 'normal',
    maxWidth: maxWidth,
    ...style,
  };

  return (
    <Component className={clsx('swiss-text', `swiss-text--${variant}`, className)} style={computedStyle}>
      {children}
    </Component>
  );
}
