import { useCallback, useMemo, useState } from "react"

/**
 * Checkbox selection for a list/table. Tracks selected ids and derives
 * select-all state from the currently visible items, so filtering never leaves
 * stale ids in a bulk action.
 */
export function useRowSelection<T>(items: T[], getId: (item: T) => string) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const ids = useMemo(() => items.map(getId), [items, getId])

  const toggle = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const clear = useCallback(() => setSelected(new Set()), [])

  const toggleAll = useCallback(() => {
    setSelected((prev) => {
      const next = new Set(prev)
      const allOn = ids.length > 0 && ids.every((id) => next.has(id))
      if (allOn) ids.forEach((id) => next.delete(id))
      else ids.forEach((id) => next.add(id))
      return next
    })
  }, [ids])

  const selectedIds = useMemo(() => ids.filter((id) => selected.has(id)), [ids, selected])
  const allSelected = ids.length > 0 && selectedIds.length === ids.length
  const someSelected = selectedIds.length > 0 && !allSelected

  return {
    selectedIds,
    selectedCount: selectedIds.length,
    isSelected: useCallback((id: string) => selected.has(id), [selected]),
    toggle,
    toggleAll,
    clear,
    allSelected,
    someSelected,
  }
}
