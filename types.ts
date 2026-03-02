
export enum Theme {
  Light = 'light',
  Dark = 'dark',
  Colorful = 'colorful',
}

export interface SubmissionSite {
  name: string;
  description: string;
  urlTemplate: string;
  quality?: 'High' | 'Medium' | 'Standard';
}

export type SubmissionStatus = 'pending' | 'processing' | 'success' | 'failed';

export interface SubmissionItem {
  id: string;
  url: string;
  status: SubmissionStatus;
  progress: number;
  completedServices?: number;
  totalServices?: number;
  lastServicePinger?: string;
  favicon?: string;
}

export interface LogEntry {
  id: string;
  timestamp: number;
  message: string;
  siteDescription?: string;
  urlFavicon?: string;
}

export interface RankHistoryEntry {
  timestamp: number;
  rank: number;
}

export interface TrackedKeyword {
  id: string;
  keyword: string;
  domain: string;
  history: RankHistoryEntry[];
  lastChecked?: number;
}

export interface AISEOMetrics {
  siteRanking: number;
  pagesIndexed: number;
  backTraces: number;
  som: number; // Share of Model
  citationRate: number;
  entityConfidence: number;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  informationGain: number;
}

export interface LocalSEOMetrics {
  localPackRanking: number;
  directionRequests: number;
  reviewVelocity: number;
  napConsistency: number;
  geogridVisibility: number;
}

export interface AdvancedSEOSite {
  id: string;
  url: string;
  aiMetrics: AISEOMetrics;
  localMetrics: LocalSEOMetrics;
  lastUpdated: number;
}
