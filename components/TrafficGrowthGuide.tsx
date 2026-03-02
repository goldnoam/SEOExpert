import React from 'react';
import { TRAFFIC_GROWTH_STEPS } from '../constants';
import { translations } from '../translations';

interface TrafficGrowthGuideProps {
  language: string;
}

export const TrafficGrowthGuide: React.FC<TrafficGrowthGuideProps> = ({ language }) => {
  const t = translations[language] || translations['en'];

  return (
    <section className="mt-12 mb-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
          🚀 One-Stop Traffic <span className="text-teal-500">Growth Guide</span>
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Submitting your URL is just the beginning. Follow these essential steps to build sustainable traffic and authority for your website.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TRAFFIC_GROWTH_STEPS.map((step, index) => (
          <div 
            key={index} 
            className="group bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl hover:border-teal-500/30 transition-all duration-300 flex flex-col"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                {step.icon}
              </div>
              <h3 className="font-black text-lg text-gray-800 dark:text-gray-100 leading-tight">
                {step.title}
              </h3>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 flex-grow">
              {step.description}
            </p>

            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-teal-600 dark:text-teal-400">Pro Tips:</p>
              <ul className="space-y-1.5">
                {step.tips.map((tip, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-300">
                    <span className="w-1 h-1 rounded-full bg-teal-500"></span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 p-8 rounded-3xl bg-gradient-to-br from-teal-500 to-teal-700 text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-black mb-2">Ready for the next level?</h3>
            <p className="text-teal-50 opacity-90 max-w-md">
              Combine these strategies with regular URL submissions to see exponential growth in your search visibility.
            </p>
          </div>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-8 py-4 bg-white text-teal-600 font-black uppercase tracking-widest text-sm rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            Start Submitting Now
          </button>
        </div>
      </div>
    </section>
  );
};
