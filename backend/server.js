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
const allowedOrigins = [...new Set(
  `${process.env.CORS_ORIGIN || ''},${process.env.FRONTEND_URL || ''},http://localhost:3000,http://localhost:5173`
    .split(',')
    .map(o => o.trim().replace(/\/$/, ''))
    .filter(Boolean)
)]

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ''))) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
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

// 404 handler (JSON, must be after routes)
app.use((req, res) => res.status(404).json({ error: 'Route not found' }))

// Central error handler (CORS, multer, JSON parse → clean JSON)
app.use((err, req, res, next) => {
  if (err && err.message === 'Not allowed by CORS') {
    return res.status(403).json({ error: 'CORS blocked: origin not allowed' })
  }
  if (err && (err.code === 'LIMIT_FILE_SIZE' || err.message === 'Only image files are allowed')) {
    return res.status(400).json({ error: err.message || 'File upload rejected (max 3MB, images only)' })
  }
  if (err && err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON body' })
  }
  console.error('Unhandled error:', err)
  res.status(err.status || 500).json({ error: err.message || 'Server error' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
