"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Pencil, Plus, User as UserIcon } from "lucide-react"

import { useAuth } from "@/components/auth-provider"
import { useCompany } from "@/components/dashboard/company-context"
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
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { projectSlug, projectStatusMeta, type Project } from "@/lib/projects"
import { deleteUser, type AppUser } from "@/lib/users"
import { cn } from "@/lib/utils"

function personName(person: AppUser): string {
  return person.displayName || person.email || "Unnamed person"
}

export default function CompanyPage() {
  const router = useRouter()
  const { viewAsUser } = useAuth()
  const { workspaceId, name, people, projects, reload } = useCompany()

  const [addingPerson, setAddingPerson] = useState(false)
  const [editingPerson, setEditingPerson] = useState<AppUser | null>(null)
  const [pendingRemove, setPendingRemove] = useState<AppUser | null>(null)
  const [removing, setRemoving] = useState(false)

  const newProjectHref = `/dashboard/projects?new=1&clientId=${encodeURIComponent(workspaceId)}`

  async function handleRemovePerson() {
    if (!pendingRemove || removing) return
    setRemoving(true)
    try {
      await deleteUser(pendingRemove.uid)
      await reload()
      setPendingRemove(null)
    } catch (removeError) {
      console.error("Error removing person:", removeError)
    } finally {
      setRemoving(false)
    }
  }

  return (
    <>
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
          await reload()
        }}
      />

      <UserEditorSheet
        open={Boolean(editingPerson)}
        user={editingPerson}
        subjectNoun="user"
        onClose={() => setEditingPerson(null)}
        onSaved={async () => {
          setEditingPerson(null)
          await reload()
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
    </>
  )
}
