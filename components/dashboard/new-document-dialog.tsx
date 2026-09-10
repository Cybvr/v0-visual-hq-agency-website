"use client"

import { useEffect, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Combobox, type ComboboxOption } from "@/components/ui/combobox"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { COMPANY_DOCUMENT_TEMPLATES, createCompanyDocument } from "@/lib/company-documents"
import { createOrganization } from "@/lib/organizations"
import { createProject, getProjects, type Project } from "@/lib/projects"
import { createUser, getUsers, type AppUser } from "@/lib/users"
import { cn } from "@/lib/utils"

/**
 * Everything that has to be decided before a document exists: which template,
 * what it's called, and who it's for. The document itself is written on the
 * edit page this hands you to, so the writing screen holds nothing but the
 * document.
 */
export function NewDocumentDialog({
  open,
  onOpenChange,
  initialClientId,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialClientId?: string
}) {
  const router = useRouter()
  const [templateId, setTemplateId] = useState(COMPANY_DOCUMENT_TEMPLATES[0].id)
  const [title, setTitle] = useState(COMPANY_DOCUMENT_TEMPLATES[0].title)
  const [clientId, setClientId] = useState(initialClientId ?? "")
  const [projectId, setProjectId] = useState("")
  const [clients, setClients] = useState<AppUser[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [optionsLoading, setOptionsLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    let active = true
    setOptionsLoading(true)
    Promise.all([getUsers(), getProjects()])
      .then(([userList, projectList]) => {
        if (!active) return
        // One entry per company, since several people share a workspace.
        const seen = new Set<string>()
        setClients(userList.filter((user) => {
          if (!user.clientId || seen.has(user.clientId)) return false
          seen.add(user.clientId)
          return true
        }))
        setProjects(projectList)
      })
      .catch(() => { if (active) setError("Couldn't load companies and projects.") })
      .finally(() => { if (active) setOptionsLoading(false) })
    return () => { active = false }
  }, [open])

  /** Reopening starts fresh, so a cancelled attempt never half-fills the next one. */
  useEffect(() => {
    if (open) return
    setTemplateId(COMPANY_DOCUMENT_TEMPLATES[0].id)
    setTitle(COMPANY_DOCUMENT_TEMPLATES[0].title)
    setClientId(initialClientId ?? "")
    setProjectId("")
    setError(null)
  }, [open, initialClientId])

  const template = COMPANY_DOCUMENT_TEMPLATES.find((entry) => entry.id === templateId) ?? COMPANY_DOCUMENT_TEMPLATES[0]

  const companyOptions: ComboboxOption[] = clients.map((client) => ({
    value: client.clientId as string,
    label: client.company || client.displayName || client.email || (client.clientId as string),
  }))

  const projectOptions: ComboboxOption[] = projects
    .filter((project) => !clientId || project.clientId === clientId)
    .map((project) => ({ value: project.id, label: project.title }))

  /** Spin up a bare workspace from just a name, the same shape the companies page makes. */
  async function createCompany(name: string): Promise<ComboboxOption | null> {
    const uid = crypto.randomUUID()
    await createUser(uid, { displayName: "", email: "", company: name, clientId: uid, photoURL: "", role: "client" })
    await createOrganization(uid, { name })
    setClients((prev) => [...prev, { uid, email: "", company: name, clientId: uid, role: "client" }])
    return { value: uid, label: name }
  }

  /** A new project belongs to the chosen company, so it needs one picked first. */
  async function createProjectOption(name: string): Promise<ComboboxOption | null> {
    if (!clientId) { setError("Choose a company before adding a project."); return null }
    const client = clients.find((entry) => entry.clientId === clientId)
    const clientName = client?.company || client?.displayName || clientId
    const id = await createProject({
      clientId,
      client: clientName,
      title: name,
      service: "General",
      status: "in-progress",
      progress: 0,
      dueDate: "",
    })
    setProjects((prev) => [...prev, { id, clientId, client: clientName, title: name, service: "General", status: "in-progress", progress: 0, dueDate: "" }])
    return { value: id, label: name }
  }

  /** Picking a template renames the document too, unless it has been named by hand. */
  function chooseTemplate(id: string) {
    const next = COMPANY_DOCUMENT_TEMPLATES.find((entry) => entry.id === id)
    if (!next) return
    setTemplateId(id)
    if (!title.trim() || title === template.title) setTitle(next.title)
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (creating) return
    const trimmedTitle = title.trim()
    if (!trimmedTitle) { setError("Give this document a title."); return }
    if (!clientId) { setError("Choose which company this document is for."); return }

    setCreating(true)
    setError(null)
    try {
      const client = clients.find((entry) => entry.clientId === clientId)
      const project = projects.find((entry) => entry.id === projectId)
      const id = await createCompanyDocument({
        title: trimmedTitle,
        clientId,
        client: client?.company || client?.displayName || "",
        projectId: projectId || "",
        project: project?.title || "",
        kind: template.kind,
        status: "draft",
        summary: "",
        body: template.body,
        shareEnabled: false,
      })
      onOpenChange(false)
      router.push(`/dashboard/documents/${id}/edit`)
    } catch (createError) {
      console.error("Error creating document:", createError)
      setError("Couldn't create this document. Try again.")
      setCreating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] max-w-lg flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>New document</DialogTitle>
          <DialogDescription>Pick a template and who it&rsquo;s for. You&rsquo;ll write it on the next screen.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
          <div className="-mx-1 flex-1 space-y-5 overflow-y-auto px-1 py-1">
          <fieldset>
            <legend className="text-sm font-medium">Template</legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {COMPANY_DOCUMENT_TEMPLATES.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => chooseTemplate(entry.id)}
                  aria-pressed={templateId === entry.id}
                  className={cn(
                    "rounded-[10px] border px-3 py-2.5 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                    templateId === entry.id
                      ? "border-foreground/40 bg-muted"
                      : "border-border hover:border-foreground/30 hover:bg-muted/60",
                  )}
                >
                  <span className="block text-sm font-medium">{entry.label}</span>
                  <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">{entry.description}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <div>
            <Label htmlFor="document-title">Title</Label>
            <Input
              id="document-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Brand refresh proposal"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="document-company">Company</Label>
            <div className="mt-1">
              <Combobox
                id="document-company"
                options={companyOptions}
                value={clientId}
                onChange={(next) => {
                  setClientId(next)
                  // Drop a project that belongs to a different company.
                  setProjectId((current) =>
                    projects.find((project) => project.id === current)?.clientId === next ? current : "",
                  )
                }}
                onCreate={createCompany}
                loading={optionsLoading}
                placeholder="Choose a company"
                searchPlaceholder="Search companies..."
                emptyText="No company found."
                createLabel={(query) => `Add “${query}”`}
                createHint="Type a name to add a company"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="document-project">Project</Label>
            <div className="mt-1">
              <Combobox
                id="document-project"
                options={projectOptions}
                value={projectId}
                onChange={setProjectId}
                onCreate={createProjectOption}
                disabled={!clientId}
                loading={optionsLoading}
                placeholder={clientId ? "Not tied to a project" : "Choose a company first"}
                searchPlaceholder="Search projects..."
                emptyText="No project found."
                createLabel={(query) => `Add “${query}”`}
                createHint="Type a name to add a project"
              />
            </div>
          </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <DialogFooter className="mt-4 shrink-0 border-t border-border pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={creating}>Cancel</Button>
            <Button type="submit" disabled={creating}>
              {creating && <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" />}
              Create document
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
