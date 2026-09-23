// Image uploads via Supabase Storage (replaces Cloudinary).
// Buckets are public; uploads use the service-role client from ./supabase.
const crypto = require('crypto')
const { getSupabase } = require('./supabase')

const BUCKETS = {
  profile: 'vendor-profiles',
  cover: 'vendor-covers',
  portfolio: 'vendor-portfolio',
}

const EXT_BY_MIME = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
}

function extFor(mimetype, originalName = '') {
  if (EXT_BY_MIME[mimetype]) return EXT_BY_MIME[mimetype]
  const fromName = String(originalName).split('.').pop()
  if (fromName && /^[a-z0-9]{2,5}$/i.test(fromName)) return fromName.toLowerCase()
  return 'jpg'
}

/**
 * Upload a multer memory buffer to Supabase Storage and return the public URL.
 * @param {Buffer} buffer
 * @param {{ mimetype: string, originalname?: string }} file
 * @param {'profile'|'cover'|'portfolio'} kind
 * @param {string} ownerId provider id used as a folder prefix
 */
async function uploadImage(buffer, file, kind, ownerId) {
  const supabase = getSupabase()
  const bucket = BUCKETS[kind] || BUCKETS.portfolio
  const ext = extFor(file.mimetype, file.originalname)
  const path = `${ownerId}/${Date.now()}-${crypto.randomBytes(6).toString('hex')}.${ext}`

  const { error } = await supabase.storage.from(bucket).upload(path, buffer, {
    contentType: file.mimetype || 'image/jpeg',
    upsert: false,
  })
  if (error) throw new Error(`Image upload failed: ${error.message}`)

  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
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

module.exports = { uploadImage, deleteImageIfOwned, BUCKETS }
