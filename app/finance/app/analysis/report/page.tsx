import type { Metadata } from "next"
import { cn } from "@/lib/utils"
import { AnalysisSubnav } from "@/components/finance/analysis-subnav"
import { PageHeader } from "@/components/finance/page-header"
import {
  qofeBridgeBars,
  qofeInsight,
  qofeReportMeta,
  qofeTableRows,
  type QofeBridgeTone,
  type QofeRowVariant,
} from "@/lib/finance/report"

export const metadata: Metadata = {
  title: "Visualcns Finance - QofE Report",
}

const labelMd = "text-xs font-semibold tracking-[0.02em]"

const bridgeBarClasses: Record<QofeBridgeTone, string> = {
  start: "rounded-t-[2px] bg-(--fin-primary-container)",
  gain: "rounded-[2px] bg-(--fin-secondary-container)",
  loss: "rounded-[2px] border border-(--fin-error) bg-(--fin-error)/20",
  end: "rounded-t-[2px] bg-(--fin-primary)",
}

const bridgeValueClasses: Record<QofeBridgeTone, string> = {
  start: "text-(--fin-primary)",
  gain: "text-(--fin-secondary)",
  loss: "text-(--fin-error)",
  end: "text-(--fin-primary)",
}

interface RowStyle {
  row: string
  cell: string
  description: string
  reported: string
  adjustments: string
  proForma: string
}

const rowStyles: Record<QofeRowVariant, RowStyle> = {
  revenue: {
    row: "hover:bg-(--fin-secondary-container)/8",
    cell: "px-6 py-4",
    description: "font-semibold text-(--fin-primary)",
    reported: "",
    adjustments: "text-(--fin-on-tertiary-container)",
    proForma: "font-semibold",
  },
  detail: {
    row: "hover:bg-(--fin-secondary-container)/8",
    cell: "px-6 py-4",
    description: "pl-10 italic text-(--fin-on-surface-variant)",
    reported: "",
    adjustments: "text-(--fin-secondary-container)",
    proForma: "",
  },
  subtotal: {
    row: "border-t-2 border-(--fin-outline-variant) bg-(--fin-surface-container-lowest) font-bold hover:bg-(--fin-secondary-container)/8",
    cell: "px-6 py-4",
    description: "text-(--fin-primary)",
    reported: "",
    adjustments: "text-(--fin-secondary)",
    proForma: "",
  },
  line: {
    row: "hover:bg-(--fin-secondary-container)/8",
    cell: "px-6 py-4",
    description: "text-(--fin-on-surface)",
    reported: "",
    adjustments: "text-(--fin-on-tertiary-container)",
    proForma: "",
  },
  adjustment: {
    row: "border-l-4 border-(--fin-secondary) bg-(--fin-secondary-container)/12 hover:bg-(--fin-secondary-container)/20",
    cell: "px-6 py-4",
    description: "font-medium text-(--fin-on-surface)",
    reported: "text-(--fin-on-tertiary-container)",
    adjustments: "font-bold text-(--fin-secondary)",
    proForma: "",
  },
  total: {
    row: "bg-(--fin-primary) font-bold text-(--fin-on-primary)",
    cell: "px-6 py-6",
    description: "text-xl leading-7",
    reported: "text-xl leading-7",
    adjustments: "text-xl leading-7 text-(--fin-secondary-fixed-dim)",
    proForma: "text-xl leading-7",
  },
  margin: {
    row: "border-t border-(--fin-on-primary-container)/20 bg-(--fin-primary-container) font-medium text-(--fin-on-primary-container)",
    cell: "px-6 py-4",
    description: "",
    reported: "",
    adjustments: "text-(--fin-secondary-fixed-dim)",
    proForma: "",
  },
}

