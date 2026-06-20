require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const rateLimit = require('express-rate-limit')

const providerRoutes = require('./routes/providers')
const authRoutes = require('./routes/auth')
const bookingRoutes = require('./routes/bookings')
const passwordRoutes = require('./routes/password')

const app = express()
const PORT = process.env.PORT || 5000

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
})

// Middleware
const allowedOrigins = (process.env.CORS_ORIGIN || process.env.FRONTEND_URL || 'http://localhost:3000')
  .split(',')
  .map(o => o.trim())

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err)
    process.exit(1)
  })

// Routes
app.use('/api/providers', providerRoutes)
app.use('/api/auth', authLimiter, authRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/password', authLimiter, passwordRoutes)

// Health
app.get('/', (req, res) => res.json({ message: 'FestivLink Backend Running!' }))

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
