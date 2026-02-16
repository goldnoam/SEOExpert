
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
    
    if (errorMessage.includes("429") || lowerMessage.includes("quota") || lowerMessage.includes("rate limit")) {
      throw new Error("QUOTA_EXCEEDED: You've reached your Gemini API usage limit.");
    }
    
    throw new Error(`API_ERROR: Failed to connect to Gemini. Using local fallback list instead.`);
  }
};
