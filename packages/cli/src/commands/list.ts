/**
 * List command - List available presets and themes
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { themes } from '@swiss/primitives';

export const listCommand = new Command('list')
  .description('List available presets and themes')
  .option('-p, --presets', 'List available presets')
  .option('-t, --themes', 'List available themes')
  .action((options) => {
    // If no specific option, list both
    const showAll = !options.presets && !options.themes;

    if (showAll || options.presets) {
      console.log(chalk.bold('\nAvailable Presets:\n'));
      console.log(chalk.cyan('  vignelli-quote'));
      console.log(chalk.gray('    Massimo Vignelli-style quote poster'));
      console.log(chalk.gray('    Required: --quote, --emphasis, --author'));
      console.log();
      console.log(chalk.cyan('  typography-showcase'));
      console.log(chalk.gray('    Swiss typography poster with large letterform'));
      console.log(chalk.gray('    Required: --letter, --font-name'));
      console.log();
      console.log(chalk.cyan('  event-poster'));
      console.log(chalk.gray('    Event information poster with slash separators'));
      console.log(chalk.gray('    Use JSON input for full customization'));
      console.log();
      console.log(chalk.cyan('  statement-poster'));
      console.log(chalk.gray('    Simple statement/headline poster'));
      console.log(chalk.gray('    Required: --headline'));
      console.log();
    }

    if (showAll || options.themes) {
      console.log(chalk.bold('\nAvailable Themes:\n'));
      Object.entries(themes).forEach(([id, theme]) => {
        console.log(chalk.cyan(`  ${id}`));
        console.log(chalk.gray(`    ${theme.name}`));
        console.log(
          chalk.gray(
            `    BG: ${theme.colors.background} | FG: ${theme.colors.foreground} | Accent: ${theme.colors.accent}`
          )
        );
        console.log();
      });
    }
  });
