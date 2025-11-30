
export enum Theme {
  Light = 'light',
  Dark = 'dark',
}

export interface SubmissionSite {
  name: string;
  description: string;
  urlTemplate: string;
}

export type SubmissionStatus = 'pending' | 'processing' | 'success' | 'failed';

export interface SubmissionItem {
  id: string;
  url: string;
  status: SubmissionStatus;
  progress: number;
}

export interface LogEntry {
  id: string;
  timestamp: number;
  message: string;
  siteDescription?: string;
}
