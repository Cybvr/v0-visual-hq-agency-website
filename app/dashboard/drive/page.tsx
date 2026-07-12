"use client"

import { useAuth } from "@/components/auth-provider"
import AdminDrivePage from "@/components/admin/drive-page"
import { ClientSectionPage } from "@/components/dashboard/client-section-page"

export default function DrivePage() {
  const { isAdmin, isImpersonating } = useAuth()
  return isAdmin && !isImpersonating ? <AdminDrivePage /> : <ClientSectionPage section="drive" />
}
