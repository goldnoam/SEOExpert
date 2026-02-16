
import { GoogleGenAI, Type } from "@google/genai";
import { SubmissionSite } from '../types';

const getGenAIClient = () => {
  if (!process.env.API_KEY) {
    throw new Error(
      "API_KEY_MISSING: Your Gemini API key is not configured. Please ensure it is set up in your environment variables to enable dynamic site discovery."
    );
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const getSubmissionSites = async (url: string): Promise<SubmissionSite[]> => {
  try {
    const ai = getGenAIClient();

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a highly comprehensive list of the top 25-30 major search engine *programmatic ping services* or indexing endpoints for submitting a URL for SEO. 

The endpoints provided MUST be callable directly from a web browser using 'fetch' in 'no-cors' mode.
For each service, provide:
1. 'name': The name of the search engine or service.
2. 'description': A brief one-sentence explanation of its SEO value.
3. 'urlTemplate': The direct HTTPS API ping URL containing '{URL}' as a placeholder.

**Rules:**
- ONLY include HTTPS endpoints.
- NO manual forms or HTML pages.
- Focus on global search engines (Google, Bing, Baidu, Yandex, etc.), major blog aggregators, and real-time indexing hubs.
- Ensure the list is as diverse as possible to maximize indexing speed across different regions.

A valid example is: 'https://www.google.com/ping?sitemap={URL}'.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sites: {
              type: Type.ARRAY,
              description: "A large list of SEO submission sites.",
              items: {
                type: Type.OBJECT,
                properties: {
                  name: {
                    type: Type.STRING,
                    description: "The name of the service.",
                  },
                  description: {
                    type: Type.STRING,
                    description: "What the service does.",
                  },
                  urlTemplate: {
                    type: Type.STRING,
                    description: "The ping URL with {URL} placeholder.",
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
      throw new Error("EMPTY_RESPONSE: The AI returned an empty response. This might be a temporary glitch.");
    }

    const parsedResponse = JSON.parse(jsonString);
    
    if (parsedResponse && Array.isArray(parsedResponse.sites)) {
        return parsedResponse.sites as SubmissionSite[];
    } else {
        throw new Error("INVALID_FORMAT: The AI response was not in the expected JSON format.");
    }
  } catch (error: any) {
    console.error("Error calling Gemini API:", error);
    
    const errorMessage = error?.message || "";
    const lowerMessage = errorMessage.toLowerCase();
    
    if (errorMessage.startsWith('API_KEY_MISSING')) {
      throw error;
    }

    // Handle Authentication Errors (401/403)
    if (lowerMessage.includes("401") || lowerMessage.includes("403") || lowerMessage.includes("unauthorized") || lowerMessage.includes("invalid api key")) {
        throw new Error("AUTHENTICATION_ERROR: Your Gemini API key appears to be invalid or expired. Please check your credentials in the environment settings.");
    }
    
    // Handle Rate Limiting (429)
    if (errorMessage.includes("429") || lowerMessage.includes("quota") || lowerMessage.includes("rate limit")) {
      throw new Error("QUOTA_EXCEEDED: Gemini API rate limit reached. We'll automatically switch to our built-in backup list of 215+ engines to keep things moving.");
    }

    // Handle Safety Filters
    if (lowerMessage.includes("safety") || lowerMessage.includes("blocked")) {
        throw new Error("SAFETY_BLOCKED: The request was blocked by Gemini's safety filters. Using local fallback list instead.");
    }
    
    throw new Error(`API_ERROR: Failed to connect to Gemini. Don't worry, we're using our high-performance local backup list instead.`);
  }
};
