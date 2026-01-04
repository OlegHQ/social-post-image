/**
 * Schema command - Display JSON schemas for presets
 *
 * Useful for AI tools to understand the template format.
 */

import { Command } from 'commander';
import chalk from 'chalk';
import {
  getJsonSchema,
  getAllJsonSchemas,
  getPresetSummary,
  getPresetIds,
} from '@swiss/composer';

export const schemaCommand = new Command('schema')
  .description('Display JSON schemas for poster presets')
  .argument('[preset]', 'Preset ID to show schema for (or "all" for all schemas)')
  .option('--summary', 'Show human-readable summary of all presets')
  .option('--list', 'List available preset IDs')
  .action((preset, options) => {
    // List preset IDs
    if (options.list) {
      console.log(chalk.bold('\nAvailable Preset IDs:\n'));
      getPresetIds().forEach((id) => {
        console.log(`  ${chalk.cyan(id)}`);
      });
      console.log('');
      return;
    }

    // Show human-readable summary
    if (options.summary) {
      console.log(chalk.bold('\n' + getPresetSummary() + '\n'));
      return;
    }

    // Show all schemas
    if (preset === 'all') {
      const schemas = getAllJsonSchemas();
      console.log(JSON.stringify(schemas, null, 2));
      return;
    }

    // Show single schema
    if (preset) {
      const schema = getJsonSchema(preset);
      if (!schema) {
        console.log(chalk.red(`Unknown preset: ${preset}`));
        console.log(chalk.gray('Use --list to see available presets'));
        process.exit(1);
      }
      console.log(JSON.stringify(schema, null, 2));
      return;
    }

    // No argument - show help
    console.log(chalk.bold('\nUsage:'));
    console.log('');
    console.log(chalk.gray('  # List available presets'));
    console.log('  pnpm swiss schema --list');
    console.log('');
    console.log(chalk.gray('  # Show human-readable summary'));
    console.log('  pnpm swiss schema --summary');
    console.log('');
    console.log(chalk.gray('  # Get JSON schema for a specific preset'));
    console.log('  pnpm swiss schema hot-take-poster');
    console.log('');
    console.log(chalk.gray('  # Get all schemas (for AI tools)'));
    console.log('  pnpm swiss schema all');
    console.log('');
  });
