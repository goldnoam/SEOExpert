
import React from 'react';
import { ABOUT_TEXT, LANGUAGES } from '../constants';
import { Theme } from '../types';
import { MoonIcon } from './icons/MoonIcon';
import { SunIcon } from './icons/SunIcon';
import { translations } from '../translations';

interface HeaderProps {
  theme: Theme;
  toggleTheme: () => void;
  language: string;
  onLanguageChange: (lang: string) => void;
  onAboutClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme, language, onLanguageChange, onAboutClick }) => {
  const t = translations[language] || translations['en'];

  return (
    <header className={`backdrop-blur-md sticky top-0 z-50 shadow-lg transition-all duration-300
      ${theme === Theme.Light ? 'bg-white/90 border-b border-gray-200' : ''}
      ${theme === Theme.Dark ? 'bg-gray-900/90 border-b border-gray-800' : ''}
      ${theme === Theme.Colorful ? 'bg-[#1e1b4b]/80 border-b border-white/10' : ''}
    `}>
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 rtl:flex-row-reverse">
          <div className="flex items-center">
            <span className={`font-black text-2xl tracking-tighter
              ${theme === Theme.Colorful ? 'bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-pink-400' : 'text-gray-900 dark:text-white'}
            `}>
              SEO<span className="text-teal-500">Expert</span>
            </span>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4 rtl:space-x-reverse">
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="bg-gray-100/50 dark:bg-gray-800/50 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg py-1.5 px-3 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none cursor-pointer transition-all hover:bg-white dark:hover:bg-gray-700"
              aria-label="Select language"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
            
            <button
              onClick={onAboutClick}
              className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-teal-500 transition-all active:scale-95"
              aria-label="About"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>

            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-teal-500 transition-all active:scale-95 group"
              aria-label="Toggle theme"
            >
                <div className="p-1.5 rounded-lg bg-white dark:bg-gray-900 shadow-sm transition-transform group-hover:rotate-12">
                    {theme === Theme.Light && <SunIcon />}
                    {theme === Theme.Dark && <MoonIcon />}
                    {theme === Theme.Colorful && (
                        <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
                    )}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">
                    {theme === Theme.Light && t.themeLight}
                    {theme === Theme.Dark && t.themeDark}
                    {theme === Theme.Colorful && t.themeColorful}
                </span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};
