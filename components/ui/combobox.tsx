"use client"

import { useState } from "react"
import { Check, ChevronsUpDown, Loader2, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export interface ComboboxOption {
  value: string
  label: string
}

/**
 * A searchable single-select that can also make a new option from whatever the
 * person typed. Pass `onCreate` to turn on the "Create X" row: it runs when no
 * existing option matches the search, and returning the new option selects it.
 * Leave `onCreate` off for a plain searchable picker.
 */
export function Combobox({
  options,
  value,
  onChange,
  onCreate,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  emptyText = "Nothing found.",
  createLabel = (query) => `Create “${query}”`,
  createHint = "Type a name to add",
  disabled = false,
  loading = false,
  id,
  className,
}: {
  options: ComboboxOption[]
  value: string
  onChange: (value: string) => void
  /** When set, an unmatched search offers a create row. Return the new option, or null to cancel. */
  onCreate?: (name: string) => Promise<ComboboxOption | null>
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  createLabel?: (query: string) => string
  /** Shown on the create row before anything is typed. */
  createHint?: string
  disabled?: boolean
  loading?: boolean
  id?: string
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [creating, setCreating] = useState(false)

  const selected = options.find((option) => option.value === value)
  const trimmed = query.trim()
  const hasExactMatch = options.some(
    (option) => option.label.trim().toLowerCase() === trimmed.toLowerCase(),
  )
  const canCreate = Boolean(onCreate) && trimmed.length > 0 && !hasExactMatch

  async function create() {
    if (!onCreate || !trimmed || creating) return
    setCreating(true)
    try {
      const created = await onCreate(trimmed)
      if (created) {
        onChange(created.value)
        setOpen(false)
        setQuery("")
      }
    } finally {
      setCreating(false)
    }
  }

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) setQuery("")
      }}
    >
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled || loading}
          className={cn("w-full justify-between px-3 font-normal", !selected && "text-muted-foreground", className)}
        >
          <span className="truncate">{loading ? "Loading..." : selected?.label ?? placeholder}</span>
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="min-w-[240px] p-0"
        style={{ width: "var(--radix-popover-trigger-width)" }}
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder} value={query} onValueChange={setQuery} />
          {/* The dialog's scroll lock swallows the native wheel, so drive the list scroll by hand. */}
          <CommandList onWheel={(event) => { event.currentTarget.scrollTop += event.deltaY }}>
            <CommandEmpty className="py-4 text-center text-sm text-muted-foreground">{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => {
                    onChange(option.value)
                    setOpen(false)
                    setQuery("")
                  }}
                >
                  <Check className={cn("mr-2 size-4", value === option.value ? "opacity-100" : "opacity-0")} />
                  <span className="truncate">{option.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          {onCreate && (
            <div className="border-t border-border p-1">
              <button
                type="button"
                disabled={!canCreate || creating}
                onClick={create}
                className="flex w-full items-center rounded-sm px-2 py-2 text-left text-sm outline-none hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
              >
                {creating ? <Loader2 className="mr-2 size-4 shrink-0 animate-spin" /> : <Plus className="mr-2 size-4 shrink-0" />}
                <span className="truncate">{trimmed ? createLabel(trimmed) : createHint}</span>
              </button>
            </div>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  )
}
