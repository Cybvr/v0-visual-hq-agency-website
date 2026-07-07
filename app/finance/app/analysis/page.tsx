import Link from "next/link"
import { ArrowRight, BarChart3, Calculator, FileText, FolderOpen, Building2 } from "lucide-react"
import { AnalysisSubnav } from "@/components/finance/analysis-subnav"
import { PageHeader } from "@/components/finance/page-header"

const analysisSteps = [
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
    description: "Review normalized earnings, adjustments, and supporting references.",
    href: "/finance/app/analysis/report",
    icon: FileText,
  },
  {
    title: "Benchmarking",
    description: "Compare the current deal against peers, quartiles, and market data.",
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

export default function AnalysisOverviewPage() {
  return (
    <>
      <PageHeader
        eyebrow="Analysis"
        title="Analysis"
        subtitle="Run the diligence workflow from intake through QofE, benchmarking, and modeling in one connected section."
      />

      <AnalysisSubnav />

      <section className="mb-8 rounded-[8px] border border-(--fin-outline-variant) bg-white p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-(--fin-secondary)">Focus</p>
        <h2 className="mt-3 text-xl font-semibold leading-7 text-(--fin-primary)">End-to-end diligence workflow</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-(--fin-on-surface-variant)">
          Capture core company context, ingest supporting documents, review earnings adjustments, compare peer performance, and carry validated inputs into modeling.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        {analysisSteps.map((step, index) => {
          const Icon = step.icon

          return (
            <Link
              key={step.title}
              href={step.href}
              className="group flex min-h-[220px] flex-col justify-between rounded-[8px] border border-(--fin-outline-variant) bg-white p-5 transition-all hover:border-(--fin-secondary) hover:shadow-lg"
            >
              <div>
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[4px] bg-(--fin-surface-container-low) text-(--fin-primary)">
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-(--fin-outline)">
                    Step {index + 1}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-(--fin-primary)">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-(--fin-on-surface-variant)">{step.description}</p>
              </div>
              <div className="mt-8 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.02em] text-(--fin-secondary)">
                Open
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
              </div>
            </Link>
          )
        })}
      </section>
    </>
  )
}
