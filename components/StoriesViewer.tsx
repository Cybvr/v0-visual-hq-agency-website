"use client"

import type React from "react"

import { ChevronUp, ChevronDown } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { stories } from "@/lib/stories"

export function StoriesViewer() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState(0)
  const [videoError, setVideoError] = useState(false)
  const [progress, setProgress] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const storyTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const STORY_DURATION = 5000 // 5 seconds per story

  const currentStory = stories[currentIndex]

  const formatFollowers = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setProgress(0)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setProgress(0)
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart(e.clientY)
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging) return
    setIsDragging(false)

    const dragEnd = e.clientY
    const dragDistance = dragStart - dragEnd

    if (Math.abs(dragDistance) > 50) {
      if (dragDistance > 0) {
        handleNext()
      } else {
        handlePrev()
      }
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    setDragStart(e.touches[0].clientY)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return
    setIsDragging(false)

    const dragEnd = e.changedTouches[0].clientY
    const dragDistance = dragStart - dragEnd

    if (Math.abs(dragDistance) > 50) {
      if (dragDistance > 0) {
        handleNext()
      } else {
        handlePrev()
      }
    }
  }

  useEffect(() => {
    setProgress(0)

    // Clear existing timers
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
    }
    if (storyTimeoutRef.current) {
      clearTimeout(storyTimeoutRef.current)
    }

    // Progress bar animation
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 100 / (STORY_DURATION / 50)
        return next >= 100 ? 100 : next
      })
    }, 50)

    progressIntervalRef.current = interval

    // Auto-advance to next story
    const timeout = setTimeout(() => {
      if (currentIndex < stories.length - 1) {
        setCurrentIndex((prev) => prev + 1)
      }
    }, STORY_DURATION)

    storyTimeoutRef.current = timeout

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
      if (storyTimeoutRef.current) {
        clearTimeout(storyTimeoutRef.current)
      }
    }
  }, [currentIndex])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") handlePrev()
      if (e.key === "ArrowDown") handleNext()
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentIndex])

  useEffect(() => {
    setVideoError(false)
    if (videoRef.current && !videoError) {
      videoRef.current.load()
      videoRef.current.play().catch(() => {
        setVideoError(true)
      })
    }
  }, [currentIndex])

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[9/16] max-h-[600px] overflow-hidden bg-black rounded-lg"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {videoError ? (
        <img
          src={currentStory.thumbnailUrl || "/placeholder.svg"}
          alt={currentStory.handle}
          className="w-full h-full object-cover"
        />
      ) : (
        <video
          ref={videoRef}
          src={currentStory.videoUrl}
          poster={currentStory.thumbnailUrl}
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          onError={() => {
            setVideoError(true)
          }}
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40 pointer-events-none" />

      <div className="absolute top-4 left-4 right-4 flex gap-1 z-10">
        {stories.map((_, idx) => (
          <div key={idx} className="h-0.5 flex-1 bg-white/25 rounded-full overflow-hidden">
            <div
              className={`h-full bg-white transition-all duration-100 ${
                idx === currentIndex ? "opacity-100" : idx < currentIndex ? "opacity-50" : "opacity-0"
              }`}
              style={{
                width: idx === currentIndex ? `${progress}%` : idx < currentIndex ? "100%" : "0%",
              }}
            />
          </div>
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white/30 flex-shrink-0">
            <img
              src={currentStory.avatarUrl || "/placeholder.svg"}
              alt={currentStory.handle}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-white text-lg font-semibold mb-1">{currentStory.handle}</h3>
            <p className="text-white/70 text-sm">{formatFollowers(currentStory.followers)} followers</p>
          </div>
        </div>
      </div>

      {currentIndex > 0 && (
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 hover:opacity-70 transition-opacity"
          aria-label="Previous story"
        >
          <ChevronUp className="w-8 h-8 text-white" />
        </button>
      )}

      {currentIndex < stories.length - 1 && (
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 hover:opacity-70 transition-opacity"
          aria-label="Next story"
        >
          <ChevronDown className="w-8 h-8 text-white" />
        </button>
      )}
    </div>
  )
}
