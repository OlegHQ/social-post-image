/**
 * Snapshot Comparison Module
 * Uses pixelmatch to compare rendered images against baselines
 */

import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import * as fs from 'fs/promises';
import * as path from 'path';

export interface ComparisonOptions {
  /** Pixel diff threshold (0-1), default 0.1 */
  threshold?: number;
  /** Max acceptable diff percentage, default 0.5% */
  maxDiffPercentage?: number;
  /** Generate diff image */
  generateDiff?: boolean;
  /** Ignore antialiasing differences */
  antialiasing?: boolean;
}

export interface ComparisonResult {
  passed: boolean;
  diffPixels: number;
  diffPercentage: number;
  threshold: number;
  diffBuffer?: Buffer;
  error?: string;
}

/**
 * Compare two image buffers using pixelmatch
 */
export async function compareImages(
  actualBuffer: Buffer,
  baselineBuffer: Buffer,
  options: ComparisonOptions = {}
): Promise<ComparisonResult> {
  const {
    threshold = 0.1,
    maxDiffPercentage = 0.5,
    generateDiff = true,
    antialiasing = true,
  } = options;

  try {
    const actual = PNG.sync.read(actualBuffer);
    const baseline = PNG.sync.read(baselineBuffer);

    // Dimension mismatch = automatic failure
    if (actual.width !== baseline.width || actual.height !== baseline.height) {
      return {
        passed: false,
        diffPixels: -1,
        diffPercentage: 100,
        threshold: maxDiffPercentage,
        error: `Dimension mismatch: actual ${actual.width}x${actual.height} vs baseline ${baseline.width}x${baseline.height}`,
      };
    }

    const diffPNG = new PNG({ width: actual.width, height: actual.height });

    const diffPixels = pixelmatch(
      actual.data,
      baseline.data,
      generateDiff ? diffPNG.data : null,
      actual.width,
      actual.height,
      { threshold, includeAA: !antialiasing }
    );

    const totalPixels = actual.width * actual.height;
    const diffPercentage = (diffPixels / totalPixels) * 100;

    return {
      passed: diffPercentage <= maxDiffPercentage,
      diffPixels,
      diffPercentage,
      threshold: maxDiffPercentage,
      diffBuffer: generateDiff ? PNG.sync.write(diffPNG) : undefined,
    };
  } catch (error) {
    return {
      passed: false,
      diffPixels: -1,
      diffPercentage: 100,
      threshold: maxDiffPercentage,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Get baseline path for a test case
 */
export function getBaselinePath(
  preset: string,
  theme: string,
  canvas: string,
  baselineDir: string
): string {
  return path.join(baselineDir, `${preset}_${theme}_${canvas}.png`);
}

/**
 * Check if baseline exists
 */
export async function baselineExists(baselinePath: string): Promise<boolean> {
  try {
    await fs.access(baselinePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Save a baseline image
 */
export async function saveBaseline(
  imageBuffer: Buffer,
  baselinePath: string
): Promise<void> {
  await fs.mkdir(path.dirname(baselinePath), { recursive: true });
  await fs.writeFile(baselinePath, imageBuffer);
}

/**
 * Load a baseline image
 */
export async function loadBaseline(baselinePath: string): Promise<Buffer> {
  return fs.readFile(baselinePath);
}

/**
 * Save diff image
 */
export async function saveDiff(
  diffBuffer: Buffer,
  diffPath: string
): Promise<void> {
  await fs.mkdir(path.dirname(diffPath), { recursive: true });
  await fs.writeFile(diffPath, diffBuffer);
}
