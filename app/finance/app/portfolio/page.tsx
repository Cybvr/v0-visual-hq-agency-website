import Link from "next/link"
import {
  aiInsight,
  heatmapCells,
  holdingCompanies,
  holdingsTotal,
  initiatives,
  pendingDeliverables,
  portfolioKpis,
  portfolioLastUpdated,
  type HeatmapTone,
  type HoldingAvatarTone,
  type InitiativeStatusTone,
  type KpiDeltaTone,
} from "@/lib/finance/portfolio"
import { cn } from "@/lib/utils"
import { PageHeader } from "@/components/finance/page-header"
import { PortfolioSubnav } from "@/components/finance/portfolio-subnav"

const kpiDeltaClasses: Record<KpiDeltaTone, string> = {
  positive: "bg-(--fin-secondary-fixed) text-[#1a365d]",
  negative: "bg-(--fin-error-container) text-(--fin-error)",
  neutral: "bg-(--fin-surface-variant) text-(--fin-on-surface-variant)",
}

const holdingAvatarClasses: Record<HoldingAvatarTone, string> = {
  "primary-container": "bg-(--fin-primary-container) text-(--fin-on-primary-container)",
  secondary: "bg-(--fin-secondary) text-(--fin-on-secondary)",
  tertiary: "bg-(--fin-tertiary) text-(--fin-on-tertiary)",
  outline: "bg-(--fin-outline) text-white",
}

const heatmapToneClasses: Record<HeatmapTone, string> = {
  primary: "bg-(--fin-primary) text-white",
  "primary-90": "bg-(--fin-primary)/90 text-white",
  "primary-80": "bg-(--fin-primary)/80 text-white",
  "primary-60": "bg-(--fin-primary)/60 text-white",
  "primary-40": "bg-(--fin-primary)/40 text-(--fin-primary)",
  error: "bg-(--fin-error) text-white",
  "error-60": "bg-(--fin-error)/60 text-white",
  neutral: "bg-(--fin-outline-variant) text-(--fin-on-surface)",
}

const initiativeStatusClasses: Record<InitiativeStatusTone, string> = {
  "on-track": "bg-(--fin-primary)/10 text-(--fin-primary)",
  delayed: "bg-(--fin-error-container) text-(--fin-error)",
  completed: "bg-(--fin-secondary-fixed) text-(--fin-primary)",
}

