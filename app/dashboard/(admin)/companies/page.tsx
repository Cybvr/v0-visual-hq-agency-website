"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Building2, Database, Loader2, Plus } from "lucide-react"

import { useAuth } from "@/components/auth-provider"
import { UserEditorSheet } from "@/components/dashboard/user-editor-sheet"
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { FilterBar, useFilterBar, type SortOption } from "@/components/dashboard/filter-bar"
import { migrateClientsToOrganizations, type OrganizationMigrationResult } from "@/lib/migrate-organizations"
import { getOrganizations, type Organization } from "@/lib/organizations"
import { tsToMillis } from "@/lib/tasks"
import { getProjects, type Project } from "@/lib/projects"
import { deleteUser, getUsers, userRef, type AppUser } from "@/lib/users"

function fallbackClientName(client: AppUser): string {
  return client.company || client.displayName || client.email || "Unnamed client"
}

/** The workspace a client's projects, and its organization doc, hang off. */
function workspaceId(client: AppUser): string {
  return client.clientId || client.uid
}

type ClientMeta = {
  /** "Brand & Product · Fintech", read off the org's industry and the projects' category. */
  label: string
  projectCount: number
}

const EMPTY_META: ClientMeta = { label: "", projectCount: 0 }

/**
 * Category lives on the client's projects; industry lives on its organization
 * once migrated. Older, unmigrated clients still get a category from their
 * projects, just with no industry to join onto it.
 */
function buildMeta(projects: Project[], organizations: Map<string, Organization>): Map<string, ClientMeta> {
  const meta = new Map<string, ClientMeta>()

  for (const project of projects) {
    if (!project.clientId) continue
    const current = meta.get(project.clientId) ?? { ...EMPTY_META }
    current.projectCount += 1
    meta.set(project.clientId, current)
  }

  for (const [id, current] of meta) {
    const category = [...new Set(projects.filter((p) => p.clientId === id).flatMap((p) => p.category ?? []))]
      .filter(Boolean)
      .join(" & ")
    current.label = [category, organizations.get(id)?.industry].filter(Boolean).join(" · ")
  }

  return meta
}

function projectCountLabel(count: number): string {
  if (count === 0) return "No projects"
  return `${count} ${count === 1 ? "project" : "projects"}`
}

