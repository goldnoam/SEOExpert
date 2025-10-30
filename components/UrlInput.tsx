import React, { useState, useCallback } from 'react';

interface UrlInputProps {
  urls: string;
  setUrls: (urls: string) => void;
  setLogs: (logs: string) => void;
  setError: (error: string | null) => void;
}

export const UrlInput: React.FC<UrlInputProps> = ({ urls, setUrls, setLogs, setError }) => {
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
    
    const droppedText = e.dataTransfer.getData('text/plain') || e.dataTransfer.getData('text/uri-list');

    if (droppedText && droppedText.trim()) {
      setUrls(currentUrls => {
        const trimmedCurrent = currentUrls.trim();
        const trimmedDropped = droppedText.trim();
        if (!trimmedCurrent) return trimmedDropped;
        // Append with a newline, preventing double newlines if one already exists
        return `${trimmedCurrent}\n${trimmedDropped}`;
      });
      setLogs(`URL(s) added via drop.`);
      setError(null);
    } else {
        setError("Could not extract any text or URL from the dropped item.");
    }
  }, [setUrls, setLogs, setError]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUrls(e.target.value);
    setError(null);
    if (!e.target.value.trim()) {
      setLogs('Submission log will appear here...');
    }
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
          Drag & drop URL(s), or type/paste them below (one per line)
        </p>
      </div>
      <textarea
        value={urls}
        onChange={handleChange}
        placeholder={'https://your-website.com\nhttps://your-other-site.org'}
        rows={5}
        className="mt-4 w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono text-sm"
        aria-label="URL Input"
      />
    </div>
  );
};
