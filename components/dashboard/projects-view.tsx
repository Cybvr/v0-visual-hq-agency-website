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

export function ProjectsView({ projects }: { projects: Project[] }) {
  return (
    <section id="projects" className="mt-10 scroll-mt-20">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Projects</h2>
        <span className="text-sm font-medium text-muted-foreground">{projects.length}</span>
      </div>

      <div className="mt-4">
        {projects.length === 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            <Link
              href="/dashboard/projects?new=1"
              className="group flex aspect-square flex-col items-center justify-center gap-3 rounded-[14px] border border-dashed border-border bg-card p-4 text-center outline-none transition-colors hover:border-foreground/30 hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-foreground text-background transition-transform group-hover:scale-105">
                <Plus className="size-5" aria-hidden="true" />
              </span>
              <span className="text-sm font-medium text-foreground">Create a new project</span>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {projects.map((project) => {
              const meta = projectStatusMeta[project.status]
              return (
                <div key={project.id} className="flex items-center gap-4 rounded-lg border border-border/60 bg-card px-4 py-3 shadow-sm">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium text-foreground">{project.title}</span>
                      <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-xs font-medium", meta.className)}>
                        {meta.label}
                      </span>
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">{project.service}</div>
                  </div>
                  <div className="w-32 shrink-0">
                    <ProgressBar value={project.progress} />
                    <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
                      <span>{project.progress}%</span>
                      <span>Due {project.dueDate}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
