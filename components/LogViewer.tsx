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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mt-6">
      <div className="flex justify-between items-center mb-3 border-b border-gray-200 dark:border-gray-700 pb-2 flex-wrap gap-2">
        <h2 className="text-lg font-semibold rtl:text-right">{t.logTitle}</h2>
        <div className="flex space-x-2 rtl:space-x-reverse">
            <button
                onClick={handleCopy}
                disabled={logs.length === 0}
                className="relative text-xs sm:text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-1 px-3 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                title={t.copyLogs}
            >
                <CopyIcon className="w-4 h-4" />
                <span className="hidden sm:inline">{t.copyLogs}</span>
                {copySuccess && (
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 whitespace-nowrap bg-black text-white text-xs px-2 py-1 rounded shadow-lg z-10">
                        {t.logsCopied}
                    </span>
                )}
            </button>
            <button
                onClick={onClear}
                disabled={logs.length === 0}
                className="text-xs sm:text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-1 px-3 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {t.clearLogs}
            </button>
            <button
                onClick={handleExport}
                disabled={logs.length === 0}
                className="text-xs sm:text-sm bg-teal-500 hover:bg-teal-600 text-white py-1 px-3 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {t.exportLogs}
            </button>
        </div>
      </div>
      <div ref={logContainerRef} className="bg-gray-100 dark:bg-gray-900 rounded p-3 h-64 overflow-y-auto font-mono text-sm custom-scrollbar">
        {logs.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 rtl:text-right">{t.initialLog}</p>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="rtl:text-right group relative flex flex-col mb-2 pb-1 border-b border-gray-200/50 dark:border-gray-700/50 last:border-0 hover:bg-gray-200/50 dark:hover:bg-gray-800 transition-colors rounded">
              <div className="flex items-start gap-2 p-1">
                <span className="whitespace-pre-wrap flex-grow">{log.message}</span>
                {log.siteDescription && (
                    <div className="relative flex items-center group/tooltip">
                      <span className="text-teal-500 dark:text-teal-400 mt-0.5 shrink-0 cursor-help">
                        <InfoIcon className="w-4 h-4" />
                      </span>
                      {/* Tooltip Popup */}
                      <div className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-opacity duration-200 z-50 border border-gray-700">
                        <p className="font-bold mb-1 border-b border-gray-700 pb-1 uppercase tracking-tighter">Site Description</p>
                        {log.siteDescription}
                        <div className="absolute top-full right-4 w-3 h-3 bg-gray-900 border-r border-b border-gray-700 rotate-45 -mt-1.5"></div>
                      </div>
                    </div>
                )}
              </div>
              {log.siteDescription && (
                <span className="text-[10px] italic text-gray-500 dark:text-gray-400 mt-0.5 ml-2 rtl:mr-2 rtl:ml-0">
                  {log.siteDescription}
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};