"use client"

import { useEffect, useState, type FormEvent } from "react"
import { Loader2 } from "lucide-react"

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

type FormState = {
  title: string
  clientId: string
  projectId: string
  status: ContractStatus
  startsOn: string
  endsOn: string
  signedOn: string
  url: string
}

const EMPTY: FormState = {
  title: "",
  clientId: "",
  projectId: "",
  status: "draft",
  startsOn: "",
  endsOn: "",
  signedOn: "",
  url: "",
}

export function ContractForm({
  contract,
  onSaved,
  onCancel,
}: {
  contract?: Contract | null
  onSaved: () => void | Promise<void>
  onCancel: () => void
}) {
  const isEdit = Boolean(contract)
  const [form, setForm] = useState<FormState>(EMPTY)
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

  useEffect(() => {
    if (contract) {
      setForm({
        title: contract.title ?? "",
        clientId: contract.clientId ?? "",
        projectId: contract.projectId ?? "",
        status: contract.status ?? "draft",
        startsOn: contract.startsOn ?? "",
        endsOn: contract.endsOn ?? "",
        signedOn: contract.signedOn ?? "",
        url: contract.url ?? "",
      })
    } else {
      setForm(EMPTY)
    }
  }, [contract])

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (saving) return

    const title = form.title.trim()
    if (!title) {
      setError("Give this contract a title.")
      return
    }
    if (!form.clientId) {
      setError("Choose which client this contract is for.")
      return
    }

    setSaving(true)
    setError(null)
    try {
      const client = clients.find((entry) => entry.clientId === form.clientId)
      const project = projects.find((entry) => entry.id === form.projectId)

      const payload = {
        title,
        clientId: form.clientId,
        client: client?.company || client?.displayName || "",
        projectId: form.projectId || "",
        project: project?.title || "",
        status: form.status,
        startsOn: form.startsOn,
        endsOn: form.endsOn,
        // A signature date only means anything once it has actually been signed.
        signedOn: form.status === "signed" ? form.signedOn : "",
        url: form.url.trim(),
      }

      if (contract) await updateContract(contract.id, payload)
      else await createContract(payload)

      await onSaved()
    } catch (err) {
      console.error("Error saving contract:", err)
      setError("Couldn't save this contract. Try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={form.title}
          onChange={(event) => set("title", event.target.value)}
          placeholder="Master services agreement"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="contract-client">Client</Label>
        <Select value={form.clientId} onValueChange={(value) => set("clientId", value)}>
          <SelectTrigger id="contract-client" className="mt-1">
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
        <Label htmlFor="contract-project">Project</Label>
        <Select value={form.projectId} onValueChange={(value) => set("projectId", value)}>
          <SelectTrigger id="contract-project" className="mt-1">
            <SelectValue placeholder="Not tied to a project" />
          </SelectTrigger>
          <SelectContent>
            {projects
              .filter((project) => !form.clientId || project.clientId === form.clientId)
              .map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.title}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="starts-on">Starts</Label>
          <Input
            id="starts-on"
            type="date"
            value={form.startsOn}
            onChange={(event) => set("startsOn", event.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="ends-on">Ends</Label>
          <Input
            id="ends-on"
            type="date"
            value={form.endsOn}
            onChange={(event) => set("endsOn", event.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="contract-status">Status</Label>
        <Select value={form.status} onValueChange={(value) => set("status", value as ContractStatus)}>
          <SelectTrigger id="contract-status" className="mt-1">
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

      {form.status === "signed" && (
        <div>
          <Label htmlFor="signed-on">Signed</Label>
          <Input
            id="signed-on"
            type="date"
            value={form.signedOn}
            onChange={(event) => set("signedOn", event.target.value)}
            className="mt-1"
          />
        </div>
      )}

      <div>
        <Label htmlFor="contract-url">Document link</Label>
        <Input
          id="contract-url"
          value={form.url}
          onChange={(event) => set("url", event.target.value)}
          placeholder="https://"
          className="mt-1"
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex items-center gap-2 pt-1">
        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
          {isEdit ? "Save changes" : "Create contract"}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
