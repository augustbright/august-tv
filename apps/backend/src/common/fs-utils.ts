import { promises as fs } from 'fs';
import * as path from 'path';

export const UPLOAD_PATH = './tmp/';

export const resolveUploadPath = (...paths: string[]) =>
  path.resolve(path.join(UPLOAD_PATH, ...paths));

export async function ensureDir(dir: string): Promise<string> {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
  return dir;
}

export async function ensureUploadPath(...paths: string[]) {
  return ensureDir(resolveUploadPath(...paths));
}

export async function moveUploadedFile(filename: string, ...paths: string[]) {
  const oldPath = resolveUploadPath(filename);
  const newPath = resolveUploadPath(...paths);
  const newDir = path.dirname(newPath);
  await ensureDir(newDir);
  await fs.rename(oldPath, newPath);
  return newPath;
}

export async function getManyFiles(
  folder: string,
  filter?: (filename: string) => boolean,
) {
  const resolvedPath = resolveUploadPath(folder);
  const allFiles = await fs.readdir(resolvedPath);

  return allFiles
    .map((file) => path.resolve(path.join(resolvedPath, file)))
    .filter(filter ?? Boolean);
}

export async function cleanUp(path: string) {
  try {
    await fs.rm(resolveUploadPath(path), { recursive: true });
  } catch {
    // Ignore
  }
}
