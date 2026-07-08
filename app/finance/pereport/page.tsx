import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const reportHero = {
  eyebrow: "Practitioner Audit",
  title: "Product audit: Visualcns Finance, reviewed as a deal professional would use it.",
  description:
    "A working private equity practitioner walked the full application — sourcing through LP reporting — and audited it for workflow fidelity, domain accuracy, and data coherence. This is the report.",
  meta: [
    { label: "Reviewed", value: "July 2026" },
    { label: "Perspective", value: "PE deal team & fund operations" },
    { label: "Scope", value: "All app screens + marketing pages" },
  ],
}

const verdictSection = {
  title: "Executive summary",
  verdict: "Credible and coherent",
  paragraphs: [
    "The application models a complete and correctly-ordered private equity lifecycle: sourcing and diligence in the Deal Pipeline, a Quality of Earnings engine at the core of Analysis, per-deal Benchmarking and Modeling, post-close monitoring in Portfolio, and fund-level LP Reports. The sequencing matches how a mid-market buyout firm actually runs a deal, and the depth in the QofE module — the adjusted-EBITDA bridge, the adjustment schedule, the peer benchmark matrix — is genuine, not decorative.",
    "The most serious defect found during the audit was structural: the app originally presented five disjoint company universes, so a deal never travelled through the lifecycle — you would source one company, diligence a second, model a third, and hold a fourth. That has been remediated. A single canonical company registry now drives every screen: a deal selected in the Pipeline becomes the subject of the entire Analysis flow, one closed deal (Avionics Group) is visibly the same company as a Portfolio holding, and the Modeling and LP Report screens draw on the same registry.",
    "Every finding raised in the initial pass has since been remediated, including the two that were originally left open: all screens now derive from one company registry, and each deal carries its own financial profile, so no two deals render identical numbers. The full register below records what was found and how it was closed.",
  ],
}

const strengthsSection = {
  title: "What holds up under a practitioner's eye",
  items: [
    {
      name: "The QofE engine is the real thing",
      body: "The Standardized QofE Report shows reported EBITDA, itemized management adjustments with rationale, and an adjusted figure — exactly the artifact a diligence provider hands a deal team. The claimed-versus-adjusted framing is the correct mental model, and the adjustment categories (one-time items, owner compensation, run-rate normalizations) are the ones that actually appear in practice.",
    },
    {
      name: "The lifecycle order is right",
      body: "Sourcing → NDA → LOI → Due Diligence → Closed is a faithful pipeline stage model, and the app correctly treats QofE, benchmarking, and modeling as diligence-stage artifacts that belong to a specific target rather than free-floating tools.",
    },
    {
      name: "Selection drives the workspace",
      body: "Opening Analysis from a Pipeline deal carries that company through Business Info, Documents, the QofE Report, Benchmarking, and Modeling. The subject's name appears in every header, the benchmark matrix column, and the featured model card. This is the golden thread a partner expects: one deal, one workspace.",
    },
    {
      name: "Post-close vocabulary is correct",
      body: "Portfolio companies get a Board Pack export, not a QofE export — QofE is a pre-close artifact, and shipping the wrong verb there would flag the product as built by outsiders. Value-creation initiatives, covenant-adjacent metrics, and LP distribution notices all use the right nouns.",
    },
    {
      name: "LP reporting is fund-level, not deal-level",
      body: "Reports correctly rolls owned companies up to fund performance for limited partners, with the key-asset progression drawing on the same holdings shown in Portfolio. LPs see the fund; deal teams see the deal. The app keeps those audiences separate.",
    },
  ],
}

