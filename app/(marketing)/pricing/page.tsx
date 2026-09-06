import type { Metadata } from "next"
import { PricingContent } from "./pricing-content"

export const metadata: Metadata = {
  title: "VisualHQ Pricing",
  description: "VisualHQ pricing.",
}

export default function PricingPage() {
  return <PricingContent />
}
