"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

import { UserForm } from "@/components/dashboard/user-form"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { getUserByClientId, type AppUser } from "@/lib/users"
import type { UserRole } from "@/lib/users"

/**
 * The user record editor. Callers either hand it the user, ask for a blank one
 * with `isNew`, or give a `clientId` and let it look the account up.
 */
export function UserEditorSheet({
  open,
  user,
  clientId,
  isNew,
  fixedRole,
  subjectNoun = "user",
  joinWorkspaceId,
  joinWorkspaceName,
  onClose,
  onSaved,
}: {
  open: boolean
  user?: AppUser | null
  clientId?: string
  isNew?: boolean
  fixedRole?: UserRole
  subjectNoun?: "user" | "client" | "company"
  /** When creating, attach the new person to this existing workspace instead of giving them their own. */
  joinWorkspaceId?: string
  joinWorkspaceName?: string
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
  const subjectLabel = joinWorkspaceId ? "person" : subjectNoun === "company" ? "company" : subjectNoun === "client" ? "client" : "user"

  return (
    <Sheet open={open} onOpenChange={(next) => !next && onClose()}>
      <SheetContent className="w-full gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border">
          <SheetTitle>{isNew ? `New ${subjectLabel}` : `Edit ${subjectLabel}`}</SheetTitle>
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
              fixedRole={fixedRole}
              subjectNoun={subjectNoun}
              workspaceId={isNew ? joinWorkspaceId : undefined}
              workspaceName={joinWorkspaceName}
              onSaved={onSaved}
              onCancel={onClose}
            />
          )
        )}
      </SheetContent>
    </Sheet>
  )
}
