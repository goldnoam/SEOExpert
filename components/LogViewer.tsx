
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
    const textLogs = logs.map(l => l.message).join('\n');
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
        const textLogs = logs.map(l => l.message).join('\n');
        await navigator.clipboard.writeText(textLogs);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
        console.error('Failed to copy logs:', err);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
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
      <div ref={logContainerRef} className="bg-gray-100 dark:bg-gray-900 rounded p-3 h-64 overflow-y-auto font-mono text-sm">
        {logs.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 rtl:text-right">{t.initialLog}</p>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="rtl:text-right flex items-start gap-2 mb-1">
              <span className="whitespace-pre-wrap">{log.message}</span>
              {log.siteDescription && (
                  <span title={log.siteDescription} className="cursor-help text-teal-500 dark:text-teal-400 hover:text-teal-600 dark:hover:text-teal-300 mt-0.5">
                    <InfoIcon className="w-4 h-4" />
                  </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
