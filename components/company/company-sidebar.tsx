"use client"

import { useState, type ReactNode } from "react"
import { Copy, Loader2, Pencil, Plus, Share2, X } from "lucide-react"
import { toast } from "sonner"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { INDUSTRIES } from "@/lib/industries"
import { COMPANY_SIZES } from "@/lib/organizations"
import { cn } from "@/lib/utils"

export interface CompanySidebarPerson {
  id: string
  name: string
  subtitle?: string
  photoUrl?: string
}

export interface CompanySidebarCompany {
  id: string
  name: string
  logoUrl?: string
  industry?: string
  location?: string
  website?: string
  description?: string
  companySize?: string
  source?: string
  linkedIn?: string
  tags?: string[]
  primaryContactId?: string
}

export type CompanyDetailsPatch = Partial<
  Pick<
    CompanySidebarCompany,
    "tags" | "description" | "industry" | "location" | "website" | "companySize" | "source" | "linkedIn" | "primaryContactId"
  >
>

export interface CompanySidebarAdmin {
  onSave: (patch: CompanyDetailsPatch) => Promise<void>
  onAddPerson: () => void
  onNewProject: () => void
  onShare: () => void
  /** The single client-portal action, rendered between New and Share. */
  extraAction?: ReactNode
}

function initialsFor(name: string): string {
  return (
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?"
  )
}

function DetailRow({ label, value, editable }: { label: string; value?: string; editable: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5 text-sm">
      <span className="shrink-0 text-muted-foreground">{label}</span>
      {value ? (
        <span className="truncate text-right font-medium">{value}</span>
      ) : (
        <span className="truncate text-right text-muted-foreground/60">
          {editable ? `Add ${label.toLowerCase()}` : "Not set"}
        </span>
      )}
    </div>
  )
}

function DetailsField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      {children}
    </div>
  )
}

/**
 * The company profile panel on the left of the company detail page: logo,
 * name, tags, quick actions, the primary contact, and the editable Details
 * fields. Read-only whenever `admin` is omitted.
 */
