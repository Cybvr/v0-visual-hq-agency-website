import type React from "react"
import type { Metadata } from "next"

import "./finance.css"

export const metadata: Metadata = {
  title: "VisualCNS Finance — Quality of Earnings, Automated",
  description:
    "AI-powered Quality of Earnings reporting, deal pipeline, portfolio monitoring, and LP reporting for private equity teams.",
}

export default function FinanceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-(--fin-background) text-(--fin-on-surface) min-h-screen font-sans">
      {/* React 19 hoists these into <head> */}
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
      />
      {children}
    </div>
  )
}
