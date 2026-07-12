"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ArrowUp,
  Copy,
  Download,
  File,
  FileText,
  Image as ImageIcon,
  Info,
  Link2,
  Loader2,
  MoreVertical,
  Plus,
  Share2,
  Trash2,
  Upload,
  Users,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { getUsers, type AppUser } from "@/lib/users"
import {
  createDocument,
  deleteDocument,
  getDocuments,
  updateDocumentSharing,
  uploadFileToStorage,
  type SharedDocument,
} from "@/lib/documents"

function clientLabel(u: AppUser) {
  return u.company || u.displayName || u.email || u.uid
}

function FileIcon({ doc }: { doc: SharedDocument }) {
  if (doc.type === "image" && doc.url) {
    return (
      <div className="relative h-full w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={doc.url} alt={doc.title} className="h-full w-full object-cover" />
      </div>
    )
  }
  const url = doc.url.toLowerCase()
  if (url.includes("figma.com")) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-purple-50 dark:bg-purple-950/30">
        <svg className="h-10 w-10" viewBox="0 0 38 57" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 28.5C19 25.9804 20.0009 23.5641 21.7825 21.7825C23.5641 20.0009 25.9804 19 28.5 19C31.0196 19 33.4359 20.0009 35.2175 21.7825C36.9991 23.5641 38 25.9804 38 28.5C38 31.0196 36.9991 33.4359 35.2175 35.2175C33.4359 36.9991 31.0196 38 28.5 38C25.9804 38 23.5641 36.9991 21.7825 35.2175C20.0009 33.4359 19 31.0196 19 28.5Z" fill="#1ABCFE" />
          <path d="M0 47.5C0 44.9804 1.00089 42.5641 2.78249 40.7825C4.56408 39.0009 6.98044 38 9.5 38H19V47.5C19 50.0196 17.9991 52.4359 16.2175 54.2175C14.4359 55.9991 12.0196 57 9.5 57C6.98044 57 4.56408 55.9991 2.78249 54.2175C1.00089 52.4359 0 50.0196 0 47.5Z" fill="#0ACF83" />
          <path d="M19 0V19H28.5C31.0196 19 33.4359 17.9991 35.2175 16.2175C36.9991 14.4359 38 12.0196 38 9.5C38 6.98044 36.9991 4.56408 35.2175 2.78249C33.4359 1.00089 31.0196 0 28.5 0H19Z" fill="#FF7262" />
          <path d="M0 9.5C0 12.0196 1.00089 14.4359 2.78249 16.2175C4.56408 17.9991 6.98044 19 9.5 19H19V0H9.5C6.98044 0 4.56408 1.00089 2.78249 2.78249C1.00089 4.56408 0 6.98044 0 9.5Z" fill="#F24E1E" />
          <path d="M0 28.5C0 31.0196 1.00089 33.4359 2.78249 35.2175C4.56408 36.9991 6.98044 38 9.5 38H19V19H9.5C6.98044 19 4.56408 20.0009 2.78249 21.7825C1.00089 23.5641 0 25.9804 0 28.5Z" fill="#A259FF" />
        </svg>
      </div>
    )
  }
  if (url.includes("docs.google.com/document") || url.includes("google.com/document")) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-blue-50 dark:bg-blue-950/30">
        <FileText className="h-10 w-10 text-blue-500" />
      </div>
    )
  }
  if (url.includes("docs.google.com/spreadsheet") || url.includes("sheets.google.com")) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-green-50 dark:bg-green-950/30">
        <FileText className="h-10 w-10 text-green-500" />
      </div>
    )
  }
  if (url.includes("drive.google.com")) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-blue-50 dark:bg-blue-950/30">
        <FileText className="h-10 w-10 text-blue-400" />
      </div>
    )
  }
  if (url.includes("notion.so") || url.includes("notion.com")) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-50 dark:bg-gray-900/30">
        <FileText className="h-10 w-10 text-gray-800 dark:text-gray-200" />
      </div>
    )
  }
  if (url.endsWith(".pdf") || url.includes(".pdf?")) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-red-50 dark:bg-red-950/30">
        <FileText className="h-10 w-10 text-red-500" />
      </div>
    )
  }
  if (url.endsWith(".doc") || url.endsWith(".docx")) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-blue-50 dark:bg-blue-950/30">
        <FileText className="h-10 w-10 text-blue-600" />
      </div>
    )
  }
  if (url.endsWith(".xls") || url.endsWith(".xlsx") || url.endsWith(".csv")) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-green-50 dark:bg-green-950/30">
        <FileText className="h-10 w-10 text-green-600" />
      </div>
    )
  }
  if (url.endsWith(".jpg") || url.endsWith(".jpeg") || url.endsWith(".png") || url.endsWith(".gif") || url.endsWith(".webp")) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-purple-50 dark:bg-purple-950/30">
        <ImageIcon className="h-10 w-10 text-purple-500" />
      </div>
    )
  }
  if (doc.type === "file") {
    return (
      <div className="flex h-full w-full items-center justify-center bg-muted">
        <File className="h-10 w-10 text-muted-foreground" />
      </div>
    )
  }
  return (
    <div className="flex h-full w-full items-center justify-center bg-muted">
      <Link2 className="h-10 w-10 text-muted-foreground" />
    </div>
  )
}

