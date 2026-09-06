"use client"

import Link from "next/link"
import { Clock, Rocket } from "lucide-react"

const MORNING = [
  "A fresh start. Make it count.",
  "Early hours, clear head.",
  "First move of the day is yours.",
]
const AFTERNOON = [
  "Midday motivation: You're unstoppable.",
  "Halfway there, keep the pace.",
  "Afternoon push, finish strong.",
]
const EVENING = [
  "Wrapping up: nice work today.",
  "Evening calm, tomorrow's ready.",
  "One last look before you close up.",
]

function greetingFor(hour: number) {
  if (hour < 12) return { label: "Good morning", lines: MORNING }
  if (hour < 18) return { label: "Good afternoon", lines: AFTERNOON }
  return { label: "Good evening", lines: EVENING }
}

export function HomeBanner({ firstName, onTrial }: { firstName: string; onTrial: boolean }) {
  const now = new Date()
  const { label, lines } = greetingFor(now.getHours())
  // Same line all day, changing only when the date does.
  const line = lines[now.getDate() % lines.length]
  const date = new Intl.DateTimeFormat("en", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(now)

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-3 rounded-[14px] bg-card px-4 py-3.5">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-[#efeaff] text-[#5b2bd9]">
        <Rocket className="size-4" aria-hidden="true" />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{date}</p>
        <h1 className="mt-0.5 text-lg font-semibold tracking-[-0.01em]">
          {label}, {firstName}
        </h1>
        <p className="mt-0.5 text-xs text-muted-foreground">{line}</p>
      </div>

      {onTrial && (
        <div className="shrink-0 text-right">
          <p className="flex items-center justify-end gap-1.5 text-xs font-medium text-destructive">
            <Clock className="size-3.5" aria-hidden="true" />
            Trial expired
          </p>
          <Link
            href="/pricing"
            className="mt-0.5 inline-block text-xs font-medium text-primary underline-offset-4 hover:underline"
          >
            Time to get the party started, upgrade now.
          </Link>
        </div>
      )}
    </div>
  )
}
