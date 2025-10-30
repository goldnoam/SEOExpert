// FIX: Implement the main App component to manage application state and render child components.
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { UrlInput } from './components/UrlInput';
import { LogViewer } from './components/LogViewer';
import { AboutModal } from './components/AboutModal';
import { Theme } from './types';
import { performSubmissions } from './services/submissionService';
import { translations } from './translations';

function App() {
  const [theme, setTheme] = useState<Theme>(Theme.Dark);
  const [language, setLanguage] = useState<string>('en');
  const [urls, setUrls] = useState<string>('');
  const [logs, setLogs] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (theme === Theme.Dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    if (language === 'he') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  }, [language]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === Theme.Light ? Theme.Dark : Theme.Light));
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
  };

  const logUpdateCallback = useCallback((message: string) => {
    setLogs((prevLogs) => [...prevLogs, message]);
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setLogs([]);

    const urlList = urls.split('\n').map((u) => u.trim()).filter(Boolean);

    if (urlList.length === 0) {
      logUpdateCallback('No valid URLs provided. Please enter at least one URL.');
      setIsSubmitting(false);
      return;
    }

    logUpdateCallback(`Processing ${urlList.length} URL(s)...`);

    for (const url of urlList) {
      logUpdateCallback(`\n--- Submitting: ${url} ---`);
      try {
        await performSubmissions(url, logUpdateCallback);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        logUpdateCallback(`❌ Error submitting ${url}: ${errorMessage}`);
        console.error(`Submission error for ${url}:`, error);
      }
    }

    logUpdateCallback('\n✅ Submission process finished.');
    setIsSubmitting(false);
  };

  const openAboutModal = () => setIsAboutModalOpen(true);
  const closeAboutModal = () => setIsAboutModalOpen(false);

  const t = translations[language] || translations['en'];

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        language={language}
        onLanguageChange={handleLanguageChange}
        onAboutClick={openAboutModal}
      />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-center mb-2">
            SEO<span className="text-teal-500">Expert</span>
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
            {t.appSubtitle}
          </p>

          <UrlInput
            urls={urls}
            onUrlsChange={setUrls}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            language={language}
          />

          <LogViewer logs={logs} language={language} />
        </div>
      </main>

      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={closeAboutModal}
        language={language}
      />
    </div>
  );
}

export default App;