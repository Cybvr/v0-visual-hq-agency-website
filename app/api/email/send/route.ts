import { NextResponse } from "next/server"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://www.visualcns.com"

type FirebaseLookupResponse = {
  users?: Array<{ localId?: string }>
}

type ResendResponse = {
  id?: string
  message?: string
  error?: { message?: string }
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character] as string)
}

async function hasValidFirebaseSession(idToken: string) {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
  if (!apiKey) return false

  try {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
        cache: "no-store",
      },
    )

    if (!response.ok) return false
    const data = (await response.json()) as FirebaseLookupResponse
    return Boolean(data.users?.[0]?.localId)
  } catch {
    return false
  }
}

export async function GET() {
  const from = process.env.EMAIL_FROM?.trim() || ""
  return NextResponse.json({
    configured: Boolean(process.env.RESEND_API_KEY && from),
    from: from || null,
  })
}

export async function POST(request: Request) {
  const authorization = request.headers.get("authorization")
  const idToken = authorization?.startsWith("Bearer ") ? authorization.slice(7) : ""

  if (!idToken || !(await hasValidFirebaseSession(idToken))) {
    return NextResponse.json({ error: "Your session has expired. Sign in again and retry." }, { status: 401 })
  }

  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.EMAIL_FROM?.trim()
  if (!apiKey || !from) {
    return NextResponse.json(
      { error: "Email sending is not configured. Add RESEND_API_KEY and EMAIL_FROM to the server environment." },
      { status: 503 },
    )
  }

  let payload: { to?: unknown; subject?: unknown; text?: unknown; html?: unknown; imageUrl?: unknown }
  try {
    payload = (await request.json()) as typeof payload
  } catch {
    return NextResponse.json({ error: "The email request could not be read." }, { status: 400 })
  }

  const to = typeof payload.to === "string" ? payload.to.trim() : ""
  const subject = typeof payload.subject === "string" ? payload.subject.trim() : ""
  const text = typeof payload.text === "string" ? payload.text.trim() : ""
  const requestedHtml = typeof payload.html === "string" ? payload.html.trim() : ""
  const imagePath = typeof payload.imageUrl === "string" && payload.imageUrl.startsWith("/") ? payload.imageUrl : ""

  if (!EMAIL_PATTERN.test(to)) {
    return NextResponse.json({ error: "Enter a valid recipient email address." }, { status: 400 })
  }
  if (!subject || subject.length > 200) {
    return NextResponse.json({ error: "Add a subject no longer than 200 characters." }, { status: 400 })
  }
  if (!text || text.length > 20_000) {
    return NextResponse.json({ error: "Add a message no longer than 20,000 characters." }, { status: 400 })
  }

  const richHtml = requestedHtml.replace(/(src=["'])\/([^"']*)/gi, `$1${SITE_ORIGIN}/$2`)
  const html = [
    richHtml || text.split(/\n\s*\n/).map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br />")}</p>`).join(""),
    imagePath && !requestedHtml
      ? `<p><img src="${escapeHtml(`${SITE_ORIGIN}${imagePath}`)}" alt="Ngai AI assistant" style="display:block;width:100%;max-width:720px;height:auto;border-radius:12px;margin-top:24px;" /></p>`
      : "",
  ].join("")

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": crypto.randomUUID(),
      "User-Agent": "VisualCNS Dashboard/1.0",
    },
    body: JSON.stringify({ from, to: [to], subject, text, html }),
    cache: "no-store",
  })

  const result = (await resendResponse.json().catch(() => ({}))) as ResendResponse
  if (!resendResponse.ok || !result.id) {
    const providerMessage = result.error?.message || result.message
    return NextResponse.json(
      { error: providerMessage || "The email provider could not accept this message. Try again." },
      { status: resendResponse.status >= 400 ? resendResponse.status : 502 },
    )
  }

  return NextResponse.json({ id: result.id })
}
