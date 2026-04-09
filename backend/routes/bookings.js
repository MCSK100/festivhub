const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const ServiceProvider = require('../models/ServiceProvider');
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

// Create new booking
router.post('/', authMiddleware, async (req, res) => {
  try {
    const data = createBookingSchema.parse(req.body);

    // Verify vendor exists
    const vendor = await ServiceProvider.findById(data.vendorId);
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    // Create booking
    const booking = new Booking({
      customer: req.user._id,
      vendor: data.vendorId,
      serviceTitle: data.serviceTitle,
      price: data.price,
      date: new Date(data.date),
      notes: data.notes || ''
    });

    await booking.save();

    // Add booking to vendor's bookings array
    await ServiceProvider.findByIdAndUpdate(vendorId, {
      $push: { bookings: booking._id }
    });

    // Populate vendor details for response
    await booking.populate('vendor', 'name category location priceRange');

    res.status(201).json({
      message: 'Booking created successfully',
      booking
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
    const bookings = await Booking.find({ customer: req.user._id })
      .populate('vendor', 'name category location priceRange gallery')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error('Get customer bookings error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Get vendor's bookings (for vendor dashboard)
router.get('/vendor-bookings', authMiddleware, async (req, res) => {
  try {
    // Find vendor profile for this user
    const vendorProfile = await ServiceProvider.findOne({ userId: req.user._id });
    if (!vendorProfile) {
      return res.status(403).json({ error: 'Vendor profile not found' });
    }

    const bookings = await Booking.find({ vendor: vendorProfile._id })
      .populate('customer', 'name email')
      .populate('vendor', 'name category')
      .sort({ createdAt: -1 });

    // Mark unread bookings as read
    await Booking.updateMany(
      { vendor: vendorProfile._id, isRead: false },
      { isRead: true }
    );

    res.json(bookings);
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
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Verify vendor owns this booking
    const vendorProfile = await ServiceProvider.findOne({ userId: req.user._id });
    if (!vendorProfile || booking.vendor.toString() !== vendorProfile._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this booking' });
    }

    // Update status
    booking.status = data.status;
    await booking.save();

    // Populate for response
    await booking.populate('customer', 'name email');
    await booking.populate('vendor', 'name category');

    res.json({
      message: 'Booking status updated successfully',
      booking
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

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Verify customer owns this booking
    if (booking.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to cancel this booking' });
    }

    // Only allow cancellation if not completed
    if (booking.status === 'completed') {
      return res.status(400).json({ error: 'Cannot cancel completed booking' });
    }

    booking.status = 'cancelled';
    await booking.save();

    // Remove booking from vendor's bookings array
    await ServiceProvider.findByIdAndUpdate(booking.vendor, {
      $pull: { bookings: booking._id }
    });

    res.json({
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

module.exports = router;