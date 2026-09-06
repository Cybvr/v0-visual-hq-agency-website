"use client"

import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Download, Eye, Loader2, Pencil, Plus, Trash2 } from "lucide-react"

import { useAuth } from "@/components/auth-provider"
import { UserEditorSheet } from "@/components/dashboard/user-editor-sheet"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  contractStatusMeta,
  deleteContract,
  formatDate,
  getContracts,
  getContractsByClientId,
  type Contract,
} from "@/lib/billing"
import { FilterBar, useFilterBar, type SortOption } from "@/components/dashboard/filter-bar"
import { tsToMillis } from "@/lib/tasks"
import { cn } from "@/lib/utils"

const CONTRACT_SORTS: SortOption<Contract>[] = [
  {
    value: "createdAt",
    label: "Date created",
    get: (c) => tsToMillis(c.createdAt),
    ascLabel: "Oldest",
    descLabel: "Newest",
  },
  { value: "title", label: "Title", get: (c) => c.title, ascLabel: "A–Z", descLabel: "Z–A" },
  { value: "client", label: "Client", get: (c) => c.client || c.clientId, ascLabel: "A–Z", descLabel: "Z–A" },
  { value: "startsOn", label: "Start date", get: (c) => c.startsOn, ascLabel: "Oldest", descLabel: "Newest" },
  { value: "endsOn", label: "End date", get: (c) => c.endsOn, ascLabel: "Soonest", descLabel: "Latest" },
  {
    value: "status",
    label: "Status",
    get: (c) => contractStatusMeta[c.status]?.label ?? c.status,
    ascLabel: "A–Z",
    descLabel: "Z–A",
  },
]

function searchContract(c: Contract) {
  return [c.title, c.client, c.clientId, c.project, contractStatusMeta[c.status]?.label]
}

