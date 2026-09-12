"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { useAuth } from "@/components/auth-provider"
import { CompanyPage } from "@/components/company/company-page"
import { useCompany } from "@/components/dashboard/company-context"
import { updateOrganization } from "@/lib/organizations"
import { getUsers, updateUser, type AppUser } from "@/lib/users"

export default function DashboardCompanyPage() {
  const router = useRouter()
  const { viewAsUser, isAdmin } = useAuth()
  const [allContacts, setAllContacts] = useState<AppUser[]>([])

  useEffect(() => {
    if (!isAdmin) return
    getUsers().then(setAllContacts).catch(() => setAllContacts([]))
  }, [isAdmin])
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
    documents,
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
      allContacts={allContacts.map((person) => ({
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
      documents={documents}
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
              onSelectPrimaryContact: async (contactId) => {
                const contact = allContacts.find((person) => person.uid === contactId)
                // Attach the contact to this company if they aren't already, then set them primary.
                if (contact && contact.companyId !== workspaceId) {
                  await updateUser(contactId, { companyId: workspaceId })
                }
                await updateOrganization(workspaceId, { primaryContactId: contactId })
                await reload()
              },
              reload,
            }
          : undefined
      }
    />
  )
}
