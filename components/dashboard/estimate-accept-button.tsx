"use client"

import { useState } from "react"
import { Check, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { acceptEstimate, type EstimateStatus } from "@/lib/billing"

export function EstimateAcceptButton({
  estimateId,
  status,
  onAccepted,
}: {
  estimateId: string
  status: EstimateStatus
  onAccepted?: () => void
}) {
  const [accepted, setAccepted] = useState(status === "accepted")
  const [accepting, setAccepting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (accepted) {
    return (
      <p role="status" className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700">
        <Check className="size-4" aria-hidden="true" />
        Estimate accepted
      </p>
    )
  }

  if (status !== "sent") return null

  async function handleAccept() {
    if (accepting) return
    setAccepting(true)
    setError(null)

    try {
      await acceptEstimate(estimateId)
      setAccepted(true)
      onAccepted?.()
    } catch (acceptError) {
      console.error("Error accepting estimate:", acceptError)
      setError("Couldn’t accept this estimate. Try again.")
      setAccepting(false)
    }
  }

  return (
    <div className="w-full text-right sm:w-auto">
      <Button
        type="button"
        size="lg"
        onClick={handleAccept}
        disabled={accepting}
        className="w-full sm:w-auto"
      >
        {accepting && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
        {accepting ? "Accepting…" : "Accept estimate"}
      </Button>
      {error && <p role="alert" className="mt-2 text-sm text-red-700">{error}</p>}
    </div>
  )
}
