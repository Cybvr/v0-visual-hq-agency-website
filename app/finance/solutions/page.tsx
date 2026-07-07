import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import {
  solutionsHero,
  sourcingStage,
  executionStage,
  postCloseStage,
  solutionsCta,
} from "@/lib/finance/solutions"

export const metadata: Metadata = {
  title: "Solutions | Visualcns Finance",
  description: solutionsHero.description,
}

const hoverLift =
  "transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_12px_24px_-10px_rgba(26,54,93,0.1)]"

export default function FinanceSolutionsPage() {
  return (
    <div className="overflow-x-hidden bg-(--fin-surface) text-sm text-(--fin-on-surface)">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-32 pb-24">
          <div className="relative z-10 mx-auto max-w-[1440px] px-4 text-center md:px-8">
            <h1 className="fin-headline mx-auto mb-6 max-w-4xl text-[32px] leading-10 text-(--fin-primary) md:text-[48px] md:leading-[56px]">
              {solutionsHero.title}
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-base text-(--fin-on-surface-variant)">
              {solutionsHero.description}
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/contact"
                className={`rounded-[8px] bg-(--fin-primary) px-8 py-4 text-base font-bold text-(--fin-on-primary) ${hoverLift}`}
              >
                {solutionsHero.primaryCta}
              </Link>
              <Link
                href="/finance"
                className={`rounded-[8px] border border-(--fin-outline) px-8 py-4 text-base font-bold text-(--fin-primary) ${hoverLift}`}
              >
                {solutionsHero.secondaryCta}
              </Link>
            </div>
          </div>
        </section>

        {/* Sourcing Section */}
        <section className="bg-(--fin-surface-container-low) py-20">
          <div className="mx-auto max-w-[1440px] px-4 md:px-8">
            <div className="grid items-center gap-16 lg:grid-cols-2">
              <div>
                <span className="mb-6 inline-block rounded-full bg-(--fin-primary-container) px-3 py-1 text-xs font-semibold uppercase tracking-widest text-(--fin-on-primary-container)">
                  {sourcingStage.badge}
                </span>
                <h2 className="fin-headline-md mb-6 text-[32px] leading-10 text-(--fin-primary)">
                  {sourcingStage.title}
                </h2>
                <p className="mb-8 text-base text-(--fin-on-surface-variant)">
                  {sourcingStage.description}
                </p>
                <ul className="space-y-4">
                  {sourcingStage.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-3">
                      <span className="material-symbols-outlined fin-icon-fill text-(--fin-secondary)">
                        check_circle
                      </span>
                      <span className="text-sm">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative">
                <div className="aspect-video overflow-hidden rounded-[8px] border border-(--fin-outline-variant) bg-white p-4 shadow-2xl">
                  <img
                    src={sourcingStage.image.src}
                    alt={sourcingStage.image.alt}
                    className="h-full w-full rounded-[4px] object-cover"
                  />
                </div>
                <div className="fin-glass-card absolute -bottom-6 -left-6 max-w-[240px] rounded-[8px] p-6 shadow-lg">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.02em] text-(--fin-secondary)">
                    {sourcingStage.stat.label}
                  </p>
                  <p className="fin-headline-md text-[32px] leading-tight text-(--fin-primary)">
                    {sourcingStage.stat.value}
                  </p>
                  <p className="text-sm text-(--fin-on-surface-variant)">
                    {sourcingStage.stat.caption}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Execution Section (High Contrast) */}
        <section className="bg-(--fin-primary-container) py-20 text-(--fin-on-primary)">
          <div className="mx-auto max-w-[1440px] px-4 md:px-8">
            <div className="mb-16 text-center">
              <span className="mb-6 inline-block rounded-full border border-(--fin-on-primary-container) px-3 py-1 text-xs font-semibold uppercase tracking-widest text-(--fin-on-primary-container)">
                {executionStage.badge}
              </span>
              <h2 className="fin-headline-md mb-6 text-[32px] leading-10 text-white">
                {executionStage.title}
              </h2>
              <p className="mx-auto max-w-2xl text-base opacity-80">
                {executionStage.description}
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {executionStage.cards.map((card) => (
                <div
                  key={card.title}
                  className={`rounded-[8px] border border-white/10 bg-(--fin-tertiary-container) p-8 ${hoverLift}`}
                >
                  <span className="material-symbols-outlined mb-4 text-4xl text-(--fin-secondary-container)">
                    {card.icon}
                  </span>
                  <p className="mb-4 text-xl font-semibold leading-7">{card.title}</p>
                  <p className="text-sm opacity-70">{card.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Post-Close Section */}
        <section className="bg-(--fin-surface) py-20">
          <div className="mx-auto max-w-[1440px] px-4 md:px-8">
            <div className="grid items-center gap-16 lg:grid-cols-2">
              <div className="order-2 lg:order-1">
                <div className="grid h-[400px] grid-cols-12 gap-6">
                  <div className="col-span-8 overflow-hidden rounded-[8px] border border-(--fin-outline-variant) bg-white p-6 shadow-sm">
                    <img
                      src={postCloseStage.bento.image.src}
                      alt={postCloseStage.bento.image.alt}
                      className="h-full w-full rounded-[4px] object-cover"
                    />
                  </div>
                  <div className="col-span-4 flex flex-col justify-between rounded-[8px] bg-(--fin-secondary) p-6 text-white">
                    <span className="material-symbols-outlined text-3xl">
                      {postCloseStage.bento.lpCard.icon}
                    </span>
                    <div>
                      <p className="mb-1 text-xl font-semibold leading-7">
                        {postCloseStage.bento.lpCard.title}
                      </p>
                      <p className="text-xs font-semibold tracking-[0.02em] opacity-80">
                        {postCloseStage.bento.lpCard.caption}
                      </p>
                    </div>
                  </div>
                  <div className="col-span-4 rounded-[8px] border border-(--fin-outline-variant) bg-(--fin-surface-container-highest) p-6">
                    <p className="mb-1 text-xs font-semibold tracking-[0.02em] text-(--fin-primary)">
                      {postCloseStage.bento.healthCard.label}
                    </p>
                    <p className="fin-headline-md text-[32px] leading-10 text-(--fin-primary)">
                      {postCloseStage.bento.healthCard.value}
                    </p>
                  </div>
                  <div className="col-span-8 flex items-center gap-4 rounded-[8px] bg-(--fin-tertiary) p-6 text-(--fin-on-tertiary)">
                    <span className="material-symbols-outlined text-(--fin-secondary-fixed)">
                      {postCloseStage.bento.securityCard.icon}
                    </span>
                    <p className="text-sm">{postCloseStage.bento.securityCard.text}</p>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <span className="mb-6 inline-block rounded-full bg-(--fin-primary-container) px-3 py-1 text-xs font-semibold uppercase tracking-widest text-(--fin-on-primary-container)">
                  {postCloseStage.badge}
                </span>
                <h2 className="fin-headline-md mb-6 text-[32px] leading-10 text-(--fin-primary)">
                  {postCloseStage.title}
                </h2>
                <p className="mb-8 text-base text-(--fin-on-surface-variant)">
                  {postCloseStage.description}
                </p>
                <div className="space-y-6">
                  {postCloseStage.features.map((feature) => (
                    <div key={feature.title} className="flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[4px] bg-(--fin-secondary-fixed)">
                        <span className="material-symbols-outlined text-(--fin-primary)">
                          {feature.icon}
                        </span>
                      </div>
                      <div>
                        <p className="text-xl font-semibold leading-7 text-(--fin-primary)">
                          {feature.title}
                        </p>
                        <p className="text-sm text-(--fin-on-surface-variant)">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-y border-(--fin-outline-variant) bg-(--fin-surface-container-highest) py-24">
          <div className="mx-auto max-w-[1440px] px-4 text-center md:px-8">
            <h2 className="fin-headline mx-auto mb-8 max-w-3xl text-[32px] leading-10 text-(--fin-primary) md:text-[48px] md:leading-[56px]">
              {solutionsCta.title}
            </h2>
            <div className="flex flex-col justify-center gap-6 sm:flex-row">
              <Link
                href="/contact"
                className={`rounded-[8px] bg-(--fin-primary) px-10 py-5 text-base font-bold text-(--fin-on-primary) ${hoverLift}`}
              >
                {solutionsCta.primaryCta}
              </Link>
              <button
                className={`rounded-[8px] border border-(--fin-outline) bg-white px-10 py-5 text-base font-bold text-(--fin-primary) ${hoverLift}`}
              >
                {solutionsCta.secondaryCta}
              </button>
            </div>
            <p className="mt-8 text-xs font-semibold uppercase tracking-widest text-(--fin-on-surface-variant)">
              {solutionsCta.trustLine}
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
