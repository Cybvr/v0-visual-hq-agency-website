import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const cheatsheetHero = {
  eyebrow: "No jargon, promise",
  title: "Private equity, explained like buying a house.",
  description:
    "Finance people love their own language. Here's the plain-English version of what this app actually does.",
}

const bigPictureSection = {
  title: "The big picture",
  paragraphs: [
    "This app is a tool for private equity people. Here's what that actually means: private equity firms are companies that buy other companies - sometimes a whole factory, a healthcare business, a software company - using money that rich people, pension funds, and endowments have given them to invest. Then they try to improve that company and eventually sell it for more than they paid. That's the whole game.",
    "This app, Visualcns Finance, is the software those buyers use to run that process - from finding a company to buy, to checking its books are real, to reporting back to the people whose money they're using.",
    'Think of it like a real estate agent\'s software, but instead of houses, they\'re buying entire businesses, and instead of a home inspection, they do something called "Quality of Earnings" - which is explained below, because it sounds way scarier than it is.',
  ],
}

const pageWalkthroughSection = {
  title: "Walking through the pages",
  publicSiteLabel: "The public website part (Home, Solutions, Case Studies)",
  publicSiteBody:
    'This is just the billboard. It\'s the "here\'s why you should pay us for this software" pitch, aimed at the buyers described above.',
  appIntro: "The actual app - this is where the work happens:",
  pages: [
    {
      name: "Overview",
      body: "A homepage snapshot: how are our current investments doing, what deals are in progress, what reports were made recently. Like a checking account summary page, but for a whole portfolio of businesses.",
    },
    {
      name: "Deal Pipeline",
      body: 'This is the "shopping list." It tracks companies they might buy, sorted by stage: just found it -> signed a confidentiality agreement -> made an offer -> doing background checks -> deal closed. It\'s a sales funnel, same shape you\'d see for any sales process, just the product being sold is entire companies. You pick one company here, and that\'s the company Analysis then works on.',
    },
    {
      name: "Analysis",
      body: 'This is the heart of the app, and it always works on the one company you picked in the Deal Pipeline. This is where "Quality of Earnings" happens. Here\'s the plain version of that phrase: when someone wants to buy a business, the seller shows financial statements that say "we made $42 million in profit." Quality of Earnings is the process of checking: is that number real, or is it puffed up? Maybe the seller counted a one-time lawsuit payout as regular income, or paid themselves a huge salary that a normal owner wouldn\'t. The analysts:',
      subBullets: [
        "Enter basic info about the company being checked",
        "Upload the company's financial documents (spreadsheets, tax returns)",
        "Let the software scan those documents and flag anything suspicious or one-time",
        'Get a clean, final report showing "here\'s what they claimed vs. here\'s what we think is real"',
        "Compare that business to similar companies",
        "Use the cleaned numbers in financial models",
      ],
    },
    {
      name: "Portfolio",
      body: 'Once they\'ve bought a company, this page tracks how it\'s doing over time: revenue, profit margins, debt levels, and any "we\'re trying to improve this" projects (like re-negotiating a contract or upgrading software).',
    },
    {
      name: "Reports",
      body: "This section is how the firm reports back to investors: here's how your money is doing, here are the latest report files, here are payment-related notices, and here's a secure way to message us.",
    },
  ],
}

const analogySection = {
  title: "The real estate version, side by side",
  description:
    "Private equity firms don't buy houses - they buy entire companies. But the process maps almost one-to-one onto a home sale.",
  rows: [
    {
      realEstate: "A real estate agent finds houses that might be worth buying.",
      privateEquity: "The Deal Pipeline is the list of companies the firm might buy.",
    },
    {
      realEstate: "You get a home inspection before closing, to make sure the seller isn't hiding problems.",
      privateEquity: '"Quality of Earnings" is that inspection - checking whether the company\'s claimed profit is real.',
    },
    {
      realEstate: "The inspector's report lists what's solid and what needs an asterisk.",
      privateEquity: 'The QofE Report lists the seller\'s numbers next to the AI\'s adjusted, "actually true" numbers.',
    },
    {
      realEstate: "After you move in, you track the home's value and any renovations.",
      privateEquity: "Portfolio tracks how an owned company is doing and what's being improved.",
    },
    {
      realEstate: "A mortgage calculator shows what payments look like under different loan terms.",
      privateEquity: 'Financial Modeling runs the "what if we borrow this much" math before the deal closes.',
    },
    {
      realEstate: "If you bought the house with a group of friends, you'd send them updates on the investment.",
      privateEquity: "Reports is how the firm updates the investors whose money bought the company.",
    },
  ],
}

const glossarySection = {
  title: "The jargon cheat-sheet",
  description: "Every scary term, translated once.",
  terms: [
    {
      term: "Private Equity (PE)",
      plain: "A company that buys other companies with investors' money, improves them, and sells them later.",
    },
    {
      term: "LP (Limited Partner)",
      plain: "The fancy term for the investor whose money is being used to buy companies.",
    },
    {
      term: "Quality of Earnings (QofE)",
      plain: "Fact-checking whether a seller's claimed profit is actually real, like a home inspection for a business.",
    },
    {
      term: "EBITDA",
      plain: 'A cleaned-up version of "how much money does this business really make," with one-time noise removed.',
    },
    {
      term: "Due Diligence",
      plain: "The background-check phase before buying - like a title search and inspection combined.",
    },
    {
      term: "Portfolio company",
      plain: "A business the firm already owns, like a house that's already in your name.",
    },
  ],
}

