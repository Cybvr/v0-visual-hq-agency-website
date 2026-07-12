"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Pencil, Plus, Trash2, Loader2 } from "lucide-react"
import {
  getTasks,
  deleteTask,
  updateTask,
  taskStatusMeta,
  taskPriorityMeta,
  tsToMillis,
  formatTimestamp,
  type Task,
  type TaskStatus,
  type TaskPriority,
} from "@/lib/tasks"
import { getProjects, type Project } from "@/lib/projects"
import { Badge, InlineDate, InlineProject, InlineSelect, InlineText } from "@/components/inline-table-cells"
import { TaskForm } from "@/components/admin/task-form"

const STATUS_OPTIONS: TaskStatus[] = ["todo", "in-progress", "review", "done"]
const PRIORITY_OPTIONS: TaskPriority[] = ["low", "medium", "high"]

export default function TasksAdminPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | "new" | null>(null)

  async function fetchData() {
    setError(null)
    try {
      const [taskData, projectData] = await Promise.all([getTasks(), getProjects()])
      // Newest first, like Notion's default
      taskData.sort((a, b) => tsToMillis(b.createdAt) - tsToMillis(a.createdAt))
      setTasks(taskData)
      setProjects(projectData)
    } catch (err) {
      console.error("Error fetching tasks:", err)
      setError(err instanceof Error ? err.message : "Failed to load tasks.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  async function handleDelete(id: string) {
    setDeleting(id)
    try {
      await deleteTask(id)
      setTasks((prev) => prev.filter((t) => t.id !== id))
      if (selectedId === id) setSelectedId(null)
    } catch (err) {
      console.error("Error deleting task:", err)
    } finally {
      setDeleting(null)
    }
  }

  // Inline table edits: optimistic, then persist; refetch to revert on failure.
  async function handlePatch(id: string, patch: Partial<Task>) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)))
    try {
      await updateTask(id, patch)
    } catch (err) {
      console.error("Error updating task:", err)
      fetchData()
    }
  }

  async function handleSaved() {
    await fetchData()
    setSelectedId(null)
  }

  const selectedTask =
    typeof selectedId === "string" && selectedId !== "new" ? tasks.find((t) => t.id === selectedId) ?? null : null

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pt-6 pb-12 sm:px-6">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Tasks</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            All client work, live from the Firestore <code className="rounded bg-muted px-1 py-0.5 text-xs">tasks</code> collection.
          </p>
        </div>
        <Button className="shrink-0" onClick={() => setSelectedId("new")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-destructive">{error}</CardContent>
        </Card>
      ) : tasks.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="mb-4 text-muted-foreground">No tasks yet.</p>
            <Button onClick={() => setSelectedId("new")}>
              <Plus className="mr-2 h-4 w-4" />
              Add the first task
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Due</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">
                    <InlineText value={t.name} onCommit={(name) => handlePatch(t.id, { name })} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">{t.client || t.clientId || "—"}</TableCell>
                  <TableCell>
                    <InlineProject
                      projectId={t.projectId}
                      projects={projects.filter((p) => p.clientId === t.clientId)}
                      onChange={(p) => handlePatch(t.id, { projectId: p.id, project: p.title })}
                    />
                  </TableCell>
                  <TableCell>
                    <InlineSelect
                      value={t.status}
                      options={STATUS_OPTIONS}
                      onChange={(status) => handlePatch(t.id, { status })}
                      renderOption={(s) => taskStatusMeta[s].label}
                      trigger={
                        <Badge className={(taskStatusMeta[t.status] ?? taskStatusMeta.todo).className}>
                          {(taskStatusMeta[t.status] ?? taskStatusMeta.todo).label}
                        </Badge>
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <InlineSelect
                      value={t.priority}
                      options={PRIORITY_OPTIONS}
                      onChange={(priority) => handlePatch(t.id, { priority })}
                      renderOption={(p) => taskPriorityMeta[p].label}
                      trigger={
                        <Badge className={(taskPriorityMeta[t.priority] ?? taskPriorityMeta.medium).className}>
                          {(taskPriorityMeta[t.priority] ?? taskPriorityMeta.medium).label}
                        </Badge>
                      }
                    />
                  </TableCell>
                  <TableCell className="text-muted-foreground">{formatTimestamp(t.createdAt)}</TableCell>
                  <TableCell>
                    <InlineDate value={t.dueDate} onCommit={(dueDate) => handlePatch(t.id, { dueDate })} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => setSelectedId(t.id)}
                        aria-label="Edit task"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            aria-label="Delete task"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete task?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This permanently deletes &quot;{t.name || "this task"}&quot;. This cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(t.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              {deleting === t.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Sheet open={selectedId !== null} onOpenChange={(open) => !open && setSelectedId(null)}>
        <SheetContent side="right" className="w-full gap-0 overflow-y-auto sm:max-w-lg">
          <SheetHeader className="border-b">
            <SheetTitle>{selectedId === "new" ? "New task" : "Edit task"}</SheetTitle>
            <SheetDescription>
              {selectedId === "new" ? "Create a task for any client." : selectedTask?.name ?? ""}
            </SheetDescription>
          </SheetHeader>
          <div className="p-4">
            {selectedId !== null && (
              <TaskForm
                key={selectedId}
                task={selectedId === "new" ? null : selectedTask}
                onSaved={handleSaved}
                onCancel={() => setSelectedId(null)}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </main>
  )
}
