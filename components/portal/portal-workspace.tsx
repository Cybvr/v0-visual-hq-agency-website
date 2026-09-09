"use client"

import { useState, type ReactNode } from "react"
import Link from "next/link"
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, ArrowUpRight, CalendarDays, Check, ChevronRight, FileText, FolderOpen, MessageSquare, Receipt } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { formatMoney, type Contract, type Estimate, type Invoice } from "@/lib/billing"
import { projectStatusMeta } from "@/lib/projects"
import type { SharedDocument } from "@/lib/documents"
import { billingTotals, invoiceBalance, portalDocumentPath, portalPath, safeExternalUrl, type PortalProject, type PortalTab, type PortalTask } from "@/lib/portal-model"
import { completePortalTask } from "@/lib/portal-data"
import type { Project } from "@/lib/projects"
import type { PublicTeamMember } from "@/lib/organizations"
import { CompanyMedia } from "@/components/company/company-media"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { usePortal, type PortalData } from "./portal-provider"
import { PortalNotice } from "./portal-shell"
import { PortalTaskFeedback } from "./portal-task-feedback"

function shortDate(value: string) {
  if (!value) return ""
  const date = new Date(value.includes("T") ? value : `${value}T12:00:00`)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
}

function Panel({ title, count, action, children }: { title: string; count?: number; action?: ReactNode; children: ReactNode }) {
  return <section className="rounded-2xl border border-border bg-background p-5 sm:p-6"><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><h2 className="flex items-center gap-2 text-sm font-semibold">{title}{count !== undefined && <span className="font-normal tabular-nums text-muted-foreground">{count}</span>}</h2>{action}</div>{children}</section>
}

function Empty({ children }: { children: ReactNode }) { return <p className="py-4 text-sm leading-6 text-muted-foreground">{children}</p> }

function initials(name: string) {
  return name.split(" ").map(part => part[0]).join("").slice(0, 2).toUpperCase() || "?"
}

function Contacts({ people }: { people: PublicTeamMember[] }) {
  return <Panel title="Contacts" count={people.length}>{people.length ? <ul className="grid gap-3 sm:grid-cols-2">{people.map(person => <li key={person.uid} className="flex items-center gap-3 rounded-xl border border-border p-3"><Avatar size="lg">{person.photoUrl && <AvatarImage src={person.photoUrl} alt="" />}<AvatarFallback>{initials(person.name)}</AvatarFallback></Avatar><div className="min-w-0"><p className="truncate text-sm font-medium">{person.name}</p>{person.role && <p className="truncate text-xs capitalize text-muted-foreground">{person.role}</p>}</div></li>)}</ul> : <Empty>Your agency will list your team contacts here.</Empty>}</Panel>
}

function BillingSummary({ invoices, onView }: { invoices: Invoice[]; onView: () => void }) {
  const totals = billingTotals(invoices)
  return <Panel title="Billing" action={<button onClick={onView} className="rounded-sm text-xs font-medium underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2">View documents</button>}>
    {totals.length ? <div className="space-y-6">{totals.map(total => <div key={total.currency}>
      {totals.length > 1 && <p className="mb-3 text-xs font-medium text-muted-foreground">{total.currency}</p>}
      <dl className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">{([['Outstanding', total.outstanding], ['Overdue', total.overdue], ['Paid', total.paid]] as const).map(([label, value]) => <div key={label}><dt className="text-xs text-muted-foreground">{label}</dt><dd className="mt-2 break-words text-base font-semibold tabular-nums">{formatMoney(value, total.currency)}</dd></div>)}</dl>
    </div>)}</div> : <Empty>No invoices have been issued yet.</Empty>}
  </Panel>
}

function Files({ files }: { files: SharedDocument[] }) {
  return <Panel title="Files & links" count={files.length}>{files.length ? <ul className="divide-y divide-border">{files.map(file => {
    const href = safeExternalUrl(file.url)
    return <li key={file.id} className="py-3 first:pt-0 last:pb-0"><div className="flex items-start gap-3"><FileText className="mt-1 size-4 shrink-0 text-muted-foreground" /><div className="min-w-0 flex-1">{href ? <a href={href} target="_blank" rel="noreferrer" className="inline-flex max-w-full items-center gap-2 break-words text-sm font-medium underline-offset-4 hover:underline">{file.title}<ArrowUpRight className="size-3.5 shrink-0" /></a> : <p className="text-sm font-medium">{file.title}</p>}<p className="mt-1 break-words text-xs leading-5 text-muted-foreground">{file.description || (href ? "Shared with your company" : "This file link is unavailable.")}</p></div></div></li>
  })}</ul> : <Empty>Files shared by your agency will appear here.</Empty>}</Panel>
}

