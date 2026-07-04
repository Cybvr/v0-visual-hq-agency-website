"use client"

import { useRef, useState } from "react"
import { Upload, X, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!

async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", UPLOAD_PRESET)

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: formData,
  })

  if (!res.ok) throw new Error("Upload failed")
  const data = await res.json()
  return data.secure_url as string
}

interface ImageDropzoneProps {
  value: string
  onChange: (url: string) => void
  label?: string
}

export function ImageDropzone({ value, onChange, label }: ImageDropzoneProps) {
  const [uploading, setUploading] = useState(false)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return
    setUploading(true)
    try {
      const url = await uploadToCloudinary(file)
      onChange(url)
    } catch (e) {
      console.error("Upload error:", e)
    } finally {
      setUploading(false)
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div className="space-y-1.5">
      {label && <p className="text-sm font-medium leading-none">{label}</p>}
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg transition-colors cursor-pointer",
          dragging ? "border-accent bg-accent/10" : "border-border hover:border-accent/60",
          value ? "p-2" : "p-8"
        )}
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        {uploading ? (
          <div className="flex flex-col items-center justify-center gap-2 h-24 text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin" />
            <p className="text-xs">Uploading…</p>
          </div>
        ) : value ? (
          <div className="relative group">
            <img src={value} alt="" className="w-full h-48 object-cover rounded" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
              <p className="text-white text-sm font-medium">Click or drop to replace</p>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onChange("") }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center shadow"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Upload className="w-8 h-8" />
            <p className="text-sm">Drop image here or click to browse</p>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFile(file)
            e.target.value = ""
          }}
        />
      </div>
    </div>
  )
}

interface GalleryDropzoneProps {
  value: string[]
  onChange: (urls: string[]) => void
}

export function GalleryDropzone({ value, onChange }: GalleryDropzoneProps) {
  const [uploading, setUploading] = useState(false)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFiles(files: FileList) {
    setUploading(true)
    try {
      const uploads = await Promise.all(
        Array.from(files)
          .filter((f) => f.type.startsWith("image/"))
          .map(uploadToCloudinary)
      )
      onChange([...value, ...uploads])
    } catch (e) {
      console.error("Upload error:", e)
    } finally {
      setUploading(false)
    }
  }

  function removeImage(index: number) {
    onChange(value.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-3">
      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {value.map((url, i) => (
            <div key={i} className="relative group aspect-square">
              <img src={url} alt="" className="w-full h-full object-cover rounded" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors",
          dragging ? "border-accent bg-accent/10" : "border-border hover:border-accent/60"
        )}
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files)
        }}
      >
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          {uploading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              <p className="text-sm">Uploading…</p>
            </>
          ) : (
            <>
              <Upload className="w-6 h-6" />
              <p className="text-sm">Drop images here or click to browse</p>
              <p className="text-xs">You can select multiple files</p>
            </>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) handleFiles(e.target.files)
            e.target.value = ""
          }}
        />
      </div>
    </div>
  )
}
