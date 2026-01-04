/**
 * Swiss Design Rules Validator
 */

import type { Page } from 'puppeteer';
import type { RuleResult, SwissRulesReport } from '../types.js';
import { checkTextAlignment } from './text-alignment.js';
import { checkColorLimit } from './color-limit.js';
import { checkSpacing } from './spacing.js';
import { checkTypographyHierarchy } from './typography.js';

export { checkTextAlignment } from './text-alignment.js';
export { checkColorLimit } from './color-limit.js';
export { checkSpacing } from './spacing.js';
export { checkTypographyHierarchy } from './typography.js';

/**
 * Run all Swiss design rule validations
 */
export async function validateSwissRules(page: Page): Promise<SwissRulesReport> {
  const results: RuleResult[] = [];

  // Run all rules
  results.push(await checkTextAlignment(page));
  results.push(await checkColorLimit(page));
  results.push(await checkSpacing(page));
  results.push(await checkTypographyHierarchy(page));

  // Calculate pass/fail
  const passedCount = results.filter((r) => r.passed).length;
  const errorCount = results.filter((r) => !r.passed && r.severity === 'error').length;

  // Overall pass if no errors (warnings are OK)
  const passed = errorCount === 0;

  // Score is percentage of passed rules
  const score = (passedCount / results.length) * 100;

  return {
    passed,
    results,
    score,
  };
}
