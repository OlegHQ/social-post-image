/**
 * HTML Report Generator
 * Generates visual HTML reports for verification results
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import type { MatrixResult, TestCaseResult } from '../types.js';

/**
 * Generate HTML for a single test case
 */
function generateTestCaseHTML(result: TestCaseResult): string {
  const statusClass = result.passed ? 'passed' : 'failed';
  const statusIcon = result.passed ? '✓' : '✗';

  let snapshotSection = '';
  if (result.snapshot) {
    const snapshotStatus = result.snapshot.passed ? 'passed' : 'failed';
    snapshotSection = `
      <div class="section">
        <h4>Snapshot Comparison</h4>
        <p class="${snapshotStatus}">
          ${result.snapshot.passed ? '✓' : '✗'}
          Diff: ${result.snapshot.diffPercentage >= 0 ? result.snapshot.diffPercentage.toFixed(3) + '%' : 'N/A'}
          (threshold: ${result.snapshot.threshold}%)
        </p>
        ${result.snapshot.error ? `<p class="error">${result.snapshot.error}</p>` : ''}
        ${result.snapshot.diffPath ? `
          <div class="diff-images">
            <div class="diff-image">
              <p>Baseline</p>
              <img src="baselines/${result.testCase.id}.png" alt="Baseline" onerror="this.style.display='none'" />
            </div>
            <div class="diff-image">
              <p>Actual</p>
              <img src="actual/${result.testCase.id}.png" alt="Actual" onerror="this.style.display='none'" />
            </div>
            <div class="diff-image">
              <p>Diff</p>
              <img src="diffs/${result.testCase.id}_diff.png" alt="Diff" onerror="this.style.display='none'" />
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  let layoutSection = '';
  if (result.layout) {
    const layoutStatus = result.layout.passed ? 'passed' : 'failed';
    layoutSection = `
      <div class="section">
        <h4>Layout Analysis</h4>
        <p class="${layoutStatus}">
          ${result.layout.passed ? '✓' : '✗'}
          ${result.layout.overflow.length} overflow issues,
          ${result.layout.clipping.length} clipping issues
        </p>
        ${result.layout.overflow.length > 0 ? `
          <ul class="issues">
            ${result.layout.overflow.map((o) => `
              <li>${o.selector} (${o.element}): ${o.direction} overflow by ${o.overflowAmount.x}px x ${o.overflowAmount.y}px</li>
            `).join('')}
          </ul>
        ` : ''}
      </div>
    `;
  }

  let rulesSection = '';
  if (result.swissRules) {
    rulesSection = `
      <div class="section">
        <h4>Swiss Design Rules (Score: ${result.swissRules.score.toFixed(0)}%)</h4>
        <div class="rules">
          ${result.swissRules.results.map((r) => `
            <div class="rule ${r.passed ? 'passed' : 'failed'}">
              <span class="rule-icon">${r.passed ? '✓' : '✗'}</span>
              <span class="rule-name">${r.rule}</span>
              <span class="rule-message">${r.message}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  return `
    <div class="test-case ${statusClass}">
      <div class="test-header">
        <span class="status-icon">${statusIcon}</span>
        <h3>${result.testCase.id}</h3>
        <span class="duration">${result.duration}ms</span>
      </div>
      <div class="test-meta">
        <span>Preset: <strong>${result.testCase.preset}</strong></span>
        <span>Theme: <strong>${result.testCase.theme}</strong></span>
        <span>Canvas: <strong>${result.testCase.canvas}</strong></span>
      </div>
      ${result.errors.length > 0 ? `
        <div class="errors">
          ${result.errors.map((e) => `<p class="error">${e}</p>`).join('')}
        </div>
      ` : ''}
      ${snapshotSection}
      ${layoutSection}
      ${rulesSection}
    </div>
  `;
}

/**
 * Generate the full HTML report
 */
export async function generateHTMLReport(
  result: MatrixResult,
  outputPath: string
): Promise<void> {
  const passRate = ((result.passed / result.total) * 100).toFixed(1);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Swiss Poster Verification Report</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: #1a1a1a;
      color: #fff;
      line-height: 1.5;
      padding: 40px;
    }

    h1 {
      font-size: 32px;
      font-weight: 900;
      margin-bottom: 8px;
    }

    h2 {
      font-size: 24px;
      font-weight: 700;
      margin: 40px 0 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid #333;
    }

    h3 {
      font-size: 16px;
      font-weight: 600;
    }

    h4 {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 10px;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .meta {
      color: #888;
      font-size: 14px;
      margin-bottom: 30px;
    }

    .summary {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-bottom: 40px;
    }

    .stat {
      background: #2a2a2a;
      padding: 24px;
      border-radius: 4px;
    }

    .stat-value {
      font-size: 48px;
      font-weight: 900;
      line-height: 1;
    }

    .stat-label {
      font-size: 14px;
      color: #888;
      margin-top: 8px;
    }

    .stat.passed .stat-value { color: #4ade80; }
    .stat.failed .stat-value { color: #f87171; }

    .test-case {
      background: #2a2a2a;
      border-radius: 4px;
      margin-bottom: 16px;
      overflow: hidden;
    }

    .test-case.failed {
      border-left: 4px solid #f87171;
    }

    .test-case.passed {
      border-left: 4px solid #4ade80;
    }

    .test-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
      background: #333;
    }

    .status-icon {
      font-size: 18px;
    }

    .test-case.passed .status-icon { color: #4ade80; }
    .test-case.failed .status-icon { color: #f87171; }

    .duration {
      margin-left: auto;
      font-size: 12px;
      color: #666;
    }

    .test-meta {
      display: flex;
      gap: 20px;
      padding: 12px 20px;
      font-size: 13px;
      color: #888;
      border-bottom: 1px solid #333;
    }

    .section {
      padding: 16px 20px;
      border-bottom: 1px solid #333;
    }

    .section:last-child {
      border-bottom: none;
    }

    .passed { color: #4ade80; }
    .failed { color: #f87171; }

    .error {
      color: #f87171;
      font-size: 13px;
      margin-top: 8px;
    }

    .errors {
      padding: 16px 20px;
      background: rgba(248, 113, 113, 0.1);
    }

    .issues {
      list-style: none;
      font-size: 13px;
      margin-top: 8px;
    }

    .issues li {
      padding: 4px 0;
      color: #888;
    }

    .rules {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .rule {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 12px;
      background: #333;
      border-radius: 4px;
      font-size: 13px;
    }

    .rule.passed { background: rgba(74, 222, 128, 0.1); }
    .rule.failed { background: rgba(248, 113, 113, 0.1); }

    .rule-icon { font-size: 14px; }
    .rule-name { font-weight: 600; min-width: 150px; }
    .rule-message { color: #888; }

    .diff-images {
      display: flex;
      gap: 16px;
      margin-top: 12px;
    }

    .diff-image {
      flex: 1;
    }

    .diff-image p {
      font-size: 12px;
      color: #666;
      margin-bottom: 8px;
    }

    .diff-image img {
      width: 100%;
      height: auto;
      border: 1px solid #333;
      border-radius: 4px;
    }

    .filter-bar {
      display: flex;
      gap: 12px;
      margin-bottom: 20px;
    }

    .filter-bar select {
      padding: 8px 12px;
      background: #2a2a2a;
      border: 1px solid #333;
      color: #fff;
      border-radius: 4px;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <h1>Swiss Poster Verification Report</h1>
  <p class="meta">Generated: ${result.timestamp} | Duration: ${(result.duration / 1000).toFixed(1)}s</p>

  <div class="summary">
    <div class="stat">
      <div class="stat-value">${result.total}</div>
      <div class="stat-label">Total Tests</div>
    </div>
    <div class="stat passed">
      <div class="stat-value">${result.passed}</div>
      <div class="stat-label">Passed</div>
    </div>
    <div class="stat failed">
      <div class="stat-value">${result.failed}</div>
      <div class="stat-label">Failed</div>
    </div>
    <div class="stat">
      <div class="stat-value">${passRate}%</div>
      <div class="stat-label">Pass Rate</div>
    </div>
  </div>

  ${result.failed > 0 ? `
    <h2>Failed Tests (${result.failed})</h2>
    ${result.results.filter((r) => !r.passed).map(generateTestCaseHTML).join('')}
  ` : ''}

  <h2>All Tests (${result.total})</h2>
  ${result.results.map(generateTestCaseHTML).join('')}
</body>
</html>`;

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, html);
}

/**
 * Generate JSON report
 */
export async function generateJSONReport(
  result: MatrixResult,
  outputPath: string
): Promise<void> {
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify(result, null, 2));
}
