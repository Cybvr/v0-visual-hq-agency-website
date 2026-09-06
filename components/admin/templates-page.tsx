"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CheckCircle2, ExternalLink, Loader2, Upload, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { getTemplates, type Project } from "@/lib/projects"
import { TEMPLATE_SEEDS, publishTemplateSeed, templateSeedSlug } from "@/lib/template-seeds"
import { formatPrice } from "@/lib/plans"
import { cn } from "@/lib/utils"

type SeedState = "idle" | "running" | "done" | "failed"

interface SeedRow {
  title: string
  state: SeedState
  detail: string
}

export default function AdminTemplatesPage() {
  const [templates, setTemplates] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [publishing, setPublishing] = useState(false)
  const [rows, setRows] = useState<SeedRow[]>([])

  async function fetchTemplates() {
    try {
      setTemplates(await getTemplates())
    } catch (error) {
      console.error("Error fetching templates:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTemplates()
  }, [])

  /**
   * Writes the seeded workflows straight from the browser, which already holds
   * an admin session. Sequential so the log reads in order and a failure stops
   * being ambiguous about which template it belongs to.
   */
  async function publishAll() {
    setPublishing(true)
    setRows(TEMPLATE_SEEDS.map((seed) => ({ title: seed.title, state: "idle", detail: "Waiting" })))

    for (const [index, seed] of TEMPLATE_SEEDS.entries()) {
      setRows((current) =>
        current.map((row, i) => (i === index ? { ...row, state: "running", detail: "Writing" } : row)),
      )
      try {
        const result = await publishTemplateSeed(seed)
        setRows((current) =>
          current.map((row, i) =>
            i === index
              ? {
                  ...row,
                  state: "done",
                  detail: `${result.created ? "Created" : "Updated"}, ${result.steps} steps`,
                }
              : row,
          ),
        )
      } catch (error) {
        setRows((current) =>
          current.map((row, i) =>
            i === index
              ? {
                  ...row,
                  state: "failed",
                  detail: error instanceof Error ? error.message : "Write failed",
                }
              : row,
          ),
        )
      }
    }

    await fetchTemplates()
    setPublishing(false)
  }

  const seededSlugs = new Set(templates.map((template) => template.slug))

  return (
    <main className="mx-auto w-full max-w-4xl px-4 pt-6 pb-12 sm:px-6">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Templates</h1>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Templates are public projects. Publishing writes each workflow as a project with its steps as tasks, using
            your admin session, and they appear on{" "}
            <Link href="/templates" className="underline underline-offset-4">
              /templates
            </Link>
            . Re-running updates them in place.
          </p>
        </div>
        <Button className="shrink-0" onClick={publishAll} disabled={publishing}>
          {publishing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Upload className="mr-2 h-4 w-4" />
          )}
          {publishing ? "Publishing" : "Publish workflows"}
        </Button>
      </div>

      {rows.length > 0 && (
        <div className="mb-8 divide-y divide-border rounded-xl border border-border bg-card">
          {rows.map((row) => (
            <div key={row.title} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
              <span className="flex items-center gap-2 font-medium">
                {row.state === "running" && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                {row.state === "done" && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                {row.state === "failed" && <XCircle className="h-4 w-4 text-red-600" />}
                {row.state === "idle" && <span className="h-4 w-4" />}
                {row.title}
              </span>
              <span className={cn("text-xs", row.state === "failed" ? "text-red-600" : "text-muted-foreground")}>
                {row.detail}
              </span>
            </div>
          ))}
        </div>
      )}

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground">Live templates</h2>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : templates.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
          Nothing published yet. Publish the workflows above, or open any project and publish it as a template.
        </p>
      ) : (
        <div className="divide-y divide-border rounded-xl border border-border bg-card">
          {templates.map((template) => (
            <div key={template.id} className="flex items-center justify-between gap-4 px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{template.title}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {template.client} · {template.timeline || "No cadence set"} ·{" "}
                  {template.price
                    ? formatPrice({ amount: template.price, prefix: template.pricePrefix ?? "" }, "USD")
                    : "Free"}
                  {template.paymentHref ? "" : " · no Paystack link"}
                </p>
              </div>
              <Link
                href="/templates"
                className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                View
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          ))}
        </div>
      )}

      {!loading && templates.length > 0 && (
        <p className="mt-4 text-xs text-muted-foreground">
          {TEMPLATE_SEEDS.filter((seed) => !seededSlugs.has(templateSeedSlug(seed))).length} of the seven workflows are
          not published yet.
        </p>
      )}
    </main>
  )
}
