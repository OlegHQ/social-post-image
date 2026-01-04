/**
 * Spacing Rule
 * Swiss design: Generous padding (60px minimum from edges)
 */

import type { Page } from 'puppeteer';
import type { RuleResult } from '../types.js';

export async function checkSpacing(page: Page): Promise<RuleResult> {
  const issues = await page.evaluate(() => {
    const canvas = document.querySelector('.swiss-canvas') as HTMLElement;
    if (!canvas) return ['Canvas not found'];

    const issues: string[] = [];
    const style = getComputedStyle(canvas);
    const padding = parseInt(style.padding);
    const minPadding = 50; // Minimum recommended padding

    // Check canvas padding
    if (padding < minPadding) {
      issues.push(`Canvas padding ${padding}px is less than minimum ${minPadding}px`);
    }

    // Check elements too close to edges
    const canvasRect = canvas.getBoundingClientRect();
    const edgeThreshold = 40; // Minimum distance from edge for content

    // Only check direct children of canvas that aren't positioned absolutely
    const children = canvas.querySelectorAll(':scope > *');
    children.forEach((child) => {
      const childStyle = getComputedStyle(child);
      // Skip absolutely positioned background elements
      if (childStyle.position === 'absolute' && childStyle.zIndex === '0') {
        return;
      }

      const rect = child.getBoundingClientRect();
      const leftMargin = rect.left - canvasRect.left;
      const rightMargin = canvasRect.right - rect.right;
      const topMargin = rect.top - canvasRect.top;
      const bottomMargin = canvasRect.bottom - rect.bottom;

      // Check if content is too close to edges (accounting for padding)
      if (leftMargin < edgeThreshold && leftMargin < padding) {
        issues.push(`Element too close to left edge: ${leftMargin}px`);
      }
      if (rightMargin < edgeThreshold && rightMargin < padding) {
        issues.push(`Element too close to right edge: ${rightMargin}px`);
      }
    });

    return issues;
  });

  return {
    rule: 'spacing',
    passed: issues.length === 0,
    severity: 'warning',
    message: issues.length === 0
      ? 'Spacing meets Swiss design standards'
      : `Found ${issues.length} spacing issue${issues.length > 1 ? 's' : ''}`,
    details: issues,
  };
}
