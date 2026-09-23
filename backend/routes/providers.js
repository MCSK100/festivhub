const express = require('express')
const router = express.Router()
const ServiceProvider = require('../models/ServiceProvider')
const { CATEGORIES } = require('../models/ServiceProvider')
const { z } = require('zod')
const cloudinary = require('../utils/cloudinary')
const authMiddleware = require('../middleware/auth')
const multer = require('multer')

// Multer configuration with file size limits
const storage = multer.memoryStorage()
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 3 * 1024 * 1024, // 3MB limit
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
    const existing = await ServiceProvider.findOne({ userId: req.user._id })
    if (existing) {
      return res.status(400).json({ error: 'Provider profile already exists. Use PUT /profile to update.' })
    }
    const data = createProviderSchema.parse(req.body)
    const provider = new ServiceProvider({
      ...data,
      userId: req.user._id
    })
    await provider.save()
    res.status(201).json(provider)
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ errors: error.errors })
    }
    res.status(500).json({ error: error.message })
  }
})

// Upload gallery image/video
router.post('/:id/gallery', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const provider = await ServiceProvider.findOne({ _id: id, userId: req.user._id })
    if (!provider) {
      return res.status(403).json({ error: 'Not authorized for this provider' })
    }

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'festivlink/providers',
          resource_type: 'auto'
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      )
      stream.end(req.file.buffer)
    })

    provider.portfolioImages.push(result.secure_url)
    await provider.save()

    res.json({ url: result.secure_url })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ error: error.message })
  }
})

