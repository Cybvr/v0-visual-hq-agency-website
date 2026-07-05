"use client";

import { createElement, type ComponentType } from "react";
import Image from "next/image";
import type { IconType } from "react-icons";
import { formatPrice, workflowPlanRows } from "@/lib/plans";
import { getToolIconSpecs } from "@/lib/tool-icons";
import {
  InstagramPreview,
  type InstagramPreviewHighlight,
  type InstagramPreviewProfile,
} from "@/components/instagram-preview";
import { instagramPosts } from "./instagram-posts";

const HIGHLIGHTS: InstagramPreviewHighlight[] = [
  { label: "Launch", bg: "#321A42", text: "#A29E36", content: "MC", size: "text-[26px]" },
  { label: "The Book", bg: "#5F3A63", text: "#ffffff", content: "BK", size: "text-xl" },
  { label: "Schools", bg: "#A29E36", text: "#321A42", content: "SC", size: "text-xl" },
  { label: "Partners", bg: "#656794", text: "#ffffff", content: "PT", size: "text-xl" },
];

const BRAND: InstagramPreviewProfile = {
  handle: "millionclassics",
  site: "millionclassics.org",
  name: "Million Classics",
  category: "Education nonprofit",
  blurb:
    "Building Nigeria's future leaders through classic literature, critical thinking, essay competitions and civic education.",
  tagline: "The Launch Cycle | Lagos 2026",
  followers: "1,248",
  following: "18",
  logoSrc: "/images/logo.png.png",
  logoClassName: "w-[78%] object-contain",
};

const PREVIEW_POST_COUNT = 9;

const millionClassicsWorkflow = workflowPlanRows.find((plan) => plan.service === "Marketing") ?? workflowPlanRows[0];

function toSentenceCase(value: string) {
  const trimmed = value.trim().replace(/^and /, "");
  return trimmed ? `${trimmed.charAt(0).toUpperCase()}${trimmed.slice(1)}` : trimmed;
}

function ToolChip({ tool }: { tool: string }) {
  const icons = getToolIconSpecs(tool);

  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs text-[#737373]">
      {icons.length > 0 ? (
        <span className="flex items-center gap-1.5">
          {icons.map(({ icon: Icon, color, label, textMark }) => (
            <span key={`${tool}-${label}`} aria-label={label} title={label}>
              {Icon
                ? createElement(Icon as ComponentType<{ className?: string; color?: string }>, {
                    className: "size-3.5",
                    color,
                  })
                : (
                  <span
                    className="inline-flex h-4 min-w-4 items-center justify-center rounded-[4px] px-1 text-[9px] font-bold uppercase"
                    style={{ backgroundColor: `${color}18`, color }}
                  >
                    {textMark}
                  </span>
                )}
            </span>
          ))}
        </span>
      ) : null}
      <span>{tool}</span>
    </span>
  );
}

export default function InstagramPreviewPage() {
  return (
    <InstagramPreview
      profile={BRAND}
      posts={instagramPosts}
      highlights={HIGHLIGHTS}
      previewPostCount={PREVIEW_POST_COUNT}
      conceptLabel="Concept mockup by VisualHQ - not live posts"
      overlayCard={
        <>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8e8e8e]">
              {millionClassicsWorkflow.service}
            </span>
          </div>
          <h2 className="text-2xl font-semibold leading-tight md:text-3xl">Turn attention into measurable growth.</h2>
          <p className="mt-3 max-w-[620px] text-sm leading-6 text-[#737373] md:text-base">
            Buy this plan and get a growth system designed to turn audience attention into action.
          </p>

          <div className="mt-6 grid gap-3 text-left md:grid-cols-[1fr_240px]">
            <div className="border border-[#dbdbdb] bg-[#fafafa] p-4">
              <div className="text-sm font-semibold text-[#262626]">Included in plan*</div>
              <ul className="mt-3 grid gap-2 text-sm text-[#737373]">
                {millionClassicsWorkflow.included.split(", ").map(toSentenceCase).map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-accent" />
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="mt-4 border-t border-[#dbdbdb] pt-4">
                <div className="text-sm font-semibold text-[#262626]">Workflow</div>
                <p className="mt-2 text-sm text-[#737373]">{millionClassicsWorkflow.workflow}</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {millionClassicsWorkflow.tools.slice(0, 4).map((tool) => (
                  <ToolChip key={tool} tool={tool} />
                ))}
              </div>
            </div>

            <div className="border border-accent bg-accent p-4 text-accent-foreground">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                {millionClassicsWorkflow.service}
              </div>
              <div className="mt-1 text-4xl font-semibold">{formatPrice(millionClassicsWorkflow.price, "USD")}</div>
              <div className="text-sm font-medium text-white/75">
                {millionClassicsWorkflow.timeline} - {formatPrice(millionClassicsWorkflow.price, "NGN")}
              </div>
              <a
                href={millionClassicsWorkflow.paymentHref ?? "/contact"}
                className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-background px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-background/90"
              >
                Start {millionClassicsWorkflow.service}
              </a>
              <a
                href="/pricing#workflows"
                className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-white/35 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                See other plans
              </a>
            </div>
          </div>

          <div className="mx-auto mt-5 flex max-w-[200px] justify-center">
            <Image
              src="/images/paystack-secured.png"
              alt="Secured by Paystack. Visa, Mastercard, Verve, American Express, Apple Pay and AfriGO accepted."
              width={2048}
              height={373}
              className="h-auto w-full"
            />
          </div>
        </>
      }
    />
  );
}
