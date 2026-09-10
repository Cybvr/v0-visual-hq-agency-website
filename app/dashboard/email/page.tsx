"use client"

import { useEffect, useMemo, useState, type FormEvent } from "react"
import {
  CheckCircle2,
  FileText,
  Inbox,
  Loader2,
  Mail,
  Plus,
  Send,
  Trash2,
} from "lucide-react"

import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DEFAULT_EMAIL_TEMPLATES, type EmailTemplateSeed } from "@/lib/email-templates"
import { getUsers } from "@/lib/users"
import { cn } from "@/lib/utils"

type EmailTab = "templates" | "messages"

type EmailTemplate = EmailTemplateSeed & { updatedAt: string }

type SentMessage = {
  id: string
  providerId: string
  to: string
  subject: string
  createdAt: string
}

type Notice = {
  tone: "success" | "error"
  text: string
} | null

const TABS: Array<{ id: EmailTab; label: string; icon: typeof Mail }> = [
  { id: "messages", label: "Messages", icon: Inbox },
  { id: "templates", label: "Templates", icon: FileText },
]

function makeId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function readStoredList<T>(key: string): T[] {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]")
    return Array.isArray(value) ? (value as T[]) : []
  } catch {
    return []
  }
}

function formatMessageDate(value: string) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value))
  } catch {
    return "Unknown date"
  }
}

