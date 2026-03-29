import { appendFile, mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';

export function getFrontendRoot(): string {
  return process.cwd();
}

export function getRepoRoot(): string {
  return path.resolve(getFrontendRoot(), '..', '..');
}

export function getCmsPath(...segments: string[]): string {
  return path.join(getRepoRoot(), 'website', 'cms', ...segments);
}

export function getDataPath(...segments: string[]): string {
  return path.join(getRepoRoot(), 'data', ...segments);
}

export async function ensureDir(targetPath: string): Promise<void> {
  await mkdir(path.dirname(targetPath), { recursive: true });
}

export async function appendJsonLine(targetPath: string, payload: unknown): Promise<void> {
  await ensureDir(targetPath);
  await appendFile(targetPath, `${JSON.stringify(payload)}\n`, 'utf8');
}

export async function readJsonFile<T>(targetPath: string, fallback: T): Promise<T> {
  try {
    const raw = await readFile(targetPath, 'utf8');
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function writeJsonFile(targetPath: string, payload: unknown): Promise<void> {
  await ensureDir(targetPath);
  await writeFile(targetPath, JSON.stringify(payload, null, 2), 'utf8');
}
