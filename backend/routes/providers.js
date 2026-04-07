const express = require('express')
const router = express.Router()
const ServiceProvider = require('../models/ServiceProvider')
const { z } = require('zod')
const cloudinary = require('../utils/cloudinary')
const authMiddleware = require('../middleware/auth')

// Validation schemas
const createProviderSchema = z.object({
  name: z.string().min(2),
  category: z.enum(['Photographer', 'Catering', 'DJ', 'Decorations', 'Florist', 'Lighting']),
  experience: z.number().min(0),
  location: z.object({
    city: z.string(),
    state: z.string()
  }),
  priceRange: z.string()
})

const uploadSchema = z.object({
  gallery: z.array(z.instanceof(File)) // Frontend form-data
})

// Create provider
router.post('/', authMiddleware, async (req, res) => {
  try {
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
router.post('/:id/gallery', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    // Multer handles file, stub for now
    const file = req.file // Assume multer middleware
    const provider = await ServiceProvider.findOne({ _id: id, userId: req.user._id })
    if (!provider) {
      return res.status(403).json({ error: 'Not authorized for this provider' })
    }
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'festivlink/providers',
      resource_type: 'auto' // image/video
    })
    
    provider.gallery.push(result.secure_url)
    await provider.save()
    
    res.json({ url: result.secure_url })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get all with filters
router.get('/', async (req, res) => {
  try {
    const { category, location, priceMin, priceMax } = req.query
    const filters = {}
    if (category) filters.category = category
    if (location) filters['location.city'] = { $regex: location, $options: 'i' }
    
    const providers = await ServiceProvider.find(filters).sort({ ratings: -1 })
    res.json(providers)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
