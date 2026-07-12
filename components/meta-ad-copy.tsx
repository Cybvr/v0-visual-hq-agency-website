import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { MarketingPost } from "@/lib/marketing";

export function MetaAdCopy({ posts }: { posts: MarketingPost[] }) {
  const adPosts = posts.filter((p) => p.primaryText);
  return (
    <section className="mx-auto w-full max-w-[1120px] px-3 py-6 sm:px-6 sm:py-10">
      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Creative</TableHead>
              <TableHead>Primary text</TableHead>
              <TableHead>Headline</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {adPosts.map((post) => (
              <TableRow key={post.slug}>
                <TableCell className="align-top">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border border-border">
                      <Image src={post.image} alt={post.title ?? post.slug} fill className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold">{post.title ?? post.slug}</div>
                      <div className="text-xs text-muted-foreground">{post.slug}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="min-w-72 max-w-md whitespace-pre-line align-top leading-snug">
                  {post.primaryText}
                </TableCell>
                <TableCell className="min-w-40 whitespace-normal align-top font-medium">
                  {post.headline}
                </TableCell>
                <TableCell className="min-w-48 max-w-xs whitespace-normal align-top text-muted-foreground">
                  {post.description}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
