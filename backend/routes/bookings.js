const express = require('express');
const router = express.Router();
const Bookings = require('../db/bookings');
const Providers = require('../db/providers');
const Users = require('../db/users');
const { customerMini, vendorMini } = require('../db/map');
const { getSupabase } = require('../utils/supabase');
const authMiddleware = require('../middleware/auth');
const { z } = require('zod');

// Validation schemas
const createBookingSchema = z.object({
  vendorId: z.string().min(1, 'Vendor ID is required'),
  serviceTitle: z.string().min(1, 'Service title is required'),
  price: z.number().positive('Price must be positive'),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid date format'),
  notes: z.string().optional()
});

const updateStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'completed', 'cancelled'])
});

async function providerRaw(id) {
  const { data, error } = await getSupabase().from('service_providers').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  return data
}

// Create new booking
router.post('/', authMiddleware, async (req, res) => {
  try {
    const data = createBookingSchema.parse(req.body);

    // Verify vendor exists
    const vendor = await providerRaw(data.vendorId);
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    // Create booking
    const row = await Bookings.create({
      customer_id: req.user._id,
      vendor_id: data.vendorId,
      service_title: data.serviceTitle,
      price: data.price,
      date: new Date(data.date).toISOString(),
      notes: data.notes || ''
    });

    res.status(201).json({
      message: 'Booking created successfully',
      booking: Bookings.mapBooking(row, null, vendorMini(vendor))
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ errors: error.errors });
    }
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Get customer's bookings
router.get('/my-bookings', authMiddleware, async (req, res) => {
  try {
    const rows = await Bookings.listByCustomer(req.user._id)
    const vendorIds = [...new Set(rows.map((r) => r.vendor_id))]
    const minis = {}
    if (vendorIds.length) {
      const { data } = await getSupabase().from('service_providers').select('*').in('id', vendorIds)
      for (const v of data || []) minis[v.id] = vendorMini(v)
    }
    res.json(rows.map((r) => Bookings.mapBooking(r, null, minis[r.vendor_id] || r.vendor_id)));
  } catch (error) {
    console.error('Get customer bookings error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Get vendor's bookings (for vendor dashboard)
router.get('/vendor-bookings', authMiddleware, async (req, res) => {
  try {
    // Find vendor profile for this user
    const vendorProfile = await Providers.findRawByUserId(req.user._id);
    if (!vendorProfile) {
      return res.status(404).json({ error: 'Vendor profile not found' });
    }

    const rows = await Bookings.listByVendor(vendorProfile.id)
    const customerIds = [...new Set(rows.map((r) => r.customer_id).filter(Boolean))]
    const customers = {}
    if (customerIds.length) {
      const { data } = await getSupabase().from('users').select('id,name,email').in('id', customerIds)
      for (const u of data || []) customers[u.id] = customerMini(u)
    }
    const mini = vendorMini(vendorProfile)

    // Mark unread bookings as read
    await Bookings.markVendorRead(vendorProfile.id);

    res.json(rows.map((r) => Bookings.mapBooking(r, customers[r.customer_id] || { _id: r.customer_id, id: r.customer_id, name: 'Customer', email: '' }, mini)));
  } catch (error) {
    console.error('Get vendor bookings error:', error);
    res.status(500).json({ error: 'Failed to fetch vendor bookings' });
  }
});

// Update booking status (vendor side)
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const data = updateStatusSchema.parse(req.body);

    // Find the booking
    const booking = await Bookings.findById(id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Verify vendor owns this booking
    const vendorProfile = await Providers.findRawByUserId(req.user._id);
    if (!vendorProfile || booking.vendor_id !== vendorProfile.id) {
      return res.status(403).json({ error: 'Not authorized to update this booking' });
    }

    // Update status
    const updated = await Bookings.setStatus(id, data.status);

    const customer = updated.customer_id
      ? await Users.findById(updated.customer_id).catch(() => null)
      : null;

    res.json({
      message: 'Booking status updated successfully',
      booking: Bookings.mapBooking(updated, customer ? customerMini(customer) : null, vendorMini(vendorProfile))
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ errors: error.errors });
    }
    console.error('Update booking status error:', error);
    res.status(500).json({ error: 'Failed to update booking status' });
  }
});

// Cancel booking (customer side)
router.put('/:id/cancel', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Bookings.findById(id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Verify customer owns this booking
    if (booking.customer_id !== req.user._id) {
      return res.status(403).json({ error: 'Not authorized to cancel this booking' });
    }

    // Only allow cancellation if not completed
    if (booking.status === 'completed') {
      return res.status(400).json({ error: 'Cannot cancel completed booking' });
    }

    const updated = await Bookings.setStatus(id, 'cancelled');

    res.json({
      message: 'Booking cancelled successfully',
      booking: Bookings.mapBooking(updated)
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

module.exports = router;
