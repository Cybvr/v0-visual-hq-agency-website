"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Building2, Plus } from "lucide-react"

import { useAuth } from "@/components/auth-provider"
import { UserEditorSheet } from "@/components/admin/user-editor-sheet"
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
import { tsToMillis } from "@/lib/tasks"
import type { Project } from "@/lib/projects"
import { deleteUser, getUsers, type AppUser } from "@/lib/users"

function clientName(client: AppUser): string {
  return client.company || client.displayName || client.email || "Unnamed client"
}

const CLIENT_SORTS: SortOption<AppUser>[] = [
  { value: "name", label: "Name", get: clientName, ascLabel: "A–Z", descLabel: "Z–A" },
  { value: "email", label: "Email", get: (client) => client.email, ascLabel: "A–Z", descLabel: "Z–A" },
  {
    value: "createdAt",
    label: "Date added",
    get: (client) => tsToMillis(client.createdAt),
    ascLabel: "Oldest",
    descLabel: "Newest",
  },
]

function searchClient(client: AppUser) {
  return [clientName(client), client.displayName, client.company, client.email, client.clientId]
}

function clientCardProject(client: AppUser): Project {
  const name = clientName(client)
  return {
    id: client.uid,
    clientId: client.clientId || client.uid,
    client: name,
    title: name,
    service: client.email || "No email address",
    status: "in-progress",
    progress: 0,
    dueDate: "",
    thumbnailUrl: client.photoURL,
  }
}

export default function ClientsAdminPage() {
  const router = useRouter()
  const { viewAsUser } = useAuth()
  const [clients, setClients] = useState<AppUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [pendingDelete, setPendingDelete] = useState<AppUser | null>(null)
  const [selectedId, setSelectedId] = useState<string | "new" | null>(null)

  async function fetchClients() {
    setError(null)
    try {
      const users = await getUsers()
      setClients(
        users
          .filter((user) => user.role === "client")
          .sort((first, second) => clientName(first).localeCompare(clientName(second))),
      )
    } catch (fetchError) {
      console.error("Error fetching clients:", fetchError)
      setError(fetchError instanceof Error ? fetchError.message : "Clients could not be loaded.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchClients()
  }, [])

  async function handleDelete(client: AppUser) {
    if (deleting) return
    setDeleting(client.uid)
    setError(null)
    try {
      await deleteUser(client.uid)
      setClients((current) => current.filter((item) => item.uid !== client.uid))
      if (selectedId === client.uid) setSelectedId(null)
      setPendingDelete(null)
    } catch (deleteError) {
      console.error("Error deleting client:", deleteError)
      setError(deleteError instanceof Error ? deleteError.message : "The client could not be removed. Try again.")
    } finally {
      setDeleting(null)
    }
  }

  async function handleSaved() {
    await fetchClients()
    setSelectedId(null)
  }

  function handleViewWorkspace(client: AppUser) {
    viewAsUser(client)
    router.push("/dashboard")
  }

  const { results: visibleClients, bar } = useFilterBar({
    items: clients,
    search: searchClient,
    sorts: CLIENT_SORTS,
    defaultSort: "name",
  })

  const selectedClient =
    typeof selectedId === "string" && selectedId !== "new"
      ? clients.find((client) => client.uid === selectedId) ?? null
      : null

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-12 pt-6 sm:px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Clients</h1>
          {!loading && !error && (
            <p className="mt-1 text-sm text-muted-foreground">
              {clients.length} client {clients.length === 1 ? "workspace" : "workspaces"}
            </p>
          )}
        </div>
        <Button className="shrink-0" onClick={() => setSelectedId("new")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Client
        </Button>
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
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4" aria-label="Loading clients">
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
            <h2 className="mt-4 font-medium">No clients yet</h2>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Add a client to create a workspace for their projects, tasks, and documents.
            </p>
            <Button className="mt-5" onClick={() => setSelectedId("new")}>
              <Plus className="mr-2 h-4 w-4" />
              Add Client
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
        <FilterBar {...bar} placeholder="Search clients" />
        {visibleClients.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center text-sm text-muted-foreground">
              No clients match your search.
            </CardContent>
          </Card>
        ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {visibleClients.map((client) => {
            const name = clientName(client)
            const contactName = client.displayName && client.displayName !== name ? client.displayName : ""
            const cardProject = clientCardProject(client)

            return (
              <li key={client.uid}>
                <ProjectCard
                  project={cardProject}
                  subtitle={client.email || "No email address"}
                  onClick={() => setSelectedId(client.uid)}
                  footer={
                    <span className="block truncate text-[11px] text-muted-foreground">
                      {contactName || "Client workspace"}
                    </span>
                  }
                  menuLabel={`Options for ${name}`}
                  menu={
                    <>
                      <DropdownMenuItem onSelect={() => setSelectedId(client.uid)}>Edit client</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => handleViewWorkspace(client)}>View workspace</DropdownMenuItem>
                      <DropdownMenuItem variant="destructive" onSelect={() => setPendingDelete(client)}>
                        Remove client
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
            <AlertDialogTitle>Remove client?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes {pendingDelete ? clientName(pendingDelete) : "this client"}&apos;s client account. Their
              projects, tasks, and documents will remain in the database, but the client will no longer appear here.
              This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting !== null}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleting !== null}
              onClick={() => pendingDelete && void handleDelete(pendingDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Removing…" : "Remove Client"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <UserEditorSheet
        open={selectedId !== null}
        user={selectedId === "new" ? null : selectedClient}
        isNew={selectedId === "new"}
        fixedRole="client"
        subjectNoun="client"
        onClose={() => setSelectedId(null)}
        onSaved={handleSaved}
      />
    </main>
  )
}
