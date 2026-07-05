"use client"

import { Card, CardContent } from "@/components/ui/card"
import { projectStatusMeta, type Project, type ProjectStatus } from "@/lib/projects"

// Column order for the Kanban board.
const STATUS_ORDER: ProjectStatus[] = ["in-progress", "review", "done", "on-hold"]

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
      <div className="h-full rounded-full bg-accent" style={{ width: `${value}%` }} />
    </div>
  )
}

function BoardView({ projects }: { projects: Project[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {STATUS_ORDER.map((status) => {
        const meta = projectStatusMeta[status]
        const items = projects.filter((p) => p.status === status)
        return (
          <div key={status} className="flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {meta.label}
              </span>
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{items.length}</span>
            </div>
            <div className="flex flex-col gap-3">
              {items.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border px-3 py-6 text-center text-xs text-muted-foreground">
                  None
                </div>
              ) : (
                items.map((project) => (
                  <Card key={project.id}>
                    <CardContent className="p-4">
                      <div className="text-sm font-medium">{project.title}</div>
                      <div className="mt-0.5 text-xs text-muted-foreground">{project.service}</div>
                      <div className="mt-3">
                        <ProgressBar value={project.progress} />
                        <div className="mt-1.5 flex justify-between text-[11px] text-muted-foreground">
                          <span>{project.progress}%</span>
                          <span>Due {project.dueDate}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function ProjectsView({ projects }: { projects: Project[] }) {
  return (
    <section className="mt-10">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Projects</h2>
      </div>

      <div className="mt-4">
        {projects.length === 0 ? (
          <p className="text-sm text-muted-foreground">No active projects.</p>
        ) : (
          <BoardView projects={projects} />
        )}
      </div>
    </section>
  )
}
