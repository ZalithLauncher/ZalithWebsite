import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const LEMWOOD_API_BASE = 'https://miawa.cn/api/v2';

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

const DOWNLOAD_SOURCES: DownloadSource[] = [
  { id: 'github', name: 'GitHub 官方', description: '官方发布渠道', speed: '海外较快' },
  { id: 'mirror', name: '国内加速', description: 'fishcpy 提供', speed: '国内较快', contributor: { name: 'fishcpy', url: 'https://github.com/fishcpy' } },
  { id: 'foxington', name: 'Foxington 源', description: '第三方镜像', speed: '国内较快', contributor: { name: 'XiaoluoFoxington', url: 'https://github.com/XiaoluoFoxington' } },
  { id: 'haha', name: '哈哈源', description: 'FrostLynx 提供', speed: '国内较快', contributor: { name: 'FrostLynx', url: 'https://frostlynx.work' } },
  { id: 'lemwood', name: '柠枺镜像', description: 'Lemwood 提供', speed: '国内较快', contributor: { name: 'Lemwood', url: 'https://lemwood.cn' } },
];

function filterMappingAssets(release: Release): Release {
  if (!release?.assets) return release;
  return {
    ...release,
    assets: release.assets.filter(a => !/^mapping.*\.zip$/i.test(a.name))
  };
}

