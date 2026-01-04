/**
 * Batch command - Generate multiple posters from JSON
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import * as fs from 'fs/promises';
import * as path from 'path';
import type { PosterDefinition } from '@swiss/composer';
import { renderBatch, closeBrowser } from '@swiss/renderer';

interface BatchItem {
  definition: PosterDefinition;
  output?: string;
}

export const batchCommand = new Command('batch')
  .description('Generate multiple posters from a JSON file')
  .requiredOption('-i, --input <path>', 'Input JSON file with array of poster definitions')
  .option('-o, --output-dir <path>', 'Output directory', './output')
  .option('--scale <number>', 'Scale factor (1, 2, 3)', '2')
  .option('--format <format>', 'Image format (png, jpeg, webp)', 'png')
  .action(async (options) => {
    const spinner = ora('Loading batch file...').start();

    try {
      // Load batch file
      const inputPath = path.resolve(options.input);
      const content = await fs.readFile(inputPath, 'utf-8');
      const items: BatchItem[] = JSON.parse(content);

      if (!Array.isArray(items)) {
        spinner.fail(chalk.red('Batch file must contain an array of poster definitions'));
        process.exit(1);
      }

      spinner.text = `Found ${items.length} posters to generate...`;

      // Prepare render items
      const outputDir = path.resolve(options.outputDir);
      await fs.mkdir(outputDir, { recursive: true });

      const renderItems = items.map((item, index) => ({
        definition: item.definition,
        outputPath: item.output
          ? path.resolve(outputDir, item.output)
          : path.join(outputDir, `poster-${String(index + 1).padStart(3, '0')}.${options.format}`),
        options: {
          scale: parseInt(options.scale, 10),
          format: options.format as 'png' | 'jpeg' | 'webp',
        },
      }));

      // Render all
      await renderBatch(renderItems, (completed, total) => {
        spinner.text = `Rendering ${completed}/${total}...`;
      });

      await closeBrowser();

      spinner.succeed(chalk.green(`Generated ${items.length} posters in ${outputDir}`));
    } catch (error) {
      spinner.fail(chalk.red(`Failed: ${(error as Error).message}`));
      await closeBrowser();
      process.exit(1);
    }
  });
