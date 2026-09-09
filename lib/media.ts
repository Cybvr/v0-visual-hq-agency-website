export type MediaKind = "image" | "video"

const IMAGE_EXTENSION = /\.(avif|gif|heic|heif|jpe?g|png|svg|webp)(?:$|[?#])/i
const VIDEO_EXTENSION = /\.(avi|m4v|mkv|mov|mp4|mpeg|mpg|ogv|webm)(?:$|[?#])/i

export function mediaKindForFile(file: File): MediaKind | null {
  if (file.type.startsWith("image/")) return "image"
  if (file.type.startsWith("video/")) return "video"
  if (IMAGE_EXTENSION.test(file.name)) return "image"
  if (VIDEO_EXTENSION.test(file.name)) return "video"
  return null
}

export function mediaKindForUrl(url: string): MediaKind {
  if (/\/video\/upload\//i.test(url) || VIDEO_EXTENSION.test(url)) return "video"
  return "image"
}
