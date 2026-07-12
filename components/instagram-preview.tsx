"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import {
  BadgeCheck,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Compass,
  Grid2x2,
  Grid3x3,
  Heart,
  Home,
  Link as LinkIcon,
  Menu,
  MessageCircle,
  MoreHorizontal,
  Search,
  Send,
  ShoppingBag,
  Smile,
  SquarePlus,
  Tag,
  X,
} from "lucide-react";

export type InstagramPreviewComment = {
  username: string;
  avatar: string;
  text: string;
  timeAgo: string;
  likes: number;
};

export type InstagramPreviewPost = {
  slug: string;
  image: string;
  imageAlt: string;
  location: string;
  caption: string;
  hashtags: string[];
  likes: number;
  shares?: number;
  bookmarks?: number;
  timeAgo: string;
  comments: InstagramPreviewComment[];
};

export type InstagramPreviewHighlight = {
  label: string;
  bg: string;
  text: string;
  content: string;
  size: string;
};

export type InstagramPreviewProfile = {
  handle: string;
  site: string;
  name: string;
  category: string;
  blurb: string;
  tagline?: string;
  followers: string;
  following: string;
  logoSrc: string;
  logoAlt?: string;
  logoClassName?: string;
};

type InstagramPreviewProps = {
  profile: InstagramPreviewProfile;
  posts: InstagramPreviewPost[];
  highlights?: InstagramPreviewHighlight[];
  previewPostCount?: number;
  overlayCard?: ReactNode;
  conceptLabel?: string;
};

const appFont = {
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
} as const;

function PostImage({ post }: { post: InstagramPreviewPost }) {
  return (
    <div
      className="relative h-full w-full bg-[#F2EFF4] bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${post.image})` }}
      aria-label={post.imageAlt}
      role="img"
    >
      <img src={post.image} alt={post.imageAlt} className="hidden" />
    </div>
  );
}

