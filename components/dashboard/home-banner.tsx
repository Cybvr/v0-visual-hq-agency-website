"use client"

import Link from "next/link"
import { Rocket } from "lucide-react"

import { Button } from "@/components/ui/button"

function greetingFor(hour: number): string {
  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"
  return "Good evening"
}

export function HomeBanner({ firstName, onTrial }: { firstName: string; onTrial: boolean }) {
  const label = greetingFor(new Date().getHours())

  return (
    <div className="flex items-center gap-3 rounded-[14px] bg-card px-4 py-3.5">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-[#efeaff] text-[#5b2bd9]">
        <Rocket className="size-4" aria-hidden="true" />
      </span>

      <div className="min-w-0 flex-1">
        <h1 className="text-lg font-semibold tracking-[-0.01em]">
          {label}, {firstName}
        </h1>
        {onTrial && (
          <span className="mt-1 inline-flex items-center rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive">
            Trial expired
          </span>
        )}
      </div>

      {onTrial && (
        <Button asChild size="sm" className="shrink-0 rounded-full">
          <Link href="/pricing">Upgrade</Link>
        </Button>
      )}
    </div>
  )
}
