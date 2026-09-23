import { CATEGORY_NAMES, POPULAR_LOCATIONS } from '../../data/categories'

export default function VendorFilters({ category, setCategory, location, setLocation, sort, setSort }) {
  const cats = ['All', ...CATEGORY_NAMES]
  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter by category">
        {cats.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            aria-pressed={category === c}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
              category === c
                ? 'border-transparent bg-[#1e4137] text-[#bad6ff]'
                : 'border-black/10 bg-white text-[#0b1311]/70 hover:border-[#1e4137]/40'
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <label className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#0b1311]/50">Location</span>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            list="fl-dir-locations"
            placeholder="Coimbatore"
            className="w-full bg-transparent text-sm font-medium text-[#0b1311] placeholder-[#0b1311]/35 focus:outline-none"
          />
          <datalist id="fl-dir-locations">
            {POPULAR_LOCATIONS.map((l) => (
              <option key={l} value={l} />
            ))}
          </datalist>
        </label>
        <label className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2.5 sm:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#0b1311]/50">Sort</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full bg-transparent text-sm font-medium text-[#0b1311] focus:outline-none"
          >
            <option value="rating">Top rated</option>
            <option value="newest">Newest</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
          </select>
        </label>
      </div>
    </div>
  )
}