function PostModal({
  post,
  profile,
  onClose,
  onPrev,
  onNext,
}: {
  post: InstagramPreviewPost;
  profile: InstagramPreviewProfile;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}) {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    setLiked(false);
    setBookmarked(false);
  }, [post.slug]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && onPrev) onPrev();
      if (e.key === "ArrowRight" && onNext) onNext();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, onPrev, onNext]);

  return (
    <div
      className="fixed inset-0 z-50 bg-white md:flex md:items-center md:justify-center md:bg-black/80 md:px-4"
      onClick={onClose}
      style={appFont}
    >
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute right-5 top-5 hidden text-white/80 hover:text-white md:block"
      >
        <X size={28} />
      </button>

      {onPrev && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          aria-label="Previous post"
          className="absolute left-8 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-lg md:flex"
        >
          <ChevronLeft size={22} />
        </button>
      )}
      {onNext && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          aria-label="Next post"
          className="absolute right-8 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-lg md:flex"
        >
          <ChevronRight size={22} />
        </button>
      )}

      <div
        className="flex h-full w-full flex-col overflow-y-auto bg-white text-[#262626] md:h-[90vh] md:max-h-[600px] md:w-full md:max-w-[935px] md:flex-row md:overflow-hidden md:rounded"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-shrink-0 items-center gap-3 border-b border-[#efefef] px-4 py-3 md:hidden">
          <button onClick={onClose} aria-label="Close">
            <X size={22} />
          </button>
          <span className="h-7 w-7 flex-shrink-0 rounded-full bg-[#321A42]" />
          <span className="min-w-0 flex-1 truncate text-sm font-semibold">{profile.handle}</span>
          <MoreHorizontal size={20} className="cursor-pointer text-[#262626]" />
        </div>

        <div className="relative aspect-square w-full flex-shrink-0 bg-black md:aspect-auto md:h-full md:min-w-0 md:flex-1">
          <PostImage post={post} />
        </div>

        <div className="flex w-full min-w-0 flex-col md:w-[380px] md:flex-shrink-0">
          <div className="hidden items-center gap-3 border-b border-[#efefef] px-4 py-3 md:flex">
            <span className="h-8 w-8 flex-shrink-0 rounded-full border border-[#e6e6e6] bg-white p-0.5">
              <span className="block h-full w-full rounded-full bg-[#321A42]" />
            </span>
            <span className="min-w-0 flex-1 truncate text-sm font-semibold">{profile.handle}</span>
            <MoreHorizontal size={20} className="cursor-pointer text-[#262626]" />
          </div>

          <div className="px-4 py-3 md:flex-1 md:overflow-y-auto">
            <div className="mb-4 flex gap-3">
              <span className="h-8 w-8 flex-shrink-0 rounded-full border border-[#e6e6e6] bg-white p-0.5">
                <span className="block h-full w-full rounded-full bg-[#321A42]" />
              </span>
              <div className="min-w-0 text-sm leading-snug">
                <span className="font-semibold">{profile.handle}</span> {post.caption}{" "}
                <span className="text-[#00376b]">
                  {post.hashtags.map((tag) => (
                    <span key={tag}>#{tag} </span>
                  ))}
                </span>
                <div className="mt-1 text-xs text-[#8e8e8e]">{post.timeAgo}</div>
              </div>
            </div>

            {post.comments.map((comment) => (
              <div key={comment.username + comment.text} className="mb-4 flex gap-3">
                <span
                  className="h-8 w-8 flex-shrink-0 rounded-full border-2 border-white"
                  style={{ background: comment.avatar }}
                />
                <div className="min-w-0 flex-1 text-sm leading-snug">
                  <span className="font-semibold">{comment.username}</span> {comment.text}
                  <div className="mt-1 flex gap-3 text-xs text-[#8e8e8e]">
                    <span>{comment.timeAgo}</span>
                    {comment.likes > 0 && <span>{comment.likes} likes</span>}
                    <span className="cursor-pointer font-semibold">Reply</span>
                  </div>
                </div>
                <Heart size={12} className="mt-1.5 flex-shrink-0 text-[#8e8e8e]" />
              </div>
            ))}
          </div>

          <div className="border-t border-[#efefef] px-4 pt-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={() => setLiked((v) => !v)} aria-label="Like">
                  <Heart
                    size={24}
                    strokeWidth={1.9}
                    color={liked ? "#ff3040" : "#262626"}
                    fill={liked ? "#ff3040" : "none"}
                  />
                </button>
                <MessageCircle size={24} strokeWidth={1.9} className="-scale-x-100 text-[#262626]" />
                <Send size={22} strokeWidth={1.9} className="text-[#262626]" />
              </div>
              <button onClick={() => setBookmarked((v) => !v)} aria-label="Save">
                <Bookmark
                  size={24}
                  strokeWidth={1.9}
                  color="#262626"
                  fill={bookmarked ? "#262626" : "none"}
                />
              </button>
            </div>

            <div className="mt-2 text-sm font-semibold">
              {(post.likes + (liked ? 1 : 0)).toLocaleString()} likes
            </div>
            <div className="mb-3 mt-1 text-[11px] uppercase tracking-wide text-[#8e8e8e]">
              {post.location} - {post.timeAgo} ago
            </div>

            <div className="flex items-center gap-3 border-t border-[#efefef] py-3">
              <Smile size={22} className="flex-shrink-0 text-[#262626]" />
              <input
                type="text"
                placeholder="Add a comment..."
                readOnly
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#8e8e8e]"
              />
              <button className="text-sm font-semibold text-[#3897f0]">Post</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function InstagramPreview({
  profile,
  posts,
  highlights = [],
  previewPostCount = 9,
  overlayCard,
  conceptLabel = "Concept mockup by VisualHQ - not live posts",
}: InstagramPreviewProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const previewPosts = posts.slice(0, previewPostCount);

  return (
    <div className="flex flex-col bg-background px-2 py-3 text-foreground sm:px-5 md:py-8">
      <div className="mx-auto w-full max-w-[1120px] border border-border bg-background shadow-[0_24px_80px_rgba(10,10,10,0.08)]">
        <div className="relative bg-white text-[#262626]" style={appFont}>
          <div className="flex flex-col pb-16 md:pb-0">
            <main className="mx-auto w-full max-w-[935px] flex-1 px-2 pt-3 sm:px-5 md:pt-[30px]">
              <section className="relative mb-12 text-[#262626] md:mb-10">
                <div className={`relative ${overlayCard ? "max-h-[1950px] overflow-hidden sm:max-h-none sm:overflow-visible" : ""}`}>
                  <div className="grid grid-cols-1 gap-1 sm:grid-cols-3">
                    {previewPosts.map((post, i) => (
                      <button
                        key={post.slug}
                        onClick={() => setOpenIndex(i)}
                        className="group relative block aspect-square cursor-pointer overflow-hidden text-left"
                      >
                        <PostImage post={post} />
                        <div className="absolute inset-0 flex items-center justify-center gap-6 bg-black/35 text-[15px] font-bold text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                          <span className="flex items-center gap-1.5">
                            <Heart size={19} fill="#fff" strokeWidth={0} />
                            {post.likes.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MessageCircle size={19} fill="#fff" strokeWidth={0} className="-scale-x-100" />
                            {post.comments.length}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                  {overlayCard && <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[440px] bg-gradient-to-b from-white/0 via-white/85 to-white sm:h-[52%] sm:via-white/72" />}
                </div>

                {overlayCard && (
                  <div className="relative z-10 px-2 pb-8 pt-6 sm:-mt-[260px] sm:pt-[150px]">
                    <div className="mx-auto max-w-[760px] rounded-[8px] border border-[#dbdbdb] bg-white p-5 text-left shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
                      <div className="mb-4 flex items-center gap-3">
                        <Image src="/visualhqlogo.svg" alt="VisualHQ" width={28} height={28} />
                        <span className="text-xs text-[#8e8e8e]">{conceptLabel}</span>
                      </div>
                      {overlayCard}
                    </div>
                  </div>
                )}
              </section>
            </main>
          </div>

          {openIndex !== null && (
            <PostModal
              post={previewPosts[openIndex]}
              profile={profile}
              onClose={() => setOpenIndex(null)}
              onPrev={openIndex > 0 ? () => setOpenIndex(openIndex - 1) : undefined}
              onNext={openIndex < previewPosts.length - 1 ? () => setOpenIndex(openIndex + 1) : undefined}
            />
          )}
        </div>
      </div>
    </div>
  );
}
