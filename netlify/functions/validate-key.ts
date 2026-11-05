import { 
  verifyFirebaseToken, 
  extractAndCheckGeminiKey, 
  createIsolatedAiClient 
} from "../../src/server/authAndGemini";

export const handler = async (event: any) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ success: false, error: "Method not allowed" }),
    };
  }

  try {
    const authHeader = event.headers.authorization || event.headers.Authorization;
    const session = await verifyFirebaseToken(authHeader);

    const body = event.body ? JSON.parse(event.body) : {};
    const customerKey = extractAndCheckGeminiKey(event.headers, body);

    const ai = createIsolatedAiClient(customerKey);
    await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "ping",
      config: {
        maxOutputTokens: 1,
      },
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: true,
        message: "Gemini key validated successfully.",
        uid: session.uid,
      }),
    };
  } catch (err: any) {
    const status = err?.statusCode || 400;
    const message = err?.message || String(err);
    const lower = message.toLowerCase();

    if (lower.includes("authentication failed") || lower.includes("missing or malformed authorization")) {
      return {
        statusCode: 401,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ success: false, error: message }),
      };
    }

    if (
      lower.includes("api_key_invalid") ||
      lower.includes("api key not valid") ||
      lower.includes("invalid api key") ||
      lower.includes("forbidden") ||
      lower.includes("403")
    ) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          success: false,
          error: "Google AI rejected this key as invalid or unauthorized. Please verify your Gemini API key at https://aistudio.google.com/apikey.",
        }),
      };
    }

    if (lower.includes("quota") || lower.includes("resource_exhausted") || lower.includes("429")) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          success: false,
          error: "Your Gemini API key has exceeded its quota or has billing restrictions. Please check your account at https://aistudio.google.com/apikey.",
        }),
      };
    }

    return {
      statusCode: status,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: false,
        error: `Gemini key validation failed: ${message}`,
      }),
    };
  }
};
