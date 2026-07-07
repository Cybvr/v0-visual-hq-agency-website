import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import {
  caseStudiesHero,
  featuredCaseStudy,
  darkCaseStudy,
  horizontalCaseStudies,
  caseStudyTestimonial,
} from "@/lib/finance/case-studies"

export const metadata: Metadata = {
  title: "Case Studies | Visualcns Finance",
  description: caseStudiesHero.description,
}

export default function FinanceCaseStudiesPage() {
  return (
    <div className="overflow-x-hidden bg-(--fin-surface) text-sm text-(--fin-on-surface)">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden pb-20 pt-32">
        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
          <div className="max-w-3xl">
            <span className="mb-4 block text-xs font-semibold uppercase tracking-widest text-(--fin-secondary)">
              {caseStudiesHero.eyebrow}
            </span>
            <h1 className="fin-headline mb-6 text-[32px] leading-10 text-(--fin-primary) md:text-[48px] md:leading-[56px]">
              {caseStudiesHero.title}
            </h1>
            <p className="max-w-2xl text-base text-(--fin-on-surface-variant)">
              {caseStudiesHero.description}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content: Bento Case Study Grid */}
      <main className="mx-auto max-w-[1440px] px-4 pb-24 md:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          {/* Case Study 1: Large Featured */}
          <div className="group overflow-hidden rounded-[8px] border border-(--fin-outline-variant) bg-white transition-all duration-500 hover:shadow-xl md:col-span-8">
            <div className="flex h-full flex-col md:flex-row">
              <div className="flex flex-col justify-between p-8 md:w-1/2">
                <div>
                  <div className="mb-8 flex h-8 w-32 items-center justify-center overflow-hidden rounded-[4px] bg-(--fin-surface-container)">
                    <img
                      src={featuredCaseStudy.logo.src}
                      alt={featuredCaseStudy.logo.alt}
                      className="h-6 opacity-70 grayscale"
                    />
                  </div>
                  <h2 className="fin-headline-md mb-4 text-[32px] leading-10 text-(--fin-primary)">
                    {featuredCaseStudy.title}
                  </h2>
                  <p className="mb-6 leading-relaxed text-(--fin-on-surface-variant)">
                    {featuredCaseStudy.description}
                  </p>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    {featuredCaseStudy.stats.map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-[2px] border border-(--fin-outline-variant)/50 bg-(--fin-surface) p-4"
                      >
                        <div className="fin-tabular text-lg font-bold text-(--fin-secondary)">
                          {stat.value}
                        </div>
                        <div className="text-xs font-semibold tracking-[0.02em] text-(--fin-on-surface-variant)">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="group/link inline-flex items-center self-start font-bold text-(--fin-primary) hover:underline">
                    {featuredCaseStudy.ctaLabel}
                    <span className="material-symbols-outlined ml-2 transition-transform group-hover/link:translate-x-1">
                      arrow_forward
                    </span>
                  </button>
                </div>
              </div>
              <div className="relative min-h-[300px] md:w-1/2">
                <img
                  src={featuredCaseStudy.image.src}
                  alt={featuredCaseStudy.image.alt}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 hidden bg-gradient-to-r from-white via-transparent to-transparent md:block"></div>
              </div>
            </div>
          </div>

          {/* Case Study 2: Vertical Small */}
          <div className="group flex flex-col justify-between rounded-[8px] bg-(--fin-primary-container) p-8 text-(--fin-on-primary-container) transition-all duration-500 hover:shadow-xl md:col-span-4">
            <div>
              <div className="mb-8 flex h-8 w-24 items-center">
                <span className="text-xl font-bold italic tracking-tighter text-(--fin-on-primary-container) opacity-60">
                  {darkCaseStudy.wordmark}
                </span>
              </div>
              <h2 className="fin-headline-md mb-4 text-[32px] leading-10 text-(--fin-on-primary)">
                {darkCaseStudy.title}
              </h2>
              <p className="mb-6 leading-relaxed text-(--fin-on-primary-fixed-variant)">
                {darkCaseStudy.description}
              </p>
            </div>
            <div>
              <div className="mb-6 rounded-[4px] border border-(--fin-on-primary)/10 bg-(--fin-primary)/30 p-6">
                <div className="fin-headline-md fin-tabular mb-1 text-3xl text-(--fin-on-primary)">
                  {darkCaseStudy.stat.value}
                </div>
                <div className="text-xs font-semibold tracking-[0.02em] text-(--fin-on-primary-container)">
                  {darkCaseStudy.stat.label}
                </div>
              </div>
              <button className="group/link inline-flex items-center font-bold text-(--fin-on-primary) hover:underline">
                {darkCaseStudy.ctaLabel}
                <span className="material-symbols-outlined ml-2 transition-transform group-hover/link:translate-x-1">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>

          {/* Case Studies 3 & 4: Horizontal Small */}
          {horizontalCaseStudies.map((study) => (
            <div
              key={study.title}
              className="group flex flex-col gap-8 rounded-[8px] border border-(--fin-outline-variant) bg-white p-8 transition-all duration-500 hover:shadow-xl md:col-span-6 md:flex-row"
            >
              <div className="relative h-48 shrink-0 overflow-hidden rounded-[4px] md:h-auto md:w-1/3">
                <img
                  src={study.image.src}
                  alt={study.image.alt}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-col justify-between">
                <div>
                  <div className="mb-2 text-xs font-semibold tracking-[0.02em] text-(--fin-secondary)">
                    {study.category}
                  </div>
                  <h2 className="fin-headline-md mb-4 text-[32px] leading-10 text-(--fin-primary)">
                    {study.title}
                  </h2>
                  <p className="mb-6 text-(--fin-on-surface-variant)">{study.description}</p>
                </div>
                <button className="group/link inline-flex items-center self-start font-bold text-(--fin-primary) hover:underline">
                  {study.ctaLabel}
                  <span className="material-symbols-outlined ml-2 transition-transform group-hover/link:translate-x-1">
                    arrow_forward
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Testimonial Section */}
      <section className="bg-(--fin-surface-container) py-24">
        <div className="mx-auto max-w-[1440px] px-4 text-center md:px-8">
          <div className="mx-auto max-w-2xl">
            <span className="material-symbols-outlined fin-icon-fill mb-6 text-5xl text-(--fin-primary)">
              format_quote
            </span>
            <p className="fin-headline-md mb-8 text-[32px] italic leading-10 text-(--fin-primary)">
              &ldquo;{caseStudyTestimonial.quote}&rdquo;
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-white shadow-sm">
                <img
                  src={caseStudyTestimonial.avatar.src}
                  alt={caseStudyTestimonial.avatar.alt}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="text-left">
                <div className="font-bold text-(--fin-primary)">{caseStudyTestimonial.name}</div>
                <div className="text-xs font-semibold tracking-[0.02em] text-(--fin-on-surface-variant)">
                  {caseStudyTestimonial.role}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
