const express = require('express')
const router = express.Router()
const ServiceProvider = require('../models/ServiceProvider')
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

// Get current vendor's profile
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const provider = await ServiceProvider.findOne({ userId: req.user._id })
    if (!provider) {
      return res.status(404).json({ error: 'Provider profile not found' })
    }
    res.json(provider)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Update vendor profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const updateData = req.body
    
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

// Delete portfolio image
router.delete('/portfolio/:imageUrl', authMiddleware, async (req, res) => {
  try {
    const { imageUrl } = req.params
    
    const provider = await ServiceProvider.findOneAndUpdate(
      { userId: req.user._id },
      { $pull: { portfolioImages: imageUrl } },
      { new: true }
    )
    
    if (!provider) {
      return res.status(404).json({ error: 'Provider profile not found' })
    }
    
    // Optionally delete from Cloudinary (you might want to implement this)
    
    res.json({ message: 'Image deleted successfully', provider })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
