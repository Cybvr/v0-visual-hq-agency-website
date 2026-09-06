"use client"

import { useEffect, useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { RichTextEditor } from "@/components/dashboard/rich-text-editor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  contractStatusMeta,
  createContract,
  updateContract,
  type Contract,
  type ContractStatus,
} from "@/lib/billing"
import { getProjects, type Project } from "@/lib/projects"
import { getUsers, type AppUser } from "@/lib/users"
import { cn } from "@/lib/utils"

export function ContractBuilder({ contract }: { contract?: Contract | null }) {
  const router = useRouter()
  const isEdit = Boolean(contract)

  const [title, setTitle] = useState(contract?.title ?? "")
  const [clientId, setClientId] = useState(contract?.clientId ?? "")
  const [projectId, setProjectId] = useState(contract?.projectId ?? "")
  const [status, setStatus] = useState<ContractStatus>(contract?.status ?? "draft")
  const [startsOn, setStartsOn] = useState(contract?.startsOn ?? "")
  const [endsOn, setEndsOn] = useState(contract?.endsOn ?? "")
  const [signedOn, setSignedOn] = useState(contract?.signedOn ?? "")

  // The agreement is either written here or kept somewhere else and linked.
  const [mode, setMode] = useState<"write" | "link">(
    contract && !contract.body && contract.url ? "link" : "write",
  )
  const [body, setBody] = useState(contract?.body ?? "")
  const [url, setUrl] = useState(contract?.url ?? "")

  const [clients, setClients] = useState<AppUser[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [optionsLoading, setOptionsLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    Promise.all([getUsers(), getProjects()])
      .then(([userList, projectList]) => {
        if (!active) return
        setClients(userList.filter((user) => user.clientId))
        setProjects(projectList)
      })
      .catch(() => {
        if (active) setError("Couldn't load clients and projects.")
      })
      .finally(() => {
        if (active) setOptionsLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (saving) return

    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      setError("Give this contract a title.")
      return
    }
    if (!clientId) {
      setError("Choose which client this contract is for.")
      return
    }

    const linked = mode === "link"
    if (linked && !url.trim()) {
      setError("Paste the link to the contract.")
      return
    }
    // An empty editor still returns a paragraph tag, so check the text.
    const written = body.replace(/<[^>]*>/g, "").trim()
    if (!linked && !written) {
      toast.error("Write the agreement, or switch to Link.")
      return
    }

    setSaving(true)
    setError(null)
    try {
      const client = clients.find((entry) => entry.clientId === clientId)
      const project = projects.find((entry) => entry.id === projectId)

      const payload = {
        title: trimmedTitle,
        clientId,
        client: client?.company || client?.displayName || "",
        projectId: projectId || "",
        project: project?.title || "",
        status,
        body: linked ? "" : body,
        url: linked ? url.trim() : "",
        startsOn,
        endsOn,
        // A signature date only means anything once it has actually been signed.
        signedOn: status === "signed" ? signedOn : "",
      }

      if (contract) await updateContract(contract.id, payload)
      else await createContract(payload)

      router.push("/dashboard/contracts")
    } catch (err) {
      console.error("Error saving contract:", err)
      setError("Couldn't save this contract. Try again.")
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/contracts"
            aria-label="Back to contracts"
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
          </Link>
          <h1 className="text-base font-semibold tracking-[-0.01em]">
            {isEdit ? "Edit contract" : "New contract"}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Button type="button" variant="ghost" onClick={() => router.push("/dashboard/contracts")}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
            {isEdit ? "Save contract" : "Create contract"}
          </Button>
        </div>
      </div>

      <div className="space-y-8 rounded-[14px] border border-border bg-card p-5 sm:p-6">
        <section className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Master services agreement"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="client">Client</Label>
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger id="client" className="mt-1">
                  <SelectValue placeholder={optionsLoading ? "Loading..." : "Choose a client"} />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.uid} value={client.clientId as string}>
                      {client.company || client.displayName || client.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="project">Project</Label>
              <Select value={projectId} onValueChange={setProjectId}>
                <SelectTrigger id="project" className="mt-1">
                  <SelectValue placeholder="Not tied to a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects
                    .filter((project) => !clientId || project.clientId === clientId)
                    .map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.title}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="starts-on">Starts</Label>
                <Input
                  id="starts-on"
                  type="date"
                  value={startsOn}
                  onChange={(event) => setStartsOn(event.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="ends-on">Ends</Label>
                <Input
                  id="ends-on"
                  type="date"
                  value={endsOn}
                  onChange={(event) => setEndsOn(event.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as ContractStatus)}>
                <SelectTrigger id="status" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(contractStatusMeta).map(([value, meta]) => (
                    <SelectItem key={value} value={value}>
                      {meta.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {status === "signed" && (
              <div>
                <Label htmlFor="signed-on">Signed</Label>
                <Input
                  id="signed-on"
                  type="date"
                  value={signedOn}
                  onChange={(event) => setSignedOn(event.target.value)}
                  className="mt-1"
                />
              </div>
            )}
          </div>
        </section>

        <div className="flex items-center justify-between gap-3 border-t border-border pt-6">
          <h2 className="text-sm font-medium">Agreement</h2>
          <div className="inline-flex rounded-[8px] bg-muted p-0.5">
            {(
              [
                { value: "write", label: "Write" },
                { value: "link", label: "Link" },
              ] as const
            ).map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setMode(option.value)}
                aria-pressed={mode === option.value}
                className={cn(
                  "rounded-[6px] px-3 py-1 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                  mode === option.value
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {mode === "link" ? (
          <div>
            <Label htmlFor="contract-url">Contract link</Label>
            <Input
              id="contract-url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://"
              className="mt-1"
            />
          </div>
        ) : (
          <RichTextEditor value={body} onChange={setBody} />
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    </form>
  )
}
