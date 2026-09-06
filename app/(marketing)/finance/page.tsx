import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import {
  landingHero,
  partnerLogos,
  pipelineStats,
  portfolioHealthCard,
  ecosystemIntro,
  ecosystemFeatures,
  qofePreviewRows,
  ecosystemWideFeatures,
  documentLensSection,
  finalCtaSection,
  type EcosystemFeature,
  type PartnerLogo,
  type PipelineStat,
} from "@/lib/finance/landing"
import { cn } from "@/lib/utils"

function PartnerMark({ logo }: { logo: PartnerLogo }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2",
        logo.mark === "wordmark" && "border-l border-(--fin-outline-variant) pl-4",
      )}
    >
      {logo.mark === "square" && <div className="h-6 w-6 rounded-[2px] bg-(--fin-primary)" />}
      {logo.mark === "pill" && <div className="h-4 w-8 rounded-full bg-(--fin-primary)" />}
      {logo.mark === "diamond" && <div className="h-5 w-5 rotate-45 bg-(--fin-primary)" />}
      <span className={cn("text-lg font-bold tracking-tighter", logo.mark === "wordmark" && "italic")}>
        {logo.name}
      </span>
    </div>
  )
}

const pipelineStatStyles: Record<PipelineStat["variant"], { card: string; label: string; value: string }> = {
  neutral: {
    card: "border-(--fin-outline-variant) bg-(--fin-surface-container-low)",
    label: "text-(--fin-on-surface-variant)",
    value: "text-(--fin-primary)",
  },
  primary: {
    card: "border-(--fin-primary)/20 bg-(--fin-primary-container)",
    label: "text-(--fin-on-primary-container)",
    value: "text-(--fin-on-primary-container)",
  },
  secondary: {
    card: "border-(--fin-secondary)/20 bg-(--fin-secondary-container)",
    label: "text-(--fin-on-secondary-container)",
    value: "text-(--fin-on-secondary-container)",
  },
}

