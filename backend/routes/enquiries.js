const express = require('express')
const router = express.Router()
const { z } = require('zod')
const Enquiries = require('../db/enquiries')
const Providers = require('../db/providers')
const { getSupabase } = require('../utils/supabase')
const { vendorMini } = require('../db/map')
const authMiddleware = require('../middleware/auth')
const { enquiryLimiter } = require('../middleware/rateLimits')

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

// Public: customer sends a booking/enquiry request — NO auth (rate-limited).
router.post('/', enquiryLimiter, async (req, res) => {
  try {
    const data = createEnquirySchema.parse(req.body)

    const vendor = await Providers.findById(data.vendorId)
    if (!vendor) return res.status(404).json({ error: 'Vendor not found' })

    const eventDate = new Date(data.eventDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (eventDate < today) {
      return res.status(400).json({ error: 'Event date must be in the future' })
    }

    const row = await Enquiries.create({
      vendor_id: data.vendorId,
      full_name: String(data.fullName).trim(),
      phone: String(data.phone).trim(),
      email: String(data.email).toLowerCase().trim(),
      event_type: String(data.eventType).trim(),
      event_date: eventDate.toISOString().slice(0, 10),
      event_location: String(data.eventLocation).trim(),
      guests: data.guests || 0,
      budget: String(data.budget || ''),
      message: String(data.message || ''),
    })

    const { mapEnquiry } = require('../db/map')
    res.status(201).json({ message: 'Enquiry sent successfully', enquiry: mapEnquiry(row) })
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
    const profile = await Providers.findRawByUserId(req.user._id)
    if (!profile) return res.status(404).json({ error: 'Vendor profile not found' })

    const { status } = req.query
    const valid = ['new', 'contacted', 'confirmed', 'completed', 'cancelled'].includes(status)
    const rows = await Enquiries.listByVendor(profile.id, valid ? status : null)
    const mapped = await Enquiries.withVendorMini(rows, profile)

    await Enquiries.markAllRead(profile.id)

    res.json(mapped)
  } catch (err) {
    console.error('Get vendor enquiries error:', err)
    res.status(500).json({ error: 'Failed to fetch enquiries' })
  }
})

// Vendor: update enquiry status (protected, ownership-checked)
router.patch('/:id/status', authMiddleware, async (req, res) => {
  try {
    const data = statusSchema.parse(req.body)
    const enquiry = await Enquiries.findById(req.params.id)
    if (!enquiry) return res.status(404).json({ error: 'Enquiry not found' })

    const profile = await Providers.findRawByUserId(req.user._id)
    if (!profile || enquiry.vendor_id !== profile.id) {
      return res.status(403).json({ error: 'Not authorized to update this enquiry' })
    }

    const updated = await Enquiries.setStatus(enquiry.id, data.status)
    const { mapEnquiry } = require('../db/map')

    res.json({ message: 'Enquiry status updated', enquiry: mapEnquiry(updated, vendorMini(profile)) })
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: 'Invalid status' })
    }
    console.error('Update enquiry status error:', err)
    res.status(500).json({ error: 'Failed to update enquiry' })
  }
})

module.exports = router
