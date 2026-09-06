"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Loader2, Pencil, Plus, Share2, User as UserIcon } from "lucide-react"
import { toast } from "sonner"

import { useAuth } from "@/components/auth-provider"
import { clientName } from "@/components/dashboard/client-header"
import { UserEditorSheet } from "@/components/dashboard/user-editor-sheet"
import { ProjectCard, ProjectCover } from "@/components/project-card"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getOrganization, type Organization } from "@/lib/organizations"
import { getProjectsByClientId, projectSlug, projectStatusMeta, type Project } from "@/lib/projects"
import { deleteUser, getUserByRef, getUsersByClientId, userRef, type AppUser } from "@/lib/users"
import { cn } from "@/lib/utils"

/** Category still comes off the projects; industry comes off the organization once it exists. */
function categoryLabel(projects: Project[], org: Organization | null): string {
  const category = [...new Set(projects.flatMap((project) => project.category ?? []))].filter(Boolean).join(" & ")
  return [category, org?.industry].filter(Boolean).join(" · ")
}

function Fact({ label, value, emptyLabel = "—" }: { label: string; value: string; emptyLabel?: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className={cn("mt-1 text-sm", !value && "italic text-muted-foreground/70")}>{value || emptyLabel}</dd>
    </div>
  )
}

function personName(person: AppUser): string {
  return person.displayName || person.email || "Unnamed person"
}

