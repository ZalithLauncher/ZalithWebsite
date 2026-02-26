#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

/**
 * 获取GitHub仓库的最新发布信息
 * @param {string} repo - 仓库名称，格式: owner/repo
 * @returns {Promise<Object>} 发布信息
 */
async function fetchLatestRelease(repo) {
  const url = `https://api.github.com/repos/${repo}/releases/latest`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'ZalithWebsite-Auto-Updater'
      }
    });
    
    if (!response.ok) {
      throw new Error(`GitHub API request failed: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching release for ${repo}:`, error.message);
    throw error;
  }
}

/**
 * 格式化文件大小
 * @param {number} bytes - 字节数
 * @returns {string} 格式化后的大小
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * 转换GitHub发布信息为本地版本格式
 * @param {Object} release - GitHub发布信息
 * @returns {Object} 本地版本格式
 */
function transformReleaseData(release) {
  const assets = release.assets
    .filter(asset => asset.name.endsWith('.apk'))
    .map(asset => ({
      name: asset.name,
      browser_download_url: asset.browser_download_url,
      size: formatFileSize(asset.size),
      download_count: asset.download_count
    }));

  return {
    latest_version: release.tag_name,
    release_date: release.published_at,
    assets: assets,
    body: release.body || ''
  };
}

/**
 * 更新版本文件
 * @param {string} filePath - 文件路径
 * @param {Object} data - 新的版本数据
 */
async function updateVersionFile(filePath, data) {
  try {
    // 确保目标目录存在
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
    
    const jsonString = JSON.stringify(data, null, 2);
    await fs.writeFile(filePath, jsonString, 'utf8');
    console.log(`✅ Updated ${filePath}`);
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
    throw error;
  }
}

/**
 * 比较版本数据是否有变化
 * @param {Object} oldData - 旧数据
 * @param {Object} newData - 新数据
 * @returns {boolean} 是否有变化
 */
function hasChanges(oldData, newData) {
  return JSON.stringify(oldData) !== JSON.stringify(newData);
}

/**
 * 主函数
 */
async function main() {
  console.log('🚀 Starting version update process...');
  console.log(`📅 Timestamp: ${new Date().toISOString()}`);
  
  const publicDir = path.join(__dirname, '..', 'public');
  const officialPublicDir = path.join(__dirname, '..', 'official-website', 'public');
  
  const zl1VersionFiles = [
    path.join(publicDir, 'version.json'),
    path.join(officialPublicDir, 'version.json')
  ];
  const zl2VersionFiles = [
    path.join(publicDir, 'version2.json'),
    path.join(officialPublicDir, 'version2.json')
  ];
  
  let hasAnyChanges = false;
  
  try {
    // 更新ZL1版本信息
    console.log('\n📦 Fetching ZL1 latest release...');
    const zl1Release = await fetchLatestRelease('ZalithLauncher/ZalithLauncher');
    const zl1Data = transformReleaseData(zl1Release);
    
    // 读取现有ZL1版本文件 (以根目录为准进行比较)
    let oldZl1Data = {};
    try {
      const oldZl1Content = await fs.readFile(zl1VersionFiles[0], 'utf8');
      oldZl1Data = JSON.parse(oldZl1Content);
    } catch (error) {
      console.log('📄 No existing ZL1 version file found, creating new one...');
    }
    
    if (hasChanges(oldZl1Data, zl1Data)) {
      for (const file of zl1VersionFiles) {
        await updateVersionFile(file, zl1Data);
      }
      hasAnyChanges = true;
      console.log(`📈 ZL1 updated to version: ${zl1Data.latest_version}`);
    } else {
      console.log(`✅ ZL1 version ${zl1Data.latest_version} is already up to date`);
    }
    
    // 更新ZL2版本信息
    console.log('\n📦 Fetching ZL2 latest release...');
    const zl2Release = await fetchLatestRelease('ZalithLauncher/ZalithLauncher2');
    const zl2Data = transformReleaseData(zl2Release);
    
    // 读取现有ZL2版本文件 (以根目录为准进行比较)
    let oldZl2Data = {};
    try {
      const oldZl2Content = await fs.readFile(zl2VersionFiles[0], 'utf8');
      oldZl2Data = JSON.parse(oldZl2Content);
    } catch (error) {
      console.log('📄 No existing ZL2 version file found, creating new one...');
    }
    
    if (hasChanges(oldZl2Data, zl2Data)) {
      for (const file of zl2VersionFiles) {
        await updateVersionFile(file, zl2Data);
      }
      hasAnyChanges = true;
      console.log(`📈 ZL2 updated to version: ${zl2Data.latest_version}`);
    } else {
      console.log(`✅ ZL2 version ${zl2Data.latest_version} is already up to date`);
    }
    
    // 总结
    console.log('\n🎉 Version update process completed!');
    if (hasAnyChanges) {
      console.log('📝 Changes detected and files updated.');
    } else {
      console.log('📋 No changes detected, all versions are up to date.');
    }
    
  } catch (error) {
    console.error('\n❌ Version update process failed:', error.message);
    process.exit(1);
  }
}

// 运行主函数
if (require.main === module) {
  main();
}

module.exports = {
  fetchLatestRelease,
  transformReleaseData,
  updateVersionFile,
  hasChanges
};