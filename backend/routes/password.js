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

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Generate reset token (valid for 1 hour)
    const resetToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )

    // Send reset email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`
    
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
    res.status(500).json({ error: 'Failed to process password reset request' })
  }
})

// @route   POST /api/password/reset
// @desc    Reset password with token
router.post('/reset', async (req, res) => {
  try {
    const { token, newPassword } = req.body

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
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
