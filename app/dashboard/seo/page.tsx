import { TrendingUp } from "lucide-react"

export default function SeoPage() {
  return (
    <main className="min-h-full bg-background px-4 py-7 sm:px-6 sm:py-9">
      <div className="mx-auto w-full max-w-5xl">
        <h1 className="text-2xl font-semibold tracking-[-0.02em]">SEO</h1>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 rounded-[14px] border border-dashed border-border bg-card px-6 py-16 text-center">
          <span className="flex size-10 items-center justify-center rounded-full bg-muted">
            <TrendingUp className="size-5 text-muted-foreground" aria-hidden="true" />
          </span>
          <h2 className="text-sm font-medium">Nothing to report yet</h2>
          <p className="max-w-sm text-sm leading-6 text-muted-foreground">
            Once your site is connected to search reporting, rankings and page performance will show up here.
          </p>
        </div>
      </div>
    </main>
  )
}
