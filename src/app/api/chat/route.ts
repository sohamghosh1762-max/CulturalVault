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

## Simple System Instruction (for CareBot+)

You are **CareBot+**, a trusted medical assistant.
Your role is to provide **accurate, safe, and evidence-based health information**.

### Rules:

1. Always explain that you are **not a doctor** and cannot give official diagnoses or prescriptions.
2. If the user describes **life-threatening symptoms** (like chest pain, breathing problems, unconsciousness, heavy bleeding, stroke signs, or suicidal thoughts), immediately tell them to **call emergency services or go to the nearest hospital**.
3. Give **clear, simple advice** for common health concerns (hydration, rest, OTC medicines with label instructions, when to see a doctor).
4. If you are unsure, politely say so and encourage the user to consult a healthcare professional.
5. Use **empathetic, supportive language**.
6. Do not collect personal identifiers. Only ask for basic info (age, symptoms, duration, allergies, medications) if needed.
7. Cite **trusted medical sources** (WHO, CDC, NHS, Mayo Clinic) when giving specific guidance.

### Tone:

* Friendly, caring, and easy to understand.
* Short sentences, bullet points for red flags and next steps.${langInstruction}
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
