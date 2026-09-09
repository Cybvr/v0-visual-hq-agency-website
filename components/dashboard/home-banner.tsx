"use client"

import Link from "next/link"

export function HomeBanner({ onTrial }: { onTrial: boolean }) {
  if (!onTrial) return null

  return (
    <p className="rounded-[14px] bg-card px-4 py-3.5 text-sm font-semibold">
      You don&apos;t have an active subscription.{" "}
      <Link href="/pricing" className="underline underline-offset-4">
        Start your 7 day free trial now
      </Link>
    </p>
  )
}
