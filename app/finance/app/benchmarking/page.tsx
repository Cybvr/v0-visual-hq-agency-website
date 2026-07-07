import type { Metadata } from "next"
import { AnalysisSubnav } from "@/components/finance/analysis-subnav"
import { PageHeader } from "@/components/finance/page-header"
import {
  benchmarkAiConfidence,
  benchmarkFilters,
  benchmarkMatrixFootnote,
  getBenchmarkData,
} from "@/lib/finance/benchmarking"
import { resolveDeal } from "@/lib/finance/pipeline"

export const metadata: Metadata = {
  title: "Benchmarking | Visualcns Finance",
}

const growthToneClasses: Record<string, string> = {
  upper: "bg-(--fin-secondary-container)",
  current: "bg-(--fin-primary)",
  median: "bg-(--fin-outline-variant)",
}

interface BenchmarkingPageProps {
  searchParams: Promise<{ deal?: string }>
}

export default async function BenchmarkingPage({ searchParams }: BenchmarkingPageProps) {
  const { deal: dealId } = await searchParams
  const deal = resolveDeal(dealId)
  const { ebitdaMultiples, revenueGrowthBenchmarks, revenueGrowthSummary, benchmarkMatrix, qofeCards, aiLensCard } =
    getBenchmarkData(deal)

  return (
    <>
      {/* Page header */}
      <PageHeader
        breadcrumbs={[
          { label: "Home", href: "/finance/app" },
          { label: "Analysis", href: "/finance/app/analysis" },
          { label: deal.name, href: `/finance/app/analysis?deal=${deal.id}` },
          { label: "Benchmarking" },
        ]}
        eyebrow={deal.name}
        title="Benchmarking"
        subtitle="Compare against verified peers, market quartiles, and QofE-derived operating signals."
      />

      <AnalysisSubnav dealId={deal.id} />

      <section className="mb-8 flex flex-wrap gap-3">
        {benchmarkFilters.map((filter) => (
          <div key={filter.label} className="flex flex-col gap-1">
            <label className="text-xs font-semibold tracking-[0.02em] text-(--fin-on-surface-variant)">
              {filter.label}
            </label>
            <select
              className={`rounded-[2px] border border-(--fin-outline-variant) bg-white px-3 py-1.5 text-sm focus:ring-2 focus:ring-(--fin-primary) ${filter.minWidthClass}`}
            >
              {filter.options.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
        ))}
        <button className="flex items-center gap-2 self-end rounded-[2px] border border-(--fin-outline-variant) bg-(--fin-surface-container-high) px-4 py-1.5 text-(--fin-on-surface) transition-colors hover:bg-(--fin-surface-variant)">
          <span className="material-symbols-outlined text-[18px]">tune</span>
          <span className="text-xs font-semibold tracking-[0.02em]">More Filters</span>
        </button>
      </section>

      {/* Dashboard body */}
      <section className="flex w-full flex-col gap-8">

        {/* Bento grid charts */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* Chart 1: EBITDA multiples (large) */}
          <div className="flex flex-col gap-6 rounded-[8px] border border-(--fin-outline-variant) bg-white p-6 lg:col-span-8">
            <div className="flex items-start justify-between">
              <div>
                <p className="fin-headline-md text-[24px] text-(--fin-primary)">EBITDA Multiples by Industry</p>
                <p className="text-xs font-semibold uppercase tracking-wider text-(--fin-on-surface-variant)">
                  Median EV/EBITDA (LTM)
                </p>
              </div>
              <span className="material-symbols-outlined cursor-pointer text-(--fin-on-surface-variant) hover:text-(--fin-primary)">
                more_vert
              </span>
            </div>
            <div className="flex h-64 items-end justify-between gap-4 border-b border-(--fin-outline-variant) pt-4">
              {ebitdaMultiples.map((bar) => (
                <div key={bar.label} className="group relative flex h-full flex-1 flex-col items-center justify-end">
                  {bar.isCurrentDeal ? (
                    <div className="absolute -top-10 z-20 rounded-[2px] bg-(--fin-primary) px-2 py-1 text-[10px] font-bold text-(--fin-on-primary)">
                      {deal.name}: {bar.tooltip}
                    </div>
                  ) : (
                    <div className="invisible absolute -top-8 z-20 rounded-[2px] bg-(--fin-primary-container) px-2 py-1 text-[10px] font-bold text-(--fin-on-primary-container) opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                      {bar.tooltip}
                    </div>
                  )}
                  <div
                    className={`w-full max-w-[48px] rounded-t-[2px] transition-all ${
                      bar.isCurrentDeal
                        ? "bg-(--fin-primary) group-hover:bg-(--fin-secondary)"
                        : "bg-(--fin-outline-variant) group-hover:bg-(--fin-secondary-container)"
                    }`}
                    style={{ height: `${bar.heightPct}%` }}
                  />
                  <span
                    className={`mt-2 w-full truncate text-center text-[10px] font-semibold tracking-[0.02em] ${
                      bar.isCurrentDeal ? "font-bold text-(--fin-primary)" : "text-(--fin-on-surface-variant)"
                    }`}
                  >
                    {bar.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Chart 2: Revenue growth (small) */}
          <div className="flex flex-col rounded-[8px] border border-(--fin-outline-variant) bg-white p-6 lg:col-span-4">
            <p className="fin-headline-md mb-1 text-[24px] text-(--fin-primary)">Revenue Growth</p>
            <p className="mb-8 text-xs font-semibold uppercase tracking-wider text-(--fin-on-surface-variant)">
              LTM Growth Rate
            </p>
            <div className="space-y-6">
              {revenueGrowthBenchmarks.map((row) => (
                <div key={row.label} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold tracking-[0.02em]">
                    <span>{row.tone === "current" ? deal.name : row.label}</span>
                    <span className="font-bold text-(--fin-primary)">{row.value}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-(--fin-surface-container)">
                    <div className={`h-full ${growthToneClasses[row.tone]}`} style={{ width: `${row.widthPct}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-auto flex items-center gap-4 border-t border-(--fin-outline-variant) pt-6">
              <div className="flex-1">
                <div className="text-[20px] font-bold text-(--fin-primary)">{revenueGrowthSummary.value}</div>
                <div className="text-xs font-semibold tracking-[0.02em] text-(--fin-on-surface-variant)">
                  {revenueGrowthSummary.label}
                </div>
              </div>
              <span className="material-symbols-outlined text-[32px] text-(--fin-on-tertiary-container)">
                trending_up
              </span>
            </div>
          </div>

          {/* Comparison table */}
          <div className="overflow-hidden rounded-[8px] border border-(--fin-outline-variant) bg-white shadow-sm lg:col-span-12">
            <div className="flex items-center justify-between border-b border-(--fin-outline-variant) bg-(--fin-surface-container-low) p-6">
              <p className="fin-headline-md text-[24px] text-(--fin-primary)">Benchmark Analysis Matrix</p>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 rounded-[2px] border border-(--fin-outline-variant) bg-white px-3 py-1 text-xs font-semibold tracking-[0.02em] transition-colors hover:bg-(--fin-surface)">
                  <span className="material-symbols-outlined text-[16px]">download</span> Export PDF
                </button>
                <button className="flex items-center gap-2 rounded-[2px] border border-(--fin-outline-variant) bg-white px-3 py-1 text-xs font-semibold tracking-[0.02em] transition-colors hover:bg-(--fin-surface)">
                  <span className="material-symbols-outlined text-[16px]">share</span> Share Access
                </button>
              </div>
            </div>
            <div className="fin-scrollbar overflow-x-auto">
              <table className="fin-tabular w-full border-collapse text-left">
                <thead className="border-b border-(--fin-outline-variant) bg-(--fin-surface) text-xs font-semibold tracking-[0.02em] text-(--fin-on-surface-variant)">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Key Performance Indicator</th>
                    <th className="px-6 py-4 font-semibold">{deal.name}</th>
                    <th className="px-6 py-4 font-semibold">Median Peer</th>
                    <th className="px-6 py-4 font-semibold">Top Quartile</th>
                    <th className="px-6 py-4 font-semibold">Variance (vs Med)</th>
                    <th className="px-6 py-4 text-center font-semibold">Confidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-(--fin-outline-variant) text-sm">
                  {benchmarkMatrix.map((row) => (
                    <tr key={row.kpi} className="transition-colors hover:bg-(--fin-surface-container)">
                      <td className="px-6 py-4 font-semibold text-(--fin-primary)">{row.kpi}</td>
                      <td className="bg-(--fin-secondary-container)/10 px-6 py-4 font-bold">{row.currentDeal}</td>
                      <td className="px-6 py-4">{row.medianPeer}</td>
                      <td className="px-6 py-4">{row.topQuartile}</td>
                      <td
                        className={`px-6 py-4 font-medium ${row.variancePositive ? "text-(--fin-primary)" : "text-(--fin-error)"}`}
                      >
                        <span className="inline-flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[16px]">
                            {row.variancePositive ? "arrow_drop_up" : "arrow_drop_down"}
                          </span>
                          {row.variance}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-[0.02em] ${
                              row.confidence === "VERIFIED"
                                ? "bg-(--fin-secondary-container) text-(--fin-on-secondary-container)"
                                : "bg-(--fin-surface-variant) text-(--fin-on-surface-variant)"
                            }`}
                          >
                            {row.confidence}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between bg-(--fin-surface) p-4 text-xs font-semibold italic tracking-[0.02em] text-(--fin-on-surface-variant)">
              <span>{benchmarkMatrixFootnote}</span>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                <span>{benchmarkAiConfidence}</span>
              </div>
            </div>
          </div>

          {/* QofE specialized cards */}
          {qofeCards.map((card) => (
            <div
              key={card.title}
              className="flex flex-col gap-4 rounded-[8px] border border-(--fin-outline-variant) bg-white p-5 lg:col-span-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.02em] text-(--fin-on-surface-variant)">
                  {card.title}
                </span>
                <span className="material-symbols-outlined text-(--fin-secondary)">info</span>
              </div>
              <div className="flex items-end gap-3">
                <span className="fin-tabular text-[32px] font-bold text-(--fin-primary)">{card.value}</span>
                <span
                  className={`mb-1.5 flex items-center text-sm font-bold ${
                    card.deltaDirection === "up" ? "text-(--fin-primary)" : "text-(--fin-error)"
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {card.deltaDirection === "up" ? "arrow_drop_up" : "arrow_drop_down"}
                  </span>{" "}
                  {card.delta}
                </span>
              </div>
              <div className="h-12 w-full overflow-hidden opacity-50">
                <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 20">
                  <path d={card.sparklinePath} fill="none" stroke="#1A365D" strokeWidth="1.5" />
                </svg>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs font-semibold tracking-[0.02em] text-(--fin-on-surface-variant)">
                  Net Confidence Score
                </span>
                <div className="h-1.5 w-24 rounded-full bg-(--fin-surface-container)">
                  <div className="h-full bg-(--fin-primary)" style={{ width: `${card.confidencePct}%` }} />
                </div>
              </div>
            </div>
          ))}

          {/* AI Lens synthesis card */}
          <div className="group relative flex flex-col gap-4 overflow-hidden rounded-[8px] border border-(--fin-outline-variant) bg-white p-5 lg:col-span-4">
            <div className="absolute right-0 top-0 p-4 opacity-10 transition-opacity group-hover:opacity-20">
              <span className="material-symbols-outlined text-[120px]">smart_toy</span>
            </div>
            <div className="relative z-10 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.02em] text-(--fin-on-surface-variant)">
                {aiLensCard.title}
              </span>
              <span className="rounded-[2px] bg-(--fin-primary) px-2 py-0.5 text-[9px] font-bold text-(--fin-on-primary)">
                {aiLensCard.badge}
              </span>
            </div>
            <div className="relative z-10 flex flex-col gap-2">
              <p className="text-sm font-medium italic text-(--fin-primary)">{aiLensCard.quote}</p>
              <button className="flex items-center gap-1 text-left text-xs font-semibold tracking-[0.02em] text-(--fin-secondary) hover:underline">
                {aiLensCard.linkLabel} <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