function TaskItem({ task, uid, canAct, onChanged }: { task: PortalTask; uid: string; canAct: boolean; onChanged: () => void }) {
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  async function toggle() {
    setSaving(true); setError("")
    try { await completePortalTask(task.id, task.status !== "done"); onChanged() } catch { setError("Couldn’t update this task. Please try again."); setSaving(false) }
  }
  return <li className="py-4 first:pt-0 last:pb-0">
    <div className="flex items-start gap-3"><input type="checkbox" checked={task.status === "done"} disabled={saving || !canAct || task.assigneeUid !== uid} onChange={() => void toggle()} aria-label={`Complete ${task.name}`} className="mt-1 size-4 shrink-0 accent-primary" />
      <div className="min-w-0 flex-1"><button onClick={() => setOpen(value => !value)} aria-expanded={open} className="w-full rounded-sm text-left text-sm font-medium leading-6 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2"><span className={task.status === "done" ? "text-muted-foreground line-through" : ""}>{task.name}</span></button><p className="mt-1 text-xs text-muted-foreground">{task.dueDate ? `Due ${shortDate(task.dueDate)}` : "No due date"}{task.assigneeUid === uid ? " · Assigned to you" : task.status === "done" ? " · Completed" : " · Shared task"}</p></div>
      <button aria-label={`Open feedback for ${task.name}`} aria-expanded={open} onClick={() => setOpen(value => !value)} className="rounded-md p-2 text-muted-foreground hover:bg-muted focus-visible:outline focus-visible:outline-2"><MessageSquare className="size-4" /></button>
    </div>
    {error && <p role="alert" className="mt-2 text-sm text-destructive">{error}</p>}
    {open && <div className="ml-7 mt-4">{task.instructions && <p className="mb-5 whitespace-pre-wrap text-sm leading-6">{task.instructions}</p>}<PortalTaskFeedback task={task} canAct={canAct} /></div>}
  </li>
}

function Tasks({ tasks, uid, canAct, onChanged, all = false }: { tasks: PortalTask[]; uid: string; canAct: boolean; onChanged: () => void; all?: boolean }) {
  const visible = all ? tasks : tasks.filter(task => task.assigneeUid === uid)
  return <Panel title={all ? "Shared tasks" : "My tasks"} count={visible.length}>{visible.length ? <ul className="divide-y divide-border">{visible.map(task => <TaskItem key={task.id} task={task} uid={uid} canAct={canAct} onChanged={onChanged} />)}</ul> : <Empty>{all ? "Your agency hasn’t shared any tasks here yet." : "No tasks are assigned to you right now."}</Empty>}</Panel>
}

function Documents({ company, invoices, contracts, estimates }: { company: string; invoices: Invoice[]; contracts: Contract[]; estimates: Estimate[] }) {
  const rows = [
    ...invoices.map(item => ({ id: item.id, kind: "invoice" as const, title: `Invoice ${item.invoiceNumber}`, status: item.status, detail: formatMoney(item.amount, item.currency) })),
    ...estimates.map(item => ({ id: item.id, kind: "estimate" as const, title: item.title || `Estimate ${item.estimateNumber}`, status: item.status, detail: formatMoney(item.amount, item.currency) })),
    ...contracts.map(item => ({ id: item.id, kind: "contract" as const, title: item.title, status: item.status, detail: "Contract" })),
  ]
  return <Panel title="Documents" count={rows.length}>{rows.length ? <ul className="divide-y divide-border">{rows.map(row => <li key={`${row.kind}:${row.id}`}><Link href={portalDocumentPath(company, row.kind, row.id)} className="flex items-center gap-3 rounded-md py-4 hover:bg-muted/40 focus-visible:outline focus-visible:outline-2"><FileText className="size-4 shrink-0 text-muted-foreground" /><div className="min-w-0 flex-1"><p className="break-words text-sm font-medium">{row.title}</p><p className="mt-1 text-xs capitalize text-muted-foreground">{row.status} · {row.detail}</p></div><ChevronRight className="size-4 shrink-0" /></Link></li>)}</ul> : <Empty>Issued invoices, estimates and contracts will appear here.</Empty>}</Panel>
}

