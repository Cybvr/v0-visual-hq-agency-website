"use client"

import { useRouter } from "next/navigation"

import { useAuth } from "@/components/auth-provider"
import { CompanyPage } from "@/components/company/company-page"
import { useCompany } from "@/components/dashboard/company-context"
import { updateOrganization } from "@/lib/organizations"

export default function DashboardCompanyPage() {
  const router = useRouter()
  const { viewAsUser, isAdmin } = useAuth()
  const {
    client,
    workspaceId,
    name,
    categoryLabel,
    organization,
    people,
    projects,
    invoices,
    contracts,
    estimates,
    reload,
  } = useCompany()

  return (
    <CompanyPage
      company={{
        id: workspaceId,
        name,
        logoUrl: organization?.logoUrl || client.photoURL,
        categoryLabel,
        industry: organization?.industry,
        location: organization?.location,
        website: organization?.website,
        description: organization?.description,
        companySize: organization?.companySize,
        source: organization?.source,
        linkedIn: organization?.linkedIn,
        tags: organization?.tags,
        primaryContactId: organization?.primaryContactId,
        media: organization?.media,
      }}
      people={people.map((person) => ({
        id: person.uid,
        name: person.displayName || person.email || "Unnamed person",
        subtitle: person.email || "No email address",
        role: person.role || "client",
        photoUrl: person.photoURL,
        adminUser: person,
      }))}
      projects={projects}
      invoices={invoices}
      contracts={contracts}
      estimates={estimates}
      admin={
        isAdmin
          ? {
              sharePath: `/portal/${encodeURIComponent(organization?.slug || workspaceId)}`,
              onViewWorkspace: (person) => {
                viewAsUser(person)
                router.push(`/portal/${encodeURIComponent(organization?.slug || workspaceId)}`)
              },
              onMediaChange: async (media) => {
                await updateOrganization(workspaceId, { media })
                await reload()
              },
              onUpdateCompany: async (patch) => {
                await updateOrganization(workspaceId, patch)
                await reload()
              },
              reload,
            }
          : undefined
      }
    />
  )
}
