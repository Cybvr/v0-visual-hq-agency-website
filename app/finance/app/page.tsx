import Link from "next/link"
import {
  ArrowRight,
  BriefcaseBusiness,
  ClipboardList,
  LayoutDashboard,
  TrendingUp,
  Users,
} from "lucide-react"
import { PageHeader } from "@/components/finance/page-header"
import { pipelineStages, recentActivity } from "@/lib/finance/pipeline"
import { portfolioKpis } from "@/lib/finance/portfolio"

const workspaceCards = [
  {
    title: "Deal Pipeline",
    description: "Source targets, review active opportunities, and manage the current funnel.",
    href: "/finance/app/pipeline",
    icon: BriefcaseBusiness,
    cta: "Open pipeline",
  },
  {
    title: "Analysis",
    description: "Run the diligence workflow from intake through QofE, benchmarking, and modeling.",
    href: "/finance/app/analysis",
    icon: ClipboardList,
    cta: "Open analysis",
  },
  {
    title: "Portfolio",
    description: "Track post-close performance, value creation, and operational signals across holdings.",
    href: "/finance/app/portfolio",
    icon: TrendingUp,
    cta: "Open portfolio",
  },
  {
    title: "Reports",
    description: "Review investor-facing reports, capital activity, and communication workflows.",
    href: "/finance/app/reports",
    icon: Users,
    cta: "Open reports",
  },
]

export default function FinanceOverviewPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Home" }]}
        eyebrow="Finance Workspace"
        title="Overview"
        subtitle="A single home for pipeline priorities, analysis progress, portfolio signals, and investor reporting."
      />

      <section className="mb-10 grid grid-cols-1 gap-4 xl:grid-cols-4">
        {workspaceCards.map((card) => {
          const Icon = card.icon

          return (
            <Link
              key={card.title}
              href={card.href}
              className="group flex min-h-[220px] flex-col justify-between rounded-[8px] border border-(--fin-outline-variant) bg-white p-6 transition-all hover:border-(--fin-secondary) hover:shadow-lg"
            >
              <div>
                <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-[4px] bg-(--fin-surface-container-low) text-(--fin-primary)">
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </div>
                <h2 className="text-xl font-semibold leading-7 text-(--fin-primary)">{card.title}</h2>
                <p className="mt-3 text-sm leading-6 text-(--fin-on-surface-variant)">{card.description}</p>
              </div>
              <div className="mt-8 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.02em] text-(--fin-secondary)">
                <span>{card.cta}</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
              </div>
            </Link>
          )
        })}
      </section>

      <section className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="rounded-[8px] border border-(--fin-outline-variant) bg-white p-6 lg:col-span-7">
          <div className="mb-6 flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5 text-(--fin-secondary)" strokeWidth={2} />
            <h2 className="text-xl font-semibold leading-7 text-(--fin-primary)">What Needs Attention</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[4px] border border-(--fin-outline-variant) bg-(--fin-surface-container-lowest) p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.02em] text-(--fin-on-surface-variant)">
                Pipeline
              </p>
              <p className="mt-2 text-2xl font-bold text-(--fin-primary)">{pipelineStages[3]?.count ?? 0}</p>
              <p className="mt-1 text-xs text-(--fin-on-surface-variant)">Deals in due diligence</p>
            </div>
            <div className="rounded-[4px] border border-(--fin-outline-variant) bg-(--fin-surface-container-lowest) p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.02em] text-(--fin-on-surface-variant)">
                Sourcing
              </p>
              <p className="mt-2 text-2xl font-bold text-(--fin-primary)">{pipelineStages[0]?.count ?? 0}</p>
              <p className="mt-1 text-xs text-(--fin-on-surface-variant)">Active sourced targets</p>
            </div>
            {portfolioKpis.slice(0, 2).map((kpi) => (
              <div
                key={kpi.label}
                className="rounded-[4px] border border-(--fin-outline-variant) bg-(--fin-surface-container-lowest) p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.02em] text-(--fin-on-surface-variant)">
                  {kpi.label}
                </p>
                <p className="mt-2 text-2xl font-bold text-(--fin-primary)">{kpi.value}</p>
                <p className="mt-1 text-xs text-(--fin-on-surface-variant)">Current portfolio signal</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[8px] border border-(--fin-outline-variant) bg-white p-6 lg:col-span-5">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold leading-7 text-(--fin-primary)">Recent Activity</h2>
            <Link
              href="/finance/app/activity"
              className="text-xs font-semibold tracking-[0.02em] text-(--fin-secondary) hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {recentActivity.slice(0, 4).map((item) => (
              <div key={item.title} className="rounded-[4px] border border-(--fin-outline-variant) bg-(--fin-surface-container-lowest) p-4">
                <p className="text-sm font-semibold text-(--fin-primary)">{item.title}</p>
                <p className="mt-1 text-sm text-(--fin-on-surface-variant)">{item.description}</p>
                <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.08em] text-(--fin-outline)">
                  {item.time}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-[8px] border border-(--fin-outline-variant) bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-(--fin-secondary)">Analysis</p>
          <h2 className="mt-3 text-xl font-semibold leading-7 text-(--fin-primary)">Run diligence from intake to output</h2>
          <p className="mt-3 text-sm leading-6 text-(--fin-on-surface-variant)">
            Move from company setup through document review, QofE findings, benchmarking, and valuation work in one connected flow.
          </p>
          <Link
            href="/finance/app/analysis"
            className="mt-6 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.02em] text-(--fin-secondary)"
          >
            Open analysis
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </Link>
        </div>

        <div className="rounded-[8px] border border-(--fin-outline-variant) bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-(--fin-secondary)">Pipeline</p>
          <h2 className="mt-3 text-xl font-semibold leading-7 text-(--fin-primary)">Track sourcing and active opportunities</h2>
          <p className="mt-3 text-sm leading-6 text-(--fin-on-surface-variant)">
            Review the live funnel, search targets, and monitor diligence-stage movement across current deals.
          </p>
          <Link
            href="/finance/app/pipeline"
            className="mt-6 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.02em] text-(--fin-secondary)"
          >
            Open pipeline
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </Link>
        </div>

        <div className="rounded-[8px] border border-(--fin-outline-variant) bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-(--fin-secondary)">Reporting</p>
          <h2 className="mt-3 text-xl font-semibold leading-7 text-(--fin-primary)">Prepare investor-facing updates</h2>
          <p className="mt-3 text-sm leading-6 text-(--fin-on-surface-variant)">
            Access fund performance materials, capital call activity, and investor communication workflows.
          </p>
          <Link
            href="/finance/app/reports"
            className="mt-6 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.02em] text-(--fin-secondary)"
          >
            Open reports
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </Link>
        </div>
      </section>
    </>
  )
}