const cheatsheetCta = {
  title: "Ready to see the actual app, now that the jargon is out of the way?",
  primaryCta: "Tour the Workspace",
  secondaryCta: "Back to Solutions",
}

export const metadata: Metadata = {
  title: "Cheatsheet | Visualcns Finance",
  description: cheatsheetHero.description,
}

export default function FinanceCheatsheetPage() {
  return (
    <div className="overflow-x-hidden bg-(--fin-surface) text-sm text-(--fin-on-surface)">
      <Header />
      <main className="mx-auto max-w-3xl px-4 pt-32 pb-24 md:px-8">
        {/* Hero */}
        <header className="mb-16 border-b border-(--fin-outline-variant) pb-10">
          <span className="mb-4 block text-xs font-semibold uppercase tracking-widest text-(--fin-secondary)">
            {cheatsheetHero.eyebrow}
          </span>
          <h1 className="fin-headline mb-4 text-[32px] leading-10 text-(--fin-primary) md:text-[40px] md:leading-[48px]">
            {cheatsheetHero.title}
          </h1>
          <p className="max-w-xl text-base text-(--fin-on-surface-variant)">{cheatsheetHero.description}</p>
        </header>

        {/* The big picture */}
        <section className="mb-16">
          <h2 className="fin-headline-md mb-6 text-2xl text-(--fin-primary)">{bigPictureSection.title}</h2>
          <div className="space-y-4">
            {bigPictureSection.paragraphs.map((paragraph, index) => (
              <p key={index} className="leading-relaxed text-(--fin-on-surface-variant)">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        {/* Walking through the pages */}
        <section className="mb-16 border-t border-(--fin-outline-variant) pt-16">
          <h2 className="fin-headline-md mb-6 text-2xl text-(--fin-primary)">{pageWalkthroughSection.title}</h2>

          <p className="mb-2 font-semibold text-(--fin-on-surface)">{pageWalkthroughSection.publicSiteLabel}</p>
          <p className="mb-8 leading-relaxed text-(--fin-on-surface-variant)">
            {pageWalkthroughSection.publicSiteBody}
          </p>

          <p className="mb-6 leading-relaxed text-(--fin-on-surface-variant)">{pageWalkthroughSection.appIntro}</p>

          <dl className="space-y-8">
            {pageWalkthroughSection.pages.map((page) => (
              <div key={page.name} className="border-l-2 border-(--fin-outline-variant) pl-5">
                <dt className="mb-1 font-semibold text-(--fin-on-surface)">{page.name}</dt>
                <dd className="leading-relaxed text-(--fin-on-surface-variant)">{page.body}</dd>
                {page.subBullets && (
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-(--fin-on-surface-variant)">
                    {page.subBullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </dl>
        </section>

        {/* Real estate analogy */}
        <section className="mb-16 border-t border-(--fin-outline-variant) pt-16">
          <h2 className="fin-headline-md mb-3 text-2xl text-(--fin-primary)">{analogySection.title}</h2>
          <p className="mb-8 leading-relaxed text-(--fin-on-surface-variant)">{analogySection.description}</p>

          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-(--fin-outline-variant)">
                <th className="w-1/2 pb-3 pr-4 text-xs font-semibold uppercase tracking-widest text-(--fin-on-surface-variant)">
                  Buying a house
                </th>
                <th className="w-1/2 pb-3 pl-4 text-xs font-semibold uppercase tracking-widest text-(--fin-primary)">
                  Buying a company
                </th>
              </tr>
            </thead>
            <tbody>
              {analogySection.rows.map((row) => (
                <tr key={row.realEstate} className="border-b border-(--fin-outline-variant)">
                  <td className="py-4 pr-4 align-top text-(--fin-on-surface-variant)">{row.realEstate}</td>
                  <td className="py-4 pl-4 align-top text-(--fin-on-surface)">{row.privateEquity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Glossary */}
        <section className="mb-16 border-t border-(--fin-outline-variant) pt-16">
          <h2 className="fin-headline-md mb-3 text-2xl text-(--fin-primary)">{glossarySection.title}</h2>
          <p className="mb-8 leading-relaxed text-(--fin-on-surface-variant)">{glossarySection.description}</p>

          <dl className="divide-y divide-(--fin-outline-variant)">
            {glossarySection.terms.map((entry) => (
              <div key={entry.term} className="grid gap-1 py-4 md:grid-cols-3 md:gap-6">
                <dt className="font-semibold text-(--fin-primary) md:col-span-1">{entry.term}</dt>
                <dd className="text-(--fin-on-surface-variant) md:col-span-2">{entry.plain}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* CTA */}
        <section className="border-t border-(--fin-outline-variant) pt-16 text-center">
          <h2 className="fin-headline-md mb-8 text-2xl text-(--fin-primary)">{cheatsheetCta.title}</h2>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/finance/app"
              className="rounded-[4px] bg-(--fin-primary) px-8 py-3 text-sm font-bold text-(--fin-on-primary)"
            >
              {cheatsheetCta.primaryCta}
            </Link>
            <Link
              href="/finance/solutions"
              className="rounded-[4px] border border-(--fin-outline) px-8 py-3 text-sm font-bold text-(--fin-primary)"
            >
              {cheatsheetCta.secondaryCta}
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