// Get current vendor's profile
router.get('/me', authMiddleware, async (req, res) => {
  try {
    let provider = await ServiceProvider.findOne({ userId: req.user._id })
    if (!provider) {
      if (req.user.role === 'vendor') {
        provider = new ServiceProvider({
          userId: req.user._id,
          name: req.user.name || req.user.email.split('@')[0],
          category: 'Photography',
          experience: '0',
          companyName: '',
          description: '',
          profileImage: '',
          location: { city: '', state: '' },
          priceRange: 'Contact for pricing',
          startingPrice: 0,
          portfolioImages: [],
          gallery: []
        })
        await provider.save()

        // Link back to user model
        req.user.providerProfile = provider._id
        await req.user.save()
      } else {
        return res.status(404).json({ error: 'Provider profile not found' })
      }
    }
    res.json(provider)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get all with real search / filters / sort / pagination.
// Back-compat: plain array when no pagination params are given.
router.get('/', async (req, res) => {
  try {
    const { category, location, q, search, sort, page, limit, minPrice, maxPrice } = req.query
    const filters = { isPublished: { $ne: false } }
    const term = (q || search || '').trim()

    if (category && category !== 'All') {
      const cats = CATEGORY_ALIASES[category] || [category]
      filters.category = cats.length === 1 ? cats[0] : { $in: cats }
    }
    if (location) {
      filters.$and = filters.$and || []
      filters.$and.push({
        $or: [
          { 'location.city': { $regex: location, $options: 'i' } },
          { 'location.state': { $regex: location, $options: 'i' } },
        ]
      })
    }
    if (term) {
      const rx = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
      filters.$and = filters.$and || []
      filters.$and.push({
        $or: [
          { name: rx },
          { companyName: rx },
          { description: rx },
          { category: rx },
          { 'location.city': rx },
          { 'services.name': rx },
        ]
      })
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
      filters.startingPrice = {}
      if (minPrice !== undefined && minPrice !== '') filters.startingPrice.$gte = Number(minPrice) || 0
      if (maxPrice !== undefined && maxPrice !== '') filters.startingPrice.$lte = Number(maxPrice)
      if (Object.keys(filters.startingPrice).length === 0) delete filters.startingPrice
    }

    let sortSpec = { 'ratings.average': -1, createdAt: -1 }
    if (sort === 'newest') sortSpec = { createdAt: -1 }
    else if (sort === 'rating') sortSpec = { 'ratings.average': -1, 'ratings.count': -1 }
    else if (sort === 'price-low') sortSpec = { startingPrice: 1 }
    else if (sort === 'price-high') sortSpec = { startingPrice: -1 }

    const usePaging = page !== undefined || limit !== undefined
    if (!usePaging) {
      const providers = await ServiceProvider.find(filters).sort(sortSpec).limit(200)
      return res.json(providers)
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1)
    const perPage = Math.min(48, Math.max(1, parseInt(limit, 10) || 12))
    const total = await ServiceProvider.countDocuments(filters)
    const vendors = await ServiceProvider.find(filters)
      .sort(sortSpec)
      .skip((pageNum - 1) * perPage)
      .limit(perPage)
    res.json({ vendors, total, page: pageNum, pages: Math.max(1, Math.ceil(total / perPage)) })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get single provider by id (public detail page)
router.get('/:id', async (req, res) => {
  try {
    const provider = await ServiceProvider.findById(req.params.id)
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
    // Allowlist → prevent mass-assignment of userId/bookings/ratings/_id
    const ALLOWED = ['name', 'companyName', 'category', 'experience', 'description', 'profileImage', 'coverImage', 'phone', 'contactEmail', 'location', 'socialLinks', 'priceRange', 'startingPrice', 'businessHours', 'availability', 'isPublished', 'portfolioImages', 'gallery', 'services', 'packages']
    const updateData = {}
    for (const key of ALLOWED) {
      if (req.body[key] !== undefined) updateData[key] = req.body[key]
    }

    if (updateData.category && !CATEGORIES.includes(updateData.category)) {
      return res.status(400).json({ error: 'Invalid category' })
    }
    if (updateData.startingPrice !== undefined) {
      const n = Number(updateData.startingPrice)
      updateData.startingPrice = Number.isFinite(n) && n >= 0 ? n : 0
    }

    const provider = await ServiceProvider.findOneAndUpdate(
      { userId: req.user._id },
      updateData,
      { new: true, runValidators: true }
    )

    if (!provider) {
      return res.status(404).json({ error: 'Provider profile not found' })
    }

    res.json(provider)
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message })
    }
    res.status(500).json({ error: error.message })
  }
})

// Services CRUD (vendor-owned)
router.post('/services', authMiddleware, async (req, res) => {
  try {
    const data = serviceInput.parse(req.body)
    const provider = await ServiceProvider.findOne({ userId: req.user._id })
    if (!provider) return res.status(404).json({ error: 'Provider profile not found' })
    provider.services.push(data)
    await provider.save()
    res.status(201).json(provider)
  } catch (error) {
    if (error.name === 'ZodError') return res.status(400).json({ error: error.errors?.[0]?.message || 'Invalid service' })
    res.status(500).json({ error: error.message })
  }
})

router.put('/services/:serviceId', authMiddleware, async (req, res) => {
  try {
    const data = serviceInput.partial().parse(req.body)
    const provider = await ServiceProvider.findOne({ userId: req.user._id })
    if (!provider) return res.status(404).json({ error: 'Provider profile not found' })
    const svc = provider.services.id(req.params.serviceId)
    if (!svc) return res.status(404).json({ error: 'Service not found' })
    Object.assign(svc, data)
    await provider.save()
    res.json(provider)
  } catch (error) {
    if (error.name === 'ZodError') return res.status(400).json({ error: 'Invalid service' })
    res.status(500).json({ error: error.message })
  }
})

router.delete('/services/:serviceId', authMiddleware, async (req, res) => {
  try {
    const provider = await ServiceProvider.findOne({ userId: req.user._id })
    if (!provider) return res.status(404).json({ error: 'Provider profile not found' })
    provider.services.pull(req.params.serviceId)
    await provider.save()
    res.json(provider)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Packages CRUD (vendor-owned)
router.post('/packages', authMiddleware, async (req, res) => {
  try {
    const data = packageInput.parse(req.body)
    const provider = await ServiceProvider.findOne({ userId: req.user._id })
    if (!provider) return res.status(404).json({ error: 'Provider profile not found' })
    provider.packages.push(data)
    await provider.save()
    res.status(201).json(provider)
  } catch (error) {
    if (error.name === 'ZodError') return res.status(400).json({ error: error.errors?.[0]?.message || 'Invalid package' })
    res.status(500).json({ error: error.message || 'Invalid package' })
  }
})

router.put('/packages/:packageId', authMiddleware, async (req, res) => {
  try {
    const data = packageInput.partial().parse(req.body)
    const provider = await ServiceProvider.findOne({ userId: req.user._id })
    if (!provider) return res.status(404).json({ error: 'Provider profile not found' })
    const pkg = provider.packages.id(req.params.packageId)
    if (!pkg) return res.status(404).json({ error: 'Package not found' })
    Object.assign(pkg, data)
    await provider.save()
    res.json(provider)
  } catch (error) {
    if (error.name === 'ZodError') return res.status(400).json({ error: 'Invalid package' })
    res.status(500).json({ error: error.message })
  }
})

router.delete('/packages/:packageId', authMiddleware, async (req, res) => {
  try {
    const provider = await ServiceProvider.findOne({ userId: req.user._id })
    if (!provider) return res.status(404).json({ error: 'Provider profile not found' })
    provider.packages.pull(req.params.packageId)
    await provider.save()
    res.json(provider)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Upload profile image
router.post('/profile-image', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'festivlink/providers/profiles',
          resource_type: 'image'
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      )
      stream.end(req.file.buffer)
    })

    // Update provider profile image
    const provider = await ServiceProvider.findOneAndUpdate(
      { userId: req.user._id },
      { profileImage: result.secure_url },
      { new: true }
    )

    if (!provider) {
      return res.status(404).json({ error: 'Provider profile not found' })
    }

    res.json({ url: result.secure_url, provider })
  } catch (error) {
    console.error('Profile image upload error:', error)
    res.status(500).json({ error: error.message })
  }
})

// Upload cover image
router.post('/cover-image', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'festivlink/providers/covers',
          resource_type: 'image'
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      )
      stream.end(req.file.buffer)
    })

    const provider = await ServiceProvider.findOneAndUpdate(
      { userId: req.user._id },
      { coverImage: result.secure_url },
      { new: true }
    )

    if (!provider) {
      return res.status(404).json({ error: 'Provider profile not found' })
    }

    res.json({ url: result.secure_url, provider })
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

    const provider = await ServiceProvider.findOneAndUpdate(
      { userId: req.user._id },
      { $pull: { portfolioImages: imageUrl } },
      { new: true }
    )

    if (!provider) {
      return res.status(404).json({ error: 'Provider profile not found' })
    }

    res.json({ message: 'Image deleted successfully', provider })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
