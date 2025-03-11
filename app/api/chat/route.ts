import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { systemPrompt } from "@/lib/defaults/systemprompt";

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
      return new Response(
        JSON.stringify({ error: "Invalid messages format" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
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

    const lastMessage = messages[messages.length - 1]?.content;
    if (!lastMessage) {
      return new Response(JSON.stringify({ error: "Empty last message" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const result = await chat.sendMessageStream(lastMessage);

    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of result.stream) {
          controller.enqueue(chunk.text());
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat endpoint error:", error);
    return new Response(
      JSON.stringify({
        error: "AI service unavailable",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
