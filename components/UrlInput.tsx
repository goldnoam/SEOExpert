import React, { useState, useCallback } from 'react';

interface UrlInputProps {
  url: string;
  setUrl: (url: string) => void;
  setLogs: (logs: string) => void;
  setError: (error: string | null) => void;
}

export const UrlInput: React.FC<UrlInputProps> = ({ url, setUrl, setLogs, setError }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    let droppedUrl = '';
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        // This is a file, which we don't handle. Let's inform the user.
        setError("File drop is not supported. Please drop a URL link.");
        return;
    }
    
    droppedUrl = e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('text/plain');

    if (droppedUrl) {
      setUrl(droppedUrl);
      setLogs(`URL detected from drop: ${droppedUrl}`);
      setError(null);
    } else {
        setError("Could not extract a valid URL from the dropped item.");
    }
  }, [setUrl, setLogs, setError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    setLogs('Submission log will appear here...');
    setError(null);
  };

  const borderStyle = isDragging
    ? 'border-teal-500 ring-2 ring-teal-500'
    : 'border-gray-300 dark:border-gray-600';

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative w-full p-4 border-2 border-dashed ${borderStyle} rounded-lg transition-all duration-300 bg-gray-50 dark:bg-gray-700/50`}
    >
      <div className="flex flex-col items-center justify-center text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 dark:text-gray-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Drag & drop a URL or type it below
        </p>
      </div>
      <input
        type="text"
        value={url}
        onChange={handleChange}
        placeholder="https://your-website.com"
        className="mt-4 w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
      />
    </div>
  );
};
