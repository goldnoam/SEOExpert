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
  },
  {
    category: 'Geo & Domain Tools',
    requiresInput: true,
    inputPlaceholder: 'Enter a domain (e.g., example.com)',
    tools: [
      {
        name: 'IP Geolocation',
        url: 'https://www.iplocation.net/search?q={QUERY}',
        description: 'Find the geographic location of the server hosting the URL.',
        queryParam: 'q',
      },
      {
        name: 'WHOIS Lookup',
        url: 'https://who.is/whois/{QUERY}',
        description: 'Check domain registration details and ownership information.',
        queryParam: '',
      },
      {
        name: 'DNS Checker',
        url: 'https://dnschecker.org/#A/{QUERY}',
        description: 'Check DNS propagation across multiple global servers.',
        queryParam: '',
      },
    ]
  },
  {
    category: 'Geo & Local SEO',
    requiresInput: true,
    inputPlaceholder: 'Enter a location or business',
    tools: [
      {
        name: 'Google Maps',
        url: 'https://www.google.com/maps/search/{QUERY}',
        description: 'Check local business listings and map rankings.',
        queryParam: '',
      },
      {
        name: 'Bing Maps',
        url: 'https://www.bing.com/maps?q={QUERY}',
        description: "Verify local presence on Microsoft's mapping service.",
        queryParam: '',
      },
      {
        name: 'OpenStreetMap',
        url: 'https://www.openstreetmap.org/search?query={QUERY}',
        description: 'Open-source map data for geographic verification.',
        queryParam: '',
      },
      {
        name: 'Yelp Business',
        url: 'https://www.yelp.com/search?find_desc={QUERY}',
        description: 'Monitor local reputation and business directory status.',
        queryParam: '',
      },
      {
        name: 'What3Words',
        url: 'https://what3words.com/{QUERY}',
        description: 'Unique 3-word address system for precise location sharing.',
        queryParam: '',
      },
      {
        name: 'GeoHack',
        url: 'https://geohack.toolforge.org/geohack.php?params={QUERY}',
        description: 'Universal map tool for coordinate-based location lookup.',
        queryParam: '',
      }
    ]
  },
  {
    category: 'Search & Webmaster',
    requiresInput: true,
    inputPlaceholder: 'Enter a keyword or URL',
    tools: [
      {
        name: 'Bing Webmaster Tools',
        url: 'https://www.bing.com/webmasters/about',
        description: "Manage your site's presence on Bing search results.",
        queryParam: '',
      },
      {
        name: 'Yandex Webmaster',
        url: 'https://webmaster.yandex.com/',
        description: "Monitor your site's performance on Yandex search.",
        queryParam: '',
      },
      {
        name: 'DuckDuckGo Search',
        url: 'https://duckduckgo.com/?q={QUERY}',
        description: 'Privacy-focused search engine for SEO checking.',
        queryParam: 'q',
      },
      {
        name: 'Baidu Search',
        url: 'https://www.baidu.com/s?wd={QUERY}',
        description: "Check your rankings on China's largest search engine.",
        queryParam: 'wd',
      },
      {
        name: 'Naver Search',
        url: 'https://search.naver.com/search.naver?query={QUERY}',
        description: "South Korea's leading search engine for regional SEO.",
        queryParam: 'query',
      },
      {
        name: 'Qwant Search',
        url: 'https://www.qwant.com/?q={QUERY}',
        description: 'European privacy-focused search engine.',
        queryParam: 'q',
      }
    ]
  },
  {
    category: 'International SEO',
    requiresInput: true,
    inputPlaceholder: 'Enter a URL or keyword',
    tools: [
      {
        name: 'Baidu Submission',
        url: 'https://ziyuan.baidu.com/linksubmit/index',
        description: "Submit your site to China's primary search engine.",
      },
      {
        name: 'Sogou Submission',
        url: 'https://zhanzhang.sogou.com/index.php/linksubmit/index',
        description: 'Submit URLs to Sogou search index.',
      },
      {
        name: '360 Search (Haosou)',
        url: 'https://zhanzhang.so.com/sitetool/link_submit',
        description: 'Submit your site to Qihoo 360 search.',
      },
      {
        name: 'Shenma Search',
        url: 'https://zhanzhang.sm.cn/',
        description: "Mobile-first search engine by Alibaba in China.",
      },
      {
        name: 'Naver Webmaster',
        url: 'https://searchadvisor.naver.com/',
        description: "Essential for indexing on South Korea's Naver.",
      },
      {
        name: 'Daum Submission',
        url: 'https://register.search.daum.net/index.daum',
        description: 'Submit your site to Daum search engine.',
      },
      {
        name: 'Zum Submission',
        url: 'https://help.zum.com/submit',
        description: 'Request indexing on Zum.com.',
      },
      {
        name: 'Nate Search',
        url: 'https://www.nate.com/',
        description: 'Major South Korean portal and search service.',
      }
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
      let query = inputs[categoryIdx]?.trim();
      if (!query) {
        alert('Please enter a keyword or URL first.');
        return;
      }
      
      const category = SEO_TOOLS[categoryIdx].category;
      
      // For Domain/Geo tools, if it's a URL, extract the hostname
      if (category === 'Geo & Domain Tools' || category === 'Backlink Analysis' || category === 'International SEO') {
        try {
          if (query.startsWith('http')) {
            query = new URL(query).hostname;
          }
        } catch (e) {
          // fallback to original query if URL parsing fails
        }
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
        <p className="text-sm text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Take your SEO to the next level with these essential tools for keyword research, backlink analysis, site auditing, geographic insights, and international search optimization.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7 gap-6">
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
                  <p className="text-xs text-gray-500 dark:text-gray-300 leading-relaxed">
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
