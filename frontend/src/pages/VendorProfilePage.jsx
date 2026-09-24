import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { MapPin, Star, BadgeCheck, Phone, Globe, Instagram, Facebook, Youtube, Clock } from 'lucide-react'
import SEO from '../components/common/SEO'
import PortfolioGallery from '../components/marketplace/PortfolioGallery'
import BookingForm, { BookingSuccess } from '../components/marketplace/BookingForm'
import { PageSkeleton } from '../components/common/LoadingSkeleton'
import { ErrorState } from '../components/common/EmptyState'
import api from '../services/api'
import { coverImage, vendorLocation, startingPriceLabel, formatINR } from '../utils/format'

export default function VendorProfilePage() {
  const { vendorId } = useParams()
  const [vendor, setVendor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [sent, setSent] = useState(false)

  const fetchVendor = async () => {
    setLoading(true)
    setError(false)
    try {
      const res = await api.get(`/providers/${vendorId}`)
      setVendor(res.data)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVendor()
    setSent(false)
    window.scrollTo(0, 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendorId])

  if (loading) return <div className="bg-[#fff7f0] pt-24 lg:pt-28"><PageSkeleton /></div>
  if (error || !vendor) {
    return (
      <div className="mx-auto max-w-3xl bg-[#fff7f0] px-4 pb-16 pt-24 lg:pt-28">
        <ErrorState title="Vendor not found." onRetry={fetchVendor} />
        <Link to="/vendors" className="mt-6 inline-block text-sm font-semibold text-[#1e4137] underline underline-offset-4">Back to vendors</Link>
      </div>
    )
  }

  const name = vendor.companyName || vendor.name
  const rating = Number(vendor.ratings?.average) || 0
  const images = vendor.portfolioImages?.length ? vendor.portfolioImages : vendor.gallery || []
  const socials = vendor.socialLinks || {}

  return (
    <div className="bg-[#fff7f0]">
      <SEO
        title={`${name} | ${vendor.category} in ${vendor.location?.city || 'India'}`}
        description={(vendor.description || `${name} — ${vendor.category} on FestivLink.`).slice(0, 160)}
        path={`/vendors/${vendor._id}`}
        image={coverImage(vendor)}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'ProfessionalService',
          name,
          description: (vendor.description || `${name} — ${vendor.category} on FestivLink.`).slice(0, 300),
          image: coverImage(vendor),
          url: `https://festivlink.vercel.app/vendors/${vendor._id}`,
          priceRange: startingPriceLabel(vendor),
          address: {
            '@type': 'PostalAddress',
            addressLocality: vendor.location?.city || undefined,
            addressRegion: vendor.location?.state || undefined,
            addressCountry: 'IN',
          },
          ...(rating > 0
            ? {
                aggregateRating: {
                  '@type': 'AggregateRating',
                  ratingValue: rating.toFixed(1),
                  reviewCount: Math.max(1, Number(vendor.ratings?.count) || 1),
                },
              }
            : {}),
        }}
      />
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-6 lg:px-8 lg:pt-24">
        <Link to="/vendors" className="text-sm font-semibold text-[#1e4137] underline underline-offset-4">← All vendors</Link>

        {/* Cover */}
        <div className="mt-4 overflow-hidden rounded-[var(--jak-border-radius)] border border-black/5 bg-white shadow-sm">
          <img src={coverImage(vendor)} alt={`${name} cover`} className="aspect-[21/9] w-full object-cover" loading="eager" />
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-3">
          {/* Main */}
          <div className="lg:col-span-2">
            <div className="flex items-start gap-4">
              {vendor.profileImage && (
                <img src={vendor.profileImage} alt={`${name} profile`} className="h-20 w-20 rounded-2xl border border-black/5 object-cover" />
              )}
              <div>
                <h1 className="flex flex-wrap items-center gap-2 text-3xl font-bold tracking-tight">
                  {name}
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#1e4137]/5 px-3 py-1 text-xs font-semibold text-[#1e4137]">
                    <BadgeCheck className="h-4 w-4" /> Verified
                  </span>
                </h1>
                <p className="mt-1 text-sm font-semibold uppercase tracking-wider text-[#1e4137]/80">{vendor.category}</p>
                <p className="mt-1.5 flex items-center gap-1.5 text-sm text-[#0b1311]/60">
                  <MapPin className="h-4 w-4 text-[#1e4137]" /> {vendorLocation(vendor)}
                </p>
                <p className="mt-1.5 flex items-center gap-1.5 text-sm">
                  <Star className={`h-4 w-4 ${rating > 0 ? 'fill-[#1e4137] text-[#1e4137]' : 'text-[#0b1311]/20'}`} />
                  <span className="font-semibold">{rating > 0 ? rating.toFixed(1) : 'New'}</span>
                  {vendor.ratings?.count > 0 && <span className="text-[#0b1311]/50">({vendor.ratings.count} reviews)</span>}
                  <span className="text-[#0b1311]/40">•</span>
                  <span className="font-bold">{startingPriceLabel(vendor)}</span>
                </p>
              </div>
            </div>

            {/* ABOUT */}
            <section className="mt-8 rounded-[20px] border border-black/5 bg-white p-6 shadow-sm" aria-labelledby="v-about">
              <h2 id="v-about" className="text-lg font-bold">About</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-[#0b1311]/70">
                {vendor.description || 'This vendor has not added a description yet.'}
              </p>
              <dl className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
                <div className="rounded-xl bg-[#0b1311]/[0.03] p-3"><dt className="text-xs font-semibold uppercase tracking-wider text-[#0b1311]/50">Experience</dt><dd className="mt-1 font-semibold">{vendor.experience || '—'}</dd></div>
                <div className="rounded-xl bg-[#0b1311]/[0.03] p-3"><dt className="text-xs font-semibold uppercase tracking-wider text-[#0b1311]/50">Location</dt><dd className="mt-1 font-semibold">{vendorLocation(vendor)}</dd></div>
                <div className="rounded-xl bg-[#0b1311]/[0.03] p-3"><dt className="text-xs font-semibold uppercase tracking-wider text-[#0b1311]/50">Availability</dt><dd className="mt-1 font-semibold">{vendor.availability === false ? 'Currently busy' : 'Available'}</dd></div>
              </dl>
              {(vendor.businessHours || vendor.phone || vendor.contactEmail) && (
                <div className="mt-4 space-y-1.5 text-sm text-[#0b1311]/70">
                  {vendor.businessHours && <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-[#1e4137]" /> {vendor.businessHours}</p>}
                  {vendor.phone && <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-[#1e4137]" /> {vendor.phone}</p>}
                </div>
              )}
            </section>

            {/* SERVICES */}
            <section className="mt-6 rounded-[20px] border border-black/5 bg-white p-6 shadow-sm" aria-labelledby="v-services">
              <h2 id="v-services" className="text-lg font-bold">Services</h2>
              {(vendor.services || []).length === 0 ? (
                <p className="mt-2 text-sm text-[#0b1311]/60">Services will be listed here. Contact the vendor for details.</p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {vendor.services.map((s) => (
                    <li key={s._id || s.name} className="flex items-start justify-between gap-4 rounded-xl bg-[#0b1311]/[0.03] p-4">
                      <div>
                        <p className="font-semibold">{s.name}</p>
                        {s.description && <p className="mt-1 text-sm text-[#0b1311]/60">{s.description}</p>}
                      </div>
                      {Number(s.startingPrice) > 0 && <p className="shrink-0 text-sm font-bold">{formatINR(s.startingPrice)}</p>}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* PORTFOLIO */}
            <section className="mt-6 rounded-[20px] border border-black/5 bg-white p-6 shadow-sm" aria-labelledby="v-portfolio">
              <h2 id="v-portfolio" className="text-lg font-bold">Portfolio</h2>
              <div className="mt-4"><PortfolioGallery images={images} name={name} /></div>
            </section>

            {/* PRICING */}
            <section className="mt-6 rounded-[20px] border border-black/5 bg-white p-6 shadow-sm" aria-labelledby="v-pricing">
              <h2 id="v-pricing" className="text-lg font-bold">Pricing</h2>
              <p className="mt-2 text-sm text-[#0b1311]/60">{startingPriceLabel(vendor)}. Contact the vendor for a custom quote.</p>
            </section>

            {/* LOCATION */}
            <section className="mt-6 rounded-[20px] border border-black/5 bg-white p-6 shadow-sm" aria-labelledby="v-location">
              <h2 id="v-location" className="text-lg font-bold">Location</h2>
              <p className="mt-2 flex items-center gap-2 text-[15px] text-[#0b1311]/70"><MapPin className="h-4 w-4 text-[#1e4137]" /> {vendorLocation(vendor)}</p>
            </section>

            {/* SOCIAL */}
            {(socials.website || socials.instagram || socials.facebook || socials.youtube) && (
              <section className="mt-6 rounded-[20px] border border-black/5 bg-white p-6 shadow-sm" aria-labelledby="v-social">
                <h2 id="v-social" className="text-lg font-bold">Links</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {socials.website && <a href={socials.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm font-semibold hover:border-[#1e4137]"><Globe className="h-4 w-4" /> Website</a>}
                  {socials.instagram && <a href={socials.instagram} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm font-semibold hover:border-[#1e4137]"><Instagram className="h-4 w-4" /> Instagram</a>}
                  {socials.facebook && <a href={socials.facebook} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm font-semibold hover:border-[#1e4137]"><Facebook className="h-4 w-4" /> Facebook</a>}
                  {socials.youtube && <a href={socials.youtube} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm font-semibold hover:border-[#1e4137]"><Youtube className="h-4 w-4" /> YouTube</a>}
                </div>
              </section>
            )}
          </div>

          {/* Booking sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[20px] border border-black/5 bg-white p-6 shadow-sm" aria-labelledby="v-book">
              <h2 id="v-book" className="text-lg font-bold">Send Booking Request</h2>
              <p className="mt-1 text-sm text-[#0b1311]/60">No account needed. The vendor replies directly.</p>
              <div className="mt-5">
                {sent ? <BookingSuccess vendorName={name} /> : <BookingForm vendor={vendor} onSuccess={() => setSent(true)} />}
              </div>
              {!sent && (
                <Link to={`/book/${vendor._id}`} className="mt-3 block text-center text-sm font-semibold text-[#1e4137] underline underline-offset-4">
                  Open full booking page
                </Link>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
