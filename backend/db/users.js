// Users table access (Supabase). Passwords stay bcrypt-hashed; the JWT
// contract ({ token, user }) is unchanged.
const bcrypt = require('bcryptjs')
const { getSupabase } = require('../utils/supabase')
const { mapUser } = require('./map')

async function findById(id) {
  const { data, error } = await getSupabase().from('users').select('*').eq('id', id).single()
  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data
}

async function findByEmail(email) {
  const { data, error } = await getSupabase()
    .from('users')
    .select('*')
    .eq('email', String(email).toLowerCase().trim())
    .maybeSingle()
  if (error) throw error
  return data
}

async function findByGoogleId(googleId) {
  const { data, error } = await getSupabase().from('users').select('*').eq('google_id', googleId).maybeSingle()
  if (error) throw error
  return data
}

async function create({ email, password, name = '', role = 'vendor', authProvider = 'local', googleId = null, avatar = '' }) {
  const trial = new Date()
  trial.setDate(trial.getDate() + 30)
  const row = {
    email: String(email).toLowerCase().trim(),
    name: String(name || '').trim(),
    role,
    auth_provider: authProvider,
    google_id: googleId || null,
    avatar: avatar || '',
    trial_expiration: trial.toISOString(),
  }
  if (password) row.password_hash = await bcrypt.hash(password, 12)
  const { data, error } = await getSupabase().from('users').insert(row).select('*').single()
  if (error) throw error
  return data
}

async function update(id, patch) {
  const { data, error } = await getSupabase().from('users').update(patch).eq('id', id).select('*').single()
  if (error) throw error
  return data
}

async function setPassword(id, plainPassword) {
  const password_hash = await bcrypt.hash(plainPassword, 12)
  return update(id, { password_hash })
}

async function comparePassword(row, candidate) {
  if (!row?.password_hash || !candidate) return false
  return bcrypt.compare(candidate, row.password_hash)
}

module.exports = {
  mapUser,
  findById,
  findByEmail,
  findByGoogleId,
  create,
  update,
  setPassword,
  comparePassword,
}