export default function PortfolioMonitoringPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Home", href: "/finance/app" },
          { label: "Portfolio" },
        ]}
        title="Portfolio"
        subtitle="Post-acquisition company health, value creation progress, and reporting across active holdings."
        actions={
          <>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-(--fin-on-surface-variant)">
                Last Updated
              </span>
              <span className="text-sm font-semibold text-(--fin-on-surface)">{portfolioLastUpdated}</span>
            </div>
            <button className="flex items-center gap-2 rounded-[4px] border border-(--fin-outline) px-4 py-2 text-xs font-semibold tracking-[0.02em] transition-colors hover:bg-(--fin-surface-container)">
              <span className="material-symbols-outlined text-[18px]">download</span>
              Export Board Pack
            </button>
          </>
        }
      />

      <PortfolioSubnav />

      {/* KPI Summary Ribbon */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {portfolioKpis.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-[4px] border border-(--fin-outline-variant) bg-(--fin-surface-container-lowest) p-4"
          >
            <p className="mb-1 text-xs font-semibold tracking-[0.02em] text-(--fin-on-surface-variant)">{kpi.label}</p>
            <div className="flex items-baseline gap-2">
              <p className="fin-tabular text-xl font-semibold leading-7 text-(--fin-primary)">{kpi.value}</p>
              <span className={cn("rounded-[2px] px-1.5 text-xs font-bold", kpiDeltaClasses[kpi.deltaTone])}>
                {kpi.delta}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-12 gap-4">
        {/* Portfolio Companies Table */}
        <section className="col-span-12 space-y-4 lg:col-span-8">
          <div className="overflow-hidden rounded-[4px] border border-(--fin-outline-variant) bg-(--fin-surface-container-lowest)">
            <div className="flex items-center justify-between border-b border-(--fin-outline-variant) px-6 py-4">
              <p className="text-xl font-semibold leading-7 text-(--fin-primary)">Holding Companies</p>
              <div className="flex gap-2">
                <span className="material-symbols-outlined cursor-pointer text-(--fin-outline)">filter_list</span>
                <span className="material-symbols-outlined cursor-pointer text-(--fin-outline)">search</span>
              </div>
            </div>
            <table className="fin-tabular w-full border-collapse text-left">
              <thead>
                <tr className="bg-(--fin-surface-container-low)">
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-(--fin-on-surface-variant)">
                    Company
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-(--fin-on-surface-variant)">
                    Revenue (LTM)
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-(--fin-on-surface-variant)">
                    EBITDA %
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-(--fin-on-surface-variant)">
                    Net Debt
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-(--fin-on-surface-variant)">
                    Trend
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-(--fin-outline-variant)/30">
                {holdingCompanies.map((company) => (
                  <tr
                    key={company.name}
                    className={cn(
                      "transition-colors hover:bg-(--fin-surface-container-low)/50",
                      company.highlighted && "bg-(--fin-secondary-fixed)/10",
                    )}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-[2px] text-xs font-bold",
                            holdingAvatarClasses[company.avatarTone],
                          )}
                        >
                          {company.initials}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-(--fin-on-surface)">{company.name}</p>
                          <p className="text-[10px] text-(--fin-on-surface-variant)">{company.sector}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{company.revenue}</td>
                    <td className="px-6 py-4 text-sm">{company.ebitdaMargin}</td>
                    <td className="px-6 py-4 text-sm">{company.netDebt}</td>
                    <td className="px-6 py-4">
                      <svg className="h-8 w-24" viewBox="0 0 100 30">
                        <path
                          d={company.sparklinePath}
                          fill="none"
                          stroke={company.sparklineStroke ?? "#1a365d"}
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="bg-(--fin-surface-container-low) p-4 text-center">
              <Link
                href="/finance/app/portfolio/holdings"
                className="text-xs font-semibold tracking-[0.02em] text-(--fin-primary) hover:underline"
              >
                View All {holdingsTotal} Holdings
              </Link>
            </div>
          </div>

          {/* Performance Heat Map Section */}
          <div className="rounded-[4px] border border-(--fin-outline-variant) bg-(--fin-surface-container-lowest) p-6">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-xl font-semibold leading-7 text-(--fin-primary)">Sector Performance Heatmap</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-[2px] bg-(--fin-primary)" />
                  <span className="text-[10px] text-(--fin-on-surface-variant)">Overperforming</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-[2px] bg-(--fin-error)" />
                  <span className="text-[10px] text-(--fin-on-surface-variant)">Underperforming</span>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
            <div className="grid h-64 min-w-[480px] grid-cols-4 grid-rows-3 gap-2">
              {heatmapCells.map((cell) => (
                <div
                  key={cell.label}
                  className={cn(
                    "flex items-end rounded-[4px] p-3 transition-transform duration-200 ease-out hover:z-10 hover:scale-105",
                    heatmapToneClasses[cell.tone],
                    cell.colSpan === 2 && "col-span-2",
                    cell.rowSpan === 2 && "row-span-2",
                  )}
                >
                  <span className="text-xs font-semibold tracking-[0.02em]">{cell.label}</span>
                </div>
              ))}
            </div>
            </div>
          </div>
        </section>

        {/* Sidebar: Value Creation & Alerts */}
        <aside className="col-span-12 space-y-4 lg:col-span-4">
          {/* Value Creation Status */}
          <div className="rounded-[4px] border border-(--fin-outline-variant) bg-(--fin-surface-container-lowest) p-6">
            <p className="mb-6 text-xl font-semibold leading-7 text-(--fin-primary)">Value Creation Initiatives</p>
            <div className="space-y-6">
              {initiatives.map((initiative) => (
                <div key={initiative.name} className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold">{initiative.name}</p>
                      <p className="text-[11px] text-(--fin-on-surface-variant)">{initiative.context}</p>
                    </div>
                    <span
                      className={cn(
                        "rounded-[2px] px-2 py-0.5 text-[10px] font-bold",
                        initiativeStatusClasses[initiative.statusTone],
                      )}
                    >
                      {initiative.status}
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-(--fin-surface-variant)">
                    <div
                      className={cn(
                        "h-full",
                        initiative.statusTone === "delayed" ? "bg-(--fin-error)" : "bg-(--fin-primary)",
                      )}
                      style={{ width: `${initiative.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/finance/app/portfolio/initiatives"
              className="mt-6 block w-full rounded-[2px] border border-dashed border-(--fin-outline) py-2 text-center text-xs font-semibold tracking-[0.02em] text-(--fin-on-surface-variant) transition-all hover:bg-(--fin-surface-container)"
            >
              + Log New Initiative
            </Link>
          </div>

          {/* AI Insight Card */}
          <div className="relative overflow-hidden rounded-[4px] bg-(--fin-primary-container) p-6 text-(--fin-on-primary-container)">
            <div className="relative z-10">
              <div className="mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-(--fin-secondary-fixed)">{aiInsight.icon}</span>
                <span className="text-xs font-semibold uppercase tracking-wider text-(--fin-secondary-fixed)">
                  {aiInsight.label}
                </span>
              </div>
              <p className="mb-4 text-sm leading-relaxed">{aiInsight.quote}</p>
              <button className="rounded-[2px] bg-(--fin-secondary-container) px-4 py-2 text-xs font-semibold tracking-[0.02em] text-(--fin-on-secondary-container) transition-opacity hover:opacity-90">
                {aiInsight.cta}
              </button>
            </div>
            {/* Decorative Background Element */}
            <div className="absolute -bottom-4 -right-4 opacity-20">
              <span className="material-symbols-outlined text-[120px]">{aiInsight.backgroundIcon}</span>
            </div>
          </div>

          {/* Compliance & Reports */}
          <div className="rounded-[4px] border border-(--fin-outline-variant) bg-(--fin-surface-container-lowest) p-6">
            <p className="mb-4 text-xl font-semibold leading-7 text-(--fin-primary)">Pending Deliverables</p>
            <div className="space-y-4">
              {pendingDeliverables.map((deliverable) => (
                <div
                  key={deliverable.title}
                  className="flex items-center gap-3 rounded-[4px] bg-(--fin-surface-container-low) p-3"
                >
                  <span className="material-symbols-outlined text-(--fin-primary)">{deliverable.icon}</span>
                  <div className="flex-1">
                    <p className="text-xs font-semibold tracking-[0.02em]">{deliverable.title}</p>
                    <p className="text-[10px] text-(--fin-on-surface-variant)">{deliverable.subtitle}</p>
                  </div>
                  <span className="material-symbols-outlined text-(--fin-outline)">chevron_right</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </>
  )
}
