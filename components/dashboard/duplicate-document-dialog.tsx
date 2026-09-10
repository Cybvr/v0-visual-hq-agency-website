"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getProjects, type Project } from "@/lib/projects"
import { getUsers, type AppUser } from "@/lib/users"

export interface DuplicateSelection {
  companyId: string
  client: string
  projectId: string
  project: string
}

/**
 * Lets an admin re-home a duplicated invoice/estimate/contract onto a
 * different (or the same) client and project before the copy is created.
 * Shared by the invoices, estimates, and contracts list pages.
 */
export function DuplicateDocumentDialog({
  open,
  onOpenChange,
  title,
  description,
  defaultCompanyId,
  defaultProjectId,
  submitting = false,
  onConfirm,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  defaultCompanyId: string
  defaultProjectId?: string
  submitting?: boolean
  onConfirm: (selection: DuplicateSelection) => void
}) {
  const [clients, setClients] = useState<AppUser[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [companyId, setCompanyId] = useState(defaultCompanyId)
  const [projectId, setProjectId] = useState(defaultProjectId ?? "")

  useEffect(() => {
    if (!open) return
    setCompanyId(defaultCompanyId)
    setProjectId(defaultProjectId ?? "")
    let active = true
    setLoading(true)
    Promise.all([getUsers(), getProjects()])
      .then(([userList, projectList]) => {
        if (!active) return
        const seenWorkspaces = new Set<string>()
        setClients(
          userList.filter((user) => {
            if (!user.companyId || seenWorkspaces.has(user.companyId)) return false
            seenWorkspaces.add(user.companyId)
            return true
          }),
        )
        setProjects(projectList)
      })
      .catch(() => {
        // The selects just stay empty; the client/project inputs below fall
        // back to whatever the duplicated record already had.
      })
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [open, defaultCompanyId, defaultProjectId])

  const selectedClient = clients.find((entry) => entry.companyId === companyId)
  const selectedProject = projects.find((entry) => entry.id === projectId)

  function selectClient(value: string) {
    setCompanyId(value)
    if (projectId && projects.find((project) => project.id === projectId)?.companyId !== value) setProjectId("")
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !submitting && onOpenChange(next)}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="size-5 animate-spin text-muted-foreground" aria-hidden="true" />
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="duplicate-client">Client</Label>
              <Select value={companyId} onValueChange={selectClient}>
                <SelectTrigger id="duplicate-client" className="mt-1">
                  <SelectValue placeholder="Choose a client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.uid} value={client.companyId as string}>
                      {client.company || client.displayName || client.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="duplicate-project">Project</Label>
              <Select value={projectId} onValueChange={setProjectId}>
                <SelectTrigger id="duplicate-project" className="mt-1">
                  <SelectValue placeholder="Not tied to a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects
                    .filter((project) => !companyId || project.companyId === companyId)
                    .map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.title}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button
            type="button"
            disabled={submitting || loading || !companyId}
            onClick={() =>
              onConfirm({
                companyId,
                client: selectedClient?.company || selectedClient?.displayName || selectedClient?.email || "",
                projectId,
                project: selectedProject?.title || "",
              })
            }
          >
            {submitting && <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" />}
            Duplicate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
