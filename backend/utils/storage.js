// Image uploads via Supabase Storage (replaces Cloudinary).
// Buckets are public; uploads use the service-role client from ./supabase.
//
// Storage budget: every vendor upload is compressed to WebP and kept tiny so a
// whole vendor account (avatar + cover + portfolio) stays around ~1MB.
// Per-vendor quota is enforced in routes via getVendorUsage().
const crypto = require('crypto')
const sharp = require('sharp')
const { getSupabase } = require('./supabase')

const BUCKETS = {
  profile: 'vendor-profiles',
  cover: 'vendor-covers',
  portfolio: 'vendor-portfolio',
}

// Target output per image kind — tuned so total usage stays ≈1MB or less.
const PRESETS = {
  profile: { maxDim: 512, quality: 72, maxBytes: 80 * 1024 }, // ~40-80KB avatar
  cover: { maxDim: 1600, quality: 70, maxBytes: 300 * 1024 }, // ~150-300KB banner
  portfolio: { maxDim: 1280, quality: 68, maxBytes: 220 * 1024 }, // ~120-220KB each
}

// Total storage budget per vendor (bytes). Override with env.
const VENDOR_QUOTA_BYTES =
  Math.max(1, Number(process.env.VENDOR_STORAGE_QUOTA_MB) || 5) * 1024 * 1024
// Max portfolio images per vendor — caps worst-case usage even under quota.
const MAX_PORTFOLIO_IMAGES = Number(process.env.VENDOR_MAX_PORTFOLIO_IMAGES) || 12

/**
 * Compress any input image to a small WebP buffer.
 * Steps down quality until under maxBytes (min quality 40), then returns.
 */
async function compressImage(buffer, kind) {
  const preset = PRESETS[kind] || PRESETS.portfolio
  let quality = preset.quality
  let out = null

  // Normalise: auto-rotate, resize inside maxDim, convert to WebP.
  while (quality >= 40) {
    out = await sharp(buffer, { failOn: 'none' })
      .rotate()
      .resize({
        width: preset.maxDim,
        height: preset.maxDim,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality, effort: 4 })
      .toBuffer()
    if (out.length <= preset.maxBytes || quality === 40) break
    quality -= 10
  }
  return { buffer: out, quality }
}

/**
 * Upload a multer memory buffer to Supabase Storage and return the public URL.
 * The image is compressed to WebP first, so stored bytes stay tiny.
 */
async function uploadImage(buffer, file, kind, ownerId) {
  const supabase = getSupabase()
  const bucket = BUCKETS[kind] || BUCKETS.portfolio
  const { buffer: small } = await compressImage(buffer, kind)
  const path = `${ownerId}/${Date.now()}-${crypto.randomBytes(6).toString('hex')}.webp`

  const { error } = await supabase.storage.from(bucket).upload(path, small, {
    contentType: 'image/webp',
    upsert: false,
  })
  if (error) throw new Error(`Image upload failed: ${error.message}`)

  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

/**
 * Sum stored bytes for one vendor across all buckets.
 * Folder layout is `<providerId>/...` in every bucket.
 */
async function getVendorUsage(ownerId) {
  const supabase = getSupabase()
  const perBucket = {}
  let totalBytes = 0
  let totalFiles = 0

  for (const bucket of Object.values(BUCKETS)) {
    try {
      const { data, error } = await supabase.storage.from(bucket).list(ownerId, {
        limit: 1000,
      })
      if (error || !Array.isArray(data)) {
        perBucket[bucket] = { bytes: 0, files: 0 }
        continue
      }
      let bytes = 0
      for (const f of data) {
        // supabase-js returns size in metadata for storage list
        const size = Number(f?.metadata?.size) || 0
        bytes += size
      }
      perBucket[bucket] = { bytes, files: data.length }
      totalBytes += bytes
      totalFiles += data.length
    } catch {
      perBucket[bucket] = { bytes: 0, files: 0 }
    }
  }

  return { totalBytes, totalFiles, perBucket, quotaBytes: VENDOR_QUOTA_BYTES }
}

/**
 * Best-effort delete of a storage object when the URL belongs to our buckets.
 * Never throws — callers treat this as cleanup, not as the source of truth
 * (the URL is always removed from the provider row regardless).
 */
async function deleteImageIfOwned(url) {
  try {
    if (!url || typeof url !== 'string') return
    const supabase = getSupabase()
    for (const bucket of Object.values(BUCKETS)) {
      const marker = `/${bucket}/`
      const idx = url.indexOf(marker)
      if (idx === -1) continue
      const path = url.slice(idx + marker.length).split('?')[0]
      if (!path) continue
      await supabase.storage.from(bucket).remove([path])
      return
    }
  } catch (err) {
    console.error('Storage cleanup failed (non-fatal):', err.message)
  }
}

module.exports = {
  uploadImage,
  deleteImageIfOwned,
  getVendorUsage,
  compressImage,
  BUCKETS,
  VENDOR_QUOTA_BYTES,
  MAX_PORTFOLIO_IMAGES,
}
