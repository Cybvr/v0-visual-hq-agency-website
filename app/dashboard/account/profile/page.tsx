"use client"

import { useEffect, useState, type FormEvent } from "react"
import { Loader2 } from "lucide-react"

import { useAuth } from "@/components/auth-provider"
import { AccountNav } from "@/components/account/account-nav"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { slugifyUser, uniqueUserSlug, updateUser } from "@/lib/users"

export default function ProfilePage() {
  const { user, appUser } = useAuth()

  const [displayName, setDisplayName] = useState("")
  const [company, setCompany] = useState("")
  const [photoURL, setPhotoURL] = useState("")
  const [slug, setSlug] = useState("")
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState<{ tone: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    setDisplayName(appUser?.displayName || "")
    setCompany(appUser?.company || "")
    setPhotoURL(appUser?.photoURL || "")
    setSlug(appUser?.slug || "")
  }, [appUser?.displayName, appUser?.company, appUser?.photoURL, appUser?.slug])

  if (!user) return null

  const name = displayName || appUser?.company || "Account"
  const initials =
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U"

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!appUser?.uid || saving) return

    setSaving(true)
    setNotice(null)
    try {
      // Whatever they typed is cleaned up and checked against other accounts,
      // so the saved slug is always a usable, unclaimed address.
      const wanted = slugifyUser(slug) || displayName || appUser.email
      const finalSlug = await uniqueUserSlug(wanted, appUser.uid)

      await updateUser(appUser.uid, {
        displayName: displayName.trim(),
        company: company.trim(),
        photoURL: photoURL.trim(),
        slug: finalSlug,
      })
      setSlug(finalSlug)
      setNotice({
        tone: "success",
        text: finalSlug === slugifyUser(slug) ? "Profile saved." : `Profile saved. Your address is /dashboard/${finalSlug}.`,
      })
      // The signed-in user is read once at sign-in, so reload to pick the new
      // values up in the sidebar and everywhere else they appear.
      setTimeout(() => window.location.reload(), 600)
    } catch (error) {
      console.error("Error saving profile:", error)
      setNotice({ tone: "error", text: "Couldn't save your profile. Try again." })
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-9 sm:px-6">
      <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
        How your name and picture appear across the dashboard.
      </p>

      <AccountNav />

      <form onSubmit={save} className="mt-7 rounded-[14px] border border-border bg-card p-5">
        <div className="flex items-center gap-4">
          <Avatar className="size-14 rounded-full">
            {photoURL && <AvatarImage src={photoURL} alt={name} referrerPolicy="no-referrer" />}
            <AvatarFallback className="rounded-full text-base">{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <Label htmlFor="photo-url" className="text-xs text-muted-foreground">
              Picture URL
            </Label>
            <Input
              id="photo-url"
              value={photoURL}
              onChange={(event) => setPhotoURL(event.target.value)}
              placeholder="https://"
              className="mt-1"
            />
          </div>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="display-name" className="text-xs text-muted-foreground">
              Name
            </Label>
            <Input
              id="display-name"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="company" className="text-xs text-muted-foreground">
              Workspace
            </Label>
            <Input
              id="company"
              value={company}
              onChange={(event) => setCompany(event.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        <div className="mt-5">
          <Label htmlFor="slug" className="text-xs text-muted-foreground">
            Dashboard address
          </Label>
          <div className="mt-1 flex items-center gap-2">
            <span className="shrink-0 text-sm text-muted-foreground">/dashboard/</span>
            <Input id="slug" value={slug} onChange={(event) => setSlug(event.target.value)} className="flex-1" />
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">
            Where signing in takes you. Letters, numbers and hyphens.
          </p>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <Button type="submit" disabled={saving}>
            {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
            Save changes
          </Button>
          {notice && (
            <span className={notice.tone === "error" ? "text-sm text-destructive" : "text-sm text-muted-foreground"}>
              {notice.text}
            </span>
          )}
        </div>
      </form>
    </main>
  )
}
