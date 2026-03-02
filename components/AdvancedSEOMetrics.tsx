import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, BarChart3, MapPin, Brain, Quote, ShieldCheck, Smile, Zap, Search, Layers, Link2 } from 'lucide-react';
import { AdvancedSEOSite, AISEOMetrics, LocalSEOMetrics } from '../types';

interface AdvancedSEOMetricsProps {
  language: string;
}

const DEFAULT_AI_METRICS: AISEOMetrics = {
  siteRanking: 0,
  pagesIndexed: 0,
  backTraces: 0,
  som: 0,
  citationRate: 0,
  entityConfidence: 0,
  sentiment: 'Neutral',
  informationGain: 0,
};

const DEFAULT_LOCAL_METRICS: LocalSEOMetrics = {
  localPackRanking: 0,
  directionRequests: 0,
  reviewVelocity: 0,
  napConsistency: 0,
  geogridVisibility: 0,
};

export const AdvancedSEOMetrics: React.FC<AdvancedSEOMetricsProps> = ({ language }) => {
  const [sites, setSites] = useState<AdvancedSEOSite[]>(() => {
    try {
      const saved = localStorage.getItem('seoexpert_advanced_sites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [newUrl, setNewUrl] = useState('');
  const [editingSiteId, setEditingSiteId] = useState<string | null>(null);
  const [editAiMetrics, setEditAiMetrics] = useState<AISEOMetrics>(DEFAULT_AI_METRICS);
  const [editLocalMetrics, setEditLocalMetrics] = useState<LocalSEOMetrics>(DEFAULT_LOCAL_METRICS);

  useEffect(() => {
    localStorage.setItem('seoexpert_advanced_sites', JSON.stringify(sites));
  }, [sites]);

  const addSite = () => {
    if (!newUrl.trim()) return;
    
    const newItem: AdvancedSEOSite = {
      id: Math.random().toString(36).substr(2, 9),
      url: newUrl.trim(),
      aiMetrics: { ...DEFAULT_AI_METRICS },
      localMetrics: { ...DEFAULT_LOCAL_METRICS },
      lastUpdated: Date.now(),
    };
    
    setSites([newItem, ...sites]);
    setNewUrl('');
  };

  const deleteSite = (id: string) => {
    if (confirm('Are you sure you want to remove this site from tracking?')) {
      setSites(sites.filter(s => s.id !== id));
      if (editingSiteId === id) setEditingSiteId(null);
    }
  };

  const startEditing = (site: AdvancedSEOSite) => {
    setEditingSiteId(site.id);
    setEditAiMetrics(site.aiMetrics);
    setEditLocalMetrics(site.localMetrics);
  };

  const saveMetrics = () => {
    if (!editingSiteId) return;
    
    setSites(sites.map(s => {
      if (s.id === editingSiteId) {
        return {
          ...s,
          aiMetrics: editAiMetrics,
          localMetrics: editLocalMetrics,
          lastUpdated: Date.now(),
        };
      }
      return s;
    }));
    setEditingSiteId(null);
  };

  return (
    <div className="mt-8 mb-12 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
            Advanced <span className="text-teal-500">SEO & AI Metrics</span>
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Track 2026 AI Search (SGE) and Local SEO performance metrics.
          </p>
        </div>
        <div className="flex gap-2">
          <input 
            type="text" 
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="Enter URL to track..."
            className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 transition-all dark:text-white text-sm min-w-[240px]"
          />
          <button 
            onClick={addSite}
            className="p-2 bg-teal-500 hover:bg-teal-600 text-white rounded-xl transition-all shadow-lg shadow-teal-500/20"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {sites.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-2xl">
            <BarChart3 className="w-12 h-12 text-gray-200 dark:text-gray-700 mx-auto mb-4" />
            <p className="text-gray-400 font-medium">No sites tracked yet. Add a URL to start monitoring advanced metrics.</p>
          </div>
        ) : (
          sites.map((site) => (
            <div key={site.id} className="p-6 bg-gray-50 dark:bg-gray-900/30 rounded-2xl border border-gray-100 dark:border-gray-800/50">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-teal-500/10 rounded-lg">
                    <Zap className="w-5 h-5 text-teal-500" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate max-w-md">{site.url}</h3>
                </div>
                <div className="flex items-center gap-2">
                  {editingSiteId === site.id ? (
                    <button onClick={saveMetrics} className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg font-bold text-xs hover:bg-teal-600 transition-all">
                      <Save className="w-4 h-4" /> Save
                    </button>
                  ) : (
                    <button onClick={() => startEditing(site)} className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg font-bold text-xs hover:opacity-80 transition-all">
                      Edit Metrics
                    </button>
                  )}
                  <button onClick={() => deleteSite(site.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* AI SEO Metrics */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Brain className="w-4 h-4 text-purple-500" />
                    <h4 className="text-xs font-black uppercase tracking-widest text-gray-500">AI SEO (SGE) Metrics</h4>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <MetricCard 
                      label="Site Rank" 
                      value={editingSiteId === site.id ? editAiMetrics.siteRanking : site.aiMetrics.siteRanking} 
                      icon={<Search className="w-3 h-3" />}
                      isEditing={editingSiteId === site.id}
                      onChange={(val) => setEditAiMetrics({...editAiMetrics, siteRanking: val})}
                    />
                    <MetricCard 
                      label="Indexed" 
                      value={editingSiteId === site.id ? editAiMetrics.pagesIndexed : site.aiMetrics.pagesIndexed} 
                      icon={<Layers className="w-3 h-3" />}
                      isEditing={editingSiteId === site.id}
                      onChange={(val) => setEditAiMetrics({...editAiMetrics, pagesIndexed: val})}
                    />
                    <MetricCard 
                      label="Backtraces" 
                      value={editingSiteId === site.id ? editAiMetrics.backTraces : site.aiMetrics.backTraces} 
                      icon={<Link2 className="w-3 h-3" />}
                      isEditing={editingSiteId === site.id}
                      onChange={(val) => setEditAiMetrics({...editAiMetrics, backTraces: val})}
                    />
                    <MetricCard 
                      label="SoM (%)" 
                      value={editingSiteId === site.id ? editAiMetrics.som : site.aiMetrics.som} 
                      icon={<BarChart3 className="w-3 h-3" />}
                      isEditing={editingSiteId === site.id}
                      onChange={(val) => setEditAiMetrics({...editAiMetrics, som: val})}
                    />
                    <MetricCard 
                      label="Citation Rate" 
                      value={editingSiteId === site.id ? editAiMetrics.citationRate : site.aiMetrics.citationRate} 
                      icon={<Quote className="w-3 h-3" />}
                      isEditing={editingSiteId === site.id}
                      onChange={(val) => setEditAiMetrics({...editAiMetrics, citationRate: val})}
                    />
                    <MetricCard 
                      label="Entity Conf." 
                      value={editingSiteId === site.id ? editAiMetrics.entityConfidence : site.aiMetrics.entityConfidence} 
                      icon={<ShieldCheck className="w-3 h-3" />}
                      isEditing={editingSiteId === site.id}
                      onChange={(val) => setEditAiMetrics({...editAiMetrics, entityConfidence: val})}
                    />
                    <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                      <p className="text-[10px] font-bold text-gray-400 uppercase mb-1 flex items-center gap-1">
                        <Smile className="w-3 h-3" /> Sentiment
                      </p>
                      {editingSiteId === site.id ? (
                        <select 
                          value={editAiMetrics.sentiment}
                          onChange={(e) => setEditAiMetrics({...editAiMetrics, sentiment: e.target.value as any})}
                          className="w-full bg-transparent text-sm font-black dark:text-white outline-none"
                        >
                          <option value="Positive">Positive</option>
                          <option value="Neutral">Neutral</option>
                          <option value="Negative">Negative</option>
                        </select>
                      ) : (
                        <p className={`text-sm font-black ${site.aiMetrics.sentiment === 'Positive' ? 'text-emerald-500' : site.aiMetrics.sentiment === 'Negative' ? 'text-red-500' : 'text-gray-500'}`}>
                          {site.aiMetrics.sentiment}
                        </p>
                      )}
                    </div>
                    <MetricCard 
                      label="Info Gain" 
                      value={editingSiteId === site.id ? editAiMetrics.informationGain : site.aiMetrics.informationGain} 
                      icon={<Zap className="w-3 h-3" />}
                      isEditing={editingSiteId === site.id}
                      onChange={(val) => setEditAiMetrics({...editAiMetrics, informationGain: val})}
                    />
                  </div>
                </div>

                {/* Local SEO Metrics */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-4 h-4 text-orange-500" />
                    <h4 className="text-xs font-black uppercase tracking-widest text-gray-500">Local SEO (Geo) Metrics</h4>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <MetricCard 
                      label="Local Pack Rank" 
                      value={editingSiteId === site.id ? editLocalMetrics.localPackRanking : site.localMetrics.localPackRanking} 
                      icon={<MapPin className="w-3 h-3" />}
                      isEditing={editingSiteId === site.id}
                      onChange={(val) => setEditLocalMetrics({...editLocalMetrics, localPackRanking: val})}
                    />
                    <MetricCard 
                      label="Directions" 
                      value={editingSiteId === site.id ? editLocalMetrics.directionRequests : site.localMetrics.directionRequests} 
                      icon={<Zap className="w-3 h-3" />}
                      isEditing={editingSiteId === site.id}
                      onChange={(val) => setEditLocalMetrics({...editLocalMetrics, directionRequests: val})}
                    />
                    <MetricCard 
                      label="Review Vel." 
                      value={editingSiteId === site.id ? editLocalMetrics.reviewVelocity : site.localMetrics.reviewVelocity} 
                      icon={<BarChart3 className="w-3 h-3" />}
                      isEditing={editingSiteId === site.id}
                      onChange={(val) => setEditLocalMetrics({...editLocalMetrics, reviewVelocity: val})}
                    />
                    <MetricCard 
                      label="NAP Consist." 
                      value={editingSiteId === site.id ? editLocalMetrics.napConsistency : site.localMetrics.napConsistency} 
                      icon={<ShieldCheck className="w-3 h-3" />}
                      isEditing={editingSiteId === site.id}
                      onChange={(val) => setEditLocalMetrics({...editLocalMetrics, napConsistency: val})}
                    />
                    <MetricCard 
                      label="Geogrid Vis." 
                      value={editingSiteId === site.id ? editLocalMetrics.geogridVisibility : site.localMetrics.geogridVisibility} 
                      icon={<Layers className="w-3 h-3" />}
                      isEditing={editingSiteId === site.id}
                      onChange={(val) => setEditLocalMetrics({...editLocalMetrics, geogridVisibility: val})}
                    />
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

interface MetricCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  isEditing: boolean;
  onChange: (val: number) => void;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, icon, isEditing, onChange }) => (
  <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1 flex items-center gap-1">
      {icon} {label}
    </p>
    {isEditing ? (
      <input 
        type="number" 
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="w-full bg-transparent text-sm font-black dark:text-white outline-none"
      />
    ) : (
      <p className="text-sm font-black text-gray-900 dark:text-white">{value}</p>
    )}
  </div>
);
