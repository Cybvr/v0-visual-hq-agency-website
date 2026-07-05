"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const { user, loading, signInWithGoogle } = useAuth()
  const [signingIn, setSigningIn] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && user) router.replace("/admin")
  }, [loading, user, router])

  async function handleSignIn() {
    setSigningIn(true)
    setError(null)
    try {
      await signInWithGoogle()
      router.replace("/admin")
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sign-in failed. Please try again."
      // Popup closed by user isn't an error worth showing loudly
      if (message.includes("popup-closed-by-user") || message.includes("cancelled-popup-request")) {
        setError(null)
      } else {
        setError(message)
      }
    } finally {
      setSigningIn(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <CardContent className="flex flex-col items-center gap-6 px-6 py-10">
          <Image src="/visualhqlogo.svg" alt="VisualHQ" width={40} height={40} />
          <div className="text-center">
            <h1 className="text-lg font-semibold">Sign in to VisualHQ</h1>
            <p className="mt-1 text-sm text-muted-foreground">Admin access only</p>
          </div>

          <Button
            variant="outline"
            className="w-full gap-3"
            onClick={handleSignIn}
            disabled={loading || signingIn}
          >
            {signingIn || loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleIcon />}
            Continue with Google
          </Button>

          {error && <p className="text-center text-sm text-destructive">{error}</p>}
        </CardContent>
      </Card>
    </div>
  )
}
