import { spawn } from 'child_process';
import { copyFile } from './file.js';

export function runShellCommand(cmd: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const [command, ...args] = cmd.split(' ');
    const child = spawn(command, args, { stdio: 'inherit', shell: true });

    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Command failed with exit code ${code}`));
        return;
      }
      resolve();
    });

    child.on('error', (err) => {
      reject(err);
    });
  });
}

export function getInstallCommand(packageManager: string, isDev = false): string {
  const devFlag = {
    npm: '--save-dev',
    yarn: '--dev',
    pnpm: '--save-dev',
    bun: '--dev',
  };

  switch (packageManager) {
    case 'npm':
      return `npm install ${isDev ? devFlag.npm : ''}`.trim();
    case 'yarn':
      return `yarn add ${isDev ? devFlag.yarn : ''}`.trim();
    case 'pnpm':
      return `pnpm add ${isDev ? devFlag.pnpm : ''}`.trim();
    case 'bun':
      return `bun add ${isDev ? devFlag.bun : ''}`.trim();
    default:
      throw new Error(`Unsupported package manager: ${packageManager}`);
  }
}

export function getExecCommand(packageManager: string): string {
  switch (packageManager) {
    case 'npm':
      return 'npx';
    case 'yarn':
      return 'yarn dlx';
    case 'pnpm':
      return 'pnpm dlx';
    case 'bun':
      return 'bunx';
    default:
      throw new Error(`Unsupported package manager: ${packageManager}`);
  }
}

export async function initliazeGit(src: string, dest: string) {
  const cmd1 = 'git init';
  const cmd2 = 'git add .';
  const cmd3 = 'git commit -m "repo:Init"';
  const cmd4 = 'git branch -M main';
  await runShellCommand(cmd1);
  console.log('\n---------------', src, dest, '----------------\n');
  await copyFile(src, dest);
  await runShellCommand(cmd2);
  await runShellCommand(cmd3);
  await runShellCommand(cmd4);
}
