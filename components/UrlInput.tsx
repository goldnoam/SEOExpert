
import React, { useCallback, useState, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { translations } from '../translations';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { UploadIcon } from './icons/UploadIcon';
import { TrashIcon } from './icons/TrashIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { TwitterIcon } from './icons/TwitterIcon';
import { FacebookIcon } from './icons/FacebookIcon';
import { CopyIcon } from './icons/CopyIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { ClockIcon } from './icons/ClockIcon';
import { SubmissionItem } from '../types';
import { SUBMISSION_SITES } from '../constants';

const URL_REGEX = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

interface UrlInputProps {
  urls: string;
  onUrlsChange: (urls: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  language: string;
  submissionItems: SubmissionItem[];
  onReset: () => void;
  onClearSuccessful?: () => void;
  onRetryFailed?: () => void;
}

export const UrlInput: React.FC<UrlInputProps> = ({ 
  urls, 
  onUrlsChange, 
  onSubmit, 
  isSubmitting, 
  language,
  submissionItems,
  onReset,
  onClearSuccessful,
  onRetryFailed
}) => {
  const t = translations[language] || translations['en'];
  const [error, setError] = useState<string | null>(null);
  const [copyBtnSuccess, setCopyBtnSuccess] = useState(false);
  const [reportCopySuccess, setReportCopySuccess] = useState(false);

  const validUrlCount = useMemo(() => {
    return urls.split('\n')
      .map(u => u.trim())
      .filter(u => u && URL_REGEX.test(u)).length;
  }, [urls]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const fileContent = reader.result as string;
        onUrlsChange((prev) => (prev ? prev.trim() + '\n' : '') + fileContent);
      };
      reader.readAsText(file);
    });
  }, [onUrlsChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    noClick: true, 
    noKeyboard: true 
  });

  const validateAndSubmit = () => {
    const rawLines = urls.split('\n').map((u) => u.trim()).filter(Boolean);
    if (rawLines.length === 0) {
      setError(t.invalidUrlError);
      return;
    }

    const invalid = rawLines.find(url => !URL_REGEX.test(url));
    if (invalid) {
      setError(`${t.invalidUrlError} Error near: "${invalid.substring(0, 20)}..." (URLs must start with http:// or https://)`);
      return;
    }

    setError(null);
    onSubmit();
  };

  const handleChange = (val: string) => {
    setError(null);
    onUrlsChange(val);
  };

  const handleAction = (fn: () => void) => (e: React.MouseEvent) => {
    e.stopPropagation();
    fn();
  };

  const copyToClipboard = async (textToCopy: string, setSuccess: (val: boolean) => void) => {
    if (!textToCopy.trim()) return;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) { console.error(err); }
  };

  const exportToFile = () => {
    if (!urls.trim()) return;
    const blob = new Blob([urls], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'urls.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getDomainInitial = (url: string) => {
    try {
      const host = new URL(url).hostname.replace('www.', '');
      return host.charAt(0).toUpperCase();
    } catch {
      return '?';
    }
  };

  if (submissionItems.length > 0) {
    const successCount = submissionItems.filter(i => i.status === 'success').length;
    const failureCount = submissionItems.filter(i => i.status === 'failed').length;
    const totalCount = submissionItems.length;

    return (
      <div className="mb-8 bg-white dark:bg-gray-800 border-2 border-teal-500/20 dark:border-teal-400/10 rounded-2xl p-6 shadow-xl space-y-4 animate-fade-in backdrop-blur-sm">
        <div className="flex justify-between items-start border-b pb-4 dark:border-gray-700/50">
          <div>
            <h2 className="text-xl font-black text-gray-800 dark:text-gray-100 flex items-center gap-2">
              {isSubmitting ? (
                 <>
                   <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                   {t.submittingButton}
                 </>
              ) : t.statusSuccess}
            </h2>
            <div className="flex flex-wrap gap-2 mt-2">
              <p className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest bg-teal-50 dark:bg-teal-900/30 px-2 py-0.5 rounded-full inline-block border border-teal-100 dark:border-teal-800">
                {t.serviceCount.replace('{count}', (submissionItems[0]?.totalServices || SUBMISSION_SITES.length).toString())}
              </p>
              <button 
                onClick={() => copyToClipboard(submissionItems.map(i => i.url).join('\n'), setReportCopySuccess)}
                className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full inline-flex items-center gap-1 hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:text-teal-600 transition-colors relative border border-gray-200 dark:border-gray-600"
              >
                <CopyIcon className="w-3 h-3" />
                {reportCopySuccess ? t.urlsCopied : t.copyUrls}
              </button>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-sm font-bold text-gray-600 dark:text-gray-300">
              {t.submissionSummary
                .replace('{processed}', (successCount + failureCount).toString())
                .replace('{total}', totalCount.toString())
                .replace('{success}', successCount.toString())
                .replace('{failed}', failureCount.toString())}
            </div>
          </div>
        </div>

        <div className="space-y-4 max-h-96 overflow-y-auto pr-3 custom-scrollbar">
          {submissionItems.map((item) => (
            <div key={item.id} className="bg-gray-50/50 dark:bg-gray-900/40 p-4 rounded-xl border border-gray-100 dark:border-gray-700 transition-all hover:border-teal-500/30 group/item">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3 rtl:space-x-reverse overflow-hidden">
                  <div className="shrink-0 relative">
                    <div className="w-7 h-7 rounded-md bg-white dark:bg-gray-700 flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-600 shadow-sm group-hover/item:scale-110 transition-transform">
                        {item.favicon ? (
                            <img 
                                src={item.favicon} 
                                alt="" 
                                className="w-full h-full object-cover" 
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    const next = e.currentTarget.nextElementSibling;
                                    if (next) next.classList.remove('hidden');
                                }} 
                            />
                        ) : null}
                        <span className={`text-[10px] font-black text-teal-600 dark:text-teal-400 ${item.favicon ? 'hidden' : ''}`}>
                            {getDomainInitial(item.url)}
                        </span>
                    </div>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold truncate text-gray-800 dark:text-gray-200" title={item.url}>{item.url}</span>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold text-teal-600 dark:text-teal-400 shrink-0">
                        {item.status === 'processing' ? (
                            `Sending to ${item.completedServices || 0} of ${item.totalServices || '?'} sites...`
                        ) : (
                            t[`status${item.status.charAt(0).toUpperCase() + item.status.slice(1)}`]
                        )}
                        </span>
                        {item.status === 'processing' && item.lastServicePinger && (
                            <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-tighter truncate opacity-0 group-hover/item:opacity-100 transition-opacity">
                                Last: {item.lastServicePinger}
                            </span>
                        )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {item.status === 'pending' && <ClockIcon className="w-4 h-4 text-gray-400" />}
                  {item.status === 'processing' && <div className="w-4 h-4 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>}
                  {item.status === 'success' && <CheckCircleIcon className="w-4 h-4 text-green-500" />}
                  {item.status === 'failed' && <XCircleIcon className="w-4 h-4 text-red-500" />}
                  <div className="text-xs font-black text-teal-600 dark:text-teal-400 tabular-nums">
                    {item.progress}%
                  </div>
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden shadow-inner relative">
                <div 
                  className={`h-full transition-all duration-700 ease-out shadow-sm relative overflow-hidden ${item.status === 'failed' ? 'bg-red-500' : 'bg-teal-500'}`}
                  style={{ width: `${item.progress}%` }}
                >
                    {item.status === 'processing' && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }}></div>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {!isSubmitting && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-4 border-t dark:border-gray-700/50">
             <button 
              onClick={onClearSuccessful} 
              disabled={successCount === 0}
              className="py-3 px-4 border-2 border-teal-500/50 text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-900/20 font-black uppercase text-xs tracking-widest rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {t.clearSuccessful}
            </button>
            {failureCount > 0 && (
              <button 
                onClick={onRetryFailed} 
                className="py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white font-black uppercase text-xs tracking-widest rounded-xl transition-all shadow-lg active:scale-95 animate-pulse-slow ring-offset-2 ring-orange-500/50 hover:ring-2"
              >
                {t.retryFailed}
              </button>
            )}
            <button 
              onClick={onReset} 
              className={`py-3 px-4 bg-teal-500 hover:bg-teal-600 text-white font-black uppercase text-xs tracking-widest rounded-xl transition-all shadow-lg active:scale-95 ${failureCount === 0 ? 'sm:col-span-1 lg:col-span-2' : ''}`}
            >
              {t.resetSubmission}
            </button>
          </div>
        )}
      </div>
    );
  }

  const dropzoneStyles = `relative group border-4 border-dashed rounded-3xl p-6 mb-6 transition-all duration-500 ease-out overflow-hidden
    ${isDragActive ? 'border-teal-500 bg-teal-50/90 dark:bg-teal-900/40 ring-8 ring-teal-500/10 scale-[1.03] shadow-2xl' : error ? 'border-red-500 bg-red-50/20' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl'}`;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
           <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm border ${validUrlCount > 0 ? 'bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-900/40 dark:text-teal-300 dark:border-teal-800' : 'bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-800 dark:text-gray-500 dark:border-gray-700'}`}>
              <span className={`w-2 h-2 rounded-full ${validUrlCount > 0 ? 'bg-teal-500 animate-pulse' : 'bg-gray-300'}`}></span>
              {t.urlCount.replace('{count}', validUrlCount.toString())}
           </div>
        </div>
      </div>

      <div {...getRootProps()} className={dropzoneStyles}>
        <input {...getInputProps()} />
        
        {isDragActive && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
            {/* Animated Scanner Bar */}
            <div className="absolute inset-0 bg-teal-500/5 animate-pulse"></div>
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent animate-scan"></div>
            
            <div className="p-6 bg-teal-500 text-white rounded-full shadow-[0_0_50px_rgba(20,184,166,0.5)] mb-4 animate-bounce-slow">
              <UploadIcon className="w-14 h-14" />
            </div>
            <p className="text-2xl font-black text-teal-600 dark:text-teal-300 uppercase tracking-[0.2em] drop-shadow-md">{t.dragActiveHint}</p>
            <p className="mt-2 text-[10px] font-bold text-teal-500/70 uppercase tracking-widest">Supports .txt files and paste</p>
          </div>
        )}

        <div className={isDragActive ? 'opacity-0 blur-xl scale-95 transition-all duration-300' : 'transition-all duration-300'}>
          <p className="text-center text-gray-400 dark:text-gray-500 text-xs mb-5 font-black uppercase tracking-[0.2em]">{t.dropzoneHint}</p>
          <div className="relative group/field">
            <textarea
              value={urls}
              onChange={(e) => handleChange(e.target.value)}
              placeholder={t.urlPlaceholder}
              className={`w-full h-56 p-6 pb-14 bg-gray-50/50 dark:bg-gray-900/50 border-2 rounded-2xl focus:ring-4 focus:ring-teal-500/20 outline-none resize-none transition-all dark:text-gray-100 font-mono text-sm leading-relaxed
              ${error ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-gray-100 dark:border-gray-800 focus:border-teal-500'}`}
              disabled={isSubmitting}
            />
            
            <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center">
              <div className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-tighter bg-gray-100/50 dark:bg-gray-800/50 px-2 py-1 rounded-lg backdrop-blur-sm">
                {urls.length} Chars
              </div>

              <div className="flex items-center space-x-1 rtl:space-x-reverse bg-white/90 dark:bg-gray-800/90 p-1 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 backdrop-blur-md">
                <button onClick={handleAction(() => onUrlsChange(''))} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all group/btn" title={t.clearUrls}>
                  <div className="flex items-center gap-1.5 px-1">
                    <TrashIcon className="w-4 h-4" />
                    <span className="text-[9px] font-black uppercase tracking-widest hidden group-hover/btn:inline-block">Clear</span>
                  </div>
                </button>
                <button onClick={handleAction(exportToFile)} className="p-2 text-gray-400 hover:text-teal-500 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-lg transition-all group/btn" title={t.exportUrls}>
                  <div className="flex items-center gap-1.5 px-1">
                    <DownloadIcon className="w-4 h-4" />
                    <span className="text-[9px] font-black uppercase tracking-widest hidden group-hover/btn:inline-block">Save</span>
                  </div>
                </button>
                <button onClick={handleAction(() => copyToClipboard(urls, setCopyBtnSuccess))} className="relative p-2 text-gray-400 hover:text-teal-500 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-lg transition-all group/btn" title={t.copyUrls}>
                  <div className="flex items-center gap-1.5 px-1">
                    <CopyIcon className="w-4 h-4" />
                    <span className="text-[9px] font-black uppercase tracking-widest">{copyBtnSuccess ? 'Copied!' : 'Copy All'}</span>
                  </div>
                </button>
                <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-1" />
                <button onClick={handleAction(() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(urls)}`, '_blank'))} className="p-2 text-gray-400 hover:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/20 rounded-lg transition-all"><TwitterIcon className="w-4 h-4" /></button>
                <button onClick={handleAction(() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(urls.match(/https?:\/\/[^\s]+/)?.[0] || window.location.href)}`, '_blank'))} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"><FacebookIcon className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
          {error && <p className="mt-3 text-[11px] font-black text-red-500 uppercase tracking-wider bg-red-50 dark:bg-red-900/20 p-2 rounded-lg border border-red-200 dark:border-red-900/40">{error}</p>}
        </div>
      </div>

      <button
        onClick={validateAndSubmit}
        disabled={isSubmitting || !urls.trim()}
        className="group relative w-full h-16 bg-teal-500 hover:bg-teal-600 disabled:bg-gray-200 dark:disabled:bg-gray-800 text-white font-black text-xl uppercase tracking-[0.3em] rounded-2xl transition-all shadow-[0_10px_30px_rgba(20,184,166,0.3)] active:translate-y-1 active:shadow-none overflow-hidden"
      >
        <div className="relative z-10 flex items-center justify-center gap-3">
          {isSubmitting ? (
            <><SpinnerIcon /> {t.submittingButton}</>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
              {t.submitButton}
            </>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </button>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          5% { opacity: 1; }
          95% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan {
          animation: scan 1.5s linear infinite;
        }
        .animate-bounce-slow {
          animation: bounce 2s infinite;
        }
      `}} />
    </div>
  );
};
