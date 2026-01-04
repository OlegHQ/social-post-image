/**
 * Generate command - Create a single poster image
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import * as fs from 'fs/promises';
import * as path from 'path';
import {
  createVignelliQuote,
  createTypographyShowcase,
  createStatementPoster,
  // New presets
  createHotTakePoster,
  createAnnouncementPoster,
  // refs2 templates
  createOperaPoster,
  createSeasonPoster,
  createFeatureShowcase,
  // Validation
  validatePresetOptions,
  type PosterDefinition,
} from '@swiss/composer';
import { renderToFile, closeBrowser } from '@swiss/renderer';
import { themes, type ThemePreset } from '@swiss/primitives';

// Preset function registry
// Using 'as unknown as' to bypass strict type checking since options are validated by Zod before reaching here
const presetMap: Record<string, (options: Record<string, unknown>) => PosterDefinition> = {
  'vignelli-quote': (opts) => createVignelliQuote(opts as unknown as Parameters<typeof createVignelliQuote>[0]),
  'typography-showcase': (opts) => createTypographyShowcase(opts as unknown as Parameters<typeof createTypographyShowcase>[0]),
  'statement-poster': (opts) => createStatementPoster(opts as unknown as Parameters<typeof createStatementPoster>[0]),
  // New presets
  'hot-take-poster': (opts) => createHotTakePoster(opts as unknown as Parameters<typeof createHotTakePoster>[0]),
  'announcement-poster': (opts) => createAnnouncementPoster(opts as unknown as Parameters<typeof createAnnouncementPoster>[0]),
  // refs2 templates
  'opera-poster': (opts) => createOperaPoster(opts as unknown as Parameters<typeof createOperaPoster>[0]),
  'season-poster': (opts) => createSeasonPoster(opts as unknown as Parameters<typeof createSeasonPoster>[0]),
  'feature-showcase': (opts) => createFeatureShowcase(opts as unknown as Parameters<typeof createFeatureShowcase>[0]),
};

export const generateCommand = new Command('generate')
  .description('Generate a poster image')
  .option('-i, --input <path>', 'Input JSON file with poster definition')
  .option('-j, --json <json>', 'Inline JSON with preset options (e.g., \'{"preset":"hot-take-poster","statement":"..."}\')')
  .option('-p, --preset <preset>', 'Use a preset template')
  .option('-o, --output <path>', 'Output file path', './output/poster.png')
  .option('--theme <theme>', 'Color theme', 'swiss-red')
  .option('--scale <number>', 'Scale factor (1, 2, 3)', '2')
  .option('--format <format>', 'Image format (png, jpeg, webp)', 'png')
  // Preset-specific options (legacy, prefer --json)
  .option('--headline <text>', 'Main headline text')
  .option('--subheadline <text>', 'Subheadline text')
  .option('--quote <text>', 'Quote text (for vignelli-quote preset)')
  .option('--emphasis <text>', 'Emphasis phrase (for vignelli-quote preset)')
  .option('--author <text>', 'Author name')
  .option('--series <number>', 'Series number')
  .option('--letter <char>', 'Featured letter (for typography-showcase)')
  .option('--font-name <text>', 'Font name (for typography-showcase)')
  .action(async (options) => {
    const spinner = ora('Generating poster...').start();

    try {
      let definition: PosterDefinition;

      // ════════════════════════════════════════════════════════════════
      // Option 1: Inline JSON (--json)
      // Preferred method for AI-generated content
      // ════════════════════════════════════════════════════════════════
      if (options.json) {
        let jsonOptions: Record<string, unknown>;
        try {
          jsonOptions = JSON.parse(options.json);
        } catch {
          spinner.fail(chalk.red('Invalid JSON format'));
          process.exit(1);
        }

        const presetId = jsonOptions.preset as string;
        if (!presetId) {
          spinner.fail(chalk.red('JSON must include "preset" field'));
          process.exit(1);
        }

        // Validate against Zod schema
        const validation = validatePresetOptions(presetId, jsonOptions);
        if (!validation.valid) {
          spinner.fail(chalk.red('Validation failed:'));
          (validation as { valid: false; errors: string[] }).errors.forEach((err) =>
            console.log(chalk.red(`  - ${err}`))
          );
          process.exit(1);
        }

        // Apply theme override if specified via --theme
        if (options.theme && !jsonOptions.theme) {
          jsonOptions.theme = options.theme;
        }

        const presetFn = presetMap[presetId];
        if (!presetFn) {
          spinner.fail(chalk.red(`Unknown preset: ${presetId}`));
          process.exit(1);
        }

        definition = presetFn(jsonOptions);
        spinner.text = `Generated ${presetId} from JSON`;
      }
      // ════════════════════════════════════════════════════════════════
      // Option 2: JSON file (--input)
      // ════════════════════════════════════════════════════════════════
      else if (options.input) {
        const jsonPath = path.resolve(options.input);
        const content = await fs.readFile(jsonPath, 'utf-8');
        const jsonData = JSON.parse(content);

        // Check if it's a full PosterDefinition or preset options
        if (jsonData.root) {
          // Full poster definition
          definition = jsonData as PosterDefinition;
        } else if (jsonData.preset) {
          // Preset options - validate and generate
          const validation = validatePresetOptions(jsonData.preset, jsonData);
          if (!validation.valid) {
            spinner.fail(chalk.red('Validation failed:'));
            (validation as { valid: false; errors: string[] }).errors.forEach((err) =>
              console.log(chalk.red(`  - ${err}`))
            );
            process.exit(1);
          }

          const presetFn = presetMap[jsonData.preset];
          if (!presetFn) {
            spinner.fail(chalk.red(`Unknown preset: ${jsonData.preset}`));
            process.exit(1);
          }

          definition = presetFn(jsonData);
        } else {
          spinner.fail(chalk.red('JSON must be a PosterDefinition (with root) or preset options (with preset)'));
          process.exit(1);
        }
        spinner.text = `Loaded from ${options.input}`;
      }
      // ════════════════════════════════════════════════════════════════
      // Option 3: CLI flags (--preset with options)
      // Legacy method, kept for backwards compatibility
      // ════════════════════════════════════════════════════════════════
      else if (options.preset) {
        const presetFn = presetMap[options.preset];
        if (!presetFn) {
          spinner.fail(chalk.red(`Unknown preset: ${options.preset}`));
          console.log(chalk.gray('Available presets:'));
          Object.keys(presetMap).forEach((key) => {
            console.log(chalk.gray(`  - ${key}`));
          });
          process.exit(1);
        }

        // Build preset options based on preset type
        if (options.preset === 'vignelli-quote') {
          if (!options.quote || !options.emphasis) {
            spinner.fail(chalk.red('--quote and --emphasis are required for vignelli-quote preset'));
            process.exit(1);
          }
          definition = presetFn({
            quote: options.quote,
            emphasisPhrase: options.emphasis,
            author: options.author || 'Unknown',
            seriesNumber: options.series ? parseInt(options.series, 10) : 1,
            theme: options.theme as ThemePreset,
          });
        } else if (options.preset === 'typography-showcase') {
          if (!options.letter || !options.fontName) {
            spinner.fail(chalk.red('--letter and --font-name are required for typography-showcase preset'));
            process.exit(1);
          }
          definition = presetFn({
            letter: options.letter,
            fontName: options.fontName,
            theme: options.theme as ThemePreset,
          });
        } else if (options.preset === 'statement-poster') {
          if (!options.headline) {
            spinner.fail(chalk.red('--headline is required for statement-poster preset'));
            process.exit(1);
          }
          definition = presetFn({
            headline: options.headline,
            subheadline: options.subheadline,
            author: options.author,
            postNumber: options.series ? `POST ${options.series}` : undefined,
            theme: options.theme as ThemePreset,
          });
        } else {
          // For new presets, require --json
          spinner.fail(chalk.red(`Preset ${options.preset} requires --json input`));
          console.log(chalk.gray('Example:'));
          console.log(chalk.gray(`  pnpm generate --json '{"preset":"${options.preset}","statement":"Your text","author":"name"}'`));
          process.exit(1);
        }
      }
      // No input provided
      else {
        spinner.fail(chalk.red('One of --input, --json, or --preset is required'));
        console.log(chalk.gray('\nUsage examples:'));
        console.log(chalk.gray('  pnpm generate --json \'{"preset":"hot-take-poster","statement":"Your hot take","author":"you"}\''));
        console.log(chalk.gray('  pnpm generate --input poster.json'));
        console.log(chalk.gray('  pnpm generate --preset statement-poster --headline "Your headline"'));
        process.exit(1);
      }

      // Override theme if specified (for --input with full definition)
      if (options.theme && options.input && !options.json) {
        definition.theme = { preset: options.theme as ThemePreset };
      }

      spinner.text = 'Rendering poster...';

      // Render to file
      const outputPath = path.resolve(options.output);
      await renderToFile(definition, outputPath, {
        scale: parseInt(options.scale, 10),
        format: options.format as 'png' | 'jpeg' | 'webp',
      });

      await closeBrowser();

      spinner.succeed(chalk.green(`Poster saved to ${outputPath}`));
    } catch (error) {
      spinner.fail(chalk.red(`Failed: ${(error as Error).message}`));
      await closeBrowser();
      process.exit(1);
    }
  });
