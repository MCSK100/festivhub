import { Link } from 'react-router-dom'
import { MapPin, Star, BadgeCheck } from 'lucide-react'
import { vendorImage, vendorLocation, startingPriceLabel } from '../../utils/format'

export default function VendorCard({ vendor }) {
  if (!vendor) return null
  const name = vendor.companyName || vendor.name || 'Vendor'
  const rating = Number(vendor.ratings?.average) || 0
  const count = Number(vendor.ratings?.count) || 0

  return (
    <article className="group flex flex-col overflow-hidden rounded-[20px] border border-black/5 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <Link to={`/vendors/${vendor._id}`} className="block overflow-hidden" aria-label={`View ${name}`}>
        <div className="aspect-[4/3] overflow-hidden bg-[#0b1311]/5">
          <img
            src={vendorImage(vendor)}
            alt={`${name} — ${vendor.category || 'event vendor'}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-bold leading-snug text-[#0b1311]">
            <Link to={`/vendors/${vendor._id}`} className="hover:text-[#1e4137]">
              {name}
            </Link>
          </h3>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#1e4137]/5 px-2.5 py-1 text-xs font-semibold text-[#1e4137]">
            <BadgeCheck className="h-3.5 w-3.5" />
            Verified
          </span>
        </div>
        <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-[#1e4137]/80">{vendor.category}</p>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-[#0b1311]/60">
          <MapPin className="h-4 w-4 text-[#1e4137]" />
          {vendorLocation(vendor)}
        </p>
        <div className="mt-2 flex items-center gap-1.5 text-sm">
          <Star className={`h-4 w-4 ${rating > 0 ? 'fill-[#1e4137] text-[#1e4137]' : 'text-[#0b1311]/20'}`} />
          <span className="font-semibold text-[#0b1311]">{rating > 0 ? rating.toFixed(1) : 'New'}</span>
          {count > 0 && <span className="text-[#0b1311]/50">({count})</span>}
        </div>
        <p className="mt-3 text-sm font-bold text-[#0b1311]">{startingPriceLabel(vendor)}</p>
        <Link
          to={`/vendors/${vendor._id}`}
          className="mt-4 rounded-full border border-[#1e4137]/20 bg-white px-5 py-2.5 text-center text-sm font-semibold text-[#1e4137] transition-colors hover:border-[#1e4137] hover:bg-[#1e4137] hover:text-[#bad6ff]"
        >
          View Profile
        </Link>
      </div>
    </article>
  )
}
