const express = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const router = express.Router()

// @route   POST api/auth/register
// @desc    Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, role = 'user' } = req.body

    // Check if user exists
    let user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({ error: 'User already exists' })
    }

    // Create user
    user = new User({ email, password, role })
    await user.save()

    // Generate JWT
    const payload = {
      id: user._id
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// @route   POST api/auth/login
// @desc    Login user / Returning JWT token
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await User.findOne({ email })
    if (!user || !await user.comparePassword(password)) {
      return res.status(400).json({ error: 'Invalid credentials' })
    }

    // Generate JWT
    const payload = {
      id: user._id
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router

