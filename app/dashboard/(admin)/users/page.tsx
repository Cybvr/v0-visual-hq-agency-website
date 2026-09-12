"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Eye, Pencil, Plus, Trash2, Loader2, User as UserIcon } from "lucide-react"
import { getUsers, deleteUser, type AppUser } from "@/lib/users"
import { UserEditorSheet } from "@/components/dashboard/user-editor-sheet"
import { useAuth } from "@/components/auth-provider"
import { FilterBar, useFilterBar, type SortOption } from "@/components/dashboard/filter-bar"
import { TableBulkBar } from "@/components/dashboard/table-bulk-bar"
import { Checkbox } from "@/components/ui/checkbox"
import { useRowSelection } from "@/hooks/use-row-selection"
import { tsToMillis } from "@/lib/tasks"
import { cn } from "@/lib/utils"

const USER_SORTS: SortOption<AppUser>[] = [
  { value: "name", label: "Name", get: (u) => u.displayName || u.email, ascLabel: "A–Z", descLabel: "Z–A" },
  { value: "email", label: "Email", get: (u) => u.email, ascLabel: "A–Z", descLabel: "Z–A" },
  { value: "role", label: "Role", get: (u) => u.role, ascLabel: "A–Z", descLabel: "Z–A" },
  { value: "company", label: "Company", get: (u) => u.company, ascLabel: "A–Z", descLabel: "Z–A" },
  {
    value: "createdAt",
    label: "Date added",
    get: (u) => tsToMillis(u.createdAt),
    ascLabel: "Oldest",
    descLabel: "Newest",
  },
]

function searchUser(u: AppUser) {
  return [u.displayName, u.email, u.company, u.role, u.companyId]
}

export default function UsersAdminPage() {
  const router = useRouter()
  const { viewAsUser } = useAuth()
  const [users, setUsers] = useState<AppUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [bulkDeleting, setBulkDeleting] = useState(false)
  const [selectedId, setSelectedId] = useState<string | "new" | null>(null)

  async function fetchUsers() {
    setError(null)
    try {
      const data = await getUsers()
      setUsers(data)
    } catch (err) {
      console.error("Error fetching users:", err)
      setError(err instanceof Error ? err.message : "Failed to load contacts.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  async function handleDelete(uid: string) {
    setDeleting(uid)
    try {
      await deleteUser(uid)
      setUsers((prev) => prev.filter((u) => u.uid !== uid))
      if (selectedId === uid) setSelectedId(null)
    } catch (err) {
      console.error("Error deleting user:", err)
    } finally {
      setDeleting(null)
    }
  }

  async function handleSaved() {
    await fetchUsers()
    setSelectedId(null)
  }

  function handleViewAs(u: AppUser) {
    viewAsUser(u)
    router.push("/dashboard")
  }

  const { results: visibleUsers, bar } = useFilterBar({
    items: users,
    search: searchUser,
    sorts: USER_SORTS,
    defaultSort: "name",
  })

  const selection = useRowSelection(visibleUsers, (u) => u.uid)

  async function handleBulkDelete() {
    const ids = selection.selectedIds
    if (ids.length === 0 || bulkDeleting) return
    setBulkDeleting(true)
    try {
      await Promise.all(ids.map((uid) => deleteUser(uid)))
      const removed = new Set(ids)
      setUsers((prev) => prev.filter((u) => !removed.has(u.uid)))
      if (selectedId && removed.has(selectedId)) setSelectedId(null)
      selection.clear()
    } catch (err) {
      console.error("Error deleting contacts:", err)
    } finally {
      setBulkDeleting(false)
    }
  }

  const selectedUser =
    typeof selectedId === "string" && selectedId !== "new" ? users.find((u) => u.uid === selectedId) ?? null : null

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pt-4 pb-12 sm:px-6">
      <FilterBar
        {...bar}
        placeholder="Search contacts"
        actions={
          <Button onClick={() => setSelectedId("new")}><Plus className="h-4 w-4" />Add Contact</Button>
        }
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-destructive">{error}</CardContent>
        </Card>
      ) : users.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="mb-4 text-muted-foreground">No contacts yet.</p>
            <Button onClick={() => setSelectedId("new")}>
              <Plus className="mr-2 h-4 w-4" />
              Add the first contact
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {visibleUsers.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center text-sm text-muted-foreground">
                No contacts match your search.
              </CardContent>
            </Card>
          ) : (
            <div className="rounded-lg border border-border">
              <TableBulkBar
                count={selection.selectedCount}
                noun="contact"
                deleting={bulkDeleting}
                onClear={selection.clear}
                onDelete={handleBulkDelete}
              />
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">
                      <Checkbox
                        aria-label="Select all contacts"
                        checked={selection.allSelected}
                        indeterminate={selection.someSelected}
                        onChange={selection.toggleAll}
                      />
                    </TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>View as</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visibleUsers.map((u) => (
                    <TableRow
                      key={u.uid}
                      className="cursor-pointer"
                      onClick={() => setSelectedId(u.uid)}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          aria-label={`Select ${u.displayName || u.email || "contact"}`}
                          checked={selection.isSelected(u.uid)}
                          onChange={() => selection.toggle(u.uid)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {u.photoURL ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={u.photoURL}
                              alt=""
                              className="h-8 w-8 shrink-0 rounded-full"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                              <UserIcon className="h-4 w-4 text-muted-foreground" />
                            </span>
                          )}
                          <span className="font-medium">{u.displayName || "—"}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{u.email || "—"}</TableCell>
                      <TableCell>
                        {u.role ? (
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-xs font-medium",
                              u.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-muted text-muted-foreground",
                            )}
                          >
                            {u.role}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{u.company || "—"}</TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8"
                          onClick={() => handleViewAs(u)}
                        >
                          <Eye className="mr-2 h-3.5 w-3.5" />
                          View as
                        </Button>
                      </TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            onClick={() => setSelectedId(u.uid)}
                            aria-label="Edit contact"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                aria-label="Delete contact"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Remove contact?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  You&apos;re about to remove {u.displayName || u.email || "this contact"}. This can&apos;t be
                                  undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(u.uid)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  {deleting === u.uid ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </>
      )}

      <UserEditorSheet
        subjectNoun="contact"
        open={selectedId !== null}
        user={selectedId === "new" ? null : selectedUser}
        isNew={selectedId === "new"}
        onClose={() => setSelectedId(null)}
        onSaved={handleSaved}
      />
    </main>
  )
}
