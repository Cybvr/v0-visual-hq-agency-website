// Plain-language glossary — "Private Equity, explained like a house sale."
// Copy is intentionally non-technical; see docs/finance-stitch/visualcns_finance_prd.md
// for the product spec this translates.

export interface CheatsheetHero {
  eyebrow: string
  title: string
  description: string
}

export const cheatsheetHero: CheatsheetHero = {
  eyebrow: "No jargon, promise",
  title: "Private equity, explained like buying a house.",
  description:
    "Finance people love their own language. Here's the plain-English version of what this app actually does, using an analogy anyone who's ever bought or sold a home already understands.",
}

export interface AnalogyRow {
  realEstate: string
  privateEquity: string
}

export interface AnalogySection {
  title: string
  description: string
  rows: AnalogyRow[]
}

export const analogySection: AnalogySection = {
  title: "The real estate version",
  description:
    "Private equity firms don't buy houses — they buy entire companies. But the process maps almost one-to-one onto a home sale.",
  rows: [
    {
      realEstate: "A real estate agent finds houses that might be worth buying.",
      privateEquity: "The Deal Pipeline is the list of companies the firm might buy.",
    },
    {
      realEstate: "You get a home inspection before closing, to make sure the seller isn't hiding problems.",
      privateEquity:
        "“Quality of Earnings” is that inspection — checking whether the company's claimed profit is real.",
    },
    {
      realEstate: "The inspector's report lists what's solid and what needs an asterisk.",
      privateEquity: "The QofE Report lists the seller's numbers next to the AI's adjusted, “actually true” numbers.",
    },
    {
      realEstate: "A mortgage calculator shows what payments look like under different loan terms.",
      privateEquity: "Financial Modeling runs the “what if we borrow this much” math before the deal closes.",
    },
    {
      realEstate: "After you move in, you track the home's value and any renovations.",
      privateEquity: "Portfolio Monitoring tracks how an owned company is doing and what's being improved.",
    },
    {
      realEstate: "If you bought the house with a group of friends, you'd send them updates on the investment.",
      privateEquity: "The LP Reporting Portal is how the firm updates the investors whose money bought the company.",
    },
  ],
}

export interface GlossaryTerm {
  term: string
  plain: string
}

export const glossarySection = {
  title: "The jargon cheat-sheet",
  description: "Every scary term, translated once, so you never have to ask what it means twice.",
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
      plain: "A cleaned-up version of “how much money does this business really make,” with one-time noise removed.",
    },
    {
      term: "Due Diligence",
      plain: "The background-check phase before buying — like a title search and inspection combined.",
    },
    {
      term: "Portfolio company",
      plain: "A business the firm already owns, like a house that's already in your name.",
    },
  ] satisfies GlossaryTerm[],
}

export interface CheatsheetCta {
  title: string
  primaryCta: string
  secondaryCta: string
}

export const cheatsheetCta: CheatsheetCta = {
  title: "Ready to see the actual app, now that the jargon is out of the way?",
  primaryCta: "Tour the Workspace",
  secondaryCta: "Back to Solutions",
}
