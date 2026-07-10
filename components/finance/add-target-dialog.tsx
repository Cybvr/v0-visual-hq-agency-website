"use client"

import { useState, type FormEvent } from "react"
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

export function AddTargetDialog() {
  const [open, setOpen] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Intake is a placeholder — swap for a real mutation when the sourcing API is wired.
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" />
          Add Target
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add sourcing target</DialogTitle>
          <DialogDescription>
            Log a new opportunity so it appears in the sourcing funnel and diligence tracker.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="target-name">Company name</Label>
              <Input id="target-name" placeholder="e.g. Skyward Avionics" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="target-sector">Sector</Label>
              <Input id="target-sector" placeholder="e.g. Aerospace &amp; Defense" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="target-size">Deal size ($M)</Label>
              <Input id="target-size" inputMode="numeric" placeholder="e.g. 240" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="target-stage">Initial stage</Label>
              <Select defaultValue="sourcing">
                <SelectTrigger id="target-stage">
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sourcing">Sourcing</SelectItem>
                  <SelectItem value="ndas">NDAs</SelectItem>
                  <SelectItem value="lois">LOIs</SelectItem>
                  <SelectItem value="due-diligence">Due Diligence</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="target-notes">Sourcing notes</Label>
              <Textarea
                id="target-notes"
                rows={3}
                placeholder="Origin, thesis, next step…"
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add to sourcing</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
