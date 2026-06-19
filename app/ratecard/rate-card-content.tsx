"use client"

import { useState } from "react"
import { CircleAlert, Globe, Mail, MapPin } from "lucide-react"
import { Footer } from "@/components/footer"

type Currency = "NGN" | "USD"

// Approx. mid-market rate as of June 2026; conversions are rounded for readability.
const NGN_PER_USD = 1360

type Price = "free" | { amount: number; prefix?: string; suffix?: string }

type ServiceRow = {
  service: string
  scope: string
  price: Price
  timeline: string
  included: string
}

type TierSpec = { text: string } | { strong: string; rest?: string }

const customDevelopmentRows: ServiceRow[] = [
  {
    service: "Discovery & Scoping",
    scope: "Fit, scope & build roadmap",
    price: "free",
    timeline: "45 min",
    included: "Fixed quote after call",
  },
  {
    service: "MVP Web App",
    scope: "Up to 5 screens · 1 user role · frontend only",
    price: { amount: 650000 },
    timeline: "1 week",
    included: "Static frontend (no auth, DB or backend)",
  },
  {
    service: "Full Web App",
    scope: "Up to 12 screens · 2–3 roles · auth, DB, integrations",
    price: { amount: 1200000 },
    timeline: "2 weeks",
    included: "Frontend + backend + auth + DB + API integrations",
  },
  {
    service: "Custom Web App",
    scope: "Marketplaces, streaming, real-time, payments",
    price: { amount: 2500000, prefix: "From " },
    timeline: "4+ weeks",
    included: "Scoped per project",
  },
  {
    service: "Add-on: Backend/API",
    scope: "Extends an existing build",
    price: { amount: 400000 },
    timeline: "3–5 days",
    included: "Auth, DB, endpoints",
  },
  {
    service: "Maintenance Retainer",
    scope: "Live site upkeep · Basic / Priority / Growth tiers",
    price: { amount: 300000, prefix: "From ", suffix: "/mo" },
    timeline: "Ongoing",
    included: "Updates, fixes & priority support",
  },
  {
    service: "Additional / Out-of-scope",
    scope: "Extra revisions & work beyond agreed scope",
    price: { amount: 15000, suffix: "/hr" },
    timeline: "As needed",
    included: "Billed hourly",
  },
]

const platformRows: ServiceRow[] = [
  {
    service: "Webflow Site",
    scope: "Up to 7 pages · CMS · responsive",
    price: { amount: 700000 },
    timeline: "3–5 days",
    included: "Design, build, CMS setup & launch",
  },
  {
    service: "Framer Site",
    scope: "Up to 7 pages · interactive & animated",
    price: { amount: 600000 },
    timeline: "2–4 days",
    included: "Design, animations & publish",
  },
  {
    service: "WordPress Site",
    scope: "Up to 7 pages · blog · custom theme",
    price: { amount: 600000 },
    timeline: "3–5 days",
    included: "Theme, plugins, SEO basics & launch",
  },
  {
    service: "Add-on: WooCommerce",
    scope: "E-commerce layer on WordPress",
    price: { amount: 300000, prefix: "+" },
    timeline: "+2–3 days",
    included: "Product catalogue, cart & checkout",
  },
]

const retainers: Array<{
  flag: string
  name: string
  amount: number
  featured?: boolean
  specs: TierSpec[]
}> = [
  {
    flag: " ",
    name: "Basic",
    amount: 300000,
    specs: [
      { strong: "5 hrs", rest: "of work / month" },
      { strong: "48-hour", rest: "response time" },
      { text: "Updates, patches & bug fixes" },
      { text: "Email support" },
    ],
  },
  {
    flag: "Most popular",
    name: "Priority",
    amount: 500000,
    featured: true,
    specs: [
      { strong: "12 hrs", rest: "of work / month" },
      { strong: "24-hour", rest: "response time" },
      { text: "Everything in Basic" },
      { text: "Priority queue & monthly check-in" },
    ],
  },
  {
    flag: " ",
    name: "Growth",
    amount: 800000,
    specs: [
      { strong: "25 hrs", rest: "of work / month" },
      { strong: "Same-day", rest: "response time" },
      { text: "Everything in Priority" },
      { text: "Feature development & monthly strategy call" },
    ],
  },
]

