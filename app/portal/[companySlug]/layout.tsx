import type { ReactNode } from "react"
import { PortalProvider } from "@/components/portal/portal-provider"
export default function CompanyPortalLayout({ children }: { children: ReactNode }) { return <PortalProvider>{children}</PortalProvider> }
