import Link from "next/link"
import { ArrowRight, BarChart3, Calculator, FileText, FolderOpen, Building2 } from "lucide-react"
import { AnalysisSubnav } from "@/components/finance/analysis-subnav"
import { DealMeta } from "@/components/finance/deal-meta"
import { PageHeader } from "@/components/finance/page-header"
import { deals, getDealById } from "@/lib/finance/pipeline"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

// The core QofE spine: a linear path that produces the report output.
const coreSteps = [
  {
    title: "Business Info",
    description: "Set target identity, reporting context, and baseline operating assumptions.",
    href: "/finance/dashboard/analysis/business-info",
    icon: Building2,
  },
  {
    title: "Document Intake",
    description: "Ingest source files and prepare the document set for structured review.",
    href: "/finance/dashboard/analysis/documents",
    icon: FolderOpen,
  },
  {
    title: "QofE Report",
    description: "The standardized, branded earnings-quality output this workflow produces.",
    href: "/finance/dashboard/analysis/report",
    icon: FileText,
  },
]

// Optional deep-dives that build on the QofE output rather than being part of the core spine.
const extendedSteps = [
  {
    title: "Benchmarking",
    description: "Compare the deal against peers, quartiles, and market data.",
    href: "/finance/dashboard/benchmarking",
    icon: BarChart3,
  },
  {
    title: "Financial Modeling",
    description: "Link diligence findings into valuation models and workbook outputs.",
    href: "/finance/dashboard/modeling",
    icon: Calculator,
  },
]

interface AnalysisOverviewPageProps {
  searchParams: Promise<{ deal?: string }>
}

export default async function AnalysisOverviewPage({ searchParams }: AnalysisOverviewPageProps) {
  const { deal: dealId } = await searchParams
  const activeDeal = getDealById(dealId)

  // No deal chosen yet → this is the entry point. Show the list of deals to work on;
  // don't auto-select one and pretend the user picked it.
  if (!activeDeal) {
    return (
      <>
        <PageHeader
          breadcrumbs={[
            { label: "Home", href: "/finance/dashboard" },
            { label: "Analysis" },
          ]}
          title="Analysis"
          subtitle="Choose a deal to open its diligence workspace."
        />

        <section className="flex flex-col gap-3">
          {deals.map((deal) => (
            <Link
              key={deal.id}
              href={`/finance/dashboard/analysis?deal=${deal.id}`}
              className="group flex items-center justify-between gap-4 rounded-lg border bg-card p-5 transition-colors hover:border-primary"
            >
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold text-primary">
                  {deal.partnerInitials}
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-semibold text-primary">{deal.name}</h2>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <DealMeta deal={deal} />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">Lead: {deal.partner}</p>
                </div>
              </div>
              <div className="inline-flex shrink-0 items-center gap-2 text-xs font-semibold text-primary">
                <span>Open workspace</span>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </section>
      </>
    )
  }

  // A deal is selected → this is that deal's Analysis overview. The subnav handles
  // navigation; the workflow list below is the ordered path through diligence.
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Home", href: "/finance/dashboard" },
          { label: "Analysis", href: "/finance/dashboard/analysis" },
          { label: activeDeal.name },
        ]}
        eyebrow="Analysis"
        title={activeDeal.name}
        subtitle="Diligence workspace — work through the steps below, from intake to valuation."
        meta={<DealMeta deal={activeDeal} />}
        actions={
          <Button variant="ghost" size="sm" asChild>
            <Link href="/finance/dashboard/analysis">
              Choose a different deal
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        }
      />

      <AnalysisSubnav dealId={activeDeal.id} />

      {/* Core QofE spine: three linear steps ending in the report output (the feature's payoff). */}
      <section className="mb-10">
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Core workflow
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Complete these three steps in order to produce the QofE report.
          </p>
        </div>
        <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-3">
          {coreSteps.map((step, index) => {
            const Icon = step.icon
            const href = `${step.href}?deal=${activeDeal.id}`
            const isOutput = index === coreSteps.length - 1

            return (
              <Link key={step.title} href={href} className="group">
                <Card
                  className={cn(
                    "shadow-none transition-colors h-full min-h-[220px]",
                    isOutput
                      ? "bg-primary text-primary-foreground border-primary"
                      : "hover:border-primary",
                  )}
                >
                  <CardContent className="flex h-full flex-col justify-between p-5">
                    <div>
                      <div className="mb-5 flex items-center justify-between">
                        <div
                          className={cn(
                            "flex size-10 items-center justify-center rounded-md",
                            isOutput
                              ? "bg-primary-foreground text-primary"
                              : "bg-muted text-primary",
                          )}
                        >
                          <Icon className="size-5" />
                        </div>
                        <span
                          className={cn(
                            "rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest",
                            isOutput
                              ? "bg-primary-foreground text-primary"
                              : "text-muted-foreground",
                          )}
                        >
                          {isOutput ? "Output" : `Step ${index + 1}`}
                        </span>
                      </div>
                      <h3
                        className={cn(
                          "text-lg font-semibold",
                          isOutput ? "text-primary-foreground" : "text-primary",
                        )}
                      >
                        {step.title}
                      </h3>
                      <p
                        className={cn(
                          "mt-3 text-sm leading-6",
                          isOutput ? "text-primary-foreground/90" : "text-muted-foreground",
                        )}
                      >
                        {step.description}
                      </p>
                    </div>
                    <div
                      className={cn(
                        "mt-8 inline-flex items-center gap-2 text-xs font-semibold",
                        isOutput ? "text-primary-foreground" : "text-primary",
                      )}
                    >
                      {isOutput ? "View report" : `Open ${step.title}`}
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Extended analysis: optional deep-dives that build on the report. Secondary weight. */}
      <section>
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Extended analysis
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Optional deep-dives that build on the QofE output.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {extendedSteps.map((step) => {
            const Icon = step.icon
            const href = `${step.href}?deal=${activeDeal.id}`

            return (
              <Link key={step.title} href={href} className="group">
                <Card className="shadow-none transition-colors hover:border-primary">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                      <Icon className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-primary">{step.title}</h3>
                      <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{step.description}</p>
                    </div>
                    <ArrowRight className="size-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5" />
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>
    </>
  )
}

