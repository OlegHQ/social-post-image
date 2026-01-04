/**
 * Swiss Design System - Canvas Presets
 * Standard social media image dimensions
 */

export interface CanvasConfig {
  width: number;
  height: number;
  padding: number;
  columns: number;
  gap: number;
}

export const canvasPresets = {
  // LinkedIn formats
  'linkedin-portrait': {
    width: 1080,
    height: 1350,
    padding: 60,
    columns: 12,
    gap: 20,
  },
  'linkedin-square': {
    width: 1080,
    height: 1080,
    padding: 54,
    columns: 12,
    gap: 18,
  },
  'linkedin-landscape': {
    width: 1200,
    height: 627,
    padding: 48,
    columns: 12,
    gap: 16,
  },

  // Twitter format
  'twitter': {
    width: 1200,
    height: 675,
    padding: 48,
    columns: 12,
    gap: 16,
  },

  // Instagram formats
  'instagram-square': {
    width: 1080,
    height: 1080,
    padding: 54,
    columns: 12,
    gap: 18,
  },
  'instagram-portrait': {
    width: 1080,
    height: 1350,
    padding: 60,
    columns: 12,
    gap: 20,
  },
} as const;

export type CanvasPreset = keyof typeof canvasPresets;

// Helper to get canvas config
export function getCanvasConfig(preset: CanvasPreset): CanvasConfig {
  return canvasPresets[preset];
}
