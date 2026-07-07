import Link from "next/link"
import { AnalysisSubnav } from "@/components/finance/analysis-subnav"
import { PageHeader } from "@/components/finance/page-header"
import {
  documentLensHighlight,
  intakeQueue,
  intakeQueueActiveLabel,
  intakeRequirements,
  type IntakeFileStatus,
} from "@/lib/finance/analysis"

const statusBadgeClass: Record<IntakeFileStatus, string> = {
  analyzing: "bg-(--fin-secondary-container) text-(--fin-on-secondary-container)",
  completed: "bg-[#D1FAE5] text-[#065F46]",
  pending: "bg-(--fin-surface-variant) text-(--fin-on-surface-variant)",
}

const statusLabel: Record<IntakeFileStatus, string> = {
  analyzing: "Analyzing",
  completed: "Completed",
  pending: "Pending",
}

const iconToneClass = {
  secondary: "text-(--fin-secondary)",
  error: "text-(--fin-error)",
} as const

export default function DocumentIntakePage() {
  return (
    <>
      <PageHeader
        eyebrow="Analysis"
        title="Document Intake"
        subtitle="Upload source files, track processing, and prepare the working set for structured QofE analysis."
      />

      <AnalysisSubnav />

      <Link
        href="/finance/app/analysis/business-info"
        className="mb-8 inline-flex items-center gap-1 text-xs font-semibold tracking-[0.02em] text-(--fin-secondary) underline-offset-4 hover:underline"
      >
        <span className="material-symbols-outlined text-[16px]">arrow_back</span>
        Back to Business Info
      </Link>

      <section>
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
          {/* Left column: upload zone */}
          <div className="flex flex-col gap-6 xl:col-span-7">
            <div className="group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[8px] border-2 border-dashed border-(--fin-outline-variant) bg-white p-12 text-center transition-all duration-200 hover:border-(--fin-secondary) hover:bg-[rgba(25,96,163,0.04)]">
              <div className="mb-6 flex gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-[4px] bg-(--fin-surface-container-low) text-(--fin-secondary)">
                  <span className="material-symbols-outlined text-4xl">table_chart</span>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-[4px] bg-(--fin-surface-container-low) text-(--fin-error)">
                  <span className="material-symbols-outlined text-4xl">picture_as_pdf</span>
                </div>
              </div>
              <p className="mb-2 text-xl font-semibold leading-7 text-(--fin-primary)">
                Drop your Excel or PDF files here
              </p>
              <p className="mb-8 text-sm text-(--fin-on-surface-variant)">
                Supported: .xlsx, .csv, .pdf, .zip up to 256MB
              </p>
              <button
                type="button"
                className="rounded-full bg-(--fin-primary) px-8 py-3 text-xs font-semibold tracking-[0.02em] text-(--fin-on-primary) transition-all hover:scale-95"
              >
                Select Files from Local Machine
              </button>
            </div>

            <div className="rounded-[8px] border border-(--fin-outline-variant) bg-(--fin-surface-container-low) p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="material-symbols-outlined fin-icon-fill text-(--fin-secondary)">
                  info
                </span>
                <span className="text-xl font-semibold leading-7 text-(--fin-primary)">
                  Intake Requirements
                </span>
              </div>
              <ul className="space-y-3 text-sm text-(--fin-on-surface-variant)">
                {intakeRequirements.map((requirement) => (
                  <li key={requirement} className="flex items-start gap-2">
                    <span className="material-symbols-outlined mt-0.5 text-sm">check_circle</span>
                    {requirement}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right column: upload queue */}
          <div className="xl:col-span-5">
            <div className="flex h-full flex-col rounded-[8px] border border-(--fin-outline-variant) bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-(--fin-outline-variant) bg-(--fin-surface-bright) p-6">
                <p className="text-xl font-semibold leading-7 text-(--fin-primary)">
                  Processing Queue
                </p>
                <span className="text-xs font-semibold tracking-[0.02em] text-(--fin-on-surface-variant)">
                  {intakeQueueActiveLabel}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto">
                {intakeQueue.map((file) => (
                  <div
                    key={file.name}
                    className={`flex items-center gap-4 border-b border-(--fin-outline-variant) p-4 transition-colors hover:bg-(--fin-surface-container-low) ${
                      file.status === "pending" ? "opacity-70" : ""
                    }`}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-[2px] bg-(--fin-surface-container)">
                      <span className={`material-symbols-outlined ${iconToneClass[file.iconTone]}`}>
                        {file.icon}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold tracking-[0.02em] text-(--fin-primary)">
                        {file.name}
                      </p>
                      <p className="font-mono text-xs text-(--fin-on-surface-variant)">
                        {file.meta}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusBadgeClass[file.status]}`}
                      >
                        {statusLabel[file.status]}
                      </span>
                      {file.status === "analyzing" && (
                        <div className="h-1 w-16 overflow-hidden rounded-full bg-(--fin-surface-container)">
                          <div
                            className="h-full bg-(--fin-secondary)"
                            style={{ width: `${file.progress ?? 0}%` }}
                          />
                        </div>
                      )}
                      {file.actionLabel && (
                        <button
                          type="button"
                          className="mt-1 text-xs font-semibold tracking-[0.02em] text-(--fin-secondary) hover:underline"
                        >
                          {file.actionLabel}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {/* Empty/next slot placeholder */}
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <p className="text-sm text-(--fin-on-surface-variant)">Ready for next batch</p>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-(--fin-outline-variant) bg-(--fin-surface-container-low) p-6">
                <button
                  type="button"
                  className="text-xs font-semibold tracking-[0.02em] text-(--fin-on-surface-variant) hover:text-(--fin-primary)"
                >
                  Clear Finished
                </button>
                <Link
                  href="/finance/app/analysis/report"
                  className="flex items-center gap-2 rounded-[4px] bg-(--fin-secondary) px-4 py-2 text-xs font-semibold tracking-[0.02em] text-(--fin-on-secondary) shadow-md"
                >
                  <span className="material-symbols-outlined text-sm">rocket_launch</span>
                  Start All Analysis
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Document Lens highlight */}
      <div className="relative mt-12 flex flex-col items-center gap-8 overflow-hidden rounded-[16px] bg-(--fin-primary) p-8 text-(--fin-on-primary) shadow-xl md:flex-row">
        <div className="relative z-10 flex-1">
          <h2 className="fin-headline-md mb-4 text-[32px] leading-10 text-(--fin-primary-fixed)">
            {documentLensHighlight.title}
          </h2>
          <p className="max-w-xl text-base opacity-90">{documentLensHighlight.body}</p>
        </div>
        <div className="relative z-10 shrink-0">
          <img
            src={documentLensHighlight.imageSrc}
            alt={documentLensHighlight.imageAlt}
            className="h-40 w-64 rounded-[8px] border border-(--fin-on-primary)/20 object-cover shadow-2xl"
          />
        </div>
      </div>
    </>
  )
}
