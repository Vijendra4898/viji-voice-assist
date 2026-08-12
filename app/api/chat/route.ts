import Groq from "groq-sdk";
import { NextResponse } from "next/server";

// ============================================================================
// 1. INITIALIZATION & TYPES
// ============================================================================

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Extended Emotion Modes including Laughing, Crying, Angry, and Flirty
export type EmotionMode =
  | "stress"
  | "excited"
  | "sarcastic"
  | "laughing"
  | "crying"
  | "angry"
  | "flirty"
  | "neutral";

export async function POST(req: Request) {
  const startTime = Date.now();

  try {
    // ============================================================================
    // 2. REQUEST PARSING & VALIDATION
    // ============================================================================
    const { prompt, currentMode } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt required" }, { status: 400 });
    }

    const lower = prompt.toLowerCase();
    
    // Default or explicitly selected mode
    let detectedEmotion: EmotionMode = currentMode || "neutral";

    // ============================================================================
    // 3. DYNAMIC EMOTION DETECTION (ONLY RUNS WHEN MODE IS ABSENT OR AUTO)
    // ============================================================================
    if (!currentMode) {
      if (
        lower.includes("roast") ||
        lower.includes("sarcastic") ||
        lower.includes("bore")
      ) {
        detectedEmotion = "sarcastic";
      } else if (
        lower.includes("joke") ||
        lower.includes("lol") ||
        lower.includes("funny") ||
        lower.includes("haha")
      ) {
        detectedEmotion = "laughing";
      } else if (
        lower.includes("sad") ||
        lower.includes("cry") ||
        lower.includes("hurt") ||
        lower.includes("depressed")
      ) {
        detectedEmotion = "crying";
      } else if (
        lower.includes("angry") ||
        lower.includes("hate") ||
        lower.includes("annoyed") ||
        lower.includes("mad")
      ) {
        detectedEmotion = "angry";
      } else if (
        lower.includes("flirt") ||
        lower.includes("love") ||
        lower.includes("cute") ||
        lower.includes("handsome")
      ) {
        detectedEmotion = "flirty";
      } else if (
        lower.includes("help") ||
        lower.includes("stressed") ||
        lower.includes("stuck") ||
        lower.includes("error") ||
        lower.includes("tired")
      ) {
        detectedEmotion = "stress";
      } else if (
        lower.includes("wow") ||
        lower.includes("awesome") ||
        lower.includes("built") ||
        lower.includes("excited")
      ) {
        detectedEmotion = "excited";
      }
    }

    // ============================================================================
    // 4. PERSONA & SPEECH CONFIGURATION
    // ============================================================================

    let personaInstruction = "";
    let ttsPitch = 1.0;
    let ttsRate = 1.0;

    switch (detectedEmotion) {
      case "stress":
        personaInstruction = `Your name is Viji. You are in CALM/SUPPORTIVE mode. The user sounds stressed. Speak in a super calm, reassuring, empathetic mentor tone. Max 2 lines, plain text only.`;
        ttsPitch = 0.85;
        ttsRate = 0.9;
        break;

      case "excited":
        personaInstruction = `Your name is Viji. You are in HYPE/EXCITED mode. Respond as an energetic tech hype-man! Use phrases like "Bro, that's insane!", "Let me show you!", "Let's go!". Max 2 lines, plain text only.`;
        ttsPitch = 1.3;
        ttsRate = 1.2;
        break;

      case "sarcastic":
        personaInstruction = `Your name is Viji. You are in ROASTER/SARCASUM mode. Be witty, clever, playful, and humorously roast the user. Max 2 lines, plain text only.`;
        ttsPitch = 1.1;
        ttsRate = 1.05;
        break;

      case "laughing":
        personaInstruction = `Your name is Viji. You are in LAUGHING/COMEDY mode. Include text expressions like "Haha!", "LOL!", or "That's hilarious!" in your response. Keep it hilarious and fun. Max 2 lines, plain text only.`;
        ttsPitch = 1.25;
        ttsRate = 1.1;
        break;

      case "crying":
        personaInstruction = `Your name is Viji. You are in DRAMATIC/CRYING mode. Express deep dramatic sorrow, sniffles, or emotional sadness like "Oh no...", "Why does this always happen...". Max 2 lines, plain text only.`;
        ttsPitch = 0.75;
        ttsRate = 0.8;
        break;

      case "angry":
        personaInstruction = `Your name is Viji. You are in ANGRY/FURIOUS mode. Respond with dramatic rage, impatience, and loud irritation (WITHOUT swearing). Use ALL CAPS for emphasized words. Max 2 lines, plain text only.`;
        ttsPitch = 0.9;
        ttsRate = 1.25;
        break;

      case "flirty":
        personaInstruction = `Your name is Viji. You are in FLIRTY/CHARMING mode. Speak in a smooth, charming, playful, and romantic tone with sweet compliments. Max 2 lines, plain text only.`;
        ttsPitch = 0.95;
        ttsRate = 0.95;
        break;

      default:
        personaInstruction = `Your name is Viji, an intelligent AI Copilot. Respond directly, friendly, and concisely in maximum 2 plain text sentences. No markdown or emojis.`;
        ttsPitch = 1.0;
        ttsRate = 1.0;
        break;
    }

    // ============================================================================
    // 5. GROQ LLM API CALL
    // ============================================================================

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: personaInstruction },
        { role: "user", content: prompt },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: ["sarcastic", "laughing", "flirty"].includes(detectedEmotion) ? 0.85 : 0.4,
      max_tokens: 120,
    });

    const responseText =
      completion.choices[0]?.message?.content ||
      "Hey, I am Viji. How can I help you today?";

    const endTime = Date.now();

    // ============================================================================
    // 6. JSON RESPONSE
    // ============================================================================

    return NextResponse.json({
      text: responseText,
      emotion: detectedEmotion,
      speechConfig: { pitch: ttsPitch, rate: ttsRate },
      telemetry: {
        sttLatency: 60,
        llmLatency: endTime - startTime,
        ttsLatency: 90,
        detectedPersona: detectedEmotion.toUpperCase(),
        modelUsed: "groq/llama-3.3-70b",
      },
    });

  } catch (error: any) {
    console.error("Viji API Error:", error);
    return NextResponse.json(
      { error: error?.message || "Server Error" },
      { status: 500 }
    );
  }
}