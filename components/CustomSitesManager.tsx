
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
  const [description, setDescription] = useState('');
  const [urlTemplate, setUrlTemplate] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAdd = () => {
    setError(null);
    const trimmedName = name.trim();
    const trimmedDescription = description.trim();
    const trimmedTemplate = urlTemplate.trim();

    if (!trimmedName) {
        setError(t.customSiteNameError);
        return;
    }

    if (!trimmedTemplate) {
        setError(t.customSiteTemplateError);
        return;
    }

    if (!trimmedTemplate.includes('{URL}')) {
        setError(t.customSitePlaceholderError);
        return;
    }

    onAddSite({ name: trimmedName, description: trimmedDescription, urlTemplate: trimmedTemplate });
    setName('');
    setDescription('');
    setUrlTemplate('');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mt-8">
      <h2 className="text-lg font-semibold mb-2 border-b border-gray-200 dark:border-gray-700 pb-2 rtl:text-right">{t.customSitesTitle}</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 rtl:text-right">{t.customSitesIntro}</p>
      
      <div className="space-y-3 mb-4">
        {customSites.map((site, index) => (
          <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
            <div className="overflow-hidden mr-2 rtl:mr-0 rtl:ml-2 flex-1 min-w-0">
              <p className="font-medium text-gray-800 dark:text-gray-200 truncate">{site.name}</p>
              {site.description && (
                <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{site.description}</p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate font-mono" title={site.urlTemplate}>{site.urlTemplate}</p>
            </div>
            <button
              onClick={() => onRemoveSite(index)}
              className="text-red-500 hover:text-red-700 text-sm font-medium shrink-0 ml-2 rtl:ml-0 rtl:mr-2"
            >
              {t.remove}
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-col md:flex-row gap-2 rtl:space-x-reverse">
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(null); }}
              placeholder={t.namePlaceholder}
              className={`flex-1 p-2 border rounded-md bg-gray-50 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 rtl:text-right
                  ${error === t.customSiteNameError ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300 dark:border-gray-600'}`}
            />
            <input
              type="text"
              value={description}
              onChange={(e) => { setDescription(e.target.value); setError(null); }}
              placeholder={t.descriptionPlaceholder}
              className="flex-1 p-2 border rounded-md bg-gray-50 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 rtl:text-right border-gray-300 dark:border-gray-600"
            />
            <input
              type="text"
              value={urlTemplate}
              onChange={(e) => { setUrlTemplate(e.target.value); setError(null); }}
              placeholder={t.templatePlaceholder}
              className={`flex-[1.5] p-2 border rounded-md bg-gray-50 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 rtl:text-right
                  ${(error === t.customSiteTemplateError || error === t.customSitePlaceholderError) ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300 dark:border-gray-600'}`}
            />
            <button
              onClick={handleAdd}
              className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-md transition-colors"
            >
              {t.addSite}
            </button>
        </div>
        {error && (
            <p className="text-red-500 text-sm rtl:text-right">{error}</p>
        )}
      </div>
    </div>
  );
};
