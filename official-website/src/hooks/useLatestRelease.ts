import { useState, useEffect, useMemo } from 'react';

export interface Asset {
  id: string | number;
  name: string;
  browser_download_url: string;
  size: number;
  download_count: number;
}

export interface Release {
  name: string;
  tag_name: string;
  published_at: string;
  body: string;
  assets: Asset[];
}

export interface DeviceType {
  id: string;
  name: string;
  icon?: string;
  description: string;
  patterns: string[];
}

export interface DownloadSource {
  id: string;
  name: string;
  description: string;
  speed: string;
  contributor?: {
    name: string;
    url: string;
  };
}

const BASE_DEVICE_TYPES: DeviceType[] = [
  { id: 'all', name: '全部文件', description: '显示所有下载文件', patterns: ['*'] },
  { id: 'windows', name: 'Windows', description: 'Windows 电脑', patterns: ['windows', 'win', '.exe', '.msi'] },
  { id: 'macos', name: 'macOS', description: 'Mac 电脑', patterns: ['macos', 'mac', 'darwin', '.dmg'] },
  { id: 'linux', name: 'Linux', description: 'Linux 系统', patterns: ['linux', '.appimage', '.deb', '.rpm', '.tar.gz'] },
  { id: 'ios', name: 'iOS', description: 'iPhone/iPad', patterns: ['ios', '.ipa'] },
];

const DOWNLOAD_SOURCES: DownloadSource[] = [
  { id: 'github', name: 'GitHub 官方', description: '官方发布渠道', speed: '海外较快' },
  { id: 'mirror', name: '国内加速', description: 'fishcpy 提供', speed: '国内较快', contributor: { name: 'fishcpy', url: 'https://github.com/fishcpy' } },
  { id: 'foxington', name: 'Foxington 源', description: '第三方镜像', speed: '国内较快', contributor: { name: 'XiaoluoFoxington', url: 'https://github.com/XiaoluoFoxington' } },
  { id: 'haha', name: '哈哈源', description: 'FrostLynx 提供', speed: '国内较快', contributor: { name: 'FrostLynx', url: 'https://frostlynx.work' } },
  { id: 'lemwood', name: '柠枺镜像', description: 'Lemwood 提供', speed: '国内较快', contributor: { name: 'Lemwood', url: 'https://lemwood.cn' } },
];

export const useLatestRelease = (project: 'zl1' | 'zl2') => {
  const [release, setRelease] = useState<Release | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isChinaIP, setIsChinaIP] = useState(false);
  const [apiFailed, setApiFailed] = useState(false);
  
  const [mirrorData, setMirrorData] = useState<{
    foxington: any;
    haha: any;
    lemwood: any;
  }>({ foxington: null, haha: null, lemwood: null });

  const repo = project === 'zl1' ? 'ZalithLauncher/ZalithLauncher' : 'ZalithLauncher/ZalithLauncher2';
  const localVersionFile = project === 'zl1' ? '/version.json' : '/version2.json';

  const detectIP = async () => {
    try {
      const cached = localStorage.getItem('isChineseIP');
      const expire = localStorage.getItem('isChineseIPExpire');
      if (cached && expire && Date.now() < parseInt(expire)) {
        setIsChinaIP(cached === 'true');
        return cached === 'true';
      }

      const res = await fetch('https://ipapi.co/json/');
      if (res.ok) {
        const data = await res.json();
        const isCN = data.country === 'CN' || data.region === 'China';
        localStorage.setItem('isChineseIP', isCN.toString());
        localStorage.setItem('isChineseIPExpire', (Date.now() + 86400000).toString());
        setIsChinaIP(isCN);
        return isCN;
      }
    } catch (e) {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const isCN = tz.includes('Asia/Shanghai') || tz.includes('Asia/Chongqing');
      setIsChinaIP(isCN);
      return isCN;
    }
    return false;
  };

  const fetchMirrors = async () => {
    const foxingtonUrl = project === 'zl1' ? 'https://next.foldcraftlauncher.cn/data/down/zl/1/1.4.1.0/index.json' : null;
    const hahaUrl = `https://api.mirror.frostlynx.work/api/projects/${project === 'zl1' ? 'zl' : 'zl2'}/latest`;
    const lemwoodUrl = `https://mirror.lemwood.icu/api/status/${project === 'zl1' ? 'zl' : 'zl2'}`;

    const fetchJson = async (url: string) => {
      try {
        const res = await fetch(url);
        if (res.ok) return await res.json();
        const proxyRes = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
        if (!proxyRes.ok) return null;
        const proxyData = await proxyRes.json();
        if (!proxyData || !proxyData.contents) return null;
        return JSON.parse(proxyData.contents);
      } catch (e) {
        console.error('Fetch mirror data failed', e);
        return null;
      }
    };

    const [fox, ha, lem] = await Promise.all([
      foxingtonUrl ? fetchJson(foxingtonUrl) : Promise.resolve(null),
      fetchJson(hahaUrl),
      fetchJson(lemwoodUrl)
    ]);

    setMirrorData({ foxington: fox, haha: ha, lemwood: lem });
  };

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      setApiFailed(false);

      try {
        const res = await fetch(`https://api.github.com/repos/${repo}/releases/latest`);
        if (!res.ok) throw new Error('GitHub API failed');
        const data = await res.json();
        setRelease(data);
      } catch (e) {
        setApiFailed(true);
        try {
          const localRes = await fetch(localVersionFile);
          const localData = await localRes.json();
          setRelease({
            name: `${project.toUpperCase()} ${localData.latest_version}`,
            tag_name: `v${localData.latest_version}`,
            published_at: localData.release_date,
            body: localData.body || '',
            assets: localData.assets.map((a: any) => ({
              ...a,
              id: Math.random(),
              download_count: a.download_count || 0
            }))
          });
        } catch (le) {
          setError('无法获取版本信息');
        }
      } finally {
        setIsLoading(false);
        detectIP();
        fetchMirrors();
      }
    };

    load();
  }, [project, repo, localVersionFile]);

  const dynamicDeviceTypes = useMemo(() => {
    if (!release?.assets) return BASE_DEVICE_TYPES;

    const architectures = new Set<string>();
    release.assets.forEach(asset => {
      const name = asset.name.toLowerCase();
      if (name.includes('arm64-v8a') || name.includes('arm64')) architectures.add('arm64');
      else if (name.includes('armeabi-v7a') || name.includes('armeabi')) architectures.add('armeabi');
      else if (name.includes('x86_64') || name.includes('x86-64')) architectures.add('x86_64');
      else if (name.includes('x86')) architectures.add('x86');
      else if (name.includes('universal')) architectures.add('universal');
    });

    const result = [...BASE_DEVICE_TYPES];
    architectures.forEach(arch => {
      result.push({
        id: arch,
        name: arch === 'universal' ? '通用版本' : arch.toUpperCase(),
        description: `${arch.toUpperCase()} 架构`,
        patterns: [arch]
      });
    });
    return result;
  }, [release]);

  return {
    release,
    isLoading,
    error,
    isChinaIP,
    apiFailed,
    mirrorData,
    dynamicDeviceTypes,
    downloadSources: DOWNLOAD_SOURCES
  };
};