const terms = [
  {
    title: "Payment",
    items: [
      "50% deposit to start — non-refundable",
      "Balance due on delivery, before final handover",
      "Late payments accrue 5% per month",
      "Prices exclusive of VAT & third-party costs",
    ],
  },
  {
    title: "Scope & Revisions",
    items: [
      "2 revision rounds included per project",
      "Extra revisions & out-of-scope work billed hourly",
      "Rush delivery +30%",
      "Client-caused delays extend the timeline",
    ],
  },
  {
    title: "Ownership & Delivery",
    items: [
      "Full IP & source transfer on final payment",
      "Hosting, domains & licenses billed separately",
      "14-day post-launch bug-fix warranty",
      "Ongoing upkeep via maintenance retainer",
    ],
  },
]

function ngnToUsd(amount: number) {
  const raw = amount / NGN_PER_USD
  const roundTo = raw < 50 ? 1 : 10
  return Math.round(raw / roundTo) * roundTo
}

function formatPrice(price: Price, currency: Currency) {
  if (price === "free") return "Free"
  const { amount, prefix = "", suffix = "" } = price
  if (currency === "USD") {
    return `${prefix}$${ngnToUsd(amount).toLocaleString("en-US")}${suffix}`
  }
  return `${prefix}₦${amount.toLocaleString("en-NG")}${suffix}`
}

