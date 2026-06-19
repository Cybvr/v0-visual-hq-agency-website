import type { Metadata } from "next"
import { RateCardContent } from "./rate-card-content"

export const metadata: Metadata = {
  title: "VisualHQ Rate Card",
  description: "VisualHQ rate card.",
}

export default function RateCardPage() {
  return <RateCardContent />
}
