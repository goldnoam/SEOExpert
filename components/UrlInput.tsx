
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { translations } from '../translations';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { UploadIcon } from './icons/UploadIcon';
import { TrashIcon } from './icons/TrashIcon';
import { ShareIcon } from './icons/ShareIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { TwitterIcon } from './icons/TwitterIcon';
import { FacebookIcon } from './icons/FacebookIcon';

interface UrlInputProps {
  urls: string;
  onUrlsChange: (urls: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  language: string;
}

export const UrlInput: React.FC<UrlInputProps> = ({ urls, onUrlsChange, onSubmit, isSubmitting, language }) => {
  const t = translations[language] || translations['en'];
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const validateAndSubmit = () => {
    const urlList = urls.split('\n').map((u) => u.trim()).filter(Boolean);

    if (urlList.length === 0) {
      // Pass to parent to handle empty logic or simply do nothing
      onSubmit();
      return;
    }

    let hasError = false;
    for (const url of urlList) {
      try {
        const parsedUrl = new URL(url);
        // Strictly check for http or https protocols
        if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
          hasError = true;
          break;
        }
      } catch (_) {
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
    setCopySuccess(false);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = () => {
        const fileContent = reader.result as string;
        onUrlsChange((prevUrls) => (prevUrls ? prevUrls.trim() + '\n' : '') + fileContent);
      };
      reader.readAsText(file);
    });
  }, [onUrlsChange]);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUrlsChange('');
    setError(null);
  };

  const handleExport = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!urls.trim()) return;
    const blob = new Blob([urls], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'urls.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleTwitterShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!urls.trim()) return;
    const text = encodeURIComponent(urls);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  const handleFacebookShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!urls.trim()) return;
    // Facebook requires a URL 'u' parameter to share. 
    // We try to find the first URL in the text to share it, or fallback to current page.
    // 'quote' can be used to pre-fill text in some contexts, though often ignored by FB.
    const urlMatch = urls.match(/https?:\/\/[^\s]+/);
    const urlToShare = urlMatch ? urlMatch[0] : window.location.href;
    
    const u = encodeURIComponent(urlToShare);
    const quote = encodeURIComponent(urls);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${u}&quote=${quote}`, '_blank');
  };

  const handleGenericShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!urls.trim()) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'SEO URLs',
          text: urls,
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(urls);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (err) {
        console.error('Clipboard write failed:', err);
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, noClick: true, noKeyboard: true });

  const dropzoneClasses = `bg-white dark:bg-gray-800 border-2 border-dashed rounded-lg p-4 mb-4 transition-all relative group
    ${isDragActive ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20' : (error ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600')}`;

  return (
    <div className="mb-8">
      <div {...getRootProps()} className={dropzoneClasses}>
        <input {...getInputProps()} />
        
        {isDragActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-teal-50/90 dark:bg-gray-800/90 z-20 rounded-lg backdrop-blur-sm">
            <UploadIcon className="w-12 h-12 text-teal-500 mb-2" />
            <p className="text-xl font-semibold text-teal-600 dark:text-teal-400 animate-pulse">
              {t.dragActiveHint}
            </p>
          </div>
        )}

        <div className={isDragActive ? 'opacity-20 blur-sm transition-all' : 'transition-all'}>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-2">{t.dropzoneHint}</p>
          <div className="relative">
            <textarea
                value={urls}
                onChange={(e) => handleChange(e.target.value)}
                placeholder={t.urlPlaceholder}
                className={`w-full h-32 p-3 pb-8 bg-gray-50 dark:bg-gray-700 border rounded-md focus:ring-2 focus:outline-none resize-y rtl:text-right
                ${error 
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500 dark:border-red-500' 
                    : 'border-gray-300 dark:border-gray-600 focus:ring-teal-500'}`}
                disabled={isSubmitting}
                aria-label="URL input"
                aria-invalid={!!error}
                aria-describedby={error ? "url-error" : undefined}
            />
            <div className="absolute bottom-2 right-2 flex space-x-2 rtl:space-x-reverse bg-gray-50 dark:bg-gray-700 pl-2 pt-1 rounded-tl-md">
                <button
                    onClick={handleClear}
                    disabled={!urls.trim() || isSubmitting}
                    className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors disabled:opacity-30"
                    title={t.clearUrls}
                    aria-label={t.clearUrls}
                >
                    <TrashIcon className="w-4 h-4" />
                </button>
                <button
                    onClick={handleExport}
                    disabled={!urls.trim() || isSubmitting}
                    className="p-1.5 text-gray-500 hover:text-teal-500 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors disabled:opacity-30"
                    title={t.exportUrls}
                    aria-label={t.exportUrls}
                >
                    <DownloadIcon className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 my-auto mx-1"></div>
                <button
                    onClick={handleTwitterShare}
                    disabled={!urls.trim() || isSubmitting}
                    className="p-1.5 text-gray-500 hover:text-blue-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors disabled:opacity-30"
                    title={t.shareTwitter}
                    aria-label={t.shareTwitter}
                >
                    <TwitterIcon className="w-4 h-4" />
                </button>
                <button
                    onClick={handleFacebookShare}
                    disabled={!urls.trim() || isSubmitting}
                    className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors disabled:opacity-30"
                    title={t.shareFacebook}
                    aria-label={t.shareFacebook}
                >
                    <FacebookIcon className="w-4 h-4" />
                </button>
                <button
                    onClick={handleGenericShare}
                    disabled={!urls.trim() || isSubmitting}
                    className="p-1.5 text-gray-500 hover:text-teal-500 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors disabled:opacity-30 relative"
                    title={t.shareUrls}
                    aria-label={t.shareUrls}
                >
                    <ShareIcon className="w-4 h-4" />
                    {copySuccess && (
                        <span className="absolute bottom-full right-0 mb-1 whitespace-nowrap bg-black text-white text-xs px-2 py-1 rounded shadow-lg">
                            {t.urlsCopied}
                        </span>
                    )}
                </button>
            </div>
          </div>
          {error && (
            <p id="url-error" className="mt-2 text-sm text-red-600 dark:text-red-400 rtl:text-right font-medium">
              {error}
            </p>
          )}
        </div>
      </div>
      <button
        onClick={validateAndSubmit}
        disabled={isSubmitting || !urls.trim()}
        className="w-full flex items-center justify-center bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <SpinnerIcon />
            {t.submittingButton}
          </>
        ) : (
          t.submitButton
        )}
      </button>
    </div>
  );
};
