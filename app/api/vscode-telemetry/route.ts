import { NextResponse } from "next/server";

// In-Memory state to hold live code diagnostics
let latestDiagnostic: {
  hasError: boolean;
  fileName: string;
  line: number;
  errorMessage: string;
  suggestedFix: string;
  timestamp: number;
} | null = null;

// 1. GET: Frontend (page.tsx) isko poll karega
export async function GET() {
  if (!latestDiagnostic || !latestDiagnostic.hasError) {
    return NextResponse.json({ hasError: false });
  }

  // 15 seconds se purana error repeat na ho
  if (Date.now() - latestDiagnostic.timestamp > 15000) {
    latestDiagnostic = null;
    return NextResponse.json({ hasError: false });
  }

  const responseData = { ...latestDiagnostic };
  // Speak hone ke baad consume kar lo taaki loop na bane
  latestDiagnostic = null; 

  return NextResponse.json(responseData);
}

// 2. POST: VS Code Extension ya External Webhook yahan error bhejega
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fileName, line, errorMessage, suggestedFix } = body;

    let voiceMessage = `Vijendra, aapke ${fileName || "code"} me line ${line || "x"} par dikkat hai: ${errorMessage}.`;
    
    if (suggestedFix) {
      voiceMessage += ` Isko is tarah fix kar lo: ${suggestedFix}`;
    }

    latestDiagnostic = {
      hasError: true,
      fileName: fileName || "page.tsx",
      line: line || 1,
      errorMessage: errorMessage || "Syntax Error",
      suggestedFix: suggestedFix || "",
      timestamp: Date.now(),
    };

    return NextResponse.json({ success: true, voiceMessage });
  } catch (error) {
    return NextResponse.json({ error: "Failed to process telemetry" }, { status: 500 });
  }
}