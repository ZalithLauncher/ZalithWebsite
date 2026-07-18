import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Smartphone, Terminal, ShieldCheck, Zap, Globe, ChevronDown, Check, AlertTriangle, ExternalLink, Info, Cloud } from 'lucide-react';
import { useLatestRelease, type Asset, type MirrorAsset, type MirrorRelease, LEMWOOD_API_BASE } from '../hooks/useLatestRelease';
import { marked } from 'marked';
import { cn } from '../lib/utils';
import { useTranslation } from 'react-i18next';

const ReleaseSkeleton = () => (
  <div className="glass-card p-4 sm:p-8 animate-pulse relative overflow-hidden" role="status" aria-busy="true">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--bg-alt)] to-transparent opacity-20 skeleton-shimmer" />
    <div className="flex flex-wrap items-center justify-between gap-4 mb-8 relative z-10">
      <div>
        <div className="h-8 bg-[var(--bg-alt)] rounded w-48 mb-2" />
        <div className="h-4 bg-[var(--bg-alt)] rounded w-32" />
      </div>
      <div className="h-8 bg-[var(--bg-alt)] rounded w-20" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 relative z-10">
      <div className="h-12 bg-[var(--bg-alt)] rounded-xl" />
      <div className="h-12 bg-[var(--bg-alt)] rounded-xl" />
    </div>
    <div className="space-y-3 relative z-10">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-20 bg-[var(--bg-alt)] rounded-2xl flex items-center px-4 gap-4">
           <div className="w-10 h-10 bg-[var(--bg)] rounded-xl" />
           <div className="flex-1">
             <div className="h-4 bg-[var(--bg)] rounded w-1/3 mb-2" />
             <div className="h-3 bg-[var(--bg)] rounded w-1/4" />
           </div>
        </div>
      ))}
    </div>
    <div className="mt-6 flex items-center justify-center gap-2 text-[var(--text-2)] text-sm font-medium">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      >
        <Zap size={16} className="text-[var(--brand)]" />
      </motion.div>
      正在获取最新版本信息...
    </div>
  </div>
);

const NotesSkeleton = () => (
  <div className="glass-card p-4 sm:p-8 h-full animate-pulse bg-[var(--bg)]/40 backdrop-blur-md relative overflow-hidden flex flex-col" role="status" aria-busy="true">
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--bg-alt)] to-transparent opacity-20 skeleton-shimmer" />
    <div className="h-6 bg-[var(--bg-alt)] rounded w-1/2 mb-6 relative z-10" />
    <div className="space-y-4 relative z-10 flex-1">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-[var(--bg-alt)] rounded" style={{ width: `${80 - i * 10}%` }} />
          <div className="h-4 bg-[var(--bg-alt)] rounded w-full" />
        </div>
      ))}
    </div>
    <div className="mt-8 pt-4 border-t border-[var(--divider)]/20 flex items-center justify-center gap-2 text-[var(--text-2)] text-sm font-medium relative z-10">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      >
        <Zap size={16} className="text-[var(--brand)]" />
      </motion.div>
      正在拉取更新日志...
    </div>
  </div>
);

