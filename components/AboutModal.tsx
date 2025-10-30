// FIX: Implement the AboutModal component.
import React from 'react';
import { ABOUT_TEXT } from '../constants';
import { translations } from '../translations';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: string;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, language }) => {
  const t = translations[language] || translations['en'];

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 relative"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <h2 className="text-2xl font-bold mb-4 rtl:text-right">{t.aboutModalTitle}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6 rtl:text-right">{ABOUT_TEXT}</p>
        <button
          onClick={onClose}
          className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          aria-label={t.closeButton}
        >
          {t.closeButton}
        </button>
      </div>
    </div>
  );
};