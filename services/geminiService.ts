import { GoogleGenAI, Type } from "@google/genai";
import { SubmissionSite } from '../types';

// FIX: Initialize GoogleGenAI with apiKey from process.env as per guidelines, removing fallback and warning.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSubmissionSites = async (url: string): Promise<SubmissionSite[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      // FIX: Updated prompt to request for the ping service URL template.
      contents: `For the website URL '${url}', generate a list of the top 10 most important search engines and website indexing services where this URL should be submitted for SEO purposes. For each service, provide its name, a brief one-sentence description of its purpose, and the ping service URL template. The URL template should contain '{URL}' as a placeholder for the website URL to be submitted. For example: 'https://www.google.com/ping?sitemap={URL}'.`,
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
