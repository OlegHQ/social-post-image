import type { Theme } from './types';

/**
 * Swiss Red Inverted Theme
 * Bold red background with white typography
 * Inspired by: Muller-Brockmann, Opernhaus Zurich season posters
 */
export const swissRedInverted: Theme = {
  id: 'swiss-red-inverted',
  name: 'Swiss Red Inverted',
  colors: {
    background: '#E30613',
    foreground: '#FFFFFF',
    accent: '#FFFFFF',
    muted: 'rgba(255,255,255,0.75)',
  },
};
