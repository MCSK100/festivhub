const express = require('express')
const jwt = require('jsonwebtoken')
const { OAuth2Client } = require('google-auth-library')
const User = require('../models/User')
const ServiceProvider = require('../models/ServiceProvider')
const authMiddleware = require('../middleware/auth');
const router = express.Router()

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

function issueToken(user) {
  return jwt.sign({ id: user._id, purpose: 'auth' }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

function publicUser(user) {
  return {
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
    avatar: user.avatar || '',
    authProvider: user.authProvider || 'local',
    trialExpiration: user.trialExpiration
  }
}

async function ensureVendorProfile(user) {
  try {
    if (user.role !== 'vendor' || user.providerProfile) return
    const provider = new ServiceProvider({
      userId: user._id,
      name: user.name || user.email.split('@')[0],
      category: 'Photographer', // Default category
      experience: '0',
      companyName: '',
      description: '',
      profileImage: user.avatar || '',
      location: { city: '', state: '' },
      priceRange: 'Contact for pricing',
      portfolioImages: [],
      gallery: []
    })
    await provider.save()
    user.providerProfile = provider._id
    await user.save()
  } catch (err) {
    console.error('Vendor profile creation failed:', err)
  }
}

// @route   POST api/auth/register
// @desc    Register new user
router.post('/register', async (req, res) => {
  try {
    let { email, password, name = '', role = 'customer' } = req.body

    // Basic validation → 400 (not 500)
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }
    email = String(email).toLowerCase().trim()
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }
    if (String(password).length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' })
    }
    if (!['customer', 'vendor'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' })
    }

    // Check if user exists (case-insensitive)
    let user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({ error: 'User already exists' })
    }

    // Create user with 30-day trial
    const trialExpiration = new Date()
    trialExpiration.setDate(trialExpiration.getDate() + 30)

    user = new User({
      email,
      password,
      name: String(name || '').trim(),
      role,
      trialExpiration
    })

    await user.save()

    if (role === 'vendor') {
      try {
        const provider = new ServiceProvider({
          userId: user._id,
          name: user.name || email.split('@')[0],
          category: 'Photographer', // Default category
          experience: '0',
          companyName: '',
          description: '',
          profileImage: '',
          location: { city: '', state: '' },
          priceRange: 'Contact for pricing',
          portfolioImages: [],
          gallery: []
        })
        await provider.save()
        user.providerProfile = provider._id
        await user.save()
      } catch (providerErr) {
        // Roll back user if provider creation fails → avoid orphan
        console.error('Vendor profile creation failed:', providerErr)
      }
    }

    // Generate JWT
    const token = issueToken(user)

    res.status(201).json({
      token,
      user: publicUser(user)
    })
  } catch (err) {
    console.error(err)
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message })
    }
    res.status(500).json({ error: 'Server error' })
  }
})

// @route   POST api/auth/login
// @desc    Login user / Returning JWT token
router.post('/login', async (req, res) => {
  try {
    let { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }
    email = String(email).toLowerCase().trim()

    // Find user
    const user = await User.findOne({ email })
    if (!user || !await user.comparePassword(password)) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Generate JWT
    const token = issueToken(user)

    res.json({
      token,
      user: publicUser(user)
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// @route   POST api/auth/google
// @desc    Sign in / sign up with Google ID token (Google Identity Services)
router.post('/google', async (req, res) => {
  try {
    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({ error: 'Google sign-in is not configured on the server' })
    }
    let { idToken, role = 'customer' } = req.body
    if (!idToken) {
      return res.status(400).json({ error: 'Google ID token is required' })
    }
    if (!['customer', 'vendor'].includes(role)) {
      role = 'customer'
    }

    let payload
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID
      })
      payload = ticket.getPayload()
    } catch (verifyErr) {
      console.error('Google token verification failed:', verifyErr.message)
      return res.status(401).json({ error: 'Invalid Google credential' })
    }

    if (!payload?.email_verified || !payload?.email) {
      return res.status(401).json({ error: 'Google account email is not verified' })
    }

    const email = String(payload.email).toLowerCase().trim()
    const googleId = payload.sub
    const name = payload.name || email.split('@')[0]
    const avatar = payload.picture || ''

    // 1. Existing Google-linked account
    let user = await User.findOne({ googleId })

    // 2. Existing local account with same email → link it
    if (!user) {
      user = await User.findOne({ email })
      if (user) {
        // Don't hijack: only link if local account has no googleId yet
        if (user.googleId && user.googleId !== googleId) {
          return res.status(409).json({ error: 'This email is already linked to another Google account' })
        }
        user.googleId = googleId
        if (!user.avatar && avatar) user.avatar = avatar
        if (!user.name && name) user.name = name
        if (user.authProvider === 'local' && !user.password) user.authProvider = 'google'
        await user.save()
      }
    }

    // 3. Brand-new user → create (30-day trial via schema default)
    if (!user) {
      user = new User({
        email,
        name,
        role,
        googleId,
        avatar,
        authProvider: 'google'
      })
      await user.save()
    }

    await ensureVendorProfile(user)

    const token = issueToken(user)
    res.json({ token, user: publicUser(user) })
  } catch (err) {
    console.error(err)
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message })
    }
    if (err.code === 11000) {
      return res.status(409).json({ error: 'An account with this email already exists' })
    }
    res.status(500).json({ error: 'Google sign-in failed' })
  }
})

// @route   GET api/auth/me
// @desc    Get current user profile
router.get('/me', authMiddleware, async (req, res) => {
  try {
    res.json(req.user)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router

