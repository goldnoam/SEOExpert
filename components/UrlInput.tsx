// FIX: Implement the UrlInput component for URL entry, drag-and-drop, and submission.
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { translations } from '../translations';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface UrlInputProps {
  urls: string;
  onUrlsChange: (urls: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  language: string;
}

export const UrlInput: React.FC<UrlInputProps> = ({ urls, onUrlsChange, onSubmit, isSubmitting, language }) => {
  const t = translations[language] || translations['en'];

  const onDrop = useCallback((acceptedFiles: File[]) => {
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, noClick: true, noKeyboard: true });

  const dropzoneClasses = `bg-white dark:bg-gray-800 border-2 border-dashed rounded-lg p-4 mb-4 transition-colors
    ${isDragActive ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20' : 'border-gray-300 dark:border-gray-600'}`;

  return (
    <div className="mb-8">
      <div {...getRootProps()} className={dropzoneClasses}>
        <input {...getInputProps()} />
        <p className="text-center text-gray-500 dark:text-gray-400 mb-2">{t.dropzoneHint}</p>
        <textarea
          value={urls}
          onChange={(e) => onUrlsChange(e.target.value)}
          placeholder={t.urlPlaceholder}
          className="w-full h-32 p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none resize-y rtl:text-right"
          disabled={isSubmitting}
          aria-label="URL input"
        />
      </div>
      <button
        onClick={onSubmit}
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