export function PortalWorkspaceView({ data, project, company, uid, canAct, tab, onTab, onChanged }: { data: PortalData; project?: PortalProject; company: string; uid: string; canAct: boolean; tab: string; onTab: (tab: string) => void; onChanged: () => void }) {
  const tasks = data.tasks.filter(item => !project || item.projectId === project.id)
  const invoices = data.invoices.filter(item => !project || item.projectId === project.id)
  const estimates = data.estimates.filter(item => !project || item.projectId === project.id)
  const contracts = data.contracts.filter(item => !project || item.projectId === project.id)
  const files = data.files.filter(item => !project || item.projectId === project.id)
  const pendingInvoices = invoices.filter(item => invoiceBalance(item) > 0 && (item.status === "sent" || item.status === "overdue"))
  const pendingEstimates = estimates.filter(item => item.status === "sent")
  const pendingContracts = contracts.filter(item => item.status === "sent")
  const count = pendingInvoices.length + pendingEstimates.length + pendingContracts.length
  const status = project ? projectStatusMeta[project.status] : null
  const tabs = project ? ["overview", "tasks", "files", "billing"] : ["overview", "projects", "contacts", "tasks", "files", "media", "billing"]
  const actionLink = (kind: "invoice" | "estimate" | "contract", id: string, label: string) => <Link href={portalDocumentPath(company, kind, id)} className="shrink-0 rounded-md bg-foreground px-3 py-2 text-xs font-medium text-background hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">{label}</Link>
  const projectList = <Panel title="Projects" count={data.projects.length}>{data.projects.length ? <ul className="divide-y divide-border">{data.projects.map(item => <li key={item.id}><Link href={`${portalPath(company)}/projects/${encodeURIComponent(item.id)}`} className="flex items-center gap-4 rounded-md py-4 hover:bg-muted/40 focus-visible:outline focus-visible:outline-2"><FolderOpen className="size-5 shrink-0 text-muted-foreground" /><div className="min-w-0 flex-1"><p className="break-words text-sm font-semibold">{item.title}</p><p className="mt-1 text-xs text-muted-foreground">{projectStatusMeta[item.status]?.label || item.status}{item.dueDate ? ` · Due ${shortDate(item.dueDate)}` : ""}</p></div><span className="text-xs tabular-nums text-muted-foreground">{Math.max(0, Math.min(100, item.progress || 0))}%</span><ChevronRight className="size-4 shrink-0" /></Link></li>)}</ul> : <Empty>Your agency will share projects here when they’re ready for you.</Empty>}</Panel>
  return <main className="mx-auto max-w-7xl px-5 pb-6 pt-7 sm:px-10 sm:pt-9">
    {project && <>
    <div className="mb-9 flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground"><Link href={portalPath(company)} className="inline-flex items-center gap-2 rounded-sm hover:text-foreground focus-visible:outline focus-visible:outline-2"><ArrowLeft className="size-3.5" />{data.organization.name}</Link>{project.dueDate && <span className="inline-flex items-center gap-2"><CalendarDays className="size-3.5" />Due {shortDate(project.dueDate)}</span>}</div>
    <div className="mb-8 min-w-0"><div className="flex flex-wrap items-center gap-3"><h1 className="break-words text-2xl font-semibold tracking-tight sm:text-3xl">{project.title}</h1><span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-900"><span className="size-1.5 rounded-full bg-emerald-700" />{Math.max(0, Math.min(100, project.progress || 0))}% complete</span></div>{(project.summary || status?.label) && <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{project.summary || status?.label}</p>}</div>
    </>}
    <nav aria-label={project ? "Project sections" : "Company sections"} className="mb-7 flex max-w-full gap-1 overflow-x-auto border-b border-border pb-3">{tabs.map(item => <button key={item} aria-current={tab === item ? "page" : undefined} onClick={() => onTab(item)} className={`shrink-0 rounded-lg px-3 py-2 text-sm capitalize transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] ${tab === item ? "bg-muted font-semibold text-foreground" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"}`}>{item}</button>)}</nav>
    {tab === "overview" && <div className="grid items-start gap-6 lg:grid-cols-[1.35fr_1fr]"><div className="space-y-6"><Panel title="Outstanding items" count={count}>{count ? <ul className="divide-y divide-border">
      {pendingInvoices.map(item => <li key={item.id} className="flex flex-wrap items-center gap-3 py-4 first:pt-0 last:pb-0"><Receipt className="size-4 shrink-0 text-muted-foreground" /><div className="min-w-0 flex-1"><p className="text-sm font-medium">Invoice {item.invoiceNumber}</p><p className="mt-1 text-xs text-muted-foreground">{formatMoney(invoiceBalance(item), item.currency)} outstanding{item.dueOn ? ` · Due ${shortDate(item.dueOn)}` : ""}</p></div>{actionLink("invoice", item.id, "View invoice")}</li>)}
      {pendingEstimates.map(item => <li key={item.id} className="flex flex-wrap items-center gap-3 py-4 first:pt-0 last:pb-0"><FileText className="size-4 shrink-0 text-muted-foreground" /><div className="min-w-0 flex-1"><p className="text-sm font-medium">Review {item.title || item.estimateNumber}</p><p className="mt-1 text-xs text-muted-foreground">Estimate awaiting your response</p></div>{actionLink("estimate", item.id, "View estimate")}</li>)}
      {pendingContracts.map(item => <li key={item.id} className="flex flex-wrap items-center gap-3 py-4 first:pt-0 last:pb-0"><FileText className="size-4 shrink-0 text-muted-foreground" /><div className="min-w-0 flex-1"><p className="text-sm font-medium">Review {item.title}</p><p className="mt-1 text-xs text-muted-foreground">Contract awaiting signature</p></div>{actionLink("contract", item.id, "View contract")}</li>)}
    </ul> : <div className="flex items-center gap-3 py-4 text-sm text-muted-foreground"><Check className="size-4 text-emerald-700" />You’re all caught up on documents.</div>}</Panel>{!project && projectList}<Tasks tasks={tasks} uid={uid} canAct={canAct} onChanged={onChanged} /></div><div className="space-y-6"><BillingSummary invoices={invoices} onView={() => onTab("billing")} /><Files files={files} /></div></div>}
    {tab === "projects" && projectList}
    {tab === "contacts" && <Contacts people={data.organization.publicTeam ?? []} />}
    {tab === "tasks" && <Tasks tasks={tasks} uid={uid} canAct={canAct} onChanged={onChanged} all />}
    {tab === "files" && <Files files={files} />}
    {tab === "media" && <CompanyMedia logoUrl={data.organization.logoUrl} projects={data.projects as unknown as Project[]} uploaded={data.organization.media ?? []} />}
    {tab === "billing" && <div className="space-y-6"><BillingSummary invoices={invoices} onView={() => document.getElementById("portal-documents")?.scrollIntoView({ behavior: "smooth" })} /><div id="portal-documents"><Documents company={company} invoices={invoices} contracts={contracts} estimates={estimates} /></div></div>}
  </main>
}

export function PortalWorkspace({ projectMode = false }: { projectMode?: boolean }) {
  const data = usePortal()
  const { appUser, isAdmin } = useAuth()
  const { companySlug, projectId } = useParams<{ companySlug: string; projectId?: string }>()
  const pathname = usePathname()
  const search = useSearchParams()
  const router = useRouter()
  const project = projectMode ? data.projects.find(item => item.id === projectId || item.legacySlug === projectId) : undefined
  const available = projectMode ? ["overview", "tasks", "files", "billing"] : ["overview", "projects", "contacts", "tasks", "files", "media", "billing"]
  const raw = search.get("tab") || "overview"
  const tab = available.includes(raw) ? raw : "overview"
  if (projectMode && !project) return <PortalNotice title="This project isn’t available">It may not have been shared with your company yet. <Link className="underline" href={portalPath(companySlug)}>Back to your company</Link></PortalNotice>
  return <PortalWorkspaceView data={data} project={project} company={companySlug} uid={appUser?.uid || ""} canAct={!isAdmin} tab={tab} onTab={value => router.push(`${pathname}${value === "overview" ? "" : `?tab=${value}`}`, { scroll: false })} onChanged={data.reload} />
}
