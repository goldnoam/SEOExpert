
import React from 'react';
import { translations } from '../translations';

interface FooterProps {
  language: string;
}

export const Footer: React.FC<FooterProps> = ({ language }) => {
  const t = translations[language] || translations['en'];

  return (
    <footer className="text-center p-6 mt-auto border-t border-gray-200 dark:border-gray-700">
      <p className="text-sm text-gray-500 dark:text-gray-300">
        (C) Noam Gold AI 2026 |{' '}
        <a
          href="mailto:goldnoamai@gmail.com?subject=SEOExpert%20Feedback"
          className="text-teal-600 dark:text-teal-300 hover:underline font-medium"
        >
          Send Feedback: goldnoamai@gmail.com
        </a>
      </p>
    </footer>
  );
};
