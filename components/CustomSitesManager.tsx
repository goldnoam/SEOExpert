import React, { useState } from 'react';
import { SubmissionSite } from '../types';
import { translations } from '../translations';

interface CustomSitesManagerProps {
  customSites: SubmissionSite[];
  onAddSite: (site: SubmissionSite) => void;
  onRemoveSite: (index: number) => void;
  language: string;
}

export const CustomSitesManager: React.FC<CustomSitesManagerProps> = ({ customSites, onAddSite, onRemoveSite, language }) => {
  const t = translations[language] || translations['en'];
  const [name, setName] = useState('');
  const [urlTemplate, setUrlTemplate] = useState('');

  const handleAdd = () => {
    if (name.trim() && urlTemplate.trim()) {
      onAddSite({ name: name.trim(), urlTemplate: urlTemplate.trim(), description: 'Custom site' });
      setName('');
      setUrlTemplate('');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mt-8">
      <h2 className="text-lg font-semibold mb-2 border-b border-gray-200 dark:border-gray-700 pb-2 rtl:text-right">{t.customSitesTitle}</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 rtl:text-right">{t.customSitesIntro}</p>
      
      <div className="space-y-3 mb-4">
        {customSites.map((site, index) => (
          <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
            <div className="overflow-hidden mr-2 rtl:mr-0 rtl:ml-2">
              <p className="font-medium text-gray-800 dark:text-gray-200 truncate">{site.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate" title={site.urlTemplate}>{site.urlTemplate}</p>
            </div>
            <button
              onClick={() => onRemoveSite(index)}
              className="text-red-500 hover:text-red-700 text-sm font-medium shrink-0"
            >
              {t.remove}
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-2 rtl:space-x-reverse">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t.namePlaceholder}
          className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 rtl:text-right"
        />
        <input
          type="text"
          value={urlTemplate}
          onChange={(e) => setUrlTemplate(e.target.value)}
          placeholder={t.templatePlaceholder}
          className="flex-[2] p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 rtl:text-right"
        />
        <button
          onClick={handleAdd}
          disabled={!name.trim() || !urlTemplate.trim()}
          className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-md transition-colors disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {t.addSite}
        </button>
      </div>
    </div>
  );
};