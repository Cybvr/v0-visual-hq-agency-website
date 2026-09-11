import type { ReactNode } from "react"
import { PortalProvider } from "@/components/portal/portal-provider"
import { AgentProvider } from "@/components/agent/agent-context"
export default function CompanyPortalLayout({ children }: { children: ReactNode }) {
  return <PortalProvider><AgentProvider>{children}</AgentProvider></PortalProvider>
}
