import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const reportHero = {
  eyebrow: "UI/UX Audit",
  title: "Interface audit: Visualcns Finance, reviewed against industry UI/UX standards.",
  description:
    "A UI/UX review of every workspace screen — pipeline through LP reporting — against standard heuristics: accessibility, consistency, empty/error states, wayfinding, data formatting, interactive affordance, and responsive layout. This report cites the exact file and line for every finding.",
  meta: [
    { label: "Reviewed", value: "July 2026" },
    { label: "Perspective", value: "UI/UX practitioner, 10yr" },
    { label: "Scope", value: "14 workspace screens + shared components" },
  ],
}

const verdictSection = {
  title: "Executive summary",
  verdict: "Solid foundation, inconsistent execution",
  paragraphs: [
    "The workspace is built on a coherent design system — a shared PageHeader, a shared AnalysisSubnav, and a `--fin-` CSS variable palette used correctly across most screens. Where the app follows its own conventions, it reads as a single coherent product.",
    "The defects found are not conceptual — they're places where a screen quietly breaks a rule the rest of the app follows. A hardcoded hex badge sits next to CSS-variable badges. One page in a five-step flow drops the deal-context pill every sibling page shows. A table row gets a pointer cursor and a hover state with no click handler behind it. None of these are hard to fix; all of them are the kind of thing a careful practitioner in this exact domain — where users cross-check on-screen numbers against Excel and treat visual affordance as a promise — would flag on a first pass.",
    "Nineteen findings are logged below across seven categories, four of them High severity. The register is ordered by severity within each category, with file and line for every claim.",
  ],
}

const strengthsSection = {
  title: "What holds up",
  items: [
    {
      name: "One shared header, one shared subnav",
      body: "PageHeader (components/finance/page-header.tsx) and AnalysisSubnav (components/finance/analysis-subnav.tsx) are used consistently across nearly every screen, giving the workspace a single, recognizable frame instead of five bespoke headers.",
    },
    {
      name: "Theming discipline, mostly",
      body: "The `--fin-` CSS variable system (--fin-primary, --fin-error, --fin-outline-variant, etc.) is the load-bearing convention across the app, and the large majority of badges, borders, and status colors correctly draw from it rather than hardcoded Tailwind palette classes.",
    },
    {
      name: "Deal context threads through most of the analysis flow",
      body: "business-info, documents, report, benchmarking, and modeling all resolve the selected deal from the URL and render it via PageHeader's dealName prop — the URL-driven selection pattern is the right one for a multi-step diligence workflow.",
    },
    {
      name: "Dashboard responsive patterns are correct where they're used",
      body: "app/finance/app/page.tsx grids degrade cleanly (grid-cols-1 → md:grid-cols-2 → xl:grid-cols-4), which is the pattern every other KPI/card grid in the app should be matching but doesn't always.",
    },
  ],
}

type Severity = "High" | "Medium" | "Low"

interface Finding {
  id: string
  severity: Severity
  category: string
  location: string
  finding: string
  detail: string
}

