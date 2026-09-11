import { FieldValue } from "firebase-admin/firestore"
import { NextResponse } from "next/server"

import { adminServices } from "@/lib/firebase-admin"
import { normalizeSubscriptionEmail, readUnsubscribeToken, subscriptionDocumentId } from "@/lib/email-unsubscribe"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function tokenFromRequest(request: Request) {
  return new URL(request.url).searchParams.get("token")?.trim() || ""
}

export async function GET(request: Request) {
  const token = tokenFromRequest(request)
  const payload = readUnsubscribeToken(token)
  if (!payload) return new NextResponse("This unsubscribe link is invalid or has expired.", { status: 400 })

  const actionUrl = `/api/email/unsubscribe?token=${encodeURIComponent(token)}`
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Unsubscribe · VisualCNS</title></head><body style="margin:0;padding:48px 20px;background:#f3f4f7;color:#20232d;font-family:Arial,Helvetica,sans-serif"><main style="max-width:520px;margin:0 auto;padding:32px;background:#fff"><h1 style="margin:0 0 12px;font-size:24px">Unsubscribe from marketing emails</h1><p style="margin:0 0 24px;line-height:1.6">Stop marketing emails for <strong>${payload.email}</strong>?</p><form method="post" action="${actionUrl}"><button type="submit" style="border:0;border-radius:999px;background:#111318;color:#fff;padding:12px 20px;font-weight:700;cursor:pointer">Unsubscribe</button></form></main></body></html>`
  return new NextResponse(html, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } })
}

export async function POST(request: Request) {
  const token = tokenFromRequest(request)
  const payload = readUnsubscribeToken(token)
  if (!payload) return new NextResponse("This unsubscribe link is invalid or has expired.", { status: 400 })

  const email = normalizeSubscriptionEmail(payload.email)
  const { db } = adminServices()
  await db.collection("emailUnsubscriptions").doc(subscriptionDocumentId(email)).set({
    email,
    scope: "marketing",
    status: "unsubscribed",
    updatedAt: FieldValue.serverTimestamp(),
  }, { merge: true })

  return new NextResponse("You have been unsubscribed from VisualCNS marketing emails.", {
    status: 200,
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  })
}
