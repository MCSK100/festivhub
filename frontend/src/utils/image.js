// Client-side image compression — shrinks uploads before they leave the
// browser so vendor storage stays around ~1MB per account. The backend
// compresses again to WebP, so this is purely a speed/courtesy pass.
export function formatKB(bytes) {
  if (!bytes && bytes !== 0) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1048576) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / 1048576).toFixed(2)} MB`
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Could not read image file'))
    }
    img.src = url
  })
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Compression failed'))),
      type,
      quality
    )
  })
}

/**
 * Downscale + re-encode an image file.
 * @param {File} file
 * @param {'avatar'|'cover'|'portfolio'} kind
 * @returns {Promise<{file: File, originalBytes: number, compressedBytes: number}>}
 */
export async function compressImageFile(file, kind = 'portfolio') {
  if (!file || !file.type.startsWith('image/')) {
    throw new Error('Please select an image file')
  }
  // Tiny files need no work.
  if (file.size <= 150 * 1024) {
    return { file, originalBytes: file.size, compressedBytes: file.size }
  }

  const maxDim = kind === 'avatar' ? 512 : kind === 'cover' ? 1600 : 1280
  const img = await loadImage(file)
  const scale = Math.min(1, maxDim / Math.max(img.naturalWidth, img.naturalHeight))
  const w = Math.max(1, Math.round(img.naturalWidth * scale))
  const h = Math.max(1, Math.round(img.naturalHeight * scale))

  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, w, h)

  const type = 'image/jpeg'
  let quality = 0.78
  let blob = await canvasToBlob(canvas, type, quality)
  const target = kind === 'avatar' ? 90 * 1024 : 280 * 1024
  while (blob.size > target && quality > 0.45) {
    quality -= 0.12
    blob = await canvasToBlob(canvas, type, quality)
  }

  // Keep the original if compression somehow made it bigger.
  if (blob.size >= file.size) {
    return { file, originalBytes: file.size, compressedBytes: file.size }
  }
  const name = (file.name || 'image').replace(/\.[a-z0-9]+$/i, '') + '.jpg'
  const out = new File([blob], name, { type })
  return { file: out, originalBytes: file.size, compressedBytes: out.size }
}