export default function CompaniesPage() {
  const router = useRouter()
  const { viewAsUser } = useAuth()
  const [clients, setClients] = useState<AppUser[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [pendingDelete, setPendingDelete] = useState<AppUser | null>(null)
  const [creating, setCreating] = useState(false)
  const [migrating, setMigrating] = useState(false)
  const [migrationResult, setMigrationResult] = useState<OrganizationMigrationResult | null>(null)
  const [migrationError, setMigrationError] = useState<string | null>(null)

  const orgMap = useMemo(() => new Map(organizations.map((org) => [org.id, org])), [organizations])

  function orgFor(client: AppUser): Organization | undefined {
    return orgMap.get(workspaceId(client))
  }

  function clientName(client: AppUser): string {
    return orgFor(client)?.name || fallbackClientName(client)
  }

  async function fetchClients() {
    setError(null)
    try {
      const [users, allProjects, allOrgs] = await Promise.all([getUsers(), getProjects(), getOrganizations()])
      setProjects(allProjects)
      setOrganizations(allOrgs)
      setClients(users.filter((user) => user.role === "client"))
    } catch (fetchError) {
      console.error("Error fetching clients:", fetchError)
      setError(fetchError instanceof Error ? fetchError.message : "Companies could not be loaded.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchClients()
  }, [])

  const meta = useMemo(() => buildMeta(projects, orgMap), [projects, orgMap])

  function metaFor(client: AppUser): ClientMeta {
    return meta.get(workspaceId(client)) ?? EMPTY_META
  }

  const sorts = useMemo<SortOption<AppUser>[]>(
    () => [
      { value: "name", label: "Name", get: clientName, ascLabel: "A–Z", descLabel: "Z–A" },
      {
        value: "category",
        label: "Category",
        get: (client) => meta.get(workspaceId(client))?.label,
        ascLabel: "A–Z",
        descLabel: "Z–A",
      },
      {
        value: "projects",
        label: "Projects",
        get: (client) => meta.get(workspaceId(client))?.projectCount ?? 0,
        ascLabel: "Fewest",
        descLabel: "Most",
      },
      {
        value: "createdAt",
        label: "Date added",
        get: (client) => tsToMillis(client.createdAt),
        ascLabel: "Oldest",
        descLabel: "Newest",
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [meta, orgMap],
  )

  const search = useMemo(
    () => (client: AppUser) => [
      clientName(client),
      client.displayName,
      client.company,
      client.email,
      client.clientId,
      orgFor(client)?.industry,
      meta.get(workspaceId(client))?.label,
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [meta, orgMap],
  )

  const { results: visibleClients, bar } = useFilterBar({
    items: clients,
    search,
    sorts,
    defaultSort: "name",
  })

  async function handleDelete(client: AppUser) {
    if (deleting) return
    setDeleting(client.uid)
    setError(null)
    try {
      await deleteUser(client.uid)
      setClients((current) => current.filter((item) => item.uid !== client.uid))
      setPendingDelete(null)
    } catch (deleteError) {
      console.error("Error deleting client:", deleteError)
      setError(deleteError instanceof Error ? deleteError.message : "The company could not be removed. Try again.")
    } finally {
      setDeleting(null)
    }
  }

  function handleViewWorkspace(client: AppUser) {
    viewAsUser(client)
    router.push("/dashboard")
  }

  async function handleMigration() {
    if (migrating) return
    setMigrating(true)
    setMigrationResult(null)
    setMigrationError(null)
    try {
      const result = await migrateClientsToOrganizations()
      await fetchClients()
      setMigrationResult(result)
    } catch (migrationFailure) {
      console.error("Error migrating clients to organizations:", migrationFailure)
      setMigrationError(
        migrationFailure instanceof Error
          ? migrationFailure.message
          : "The migration failed. Nothing was changed; check your connection and try again.",
      )
    } finally {
      setMigrating(false)
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-12 pt-6 sm:px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-xl font-semibold">Companies</h1>
        <div className="flex shrink-0 flex-wrap justify-end gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" disabled={loading || migrating}>
                {migrating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Database className="mr-2 h-4 w-4" />}
                {migrating ? "Setting up companies…" : "Set up companies"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Set up a company for every client?</AlertDialogTitle>
                <AlertDialogDescription>
                  Each client without one gets an organization doc for its name, logo, and industry, seeded from its
                  existing account. Clients that already have one are left alone, so this is safe to run again later.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => void handleMigration()}>Set up companies</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button className="shrink-0" onClick={() => setCreating(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Company
          </Button>
        </div>
      </div>

      <div aria-live="polite">
        {migrationResult && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100">
            <p className="font-medium">Companies set up</p>
            <p className="mt-1 text-emerald-800 dark:text-emerald-200">
              {migrationResult.clientsScanned} clients scanned; {migrationResult.organizationsCreated} companies
              created, {migrationResult.organizationsExisting} already had one.
            </p>
          </div>
        )}
        {migrationError && (
          <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            <p className="font-medium">Companies could not be set up</p>
            <p className="mt-1">{migrationError}</p>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          <p>{error}</p>
          <Button variant="outline" size="sm" onClick={() => void fetchClients()}>
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
      ) : clients.length === 0 ? (
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
      ) : (
        <>
          <FilterBar {...bar} placeholder="Search companies" />
          {visibleClients.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center text-sm text-muted-foreground">
                No companies match your search.
              </CardContent>
            </Card>
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {visibleClients.map((client) => {
                const name = clientName(client)
                const { label, projectCount } = metaFor(client)
                const cardProject: Project = {
                  id: client.uid,
                  clientId: workspaceId(client),
                  client: name,
                  title: name,
                  service: label,
                  status: "in-progress",
                  progress: 0,
                  dueDate: "",
                  thumbnailUrl: orgFor(client)?.logoUrl || client.photoURL,
                }

                return (
                  <li key={client.uid}>
                    <ProjectCard
                      project={cardProject}
                      href={`/dashboard/companies/${userRef(client)}`}
                      subtitle={label || "No category yet"}
                      footer={
                        <span className="block truncate text-[11px] text-muted-foreground">
                          {projectCountLabel(projectCount)}
                        </span>
                      }
                      menuLabel={`Options for ${name}`}
                      menu={
                        <>
                          <DropdownMenuItem onSelect={() => router.push(`/dashboard/companies/${userRef(client)}`)}>
                            Open company
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => router.push(`/dashboard/companies/${userRef(client)}/edit`)}
                          >
                            Edit company
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => handleViewWorkspace(client)}>
                            View workspace
                          </DropdownMenuItem>
                          <DropdownMenuItem variant="destructive" onSelect={() => setPendingDelete(client)}>
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
        </>
      )}

      <AlertDialog open={Boolean(pendingDelete)} onOpenChange={(open) => !open && !deleting && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove company?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes {pendingDelete ? clientName(pendingDelete) : "this company"}&apos;s account. Their
              projects, tasks, and documents will remain in the database, but the company will no longer appear here.
              This cannot be undone.
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
      <UserEditorSheet
        open={creating}
        user={null}
        isNew
        fixedRole="client"
        subjectNoun="company"
        onClose={() => setCreating(false)}
        onSaved={(uid) => {
          setCreating(false)
          router.push(`/dashboard/companies/${uid}`)
        }}
      />
    </main>
  )
}
