const express = require('express')
const jwt = require('jsonwebtoken')
const { OAuth2Client } = require('google-auth-library')
const Users = require('../db/users')
const Providers = require('../db/providers')
const authMiddleware = require('../middleware/auth');
const router = express.Router()

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

function issueToken(user) {
  return jwt.sign({ id: user.id || user._id, purpose: 'auth' }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

function publicUser(row) {
  return Users.mapUser(row)
}

async function ensureVendorProfile(row) {
  try {
    if (row.role !== 'vendor' || row.provider_profile_id) return
    const provider = await Providers.create({
      user_id: row.id,
      name: row.name || String(row.email).split('@')[0],
      category: 'Photography',
      experience: '0',
      company_name: '',
      description: '',
      profile_image: row.avatar || '',
      city: '',
      state: '',
      price_range: 'Contact for pricing',
      portfolio_images: [],
      gallery: []
    })
    await Users.update(row.id, { provider_profile_id: provider.id })
  } catch (err) {
    console.error('Vendor profile creation failed:', err.message)
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
    // bcrypt truncates at 72 bytes — reject longer passwords instead of
    // silently weakening them.
    if (String(password).length > 72) {
      return res.status(400).json({ error: 'Password must be at most 72 characters' })
    }
    if (!['customer', 'vendor'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' })
    }

    // Check if user exists (case-insensitive — email column is citext)
    const existing = await Users.findByEmail(email)
    if (existing) {
      return res.status(400).json({ error: 'User already exists' })
    }

    const row = await Users.create({ email, password, name: String(name || '').trim(), role })

    if (role === 'vendor') {
      await ensureVendorProfile(row)
    }

    const fresh = await Users.findById(row.id)
    const token = issueToken(fresh || row)

    res.status(201).json({ token, user: publicUser(fresh || row) })
  } catch (err) {
    console.error(err)
    if (err?.code === '23505') {
      return res.status(400).json({ error: 'User already exists' })
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
    const row = await Users.findByEmail(email)
    if (!row || !await Users.comparePassword(row, password)) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Generate JWT
    const token = issueToken(row)

    res.json({ token, user: publicUser(row) })
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
    let row = await Users.findByGoogleId(googleId)

    // 2. Existing local account with same email → link it
    if (!row) {
      row = await Users.findByEmail(email)
      if (row) {
        // Don't hijack: only link if local account has no googleId yet
        if (row.google_id && row.google_id !== googleId) {
          return res.status(409).json({ error: 'This email is already linked to another Google account' })
        }
        const patch = { google_id: googleId }
        if (!row.avatar && avatar) patch.avatar = avatar
        if (!row.name && name) patch.name = name
        if (row.auth_provider === 'local' && !row.password_hash) patch.auth_provider = 'google'
        row = await Users.update(row.id, patch)
      }
    }

    // 3. Brand-new user → create
    if (!row) {
      row = await Users.create({ email, name, role, googleId, avatar, authProvider: 'google' })
    }

    await ensureVendorProfile(row)
    const fresh = await Users.findById(row.id)

    const token = issueToken(fresh || row)
    res.json({ token, user: publicUser(fresh || row) })
  } catch (err) {
    console.error(err)
    if (err?.code === '23505') {
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
