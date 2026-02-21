
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
