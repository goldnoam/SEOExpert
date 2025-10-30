export enum Theme {
  Light = 'light',
  Dark = 'dark',
}

// FIX: Define and export the SubmissionSite interface, which was missing.
export interface SubmissionSite {
  name: string;
  description: string;
  urlTemplate: string;
}
