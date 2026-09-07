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

export interface MirrorAsset {
  name: string;
  url: string;
  file_name?: string;
  version?: string;
  architecture?: string;
  available?: boolean;
  download_path?: string;
}

export interface MirrorRelease {
  tag_name: string;
  assets: MirrorAsset[];
}

export interface VersionJsonAsset {
  name: string;
  browser_download_url?: string;
  size?: number;
  download_count?: number;
  [key: string]: unknown;
}

// ZL2 更新日志（repo.miawa.cn/zalith-info/v2/latest_version_md.json）的文件清单条目
export interface ChangelogFile {
  file_name: string;
  uri: string;
  arch?: string;
  size?: number;
}

export interface VersionJsonData {
  latest_version?: string;
  release_date?: string;
  body?: string;
  assets?: VersionJsonAsset[];
  description?: {
    zh_cn?: string;
    zh_tw?: string;
    en_us?: string;
  };
  bodies?: Array<{
    language: string;
    markdown: string;
  }>;
  default_body?: {
    language: string;
    markdown: string;
  };
  default_cloud_drive?: {
    link: string;
    links?: Array<{ name: string; link: string }>;
  };
  // ZL1 更新日志格式（repo.miawa.cn/zalith-info/launcher_version.json）：
  // 仅版本号、发布时间、多语言说明与各架构精确体积，不含文件清单
  version_code?: number;
  version_name?: string;
  published_at?: string;
  file_size?: Record<string, number>;
  // ZL2 更新日志格式：完整文件清单（uri 指向 GitHub releases 下载地址）
  version?: string;
  created_at?: string;
  files?: ChangelogFile[];
}

export interface MirrorData {
  haha: MirrorAsset[] | null;
  lemwood: MirrorRelease[] | null;
}

const DOWNLOAD_SOURCES: DownloadSource[] = [
  { id: 'github', name: 'GitHub 官方', description: '官方发布渠道', speed: '海外较快' },
  { id: 'haha', name: '枫源镜像', description: 'FrostLynx 提供', speed: '国内较快', contributor: { name: 'FrostLynx', url: 'https://fyhub.cn' } },
  { id: 'lemwood', name: '柠泽资源站', description: 'Lemwood 提供', speed: '国内较快', contributor: { name: 'Lemwood', url: 'https://lemwood.cn' } },
  { id: 'cxsj', name: '创想镜像', description: '239LAN 提供', speed: '国内较快', contributor: { name: '创想镜像', url: 'https://mirror.cxsjmc.cn' } },
];

function filterMappingAssets(release: Release): Release {
  if (!release?.assets) return release;
  return {
    ...release,
    assets: release.assets.filter(a => !/^mapping.*\.zip$/i.test(a.name))
  };
}

// 把 "145 MB" 之类的历史字符串体积归一为字节数（纯展示用途，按 1024 进制换算）
function parseSizeToBytes(size: number | string | undefined): number {
  if (typeof size === 'number') return size;
  if (typeof size !== 'string') return 0;
  const match = size.trim().match(/^([\d.]+)\s*(B|KB|MB|GB|TB)$/i);
  if (!match) return 0;
  const units: Record<string, number> = { b: 1, kb: 1024, mb: 1024 ** 2, gb: 1024 ** 3, tb: 1024 ** 4 };
  const value = parseFloat(match[1]);
  const unit = units[match[2].toLowerCase()] || 1;
  return Number.isFinite(value) ? Math.round(value * unit) : 0;
}

// ZL1 更新日志不带文件清单，按文件名中的架构从 file_size 取精确体积（与 GitHub 一致）
function zl1AssetSizeFromChangelog(fileName: string, fileSize?: Record<string, number>): number {
  if (!fileSize) return 0;
  const name = fileName.toLowerCase();
  if (name.includes('arm64')) return fileSize.arm64 || 0;
  if (name.includes('armeabi')) return fileSize.arm || 0;
  if (name.includes('x86_64') || name.includes('x86-64')) return fileSize.x86_64 || 0;
  if (name.includes('x86')) return fileSize.x86 || 0;
  return fileSize.all || 0;
}

