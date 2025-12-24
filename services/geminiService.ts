import { GoogleGenAI, Type } from "@google/genai";
import { SubmissionSite } from '../types';

const getGenAIClient = () => {
  if (!process.env.API_KEY) {
    throw new Error(
      "API_KEY_MISSING: Your Gemini API key is not configured. This might be due to a browser extension (like an ad-blocker) preventing it from loading. Please try disabling it for this site and refresh the page."
    );
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const getSubmissionSites = async (url: string): Promise<SubmissionSite[]> => {
  try {
    const ai = getGenAIClient();

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a list of the top 10-15 major search engine *programmatic ping services* for submitting a URL for indexing. The endpoints provided MUST be callable directly from a web browser's 'fetch' API in 'no-cors' mode.

For each service, provide its name, a brief one-sentence description, and the exact ping URL template. The template must be a direct API endpoint for automated submissions and contain '{URL}' as a placeholder for the URL to be submitted.

**Crucially, all endpoints MUST use the HTTPS protocol.** Do NOT include any HTTP URLs.
Endpoints should ideally respond to a simple GET request without requiring a request body or complex headers.
Do NOT include links to web pages, user dashboards, sitemap submission forms, or any URL that requires manual user interaction.

A valid example is: 'https://www.google.com/ping?sitemap={URL}'.`,
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

    const jsonString = response.text?.trim();
    if (!jsonString) {
      throw new Error("EMPTY_RESPONSE: The model returned an empty response.");
    }

    const parsedResponse = JSON.parse(jsonString);
    
    if (parsedResponse && Array.isArray(parsedResponse.sites)) {
        return parsedResponse.sites as SubmissionSite[];
    } else {
        throw new Error("INVALID_FORMAT: Invalid JSON structure in API response.");
    }
  } catch (error: any) {
    console.error("Error calling Gemini API:", error);
    
    // Map API error messages to user-friendly strings
    const errorMessage = error?.message || "";
    
    if (errorMessage.startsWith('API_KEY_MISSING')) {
      throw error;
    }
    
    // Check for common status codes or phrases in the error message
    if (errorMessage.includes("429") || errorMessage.toLowerCase().includes("quota exceeded") || errorMessage.toLowerCase().includes("rate limit")) {
      throw new Error("QUOTA_EXCEEDED: You've reached the free tier usage limit. Please wait a few minutes before trying again or use a paid API key.");
    }
    
    if (errorMessage.includes("403") || errorMessage.toLowerCase().includes("api key not valid") || errorMessage.toLowerCase().includes("unauthorized")) {
      throw new Error("INVALID_KEY: The API key is either invalid, expired, or doesn't have permissions for the Gemini service. Please check your configuration.");
    }

    if (errorMessage.includes("500") || errorMessage.includes("503") || errorMessage.toLowerCase().includes("internal error") || errorMessage.toLowerCase().includes("service unavailable")) {
      throw new Error("SERVER_ERROR: Google's AI servers are currently under high load or maintenance. Please try again in a few moments.");
    }

    if (errorMessage.toLowerCase().includes("fetch")) {
      throw new Error("NETWORK_ERROR: Could not reach the AI service. Please check your internet connection or browser security settings.");
    }

    throw new Error(`API_ERROR: An unexpected error occurred while communicating with Gemini (${errorMessage}). We will use the local backup list.`);
  }
};