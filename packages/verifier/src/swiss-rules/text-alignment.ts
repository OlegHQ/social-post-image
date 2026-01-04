/**
 * Text Alignment Rule
 * Swiss design: Multi-word text should be left-aligned (never centered except single words)
 */

import type { Page } from 'puppeteer';
import type { RuleResult } from '../types.js';

export async function checkTextAlignment(page: Page): Promise<RuleResult> {
  const violations = await page.evaluate(() => {
    const violations: string[] = [];
    const textElements = document.querySelectorAll('.swiss-text, p, h1, h2, h3, h4, h5, h6, span');

    textElements.forEach((el) => {
      const style = getComputedStyle(el);
      const text = el.textContent?.trim() || '';

      // Center alignment is only OK for single words or very short labels
      if (style.textAlign === 'center') {
        const wordCount = text.split(/\s+/).filter(Boolean).length;
        if (wordCount > 2) {
          violations.push(`Centered text with ${wordCount} words: "${text.slice(0, 40)}${text.length > 40 ? '...' : ''}"`);
        }
      }
    });

    return violations;
  });

  return {
    rule: 'text-alignment',
    passed: violations.length === 0,
    severity: violations.length > 2 ? 'error' : 'warning',
    message: violations.length === 0
      ? 'All text properly aligned (left-aligned or single-word centered)'
      : `Found ${violations.length} text alignment violation${violations.length > 1 ? 's' : ''}`,
    details: violations,
  };
}
