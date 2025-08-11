import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.resolve(__dirname, './public/Releases.json');

const repo = 'ZalithLauncher/ZalithLauncher';
const apiUrl = `https://api.github.com/repos/${repo}/releases/latest`;

import fetch from 'node-fetch';

async function generateReleasesJson() {
  try {
    const res = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'ZalithLauncher/1.0'
      },
    });

    if (!res.ok) {
      throw new Error(` 请求出错；${res.status} ${res.statusText}`);
    }

    const data = await res.json();

    // Validate that data.assets exists
    if (!data.assets || !Array.isArray(data.assets)) {
      throw new Error('没有版本');
    }

    const assets = data.assets.map(asset => ({
      name: asset.name,
      download_url: asset.browser_download_url,
      size: asset.size,
      updated_at: asset.updated_at,
    }));

    writeFileSync(outputPath, JSON.stringify(assets, null, 2), 'utf8');
    console.log('成功');
  } catch (err) {
    console.error('失败:', err.message);
    process.exit(1);
  }
}

generateReleasesJson();