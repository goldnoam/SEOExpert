
import { SUBMISSION_SITES } from '../constants';
import { SubmissionSite } from '../types';

export const performSubmissions = async (
  url: string, 
  logUpdateCallback: (message: string, site?: SubmissionSite) => void,
  onProgress?: (current: number, total: number, lastSiteName?: string) => void
): Promise<void> => {
  const submissionSites = SUBMISSION_SITES;

  if (submissionSites.length === 0) {
      logUpdateCallback('❌ Critical: No submission sites are available in the registry. Aborting.');
      if (onProgress) onProgress(0, 0);
      return;
  }
  
  const encodedUrl = encodeURIComponent(url);
  const validSites = submissionSites.filter(endpoint => endpoint.urlTemplate && endpoint.urlTemplate.includes('{URL}'));
  const totalSites = validSites.length;

  if (totalSites === 0) {
      logUpdateCallback('❌ Error: No valid submission templates found in the target list.');
      if (onProgress) onProgress(0, 0);
      return;
  }

  let completed = 0;
  if (onProgress) onProgress(0, totalSites);

  const CONCURRENCY_LIMIT = 20; // Process 20 sites at a time to avoid network congestion
  const chunks = [];
  for (let i = 0; i < validSites.length; i += CONCURRENCY_LIMIT) {
    chunks.push(validSites.slice(i, i + CONCURRENCY_LIMIT));
  }

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    
    // Add a small delay between chunks to prevent rate limiting
    if (i > 0) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    await Promise.all(chunk.map(async (endpoint) => {
      const submissionUrl = endpoint.urlTemplate.replace(/{URL}/g, encodedUrl);

      logUpdateCallback(`📡 Pinging indexer: ${endpoint.name}...`, endpoint);
      
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout for opaque responses

        await fetch(submissionUrl, { 
          mode: 'no-cors',
          cache: 'no-cache',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        logUpdateCallback(`  ✅ ${endpoint.name} notified successfully.`, endpoint);
      } catch (error: any) {
        let errorMsg = `  ❌ Transmission failed for ${endpoint.name}.`;
        
        if (error.name === 'AbortError') {
          errorMsg = `  ❌ ${endpoint.name} timed out. The server might be busy or filtering high-frequency pings.`;
        } else if (!navigator.onLine) {
          errorMsg = `  ❌ Network error: Your connection was lost. Submissions paused.`;
        } else {
          errorMsg = `  ❌ Connectivity issue with ${endpoint.name}: ${error.message || 'Service unreachable'}. Skipping...`;
        }
        
        logUpdateCallback(errorMsg, endpoint);
        console.error(`Error submitting to ${endpoint.name}:`, error);
      } finally {
          completed++;
          if (onProgress) onProgress(completed, totalSites, endpoint.name);
      }
    }));
  }
};
