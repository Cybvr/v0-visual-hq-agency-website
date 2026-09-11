import { createHash, createHmac, timingSafeEqual } from "node:crypto"

export type UnsubscribeTokenPayload = {
  email: string
  scope: "marketing"
}

function secret() {
  return process.env.EMAIL_UNSUBSCRIBE_SECRET || process.env.RESEND_API_KEY || process.env.FIREBASE_PRIVATE_KEY || "visualcns-email-unsubscribe"
}

export function normalizeSubscriptionEmail(value: string) {
  return value.trim().toLowerCase()
}

export function subscriptionDocumentId(email: string) {
  return createHash("sha256").update(normalizeSubscriptionEmail(email)).digest("hex")
}

export function createUnsubscribeToken(payload: UnsubscribeTokenPayload) {
  const encoded = Buffer.from(JSON.stringify({ ...payload, email: normalizeSubscriptionEmail(payload.email) })).toString("base64url")
  const signature = createHmac("sha256", secret()).update(encoded).digest("base64url")
  return `${encoded}.${signature}`
}

export function readUnsubscribeToken(token: string): UnsubscribeTokenPayload | null {
  const [encoded, signature] = token.split(".")
  if (!encoded || !signature) return null

  const expected = createHmac("sha256", secret()).update(encoded).digest("base64url")
  const actualBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expected)
  if (actualBuffer.length !== expectedBuffer.length || !timingSafeEqual(actualBuffer, expectedBuffer)) return null

  try {
    const parsed = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as Partial<UnsubscribeTokenPayload>
    if (typeof parsed.email !== "string" || parsed.scope !== "marketing") return null
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parsed.email)) return null
    return { email: normalizeSubscriptionEmail(parsed.email), scope: "marketing" }
  } catch {
    return null
  }
}

export function unsubscribeUrl(email: string) {
  const origin = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://www.visualcns.com"
  const token = createUnsubscribeToken({ email, scope: "marketing" })
  return `${origin}/api/email/unsubscribe?token=${encodeURIComponent(token)}`
}
