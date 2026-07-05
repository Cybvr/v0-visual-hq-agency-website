import Image from "next/image";
import type { MetaAdCampaign } from "@/lib/marketing";

export function MetaAdCopy({ campaigns }: { campaigns: MetaAdCampaign[] }) {
  return (
    <section className="mx-auto w-full max-w-[1120px] px-4 py-10 sm:px-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground sm:text-2xl">Meta ad campaign copy</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Ready-to-paste fields for Meta Ads Manager — one card per workflow creative.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {campaigns.map((ad) => (
          <article
            key={ad.slug}
            className="flex flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm"
          >
            <div className="flex items-center gap-3 border-b border-border px-4 py-3">
              <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border border-border">
                <Image src={ad.image} alt={ad.title} fill className="object-cover" />
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">{ad.title}</div>
                <div className="truncate text-xs text-muted-foreground">{ad.slug}</div>
              </div>
            </div>

            <dl className="flex flex-1 flex-col gap-3 px-4 py-4 text-sm">
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Primary text
                </dt>
                <dd className="mt-1 whitespace-pre-line leading-snug text-foreground">{ad.primaryText}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Headline
                </dt>
                <dd className="mt-1 font-medium text-foreground">{ad.headline}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Description
                </dt>
                <dd className="mt-1 text-foreground">{ad.description}</dd>
              </div>
              <div className="mt-auto">
                <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Call to action
                </dt>
                <dd className="mt-1">
                  <span className="inline-flex items-center rounded-md bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                    {ad.cta}
                  </span>
                </dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}