function RateTable({
  headers,
  rows,
  currency,
}: {
  headers: [string, string, string, string, string]
  rows: ServiceRow[]
  currency: Currency
}) {
  return (
    <div className="rate-table-wrap">
      <table>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.service}>
              <td>{row.service}</td>
              <td>{row.scope}</td>
              <td>{formatPrice(row.price, currency)}</td>
              <td>{row.timeline}</td>
              <td>{row.included}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function TierSpecItem({ spec }: { spec: TierSpec }) {
  if ("text" in spec) return <>{spec.text}</>

  return (
    <>
      <strong>{spec.strong}</strong>
      {spec.rest ? ` ${spec.rest}` : ""}
    </>
  )
}

export function RateCardContent() {
  const [currency, setCurrency] = useState<Currency>("NGN")
  const currencySymbol = currency === "USD" ? "$" : "₦"

  return (
    <>
      <style>{`
        .ratecard-page {
          --blue: #1644c8;
          --text: #111214;
          --muted: #555;
          --rule: #d8dce8;
          --table-border: #d4d8e4;
          --table-head-bg: #f2f4f9;
          background: #eeecea;
          min-height: 100vh;
          padding: 48px 20px 64px;
          color: var(--text);
          font-family: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
        }

        .ratecard-page * {
          box-sizing: border-box;
        }

        .ratecard-page .page {
          max-width: 816px;
          margin: 0 auto;
          background: #fff;
          border-radius: 3px;
          box-shadow: 0 2px 16px rgba(0, 0, 0, 0.09);
          padding: 52px 64px 56px;
        }

        .ratecard-page .header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 28px;
        }

        .ratecard-page .brand-lockup {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 10px;
        }

        .ratecard-page .brand-logo {
          height: 44px;
          width: auto;
        }

        .ratecard-page .brand-tagline {
          font-size: 13.5px;
          font-weight: 400;
          color: #444;
        }

        .ratecard-page .doc-title {
          font-size: 30px;
          font-weight: 700;
          letter-spacing: -0.3px;
          line-height: 1;
          text-align: right;
        }

        .ratecard-page .header-rule {
          border: none;
          border-top: 1.5px solid var(--blue);
          margin-bottom: 22px;
          opacity: 0.55;
        }

        .ratecard-page .currency-row {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 28px;
        }

        .ratecard-page .currency-label {
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--muted);
        }

        .ratecard-page .currency-toggle {
          display: inline-flex;
          border: 1px solid var(--table-border);
          border-radius: 999px;
          padding: 3px;
          background: var(--table-head-bg);
        }

        .ratecard-page .currency-btn {
          appearance: none;
          border: none;
          background: transparent;
          font-size: 12px;
          font-weight: 700;
          padding: 6px 14px;
          border-radius: 999px;
          cursor: pointer;
          color: var(--muted);
          transition: background 0.15s ease, color 0.15s ease;
        }

        .ratecard-page .currency-btn.active {
          background: var(--blue);
          color: #fff;
        }

        .ratecard-page .fx-note {
          font-size: 11px;
          font-style: italic;
          color: var(--muted);
        }

        .ratecard-page .section-rule {
          border: none;
          border-top: 1px solid var(--rule);
          margin-bottom: 28px;
        }

        .ratecard-page .rate-table-wrap {
          border: 1px solid var(--table-border);
          border-radius: 8px;
          overflow-x: auto;
          margin-bottom: 32px;
        }

        .ratecard-page table {
          width: 100%;
          border-collapse: collapse;
        }

        .ratecard-page thead tr {
          background: var(--table-head-bg);
        }

        .ratecard-page thead th {
          font-size: 11.5px;
          font-weight: 700;
          text-align: left;
          padding: 13px 14px;
          border-bottom: 1px solid var(--table-border);
          white-space: nowrap;
        }

        .ratecard-page thead th + th {
          border-left: 1px solid var(--table-border);
        }

        .ratecard-page tbody tr {
          border-bottom: 1px solid var(--table-border);
        }

        .ratecard-page tbody tr:last-child {
          border-bottom: none;
        }

        .ratecard-page tbody td {
          padding: 12px 13px;
          font-size: 12px;
          vertical-align: middle;
          border-left: 1px solid var(--table-border);
        }

        .ratecard-page tbody td:first-child {
          border-left: none;
          font-weight: 700;
        }

        .ratecard-page tbody td:nth-child(3),
        .ratecard-page tbody td:nth-child(4) {
          text-align: center;
          white-space: nowrap;
        }

        .ratecard-page .scope-note {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          font-size: 12.5px;
          font-style: italic;
          color: #4a4f5a;
          line-height: 1.45;
          margin: -16px 0 32px;
          padding: 13px 16px;
          background: #f6f8fc;
          border: 1px solid var(--rule);
          border-radius: 8px;
        }

        .ratecard-page .scope-note .icon {
          flex-shrink: 0;
          color: var(--blue);
          margin-top: 1px;
        }

        .ratecard-page .section {
          margin-bottom: 28px;
        }

        .ratecard-page .section-title {
          font-size: 17px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .ratecard-page .section-accent {
          width: 44px;
          height: 3px;
          background: var(--blue);
          border-radius: 2px;
          margin-bottom: 14px;
        }

        .ratecard-page .tier-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          margin-bottom: 32px;
        }

        .ratecard-page .tier-card {
          border: 1px solid var(--table-border);
          border-radius: 8px;
          padding: 18px 18px 20px;
          display: flex;
          flex-direction: column;
        }

        .ratecard-page .tier-card.featured {
          border-color: var(--blue);
          box-shadow: 0 0 0 1px var(--blue);
        }

        .ratecard-page .tier-flag {
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--blue);
          margin-bottom: 6px;
          min-height: 12px;
        }

        .ratecard-page .tier-name {
          font-size: 15px;
          font-weight: 700;
          margin-bottom: 3px;
        }

        .ratecard-page .tier-price {
          font-size: 19px;
          font-weight: 700;
          color: var(--blue);
          margin-bottom: 14px;
        }

        .ratecard-page .tier-price small {
          font-size: 11px;
          font-weight: 500;
          color: var(--muted);
        }

        .ratecard-page .tier-specs {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 7px;
          border-top: 1px solid var(--rule);
          padding-top: 13px;
          margin: 0;
        }

        .ratecard-page .tier-specs li {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 11.5px;
          line-height: 1.35;
        }

        .ratecard-page .tier-specs li::before {
          content: "";
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--blue);
          flex-shrink: 0;
          margin-top: 5px;
        }

        .ratecard-page .tier-specs strong {
          font-weight: 700;
          white-space: nowrap;
        }

        .ratecard-page .tech-list {
          font-size: 14px;
          color: var(--text);
          display: flex;
          gap: 0;
          flex-wrap: wrap;
        }

        .ratecard-page .tech-list span {
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }

        .ratecard-page .tech-list span + span::before {
          content: "•";
          color: #aaa;
          margin: 0 2px 0 2px;
        }

        .ratecard-page .terms-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
        }

        .ratecard-page .terms-group h4 {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--blue);
          margin-bottom: 12px;
        }

        .ratecard-page .terms-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin: 0;
          padding: 0;
        }

        .ratecard-page .terms-list li {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 11px;
          line-height: 1.4;
        }

        .ratecard-page .terms-list li::before {
          content: "";
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--blue);
          flex-shrink: 0;
          margin-top: 5px;
        }

        .ratecard-page .disclaimer {
          font-size: 11.5px;
          font-style: italic;
          line-height: 1.5;
          color: #8a8f9a;
          margin: 32px 0 22px;
        }

        .ratecard-page .footer-rule {
          border: none;
          border-top: 1px solid var(--rule);
          margin-bottom: 22px;
        }

        .ratecard-page .footer {
          display: flex;
          align-items: center;
          gap: 0;
        }

        .ratecard-page .footer-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13.5px;
          color: var(--text);
          flex: 1;
          justify-content: center;
        }

        .ratecard-page .footer-item:first-child {
          justify-content: flex-start;
        }

        .ratecard-page .footer-item:last-child {
          justify-content: flex-end;
        }

        .ratecard-page .footer-divider {
          width: 1px;
          height: 32px;
          background: var(--rule);
          flex-shrink: 0;
        }

        .ratecard-page .footer-icon {
          color: var(--blue);
          flex-shrink: 0;
        }

        .ratecard-page .footer-item a {
          color: inherit;
          text-decoration: none;
        }

        .ratecard-page .footer-item a:hover {
          text-decoration: underline;
        }

        @media (max-width: 900px) {
          .ratecard-page .page {
            padding: 40px 28px 44px;
          }
        }

        @media (max-width: 720px) {
          .ratecard-page {
            padding: 20px 12px 32px;
          }

          .ratecard-page .page {
            padding: 26px 18px 30px;
          }

          .ratecard-page .header {
            flex-direction: column;
            align-items: flex-start;
          }

          .ratecard-page .doc-title {
            text-align: left;
          }

          .ratecard-page .tier-grid,
          .ratecard-page .terms-grid {
            grid-template-columns: 1fr;
          }

          .ratecard-page .footer {
            flex-direction: column;
            align-items: stretch;
            gap: 16px;
          }

          .ratecard-page .footer-divider {
            display: none;
          }

          .ratecard-page .footer-item,
          .ratecard-page .footer-item:first-child,
          .ratecard-page .footer-item:last-child {
            justify-content: flex-start;
          }
        }

        @media print {
          .ratecard-page {
            background: none;
            padding: 0;
          }

          .ratecard-page .page {
            box-shadow: none;
            border-radius: 0;
            padding: 0;
            max-width: none;
            width: auto;
            margin: 0;
          }

          @page {
            margin: 0.75in;
          }

          .ratecard-page .currency-toggle {
            display: none;
          }

          .ratecard-page .rate-table-wrap,
          .ratecard-page .section {
            break-inside: avoid;
          }
        }
      `}</style>

      <div className="min-h-screen bg-background">
        <main className="ratecard-page">
          <div className="page">
          <header className="header">
            <div className="brand-lockup">
              <img className="brand-logo" src="/visualhqlogo.svg" alt="VisualHQ" />
              <p className="brand-tagline">Brand and Technology Solutions</p>
            </div>
            <h2 className="doc-title">Rate Card</h2>
          </header>

          <hr className="header-rule" />

          <div className="currency-row">
            <span className="currency-label">Currency</span>
            <div className="currency-toggle" role="group" aria-label="Currency">
              <button
                type="button"
                className={`currency-btn${currency === "NGN" ? " active" : ""}`}
                aria-pressed={currency === "NGN"}
                onClick={() => setCurrency("NGN")}
              >
                ₦ NGN
              </button>
              <button
                type="button"
                className={`currency-btn${currency === "USD" ? " active" : ""}`}
                aria-pressed={currency === "USD"}
                onClick={() => setCurrency("USD")}
              >
                $ USD
              </button>
            </div>
            <span className="fx-note">1 USD ≈ ₦{NGN_PER_USD.toLocaleString("en-NG")} — approximate, for reference only</span>
          </div>

          <div className="section">
            <h3 className="section-title">Custom Development</h3>
            <div className="section-accent" />
          </div>

          <RateTable
            headers={["Service", "Scope", `Price (${currencySymbol})`, "Timeline", "What's Included"]}
            rows={customDevelopmentRows}
            currency={currency}
          />

          <div className="scope-note">
            <CircleAlert className="icon" size={16} />
            <span>
              Prices apply within the scope shown. Marketplaces, streaming platforms, and apps with custom integrations
              or heavy traffic fall under <strong>Custom Web App</strong> and are quoted after a scoping call.
            </span>
          </div>

          <hr className="section-rule" />

          <div className="section">
            <h3 className="section-title">No-Code &amp; CMS Platforms</h3>
            <div className="section-accent" />
          </div>

          <RateTable
            headers={["Service", "Scope", `Price (${currencySymbol})`, "Timeline", "What’s Included"]}
            rows={platformRows}
            currency={currency}
          />

          <hr className="section-rule" />

          <div className="section">
            <h3 className="section-title">Maintenance Retainer Tiers</h3>
            <div className="section-accent" />
            <div className="tier-grid">
              {retainers.map((tier) => (
                <div key={tier.name} className={`tier-card${tier.featured ? " featured" : ""}`}>
                  <span className="tier-flag">{tier.flag}</span>
                  <div className="tier-name">{tier.name}</div>
                  <div className="tier-price">
                    {formatPrice({ amount: tier.amount }, currency)}
                    <small> /mo</small>
                  </div>
                  <ul className="tier-specs">
                    {tier.specs.map((spec) => (
                      <li key={"text" in spec ? spec.text : `${spec.strong}-${spec.rest ?? ""}`}>
                        <TierSpecItem spec={spec} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <hr className="section-rule" />

          <div className="section">
            <h3 className="section-title">Technology Stack</h3>
            <div className="section-accent" />
            <div className="tech-list">
              <span>React</span>
              <span>Next.js</span>
              <span>Tailwind CSS</span>
              <span>Firebase</span>
              <span>Vercel</span>
              <span>Webflow</span>
              <span>Framer</span>
              <span>WordPress</span>
            </div>
          </div>

          <hr className="section-rule" />

          <div className="section">
            <h3 className="section-title">Terms &amp; Conditions</h3>
            <div className="section-accent" />
            <div className="terms-grid">
              {terms.map((group) => (
                <div key={group.title} className="terms-group">
                  <h4>{group.title}</h4>
                  <ul className="terms-list">
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <p className="disclaimer">
            Prices are indicative and subject to change without prior notice. Final pricing is confirmed at the time of
            quotation and may be adjusted for project scope, exchange-rate movements, third-party costs, or other
            factors beyond VisualHQ’s control.
          </p>

          <hr className="footer-rule" />

            <footer className="footer">
              <div className="footer-item">
                <MapPin className="footer-icon" size={18} />
                <span>Lagos and Middletown</span>
              </div>
              <div className="footer-divider" />
              <div className="footer-item">
                <Mail className="footer-icon" size={18} />
                <a href="mailto:hello@visualhq.com">hello@visualhq.com</a>
              </div>
              <div className="footer-divider" />
              <div className="footer-item">
                <Globe className="footer-icon" size={18} />
                <a href="https://visualhq.space" target="_blank" rel="noreferrer">
                  visualhq.space
                </a>
              </div>
            </footer>
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
}
