import { cn } from "@/lib/utils"

/** A single Industry/Location/Website-style fact tile, shared by the company dashboard and its public page. */
export function InfoCard({ label, value, emptyLabel = "Not set" }: { label: string; value: string; emptyLabel?: string }) {
  return (
    <div className="rounded-2xl bg-card p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p
        className={cn(
          "mt-2 text-lg font-semibold",
          !value && "text-base font-normal italic text-muted-foreground/70",
        )}
      >
        {value || emptyLabel}
      </p>
    </div>
  )
}