export default function QofeReportPage() {
  return (
    <>
      {/* Page header */}
      <PageHeader eyebrow="Analysis" title="QofE Report" subtitle={qofeReportMeta.subtitle} />

      <AnalysisSubnav />

      <section className="mb-8 flex items-center gap-4">
        <button
          className={cn(
            labelMd,
            "flex items-center gap-2 rounded-[4px] border border-(--fin-outline) px-4 py-2 text-(--fin-on-surface-variant) transition-colors hover:bg-(--fin-surface-container)",
          )}
        >
          <span className="material-symbols-outlined">download</span>
          Export PDF
        </button>
        <button
          className={cn(
            labelMd,
            "flex items-center gap-2 rounded-[4px] bg-(--fin-primary) px-4 py-2 text-(--fin-on-primary) transition-opacity hover:opacity-95",
          )}
        >
          <span className="material-symbols-outlined">share</span>
          Share Link
        </button>
      </section>

      <div className="space-y-8">
        {/* Summary visualization */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Bridge chart card */}
          <div className="rounded-[8px] border border-(--fin-outline-variant) bg-white p-6 shadow-sm lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-xl font-semibold leading-7 text-(--fin-primary)">EBITDA Bridge Analysis</p>
              <span className={cn(labelMd, "text-(--fin-on-surface-variant)")}>{qofeReportMeta.currencyNote}</span>
            </div>
            <div className="flex h-64 items-end justify-between gap-4 px-4">
              {qofeBridgeBars.map((bar) => (
                <div key={bar.label} className="flex w-full max-w-[60px] flex-col items-center">
                  <div
                    className={cn("relative w-full", bridgeBarClasses[bar.tone])}
                    style={{ height: bar.height, marginBottom: bar.offset || undefined }}
                  >
                    <div
                      className={cn(
                        "absolute -top-8 left-1/2 -translate-x-1/2 font-bold",
                        bridgeValueClasses[bar.tone],
                      )}
                    >
                      {bar.value}
                    </div>
                    {bar.dashed && (
                      <div className="absolute inset-0 -left-2 border-l border-dashed border-(--fin-outline-variant)" />
                    )}
                  </div>
                  <span className="mt-2 text-center text-[10px] font-semibold uppercase text-(--fin-on-surface-variant)">
                    {bar.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* AI insight box */}
          <div className="flex flex-col rounded-[8px] border border-(--fin-primary) bg-(--fin-primary-container) p-6 text-(--fin-on-primary)">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[4px] bg-[#455f88]/20">
                <span className="material-symbols-outlined text-(--fin-secondary-fixed-dim)">{qofeInsight.icon}</span>
              </div>
              <p className="text-xl font-semibold leading-7">{qofeInsight.title}</p>
            </div>
            <p className="mb-6 text-sm leading-relaxed text-(--fin-on-primary-container)">{qofeInsight.body}</p>
            <div className="mt-auto">
              <div className="flex items-center justify-between border-t border-(--fin-on-primary-container)/30 py-3">
                <span className={cn(labelMd, "opacity-70")}>{qofeInsight.confidenceLabel}</span>
                <span className="font-bold text-(--fin-secondary-fixed-dim)">{qofeInsight.confidence}</span>
              </div>
              <button
                className={cn(
                  labelMd,
                  "mt-4 w-full rounded-[4px] bg-white py-2 text-(--fin-primary) transition-colors hover:bg-(--fin-surface-bright)",
                )}
              >
                {qofeInsight.ctaLabel}
              </button>
            </div>
          </div>
        </section>

        {/* Adjusted EBITDA table */}
        <section className="overflow-hidden rounded-[8px] border border-(--fin-outline-variant) bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-(--fin-outline-variant) p-6">
            <p className="text-xl font-semibold leading-7 text-(--fin-primary)">Adjusted EBITDA Calculation</p>
            <div className="flex gap-2">
              <button className="rounded-[4px] p-2 text-(--fin-on-surface-variant) hover:bg-(--fin-surface-container)">
                <span className="material-symbols-outlined">filter_list</span>
              </button>
              <button className="rounded-[4px] p-2 text-(--fin-on-surface-variant) hover:bg-(--fin-surface-container)">
                <span className="material-symbols-outlined">more_vert</span>
              </button>
            </div>
          </div>
          <div className="fin-scrollbar overflow-x-auto">
            <table className="fin-tabular w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-(--fin-outline-variant) bg-(--fin-surface-container-low)">
                  <th className={cn(labelMd, "px-6 py-4 uppercase tracking-wider text-(--fin-on-surface-variant)")}>
                    Line Item Description
                  </th>
                  <th
                    className={cn(
                      labelMd,
                      "px-6 py-4 text-right uppercase tracking-wider text-(--fin-on-surface-variant)",
                    )}
                  >
                    Reported (Audited)
                  </th>
                  <th
                    className={cn(
                      labelMd,
                      "px-6 py-4 text-right uppercase tracking-wider text-(--fin-on-surface-variant)",
                    )}
                  >
                    Adjustments
                  </th>
                  <th
                    className={cn(
                      labelMd,
                      "px-6 py-4 text-right uppercase tracking-wider text-(--fin-on-surface-variant)",
                    )}
                  >
                    Pro Forma
                  </th>
                  <th
                    className={cn(
                      labelMd,
                      "px-6 py-4 text-center uppercase tracking-wider text-(--fin-on-surface-variant)",
                    )}
                  >
                    Ref
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-(--fin-outline-variant)">
                {qofeTableRows.map((row) => {
                  const styles = rowStyles[row.variant]
                  return (
                    <tr key={row.description} className={styles.row}>
                      <td className={cn(styles.cell, styles.description)}>{row.description}</td>
                      <td className={cn(styles.cell, "text-right", styles.reported)}>{row.reported}</td>
                      <td className={cn(styles.cell, "text-right", styles.adjustments)}>{row.adjustments}</td>
                      <td className={cn(styles.cell, "text-right", styles.proForma)}>{row.proForma}</td>
                      <td className={cn(styles.cell, "text-center")}>
                        {row.refInfoIcon ? (
                          <span className="material-symbols-outlined fin-icon-fill cursor-help text-[18px] text-(--fin-secondary)">
                            info
                          </span>
                        ) : row.ref ? (
                          <span className="rounded-full bg-(--fin-surface-container) px-2 py-1 text-[10px] text-(--fin-on-surface-variant)">
                            {row.ref}
                          </span>
                        ) : null}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Bottom note */}
        <footer className="flex flex-col items-start gap-8 rounded-[8px] border border-(--fin-outline-variant) bg-(--fin-surface-container-low) p-6 md:flex-row">
          <div className="flex-1">
            <p className={cn(labelMd, "mb-2 uppercase text-(--fin-on-surface-variant)")}>
              {qofeReportMeta.methodologyTitle}
            </p>
            <p className="text-xs leading-relaxed text-(--fin-on-surface-variant)">{qofeReportMeta.methodologyNote}</p>
          </div>
          <div className="w-full space-y-4 md:w-64">
            <div className="flex items-center justify-between text-xs">
              <span className="text-(--fin-on-surface-variant)">Report ID:</span>
              <span className="font-mono font-bold">{qofeReportMeta.reportId}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-(--fin-on-surface-variant)">Analyst:</span>
              <span className="font-bold">{qofeReportMeta.analyst}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-(--fin-on-surface-variant)">Review Status:</span>
              <span className="rounded-[2px] border border-(--fin-secondary-container) bg-white px-2 py-0.5 text-[10px] text-(--fin-on-secondary-container)">
                {qofeReportMeta.reviewStatus}
              </span>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
