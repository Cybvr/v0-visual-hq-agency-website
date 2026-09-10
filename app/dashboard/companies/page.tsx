"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Building2, Plus } from "lucide-react"
import type { Timestamp } from "firebase/firestore"

import { useAuth } from "@/components/auth-provider"
import { CompanyCreateSheet } from "@/components/dashboard/company-create-sheet"
import { ProjectCard } from "@/components/project-card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { FilterBar, useFilterBar, type SortOption } from "@/components/dashboard/filter-bar"
import { deleteOrganization, getOrganizations, type Organization } from "@/lib/organizations"
import { formatTimestamp, tsToMillis } from "@/lib/tasks"
import { getProjects, type Project } from "@/lib/projects"
import { deleteUser, getUsers, userRef, type AppUser } from "@/lib/users"

/**
 * A company as this page shows it: one card per real company, sourced from the
 * organizations collection and joined to the client account only for the
 * actions that still need one (open the workspace, remove it). Rows are folded
 * by name so companies that were saved twice before the name check existed
 * collapse into a single card.
 */
type CompanyRow = {
  /** The workspace id: the organization doc id, and the client user's companyId. */
  id: string
  name: string
  label: string
  projectCount: number
  logoUrl?: string
  createdAt?: Timestamp
  /** The client account behind this company, when there is one. */
  user?: AppUser
  hasOrg: boolean
}

function normalize(value?: string): string {
  return (value ?? "").trim().toLowerCase()
}

