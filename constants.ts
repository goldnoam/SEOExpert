
import { SubmissionSite } from './types';

export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'he', name: 'עברית' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'ja', name: '日本語' },
];

export const ABOUT_TEXT = "© NOAM GOLD AI 2026";

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
  {
    name: "Technorati",
    description: "The leading search engine for blogs.",
    urlTemplate: "https://technorati.com/ping?url={URL}",
  },
  {
    name: "Newsisfree",
    description: "A personalized news aggregator service.",
    urlTemplate: "https://newsisfree.com/ping.php?url={URL}",
  },
  {
    name: "PubSub.com",
    description: "Real-time search and monitoring service.",
    urlTemplate: "https://www.pubsub.com/ping?url={URL}",
  },
  {
    name: "Topic Exchange",
    description: "Topic-based blog aggregator.",
    urlTemplate: "https://topicexchange.com/ping?url={URL}",
  },
  {
    name: "Tailrank",
    description: "Real-time news filtering and aggregation.",
    urlTemplate: "https://tailrank.com/ping?url={URL}",
  },
  {
    name: "Weblogalot",
    description: "Blog tracking and monitoring service.",
    urlTemplate: "https://www.weblogalot.com/ping?url={URL}",
  },
  {
    name: "FocusLook",
    description: "Content discovery and indexing service.",
    urlTemplate: "https://focuslook.com/ping?url={URL}",
  },
  {
    name: "Syndic8",
    description: "The premier portal for XML-based content syndication.",
    urlTemplate: "https://www.syndic8.com/ping.php?url={URL}",
  },
  {
    name: "Blogvibe",
    description: "Social networking and discovery for bloggers.",
    urlTemplate: "https://blogvibe.com/ping?url={URL}",
  },
  {
    name: "Bitacoras",
    description: "Leading Spanish-language blog aggregator.",
    urlTemplate: "https://bitacoras.com/ping?url={URL}",
  },
  {
    name: "Pingler",
    description: "Popular web-based service to alert search engines of site updates.",
    urlTemplate: "https://pingler.com/ping/?title={URL}&url={URL}",
  },
  {
    name: "TotalPing",
    description: "A free service that notifies numerous search engines simultaneously.",
    urlTemplate: "http://totalping.com/ping?url={URL}",
  },
  {
    name: "PingMyLinks",
    description: "Automated submission tool for various web directories.",
    urlTemplate: "http://pingmylinks.com/ping?url={URL}",
  },
  {
    name: "Prepostseo Ping",
    description: "An SEO tool provider that offers efficient website pinging.",
    urlTemplate: "https://www.prepostseo.com/ping-website-tool?url={URL}",
  },
  {
    name: "GIGABlast",
    description: "Open-source search engine providing content indexing pings.",
    urlTemplate: "https://www.gigablast.com/addurl?url={URL}",
  },
  {
    name: "Entireweb",
    description: "Independent search engine that allows manual and automated URL pings.",
    urlTemplate: "https://www.entireweb.com/free_submission/?url={URL}",
  },
  {
    name: "Active Search Results",
    description: "An Internet search engine and directory featuring automated pings.",
    urlTemplate: "https://www.activesearchresults.com/addsearch.php?url={URL}",
  },
  {
    name: "ExactSeek",
    description: "Comprehensive search engine directory for web submissions.",
    urlTemplate: "https://www.exactseek.com/add.adp?url={URL}",
  },
  {
    name: "PingBomb",
    description: "Massive ping service for blogs and websites.",
    urlTemplate: "http://pingbomb.com/ping?url={URL}",
  },
  {
    name: "Krozilo",
    description: "Niche content aggregator and ping provider.",
    urlTemplate: "http://krozilo.com/ping?url={URL}",
  },
  {
    name: "Feedshark",
    description: "Free online tool to ping your blog, website or RSS feed to multiple search engines.",
    urlTemplate: "https://feedshark.brainbliss.com/ping?url={URL}",
  },
  {
    name: "Ping.in",
    description: "A service that helps you to ping your blog to different blog directories.",
    urlTemplate: "http://ping.in/ping.php?url={URL}",
  },
  {
    name: "Useping",
    description: "Simple and effective ping service for fast indexing.",
    urlTemplate: "https://useping.com/ping?url={URL}",
  },
  {
    name: "LinkCentaur",
    description: "Automated backlink indexing and pinging service.",
    urlTemplate: "https://www.linkcentaur.com/ping?url={URL}",
  },
  {
    name: "Colinkri",
    description: "Next generation indexing tool for web URLs.",
    urlTemplate: "https://colinkri.com/ping?url={URL}",
  },
  {
    name: "OneHourIndexing",
    description: "High-speed URL indexing and notification service.",
    urlTemplate: "https://onehourindexing.co/ping?url={URL}",
  },
  {
    name: "Backlinkr",
    description: "Automated search engine notification for new backlinks.",
    urlTemplate: "https://backlinkr.net/ping?url={URL}",
  },
  {
    name: "PingMyUrl",
    description: "Submit your URL to multiple search engines with one click.",
    urlTemplate: "http://pingmyurl.com/ping?url={URL}",
  },
  {
    name: "BulkPing",
    description: "Mass ping tool for multiple URLs and search engines.",
    urlTemplate: "https://bulkping.com/ping-tool?url={URL}",
  },
  {
    name: "SmallSEOTools Ping",
    description: "Comprehensive online tool to ping websites for search engine recognition.",
    urlTemplate: "https://smallseotools.com/online-ping-website-tool/ping?url={URL}",
  },
  {
    name: "Pingler Pro",
    description: "Professional grade notification for search indexers.",
    urlTemplate: "https://pingler.com/ping/?title=SiteUpdate&url={URL}",
  },
  {
    name: "Ping.fm",
    description: "Content distribution and pinging notification service.",
    urlTemplate: "http://ping.fm/ping/?url={URL}",
  },
  {
    name: "AutoPing",
    description: "Automated site recognition and indexing utility.",
    urlTemplate: "https://autoping.com/submit?url={URL}",
  },
  {
    name: "FastIndexing",
    description: "Proprietary algorithm for fast crawler notification.",
    urlTemplate: "https://fastindexing.com/api/ping?url={URL}",
  },
  {
    name: "LinkBox",
    description: "Backlink monitoring and automated indexing service.",
    urlTemplate: "https://linkbox.pro/ping?url={URL}",
  },
  {
    name: "GSA Indexer",
    description: "High-performance search engine submission tool.",
    urlTemplate: "https://gsa-online.de/indexer/ping?url={URL}",
  },
  {
    name: "Omega Indexer",
    description: "Cloud-based indexing solution with ping support.",
    urlTemplate: "https://omegaindexer.com/api/ping?url={URL}",
  },
  {
    name: "Elite Linker",
    description: "Premium backlink indexing and pinging utility.",
    urlTemplate: "https://elitelinker.com/ping?url={URL}",
  },
  {
    name: "Indexification",
    description: "Reliable indexing service for bulk URL processing.",
    urlTemplate: "https://www.indexification.com/ping?url={URL}",
  },
  {
    name: "LinkProcessor",
    description: "Automated indexing and search engine pinging.",
    urlTemplate: "https://linkprocessor.com/ping?url={URL}",
  },
  {
    name: "PingCloud",
    description: "Distributed ping network for global search engine notification.",
    urlTemplate: "https://pingcloud.org/ping?url={URL}",
  },
  {
    name: "BlogFlux",
    description: "Wide-reaching blog directory and update notification service.",
    urlTemplate: "http://blogflux.com/ping?url={URL}",
  },
  {
    name: "FeedPinger",
    description: "Specialized service to notify RSS aggregators of site changes.",
    urlTemplate: "https://feedpinger.com/ping?url={URL}",
  },
  {
    name: "SEOBox",
    description: "Integrated SEO toolkit offering mass search engine pings.",
    urlTemplate: "https://seobox.com/ping?url={URL}",
  },
  {
    name: "IndexNow",
    description: "Open protocol for immediate search engine indexing notification.",
    urlTemplate: "https://api.indexnow.org/indexnow?url={URL}",
  },
  {
    name: "LinkSentry",
    description: "Automated monitoring and search engine update utility.",
    urlTemplate: "https://linksentry.com/ping?url={URL}",
  },
  {
    name: "SiteSubmitter",
    description: "Comprehensive submission tool for search engines and directories.",
    urlTemplate: "https://sitesubmitter.net/ping?url={URL}",
  },
  {
    name: "GlobalIndex",
    description: "High-speed notification service for global search indexes.",
    urlTemplate: "https://globalindex.org/ping?url={URL}",
  },
  {
    name: "RSSPinger",
    description: "Focuses on notifying major RSS directories of feed updates.",
    urlTemplate: "https://rsspinger.com/ping?url={URL}",
  },
  {
    name: "BlogRank",
    description: "Indexes and pings top-tier blog search results and directories.",
    urlTemplate: "https://blogrank.com/ping?url={URL}",
  },
  {
    name: "Ping.eu Sitemap",
    description: "Professional sitemap crawler and search engine notifier.",
    urlTemplate: "https://ping.eu/ping?url={URL}",
  },
  {
    name: "Baidu RPC Ping",
    description: "Official programmatic update service for Baidu Search.",
    urlTemplate: "https://ping.baidu.com/ping/rpc2?url={URL}",
  },
  {
    name: "Naver Search Advisor",
    description: "Direct notification endpoint for the Naver search index.",
    urlTemplate: "https://searchadvisor.naver.com/ping?url={URL}",
  },
  {
    name: "Sogou Feedback Ping",
    description: "Alerts the Sogou search engine of new web content.",
    urlTemplate: "https://www.sogou.com/feedback/ping?url={URL}",
  },
  {
    name: "Crawler Center",
    description: "Aggregates crawling requests for multiple data providers.",
    urlTemplate: "https://crawlercenter.com/ping?url={URL}",
  },
  {
    name: "Index Boom",
    description: "High-priority indexing notification for search crawlers.",
    urlTemplate: "https://indexboom.com/ping?url={URL}",
  },
  {
    name: "Bot Notify",
    description: "Pings various bot networks to initiate immediate crawls.",
    urlTemplate: "https://botnotify.net/ping?url={URL}",
  },
  {
    name: "Traffic Ping",
    description: "Notifies search engines and traffic aggregators of site updates.",
    urlTemplate: "https://trafficping.com/api/ping?url={URL}",
  },
  {
    name: "Global Indexing Network",
    description: "A wide-reaching network for global search engine alerts.",
    urlTemplate: "https://globalindexing.net/ping?url={URL}",
  },
  {
    name: "SEO Spider Notification",
    description: "Simulates bot activity to trigger natural crawling cycles.",
    urlTemplate: "https://seospider.com/ping?url={URL}",
  },
];
