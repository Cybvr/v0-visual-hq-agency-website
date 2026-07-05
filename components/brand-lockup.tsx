"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

type BrandLockupProps = {
  className?: string
  invert?: boolean
  logoSize?: number
  gapClassName?: string
  textClassName?: string
  wordmarkScale?: number
}

export function BrandLockup({
  className,
  invert = false,
  logoSize = 28,
  gapClassName = "gap-0.5",
  textClassName,
  wordmarkScale = 0.92,
}: BrandLockupProps) {
  return (
    <span className={cn("inline-flex items-center", gapClassName, className)}>
      <Image
        src="/visualhqlogo.svg"
        alt="Visualcore"
        width={logoSize}
        height={logoSize}
        className={cn("shrink-0", invert && "brightness-0 invert")}
      />
      <span
        className={cn(
          "geist-pixel-wordmark font-normal leading-none tracking-tight",
          invert ? "text-primary-foreground" : "text-foreground",
          textClassName,
        )}
        style={{
          fontSize: `${Math.round(logoSize * wordmarkScale)}px`,
          lineHeight: "0.82",
        }}
      >
        Visualcore
      </span>
    </span>
  )
}
