"use client"

import { createElement, useEffect, useState, type ComponentType } from "react"
import Link from "next/link"
import { Check } from "lucide-react"
import type { IconType } from "react-icons"
import {
  FiActivity,
  FiBarChart2,
  FiClock,
  FiCode,
  FiCompass,
  FiEdit3,
  FiGlobe,
  FiImage,
  FiLayers,
  FiMap,
  FiMousePointer,
  FiRepeat,
  FiSend,
  FiServer,
  FiShield,
  FiShoppingCart,
  FiTool,
  FiTrendingUp,
  FiZap,
} from "react-icons/fi"
import {
  customDevelopmentRows,
  formatPrice,
  platformRows,
  retainers,
  workflowPlanRows,
  type Currency,
} from "@/lib/plans"
import { Button } from "@/components/ui/button"

const pricingTabs = [
  {
    id: "technology",
    label: "Technology",
    description: "For businesses that need websites, web apps, platforms, or technical implementation.",
  },
  {
    id: "workflows",
    label: "Workflows",
    description: "For businesses that need their existing tools connected into clear growth systems.",
  },
  {
    id: "consulting",
    label: "Consulting",
    description: "For businesses that need ongoing support, improvements, and technical guidance.",
  },
] as const

const retainerDescriptions: Record<string, string> = {
  Basic: "For businesses that need reliable monthly updates, fixes, and light support.",
  Priority: "For businesses that need faster support, regular check-ins, and priority handling.",
  Growth: "For businesses that need ongoing feature work, strategy, and hands-on improvement.",
}

type PricingTab = (typeof pricingTabs)[number]["id"]

const planIcons: Record<string, IconType> = {
  cart: FiShoppingCart,
  chart: FiBarChart2,
  clock: FiClock,
  code: FiCode,
  compass: FiCompass,
  edit: FiEdit3,
  globe: FiGlobe,
  image: FiImage,
  layers: FiLayers,
  layout: FiMousePointer,
  map: FiMap,
  orbit: FiRepeat,
  pulse: FiActivity,
  rocket: FiSend,
  server: FiServer,
  shield: FiShield,
  tool: FiTool,
  trending: FiTrendingUp,
  zap: FiZap,
}

function toSentenceCase(value: string) {
  const trimmed = value.trim().replace(/^and /, "")
  return trimmed ? `${trimmed.charAt(0).toUpperCase()}${trimmed.slice(1)}` : trimmed
}

type OfferCardProps = {
  eyebrow: string
  badge?: string
  featured?: boolean
  title: string
  icon?: string
  price: string
  timeline: string
  description?: string
  features: string[]
  chips?: string[]
  ctaLabel: string
  ctaHref: string
}

