import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Smartphone, Terminal, ShieldCheck, Zap, Globe, ChevronDown, Check, AlertTriangle, ExternalLink, Info } from 'lucide-react';
import { useLatestRelease, type Asset } from '../hooks/useLatestRelease';
import { marked } from 'marked';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const DownloadSection = () => {
  const { t } = useTranslation();
  const [activeProject, setActiveProject] = useState<'zl1' | 'zl2'>('zl2');
  const { 
    release, 
    isLoading, 
    error, 
    isChinaIP, 
    apiFailed, 
    mirrorData, 
    dynamicDeviceTypes, 
    downloadSources 
  } = useLatestRelease(activeProject);

  const [selectedDevice, setSelectedDevice] = useState('all');
  const [selectedSource, setSelectedSource] = useState('github');
  const [isDeviceOpen, setIsDeviceOpen] = useState(false);
  const [isSourceOpen, setIsSourceOpen] = useState(false);
  const [parsedBody, setParsedBody] = useState('');

  useEffect(() => {
    if (isChinaIP) {
      setSelectedSource('lemwood');
    }
  }, [isChinaIP]);

  useEffect(() => {
    const parseContent = async () => {
      if (release?.body) {
        try {
          const html = await marked.parse(release.body);
          setParsedBody(html);
        } catch (e) {
          console.error('Failed to parse markdown', e);
        }
      }
    };
    parseContent();
  }, [release]);

  const currentDevice = dynamicDeviceTypes.find(d => d.id === selectedDevice) || dynamicDeviceTypes[0];
  const currentSource = downloadSources.find(s => s.id === selectedSource) || downloadSources[0];

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
      
      const matched = mirrorData.foxington.find((f: any) => f.name === targetArch);
      return matched?.url || asset.browser_download_url;
    }

    if (selectedSource === 'haha' && mirrorData.haha?.files && Array.isArray(mirrorData.haha.files)) {
      const fileName = asset.name.toLowerCase();
      let targetArch = '';
      if (fileName.includes('arm64')) targetArch = 'arm64-v8a';
      else if (fileName.includes('armeabi')) targetArch = 'armeabi-v7a';
      
      const matched = mirrorData.haha.files.find((f: any) => f.arch === targetArch || (!targetArch && (!f.arch || f.arch === 'all')));
      return matched?.link || asset.browser_download_url;
    }

    if (selectedSource === 'lemwood' && Array.isArray(mirrorData.lemwood)) {
      const currentTagName = release?.tag_name || '';
      const normalizedTagName = currentTagName.replace(/^v/, '');
      
      let matchedRelease = mirrorData.lemwood.find((r: any) => r.tag_name === currentTagName || r.tag_name === normalizedTagName);
      if (matchedRelease?.assets && Array.isArray(matchedRelease.assets)) {
        const matchedAsset = matchedRelease.assets.find((a: any) => a.name === asset.name);
        if (matchedAsset) return matchedAsset.url;
      }
      
      // Fallback: search by name in all releases
      for (let i = mirrorData.lemwood.length - 1; i >= 0; i--) {
        if (Array.isArray(mirrorData.lemwood[i].assets)) {
          const asset_match = mirrorData.lemwood[i].assets.find((a: any) => a.name === asset.name);
          if (asset_match) return asset_match.url;
        }
      }
    }

    return asset.browser_download_url;
  };

  const filteredAssets = release?.assets.filter(asset => {
    if (selectedDevice === 'all') return true;
    const name = asset.name.toLowerCase();
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
    <section id="download" className="py-24 relative overflow-hidden bg-[var(--bg-alt)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-6 text-[var(--text-1)]"
          >
            {t('download.title')}
          </motion.h2>
          
          {/* Project Switcher */}
          <div className="inline-flex p-1 bg-[var(--bg)] rounded-xl border border-[var(--divider)]/20 mb-8">
            <button
              onClick={() => setActiveProject('zl2')}
              className={cn(
                "px-6 py-2 rounded-lg text-sm font-medium transition-all",
                activeProject === 'zl2' 
                  ? "bg-[var(--brand)] text-white shadow-md dark:text-[var(--bg)]" 
                  : "text-[var(--text-2)] hover:bg-[var(--bg-alt)]"
              )}
            >
              Zalith Launcher 2 ({t('download.recommend')})
            </button>
            <button
              onClick={() => setActiveProject('zl1')}
              className={cn(
                "px-6 py-2 rounded-lg text-sm font-medium transition-all",
                activeProject === 'zl1' 
                  ? "bg-[var(--brand)] text-white shadow-md dark:text-[var(--bg)]" 
                  : "text-[var(--text-2)] hover:bg-[var(--bg-alt)]"
              )}
            >
              Zalith Launcher 1 ({t('download.legacy')})
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[var(--brand)]/20 border-t-[var(--brand)] rounded-full animate-spin mb-4" />
            <p className="text-[var(--text-2)]">{t('common.loading')}</p>
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto glass-card border-red-500/20 text-center p-12 bg-[var(--bg)]">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2 text-[var(--text-1)]">{t('common.error')}</h3>
            <p className="text-[var(--text-2)] mb-6">{error}</p>
            <button onClick={() => window.location.reload()} className="btn-primary">{t('common.retry')}</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Release Info & Selector */}
            <div className="lg:col-span-2 space-y-6">
              {apiFailed && (
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-start gap-3 text-yellow-700 dark:text-yellow-500 text-sm">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="font-bold">{t('download.apiFailed')}</p>
                    <p>{t('download.apiFailedDesc')}</p>
                  </div>
                </div>
              )}

              <div className="glass-card p-8">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-[var(--brand)]">{release?.name}</h3>
                    <p className="text-[var(--text-2)] text-sm mt-1">
                      {t('download.publishedAt')} {release ? new Date(release.published_at).toLocaleDateString() : '-'}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-[var(--brand)]/10 text-[var(--brand)] rounded-full text-sm font-bold border border-[var(--brand)]/20">
                    {release?.tag_name}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Device Dropdown */}
                  <div className="relative">
                    <label className="block text-xs font-bold text-[var(--text-2)] mb-2 uppercase tracking-wider">{t('download.deviceType')}</label>
                    <button 
                      onClick={() => setIsDeviceOpen(!isDeviceOpen)}
                      className="w-full flex items-center justify-between px-4 py-3 bg-[var(--bg)] border border-[var(--divider)]/20 rounded-xl hover:border-[var(--brand)]/50 transition-all text-[var(--text-1)]"
                    >
                      <span className="flex items-center gap-3">
                        <Smartphone size={18} className="text-[var(--brand)]" />
                        <span className="text-sm font-medium">{currentDevice.name}</span>
                      </span>
                      <ChevronDown size={16} className={cn("transition-transform", isDeviceOpen && "rotate-180")} />
                    </button>
                    <AnimatePresence>
                      {isDeviceOpen && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setIsDeviceOpen(false)} />
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute top-full left-0 w-full mt-2 bg-[var(--bg)] border border-[var(--divider)]/20 rounded-xl shadow-2xl z-20 overflow-hidden"
                          >
                            {dynamicDeviceTypes.map(d => (
                              <button
                                key={d.id}
                                onClick={() => { setSelectedDevice(d.id); setIsDeviceOpen(false); }}
                                className="w-full flex items-center justify-between px-4 py-3 hover:bg-[var(--bg-alt)] text-left transition-colors text-[var(--text-1)]"
                              >
                                <div className="flex flex-col">
                                  <span className="text-sm font-bold">{d.name}</span>
                                  <span className="text-xs text-[var(--text-2)]">{d.description}</span>
                                </div>
                                {selectedDevice === d.id && <Check size={16} className="text-[var(--brand)]" />}
                              </button>
                            ))}
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Source Dropdown */}
                  <div className="relative">
                    <label className="block text-xs font-bold text-[var(--text-2)] mb-2 uppercase tracking-wider">{t('download.source')}</label>
                    <button 
                      onClick={() => setIsSourceOpen(!isSourceOpen)}
                      className="w-full flex items-center justify-between px-4 py-3 bg-[var(--bg)] border border-[var(--divider)]/20 rounded-xl hover:border-[var(--brand)]/50 transition-all text-[var(--text-1)]"
                    >
                      <span className="flex items-center gap-3">
                        <Globe size={18} className="text-[var(--brand)]" />
                        <span className="text-sm font-medium">{currentSource.name}</span>
                      </span>
                      <ChevronDown size={16} className={cn("transition-transform", isSourceOpen && "rotate-180")} />
                    </button>
                    <AnimatePresence>
                      {isSourceOpen && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setIsSourceOpen(false)} />
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute top-full left-0 w-full mt-2 bg-[var(--bg)] border border-[var(--divider)]/20 rounded-xl shadow-2xl z-20 overflow-hidden"
                          >
                            {downloadSources.map(s => (
                              <button
                                key={s.id}
                                onClick={() => { setSelectedSource(s.id); setIsSourceOpen(false); }}
                                className="w-full px-4 py-3 hover:bg-[var(--bg-alt)] text-left transition-colors flex items-center justify-between text-[var(--text-1)]"
                              >
                                <div className="flex flex-col">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold">{s.name}</span>
                                    <span className="px-1.5 py-0.5 bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] rounded uppercase">{s.speed}</span>
                                  </div>
                                  <span className="text-xs text-[var(--text-2)]">{s.description}</span>
                                </div>
                                {selectedSource === s.id && <Check size={16} className="text-[var(--brand)]" />}
                              </button>
                            ))}
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Assets List */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-[var(--text-2)] mb-4 flex items-center gap-2">
                    <Download size={16} /> {t('download.assetsTitle')}
                  </h4>
                  {filteredAssets.length > 0 ? filteredAssets.map(asset => (
                    <motion.div 
                      key={asset.id}
                      layout
                      className="flex flex-col sm:flex-row items-center justify-between p-4 bg-[var(--bg-alt)] border border-[var(--divider)]/20 rounded-2xl hover:border-[var(--brand)]/30 transition-all gap-4"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-10 h-10 bg-[var(--brand)]/10 text-[var(--brand)] rounded-xl flex items-center justify-center flex-shrink-0">
                          <Terminal size={20} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold truncate pr-4 text-[var(--text-1)]">{asset.name}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] text-[var(--text-2)] font-medium uppercase">{formatSize(asset.size)}</span>
                            <span className="w-1 h-1 bg-[var(--divider)]/50 rounded-full" />
                            <span className="text-[10px] text-[var(--text-2)] font-medium uppercase">{asset.download_count.toLocaleString()} 下载</span>
                          </div>
                        </div>
                      </div>
                      <a 
                        href={getDownloadUrl(asset)} 
                        target="_blank" 
                        rel="noreferrer"
                        className="btn-primary py-2 px-6 text-sm flex items-center gap-2 whitespace-nowrap w-full sm:w-auto justify-center"
                      >
                        {t('common.download')} <ExternalLink size={14} />
                      </a>
                    </motion.div>
                  )) : (
                    <div className="text-center py-12 bg-[var(--bg-alt)] rounded-2xl border border-dashed border-[var(--divider)]/50">
                      <Info className="w-8 h-8 text-[var(--text-2)] mx-auto mb-2 opacity-20" />
                      <p className="text-sm text-[var(--text-2)]">{t('download.noAssets')}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Release Notes */}
            <div className="lg:col-span-1">
              <div className="glass-card p-8 h-full bg-[var(--bg)]/40 backdrop-blur-md">
                <h4 className="text-lg font-bold mb-6 flex items-center gap-2 text-[var(--text-1)]">
                  <Info size={20} className="text-[var(--brand)]" /> {t('download.releaseNotes')}
                </h4>
                <div 
                  className="prose-custom text-sm overflow-y-auto max-h-[600px]"
                  dangerouslySetInnerHTML={{ __html: parsedBody }}
                />
                {!parsedBody && (
                  <p className="text-sm text-[var(--text-2)] italic">{t('download.noNotes')}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="mt-16 text-center">
          <div className="flex flex-wrap justify-center gap-8">
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
