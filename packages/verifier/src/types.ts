/**
 * Verifier Types
 */

import type { PosterDefinition } from '@swiss/composer';

/**
 * Test case for verification
 */
export interface TestCase {
  id: string;
  preset: string;
  theme: string;
  canvas: string;
  definition: PosterDefinition;
}

/**
 * Snapshot comparison result
 */
export interface SnapshotResult {
  passed: boolean;
  diffPixels: number;
  diffPercentage: number;
  threshold: number;
  baselinePath: string;
  actualPath?: string;
  diffPath?: string;
  error?: string;
}

/**
 * Overflow issue detected in layout
 */
export interface OverflowIssue {
  selector: string;
  element: string;
  direction: 'horizontal' | 'vertical' | 'both';
  overflowAmount: { x: number; y: number };
}

/**
 * Clipping issue detected in layout
 */
export interface ClippingIssue {
  selector: string;
  element: string;
  clippedContent: boolean;
}

/**
 * Bounds information for canvas
 */
export interface BoundsInfo {
  width: number;
  height: number;
  padding: number;
}

/**
 * Layout analysis result
 */
export interface LayoutAnalysis {
  passed: boolean;
  overflow: OverflowIssue[];
  clipping: ClippingIssue[];
  bounds: BoundsInfo;
}

/**
 * Swiss design rule result
 */
export interface RuleResult {
  rule: string;
  passed: boolean;
  severity: 'error' | 'warning';
  message: string;
  details?: unknown;
}

/**
 * Swiss rules validation report
 */
export interface SwissRulesReport {
  passed: boolean;
  results: RuleResult[];
  score: number;
}

/**
 * Single test case result
 */
export interface TestCaseResult {
  testCase: TestCase;
  snapshot: SnapshotResult | null;
  layout: LayoutAnalysis | null;
  swissRules: SwissRulesReport | null;
  passed: boolean;
  errors: string[];
  duration: number;
}

/**
 * Full matrix run result
 */
export interface MatrixResult {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  results: TestCaseResult[];
  duration: number;
  timestamp: string;
}

/**
 * Verification options
 */
export interface VerifyOptions {
  /** Update baselines instead of comparing */
  updateBaselines?: boolean;
  /** Create missing baselines */
  createMissing?: boolean;
  /** Maximum diff percentage to pass */
  maxDiffPercentage?: number;
  /** Number of parallel workers */
  parallel?: number;
  /** Filter by preset */
  preset?: string;
  /** Filter by theme */
  theme?: string;
  /** Filter by canvas */
  canvas?: string;
  /** Skip Swiss rules validation */
  skipSwissRules?: boolean;
  /** Skip layout validation */
  skipLayout?: boolean;
  /** Skip snapshot comparison */
  skipSnapshot?: boolean;
  /** Output directory for reports */
  outputDir?: string;
  /** Baselines directory */
  baselinesDir?: string;
  /** Progress callback */
  onProgress?: (completed: number, total: number) => void;
}
