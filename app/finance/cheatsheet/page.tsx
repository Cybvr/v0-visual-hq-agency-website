import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import {
  cheatsheetHero,
  analogySection,
  glossarySection,
  cheatsheetCta,
} from "@/lib/finance/cheatsheet"

export const metadata: Metadata = {
  title: "Cheatsheet | Visualcns Finance",
  description: cheatsheetHero.description,
}

const hoverLift =
  "transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_12px_24px_-10px_rgba(26,54,93,0.1)]"

export default function FinanceCheatsheetPage() {
  return (
    <div className="overflow-x-hidden bg-(--fin-surface) text-sm text-(--fin-on-surface)">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-32 pb-20">
          <div className="relative z-10 mx-auto max-w-[1440px] px-4 text-center md:px-8">
            <span className="mb-4 block text-xs font-semibold uppercase tracking-widest text-(--fin-secondary)">
              {cheatsheetHero.eyebrow}
            </span>
            <h1 className="fin-headline mx-auto mb-6 max-w-3xl text-[32px] leading-10 text-(--fin-primary) md:text-[48px] md:leading-[56px]">
              {cheatsheetHero.title}
            </h1>
            <p className="mx-auto max-w-2xl text-base text-(--fin-on-surface-variant)">
              {cheatsheetHero.description}
            </p>
          </div>
        </section>

        {/* Real Estate Analogy Table */}
        <section className="bg-(--fin-surface-container-low) py-20">
          <div className="mx-auto max-w-[1440px] px-4 md:px-8">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <h2 className="fin-headline-md mb-6 text-[32px] leading-10 text-(--fin-primary)">
                {analogySection.title}
              </h2>
              <p className="text-base text-(--fin-on-surface-variant)">{analogySection.description}</p>
            </div>

            <div className="overflow-hidden rounded-[8px] border border-(--fin-outline-variant) bg-white">
              <div className="grid grid-cols-2 border-b border-(--fin-outline-variant) bg-(--fin-surface-container-highest)">
                <div className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-(--fin-on-surface-variant)">
                  Buying a house
                </div>
                <div className="border-l border-(--fin-outline-variant) px-6 py-4 text-xs font-semibold uppercase tracking-widest text-(--fin-primary)">
                  Buying a company
                </div>
              </div>
              {analogySection.rows.map((row) => (
                <div
                  key={row.realEstate}
                  className="grid grid-cols-2 border-b border-(--fin-outline-variant) last:border-b-0"
                >
                  <div className="px-6 py-6 text-(--fin-on-surface-variant)">{row.realEstate}</div>
                  <div className="border-l border-(--fin-outline-variant) px-6 py-6 font-medium text-(--fin-on-surface)">
                    {row.privateEquity}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Glossary */}
        <section className="bg-(--fin-surface) py-20">
          <div className="mx-auto max-w-[1440px] px-4 md:px-8">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <h2 className="fin-headline-md mb-6 text-[32px] leading-10 text-(--fin-primary)">
                {glossarySection.title}
              </h2>
              <p className="text-base text-(--fin-on-surface-variant)">{glossarySection.description}</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {glossarySection.terms.map((entry) => (
                <div
                  key={entry.term}
                  className={`rounded-[8px] border border-(--fin-outline-variant) bg-white p-6 ${hoverLift}`}
                >
                  <p className="mb-2 text-lg font-semibold text-(--fin-primary)">{entry.term}</p>
                  <p className="text-(--fin-on-surface-variant)">{entry.plain}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-y border-(--fin-outline-variant) bg-(--fin-surface-container-highest) py-24">
          <div className="mx-auto max-w-[1440px] px-4 text-center md:px-8">
            <h2 className="fin-headline mx-auto mb-8 max-w-3xl text-[32px] leading-10 text-(--fin-primary) md:text-[48px] md:leading-[56px]">
              {cheatsheetCta.title}
            </h2>
            <div className="flex flex-col justify-center gap-6 sm:flex-row">
              <Link
                href="/finance/app"
                className={`rounded-[8px] bg-(--fin-primary) px-10 py-5 text-base font-bold text-(--fin-on-primary) ${hoverLift}`}
              >
                {cheatsheetCta.primaryCta}
              </Link>
              <Link
                href="/finance/solutions"
                className={`rounded-[8px] border border-(--fin-outline) bg-white px-10 py-5 text-base font-bold text-(--fin-primary) ${hoverLift}`}
              >
                {cheatsheetCta.secondaryCta}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
