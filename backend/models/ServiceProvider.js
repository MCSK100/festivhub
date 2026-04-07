const mongoose = require('mongoose')

const serviceProviderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Photographer', 'Catering', 'DJ', 'Decorations', 'Florist', 'Lighting'], 
    required: true 
  },
  experience: { type: Number, min: 0 }, // years
  location: {
    city: String,
    state: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  socialMedia: {
    instagram: String,
    website: String
  },
  gallery: [String], // Cloudinary URLs
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
