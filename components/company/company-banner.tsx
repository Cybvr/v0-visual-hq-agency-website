"use client"

import type { ReactNode } from "react"

import { ProjectCover } from "@/components/project-card"
import type { Project } from "@/lib/projects"

/**
 * The dark banner at the top of a company's page: logo, name, category pill,
 * and an optional actions slot. Shared by the admin company dashboard and its
 * public counterpart at visualcns.com/{slug} - the public page just omits
 * `actions` (no Edit/Share there).
 */
export function CompanyBanner({
  name,
  categoryLabel,
  coverProject,
  actions,
}: {
  name: string
  categoryLabel: string
  coverProject: Project
  actions?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-6 rounded-2xl bg-company-banner p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
      <div className="flex items-center gap-5">
        <div className="size-20 shrink-0 overflow-hidden rounded-2xl bg-white/10 sm:size-24">
          <ProjectCover project={coverProject} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">{name}</h1>
          <span className="mt-3 inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90">
            {categoryLabel || "No category yet"}
          </span>
        </div>
      </div>

      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  )
}
