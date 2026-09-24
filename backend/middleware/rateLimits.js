// Shared rate limiters — abuse protection for public + write endpoints.
const rateLimit = require('express-rate-limit')

// Public enquiry form: max 10 booking requests per hour per IP (spam guard).
const enquiryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { error: 'Too many booking requests. Please try again in an hour.' },
  standardHeaders: true,
  legacyHeaders: false,
})

// Password-reset email: max 5 per hour per IP (abuse + mail-cost guard).
const forgotLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { error: 'Too many reset attempts. Please try again in an hour.' },
  standardHeaders: true,
  legacyHeaders: false,
})

// Authenticated mutations (provider dashboard, bookings): generous ceiling
// that still stops runaway scripts. GET reads are never limited.
const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: 'Too many requests. Please slow down and try again.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS',
})

module.exports = { enquiryLimiter, forgotLimiter, writeLimiter }