export default function CompanyPage() {
  const params = useParams<{ slug: string }>()
  const ref = params?.slug ?? ""
  const router = useRouter()
  const { viewAsUser } = useAuth()

  const [client, setClient] = useState<AppUser | null>(null)
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [people, setPeople] = useState<AppUser[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [shareOpen, setShareOpen] = useState(false)
  const [addingPerson, setAddingPerson] = useState(false)
  const [editingPerson, setEditingPerson] = useState<AppUser | null>(null)
  const [pendingRemove, setPendingRemove] = useState<AppUser | null>(null)
  const [removing, setRemoving] = useState(false)

  const load = useCallback(async () => {
    if (!ref) return
    setError(null)
    try {
      const found = await getUserByRef(ref)
      if (!found) {
        setError("That company doesn't exist, or it has been removed.")
        return
      }
      setClient(found)
      const workspace = found.clientId || found.uid
      const [foundProjects, foundOrg, foundPeople] = await Promise.all([
        getProjectsByClientId(workspace),
        getOrganization(workspace),
        getUsersByClientId(workspace),
      ])
      setProjects(foundProjects)
      setOrganization(foundOrg)
      setPeople(foundPeople)
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

  async function handleRemovePerson() {
    if (!pendingRemove || removing) return
    setRemoving(true)
    try {
      await deleteUser(pendingRemove.uid)
      setPeople((current) => current.filter((person) => person.uid !== pendingRemove.uid))
      setPendingRemove(null)
    } catch (removeError) {
      console.error("Error removing person:", removeError)
    } finally {
      setRemoving(false)
    }
  }

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </main>
    )
  }

  if (error || !client) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <Link
          href="/dashboard/companies"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground outline-none transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back
        </Link>
        <p className="mt-8 text-sm text-muted-foreground">{error ?? "This company could not be loaded."}</p>
      </main>
    )
  }

  const name = organization?.name || clientName(client)
  const workspaceId = client.clientId || client.uid
  const newProjectHref = `/dashboard/projects?new=1&clientId=${encodeURIComponent(workspaceId)}`
  const clientSlug = client.slug || workspaceId
  const shareUrl =
    typeof window !== "undefined" ? `${window.location.origin}/dashboard/${clientSlug}` : `/dashboard/${clientSlug}`
  const coverProject: Project = {
    id: client.uid,
    clientId: workspaceId,
    client: name,
    title: name,
    service: "",
    status: "in-progress",
    progress: 0,
    dueDate: "",
    thumbnailUrl: organization?.logoUrl || client.photoURL,
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-6 sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/dashboard/companies"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground outline-none transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back
        </Link>
        <div className="flex shrink-0 items-center gap-2">
          <Button asChild size="sm">
            <Link href={`/dashboard/companies/${userRef(client)}/edit`}>
              <Pencil className="size-4" />
              Edit
            </Link>
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShareOpen(true)}>
            <Share2 className="size-4" />
            Share
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[300px_1fr] lg:items-start">
        <Card>
          <CardContent className="pt-6">
            <div className="size-20 overflow-hidden rounded-2xl">
              <ProjectCover project={coverProject} />
            </div>
            <h1 className="mt-4 text-xl font-semibold">{name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{categoryLabel(projects, organization) || "No category yet"}</p>

            <div className="mt-6 space-y-4 border-t border-border pt-4">
              <Fact label="Industry" value={organization?.industry ?? ""} emptyLabel="Not set" />
              <Fact
                label="People"
                value={`${people.length} ${people.length === 1 ? "person" : "people"}`}
              />
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="people">
          <TabsList>
            <TabsTrigger value="people">People</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
          </TabsList>

          <TabsContent value="people" className="mt-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-baseline gap-2">
                <h2 className="text-base font-semibold">People</h2>
                <span className="text-sm text-muted-foreground">{people.length}</span>
              </div>
              <Button onClick={() => setAddingPerson(true)}>
                <Plus className="size-4" />
                Add person
              </Button>
            </div>

            <ul className="mt-4 divide-y divide-border rounded-lg border border-border">
              {people.map((person) => (
                <li key={person.uid} className="flex items-center gap-3 px-4 py-3">
                  <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted">
                    {person.photoURL ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={person.photoURL} alt="" className="size-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <UserIcon className="size-4 text-muted-foreground" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{personName(person)}</p>
                    <p className="truncate text-xs text-muted-foreground">{person.email || "No email address"}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium capitalize text-muted-foreground">
                    {person.role || "client"}
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8 shrink-0" aria-label={`Options for ${personName(person)}`}>
                        <Pencil className="size-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={() => setEditingPerson(person)}>Edit person</DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => {
                          viewAsUser(person)
                          router.push("/dashboard")
                        }}
                      >
                        View workspace
                      </DropdownMenuItem>
                      <DropdownMenuItem variant="destructive" onSelect={() => setPendingRemove(person)}>
                        Remove person
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </li>
              ))}
            </ul>
          </TabsContent>

          <TabsContent value="projects" className="mt-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-baseline gap-2">
                <h2 className="text-base font-semibold">Projects</h2>
                <span className="text-sm text-muted-foreground">{projects.length}</span>
              </div>
              <Button asChild>
                <Link href={newProjectHref}>
                  <Plus className="size-4" />
                  New project
                </Link>
              </Button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-3">
              {projects.map((project) => {
                const meta = projectStatusMeta[project.status] ?? projectStatusMeta["in-progress"]
                return (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    href={`/dashboard/projects/${projectSlug(project)}`}
                    footer={
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium", meta.className)}>
                          {meta.label}
                        </span>
                        {project.isCaseStudy && (
                          <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[11px] font-medium text-violet-700 dark:bg-violet-950 dark:text-violet-200">
                            Case study
                          </span>
                        )}
                      </div>
                    }
                  />
                )
              })}

              <Link
                href={newProjectHref}
                className="group flex min-h-[180px] flex-col items-center justify-center gap-3 rounded-[14px] border border-dashed border-border bg-card p-4 text-center outline-none transition-colors hover:border-foreground/30 hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <span className="flex size-9 items-center justify-center rounded-full bg-foreground text-background transition-transform group-hover:scale-105">
                  <Plus className="size-4" aria-hidden="true" />
                </span>
                <span className="text-sm font-medium text-foreground">Add project</span>
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Share company workspace</DialogTitle>
            <DialogDescription>Share direct access to {name}&apos;s dashboard.</DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2 pt-2">
            <Input
              readOnly
              value={shareUrl}
              className="font-mono text-xs"
              onClick={(event) => (event.target as HTMLInputElement).select()}
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="shrink-0"
              onClick={() => {
                void navigator.clipboard.writeText(shareUrl)
                toast.success("Link copied to clipboard")
              }}
            >
              Copy link
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <UserEditorSheet
        open={addingPerson}
        user={null}
        isNew
        fixedRole="client"
        subjectNoun="company"
        joinWorkspaceId={workspaceId}
        joinWorkspaceName={name}
        onClose={() => setAddingPerson(false)}
        onSaved={async () => {
          setAddingPerson(false)
          await load()
        }}
      />

      <UserEditorSheet
        open={Boolean(editingPerson)}
        user={editingPerson}
        subjectNoun="user"
        onClose={() => setEditingPerson(null)}
        onSaved={async () => {
          setEditingPerson(null)
          await load()
        }}
      />

      <AlertDialog open={Boolean(pendingRemove)} onOpenChange={(open) => !open && !removing && setPendingRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove person?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes {pendingRemove ? personName(pendingRemove) : "this person"}&apos;s login. Projects, tasks,
              and documents stay with the company. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={removing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={removing}
              onClick={(event) => {
                event.preventDefault()
                void handleRemovePerson()
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {removing ? "Removing…" : "Remove person"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}
