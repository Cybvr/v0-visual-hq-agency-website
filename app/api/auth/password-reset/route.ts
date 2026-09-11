import { NextResponse } from "next/server"

import { adminServices } from "@/lib/firebase-admin"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character] as string)
}

function isMissingUserError(error: unknown) {
  if (!error || typeof error !== "object") return false
  const candidate = error as { code?: unknown; message?: unknown }
  return candidate.code === "auth/user-not-found" || String(candidate.message || "").includes("user-not-found")
}

function siteOrigin(request: Request) {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || new URL(request.url).origin
}

function resetEmailHtml(resetUrl: string) {
  return `<!doctype html>
<html lang="en">
  <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
  <body style="margin:0;padding:0;background:#f3f4f7;color:#20232d;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;background:#f3f4f7;">
      <tr>
        <td align="center" style="padding:28px 12px;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:#ffffff;">
            <tr><td style="padding:28px;font-size:20px;font-weight:700;">VisualCNS</td></tr>
            <tr>
              <td style="padding:8px 28px 12px;font-size:15px;line-height:1.65;color:#303440;">
                <h1 style="margin:0 0 14px;font-size:24px;line-height:1.25;color:#20232d;">Reset your password</h1>
                <p style="margin:0;">We received a request to reset the password for your VisualCNS account.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:10px 28px 28px;">
                <a href="${escapeHtml(resetUrl)}" style="display:inline-block;background:#111318;border-radius:999px;color:#ffffff;padding:12px 20px;font-size:14px;font-weight:700;line-height:20px;text-decoration:none;">Reset password</a>
                <p style="margin:18px 0 0;font-size:13px;line-height:1.6;color:#6d7280;">This link expires after a limited time. If you did not request a password reset, you can ignore this email.</p>
              </td>
            </tr>
            <tr><td style="padding:20px 28px;background:#f8f8fa;border-top:1px solid #e7e8ec;font-size:12px;line-height:1.6;color:#6d7280;">VisualCNS · Lagos, Nigeria</td></tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.EMAIL_FROM?.trim()
  if (!apiKey || !from) {
    return NextResponse.json(
      { error: "Password reset email is not configured. Add RESEND_API_KEY and EMAIL_FROM to the server environment." },
      { status: 503 },
    )
  }

  let payload: { email?: unknown }
  try {
    payload = (await request.json()) as { email?: unknown }
  } catch {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 })
  }

  const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : ""
  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 })
  }

  try {
    const { auth } = adminServices()
    const firebaseResetLink = await auth.generatePasswordResetLink(email)
    const code = new URL(firebaseResetLink).searchParams.get("oobCode")
    if (!code) throw new Error("Firebase did not return a password reset code")

    const resetUrl = `${siteOrigin(request)}/reset-password?oobCode=${encodeURIComponent(code)}`
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": crypto.randomUUID(),
        "User-Agent": "VisualCNS Password Reset/1.0",
      },
      body: JSON.stringify({
        from,
        to: [email],
        subject: "Reset your VisualCNS password",
        text: `Reset your VisualCNS password\n\nOpen this link to choose a new password: ${resetUrl}\n\nIf you did not request a password reset, you can ignore this email.`,
        html: resetEmailHtml(resetUrl),
        ...(process.env.EMAIL_REPLY_TO?.trim() ? { reply_to: process.env.EMAIL_REPLY_TO.trim() } : {}),
      }),
      cache: "no-store",
    })

    if (!response.ok) {
      const result = (await response.json().catch(() => ({}))) as { message?: string; error?: { message?: string } }
      console.error("Password reset email rejected by Resend", result.error?.message || result.message || response.status)
      return NextResponse.json({ error: "We couldn’t send the reset email. Please try again." }, { status: 502 })
    }
  } catch (error) {
    if (!isMissingUserError(error)) {
      console.error("Password reset email failed", error)
      return NextResponse.json({ error: "We couldn’t send the reset email. Please try again." }, { status: 502 })
    }
  }

  // Keep this response identical for existing and non-existing accounts.
  return NextResponse.json({ ok: true })
}
