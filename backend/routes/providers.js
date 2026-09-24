const express = require('express')
const router = express.Router()
const { z } = require('zod')
const { getSupabase } = require('../utils/supabase')
const { uploadImage, deleteImageIfOwned, getVendorUsage, VENDOR_QUOTA_BYTES, MAX_PORTFOLIO_IMAGES } = require('../utils/storage')
const Providers = require('../db/providers')
const Users = require('../db/users')
const authMiddleware = require('../middleware/auth')
const multer = require('multer')

// Canonical marketplace categories (kept in sync with supabase/schema docs).
const CATEGORIES = [
  'Photography',
  'Videography',
  'Catering',
  'Decoration',
  'Makeup & Beauty',
  'DJ & Music',
  'Event Planning',
  'Venues',
  'Mehendi',
  'Invitation & Printing',
  'Florists',
  'Entertainment',
  // legacy (existing data)
  'Photographer',
  'Catering',
  'DJ',
  'Decorations',
  'Florist',
  'Lighting',
]

// Multer configuration — accepts up to 8MB inputs because every image is
// compressed to a tiny WebP (≤300KB) before it reaches Supabase Storage.
const storage = multer.memoryStorage()
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 8 * 1024 * 1024, // 8MB input limit (stored size is ~10x smaller)
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'), false)
    }
  }
})

// Validation schemas — accept the full marketplace category list
const createProviderSchema = z.object({
  name: z.string().min(2),
  category: z.enum(CATEGORIES),
  experience: z.union([z.string(), z.number()]).transform(String),
  location: z.object({
    city: z.string(),
    state: z.string()
  }),
  priceRange: z.string()
})

// Legacy → canonical category matching so old vendors still surface
// when customers filter by the new names.
const CATEGORY_ALIASES = {
  'Photography': ['Photography', 'Photographer'],
  'Videography': ['Videography'],
  'Catering': ['Catering'],
  'Decoration': ['Decoration', 'Decorations'],
  'Makeup & Beauty': ['Makeup & Beauty'],
  'DJ & Music': ['DJ & Music', 'DJ'],
  'Event Planning': ['Event Planning'],
  'Venues': ['Venues'],
  'Mehendi': ['Mehendi'],
  'Invitation & Printing': ['Invitation & Printing'],
  'Florists': ['Florists', 'Florist'],
  'Entertainment': ['Entertainment'],
  // legacy filters still work
  'Photographer': ['Photographer', 'Photography'],
  'DJ': ['DJ', 'DJ & Music'],
  'Decorations': ['Decorations', 'Decoration'],
  'Florist': ['Florist', 'Florists'],
  'Lighting': ['Lighting'],
}

// Create provider
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'vendor') {
      return res.status(403).json({ error: 'Only vendors can create a provider profile' })
    }
    const existing = await Providers.findRawByUserId(req.user._id)
    if (existing) {
      return res.status(400).json({ error: 'Provider profile already exists. Use PUT /profile to update.' })
    }
    const data = createProviderSchema.parse(req.body)
    const provider = await Providers.create({
      user_id: req.user._id,
      name: data.name,
      category: data.category,
      experience: String(data.experience),
      city: data.location.city,
      state: data.location.state,
      price_range: data.priceRange,
    })
    await Users.update(req.user._id, { provider_profile_id: provider.id }).catch(() => {})
    res.status(201).json(provider)
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ errors: error.errors })
    }
    res.status(500).json({ error: error.message })
  }
})

// Upload gallery image (Supabase Storage → public URL appended to portfolio)
router.post('/:id/gallery', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const raw = await Providers.findRawByUserId(req.user._id)
    if (!raw || raw.id !== id) {
      return res.status(403).json({ error: 'Not authorized for this provider' })
    }

    const existing = raw.portfolio_images || []
    if (existing.length >= MAX_PORTFOLIO_IMAGES) {
      return res.status(400).json({ error: `Portfolio is full (max ${MAX_PORTFOLIO_IMAGES} images). Delete one to add another.` })
    }

    // Quota: worst-case new file is ~220KB after compression.
    const usage = await getVendorUsage(raw.id).catch(() => null)
    if (usage && usage.totalBytes + 250 * 1024 > VENDOR_QUOTA_BYTES) {
      return res.status(413).json({
        error: `Storage full (${(usage.totalBytes / 1048576).toFixed(2)}MB of ${(VENDOR_QUOTA_BYTES / 1048576).toFixed(0)}MB used). Delete an image to free space.`,
      })
    }

    const url = await uploadImage(req.file.buffer, req.file, 'portfolio', raw.id)
    const next = [...(raw.portfolio_images || []), url]
    const { data, error } = await getSupabase()
      .from('service_providers')
      .update({ portfolio_images: next })
      .eq('id', raw.id)
      .select('*')
      .single()
    if (error) throw error

    res.json({ url })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ error: error.message })
  }
})

