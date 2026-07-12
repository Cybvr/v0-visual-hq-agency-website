"use client";

import { useState } from "react";
import { LayoutGrid, Table2 } from "lucide-react";
import { InstagramPreview } from "@/components/instagram-preview";
import { MetaAdCopy } from "@/components/meta-ad-copy";
import { marketingHighlights, marketingPosts, marketingProfile } from "@/lib/marketing";
import { cn } from "@/lib/utils";

export default function MarketingPage() {
  const [view, setView] = useState<"table" | "visual">("table");

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-[1120px] px-3 pt-4 pb-4 sm:px-6 sm:pt-6 sm:pb-6">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl font-semibold">Marketing</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Meta ad campaigns, creatives, and visual content previews.
          </p>
          <div className="mt-4 inline-flex shrink-0 items-center rounded-lg border border-border bg-muted p-0.5">
            {([
              { key: "table", label: "Table", icon: Table2 },
              { key: "visual", label: "Instagram", icon: LayoutGrid },
            ] as const).map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setView(key)}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  view === key
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {view === "table" ? (
        <MetaAdCopy posts={marketingPosts} />
      ) : (
        <InstagramPreview
          profile={marketingProfile}
          posts={marketingPosts}
          highlights={marketingHighlights}
          previewPostCount={marketingPosts.length}
          conceptLabel="VisualCNS marketing preview - ad creatives and post experience"
        />
      )}
    </div>
  );
}
