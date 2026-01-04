/**
 * Typography Rule
 * Swiss design: Strong typography hierarchy with size contrast
 */

import type { Page } from 'puppeteer';
import type { RuleResult } from '../types.js';

export async function checkTypographyHierarchy(page: Page): Promise<RuleResult> {
  const analysis = await page.evaluate(() => {
    const fontSizes: number[] = [];
    const issues: string[] = [];

    document.querySelectorAll('.swiss-text, p, h1, h2, h3, h4, h5, h6, span').forEach((el) => {
      const style = getComputedStyle(el);
      const fontSize = parseFloat(style.fontSize);
      if (fontSize > 0 && el.textContent?.trim()) {
        fontSizes.push(fontSize);
      }
    });

    if (fontSizes.length < 2) {
      return { fontSizes, issues, hasHierarchy: true };
    }

    // Sort font sizes to analyze hierarchy
    const sortedSizes = [...new Set(fontSizes)].sort((a, b) => b - a);

    // Check for sufficient contrast between largest and smallest
    if (sortedSizes.length >= 2) {
      const largest = sortedSizes[0];
      const smallest = sortedSizes[sortedSizes.length - 1];
      const ratio = largest / smallest;

      // Swiss design typically has strong contrast (at least 3:1 ratio)
      if (ratio < 2.5) {
        issues.push(`Weak typography contrast: ${largest}px / ${smallest}px = ${ratio.toFixed(1)}:1 (recommend 3:1+)`);
      }
    }

    // Check for too many different sizes (Swiss design is restrained)
    if (sortedSizes.length > 6) {
      issues.push(`Too many font sizes (${sortedSizes.length}). Swiss design typically uses 3-5 sizes.`);
    }

    return {
      fontSizes: sortedSizes,
      issues,
      hasHierarchy: sortedSizes.length >= 2 && issues.length === 0,
    };
  });

  return {
    rule: 'typography-hierarchy',
    passed: analysis.issues.length === 0,
    severity: 'warning',
    message: analysis.issues.length === 0
      ? `Strong typography hierarchy with ${analysis.fontSizes.length} size levels`
      : analysis.issues.join('; '),
    details: {
      fontSizes: analysis.fontSizes,
      issues: analysis.issues,
    },
  };
}
