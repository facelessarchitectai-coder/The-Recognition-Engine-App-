import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Set limits higher to accept base64 uploaded reference images
  app.use(express.json({ limit: "25mb" }));

  // Initialize Gemini Client Lazily/Safely
  const getAiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required in secrets");
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  };

  // Helper to run generateContent on the AI client with exponential backoff on 503 / Unavailable / Overloaded errors
  const generateContentWithRetry = async (aiClient: any, maxRetries = 3, generateConfig: any) => {
    let attempt = 0;
    while (true) {
      try {
        const response = await aiClient.models.generateContent(generateConfig);
        return response;
      } catch (err: any) {
        attempt++;
        
        // Log the full detailed error object to console for debugging
        console.error(`[Gemini Request Failure] Attempt ${attempt}/${maxRetries}. Complete Error Message: ${err?.message || ""}`);
        console.error(`[Gemini Request Failure] Status: ${err?.status || err?.statusCode || "N/A"}. Stacktrace:`, err?.stack || err);

        const errStr = String(err?.message || err?.status || err?.stack || "").toLowerCase();
        const is503 = errStr.includes("503") || errStr.includes("unavailable") || errStr.includes("overloaded") || errStr.includes("busy") || err?.status === 503;

        if (is503 && attempt < maxRetries) {
          const backoffMs = Math.pow(2, attempt) * 1000;
          console.warn(`[Gemini] 503/Unavailable busy status parsed. Retrying in ${backoffMs}ms with exponential backoff...`);
          await new Promise((resolve) => setTimeout(resolve, backoffMs));
        } else {
          // Rethrow the final error if retries are exhausted or it's a persistent non-retryable error
          throw err;
        }
      }
    }
  };

  // Secure API endpoint for results generation
  app.post("/api/generate", async (req, res) => {
    try {
      const { mode, answers, referencesText, refImages } = req.body;

      if (!mode || !answers || !Array.isArray(answers)) {
        res.status(400).json({ success: false, error: "Invalid request payload: mode and answers array are required." });
        return;
      }

      const ai = getAiClient();

      if (mode === "fingerprints") {
        const prompt = `You are a signature-emoji strategist. A creator wants a small consistent set of emojis (a fingerprint) to use at the end of captions on Reels and carousels, on reposts, and in their bio so it reads as their signature. Output ONLY a JSON object: { "emojis": ["emoji1", "emoji2", ...4 to 6 emojis], "explanation": "one short sentence on why this combination works" }. Pull emoji choices from their symbolic categories and energy. Avoid anything matching their EXCLUDE answers. The combination should feel intentional and repeatable.

User Questionnaire State:
--- Questionnaire Selections ---
${answers.map((ans: any) => `Question: "${ans.questionTitle}" (${ans.questionStep})
Selected Options:
${ans.selections.map((sel: string) => ` - "${sel}"`).join('\n')}`).join('\n\n')}`;

        const response = await generateContentWithRetry(ai, 3, {
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                emojis: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "An array of 4 to 6 emojis.",
                },
                explanation: {
                  type: Type.STRING,
                  description: "One short sentence on why this combination works",
                }
              },
              required: ["emojis", "explanation"]
            }
          }
        });

        let text = response.text ? response.text.trim() : "{}";
        if (text.startsWith("```json")) {
          text = text.substring(7);
        }
        if (text.startsWith("```")) {
          text = text.substring(3);
        }
        if (text.endsWith("```")) {
          text = text.substring(0, text.length - 3);
        }
        text = text.trim();

        const parsed = JSON.parse(text);
        res.json({ success: true, emojis: parsed.emojis || [], explanation: parsed.explanation || "" });
        return;
      }

      // Instructions specifically targeting either Visual Direction or Signature Mark
      let prompt = `You are a visual psychologist, creative curator, and design strategist for the "Visual Direction Generator™".
Your task is to analyze the user's questionnaire choices, visual descriptors, and optional moodboard images to formulate EXACTLY 12 distinct, short (2 to 5 words), highly vivid, and beautiful Pinterest search phrases.

User Questionnaire State:
Mode: ${mode === 'visual' ? 'Visual Direction' : 'Signature Mark'}

--- Questionnaire Selections ---
${answers.map((ans: any) => `Question: "${ans.questionTitle}" (${ans.questionStep})
Selected Options:
${ans.selections.map((sel: string) => ` - "${sel}"`).join('\n')}`).join('\n\n')}

${referencesText ? `\n--- Optional User Description of the Visuals That Draw Them In ---\n"${referencesText}"\n` : ''}

${refImages && refImages.length > 0 ? `\nNote: The user also provided ${refImages.length} reference image(s) attached as files. Please analyze these images for colors, textures, lighting, subject matter, or graphics and use their vibe as strong context for your phrases.` : ''}

--- Guidelines for Phrases ---
- You MUST output EXACTLY 12 phrases.
- Each phrase must be between 2 and 5 words only.
- Output phrases must be tailored directly to the selections to describe a highly curated, ultra-cohesive style.
- Make them evocate, aesthetic, and designed for Pinterest search. Avoid repetitive words.
${mode === 'visual' ? `
- For Visual Direction: The phrases MUST focus on photography styles, composition, lighting, textures, natural settings, or interior architecture. Avoid graphic designs, cliparts, or logos. (Examples: "dappled light raw plaster", "minimalist stone alcove study", "nostalgic coastal afternoon blur").
` : `
- For Signature Mark: The phrases MUST focus on graphic elements, custom illustrations, stamps, vector icons, continuous line art, wax seals, png stickers, or textured brand emblems. Useful search keywords include PNG, vector, monogram, motif, logo, wax seal, sticker overlay, illustration. (Examples: "minimal golden moth crest png", "linocut custom sun stamp", "vintage ink eye icon pack").
`}

- CRITICAL: Return ONLY a raw JSON array of 12 strings. No markdown backticks, no wrap, no explanations. Just the JSON array itself!
Example output:
["phrase one", "phrase two", "phrase three", "phrase four", "phrase five", "phrase six", "phrase seven", "phrase eight", "phrase nine", "phrase ten", "phrase eleven", "phrase twelve"]`;

      const contents: any[] = [];

      // Add uploaded base64 images as part of contents if provided
      if (refImages && Array.isArray(refImages)) {
        refImages.slice(0, 5).forEach((img: { data: string; mimeType: string }) => {
          if (img.data && img.mimeType) {
            // Strip data-URI prefix if present
            const cleanBase64 = img.data.replace(/^data:image\/\w+;base64,/, "");
            contents.push({
              inlineData: {
                data: cleanBase64,
                mimeType: img.mimeType,
              },
            });
          }
        });
      }

      // Add the final text prompt containing instructions
      contents.push({ text: prompt });

      // Run generation using gemini-3.5-flash with retry policy
      const response = await generateContentWithRetry(ai, 3, {
        model: "gemini-3.5-flash",
        contents: contents.length === 1 ? prompt : { parts: contents },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.STRING,
            },
            description: "An array of exactly 12 Pinterest search phrase strings.",
          }
        }
      });

      let text = response.text ? response.text.trim() : "[]";
      
      // Clean markdown wrappers if any
      if (text.startsWith("```json")) {
        text = text.substring(7);
      }
      if (text.startsWith("```")) {
        text = text.substring(3);
      }
      if (text.endsWith("```")) {
        text = text.substring(0, text.length - 3);
      }
      text = text.trim();

      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error("Gemini did not return a valid array of terms.");
      }

      // Ensure exactly 12 items
      let phrases = parsed.slice(0, 12);
      while (phrases.length < 12) {
        phrases.push(`vivid ${mode === 'visual' ? 'atmospheric details' : 'graphic emblem design'}`);
      }

      res.json({ success: true, phrases });
    } catch (err: any) {
      console.error("API ultimate failure inside /api/generate:", err);
      // Return a professional, clean user-friendly error instead of raw stacktrace or JSON
      res.status(503).json({ 
        success: false, 
        error: "The AI service is currently busy. Please try again in a few moments." 
      });
    }
  });

  // Handle building versus dev mode with Vite
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Bind to 0.0.0.0:3000
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server loaded on port ${PORT}`);
  });
}

startServer();
