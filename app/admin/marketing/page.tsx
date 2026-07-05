"use client";

import { InstagramPreview } from "@/components/instagram-preview";
import { marketingHighlights, marketingPosts, marketingProfile } from "@/lib/marketing";

export default function MarketingPage() {
  return (
    <InstagramPreview
      profile={marketingProfile}
      posts={marketingPosts}
      highlights={marketingHighlights}
      previewPostCount={marketingPosts.length}
      conceptLabel="VisualCNS marketing preview - ad creatives and post experience"
    />
  );
}
