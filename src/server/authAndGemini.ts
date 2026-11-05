import { GoogleGenAI, Type } from "@google/genai";
import firebaseConfig from "../../firebase-applet-config.json";

export const SHARED_FIREBASE_KEY = firebaseConfig.apiKey;

export interface VerifiedSession {
  uid: string;
  email?: string;
}

/**
 * Verifies the incoming Firebase ID token against Google Identity Toolkit.
 * Derives verified customer UID directly from the identity assertion.
 */
export async function verifyFirebaseToken(authHeader?: string): Promise<VerifiedSession> {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const error: any = new Error("Missing or malformed Authorization header with Bearer token.");
    error.statusCode = 401;
    throw error;
  }

  const idToken = authHeader.substring(7).trim();
  if (!idToken) {
    const error: any = new Error("Missing Firebase ID token in Authorization header.");
    error.statusCode = 401;
    throw error;
  }

  const apiKey = firebaseConfig.apiKey;
  const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const message = errorData?.error?.message || "Invalid or expired Firebase authentication token.";
    const error: any = new Error(`Authentication failed: ${message}`);
    error.statusCode = 401;
    throw error;
  }

  const data = await res.json();
  const user = data.users?.[0];
  if (!user || !user.localId) {
    const error: any = new Error("Unable to derive user identity from Firebase token.");
    error.statusCode = 401;
    throw error;
  }

  return {
    uid: user.localId,
    email: user.email,
  };
}

/**
 * Validates and extracts the customer's Gemini key from request headers or body.
 * Strictly rejects missing keys and the shared Firebase project key.
 * Never falls back to default/creator/environment keys.
 */
export function extractAndCheckGeminiKey(headers: Record<string, string | string[] | undefined>, body?: any): string {
  const headerKey = headers["x-gemini-api-key"];
  const rawKey = (typeof headerKey === "string" ? headerKey : Array.isArray(headerKey) ? headerKey[0] : undefined) || body?.geminiKey;

  if (!rawKey || typeof rawKey !== "string" || !rawKey.trim()) {
    const error: any = new Error("Customer Gemini API key is required. Please provide your Gemini API key.");
    error.statusCode = 400;
    throw error;
  }

  const trimmed = rawKey.trim();

  // Strict rejection of the shared Firebase configuration key
  if (trimmed === SHARED_FIREBASE_KEY) {
    const error: any = new Error("The provided key is the shared Firebase configuration key, not your personal Gemini API key. Please provide your Gemini API key from https://aistudio.google.com/apikey.");
    error.statusCode = 400;
    throw error;
  }

  return trimmed;
}

/**
 * Creates an isolated GoogleGenAI client for the current customer's request.
 */
export function createIsolatedAiClient(apiKey: string): GoogleGenAI {
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

/**
 * Helper with exponential backoff for 503 / busy statuses
 */
export async function generateContentWithRetry(aiClient: any, maxRetries = 3, generateConfig: any) {
  let attempt = 0;
  while (true) {
    try {
      const response = await aiClient.models.generateContent(generateConfig);
      return response;
    } catch (err: any) {
      attempt++;
      const errStr = String(err?.message || err?.status || err?.stack || "").toLowerCase();
      const is503 = errStr.includes("503") || errStr.includes("unavailable") || errStr.includes("overloaded") || errStr.includes("busy") || err?.status === 503;

      if (is503 && attempt < maxRetries) {
        const backoffMs = Math.pow(2, attempt) * 1000;
        await new Promise((resolve) => setTimeout(resolve, backoffMs));
      } else {
        throw err;
      }
    }
  }
}