// Get current vendor's profile
router.get('/me', authMiddleware, async (req, res) => {
  try {
    let provider = await Providers.findByUserId(req.user._id)
    if (!provider) {
      if (req.user.role === 'vendor') {
        provider = await Providers.create({
          user_id: req.user._id,
          name: req.user.name || String(req.user.email).split('@')[0],
          category: 'Photography',
          experience: '0',
          company_name: '',
          description: '',
          profile_image: req.user.avatar || '',
          city: '',
          state: '',
          price_range: 'Contact for pricing',
          starting_price: 0,
          portfolio_images: [],
          gallery: []
        })
        // Link back to user row
        await Users.update(req.user._id, { provider_profile_id: provider.id }).catch(() => {})
      } else {
        return res.status(404).json({ error: 'Provider profile not found' })
      }
    }
    res.json(provider)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Storage usage for the current vendor (drives the dashboard storage meter).
router.get('/storage/usage', authMiddleware, async (req, res) => {
  try {
    const raw = await Providers.findRawByUserId(req.user._id)
    if (!raw) return res.status(404).json({ error: 'Provider profile not found' })
    const usage = await getVendorUsage(raw.id)
    res.json({
      ...usage,
      quotaMB: VENDOR_QUOTA_BYTES / 1048576,
      maxPortfolioImages: MAX_PORTFOLIO_IMAGES,
      portfolioCount: (raw.portfolio_images || []).length,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get all with real search / filters / sort / pagination.
// Back-compat: plain array when no pagination params are given.
router.get('/', async (req, res) => {
  try {
    const { category, location, q, search, sort, page, limit, minPrice, maxPrice } = req.query
    const term = (q || search || '').trim().toLowerCase()
    const loc = (location || '').trim().toLowerCase()

    let list = await Providers.listPublished(1000)

    if (category && category !== 'All') {
      const cats = CATEGORY_ALIASES[category] || [category]
      list = list.filter((p) => cats.includes(p.category))
    }
    if (loc) {
      list = list.filter((p) =>
        (p.location?.city || '').toLowerCase().includes(loc) ||
        (p.location?.state || '').toLowerCase().includes(loc)
      )
    }
    if (term) {
      list = list.filter((p) =>
        (p.name || '').toLowerCase().includes(term) ||
        (p.companyName || '').toLowerCase().includes(term) ||
        (p.description || '').toLowerCase().includes(term) ||
        (p.category || '').toLowerCase().includes(term) ||
        (p.location?.city || '').toLowerCase().includes(term) ||
        (p.services || []).some((s) => (s.name || '').toLowerCase().includes(term))
      )
    }
    if (minPrice !== undefined && minPrice !== '') {
      const n = Number(minPrice) || 0
      list = list.filter((p) => Number(p.startingPrice) >= n)
    }
    if (maxPrice !== undefined && maxPrice !== '') {
      const n = Number(maxPrice)
      if (Number.isFinite(n)) list = list.filter((p) => Number(p.startingPrice) <= n)
    }

    if (sort === 'newest') list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    else if (sort === 'price-low') list.sort((a, b) => Number(a.startingPrice) - Number(b.startingPrice))
    else if (sort === 'price-high') list.sort((a, b) => Number(b.startingPrice) - Number(a.startingPrice))
    else list.sort((a, b) => (Number(b.ratings?.average) - Number(a.ratings?.average)) || (Number(b.ratings?.count) - Number(a.ratings?.count)))

    const usePaging = page !== undefined || limit !== undefined
    if (!usePaging) {
      return res.json(list.slice(0, 200))
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1)
    const perPage = Math.min(48, Math.max(1, parseInt(limit, 10) || 12))
    const total = list.length
    const vendors = list.slice((pageNum - 1) * perPage, pageNum * perPage)
    res.json({ vendors, total, page: pageNum, pages: Math.max(1, Math.ceil(total / perPage)) })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get single provider by id (public detail page)
router.get('/:id', async (req, res) => {
  try {
    const provider = await Providers.findById(req.params.id)
    if (!provider) {
      return res.status(404).json({ error: 'Provider not found' })
    }
    res.json(provider)
  } catch (error) {
    res.status(400).json({ error: 'Invalid provider id' })
  }
})

const serviceInput = z.object({
  name: z.string().min(2).max(120),
  description: z.string().max(1000).optional().default(''),
  startingPrice: z.union([z.string(), z.number()]).optional().transform((v) => {
    if (v === undefined || v === '' || v === null) return 0
    const n = Number(v)
    return Number.isFinite(n) && n >= 0 ? n : 0
  }),
})

const packageInput = z.object({
  name: z.string().min(2).max(120),
  price: z.union([z.string(), z.number()]).transform((v) => {
    const n = Number(v)
    if (!Number.isFinite(n) || n < 0) throw new Error('Invalid price')
    return n
  }),
  description: z.string().max(1000).optional().default(''),
  features: z.array(z.string().max(200)).max(20).optional().default([]),
})

// Update vendor profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    // Allowlist → prevent mass-assignment of user_id/ratings/_id
    const ALLOWED = ['name', 'companyName', 'category', 'experience', 'description', 'profileImage', 'coverImage', 'phone', 'contactEmail', 'location', 'socialLinks', 'priceRange', 'startingPrice', 'businessHours', 'availability', 'isPublished', 'portfolioImages', 'gallery', 'services', 'packages']
    const updateData = {}
    for (const key of ALLOWED) {
      if (req.body[key] !== undefined) updateData[key] = req.body[key]
    }

    if (updateData.category && !CATEGORIES.includes(updateData.category)) {
      return res.status(400).json({ error: 'Invalid category' })
    }

    // Full-array service/package replacement (validated) when provided
    const { services, packages, ...rest } = updateData
    const provider = await Providers.updateByUserId(req.user._id, rest)
    if (!provider) {
      return res.status(404).json({ error: 'Provider profile not found' })
    }

    if (services !== undefined) {
      const parsed = z.array(serviceInput).parse(services)
      await Providers.replaceServices(provider.id, parsed)
    }
    if (packages !== undefined) {
      const parsed = z.array(packageInput).parse(packages)
      await Providers.replacePackages(provider.id, parsed)
    }

    const fresh = await Providers.findById(provider.id)
    res.json(fresh)
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors?.[0]?.message || 'Invalid profile data' })
    }
    res.status(500).json({ error: error.message })
  }
})

// Services CRUD (vendor-owned)
router.post('/services', authMiddleware, async (req, res) => {
  try {
    const data = serviceInput.parse(req.body)
    const raw = await Providers.findRawByUserId(req.user._id)
    if (!raw) return res.status(404).json({ error: 'Provider profile not found' })
    const { data: row, error } = await getSupabase().from('vendor_services').insert({
      provider_id: raw.id,
      name: data.name,
      description: data.description || '',
      starting_price: data.startingPrice || 0,
    }).select('*').single()
    if (error) throw error
    const fresh = await Providers.findById(raw.id)
    res.status(201).json(fresh)
  } catch (error) {
    if (error.name === 'ZodError') return res.status(400).json({ error: error.errors?.[0]?.message || 'Invalid service' })
    res.status(500).json({ error: error.message })
  }
})

router.put('/services/:serviceId', authMiddleware, async (req, res) => {
  try {
    const data = serviceInput.partial().parse(req.body)
    const raw = await Providers.findRawByUserId(req.user._id)
    if (!raw) return res.status(404).json({ error: 'Provider profile not found' })
    const patch = {}
    if (data.name !== undefined) patch.name = data.name
    if (data.description !== undefined) patch.description = data.description
    if (data.startingPrice !== undefined) patch.starting_price = data.startingPrice
    const { data: row, error } = await getSupabase()
      .from('vendor_services')
      .update(patch)
      .eq('id', req.params.serviceId)
      .eq('provider_id', raw.id)
      .select('*')
      .maybeSingle()
    if (error) throw error
    if (!row) return res.status(404).json({ error: 'Service not found' })
    const fresh = await Providers.findById(raw.id)
    res.json(fresh)
  } catch (error) {
    if (error.name === 'ZodError') return res.status(400).json({ error: 'Invalid service' })
    res.status(500).json({ error: error.message })
  }
})

router.delete('/services/:serviceId', authMiddleware, async (req, res) => {
  try {
    const raw = await Providers.findRawByUserId(req.user._id)
    if (!raw) return res.status(404).json({ error: 'Provider profile not found' })
    const { error } = await getSupabase()
      .from('vendor_services')
      .delete()
      .eq('id', req.params.serviceId)
      .eq('provider_id', raw.id)
    if (error) throw error
    const fresh = await Providers.findById(raw.id)
    res.json(fresh)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Packages CRUD (vendor-owned)
router.post('/packages', authMiddleware, async (req, res) => {
  try {
    const data = packageInput.parse(req.body)
    const raw = await Providers.findRawByUserId(req.user._id)
    if (!raw) return res.status(404).json({ error: 'Provider profile not found' })
    const { error } = await getSupabase().from('vendor_packages').insert({
      provider_id: raw.id,
      name: data.name,
      price: data.price,
      description: data.description || '',
      features: data.features || [],
    })
    if (error) throw error
    const fresh = await Providers.findById(raw.id)
    res.status(201).json(fresh)
  } catch (error) {
    if (error.name === 'ZodError') return res.status(400).json({ error: error.errors?.[0]?.message || 'Invalid package' })
    res.status(500).json({ error: error.message || 'Invalid package' })
  }
})

router.put('/packages/:packageId', authMiddleware, async (req, res) => {
  try {
    const data = packageInput.partial().parse(req.body)
    const raw = await Providers.findRawByUserId(req.user._id)
    if (!raw) return res.status(404).json({ error: 'Provider profile not found' })
    const patch = {}
    if (data.name !== undefined) patch.name = data.name
    if (data.price !== undefined) patch.price = data.price
    if (data.description !== undefined) patch.description = data.description
    if (data.features !== undefined) patch.features = data.features
    const { data: row, error } = await getSupabase()
      .from('vendor_packages')
      .update(patch)
      .eq('id', req.params.packageId)
      .eq('provider_id', raw.id)
      .select('*')
      .maybeSingle()
    if (error) throw error
    if (!row) return res.status(404).json({ error: 'Package not found' })
    const fresh = await Providers.findById(raw.id)
    res.json(fresh)
  } catch (error) {
    if (error.name === 'ZodError') return res.status(400).json({ error: 'Invalid package' })
    res.status(500).json({ error: error.message })
  }
})

router.delete('/packages/:packageId', authMiddleware, async (req, res) => {
  try {
    const raw = await Providers.findRawByUserId(req.user._id)
    if (!raw) return res.status(404).json({ error: 'Provider profile not found' })
    const { error } = await getSupabase()
      .from('vendor_packages')
      .delete()
      .eq('id', req.params.packageId)
      .eq('provider_id', raw.id)
    if (error) throw error
    const fresh = await Providers.findById(raw.id)
    res.json(fresh)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Upload profile image (Supabase Storage)
router.post('/profile-image', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const raw = await Providers.findRawByUserId(req.user._id)
    if (!raw) {
      return res.status(404).json({ error: 'Provider profile not found' })
    }

    // Quota only blocks brand-new images; replacements free their old file.
    if (!raw.profile_image) {
      const usage = await getVendorUsage(raw.id).catch(() => null)
      if (usage && usage.totalBytes + 100 * 1024 > VENDOR_QUOTA_BYTES) {
        return res.status(413).json({ error: 'Storage full. Delete a portfolio image to free space.' })
      }
    }

    const url = await uploadImage(req.file.buffer, req.file, 'profile', raw.id)
    if (raw.profile_image) await deleteImageIfOwned(raw.profile_image)

    const { data, error } = await getSupabase()
      .from('service_providers')
      .update({ profile_image: url })
      .eq('id', raw.id)
      .select('*')
      .single()
    if (error) throw error

    const provider = await Providers.findById(raw.id)
    res.json({ url, provider })
  } catch (error) {
    console.error('Profile image upload error:', error)
    res.status(500).json({ error: error.message })
  }
})

// Upload cover image (Supabase Storage)
router.post('/cover-image', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const raw = await Providers.findRawByUserId(req.user._id)
    if (!raw) {
      return res.status(404).json({ error: 'Provider profile not found' })
    }

    if (!raw.cover_image) {
      const usage = await getVendorUsage(raw.id).catch(() => null)
      if (usage && usage.totalBytes + 320 * 1024 > VENDOR_QUOTA_BYTES) {
        return res.status(413).json({ error: 'Storage full. Delete a portfolio image to free space.' })
      }
    }

    const url = await uploadImage(req.file.buffer, req.file, 'cover', raw.id)
    if (raw.cover_image) await deleteImageIfOwned(raw.cover_image)

    await getSupabase().from('service_providers').update({ cover_image: url }).eq('id', raw.id)

    const provider = await Providers.findById(raw.id)
    res.json({ url, provider })
  } catch (error) {
    console.error('Cover image upload error:', error)
    res.status(500).json({ error: error.message })
  }
})

// Delete portfolio image
router.delete('/portfolio', authMiddleware, async (req, res) => {
  try {
    const imageUrl = req.query.imageUrl
    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL is required' })
    }

    const raw = await Providers.findRawByUserId(req.user._id)
    if (!raw) {
      return res.status(404).json({ error: 'Provider profile not found' })
    }

    const next = (raw.portfolio_images || []).filter((u) => u !== imageUrl)
    await getSupabase().from('service_providers').update({ portfolio_images: next }).eq('id', raw.id)
    await deleteImageIfOwned(imageUrl)

    const provider = await Providers.findById(raw.id)
    res.json({ message: 'Image deleted successfully', provider })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
