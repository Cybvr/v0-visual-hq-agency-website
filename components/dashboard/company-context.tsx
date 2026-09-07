"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { useParams } from "next/navigation"

import { getOrganization, type Organization } from "@/lib/organizations"
import { getProjectsByClientId, type Project } from "@/lib/projects"
import { getUserByRef, getUsersByClientId, type AppUser } from "@/lib/users"

export function clientName(client: AppUser): string {
  return client.company || client.displayName || client.email || "Unnamed company"
}

/** A person with neither a name nor an email is just the placeholder account a new company starts with. */
function hasProfile(person: AppUser): boolean {
  return Boolean(person.displayName?.trim() || person.email?.trim())
}

/** Industry off the organization, category off the projects, joined into one line. */
function buildCategoryLabel(projects: Project[], org: Organization | null): string {
  const category = [...new Set(projects.flatMap((project) => project.category ?? []))].filter(Boolean).join(" & ")
  return [org?.industry, category].filter(Boolean).join(" · ")
}

type CompanyState = {
  loading: boolean
  error: string | null
  client: AppUser | null
  organization: Organization | null
  people: AppUser[]
  projects: Project[]
  workspaceId: string
  name: string
  categoryLabel: string
  reload: () => Promise<void>
}

const CompanyContext = createContext<CompanyState | null>(null)

/**
 * Loads the company, its organization doc, people, and projects once for the
 * whole `[slug]` route tree, so the view page and the edit page share one
 * fetch instead of each doing their own.
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
      setPeople(foundPeople.filter(hasProfile))
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

  const value = useMemo<CompanyState>(() => {
    const workspaceId = client ? client.clientId || client.uid : ""
    return {
      loading,
      error,
      client,
      organization,
      people,
      projects,
      workspaceId,
      name: client ? organization?.name || clientName(client) : "",
      categoryLabel: buildCategoryLabel(projects, organization),
      reload: load,
    }
  }, [loading, error, client, organization, people, projects, load])

  return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>
}

/** Raw state, loading/error included. Use this in the layout, which decides what to render while loading or on error. */
export function useCompanyState(): CompanyState {
  const context = useContext(CompanyContext)
  if (!context) throw new Error("useCompanyState must be used inside a CompanyProvider")
  return context
}

/** For the pages inside the layout, which only ever mount once the company has loaded. */
export function useCompany(): Omit<CompanyState, "client" | "loading" | "error"> & { client: AppUser } {
  const context = useCompanyState()
  if (!context.client) throw new Error("useCompany was called before the company finished loading")
  return { ...context, client: context.client }
}
