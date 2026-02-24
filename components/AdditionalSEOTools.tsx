import React, { useState } from 'react';
import { translations } from '../translations';

interface AdditionalSEOToolsProps {
  language: string;
}

const SEO_TOOLS = [
  {
    category: 'Keyword Research',
    requiresInput: true,
    inputPlaceholder: 'Enter a keyword (e.g., SEO tools)',
    tools: [
      {
        name: 'Google Keyword Planner',
        url: 'https://ads.google.com/home/tools/keyword-planner/',
        description: 'Discover new keywords and see search volume estimates.',
        queryParam: '',
      },
      {
        name: 'AnswerThePublic',
        url: 'https://answerthepublic.com/search?q={QUERY}',
        description: 'Find out what questions people are asking about your topic.',
        queryParam: 'q',
      },
      {
        name: 'Ahrefs Keyword Generator',
        url: 'https://ahrefs.com/keyword-generator/?country=us&keyword={QUERY}',
        description: 'Find thousands of keyword ideas in seconds.',
        queryParam: 'keyword',
      }
    ]
  },
  {
    category: 'Backlink Analysis',
    requiresInput: true,
    inputPlaceholder: 'Enter a URL (e.g., https://example.com)',
    tools: [
      {
        name: 'Ahrefs Free Backlink Checker',
        url: 'https://ahrefs.com/backlink-checker/?url={QUERY}',
        description: 'Check the top 100 backlinks to any website or URL.',
        queryParam: 'url',
      },
      {
        name: 'Moz Link Explorer',
        url: 'https://moz.com/link-explorer?url={QUERY}',
        description: 'Comprehensive link analysis and Domain Authority metrics.',
        queryParam: 'url',
      },
    ]
  },
  {
    category: 'Site Audit & Performance',
    requiresInput: false,
    tools: [
      {
        name: 'Google Lighthouse',
        url: 'https://developer.chrome.com/docs/lighthouse/overview/',
        description: 'Automated tool for improving the quality of web pages.',
      },
      {
        name: 'GTmetrix',
        url: 'https://gtmetrix.com/',
        description: "See how your site performs, reveal why it's slow and discover optimization opportunities.",
      },
    ]
  }
];

export const AdditionalSEOTools: React.FC<AdditionalSEOToolsProps> = ({ language }) => {
  const t = translations[language] || translations['en'];
  const [inputs, setInputs] = useState<Record<number, string>>({});

  const handleInputChange = (idx: number, value: string) => {
    setInputs(prev => ({ ...prev, [idx]: value }));
  };

  const handleToolClick = (e: React.MouseEvent<HTMLAnchorElement>, toolUrl: string, categoryIdx: number, requiresInput?: boolean) => {
    if (requiresInput && toolUrl.includes('{QUERY}')) {
      e.preventDefault();
      const query = inputs[categoryIdx]?.trim();
      if (!query) {
        alert('Please enter a keyword or URL first.');
        return;
      }
      const finalUrl = toolUrl.replace('{QUERY}', encodeURIComponent(query));
      window.open(finalUrl, '_blank');
    }
  };

  return (
    <div className="mt-8 mb-12 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
          Additional <span className="text-teal-500">SEO Tools</span>
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Take your SEO to the next level with these essential tools for keyword research, backlink analysis, and site auditing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SEO_TOOLS.map((category, idx) => (
          <div key={idx} className="flex flex-col">
            <h3 className="text-sm font-black uppercase tracking-widest text-teal-600 dark:text-teal-400 mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
              {category.category}
            </h3>
            
            {category.requiresInput && (
              <div className="mb-4">
                <input
                  type="text"
                  placeholder={category.inputPlaceholder}
                  value={inputs[idx] || ''}
                  onChange={(e) => handleInputChange(idx, e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all dark:text-white"
                />
              </div>
            )}

            <div className="space-y-4 flex-grow">
              {category.tools.map((tool, toolIdx) => (
                <a 
                  key={toolIdx}
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => handleToolClick(e, tool.url, idx, category.requiresInput)}
                  className="block group p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 hover:bg-teal-50 dark:hover:bg-teal-900/20 border border-transparent hover:border-teal-100 dark:hover:border-teal-900/50 transition-all"
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-gray-800 dark:text-gray-200 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {tool.name}
                    </h4>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-teal-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    {tool.description}
                  </p>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