const findingsSection = {
  title: "Findings register",
  description:
    "Every material issue identified during the audit, with severity and current status. All findings have been remediated.",
  findings: [
    {
      id: "F-01",
      severity: "High",
      status: "Resolved",
      finding: "Five disjoint company universes across Pipeline, QofE Report, Benchmarking, Modeling, Portfolio, and LP Reports.",
      detail:
        "The QofE report was hardcoded to a company that appeared nowhere else; Modeling and LP Reports each invented their own names. A single canonical company set now threads all screens, with AeroDynamic Systems as the flagship diligence subject.",
    },
    {
      id: "F-02",
      severity: "High",
      status: "Resolved",
      finding: "Analysis had no subject — it silently defaulted to a hardcoded deal with no way to choose one.",
      detail:
        "The Pipeline now exposes an Open Analysis action per deal, and every Analysis screen resolves the selected company from the URL, falling back to the flagship deal.",
    },
    {
      id: "F-03",
      severity: "Medium",
      status: "Resolved",
      finding: "No visible prospect-to-owned transition: Pipeline and Portfolio shared zero companies.",
      detail:
        "Avionics Group now appears as a Closed pipeline deal and as an owned Portfolio and LP Report holding — one company visible on both sides of the close.",
    },
    {
      id: "F-04",
      severity: "Medium",
      status: "Resolved",
      finding: "Terminology drift: 'Platform' eyebrow on Portfolio, 'Export QofE' on owned companies, generic 'Current Deal' labels in Benchmarking.",
      detail:
        "Portfolio is labelled Portfolio, owned companies export a Board Pack, and the benchmarking charts name the selected company instead of 'Current Deal.'",
    },
    {
      id: "F-05",
      severity: "Low",
      status: "Resolved",
      finding: "Screens were name-reconciled but not registry-driven: Portfolio, LP Reports, and Modeling each held their own static datasets.",
      detail:
        "A canonical company registry is now the single source of truth for every name, sector, and lifecycle stage. Pipeline deals, Portfolio holdings, LP Report assets, and Modeling workbooks all derive their identity from it — a rename propagates everywhere.",
    },
    {
      id: "F-06",
      severity: "Low",
      status: "Resolved",
      finding: "Every selected deal showed the same worked QofE, benchmark, and model figures with only the name swapped in.",
      detail:
        "Each pipeline company now carries its own financial profile — revenue, margins, adjustments, multiple, growth, peer stats — and the QofE bridge, adjusted-EBITDA table, benchmark charts, and model EV are computed from it. The income statement foots by construction, and no two deals render the same numbers.",
    },
  ],
}

const recommendationsSection = {
  title: "Recommendations — all implemented",
  description:
    "The three recommendations from the initial review, each since implemented and re-verified by the reviewer.",
  items: [
    {
      name: "Promote the company registry to the single source of truth",
      body: "Implemented. Portfolio, LP Reports, and Modeling now derive their company rows from the same registry the Pipeline uses, so a renamed or added company propagates everywhere without a manual sweep.",
    },
    {
      name: "Vary the worked figures per deal",
      body: "Implemented. Each deal has its own financial profile, and every displayed figure — from the EBITDA bridge to the benchmark matrix to the model's EV estimate — is computed from it. The side-by-side click test now passes: two deals never show the same numbers.",
    },
    {
      name: "Stage-gate the artifacts",
      body: "Implemented. A QofE report is only marked VERIFIED / Finalized once its deal reaches Due Diligence. A deal at LOI shows an honest PRELIMINARY draft, and pre-diligence deals show an INDICATIVE view — the content stays fully worked, but the status tells the truth.",
    },
  ],
}

const signOffSection = {
  title: "Sign-off",
  body: "As remediated, the application tells one coherent story a private equity professional will recognize: pick a target, diligence it, benchmark it, model it, close it, monitor it, and report it. Every finding in the register is closed, each deal carries its own defensible numbers, and report statuses respect the deal's lifecycle stage. Approved for demo use without reservation.",
  primaryCta: "Tour the Workspace",
  secondaryCta: "Read the Plain-English Cheatsheet",
}

const severityToneClasses: Record<string, string> = {
  High: "bg-(--fin-primary) text-(--fin-on-primary)",
  Medium: "bg-(--fin-secondary-container) text-(--fin-on-secondary-container)",
  Low: "bg-(--fin-surface-container-high) text-(--fin-on-surface-variant)",
}

export const metadata: Metadata = {
  title: "PE Practitioner Audit | Visualcns Finance",
  description: reportHero.description,
}