// 从更新日志 JSON（repo.miawa.cn，与 GitHub releases 同步维护）构造 Release。
// ZL2：files 自带完整资产清单与下载地址；ZL1：日志只含版本与体积，
// 资产清单取站内打包的 version.json（ZL1 已停止发版，两边版本长期一致）。
async function buildReleaseFromChangelog(
  data: VersionJsonData,
  project: 'zl1' | 'zl2',
  localVersionFile: string,
  cachedCounts: Map<string, number>
): Promise<Release | null> {
  if (project === 'zl2') {
    const version = data.version;
    const files = Array.isArray(data.files) ? data.files : [];
    if (!version || files.length === 0) return null;
    return {
      name: version,
      tag_name: version,
      published_at: data.created_at || '',
      body: data.default_body?.markdown || '',
      assets: files.map(f => ({
        id: f.file_name,
        name: f.file_name,
        browser_download_url: f.uri,
        size: f.size ?? 0,
        download_count: cachedCounts.get(f.file_name) || 0
      }))
    };
  }

  const version = data.version_name;
  if (!version || data.version_code === undefined) return null;
  try {
    const localRes = await fetch(localVersionFile);
    const localData: VersionJsonData = await localRes.json();
    if (!Array.isArray(localData.assets) || localData.assets.length === 0) return null;
    return {
      name: version,
      tag_name: String(data.version_code),
      published_at: data.published_at || localData.release_date || '',
      body: data.description?.zh_cn || localData.body || '',
      assets: localData.assets.map(a => ({
        id: a.name,
        name: a.name,
        browser_download_url: a.browser_download_url || '',
        size: zl1AssetSizeFromChangelog(a.name, data.file_size) || parseSizeToBytes(a.size),
        download_count: a.download_count || cachedCounts.get(a.name) || 0
      }))
    };
  } catch {
    return null;
  }
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
  const [versionJsonData, setVersionJsonData] = useState<VersionJsonData | null>(null);

  const [mirrorData, setMirrorData] = useState<MirrorData>({ haha: null, lemwood: null });

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
      // 供更新日志构造 Release 时沿用最近一次拿到的资产下载数（日志本身不含该数据）
      const cachedCounts = new Map<string, number>();

      if (cachedRelease) {
        try {
          const parsedCache = filterMappingAssets(JSON.parse(cachedRelease));
          (parsedCache.assets || []).forEach(a => cachedCounts.set(a.name, a.download_count || 0));
          setRelease(parsedCache);
          setIsReleaseLoading(false);
          hasCache = true;
        } catch { /* ignore */ }
      }
      if (cachedNotes) {
        try {
          setVersionJsonData(JSON.parse(cachedNotes));
          setIsNotesLoading(false);
        } catch { /* ignore */ }
      }
      if (cachedMirrors) {
        try {
          setMirrorData(JSON.parse(cachedMirrors));
          setIsMirrorsLoading(false);
        } catch { /* ignore */ }
      }

      if (hasCache) {
        setIsSyncing(true);
      }

      // 更新日志（repo.miawa.cn）只拉取一次，版本数据与发布说明共用
      const changelogJsonPromise: Promise<VersionJsonData | null> = (async () => {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);
          const res = await fetch(versionInfoUrl, { signal: controller.signal });
          clearTimeout(timeoutId);
          if (!res.ok) return null;
          return (await res.json()) as VersionJsonData;
        } catch {
          return null;
        }
      })();

      const fetchNotesTask = async () => {
        const data = await changelogJsonPromise;
        if (data) {
          if (isMounted) {
            setVersionJsonData(data);
            localStorage.setItem(`${cacheKeyPrefix}notes`, JSON.stringify(data));
            setIsNotesLoading(false);
          }
        } else if (isMounted && !cachedNotes) {
          setIsNotesLoading(false);
        }
      };

      // 检查更新的数据源按归属地选择：国内优先更新日志（repo.miawa.cn 国内直连、
      // 与 GitHub releases 同步维护，字段齐全），海外优先 GitHub API；
      // 主源失败时依次回退，最后才用站内打包的 version.json（可能滞后于线上）。
      const fetchReleaseTask = async () => {
        const applyRelease = (rel: Release) => {
          const filtered = filterMappingAssets(rel);
          if (isMounted) {
            setRelease(filtered);
            localStorage.setItem(`${cacheKeyPrefix}release`, JSON.stringify(filtered));
            setIsReleaseLoading(false);
          }
        };

        // 先等 IP 归属地结果（最多 1.5s；未知按国内处理，更新日志失败仍会回退 GitHub）
        let isCN: boolean | null = null;
        try {
          isCN = await Promise.race([
            detectIPTask(),
            new Promise<null>((resolve) => setTimeout(() => resolve(null), 1500))
          ]);
        } catch { /* 探测异常按未知处理 */ }

        if (isCN !== false) {
          const changelogData = await changelogJsonPromise;
          if (changelogData) {
            const rel = await buildReleaseFromChangelog(changelogData, project, localVersionFile, cachedCounts);
            if (rel) {
              applyRelease(rel);
              return;
            }
          }
        }

        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3000);

          const res = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, {
            signal: controller.signal
          });
          clearTimeout(timeoutId);

          if (!res.ok) throw new Error('GitHub API failed');
          const data = await res.json();
          applyRelease(data);
          return;
        } catch { /* GitHub 不可用，走本地兜底 */ }

        // 走到这里说明远端主源与回退源都失败，本地数据可能滞后，给出提示
        if (isMounted) setApiFailed(true);
        try {
          const localRes = await fetch(localVersionFile);
          const localData = await localRes.json();
          const fallbackRelease: Release = {
            name: localData.latest_version,
            tag_name: localData.latest_version,
            published_at: localData.release_date,
            body: localData.body || '',
            assets: localData.assets.map((a: VersionJsonAsset) => ({
              id: a.name,
              name: a.name,
              browser_download_url: a.browser_download_url || '',
              size: parseSizeToBytes(a.size),
              download_count: a.download_count || 0
            }))
          };
          applyRelease(fallbackRelease);
        } catch {
          if (isMounted && !hasCache) {
            setError('无法获取版本信息');
            setIsReleaseLoading(false);
          }
        }
      };

      const fetchMirrorsTask = async () => {
        // 枫源镜像新站 fyhub.cn：项目 ID 使用仓库名，且仅收录 ZalithLauncher2（ZL1 已下架）
        const hahaUrl = project === 'zl2' ? 'https://fyhub.cn/api/public/v1/projects/ZalithLauncher2/assets' : null;
        const lemwoodUrl = `${LEMWOOD_API_BASE}/launchers/${project === 'zl1' ? 'zl' : 'zl2'}`;

        const fetchJson = async (url: string) => {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            const res = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);

            const parseBody = async (response: Response) => {
              const data = await response.json();
              // 柠泽资源站（柠枺）v2 接口使用统一信封：{ data, error, meta }
              if (data && typeof data === 'object' && 'data' in data && data.error === null) {
                return data.data;
              }
              // 枫源镜像接口：{ status: "success", data: { assets: [...] } }
              if (data && typeof data === 'object' && data.status === 'success' && data.data && Array.isArray(data.data.assets)) {
                return data.data.assets;
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
            if (parsed && typeof parsed === 'object' && parsed.status === 'success' && parsed.data && Array.isArray(parsed.data.assets)) {
              return parsed.data.assets;
            }
            return parsed;
          } catch (e) {
            console.error('Fetch mirror data failed', e);
            return null;
          }
        };

        const [ha, lem] = await Promise.all([
          hahaUrl ? fetchJson(hahaUrl) : Promise.resolve(null),
          fetchJson(lemwoodUrl)
        ]);

        if (isMounted) {
          const newMirrorData = { haha: ha, lemwood: lem };
          setMirrorData(newMirrorData);
          localStorage.setItem(`${cacheKeyPrefix}mirrors`, JSON.stringify(newMirrorData));
          setIsMirrorsLoading(false);
        }
      };

      // 探测用户是否来自国内：localStorage 缓存 → ipapi.co → 失败时回退时区推断。
      // 返回 null 表示无法判断（fetchReleaseTask 会按国内策略处理）。
      const detectIPTask = async (): Promise<boolean | null> => {
        try {
          const cached = localStorage.getItem('isChineseIP');
          const expire = localStorage.getItem('isChineseIPExpire');
          if (cached && expire && Date.now() < parseInt(expire)) {
            const isCN = cached === 'true';
            if (isMounted) setIsChinaIP(isCN);
            return isCN;
          }

          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3000);
          const res = await fetch('https://ipapi.co/json/', { signal: controller.signal });
          clearTimeout(timeoutId);
          if (res.ok) {
            const data = await res.json();
            const isCN = data.country === 'CN' || data.region === 'China';
            localStorage.setItem('isChineseIP', isCN.toString());
            localStorage.setItem('isChineseIPExpire', (Date.now() + 86400000).toString());
            if (isMounted) setIsChinaIP(isCN);
            return isCN;
          }
          return null;
        } catch {
          const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
          const isCN = tz.includes('Asia/Shanghai') || tz.includes('Asia/Chongqing');
          if (isMounted) setIsChinaIP(isCN);
          return isCN;
        }
      };

      await Promise.allSettled([
        fetchReleaseTask(),
        fetchNotesTask(),
        fetchMirrorsTask()
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
        targetBody = bodies.find((b) => b.language === 'zh');
      } else if (lang.includes('en')) {
        targetBody = bodies.find((b) => b.language === 'en');
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

  // 枫源镜像（新站 fyhub.cn）已下架 ZL1，创想镜像仅支持 ZL2
  const downloadSources = useMemo(
    () => (project === 'zl1' ? DOWNLOAD_SOURCES.filter(s => s.id !== 'haha' && s.id !== 'cxsj') : DOWNLOAD_SOURCES),
    [project]
  );

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
    downloadSources
  };
};
