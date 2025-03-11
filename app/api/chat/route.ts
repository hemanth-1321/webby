import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { systemPrompt } from "@/lib/defaults/systemprompt"; // Assuming your system prompt function is here

const genAI = new GoogleGenerativeAI(process.env.API_KEY!);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  generationConfig: {
    temperature: 0.1,
    maxOutputTokens: 8000,
  },
});

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid messages format" },
        { status: 400 }
      );
    }

    const chatHistory = messages.map((msg) => ({
      role: msg.role === "user" ? "user" : "system",
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      systemInstruction: {
        role: "system",
        parts: [{ text: systemPrompt() }],
      },
      history: chatHistory,
    });

    const lastMessage = messages[messages.length - 1]?.content?.trim();
    if (!lastMessage) {
      return NextResponse.json(
        { error: "Empty last message" },
        { status: 400 }
      );
    }

    const result = await chat.sendMessage(lastMessage);

    return NextResponse.json({
      response: result.response.text(),
    });
  } catch (error) {
    console.error("Chat endpoint error:", error);
    return NextResponse.json(
      {
        error: "AI service unavailable",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
