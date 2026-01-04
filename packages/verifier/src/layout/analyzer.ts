/**
 * Layout Analyzer
 * Analyzes rendered layouts for overflow, clipping, and alignment issues
 */

import type { Page } from 'puppeteer';
import type { LayoutAnalysis, OverflowIssue, ClippingIssue, BoundsInfo } from '../types.js';

/**
 * Analyze layout for issues using Puppeteer page evaluation
 */
export async function analyzeLayout(page: Page): Promise<LayoutAnalysis> {
  return page.evaluate(() => {
    const canvas = document.querySelector('.swiss-canvas') as HTMLElement;
    if (!canvas) {
      return {
        passed: false,
        overflow: [],
        clipping: [],
        bounds: { width: 0, height: 0, padding: 0 },
      };
    }

    const canvasRect = canvas.getBoundingClientRect();
    const canvasStyle = getComputedStyle(canvas);
    const padding = parseInt(canvasStyle.padding) || 60;

    const overflow: Array<{
      selector: string;
      element: string;
      direction: 'horizontal' | 'vertical' | 'both';
      overflowAmount: { x: number; y: number };
    }> = [];

    const clipping: Array<{
      selector: string;
      element: string;
      clippedContent: boolean;
    }> = [];

    // Helper to get a reasonable selector for an element
    function getSelector(el: Element): string {
      if (el.id) return `#${el.id}`;
      if (el.className && typeof el.className === 'string') {
        const classes = el.className.split(' ').filter(Boolean).slice(0, 2).join('.');
        if (classes) return `.${classes}`;
      }
      return el.tagName.toLowerCase();
    }

    // Check all elements for overflow
    const elements = canvas.querySelectorAll('*');
    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const htmlEl = el as HTMLElement;

      // Check if element extends beyond canvas bounds (with some tolerance)
      const tolerance = 2; // pixels
      const overflowRight = rect.right - canvasRect.right;
      const overflowBottom = rect.bottom - canvasRect.bottom;
      const overflowLeft = canvasRect.left - rect.left;
      const overflowTop = canvasRect.top - rect.top;

      const hasHorizontalOverflow = overflowRight > tolerance || overflowLeft > tolerance;
      const hasVerticalOverflow = overflowBottom > tolerance || overflowTop > tolerance;

      if (hasHorizontalOverflow || hasVerticalOverflow) {
        // Skip elements that are intentionally positioned outside (like the giant letter)
        const style = getComputedStyle(el);
        if (style.position === 'absolute' && style.zIndex === '0') {
          // This is likely an intentional background element
          return;
        }

        overflow.push({
          selector: getSelector(el),
          element: el.tagName.toLowerCase(),
          direction: hasHorizontalOverflow && hasVerticalOverflow ? 'both' :
                    hasHorizontalOverflow ? 'horizontal' : 'vertical',
          overflowAmount: {
            x: Math.max(overflowRight, overflowLeft, 0),
            y: Math.max(overflowBottom, overflowTop, 0),
          },
        });
      }

      // Check for text clipping (scrollWidth > clientWidth)
      if (htmlEl.scrollWidth > htmlEl.clientWidth + tolerance ||
          htmlEl.scrollHeight > htmlEl.clientHeight + tolerance) {
        const style = getComputedStyle(el);
        // Only report if overflow is hidden/clip
        if (style.overflow === 'hidden' || style.overflowX === 'hidden' || style.overflowY === 'hidden') {
          clipping.push({
            selector: getSelector(el),
            element: el.tagName.toLowerCase(),
            clippedContent: true,
          });
        }
      }
    });

    return {
      passed: overflow.length === 0,
      overflow,
      clipping,
      bounds: {
        width: canvasRect.width,
        height: canvasRect.height,
        padding,
      },
    };
  });
}

/**
 * Check overflow issues specifically
 */
export async function checkOverflow(page: Page): Promise<OverflowIssue[]> {
  const analysis = await analyzeLayout(page);
  return analysis.overflow;
}

/**
 * Check clipping issues specifically
 */
export async function checkClipping(page: Page): Promise<ClippingIssue[]> {
  const analysis = await analyzeLayout(page);
  return analysis.clipping;
}

/**
 * Get canvas bounds
 */
export async function getCanvasBounds(page: Page): Promise<BoundsInfo> {
  const analysis = await analyzeLayout(page);
  return analysis.bounds;
}
