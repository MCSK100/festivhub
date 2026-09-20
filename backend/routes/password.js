const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const authMiddleware = require('../middleware/auth')
const nodemailer = require('nodemailer')

// Configure email service
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
})

// @route   POST /api/password/forgot
// @desc    Request password reset
router.post('/forgot', async (req, res) => {
  try {
    const { email } = req.body
    if (!email) {
      return res.status(400).json({ error: 'Email is required' })
    }
    const normalized = String(email).toLowerCase().trim()

    const user = await User.findOne({ email: normalized })
    // Always return generic success → prevent user enumeration
    if (!user) {
      return res.json({ message: 'If an account exists for this email, a reset link has been sent.' })
    }

    // Generate reset token with purpose claim (valid for 1 hour)
    const resetToken = jwt.sign(
      { id: user._id, email: user.email, purpose: 'password-reset' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )

    // Send reset email
    const baseUrl = (process.env.FRONTEND_URL || process.env.CORS_ORIGIN || 'http://localhost:3000').split(',')[0].trim().replace(/\/$/, '')
    const resetUrl = `${baseUrl}/reset-password/${resetToken}`
    
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'FestivLink - Password Reset Request',
      html: `
        <h2>Password Reset Request</h2>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link expires in 1 hour.</p>
        <p>If you didn't request this, ignore this email.</p>
      `
    })

    res.json({ message: 'Password reset email sent successfully' })
  } catch (error) {
    console.error('Forgot password error:', error)
    // Still return generic message to avoid leaking state
    res.json({ message: 'If an account exists for this email, a reset link has been sent.' })
  }
})

// @route   POST /api/password/reset
// @desc    Reset password with token
router.post('/reset', async (req, res) => {
  try {
    const { token, newPassword } = req.body
    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' })
    }
    if (String(newPassword).length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (decoded.purpose !== 'password-reset') {
      return res.status(400).json({ error: 'Invalid reset token' })
    }
    
    const user = await User.findById(decoded.id)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Update password
    user.password = newPassword
    await user.save()

    res.json({ success: true, message: 'Password reset successfully' })
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ error: 'Reset token has expired' })
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({ error: 'Invalid reset token' })
    }
    console.error('Password reset error:', error)
    res.status(500).json({ error: 'Failed to reset password' })
  }
})

// @route   POST /api/password/change
// @desc    Change password (authenticated user)
router.post('/change', authMiddleware, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: 'Old and new passwords are required' })
    }
    if (String(newPassword).length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' })
    }
    const user = await User.findById(req.user._id)

    // Verify old password
    const isMatch = await user.comparePassword(oldPassword)
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' })
    }

    // Update password
    user.password = newPassword
    await user.save()

    res.json({ success: true, message: 'Password changed successfully' })
  } catch (error) {
    console.error('Change password error:', error)
    res.status(500).json({ error: 'Failed to change password' })
  }
})

module.exports = router
