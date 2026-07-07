"use client"

import { useState, type FormEvent, type ReactNode } from "react"
import Link from "next/link"
import {
  businessInfoDefaults,
  industrySectorOptions,
  reportingCurrencyOptions,
} from "@/lib/finance/analysis"
import { AnalysisSubnav } from "@/components/finance/analysis-subnav"
import { PageHeader } from "@/components/finance/page-header"

const labelClass =
  "text-xs font-semibold uppercase tracking-wider text-(--fin-on-surface-variant)"

const inputClass =
  "w-full border border-(--fin-outline-variant) bg-(--fin-surface-container-low) px-4 py-3 text-sm outline-none transition-all focus:border-(--fin-primary) focus:ring-1 focus:ring-(--fin-primary)"

const scaleInputClass =
  "w-full border border-(--fin-outline-variant) bg-(--fin-surface) py-3 pl-8 pr-4 text-sm outline-none transition-all focus:border-(--fin-primary) focus:ring-1 focus:ring-(--fin-primary)"

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <p className="mb-6 flex items-center gap-2 text-xl font-semibold leading-7 text-(--fin-primary)">
      <span className="h-6 w-1.5 rounded-full bg-(--fin-secondary)" />
      {children}
    </p>
  )
}

export default function BusinessInfoPage() {
  const [saved, setSaved] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaved(true)
  }

  return (
    <>
      {/* Header section */}
      <PageHeader
        eyebrow="Analysis"
        title="Business Info"
        subtitle="Capture the baseline company profile, reporting context, and scale assumptions that drive downstream QofE analysis."
      />

      <AnalysisSubnav />

      <div className="mb-8 flex items-center gap-2 text-xs font-semibold tracking-[0.02em] text-(--fin-secondary)">
        <span>STEP 1 OF 4</span>
        <span className="h-px w-12 bg-(--fin-outline-variant)" />
        <span className="text-(--fin-on-surface-variant)">INITIAL PARAMETERS</span>
      </div>

      <div className="mx-auto max-w-4xl">
      {/* Form card */}
      <div className="fin-glass-card rounded-[8px] border border-(--fin-outline-variant) bg-(--fin-surface) p-10 shadow-sm">
        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* Section: Identity */}
          <div>
            <SectionTitle>Core Identity</SectionTitle>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className={labelClass} htmlFor="company-name">
                  Target Company Name
                </label>
                <input
                  id="company-name"
                  type="text"
                  placeholder={businessInfoDefaults.companyNamePlaceholder}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className={labelClass} htmlFor="industry-sector">
                  Industry Sector
                </label>
                <select id="industry-sector" defaultValue="" className={`${inputClass} appearance-none`}>
                  <option value="" disabled>
                    {businessInfoDefaults.sectorPlaceholder}
                  </option>
                  {industrySectorOptions.map((sector) => (
                    <option key={sector} value={sector}>
                      {sector}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-(--fin-outline-variant)" />

          {/* Section: Financial parameters */}
          <div>
            <SectionTitle>Reporting Framework</SectionTitle>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className={labelClass} htmlFor="fiscal-year-end">
                  Fiscal Year End
                </label>
                <input id="fiscal-year-end" type="month" className={inputClass} />
              </div>
              <div className="flex flex-col gap-2">
                <label className={labelClass} htmlFor="reporting-currency">
                  Reporting Currency
                </label>
                <select
                  id="reporting-currency"
                  defaultValue={reportingCurrencyOptions[0]}
                  className={inputClass}
                >
                  {reportingCurrencyOptions.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section: Estimated scale */}
          <div className="rounded-[4px] border border-(--fin-outline-variant) bg-(--fin-surface-container-lowest) p-6">
            <SectionTitle>Market Scale (Estimated TTM)</SectionTitle>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {(["TTM Revenue", "TTM EBITDA"] as const).map((field) => (
                <div key={field} className="flex flex-col gap-2">
                  <label className={labelClass} htmlFor={field.toLowerCase().replace(" ", "-")}>
                    {field}
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-(--fin-on-surface-variant)">
                      $
                    </span>
                    <input
                      id={field.toLowerCase().replace(" ", "-")}
                      type="number"
                      placeholder={businessInfoDefaults.amountPlaceholder}
                      className={scaleInputClass}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold tracking-[0.02em] text-(--fin-on-surface-variant)">
                      MM
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between border-t border-(--fin-outline-variant) pt-6">
            <Link
              href="/finance/app/analysis"
              className="flex items-center gap-2 px-6 py-3 text-xs font-semibold tracking-[0.02em] text-(--fin-on-surface-variant) transition-colors hover:text-(--fin-primary)"
            >
              <span className="material-symbols-outlined">close</span>
              Discard Draft
            </Link>
            <button
              type="submit"
              className="group relative overflow-hidden bg-(--fin-primary) px-8 py-4 text-xs font-semibold tracking-[0.02em] text-(--fin-on-primary) transition-all hover:pr-12"
            >
              <span className="relative z-10">Save and Continue to Uploads</span>
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 opacity-0 transition-all group-hover:opacity-100">
                arrow_forward
              </span>
            </button>
          </div>
        </form>
      </div>

      {/* Footer help */}
      <footer className="mt-8 flex items-center justify-between">
        <div className="flex items-center gap-4 text-(--fin-on-surface-variant)">
          <span className="material-symbols-outlined fin-icon-fill text-sm">lock</span>
          <p className="text-[11px] font-semibold uppercase tracking-widest opacity-60">
            SOCIETY GEN ET. 256-BIT ENCRYPTION ACTIVE
          </p>
        </div>
        <div className="flex gap-6">
          <Link
            href="/finance"
            className="text-xs font-semibold tracking-[0.02em] text-(--fin-secondary) underline-offset-4 hover:underline"
          >
            Privacy Policy
          </Link>
          <Link
            href="/finance"
            className="text-xs font-semibold tracking-[0.02em] text-(--fin-secondary) underline-offset-4 hover:underline"
          >
            Security Protocol
          </Link>
        </div>
      </footer>
      </div>

      {/* Success modal */}
      {saved && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-(--fin-primary)/40 p-6 backdrop-blur-sm">
          <div className="w-full max-w-md border border-(--fin-outline-variant) bg-(--fin-surface) p-8 shadow-2xl">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-(--fin-secondary)/10 text-(--fin-secondary)">
              <span className="material-symbols-outlined">check_circle</span>
            </div>
            <p className="mb-2 text-xl font-semibold leading-7 text-(--fin-primary)">
              Entity Profile Saved
            </p>
            <p className="mb-6 text-sm text-(--fin-on-surface-variant)">
              Business information for {businessInfoDefaults.savedEntityName} has been successfully
              initialized. Ready to proceed to document ingestion.
            </p>
            <div className="flex flex-col gap-2">
              <Link
                href="/finance/app/analysis/documents"
                className="w-full bg-(--fin-primary) py-3 text-center text-xs font-semibold tracking-[0.02em] text-(--fin-on-primary) transition-opacity hover:opacity-90"
              >
                Continue to Data Room
              </Link>
              <button
                type="button"
                onClick={() => setSaved(false)}
                className="w-full py-3 text-xs font-semibold tracking-[0.02em] text-(--fin-on-surface-variant) transition-colors hover:bg-(--fin-surface-container)"
              >
                Review Entry
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
