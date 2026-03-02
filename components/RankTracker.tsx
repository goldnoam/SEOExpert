import React, { useState, useEffect } from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { Plus, Trash2, ExternalLink, TrendingUp, TrendingDown, Minus, History } from 'lucide-react';
import { TrackedKeyword } from '../types';

interface RankTrackerProps {
  language: string;
  currentUrl: string;
}

export const RankTracker: React.FC<RankTrackerProps> = ({ language, currentUrl }) => {
  const [keywords, setKeywords] = useState<TrackedKeyword[]>(() => {
    try {
      const saved = localStorage.getItem('seoexpert_tracked_keywords');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [newKeyword, setNewKeyword] = useState('');
  const [newDomain, setNewDomain] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    if (showAdd && !newDomain && currentUrl) {
      const firstUrl = currentUrl.split('\n')[0].trim();
      try {
        const domain = new URL(firstUrl.startsWith('http') ? firstUrl : `https://${firstUrl}`).hostname;
        setNewDomain(domain);
      } catch {
        setNewDomain(firstUrl);
      }
    }
  }, [showAdd, currentUrl, newDomain]);

  useEffect(() => {
    localStorage.setItem('seoexpert_tracked_keywords', JSON.stringify(keywords));
  }, [keywords]);

  const addKeyword = () => {
    if (!newKeyword.trim() || !newDomain.trim()) return;
    
    const newItem: TrackedKeyword = {
      id: Math.random().toString(36).substr(2, 9),
      keyword: newKeyword.trim(),
      domain: newDomain.trim(),
      history: [],
    };
    
    setKeywords([newItem, ...keywords]);
    setNewKeyword('');
    setNewDomain('');
    setShowAdd(false);
  };

  const deleteKeyword = (id: string) => {
    if (confirm('Are you sure you want to stop tracking this keyword?')) {
      setKeywords(keywords.filter(k => k.id !== id));
    }
  };

  const updateRank = (id: string, rank: number) => {
    setKeywords(keywords.map(k => {
      if (k.id === id) {
        const newHistory = [...k.history, { timestamp: Date.now(), rank }];
        return { ...k, history: newHistory, lastChecked: Date.now() };
      }
      return k;
    }));
  };

  const getTrend = (history: { rank: number }[]) => {
    if (history.length < 2) return 'neutral';
    const last = history[history.length - 1].rank;
    const prev = history[history.length - 2].rank;
    if (last < prev) return 'up'; // Lower number is better rank
    if (last > prev) return 'down';
    return 'neutral';
  };

  return (
    <div className="mt-8 mb-12 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
            Rank <span className="text-teal-500">Tracker</span>
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Monitor your search engine rankings for target keywords.
          </p>
        </div>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-teal-500/20"
        >
          <Plus className="w-4 h-4" />
          {showAdd ? 'Cancel' : 'Add Keyword'}
        </button>
      </div>

      {showAdd && (
        <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-300 mb-1">Keyword</label>
              <input 
                type="text" 
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                placeholder="e.g. best coffee beans"
                className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 transition-all dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-300 mb-1">Domain</label>
              <input 
                type="text" 
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                placeholder="e.g. myshop.com"
                className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 transition-all dark:text-white"
              />
            </div>
          </div>
          <button 
            onClick={addKeyword}
            className="w-full py-2 bg-gray-900 dark:bg-teal-600 text-white rounded-lg font-bold text-sm hover:opacity-90 transition-all"
          >
            Start Tracking
          </button>
        </div>
      )}

      <div className="space-y-6">
        {keywords.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-2xl">
            <History className="w-12 h-12 text-gray-200 dark:text-gray-700 mx-auto mb-4" />
            <p className="text-gray-400 dark:text-gray-500 font-medium">No keywords tracked yet. Add your first one to start monitoring.</p>
          </div>
        ) : (
          keywords.map((k) => (
            <div key={k.id} className="p-5 bg-gray-50 dark:bg-gray-900/30 rounded-2xl border border-gray-100 dark:border-gray-800/50">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{k.keyword}</h3>
                    <div className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      {k.domain}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      Last Checked: {k.lastChecked ? new Date(k.lastChecked).toLocaleDateString() : 'Never'}
                    </span>
                    <a 
                      href={`https://www.google.com/search?q=${encodeURIComponent(k.keyword)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-teal-500 hover:underline font-bold"
                    >
                      Check on Google <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-center min-w-[80px]">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">Current Rank</p>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-3xl font-black text-gray-900 dark:text-white">
                        {k.history.length > 0 ? k.history[k.history.length - 1].rank : '-'}
                      </span>
                      {getTrend(k.history) === 'up' && <TrendingUp className="w-5 h-5 text-emerald-500" />}
                      {getTrend(k.history) === 'down' && <TrendingDown className="w-5 h-5 text-red-500" />}
                      {getTrend(k.history) === 'neutral' && <Minus className="w-5 h-5 text-gray-400" />}
                    </div>
                  </div>

                  <div className="h-16 w-32 hidden sm:block">
                    {k.history.length > 1 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={k.history}>
                          <Line 
                            type="monotone" 
                            dataKey="rank" 
                            stroke="#14b8a6" 
                            strokeWidth={3} 
                            dot={false} 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full w-full flex items-center justify-center border border-gray-200 dark:border-gray-800 rounded-lg border-dashed">
                        <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">No Data</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        placeholder="Rank"
                        className="w-16 px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-sm outline-none focus:ring-2 focus:ring-teal-500 dark:text-white"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const val = parseInt((e.target as HTMLInputElement).value);
                            if (!isNaN(val)) {
                              updateRank(k.id, val);
                              (e.target as HTMLInputElement).value = '';
                            }
                          }
                        }}
                      />
                      <button 
                        onClick={() => deleteKeyword(k.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
