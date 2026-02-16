
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
    logUpdateCallback('🔍 Discovery: Fetching dynamic submission endpoints via Gemini AI...');
    submissionSites = await getSubmissionSites(url);
    logUpdateCallback(`✨ Success: Gemini found ${submissionSites.length} custom endpoints for this URL.`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    
    // Provide specific guidance based on error type
    if (errorMessage.includes('QUOTA_EXCEEDED')) {
        logUpdateCallback('📈 Status: AI Rate Limit reached. Activating built-in high-capacity pinger...');
    } else if (errorMessage.includes('AUTHENTICATION_ERROR')) {
        logUpdateCallback('⚠️ Auth Alert: Invalid API Key. Please verify settings. Defaulting to local engines...');
    } else if (errorMessage.includes('API_KEY_MISSING')) {
        logUpdateCallback('💡 Info: API Key not detected. Running submission using local high-performance database...');
    } else {
        logUpdateCallback(`🔄 Info: ${errorMessage}. Falling back to our local list...`);
    }

    submissionSites = SUBMISSION_SITES;
  }

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

  // Use a pool of promises to avoid hitting too many sites at once if needed, 
  // but here we keep the parallel logic for speed as they are no-cors pings.
  const promises = validSites.map(async (endpoint) => {
    const submissionUrl = endpoint.urlTemplate.replace(/{URL}/g, encodedUrl);

    logUpdateCallback(`📡 Pinging indexer: ${endpoint.name}...`, endpoint);
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout for opaque responses

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
  });

  await Promise.all(promises);
};
