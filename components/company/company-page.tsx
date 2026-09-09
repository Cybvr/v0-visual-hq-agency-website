"use client"

import { useEffect, useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Plus, User as UserIcon } from "lucide-react"
import { toast } from "sonner"

import { CompanyDocuments, type CompanyDocumentKind } from "@/components/company/company-documents"
import { CompanyMedia } from "@/components/company/company-media"
import { CompanySidebar, type CompanyDetailsPatch } from "@/components/company/company-sidebar"
import { SectionNav } from "@/components/company/section-nav"
import { ContractDocument } from "@/components/dashboard/contract-document"
import { DocumentActions } from "@/components/dashboard/document-actions"
import { EstimateDocument } from "@/components/dashboard/estimate-document"
import { InvoiceDocument } from "@/components/dashboard/invoice-document"
import { NewPersonDialog } from "@/components/dashboard/new-person-dialog"
import { NewProjectDialog } from "@/components/dashboard/new-project-dialog"
import { ProjectDetail } from "@/components/dashboard/project-detail"
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import type { Contract, Estimate, Invoice } from "@/lib/billing"
import { getBusinessProfile, type BusinessProfile } from "@/lib/business-profile"
import { projectStatusMeta, type Project } from "@/lib/projects"
import { deleteUser, type AppUser } from "@/lib/users"
import { cn } from "@/lib/utils"
import { PortalPublishing } from "@/components/portal/portal-publishing"

const SECTIONS = [
  { key: "overview", label: "Overview" },
  { key: "team", label: "Contacts" },
  { key: "projects", label: "Projects" },
  { key: "media", label: "Media" },
  { key: "documents", label: "Documents" },
] as const

type SectionKey = (typeof SECTIONS)[number]["key"]

export interface CompanyPagePerson {
  id: string
  name: string
  subtitle?: string
  role?: string
  photoUrl?: string
  adminUser?: AppUser
}

export interface CompanyPageCompany {
  id: string
  name: string
  logoUrl?: string
  categoryLabel: string
  industry?: string
  location?: string
  website?: string
  description?: string
  companySize?: string
  source?: string
  linkedIn?: string
  tags?: string[]
  primaryContactId?: string
  media?: string[]
}

export interface CompanyPageAdmin {
  sharePath: string
  onViewWorkspace: (person: AppUser) => void
  onMediaChange?: (urls: string[]) => Promise<void>
  onUpdateCompany: (patch: CompanyDetailsPatch) => Promise<void>
  reload: () => Promise<void>
}

function personProject(person: CompanyPagePerson, company: CompanyPageCompany): Project {
  return {
    id: person.id,
    clientId: company.id,
    client: company.name,
    title: person.name,
    service: person.subtitle || "Team member",
    status: "in-progress",
    progress: 0,
    dueDate: "",
    thumbnailUrl: person.photoUrl,
  }
}

/**
 * The complete company experience used by both dashboard and public routes.
 * Supplying `admin` reveals private actions; omitting it keeps this same block
 * read-only and never requires private data.
 */