function FeaturePreview({ id }: { id: EcosystemFeature["id"] }) {
  if (id === "sourcing") {
    return (
      <div className="h-32 overflow-hidden rounded-[4px] border border-(--fin-outline-variant)/50 bg-white p-3">
        <div className="mb-2 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-blue-500" />
          <div className="h-2 w-20 rounded-[2px] bg-(--fin-surface-container)" />
        </div>
        <div className="mb-2 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-yellow-500" />
          <div className="h-2 w-32 rounded-[2px] bg-(--fin-surface-container)" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          <div className="h-2 w-24 rounded-[2px] bg-(--fin-surface-container)" />
        </div>
      </div>
    )
  }
  if (id === "qofe") {
    return (
      <div className="flex h-32 flex-col justify-center gap-2 rounded-[4px] border border-white/20 bg-white/10 p-3">
        {qofePreviewRows.map((row, index) => (
          <div
            key={row.label}
            className={cn(
              "flex items-center justify-between",
              index < qofePreviewRows.length - 1 ? "border-b border-white/10 pb-2" : "pt-1",
            )}
          >
            <span className="text-[10px] text-white/70">{row.label}</span>
            <span
              className={cn(
                "text-sm font-bold",
                row.tone === "positive" ? "text-(--fin-secondary-fixed)" : "text-(--fin-error)",
              )}
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>
    )
  }
  return (
    <div className="h-32 rounded-[4px] border border-(--fin-outline-variant)/50 bg-white p-3">
      <div className="flex h-full items-end justify-between gap-2 px-2">
        <div className="h-1/2 w-full rounded-t-[2px] bg-(--fin-surface-container-high)" />
        <div className="h-2/3 w-full rounded-t-[2px] bg-(--fin-surface-container-high)" />
        <div className="h-3/4 w-full rounded-t-[2px] bg-(--fin-primary-container)/40" />
        <div className="h-full w-full rounded-t-[2px] bg-(--fin-primary-container)" />
      </div>
    </div>
  )
}

export default function FinanceLandingPage() {
  return (
    <div className="overflow-x-hidden bg-(--fin-background) text-sm text-(--fin-on-surface)">
      <Header />

      {/* Hero */}
      <section className="fin-hero-gradient relative flex min-h-[850px] items-center overflow-hidden pt-32">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-12 px-4 md:px-8 lg:grid-cols-2">
          <div className="z-10">
            <span className="mb-6 inline-block rounded-full bg-(--fin-primary-fixed) px-3 py-1 text-xs font-semibold tracking-[0.02em] text-(--fin-on-primary-fixed)">
              {landingHero.badge}
            </span>
            <h1 className="fin-headline mb-6 text-[32px] leading-10 text-(--fin-primary) lg:text-[48px] lg:leading-[56px]">
              {landingHero.titleLead} <br />
              <span className="italic text-(--fin-secondary)">{landingHero.titleEmphasis}</span>
            </h1>
            <p className="mb-10 max-w-xl text-base text-(--fin-on-surface-variant)">{landingHero.description}</p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/contact"
                className="flex items-center justify-center gap-2 rounded-[4px] bg-(--fin-primary) px-8 py-4 text-lg font-semibold tracking-[0.02em] text-(--fin-on-primary) shadow-md transition-all hover:opacity-90"
              >
                {landingHero.primaryCta} <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
              <Link
                href="/finance/solutions"
                className="rounded-[4px] border border-(--fin-outline) px-8 py-4 text-center text-lg font-semibold tracking-[0.02em] text-(--fin-primary) transition-all hover:bg-white"
              >
                {landingHero.secondaryCta}
              </Link>
            </div>
            <div className="mt-16 border-t border-(--fin-outline-variant)/30 pt-8">
              <span className="mb-6 block text-[10px] font-semibold uppercase tracking-widest text-(--fin-on-surface-variant)/60">
                {landingHero.partnersLabel}
              </span>
              <div className="flex flex-wrap items-center gap-x-12 gap-y-6 opacity-40 grayscale contrast-125">
                {partnerLogos.map((logo) => (
                  <PartnerMark key={logo.name} logo={logo} />
                ))}
              </div>
            </div>
          </div>
          <div className="relative flex items-center justify-center lg:h-[600px]">
            {/* Platform dashboard preview */}
            <div className="relative h-full w-full p-4">
              <div className="fin-glass-card absolute right-0 top-0 z-20 w-[90%] rounded-[8px] border-(--fin-primary)/10 p-6 shadow-2xl">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-[4px] bg-(--fin-primary-container)">
                      <span className="material-symbols-outlined text-sm text-(--fin-on-primary-container)">
                        dashboard
                      </span>
                    </div>
                    <p className="text-xl font-semibold leading-7 text-(--fin-primary)">Executive Deal Pipeline</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-2 w-12 rounded-full bg-green-500/20" />
                    <div className="h-2 w-8 rounded-full bg-(--fin-surface-container-highest)" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-4">
                    {pipelineStats.map((stat) => {
                      const styles = pipelineStatStyles[stat.variant]
                      return (
                        <div
                          key={stat.label}
                          className={cn("flex h-24 flex-col justify-between rounded-[4px] border p-3", styles.card)}
                        >
                          <span className={cn("text-[10px] font-bold uppercase", styles.label)}>{stat.label}</span>
                          <span className={cn("fin-tabular text-xl font-bold", styles.value)}>{stat.value}</span>
                        </div>
                      )
                    })}
                  </div>
                  <div className="relative h-32 overflow-hidden rounded-[4px] border border-(--fin-outline-variant) bg-white p-4">
                    <div className="mb-4 flex justify-between">
                      <div className="h-3 w-1/3 rounded-[2px] bg-(--fin-surface-container-highest)" />
                      <div className="h-3 w-16 rounded-[2px] bg-(--fin-surface-container-low)" />
                    </div>
                    <div className="flex h-12 items-end gap-1">
                      <div className="h-[40%] w-full rounded-t-[2px] bg-(--fin-primary)/10" />
                      <div className="h-[60%] w-full rounded-t-[2px] bg-(--fin-primary)/20" />
                      <div className="h-[50%] w-full rounded-t-[2px] bg-(--fin-primary)/30" />
                      <div className="h-[80%] w-full rounded-t-[2px] bg-(--fin-primary)/50" />
                      <div className="h-[90%] w-full rounded-t-[2px] bg-(--fin-primary)/70" />
                      <div className="h-[75%] w-full rounded-t-[2px] bg-(--fin-primary)" />
                    </div>
                  </div>
                </div>
              </div>
              {/* Overlapping sub-component */}
              <div className="absolute -bottom-4 -left-4 z-30 w-[60%] -rotate-1 transform rounded-[8px] border border-(--fin-outline-variant) bg-white p-5 shadow-xl">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg text-(--fin-secondary)">insights</span>
                    <span className="text-xs font-bold uppercase tracking-[0.02em] text-(--fin-primary)">
                      {portfolioHealthCard.label}
                    </span>
                  </div>
                  <span className="rounded-[2px] border border-green-200 bg-green-50 px-1.5 py-0.5 text-[10px] font-bold text-green-700">
                    {portfolioHealthCard.status}
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="h-2 w-20 rounded-[2px] bg-(--fin-surface-container)" />
                    <div className="h-2 w-12 rounded-[2px] bg-(--fin-secondary)" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="h-2 w-24 rounded-[2px] bg-(--fin-surface-container)" />
                    <div className="h-2 w-8 rounded-[2px] bg-(--fin-secondary)/60" />
                  </div>
                  <div className="my-2 h-px w-full bg-(--fin-outline-variant)" />
                  <div className="text-[10px] italic text-(--fin-on-surface-variant)">{portfolioHealthCard.note}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform ecosystem */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
          <div className="mb-20 text-center">
            <h2 className="fin-headline-md mb-4 text-[32px] leading-10 text-(--fin-primary)">
              {ecosystemIntro.heading}
            </h2>
            <p className="mx-auto max-w-2xl text-sm text-(--fin-on-surface-variant)">{ecosystemIntro.description}</p>
          </div>
          <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {ecosystemFeatures.map((feature) => (
              <div
                key={feature.id}
                className={cn(
                  "group rounded-[8px] p-8",
                  feature.core
                    ? "relative z-10 scale-105 border border-(--fin-primary) bg-(--fin-primary) text-(--fin-on-primary) shadow-xl"
                    : "border border-(--fin-outline-variant) bg-(--fin-surface) transition-all hover:border-(--fin-primary) hover:shadow-lg",
                )}
              >
                <div
                  className={cn(
                    "mb-6 flex h-12 w-12 items-center justify-center rounded-[2px] transition-transform group-hover:scale-110",
                    feature.id === "sourcing" && "bg-(--fin-primary-container) text-(--fin-on-primary-container)",
                    feature.id === "qofe" && "bg-(--fin-secondary) text-(--fin-on-secondary)",
                    feature.id === "modeling" && "bg-(--fin-on-tertiary-fixed) text-white",
                  )}
                >
                  <span className="material-symbols-outlined">{feature.icon}</span>
                </div>
                <p
                  className={cn(
                    "mb-3 text-xl font-semibold leading-7",
                    feature.core ? "text-white" : "text-(--fin-primary)",
                  )}
                >
                  {feature.title}
                </p>
                <p
                  className={cn(
                    "mb-6 text-sm leading-relaxed",
                    feature.core ? "text-(--fin-secondary-fixed) opacity-90" : "text-(--fin-on-surface-variant)",
                  )}
                >
                  {feature.description}
                </p>
                <FeaturePreview id={feature.id} />
                {feature.badge ? (
                  <div className="absolute -top-3 right-6 rounded-full bg-(--fin-secondary) px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                    {feature.badge}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {ecosystemWideFeatures.map((feature) => (
              <div
                key={feature.title}
                className="group flex flex-col items-center gap-8 rounded-[8px] border border-(--fin-outline-variant) bg-(--fin-surface) p-8 transition-all hover:border-(--fin-primary) hover:shadow-lg md:flex-row"
              >
                <div className="md:w-1/2">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-[2px] bg-(--fin-surface-container-highest) text-(--fin-primary) transition-transform group-hover:scale-110">
                    <span className="material-symbols-outlined">{feature.icon}</span>
                  </div>
                  <p className="mb-3 text-xl font-semibold leading-7 text-(--fin-primary)">{feature.title}</p>
                  <p className="text-sm text-(--fin-on-surface-variant)">{feature.description}</p>
                </div>
                <div className="w-full md:w-1/2">
                  {feature.image ? (
                    <img
                      className="h-40 w-full rounded-[4px] border border-(--fin-outline-variant)/40 object-cover shadow-sm"
                      src={feature.image.src}
                      alt={feature.image.alt}
                    />
                  ) : (
                    <div className="flex h-40 flex-col justify-between rounded-[4px] border border-(--fin-outline-variant)/40 bg-white p-4">
                      <div className="h-4 w-full rounded-[2px] bg-(--fin-surface-container-low)" />
                      <div className="h-4 w-3/4 rounded-[2px] bg-(--fin-surface-container-low)" />
                      <div className="flex h-20 w-full items-center justify-center rounded-[2px] border-2 border-dashed border-(--fin-primary-container)/20 bg-(--fin-primary-container)/10">
                        <span className="material-symbols-outlined text-(--fin-primary-container)/40">
                          picture_as_pdf
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Document Lens */}
      <section className="overflow-hidden border-y border-(--fin-outline-variant) bg-(--fin-surface-container-low) py-24">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-16 px-4 md:px-8 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <div className="fin-glass-card relative rounded-[8px] p-2 shadow-2xl">
              <img
                className="h-[400px] w-full rounded-[4px] object-cover"
                src={documentLensSection.image.src}
                alt={documentLensSection.image.alt}
              />
              <div className="absolute right-[-20px] top-1/4 w-48 animate-pulse rounded-[2px] border border-(--fin-primary) bg-white p-4 shadow-lg">
                <p className="mb-1 text-[10px] font-bold uppercase text-(--fin-primary)">
                  {documentLensSection.callout.label}
                </p>
                <p className="text-sm font-semibold">{documentLensSection.callout.title}</p>
                <p className="fin-tabular text-xs text-(--fin-on-surface-variant)">
                  {documentLensSection.callout.amount}
                </p>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="fin-headline-md mb-6 text-[32px] leading-10 text-(--fin-primary)">
              {documentLensSection.heading}
            </h2>
            <p className="mb-8 text-base text-(--fin-on-surface-variant)">{documentLensSection.description}</p>
            <ul className="space-y-4">
              {documentLensSection.bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3">
                  <span className="material-symbols-outlined fin-icon-fill text-(--fin-secondary)">check_circle</span>
                  <span className="text-sm text-(--fin-on-surface)">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-(--fin-primary) py-24 text-(--fin-on-primary)">
        <div className="relative z-10 mx-auto max-w-[1440px] px-4 text-center md:px-8">
          <h2 className="fin-headline mb-8 text-[32px] leading-10 lg:text-[48px] lg:leading-[56px]">
            {finalCtaSection.heading}
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-base text-(--fin-secondary-fixed) opacity-90">
            {finalCtaSection.description}
          </p>
          <div className="flex flex-col justify-center gap-6 sm:flex-row">
            <Link
              href="/contact"
              className="rounded-[4px] bg-(--fin-secondary-container) px-10 py-5 text-lg font-semibold tracking-[0.02em] text-(--fin-on-secondary-container) transition-all hover:brightness-110"
            >
              {finalCtaSection.primaryCta}
            </Link>
            <Link
              href="/contact"
              className="rounded-[4px] border border-(--fin-outline-variant) px-10 py-5 text-lg font-semibold tracking-[0.02em] text-(--fin-on-primary) transition-all hover:bg-white/10"
            >
              {finalCtaSection.secondaryCta}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
