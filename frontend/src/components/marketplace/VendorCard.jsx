import { Link } from 'react-router-dom'
import { MapPin, Star, BadgeCheck, ArrowUpRight, Heart } from 'lucide-react'
import { useState } from 'react'
import { vendorImage, vendorLocation, startingPriceLabel } from '../../utils/format'

export default function VendorCard({ vendor }) {
  const [liked, setLiked] = useState(false)
  if (!vendor) return null
  const name = vendor.companyName || vendor.name || 'Vendor'
  const rating = Number(vendor.ratings?.average) || 0
  const count = Number(vendor.ratings?.count) || 0

  return (
    <article className="glass-ios group relative flex flex-col overflow-hidden rounded-[26px] transition-all duration-300 hover:-translate-y-1.5">
      <Link to={`/vendors/${vendor._id}`} className="relative block overflow-hidden" aria-label={`View ${name}`}>
        <div className="aspect-[4/3] overflow-hidden bg-[#0b1311]/5">
          <img
            src={vendorImage(vendor)}
            alt={`${name} — ${vendor.category || 'event vendor'}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.07]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* top badges */}
        <div className="absolute left-3 right-3 top-3 flex items-start justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#0b1311] shadow backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {vendor.category || 'Vendor'}
          </span>
          <button
            type="button"
            aria-label={liked ? 'Remove from favourites' : 'Save to favourites'}
            aria-pressed={liked}
            onClick={(e) => {
              e.preventDefault()
              setLiked((v) => !v)
            }}
            className={`flex h-9 w-9 items-center justify-center rounded-full shadow backdrop-blur transition-all ${
              liked ? 'bg-rose-500 text-white' : 'bg-white/95 text-[#0b1311] hover:bg-white'
            }`}
          >
            <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* price chip */}
        <span className="absolute bottom-3 left-3 rounded-full bg-black/45 px-3.5 py-1.5 text-[12px] font-bold text-white backdrop-blur-xl">
          {startingPriceLabel(vendor)}
        </span>
        {rating > 0 && (
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1.5 text-[12px] font-bold text-[#0b1311] shadow backdrop-blur">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            {rating.toFixed(1)}
            {count > 0 && <span className="font-semibold text-[#0b1311]/50">({count})</span>}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[16px] font-bold leading-snug tracking-tight text-[#0b1311]">
            <Link to={`/vendors/${vendor._id}`} className="transition-colors hover:text-[#1e4137]">
              {name}
            </Link>
          </h3>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
            <BadgeCheck className="h-3.5 w-3.5" />
            Verified
          </span>
        </div>
        <p className="mt-1.5 flex items-center gap-1.5 text-[13px] font-medium text-[#0b1311]/55">
          <MapPin className="h-4 w-4 shrink-0 text-[#1e4137]" />
          {vendorLocation(vendor)}
        </p>

        <div className="mt-4 flex gap-2 border-t border-black/5 pt-4">
          <Link
            to={`/vendors/${vendor._id}`}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[#0b1311] px-5 py-2.5 text-[13px] font-bold text-white transition-all hover:bg-[#1e4137]"
          >
            View profile
          </Link>
          <Link
            to={`/vendors/${vendor._id}`}
            aria-label={`Enquire ${name}`}
            className="inline-flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full border border-black/10 bg-white text-[#0b1311] transition-all hover:border-[#1e4137] hover:bg-[#1e4137] hover:text-white"
          >
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  )
}
