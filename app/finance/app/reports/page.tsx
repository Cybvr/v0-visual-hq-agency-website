import Link from "next/link"
import type { Metadata } from "next"
import { PageHeader } from "@/components/finance/page-header"
import {
  lpCapitalCall,
  lpDpiMetric,
  lpHero,
  lpIrMessage,
  lpNetIrrMetric,
  lpPortfolioAssets,
  lpReportDocuments,
  lpTvpiMetric,
} from "@/lib/finance/lp-portal"

export const metadata: Metadata = {
  title: "Visualcns Finance | Reports",
}

const sparklineBars = [
  "h-1/4 bg-(--fin-primary-container)/20",
  "h-2/5 bg-(--fin-primary-container)/30",
  "h-3/5 bg-(--fin-primary-container)/40",
  "h-1/2 bg-(--fin-primary-container)/50",
  "h-4/5 bg-(--fin-primary-container)/60",
  "h-full bg-(--fin-primary-container)/80",
]

export default function ReportsPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Home", href: "/finance/app" },
          { label: "Reports" },
        ]}
        eyebrow="Reporting"
        title="Reports"
        subtitle="Fund performance, reporting packages, capital activity, and investor communications in one workspace."
      />

      <div className="space-y-8">
        <section className="relative overflow-hidden rounded-[8px] bg-(--fin-primary-container) p-12 text-(--fin-on-primary)">
          <div className="relative z-10 max-w-2xl space-y-4">
            <h2 className="fin-headline text-[48px] leading-tight">
              {lpHero.titleLines[0]}
              <br />
              {lpHero.titleLines[1]}
            </h2>
            <p className="text-base opacity-80">{lpHero.body}</p>
            <div className="flex gap-4 pt-4">
              <button className="flex items-center gap-2 rounded-[4px] bg-(--fin-secondary-container) px-6 py-3 text-[16px] font-semibold text-(--fin-on-secondary-container) transition-opacity hover:opacity-90">
                <span className="material-symbols-outlined">download</span>
                {lpHero.cta}
              </button>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="flex flex-col justify-between rounded-[4px] border border-(--fin-outline-variant) bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-(--fin-secondary) hover:shadow-[0_4px_20px_rgba(26,54,93,0.06)] md:col-span-1">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-(--fin-on-surface-variant)">
                {lpTvpiMetric.label}
              </p>
              <h3 className="fin-headline-md text-[32px] leading-10 text-(--fin-primary)">{lpTvpiMetric.value}</h3>
            </div>
            <div className="mt-4 flex items-center gap-2 text-[#22c55e]">
              <span className="material-symbols-outlined">trending_up</span>
              <span className="text-xs font-semibold tracking-[0.02em]">{lpTvpiMetric.trend}</span>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-[4px] border border-(--fin-outline-variant) bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-(--fin-secondary) hover:shadow-[0_4px_20px_rgba(26,54,93,0.06)] md:col-span-1">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-(--fin-on-surface-variant)">
                {lpDpiMetric.label}
              </p>
              <h3 className="fin-headline-md text-[32px] leading-10 text-(--fin-primary)">{lpDpiMetric.value}</h3>
            </div>
            <div className="mt-4">
              <div className="h-1.5 w-full rounded-full bg-(--fin-surface-container)">
                <div
                  className="h-1.5 rounded-full bg-(--fin-secondary)"
                  style={{ width: `${lpDpiMetric.progressPct}%` }}
                />
              </div>
              <p className="mt-2 text-xs font-semibold tracking-[0.02em] text-(--fin-on-surface-variant)">
                {lpDpiMetric.target}
              </p>
            </div>
          </div>

          <div className="rounded-[4px] border border-(--fin-outline-variant) bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-(--fin-secondary) hover:shadow-[0_4px_20px_rgba(26,54,93,0.06)] md:col-span-2">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-(--fin-on-surface-variant)">
                  {lpNetIrrMetric.label}
                </p>
                <h3 className="fin-headline-md text-[32px] leading-10 text-(--fin-primary)">{lpNetIrrMetric.value}</h3>
              </div>
              <div className="rounded-full border border-[#bae6fd] bg-[#f0f9ff] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#0369a1]">
                {lpNetIrrMetric.badge}
              </div>
            </div>
            <div className="flex h-16 w-full items-end gap-1">
              {sparklineBars.map((bar) => (
                <div key={bar} className={`w-full rounded-[2px] ${bar}`} />
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="flex items-end justify-between">
              <h4 className="fin-headline-md text-[24px] text-(--fin-primary)">Quarterly Performance Reports</h4>
              <Link
                href="/finance/app/reports/archive"
                className="text-xs font-semibold tracking-[0.02em] text-(--fin-secondary) hover:underline"
              >
                View All Archives
              </Link>
            </div>
            <div className="overflow-hidden rounded-[8px] border border-(--fin-outline-variant) bg-white">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-(--fin-outline-variant) bg-(--fin-surface-container-low)">
                    <th className="px-6 py-4 text-xs font-semibold tracking-[0.02em] text-(--fin-on-surface-variant)">Report Name</th>
                    <th className="px-6 py-4 text-xs font-semibold tracking-[0.02em] text-(--fin-on-surface-variant)">Period</th>
                    <th className="px-6 py-4 text-xs font-semibold tracking-[0.02em] text-(--fin-on-surface-variant)">Format</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold tracking-[0.02em] text-(--fin-on-surface-variant)">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-(--fin-outline-variant)">
                  {lpReportDocuments.map((doc) => (
                    <tr key={doc.name} className="transition-colors hover:bg-(--fin-surface-container-low)">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className={`material-symbols-outlined ${doc.format === "XLSX" ? "text-[#1d6f42]" : "text-(--fin-primary)"}`}>
                            {doc.icon}
                          </span>
                          <span className="text-[14px] font-semibold">{doc.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-(--fin-on-surface-variant)">{doc.period}</td>
                      <td className="px-6 py-4">
                        <span className="rounded-[2px] bg-(--fin-surface-container) px-2 py-1 text-[10px] font-bold uppercase">{doc.format}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-1 text-(--fin-primary) hover:text-(--fin-secondary)">
                          <span className="material-symbols-outlined">download</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6 lg:col-span-1">
            <h4 className="fin-headline-md text-[24px] text-(--fin-primary)">Capital Management</h4>
            <div className="space-y-6 rounded-[8px] border border-(--fin-outline-variant) bg-white p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-[4px] bg-(--fin-error-container) p-3 text-(--fin-on-error-container)">
                  <span className="material-symbols-outlined">account_balance</span>
                </div>
                <div>
                  <p className="text-[16px] font-semibold">{lpCapitalCall.title}</p>
                  <p className="mt-1 text-[13px] text-(--fin-on-surface-variant)">{lpCapitalCall.dueDate}</p>
                  <div className="fin-tabular mt-3 text-[18px] font-bold text-(--fin-primary)">{lpCapitalCall.amount}</div>
                  <button className="mt-4 w-full rounded-[2px] bg-(--fin-primary) py-2 text-xs font-semibold tracking-[0.02em] text-(--fin-on-primary) transition-colors hover:bg-(--fin-primary-container)">
                    {lpCapitalCall.cta}
                  </button>
                </div>
              </div>
              <div className="h-px bg-(--fin-outline-variant)" />
              <div>
                <p className="mb-4 text-[16px] font-semibold">Internal Communication</p>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-(--fin-secondary-fixed)">
                      <span className="material-symbols-outlined text-sm text-(--fin-on-secondary-fixed)">shield</span>
                    </div>
                    <div className="rounded-[4px] border border-(--fin-outline-variant) bg-(--fin-surface-container-low) p-3">
                      <p className="text-[12px] leading-relaxed">{lpIrMessage.body}</p>
                      <p className="mt-2 text-[10px] font-bold uppercase text-(--fin-on-surface-variant)">{lpIrMessage.meta}</p>
                    </div>
                  </div>
                  <div className="relative">
                    <textarea
                      className="w-full rounded-[4px] border border-(--fin-outline-variant) bg-(--fin-surface) p-3 text-sm focus:border-transparent focus:ring-2 focus:ring-(--fin-primary)"
                      placeholder="Message the IR Team..."
                      rows={2}
                    />
                    <button className="absolute bottom-3 right-3 text-(--fin-primary)">
                      <span className="material-symbols-outlined">send</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-12">
          <h4 className="fin-headline-md mb-6 text-[24px] text-(--fin-primary)">Key Asset Progression</h4>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {lpPortfolioAssets.map((asset) => (
              <div key={asset.name} className="group relative h-64 overflow-hidden rounded-[8px] border border-(--fin-outline-variant)">
                <img
                  src={asset.image}
                  alt={asset.alt}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-(--fin-primary)/90 to-transparent" />
                <div className="absolute bottom-0 p-6 text-(--fin-on-primary)">
                  <span className="mb-2 inline-block rounded-[2px] border border-(--fin-secondary-container)/40 bg-(--fin-secondary-container)/20 px-2 py-0.5 text-[10px] font-bold uppercase">
                    {asset.tag}
                  </span>
                  <p className="text-[18px] font-semibold">{asset.name}</p>
                  <p className="mt-1 text-sm opacity-80">{asset.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <button className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-(--fin-secondary) text-(--fin-on-secondary) shadow-lg transition-all hover:scale-110 active:scale-95">
        <span className="material-symbols-outlined">support_agent</span>
      </button>
    </>
  )
}
