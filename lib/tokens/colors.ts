/**
 * Swiss Design System - Color Tokens
 * Base color palette inspired by classic Swiss design and references
 */

export const baseColors = {
  // Neutrals
  white: '#FFFFFF',
  black: '#000000',

  // Grays (warm tint for Swiss feel)
  gray: {
    50: '#F5F5F5',   // Light background
    100: '#E8E8E8',
    200: '#D1D1D1',
    300: '#B0B0B0',
    400: '#888888',
    500: '#666666',  // Muted text
    600: '#555555',
    700: '#444444',
    800: '#333333',
    900: '#1A1A1A',  // Near black
  },

  // Reds (Swiss/Vignelli)
  red: {
    swiss: '#FF0000',    // Classic Swiss red
    crimson: '#C41E3A',  // Vignelli red
    coral: '#E85D4C',    // Neue Haas accent
  },

  // Blues
  blue: {
    klein: '#002FA7',    // Yves Klein blue
    navy: '#1A237E',     // Deep navy
  },

  // Golds/Creams (Vignelli tribute)
  gold: {
    vignelli: '#C9A962', // Vignelli gold accent
    cream: '#E8DCC4',    // Light gold/cream
    warmWhite: '#E8E4DD', // Warm off-white
  },

  // Teals (Neue Haas style)
  teal: {
    neue: '#1B4D4D',     // Dark teal
    light: '#7A9E9E',    // Muted teal
  },

  // Oranges
  orange: {
    bright: '#FF6600',   // Vibrant orange
    grid: '#E65C00',     // Grid system orange
  },
} as const;

export type BaseColorKey = keyof typeof baseColors;
