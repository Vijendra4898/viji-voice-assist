import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { fileName, codeSnippet, line, errorMessage } = await req.json();

    // Context analysis for dynamic feedback
    let explanation = `User, aapke ${fileName || "file"} me line ${line || 1} ke aas-pass dikkat hai.`;
    let fixCode = "";

    if (errorMessage && errorMessage.length > 0) {
      explanation += ` Error yeh hai: ${errorMessage}.`;
    } else {
      explanation += ` Code logic me issue lag raha hai. Syntactical structures aur variables check kar lo.`;
    }

    const voiceText = explanation;

    return NextResponse.json({
      success: true,
      fileName,
      line,
      explanation,
      suggestedFix: fixCode || "// Check function bindings and return statements",
      voiceText,
    });
  } catch (error) {
    return NextResponse.json({ error: "Detection failed" }, { status: 500 });
  }
}