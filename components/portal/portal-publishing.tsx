"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ExternalLink, Eye, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { getTasksByProjectId, type Task } from "@/lib/tasks"
import type { Project } from "@/lib/projects"
import { getPortalProjects, getPortalTasks, publishPortalProject, unpublishPortalProject, publishPortalTask, unpublishPortalTask } from "@/lib/portal-data"
import type { PortalProject, PortalTask } from "@/lib/portal-model"
import { getDocumentsForClient, setDocumentProject, type SharedDocument } from "@/lib/documents"
import type { CompanyPagePerson } from "@/components/company/company-page"
import { PortalTaskFeedback } from "./portal-task-feedback"

function PublishTask({ task, initial, people }: { task: Task; initial?: PortalTask; people: CompanyPagePerson[] }) {
  const [shared, setShared] = useState(Boolean(initial))
  const [instructions, setInstructions] = useState(initial?.instructions || "")
  const [assignee, setAssignee] = useState(initial?.assigneeUid || "")
  const [saving, setSaving] = useState(false)
  async function save() {
    setSaving(true)
    try {
      if (shared) await publishPortalTask(task, instructions.trim(), assignee)
      else await unpublishPortalTask(task.id)
      toast.success(shared ? "Client task updated" : "Task hidden from clients")
    } catch { toast.error("Couldn’t update this task. Try again.") } finally { setSaving(false) }
  }
  return <div className="border-t border-border py-5"><div className="flex items-center justify-between gap-4"><Label htmlFor={`share-${task.id}`} className="leading-6">{task.name}</Label><Switch id={`share-${task.id}`} checked={shared} onCheckedChange={setShared} /></div>{shared && <div className="mt-4 space-y-3"><div><Label htmlFor={`assign-${task.id}`}>Assigned client</Label><select id={`assign-${task.id}`} value={assignee} onChange={e => setAssignee(e.target.value)} className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"><option value="">View only · no assigned client</option>{people.filter(person => person.adminUser?.role === "client").map(person => <option key={person.id} value={person.id}>{person.name}</option>)}</select></div><div><Label htmlFor={`instructions-${task.id}`}>Client instructions</Label><Textarea id={`instructions-${task.id}`} value={instructions} onChange={e => setInstructions(e.target.value)} placeholder="What does the client need to do? Internal task notes stay private." maxLength={6000} className="mt-2" /></div></div>}<Button size="sm" variant="outline" className="mt-3" disabled={saving} onClick={() => void save()}>{saving ? "Saving…" : "Save task sharing"}</Button>{initial && <details className="mt-4"><summary className="cursor-pointer text-sm font-medium">Client feedback</summary><div className="mt-3"><PortalTaskFeedback task={initial} canAct /></div></details>}</div>
}

function ProjectSharing({ project, initial, people, files, onChanged }: { project: Project; initial?: PortalProject; people: CompanyPagePerson[]; files: SharedDocument[]; onChanged: () => void }) {
  const [shared, setShared] = useState(Boolean(initial))
  const [summary, setSummary] = useState(initial?.summary || "")
  const [tasks, setTasks] = useState<Task[]>([])
  const [publishedTasks, setPublishedTasks] = useState<PortalTask[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  useEffect(() => {
    let active = true
    Promise.all([getTasksByProjectId(project.id), getPortalTasks(project.clientId, project.id)]).then(([items, sharedItems]) => { if (active) { setTasks(items); setPublishedTasks(sharedItems) } }).catch(() => { if (active) setError("Couldn’t load project tasks. Close and reopen to retry.") }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [project.id, project.clientId])
  async function save() {
    setSaving(true); setError("")
    try { if (shared) await publishPortalProject(project, summary.trim()); else await unpublishPortalProject(project.id); toast.success(shared ? "Project shared with clients" : "Project hidden from clients"); onChanged() }
    catch { setError("Couldn’t save project sharing. Try again.") } finally { setSaving(false) }
  }
  return <div className="space-y-5"><div className="flex items-center justify-between gap-4"><Label htmlFor="project-visible">Show this project in the client portal</Label><Switch id="project-visible" checked={shared} onCheckedChange={setShared} /></div><div><Label htmlFor="client-summary">Client project summary</Label><Textarea id="client-summary" className="mt-2" value={summary} onChange={e => setSummary(e.target.value)} maxLength={2000} placeholder="A short update your client can see." /></div><p className="text-xs leading-5 text-muted-foreground">Sharing includes the project name, status, progress, due date and this summary. Internal descriptions and financial notes stay private. Previously shared tasks return when a project is shared again.</p><Button disabled={saving} onClick={() => void save()}>{saving ? "Saving…" : "Save project sharing"}</Button>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    {initial && <><h3 className="pt-3 text-sm font-semibold">Client tasks</h3><p className="text-xs leading-5 text-muted-foreground">Choose tasks individually. Clients can complete only tasks assigned to them. Existing internal notes are never copied.</p>{loading ? <Loader2 className="size-5 animate-spin" /> : tasks.length ? tasks.map(task => <PublishTask key={task.id} task={task} initial={publishedTasks.find(item => item.id === task.id)} people={people} />) : <p className="text-sm text-muted-foreground">Create tasks in this project first.</p>}
    <h3 className="border-t border-border pt-5 text-sm font-semibold">Project files</h3><p className="text-xs text-muted-foreground">Link company files from Drive to this project.</p>{files.length ? files.map(file => <label key={file.id} className="flex items-center gap-3 text-sm"><input type="checkbox" checked={file.projectId === project.id} onChange={async e => { try { await setDocumentProject(file.id, e.target.checked ? project.id : ""); onChanged() } catch { toast.error("Couldn’t update file sharing.") } }} />{file.title}{file.projectId && file.projectId !== project.id && <span className="text-xs text-muted-foreground">Assigned to another project</span>}</label>) : <p className="text-sm text-muted-foreground">Add files to the company in Drive first.</p>}</>}
  </div>
}

export function PortalPublishing({ companyId, portalHref, projects, people }: { companyId: string; portalHref: string; projects: Project[]; people: CompanyPagePerson[] }) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(projects[0]?.id || "")
  const [published, setPublished] = useState<PortalProject[]>([])
  const [files, setFiles] = useState<SharedDocument[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [revision, setRevision] = useState(0)
  useEffect(() => {
    if (!open) return
    let active = true
    setLoading(true); setError("")
    Promise.all([getPortalProjects(companyId), getDocumentsForClient(companyId, "__agency_preview__")]).then(([items, docs]) => { if (active) { setPublished(items); setFiles(docs.filter(item => item.clientId === companyId)) } }).catch(() => { if (active) setError("Couldn’t load sharing settings. Close and reopen to retry.") }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [open, companyId, revision])
  const project = projects.find(item => item.id === selected)
  return <Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button size="sm" variant="secondary" className="rounded-full"><Eye className="size-4" aria-hidden="true" />Client portal</Button></DialogTrigger><DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto"><DialogHeader><DialogTitle>Client portal</DialogTitle><DialogDescription>Control what this company sees after signing in.</DialogDescription></DialogHeader><Link href={portalHref} target="_blank" className="inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4">Preview portal<ExternalLink className="size-3.5" /></Link><p className="text-xs leading-5 text-muted-foreground">Issued documents are available automatically. Add client logins in the company’s Team section.</p>{error ? <p role="alert" className="text-sm text-destructive">{error}</p> : loading ? <Loader2 className="size-5 animate-spin" /> : <><Label htmlFor="portal-project">Project</Label><select id="portal-project" value={selected} onChange={e => setSelected(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm"><option value="">Choose a project</option>{projects.map(item => <option key={item.id} value={item.id}>{item.title}{published.some(p => p.id === item.id) ? " · Shared" : ""}</option>)}</select>{project ? <ProjectSharing key={`${project.id}:${revision}`} project={project} initial={published.find(item => item.id === project.id)} people={people} files={files} onChanged={() => setRevision(n => n + 1)} /> : <p className="text-sm text-muted-foreground">Choose a project to share, or create one in the agency workspace.</p>}</>}</DialogContent></Dialog>
}
