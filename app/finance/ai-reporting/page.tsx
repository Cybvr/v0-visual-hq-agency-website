import type { Metadata } from "next"
import Link from "next/link"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import {
  aiReportingCta,
  aiReportingHero,
  documentLensCallout,
  documentLensSection,
  reportingPillars,
  reportingPillarsDescription,
  reportingPillarsHeading,
  tbMappingSection,
} from "@/lib/finance/ai-reporting"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Visualcns Finance | AI-Powered QofE Reporting",
  description: aiReportingHero.description,
}

export default function AiReportingPage() {
  return (
    <>
      <Header />
      <main className="w-full">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-32 pb-24 md:pb-32">
          <div className="relative z-10 mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-12 px-8 md:grid-cols-2">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-(--fin-secondary-fixed) px-3 py-1 text-(--fin-on-secondary-fixed)">
                <span className="material-symbols-outlined text-sm">{aiReportingHero.badgeIcon}</span>
                <span className="text-xs font-semibold tracking-[0.02em]">{aiReportingHero.badgeLabel}</span>
              </div>
              <h1 className="fin-headline text-[32px] leading-10 text-(--fin-primary) md:text-[48px] md:leading-[56px]">
                {aiReportingHero.headline} <br />
                <span className="italic text-(--fin-secondary)">{aiReportingHero.headlineAccent}</span>
              </h1>
              <p className="max-w-lg text-base text-(--fin-on-surface-variant)">{aiReportingHero.description}</p>
              <div className="flex gap-4 pt-4">
                <Link
                  href="/contact"
                  className="flex items-center gap-2 rounded-[4px] bg-(--fin-primary) px-8 py-4 text-xl font-semibold leading-7 text-(--fin-on-primary) shadow-lg transition-all hover:bg-(--fin-primary-container)"
                >
                  {aiReportingHero.primaryCta} <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
                <button className="rounded-[4px] border border-(--fin-outline) px-8 py-4 text-xl font-semibold leading-7 text-(--fin-primary) transition-all hover:bg-(--fin-surface-container-low)">
                  {aiReportingHero.secondaryCta}
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="overflow-hidden rounded-[8px] border border-(--fin-outline-variant) bg-white p-2 shadow-2xl">
                <img className="h-auto w-full rounded-[4px]" src={aiReportingHero.image} alt={aiReportingHero.imageAlt} />
              </div>
              {/* Document Lens Overlay */}
              <div className="fin-glass-card absolute -bottom-6 -left-6 hidden w-64 rounded-[8px] border-l-4 border-l-(--fin-secondary) p-6 shadow-xl lg:block">
                <div className="mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-(--fin-secondary)">{documentLensCallout.icon}</span>
                  <span className="text-xs font-semibold tracking-[0.02em] text-(--fin-secondary)">
                    {documentLensCallout.label}
                  </span>
                </div>
                <p className="mb-3 text-sm italic text-(--fin-on-surface)">{documentLensCallout.quote}</p>
                <div className="h-1 w-full rounded-[2px] bg-(--fin-surface-container-high)">
                  <div className="h-full w-4/5 rounded-[2px] bg-(--fin-secondary)" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="border-y border-(--fin-outline-variant) bg-(--fin-surface-container-lowest) py-24">
          <div className="mx-auto max-w-[1440px] px-8">
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <h2 className="fin-headline-md mb-4 text-[32px] leading-10 text-(--fin-primary)">
                {reportingPillarsHeading}
              </h2>
              <p className="text-base text-(--fin-on-surface-variant)">{reportingPillarsDescription}</p>
            </div>
            <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
              {reportingPillars.map((pillar) => (
                <div key={pillar.title} className="group flex flex-col items-center text-center">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[linear-gradient(135deg,#002045_0%,#1a365d_100%)] shadow-md transition-transform group-hover:scale-110">
                    <span className="material-symbols-outlined text-3xl text-(--fin-on-primary)">{pillar.icon}</span>
                  </div>
                  <p className="mb-3 text-xl font-semibold leading-7 text-(--fin-primary)">{pillar.title}</p>
                  <p className="text-sm text-(--fin-on-surface-variant)">{pillar.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TB Mapping Preview */}
        <section className="bg-(--fin-surface) py-24">
          <div className="mx-auto max-w-[1440px] px-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              {/* Text Content */}
              <div className="flex flex-col justify-center space-y-6 lg:col-span-4">
                <h2 className="fin-headline-md text-[32px] leading-10 text-(--fin-primary)">
                  {tbMappingSection.heading}
                </h2>
                <p className="text-base text-(--fin-on-surface-variant)">{tbMappingSection.description}</p>
                <ul className="space-y-4">
                  {tbMappingSection.checklist.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="material-symbols-outlined fin-icon-fill text-(--fin-secondary)">
                        check_circle
                      </span>
                      <span className="text-sm text-(--fin-on-surface)">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Data Grid Preview */}
              <div className="lg:col-span-8">
                <div className="fin-glass-card overflow-hidden rounded-[8px] shadow-2xl">
                  {/* Table Header */}
                  <div className="flex items-center justify-between bg-(--fin-primary) p-4">
                    <div className="flex items-center gap-4">
                      <span className="text-xl font-semibold leading-7 text-(--fin-on-primary)">
                        {tbMappingSection.tableTitle}
                      </span>
                      <span className="rounded-[2px] bg-(--fin-secondary) px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                        {tbMappingSection.tableBadge}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="rounded-[2px] p-2 text-(--fin-on-primary-container) hover:bg-(--fin-primary-container)">
                        <span className="material-symbols-outlined text-sm">settings</span>
                      </button>
                      <button className="rounded-[2px] bg-(--fin-on-primary) px-4 py-1.5 text-xs font-semibold tracking-[0.02em] text-(--fin-primary)">
                        {tbMappingSection.saveLabel}
                      </button>
                    </div>
                  </div>
                  {/* Table Body */}
                  <div className="fin-scrollbar overflow-x-auto">
                    <table className="fin-tabular w-full border-collapse text-left">
                      <thead>
                        <tr className="border-b border-(--fin-outline-variant) bg-(--fin-surface-container-low)">
                          {tbMappingSection.columns.map((column, index) => (
                            <th
                              key={column}
                              className={cn(
                                "px-6 py-3 text-xs font-semibold tracking-[0.02em] text-(--fin-on-surface-variant)",
                                index >= 3 && "text-right",
                              )}
                            >
                              {column}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-(--fin-outline-variant) text-sm">
                        {tbMappingSection.rows.map((row) => (
                          <tr
                            key={row.accountCode}
                            className={cn(
                              "transition-all hover:translate-x-1",
                              row.highlighted
                                ? "bg-(--fin-secondary-container)/10 hover:bg-(--fin-secondary-container)/20"
                                : "hover:bg-(--fin-surface-container)",
                            )}
                          >
                            <td className="px-6 py-4 font-mono text-xs">{row.accountCode}</td>
                            <td className="px-6 py-4 font-semibold">
                              {row.aiFlag ? (
                                <span className="flex items-center gap-2">
                                  {row.description}
                                  <span
                                    className="material-symbols-outlined text-sm text-(--fin-secondary)"
                                    title={row.aiFlag}
                                  >
                                    info
                                  </span>
                                </span>
                              ) : (
                                row.description
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <span className="rounded-full bg-(--fin-tertiary-fixed) px-2 py-1 text-[11px] font-bold text-(--fin-on-tertiary-fixed)">
                                {row.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">{row.fy23Actual}</td>
                            <td
                              className={cn(
                                "px-6 py-4 text-right text-(--fin-secondary)",
                                row.adjustments !== "—" && "font-bold",
                              )}
                            >
                              {row.adjustments}
                            </td>
                            <td className="px-6 py-4 text-right font-bold">{row.proForma}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <p className="mt-4 text-right text-xs font-semibold tracking-[0.02em] text-(--fin-on-surface-variant)">
                  <span className="italic">{tbMappingSection.syncNote}</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Document Lens Deep Dive */}
        <section className="relative overflow-hidden bg-(--fin-primary) py-24">
          <div className="relative z-10 mx-auto max-w-[1440px] px-8">
            <div className="flex flex-col items-center gap-16 md:flex-row">
              <div className="md:w-1/2">
                <div className="group relative cursor-pointer">
                  <img
                    className="rounded-[8px] opacity-90 shadow-2xl transition-opacity group-hover:opacity-100"
                    src={documentLensSection.image}
                    alt={documentLensSection.imageAlt}
                  />
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="h-32 w-32 animate-pulse rounded-full border-4 border-(--fin-secondary)/30" />
                  </div>
                </div>
              </div>
              <div className="space-y-8 md:w-1/2">
                <h2 className="fin-headline-md text-[32px] leading-10 text-(--fin-on-primary)">
                  {documentLensSection.heading}
                </h2>
                <p className="text-base text-(--fin-on-primary) opacity-80">{documentLensSection.description}</p>
                <div className="space-y-6">
                  {documentLensSection.features.map((feature) => (
                    <div key={feature.title} className="group flex items-center gap-6">
                      <div className="rounded-[4px] border border-(--fin-secondary)/30 bg-(--fin-primary-container) p-3 text-(--fin-secondary)">
                        <span className="material-symbols-outlined text-2xl">{feature.icon}</span>
                      </div>
                      <div>
                        <p className="text-xl font-semibold leading-7 text-(--fin-on-primary)">{feature.title}</p>
                        <p className="text-sm text-(--fin-on-primary) opacity-60">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-(--fin-surface) py-32 text-center">
          <div className="mx-auto max-w-4xl px-4">
            <h2 className="fin-headline mb-8 text-[32px] leading-10 text-(--fin-primary) md:text-[48px] md:leading-[56px]">
              {aiReportingCta.heading}
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-base text-(--fin-on-surface-variant)">
              {aiReportingCta.description}
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/contact"
                className="rounded-[4px] bg-(--fin-primary) px-10 py-5 text-xl font-semibold leading-7 text-(--fin-on-primary) shadow-xl transition-all hover:translate-y-[-2px]"
              >
                {aiReportingCta.primaryCta}
              </Link>
              <Link
                href="/contact"
                className="rounded-[4px] border border-(--fin-outline) bg-white px-10 py-5 text-xl font-semibold leading-7 text-(--fin-primary) shadow-sm transition-all hover:bg-(--fin-surface-container-low)"
              >
                {aiReportingCta.secondaryCta}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
