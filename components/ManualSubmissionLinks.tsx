import React from 'react';
import { translations } from '../translations';

interface ManualSubmissionLinksProps {
  language: string;
}

const MANUAL_SITES = [
  {
    name: 'Google Search Console',
    url: 'https://search.google.com/search-console',
    descriptionKey: 'gscDescription',
  },
  {
    name: 'Bing Webmaster Tools',
    url: 'https://www.bing.com/webmasters',
    descriptionKey: 'bingDescription',
  },
];

export const ManualSubmissionLinks: React.FC<ManualSubmissionLinksProps> = ({ language }) => {
  const t = translations[language] || translations['en'];

  return (
    <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold mb-3 border-b border-gray-200 dark:border-gray-700 pb-2 rtl:text-right">{t.manualSubmissionTitle}</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 rtl:text-right">
        {t.manualSubmissionIntro}
      </p>
      <div className="space-y-4">
        {MANUAL_SITES.map((site) => (
          <div key={site.name} className="flex items-start rtl:flex-row-reverse">
             <div className="flex-shrink-0 h-6 w-6 mt-1">
                <svg className="text-teal-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
             </div>
            <div className="ml-3 rtl:mr-3 rtl:ml-0">
              <a href={site.url} target="_blank" rel="noopener noreferrer" className="text-base font-medium text-teal-600 dark:text-teal-400 hover:underline">
                {site.name}
              </a>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t[site.descriptionKey]}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};