function OfferCard({
  eyebrow,
  badge,
  featured,
  title,
  icon,
  price,
  timeline,
  description,
  features,
  chips,
  ctaLabel,
  ctaHref,
}: OfferCardProps) {
  const Icon = icon ? (planIcons[icon] as ComponentType<{ className?: string }>) : undefined

  return (
    <div
      className={`group flex h-full flex-col rounded-2xl border p-6 transition-colors ${
        featured ? "border-accent bg-accent/10 shadow-sm" : "border-border bg-card hover:border-accent/50"
      }`}
    >
      <div className="flex-1">
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{eyebrow}</p>
          {badge ? (
            <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
              {badge}
            </span>
          ) : (
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              {timeline}
            </span>
          )}
        </div>

        <div className="mt-4 flex items-center gap-3">
          {Icon && (
            <span className="flex size-11 items-center justify-center rounded-full bg-accent/10 text-accent">
              {createElement(Icon, { className: "size-5" })}
            </span>
          )}
          <h3 className="text-2xl font-bold">{title}</h3>
        </div>

        {description && <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>}

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-bold">{price}</span>
          {badge && <span className="text-sm text-muted-foreground">{timeline}</span>}
        </div>

        {chips && chips.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {chips.map((chip) => (
              <span key={chip} className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                {chip}
              </span>
            ))}
          </div>
        )}

        <div className="mt-6 border-t border-border pt-5">
          <p className="mb-3 font-semibold">What&apos;s included</p>
          <ul className="space-y-3">
            {features.map((feature) => (
              <li key={feature} className="flex gap-3">
                <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
                <span className="text-sm text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Button asChild className="mt-6 w-full" variant={featured ? "default" : "outline"}>
        <Link href={ctaHref}>{ctaLabel}</Link>
      </Button>
    </div>
  )
}

export function PricingSection() {
  const [currency, setCurrency] = useState<Currency>("USD")
  const [activeTab, setActiveTab] = useState<PricingTab>("technology")
  const activeTabContent = pricingTabs.find((tab) => tab.id === activeTab) ?? pricingTabs[0]

  function selectTab(tab: PricingTab) {
    setActiveTab(tab)
    window.history.pushState(null, "", `/pricing#${tab}`)
  }

  useEffect(() => {
    function syncTabFromHash() {
      const hashTab = window.location.hash.replace("#", "")
      const nextTab = pricingTabs.find((tab) => tab.id === hashTab)?.id
      if (nextTab) setActiveTab(nextTab)
    }

    syncTabFromHash()
    window.addEventListener("hashchange", syncTabFromHash)
    return () => window.removeEventListener("hashchange", syncTabFromHash)
  }, [])

  return (
    <div className="space-y-14">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card px-5 py-4">
        <div>
          <p className="text-sm font-semibold">Choose currency</p>
          <p className="text-sm text-muted-foreground">View pricing in USD or Nigerian naira.</p>
        </div>
        <div className="inline-flex rounded-full border border-border bg-muted p-1">
          <button
            type="button"
            className={`rounded-full px-4 py-2 text-sm font-semibold ${currency === "USD" ? "bg-accent text-accent-foreground" : "text-muted-foreground"}`}
            onClick={() => setCurrency("USD")}
          >
            USD
          </button>
          <button
            type="button"
            className={`rounded-full px-4 py-2 text-sm font-semibold ${currency === "NGN" ? "bg-accent text-accent-foreground" : "text-muted-foreground"}`}
            onClick={() => setCurrency("NGN")}
          >
            NGN
          </button>
        </div>
      </div>

      <div className="sticky top-[92px] z-40 grid gap-2 rounded-2xl border border-border bg-card/95 p-1.5 shadow-sm backdrop-blur md:top-[88px] md:grid-cols-3">
        {pricingTabs.map((tab) => (
          <a
            key={tab.id}
            href={`/pricing#${tab.id}`}
            onClick={(event) => {
              event.preventDefault()
              selectTab(tab.id)
            }}
            className={`rounded-xl px-4 py-3 text-left transition-colors md:py-3 ${
              activeTab === tab.id ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-accent"
            }`}
          >
            <span className="block text-sm font-semibold uppercase tracking-[0.18em]">{tab.label}</span>
          </a>
        ))}
      </div>

      <div className="space-y-5">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {activeTabContent.label}
          </p>
          <h2 className="mt-2 text-3xl font-normal">
            {activeTab === "technology" && (
              <>
                Build the <span className="text-accent">product and platform</span> layer.
              </>
            )}
            {activeTab === "workflows" && (
              <>
                Connect existing tools into <span className="text-accent">growth workflows</span>.
              </>
            )}
            {activeTab === "consulting" && (
              <>
                Keep systems moving with <span className="text-accent">support and advisory</span>.
              </>
            )}
          </h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">{activeTabContent.description}</p>
        </div>
      </div>

      {activeTab === "technology" && (
        <div className="space-y-14">
          <section className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {customDevelopmentRows.map((row) => (
                <OfferCard
                  key={row.service}
                  eyebrow={row.price === "free" ? "Free" : "Offer"}
                  title={row.service}
                  icon={row.icon}
                  price={formatPrice(row.price, currency)}
                  timeline={row.timeline}
                  description={row.scope}
                  features={[row.included]}
                  ctaLabel={row.price === "free" ? "Book a call" : "Get started"}
                  ctaHref="/contact"
                />
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">Platforms</p>
              <h3 className="text-2xl font-normal">No-code and CMS implementation pricing</h3>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {platformRows.map((row) => (
                <OfferCard
                  key={row.service}
                  eyebrow={row.price === "free" ? "Free" : "Offer"}
                  title={row.service}
                  icon={row.icon}
                  price={formatPrice(row.price, currency)}
                  timeline={row.timeline}
                  description={row.scope}
                  features={[row.included]}
                  ctaLabel="Get started"
                  ctaHref="/contact"
                />
              ))}
            </div>
          </section>
        </div>
      )}

      {activeTab === "workflows" && (
        <section className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {workflowPlanRows.map((plan) => (
              <OfferCard
                key={plan.service}
                eyebrow="Workflow"
                title={plan.service}
                icon={plan.icon}
                price={formatPrice(plan.price, currency)}
                timeline={plan.timeline}
                description={plan.outcome}
                features={plan.included.split(", ").map(toSentenceCase)}
                chips={plan.tools}
                ctaLabel="Get started"
                ctaHref="/contact"
              />
            ))}
          </div>
        </section>
      )}

      {activeTab === "consulting" && (
        <div className="space-y-14">
          <section className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {retainers.map((tier) => (
                <OfferCard
                  key={tier.name}
                  eyebrow="Retainer"
                  badge={tier.flag || undefined}
                  featured={tier.featured}
                  title={tier.name}
                  icon={tier.icon}
                  price={formatPrice({ amount: tier.amount, suffix: "/mo" }, currency)}
                  timeline="Monthly"
                  description={retainerDescriptions[tier.name]}
                  features={tier.specs.map((spec) =>
                    "text" in spec ? spec.text : `${spec.strong}${spec.rest ? ` ${spec.rest}` : ""}`,
                  )}
                  ctaLabel="Get started"
                  ctaHref="/contact"
                />
              ))}
            </div>
          </section>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-6">
        <div>
          <p className="text-lg font-semibold">Need a custom quote?</p>
          <p className="text-sm text-muted-foreground">
            If your build or workflow falls outside these standard scopes, start with a discovery call and we&apos;ll scope it properly.
          </p>
        </div>
        <Button asChild>
          <Link href="/contact">Book Discovery Call</Link>
        </Button>
      </div>
    </div>
  )
}
