const MAX_SOURCE_BYTES = 12 * 1024 * 1024
const MAX_OUTPUT_BYTES = 1.75 * 1024 * 1024
const MAX_IMAGE_EDGE = 1600

function imageBlob(canvas: HTMLCanvasElement, type: string, quality?: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("The image could not be prepared.")), type, quality)
  })
}

/**
 * Keeps uploaded raster images email- and browser-friendly without changing
 * ordinary documents or vector assets. Large images are resized and encoded
 * before Firebase Storage sees them.
 */
export async function prepareImageForUpload(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml") return file
  if (file.size > MAX_SOURCE_BYTES) throw new Error("That image is larger than 12 MB.")

  const bitmap = await createImageBitmap(file)
  try {
    const longestEdge = Math.max(bitmap.width, bitmap.height)
    const scale = Math.min(1, MAX_IMAGE_EDGE / longestEdge)
    const canvas = document.createElement("canvas")
    canvas.width = Math.max(1, Math.round(bitmap.width * scale))
    canvas.height = Math.max(1, Math.round(bitmap.height * scale))
    const context = canvas.getContext("2d")
    if (!context) throw new Error("The image could not be prepared.")
    context.imageSmoothingEnabled = true
    context.imageSmoothingQuality = "high"
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)

    const preservePng = file.type === "image/png"
    let outputType = preservePng ? "image/png" : "image/jpeg"
    let quality = preservePng ? undefined : 0.82
    let blob = await imageBlob(canvas, outputType, quality)

    // PNG screenshots and photos can still be too heavy after resizing. A
    // white-backed JPEG is a safe email fallback once the size ceiling is hit.
    if (blob.size > MAX_OUTPUT_BYTES && outputType !== "image/jpeg") {
      context.save()
      context.globalCompositeOperation = "destination-over"
      context.fillStyle = "#ffffff"
      context.fillRect(0, 0, canvas.width, canvas.height)
      context.restore()
      outputType = "image/jpeg"
      quality = 0.82
      blob = await imageBlob(canvas, outputType, quality)
    }

    if (blob.size > MAX_OUTPUT_BYTES) {
      blob = await imageBlob(canvas, "image/jpeg", 0.68)
    }
    if (blob.size > MAX_OUTPUT_BYTES) throw new Error("That image is still too large after optimization.")

    const baseName = file.name.replace(/\.[^.]+$/, "") || "image"
    const extension = outputType === "image/png" ? "png" : "jpg"
    return new File([blob], `${baseName}.${extension}`, { type: outputType, lastModified: Date.now() })
  } finally {
    bitmap.close()
  }
}
