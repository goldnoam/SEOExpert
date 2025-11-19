import React from 'react';
import { translations } from '../translations';

interface FooterProps {
  language: string;
}

export const Footer: React.FC<FooterProps> = ({ language }) => {
  const t = translations[language] || translations['en'];

  return (
    <footer className="text-center p-4 mt-auto border-t border-gray-200 dark:border-gray-700">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        © NOAM GOLD AI 2025 |{' '}
        <a
          href="mailto:gold.noam@gmail.com?subject=SEOExpert%20Feedback"
          className="text-teal-600 dark:text-teal-400 hover:underline"
        >
          {t.sendFeedback}
        </a>
      </p>
    </footer>
  );
};