export default function CompaniesPage() {
  const router = useRouter()
  const { viewAsUser } = useAuth()
  const [users, setUsers] = useState<AppUser[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [pendingDelete, setPendingDelete] = useState<CompanyRow | null>(null)
  const [creating, setCreating] = useState(false)

  async function fetchCompanies() {
    setError(null)
    try {
      const [allUsers, allProjects, allOrgs] = await Promise.all([getUsers(), getProjects(), getOrganizations()])
      setUsers(allUsers)
      setProjects(allProjects)
      setOrganizations(allOrgs)
    } catch (fetchError) {
      console.error("Error fetching companies:", fetchError)
      setError(fetchError instanceof Error ? fetchError.message : "Companies could not be loaded.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchCompanies()
  }, [])

  /** Project count and the "category · industry" line, keyed by workspace id. */
  const metaByWorkspace = useMemo(() => {
    const orgById = new Map(organizations.map((org) => [org.id, org]))
    const meta = new Map<string, { label: string; projectCount: number }>()
    for (const project of projects) {
      if (!project.companyId) continue
      const current = meta.get(project.companyId) ?? { label: "", projectCount: 0 }
      current.projectCount += 1
      meta.set(project.companyId, current)
    }
    for (const [id, current] of meta) {
      const category = [...new Set(projects.filter((p) => p.companyId === id).flatMap((p) => p.category ?? []))]
        .filter(Boolean)
        .join(" & ")
      current.label = [category, orgById.get(id)?.industry].filter(Boolean).join(" · ")
    }
    return meta
  }, [projects, organizations])

  /** One row per company name, drawn from organizations first and legacy client accounts second. */
  const companies = useMemo(() => {
    const userByWorkspace = new Map<string, AppUser>()
    for (const user of users) {
      if (user.role === "client") userByWorkspace.set(user.companyId || user.uid, user)
    }
    const orgWorkspaces = new Set(organizations.map((org) => org.id))

    const rows = new Map<string, CompanyRow>()
    const add = (row: CompanyRow) => {
      const key = normalize(row.name) || row.id
      const existing = rows.get(key)
      if (!existing) { rows.set(key, row); return }
      // Prefer the record that has an organization, then the older one; keep any user we found.
      const keep = existing.hasOrg || !row.hasOrg
        ? existing
        : row
      keep.user = keep.user ?? existing.user ?? row.user
      keep.logoUrl = keep.logoUrl || existing.logoUrl || row.logoUrl
      rows.set(key, keep)
    }

    for (const org of organizations) {
      const meta = metaByWorkspace.get(org.id)
      add({
        id: org.id,
        name: org.name || userByWorkspace.get(org.id)?.company || "Unnamed company",
        label: meta?.label ?? "",
        projectCount: meta?.projectCount ?? 0,
        logoUrl: org.logoUrl || userByWorkspace.get(org.id)?.photoURL,
        createdAt: org.createdAt,
        user: userByWorkspace.get(org.id),
        hasOrg: true,
      })
    }
    // Legacy client accounts that never got an organization doc.
    for (const [workspace, user] of userByWorkspace) {
      if (orgWorkspaces.has(workspace)) continue
      const meta = metaByWorkspace.get(workspace)
      add({
        id: workspace,
        name: user.company || user.displayName || user.email || "Unnamed company",
        label: meta?.label ?? "",
        projectCount: meta?.projectCount ?? 0,
        logoUrl: user.photoURL,
        createdAt: user.createdAt,
        user,
        hasOrg: false,
      })
    }
    return [...rows.values()]
  }, [users, organizations, metaByWorkspace])

  const sorts = useMemo<SortOption<CompanyRow>[]>(
    () => [
      { value: "name", label: "Name", get: (row) => row.name, ascLabel: "A–Z", descLabel: "Z–A" },
      { value: "category", label: "Category", get: (row) => row.label, ascLabel: "A–Z", descLabel: "Z–A" },
      { value: "projects", label: "Projects", get: (row) => row.projectCount, ascLabel: "Fewest", descLabel: "Most" },
      { value: "createdAt", label: "Date added", get: (row) => tsToMillis(row.createdAt), ascLabel: "Oldest", descLabel: "Newest" },
    ],
    [],
  )

  const search = useMemo(() => (row: CompanyRow) => [row.name, row.label, row.id], [])

  const { results: visibleCompanies, bar } = useFilterBar({
    items: companies,
    search,
    sorts,
    defaultSort: "name",
  })

  async function handleDelete(row: CompanyRow) {
    if (deleting) return
    setDeleting(row.id)
    setError(null)
    try {
      if (row.hasOrg) await deleteOrganization(row.id)
      if (row.user) await deleteUser(row.user.uid)
      setPendingDelete(null)
      await fetchCompanies()
    } catch (deleteError) {
      console.error("Error deleting company:", deleteError)
      setError(deleteError instanceof Error ? deleteError.message : "The company could not be removed. Try again.")
    } finally {
      setDeleting(null)
    }
  }

  function companyHref(row: CompanyRow): string {
    // The detail route resolves a client account by ref, so use the user's when
    // there is one; the raw workspace id still resolves for org-only rows.
    return `/dashboard/companies/${row.user ? userRef(row.user) : row.id}`
  }

  function handleViewWorkspace(row: CompanyRow) {
    if (!row.user) return
    viewAsUser(row.user)
    router.push("/dashboard")
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-12 pt-4 sm:px-6">
      <FilterBar
        {...bar}
        placeholder="Search companies"
        actions={
          <Button onClick={() => setCreating(true)}><Plus className="h-4 w-4" />Add Company</Button>
        }
      />

      {error && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          <p>{error}</p>
          <Button variant="outline" size="sm" onClick={() => void fetchCompanies()}>
            Try again
          </Button>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4" aria-label="Loading companies">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="aspect-[4/3] rounded-[14px]" />
          ))}
        </div>
      ) : companies.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-16 text-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-muted">
              <Building2 className="h-5 w-5 text-muted-foreground" />
            </span>
            <h2 className="mt-4 font-medium">No companies yet</h2>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Add a company to create a workspace for their projects, tasks, and documents.
            </p>
            <Button className="mt-5" onClick={() => setCreating(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Company
            </Button>
          </CardContent>
        </Card>
      ) : visibleCompanies.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-sm text-muted-foreground">
            No companies match your search.
          </CardContent>
        </Card>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {visibleCompanies.map((row) => {
            const cardProject: Project = {
              id: row.id,
              companyId: row.id,
              client: row.name,
              title: row.name,
              service: row.label,
              status: "in-progress",
              progress: 0,
              dueDate: "",
              thumbnailUrl: row.logoUrl,
            }

            return (
              <li key={row.id}>
                <ProjectCard
                  project={cardProject}
                  href={companyHref(row)}
                  subtitle={row.label || "No category yet"}
                  footer={
                    <span className="block truncate text-[11px] text-muted-foreground">
                      Added {formatTimestamp(row.createdAt)}
                    </span>
                  }
                  menuLabel={`Options for ${row.name}`}
                  menu={
                    <>
                      <DropdownMenuItem onSelect={() => router.push(companyHref(row))}>
                        Open company
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => router.push(`${companyHref(row)}/edit`)}>
                        Edit company
                      </DropdownMenuItem>
                      {row.user && (
                        <DropdownMenuItem onSelect={() => handleViewWorkspace(row)}>
                          View workspace
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem variant="destructive" onSelect={() => setPendingDelete(row)}>
                        Remove company
                      </DropdownMenuItem>
                    </>
                  }
                />
              </li>
            )
          })}
        </ul>
      )}

      <AlertDialog open={Boolean(pendingDelete)} onOpenChange={(open) => !open && !deleting && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove company?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes {pendingDelete?.name ?? "this company"}&apos;s account. Their projects, tasks, and documents
              will remain in the database, but the company will no longer appear here. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting !== null}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleting !== null}
              onClick={(event) => {
                event.preventDefault()
                if (pendingDelete) void handleDelete(pendingDelete)
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Removing…" : "Remove Company"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Creating stays a sheet; the new company's own page opens once it saves. */}
      <CompanyCreateSheet
        open={creating}
        onClose={() => setCreating(false)}
        onSaved={(workspaceId) => {
          setCreating(false)
          router.push(`/dashboard/companies/${workspaceId}`)
        }}
      />
    </main>
  )
}