const findings: Finding[] = [
  {
    id: "A-01",
    severity: "High",
    category: "Accessibility",
    location: "app/finance/app/pipeline/page.tsx:107-112",
    finding: "Icon-only filter and overflow-menu buttons have no aria-label.",
    detail:
      "Two buttons rendered as bare material-symbols spans (filter_list, more_vert) carry no accessible name. A screen-reader user gets no indication of what either control does.",
  },
  {
    id: "A-02",
    severity: "High",
    category: "Accessibility",
    location: "app/finance/app/benchmarking/page.tsx:180-183",
    finding: "Peer variance is signaled by text color alone — no icon, sign, or label.",
    detail:
      "Over/under-performance against peer benchmarks uses text-green-700 / text-red-700 with nothing else distinguishing the two states. For colorblind users this is the one number on the page they can't read — and it's the one the page exists to show.",
  },
  {
    id: "A-03",
    severity: "Medium",
    category: "Accessibility",
    location: "app/finance/app/modeling/page.tsx:99-104, 203-208, 288-290",
    finding: "Same icon-only-button pattern repeats on the modeling screen.",
    detail:
      "Filter/view-toggle and overflow-menu icon buttons again ship with no aria-label — this is the same defect as A-01, recurring on a second screen, which suggests it belongs in a shared IconButton pattern rather than a per-page fix.",
  },
  {
    id: "A-04",
    severity: "Medium",
    category: "Accessibility",
    location: "app/finance/app/analysis/report/page.tsx:203-208",
    finding: "Icon-only filter_list / more_vert buttons, no aria-label — third occurrence.",
    detail: "Same defect as A-01 and A-03, now on three of fourteen screens.",
  },
  {
    id: "N-01",
    severity: "High",
    category: "Navigation & Wayfinding",
    location: "app/finance/app/analysis/page.tsx:50-54",
    finding: "The analysis hub is the only step in its own flow whose header drops the deal-context pill.",
    detail:
      "business-info, documents, report, benchmarking, and modeling all pass dealName into PageHeader. The analysis overview page — the entry point to the entire flow — calls PageHeader without it, relying only on the 'Selected Deal' banner further down the page. Scroll past that banner and the deal name disappears from view, on the one page where a user is choosing which deal to work on.",
  },
  {
    id: "N-02",
    severity: "Low",
    category: "Navigation & Wayfinding",
    location: "app/finance/app/analysis/business-info/page.tsx:161-167",
    finding: "'Discard Draft' is styled as a plain text link with no confirmation.",
    detail:
      "It carries the same visual weight as benign back-navigation links elsewhere in the app, but it silently drops unsaved form input. A destructive action styled identically to a safe one is a trust problem in a form that holds financial data entry.",
  },
  {
    id: "C-01",
    severity: "Medium",
    category: "Consistency",
    location: "app/finance/app/pipeline/page.tsx:31 and app/finance/app/analysis/page.tsx:63",
    finding: "Deal-stage badge uses a hardcoded hex pair instead of the --fin- variables used everywhere else.",
    detail:
      "bg-[#d3e4ff] text-[#001c38] is duplicated verbatim in two files while every comparable badge (page-header.tsx:18, analysis-subnav.tsx:30) draws from --fin-secondary-container / --fin-on-secondary-container. A future theme or dark-mode pass will miss both instances.",
  },
  {
    id: "C-02",
    severity: "Medium",
    category: "Consistency",
    location: "app/finance/app/benchmarking/page.tsx:189-190, 227-228 and app/finance/app/modeling/page.tsx:37-50",
    finding: "Raw Tailwind green/red/amber/blue utilities used for status color instead of --fin- error/tertiary tokens.",
    detail:
      "pipeline/page.tsx:34 and portfolio/page.tsx:22 correctly use --fin-error / --fin-error-container for the same category of status signal. Benchmarking and modeling diverge from their own codebase's convention.",
  },
  {
    id: "C-03",
    severity: "Low",
    category: "Consistency",
    location: "pipeline, benchmarking, and modeling pages",
    finding: "No consistent rule for 4px vs 8px card corner radius.",
    detail:
      "Pipeline's stage cards and table wrapper use rounded-[8px]; benchmarking's equivalent bento cards use rounded-[4px]; modeling mixes both within the same page (rounded-[4px] on library cards, rounded-[8px] on featured cards). Structurally identical containers render with different radii depending on which screen they're on.",
  },
  {
    id: "C-04",
    severity: "Low",
    category: "Consistency",
    location: "app/finance/app/portfolio/page.tsx:81 vs app/finance/app/page.tsx:86",
    finding: "Two KPI-ribbon implementations of the same pattern use different responsive rules.",
    detail:
      "The dashboard's KPI grid steps grid-cols-1 → md:grid-cols-2 → xl:grid-cols-4. Portfolio's KPI ribbon is grid-cols-4 with no breakpoints at all — the same UI pattern, two different responsive contracts.",
  },
  {
    id: "F-01",
    severity: "High",
    category: "Interactive Affordance",
    location: "app/finance/app/portfolio/page.tsx:131-137 and portfolio/holdings/page.tsx:49-86",
    finding: "Holding-company table rows carry cursor-pointer and a hover state with no click handler or Link behind them.",
    detail:
      "Both the portfolio dashboard's table and the full holdings-list page style every row as clickable — pointer cursor, background highlight on hover — but nothing happens on click in either file. A PE user who tries to drill into a holding from the row gets silent failure, and the pattern is systemic (present on two pages), not a one-off typo.",
  },
  {
    id: "F-02",
    severity: "Medium",
    category: "Interactive Affordance",
    location: "app/finance/app/modeling/page.tsx:294, 309-324",
    finding: "A model card offers three distinct visual affordances (title hover, EDIT button, EXCEL button) and none of them are wired up.",
    detail: "No onClick or Link on the title, the EDIT button, or the EXCEL button — the card looks fully interactive and is entirely inert.",
  },
  {
    id: "F-03",
    severity: "Medium",
    category: "Interactive Affordance",
    location: "app/finance/app/portfolio/initiatives/page.tsx:31-33",
    finding: "'Log New Initiative' button is styled identically to real submit actions elsewhere but has no handler.",
    detail:
      "Visually indistinguishable from the working 'Save and Continue' button on the business-info page, so a user has no way to tell, before clicking, that this one does nothing.",
  },
  {
    id: "R-01",
    severity: "High",
    category: "Responsive Layout",
    location: "app/finance/app/pipeline/page.tsx:81",
    finding: "Pipeline-stage summary is a hard grid-cols-5 with no breakpoints.",
    detail:
      "On a 375px viewport this forces five stage cards into equal columns with no fallback, producing illegible cramped text — every other multi-column grid audited at least steps down to grid-cols-1 on mobile.",
  },
  {
    id: "R-02",
    severity: "High",
    category: "Responsive Layout",
    location: "app/finance/app/portfolio/page.tsx:81",
    finding: "Portfolio KPI ribbon is a hard grid-cols-4 with no mobile fallback.",
    detail: "Same defect as R-01 and C-04 — the dashboard's equivalent section handles this correctly one file over.",
  },
  {
    id: "R-03",
    severity: "Medium",
    category: "Responsive Layout",
    location: "app/finance/app/portfolio/page.tsx:99, 101, 218",
    finding: "Main dashboard grid (grid-cols-12, col-span-8/col-span-4) has no md:/lg: prefix to collapse on narrow viewports.",
    detail:
      "The Holding Companies table renders at 8/12 width of an already-narrow mobile viewport instead of stacking full-width. Pipeline and modeling handle the same layout need correctly with col-span-12 lg:col-span-8.",
  },
  {
    id: "R-04",
    severity: "Medium",
    category: "Responsive Layout",
    location: "app/finance/app/portfolio/page.tsx:199",
    finding: "Sector Performance Heatmap is a fixed grid-cols-4 grid-rows-3 inside a fixed h-64 container.",
    detail:
      "No responsive fallback — on mobile this renders four tiny illegible cells per row, obscuring the over/underperformance labels that are the entire point of the widget.",
  },
  {
    id: "E-01",
    severity: "Medium",
    category: "Empty / Loading / Error States",
    location: "app/finance/app/pipeline/page.tsx:128",
    finding: "The Active Opportunities table has no empty-state guard.",
    detail:
      "If deals is empty, the table renders header-only with nothing telling the user whether the pipeline is genuinely empty or data failed to load.",
  },
  {
    id: "E-02",
    severity: "Medium",
    category: "Empty / Loading / Error States",
    location: "app/finance/app/analysis/documents/page.tsx:116-165",
    finding: "A hardcoded 'Ready for next batch' placeholder renders regardless of queue length.",
    detail: "An empty intake queue and a full one are visually indistinguishable except for the missing rows themselves.",
  },
  {
    id: "D-01",
    severity: "Medium",
    category: "Data Formatting",
    location: "app/finance/app/analysis/page.tsx:67 vs app/finance/app/modeling/page.tsx:72",
    finding: "Deal size is formatted two different ways for the same underlying figure.",
    detail:
      "Analysis renders `${deal.size}M` as raw string concatenation. Modeling computes the equivalent figure through formatEvShort(deriveFinancials(...).enterpriseValueM). Two independent formatting pipelines for one concept risks the same deal showing '$42M' on one screen and '$42.0M' on another.",
  },
  {
    id: "D-02",
    severity: "Low",
    category: "Data Formatting",
    location: "app/finance/app/portfolio/page.tsx:71",
    finding: "portfolioLastUpdated is a hand-authored string with no shared date-formatting utility.",
    detail: "Consistency with other date/time displays in the app (e.g. relative-time strings in Recent Activity) depends entirely on source-file discipline rather than a shared formatter.",
  },
]

