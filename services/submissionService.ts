import { getSubmissionSites } from './geminiService';

export const performSubmissions = async (url: string, logUpdateCallback: (message: string) => void): Promise<void> => {
  // FIX: Fetch submission sites dynamically from the Gemini API instead of using a hardcoded list.
  logUpdateCallback('Fetching submission sites from AI...\n');
  
  const submissionSites = await getSubmissionSites(url);

  if (!submissionSites || submissionSites.length === 0) {
      logUpdateCallback('Could not retrieve any submission sites from AI. Aborting.');
      return;
  }
  
  logUpdateCallback(`Found ${submissionSites.length} sites to ping. Starting submission process...\n`);
  
  const encodedUrl = encodeURIComponent(url);

  const promises = submissionSites.map(async (endpoint) => {
    // FIX: Use the urlTemplate from the dynamically fetched site data and validate it.
    if (!endpoint.urlTemplate || !endpoint.urlTemplate.includes('{URL}')) {
        logUpdateCallback(`  ⚠️ No valid submission URL for ${endpoint.name}. Skipping.`);
        return;
    }
    
    // FIX: Prevent "Mixed Content" errors by skipping insecure HTTP endpoints on a secure (HTTPS) page.
    if (window.location.protocol === 'https:' && endpoint.urlTemplate.startsWith('http://')) {
        logUpdateCallback(`  ⚠️ Skipping ${endpoint.name} (Insecure HTTP endpoint cannot be called from a secure page).`);
        return;
    }

    const submissionUrl = endpoint.urlTemplate.replace('{URL}', encodedUrl);

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

  logUpdateCallback('\nSubmission process completed.');
  logUpdateCallback('\nDisclaimer: Your URL has been submitted to public "ping" services. This asks search engines to crawl your site, but does not guarantee indexing. For best results, use Google Search Console and Bing Webmaster Tools.');
};