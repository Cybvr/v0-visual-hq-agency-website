"use client"

import { Loader2, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

/**
 * Action bar shown above a table when one or more rows are selected. Confirms
 * before running the bulk delete the page supplies.
 */
export function TableBulkBar({
  count,
  noun = "item",
  deleting = false,
  onClear,
  onDelete,
}: {
  count: number
  /** Singular label, e.g. "contact" — pluralised with a trailing "s". */
  noun?: string
  deleting?: boolean
  onClear: () => void
  onDelete: () => void
}) {
  if (count === 0) return null
  const label = `${count} ${noun}${count === 1 ? "" : "s"}`
  return (
    <div className="mb-3 flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/40 px-3 py-2">
      <span className="text-sm font-medium">{count} selected</span>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onClear}>Clear</Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" disabled={deleting}>
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete {label}?</AlertDialogTitle>
              <AlertDialogDescription>
                You&apos;re about to delete {label}. This can&apos;t be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={onDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
