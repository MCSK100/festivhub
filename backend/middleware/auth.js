const jwt = require('jsonwebtoken')
const Users = require('../db/users')

const authMiddleware = async (req, res, next) => {
  try {
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not configured')
      return res.status(500).json({ error: 'Server auth misconfigured' })
    }
    const header = req.header('Authorization') || ''
    const token = header.replace(/^Bearer\s+/i, '').trim()

    if (!token || token.toLowerCase() === 'null' || token.toLowerCase() === 'undefined') {
      return res.status(401).json({ error: 'No token, authorization denied' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (decoded.purpose && decoded.purpose !== 'auth') {
      return res.status(401).json({ error: 'Token is not valid' })
    }

    const row = await Users.findById(decoded.id)
    if (!row || row.is_active === false) {
      return res.status(401).json({ error: 'Token is not valid' })
    }

    req.user = { ...Users.mapUser(row), _id: row.id }
    next()
  } catch (err) {
    console.error('Auth middleware error:', err.message)
    res.status(401).json({ error: 'Token is not valid' })
  }
}

module.exports = authMiddleware
