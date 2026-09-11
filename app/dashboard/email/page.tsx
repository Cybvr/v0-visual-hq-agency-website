"use client"

import { useEffect, useMemo, useState, type FormEvent } from "react"
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  Inbox,
  Loader2,
  List,
  Mail,
  Plus,
  Send,
  Trash2,
} from "lucide-react"

import { useAuth } from "@/components/auth-provider"
import { RichTextEditor } from "@/components/dashboard/rich-text-editor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FilterBar, useFilterBar, type SortOption } from "@/components/dashboard/filter-bar"
import { DEFAULT_EMAIL_TEMPLATES, type EmailTemplateSeed } from "@/lib/email-templates"
import { markdownToHtml } from "@/lib/markdown"
import { getUsers } from "@/lib/users"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"

type EmailTab = "templates" | "messages" | "lists"

type EmailTemplate = EmailTemplateSeed & { updatedAt: string }

type SentMessage = {
  id: string
  providerId: string
  to: string
  subject: string
  createdAt: string
}

type EmailContact = {
  email: string
  label: string
  name: string
}

type ContactList = {
  id: string
  name: string
  contactEmails: string[]
  updatedAt: string
}

type Notice = {
  tone: "success" | "error"
  text: string
} | null

const MESSAGE_SORTS: SortOption<SentMessage>[] = [
  { value: "createdAt", label: "Last sent", get: (message) => message.createdAt, ascLabel: "Oldest", descLabel: "Newest" },
  { value: "recipient", label: "Recipient", get: (message) => message.to, ascLabel: "A–Z", descLabel: "Z–A" },
  { value: "subject", label: "Subject", get: (message) => message.subject, ascLabel: "A–Z", descLabel: "Z–A" },
]

function searchMessage(message: SentMessage) {
  return [message.to, message.subject]
}

const LIST_SORTS: SortOption<ContactList>[] = [
  { value: "updatedAt", label: "Last updated", get: (list) => list.updatedAt, ascLabel: "Oldest", descLabel: "Newest" },
  { value: "name", label: "Name", get: (list) => list.name, ascLabel: "A–Z", descLabel: "Z–A" },
]

function searchList(list: ContactList) {
  return [list.name, list.contactEmails.length]
}

const TEMPLATE_SORTS: SortOption<EmailTemplate>[] = [
  { value: "updatedAt", label: "Last updated", get: (template) => template.updatedAt, ascLabel: "Oldest", descLabel: "Newest" },
  { value: "name", label: "Name", get: (template) => template.name, ascLabel: "A–Z", descLabel: "Z–A" },
]

function searchTemplate(template: EmailTemplate) {
  return [template.name, template.subject, template.body]
}

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

function formatTemplateDate(value: string) {
  try {
    const date = new Date(value)
    const now = new Date()
    const dayStart = (input: Date) => new Date(input.getFullYear(), input.getMonth(), input.getDate()).getTime()
    const daysAgo = Math.round((dayStart(now) - dayStart(date)) / 86_400_000)

    if (daysAgo === 0) return new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(date)
    if (daysAgo === 1) return "Yesterday"
    if (daysAgo > 1 && daysAgo < 7) return new Intl.DateTimeFormat(undefined, { weekday: "long" }).format(date)
    return new Intl.DateTimeFormat(undefined, { day: "2-digit", month: "2-digit", year: "2-digit" }).format(date)
  } catch {
    return "Unknown date"
  }
}

function htmlToText(value: string) {
  if (!value.includes("<")) return value
  return value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|li|h[1-6])>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
}

function escapeHtmlAttribute(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character] as string)
}

function withMessageImage(value: string, imageUrl?: string, imageAlt?: string) {
  const content = value.includes("<") ? value : markdownToHtml(value)
  if (!imageUrl) return content
  const existingImage = content.match(/<img[^>]*>/i)?.[0]
  const withoutImage = existingImage ? content.replace(existingImage, "").replaceAll("<p></p>", "") : content
  const image = `<p><img src="${escapeHtmlAttribute(imageUrl)}" alt="${escapeHtmlAttribute(imageAlt || "Message image")}" /></p>`
  return `${image}${withoutImage}`
}

