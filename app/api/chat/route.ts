import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Using Gemini 1.5 Flash with Google Search Grounding enabled
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      tools: [{ googleSearch: {} }], // Live web search tool
    });

    const systemInstruction = `You are a smart Siri-like AI voice assistant. 
    Answer the user's question clearly, accurately, and concisely based on real-time world events. 
    Keep the answer short (max 2-3 sentences) as it will be spoken out loud via Speech-to-Text. 
    Do not use markdown, emojis, asterisks, or complex formatting.`;

    const result = await model.generateContent(`${systemInstruction}\n\nUser Question: ${prompt}`);
    const responseText = result.response.text();

    return NextResponse.json({ text: responseText });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch response from AI" },
      { status: 500 }
    );
  }
}