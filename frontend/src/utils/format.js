export function formatINR(value) {
  const n = Number(value)
  if (!Number.isFinite(n) || n <= 0) return ''
  return `₹${n.toLocaleString('en-IN')}`
}

export function startingPriceLabel(vendor) {
  if (!vendor) return 'Contact for pricing'
  if (Number(vendor.startingPrice) > 0) return `Starting from ${formatINR(vendor.startingPrice)}`
  if (vendor.priceRange && vendor.priceRange !== 'Contact for pricing') {
    // If priceRange already reads like a price, keep it; else prefix.
    return /₹|rs|inr|\d/i.test(vendor.priceRange) ? vendor.priceRange : vendor.priceRange
  }
  // Try to pull a number out of a legacy priceRange string.
  const m = String(vendor.priceRange || '').match(/[\d,]+/)
  if (m) {
    const n = parseInt(m[0].replace(/,/g, ''), 10)
    if (Number.isFinite(n) && n > 0) return `Starting from ${formatINR(n)}`
  }
  return 'Contact for pricing'
}

export function vendorImage(vendor, index = 0) {
  if (!vendor) return fallbackImage()
  return (
    vendor.profileImage ||
    vendor.portfolioImages?.[index] ||
    vendor.gallery?.[index] ||
    vendor.coverImage ||
    fallbackImage()
  )
}

export function coverImage(vendor) {
  if (!vendor) return fallbackImage(1200)
  return vendor.coverImage || vendor.portfolioImages?.[0] || vendor.profileImage || fallbackImage(1200)
}

export function fallbackImage(w = 800) {
  return `https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=${w}&auto=format&fit=crop`
}

export function vendorLocation(vendor) {
  const city = vendor?.location?.city || ''
  const state = vendor?.location?.state || ''
  if (city && state) return `${city}, ${state}`
  return city || state || 'Location on request'
}

export function profileCompletion(vendor) {
  if (!vendor) return 0
  const checks = [
    !!vendor.name,
    !!(vendor.companyName || vendor.name),
    !!(vendor.description && vendor.description.length > 20),
    !!vendor.profileImage,
    !!((vendor.portfolioImages || []).length > 0),
    !!(vendor.location?.city),
    !!((vendor.services || []).length > 0 || vendor.priceRange),
    !!((vendor.packages || []).length > 0 || Number(vendor.startingPrice) > 0),
  ]
  return Math.round((checks.filter(Boolean).length / checks.length) * 100)
}

export function normalizeVendors(payload) {
  // Backend returns either an array (no pagination) or { vendors, total, page, pages }.
  if (Array.isArray(payload)) return { vendors: payload, total: payload.length, page: 1, pages: 1 }
  return {
    vendors: payload?.vendors || [],
    total: payload?.total ?? (payload?.vendors || []).length,
    page: payload?.page || 1,
    pages: payload?.pages || 1,
  }
}