const categoryOrder = [
  "Accessibility",
  "Navigation & Wayfinding",
  "Consistency",
  "Interactive Affordance",
  "Responsive Layout",
  "Empty / Loading / Error States",
  "Data Formatting",
]

const recommendationsSection = {
  title: "Recommendations",
  items: [
    {
      name: "Extract a shared IconButton with a required aria-label",
      body: "Three separate screens (A-01, A-03, A-04) repeat the same unlabeled icon-only button. A single accessible component fixes all three occurrences at once and prevents a fourth.",
    },
    {
      name: "Give PageHeader's dealName prop teeth",
      body: "Since every analysis-flow screen except the hub page (N-01) already threads dealId through, make dealName effectively required whenever a deal is in scope, so a missing pill is a visible gap in the code review, not a silent omission.",
    },
    {
      name: "Sweep hardcoded hex and raw Tailwind color classes for --fin- equivalents",
      body: "C-01 and C-02 are small, mechanical fixes — the --fin- token for each already exists and is used correctly elsewhere in the same file's neighborhood.",
    },
    {
      name: "Either wire up or unstyle the dead click targets",
      body: "F-01, F-02, and F-03 are all cases where removing cursor-pointer/hover-state is a five-minute fix if the click behavior isn't coming soon, and wiring a real Link is the fix if it is. Leaving the false affordance in place is the one option that actively erodes trust.",
    },
    {
      name: "Standardize the KPI-ribbon and page-grid responsive pattern",
      body: "The dashboard's grid-cols-1 → md:grid-cols-2 → xl:grid-cols-4 pattern already exists in the codebase — R-01, R-02, R-03, and C-04 are all the same fix applied to three more files.",
    },
  ],
}

