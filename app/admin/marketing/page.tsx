"use client";

import { InstagramPreview } from "@/components/instagram-preview";
import { MetaAdCopy } from "@/components/meta-ad-copy";
import { marketingHighlights, marketingPosts, marketingProfile, metaAdCampaigns } from "@/lib/marketing";

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-background">
      <MetaAdCopy campaigns={metaAdCampaigns} />
      <InstagramPreview
        profile={marketingProfile}
        posts={marketingPosts}
        highlights={marketingHighlights}
        previewPostCount={marketingPosts.length}
        conceptLabel="VisualCNS marketing preview - ad creatives and post experience"
      />
    </div>
  );
}