export default function EmailPage() {
  const { user, appUser, isAdmin, isImpersonating } = useAuth()
  // An admin "viewing as" a client sees exactly what that client sees.
  const showOpsDetail = isAdmin && !isImpersonating
  const workspaceId = appUser?.clientId || user?.uid || "workspace"
  const templateStorageKey = `visualcns-email-templates:${workspaceId}`
  const messageStorageKey = `visualcns-email-messages:${workspaceId}`

  const [tab, setTab] = useState<EmailTab>("messages")
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [messages, setMessages] = useState<SentMessage[]>([])
  const [loadedWorkspace, setLoadedWorkspace] = useState<string | null>(null)
  const [senderConfigured, setSenderConfigured] = useState<boolean | null>(null)
  const [senderAddress, setSenderAddress] = useState<string | null>(null)
  const [contacts, setContacts] = useState<Array<{ email: string; label: string }>>([])

  const [to, setTo] = useState("")
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [selectedTemplateId, setSelectedTemplateId] = useState("")
  const [sending, setSending] = useState(false)
  const [sendNotice, setSendNotice] = useState<Notice>(null)

  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null)
  const [templateName, setTemplateName] = useState("")
  const [templateSubject, setTemplateSubject] = useState("")
  const [templateBody, setTemplateBody] = useState("")
  const [templateNotice, setTemplateNotice] = useState<Notice>(null)

  useEffect(() => {
    setLoadedWorkspace(null)
    const storedTemplates = readStoredList<EmailTemplate>(templateStorageKey)
    setTemplates(
      storedTemplates.length > 0
        ? storedTemplates
        : DEFAULT_EMAIL_TEMPLATES.map((template) => ({
            ...template,
            updatedAt: new Date().toISOString(),
          })),
    )
    setMessages(readStoredList<SentMessage>(messageStorageKey))
    setLoadedWorkspace(workspaceId)
  }, [workspaceId, templateStorageKey, messageStorageKey])

  useEffect(() => {
    if (loadedWorkspace !== workspaceId) return
    localStorage.setItem(templateStorageKey, JSON.stringify(templates))
  }, [loadedWorkspace, workspaceId, templateStorageKey, templates])

  useEffect(() => {
    if (loadedWorkspace !== workspaceId) return
    localStorage.setItem(messageStorageKey, JSON.stringify(messages))
  }, [loadedWorkspace, workspaceId, messageStorageKey, messages])

  useEffect(() => {
    if (!showOpsDetail) {
      setContacts([])
      return
    }

    let active = true
    void getUsers()
      .then((users) => {
        if (!active) return
        const seen = new Set<string>()
        const nextContacts = users
          .filter((contact) => contact.role === "client" && contact.email?.trim())
          .map((contact) => ({
            email: contact.email.trim(),
            label: [contact.company, contact.displayName].filter(Boolean).join(" · ") || contact.email.trim(),
          }))
          .filter((contact) => {
            const key = contact.email.toLowerCase()
            if (seen.has(key)) return false
            seen.add(key)
            return true
          })
        setContacts(nextContacts)
      })
      .catch(() => {
        if (active) setContacts([])
      })

    return () => {
      active = false
    }
  }, [showOpsDetail])

  useEffect(() => {
    let active = true

    fetch("/api/email/send", { cache: "no-store" })
      .then(async (response) => {
        const result = (await response.json()) as { configured?: boolean; from?: string | null }
        if (!active) return
        setSenderConfigured(Boolean(result.configured))
        setSenderAddress(result.from || null)
      })
      .catch(() => {
        if (active) setSenderConfigured(false)
      })

    return () => {
      active = false
    }
  }, [])

  const selectedTemplate = useMemo(
    () => templates.find((template) => template.id === selectedTemplateId),
    [selectedTemplateId, templates],
  )

  function applyTemplate(templateId: string) {
    setSelectedTemplateId(templateId)
    const template = templates.find((item) => item.id === templateId)
    if (!template) return
    setSubject(template.subject)
    setBody(template.body)
    setSendNotice(null)
  }

  function clearComposer() {
    setTo("")
    setSubject("")
    setBody("")
    setSelectedTemplateId("")
    setSendNotice(null)
  }

  async function sendEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!user || sending || !senderConfigured) return

    setSending(true)
    setSendNotice(null)

    try {
      const idToken = await user.getIdToken()
      const response = await fetch("/api/email/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ to, subject, text: body }),
      })
      const result = (await response.json()) as { id?: string; error?: string }

      if (!response.ok || !result.id) {
        throw new Error(result.error || "The message could not be sent.")
      }

      setMessages((current) => [
        {
          id: makeId(),
          providerId: result.id as string,
          to: to.trim(),
          subject: subject.trim(),
          createdAt: new Date().toISOString(),
        },
        ...current,
      ])
      setTo("")
      setSubject("")
      setBody("")
      setSelectedTemplateId("")
      setSendNotice({ tone: "success", text: "Message sent." })
    } catch (error) {
      setSendNotice({
        tone: "error",
        text: error instanceof Error ? error.message : "The message could not be sent. Try again.",
      })
    } finally {
      setSending(false)
    }
  }

  function resetTemplateEditor() {
    setEditingTemplateId(null)
    setTemplateName("")
    setTemplateSubject("")
    setTemplateBody("")
    setTemplateNotice(null)
  }

  function editTemplate(template: EmailTemplate) {
    setEditingTemplateId(template.id)
    setTemplateName(template.name)
    setTemplateSubject(template.subject)
    setTemplateBody(template.body)
    setTemplateNotice(null)
  }

  function saveTemplate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const name = templateName.trim()
    const savedSubject = templateSubject.trim()
    const savedBody = templateBody.trim()

    if (!name || !savedSubject || !savedBody) {
      setTemplateNotice({ tone: "error", text: "Add a name, subject, and message before saving." })
      return
    }

    const now = new Date().toISOString()
    if (editingTemplateId) {
      setTemplates((current) =>
        current.map((template) =>
          template.id === editingTemplateId
            ? { ...template, name, subject: savedSubject, body: savedBody, updatedAt: now }
            : template,
        ),
      )
      setTemplateNotice({ tone: "success", text: "Template updated." })
      return
    }

    const newTemplate: EmailTemplate = {
      id: makeId(),
      name,
      subject: savedSubject,
      body: savedBody,
      updatedAt: now,
    }
    setTemplates((current) => [newTemplate, ...current])
    setEditingTemplateId(newTemplate.id)
    setTemplateNotice({ tone: "success", text: "Template saved." })
  }

  function deleteTemplate(templateId: string) {
    setTemplates((current) => current.filter((template) => template.id !== templateId))
    if (selectedTemplateId === templateId) setSelectedTemplateId("")
    if (editingTemplateId === templateId) resetTemplateEditor()
  }

  return (
    <main className="min-h-full bg-background px-4 py-7 sm:px-6 sm:py-9">
      <div className="mx-auto w-full max-w-5xl">
        <div className="flex gap-6 border-b border-border" role="tablist" aria-label="Email tools">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className={cn(
                "relative flex h-11 items-center gap-2 text-sm font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                tab === id && "text-foreground after:absolute after:inset-x-0 after:bottom-[-1px] after:h-0.5 after:bg-foreground",
              )}
            >
              <Icon className="size-4" aria-hidden="true" />
              {label}
              {id === "messages" && messages.length > 0 && (
                <span className="rounded-full bg-muted px-1.5 py-0.5 text-[11px] leading-none text-muted-foreground">
                  {messages.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {tab === "messages" && (
          <section className="grid gap-6 pt-7 lg:grid-cols-[18rem_minmax(0,1fr)]" role="tabpanel">
            <aside className="overflow-hidden rounded-[14px] border border-border bg-card lg:min-h-[38rem]">
              <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3.5">
                <h2 className="text-sm font-semibold">Sent messages</h2>
                <span className="text-xs tabular-nums text-muted-foreground">{messages.length}</span>
              </div>
              {messages.length === 0 ? (
                <div className="px-4 py-10 text-center">
                  <Inbox className="mx-auto size-5 text-muted-foreground" aria-hidden="true" />
                  <p className="mt-3 text-sm font-medium">No sent messages</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">Your sent emails will appear here.</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {messages.map((message) => (
                    <div key={message.id} className="space-y-1 px-4 py-3">
                      <div className="flex items-center justify-between gap-3">
                        <span className="truncate text-xs font-medium">{message.to}</span>
                        <span className="shrink-0 text-[11px] text-muted-foreground">{formatMessageDate(message.createdAt)}</span>
                      </div>
                      <p className="truncate text-sm">{message.subject}</p>
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-300">
                        <CheckCircle2 className="size-3" aria-hidden="true" />Accepted
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </aside>

            <div>
            {!senderConfigured && senderConfigured !== null && (
              <div className="mb-5 rounded-[12px] bg-amber-500/10 px-4 py-3 text-sm leading-6 text-amber-900 dark:text-amber-200">
                {showOpsDetail
                  ? "Sending is turned off until a sending address is connected for this workspace. You can still write and save templates."
                  : "Sending isn't available on your workspace yet. You can still write and save templates."}
              </div>
            )}

            <form onSubmit={sendEmail} className="overflow-hidden rounded-[14px] border border-border bg-card">
              <div className="grid gap-px bg-border sm:grid-cols-2">
                <div className="bg-card px-4 py-3.5 sm:px-5">
                  <span className="text-xs font-medium text-muted-foreground">From</span>
                  <p className="mt-1 truncate text-sm">{senderAddress || (showOpsDetail ? "Not configured" : "Not available yet")}</p>
                </div>
                <div className="bg-card px-4 py-3.5 sm:px-5">
                  <Label htmlFor="email-template" className="text-xs text-muted-foreground">Template</Label>
                  <select
                    id="email-template"
                    value={selectedTemplateId}
                    onChange={(event) => applyTemplate(event.target.value)}
                    className="mt-1 h-7 w-full bg-transparent text-sm outline-none"
                  >
                    <option value="">Start without a template</option>
                    {templates.map((template) => (
                      <option key={template.id} value={template.id}>{template.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-5 px-4 py-5 sm:px-5 sm:py-6">
                <div className="space-y-2">
                  <Label htmlFor="email-to">To</Label>
                  <Input
                    id="email-to"
                    type="email"
                    autoComplete="email"
                    list="email-contacts"
                    value={to}
                    onChange={(event) => setTo(event.target.value)}
                    placeholder="client@example.com"
                    required
                  />
                  <datalist id="email-contacts">
                    {contacts.map((contact) => (
                      <option key={contact.email} value={contact.email} label={contact.label} />
                    ))}
                  </datalist>
                  {showOpsDetail && contacts.length > 0 && (
                    <p className="text-xs text-muted-foreground">Start typing to choose a saved client contact.</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-subject">Subject</Label>
                  <Input
                    id="email-subject"
                    value={subject}
                    onChange={(event) => setSubject(event.target.value)}
                    maxLength={200}
                    placeholder="What is this message about?"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <Label htmlFor="email-body">Message</Label>
                    <span className="text-xs tabular-nums text-muted-foreground">{body.length.toLocaleString()} / 20,000</span>
                  </div>
                  <Textarea
                    id="email-body"
                    value={body}
                    onChange={(event) => setBody(event.target.value)}
                    maxLength={20_000}
                    placeholder="Write your message"
                    required
                    className="min-h-64 resize-y leading-6"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-border px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <div aria-live="polite" className="min-h-5 text-sm">
                  {sendNotice && (
                    <span className={sendNotice.tone === "success" ? "text-emerald-700 dark:text-emerald-300" : "text-destructive"}>
                      {sendNotice.text}
                    </span>
                  )}
                  {!sendNotice && selectedTemplate && (
                    <span className="text-muted-foreground">Using {selectedTemplate.name}</span>
                  )}
                </div>
                <div className="flex items-center justify-end gap-2">
                  <Button type="button" variant="ghost" onClick={clearComposer}>Clear</Button>
                  <Button
                    type="submit"
                    disabled={!senderConfigured || sending || !to.trim() || !subject.trim() || !body.trim()}
                  >
                    {sending ? <Loader2 className="animate-spin" aria-hidden="true" /> : <Send aria-hidden="true" />}
                    {sending ? "Sending" : "Send email"}
                  </Button>
                </div>
              </div>
            </form>
            </div>
          </section>
        )}

        {tab === "templates" && (
          <section className="grid gap-6 pt-7 lg:grid-cols-[18rem_minmax(0,1fr)]" role="tabpanel">
            <form onSubmit={saveTemplate} className="rounded-[14px] border border-border bg-card p-4 sm:p-6 lg:order-2">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-semibold">{editingTemplateId ? "Edit template" : "New template"}</h2>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">Save message copy you send often.</p>
                </div>
                {editingTemplateId && (
                  <Button type="button" variant="ghost" size="sm" onClick={resetTemplateEditor}>
                    <Plus aria-hidden="true" />New
                  </Button>
                )}
              </div>

              <div className="mt-6 space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="template-name">Template name</Label>
                  <Input id="template-name" value={templateName} onChange={(event) => setTemplateName(event.target.value)} maxLength={80} placeholder="Project update" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="template-subject">Subject</Label>
                  <Input id="template-subject" value={templateSubject} onChange={(event) => setTemplateSubject(event.target.value)} maxLength={200} placeholder="Your project update" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="template-body">Message</Label>
                  <Textarea id="template-body" value={templateBody} onChange={(event) => setTemplateBody(event.target.value)} maxLength={20_000} placeholder="Write the reusable message" required className="min-h-56 resize-y leading-6" />
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div aria-live="polite" className="min-h-5 text-sm">
                  {templateNotice && (
                    <span className={templateNotice.tone === "success" ? "text-emerald-700 dark:text-emerald-300" : "text-destructive"}>
                      {templateNotice.text}
                    </span>
                  )}
                </div>
                <Button type="submit">{editingTemplateId ? "Save changes" : "Save template"}</Button>
              </div>
            </form>

            <div className="lg:order-1">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-semibold">Saved templates</h2>
                <span className="text-xs tabular-nums text-muted-foreground">{templates.length}</span>
              </div>
              {templates.length === 0 ? (
                <div className="mt-3 rounded-[12px] border border-dashed border-border px-4 py-8 text-center">
                  <FileText className="mx-auto size-5 text-muted-foreground" aria-hidden="true" />
                  <p className="mt-3 text-sm font-medium">No templates yet</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">Save the first one using the editor.</p>
                </div>
              ) : (
                <div className="mt-3 divide-y divide-border overflow-hidden rounded-[12px] border border-border bg-card">
                  {templates.map((template) => (
                    <div key={template.id} className={cn("group flex items-start gap-2 p-3", editingTemplateId === template.id && "bg-muted/60")}>
                      <button type="button" onClick={() => editTemplate(template)} className="min-w-0 flex-1 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring">
                        <span className="block truncate text-sm font-medium">{template.name}</span>
                        <span className="mt-1 block truncate text-xs text-muted-foreground">{template.subject}</span>
                      </button>
                      <button type="button" onClick={() => deleteTemplate(template.id)} aria-label={`Delete ${template.name}`} className="flex size-8 shrink-0 items-center justify-center rounded-sm text-muted-foreground opacity-70 outline-none transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:ring-2 focus-visible:ring-ring sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100">
                        <Trash2 className="size-4" aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

      </div>
    </main>
  )
}
