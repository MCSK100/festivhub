const mongoose = require('mongoose')

const serviceProviderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  companyName: { type: String, default: '' },
  category: { 
    type: String, 
    enum: ['Photographer', 'Catering', 'DJ', 'Decorations', 'Florist', 'Lighting'], 
    required: true 
  },
  experience: { type: String, default: '0' }, // Changed to String to allow "5 years" format
  description: { type: String, default: '' },
  profileImage: { type: String, default: '' },
  location: {
    city: String,
    state: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  socialLinks: {
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    website: { type: String, default: '' }
  },
  portfolioImages: [{ type: String }], // Array of image URLs
  gallery: [String], // Cloudinary URLs (keeping for backward compatibility)
  ratings: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  availability: { type: Boolean, default: true },
  priceRange: String, // e.g. "₹15k - ₹50k"
  bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Clerk user webhook
}, {
  timestamps: true
})

module.exports = mongoose.model('ServiceProvider', serviceProviderSchema)
