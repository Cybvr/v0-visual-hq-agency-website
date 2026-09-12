"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Copy, Eye, FileUp, Loader2, Pencil, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { useAuth } from "@/components/auth-provider"
import { DuplicateDocumentDialog, type DuplicateSelection } from "@/components/dashboard/duplicate-document-dialog"
import { EmptySearchState, FirstRunState } from "@/components/dashboard/empty-state"
import { NewDocumentDialog } from "@/components/dashboard/new-document-dialog"
import { ImportWordDocumentDialog } from "@/components/dashboard/import-word-document-dialog"
import { FilterBar, useFilterBar, type SortOption } from "@/components/dashboard/filter-bar"
import { TableBulkBar } from "@/components/dashboard/table-bulk-bar"
import { UserEditorSheet } from "@/components/dashboard/user-editor-sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { useRowSelection } from "@/hooks/use-row-selection"
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
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDate } from "@/lib/billing"
import {
  companyDocumentKindMeta,
  companyDocumentStatusMeta,
  createCompanyDocument,
  deleteCompanyDocument,
  getCompanyDocuments,
  getCompanyDocumentsByCompanyId,
  updateCompanyDocument,
  type CompanyDocument,
} from "@/lib/company-documents"
import { tsToMillis } from "@/lib/tasks"
import { cn } from "@/lib/utils"

const DOCUMENT_SORTS: SortOption<CompanyDocument>[] = [
  { value: "updatedAt", label: "Last updated", get: (row) => tsToMillis(row.updatedAt) || tsToMillis(row.createdAt), ascLabel: "Oldest", descLabel: "Newest" },
  { value: "title", label: "Title", get: (row) => row.title, ascLabel: "A–Z", descLabel: "Z–A" },
  { value: "client", label: "Company", get: (row) => row.client || row.companyId, ascLabel: "A–Z", descLabel: "Z–A" },
  { value: "kind", label: "Type", get: (row) => companyDocumentKindMeta[row.kind]?.label ?? row.kind, ascLabel: "A–Z", descLabel: "Z–A" },
  { value: "status", label: "Status", get: (row) => companyDocumentStatusMeta[row.status]?.label ?? row.status, ascLabel: "A–Z", descLabel: "Z–A" },
]

function searchDocument(row: CompanyDocument) {
  return [row.title, row.summary, row.client, row.companyId, row.project, companyDocumentKindMeta[row.kind]?.label, companyDocumentStatusMeta[row.status]?.label]
}

/** The updated stamp, which is a Timestamp rather than the yyyy-mm-dd strings billing uses. */
function updatedLabel(row: CompanyDocument) {
  const stamp = row.updatedAt ?? row.createdAt
  return stamp ? formatDate(stamp.toDate().toISOString().slice(0, 10)) : "—"
}

