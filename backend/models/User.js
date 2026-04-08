const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  role: {
    type: String,
    enum: ['customer', 'vendor'],
    default: 'customer'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  trialExpiration: {
    type: Date,
    default: () => {
      const date = new Date()
      date.setDate(date.getDate() + 30)
      return date
    }
  },
  providerProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceProvider'
  }
}, {
  timestamps: true
})

// Hash password before save
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

module.exports = mongoose.model('User', userSchema)

