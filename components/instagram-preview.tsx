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
    <div className="flex h-screen flex-col overflow-hidden bg-background px-3 py-4 text-foreground sm:px-5 md:py-8">
      <div className="mx-auto flex min-h-0 w-full max-w-[1120px] flex-1 flex-col overflow-hidden border border-border bg-background shadow-[0_24px_80px_rgba(10,10,10,0.08)]">
        <div className="relative min-h-0 flex-1 overflow-y-auto bg-white text-[#262626] md:flex" style={appFont}>
          <nav className="sticky top-0 hidden h-full max-h-[calc(100vh-170px)] w-[72px] flex-shrink-0 flex-col items-center border-r border-[#dbdbdb] py-2 pb-5 md:flex">
            <div className="flex h-[76px] w-full items-center justify-center">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth={2}>
                <rect x="2" y="2" width="20" height="20" rx="6" />
                <circle cx="12" cy="12" r="4.5" />
                <circle cx="17.5" cy="6.5" r="1.2" fill="#000" stroke="none" />
              </svg>
            </div>

            <div className="flex flex-1 flex-col items-center gap-1.5">
              <a className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl hover:bg-[#f2f2f2]"><Home size={24} strokeWidth={1.9} color="#000" /></a>
              <a className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl hover:bg-[#f2f2f2]"><ShoppingBag size={24} strokeWidth={1.7} color="#000" /></a>
              <a className="relative flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl hover:bg-[#f2f2f2]"><Send size={24} strokeWidth={1.8} color="#000" /><span className="absolute right-[5px] top-[5px] flex h-[17px] w-[17px] items-center justify-center rounded-full border-2 border-white bg-[#ff3040] text-[11px] font-bold text-white">8</span></a>
              <a className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl hover:bg-[#f2f2f2]"><Search size={24} strokeWidth={1.9} color="#000" /></a>
              <a className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl hover:bg-[#f2f2f2]"><Compass size={24} strokeWidth={1.9} color="#000" /></a>
              <a className="relative flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl hover:bg-[#f2f2f2]"><Heart size={24} strokeWidth={1.9} color="#000" /><span className="absolute right-[11px] top-2 h-2 w-2 rounded-full border-[1.5px] border-white bg-[#ff3040]" /></a>
              <a className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl hover:bg-[#f2f2f2]"><SquarePlus size={24} strokeWidth={1.9} color="#000" /></a>
              <a className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl hover:bg-[#f2f2f2]"><Clapperboard size={24} strokeWidth={1.9} color="#000" /></a>
              <a className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl hover:bg-[#f2f2f2]"><span className="block h-[26px] w-[26px] rounded-full border-[1.5px] border-black bg-gradient-to-br from-[#7a4de0] to-[#c93a86]" /></a>
            </div>

            <div className="flex flex-col items-center gap-1.5">
              <a className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl hover:bg-[#f2f2f2]"><Menu size={24} strokeWidth={1.9} color="#000" /></a>
              <a className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl hover:bg-[#f2f2f2]"><Grid2x2 size={24} strokeWidth={1.9} color="#000" /></a>
            </div>
          </nav>

          <nav className="sticky top-0 z-40 flex w-full items-center justify-between border-b border-[#dbdbdb] bg-white px-4 py-3 md:hidden">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth={2}>
              <rect x="2" y="2" width="20" height="20" rx="6" />
              <circle cx="12" cy="12" r="4.5" />
              <circle cx="17.5" cy="6.5" r="1.2" fill="#000" stroke="none" />
            </svg>
            <div className="flex items-center gap-5">
              <SquarePlus size={24} strokeWidth={1.8} color="#000" />
              <a className="relative"><Heart size={24} strokeWidth={1.8} color="#000" /><span className="absolute right-[-3px] top-[-3px] h-2 w-2 rounded-full border border-white bg-[#ff3040]" /></a>
              <Menu size={24} strokeWidth={1.8} color="#000" />
            </div>
          </nav>

          <div className="flex min-w-0 flex-1 flex-col pb-16 md:pb-0">
            <main className="mx-auto w-full max-w-[935px] flex-1 px-3 pt-4 sm:px-5 md:pt-[30px]">
              <header className="px-2 pb-6 sm:px-5 sm:pb-11 md:flex md:gap-[52px]">
                <div className="flex items-center gap-5 md:block md:h-[168px] md:w-[168px] md:flex-shrink-0">
                  <div className="flex h-[78px] w-[78px] flex-shrink-0 items-center justify-center rounded-full border border-[#e6e6e6] bg-white p-1 md:h-full md:w-full">
                    <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-white">
                      <Image
                        src={profile.logoSrc}
                        alt={profile.logoAlt ?? profile.name}
                        width={656}
                        height={181}
                        className={profile.logoClassName ?? "w-[78%] object-contain"}
                      />
                    </div>
                  </div>
                  <div className="flex min-w-0 flex-1 items-center gap-1.5 md:hidden">
                    <span className="truncate text-lg font-normal text-[#262626]">{profile.handle}</span>
                    <BadgeCheck size={16} fill="#3897f0" stroke="#fff" strokeWidth={2} />
                  </div>
                </div>

                <div className="mt-4 min-w-0 md:mt-0 md:flex-1 md:pt-1.5">
                  <div className="mb-5 hidden flex-wrap items-center gap-2 md:flex">
                    <span className="text-xl font-normal text-[#262626]">{profile.handle}</span>
                    <BadgeCheck size={18} fill="#3897f0" stroke="#fff" strokeWidth={2} />
                    <div className="ml-3 flex gap-2">
                      <button className="rounded-lg bg-[#efefef] px-4 py-2 text-sm font-semibold text-[#262626]">Following v</button>
                      <button className="rounded-lg bg-[#efefef] px-4 py-2 text-sm font-semibold text-[#262626]">Message</button>
                      <button className="rounded-lg bg-[#efefef] px-3 py-2 text-sm font-semibold text-[#262626]">v</button>
                    </div>
                  </div>

                  <div className="mb-4 flex justify-around border-y border-[#dbdbdb] py-3 text-center md:hidden">
                    <div><div className="text-base font-semibold text-[#262626]">{posts.length}</div><div className="text-xs text-[#8e8e8e]">posts</div></div>
                    <div className="cursor-pointer"><div className="text-base font-semibold text-[#262626]">{profile.followers}</div><div className="text-xs text-[#8e8e8e]">followers</div></div>
                    <div className="cursor-pointer"><div className="text-base font-semibold text-[#262626]">{profile.following}</div><div className="text-xs text-[#8e8e8e]">following</div></div>
                  </div>

                  <div className="mb-5 hidden gap-10 md:flex">
                    <span className="text-base text-[#262626]"><b className="font-semibold">{posts.length}</b> posts</span>
                    <span className="cursor-pointer text-base text-[#262626]"><b className="font-semibold">{profile.followers}</b> followers</span>
                    <span className="cursor-pointer text-base text-[#262626]"><b className="font-semibold">{profile.following}</b> following</span>
                  </div>

                  <div className="max-w-[520px] px-2 text-sm leading-normal text-[#262626] sm:px-0">
                    <div className="font-semibold">{profile.name}</div>
                    <div className="mb-px text-[#737373]">{profile.category}</div>
                    <div>{profile.blurb}</div>
                    {profile.tagline && <div className="mt-0.5">{profile.tagline}</div>}
                    <a href="#" className="mt-1 inline-flex items-center gap-1.5 font-semibold text-[#00376b] no-underline">
                      <LinkIcon size={15} strokeWidth={2} color="#00376b" />
                      {profile.site}
                    </a>
                  </div>

                  <div className="mt-4 flex gap-2 px-2 sm:px-0 md:hidden">
                    <button className="flex-1 rounded-lg bg-[#efefef] px-4 py-2 text-sm font-semibold text-[#262626]">Following v</button>
                    <button className="flex-1 rounded-lg bg-[#efefef] px-4 py-2 text-sm font-semibold text-[#262626]">Message</button>
                  </div>
                </div>
              </header>

              {highlights.length > 0 && (
                <div className="flex gap-6 overflow-x-auto px-2 pb-6 sm:gap-10 sm:px-10 sm:pb-[30px]">
                  {highlights.map((h) => (
                    <div key={h.label} className="flex flex-shrink-0 cursor-pointer flex-col items-center gap-2">
                      <div className="flex h-[62px] w-[62px] items-center justify-center rounded-full border border-[#dbdbdb] p-[3px] sm:h-[86px] sm:w-[86px]">
                        <div
                          className={`flex h-full w-full items-center justify-center rounded-full font-bold ${h.size}`}
                          style={{ backgroundColor: h.bg, color: h.text, fontFamily: "Georgia, 'Times New Roman', serif" }}
                        >
                          {h.content}
                        </div>
                      </div>
                      <span className="text-xs text-[#262626]">{h.label}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-center gap-10 border-t border-[#dbdbdb] sm:gap-[60px]">
                <div className="-mt-px flex items-center gap-1.5 border-t border-[#262626] py-4 text-xs font-semibold tracking-widest text-[#262626]">
                  <Grid3x3 size={12} strokeWidth={2} color="#262626" />
                  POSTS
                </div>
                <div className="flex items-center gap-1.5 py-4 text-xs font-semibold tracking-widest text-[#8e8e8e]">
                  <Tag size={12} strokeWidth={2} color="#8e8e8e" />
                  TAGGED
                </div>
              </div>

              <section className="relative mb-16 text-[#262626] md:mb-10">
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

          <nav className="sticky bottom-0 z-40 flex items-center justify-around border-t border-[#dbdbdb] bg-white py-2.5 md:hidden">
            <a className="flex h-9 w-9 items-center justify-center"><Home size={24} strokeWidth={1.9} color="#000" /></a>
            <a className="flex h-9 w-9 items-center justify-center"><Search size={24} strokeWidth={1.9} color="#000" /></a>
            <a className="flex h-9 w-9 items-center justify-center rounded-lg border-[1.5px] border-black"><SquarePlus size={20} strokeWidth={1.9} color="#000" /></a>
            <a className="flex h-9 w-9 items-center justify-center"><Clapperboard size={24} strokeWidth={1.9} color="#000" /></a>
            <a className="flex h-9 w-9 items-center justify-center"><span className="block h-6 w-6 rounded-full border-[1.5px] border-[#321A42] bg-gradient-to-br from-[#7a4de0] to-[#c93a86]" /></a>
          </nav>

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