export default function DocumentsPage() {
  const router = useRouter()
  const { user, appUser, isAdmin, isImpersonating } = useAuth()
  const companyId = appUser?.companyId ?? ""
  const adminView = isAdmin && !isImpersonating
  const [documents, setDocuments] = useState<CompanyDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<CompanyDocument | null>(null)
  const [clientSheet, setClientSheet] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [bulkDeleting, setBulkDeleting] = useState(false)
  const [duplicateTarget, setDuplicateTarget] = useState<CompanyDocument | null>(null)
  const [duplicating, setDuplicating] = useState(false)
  const [creating, setCreating] = useState(false)
  const [importing, setImporting] = useState(false)

  const fetchData = useCallback(async () => {
    setError(false)
    try {
      setDocuments(adminView ? await getCompanyDocuments() : await getCompanyDocumentsByCompanyId(companyId))
    } catch (loadError) {
      console.error("Error loading documents:", loadError)
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [adminView, companyId])

  useEffect(() => {
    void fetchData()
  }, [fetchData])

  async function confirmDuplicateDocument(selection: DuplicateSelection) {
    if (!duplicateTarget || duplicating) return
    setDuplicating(true)
    try {
      const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...rest } = duplicateTarget
      const newId = await createCompanyDocument({
        ...rest,
        title: `${duplicateTarget.title} (copy)`,
        status: "draft",
        shareEnabled: false,
        companyId: selection.companyId,
        client: selection.client || duplicateTarget.client,
        projectId: selection.projectId,
        project: selection.project,
      })
      setDuplicateTarget(null)
      router.push(`/dashboard/documents/${newId}/edit`)
    } catch (duplicateError) {
      console.error("Error duplicating document:", duplicateError)
      toast.error("Couldn't duplicate this document.")
    } finally {
      setDuplicating(false)
    }
  }

  async function togglePublic(row: CompanyDocument, next: boolean) {
    setDocuments((current) => current.map((item) => (item.id === row.id ? { ...item, shareEnabled: next } : item)))
    try {
      await updateCompanyDocument(row.id, { shareEnabled: next })
    } catch (toggleError) {
      console.error("Error updating document visibility:", toggleError)
      setDocuments((current) => current.map((item) => (item.id === row.id ? { ...item, shareEnabled: !next } : item)))
      toast.error("Couldn't change who can see this document.")
    }
  }

  async function removeDocument() {
    if (!confirmDelete) return
    setDeleting(true)
    try {
      await deleteCompanyDocument(confirmDelete.id)
      setDocuments((current) => current.filter((row) => row.id !== confirmDelete.id))
      setConfirmDelete(null)
    } catch (deleteError) {
      console.error("Error deleting document:", deleteError)
    } finally {
      setDeleting(false)
    }
  }

  const sorts = useMemo(
    () => (adminView ? DOCUMENT_SORTS : DOCUMENT_SORTS.filter((option) => option.value !== "client")),
    [adminView],
  )
  const { results: visibleDocuments, bar } = useFilterBar({
    items: documents,
    search: searchDocument,
    sorts,
    defaultSort: "updatedAt",
    defaultDirection: "desc",
  })

  const selection = useRowSelection(visibleDocuments, (row) => row.id)

  async function handleBulkDelete() {
    const ids = selection.selectedIds
    if (ids.length === 0 || bulkDeleting) return
    setBulkDeleting(true)
    try {
      await Promise.all(ids.map((id) => deleteCompanyDocument(id)))
      const removed = new Set(ids)
      setDocuments((current) => current.filter((row) => !removed.has(row.id)))
      if (confirmDelete && removed.has(confirmDelete.id)) setConfirmDelete(null)
      selection.clear()
    } catch (deleteError) {
      console.error("Error deleting documents:", deleteError)
    } finally {
      setBulkDeleting(false)
    }
  }

  if (!user) return null

  return (
    <main className="mx-auto w-full max-w-5xl px-4 pt-4 pb-12 sm:px-6">
      <FilterBar
        {...bar}
        placeholder="Search documents"
        actions={
          adminView && (
            <>
              <Button variant="outline" onClick={() => setImporting(true)}><FileUp className="size-4" aria-hidden="true" />Import</Button>
              <Button onClick={() => setCreating(true)}><Plus className="size-4" aria-hidden="true" />New</Button>
            </>
          )
        }
      />

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="size-8 animate-spin text-muted-foreground" aria-hidden="true" /></div>
      ) : error ? (
        <p className="mt-10 text-sm text-destructive">Couldn&rsquo;t load documents right now.</p>
      ) : documents.length === 0 ? (
        <FirstRunState
          className="mt-2"
          label="Document"
          title={adminView ? "Let's create your first document" : "No documents yet"}
          description={adminView
            ? "This is where you make the things you send to clients — proposals, contracts, statements of work. Pick a template or start blank, and we'll suggest the sections to include."
            : "Documents your agency shares with you will show up here."}
          action={adminView ? <Button onClick={() => setCreating(true)}>New Document</Button> : undefined}
        />
      ) : visibleDocuments.length === 0 ? (
        <EmptySearchState label="No documents match your search." />
      ) : (
        <>
        {adminView && (
          <TableBulkBar
            count={selection.selectedCount}
            noun="document"
            deleting={bulkDeleting}
            onClear={selection.clear}
            onDelete={handleBulkDelete}
          />
        )}
        <Table>
          <TableHeader>
            <TableRow>
              {adminView && (
                <TableHead className="w-10">
                  <Checkbox
                    aria-label="Select all documents"
                    checked={selection.allSelected}
                    indeterminate={selection.someSelected}
                    onChange={selection.toggleAll}
                  />
                </TableHead>
              )}
              <TableHead>Title</TableHead>
              {adminView && <TableHead>Company</TableHead>}
              <TableHead>Public</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead>Status</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleDocuments.map((row) => {
              const meta = companyDocumentStatusMeta[row.status] ?? companyDocumentStatusMeta.draft
              return (
                <TableRow key={row.id}>
                  {adminView && (
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        aria-label={`Select ${row.title}`}
                        checked={selection.isSelected(row.id)}
                        onChange={() => selection.toggle(row.id)}
                      />
                    </TableCell>
                  )}
                  <TableCell className="font-medium"><Link href={adminView ? `/dashboard/documents/${row.id}/edit` : `/dashboard/documents/${row.id}`} className="rounded-sm outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring">{row.title}</Link></TableCell>
                  {adminView && <TableCell>{row.companyId ? <button type="button" onClick={() => setClientSheet(row.companyId)} className="rounded-sm text-left outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring">{row.client || "Company"}</button> : "—"}</TableCell>}
                  <TableCell>
                    {adminView ? (
                      <Switch
                        checked={row.shareEnabled ?? false}
                        onCheckedChange={(next) => togglePublic(row, next)}
                        aria-label={`Make ${row.title} public`}
                      />
                    ) : (
                      (row.shareEnabled ?? false) ? "Public" : "Private"
                    )}
                  </TableCell>
                  <TableCell>{updatedLabel(row)}</TableCell>
                  <TableCell><span className={cn("inline-flex rounded-full px-2 py-0.5 text-xs font-medium", meta.className)}>{meta.label}</span></TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-0.5">
                      <Link href={`/dashboard/documents/${row.id}`} aria-label={`View ${row.title}`} className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"><Eye className="size-4" aria-hidden="true" /></Link>
                      {adminView && <>
                        <Link href={`/dashboard/documents/${row.id}/edit`} aria-label={`Edit ${row.title}`} className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"><Pencil className="size-4" aria-hidden="true" /></Link>
                        <button type="button" onClick={() => setDuplicateTarget(row)} aria-label={`Duplicate ${row.title}`} className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"><Copy className="size-4" aria-hidden="true" /></button>
                        <button type="button" onClick={() => setConfirmDelete(row)} aria-label={`Delete ${row.title}`} className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-destructive focus-visible:ring-2 focus-visible:ring-ring"><Trash2 className="size-4" aria-hidden="true" /></button>
                      </>}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        </>
      )}

      {adminView && <AlertDialog open={confirmDelete !== null} onOpenChange={(open) => !open && setConfirmDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete this document?</AlertDialogTitle><AlertDialogDescription>{confirmDelete?.title} will be removed for good. This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel><AlertDialogAction onClick={(event) => { event.preventDefault(); void removeDocument() }} disabled={deleting}>{deleting && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>}

      {adminView && (
        <DuplicateDocumentDialog
          open={duplicateTarget !== null}
          onOpenChange={(open) => !open && setDuplicateTarget(null)}
          title={`Duplicate ${duplicateTarget?.title ?? "document"}`}
          description="Choose which company and project the copy belongs to."
          defaultCompanyId={duplicateTarget?.companyId ?? ""}
          defaultProjectId={duplicateTarget?.projectId}
          submitting={duplicating}
          onConfirm={confirmDuplicateDocument}
        />
      )}

      {adminView && <NewDocumentDialog open={creating} onOpenChange={setCreating} />}

      {adminView && <ImportWordDocumentDialog open={importing} onOpenChange={setImporting} />}

      {adminView && <UserEditorSheet open={clientSheet !== null} companyId={clientSheet ?? ""} onClose={() => setClientSheet(null)} onSaved={() => setClientSheet(null)} />}
    </main>
  )
}
