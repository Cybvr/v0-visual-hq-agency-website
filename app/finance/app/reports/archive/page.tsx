import Link from "next/link"
import { PageHeader } from "@/components/finance/page-header"
import { lpReportDocuments } from "@/lib/finance/lp-portal"

export default function ReportArchivePage() {
  return (
    <>
      <PageHeader
        eyebrow="Reporting"
        title="Report Archive"
        subtitle="Browse previously prepared investor materials, download package files, and review reporting history."
      />

      <div className="mb-8 flex items-center justify-between">
        <Link
          href="/finance/app/reports"
          className="text-xs font-semibold tracking-[0.02em] text-(--fin-secondary) hover:underline"
        >
          Back to reports
        </Link>
      </div>

      <section className="overflow-hidden rounded-[8px] border border-(--fin-outline-variant) bg-white">
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
                  <span className="rounded-[2px] bg-(--fin-surface-container) px-2 py-1 text-[10px] font-bold uppercase">
                    {doc.format}
                  </span>
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
      </section>
    </>
  )
}
