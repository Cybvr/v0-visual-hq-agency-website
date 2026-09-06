"use client"

import { TaskForm } from "@/components/admin/task-form"
import { TaskComments } from "@/components/dashboard/task-comments"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import type { Task, TaskStatus } from "@/lib/tasks"

export function TaskEditorSheet({
  open,
  task,
  clientId,
  clientName,
  defaults,
  onClose,
  onSaved,
}: {
  open: boolean
  task?: Task | null
  clientId: string
  clientName: string
  defaults?: { status?: TaskStatus }
  onClose: () => void
  onSaved: () => void | Promise<void>
}) {
  return (
    <Sheet open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <SheetContent
        side="right"
        className="inset-y-2 right-2 h-[calc(100%-1rem)] w-[calc(100%-1rem)] gap-0 overflow-y-auto rounded-lg border sm:max-w-lg"
      >
        <SheetHeader className="border-b border-border">
          <SheetTitle>{task ? "Edit task" : "New task"}</SheetTitle>
          <SheetDescription>
            {task
              ? "Update the details of this task."
              : "Add a task to your board. It will show up under the chosen status."}
          </SheetDescription>
        </SheetHeader>
        <div className="p-4">
          {open && (
            <TaskForm
              key={task?.id ?? `new-${defaults?.status ?? "todo"}`}
              task={task}
              fixedClient={{ clientId, clientName }}
              defaults={defaults}
              onSaved={() => {
                onClose()
                onSaved()
              }}
              onCancel={onClose}
            />
          )}

          {/* Only an existing task has an id to hang a thread off. */}
          {open && task && <TaskComments taskId={task.id} clientId={task.clientId || clientId} />}
        </div>
      </SheetContent>
    </Sheet>
  )
}
