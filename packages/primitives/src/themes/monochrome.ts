import type { Theme } from './types';

/**
 * Monochrome Theme
 * Pure black and white, timeless Swiss minimalism
 * Emphasis through form, not color
 */
export const monochrome: Theme = {
  id: 'monochrome',
  name: 'Monochrome',
  colors: {
    background: '#FFFFFF',
    foreground: '#000000',
    accent: '#000000',
    muted: '#888888',
  },
};
