#!/usr/bin/env node

/**
 * Swiss CLI - Command-line interface for generating Swiss-style posters
 */

import { Command } from 'commander';
import { generateCommand } from './commands/generate';
import { batchCommand } from './commands/batch';
import { listCommand } from './commands/list';
import { schemaCommand } from './commands/schema';

const program = new Command();

program
  .name('swiss')
  .description('Swiss-style social media poster generator')
  .version('1.0.0');

// Add commands
program.addCommand(generateCommand);
program.addCommand(batchCommand);
program.addCommand(listCommand);
program.addCommand(schemaCommand);

// Parse arguments
program.parse();
