import { GoogleGenAI, Type } from "@google/genai";
import { SubmissionSite } from '../types';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. Using a placeholder key. Please provide your own key.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'YOUR_API_KEY_HERE' });

export const getSubmissionSites = async (url: string): Promise<SubmissionSite[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `For the website URL '${url}', generate a list of the top 10 most important search engines and website indexing services where this URL should be submitted for SEO purposes. For each service, provide its name and a brief, one-sentence description of its purpose.`,
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
                },
                required: ["name", "description"],
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
