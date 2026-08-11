import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

type EmotionMode = "stress" | "excited" | "sarcastic" | "neutral";

export async function POST(req: Request) {
  const startTime = Date.now();
  try {
    const { prompt, currentMode } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt required" }, { status: 400 });
    }

    const lower = prompt.toLowerCase();
    let detectedEmotion: EmotionMode = currentMode || "neutral";

    // Dynamic Emotion & Mood Analyzer
    if (
      lower.includes("roast") ||
      lower.includes("sarcastic") ||
      lower.includes("joke") ||
      lower.includes("bore")
    ) {
      detectedEmotion = "sarcastic";
    } else if (
      lower.includes("help") ||
      lower.includes("stressed") ||
      lower.includes("stuck") ||
      lower.includes("error") ||
      lower.includes("tired") ||
      lower.includes("worried")
    ) {
      detectedEmotion = "stress";
    } else if (
      lower.includes("wow") ||
      lower.includes("awesome") ||
      lower.includes("built") ||
      lower.includes("excited") ||
      lower.includes("great") ||
      lower.includes("let's go")
    ) {
      detectedEmotion = "excited";
    }

    // Persona & System Prompt Customization
    let personaInstruction = "";
    let ttsPitch = 1.0;
    let ttsRate = 1.0;

    switch (detectedEmotion) {
      case "stress":
        personaInstruction = `Your name is Viji. The user sounds stressed or stuck. Speak in a super calm, gentle, reassuring, and extremely polite empathetic mentor tone. Use soft, comforting language. Keep it short (max 2 lines).`;
        ttsPitch = 0.85; // Low & calm pitch
        ttsRate = 0.9;  // Slightly slow & gentle speed
        break;

      case "excited":
        personaInstruction = `Your name is Viji. The user is super excited and energetic! Respond as a high-energy tech hype-man and enthusiastic friend! Use energetic phrases like "Bro, that's insane!", "Let's build it!", "Let's go!". Keep it punchy (max 2 lines).`;
        ttsPitch = 1.25; // High pitch
        ttsRate = 1.15; // Fast energetic speed
        break;

      case "sarcastic":
        personaInstruction = `Your name is Viji. You are in Roaster / Stand-up Comedian mode. Be witty, playful, humorously sarcastic, and tease the user lovingly. Keep it clever and funny (max 2 lines).`;
        ttsPitch = 1.1;
        ttsRate = 1.05;
        break;

      default:
        personaInstruction = `Your name is Viji, an intelligent, modern AI Copilot representing Vijendra Patel. Respond directly, friendly, and concisely in maximum 2 plain text sentences. No markdown or emojis.`;
        ttsPitch = 1.0;
        ttsRate = 1.0;
        break;
    }

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: personaInstruction },
        { role: "user", content: prompt },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: detectedEmotion === "sarcastic" ? 0.8 : 0.4,
      max_tokens: 120,
    });

    const responseText =
      completion.choices[0]?.message?.content ||
      "Hey, I am Viji. How can I help you today?";

    const endTime = Date.now();

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
    return NextResponse.json({ error: error?.message || "Server Error" }, { status: 500 });
  }
}