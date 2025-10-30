import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { UrlInput } from './components/UrlInput';
import { LogViewer } from './components/LogViewer';
import { SpinnerIcon } from './components/icons/SpinnerIcon';
import { performSubmissions } from './services/submissionService';
import { Theme } from './types';

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(Theme.Dark);
  const [language, setLanguage] = useState<string>('en');
  const [urls, setUrls] = useState<string>('');
  const [logs, setLogs] = useState<string>('Submission log will appear here...');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === Theme.Dark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === Theme.Light ? Theme.Dark : Theme.Light));
  }, []);

  const handleSubmit = async () => {
    if (!urls.trim() || isLoading) return;
    
    // Split by newline, trim, filter empty lines, and get unique URLs
    // FIX: Explicitly specify the generic type for `new Set` to prevent TypeScript from inferring the array as `unknown[]`.
    const urlList: string[] = [...new Set<string>(urls.split('\n').map(u => u.trim()).filter(Boolean))];

    if (urlList.length === 0) {
      setError('Please enter at least one valid URL.');
      setLogs('Error: No valid URLs provided.');
      return;
    }
    
    // Validate all URLs before submission
    const invalidUrls = urlList.filter(u => {
        try {
            const parsedUrl = new URL(u);
            return !['http:', 'https:'].includes(parsedUrl.protocol);
        } catch (_) {
            return true;
        }
    });

    if (invalidUrls.length > 0) {
      setError(`Please fix invalid or incomplete URLs: ${invalidUrls.join(', ')}`);
      setLogs(`Error: Invalid URLs detected:\n${invalidUrls.join('\n')}`);
      return;
    }

    setIsLoading(true);
    setError(null);
    setLogs(''); // Clear logs at the beginning

    const logUpdateCallback = (message: string) => {
        setLogs(prevLogs => prevLogs + message + '\n');
    };

    logUpdateCallback(`Starting submission for ${urlList.length} unique URL(s)...\n`);

    try {
      for (const singleUrl of urlList) {
        logUpdateCallback(`--- Submitting: ${singleUrl} ---`);
        await performSubmissions(singleUrl, logUpdateCallback);
        logUpdateCallback(`--- Finished: ${singleUrl} ---\n`);
      }
    } catch (e: unknown) {
      // FIX: Explicitly type the caught error as 'unknown' for better type safety.
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`An unexpected error occurred during submission. ${errorMessage}`);
      logUpdateCallback(`Error: An unexpected error occurred. Please check the console.`);
    } finally {
      setIsLoading(false);
      logUpdateCallback(`All submissions completed.`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans transition-colors duration-300">
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        language={language}
        onLanguageChange={setLanguage}
      />
      <main className="container mx-auto p-4 md:p-8 flex flex-col items-center">
        <div className="w-full max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-2 text-gray-900 dark:text-white">
            SEO<span className="text-teal-500">Expert</span>
          </h1>
          <p className="text-center text-lg text-gray-600 dark:text-gray-400 mb-8">
            Enter one or more URLs to submit to major search engine ping services for faster indexing.
          </p>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <UrlInput urls={urls} setUrls={setUrls} setLogs={setLogs} setError={setError} />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <button
              onClick={handleSubmit}
              disabled={isLoading || !urls.trim()}
              className="mt-4 w-full flex items-center justify-center bg-teal-500 hover:bg-teal-600 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 focus:ring-offset-white dark:focus:ring-offset-gray-800"
            >
              {isLoading ? (
                <>
                  <SpinnerIcon />
                  Submitting...
                </>
              ) : (
                'Submit URL(s) to Search Engines'
              )}
            </button>
          </div>

          <LogViewer logs={logs} />
        </div>
      </main>
    </div>
  );
};

export default App;