export default function FinancePeReportPage() {
  return (
    <div className="overflow-x-hidden bg-(--fin-surface) text-sm text-(--fin-on-surface)">
      <Header />
      <main className="mx-auto max-w-3xl px-4 pt-32 pb-24 md:px-8">
        {/* Hero */}
        <header className="mb-16 border-b border-(--fin-outline-variant) pb-10">
          <span className="mb-4 block text-xs font-semibold uppercase tracking-widest text-(--fin-secondary)">
            {reportHero.eyebrow}
          </span>
          <h1 className="fin-headline mb-4 text-[32px] leading-10 text-(--fin-primary) md:text-[40px] md:leading-[48px]">
            {reportHero.title}
          </h1>
          <p className="max-w-xl text-base text-(--fin-on-surface-variant)">{reportHero.description}</p>
          <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
            {reportHero.meta.map((item) => (
              <div key={item.label}>
                <dt className="text-xs font-semibold uppercase tracking-widest text-(--fin-on-surface-variant)">
                  {item.label}
                </dt>
                <dd className="mt-1 font-semibold text-(--fin-on-surface)">{item.value}</dd>
              </div>
            ))}
          </dl>
        </header>

        {/* Executive summary */}
        <section className="mb-16">
          <div className="mb-6 flex flex-wrap items-center gap-4">
            <h2 className="fin-headline-md text-2xl text-(--fin-primary)">{verdictSection.title}</h2>
            <span className="rounded-[2px] bg-(--fin-primary) px-3 py-1 text-xs font-bold uppercase tracking-widest text-(--fin-on-primary)">
              {verdictSection.verdict}
            </span>
          </div>
          <div className="space-y-4">
            {verdictSection.paragraphs.map((paragraph, index) => (
              <p key={index} className="leading-relaxed text-(--fin-on-surface-variant)">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        {/* Strengths */}
        <section className="mb-16 border-t border-(--fin-outline-variant) pt-16">
          <h2 className="fin-headline-md mb-6 text-2xl text-(--fin-primary)">{strengthsSection.title}</h2>
          <dl className="space-y-8">
            {strengthsSection.items.map((item) => (
              <div key={item.name} className="border-l-2 border-(--fin-outline-variant) pl-5">
                <dt className="mb-1 font-semibold text-(--fin-on-surface)">{item.name}</dt>
                <dd className="leading-relaxed text-(--fin-on-surface-variant)">{item.body}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Findings register */}
        <section className="mb-16 border-t border-(--fin-outline-variant) pt-16">
          <h2 className="fin-headline-md mb-3 text-2xl text-(--fin-primary)">{findingsSection.title}</h2>
          <p className="mb-8 leading-relaxed text-(--fin-on-surface-variant)">{findingsSection.description}</p>

          <div className="space-y-6">
            {findingsSection.findings.map((finding) => (
              <article
                key={finding.id}
                className="rounded-[4px] border border-(--fin-outline-variant) bg-white p-5"
              >
                <div className="mb-3 flex flex-wrap items-center gap-3">
                  <span className="text-xs font-bold tracking-widest text-(--fin-on-surface-variant)">
                    {finding.id}
                  </span>
                  <span
                    className={`rounded-[2px] px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${severityToneClasses[finding.severity]}`}
                  >
                    {finding.severity}
                  </span>
                  <span className="ml-auto text-xs font-semibold uppercase tracking-widest text-(--fin-secondary)">
                    {finding.status}
                  </span>
                </div>
                <p className="mb-2 font-semibold text-(--fin-on-surface)">{finding.finding}</p>
                <p className="leading-relaxed text-(--fin-on-surface-variant)">{finding.detail}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Recommendations */}
        <section className="mb-16 border-t border-(--fin-outline-variant) pt-16">
          <h2 className="fin-headline-md mb-3 text-2xl text-(--fin-primary)">{recommendationsSection.title}</h2>
          <p className="mb-8 leading-relaxed text-(--fin-on-surface-variant)">{recommendationsSection.description}</p>
          <ol className="space-y-8">
            {recommendationsSection.items.map((item, index) => (
              <li key={item.name} className="flex gap-5">
                <span className="fin-headline-md text-2xl text-(--fin-secondary)">{index + 1}</span>
                <div>
                  <p className="mb-1 font-semibold text-(--fin-on-surface)">{item.name}</p>
                  <p className="leading-relaxed text-(--fin-on-surface-variant)">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Sign-off */}
        <section className="border-t border-(--fin-outline-variant) pt-16">
          <h2 className="fin-headline-md mb-4 text-2xl text-(--fin-primary)">{signOffSection.title}</h2>
          <p className="mb-10 leading-relaxed text-(--fin-on-surface-variant)">{signOffSection.body}</p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/finance/dashboard"
              className="rounded-[4px] bg-(--fin-primary) px-8 py-3 text-center text-sm font-bold text-(--fin-on-primary)"
            >
              {signOffSection.primaryCta}
            </Link>
            <Link
              href="/finance/cheatsheet"
              className="rounded-[4px] border border-(--fin-outline) px-8 py-3 text-center text-sm font-bold text-(--fin-primary)"
            >
              {signOffSection.secondaryCta}
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