export default function ContractsPage() {
  const { user, appUser, isAdmin, isImpersonating } = useAuth()
  const clientId = appUser?.clientId ?? ""
  const adminView = isAdmin && !isImpersonating

  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<Contract | null>(null)
  const [clientSheet, setClientSheet] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchData = useCallback(async () => {
    setError(false)
    try {
      setContracts(adminView ? await getContracts() : await getContractsByClientId(clientId))
    } catch (err) {
      console.error("Error loading contracts:", err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [adminView, clientId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  async function removeContract() {
    if (!confirmDelete) return
    setDeleting(true)
    try {
      await deleteContract(confirmDelete.id)
      setContracts((current) => current.filter((row) => row.id !== confirmDelete.id))
      setConfirmDelete(null)
    } catch (err) {
      console.error("Error deleting contract:", err)
    } finally {
      setDeleting(false)
    }
  }


  const sorts = useMemo(
    () => (adminView ? CONTRACT_SORTS : CONTRACT_SORTS.filter((option) => option.value !== "client")),
    [adminView],
  )
  const { results: visibleContracts, bar } = useFilterBar({
    items: contracts,
    search: searchContract,
    sorts,
    defaultSort: "createdAt",
    defaultDirection: "desc",
  })

  if (!user) return null

  const awaiting = contracts.filter((contract) => contract.status === "sent").length

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-9 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.02em]">Contracts</h1>
        </div>

        {adminView && (
          <Button asChild>
            <Link href="/dashboard/contracts/new">
              <Plus className="mr-2 size-4" aria-hidden="true" />
              New contract
            </Link>
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <p className="mt-10 text-sm text-destructive">Couldn&apos;t load contracts right now.</p>
      ) : contracts.length === 0 ? (
        <div className="mt-8 rounded-[14px] border border-dashed border-border bg-card px-5 py-12 text-center">
          <p className="text-sm text-muted-foreground">No contracts yet.</p>
          {adminView && (
            <Button asChild variant="outline" className="mt-4">
              <Link href="/dashboard/contracts/new">
                <Plus className="mr-2 size-4" aria-hidden="true" />
                New contract
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <>
          {awaiting > 0 && (
            <p className="mt-6 rounded-[12px] bg-amber-500/10 px-4 py-3 text-sm leading-6 text-amber-900 dark:text-amber-200">
              {awaiting} contract{awaiting === 1 ? "" : "s"} waiting on a signature.
            </p>
          )}

          <div className="mt-6">
            <FilterBar {...bar} placeholder="Search contracts" />
            {visibleContracts.length === 0 ? (
              <div className="rounded-[14px] border border-dashed border-border bg-card px-5 py-12 text-center">
                <p className="text-sm text-muted-foreground">No contracts match your search.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    {adminView && <TableHead>Client</TableHead>}
                    <TableHead>Project</TableHead>
                    <TableHead>Starts</TableHead>
                    <TableHead>Ends</TableHead>
                    <TableHead>Signed</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-24 text-right">
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visibleContracts.map((contract) => {
                    const meta = contractStatusMeta[contract.status] ?? contractStatusMeta.draft
                    return (
                      <TableRow key={contract.id}>
                        <TableCell className="font-medium">
                          {adminView ? (
                            <Link
                              href={`/dashboard/contracts/${contract.id}/edit`}
                              className="rounded-sm outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              {contract.title}
                            </Link>
                          ) : (
                            <Link
                              href={`/dashboard/contracts/${contract.id}`}
                              className="rounded-sm outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              {contract.title}
                            </Link>
                          )}
                        </TableCell>
                        {adminView && (
                          <TableCell>
                            {contract.clientId ? (
                              <button
                                type="button"
                                onClick={() => setClientSheet(contract.clientId)}
                                className="rounded-sm text-left outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
                              >
                                {contract.client || "Client"}
                              </button>
                            ) : (
                              "—"
                            )}
                          </TableCell>
                        )}
                        <TableCell>
                          {contract.projectId ? (
                            <Link
                              href={`/dashboard/projects/${contract.projectId}`}
                              className="rounded-sm outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              {contract.project || "Project"}
                            </Link>
                          ) : (
                            "—"
                          )}
                        </TableCell>
                        <TableCell>{formatDate(contract.startsOn)}</TableCell>
                        <TableCell>{formatDate(contract.endsOn)}</TableCell>
                        <TableCell>{formatDate(contract.signedOn)}</TableCell>
                        <TableCell>
                          <span className={cn("inline-flex rounded-full px-2 py-0.5 text-xs font-medium", meta.className)}>
                            {meta.label}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-0.5">
                            <Link
                              href={`/dashboard/contracts/${contract.id}`}
                              aria-label={`View contract ${contract.title}`}
                              className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              <Eye className="size-4" aria-hidden="true" />
                            </Link>
                            {contract.url && (
                              <a
                                href={contract.url}
                                target="_blank"
                                rel="noreferrer"
                                aria-label={`Open contract ${contract.title}`}
                                className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                              >
                                <Download className="size-4" aria-hidden="true" />
                              </a>
                            )}
                            {adminView && (
                              <>
                                <Link
                                  href={`/dashboard/contracts/${contract.id}/edit`}
                                  aria-label={`Edit contract ${contract.title}`}
                                  className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                  <Pencil className="size-4" aria-hidden="true" />
                                </Link>
                                <button
                                  type="button"
                                  onClick={() => setConfirmDelete(contract)}
                                  aria-label={`Delete contract ${contract.title}`}
                                  className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-destructive focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                  <Trash2 className="size-4" aria-hidden="true" />
                                </button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </div>
        </>
      )}

      {adminView && (
        <>

          <AlertDialog open={confirmDelete !== null} onOpenChange={(open) => !open && setConfirmDelete(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this contract?</AlertDialogTitle>
                <AlertDialogDescription>
                  {confirmDelete?.title} will be removed for good. This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={(event) => {
                    event.preventDefault()
                    removeContract()
                  }}
                  disabled={deleting}
                >
                  {deleting && <Loader2 className="mr-2 size-4 animate-spin" />}
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}

      {adminView && (
        <UserEditorSheet
          open={clientSheet !== null}
          clientId={clientSheet ?? ""}
          onClose={() => setClientSheet(null)}
          onSaved={() => setClientSheet(null)}
        />
      )}
    </main>
  )
}
