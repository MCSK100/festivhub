const express = require('express')
const router = express.Router()
const { z } = require('zod')
const Enquiry = require('../models/Enquiry')
const ServiceProvider = require('../models/ServiceProvider')
const authMiddleware = require('../middleware/auth')

const createEnquirySchema = z.object({
  vendorId: z.string().min(1, 'Vendor is required'),
  fullName: z.string().min(2, 'Full name is required').max(120),
  phone: z.string().min(6, 'Phone number is required').max(20),
  email: z.string().email('Valid email is required'),
  eventType: z.string().min(2, 'Event type is required').max(80),
  eventDate: z.string().refine((d) => !isNaN(Date.parse(d)), 'Invalid event date'),
  eventLocation: z.string().min(2, 'Event location is required').max(160),
  guests: z.union([z.string(), z.number()]).optional().transform((v) => {
    if (v === undefined || v === '' || v === null) return 0
    const n = Number(v)
    return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0
  }),
  budget: z.string().max(60).optional().default(''),
  message: z.string().max(2000).optional().default(''),
})

const statusSchema = z.object({
  status: z.enum(['new', 'contacted', 'confirmed', 'completed', 'cancelled'])
})

// Public: customer sends a booking/enquiry request — NO auth.
router.post('/', async (req, res) => {
  try {
    const data = createEnquirySchema.parse(req.body)

    const vendor = await ServiceProvider.findById(data.vendorId)
    if (!vendor) return res.status(404).json({ error: 'Vendor not found' })

    const eventDate = new Date(data.eventDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (eventDate < today) {
      return res.status(400).json({ error: 'Event date must be in the future' })
    }

    const enquiry = new Enquiry({
      vendor: data.vendorId,
      fullName: String(data.fullName).trim(),
      phone: String(data.phone).trim(),
      email: String(data.email).toLowerCase().trim(),
      eventType: String(data.eventType).trim(),
      eventDate,
      eventLocation: String(data.eventLocation).trim(),
      guests: data.guests || 0,
      budget: String(data.budget || ''),
      message: String(data.message || ''),
    })
    await enquiry.save()
    await ServiceProvider.findByIdAndUpdate(data.vendorId, { $push: { enquiries: enquiry._id } })

    res.status(201).json({ message: 'Enquiry sent successfully', enquiry })
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: err.errors?.[0]?.message || 'Invalid enquiry details', errors: err.errors })
    }
    console.error('Create enquiry error:', err)
    res.status(500).json({ error: 'Failed to send enquiry' })
  }
})

// Vendor: list own incoming enquiries (protected)
router.get('/vendor', authMiddleware, async (req, res) => {
  try {
    const profile = await ServiceProvider.findOne({ userId: req.user._id })
    if (!profile) return res.status(404).json({ error: 'Vendor profile not found' })

    const { status } = req.query
    const filter = { vendor: profile._id }
    if (status && ['new', 'contacted', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      filter.status = status
    }

    const enquiries = await Enquiry.find(filter)
      .populate('vendor', 'name companyName category')
      .sort({ createdAt: -1 })

    await Enquiry.updateMany({ vendor: profile._id, isRead: false }, { isRead: true })

    res.json(enquiries)
  } catch (err) {
    console.error('Get vendor enquiries error:', err)
    res.status(500).json({ error: 'Failed to fetch enquiries' })
  }
})

// Vendor: update enquiry status (protected, ownership-checked)
router.patch('/:id/status', authMiddleware, async (req, res) => {
  try {
    const data = statusSchema.parse(req.body)
    const enquiry = await Enquiry.findById(req.params.id)
    if (!enquiry) return res.status(404).json({ error: 'Enquiry not found' })

    const profile = await ServiceProvider.findOne({ userId: req.user._id })
    if (!profile || enquiry.vendor.toString() !== profile._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this enquiry' })
    }

    enquiry.status = data.status
    enquiry.isRead = true
    await enquiry.save()
    await enquiry.populate('vendor', 'name companyName category')

    res.json({ message: 'Enquiry status updated', enquiry })
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: 'Invalid status' })
    }
    console.error('Update enquiry status error:', err)
    res.status(500).json({ error: 'Failed to update enquiry' })
  }
})

module.exports = router
