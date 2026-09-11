"use client"

import { useEffect, useState, type FormEvent } from "react"
import { Loader2 } from "lucide-react"

import { useAuth } from "@/components/auth-provider"
import { AccountNav } from "@/components/account/account-nav"
import { ImageDropzone } from "@/components/image-dropzone"
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
      <AccountNav />

      <header className="mt-7">
        <h1 className="text-lg font-semibold">Profile</h1>
      </header>

      <form onSubmit={save} className="mt-6 space-y-5">
        <ImageDropzone compact label="Profile photo" value={photoURL} onChange={setPhotoURL} />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="display-name">
              Name
            </Label>
            <Input
              id="display-name"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="company">
              Workspace
            </Label>
            <Input
              id="company"
              value={company}
              onChange={(event) => setCompany(event.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="slug">
            Dashboard address
          </Label>
          <div className="flex items-center gap-2">
            <span className="shrink-0 text-sm text-muted-foreground">/dashboard/</span>
            <Input id="slug" value={slug} onChange={(event) => setSlug(event.target.value)} className="flex-1" />
          </div>
          <p className="text-xs text-muted-foreground">
            Where signing in takes you. Letters, numbers and hyphens.
          </p>
        </div>

        <div className="flex items-center gap-3 pt-2">
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
