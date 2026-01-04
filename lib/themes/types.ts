/**
 * Swiss Design System - Theme Types
 */

export interface ThemeColors {
  background: string;
  foreground: string;
  accent: string;
  accentAlt?: string;
  muted: string;
}

export interface Theme {
  id: string;
  name: string;
  colors: ThemeColors;
}

export type ColorToken = keyof ThemeColors;

// Check if a value is a color token
export function isColorToken(value: string): value is ColorToken {
  return ['background', 'foreground', 'accent', 'accentAlt', 'muted'].includes(value);
}

// Resolve color - either from token or direct hex value
export function resolveColor(value: string | ColorToken, theme: Theme): string {
  if (isColorToken(value)) {
    return theme.colors[value] ?? theme.colors.foreground;
  }
  return value;
}
