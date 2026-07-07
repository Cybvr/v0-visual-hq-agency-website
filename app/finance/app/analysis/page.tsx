import Link from "next/link"
import { ArrowRight, BarChart3, Calculator, FileText, FolderOpen, Building2 } from "lucide-react"
import { AnalysisSubnav } from "@/components/finance/analysis-subnav"
import { DealMeta } from "@/components/finance/deal-meta"
import { PageHeader } from "@/components/finance/page-header"
import { deals, getDealById } from "@/lib/finance/pipeline"

// The core QofE spine: a linear path that produces the report output.
const coreSteps = [
  {
    title: "Business Info",
    description: "Set target identity, reporting context, and baseline operating assumptions.",
    href: "/finance/app/analysis/business-info",
    icon: Building2,
  },
  {
    title: "Document Intake",
    description: "Ingest source files and prepare the document set for structured review.",
    href: "/finance/app/analysis/documents",
    icon: FolderOpen,
  },
  {
    title: "QofE Report",
    description: "The standardized, branded earnings-quality output this workflow produces.",
    href: "/finance/app/analysis/report",
    icon: FileText,
  },
]

// Optional deep-dives that build on the QofE output rather than being part of the core spine.
const extendedSteps = [
  {
    title: "Benchmarking",
    description: "Compare the deal against peers, quartiles, and market data.",
    href: "/finance/app/benchmarking",
    icon: BarChart3,
  },
  {
    title: "Financial Modeling",
    description: "Link diligence findings into valuation models and workbook outputs.",
    href: "/finance/app/modeling",
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
            { label: "Home", href: "/finance/app" },
            { label: "Analysis" },
          ]}
          title="Analysis"
          subtitle="Choose a deal to open its diligence workspace."
        />

        <section className="flex flex-col gap-3">
          {deals.map((deal) => (
            <Link
              key={deal.id}
              href={`/finance/app/analysis?deal=${deal.id}`}
              className="group flex items-center justify-between gap-4 rounded-[8px] border border-(--fin-outline-variant) bg-white p-5 transition-all hover:border-(--fin-secondary) hover:shadow-md"
            >
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-(--fin-surface-container-low) text-sm font-bold text-(--fin-primary)">
                  {deal.partnerInitials}
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-semibold text-(--fin-primary)">{deal.name}</h2>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <DealMeta deal={deal} />
                  </div>
                  <p className="mt-2 text-xs text-(--fin-on-surface-variant)">Lead: {deal.partner}</p>
                </div>
              </div>
              <div className="inline-flex shrink-0 items-center gap-2 text-xs font-semibold tracking-[0.02em] text-(--fin-secondary)">
                <span>Open workspace</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
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
          { label: "Home", href: "/finance/app" },
          { label: "Analysis", href: "/finance/app/analysis" },
          { label: activeDeal.name },
        ]}
        eyebrow="Analysis"
        title={activeDeal.name}
        subtitle="Diligence workspace — work through the steps below, from intake to valuation."
        meta={<DealMeta deal={activeDeal} />}
        actions={
          <Link
            href="/finance/app/analysis"
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.02em] text-(--fin-secondary)"
          >
            Choose a different deal
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </Link>
        }
      />

      <AnalysisSubnav dealId={activeDeal.id} />

      {/* Core QofE spine: three linear steps ending in the report output (the feature's payoff). */}
      <section className="mb-10">
        <div className="mb-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-(--fin-secondary)">
            Core workflow
          </p>
          <p className="mt-1 text-sm text-(--fin-on-surface-variant)">
            Complete these three steps in order to produce the QofE report.
          </p>
        </div>
        <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-3">
          {coreSteps.map((step, index) => {
            const Icon = step.icon
            const href = `${step.href}?deal=${activeDeal.id}`
            const isOutput = index === coreSteps.length - 1

            return (
              <Link
                key={step.title}
                href={href}
                className={
                  isOutput
                    ? "group flex min-h-[220px] flex-col justify-between rounded-[8px] border-2 border-(--fin-secondary) bg-(--fin-secondary-container) p-5 transition-all hover:shadow-lg"
                    : "group flex min-h-[220px] flex-col justify-between rounded-[8px] border border-(--fin-outline-variant) bg-white p-5 transition-all hover:border-(--fin-secondary) hover:shadow-lg"
                }
              >
                <div>
                  <div className="mb-5 flex items-center justify-between">
                    <div
                      className={
                        isOutput
                          ? "flex h-10 w-10 items-center justify-center rounded-[4px] bg-white text-(--fin-secondary)"
                          : "flex h-10 w-10 items-center justify-center rounded-[4px] bg-(--fin-surface-container-low) text-(--fin-primary)"
                      }
                    >
                      <Icon className="h-5 w-5" strokeWidth={2} />
                    </div>
                    <span
                      className={
                        isOutput
                          ? "rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-(--fin-secondary)"
                          : "text-[10px] font-bold uppercase tracking-[0.12em] text-(--fin-outline)"
                      }
                    >
                      {isOutput ? "Output" : `Step ${index + 1}`}
                    </span>
                  </div>
                  <h3
                    className={
                      isOutput
                        ? "text-lg font-semibold text-(--fin-on-secondary-container)"
                        : "text-lg font-semibold text-(--fin-primary)"
                    }
                  >
                    {step.title}
                  </h3>
                  <p
                    className={
                      isOutput
                        ? "mt-3 text-sm leading-6 text-(--fin-on-secondary-container)"
                        : "mt-3 text-sm leading-6 text-(--fin-on-surface-variant)"
                    }
                  >
                    {step.description}
                  </p>
                </div>
                <div
                  className={
                    isOutput
                      ? "mt-8 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.02em] text-(--fin-on-secondary-container)"
                      : "mt-8 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.02em] text-(--fin-secondary)"
                  }
                >
                  {isOutput ? "View report" : `Open ${step.title}`}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Extended analysis: optional deep-dives that build on the report. Secondary weight. */}
      <section>
        <div className="mb-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-(--fin-on-surface-variant)">
            Extended analysis
          </p>
          <p className="mt-1 text-sm text-(--fin-on-surface-variant)">
            Optional deep-dives that build on the QofE output.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {extendedSteps.map((step) => {
            const Icon = step.icon
            const href = `${step.href}?deal=${activeDeal.id}`

            return (
              <Link
                key={step.title}
                href={href}
                className="group flex items-center gap-4 rounded-[8px] border border-(--fin-outline-variant) bg-(--fin-surface-container-lowest) p-4 transition-all hover:border-(--fin-secondary) hover:bg-white"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[4px] bg-(--fin-surface-container-low) text-(--fin-on-surface-variant)">
                  <Icon className="h-4 w-4" strokeWidth={2} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-(--fin-primary)">{step.title}</h3>
                  <p className="mt-0.5 text-xs leading-5 text-(--fin-on-surface-variant)">{step.description}</p>
                </div>
                <ArrowRight
                  className="h-4 w-4 shrink-0 text-(--fin-secondary) transition-transform group-hover:translate-x-0.5"
                  strokeWidth={2}
                />
              </Link>
            )
          })}
        </div>
      </section>
    </>
  )
}
