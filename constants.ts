import { SubmissionSite } from './types';

export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'he', name: 'עברית' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'ja', name: '日本語' },
];

export const ABOUT_TEXT = "© NOAM GOLD AI 2025";

export const SUBMISSION_DELAY = 2000; // 2 seconds delay between URL submissions

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
    name: "Internet Archive",
    description: "Saves your page to the Wayback Machine.",
    urlTemplate: "https://web.archive.org/save/{URL}",
  },
  {
    name: "Moreover",
    description: "Notifies a wide range of news and blog aggregators.",
    urlTemplate: "https://api.moreover.com/ping?u={URL}",
  },
  {
    name: "Superfeedr",
    description: "A real-time hub for feed and content indexing.",
    urlTemplate: "https://superfeedr.com/hub/submit?hub.mode=publish&hub.url={URL}",
  },
  {
    name: "IndexKings",
    description: "Aggregates submissions to over 100 search engine directories.",
    urlTemplate: "https://www.indexkings.com/index.php?url={URL}",
  },
  {
    name: "PingFarm",
    description: "Mass ping service for multiple search and index directories.",
    urlTemplate: "https://www.pingfarm.com/index.php?url={URL}",
  },
  {
    name: "My Yahoo!",
    description: "Updates Yahoo's personalized content index via RSS ping.",
    urlTemplate: "https://my.yahoo.com/rss/ping?u={URL}",
  },
  {
    name: "Weblogs.com",
    description: "A popular ping service for blogs and websites.",
    urlTemplate: "https://rpc.weblogs.com/pingSiteForm?name={URL}&url={URL}",
  },
  {
    name: "FeedBurner",
    description: "Google's feed management ping service.",
    urlTemplate: "https://feedburner.google.com/fb/a/pingSubmit?bloglink={URL}",
  },
  {
    name: "Google Blog Search",
    description: "Notifies Google Blog Search of content updates.",
    urlTemplate: "https://blogsearch.google.com/ping?url={URL}",
  },
  {
    name: "Ping-O-Matic",
    description: "Service that pings multiple search engines.",
    urlTemplate: "https://pingomatic.com/ping/?title={URL}&blogurl={URL}&rssurl={URL}&chk_weblogscom=on&chk_blogs=on&chk_feedburner=on&chk_newsgator=on&chk_myyahoo=on&chk_pubsubcom=on&chk_blogdigger=on&chk_weblogalot=on&chk_newsisfree=on&chk_topicexchange=on&chk_google=on&chk_tailrank=on&chk_skygrid=on&chk_collecta=on&chk_superfeedr=on",
  },
  {
    name: "Twingly",
    description: "Major blog search engine and data provider.",
    urlTemplate: "https://rpc.twingly.com/ping?url={URL}",
  },
  {
    name: "Blo.gs",
    description: "A tracking service for weblog updates, managed by Automattic.",
    urlTemplate: "https://ping.blo.gs/?name={URL}&url={URL}",
  },
  {
    name: "Blogdigger",
    description: "Search engine specifically for weblogs and RSS feeds.",
    urlTemplate: "https://www.blogdigger.com/ping?url={URL}",
  },
  {
    name: "Gazzag",
    description: "Aggregator service that notifies social search engines.",
    urlTemplate: "https://gazzag.com/ping.php?url={URL}",
  },
  {
    name: "SkyGrid",
    description: "Real-time information stream that indexes web content.",
    urlTemplate: "https://skygrid.com/ping?url={URL}",
  },
];