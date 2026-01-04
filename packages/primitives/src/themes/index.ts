/**
 * Swiss Design System - Theme Exports
 */

export * from './types';
export { swissRed } from './swiss-red';
export { kleinBlue } from './klein-blue';
export { monochrome } from './monochrome';
export { vignelliGold } from './vignelli-gold';
export { vignelliCream } from './vignelli-cream';
export { neueTeal } from './neue-teal';
export { orangeEnergy } from './orange-energy';
// New themes
export { midnightGold } from './midnight-gold';
export { forestContrast } from './forest-contrast';
export { brutalistConcrete } from './brutalist-concrete';
export { techTerminal } from './tech-terminal';
export { paperInk } from './paper-ink';
export { swissRedInverted } from './swiss-red-inverted';

import type { Theme } from './types';
import { swissRed } from './swiss-red';
import { kleinBlue } from './klein-blue';
import { monochrome } from './monochrome';
import { vignelliGold } from './vignelli-gold';
import { vignelliCream } from './vignelli-cream';
import { neueTeal } from './neue-teal';
import { orangeEnergy } from './orange-energy';
// New themes
import { midnightGold } from './midnight-gold';
import { forestContrast } from './forest-contrast';
import { brutalistConcrete } from './brutalist-concrete';
import { techTerminal } from './tech-terminal';
import { paperInk } from './paper-ink';
import { swissRedInverted } from './swiss-red-inverted';

// Theme registry
export const themes: Record<string, Theme> = {
  'swiss-red': swissRed,
  'klein-blue': kleinBlue,
  'monochrome': monochrome,
  'vignelli-gold': vignelliGold,
  'vignelli-cream': vignelliCream,
  'neue-teal': neueTeal,
  'orange-energy': orangeEnergy,
  // New themes
  'midnight-gold': midnightGold,
  'forest-contrast': forestContrast,
  'brutalist-concrete': brutalistConcrete,
  'tech-terminal': techTerminal,
  'paper-ink': paperInk,
  'swiss-red-inverted': swissRedInverted,
};

export type ThemePreset = keyof typeof themes;

// Get theme by ID
export function getTheme(id: ThemePreset | string): Theme {
  const theme = themes[id];
  if (!theme) {
    console.warn(`Theme "${id}" not found, falling back to swiss-red`);
    return swissRed;
  }
  return theme;
}

// Create custom theme with overrides
export function createTheme(
  baseId: ThemePreset | string,
  overrides: Partial<Theme['colors']>
): Theme {
  const base = getTheme(baseId);
  return {
    id: `${base.id}-custom`,
    name: `${base.name} (Custom)`,
    colors: {
      ...base.colors,
      ...overrides,
    },
  };
}

// Generate CSS custom properties from theme
export function generateThemeCSS(theme: Theme): string {
  return `
    --color-background: ${theme.colors.background};
    --color-foreground: ${theme.colors.foreground};
    --color-accent: ${theme.colors.accent};
    --color-accent-alt: ${theme.colors.accentAlt || theme.colors.accent};
    --color-muted: ${theme.colors.muted};
  `;
}
