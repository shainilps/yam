import fs from 'fs-extra';
import { logError, logSuccess } from './logger.js';

export async function copyFile(src: string, dst: string) {
  await fs.copy(src, dst);
}

export async function readSetUp(dest: string): Promise<any> {
  try {
    const data = await fs.readJson(dest);
    return data;
  } catch (err) {
    logError(`Error reading or parsing the setup file:${err}`);
    return null;
  }
}

export async function addScripts(
  scriptsToAdd: Record<string, string>,
  packageJsonPath: string
): Promise<void> {
  try {
    const pkg = await fs.readJson(packageJsonPath);

    pkg.scripts = {
      ...(pkg.scripts || {}),
      ...scriptsToAdd,
    };

    await fs.writeJson(packageJsonPath, pkg, { spaces: 2 });
    logSuccess('Scripts successfully added to package.json');
  } catch (err) {
    logError(`Failed to add script to package.json: ${err}`);
  }
}
