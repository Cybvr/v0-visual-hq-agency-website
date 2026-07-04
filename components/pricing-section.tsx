"use client"

import { useState } from "react"
import Link from "next/link"
import { Check } from "lucide-react"
import {
  customDevelopmentRows,
  formatPrice,
  growthPlanRows,
  platformRows,
  retainers,
  type Currency,
  type GrowthPlan,
  type ServiceRow,
} from "@/lib/plans"
import { Button } from "@/components/ui/button"

function ServiceCard({ row, currency }: { row: ServiceRow; currency: Currency }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Offer</p>
        <h3 className="mt-2 text-2xl font-bold">{row.service}</h3>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-bold">{formatPrice(row.price, currency)}</span>
          <span className="text-sm text-muted-foreground">{row.timeline}</span>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">{row.scope}</p>
      </div>

      <div className="border-t border-border pt-5">
        <p className="mb-3 font-semibold">What&apos;s included</p>
        <ul className="space-y-3">
          <li className="flex gap-3">
            <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
            <span className="text-sm text-muted-foreground">{row.included}</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

function GrowthPlanCard({ plan, currency }: { plan: GrowthPlan; currency: Currency }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Growth Plan</p>
        <h3 className="mt-2 text-2xl">{plan.service}</h3>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-bold">{formatPrice(plan.price, currency)}</span>
          <span className="text-sm text-muted-foreground">{plan.timeline}</span>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">{plan.scope}</p>
      </div>

      <ul className="space-y-3 border-t border-border pt-5">
        {plan.features.map((feature) => (
          <li key={feature} className="flex gap-3">
            <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
            <span className="text-sm text-muted-foreground">{feature}</span>
          </li>
        ))}
      </ul>

      {plan.paymentHref && (
        <Button className="mt-6 w-full" asChild>
          <Link href={plan.paymentHref}>Start {plan.service}</Link>
        </Button>
      )}
    </div>
  )
}

export function PricingSection() {
  const [currency, setCurrency] = useState<Currency>("USD")

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

      <section className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">Custom Development</p>
          <h2 className="text-3xl font-bold">Core product builds and scoped delivery</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {customDevelopmentRows.map((row) => (
            <ServiceCard key={row.service} row={row} currency={currency} />
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">Platforms</p>
          <h2 className="text-3xl font-bold">No-code and CMS implementation pricing</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {platformRows.map((row) => (
            <ServiceCard key={row.service} row={row} currency={currency} />
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">Growth Plans</p>
          <h2 className="text-3xl font-bold">Monthly systems for campaigns and conversion</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {growthPlanRows.map((plan) => (
            <GrowthPlanCard key={plan.service} plan={plan} currency={currency} />
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">Retainers</p>
          <h2 className="text-3xl font-bold">Monthly support tiers</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {retainers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-2xl border p-6 ${tier.featured ? "border-accent bg-accent/10 shadow-sm" : "border-border bg-card"}`}
            >
              <div className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {tier.flag || "Retainer"}
                </p>
                <h3 className="mt-2 text-2xl font-bold">{tier.name}</h3>
                <p className="mt-3 text-3xl font-bold">{formatPrice({ amount: tier.amount, suffix: "/mo" }, currency)}</p>
              </div>
              <ul className="space-y-3 border-t border-border pt-5">
                {tier.specs.map((spec) => (
                  <li key={"text" in spec ? spec.text : `${spec.strong}-${spec.rest ?? ""}`} className="flex gap-3">
                    <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
                    <span className="text-sm text-muted-foreground">
                      {"text" in spec ? spec.text : `${spec.strong}${spec.rest ? ` ${spec.rest}` : ""}`}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-6">
        <div>
          <p className="text-lg font-semibold">Need a custom quote?</p>
          <p className="text-sm text-muted-foreground">
            If your build falls outside these standard scopes, start with a discovery call and we&apos;ll scope it properly.
          </p>
        </div>
        <Button asChild>
          <Link href="/contact">Book Discovery Call</Link>
        </Button>
      </div>
    </div>
  )
}
