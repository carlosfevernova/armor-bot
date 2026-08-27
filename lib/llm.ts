import { GoogleGenerativeAI, type GenerativeModel } from "@google/generative-ai";

let client: GoogleGenerativeAI | null = null;

export function getGemini(): GoogleGenerativeAI {
  if (!client) {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) throw new Error("GOOGLE_AI_API_KEY is missing");
    client = new GoogleGenerativeAI(apiKey);
  }
  return client;
}

/**
 * The model armor-bot uses to review PRs. Gemini 3.7 Flash by default —
 * free tier + 1M context + native structured output. Override with GEMINI_MODEL
 * env var (e.g., `gemini-3.7-pro` for higher quality on paid).
 */
export const DEFAULT_MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

/**
 * Build the model handle. We rebind per-request to pick up config changes cleanly.
 */
export function getReviewModel(): GenerativeModel {
  return getGemini().getGenerativeModel({
    model: DEFAULT_MODEL,
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.1,
      maxOutputTokens: 4096,
    },
  });
}