export const useLatestRelease = (project: 'zl1' | 'zl2', currentLang: string) => {
  const { t } = useTranslation();
  const [release, setRelease] = useState<Release | null>(null);
  
  // Independent loading states
  const [isReleaseLoading, setIsReleaseLoading] = useState(true);
  const [isNotesLoading, setIsNotesLoading] = useState(true);
  const [isMirrorsLoading, setIsMirrorsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [isChinaIP, setIsChinaIP] = useState(false);
  const [apiFailed, setApiFailed] = useState(false);
  const [versionJsonData, setVersionJsonData] = useState<any>(null);
  
  const [mirrorData, setMirrorData] = useState<{
    foxington: any;
    haha: any;
    lemwood: any;
  }>({ foxington: null, haha: null, lemwood: null });

  const repo = project === 'zl1' ? 'ZalithLauncher/ZalithLauncher' : 'ZalithLauncher/ZalithLauncher2';
  const localVersionFile = project === 'zl1' ? '/version.json' : '/version2.json';
  const versionInfoUrl = project === 'zl1' 
    ? 'https://repo.miawa.cn/zalith-info/launcher_version.json'
    : 'https://repo.miawa.cn/zalith-info/v2/latest_version_md.json';

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setIsReleaseLoading(true);
      setIsNotesLoading(true);
      setIsMirrorsLoading(true);
      setIsSyncing(false);
      setError(null);
      setApiFailed(false);

      const cacheKeyPrefix = `zalith_cache_${project}_`;
      const cachedRelease = localStorage.getItem(`${cacheKeyPrefix}release`);
      const cachedNotes = localStorage.getItem(`${cacheKeyPrefix}notes`);
      const cachedMirrors = localStorage.getItem(`${cacheKeyPrefix}mirrors`);
      
      let hasCache = false;

      if (cachedRelease) {
        try {
          setRelease(filterMappingAssets(JSON.parse(cachedRelease)));
          setIsReleaseLoading(false);
          hasCache = true;
        } catch (e) { /* ignore */ }
      }
      if (cachedNotes) {
        try {
          setVersionJsonData(JSON.parse(cachedNotes));
          setIsNotesLoading(false);
        } catch (e) { /* ignore */ }
      }
      if (cachedMirrors) {
        try {
          setMirrorData(JSON.parse(cachedMirrors));
          setIsMirrorsLoading(false);
        } catch (e) { /* ignore */ }
      }

      if (hasCache) {
        setIsSyncing(true);
      }

      const fetchReleaseTask = async () => {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3000);
          
          const res = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, {
            signal: controller.signal
          });
          clearTimeout(timeoutId);
          
          if (!res.ok) throw new Error('GitHub API failed');
          const data = await res.json();
          if (isMounted) {
            const filtered = filterMappingAssets(data);
            setRelease(filtered);
            localStorage.setItem(`${cacheKeyPrefix}release`, JSON.stringify(filtered));
            setIsReleaseLoading(false);
          }
        } catch (e) {
          if (isMounted) setApiFailed(true);
          try {
            const localRes = await fetch(localVersionFile);
            const localData = await localRes.json();
            const fallbackRelease = {
              name: `${project.toUpperCase()} ${localData.latest_version}`,
              tag_name: `v${localData.latest_version}`,
              published_at: localData.release_date,
              body: localData.body || '',
              assets: localData.assets.map((a: any) => ({
                ...a,
                id: Math.random(),
                download_count: a.download_count || 0
              }))
            };
            if (isMounted) {
              const filtered = filterMappingAssets(fallbackRelease);
              setRelease(filtered);
              localStorage.setItem(`${cacheKeyPrefix}release`, JSON.stringify(filtered));
              setIsReleaseLoading(false);
            }
          } catch (le) {
            if (isMounted && !hasCache) {
              setError('无法获取版本信息');
              setIsReleaseLoading(false);
            }
          }
        }
      };

      const fetchNotesTask = async () => {
        try {
          const res = await fetch(versionInfoUrl);
          if (res.ok) {
            const data = await res.json();
            if (isMounted) {
              setVersionJsonData(data);
              localStorage.setItem(`${cacheKeyPrefix}notes`, JSON.stringify(data));
              setIsNotesLoading(false);
            }
          } else {
             if (isMounted && !cachedNotes) setIsNotesLoading(false);
          }
        } catch (e) {
          console.warn('Fetch version json data failed', e);
          if (isMounted && !cachedNotes) setIsNotesLoading(false);
        }
      };

      const fetchMirrorsTask = async () => {
        const foxingtonUrl = project === 'zl1' ? 'https://next.foldcraftlauncher.cn/data/down/zl/1/1.4.1.0/index.json' : null;
        const hahaUrl = `https://api.mirror.frostlynx.work/api/projects/${project === 'zl1' ? 'zl' : 'zl2'}/latest`;
        const lemwoodUrl = `${LEMWOOD_API_BASE}/launchers/${project === 'zl1' ? 'zl' : 'zl2'}`;

        const fetchJson = async (url: string) => {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            const res = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);

            const parseBody = async (response: Response) => {
              const data = await response.json();
              // 柠枺镜像 v2 接口使用统一信封：{ data, error, meta }
              if (data && typeof data === 'object' && 'data' in data && data.error === null) {
                return data.data;
              }
              return data;
            };

            if (res.ok) return await parseBody(res);

            const proxyRes = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
            if (!proxyRes.ok) return null;
            const proxyData = await proxyRes.json();
            if (!proxyData || !proxyData.contents) return null;
            const parsed = JSON.parse(proxyData.contents);
            if (parsed && typeof parsed === 'object' && 'data' in parsed && parsed.error === null) {
              return parsed.data;
            }
            return parsed;
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

        if (isMounted) {
          const newMirrorData = { foxington: fox, haha: ha, lemwood: lem };
          setMirrorData(newMirrorData);
          localStorage.setItem(`${cacheKeyPrefix}mirrors`, JSON.stringify(newMirrorData));
          setIsMirrorsLoading(false);
        }
      };

      const detectIPTask = async () => {
        try {
          const cached = localStorage.getItem('isChineseIP');
          const expire = localStorage.getItem('isChineseIPExpire');
          if (cached && expire && Date.now() < parseInt(expire)) {
            if (isMounted) setIsChinaIP(cached === 'true');
            return;
          }

          const res = await fetch('https://ipapi.co/json/');
          if (res.ok) {
            const data = await res.json();
            const isCN = data.country === 'CN' || data.region === 'China';
            localStorage.setItem('isChineseIP', isCN.toString());
            localStorage.setItem('isChineseIPExpire', (Date.now() + 86400000).toString());
            if (isMounted) setIsChinaIP(isCN);
            return;
          }
        } catch (e) {
          const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
          const isCN = tz.includes('Asia/Shanghai') || tz.includes('Asia/Chongqing');
          if (isMounted) setIsChinaIP(isCN);
        }
      };

      await Promise.allSettled([
        fetchReleaseTask(),
        fetchNotesTask(),
        fetchMirrorsTask(),
        detectIPTask()
      ]);

      if (isMounted) {
        setIsSyncing(false);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [project, repo, localVersionFile, versionInfoUrl]);

  const localizedBody = useMemo(() => {
    if (!versionJsonData) return null;

    if (project === 'zl1') {
      const desc = versionJsonData.description;
      if (!desc) return null;
      
      const lang = currentLang.toLowerCase();
      if (lang.includes('zh-tw') || lang.includes('zh-hk')) return desc.zh_tw || desc.zh_cn || desc.en_us;
      if (lang.includes('zh')) return desc.zh_cn || desc.en_us;
      return desc.en_us || desc.zh_cn;
    } else {
      const bodies = versionJsonData.bodies || [];
      const defaultBody = versionJsonData.default_body;
      const lang = currentLang.toLowerCase();

      let targetBody = null;
      if (lang.includes('zh')) {
        targetBody = bodies.find((b: any) => b.language === 'zh');
      } else if (lang.includes('en')) {
        targetBody = bodies.find((b: any) => b.language === 'en');
      }

      if (!targetBody) targetBody = defaultBody;

      if (targetBody && targetBody.markdown) {
        return targetBody.markdown;
      }
    }
    return null;
  }, [versionJsonData, project, currentLang]);

  const dynamicDeviceTypes = useMemo(() => {
    const baseTypes: DeviceType[] = [
      { id: 'all', name: t('download.devices.all'), description: t('download.devices.allDesc'), patterns: ['*'] },
    ];

    if (!release?.assets) return baseTypes;

    const architectures = new Set<string>();
    let hasUniversal = false;

    release.assets.forEach(asset => {
      const name = asset.name.toLowerCase();
      if (name.includes('arm64-v8a') || name.includes('arm64')) architectures.add('arm64');
      else if (name.includes('armeabi-v7a') || name.includes('armeabi')) architectures.add('armeabi');
      else if (name.includes('x86_64') || name.includes('x86-64')) architectures.add('x86_64');
      else if (name.includes('x86')) architectures.add('x86');
      else {
        // 检查是否为通用版本（没有架构后缀的 .apk 文件）
        if (name.endsWith('.apk') && 
            !name.includes('arm64') && !name.includes('armv8') && 
            !name.includes('armeabi') && !name.includes('armv7') && 
            !name.includes('x86')) {
          hasUniversal = true;
        }
      }
    });

    const result = [...baseTypes];

    // 如果有通用版本，添加 Android 通用选项
    if (hasUniversal) {
      result.push({ 
        id: 'android', 
        name: t('download.devices.android'), 
        description: t('download.devices.androidDesc'), 
        patterns: ['universal-not-used'] // 占位符，逻辑在过滤中处理
      });
    }

    architectures.forEach(arch => {
      result.push({
        id: arch,
        name: t(`download.devices.${arch}`),
        description: t(`download.devices.${arch}Desc`),
        patterns: [arch]
      });
    });
    return result;
  }, [release, t]);

  const cloudDrive = useMemo(() => {
    if (!versionJsonData || project === 'zl1') return null;
    return versionJsonData.default_cloud_drive || null;
  }, [versionJsonData, project]);

  return {
    release,
    isReleaseLoading,
    isNotesLoading,
    isMirrorsLoading,
    isSyncing,
    error,
    isChinaIP,
    apiFailed,
    mirrorData,
    dynamicDeviceTypes,
    localizedBody,
    cloudDrive,
    downloadSources: DOWNLOAD_SOURCES
  };
};
