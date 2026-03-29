import path from 'path';

export function getRepoRoot(): string {
  if (process.env.BURRO_REPO_ROOT) {
    return process.env.BURRO_REPO_ROOT;
  }

  return path.resolve(process.cwd(), '..', '..');
}

export function getRepoPath(...segments: string[]): string {
  return path.join(getRepoRoot(), ...segments);
}