const DownloadSection = () => {
  const { t, i18n } = useTranslation();
  const [activeProject, setActiveProject] = useState<'zl1' | 'zl2'>('zl2');
  const {
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
  } = useLatestRelease(activeProject, i18n.language);

  const [userSelectedDevice, setUserSelectedDevice] = useState<string | null>(null);
  const [userSelectedSource, setUserSelectedSource] = useState<string | null>(null);
  const [isDeviceOpen, setIsDeviceOpen] = useState(false);
  const [isSourceOpen, setIsSourceOpen] = useState(false);
  const [parsedBody, setParsedBody] = useState('');
  const [downloadingAssets, setDownloadingAssets] = useState<Set<string | number>>(new Set());

  const detectedDevice = useMemo(() => {
    if (isReleaseLoading || dynamicDeviceTypes.length <= 1) return 'all';

    const ua = navigator.userAgent.toLowerCase();
    if (!ua.includes('android')) return 'all';

    if ((ua.includes('aarch64') || ua.includes('arm64')) && dynamicDeviceTypes.some(d => d.id === 'arm64')) {
      return 'arm64';
    }
    if ((ua.includes('armv7') || ua.includes('armeabi')) && dynamicDeviceTypes.some(d => d.id === 'armeabi')) {
      return 'armeabi';
    }
    if (dynamicDeviceTypes.some(d => d.id === 'android')) {
      return 'android';
    }
    return 'all';
  }, [isReleaseLoading, dynamicDeviceTypes]);

  const selectedDevice = userSelectedDevice ?? detectedDevice;
  const selectedSource = userSelectedSource ?? (isChinaIP ? 'lemwood' : 'github');

  useEffect(() => {
    const parseContent = async () => {
      const displayBody = localizedBody || release?.body || '';
      if (displayBody) {
        try {
          const html = await marked.parse(displayBody);
          setParsedBody(html);
        } catch (e) {
          console.error('Failed to parse markdown', e);
        }
      } else {
        setParsedBody('');
      }
    };
    parseContent();
  }, [release, localizedBody]);

  const currentDevice = dynamicDeviceTypes.find(d => d.id === selectedDevice) || dynamicDeviceTypes[0];
  const currentSource = downloadSources.find(s => s.id === selectedSource) || downloadSources[0];

  const lemwoodSiteBase = LEMWOOD_API_BASE.replace('/api/v2', '');

  const getDownloadUrl = (asset: Asset) => {
    const tagName = release?.tag_name || '';
    
    if (selectedSource === 'mirror') {
      const version = activeProject === 'zl1' ? tagName.replace('v', '').replace(/\./g, '') : tagName.replace('v', '');
      return `https://download.fishcpy.top/dl/${activeProject === 'zl1' ? 'zl' : 'zl2'}/${version}/${asset.name}`;
    }

    if (selectedSource === 'foxington' && Array.isArray(mirrorData.foxington)) {
      const fileName = asset.name.toLowerCase();
      let targetArch = 'all 架构';
      if (fileName.includes('arm64')) targetArch = 'arm64-v8a 架构';
      else if (fileName.includes('armeabi')) targetArch = 'armeabi-v7a 架构';
      
      const matched = mirrorData.foxington.find((f: MirrorAsset) => f.name === targetArch);
      return matched?.url || asset.browser_download_url;
    }

    if (selectedSource === 'haha' && Array.isArray(mirrorData.haha)) {
      const projectId = activeProject === 'zl1' ? 'zl' : 'zl2';

      // 优先按文件名精确匹配
      const matchedByName = mirrorData.haha.find((f: MirrorAsset) => f.file_name === asset.name && f.available !== false);
      if (matchedByName) {
        return `https://fengyuan.frostlynx.work/${projectId}/${matchedByName.version}/${matchedByName.file_name}`;
      }

      // 按架构回退匹配
      const fileName = asset.name.toLowerCase();
      let targetArch = '';
      if (fileName.includes('arm64')) targetArch = 'arm64-v8a';
      else if (fileName.includes('armeabi')) targetArch = 'armeabi-v7a';
      else if (fileName.includes('x86_64')) targetArch = 'x86_64';
      else if (fileName.includes('x86')) targetArch = 'x86';

      const matchedByArch = mirrorData.haha.find((f: MirrorAsset) => {
        if (f.available === false) return false;
        if (targetArch) return f.architecture === targetArch;
        return !f.architecture || f.architecture === 'all' || f.architecture === '';
      });
      if (matchedByArch) {
        return `https://fengyuan.frostlynx.work/${projectId}/${matchedByArch.version}/${matchedByArch.file_name}`;
      }
    }

    if (selectedSource === 'lemwood' && Array.isArray(mirrorData.lemwood)) {
      const currentTagName = release?.tag_name || '';
      const normalizedTagName = currentTagName.replace(/^v/, '');
      
      const matchedRelease = mirrorData.lemwood.find((r: MirrorRelease) => r.tag_name === currentTagName || r.tag_name === normalizedTagName);
      if (matchedRelease?.assets && Array.isArray(matchedRelease.assets)) {
        const matchedAsset = matchedRelease.assets.find((a: MirrorAsset) => a.name === asset.name);
        if (matchedAsset) return matchedAsset.url;
      }
      
      // Fallback: search by name in all releases
      for (let i = mirrorData.lemwood.length - 1; i >= 0; i--) {
        if (Array.isArray(mirrorData.lemwood[i].assets)) {
          const asset_match = mirrorData.lemwood[i].assets.find((a: MirrorAsset) => a.name === asset.name);
          if (asset_match) return asset_match.url;
        }
      }
    }

    return asset.browser_download_url;
  };

  const handleDownload = async (asset: Asset) => {
    if (selectedSource !== 'lemwood') {
      window.open(getDownloadUrl(asset), '_blank', 'noopener,noreferrer');
      return;
    }

    setDownloadingAssets(prev => new Set(prev).add(asset.id));
    try {
      const launcher = activeProject === 'zl1' ? 'zl' : 'zl2';
      const version = release?.tag_name?.replace(/^v/, '') || '';
      const filePath = `${launcher}/${version}/${asset.name}`;

      const res = await fetch(`${LEMWOOD_API_BASE}/downloads/prepare`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file_path: filePath,
          return_url: window.location.href,
          source: 'zl-website-download'
        })
      });

      if (!res.ok) {
        throw new Error(`Prepare failed: ${res.status}`);
      }

      const result = await res.json();
      const payload = result.data ?? result;
      const downloadUrl = payload.download_url;

      if (downloadUrl) {
        const fullUrl = downloadUrl.startsWith('http') ? downloadUrl : `${lemwoodSiteBase}${downloadUrl}`;
        window.open(fullUrl, '_blank', 'noopener,noreferrer');
      } else {
        throw new Error('No download_url in response');
      }
    } catch (e) {
      console.error('Lemwood prepare download failed, falling back to direct URL', e);
      window.open(getDownloadUrl(asset), '_blank', 'noopener,noreferrer');
    } finally {
      setDownloadingAssets(prev => {
        const next = new Set(prev);
        next.delete(asset.id);
        return next;
      });
    }
  };

  const filteredAssets = release?.assets.filter(asset => {
    if (selectedDevice === 'all') return true;
    const name = asset.name.toLowerCase();
    
    // 特殊处理通用版本 (android id)
    if (selectedDevice === 'android') {
      return name.endsWith('.apk') && 
             !name.includes('arm64') && !name.includes('armv8') && 
             !name.includes('armeabi') && !name.includes('armv7') && 
             !name.includes('x86');
    }

    return currentDevice.patterns.some(p => p === '*' || name.includes(p.toLowerCase()));
  }) || [];

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <section id="download" className="pt-10 pb-16 sm:pt-16 sm:pb-24 relative overflow-hidden bg-[var(--bg-alt)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-6 text-[var(--text-1)]"
          >
            {t('download.title')}
          </motion.h2>
          
          {/* Project Switcher */}
          <div className="inline-flex flex-wrap justify-center p-1 bg-[var(--bg)] rounded-xl border border-[var(--divider)]/20 mb-6 sm:mb-8 max-w-full">
            <button
              type="button"
              onClick={() => setActiveProject('zl2')}
              aria-pressed={activeProject === 'zl2'}
              className={cn(
                "px-4 sm:px-6 py-2 rounded-lg text-sm font-medium transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]/60",
                activeProject === 'zl2' 
                  ? "bg-[var(--brand)] text-white shadow-md dark:text-[var(--bg)]" 
                  : "text-[var(--text-2)] hover:bg-[var(--bg-alt)]"
              )}
            >
              Zalith Launcher 2 ({t('download.recommend')})
            </button>
            <button
              type="button"
              onClick={() => setActiveProject('zl1')}
              aria-pressed={activeProject === 'zl1'}
              className={cn(
                "px-4 sm:px-6 py-2 rounded-lg text-sm font-medium transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]/60",
                activeProject === 'zl1' 
                  ? "bg-[var(--brand)] text-white shadow-md dark:text-[var(--bg)]" 
                  : "text-[var(--text-2)] hover:bg-[var(--bg-alt)]"
              )}
            >
              Zalith Launcher 1 ({t('download.legacy')})
            </button>
          </div>
        </div>

        {isReleaseLoading && isNotesLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6 relative z-10">
              <ReleaseSkeleton />
            </div>
            <div className="lg:col-span-1 relative z-0">
              <NotesSkeleton />
            </div>
          </div>
        ) : error && !release ? (
          <div className="max-w-md mx-auto glass-card border-red-500/20 text-center p-6 sm:p-12 bg-[var(--bg)]" role="alert">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2 text-[var(--text-1)]">{t('common.error')}</h3>
            <p className="text-[var(--text-2)] mb-6 break-words">{error}</p>
            <button type="button" onClick={() => window.location.reload()} className="btn-primary">{t('common.retry')}</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Release Info & Selector */}
            <div className="lg:col-span-2 space-y-6 relative z-10">
              {isReleaseLoading ? (
                <ReleaseSkeleton />
              ) : (
                <>
                  {apiFailed && (
                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-start gap-3 text-yellow-700 dark:text-yellow-500 text-sm">
                      <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                      <div>
                        <p className="font-bold">{t('download.apiFailed')}</p>
                        <p>{t('download.apiFailedDesc')}</p>
                      </div>
                    </div>
                  )}

                  <div className="glass-card p-4 sm:p-8">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-2xl font-bold text-[var(--brand)]">{release?.name}</h3>
                          {isSyncing && (
                            <span className="flex items-center gap-1 px-2 py-0.5 bg-[var(--brand)]/10 text-[var(--brand)] rounded text-xs">
                              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                                <Zap size={12} />
                              </motion.div>
                              更新中...
                            </span>
                          )}
                        </div>
                        <p className="text-[var(--text-2)] text-sm mt-1">
                          {t('download.publishedAt')} {release ? new Date(release.published_at).toLocaleDateString() : '-'}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-[var(--brand)]/10 text-[var(--brand)] rounded-full text-sm font-bold border border-[var(--brand)]/20">
                        {release?.tag_name}
                      </span>
                    </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 sm:mb-8">
                  {/* Device Dropdown */}
                  <div className="relative">
                    <label htmlFor="device-type-btn" className="block text-xs font-bold text-[var(--text-2)] mb-2 uppercase tracking-wider">{t('download.deviceType')}</label>
                    <button 
                      type="button"
                      id="device-type-btn"
                      onClick={() => setIsDeviceOpen(!isDeviceOpen)}
                      aria-expanded={isDeviceOpen}
                      aria-haspopup="listbox"
                      className="w-full flex items-center justify-between px-4 py-3 bg-[var(--bg)] border border-[var(--divider)]/20 rounded-xl hover:border-[var(--brand)]/50 transition-all text-[var(--text-1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]/60"
                    >
                      <span className="flex items-center gap-3 min-w-0">
                        <Smartphone size={18} className="text-[var(--brand)] flex-shrink-0" />
                        <span className="text-sm font-medium truncate">{currentDevice.name}</span>
                      </span>
                      <ChevronDown size={16} className={cn("transition-transform flex-shrink-0", isDeviceOpen && "rotate-180")} />
                    </button>
                    <AnimatePresence>
                      {isDeviceOpen && (
                        <>
                          <div className="fixed inset-0 z-10" aria-hidden="true" onClick={() => setIsDeviceOpen(false)} />
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            role="listbox"
                            aria-label={t('download.deviceType')}
                            className="absolute top-full left-0 w-full mt-2 bg-[var(--bg)] border border-[var(--divider)]/20 rounded-xl shadow-2xl z-20 overflow-hidden"
                          >
                            {dynamicDeviceTypes.map(d => (
                              <button
                                type="button"
                                role="option"
                                aria-selected={selectedDevice === d.id}
                                key={d.id}
                                onClick={() => { setUserSelectedDevice(d.id); setIsDeviceOpen(false); }}
                                className="w-full flex items-center justify-between px-4 py-3 hover:bg-[var(--bg-alt)] active:bg-[var(--bg-alt)] text-left transition-colors text-[var(--text-1)]"
                              >
                                <div className="flex flex-col min-w-0">
                                  <span className="text-sm font-bold">{d.name}</span>
                                  <span className="text-xs text-[var(--text-2)]">{d.description}</span>
                                </div>
                                {selectedDevice === d.id && <Check size={16} className="text-[var(--brand)] flex-shrink-0" />}
                              </button>
                            ))}
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Source Dropdown */}
                  <div className="relative">
                    <label htmlFor="source-btn" className="block text-xs font-bold text-[var(--text-2)] mb-2 uppercase tracking-wider flex items-center justify-between">
                      {t('download.source')}
                      {isMirrorsLoading && (
                        <span className="flex items-center gap-1 text-[var(--brand)] text-[10px] normal-case">
                          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                            <Zap size={10} />
                          </motion.div>
                          测速中...
                        </span>
                      )}
                    </label>
                    <button 
                      type="button"
                      id="source-btn"
                      onClick={() => setIsSourceOpen(!isSourceOpen)}
                      disabled={isMirrorsLoading}
                      aria-expanded={isSourceOpen}
                      aria-haspopup="listbox"
                      className={cn(
                        "w-full flex items-center justify-between px-4 py-3 bg-[var(--bg)] border border-[var(--divider)]/20 rounded-xl transition-all text-[var(--text-1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]/60",
                        isMirrorsLoading ? "opacity-70 cursor-not-allowed" : "hover:border-[var(--brand)]/50"
                      )}
                    >
                      <span className="flex items-center gap-3 min-w-0">
                        <Globe size={18} className="text-[var(--brand)] flex-shrink-0" />
                        <span className="text-sm font-medium truncate">{currentSource.name}</span>
                      </span>
                      <ChevronDown size={16} className={cn("transition-transform flex-shrink-0", isSourceOpen && "rotate-180")} />
                    </button>
                    <AnimatePresence>
                      {isSourceOpen && (
                        <>
                          <div className="fixed inset-0 z-10" aria-hidden="true" onClick={() => setIsSourceOpen(false)} />
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            role="listbox"
                            aria-label={t('download.source')}
                            className="absolute top-full left-0 w-full mt-2 bg-[var(--bg)] border border-[var(--divider)]/20 rounded-xl shadow-2xl z-20 overflow-hidden"
                          >
                            {downloadSources.map(s => (
                              <button
                                type="button"
                                role="option"
                                aria-selected={selectedSource === s.id}
                                key={s.id}
                                onClick={() => { setUserSelectedSource(s.id); setIsSourceOpen(false); }}
                                className="w-full px-4 py-3 hover:bg-[var(--bg-alt)] active:bg-[var(--bg-alt)] text-left transition-colors flex items-center justify-between text-[var(--text-1)]"
                              >
                                <div className="flex flex-col min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold">{s.name}</span>
                                    <span className="px-1.5 py-0.5 bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] rounded uppercase whitespace-nowrap">{s.speed}</span>
                                  </div>
                                  <span className="text-xs text-[var(--text-2)]">{s.description}</span>
                                </div>
                                {selectedSource === s.id && <Check size={16} className="text-[var(--brand)] flex-shrink-0" />}
                              </button>
                            ))}
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Cloud Drive Links */}
                {cloudDrive && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-500/20 text-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Cloud size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[var(--text-1)]">{t('download.cloudDrive')}</p>
                          <p className="text-xs text-[var(--text-2)]">{t('download.cloudDriveDesc')}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                        {(cloudDrive.links?.length ? cloudDrive.links : [{ name: t('download.cloudDriveBtn'), link: cloudDrive.link }]).map((drive: { name: string; link: string }, i: number) => (
                          <a
                            key={i}
                            href={drive.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-blue-500 hover:bg-blue-600 active:scale-95 text-white rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70"
                          >
                            {drive.name} <ExternalLink size={14} />
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Assets List */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-[var(--text-2)] mb-4 flex items-center gap-2">
                    <Download size={16} /> {t('download.assetsTitle')}
                  </h4>
                  {filteredAssets.length > 0 ? filteredAssets.map(asset => (
                    <motion.div 
                      key={asset.id}
                      layout
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-[var(--bg-alt)] border border-[var(--divider)]/20 rounded-2xl hover:border-[var(--brand)]/30 hover:bg-[var(--bg)] hover:shadow-lg hover:shadow-[var(--brand)]/5 transition-all gap-4"
                    >
                      <div className="flex items-start gap-4 flex-1 w-full">
                        <div className="w-10 h-10 bg-[var(--brand)]/10 text-[var(--brand)] rounded-xl flex items-center justify-center flex-shrink-0 mt-1 sm:mt-0 overflow-hidden">
                          {activeProject === 'zl2' ? (
                            <img src="/zl_icon.webp" alt="ZL2" className="w-6 h-6 object-contain" />
                          ) : (
                            <Terminal size={20} />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-[var(--text-1)] break-all sm:break-normal line-clamp-2 sm:line-clamp-1">{asset.name}</p>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                            <span className="text-[10px] text-[var(--text-2)] font-medium uppercase whitespace-nowrap">{formatSize(asset.size)}</span>
                            <span className="w-1 h-1 bg-[var(--divider)]/50 rounded-full hidden sm:block" />
                            <span className="text-[10px] text-[var(--text-2)] font-medium uppercase whitespace-nowrap">{asset.download_count.toLocaleString()} {t('download.downloads')}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDownload(asset)}
                        disabled={downloadingAssets.has(asset.id)}
                        aria-label={`${t('common.download')} ${asset.name}`}
                        className="btn-primary py-2 px-6 text-sm flex items-center gap-2 whitespace-nowrap w-full sm:w-auto justify-center disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]/60"
                      >
                        {downloadingAssets.has(asset.id) ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            >
                              <Zap size={14} />
                            </motion.div>
                            {t('common.preparing') || '准备中'}
                          </>
                        ) : (
                          <>
                            {t('common.download')} <ExternalLink size={14} />
                          </>
                        )}
                      </button>
                    </motion.div>
                  )) : (
                    <div className="text-center py-12 bg-[var(--bg-alt)] rounded-2xl border border-dashed border-[var(--divider)]/50">
                      <Info className="w-8 h-8 text-[var(--text-2)] mx-auto mb-2 opacity-20" />
                      <p className="text-sm text-[var(--text-2)]">{t('download.noAssets')}</p>
                    </div>
                  )}
                </div>
              </div>
            </>
            )}
            </div>

            {/* Right: Release Notes */}
            <div className="lg:col-span-1 relative z-0">
              {isNotesLoading ? (
                <NotesSkeleton />
              ) : (
                <div className="glass-card p-4 sm:p-8 h-full bg-[var(--bg)]/40 backdrop-blur-md">
                  <h4 className="text-lg font-bold mb-6 flex items-center gap-2 text-[var(--text-1)]">
                    <Info size={20} className="text-[var(--brand)]" /> {t('download.releaseNotes')}
                  </h4>
                  <div 
                    className="prose-custom text-sm overflow-y-auto max-h-[600px] rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]/60"
                    role="region"
                    aria-label={t('download.releaseNotes')}
                    tabIndex={0}
                    dangerouslySetInnerHTML={{ __html: parsedBody }}
                  />
                  {!parsedBody && (
                    <p className="text-sm text-[var(--text-2)] italic">{t('download.noNotes')}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="mt-10 sm:mt-16 text-center">
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
            <div className="flex items-center gap-2 text-[var(--text-2)] text-sm">
              <ShieldCheck size={16} className="text-green-500" />
              <span>{t('download.officialRelease')}</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--text-2)] text-sm">
              <Zap size={16} className="text-yellow-500" />
              <span>{t('download.multiSource')}</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--text-2)] text-sm">
              <Globe size={16} className="text-blue-500" />
              <span>{t('download.communityPowered')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadSection;
