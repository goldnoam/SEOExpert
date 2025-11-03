import { SUBMISSION_SITES } from '../constants';
import { SubmissionSite } from '../types';
import { getSubmissionSites } from './geminiService';

export const performSubmissions = async (url: string, logUpdateCallback: (message: string) => void): Promise<void> => {
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
      return;
  }
  
  const encodedUrl = encodeURIComponent(url);

  const promises = submissionSites.map(async (endpoint) => {
    if (!endpoint.urlTemplate || !endpoint.urlTemplate.includes('{URL}')) {
        logUpdateCallback(`  ⚠️ No valid submission URL for ${endpoint.name}. Skipping.`);
        return;
    }
    
    const submissionUrl = endpoint.urlTemplate.replace(/{URL}/g, encodedUrl);

    logUpdateCallback(`Pinging ${endpoint.name}...`);
    
    try {
      // Using 'no-cors' as we are pinging external services and don't need to read the response body.
      // This prevents Cross-Origin Resource Sharing (CORS) errors in the browser.
      // The request is "fire and forget".
      await fetch(submissionUrl, { mode: 'no-cors' });
      logUpdateCallback(`  ✅ Request sent to ${endpoint.name}.`);
    } catch (error) {
      logUpdateCallback(`  ❌ Failed to send request to ${endpoint.name}. See console for details.`);
      console.error(`Error submitting to ${endpoint.name}:`, error);
    }
  });

  await Promise.all(promises);
};