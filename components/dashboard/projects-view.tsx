"use client"

import Link from "next/link"
import { Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { projectStatusMeta, type Project } from "@/lib/projects"

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
      <div className="h-full rounded-full bg-accent" style={{ width: `${value}%` }} />
    </div>
  )
}

/** Stable hue from the project id, so a project keeps the same cover every load. */
function hueFor(seed: string) {
  let hash = 0
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 360
  }
  return hash
}

function Thumbnail({ project }: { project: Project }) {
  if (project.thumbnailUrl) {
    return (
      // Thumbnails are arbitrary stored URLs, so this stays a plain img rather
      // than next/image, which would need every host allowlisted in the config.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={project.thumbnailUrl}
        alt=""
        loading="lazy"
        className="aspect-[4/3] w-full rounded-[10px] object-cover"
      />
    )
  }

  // No cover set, which is every project until thumbnails are uploaded, so draw
  // a generated one instead of leaving a blank tile.
  const hue = hueFor(project.id || project.title)
  return (
    <div
      className="flex aspect-[4/3] w-full items-center justify-center rounded-[10px]"
      style={{
        backgroundImage: `linear-gradient(135deg, hsl(${hue} 62% 58%), hsl(${(hue + 42) % 360} 68% 46%))`,
      }}
      aria-hidden="true"
    >
      <span className="text-2xl font-semibold text-white/90">
        {project.title.trim().charAt(0).toUpperCase() || "?"}
      </span>
    </div>
  )
}

export function ProjectsView({ projects }: { projects: Project[] }) {
  return (
    <section id="projects" className="mt-10 scroll-mt-20">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Projects</h2>
        <span className="text-sm font-medium text-muted-foreground">{projects.length}</span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {projects.map((project) => {
          const meta = projectStatusMeta[project.status]
          return (
            <div
              key={project.id}
              className="flex flex-col rounded-[14px] border border-border/60 bg-card p-2 shadow-sm"
            >
              <Thumbnail project={project} />
              <div className="flex min-w-0 flex-1 flex-col px-1.5 pb-1 pt-2.5">
                <span className="truncate text-sm font-medium text-foreground">{project.title}</span>
                <span className="mt-0.5 truncate text-xs text-muted-foreground">{project.service}</span>
                <span
                  className={cn(
                    "mt-2 w-fit rounded-full px-2 py-0.5 text-xs font-medium",
                    meta.className,
                  )}
                >
                  {meta.label}
                </span>
                <div className="mt-auto pt-3">
                  <ProgressBar value={project.progress} />
                  <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
                    <span>{project.progress}%</span>
                    <span className="truncate">Due {project.dueDate}</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        <Link
          href="/dashboard/projects?new=1"
          className="group flex min-h-[180px] flex-col items-center justify-center gap-3 rounded-[14px] border border-dashed border-border bg-card p-4 text-center outline-none transition-colors hover:border-foreground/30 hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <span className="flex size-10 items-center justify-center rounded-full bg-foreground text-background transition-transform group-hover:scale-105">
            <Plus className="size-5" aria-hidden="true" />
          </span>
          <span className="text-sm font-medium text-foreground">Create a new project</span>
        </Link>
      </div>
    </section>
  )
}
