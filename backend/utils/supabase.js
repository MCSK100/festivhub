// Supabase admin client (service-role key, bypasses RLS).
// All backend DB + Storage access goes through this module so routes never
// touch Mongoose/Cloudinary anymore.
const { createClient } = require('@supabase/supabase-js')

let client = null

function getSupabase() {
  if (client) return client
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error(
      'Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in backend/.env (see supabase/README.md).'
    )
  }
  client = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
  return client
}

module.exports = { getSupabase }
