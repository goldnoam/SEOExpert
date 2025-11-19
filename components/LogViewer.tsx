import React, { useRef, useEffect } from 'react';
import { translations } from '../translations';

interface LogViewerProps {
  logs: string[];
  language: string;
  onClear: () => void;
}

export const LogViewer: React.FC<LogViewerProps> = ({ logs, language, onClear }) => {
  const t = translations[language] || translations['en'];
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const handleExport = () => {
    if (logs.length === 0) return;
    const blob = new Blob([logs.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'submission_logs.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-3 border-b border-gray-200 dark:border-gray-700 pb-2 flex-wrap gap-2">
        <h2 className="text-lg font-semibold rtl:text-right">{t.logTitle}</h2>
        <div className="flex space-x-2 rtl:space-x-reverse">
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
          logs.map((log, index) => (
            <div key={index} className="whitespace-pre-wrap rtl:text-right">{log}</div>
          ))
        )}
      </div>
    </div>
  );
};