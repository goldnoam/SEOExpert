
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { UrlInput } from './components/UrlInput';
import { LogViewer } from './components/LogViewer';
import { AboutModal } from './components/AboutModal';
import { ManualSubmissionLinks } from './components/ManualSubmissionLinks';
import { Footer } from './components/Footer';
import { Theme, SubmissionItem } from './types';
import { performSubmissions } from './services/submissionService';
import { translations } from './translations';
import { SUBMISSION_DELAY } from './constants';

function App() {
  const [theme, setTheme] = useState<Theme>(Theme.Dark);
  const [language, setLanguage] = useState<string>('en');
  const [urls, setUrls] = useState<string>('');
  const [logs, setLogs] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState<boolean>(false);
  const [submissionItems, setSubmissionItems] = useState<SubmissionItem[]>([]);

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

  const clearLogs = () => {
    setLogs([]);
  };

  const handleReset = () => {
      setSubmissionItems([]);
      setUrls('');
      setLogs([]);
  };

  const handleSubmit = async () => {
    const urlList = urls.split('\n').map((u) => u.trim()).filter(Boolean);

    if (urlList.length === 0) {
      logUpdateCallback('No valid URLs provided. Please enter at least one URL.');
      return;
    }

    setIsSubmitting(true);
    setLogs([]);
    
    // Initialize submission items
    const newItems: SubmissionItem[] = urlList.map(url => ({
      id: Math.random().toString(36).substr(2, 9),
      url,
      status: 'pending',
      progress: 0,
    }));
    setSubmissionItems(newItems);

    logUpdateCallback(`Processing ${urlList.length} URL(s)...`);

    for (let i = 0; i < newItems.length; i++) {
      const item = newItems[i];
      
      // Delay before starting next item (except the first one) to prevent rate limiting
      if (i > 0) {
         await new Promise(resolve => setTimeout(resolve, SUBMISSION_DELAY));
      }

      // Update status to processing
      setSubmissionItems(prev => prev.map(p => 
        p.id === item.id ? { ...p, status: 'processing' } : p
      ));

      logUpdateCallback(`\n--- Submitting: ${item.url} ---`);
      
      try {
        await performSubmissions(
          item.url, 
          logUpdateCallback,
          (current, total) => {
            // Update progress percentage
            const percentage = Math.round((current / total) * 100);
            setSubmissionItems(prev => prev.map(p => 
                p.id === item.id ? { ...p, progress: percentage } : p
            ));
          }
        );
        
        // Mark as success
        setSubmissionItems(prev => prev.map(p => 
            p.id === item.id ? { ...p, status: 'success', progress: 100 } : p
        ));
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        logUpdateCallback(`❌ Error submitting ${item.url}: ${errorMessage}`);
        console.error(`Submission error for ${item.url}:`, error);
        
        // Mark as failed
        setSubmissionItems(prev => prev.map(p => 
            p.id === item.id ? { ...p, status: 'failed', progress: 100 } : p
        ));
      }
    }

    logUpdateCallback('\n✅ Submission process finished.');
    setIsSubmitting(false);
  };

  const openAboutModal = () => setIsAboutModalOpen(true);
  const closeAboutModal = () => setIsAboutModalOpen(false);

  const t = translations[language] || translations['en'];

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300 flex flex-col">
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        language={language}
        onLanguageChange={handleLanguageChange}
        onAboutClick={openAboutModal}
      />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 flex-grow">
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
            submissionItems={submissionItems}
            onReset={handleReset}
          />

          <LogViewer logs={logs} language={language} onClear={clearLogs} />

          <ManualSubmissionLinks language={language} />
        </div>
      </main>

      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={closeAboutModal}
        language={language}
      />

      <Footer language={language} />
    </div>
  );
}

export default App;
