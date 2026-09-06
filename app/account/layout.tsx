import type { ReactNode } from "react"
import { UnifiedDashboardLayout } from "@/components/unified-dashboard-layout"

export default function AccountLayout({ children }: { children: ReactNode }) {
  return <UnifiedDashboardLayout>{children}</UnifiedDashboardLayout>
}
