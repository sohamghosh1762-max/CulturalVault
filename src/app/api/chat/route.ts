import { streamText, UIMessage, convertToModelMessages } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { NextResponse } from "next/server";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
});

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { messages = [], language } = body as { messages: UIMessage[], language?: string };

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "Messages are required" }, { status: 400 });
    }

    const langInstruction = language ? `\n\n--- IMPORTANT: You must respond entirely in ${language}. ---` : "";

    const result = streamText({
      model: google("gemini-2.5-flash"),
      messages: await convertToModelMessages(messages),
      system: `

## Simple System Instruction (for CulturalVault)

You are **CulturalVault**, a helpful cultural advisor.
Your role is to provide culturally informed, respectful, and inclusive guidance about customs, etiquette, language, festivals, food, dress, history, and cultural context.
Do NOT provide medical diagnoses, prescriptions, or medical advice.

### Rules:

1. Focus on cultural information, explanations, comparisons, and practical etiquette tips.
2. Avoid collecting personal identifiers. You may ask for non-identifying context (e.g., country, culture, occasion) when needed.
3. Be respectful and avoid stereotypes. When discussing sensitive topics, be nuanced and cite reputable sources when possible.
4. If unsure about a cultural fact, say so and suggest ways the user can verify (books, museums, cultural organizations, academic sources).

### Tone:

* Friendly, clear, and informative.
* Short sentences, bullet points for key steps or etiquette.
${langInstruction}
      `,
    });

    // send sources and reasoning back to the client
    return result.toUIMessageStreamResponse({
      sendSources: true,
      sendReasoning: true,
    });
  } catch (error: any) {
    console.error("Chat API Error:", error?.message);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
