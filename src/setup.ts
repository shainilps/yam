import path from 'path';
import { addScripts, copyFile, readSetUp } from './utils/file.js';
import {
  getExecCommand,
  getInstallCommand,
  initliazeGit,
  runShellCommand,
} from './utils/script.js';
import { logInfo, logSuccess } from './utils/logger.js';
import fs from 'fs-extra';

export async function setUp(packageManager: string, source: string, destination: string) {
  const data = await readSetUp(path.join(source, 'setup.json'));
  const prodDependency: string[] = data.dependency.prodDependency;
  const devDependency: string[] = data.dependency.devDependency;
  const pmSpecific: string[] = data.scripts.pmSpecific;
  const general: string[] = data.scripts.general;
  const packageJson: Record<string, string> = data.scripts.packageJson; //object
  const configFiles: string[] = data.configFiles;
  if (prodDependency.length > 0) {
    const command = `${getInstallCommand(packageManager)} ${prodDependency.join(' ')}`;
    await runShellCommand(command);
  }
  if (devDependency.length > 0) {
    const command = `${getInstallCommand(packageManager, true)} ${devDependency.join(' ')}`;
    await runShellCommand(command);
  }
  if (pmSpecific.length > 0) {
    for (const cmd of pmSpecific) {
      const command = `${getExecCommand(packageManager)} ${cmd.trim()}`;
      await runShellCommand(command);
    }
  }
  if (general.length > 0) {
    for (const cmd of general) {
      await runShellCommand(cmd.trim());
    }
  }
  if (packageJson) {
    await addScripts(packageJson, path.resolve(process.cwd(), 'package.json'));
  }

  if (configFiles.length > 0) {
    await Promise.all(
      configFiles.map(async (file) => {
        const src = path.join(source, file);
        const dst = path.join(destination, file);
        await copyFile(src, dst);
      })
    );
  }
}

export async function InitProject(destination: string, source: string) {
  const src = path.join(source, 'package.json');
  const dest = path.join(destination, 'package.json');
  if (!fs.existsSync(dest)) {
    fs.copy(src, dest);
  }
}

export async function setUpTypescript(cwd: string, templateDir: string, packageManager: string) {
  logInfo('Setting up Typescript');
  const source = path.join(templateDir, 'ts', 'typescript');
  await setUp(packageManager, source, cwd);
  logSuccess('Typescript set up successfully');
}

export async function setUpESLintTS(cwd: string, templateDir: string, packageManager: string) {
  logInfo('Setting up eslint for Typescript...');
  const source = path.join(templateDir, 'ts', 'eslint');
  await setUp(packageManager, source, cwd);
  logSuccess('eslint set up successfully');
}

export async function setUpESLintJS(cwd: string, templateDir: string, packageManager: string) {
  logInfo('Setting up eslint for Javascript...');
  const source = path.join(templateDir, 'js', 'eslint');
  await setUp(packageManager, source, cwd);
  logSuccess('eslint set up successfully');
}

export async function setUpPrettier(cwd: string, templateDir: string, packageManager: string) {
  logInfo('Setting up prettier...');
  const source = path.join(templateDir, 'prettier');
  await setUp(packageManager, source, cwd);
  logSuccess('prettier set up successfully');
}

export async function setUpVitest(cwd: string, templateDir: string, packageManager: string) {
  logInfo('Setting up vitest');
  const source = path.join(templateDir, 'vitest');
  await setUp(packageManager, source, cwd);
  logSuccess('vitest set up successfully');
}

export async function setUpHuskyAndLintStaged(
  cwd: string,
  templateDir: string,
  packageManager: string
) {
  logInfo('Setting up husky and lint-staged');
  const source1 = path.join(templateDir, 'husky');
  await setUp(packageManager, source1, cwd);

  const source2 = path.join(templateDir, 'lint-staged');
  await setUp(packageManager, source2, cwd);

  logSuccess('husky and lint-staged set up successfully');
}

export async function setUpGitHubWorkflows(
  cwd: string,
  templateDir: string,
  packageManager: string
) {
  logInfo('Setting up GitHub workflow');
  const source = path.join(templateDir, 'workflow');
  await setUp(packageManager, source, cwd);
  logSuccess('GitHub workflow set up successfully');
}

export async function initializeGit(cwd: string, templateDir: string) {
  logInfo('Initializing git repo');
  const source = path.join(templateDir, 'git-repo', 'gitignore');
  const dest = path.join(cwd, '.gitignore');
  await initliazeGit(source, dest);
  logSuccess('Git repo set up successfully');
}
