import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import type { BuildInfo } from '../src/types/blog';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REPO_URL = 'https://github.com/ZalithLauncher/ZalithWebsite';

function getBuildInfo(): BuildInfo {
  let commitHash = 'unknown';
  let commitDate = '';
  let branch = 'unknown';

  try {
    commitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim();
    commitDate = execSync('git log -1 --format=%cI', { encoding: 'utf-8' }).trim();
    branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim();
  } catch {
    console.warn('Warning: Could not get git info, using defaults');
  }

  const buildInfo: BuildInfo = {
    commitHash,
    commitDate,
    branch,
    buildTime: new Date().toISOString(),
    repoUrl: REPO_URL,
  };

  return buildInfo;
}

function main() {
  const buildInfo = getBuildInfo();
  const outputPath = path.resolve(__dirname, '../public/build-info.json');
  
  fs.writeFileSync(outputPath, JSON.stringify(buildInfo, null, 2));
  console.log('Build info generated:', buildInfo);
}

main();
