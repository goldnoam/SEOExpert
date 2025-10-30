import { SubmissionSite } from './types';

export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'he', name: 'עברית' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'ja', name: '日本語' },
];

export const ABOUT_TEXT = "SEO Expert designed by Noam Gold 2025";

export const SUBMISSION_SITES: SubmissionSite[] = [
  {
    name: "Google",
    description: "Google's official sitemap ping service.",
    urlTemplate: "https://www.google.com/ping?sitemap={URL}",
  },
  {
    name: "Bing & Yahoo!",
    description: "Bing's service also notifies Yahoo!",
    urlTemplate: "https://www.bing.com/ping?sitemap={URL}",
  },
  {
    name: "Yandex",
    description: "Ping service for the Yandex search engine.",
    urlTemplate: "https://webmaster.yandex.com/ping.xml?sitemap={URL}",
  },
  {
    name: "Seznam.cz",
    description: "Ping service for the Czech search engine.",
    urlTemplate: "https://search.seznam.cz/ping?sitemap={URL}",
  },
  {
    name: "Weblogs.com",
    description: "A popular ping service for blogs and websites.",
    urlTemplate: "https://rpc.weblogs.com/pingSiteForm?name={URL}&url={URL}",
  },
];