type UploadingCard = { id: string; name: string; progress: number }

export default function DriveAdminPage() {
  const [documents, setDocuments] = useState<SharedDocument[]>([])
  const [users, setUsers] = useState<AppUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [, setDeleting] = useState<string | null>(null)
  const [uploading, setUploading] = useState<UploadingCard[]>([])
  const [dragging, setDragging] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [sharingDocument, setSharingDocument] = useState<SharedDocument | null>(null)
  const [previewDocument, setPreviewDocument] = useState<SharedDocument | null>(null)
  const [shareUserIds, setShareUserIds] = useState<string[]>([])
  const [shareQuery, setShareQuery] = useState("")
  const [savingShare, setSavingShare] = useState(false)
  const dragCounter = useRef(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  useEffect(() => { fetchData() }, [])

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

  async function uploadFiles(files: File[]) {
    for (const file of files) {
      const uploadId = `${Date.now()}_${file.name}`
      setUploading((prev) => [...prev, { id: uploadId, name: file.name, progress: 0 }])
      try {
        const url = await uploadFileToStorage(file, (pct) => {
          setUploading((prev) => prev.map((u) => (u.id === uploadId ? { ...u, progress: pct } : u)))
        })
        const isImage = file.type.startsWith("image/")
        await createDocument({
          title: file.name.replace(/\.[^.]+$/, ""),
          url,
          description: "",
          clientId: "",
          sharedWith: "Private",
          sharedWithUserIds: [],
          type: isImage ? "image" : "file",
          thumbnailUrl: isImage ? url : undefined,
        })
        setUploading((prev) => prev.filter((u) => u.id !== uploadId))
        await fetchData()
      } catch (err) {
        console.error("Error uploading file:", err)
        setUploading((prev) => prev.filter((u) => u.id !== uploadId))
      }
    }
  }

  useEffect(() => {
    function onDragEnter(e: DragEvent) {
      e.preventDefault()
      dragCounter.current++
      if (e.dataTransfer?.types.includes("Files")) setDragging(true)
    }
    function onDragLeave(e: DragEvent) {
      e.preventDefault()
      dragCounter.current--
      if (dragCounter.current === 0) setDragging(false)
    }
    function onDragOver(e: DragEvent) { e.preventDefault() }
    async function onDrop(e: DragEvent) {
      e.preventDefault()
      dragCounter.current = 0
      setDragging(false)
      if (e.dataTransfer?.files.length) await uploadFiles(Array.from(e.dataTransfer.files))
    }
    window.addEventListener("dragenter", onDragEnter)
    window.addEventListener("dragleave", onDragLeave)
    window.addEventListener("dragover", onDragOver)
    window.addEventListener("drop", onDrop)
    return () => {
      window.removeEventListener("dragenter", onDragEnter)
      window.removeEventListener("dragleave", onDragLeave)
      window.removeEventListener("dragover", onDragOver)
      window.removeEventListener("drop", onDrop)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) uploadFiles(Array.from(e.target.files))
    e.target.value = ""
  }

  function openShareDialog(document: SharedDocument) {
    setSharingDocument(document)
    setShareUserIds(document.sharedWithUserIds ?? [])
    setShareQuery("")
  }

  async function saveSharing() {
    if (!sharingDocument) return
    setSavingShare(true)
    try {
      await updateDocumentSharing(sharingDocument.id, shareUserIds)
      setDocuments((current) => current.map((document) => document.id === sharingDocument.id
        ? { ...document, sharedWithUserIds: shareUserIds, sharedWith: shareUserIds.length ? "Selected users" : "Private" }
        : document))
      setSharingDocument(null)
    } finally {
      setSavingShare(false)
    }
  }

  const isEmpty = documents.length === 0 && uploading.length === 0
  const selectedDocument = documents.find((document) => document.id === selectedId)

  return (
    <main className="relative mx-auto w-full max-w-6xl px-4 pt-6 pb-12 sm:px-6">
      {dragging && (
        <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-background/85 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-primary bg-card px-16 py-12 shadow-xl">
            <Upload className="h-12 w-12 text-primary" />
            <p className="text-lg font-semibold">Drop to upload</p>
            <p className="text-sm text-muted-foreground">Files will be shared with all clients</p>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileInput}
      />

      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Drive</h1>

        </div>
        <Button className="shrink-0" onClick={() => fileInputRef.current?.click()}>
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </div>

      {selectedDocument && (
        <div className="mb-8 flex min-h-16 items-center gap-2 rounded-[32px] bg-[#edf2f8] px-4 text-[#3c4043] dark:bg-muted dark:text-foreground">
          <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setSelectedId(null)} aria-label="Clear selection"><X className="h-5 w-5" /></Button>
          <span className="mr-5 text-base font-medium">1 selected</span>
          <Button variant="ghost" size="icon" className="rounded-full" asChild aria-label="Download file"><a href={selectedDocument.url} download><Download className="h-5 w-5" /></a></Button>
          <Button variant="ghost" size="icon" className="rounded-full" onClick={() => openShareDialog(selectedDocument)} aria-label="Share file"><Share2 className="h-5 w-5" /></Button>
          <Button variant="ghost" size="icon" className="rounded-full" onClick={() => navigator.clipboard.writeText(selectedDocument.url)} aria-label="Copy link"><Link2 className="h-5 w-5" /></Button>
          <MoreVertical className="ml-1 h-5 w-5" />
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <Card>
          <div className="py-10 text-center text-sm text-destructive">{error}</div>
        </Card>
      ) : isEmpty ? (
        <div
          className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-24 text-center cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="mb-4 h-10 w-10 text-muted-foreground/50" />
          <p className="mb-1 font-medium">No files yet</p>
          <p className="text-sm text-muted-foreground">Click to upload or drag and drop files here</p>
        </div>
      ) : (
        <section>
          <div className="mb-5 flex items-center gap-2 px-2 text-sm font-semibold text-foreground/80">
            <span>Name</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300"><ArrowUp className="h-4 w-4" /></span>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {uploading.map((u) => (
              <div key={u.id} className="flex flex-col overflow-hidden rounded-2xl bg-[#edf2f8] p-3 dark:bg-muted">
                <div className="mb-3 truncate px-1 text-sm font-medium">{u.name}</div>
                <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl bg-background">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <div
                    className="absolute bottom-0 left-0 h-0.5 bg-primary transition-all"
                    style={{ width: `${u.progress}%` }}
                  />
                </div>
                <div className="p-3">
                  <p className="mt-0.5 text-xs text-muted-foreground">Uploading… {u.progress}%</p>
                </div>
              </div>
            ))}

            {documents.map((d) => (
              <div
                key={d.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedId((current) => current === d.id ? null : d.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") setSelectedId((current) => current === d.id ? null : d.id)
                }}
                className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border p-3 transition-colors ${selectedId === d.id ? "border-blue-500 bg-[#c2e7ff] dark:bg-blue-950/60" : "border-transparent bg-[#edf2f8] hover:bg-[#e4eaf1] dark:bg-muted dark:hover:bg-muted/80"}`}
              >
                <div className="flex min-w-0 items-center gap-3 px-1 pb-3">
                  <FileText className="h-5 w-5 shrink-0 text-blue-600" />
                  <span className={`block min-w-0 flex-1 truncate text-sm font-medium ${selectedId === d.id ? "text-sky-900 dark:text-sky-100" : ""}`}>{d.title}</span>
                  {/* modal={false}: a Dialog opened from a menu item races the menu's
                      body pointer-events cleanup and freezes the page (radix#3317) */}
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="-mr-2 h-8 w-8 shrink-0 rounded-full"
                        aria-label={`Actions for ${d.title}`}
                        onClick={(event) => event.stopPropagation()}
                      >
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      sideOffset={8}
                      className="w-72 rounded-xl border-border/70 p-2 shadow-xl"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <DropdownMenuItem className="h-11 rounded-lg px-3 text-sm" asChild>
                        <a href={d.url} target="_blank" rel="noopener noreferrer"><Share2 />Open</a>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="h-11 rounded-lg px-3 text-sm" asChild>
                        <a href={d.url} download><Download />Download</a>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="h-11 rounded-lg px-3 text-sm" onSelect={() => navigator.clipboard.writeText(d.url)}>
                        <Copy />Make a copy of link
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="my-2" />
                      <DropdownMenuItem className="h-11 rounded-lg px-3 text-sm" onSelect={() => openShareDialog(d)}>
                        <Share2 />Share
                      </DropdownMenuItem>
                      <DropdownMenuItem className="h-11 rounded-lg px-3 text-sm" onSelect={() => setSelectedId(d.id)}>
                        <Info />File information
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="my-2" />
                      <DropdownMenuItem variant="destructive" className="h-11 rounded-lg px-3 text-sm" onSelect={() => handleDelete(d.id)}>
                        <Trash2 />Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div
                  className="aspect-[4/3] w-full shrink-0 cursor-zoom-in overflow-hidden rounded-xl bg-background"
                  onClick={(event) => {
                    event.stopPropagation()
                    setPreviewDocument(d)
                  }}
                  aria-label={`Preview ${d.title}`}
                >
                  <FileIcon doc={d} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <Dialog open={sharingDocument !== null} onOpenChange={(open) => { if (!open) setSharingDocument(null) }}>
        <DialogContent className="max-w-sm gap-0 overflow-hidden rounded-2xl p-0">
          {/* Header */}
          <div className="px-5 pt-5 pb-4">
            <DialogTitle className="text-[15px] font-semibold">Share &ldquo;{sharingDocument?.title}&rdquo;</DialogTitle>
            <DialogDescription className="sr-only">Add people to give them access to this file.</DialogDescription>

            {/* Combobox input with chips */}
            <div className="relative mt-3">
              <div className="flex min-h-[42px] flex-wrap items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-2 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-0">
                {shareUserIds.map((uid) => {
                  const u = users.find((x) => x.uid === uid)
                  if (!u) return null
                  return (
                    <span key={uid} className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      {clientLabel(u)}
                      <button
                        type="button"
                        onClick={() => setShareUserIds((cur) => cur.filter((id) => id !== uid))}
                        className="ml-0.5 rounded-full opacity-60 transition-opacity hover:opacity-100"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )
                })}
                <input
                  type="text"
                  placeholder={shareUserIds.length === 0 ? "Add people by name or email…" : ""}
                  value={shareQuery}
                  onChange={(e) => setShareQuery(e.target.value)}
                  className="min-w-[120px] flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>

              {/* Dropdown suggestions */}
              {shareQuery.trim().length > 0 && (() => {
                const q = shareQuery.toLowerCase()
                const suggestions = users.filter(
                  (u) => u.role !== "admin" &&
                    !shareUserIds.includes(u.uid) &&
                    (clientLabel(u).toLowerCase().includes(q) || (u.email ?? "").toLowerCase().includes(q))
                )
                return suggestions.length > 0 ? (
                  <div className="absolute left-0 right-0 top-full z-50 mt-1.5 overflow-hidden rounded-xl border border-border bg-popover shadow-lg">
                    {suggestions.map((u) => (
                      <button
                        key={u.uid}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault()
                          setShareUserIds((cur) => [...cur, u.uid])
                          setShareQuery("")
                        }}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-muted"
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                          {clientLabel(u).slice(0, 1).toUpperCase()}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-[13px] font-medium">{clientLabel(u)}</span>
                          <span className="block truncate text-xs text-muted-foreground">{u.email}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="absolute left-0 right-0 top-full z-50 mt-1.5 rounded-xl border border-border bg-popover px-4 py-3 shadow-lg">
                    <p className="text-xs text-muted-foreground">No matching users found.</p>
                  </div>
                )
              })()}
            </div>
          </div>

          {/* Who has access */}
          {shareUserIds.length > 0 && (
            <>
              <div className="border-t" />
              <div className="max-h-52 overflow-y-auto py-2">
                <p className="px-5 pb-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Has access</p>
                {users.filter((u) => shareUserIds.includes(u.uid)).map((u) => (
                  <div key={u.uid} className="flex items-center gap-3 px-5 py-2">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-[13px] font-semibold text-primary-foreground">
                      {clientLabel(u).slice(0, 1).toUpperCase()}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-medium leading-tight">{clientLabel(u)}</span>
                      <span className="block truncate text-xs text-muted-foreground">{u.email}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setShareUserIds((cur) => cur.filter((id) => id !== u.uid))}
                      className="shrink-0 rounded-lg p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="border-t" />

          {/* Footer */}
          <div className="flex items-center justify-between gap-3 px-5 py-4">
            <button
              type="button"
              onClick={() => setSharingDocument(null)}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Cancel
            </button>
            <Button size="sm" onClick={saveSharing} disabled={savingShare} className="rounded-xl px-5">
              {savingShare && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={previewDocument !== null} onOpenChange={(open) => { if (!open) setPreviewDocument(null) }}>
        <DialogContent className="h-[88vh] max-w-5xl grid-rows-[auto_1fr] gap-0 overflow-hidden rounded-2xl p-0">
          <DialogHeader className="border-b px-6 py-4 pr-14">
            <div className="min-w-0">
              <DialogTitle className="truncate">{previewDocument?.title}</DialogTitle>
              <DialogDescription>File preview</DialogDescription>
            </div>
          </DialogHeader>
          <div className="min-h-0 flex-1 bg-muted/50 p-4">
            {previewDocument && (
              previewDocument.type === "image" || /\.(png|jpe?g|gif|webp)(\?|$)/i.test(previewDocument.url)
                ? <img src={previewDocument.url} alt={previewDocument.title} className="h-full w-full object-contain" />
                : <iframe src={previewDocument.url} title={previewDocument.title} className="h-full w-full rounded-lg border bg-background" />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </main>
  )
}
