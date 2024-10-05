import { promises as fs } from 'fs';

export async function ensureDir(dir: string): Promise<string> {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
  return dir;
}
