import { Type } from "@google/genai";
import { 
  verifyFirebaseToken, 
  extractAndCheckGeminiKey, 
  createIsolatedAiClient, 
  generateContentWithRetry 
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

    const { mode, answers, referencesText, refImages } = body;
    if (!mode || !answers || !Array.isArray(answers)) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ success: false, error: "Invalid request payload: mode and answers array are required." }),
      };
    }

    const ai = createIsolatedAiClient(customerKey);

    if (mode === "color") {
      const prompt = `You are a professional color systems strategist. A creator has described their strict color parameters: "${referencesText || ""}".
${answers && answers.length > 0 ? `They also made these selections:\n${answers.map((ans: any) => `Question: "${ans.questionTitle}" (${ans.questionStep})\nSelected Options:\n${ans.selections.map((sel: string) => ` - "${sel}"`).join('\n')}`).join('\n\n')}` : ""}

Your task is to craft a generous, functional range of 5 to 15 colors.
CRITICAL SYSTEM CONSTRAINTS:
1. Pay deep attention to any "COLORS TO USE IN EVERYTHING" or specific colors they mention they will use. Make sure these are prominently featured in the palette.
2. Under no circumstance should you include or touch colors they explicitly state they will "not touch" or "absolutely avoid". EXCLUDE those hues and tones entirely.
3. This palette is living and expandable — it is not a locked set. Generate a generous range that reflects the full emotional, tonal, and sensory complexity of their inputs.

Format and output ONLY a JSON object, no markdown, no backticks, no preamble. Format exactly: { "palette": [ { "name": "color name", "hex": "#hexcode", "role": "one word: anchor, depth, contrast, accent, or neutral" } ], "moodLine": "one sentence describing the feeling of this palette as a world — not a design brief, a world description" } Rules: between 5 and 15 colors. Each hex must be accurate and visually match the name. Actively avoid anything matching their EXCLUDE answers. Do not mention World Within Method or Faceless Architect.`;

      const response = await generateContentWithRetry(ai, 3, {
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              palette: {
                type: Type.ARRAY,
                description: "A generous array of 5 to 15 colors representing the living palette range.",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING, description: "The descriptive color name" },
                    hex: { type: Type.STRING, description: "Accurate HEX color code starting with #" },
                    role: { type: Type.STRING, description: "Role: anchor, contrast, accent, neutral, or depth" }
                  },
                  required: ["name", "hex", "role"]
                }
              },
              moodLine: {
                type: Type.STRING,
                description: "One evocative sentence describing the feeling of this palette as a world, reading like a world description, not a design brief."
              }
            },
            required: ["palette", "moodLine"]
          }
        }
      });

      let text = response.text ? response.text.trim() : "{}";
      if (text.startsWith("```json")) text = text.substring(7);
      if (text.startsWith("```")) text = text.substring(3);
      if (text.endsWith("```")) text = text.substring(0, text.length - 3);
      text = text.trim();

      const parsed = JSON.parse(text);
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          success: true,
          palette: parsed.palette || [],
          moodLine: parsed.moodLine || "",
          uid: session.uid,
        }),
      };
    }

    if (mode === "fingerprints") {
      const prompt = `You are an elite signature-emoji strategist specializing in digital visual fingerprints.
A creator has provided their Primary Emoji Set: "${referencesText || ""}".

Analyze this specific set of emojis with deep intent.
Your output must include a small consistent set of emojis (exactly 4 to 8 emojis) that acts as their repeatable visual signature, along with a deep, structured analysis covering these specific dimensions:
1. Repetition - how the recurrence of these symbols or geometric shapes maintains visual cadence.
2. Themes - the underlying symbolic themes (e.g. nature, technology, cosmic, gothic, etc.).
3. Emotional Tone - the exact psychological atmosphere or emotional energy this set projects.
4. Visual Consistency - how cohesive they look together in terms of colors, line-work, complexity, and styling.
5. Strongest Combination - which specific 2 or 3 emojis in this set form the absolute strongest visual resonant core and why.

Output ONLY a JSON object with the strict fields matching the schema. Do not make up extra fields. Avoid markdown formatting blocks.`;

      const response = await generateContentWithRetry(ai, 3, {
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              emojis: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "An array of 4 to 8 emojis representing their final intentional signature set.",
              },
              explanation: {
                type: Type.STRING,
                description: "One short sentence explaining why this combination works as a timeless archive signature.",
              },
              analysis: {
                type: Type.OBJECT,
                properties: {
                  repetition: { type: Type.STRING, description: "1-2 brief sentences on cadence." },
                  themes: { type: Type.STRING, description: "1-2 brief sentences on themes." },
                  emotionalTone: { type: Type.STRING, description: "1-2 brief sentences on tone." },
                  visualConsistency: { type: Type.STRING, description: "1-2 brief sentences on consistency." },
                  strongestCombination: { type: Type.STRING, description: "1-2 brief sentences on strongest combo." }
                },
                required: ["repetition", "themes", "emotionalTone", "visualConsistency", "strongestCombination"]
              }
            },
            required: ["emojis", "explanation", "analysis"]
          }
        }
      });

      let text = response.text ? response.text.trim() : "{}";
      if (text.startsWith("```json")) text = text.substring(7);
      if (text.startsWith("```")) text = text.substring(3);
      if (text.endsWith("```")) text = text.substring(0, text.length - 3);
      text = text.trim();

      const parsed = JSON.parse(text);
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          success: true,
          emojis: parsed.emojis || [],
          explanation: parsed.explanation || "",
          analysis: parsed.analysis || null,
          uid: session.uid,
        }),
      };
    }

    // Visual or Signature Mark
    let prompt = `You are a visual psychologist, creative curator, and design strategist for the "${mode === 'visual' ? 'Visual Direction Generator' : 'Signature Mark Generator'}".
Your task is to analyze the user's questionnaire choices, visual descriptors, and optional moodboard images to formulate:
1. EXACTLY 12 distinct, short (2 to 5 words), highly vivid, and beautiful Pinterest search phrases.
2. A detailed Curation Blueprint structured strictly according to the Phase 2 & Phase 3 curation framework.

Mode: ${mode === 'visual' ? 'Visual Direction' : 'Signature Mark'}

${referencesText ? `\n--- User Description of the Visuals ---\n"${referencesText}"\n` : ''}

${answers && answers.length > 0 ? `\n--- Questionnaire Selections ---\n${answers.map((ans: any) => `Question: "${ans.questionTitle}" (${ans.questionStep})\nSelected Options:\n${ans.selections.map((sel: string) => ` - "${sel}"`).join('\n')}`).join('\n\n')}` : ""}

${refImages && refImages.length > 0 ? `\nNote: The user also provided ${refImages.length} reference image(s) attached as files. Please analyze these images for colors, textures, lighting, subject matter, or graphics and use their vibe as strong context for your phrases.` : ''}

--- Guidelines for Phrases ---
- You MUST output EXACTLY 12 phrases.
- Each phrase must be between 2 and 5 words only.
- Output phrases must be tailored directly to describe a highly curated, ultra-cohesive style.
- Make them evocative, aesthetic, and designed for Pinterest search. Avoid repetitive words.
${mode === 'visual' ? `
- For Visual Direction: The phrases MUST focus on photography styles, composition, lighting, textures, natural settings, or interior architecture. Avoid graphic designs, cliparts, or logos.
` : `
- For Signature Mark: The phrases MUST focus on graphic elements, custom illustrations, stamps, vector icons, continuous line art, wax seals, png stickers, or textured brand emblems.
`}

--- Guidelines for Curation Blueprint ---
Formulate a concrete, authoritative Curation Blueprint based strictly on these rules:
1. **World Direction:** You MUST choose EXACTLY ONE main direction from: "controlled", "surreal", "grounded", "nostalgic", "minimal".
2. **World Rules:** Define what exists in this world, what repeats, what does NOT belong, and what breaks the world/shatters the visual illusion.
3. **Environment:** Types of spaces your world uses, and emotional tone (calm, controlled, chaotic, or nostalgic).
4. **Visual Language:** Formulate color behavior, tone, energy, styling, lighting, repeating colors, environment type, composition, emotional feel, colors that break, not belong visual.

CRITICAL: Return ONLY a raw JSON object matching the requested schema. No markdown backticks, no wrap, no explanations.`;

    const contents: any[] = [];
    if (refImages && Array.isArray(refImages)) {
      refImages.slice(0, 5).forEach((img: { data: string; mimeType: string }) => {
        if (img.data && img.mimeType) {
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

    contents.push({ text: prompt });

    const response = await generateContentWithRetry(ai, 3, {
      model: "gemini-2.5-flash",
      contents: contents.length === 1 ? prompt : { parts: contents },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            phrases: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "An array of exactly 12 Pinterest search phrase strings."
            },
            blueprint: {
              type: Type.OBJECT,
              properties: {
                worldDirection: {
                  type: Type.OBJECT,
                  properties: {
                    type: { type: Type.STRING, description: "Exactly one of: controlled, surreal, grounded, nostalgic, minimal" },
                    meaning: { type: Type.STRING, description: "Meaning" },
                    exists: { type: Type.STRING, description: "What exists" },
                    doesNotBelong: { type: Type.STRING, description: "What does not belong" },
                    repeats: { type: Type.STRING, description: "What repeats" },
                    breaks: { type: Type.STRING, description: "What breaks the world" }
                  },
                  required: ["type", "meaning", "exists", "doesNotBelong", "repeats", "breaks"]
                },
                environment: {
                  type: Type.OBJECT,
                  properties: {
                    spaces: { type: Type.STRING, description: "Spaces" },
                    emotionalTone: { type: Type.STRING, description: "Tone" },
                    worldVsBackground: { type: Type.STRING, description: "Difference" }
                  },
                  required: ["spaces", "emotionalTone", "worldVsBackground"]
                },
                visualLanguage: {
                  type: Type.OBJECT,
                  properties: {
                    colorBehavior: { type: Type.STRING },
                    tone: { type: Type.STRING },
                    energy: { type: Type.STRING },
                    styling: { type: Type.STRING },
                    lighting: { type: Type.STRING },
                    repeatingColors: { type: Type.STRING },
                    environmentType: { type: Type.STRING },
                    composition: { type: Type.STRING },
                    emotionalFeel: { type: Type.STRING },
                    colorsThatBreak: { type: Type.STRING },
                    notBelongVisual: { type: Type.STRING }
                  },
                  required: [
                    "colorBehavior", "tone", "energy", "styling", "lighting", 
                    "repeatingColors", "environmentType", "composition", 
                    "emotionalFeel", "colorsThatBreak", "notBelongVisual"
                  ]
                }
              },
              required: ["worldDirection", "environment", "visualLanguage"]
            }
          },
          required: ["phrases", "blueprint"]
        }
      }
    });

    let text = response.text ? response.text.trim() : "{}";
    if (text.startsWith("```json")) text = text.substring(7);
    if (text.startsWith("```")) text = text.substring(3);
    if (text.endsWith("```")) text = text.substring(0, text.length - 3);
    text = text.trim();

    const parsed = JSON.parse(text);
    let phrases: string[] = [];
    let blueprint: any = null;

    if (Array.isArray(parsed)) {
      phrases = parsed;
    } else if (parsed && Array.isArray(parsed.phrases)) {
      phrases = parsed.phrases;
      blueprint = parsed.blueprint || null;
    } else {
      throw new Error("Gemini did not return a valid array of terms.");
    }

    phrases = phrases.slice(0, 12);
    while (phrases.length < 12) {
      phrases.push(`vivid ${mode === 'visual' ? 'atmospheric details' : 'graphic emblem design'}`);
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ success: true, phrases, blueprint, uid: session.uid }),
    };
  } catch (err: any) {
    const message = String(err?.message || err);
    const lower = message.toLowerCase();

    if (lower.includes("authentication failed") || lower.includes("missing or malformed authorization")) {
      return {
        statusCode: 401,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ success: false, error: "Your session has expired. Please sign in again with Google." }),
      };
    }

    if (
      lower.includes("api_key_invalid") ||
      lower.includes("api key not valid") ||
      lower.includes("invalid api key") ||
      lower.includes("forbidden") ||
      lower.includes("403") ||
      lower.includes("customer gemini api key is required") ||
      lower.includes("shared firebase")
    ) {
      return {
        statusCode: 401,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          success: false, 
          keyInvalid: true,
          error: "Your Gemini API key is missing, invalid, or revoked. Please provide a valid Gemini API key to continue." 
        }),
      };
    }

    return {
      statusCode: 503,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        success: false, 
        error: "The AI service is currently busy. Please try again in a few moments." 
      }),
    };
  }
};
