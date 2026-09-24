import { MapPin, ArrowUpDown, LayoutGrid } from 'lucide-react'
import { CATEGORY_NAMES, POPULAR_LOCATIONS } from '../../data/categories'

export default function VendorFilters({ category, setCategory, location, setLocation, sort, setSort }) {
  const cats = ['All', ...CATEGORY_NAMES]
  return (
    <div className="space-y-4">
      <div
        className="flex gap-2 overflow-x-auto pb-2 no-scrollbar"
        role="group"
        aria-label="Filter by category"
      >
        {cats.map((c) => {
          const active = category === c
          return (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              aria-pressed={active}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2.5 text-[13px] font-bold transition-all duration-200 ${
                active
                  ? 'bg-[#1e4137] text-white shadow-[0_12px_28px_-10px_rgba(30,65,55,0.6)]'
                  : 'border border-black/8 bg-white text-[#0b1311]/65 shadow-sm hover:-translate-y-0.5 hover:border-[#1e4137]/30 hover:text-[#1e4137] hover:shadow'
              }`}
            >
              {c === 'All' && <LayoutGrid className="h-3.5 w-3.5" />}
              {c}
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-3 rounded-[24px] border border-black/5 bg-white p-2 shadow-[0_12px_40px_-20px_rgba(11,19,17,0.3)] sm:grid-cols-[1fr_1fr] sm:rounded-full sm:py-2 sm:pl-2 sm:pr-3">
        <label className="group flex cursor-text items-center gap-3 rounded-2xl px-4 py-3 transition-colors hover:bg-[#fff7f0] sm:rounded-full">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1e4137]/8 text-[#1e4137] transition-colors group-focus-within:bg-[#1e4137] group-focus-within:text-white">
            <MapPin className="h-4 w-4" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-[#0b1311]/45">Location</span>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              list="fl-dir-locations"
              placeholder="All cities — try Chennai"
              className="w-full bg-transparent text-sm font-semibold text-[#0b1311] placeholder:font-medium placeholder:text-[#0b1311]/35 focus:outline-none"
            />
            <datalist id="fl-dir-locations">
              {POPULAR_LOCATIONS.map((l) => (
                <option key={l} value={l} />
              ))}
            </datalist>
          </span>
        </label>
        <label className="group flex cursor-pointer items-center gap-3 rounded-2xl border-t border-black/5 px-4 py-3 transition-colors hover:bg-[#fff7f0] sm:rounded-full sm:border-l sm:border-t-0">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1e4137]/8 text-[#1e4137]">
            <ArrowUpDown className="h-4 w-4" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-[#0b1311]/45">Sort by</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full cursor-pointer bg-transparent text-sm font-semibold text-[#0b1311] focus:outline-none"
            >
              <option value="rating">Top rated first</option>
              <option value="newest">Newest first</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
            </select>
          </span>
        </label>
      </div>
    </div>
  )
}
