// FIX: Implement the LogViewer component to display submission logs.
import React, { useRef, useEffect } from 'react';
import { translations } from '../translations';

interface LogViewerProps {
  logs: string[];
  language: string;
}

export const LogViewer: React.FC<LogViewerProps> = ({ logs, language }) => {
  const t = translations[language] || translations['en'];
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold mb-3 border-b border-gray-200 dark:border-gray-700 pb-2 rtl:text-right">{t.logTitle}</h2>
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