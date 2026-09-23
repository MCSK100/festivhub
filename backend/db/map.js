// Row → API-shape mappers. The REST contract is unchanged from the
// Mongo/Mongoose era (camelCase, `_id` + `id`, `createdAt`/`updatedAt`),
// so the frontend works untouched against Supabase Postgres.

function toNum(v, fallback = 0) {
  const n = Number(v)
  return Number.isFinite(n) ? n : fallback
}

function mapUser(row) {
  if (!row) return null
  const publicUser = {
    _id: row.id,
    id: row.id,
    email: row.email,
    name: row.name || '',
    role: row.role,
    avatar: row.avatar || '',
    authProvider: row.auth_provider || 'local',
    trialExpiration: row.trial_expiration,
    providerProfile: row.provider_profile_id || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    // snake_case mirrors for any client reading raw columns
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
  return publicUser
}

function mapServiceRow(row) {
  if (!row) return null
  return {
    _id: row.id,
    id: row.id,
    name: row.name,
    description: row.description || '',
    startingPrice: toNum(row.starting_price, 0),
  }
}

function mapPackageRow(row) {
  if (!row) return null
  return {
    _id: row.id,
    id: row.id,
    name: row.name,
    price: toNum(row.price, 0),
    description: row.description || '',
    features: Array.isArray(row.features) ? row.features : [],
  }
}

function mapProvider(row, services = [], packages = []) {
  if (!row) return null
  return {
    _id: row.id,
    id: row.id,
    name: row.name,
    companyName: row.company_name || '',
    category: row.category,
    experience: row.experience || '0',
    description: row.description || '',
    profileImage: row.profile_image || '',
    coverImage: row.cover_image || '',
    phone: row.phone || '',
    contactEmail: row.contact_email || '',
    location: {
      city: row.city || '',
      state: row.state || '',
      coordinates: {
        lat: row.lat ?? null,
        lng: row.lng ?? null,
      },
    },
    socialLinks: {
      facebook: row.facebook || '',
      instagram: row.instagram || '',
      website: row.website || '',
      youtube: row.youtube || '',
    },
    portfolioImages: Array.isArray(row.portfolio_images) ? row.portfolio_images : [],
    gallery: Array.isArray(row.gallery) ? row.gallery : [],
    services: services.map(mapServiceRow),
    packages: packages.map(mapPackageRow),
    ratings: {
      average: toNum(row.rating_average, 0),
      count: Math.trunc(toNum(row.rating_count, 0)),
    },
    availability: row.availability !== false,
    priceRange: row.price_range || 'Contact for pricing',
    startingPrice: toNum(row.starting_price, 0),
    businessHours: row.business_hours || '',
    isPublished: row.is_published !== false,
    bookings: [],
    enquiries: [],
    userId: row.user_id || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

function mapEnquiry(row, vendorMini = null) {
  if (!row) return null
  return {
    _id: row.id,
    id: row.id,
    vendor: vendorMini || row.vendor_id,
    fullName: row.full_name,
    phone: row.phone,
    email: row.email,
    eventType: row.event_type,
    eventDate: row.event_date,
    eventLocation: row.event_location,
    guests: Math.trunc(toNum(row.guests, 0)),
    budget: row.budget || '',
    message: row.message || '',
    status: row.status,
    isRead: !!row.is_read,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

function mapBooking(row, customerMini = null, vendorMini = null) {
  if (!row) return null
  return {
    _id: row.id,
    id: row.id,
    customer: customerMini || row.customer_id,
    vendor: vendorMini || row.vendor_id,
    serviceTitle: row.service_title,
    price: toNum(row.price, 0),
    date: row.date,
    status: row.status,
    notes: row.notes || '',
    isRead: !!row.is_read,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

function vendorMini(row) {
  if (!row) return null
  return {
    _id: row.id,
    id: row.id,
    name: row.company_name || row.name,
    companyName: row.company_name || '',
    category: row.category,
  }
}

function customerMini(row) {
  if (!row) return null
  return { _id: row.id, id: row.id, name: row.name || '', email: row.email }
}

module.exports = {
  mapUser,
  mapProvider,
  mapServiceRow,
  mapPackageRow,
  mapEnquiry,
  mapBooking,
  vendorMini,
  customerMini,
}
