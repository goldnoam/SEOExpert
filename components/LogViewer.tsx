import React from 'react';

interface LogViewerProps {
  logs: string;
}

export const LogViewer: React.FC<LogViewerProps> = ({ logs }) => {
  return (
    <div className="w-full">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Submission Log</h2>
        <div className="bg-gray-900 dark:bg-black rounded-lg shadow-inner p-4 min-h-[200px] max-h-[400px] overflow-y-auto">
            <pre className="text-sm text-gray-300 dark:text-gray-400 whitespace-pre-wrap font-mono">
                {logs}
            </pre>
        </div>
    </div>
  );
};
