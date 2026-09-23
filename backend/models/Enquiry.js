const mongoose = require('mongoose')

// Guest enquiry from a customer (NO login required).
// Customer identity lives only on the enquiry document.
const enquirySchema = new mongoose.Schema({
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceProvider',
    required: true
  },
  fullName: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  eventType: { type: String, required: true, trim: true },
  eventDate: { type: Date, required: true },
  eventLocation: { type: String, required: true, trim: true },
  guests: { type: Number, default: 0, min: 0 },
  budget: { type: String, default: '' },
  message: { type: String, default: '' },
  status: {
    type: String,
    enum: ['new', 'contacted', 'confirmed', 'completed', 'cancelled'],
    default: 'new'
  },
  isRead: { type: Boolean, default: false }
}, {
  timestamps: true
})

enquirySchema.index({ vendor: 1, createdAt: -1 })
enquirySchema.index({ vendor: 1, status: 1 })

module.exports = mongoose.model('Enquiry', enquirySchema)
