
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { UrlInput } from './components/UrlInput';
import { LogViewer } from './components/LogViewer';
import { AboutModal } from './components/AboutModal';
import { ManualSubmissionLinks } from './components/ManualSubmissionLinks';
import { Footer } from './components/Footer';
import { AdBanner } from './components/AdBanner';
import { Theme, SubmissionItem, LogEntry, SubmissionSite } from './types';
import { performSubmissions } from './services/submissionService';
import { translations } from './translations';
import { SUBMISSION_DELAY } from './constants';

import { TrafficGrowthGuide } from './components/TrafficGrowthGuide';
import { AdditionalSEOTools } from './components/AdditionalSEOTools';
import { SubmissionHistory } from './components/SubmissionHistory';
import { RankTracker } from './components/RankTracker';
import { AdvancedSEOMetrics } from './components/AdvancedSEOMetrics';

function App() {
  const [theme, setTheme] = useState<Theme>(Theme.Dark);
  const [language, setLanguage] = useState<string>('en');
  const [urls, setUrls] = useState<string>('');
  const [customPings, setCustomPings] = useState<string>('');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState<boolean>(false);
  const [submissionItems, setSubmissionItems] = useState<SubmissionItem[]>([]);
  const [history, setHistory] = useState<SubmissionItem[]>(() => {
    try {
      const saved = localStorage.getItem('seoexpert_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('seoexpert_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove('light', 'dark', 'colorful');
    html.classList.add(theme);
    
    if (theme === Theme.Dark || theme === Theme.Colorful) {
        html.classList.add('dark');
    } else {
        html.classList.remove('dark');
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
    setTheme((prevTheme) => {
        if (prevTheme === Theme.Light) return Theme.Dark;
        if (prevTheme === Theme.Dark) return Theme.Colorful;
        return Theme.Light;
    });
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
  };

  const getFavicon = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?sz=64&domain_url=${domain}`;
    } catch {
      return undefined;
    }
  };

  const logUpdateCallback = useCallback((message: string, site?: SubmissionSite, urlFavicon?: string) => {
    setLogs((prevLogs) => [
      ...prevLogs, 
      { 
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        message,
        siteDescription: site?.description,
        urlFavicon
      }
    ]);
  }, []);

  const clearLogs = () => {
    setLogs([]);
  };

  const handleReset = () => {
      setSubmissionItems([]);
      setUrls('');
      setLogs([]);
  };

  const handleClearSuccessful = () => {
    setSubmissionItems(prev => prev.filter(item => item.status !== 'success'));
  };

  const runSubmissionProcess = async (itemsToSubmit: SubmissionItem[]) => {
    setIsSubmitting(true);
    
    logUpdateCallback(`\n--- Starting Submission Process for ${itemsToSubmit.length} URL(s) ---`);

    for (let i = 0; i < itemsToSubmit.length; i++) {
      const item = itemsToSubmit[i];
      const favicon = getFavicon(item.url);
      
      if (i > 0) {
         await new Promise(resolve => setTimeout(resolve, SUBMISSION_DELAY));
      }

      setSubmissionItems(prev => prev.map(p => 
        p.id === item.id ? { ...p, status: 'processing', progress: 0, completedServices: 0 } : p
      ));

      logUpdateCallback(`\n--- Submitting: ${item.url} ---`, undefined, favicon);
      
      try {
        await performSubmissions(
          item.url, 
          customPings,
          (msg, site) => logUpdateCallback(msg, site, favicon),
          (current, total, lastSite) => {
            const percentage = total > 0 ? Math.round((current / total) * 100) : 100;
            setSubmissionItems(prev => prev.map(p => 
                p.id === item.id ? { 
                  ...p, 
                  progress: percentage, 
                  completedServices: current, 
                  totalServices: total,
                  lastServicePinger: lastSite || p.lastServicePinger
                } : p
            ));
          }
        );
        
        setSubmissionItems(prev => prev.map(p => 
            p.id === item.id ? { ...p, status: 'success', progress: 100 } : p
        ));
        setHistory(prev => {
          const updated = [{ ...item, status: 'success', progress: 100, timestamp: Date.now() }, ...prev];
          return updated.slice(0, 50); // Keep last 50
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        logUpdateCallback(`❌ Error submitting ${item.url}: ${errorMessage}`, undefined, favicon);
        
        setSubmissionItems(prev => prev.map(p => 
            p.id === item.id ? { ...p, status: 'failed', progress: 100 } : p
        ));
        setHistory(prev => {
          const updated = [{ ...item, status: 'failed', progress: 100, timestamp: Date.now() }, ...prev];
          return updated.slice(0, 50); // Keep last 50
        });
      }
    }

    logUpdateCallback('\n✅ Process finished.');
    setIsSubmitting(false);
  };

  const handleSubmit = async () => {
    const urlList = urls.split('\n').map((u) => u.trim()).filter(Boolean);

    if (urlList.length === 0) {
      logUpdateCallback('No valid URLs provided.');
      return;
    }

    const newItems: SubmissionItem[] = urlList.map(url => ({
      id: Math.random().toString(36).substr(2, 9),
      url,
      status: 'pending',
      progress: 0,
      favicon: getFavicon(url)
    }));
    
    setSubmissionItems(newItems);
    await runSubmissionProcess(newItems);
  };

  const handleRetryFailed = async () => {
    const failedItems = submissionItems.filter(item => item.status === 'failed');
    if (failedItems.length === 0) return;

    setSubmissionItems(prev => prev.map(p => 
      p.status === 'failed' ? { ...p, status: 'pending', progress: 0 } : p
    ));

    await runSubmissionProcess(failedItems);
  };

  const openAboutModal = () => setIsAboutModalOpen(true);
  const closeAboutModal = () => setIsAboutModalOpen(false);

  const t = translations[language] || translations['en'];

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 flex flex-col
      ${theme === Theme.Light ? 'bg-gray-100 text-gray-900' : ''}
      ${theme === Theme.Dark ? 'bg-gray-900 text-gray-100' : ''}
      ${theme === Theme.Colorful ? 'bg-[#0f172a] bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#1e1b4b] text-white' : ''}
    `}>
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        language={language}
        onLanguageChange={handleLanguageChange}
        onAboutClick={openAboutModal}
      />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 flex-grow">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-black text-center mb-2 tracking-tighter">
            <span className={theme === Theme.Colorful ? 'bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-pink-500 to-yellow-500' : ''}>
                SEO<span className="text-teal-500">Expert</span>
            </span>
          </h1>
          <p className={`text-center mb-8 max-w-2xl mx-auto leading-relaxed
            ${theme === Theme.Colorful ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}
          `}>
            {t.appSubtitle}
          </p>

          <UrlInput
            urls={urls}
            onUrlsChange={setUrls}
            customPings={customPings}
            onCustomPingsChange={setCustomPings}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            language={language}
            submissionItems={submissionItems}
            onReset={handleReset}
            onClearSuccessful={handleClearSuccessful}
            onRetryFailed={handleRetryFailed}
          />

          <AdBanner slot="TOP_BANNER_1" />

          {history.length > 0 && (
            <SubmissionHistory 
              history={history} 
              onClearHistory={() => setHistory([])} 
            />
          )}

          <div className={theme === Theme.Colorful ? 'glass-effect p-1 rounded-2xl shadow-2xl mt-8' : 'mt-8'}>
            <LogViewer logs={logs} language={language} onClear={clearLogs} />
          </div>

          <ManualSubmissionLinks language={language} />
          
          <AdditionalSEOTools language={language} />

          <RankTracker language={language} />

          <AdvancedSEOMetrics language={language} />

          <TrafficGrowthGuide language={language} />
        </div>
      </main>

      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={closeAboutModal}
        language={language}
      />

      <Footer language={language} />

      <style dangerouslySetInnerHTML={{ __html: `
        .glass-effect {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .colorful .glass-effect {
           background: rgba(49, 46, 129, 0.4);
           border: 1px solid rgba(255, 255, 255, 0.1);
        }
      `}} />
    </div>
  );
}

export default App;
