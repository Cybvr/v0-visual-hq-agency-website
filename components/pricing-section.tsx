"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  customDevelopmentRows,
  formatPrice,
  platformRows,
  retainers,
  type Currency,
} from "@/lib/plans"
import { OfferCard } from "@/components/offer-card"
import { Button } from "@/components/ui/button"

const pricingTabs = [
  {
    id: "technology",
    label: "Technology",
    description: "For businesses that need websites, web apps, platforms, or technical implementation.",
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
      // Workflows used to be a tab here and are now templates on their own
      // page, so old links land where the cards actually live.
      if (hashTab === "workflows") {
        window.location.replace("/templates")
        return
      }
      const nextTab = pricingTabs.find((tab) => tab.id === hashTab)?.id
      if (nextTab) setActiveTab(nextTab)
    }

    syncTabFromHash()
    window.addEventListener("hashchange", syncTabFromHash)
    return () => window.removeEventListener("hashchange", syncTabFromHash)
  }, [])

  return (
    <div className="space-y-14">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[11.5px] font-bold uppercase tracking-[0.05em] text-muted-foreground">Choose currency</p>
        </div>
        <div className="inline-flex rounded-full border border-border bg-muted p-[3px]">
          <button
            type="button"
            className={`rounded-full px-[14px] py-[6px] text-xs font-bold ${
              currency === "USD" ? "bg-accent text-accent-foreground" : "text-muted-foreground"
            }`}
            onClick={() => setCurrency("USD")}
          >
            USD
          </button>
          <button
            type="button"
            className={`rounded-full px-[14px] py-[6px] text-xs font-bold ${
              currency === "NGN" ? "bg-accent text-accent-foreground" : "text-muted-foreground"
            }`}
            onClick={() => setCurrency("NGN")}
          >
            NGN
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-[6px] rounded-[10px] border border-border bg-[#f3f2f0] p-[6px]">
        {pricingTabs.map((tab) => (
          <a
            key={tab.id}
            href={`/pricing#${tab.id}`}
            onClick={(event) => {
              event.preventDefault()
              selectTab(tab.id)
            }}
            className={`rounded-[7px] px-[10px] py-3 text-left text-[11px] font-extrabold uppercase tracking-[0.16em] transition-colors ${
              activeTab === tab.id
                ? "bg-background text-foreground shadow-[0_1px_5px_rgba(0,0,0,0.08)]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="block">{tab.label}</span>
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
                  chips={row.tools}
                  ctaLabel="Get plan"
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
                  chips={row.tools}
                  ctaLabel="Get plan"
                  ctaHref="/contact"
                />
              ))}
            </div>
          </section>
        </div>
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
                  ctaLabel="Get plan"
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
            If your build falls outside these standard scopes, start with a discovery call and we&apos;ll scope it
            properly. Ready-made growth workflows now live on{" "}
            <Link href="/templates" className="underline underline-offset-2">
              templates
            </Link>
            .
          </p>
        </div>
        <Button asChild>
          <Link href="/contact">Book Discovery Call</Link>
        </Button>
      </div>
    </div>
  )
}