export function CompanyPage({
  company,
  people,
  projects,
  invoices,
  contracts,
  estimates,
  admin,
  emptyProjectsLabel = "No projects yet.",
}: {
  company: CompanyPageCompany
  people: CompanyPagePerson[]
  projects: Project[]
  invoices: Invoice[]
  contracts: Contract[]
  estimates: Estimate[]
  admin?: CompanyPageAdmin
  emptyProjectsLabel?: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const tabParam = searchParams.get("tab")
  const section: SectionKey = SECTIONS.some((s) => s.key === tabParam) ? (tabParam as SectionKey) : "overview"

  const [docKind, docId] = (searchParams.get("doc") ?? "").split(":")
  const selectedDocument = useMemo(() => {
    if (docKind === "invoice") return invoices.find((i) => i.id === docId) ? { kind: "invoice" as const, id: docId } : null
    if (docKind === "contract") return contracts.find((c) => c.id === docId) ? { kind: "contract" as const, id: docId } : null
    if (docKind === "estimate") return estimates.find((e) => e.id === docId) ? { kind: "estimate" as const, id: docId } : null
    return null
  }, [docKind, docId, invoices, contracts, estimates])

  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [addingPerson, setAddingPerson] = useState(false)
  const [editingPerson, setEditingPerson] = useState<AppUser | null>(null)
  const [pendingRemove, setPendingRemove] = useState<AppUser | null>(null)
  const [removing, setRemoving] = useState(false)
  const [creatingProject, setCreatingProject] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [issuer, setIssuer] = useState<BusinessProfile | null>(null)

  useEffect(() => {
    getBusinessProfile()
      .then(setIssuer)
      .catch(() => {
        // Document header just stays without issuer details.
      })
  }, [])

  function updateParams(next: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(next)) {
      if (value === null) params.delete(key)
      else params.set(key, value)
    }
    const query = params.toString()
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  function handleSectionChange(key: SectionKey) {
    updateParams({ tab: key === "overview" ? null : key, doc: null })
    if (key !== "projects") setSelectedProject(null)
  }

  function handleSelectDocument(kind: CompanyDocumentKind, id: string) {
    if (admin) {
      router.push(`/dashboard/${kind}s/${id}/edit`)
      return
    }
    updateParams({ tab: "documents", doc: `${kind}:${id}` })
  }

  function handleCloseDocument() {
    updateParams({ doc: null })
  }

  const absoluteUrl = (path: string) =>
    typeof window !== "undefined" ? `${window.location.origin}${path}` : path

  async function handleRemovePerson() {
    if (!admin || !pendingRemove || removing) return
    setRemoving(true)
    try {
      await deleteUser(pendingRemove.uid)
      await admin.reload()
      setPendingRemove(null)
    } catch (removeError) {
      console.error("Error removing person:", removeError)
    } finally {
      setRemoving(false)
    }
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-4 pb-16 pt-6 sm:px-6">
      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <CompanySidebar
          company={{
            id: company.id,
            name: company.name,
            logoUrl: company.logoUrl,
            industry: company.industry,
            location: company.location,
            website: company.website,
            description: company.description,
            companySize: company.companySize,
            source: company.source,
            linkedIn: company.linkedIn,
            tags: company.tags,
            primaryContactId: company.primaryContactId,
          }}
          people={people}
          admin={
            admin
              ? {
                  onSave: admin.onUpdateCompany,
                  onAddPerson: () => setAddingPerson(true),
                  onNewProject: () => setCreatingProject(true),
                  onShare: () => setShareOpen(true),
                  extraAction: (
                    <PortalPublishing companyId={company.id} portalHref={admin.sharePath} projects={projects} people={people} />
                  ),
                }
              : undefined
          }
        />

        <div className="min-w-0">
          <div className="print:hidden">
            <SectionNav sections={SECTIONS} active={section} onChange={handleSectionChange} />
          </div>

          {section === "overview" && (
            <div className="mt-4 rounded-2xl border border-border/60 bg-card p-5">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-base font-semibold">Recent Projects</h2>
                {admin && (
                  <button
                    type="button"
                    onClick={() => setCreatingProject(true)}
                    aria-label="New project"
                    className="flex size-8 items-center justify-center rounded-full bg-muted text-foreground outline-none transition-colors hover:bg-muted/70 focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Plus className="size-4" aria-hidden="true" />
                  </button>
                )}
              </div>

              {projects.length === 0 ? (
                <p className="py-10 text-center text-sm text-muted-foreground">No projects started yet.</p>
              ) : (
                <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-3">
                  {projects.slice(0, 6).map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onClick={() => {
                        handleSectionChange("projects")
                        setSelectedProject(project)
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {section === "team" && (
            <div className="mt-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-baseline gap-2">
                  <h2 className="text-base font-semibold">Contacts</h2>
                  <span className="text-sm text-muted-foreground">{people.length}</span>
                </div>
                {admin && (
                  <Button onClick={() => setAddingPerson(true)}>
                    <Plus className="size-4" aria-hidden="true" />
                    Add person
                  </Button>
                )}
              </div>

              {people.length === 0 ? (
                <div className="mt-4 flex flex-col items-center rounded-lg border border-dashed border-border py-10 text-center">
                  <span className="flex size-11 items-center justify-center rounded-full bg-muted">
                    <UserIcon className="size-5 text-muted-foreground" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-medium">No contacts yet</h3>
                  {admin && (
                    <>
                      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                        Add the first person to give them access to this workspace.
                      </p>
                      <Button className="mt-5" onClick={() => setAddingPerson(true)}>
                        <Plus className="mr-2 size-4" aria-hidden="true" />
                        Add person
                      </Button>
                    </>
                  )}
                </div>
              ) : (
                <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-3">
                  {people.map((person) => (
                    <ProjectCard
                      key={person.id}
                      project={personProject(person, company)}
                      onClick={admin && person.adminUser ? () => setEditingPerson(person.adminUser ?? null) : undefined}
                      footer={
                        person.role ? (
                          <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium capitalize text-muted-foreground">
                            {person.role}
                          </span>
                        ) : undefined
                      }
                      menuLabel={`Options for ${person.name}`}
                      menu={
                        admin && person.adminUser ? (
                          <>
                            <DropdownMenuItem onSelect={() => setEditingPerson(person.adminUser ?? null)}>Edit</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => person.adminUser && admin.onViewWorkspace(person.adminUser)}>
                              View workspace
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              variant="destructive"
                              onSelect={() => setPendingRemove(person.adminUser ?? null)}
                            >
                              Remove person
                            </DropdownMenuItem>
                          </>
                        ) : undefined
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {section === "projects" && (
            <div className="mt-4">
              {selectedProject ? (
                <ProjectDetail
                  project={selectedProject}
                  isAdmin={Boolean(admin)}
                  publicView={!admin}
                  clientId={company.id}
                  clientName={company.name}
                  backLabel="Back to Projects"
                  onBack={() => setSelectedProject(null)}
                  onProjectPatched={
                    admin
                      ? (patch) => {
                          setSelectedProject((current) => (current ? { ...current, ...patch } : current))
                          void admin.reload()
                        }
                      : undefined
                  }
                  onProjectDeleted={
                    admin
                      ? async () => {
                          setSelectedProject(null)
                          await admin.reload()
                        }
                      : undefined
                  }
                />
              ) : (
                <>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-baseline gap-2">
                      <h2 className="text-base font-semibold">Projects</h2>
                      <span className="text-sm text-muted-foreground">{projects.length}</span>
                    </div>
                    {admin && (
                      <Button onClick={() => setCreatingProject(true)}>
                        <Plus className="size-4" aria-hidden="true" />
                        New project
                      </Button>
                    )}
                  </div>

                  {!admin && projects.length === 0 ? (
                    <p className="py-10 text-center text-sm text-muted-foreground">{emptyProjectsLabel}</p>
                  ) : (
                    <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-3">
                      {projects.map((project) => {
                        const meta = projectStatusMeta[project.status] ?? projectStatusMeta["in-progress"]
                        return (
                          <ProjectCard
                            key={project.id}
                            project={project}
                            onClick={() => setSelectedProject(project)}
                            footer={
                              admin ? (
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
                              ) : undefined
                            }
                          />
                        )
                      })}

                      {admin && (
                        <button
                          type="button"
                          onClick={() => setCreatingProject(true)}
                          className="group flex min-h-[180px] flex-col items-center justify-center gap-3 rounded-[14px] border border-dashed border-border bg-card p-4 text-center outline-none transition-colors hover:border-foreground/30 hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                          <span className="flex size-9 items-center justify-center rounded-full bg-foreground text-background transition-transform group-hover:scale-105">
                            <Plus className="size-4" aria-hidden="true" />
                          </span>
                          <span className="text-sm font-medium text-foreground">Add project</span>
                        </button>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {section === "media" && (
            <CompanyMedia
              logoUrl={company.logoUrl}
              projects={projects}
              uploaded={company.media ?? []}
              onUploadedChange={
                admin?.onMediaChange ? (urls) => void admin.onMediaChange?.(urls) : undefined
              }
            />
          )}

          {section === "documents" && (
            <div className="mt-4">
              {selectedDocument ? (
                <div>
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
                    <button
                      type="button"
                      onClick={handleCloseDocument}
                      className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <ArrowLeft className="size-4" aria-hidden="true" />
                      Back to Documents
                    </button>
                    {!admin && (
                      <DocumentActions
                        title={`${company.name} ${selectedDocument.kind === "invoice" ? "Invoice" : selectedDocument.kind === "contract" ? "Contract" : "Estimate"}`}
                      />
                    )}
                  </div>
                  {selectedDocument.kind === "invoice" && (
                    <InvoiceDocument
                      invoice={invoices.find((i) => i.id === selectedDocument.id) as Invoice}
                      issuer={issuer ?? undefined}
                    />
                  )}
                  {selectedDocument.kind === "contract" && (
                    <ContractDocument
                      contract={contracts.find((c) => c.id === selectedDocument.id) as Contract}
                      issuer={issuer ?? undefined}
                    />
                  )}
                  {selectedDocument.kind === "estimate" && (
                    <EstimateDocument
                      estimate={estimates.find((e) => e.id === selectedDocument.id) as Estimate}
                      issuer={issuer ?? undefined}
                    />
                  )}
                </div>
              ) : (
                <CompanyDocuments
                  invoices={invoices}
                  contracts={contracts}
                  estimates={estimates}
                  onSelect={handleSelectDocument}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {admin && (
        <>
          <NewPersonDialog
            open={addingPerson}
            onOpenChange={setAddingPerson}
            fixedRole="client"
            subjectNoun="company"
            joinWorkspaceId={company.id}
            joinWorkspaceName={company.name}
            onSaved={async () => {
              setAddingPerson(false)
              await admin.reload()
            }}
          />

          <UserEditorSheet
            open={Boolean(editingPerson)}
            user={editingPerson}
            subjectNoun="user"
            onClose={() => setEditingPerson(null)}
            onSaved={async () => {
              setEditingPerson(null)
              await admin.reload()
            }}
          />

          <AlertDialog
            open={Boolean(pendingRemove)}
            onOpenChange={(open) => !open && !removing && setPendingRemove(null)}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remove person?</AlertDialogTitle>
                <AlertDialogDescription>
                  This removes {pendingRemove?.displayName || pendingRemove?.email || "this person"}&apos;s login.
                  Projects, tasks, and documents stay with the company. This cannot be undone.
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

          <NewProjectDialog
            open={creatingProject}
            onOpenChange={setCreatingProject}
            initialClientId={company.id}
            onCreated={async (project) => {
              await admin.reload()
              updateParams({ tab: "projects", doc: null })
              setSelectedProject(project)
            }}
          />

          <Dialog open={shareOpen} onOpenChange={setShareOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Share client portal</DialogTitle>
                <DialogDescription>Clients sign in with their invited account to access {company.name}&apos;s workspace.</DialogDescription>
              </DialogHeader>
              <ShareLink value={absoluteUrl(admin.sharePath)} label="Workspace link" />
              <p className="text-xs text-muted-foreground">Previously shared company links continue to open this portal.</p>
            </DialogContent>
          </Dialog>
        </>
      )}
    </main>
  )
}

function ShareLink({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-center gap-2 pt-2">
      <Input
        readOnly
        value={value}
        aria-label={label}
        className="font-mono text-xs"
        onClick={(event) => event.currentTarget.select()}
      />
      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="shrink-0"
        onClick={() => {
          void navigator.clipboard.writeText(value)
          toast.success("Link copied to clipboard")
        }}
      >
        Copy link
      </Button>
    </div>
  )
}
