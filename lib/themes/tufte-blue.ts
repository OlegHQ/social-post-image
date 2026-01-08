import type { Theme } from './types';

/**
 * Tufte Blue Theme
 * Solid blue background for two-tone typography
 * Inspired by: Edward Tufte quote posters
 */
export const tufteBlue: Theme = {
  id: 'tufte-blue',
  name: 'Tufte Blue',
  colors: {
    background: '#3498DB',
    foreground: '#000000',
    accent: '#FFFFFF',
    accentAlt: '#000000',
    muted: 'rgba(0,0,0,0.6)',
  },
};
