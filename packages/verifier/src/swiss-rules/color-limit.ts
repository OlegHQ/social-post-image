/**
 * Color Limit Rule
 * Swiss design: Maximum 3 colors per design (background, foreground, accent)
 */

import type { Page } from 'puppeteer';
import type { RuleResult } from '../types.js';

/**
 * Normalize color to hex format for comparison
 */
function normalizeColor(color: string): string {
  // Create a temporary element to convert color to rgb
  if (color.startsWith('#')) {
    return color.toLowerCase();
  }

  // Parse rgb/rgba
  const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (match) {
    const r = parseInt(match[1]).toString(16).padStart(2, '0');
    const g = parseInt(match[2]).toString(16).padStart(2, '0');
    const b = parseInt(match[3]).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  }

  return color;
}

export async function checkColorLimit(page: Page): Promise<RuleResult> {
  const colors = await page.evaluate(() => {
    const uniqueColors = new Set<string>();

    // Helper to normalize color
    function normalizeColorInPage(color: string): string | null {
      if (!color || color === 'transparent' || color === 'rgba(0, 0, 0, 0)') {
        return null;
      }

      // Parse rgb/rgba
      const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (match) {
        const r = parseInt(match[1]).toString(16).padStart(2, '0');
        const g = parseInt(match[2]).toString(16).padStart(2, '0');
        const b = parseInt(match[3]).toString(16).padStart(2, '0');
        return `#${r}${g}${b}`;
      }

      if (color.startsWith('#')) {
        return color.toLowerCase();
      }

      return color;
    }

    document.querySelectorAll('*').forEach((el) => {
      const style = getComputedStyle(el);

      const textColor = normalizeColorInPage(style.color);
      if (textColor) uniqueColors.add(textColor);

      const bgColor = normalizeColorInPage(style.backgroundColor);
      if (bgColor) uniqueColors.add(bgColor);

      const borderColor = normalizeColorInPage(style.borderColor);
      if (borderColor && style.borderWidth !== '0px') uniqueColors.add(borderColor);
    });

    return Array.from(uniqueColors);
  });

  const colorCount = colors.length;
  const maxColors = 4; // Allow 4 colors (bg, fg, accent, muted)

  return {
    rule: 'color-limit',
    passed: colorCount <= maxColors,
    severity: colorCount > 5 ? 'error' : 'warning',
    message: colorCount <= maxColors
      ? `Using ${colorCount} colors (within ${maxColors}-color limit)`
      : `Using ${colorCount} colors (exceeds ${maxColors}-color limit)`,
    details: { colors, count: colorCount },
  };
}
