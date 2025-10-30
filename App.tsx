import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { UrlInput } from './components/UrlInput';
import { LogViewer } from './components/LogViewer';
import { SpinnerIcon } from './components/icons/SpinnerIcon';
import { getSubmissionSites } from './services/geminiService';
import { Theme } from './types';

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(Theme.Dark);
  const [language, setLanguage] = useState<string>('en');
  const [url, setUrl] = useState<string>('');
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
    if (!url || isLoading) return;
    
    // URL validation
    try {
        new URL(url);
    } catch (_) {
        setError('Please enter a valid URL (e.g., https://example.com)');
        setLogs('Error: Invalid URL provided.');
        return;
    }

    setIsLoading(true);
    setError(null);
    setLogs('');

    try {
      const sites = await getSubmissionSites(url);
      let logOutput = `Simulating submission of ${url} to major sites:\n\n`;
      sites.forEach((site, index) => {
        logOutput += `${index + 1}. ${site.name}: ${site.description}\n`;
      });
      logOutput += '\nSubmission process simulated successfully.';
      setLogs(logOutput);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to fetch submission sites. ${errorMessage}`);
      setLogs(`Error: Could not retrieve site list. Please check your API key and network connection.`);
    } finally {
      setIsLoading(false);
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
            Enter a URL to discover where to submit it for optimal search engine visibility.
          </p>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <UrlInput url={url} setUrl={setUrl} setLogs={setLogs} setError={setError} />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <button
              onClick={handleSubmit}
              disabled={isLoading || !url}
              className="mt-4 w-full flex items-center justify-center bg-teal-500 hover:bg-teal-600 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 focus:ring-offset-white dark:focus:ring-offset-gray-800"
            >
              {isLoading ? (
                <>
                  <SpinnerIcon />
                  Discovering Sites...
                </>
              ) : (
                'Submit URL'
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