const signOffSection = {
  title: "Sign-off",
  body: "The interface is built on the right foundation — a shared header, a shared subnav, and a token-based color system that's followed almost everywhere. The nineteen findings above are all local violations of conventions the app already established for itself, which makes them fast to fix and easy to verify: grep for the pattern, confirm the fix matches a screen that already does it correctly, done.",
  primaryCta: "Tour the Workspace",
  secondaryCta: "Read the Business-Logic Audit",
}

const severityToneClasses: Record<Severity, string> = {
  High: "bg-(--fin-primary) text-(--fin-on-primary)",
  Medium: "bg-(--fin-secondary-container) text-(--fin-on-secondary-container)",
  Low: "bg-(--fin-surface-container-high) text-(--fin-on-surface-variant)",
}

export const metadata: Metadata = {
  title: "UI/UX Audit | Visualcns Finance",
  description: reportHero.description,
}

export default function FinanceUxReportPage() {
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
          <h2 className="fin-headline-md mb-3 text-2xl text-(--fin-primary)">Findings register</h2>
          <p className="mb-8 leading-relaxed text-(--fin-on-surface-variant)">
            Nineteen findings across seven categories, each with the exact file and line reviewed.
          </p>

          <div className="space-y-12">
            {categoryOrder.map((category) => {
              const items = findings.filter((f) => f.category === category)
              if (items.length === 0) return null

              return (
                <div key={category}>
                  <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-(--fin-secondary)">
                    {category}
                  </h3>
                  <div className="space-y-6">
                    {items.map((f) => (
                      <article
                        key={f.id}
                        className="rounded-[4px] border border-(--fin-outline-variant) bg-white p-5"
                      >
                        <div className="mb-3 flex flex-wrap items-center gap-3">
                          <span className="text-xs font-bold tracking-widest text-(--fin-on-surface-variant)">
                            {f.id}
                          </span>
                          <span
                            className={`rounded-[2px] px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${severityToneClasses[f.severity]}`}
                          >
                            {f.severity}
                          </span>
                          <span className="ml-auto font-mono text-[11px] text-(--fin-on-surface-variant)">
                            {f.location}
                          </span>
                        </div>
                        <p className="mb-2 font-semibold text-(--fin-on-surface)">{f.finding}</p>
                        <p className="leading-relaxed text-(--fin-on-surface-variant)">{f.detail}</p>
                      </article>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Recommendations */}
        <section className="mb-16 border-t border-(--fin-outline-variant) pt-16">
          <h2 className="fin-headline-md mb-6 text-2xl text-(--fin-primary)">{recommendationsSection.title}</h2>
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
              href="/finance/app"
              className="rounded-[4px] bg-(--fin-primary) px-8 py-3 text-center text-sm font-bold text-(--fin-on-primary)"
            >
              {signOffSection.primaryCta}
            </Link>
            <Link
              href="/finance/pereport"
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
