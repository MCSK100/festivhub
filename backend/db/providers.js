// Service providers (+ services + packages) table access.
const { getSupabase } = require('../utils/supabase')
const { mapProvider } = require('./map')

async function fetchChildren(providerIds) {
  if (!providerIds.length) return { servicesBy: {}, packagesBy: {} }
  const db = getSupabase()
  const [svcRes, pkgRes] = await Promise.all([
    db.from('vendor_services').select('*').in('provider_id', providerIds).order('created_at', { ascending: true }),
    db.from('vendor_packages').select('*').in('provider_id', providerIds).order('created_at', { ascending: true }),
  ])
  if (svcRes.error) throw svcRes.error
  if (pkgRes.error) throw pkgRes.error
  const servicesBy = {}
  const packagesBy = {}
  for (const s of svcRes.data || []) (servicesBy[s.provider_id] = servicesBy[s.provider_id] || []).push(s)
  for (const p of pkgRes.data || []) (packagesBy[p.provider_id] = packagesBy[p.provider_id] || []).push(p)
  return { servicesBy, packagesBy }
}

async function withChildren(rows) {
  const ids = (rows || []).map((r) => r.id)
  const { servicesBy, packagesBy } = await fetchChildren(ids)
  return (rows || []).map((r) => mapProvider(r, servicesBy[r.id] || [], packagesBy[r.id] || []))
}

async function findById(id) {
  const { data, error } = await getSupabase().from('service_providers').select('*').eq('id', id).single()
  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  const [mapped] = await withChildren([data])
  return mapped
}

async function findByUserId(userId) {
  const { data, error } = await getSupabase()
    .from('service_providers')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()
  if (error) throw error
  if (!data) return null
  const [mapped] = await withChildren([data])
  return mapped
}

async function findRawByUserId(userId) {
  const { data, error } = await getSupabase()
    .from('service_providers')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()
  if (error) throw error
  return data
}

async function listPublished(limit = 1000) {
  const { data, error } = await getSupabase()
    .from('service_providers')
    .select('*')
    .neq('is_published', false)
    .order('rating_average', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return withChildren(data || [])
}

async function create(row) {
  const { data, error } = await getSupabase().from('service_providers').insert(row).select('*').single()
  if (error) throw error
  const [mapped] = await withChildren([data])
  return mapped
}

function toRow(patch) {
  // camelCase API patch → snake_case columns (allowlisted by callers)
  const row = {}
  if (patch.name !== undefined) row.name = patch.name
  if (patch.companyName !== undefined) row.company_name = patch.companyName
  if (patch.category !== undefined) row.category = patch.category
  if (patch.experience !== undefined) row.experience = String(patch.experience)
  if (patch.description !== undefined) row.description = patch.description
  if (patch.profileImage !== undefined) row.profile_image = patch.profileImage
  if (patch.coverImage !== undefined) row.cover_image = patch.coverImage
  if (patch.phone !== undefined) row.phone = patch.phone
  if (patch.contactEmail !== undefined) row.contact_email = patch.contactEmail
  if (patch.location !== undefined) {
    if (patch.location.city !== undefined) row.city = patch.location.city
    if (patch.location.state !== undefined) row.state = patch.location.state
    if (patch.location.coordinates?.lat !== undefined) row.lat = patch.location.coordinates.lat
    if (patch.location.coordinates?.lng !== undefined) row.lng = patch.location.coordinates.lng
  }
  if (patch.socialLinks !== undefined) {
    if (patch.socialLinks.facebook !== undefined) row.facebook = patch.socialLinks.facebook
    if (patch.socialLinks.instagram !== undefined) row.instagram = patch.socialLinks.instagram
    if (patch.socialLinks.website !== undefined) row.website = patch.socialLinks.website
    if (patch.socialLinks.youtube !== undefined) row.youtube = patch.socialLinks.youtube
  }
  if (patch.priceRange !== undefined) row.price_range = patch.priceRange
  if (patch.startingPrice !== undefined) {
    const n = Number(patch.startingPrice)
    row.starting_price = Number.isFinite(n) && n >= 0 ? n : 0
  }
  if (patch.businessHours !== undefined) row.business_hours = patch.businessHours
  if (patch.availability !== undefined) row.availability = !!patch.availability
  if (patch.isPublished !== undefined) row.is_published = !!patch.isPublished
  if (patch.portfolioImages !== undefined) row.portfolio_images = patch.portfolioImages
  if (patch.gallery !== undefined) row.gallery = patch.gallery
  return row
}

async function updateByUserId(userId, patch) {
  const row = toRow(patch)
  const { data, error } = await getSupabase()
    .from('service_providers')
    .update(row)
    .eq('user_id', userId)
    .select('*')
    .maybeSingle()
  if (error) throw error
  if (!data) return null
  const [mapped] = await withChildren([data])
  return mapped
}

// Full-replace services/packages arrays (used by PUT /profile when the
// vendor dashboard saves the whole form).
async function replaceServices(providerId, services) {
  const db = getSupabase()
  const { error: delErr } = await db.from('vendor_services').delete().eq('provider_id', providerId)
  if (delErr) throw delErr
  if (services?.length) {
    const rows = services.map((s) => ({
      provider_id: providerId,
      name: s.name,
      description: s.description || '',
      starting_price: Number(s.startingPrice) || 0,
    }))
    const { error } = await db.from('vendor_services').insert(rows)
    if (error) throw error
  }
}

async function replacePackages(providerId, packages) {
  const db = getSupabase()
  const { error: delErr } = await db.from('vendor_packages').delete().eq('provider_id', providerId)
  if (delErr) throw delErr
  if (packages?.length) {
    const rows = packages.map((p) => ({
      provider_id: providerId,
      name: p.name,
      price: Number(p.price) || 0,
      description: p.description || '',
      features: Array.isArray(p.features) ? p.features : [],
    }))
    const { error } = await db.from('vendor_packages').insert(rows)
    if (error) throw error
  }
}

module.exports = {
  findById,
  findByUserId,
  findRawByUserId,
  listPublished,
  create,
  toRow,
  updateByUserId,
  replaceServices,
  replacePackages,
}
