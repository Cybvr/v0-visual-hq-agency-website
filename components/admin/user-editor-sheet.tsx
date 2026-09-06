"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

import { UserForm } from "@/components/admin/user-form"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { getUserByClientId, type AppUser } from "@/lib/users"

/**
 * The user record editor. Callers either hand it the user, ask for a blank one
 * with `isNew`, or give a `clientId` and let it look the account up.
 */
export function UserEditorSheet({
  open,
  user,
  clientId,
  isNew,
  onClose,
  onSaved,
}: {
  open: boolean
  user?: AppUser | null
  clientId?: string
  isNew?: boolean
  onClose: () => void
  onSaved: (uid: string) => void | Promise<void>
}) {
  const [resolved, setResolved] = useState<AppUser | null>(user ?? null)
  const [loading, setLoading] = useState(false)
  const [failed, setFailed] = useState(false)

  const lookup = Boolean(open && !isNew && !user && clientId)

  useEffect(() => {
    if (user !== undefined) setResolved(user)
  }, [user])

  useEffect(() => {
    if (!lookup || !clientId) return
    let active = true
    setLoading(true)
    setFailed(false)
    getUserByClientId(clientId)
      .then((found) => {
        if (!active) return
        if (found) setResolved(found)
        else setFailed(true)
      })
      .catch(() => {
        if (active) setFailed(true)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [lookup, clientId])

  const subject = isNew ? null : resolved

  return (
    <Sheet open={open} onOpenChange={(next) => !next && onClose()}>
      <SheetContent className="w-full gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border">
          <SheetTitle>{isNew ? "New user" : "Edit user"}</SheetTitle>
          <SheetDescription>
            {isNew ? "" : subject?.email || subject?.displayName || ""}
          </SheetDescription>
        </SheetHeader>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : failed ? (
          <p className="p-4 text-sm text-muted-foreground">
            No account found for this client.
          </p>
        ) : (
          open && (
            <UserForm
              key={subject?.uid ?? "new"}
              user={subject}
              onSaved={onSaved}
              onCancel={onClose}
            />
          )
        )}
      </SheetContent>
    </Sheet>
  )
}
