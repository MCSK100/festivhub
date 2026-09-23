import { useState } from 'react'
import { useNavigate, createSearchParams } from 'react-router-dom'
import { Search, MapPin, Briefcase } from 'lucide-react'
import { CATEGORY_NAMES, POPULAR_LOCATIONS } from '../../data/categories'

export function HomeSearch() {
  const navigate = useNavigate()
  const [service, setService] = useState('')
  const [location, setLocation] = useState('')

  const submit = (e) => {
    e.preventDefault()
    navigate({
      pathname: '/vendors',
      search: createSearchParams({
        ...(service ? { category: service } : {}),
        ...(location ? { location } : {}),
      }).toString(),
    })
  }

  return (
    <form
      onSubmit={submit}
      className="mx-auto mt-8 flex max-w-3xl flex-col gap-3 rounded-[24px] border border-black/5 bg-white p-3 shadow-lg sm:p-4 lg:flex-row lg:items-center"
      role="search"
      aria-label="Find vendors"
    >
      <label className="flex flex-1 items-center gap-3 rounded-2xl bg-[#0b1311]/[0.03] px-4 py-3">
        <Briefcase className="h-5 w-5 shrink-0 text-[#1e4137]" />
        <span className="sr-only">What service do you need?</span>
        <input
          value={service}
          onChange={(e) => setService(e.target.value)}
          list="fl-services"
          placeholder="What service do you need? (Photography)"
          className="w-full bg-transparent text-sm font-medium text-[#0b1311] placeholder-[#0b1311]/40 focus:outline-none"
        />
        <datalist id="fl-services">
          {CATEGORY_NAMES.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </label>
      <label className="flex flex-1 items-center gap-3 rounded-2xl bg-[#0b1311]/[0.03] px-4 py-3">
        <MapPin className="h-5 w-5 shrink-0 text-[#1e4137]" />
        <span className="sr-only">Where is your event?</span>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          list="fl-locations"
          placeholder="Where is your event? (Coimbatore)"
          className="w-full bg-transparent text-sm font-medium text-[#0b1311] placeholder-[#0b1311]/40 focus:outline-none"
        />
        <datalist id="fl-locations">
          {POPULAR_LOCATIONS.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </label>
      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#1e4137] px-8 py-3.5 text-sm font-bold text-[#bad6ff] transition-colors hover:bg-[#142e27]"
      >
        <Search className="h-4 w-4" />
        Find Vendors
      </button>
    </form>
  )
}

export function DirectorySearch({ value, onChange }) {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#1e4137]/50" />
      <label htmlFor="vendor-search" className="sr-only">Search vendors</label>
      <input
        id="vendor-search"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search vendors..."
        className="w-full rounded-full border border-black/10 bg-white py-3.5 pl-12 pr-5 text-[15px] font-medium text-[#0b1311] shadow-sm placeholder-[#0b1311]/40 focus:border-[#1e4137] focus:outline-none focus:ring-2 focus:ring-[#1e4137]/20"
      />
    </div>
  )
}
