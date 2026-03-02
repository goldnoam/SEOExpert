import React from 'react';
import { SubmissionItem } from '../types';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { ClockIcon } from './icons/ClockIcon';

interface SubmissionHistoryProps {
  history: (SubmissionItem & { timestamp?: number })[];
  onClearHistory: () => void;
}

export const SubmissionHistory: React.FC<SubmissionHistoryProps> = ({ history, onClearHistory }) => {
  if (history.length === 0) return null;

  return (
    <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
          Submission <span className="text-teal-500">History</span>
        </h2>
        <button 
          onClick={onClearHistory}
          className="text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors uppercase tracking-widest"
        >
          Clear History
        </button>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
        {history.map((item, idx) => (
          <div key={`${item.id}-${idx}`} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3 overflow-hidden">
              {item.favicon ? (
                <img src={item.favicon} alt="" className="w-5 h-5 rounded-sm shrink-0" onError={(e) => (e.currentTarget.style.display = 'none')} />
              ) : (
                <div className="w-5 h-5 rounded-sm bg-gray-200 dark:bg-gray-700 shrink-0"></div>
              )}
              <div className="truncate">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate" title={item.url}>
                  {item.url}
                </p>
                {item.timestamp && (
                  <p className="text-[10px] text-gray-500 dark:text-gray-300">
                    {new Date(item.timestamp).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-4">
              {item.status === 'success' && <CheckCircleIcon className="w-5 h-5 text-teal-500" />}
              {item.status === 'failed' && <XCircleIcon className="w-5 h-5 text-red-500" />}
              {item.status === 'pending' && <ClockIcon className="w-5 h-5 text-yellow-500" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
