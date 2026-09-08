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
  const clientSlug = client.slug || workspaceId

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
              editHref: `/dashboard/companies/${clientSlug}/edit`,
              sharePath: `/dashboard/${clientSlug}`,
              publicPath: organization?.slug ? `/${organization.slug}` : undefined,
              onViewWorkspace: (person) => {
                viewAsUser(person)
                router.push("/dashboard")
              },
              onMediaChange: async (media) => {
                await updateOrganization(workspaceId, { media })
                await reload()
              },
              reload,
            }
          : undefined
      }
    />
  )
}
