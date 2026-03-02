import { GoogleGenAI, Type } from "@google/genai";
import { AISEOMetrics, LocalSEOMetrics } from "../types";

let aiInstance: GoogleGenAI | null = null;

const getAiInstance = () => {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set. AI features are unavailable.");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
};

export interface SEOAnalysisResult {
  aiMetrics: AISEOMetrics;
  localMetrics: LocalSEOMetrics;
}

export const analyzeUrlWithGemini = async (url: string): Promise<SEOAnalysisResult> => {
  try {
    const ai = getAiInstance();
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
// ... rest of the file ...
      contents: `Analyze the following URL for SEO and AI search performance metrics: ${url}. 
      Provide realistic estimates for the following metrics in JSON format.
      
      AI SEO Metrics:
      - siteRanking (1-100)
      - pagesIndexed (integer)
      - backTraces (integer)
      - som (Share of Model, 0-100)
      - citationRate (0-100)
      - entityConfidence (0-100)
      - sentiment (Positive, Neutral, or Negative)
      - informationGain (0-100)
      
      Local SEO Metrics:
      - localPackRanking (1-100)
      - directionRequests (integer)
      - reviewVelocity (integer)
      - napConsistency (0-100)
      - geogridVisibility (0-100)`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            aiMetrics: {
              type: Type.OBJECT,
              properties: {
                siteRanking: { type: Type.NUMBER },
                pagesIndexed: { type: Type.INTEGER },
                backTraces: { type: Type.INTEGER },
                som: { type: Type.NUMBER },
                citationRate: { type: Type.NUMBER },
                entityConfidence: { type: Type.NUMBER },
                sentiment: { type: Type.STRING },
                informationGain: { type: Type.NUMBER },
              },
              required: ["siteRanking", "pagesIndexed", "backTraces", "som", "citationRate", "entityConfidence", "sentiment", "informationGain"],
            },
            localMetrics: {
              type: Type.OBJECT,
              properties: {
                localPackRanking: { type: Type.NUMBER },
                directionRequests: { type: Type.INTEGER },
                reviewVelocity: { type: Type.INTEGER },
                napConsistency: { type: Type.NUMBER },
                geogridVisibility: { type: Type.NUMBER },
              },
              required: ["localPackRanking", "directionRequests", "reviewVelocity", "napConsistency", "geogridVisibility"],
            },
          },
          required: ["aiMetrics", "localMetrics"],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    return result as SEOAnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};