function personalizeGreeting(value: string, name?: string) {
  const trimmedName = name?.trim()
  if (!trimmedName) return value
  return value.replace(/(^|>|\n)(\s*Dear\s+)(?:\[Customer Name\]|Customer)(\s*,?)/i, `$1$2${trimmedName}$3`)
}

export default function EmailPage() {
  const { user, appUser, isAdmin, isImpersonating } = useAuth()
  const isMobile = useIsMobile()
  // An admin "viewing as" a client sees exactly what that client sees.
  const showOpsDetail = isAdmin && !isImpersonating
  const workspaceId = appUser?.companyId || user?.uid || "workspace"
  const templateStorageKey = `visualcns-email-templates:${workspaceId}`
  const messageStorageKey = `visualcns-email-messages:${workspaceId}`

  const [tab, setTab] = useState<EmailTab>("messages")
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [messages, setMessages] = useState<SentMessage[]>([])
  const [loadedWorkspace, setLoadedWorkspace] = useState<string | null>(null)
  const [senderConfigured, setSenderConfigured] = useState<boolean | null>(null)
  const [senderAddress, setSenderAddress] = useState<string | null>(null)
  const [contacts, setContacts] = useState<EmailContact[]>([])
  const [lists, setLists] = useState<ContactList[]>([])

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
  const [templateImageUrl, setTemplateImageUrl] = useState("")
  const [templateImageAlt, setTemplateImageAlt] = useState("")
  const [templateNotice, setTemplateNotice] = useState<Notice>(null)
  const [mobileMessageView, setMobileMessageView] = useState<"list" | "composer">("list")
  const [mobileTemplateView, setMobileTemplateView] = useState<"list" | "editor">("list")
  const [listName, setListName] = useState("")
  const [listContactEmails, setListContactEmails] = useState<string[]>([])
  const [editingListId, setEditingListId] = useState<string | null>(null)
  const [listNotice, setListNotice] = useState<Notice>(null)
  const { results: visibleMessages, bar: messageFilterBar } = useFilterBar({
    items: messages,
    search: searchMessage,
    sorts: MESSAGE_SORTS,
    defaultSort: "createdAt",
    defaultDirection: "desc",
  })
  const { results: visibleTemplates, bar: templateFilterBar } = useFilterBar({
    items: templates,
    search: searchTemplate,
    sorts: TEMPLATE_SORTS,
    defaultSort: "updatedAt",
    defaultDirection: "desc",
  })
  const { results: visibleLists, bar: listFilterBar } = useFilterBar({
    items: lists,
    search: searchList,
    sorts: LIST_SORTS,
    defaultSort: "updatedAt",
    defaultDirection: "desc",
  })

  const activeFilterBar = tab === "messages" ? messageFilterBar : tab === "templates" ? templateFilterBar : listFilterBar
  const selectedContactName = contacts.find((contact) => contact.email.toLowerCase() === to.trim().toLowerCase())?.name

  useEffect(() => {
    setLoadedWorkspace(null)
    const storedTemplates = readStoredList<EmailTemplate>(templateStorageKey)
    const defaultTemplates = DEFAULT_EMAIL_TEMPLATES.map((template) => ({
      ...template,
      updatedAt: new Date().toISOString(),
    }))
    const missingDefaults = defaultTemplates.filter(
      (template) => !storedTemplates.some((stored) => stored.id === template.id),
    )
    const updatedStoredTemplates = storedTemplates.map((stored) => {
      const defaultTemplate = defaultTemplates.find((template) => template.id === stored.id)
      const subject = stored.subject.replaceAll("Falcon Energy", "VisualCNS")
      const body = (stored.body.includes("<") ? stored.body : markdownToHtml(stored.body))
        .replaceAll("Falcon Energy", "VisualCNS")
        .replaceAll("[Agency Name] Team", "VisualCNS Team")
      const needsImageMigration = defaultTemplate?.imageUrl && stored.imageUrl === "/ngai-feature-announcement.png"
      if (subject === stored.subject && body === stored.body && !needsImageMigration) return stored
      return {
        ...stored,
        subject,
        body,
        ...(needsImageMigration ? { imageUrl: defaultTemplate?.imageUrl, imageAlt: defaultTemplate?.imageAlt } : {}),
      }
    })
    setTemplates(
      storedTemplates.length > 0 ? [...updatedStoredTemplates, ...missingDefaults] : defaultTemplates,
    )
    setMessages(readStoredList<SentMessage>(messageStorageKey))
    setLists(readStoredList<ContactList>(`visualcns-email-lists:${workspaceId}`))
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
    if (loadedWorkspace !== workspaceId) return
    localStorage.setItem(`visualcns-email-lists:${workspaceId}`, JSON.stringify(lists))
  }, [loadedWorkspace, workspaceId, lists])

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
            name: contact.displayName?.trim() || contact.email.trim().split("@")[0],
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
    setBody(personalizeGreeting(withMessageImage(template.body, template.imageUrl, template.imageAlt), selectedContactName))
    setSendNotice(null)
  }

  function handleRecipientChange(value: string) {
    setTo(value)
    const contact = contacts.find((item) => item.email.toLowerCase() === value.trim().toLowerCase())
    if (contact) setBody((current) => personalizeGreeting(current, contact.name))
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
      const textBody = htmlToText(body).trim()
      const idToken = await user.getIdToken()
      const response = await fetch("/api/email/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to,
          subject,
          text: textBody,
          html: body.includes("<") ? body : undefined,
        }),
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
    setTemplateImageUrl("")
    setTemplateImageAlt("")
    setTemplateNotice(null)
  }

  function editTemplate(template: EmailTemplate) {
    setEditingTemplateId(template.id)
    setTemplateName(template.name)
    setTemplateSubject(template.subject)
    setTemplateBody(withMessageImage(template.body, template.imageUrl, template.imageAlt))
    setTemplateImageUrl(template.imageUrl || "")
    setTemplateImageAlt(template.imageAlt || "")
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
            ? {
                ...template,
                name,
                subject: savedSubject,
                body: savedBody,
                imageUrl: templateImageUrl || undefined,
                imageAlt: templateImageAlt.trim() || undefined,
                updatedAt: now,
              }
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
      imageUrl: templateImageUrl || undefined,
      imageAlt: templateImageAlt.trim() || undefined,
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

  function resetListEditor() {
    setEditingListId(null)
    setListName("")
    setListContactEmails([])
    setListNotice(null)
  }

  function editList(list: ContactList) {
    setEditingListId(list.id)
    setListName(list.name)
    setListContactEmails(list.contactEmails)
    setListNotice(null)
  }

  function saveList(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const name = listName.trim()
    if (!name) {
      setListNotice({ tone: "error", text: "Add a name for this list." })
      return
    }

    const now = new Date().toISOString()
    if (editingListId) {
      setLists((current) => current.map((list) => list.id === editingListId ? { ...list, name, contactEmails: listContactEmails, updatedAt: now } : list))
      setListNotice({ tone: "success", text: "List updated." })
      return
    }

    const newList: ContactList = { id: makeId(), name, contactEmails: listContactEmails, updatedAt: now }
    setLists((current) => [newList, ...current])
    setEditingListId(newList.id)
    setListNotice({ tone: "success", text: "List created." })
  }

  function deleteList(listId: string) {
    setLists((current) => current.filter((list) => list.id !== listId))
    if (editingListId === listId) resetListEditor()
  }

  return (
    <main className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col overflow-visible px-3 pt-3 pb-5 sm:px-6 sm:pt-4 sm:pb-6 lg:overflow-hidden">
      <div className="flex min-h-0 w-full flex-1 flex-col">
        <FilterBar
          {...activeFilterBar}
          className="mb-2"
          placeholder={tab === "messages" ? "Search messages" : tab === "templates" ? "Search templates" : "Search lists"}
          actions={
            <>
              <Button
                type="button"
                variant="outline"
                className="hidden sm:inline-flex"
                onClick={() => {
                  setTab("messages")
                  clearComposer()
                  setMobileMessageView("composer")
                }}
              >
                <Mail aria-hidden="true" />New mail
              </Button>
              <Button
                type="button"
                variant="outline"
                className="hidden sm:inline-flex"
                onClick={() => setTab("templates")}
              >
                <FileText aria-hidden="true" />Templates
              </Button>
              <Button
                type="button"
                variant="outline"
                className="hidden sm:inline-flex"
                onClick={() => setTab("lists")}
              >
                <List aria-hidden="true" />Lists
              </Button>
            </>
          }
        />
        <div className="mb-2 flex w-full items-center gap-1 rounded-md bg-muted/50 p-0.5 sm:hidden" role="tablist" aria-label="Email">
          {(["messages", "templates", "lists"] as const).map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={tab === item}
              onClick={() => {
                setTab(item)
                if (item === "messages") {
                  clearComposer()
                  setMobileMessageView("list")
                }
                if (item === "templates") setMobileTemplateView("list")
              }}
              className={cn(
                "flex-1 rounded-md px-2 py-1.5 text-xs font-medium capitalize transition-colors",
                tab === item ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item}
            </button>
          ))}
        </div>

        {tab === "messages" && (
          <section className="flex min-h-0 flex-1 flex-col gap-4 lg:grid lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-6" role="tabpanel">
            <aside className={cn(
              "shrink-0 overflow-hidden rounded-[14px] border border-border bg-card lg:min-h-[38rem]",
              mobileMessageView === "list" || !isMobile ? "block" : "hidden",
            )}>
              <div className="flex items-center justify-between gap-3 border-b border-border px-3.5 py-3 sm:px-4 sm:py-3.5">
                <h2 className="text-sm font-semibold">Sent messages</h2>
                <div className="flex items-center gap-2">
                  <Button type="button" variant="ghost" size="sm" className="h-8 px-2 lg:hidden" onClick={() => { clearComposer(); setMobileMessageView("composer") }}>
                    <Plus aria-hidden="true" />New mail
                  </Button>
                  <span className="text-xs tabular-nums text-muted-foreground">{messages.length}</span>
                </div>
              </div>
              {messages.length === 0 ? (
                <div className="px-4 py-10 text-center">
                  <Inbox className="mx-auto size-5 text-muted-foreground" aria-hidden="true" />
                  <p className="mt-3 text-sm font-medium">No sent messages</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">Your sent emails will appear here.</p>
                </div>
              ) : visibleMessages.length === 0 ? (
                <div className="px-4 py-10 text-center text-sm text-muted-foreground">
                  No messages match your search.
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {visibleMessages.map((message) => (
                    <div key={message.id} className="space-y-1 px-3.5 py-3 sm:px-4">
                      <div className="flex items-center justify-between gap-3">
                        <span className="min-w-0 truncate text-xs font-medium">{message.to}</span>
                        <time dateTime={message.createdAt} className="max-w-[42%] shrink-0 truncate text-right text-[11px] text-muted-foreground">
                          {formatMessageDate(message.createdAt)}
                        </time>
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

            <div className={cn(
              "min-h-0 lg:overflow-y-auto",
              mobileMessageView === "composer" || !isMobile ? "block" : "hidden",
            )}>
            <div className="mb-3 flex items-center gap-2 lg:hidden">
              <Button type="button" variant="ghost" size="icon" onClick={() => setMobileMessageView("list")} aria-label="Back to sent messages">
                <ArrowLeft aria-hidden="true" />
              </Button>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">New mail</p>
                <p className="text-xs text-muted-foreground">Back to sent messages</p>
              </div>
            </div>
            <form onSubmit={sendEmail} className="rounded-[14px] border border-border bg-card">
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
                    onChange={(event) => handleRecipientChange(event.target.value)}
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
                  {selectedContactName && (
                    <p className="text-xs text-emerald-700 dark:text-emerald-300">Personalized for {selectedContactName}</p>
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
                    <span className="text-xs tabular-nums text-muted-foreground">{htmlToText(body).length.toLocaleString()} / 20,000</span>
                  </div>
                  <RichTextEditor
                    value={body}
                    onChange={setBody}
                    placeholder="Write your message"
                    compact
                  />
                </div>
              </div>

              <div className="sticky bottom-0 z-10 flex flex-col gap-3 border-t border-border bg-card px-4 py-3.5 pb-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 lg:static lg:bg-transparent lg:pb-3.5">
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
                    disabled={!senderConfigured || sending || !to.trim() || !subject.trim() || !htmlToText(body).trim()}
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

        {tab === "lists" && (
          <section className="grid min-h-0 flex-1 gap-4 overflow-visible pt-2 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-6 lg:overflow-hidden" role="tabpanel">
            <div className="min-h-0 overflow-visible rounded-[14px] border border-border bg-card lg:overflow-y-auto">
              <div className="flex items-center justify-between gap-3 border-b border-border px-3.5 py-3 sm:px-4 sm:py-3.5">
                <h2 className="text-sm font-semibold">Contact lists <span className="font-normal tabular-nums text-muted-foreground">({lists.length})</span></h2>
                <Button type="button" variant="ghost" size="icon" onClick={resetListEditor} aria-label="New contact list" title="New contact list">
                  <Plus aria-hidden="true" />
                </Button>
              </div>
              {visibleLists.length === 0 ? (
                <div className="px-4 py-10 text-center">
                  <List className="mx-auto size-5 text-muted-foreground" aria-hidden="true" />
                  <p className="mt-3 text-sm font-medium">No lists yet</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">Create a list to group contacts for sending.</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {visibleLists.map((list) => (
                    <div key={list.id} className={cn("flex items-start gap-2 px-3.5 py-3", editingListId === list.id && "bg-sidebar-accent text-sidebar-accent-foreground")}>
                      <button type="button" onClick={() => editList(list)} className="min-w-0 flex-1 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring">
                        <span className="block truncate text-sm font-medium">{list.name}</span>
                        <span className={cn("mt-1 block text-xs text-muted-foreground", editingListId === list.id && "text-sidebar-accent-foreground/70")}>{list.contactEmails.length} contact{list.contactEmails.length === 1 ? "" : "s"}</span>
                      </button>
                      <button type="button" onClick={() => deleteList(list.id)} aria-label={`Delete ${list.name}`} className="flex size-8 shrink-0 items-center justify-center rounded-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive focus-visible:ring-2 focus-visible:ring-ring">
                        <Trash2 className="size-4" aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <form onSubmit={saveList} className="min-h-0 rounded-[14px] border border-border bg-card p-4 sm:p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-semibold">{editingListId ? "Edit list" : "New list"}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Choose the contacts you want to group together.</p>
                </div>
                {editingListId && <Button type="button" variant="ghost" size="sm" onClick={resetListEditor}>New</Button>}
              </div>

              <div className="mt-4 space-y-4">
                <Input value={listName} onChange={(event) => setListName(event.target.value)} maxLength={80} placeholder="List name" aria-label="List name" required />
                <div className="rounded-md border border-border">
                  <div className="border-b border-border px-3 py-2 text-xs font-medium text-muted-foreground">Contacts</div>
                  {contacts.length === 0 ? (
                    <p className="px-3 py-4 text-sm text-muted-foreground">No client contacts available.</p>
                  ) : (
                    <div className="max-h-72 overflow-y-auto">
                      {contacts.map((contact) => (
                        <label key={contact.email} className="flex cursor-pointer items-center gap-3 border-b border-border px-3 py-2.5 last:border-b-0">
                          <input
                            type="checkbox"
                            checked={listContactEmails.includes(contact.email)}
                            onChange={(event) => setListContactEmails((current) => event.target.checked ? [...current, contact.email] : current.filter((email) => email !== contact.email))}
                            className="size-4 accent-primary"
                          />
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-medium">{contact.name}</span>
                            <span className="block truncate text-xs text-muted-foreground">{contact.email}</span>
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div aria-live="polite" className="min-h-5 text-sm">
                  {listNotice && <span className={listNotice.tone === "success" ? "text-emerald-700 dark:text-emerald-300" : "text-destructive"}>{listNotice.text}</span>}
                </div>
                <Button type="submit">{editingListId ? "Save changes" : "Create list"}</Button>
              </div>
            </form>
          </section>
        )}

        {tab === "templates" && (
          <section className="flex min-h-0 flex-1 flex-col gap-3 overflow-visible pt-2 lg:grid lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-6 lg:overflow-hidden" role="tabpanel">
            <form
              onSubmit={saveTemplate}
              className={cn(
                "order-2 flex-none flex-col lg:order-2 lg:min-h-0 lg:flex-1",
                mobileTemplateView === "editor" || !isMobile ? "flex" : "hidden",
              )}
            >
              <div className="mb-1 flex items-center gap-2 lg:hidden">
                <Button type="button" variant="ghost" size="icon" onClick={() => setMobileTemplateView("list")} aria-label="Back to templates">
                  <ArrowLeft aria-hidden="true" />
                </Button>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{editingTemplateId ? "Edit" : "New template"}</p>
                </div>
              </div>

              <div className="flex flex-none flex-col gap-3 lg:min-h-0 lg:flex-1">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Input id="template-name" aria-label="Template name" value={templateName} onChange={(event) => setTemplateName(event.target.value)} maxLength={80} placeholder="Template name" required />
                  </div>
                  <div className="space-y-2">
                    <Input id="template-subject" aria-label="Subject" value={templateSubject} onChange={(event) => setTemplateSubject(event.target.value)} maxLength={200} placeholder="Subject" required />
                  </div>
                </div>
                <div className="flex min-h-0 flex-1 flex-col gap-2">
                  <RichTextEditor
                    value={templateBody}
                    onChange={setTemplateBody}
                    placeholder="Write the reusable message"
                    scrollable
                    className="min-h-64 lg:min-h-0 lg:flex-1"
                  />
                </div>
              </div>

              <div className="sticky bottom-0 z-10 mt-5 flex shrink-0 flex-col gap-3 border-t border-border bg-background pt-3 pb-4 sm:flex-row sm:items-center sm:justify-between lg:static lg:bg-transparent lg:pt-4 lg:pb-0">
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

            <div className={cn(
              "order-1 min-h-0 overflow-visible pr-1 lg:order-1 lg:overflow-y-auto",
              mobileTemplateView === "list" || !isMobile ? "block" : "hidden",
            )}>
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-semibold">Saved templates <span className="text-sm font-normal tabular-nums text-muted-foreground">({templates.length})</span></h2>
                <Button type="button" variant="ghost" size="icon" onClick={() => { resetTemplateEditor(); setMobileTemplateView("editor") }} aria-label="New template" title="New template">
                  <Plus aria-hidden="true" />
                </Button>
              </div>
              {templates.length === 0 ? (
                <div className="mt-3 rounded-[12px] border border-dashed border-border px-4 py-8 text-center">
                  <FileText className="mx-auto size-5 text-muted-foreground" aria-hidden="true" />
                  <p className="mt-3 text-sm font-medium">No templates yet</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">Save the first one using the editor.</p>
                </div>
              ) : visibleTemplates.length === 0 ? (
                <div className="mt-3 rounded-[12px] border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
                  No templates match your search.
                </div>
              ) : (
                <div className="mt-3">
                  {visibleTemplates.map((template) => (
                    <div key={template.id} className={cn("group flex items-start gap-2 rounded-md border-b border-border px-2.5 py-3.5 first:pt-3 last:border-b-0", editingTemplateId === template.id && "bg-sidebar-accent text-sidebar-accent-foreground")}>
                      <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground", editingTemplateId === template.id && "bg-sidebar-accent-foreground/10 text-sidebar-accent-foreground")} aria-hidden="true">
                        <Mail className="size-4" />
                      </div>
                      <button type="button" onClick={() => { editTemplate(template); setMobileTemplateView("editor") }} className="min-w-0 flex-1 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring">
                        <span className="block truncate text-sm font-medium">{template.name}</span>
                        <span className={cn("mt-1 block truncate text-xs text-muted-foreground", editingTemplateId === template.id && "text-sidebar-accent-foreground/70")}>{template.subject}</span>
                      </button>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <time dateTime={template.updatedAt} className={cn("text-[11px] text-muted-foreground", editingTemplateId === template.id && "text-sidebar-accent-foreground/70")}>{formatTemplateDate(template.updatedAt)}</time>
                        <button type="button" onClick={() => deleteTemplate(template.id)} aria-label={`Delete ${template.name}`} className="flex size-8 items-center justify-center rounded-sm text-muted-foreground opacity-70 outline-none transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:ring-2 focus-visible:ring-ring sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100">
                          <Trash2 className="size-4" aria-hidden="true" />
                        </button>
                      </div>
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
