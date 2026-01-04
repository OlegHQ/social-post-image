/**
 * Matrix Test Runner
 * Executes verification tests across all combinations
 */

import * as path from 'path';
import * as fs from 'fs/promises';
import { renderPoster, getBrowser, closeBrowser } from '@swiss/renderer';
import type { Page } from 'puppeteer';
import type {
  TestCase,
  TestCaseResult,
  MatrixResult,
  VerifyOptions,
  SnapshotResult,
} from '../types.js';
import {
  compareImages,
  getBaselinePath,
  baselineExists,
  saveBaseline,
  loadBaseline,
  saveDiff,
} from '../snapshot/compare.js';
import { analyzeLayout } from '../layout/analyzer.js';
import { validateSwissRules } from '../swiss-rules/index.js';
import { generateTestMatrix, getMatrixSize } from './generator.js';

/**
 * Run a single test case
 */
async function runSingleTest(
  testCase: TestCase,
  options: VerifyOptions
): Promise<TestCaseResult> {
  const startTime = Date.now();
  const errors: string[] = [];

  const baselinesDir = options.baselinesDir || path.join(process.cwd(), 'packages/verifier/baselines');
  const outputDir = options.outputDir || path.join(process.cwd(), 'packages/verifier/output');

  let snapshot: SnapshotResult | null = null;
  let layout = null;
  let swissRules = null;

  try {
    // Render the poster
    const imageBuffer = await renderPoster(testCase.definition);

    // Snapshot comparison
    if (!options.skipSnapshot) {
      const baselinePath = getBaselinePath(
        testCase.preset,
        testCase.theme,
        testCase.canvas,
        baselinesDir
      );

      if (options.updateBaselines) {
        // Update mode: save as new baseline
        await saveBaseline(imageBuffer, baselinePath);
        snapshot = {
          passed: true,
          diffPixels: 0,
          diffPercentage: 0,
          threshold: options.maxDiffPercentage || 0.5,
          baselinePath,
        };
      } else {
        // Compare mode
        const hasBaseline = await baselineExists(baselinePath);

        if (!hasBaseline) {
          if (options.createMissing) {
            await saveBaseline(imageBuffer, baselinePath);
            snapshot = {
              passed: true,
              diffPixels: 0,
              diffPercentage: 0,
              threshold: options.maxDiffPercentage || 0.5,
              baselinePath,
            };
          } else {
            snapshot = {
              passed: false,
              diffPixels: -1,
              diffPercentage: 100,
              threshold: options.maxDiffPercentage || 0.5,
              baselinePath,
              error: 'Baseline not found',
            };
            errors.push(`Missing baseline: ${baselinePath}`);
          }
        } else {
          const baseline = await loadBaseline(baselinePath);
          const result = await compareImages(imageBuffer, baseline, {
            maxDiffPercentage: options.maxDiffPercentage || 0.5,
            generateDiff: true,
          });

          snapshot = {
            ...result,
            baselinePath,
          };

          if (!result.passed && result.diffBuffer) {
            const diffPath = path.join(outputDir, 'diffs', `${testCase.id}_diff.png`);
            const actualPath = path.join(outputDir, 'actual', `${testCase.id}.png`);
            await saveDiff(result.diffBuffer, diffPath);
            await fs.mkdir(path.dirname(actualPath), { recursive: true });
            await fs.writeFile(actualPath, imageBuffer);
            snapshot.diffPath = diffPath;
            snapshot.actualPath = actualPath;
            errors.push(`Snapshot diff: ${result.diffPercentage.toFixed(3)}%`);
          }
        }
      }
    }

    // Layout analysis and Swiss rules need a browser page
    if (!options.skipLayout || !options.skipSwissRules) {
      const browser = await getBrowser();
      const page = await browser.newPage();

      try {
        // Set viewport and load the rendered content
        const width = testCase.definition.canvas.width || 1080;
        const height = testCase.definition.canvas.height || 1350;
        await page.setViewport({ width, height });

        // Generate HTML and load it
        const { generateHTML } = await import('@swiss/renderer');
        const html = generateHTML(testCase.definition);
        await page.setContent(html, { waitUntil: 'networkidle0' });

        // Layout analysis
        if (!options.skipLayout) {
          layout = await analyzeLayout(page);
          if (!layout.passed) {
            errors.push(`Layout issues: ${layout.overflow.length} overflow`);
          }
        }

        // Swiss rules validation
        if (!options.skipSwissRules) {
          swissRules = await validateSwissRules(page);
          if (!swissRules.passed) {
            const failedRules = swissRules.results.filter((r) => !r.passed && r.severity === 'error');
            if (failedRules.length > 0) {
              errors.push(`Swiss rules failed: ${failedRules.map((r) => r.rule).join(', ')}`);
            }
          }
        }
      } finally {
        await page.close();
      }
    }
  } catch (error) {
    errors.push(error instanceof Error ? error.message : String(error));
  }

  const duration = Date.now() - startTime;
  const passed = errors.length === 0 &&
    (snapshot?.passed ?? true) &&
    (layout?.passed ?? true) &&
    (swissRules?.passed ?? true);

  return {
    testCase,
    snapshot,
    layout,
    swissRules,
    passed,
    errors,
    duration,
  };
}

/**
 * Run the full test matrix
 */
export async function runMatrix(options: VerifyOptions = {}): Promise<MatrixResult> {
  const startTime = Date.now();

  // Generate test cases
  const testCases = generateTestMatrix({
    preset: options.preset,
    theme: options.theme,
    canvas: options.canvas,
  });

  const results: TestCaseResult[] = [];
  const parallel = options.parallel || 1;

  // Process tests
  for (let i = 0; i < testCases.length; i += parallel) {
    const batch = testCases.slice(i, i + parallel);
    const batchResults = await Promise.all(
      batch.map((tc) => runSingleTest(tc, options))
    );
    results.push(...batchResults);

    // Report progress
    if (options.onProgress) {
      options.onProgress(results.length, testCases.length);
    }
  }

  // Close browser
  await closeBrowser();

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  return {
    total: testCases.length,
    passed,
    failed,
    skipped: 0,
    results,
    duration: Date.now() - startTime,
    timestamp: new Date().toISOString(),
  };
}

export { generateTestMatrix, getMatrixSize };
