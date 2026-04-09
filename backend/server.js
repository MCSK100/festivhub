require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const providerRoutes = require('./routes/providers')
const authRoutes = require('./routes/auth')
const bookingRoutes = require('./routes/bookings')

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Restrict to Vercel
  credentials: true
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err))

// Routes
app.use('/api/providers', providerRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/bookings', bookingRoutes)

// Health
app.get('/', (req, res) => res.json({ message: 'FestivLink Backend Running!' }))

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
