/**
 * Swiss Design System - Typography Tokens
 * Based on Perfect Fourth scale (1.333) and Swiss design principles
 */

export const typography = {
  fontFamily: {
    primary: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
  },

  // Perfect Fourth scale (1.333) - sizes in pixels
  fontSize: {
    xs: '12px',     // Metadata, captions
    sm: '16px',     // Labels, small text
    base: '21px',   // Body text
    lg: '28px',     // Subheadlines
    xl: '38px',     // Small headlines
    '2xl': '50px',  // Medium headlines
    '3xl': '67px',  // Large headlines
    '4xl': '90px',  // Display text
    '5xl': '120px', // Hero headlines
    '6xl': '160px', // Mega (single letters)
    '7xl': '200px', // Giant letterforms
  },

  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    bold: 700,
    black: 900,
  },

  lineHeight: {
    none: 0.85,    // Hero text, letters nearly touching
    tight: 0.9,    // Headlines
    snug: 1.1,     // Subheadlines
    normal: 1.4,   // Body text
    relaxed: 1.6,  // Small text, metadata
  },

  letterSpacing: {
    tighter: '-0.04em', // Hero headlines (Grotesk style)
    tight: '-0.02em',   // Headlines
    normal: '0',        // Body text
    wide: '0.05em',     // Labels
    wider: '0.1em',     // Small caps, metadata
  },
} as const;

export type FontSizeKey = keyof typeof typography.fontSize;
export type FontWeightKey = keyof typeof typography.fontWeight;
export type LineHeightKey = keyof typeof typography.lineHeight;
export type LetterSpacingKey = keyof typeof typography.letterSpacing;
