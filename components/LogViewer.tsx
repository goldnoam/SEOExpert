
import React, { useRef, useEffect, useState } from 'react';
import { translations } from '../translations';
import { CopyIcon } from './icons/CopyIcon';
import { InfoIcon } from './icons/InfoIcon';
import { LogEntry } from '../types';

interface LogViewerProps {
  logs: LogEntry[];
  language: string;
  onClear: () => void;
}

export const LogViewer: React.FC<LogViewerProps> = ({ logs, language, onClear }) => {
  const t = translations[language] || translations['en'];
  const logContainerRef = useRef<HTMLDivElement>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const handleExport = () => {
    if (logs.length === 0) return;
    const textLogs = logs.map(l => l.message + (l.siteDescription ? ` (${l.siteDescription})` : '')).join('\n');
    const blob = new Blob([textLogs], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'submission_logs.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    if (logs.length === 0) return;
    try {
        const textLogs = logs.map(l => l.message + (l.siteDescription ? ` (${l.siteDescription})` : '')).join('\n');
        await navigator.clipboard.writeText(textLogs);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
        console.error('Failed to copy logs:', err);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mt-6 border border-gray-100 dark:border-gray-700">
      <div className="flex justify-between items-center mb-3 border-b border-gray-200 dark:border-gray-700 pb-2 flex-wrap gap-2">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 rtl:text-right flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {t.logTitle}
        </h2>
        <div className="flex space-x-2 rtl:space-x-reverse">
            <button
                onClick={handleCopy}
                disabled={logs.length === 0}
                className="relative text-xs sm:text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-1.5 px-3 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 border border-gray-200 dark:border-gray-600"
                title={t.copyLogs}
            >
                <CopyIcon className="w-4 h-4" />
                <span className="hidden sm:inline">{t.copyLogs}</span>
                {copySuccess && (
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 whitespace-nowrap bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-xl z-20">
                        {t.logsCopied}
                    </span>
                )}
            </button>
            <button
                onClick={onClear}
                disabled={logs.length === 0}
                className="text-xs sm:text-sm bg-gray-100 dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 text-gray-700 dark:text-gray-300 py-1.5 px-3 rounded-md transition-all border border-gray-200 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {t.clearLogs}
            </button>
            <button
                onClick={handleExport}
                disabled={logs.length === 0}
                className="text-xs sm:text-sm bg-teal-500 hover:bg-teal-600 text-white py-1.5 px-4 rounded-md font-bold transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {t.exportLogs}
            </button>
        </div>
      </div>
      <div ref={logContainerRef} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 h-72 overflow-y-auto font-mono text-[13px] leading-relaxed custom-scrollbar border border-gray-100 dark:border-gray-800">
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-600 space-y-2 opacity-60">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="rtl:text-right font-sans italic">{t.initialLog}</p>
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="rtl:text-right group relative flex flex-col mb-2 pb-2 border-b border-gray-200/40 dark:border-gray-700/40 last:border-0 hover:bg-white dark:hover:bg-gray-800/50 transition-colors rounded-md p-2">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 mt-0.5 shrink-0 rounded-sm bg-gray-200/50 dark:bg-gray-700/50 flex items-center justify-center overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm">
                   {log.urlFavicon ? (
                      <img 
                        src={log.urlFavicon} 
                        alt="" 
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const placeholder = e.currentTarget.parentElement?.querySelector('.log-fallback');
                          if (placeholder) placeholder.classList.remove('hidden');
                        }} 
                      />
                   ) : null}
                   <div className={`log-fallback ${log.urlFavicon ? 'hidden' : ''} text-[10px] text-gray-400 dark:text-gray-500 font-black`}>
                     <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                   </div>
                </div>
                <span className="whitespace-pre-wrap flex-grow text-gray-700 dark:text-gray-200">{log.message}</span>
                {log.siteDescription && (
                    <div className="relative flex items-center">
                      <span className="text-teal-500/60 dark:text-teal-400/60 hover:text-teal-500 dark:hover:text-teal-400 mt-0.5 shrink-0 cursor-help transition-colors">
                        <InfoIcon className="w-4 h-4" />
                      </span>
                      <div className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50 border border-gray-700 font-sans backdrop-blur-md">
                        <p className="font-black mb-1 border-b border-gray-700 pb-1 uppercase tracking-widest text-teal-400 text-[9px]">Site Intel</p>
                        <p className="leading-normal">{log.siteDescription}</p>
                        <div className="absolute top-full right-4 w-3 h-3 bg-gray-900 border-r border-b border-gray-700 rotate-45 -mt-1.5"></div>
                      </div>
                    </div>
                )}
              </div>
              {log.siteDescription && (
                <div className="flex items-center gap-1.5 mt-1 opacity-80 group/desc relative">
                  <div className="w-1 h-3 bg-teal-500/30 rounded-full shrink-0"></div>
                  <span className="text-[11px] italic text-teal-600 dark:text-teal-400/80 font-sans line-clamp-1 cursor-help">
                    {log.siteDescription}
                  </span>
                  <div className="absolute bottom-full left-0 mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-2xl opacity-0 group-hover/desc:opacity-100 pointer-events-none transition-all duration-200 z-50 border border-gray-700 font-sans backdrop-blur-md">
                    <p className="font-black mb-1 border-b border-gray-700 pb-1 uppercase tracking-widest text-teal-400 text-[9px]">Site Details</p>
                    <p className="leading-normal">{log.siteDescription}</p>
                    <div className="absolute top-full left-4 w-3 h-3 bg-gray-900 border-r border-b border-gray-700 rotate-45 -mt-1.5"></div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
