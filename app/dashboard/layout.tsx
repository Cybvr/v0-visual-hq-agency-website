import type { ReactNode } from "react"
import { UnifiedDashboardLayout } from "@/components/unified-dashboard-layout"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <UnifiedDashboardLayout>{children}</UnifiedDashboardLayout>
}
