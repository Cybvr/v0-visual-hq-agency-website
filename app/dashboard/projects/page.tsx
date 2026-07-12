"use client"

import { useAuth } from "@/components/auth-provider"
import AdminProjectsPage from "@/components/admin/projects-page"
import { ClientSectionPage } from "@/components/dashboard/client-section-page"

export default function ProjectsPage() {
  const { isAdmin, isImpersonating } = useAuth()
  return isAdmin && !isImpersonating ? <AdminProjectsPage /> : <ClientSectionPage section="projects" />
}
