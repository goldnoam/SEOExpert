import { GoogleGenAI, Type } from "@google/genai";
import { SubmissionSite } from '../types';

// FIX: Initialize GoogleGenAI with apiKey from process.env as per guidelines, removing fallback and warning.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSubmissionSites = async (url: string): Promise<SubmissionSite[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      // FIX: Refined the prompt to request only HTTPS endpoints compatible with browser fetch to prevent CORS/network errors.
      contents: `Generate a list of the top 10-15 major search engine *programmatic ping services* for submitting a URL for indexing. The endpoints provided MUST be callable directly from a web browser's 'fetch' API in 'no-cors' mode.

For each service, provide its name, a brief one-sentence description, and the exact ping URL template. The template must be a direct API endpoint for automated submissions and contain '{URL}' as a placeholder for the URL to be submitted.

**Crucially, all endpoints MUST use the HTTPS protocol.** Do NOT include any HTTP URLs.
Endpoints should ideally respond to a simple GET request without requiring a request body or complex headers.
Do NOT include links to web pages, user dashboards, sitemap submission forms, or any URL that requires manual user interaction (e.g., Google Search Console, Bing Webmaster Tools). Only include machine-callable ping endpoints designed for this purpose.

A valid example is: 'https://www.google.com/ping?sitemap={URL}'.
An invalid example is: 'http://ping.baidu.com/ping/RPC2' (it uses HTTP).
An invalid example is: 'https://search.google.com/search-console' (it's a user webpage).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sites: {
              type: Type.ARRAY,
              description: "A list of SEO submission sites.",
              items: {
                type: Type.OBJECT,
                properties: {
                  name: {
                    type: Type.STRING,
                    description: "The name of the search engine or service.",
                  },
                  description: {
                    type: Type.STRING,
                    description: "A brief one-sentence description of the service.",
                  },
                  // FIX: Added urlTemplate to the schema to match the updated prompt.
                  urlTemplate: {
                    type: Type.STRING,
                    description: "The ping service URL template with a {URL} placeholder.",
                  },
                },
                required: ["name", "description", "urlTemplate"],
              },
            },
          },
          required: ["sites"],
        },
      },
    });

    const jsonString = response.text.trim();
    const parsedResponse = JSON.parse(jsonString);
    
    if (parsedResponse && Array.isArray(parsedResponse.sites)) {
        return parsedResponse.sites as SubmissionSite[];
    } else {
        throw new Error("Invalid JSON structure in API response.");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to communicate with the Gemini API. Please check the console for more details.");
  }
};