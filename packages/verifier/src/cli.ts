#!/usr/bin/env node
/**
 * Swiss Poster Verification CLI
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import * as path from 'path';
import { runMatrix, getMatrixSize } from './matrix/runner.js';
import { generateHTMLReport, generateJSONReport } from './report/html-report.js';

const program = new Command();

program
  .name('swiss-verify')
  .description('Swiss poster rendering verification')
  .version('1.0.0');

program
  .command('snapshot')
  .description('Run visual regression tests')
  .option('-u, --update', 'Update baseline snapshots')
  .option('--preset <preset>', 'Filter by preset')
  .option('--theme <theme>', 'Filter by theme')
  .option('--canvas <canvas>', 'Filter by canvas')
  .option('--threshold <number>', 'Diff threshold percentage', '0.5')
  .option('--parallel <number>', 'Number of parallel workers', '1')
  .option('-o, --output <path>', 'Output directory', './packages/verifier/output')
  .action(async (options) => {
    const spinner = ora('Running snapshot tests...').start();

    const testCount = getMatrixSize({
      preset: options.preset,
      theme: options.theme,
      canvas: options.canvas,
    });

    spinner.text = `Running ${testCount} snapshot tests...`;

    try {
      const result = await runMatrix({
        updateBaselines: options.update,
        createMissing: options.update,
        maxDiffPercentage: parseFloat(options.threshold),
        parallel: parseInt(options.parallel),
        preset: options.preset,
        theme: options.theme,
        canvas: options.canvas,
        skipLayout: true,
        skipSwissRules: true,
        outputDir: options.output,
        onProgress: (completed, total) => {
          spinner.text = `Running snapshot tests... ${completed}/${total}`;
        },
      });

      spinner.stop();

      // Output results
      console.log('');
      console.log(chalk.bold('Snapshot Test Results'));
      console.log('─'.repeat(40));
      console.log(`Total:  ${result.total}`);
      console.log(`Passed: ${chalk.green(result.passed)}`);
      console.log(`Failed: ${chalk.red(result.failed)}`);
      console.log(`Time:   ${(result.duration / 1000).toFixed(1)}s`);

      if (options.update) {
        console.log('');
        console.log(chalk.yellow('Baselines updated.'));
      }

      // Generate reports
      const reportPath = path.join(options.output, 'snapshot-report.html');
      await generateHTMLReport(result, reportPath);
      console.log('');
      console.log(`Report: ${reportPath}`);

      process.exit(result.failed > 0 ? 1 : 0);
    } catch (error) {
      spinner.fail('Snapshot tests failed');
      console.error(chalk.red(error instanceof Error ? error.message : String(error)));
      process.exit(1);
    }
  });

program
  .command('layout')
  .description('Run layout validation only')
  .option('--preset <preset>', 'Filter by preset')
  .option('--theme <theme>', 'Filter by theme')
  .option('--canvas <canvas>', 'Filter by canvas')
  .option('--parallel <number>', 'Number of parallel workers', '1')
  .option('-o, --output <path>', 'Output directory', './packages/verifier/output')
  .action(async (options) => {
    const spinner = ora('Running layout validation...').start();

    try {
      const result = await runMatrix({
        skipSnapshot: true,
        skipSwissRules: true,
        parallel: parseInt(options.parallel),
        preset: options.preset,
        theme: options.theme,
        canvas: options.canvas,
        outputDir: options.output,
        onProgress: (completed, total) => {
          spinner.text = `Validating layouts... ${completed}/${total}`;
        },
      });

      spinner.stop();

      console.log('');
      console.log(chalk.bold('Layout Validation Results'));
      console.log('─'.repeat(40));
      console.log(`Total:  ${result.total}`);
      console.log(`Passed: ${chalk.green(result.passed)}`);
      console.log(`Failed: ${chalk.red(result.failed)}`);

      // Show failed tests
      const failed = result.results.filter((r) => !r.passed);
      if (failed.length > 0) {
        console.log('');
        console.log(chalk.red('Failed:'));
        failed.forEach((f) => {
          console.log(`  ${f.testCase.id}`);
          f.layout?.overflow.forEach((o) => {
            console.log(chalk.dim(`    - ${o.selector}: ${o.direction} overflow`));
          });
        });
      }

      process.exit(result.failed > 0 ? 1 : 0);
    } catch (error) {
      spinner.fail('Layout validation failed');
      console.error(chalk.red(error instanceof Error ? error.message : String(error)));
      process.exit(1);
    }
  });

program
  .command('swiss-rules')
  .description('Validate Swiss design rules')
  .option('--preset <preset>', 'Filter by preset')
  .option('--theme <theme>', 'Filter by theme')
  .option('--canvas <canvas>', 'Filter by canvas')
  .option('--parallel <number>', 'Number of parallel workers', '1')
  .action(async (options) => {
    const spinner = ora('Validating Swiss design rules...').start();

    try {
      const result = await runMatrix({
        skipSnapshot: true,
        skipLayout: true,
        parallel: parseInt(options.parallel),
        preset: options.preset,
        theme: options.theme,
        canvas: options.canvas,
        onProgress: (completed, total) => {
          spinner.text = `Validating rules... ${completed}/${total}`;
        },
      });

      spinner.stop();

      console.log('');
      console.log(chalk.bold('Swiss Design Rules Results'));
      console.log('─'.repeat(40));
      console.log(`Total:  ${result.total}`);
      console.log(`Passed: ${chalk.green(result.passed)}`);
      console.log(`Failed: ${chalk.red(result.failed)}`);

      // Show average score
      const scores = result.results
        .filter((r) => r.swissRules)
        .map((r) => r.swissRules!.score);
      const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      console.log(`Avg Score: ${avgScore.toFixed(0)}%`);

      process.exit(result.failed > 0 ? 1 : 0);
    } catch (error) {
      spinner.fail('Swiss rules validation failed');
      console.error(chalk.red(error instanceof Error ? error.message : String(error)));
      process.exit(1);
    }
  });

program
  .command('full')
  .description('Run complete verification suite')
  .option('-u, --update', 'Update baseline snapshots')
  .option('--preset <preset>', 'Filter by preset')
  .option('--theme <theme>', 'Filter by theme')
  .option('--canvas <canvas>', 'Filter by canvas')
  .option('--threshold <number>', 'Diff threshold percentage', '0.5')
  .option('--parallel <number>', 'Number of parallel workers', '1')
  .option('-o, --output <path>', 'Output directory', './packages/verifier/output')
  .action(async (options) => {
    const spinner = ora('Running full verification suite...').start();

    const testCount = getMatrixSize({
      preset: options.preset,
      theme: options.theme,
      canvas: options.canvas,
    });

    spinner.text = `Running ${testCount} tests...`;

    try {
      const result = await runMatrix({
        updateBaselines: options.update,
        createMissing: options.update,
        maxDiffPercentage: parseFloat(options.threshold),
        parallel: parseInt(options.parallel),
        preset: options.preset,
        theme: options.theme,
        canvas: options.canvas,
        outputDir: options.output,
        onProgress: (completed, total) => {
          spinner.text = `Verifying... ${completed}/${total}`;
        },
      });

      spinner.stop();

      // Output summary
      console.log('');
      console.log(chalk.bold('Verification Results'));
      console.log('═'.repeat(40));
      console.log(`Total:    ${result.total}`);
      console.log(`Passed:   ${chalk.green(result.passed)}`);
      console.log(`Failed:   ${chalk.red(result.failed)}`);
      console.log(`Duration: ${(result.duration / 1000).toFixed(1)}s`);

      // Generate reports
      const htmlPath = path.join(options.output, 'verification-report.html');
      const jsonPath = path.join(options.output, 'verification-report.json');
      await generateHTMLReport(result, htmlPath);
      await generateJSONReport(result, jsonPath);

      console.log('');
      console.log(`HTML Report: ${htmlPath}`);
      console.log(`JSON Report: ${jsonPath}`);

      if (result.failed > 0) {
        console.log('');
        console.log(chalk.red(`${result.failed} test(s) failed. See report for details.`));
      }

      process.exit(result.failed > 0 ? 1 : 0);
    } catch (error) {
      spinner.fail('Verification failed');
      console.error(chalk.red(error instanceof Error ? error.message : String(error)));
      process.exit(1);
    }
  });

program.parse();
