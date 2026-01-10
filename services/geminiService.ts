
import { GoogleGenAI, Type } from "@google/genai";
import { SubmissionSite } from '../types';

const getGenAIClient = () => {
  if (!process.env.API_KEY) {
    throw new Error(
      "API_KEY_MISSING: Your Gemini API key is not configured. Please ensure it is set up in your environment variables."
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
      throw new Error("EMPTY_RESPONSE: The AI returned an empty response.");
    }

    const parsedResponse = JSON.parse(jsonString);
    
    if (parsedResponse && Array.isArray(parsedResponse.sites)) {
        return parsedResponse.sites as SubmissionSite[];
    } else {
        throw new Error("INVALID_FORMAT: The AI response was not in the expected format.");
    }
  } catch (error: any) {
    console.error("Error calling Gemini API:", error);
    
    const errorMessage = error?.message || "";
    const lowerMessage = errorMessage.toLowerCase();
    
    if (errorMessage.startsWith('API_KEY_MISSING')) {
      throw error;
    }
    
    // Differentiate between common Gemini error codes
    if (errorMessage.includes("429") || lowerMessage.includes("quota") || lowerMessage.includes("rate limit")) {
      throw new Error("QUOTA_EXCEEDED: You've reached your Gemini API usage limit. Please wait a few minutes or switch to a paid plan.");
    }
    
    if (errorMessage.includes("403") || lowerMessage.includes("api key not valid") || lowerMessage.includes("unauthorized")) {
      throw new Error("INVALID_KEY: The Gemini API key provided is invalid or has expired. Please check your API key settings.");
    }

    if (errorMessage.includes("500") || errorMessage.includes("503") || lowerMessage.includes("internal error") || lowerMessage.includes("overloaded")) {
      throw new Error("SERVER_ERROR: Google's AI servers are currently experiencing issues or are overloaded. Please try again later.");
    }

    if (lowerMessage.includes("fetch")) {
      throw new Error("NETWORK_ERROR: Unable to reach Gemini servers. Please check your internet connection.");
    }

    throw new Error(`API_ERROR: Failed to connect to Gemini (${errorMessage}). Using local fallback list instead.`);
  }
};
