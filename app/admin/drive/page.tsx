"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ExternalLink, FileText, Loader2, Plus, Trash2, Users } from "lucide-react"
import { getUsers, type AppUser } from "@/lib/users"
import {
  createDocument,
  deleteDocument,
  getDocuments,
  type SharedDocument,
} from "@/lib/documents"

const ALL_CLIENTS = "all"

type FormState = {
  title: string
  url: string
  description: string
  shareWith: string
}

const EMPTY_FORM: FormState = { title: "", url: "", description: "", shareWith: ALL_CLIENTS }

function clientLabel(u: AppUser) {
  return u.company || u.displayName || u.email || u.uid
}

export default function DriveAdminPage() {
  const [documents, setDocuments] = useState<SharedDocument[]>([])
  const [users, setUsers] = useState<AppUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  const [sheetOpen, setSheetOpen] = useState(false)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  async function fetchData() {
    setError(null)
    try {
      const [docs, us] = await Promise.all([getDocuments(), getUsers()])
      setDocuments(docs)
      setUsers(us)
    } catch (err) {
      console.error("Error loading documents:", err)
      setError(err instanceof Error ? err.message : "Failed to load documents.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // One workspace per clientId, so users sharing a clientId collapse to one row.
  const clientOptions = Array.from(
    new Map(users.filter((u) => u.clientId).map((u) => [u.clientId as string, u])).values(),
  )

  function openSheet() {
    setForm(EMPTY_FORM)
    setFormError(null)
    setSheetOpen(true)
  }

  async function handleShare(e: React.FormEvent) {
    e.preventDefault()
    if (saving) return
    setFormError(null)

    const title = form.title.trim()
    const url = form.url.trim()
    if (!title || !url) {
      setFormError("A title and a link are both required.")
      return
    }

    setSaving(true)
    try {
      const isAll = form.shareWith === ALL_CLIENTS
      const target = isAll ? null : clientOptions.find((u) => u.clientId === form.shareWith)
      await createDocument({
        title,
        url,
        description: form.description.trim(),
        clientId: isAll ? "" : form.shareWith,
        sharedWith: isAll ? "All clients" : target ? clientLabel(target) : "",
      })
      setSheetOpen(false)
      await fetchData()
    } catch (err) {
      console.error("Error sharing document:", err)
      setFormError(err instanceof Error ? err.message : "Failed to share document.")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    setDeleting(id)
    try {
      await deleteDocument(id)
      setDocuments((prev) => prev.filter((d) => d.id !== id))
    } catch (err) {
      console.error("Error deleting document:", err)
    } finally {
      setDeleting(null)
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pt-6 pb-12 sm:px-6">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Drive</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Share documents and links with your clients. They&apos;ll see them on their dashboard.
          </p>
        </div>
        <Button className="shrink-0" onClick={openSheet}>
          <Plus className="mr-2 h-4 w-4" />
          Share document
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-destructive">{error}</CardContent>
        </Card>
      ) : documents.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="mb-4 text-muted-foreground">Nothing shared yet.</p>
            <Button onClick={openSheet}>
              <Plus className="mr-2 h-4 w-4" />
              Share your first document
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead>Shared with</TableHead>
                <TableHead>Link</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                      </span>
                      <div className="min-w-0">
                        <div className="font-medium">{d.title}</div>
                        {d.description && (
                          <div className="truncate text-xs text-muted-foreground">{d.description}</div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                      {d.clientId === "" && <Users className="h-3 w-3" />}
                      {d.sharedWith || (d.clientId === "" ? "All clients" : d.clientId)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <a
                      href={d.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      Open
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </TableCell>
                  <TableCell className="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          aria-label="Remove document"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove document?</AlertDialogTitle>
                          <AlertDialogDescription>
                            You&apos;re about to unshare &quot;{d.title}&quot;. Clients will no longer see it. This
                            can&apos;t be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(d.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {deleting === d.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Remove"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full gap-0 p-0 sm:max-w-md">
          <SheetHeader className="border-b border-border">
            <SheetTitle>Share document</SheetTitle>
            <SheetDescription>Paste a link and choose who can see it.</SheetDescription>
          </SheetHeader>
          <form onSubmit={handleShare} className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 space-y-4 overflow-y-auto px-4 pb-4 pt-4">
              <div className="space-y-1.5">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Brand guidelines"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="url">Link</Label>
                <Input
                  id="url"
                  type="url"
                  value={form.url}
                  onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                  placeholder="https://..."
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="description">Description (optional)</Label>
                <Input
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="A short note about this file"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="shareWith">Share with</Label>
                <Select value={form.shareWith} onValueChange={(v) => setForm((f) => ({ ...f, shareWith: v }))}>
                  <SelectTrigger id="shareWith" className="w-full">
                    <SelectValue placeholder="Choose a client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL_CLIENTS}>All clients</SelectItem>
                    {clientOptions.map((u) => (
                      <SelectItem key={u.clientId} value={u.clientId as string}>
                        {clientLabel(u)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formError && <p className="text-sm text-destructive">{formError}</p>}
            </div>

            <div className="flex justify-end gap-3 border-t border-border p-4">
              <Button type="button" variant="outline" onClick={() => setSheetOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Share
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </main>
  )
}
