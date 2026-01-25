
import { SUBMISSION_SITES } from '../constants';
import { SubmissionSite } from '../types';
import { getSubmissionSites } from './geminiService';

export const performSubmissions = async (
  url: string, 
  logUpdateCallback: (message: string, site?: SubmissionSite) => void,
  onProgress?: (current: number, total: number, lastSiteName?: string) => void
): Promise<void> => {
  let submissionSites: SubmissionSite[] = [];
  
  try {
    logUpdateCallback('Fetching an up-to-date list of submission sites using the Gemini API...');
    submissionSites = await getSubmissionSites(url);
    logUpdateCallback(`✅ Successfully fetched ${submissionSites.length} sites from the API.`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    logUpdateCallback(`❌ Failed to fetch list from Gemini API: ${errorMessage}`);
    logUpdateCallback('Falling back to the built-in list of submission sites...');
    submissionSites = SUBMISSION_SITES;
  }

  if (submissionSites.length === 0) {
      logUpdateCallback('No submission sites are available. Aborting.');
      if (onProgress) onProgress(0, 0);
      return;
  }
  
  const encodedUrl = encodeURIComponent(url);
  const validSites = submissionSites.filter(endpoint => endpoint.urlTemplate && endpoint.urlTemplate.includes('{URL}'));
  const totalSites = validSites.length;

  if (totalSites === 0) {
      logUpdateCallback('No valid submission templates found.');
      if (onProgress) onProgress(0, 0);
      return;
  }

  let completed = 0;
  if (onProgress) onProgress(0, totalSites);

  const promises = validSites.map(async (endpoint) => {
    const submissionUrl = endpoint.urlTemplate.replace(/{URL}/g, encodedUrl);

    logUpdateCallback(`Pinging ${endpoint.name}...`, endpoint);
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout for opaque responses

      await fetch(submissionUrl, { 
        mode: 'no-cors',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      logUpdateCallback(`  ✅ Request successfully sent to ${endpoint.name}.`, endpoint);
    } catch (error: any) {
      let errorMsg = `  ❌ Failed to send request to ${endpoint.name}.`;
      
      if (error.name === 'AbortError') {
        errorMsg = `  ❌ Request to ${endpoint.name} timed out. The server might be slow or unresponsive.`;
      } else if (!navigator.onLine) {
        errorMsg = `  ❌ Network error: Your device seems to be offline.`;
      } else {
        errorMsg = `  ❌ Connection error to ${endpoint.name}: ${error.message || 'The service might be temporarily down'}.`;
      }
      
      logUpdateCallback(errorMsg, endpoint);
      console.error(`Error submitting to ${endpoint.name}:`, error);
    } finally {
        completed++;
        if (onProgress) onProgress(completed, totalSites, endpoint.name);
    }
  });

  await Promise.all(promises);
};