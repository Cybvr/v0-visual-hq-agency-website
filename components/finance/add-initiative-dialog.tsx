"use client"

import { useState, type FormEvent, type ReactNode } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { holdingCompanies } from "@/lib/finance/portfolio"

interface AddInitiativeDialogProps {
  /** Pre-selected holding when the dialog is opened from a company-scoped surface. */
  defaultCompanyId?: string
  /** Custom trigger — falls back to a standard "Log New Initiative" button. */
  trigger?: ReactNode
}

export function AddInitiativeDialog({ defaultCompanyId, trigger }: AddInitiativeDialogProps) {
  const [open, setOpen] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Placeholder submit — swap for a real mutation when the initiatives API is wired.
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="ghost" size="sm">
            <Plus className="size-4" />
            Log New Initiative
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log new value-creation initiative</DialogTitle>
          <DialogDescription>
            Add an operating improvement workstream. It appears immediately on the Value Creation dashboard.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="initiative-name">Initiative name</Label>
              <Input id="initiative-name" placeholder="e.g. Pricing Optimization AI" required />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="initiative-company">Holding company</Label>
              <Select defaultValue={defaultCompanyId ?? holdingCompanies[0]?.id}>
                <SelectTrigger id="initiative-company">
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
                <SelectContent>
                  {holdingCompanies.map((holding) => (
                    <SelectItem key={holding.id} value={holding.id}>
                      {holding.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="initiative-status">Status</Label>
              <Select defaultValue="on-track">
                <SelectTrigger id="initiative-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="on-track">On Track</SelectItem>
                  <SelectItem value="delayed">Delayed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="initiative-progress">Progress (%)</Label>
              <Input
                id="initiative-progress"
                type="number"
                min={0}
                max={100}
                defaultValue={0}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="initiative-context">Context</Label>
              <Textarea
                id="initiative-context"
                rows={3}
                placeholder="Phase, owning workstream, and near-term milestone…"
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Log initiative</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
