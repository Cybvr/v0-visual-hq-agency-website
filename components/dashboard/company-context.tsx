"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { useParams } from "next/navigation"

import { getOrganization, type Organization } from "@/lib/organizations"
import { getProjectsByClientId, type Project } from "@/lib/projects"
import { getUserByRef, getUsersByClientId, type AppUser } from "@/lib/users"

export function clientName(client: AppUser): string {
  return client.company || client.displayName || client.email || "Unnamed company"
}

/** Category off the projects, industry off the organization, joined into one line. */
function buildCategoryLabel(projects: Project[], org: Organization | null): string {
  const category = [...new Set(projects.flatMap((project) => project.category ?? []))].filter(Boolean).join(" & ")
  return [org?.industry, category].filter(Boolean).join(" · ")
}

type CompanyContextValue = {
  client: AppUser
  organization: Organization | null
  people: AppUser[]
  projects: Project[]
  workspaceId: string
  name: string
  categoryLabel: string
  reload: () => Promise<void>
}

const CompanyContext = createContext<CompanyContextValue | null>(null)

/**
 * Loads the company (its user record, organization doc, people, and projects)
 * once for the whole `[slug]` route tree, so the view page and the edit page
 * share the same fetch instead of each doing their own.
 */
export function CompanyProvider({ children }: { children: ReactNode }) {
  const params = useParams<{ slug: string }>()
  const ref = params?.slug ?? ""

  const [client, setClient] = useState<AppUser | null>(null)
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [people, setPeople] = useState<AppUser[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!ref) return
    setError(null)
    try {
      const found = await getUserByRef(ref)
      if (!found) {
        setError("That company doesn't exist, or it has been removed.")
        return
      }
      const workspace = found.clientId || found.uid
      const [foundOrg, foundPeople, foundProjects] = await Promise.all([
        getOrganization(workspace),
        getUsersByClientId(workspace),
        getProjectsByClientId(workspace),
      ])
      setClient(found)
      setOrganization(foundOrg)
      setPeople(foundPeople)
      setProjects(foundProjects)
    } catch (loadError) {
      console.error("Error loading company:", loadError)
      setError(loadError instanceof Error ? loadError.message : "This company could not be loaded.")
    } finally {
      setLoading(false)
    }
  }, [ref])

  useEffect(() => {
    void load()
  }, [load])

  const value = useMemo<CompanyContextValue | null>(() => {
    if (!client) return null
    const workspaceId = client.clientId || client.uid
    return {
      client,
      organization,
      people,
      projects,
      workspaceId,
      name: organization?.name || clientName(client),
      categoryLabel: buildCategoryLabel(projects, organization),
      reload: load,
    }
  }, [client, organization, people, projects, load])

  return { loading, error, value, children } as never // replaced below
}
