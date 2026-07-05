"use client"

import Image from "next/image"
import { BadgeCheck, Grid3x3, Heart, Link as LinkIcon, MessageCircle } from "lucide-react"
import { marketingPosts, marketingProfile } from "@/lib/marketing"

const igFont = {
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
} as const

export default function MarketingPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-xl font-semibold">Marketing</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Instagram presence preview - content lives in lib/marketing.ts.
      </p>

      <div
        className="mt-8 overflow-hidden rounded-xl border border-border bg-white text-[#262626]"
        style={igFont}
      >
        <header className="flex gap-6 px-5 py-6 sm:gap-12 sm:px-10 sm:py-8">
          <div className="flex h-[72px] w-[72px] flex-shrink-0 items-center justify-center rounded-full border border-[#e6e6e6] bg-white p-1 sm:h-[140px] sm:w-[140px]">
            <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-white">
              <Image
                src="/visualhqlogo.svg"
                alt={marketingProfile.name}
                width={80}
                height={80}
                className="w-[60%] object-contain"
              />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-lg font-normal sm:text-xl">{marketingProfile.handle}</span>
              <BadgeCheck size={17} fill="#3897f0" stroke="#fff" strokeWidth={2} />
              <div className="ml-1 flex gap-2">
                <span className="rounded-lg bg-[#efefef] px-4 py-1.5 text-sm font-semibold">Following</span>
                <span className="rounded-lg bg-[#efefef] px-4 py-1.5 text-sm font-semibold">Message</span>
              </div>
            </div>

            <div className="mt-4 flex gap-8 text-sm sm:text-base">
              <span>
                <b className="font-semibold">{marketingPosts.length}</b> posts
              </span>
              <span>
                <b className="font-semibold">{marketingProfile.followers}</b> followers
              </span>
              <span>
                <b className="font-semibold">{marketingProfile.following}</b> following
              </span>
            </div>

            <div className="mt-4 max-w-[480px] text-sm leading-normal">
              <div className="font-semibold">{marketingProfile.name}</div>
              <div className="text-[#737373]">{marketingProfile.category}</div>
              <div>{marketingProfile.bio}</div>
              <span className="mt-1 inline-flex items-center gap-1.5 font-semibold text-[#00376b]">
                <LinkIcon size={14} strokeWidth={2} />
                {marketingProfile.site}
              </span>
            </div>
          </div>
        </header>

        <div className="flex justify-center border-t border-[#dbdbdb]">
          <div className="-mt-px flex items-center gap-1.5 border-t border-[#262626] py-3.5 text-xs font-semibold tracking-widest">
            <Grid3x3 size={12} strokeWidth={2} />
            POSTS
          </div>
        </div>

        <div className="grid grid-cols-2 gap-1 p-1 md:grid-cols-3">
          {marketingPosts.map((post) => (
            <div key={post.slug} className="group relative aspect-square overflow-hidden bg-[#F2EFF4]">
              <Image
                src={post.image}
                alt={post.imageAlt}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/45 px-3 text-center text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                <div className="flex items-center gap-4 text-sm font-bold">
                  <span className="flex items-center gap-1.5">
                    <Heart size={15} fill="#fff" stroke="none" />
                    {post.likes}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MessageCircle size={15} fill="#fff" stroke="none" />
                    {post.comments}
                  </span>
                </div>
                <p className="hidden text-xs leading-snug sm:block">{post.caption}</p>
                <span className="text-[10px] uppercase tracking-wide text-white/70">{post.timeAgo}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
