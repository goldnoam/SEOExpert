import React, { useCallback, useState, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { translations } from '../translations';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { UploadIcon } from './icons/UploadIcon';
import { TrashIcon } from './icons/TrashIcon';
import { ShareIcon } from './icons/ShareIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { TwitterIcon } from './icons/TwitterIcon';
import { FacebookIcon } from './icons/FacebookIcon';
import { CopyIcon } from './icons/CopyIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { ClockIcon } from './icons/ClockIcon';
import { SubmissionItem } from '../types';
import { SUBMISSION_SITES } from '../constants';

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

  // Memoized URL count to prevent unnecessary recalculations
  const validUrlCount = useMemo(() => {
    return urls.split('\n')
      .map(u => u.trim())
      .filter(u => {
        try {
          const parsed = new URL(u);
          return parsed.protocol === 'http:' || parsed.protocol === 'https:';
        } catch {
          return false;
        }
      }).length;
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
    const urlList = urls.split('\n').map((u) => u.trim()).filter(Boolean);
    if (urlList.length === 0) {
      onSubmit();
      return;
    }

    let hasError = false;
    for (const url of urlList) {
      try {
        const parsed = new URL(url);
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
          hasError = true;
          break;
        }
      } catch {
        hasError = true;
        break;
      }
    }

    if (hasError) {
      setError(t.invalidUrlError);
    } else {
      setError(null);
      onSubmit();
    }
  };

  const handleChange = (val: string) => {
    setError(null);
    onUrlsChange(val);
  };

  const handleAction = (fn: () => void) => (e: React.MouseEvent) => {
    e.stopPropagation();
    fn();
  };

  const copyToClipboard = async () => {
    if (!urls.trim()) return;
    try {
      await navigator.clipboard.writeText(urls);
      setCopyBtnSuccess(true);
      setTimeout(() => setCopyBtnSuccess(false), 2000);
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

  // RENDER: Progress View
  if (submissionItems.length > 0) {
    const successCount = submissionItems.filter(i => i.status === 'success').length;
    const failureCount = submissionItems.filter(i => i.status === 'failed').length;
    const totalCount = submissionItems.length;

    return (
      <div className="mb-8 bg-white dark:bg-gray-800 border rounded-lg p-6 shadow-sm space-y-4 animate-fade-in">
        <div className="flex justify-between items-center border-b pb-3 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              {isSubmitting ? t.submittingButton : t.statusSuccess}
            </h2>
            <p className="text-xs font-medium text-teal-600 dark:text-teal-400 mt-1 uppercase tracking-wider">
              {t.serviceCount.replace('{count}', SUBMISSION_SITES.length.toString())}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              {t.submissionSummary
                .replace('{processed}', (successCount + failureCount).toString())
                .replace('{total}', totalCount.toString())
                .replace('{success}', successCount.toString())
                .replace('{failed}', failureCount.toString())}
            </div>
          </div>
        </div>
        <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
          {submissionItems.map((item) => (
            <div key={item.id} className="bg-gray-50 dark:bg-gray-900/40 p-3 rounded-lg border dark:border-gray-700 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2 rtl:space-x-reverse overflow-hidden">
                  {item.status === 'pending' && <ClockIcon className="w-4 h-4 text-gray-400" />}
                  {item.status === 'processing' && <SpinnerIcon />}
                  {item.status === 'success' && <CheckCircleIcon className="w-4 h-4 text-green-500" />}
                  {item.status === 'failed' && <XCircleIcon className="w-4 h-4 text-red-500" />}
                  <span className="text-sm font-medium truncate" title={item.url}>{item.url}</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  {t[`status${item.status.charAt(0).toUpperCase() + item.status.slice(1)}`]}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${item.status === 'failed' ? 'bg-red-500' : 'bg-teal-500'}`}
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        {!isSubmitting && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
             <button 
              onClick={onClearSuccessful} 
              disabled={successCount === 0}
              className="py-3 px-4 border-2 border-teal-500 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t.clearSuccessful}
            </button>
            {failureCount > 0 && (
              <button 
                onClick={onRetryFailed} 
                className="py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-all shadow-md active:scale-[0.98]"
              >
                {t.retryFailed}
              </button>
            )}
            <button 
              onClick={onReset} 
              className={`py-3 px-4 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-lg transition-all shadow-md active:scale-[0.98] ${failureCount === 0 ? 'sm:col-span-1 lg:col-span-2' : ''}`}
            >
              {t.resetSubmission}
            </button>
          </div>
        )}
      </div>
    );
  }

  // RENDER: Input View
  const dropzoneStyles = `relative group border-2 border-dashed rounded-xl p-5 mb-4 transition-all duration-200
    ${isDragActive ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-900/10' : error ? 'border-red-500' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm'}`;

  return (
    <div className="mb-8">
      <div {...getRootProps()} className={dropzoneStyles}>
        <input {...getInputProps()} />
        
        {isDragActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-teal-500/10 backdrop-blur-[2px] z-20 rounded-xl">
            <UploadIcon className="w-12 h-12 text-teal-500 mb-2 animate-bounce" />
            <p className="text-lg font-bold text-teal-600 dark:text-teal-400">{t.dragActiveHint}</p>
          </div>
        )}

        <div className={isDragActive ? 'opacity-20 blur-sm pointer-events-none' : ''}>
          <p className="text-center text-gray-400 dark:text-gray-500 text-sm mb-4 font-medium uppercase tracking-widest">{t.dropzoneHint}</p>
          <div className="relative group/field">
            <textarea
              value={urls}
              onChange={(e) => handleChange(e.target.value)}
              placeholder={t.urlPlaceholder}
              className={`w-full h-40 p-4 pb-12 bg-gray-50/50 dark:bg-gray-900/50 border rounded-xl focus:ring-2 focus:ring-teal-500/50 outline-none resize-none transition-all dark:text-gray-200
              ${error ? 'border-red-500 ring-red-500/20' : 'border-gray-200 dark:border-gray-700'}`}
              disabled={isSubmitting}
            />
            
            {/* Inner Bottom Controls */}
            <div className="absolute bottom-2 left-3 right-3 flex justify-between items-center">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter bg-white/80 dark:bg-gray-800/80 px-2 py-0.5 rounded shadow-sm">
                {t.urlCount.replace('{count}', validUrlCount.toString())}
              </span>
              
              <div className="flex items-center space-x-1 rtl:space-x-reverse bg-white/80 dark:bg-gray-800/80 p-1 rounded-lg shadow-sm border dark:border-gray-700">
                <button onClick={handleAction(() => onUrlsChange(''))} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors" title={t.clearUrls}><TrashIcon className="w-4 h-4" /></button>
                <button onClick={handleAction(exportToFile)} className="p-1.5 text-gray-400 hover:text-teal-500 transition-colors" title={t.exportUrls}><DownloadIcon className="w-4 h-4" /></button>
                <button onClick={handleAction(copyToClipboard)} className="relative p-1.5 text-gray-400 hover:text-teal-500 transition-colors" title={t.copyUrls}>
                  <CopyIcon className="w-4 h-4" />
                  {copyBtnSuccess && <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] bg-black text-white px-2 py-1 rounded shadow-lg">{t.urlsCopied}</span>}
                </button>
                <div className="w-px h-3 bg-gray-200 dark:bg-gray-600 mx-1" />
                <button onClick={handleAction(() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(urls)}`, '_blank'))} className="p-1.5 text-gray-400 hover:text-blue-400 transition-colors"><TwitterIcon className="w-4 h-4" /></button>
                <button onClick={handleAction(() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(urls.match(/https?:\/\/[^\s]+/)?.[0] || window.location.href)}`, '_blank'))} className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"><FacebookIcon className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
          {error && <p className="mt-2 text-xs font-bold text-red-500 uppercase tracking-tight">{error}</p>}
        </div>
      </div>

      <button
        onClick={validateAndSubmit}
        disabled={isSubmitting || !urls.trim()}
        className="w-full h-14 bg-teal-500 hover:bg-teal-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white font-black text-lg uppercase tracking-widest rounded-xl transition-all shadow-lg active:scale-[0.99]"
      >
        {isSubmitting ? <span className="flex items-center justify-center"><SpinnerIcon /> {t.submittingButton}</span> : t.submitButton}
      </button>
    </div>
  );
};