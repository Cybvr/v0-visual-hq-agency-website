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
import { Eye, Pencil, Plus, Trash2, Loader2, User as UserIcon } from "lucide-react"
import { getUsers, deleteUser, type AppUser } from "@/lib/users"
import { UserForm } from "@/components/admin/user-form"
import { useAuth } from "@/components/auth-provider"
import { cn } from "@/lib/utils"

export default function UsersAdminPage() {
  const router = useRouter()
  const { viewAsUser } = useAuth()
  const [users, setUsers] = useState<AppUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | "new" | null>(null)

  async function fetchUsers() {
    setError(null)
    try {
      const data = await getUsers()
      setUsers(data)
    } catch (err) {
      console.error("Error fetching users:", err)
      setError(err instanceof Error ? err.message : "Failed to load users.")
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

  const selectedUser =
    typeof selectedId === "string" && selectedId !== "new" ? users.find((u) => u.uid === selectedId) ?? null : null

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pt-6 pb-12 sm:px-6">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Users</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Live from the Firestore <code className="rounded bg-muted px-1 py-0.5 text-xs">users</code> collection.
          </p>
        </div>
        <Button className="shrink-0" onClick={() => setSelectedId("new")}>
          <Plus className="mr-2 h-4 w-4" />
          Add User
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
      ) : users.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="mb-4 text-muted-foreground">No users in the collection yet.</p>
            <Button onClick={() => setSelectedId("new")}>
              <Plus className="mr-2 h-4 w-4" />
              Add the first user
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>View as</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow
                  key={u.uid}
                  className="cursor-pointer"
                  onClick={() => setSelectedId(u.uid)}
                >
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
                        aria-label="Edit user"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            aria-label="Delete user"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove user?</AlertDialogTitle>
                            <AlertDialogDescription>
                              You&apos;re about to remove {u.displayName || u.email || "this user"}. This can&apos;t be
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

      <Sheet open={selectedId !== null} onOpenChange={(open) => !open && setSelectedId(null)}>
        <SheetContent className="w-full gap-0 p-0 sm:max-w-md">
          <SheetHeader className="border-b border-border">
            <SheetTitle>{selectedId === "new" ? "New user" : "Edit user"}</SheetTitle>
            <SheetDescription>
              {selectedId === "new"
                ? "Add someone to the users collection."
                : selectedUser?.email || selectedUser?.displayName || ""}
            </SheetDescription>
          </SheetHeader>
          {selectedId !== null && (
            <UserForm
              key={selectedId}
              user={selectedId === "new" ? null : selectedUser}
              onSaved={handleSaved}
              onCancel={() => setSelectedId(null)}
            />
          )}
        </SheetContent>
      </Sheet>
    </main>
  )
}
