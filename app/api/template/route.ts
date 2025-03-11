import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { BASE_PROMPT, systemPrompt } from "@/lib/defaults/systemprompt";
import { basePrompt as reactBasePrompt } from "@/lib/defaults/react";
import { basePrompt as nextBasePrompt } from "@/lib/defaults/next";
import { basePrompt as nodeBasePrompt } from "@/lib/defaults/node";

export const dynamic = "force-dynamic"; // 👈 Add this to force dynamic rendering

const genAI = new GoogleGenerativeAI(process.env.API_KEY!);
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  generationConfig: {
    temperature: 0.1,
    maxOutputTokens: 8000,
  },
});

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    const classificationPrompt = `Analyze the project description and respond ONLY with 'next js' or 'react' or 'node'. No other text. 
    Project: ${prompt}`;

    const result = await model.generateContentStream(classificationPrompt);
    let frameworkChoice = "";

    for await (const chunk of result.stream) {
      frameworkChoice += chunk.text();
    }

    frameworkChoice = frameworkChoice
      .trim()
      .toLowerCase()
      .replace(/[^a-z ]/g, "")
      .replace(/\./g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const allowedFrameworks = ["next js", "react", "node"];
    if (!allowedFrameworks.includes(frameworkChoice)) {
      return NextResponse.json(
        {
          error: "Invalid framework choice received",
          received: frameworkChoice,
        },
        { status: 400 }
      );
    }

    const configs = {
      react: {
        prompts: [
          BASE_PROMPT,
          `Project files:\n${reactBasePrompt}\nHidden files: .gitignore, package-lock.json\n`,
        ],
        uiPrompts: [reactBasePrompt],
      },
      "next js": {
        prompts: [
          BASE_PROMPT,
          `Project files:\n${nextBasePrompt}\nHidden files: .gitignore, package-lock.json\n`,
        ],
        uiPrompts: [nextBasePrompt],
      },
      node: {
        prompts: [
          `Project files:\n${nodeBasePrompt}\nHidden files: .gitignore, package-lock.json\n`,
        ],
        uiPrompts: [nodeBasePrompt],
      },
    };

    const frameworkConfig = configs[frameworkChoice as keyof typeof configs];

    return NextResponse.json(frameworkConfig);
  } catch (error) {
    console.error("Template endpoint error:", error);
    return NextResponse.json(
      {
        error: "AI service unavailable",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
