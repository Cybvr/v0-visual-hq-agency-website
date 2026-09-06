import type React from "react"

// The detail route renders pf-* tiles without going through PortfolioSection,
// so it pulls the same stylesheet in directly.
import "../../components/portfolio.css"

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
