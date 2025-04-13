#!/usr/bin/env node

import { Command } from 'commander';
import { globalHandler, handleIndividualCommand } from './handler.js';
import { fileURLToPath } from 'url';
import path from 'path';
import Enquirer from 'enquirer';
import { logError } from './utils/logger.js';
const { prompt } = Enquirer;
const program = new Command();

interface PromptRes {
  packageManager: string;
  typescript: string;
  options: Record<string, string>;
  git: string;
}

program
  .command('init')
  .description('Setting up the Whole Project')
  .action(async () => {
    console.log("Hey ya!! Let's start setting up your project");
    const { packageManager, typescript, options, git }: PromptRes = await prompt([
      {
        type: 'select',
        name: 'packageManager',
        message: 'Choose the package manager:',
        choices: ['npm', 'pnpm', 'yarn', 'bun'],
      },
      {
        type: 'select',
        name: 'typescript',
        message: 'Are you using TypeScript?',
        choices: ['Yes', 'No', 'Setup'],
      },
      {
        type: 'multiselect',
        name: 'options',
        message: 'Choose options (press space for select):',
        choices: [
          {
            name: 'linter (eslint)',
            value: 'eslint',
          },
          {
            name: 'formatter (prettier)',
            value: 'prettier',
          },
          {
            name: 'test (vitest)',
            value: 'vitest',
          },
          {
            name: 'git hook (husky,lint-staged)',
            value: 'husky',
          },
          {
            name: 'GitHub WorkFlows (build, test, lint,format)',
            value: 'github-workflows',
          },
        ],
        result(value) {
          //dont know why the type doesnt exist in the first place
          // eslint-disable-next-line
          // @ts-ignore
          return this.map(value);
        },
      },
      {
        type: 'select',
        name: 'git',
        message: 'Want to intiliazie a git repository ?',
        choices: ['Yes', 'No'],
      },
    ]);
    const cwd = process.cwd();
    const templateDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../templates');
    await globalHandler(cwd, templateDir, packageManager, typescript, git, options);
  });

program
  .command('setup')
  .description('Setup individual component')
  .argument('<component>', 'The component to setup')
  .option('-t,--typescript <option>', 'Enable or disable TypeScript support (y/n)', 'y')
  .option('-p,--package-manager <pm>', 'Specify package manager (npm/yarn/pnpm/bun)', 'pnpm')
  .action(async (component: string, options) => {
    const cwd = process.cwd();
    const templateDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../templates');

    const { typescript, packageManager } = options;

    //validating
    if (!['y', 'n'].includes(typescript.toLowerCase())) {
      logError('❌ Invalid value for --typescript. Allowed: "y" or "n".');
      process.exit(1);
    }

    const validPMs = ['npm', 'yarn', 'pnpm', 'bun'];
    if (!validPMs.includes(packageManager.toLowerCase())) {
      logError(
        `❌ Invalid package manager "${packageManager}". Use one of: ${validPMs.join(', ')}`
      );
      process.exit(1);
    }
    await handleIndividualCommand(cwd, templateDir, packageManager, component, typescript);
  });

program.parse(process.argv);
