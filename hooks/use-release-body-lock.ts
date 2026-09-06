"use client"

import * as React from "react"

/**
 * Radix locks the page while a modal is open by setting pointer-events: none on
 * <body>, and releases it when the modal finishes closing. If the modal unmounts
 * mid-close - the usual cause being that confirming a delete removes the row
 * that was holding the dialog - that release never runs and the whole page stays
 * unclickable until a refresh.
 *
 * Call this inside a modal's content component. On unmount it checks, after the
 * current task, whether any modal is still open, and clears the lock if not.
 * The deferral matters: another modal opening in the same tick keeps its lock.
 */
export function useReleaseBodyLock() {
  React.useEffect(
    () => () => {
      if (typeof document === "undefined") return
      setTimeout(() => {
        const stillOpen = document.querySelector('[role="dialog"][data-state="open"], [role="alertdialog"][data-state="open"]')
        if (!stillOpen && document.body.style.pointerEvents === "none") {
          document.body.style.pointerEvents = ""
        }
      }, 0)
    },
    [],
  )
}
