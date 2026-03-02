import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, List, Check, Copy, ExternalLink, Globe } from 'lucide-react';

interface PingList {
  id: string;
  name: string;
  urls: string;
  lastUsed?: number;
}

interface PingManagerProps {
  onSelectUrls: (urls: string) => void;
  currentUrls: string;
}

export const PingManager: React.FC<PingManagerProps> = ({ onSelectUrls, currentUrls }) => {
  const [lists, setLists] = useState<PingList[]>(() => {
    try {
      const saved = localStorage.getItem('seoexpert_ping_lists');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [newListName, setNewListName] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    localStorage.setItem('seoexpert_ping_lists', JSON.stringify(lists));
  }, [lists]);

  const saveCurrentAsList = () => {
    if (!newListName.trim() || !currentUrls.trim()) return;
    
    const newList: PingList = {
      id: Math.random().toString(36).substr(2, 9),
      name: newListName.trim(),
      urls: currentUrls,
    };
    
    setLists([newList, ...lists]);
    setNewListName('');
    setShowAdd(false);
  };

  const deleteList = (id: string) => {
    if (confirm('Are you sure you want to delete this ping list?')) {
      setLists(lists.filter(l => l.id !== id));
    }
  };

  const selectList = (list: PingList) => {
    onSelectUrls(list.urls);
    setLists(lists.map(l => l.id === list.id ? { ...l, lastUsed: Date.now() } : l));
  };

  return (
    <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <List className="w-4 h-4 text-teal-500" />
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">Ping List Manager</h3>
        </div>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="text-[10px] font-bold text-teal-500 hover:underline uppercase tracking-widest"
        >
          {showAdd ? 'Cancel' : 'Save Current as List'}
        </button>
      </div>

      {showAdd && (
        <div className="mb-4 flex gap-2 animate-fade-in">
          <input 
            type="text" 
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="List Name (e.g. My 100 Search Engines)"
            className="flex-grow px-3 py-1.5 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 dark:text-white"
          />
          <button 
            onClick={saveCurrentAsList}
            className="px-3 py-1.5 bg-teal-500 text-white rounded-lg font-bold text-xs hover:bg-teal-600 transition-all"
          >
            Save
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {lists.length === 0 ? (
          <p className="text-[10px] text-gray-400 italic col-span-full">No saved lists. Enter URLs in the custom ping box and save them here.</p>
        ) : (
          lists.map((list) => (
            <div 
              key={list.id} 
              className={`p-3 rounded-xl border transition-all cursor-pointer group flex items-center justify-between
                ${currentUrls === list.urls 
                  ? 'bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-900/50' 
                  : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-teal-200 dark:hover:border-teal-900/30'}
              `}
              onClick={() => selectList(list)}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                {currentUrls === list.urls ? (
                  <Check className="w-3 h-3 text-teal-500 shrink-0" />
                ) : (
                  <Globe className="w-3 h-3 text-gray-400 shrink-0" />
                )}
                <div className="truncate">
                  <p className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">{list.name}</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">{list.urls.split('\n').filter(Boolean).length} URLs</p>
                </div>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  deleteList(list.id);
                }}
                className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
