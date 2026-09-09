import type { ReactNode } from "react"
import type { Metadata } from "next"

import { DashboardDocumentTitle } from "@/components/dashboard/dashboard-document-title"
import { UnifiedDashboardLayout } from "@/components/unified-dashboard-layout"

export const metadata: Metadata = {
  title: "Dashboard | VisualCNS",
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <UnifiedDashboardLayout>
      <DashboardDocumentTitle />
      {children}
    </UnifiedDashboardLayout>
  )
}
