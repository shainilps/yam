import {
  initializeGit,
  InitProject,
  setUpESLintJS,
  setUpESLintTS,
  setUpGitHubWorkflows,
  setUpHuskyAndLintStaged,
  setUpPrettier,
  setUpTypescript,
  setUpVitest,
} from './setup.js';
import { isToolPresent } from './utils/data.js';
import { logError } from './utils/logger.js';

/**
 * Handles global project configuration based on user options
 * @param cwd - Current working directory
 * @param templateDir - Directory containing template files
 * @param packageManager - Package manager to use (npm, yarn, pnpm)
 * @param typescript - Typescript configuration option
 * @param git - Git initialization option
 * @param options - Additional tooling options
 */

export async function globalHandler(
  cwd: string,
  templateDir: string,
  packageManager: string,
  typescript: string,
  git: string,
  options: Record<string, string>
) {
  InitProject(cwd, templateDir);
  if (typescript === 'Setup') {
    await setUpTypescript(cwd, templateDir, packageManager);
  }

  const shouldProcessTS = typescript === 'Setup' || typescript === 'Yes';
  if (shouldProcessTS && isToolPresent(options, 'eslint')) {
    await setUpESLintTS(cwd, templateDir, packageManager);
  }
  if (!shouldProcessTS && isToolPresent(options, 'eslint')) {
    await setUpESLintJS(cwd, templateDir, packageManager);
  }

  if (isToolPresent(options, 'prettier')) {
    await setUpPrettier(cwd, templateDir, packageManager);
  }

  if (isToolPresent(options, 'vitest')) {
    await setUpVitest(cwd, templateDir, packageManager);
  }

  if (isToolPresent(options, 'husky')) {
    await setUpHuskyAndLintStaged(cwd, templateDir, packageManager);
  }

  if (isToolPresent(options, 'github-workflows')) {
    await setUpGitHubWorkflows(cwd, templateDir, packageManager);
  }

  if (git === 'Yes') {
    await initializeGit(cwd, templateDir);
  }
}

export async function handleIndividualCommand(
  cwd: string,
  templateDir: string,
  packageManager: string,
  tool: string,
  typescript: string
) {
  const toolKey = tool.toLowerCase().trim();
  switch (toolKey) {
    case 'typescript':
      await setUpTypescript(cwd, templateDir, packageManager);
      break;

    case 'eslint':
      if (typescript === 'y') await setUpESLintTS(cwd, templateDir, packageManager);
      else await setUpESLintJS(cwd, templateDir, packageManager);
      break;

    case 'prettier':
      await setUpPrettier(cwd, templateDir, packageManager);
      break;

    case 'vitest':
      await setUpVitest(cwd, templateDir, packageManager);
      break;

    case 'husky':
      await setUpHuskyAndLintStaged(cwd, templateDir, packageManager);
      break;

    case 'github-workflows':
      await setUpGitHubWorkflows(cwd, templateDir, packageManager);
      break;

    case 'git':
      await initializeGit(cwd, templateDir);
      break;

    default:
      logError(`Unknown component '${tool}'. Please choose a valid component.`);
      break;
  }
}
