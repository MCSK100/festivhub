const mongoose = require('mongoose')

// Canonical marketplace categories (FestivLink V2).
// Legacy values kept so existing documents keep validating.
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

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  startingPrice: { type: Number, default: 0, min: 0 },
}, { _id: true, timestamps: true })

const packageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  description: { type: String, default: '' },
  features: [{ type: String }],
}, { _id: true, timestamps: true })

const serviceProviderSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  companyName: { type: String, default: '', trim: true },
  category: {
    type: String,
    enum: CATEGORIES,
    required: true
  },
  experience: { type: String, default: '0' },
  description: { type: String, default: '' },
  profileImage: { type: String, default: '' },
  coverImage: { type: String, default: '' },
  phone: { type: String, default: '', trim: true },
  contactEmail: { type: String, default: '', trim: true, lowercase: true },
  location: {
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  socialLinks: {
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    website: { type: String, default: '' },
    youtube: { type: String, default: '' }
  },
  portfolioImages: [{ type: String }],
  gallery: [String],
  services: [serviceSchema],
  packages: [packageSchema],
  ratings: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  availability: { type: Boolean, default: true },
  // Human-readable range kept for backward compat, e.g. "₹15k - ₹50k"
  priceRange: { type: String, default: 'Contact for pricing' },
  // Numeric starting price used for sorting / cards. 0 = "contact for pricing".
  startingPrice: { type: Number, default: 0, min: 0 },
  businessHours: { type: String, default: '' },
  isPublished: { type: Boolean, default: true },
  bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }],
  enquiries: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Enquiry' }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true
})

serviceProviderSchema.index({ name: 'text', description: 'text', companyName: 'text' })
serviceProviderSchema.index({ category: 1 })
serviceProviderSchema.index({ 'location.city': 1 })
serviceProviderSchema.index({ startingPrice: 1 })
serviceProviderSchema.index({ 'ratings.average': -1 })

module.exports = mongoose.model('ServiceProvider', serviceProviderSchema)
module.exports.CATEGORIES = CATEGORIES
