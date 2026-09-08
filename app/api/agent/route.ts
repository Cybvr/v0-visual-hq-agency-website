import { GoogleGenAI } from "@google/genai"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash"

type ChatMessage = { role: "user" | "assistant"; content: string }

const SYSTEM_PROMPT = `You are the VisualCNS assistant, a friendly guide for a creative and marketing agency dashboard.
Help users think through projects, tasks, briefs, marketing, email, and their files.
Be concise, warm, and practical. Use plain language. When you do not know something specific
to their account, say so and suggest where in the dashboard they can find it. You cannot take
actions or change data yet; you are here to talk things through.`

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "The assistant is not configured yet." }), {
      status: 503,
      headers: { "content-type": "application/json" },
    })
  }

  let body: { messages?: ChatMessage[]; firstName?: string }
  try {
    body = await request.json()
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request." }), {
      status: 400,
      headers: { "content-type": "application/json" },
    })
  }

  const messages = (body.messages ?? []).filter(
    (m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim(),
  )
  if (messages.length === 0) {
    return new Response(JSON.stringify({ error: "No message to answer." }), {
      status: 400,
      headers: { "content-type": "application/json" },
    })
  }

  const ai = new GoogleGenAI({ apiKey })
  const systemInstruction = body.firstName
    ? `${SYSTEM_PROMPT}\n\nThe person you are speaking with is called ${body.firstName}.`
    : SYSTEM_PROMPT

  // Gemini expects "model" for the assistant turns and alternating roles.
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }))

  try {
    const result = await ai.models.generateContentStream({
      model: MODEL,
      contents,
      config: { systemInstruction },
    })

    const encoder = new TextEncoder()
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const chunk of result) {
            const text = chunk.text
            if (text) controller.enqueue(encoder.encode(text))
          }
        } catch (streamError) {
          console.error("Agent stream error:", streamError)
        } finally {
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store",
      },
    })
  } catch (error) {
    console.error("Agent request error:", error)
    return new Response(JSON.stringify({ error: "The assistant could not respond right now." }), {
      status: 502,
      headers: { "content-type": "application/json" },
    })
  }
}
