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
const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
const ACCEPTED_EXTS = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif']

export function validateImageFile(file) {
  if (!file) throw new Error('No file selected')
  const ext = String(file.name || '').split('.').pop().toLowerCase()
  if (!ACCEPTED_TYPES.includes(file.type) || !ACCEPTED_EXTS.includes(ext)) {
    throw new Error('Only JPG, PNG, WEBP, GIF or AVIF images are allowed')
  }
  if (file.size > 8 * 1024 * 1024) {
    throw new Error('Image must be smaller than 8MB')
  }
  if (file.size === 0) {
    throw new Error('That file is empty — please choose another image')
  }
  return true
}

export async function compressImageFile(file, kind = 'portfolio') {
  validateImageFile(file)
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