export function CompanySidebar({
  company,
  people,
  admin,
}: {
  company: CompanySidebarCompany
  people: CompanySidebarPerson[]
  admin?: CompanySidebarAdmin
}) {
  const [addingTag, setAddingTag] = useState(false)
  const [tagDraft, setTagDraft] = useState("")
  const [editingDetails, setEditingDetails] = useState(false)
  const [savingDetails, setSavingDetails] = useState(false)
  const [detailsDraft, setDetailsDraft] = useState({
    website: company.website ?? "",
    description: company.description ?? "",
    industry: company.industry ?? "",
    location: company.location ?? "",
    companySize: company.companySize ?? "",
    source: company.source ?? "",
    linkedIn: company.linkedIn ?? "",
  })

  const primaryContact = people.find((person) => person.id === company.primaryContactId) ?? people[0]

  async function commitTags(next: string[]) {
    if (!admin) return
    try {
      await admin.onSave({ tags: next })
    } catch (error) {
      console.error("Error saving tags:", error)
    }
  }

  function addTag() {
    const value = tagDraft.trim()
    setTagDraft("")
    setAddingTag(false)
    if (!value) return
    if ((company.tags ?? []).includes(value)) return
    void commitTags([...(company.tags ?? []), value])
  }

  function removeTag(tag: string) {
    void commitTags((company.tags ?? []).filter((t) => t !== tag))
  }

  function openDetailsEditor() {
    setDetailsDraft({
      website: company.website ?? "",
      description: company.description ?? "",
      industry: company.industry ?? "",
      location: company.location ?? "",
      companySize: company.companySize ?? "",
      source: company.source ?? "",
      linkedIn: company.linkedIn ?? "",
    })
    setEditingDetails(true)
  }

  async function saveDetails() {
    if (!admin || savingDetails) return
    setSavingDetails(true)
    try {
      await admin.onSave({
        website: detailsDraft.website.trim(),
        description: detailsDraft.description.trim(),
        industry: detailsDraft.industry,
        location: detailsDraft.location.trim(),
        companySize: detailsDraft.companySize,
        source: detailsDraft.source.trim(),
        linkedIn: detailsDraft.linkedIn.trim(),
      })
      setEditingDetails(false)
    } catch (error) {
      console.error("Error saving company details:", error)
    } finally {
      setSavingDetails(false)
    }
  }

  function copyEmail(email: string) {
    void navigator.clipboard.writeText(email)
    toast.success("Email copied to clipboard")
  }

  return (
    <aside className="print:hidden lg:sticky lg:top-6 lg:self-start">
      <div className="rounded-2xl border border-border/60 bg-card p-5">
        <div className="flex items-start gap-3">
          <div className="size-14 shrink-0 overflow-hidden rounded-xl bg-muted">
            {company.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={company.logoUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-lg font-semibold text-muted-foreground">
                {company.name.trim().charAt(0).toUpperCase() || "?"}
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1 pt-1">
            <h1 className="truncate text-lg font-bold">{company.name}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {(company.tags ?? []).map((tag) => (
                <span
                  key={tag}
                  className="group/tag inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium"
                >
                  {tag}
                  {admin && (
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      aria-label={`Remove ${tag} tag`}
                      className="text-muted-foreground opacity-0 outline-none transition-opacity hover:text-foreground group-hover/tag:opacity-100 focus-visible:opacity-100"
                    >
                      <X className="size-3" aria-hidden="true" />
                    </button>
                  )}
                </span>
              ))}
              {admin &&
                (addingTag ? (
                  <input
                    autoFocus
                    value={tagDraft}
                    onChange={(event) => setTagDraft(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault()
                        addTag()
                      }
                      if (event.key === "Escape") {
                        setTagDraft("")
                        setAddingTag(false)
                      }
                    }}
                    onBlur={addTag}
                    placeholder="Tag name"
                    className="h-6 w-24 rounded-full border border-border bg-transparent px-2.5 text-xs outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setAddingTag(true)}
                    className="text-sm text-muted-foreground outline-none transition-colors hover:text-foreground"
                  >
                    {(company.tags?.length ?? 0) > 0 ? "Add tag" : "Add tags"}
                  </button>
                ))}
            </div>
          </div>
        </div>

        {admin && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" className="rounded-full">
                  <Plus className="size-4" aria-hidden="true" />
                  New
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onSelect={() => admin.onNewProject()}>New project</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => admin.onAddPerson()}>New person</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {admin.extraAction}
            <Button size="sm" variant="secondary" className="rounded-full" onClick={() => admin.onShare()}>
              <Share2 className="size-4" aria-hidden="true" />
              Share
            </Button>
          </div>
        )}

        <Separator className="my-5" />

        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-muted-foreground">Primary Contact</h3>
            {admin && (
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    aria-label="Set primary contact"
                    className="flex size-6 items-center justify-center rounded-full text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Plus className="size-4" aria-hidden="true" />
                  </button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-64 p-1">
                  {people.length === 0 ? (
                    <button
                      type="button"
                      onClick={() => admin.onAddPerson()}
                      className="w-full rounded-sm px-2 py-1.5 text-left text-sm outline-none hover:bg-accent"
                    >
                      Add a person first
                    </button>
                  ) : (
                    people.map((person) => (
                      <button
                        key={person.id}
                        type="button"
                        onClick={() => void admin.onSave({ primaryContactId: person.id })}
                        className={cn(
                          "flex w-full items-center gap-2 truncate rounded-sm px-2 py-1.5 text-left text-sm outline-none hover:bg-accent",
                          person.id === primaryContact?.id && "font-medium",
                        )}
                      >
                        {person.name}
                      </button>
                    ))
                  )}
                </PopoverContent>
              </Popover>
            )}
          </div>

          {primaryContact ? (
            <div className="mt-3 flex items-center gap-3">
              <Avatar size="lg">
                {primaryContact.photoUrl && <AvatarImage src={primaryContact.photoUrl} alt="" />}
                <AvatarFallback>{initialsFor(primaryContact.name)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{primaryContact.name}</p>
                {primaryContact.subtitle && (
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-xs text-muted-foreground">{primaryContact.subtitle}</p>
                    <button
                      type="button"
                      onClick={() => copyEmail(primaryContact.subtitle!)}
                      aria-label="Copy email"
                      className="shrink-0 text-muted-foreground outline-none transition-colors hover:text-foreground"
                    >
                      <Copy className="size-3.5" aria-hidden="true" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">No primary contact yet.</p>
          )}
        </div>

        <Separator className="my-5" />

        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-muted-foreground">Details</h3>
            {admin && !editingDetails && (
              <button
                type="button"
                onClick={openDetailsEditor}
                aria-label="Edit details"
                className="flex size-6 items-center justify-center rounded-full text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground"
              >
                <Pencil className="size-3.5" aria-hidden="true" />
              </button>
            )}
          </div>

          {editingDetails ? (
            <div className="mt-3 space-y-3">
              <DetailsField label="Domain">
                <Input
                  value={detailsDraft.website}
                  onChange={(event) => setDetailsDraft((d) => ({ ...d, website: event.target.value }))}
                  placeholder="acme.com"
                  className="h-8 text-sm"
                />
              </DetailsField>
              <DetailsField label="Description">
                <Textarea
                  value={detailsDraft.description}
                  onChange={(event) => setDetailsDraft((d) => ({ ...d, description: event.target.value }))}
                  placeholder="What does this company do?"
                  className="min-h-16 text-sm"
                />
              </DetailsField>
              <DetailsField label="Industry">
                <Select
                  value={detailsDraft.industry}
                  onValueChange={(value) => setDetailsDraft((d) => ({ ...d, industry: value }))}
                >
                  <SelectTrigger className="h-8 w-full text-sm">
                    <SelectValue placeholder="Select an industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </DetailsField>
              <DetailsField label="Location">
                <Input
                  value={detailsDraft.location}
                  onChange={(event) => setDetailsDraft((d) => ({ ...d, location: event.target.value }))}
                  placeholder="Lagos, Nigeria"
                  className="h-8 text-sm"
                />
              </DetailsField>
              <DetailsField label="Company Size">
                <Select
                  value={detailsDraft.companySize}
                  onValueChange={(value) => setDetailsDraft((d) => ({ ...d, companySize: value }))}
                >
                  <SelectTrigger className="h-8 w-full text-sm">
                    <SelectValue placeholder="Select a size" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMPANY_SIZES.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size} employees
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </DetailsField>
              <DetailsField label="Source">
                <Input
                  value={detailsDraft.source}
                  onChange={(event) => setDetailsDraft((d) => ({ ...d, source: event.target.value }))}
                  placeholder="Referral, LinkedIn, ..."
                  className="h-8 text-sm"
                />
              </DetailsField>
              <DetailsField label="LinkedIn">
                <Input
                  value={detailsDraft.linkedIn}
                  onChange={(event) => setDetailsDraft((d) => ({ ...d, linkedIn: event.target.value }))}
                  placeholder="linkedin.com/company/..."
                  className="h-8 text-sm"
                />
              </DetailsField>

              <div className="flex items-center justify-end gap-2 pt-1">
                <Button type="button" size="sm" variant="ghost" onClick={() => setEditingDetails(false)} disabled={savingDetails}>
                  Cancel
                </Button>
                <Button type="button" size="sm" onClick={() => void saveDetails()} disabled={savingDetails}>
                  {savingDetails && <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />}
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-3 divide-y divide-border/60">
              <DetailRow label="Domain" value={company.website} editable={Boolean(admin)} />
              <DetailRow label="Description" value={company.description} editable={Boolean(admin)} />
              <DetailRow label="Industry" value={company.industry} editable={Boolean(admin)} />
              <DetailRow label="Location" value={company.location} editable={Boolean(admin)} />
              <DetailRow
                label="Company Size"
                value={company.companySize ? `${company.companySize} employees` : undefined}
                editable={Boolean(admin)}
              />
              <DetailRow label="Source" value={company.source} editable={Boolean(admin)} />
              <DetailRow label="LinkedIn" value={company.linkedIn} editable={Boolean(admin)} />
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
