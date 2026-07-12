"use client"

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
          <p className="text-sm text-muted-foreground">No active projects.</p>
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
