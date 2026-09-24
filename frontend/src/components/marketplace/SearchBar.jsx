import { useState } from 'react'
import { useNavigate, createSearchParams } from 'react-router-dom'
import { Search, MapPin, Briefcase, ArrowRight, Sparkles, SlidersHorizontal } from 'lucide-react'
import { CATEGORY_NAMES, POPULAR_LOCATIONS } from '../../data/categories'

const QUICK = ['Photography', 'Catering', 'Decoration', 'Venues']

export function HomeSearch() {
  const navigate = useNavigate()
  const [service, setService] = useState('')
  const [location, setLocation] = useState('')
  const [focused, setFocused] = useState(null)

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
    <div className="relative mx-auto mt-10 max-w-4xl">
      {/* glow behind the bar */}
      <div aria-hidden className="absolute -inset-3 rounded-[36px] bg-gradient-to-r from-[#1e4137]/15 via-[#bad6ff]/40 to-[#1e4137]/15 blur-2xl" />

      <form
        onSubmit={submit}
        role="search"
        aria-label="Find vendors"
        className="relative rounded-[28px] border border-white/60 bg-white/90 p-2 shadow-[0_24px_70px_-20px_rgba(11,19,17,0.35)] backdrop-blur-2xl sm:rounded-[32px] lg:p-2.5"
      >
        <div className="grid gap-2 lg:grid-cols-[1fr_auto_1fr_auto] lg:items-stretch lg:gap-0">
          {/* Service field */}
          <label
            className={`group flex cursor-text items-center gap-4 rounded-3xl px-5 py-4 transition-all duration-300 ${
              focused === 'service' ? 'bg-[#fff7f0] shadow-inner' : 'hover:bg-[#fff7f0]/80'
            }`}
          >
            <span
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-all duration-300 ${
                focused === 'service'
                  ? 'bg-[#1e4137] text-[#bad6ff] shadow-lg shadow-[#1e4137]/25'
                  : 'bg-[#1e4137]/8 text-[#1e4137] group-hover:bg-[#1e4137]/12'
              }`}
            >
              <Briefcase className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] font-bold uppercase tracking-[0.14em] text-[#0b1311]/45">
                What do you need?
              </span>
              <input
                value={service}
                onChange={(e) => setService(e.target.value)}
                onFocus={() => setFocused('service')}
                onBlur={() => setFocused(null)}
                list="fl-services"
                placeholder="Photography, catering, DJ…"
                className="mt-0.5 w-full bg-transparent text-[15px] font-semibold text-[#0b1311] placeholder:font-medium placeholder:text-[#0b1311]/35 focus:outline-none"
              />
              <datalist id="fl-services">
                {CATEGORY_NAMES.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </span>
          </label>

          {/* divider */}
          <div aria-hidden className="hidden w-px self-stretch bg-gradient-to-b from-transparent via-[#0b1311]/10 to-transparent lg:mx-1 lg:block" />

          {/* Location field */}
          <label
            className={`group flex cursor-text items-center gap-4 rounded-3xl px-5 py-4 transition-all duration-300 ${
              focused === 'location' ? 'bg-[#fff7f0] shadow-inner' : 'hover:bg-[#fff7f0]/80'
            }`}
          >
            <span
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-all duration-300 ${
                focused === 'location'
                  ? 'bg-[#1e4137] text-[#bad6ff] shadow-lg shadow-[#1e4137]/25'
                  : 'bg-[#1e4137]/8 text-[#1e4137] group-hover:bg-[#1e4137]/12'
              }`}
            >
              <MapPin className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] font-bold uppercase tracking-[0.14em] text-[#0b1311]/45">
                Where's it happening?
              </span>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onFocus={() => setFocused('location')}
                onBlur={() => setFocused(null)}
                list="fl-locations"
                placeholder="City — try Coimbatore"
                className="mt-0.5 w-full bg-transparent text-[15px] font-semibold text-[#0b1311] placeholder:font-medium placeholder:text-[#0b1311]/35 focus:outline-none"
              />
              <datalist id="fl-locations">
                {POPULAR_LOCATIONS.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </span>
          </label>

          {/* submit */}
          <div className="flex items-stretch p-1 lg:pl-3 lg:pr-1 lg:py-1">
            <button
              type="submit"
              className="group relative inline-flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-[#1e4137] px-8 py-4 text-[15px] font-bold text-white shadow-[0_16px_32px_-12px_rgba(30,65,55,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#142e27] hover:shadow-[0_20px_40px_-12px_rgba(30,65,55,0.7)] active:translate-y-0 lg:w-auto lg:min-w-[190px] lg:rounded-[22px]"
            >
              <span aria-hidden className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <Search className="h-[18px] w-[18px]" />
              Find Vendors
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* mobile popular row inside card footer */}
        <div className="flex flex-wrap items-center gap-2 border-t border-[#0b1311]/6 px-5 pb-3 pt-3 lg:hidden">
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#0b1311]/50">
            <Sparkles className="h-3.5 w-3.5" /> Popular:
          </span>
          {QUICK.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => setService(q)}
              className="rounded-full bg-[#0b1311]/5 px-3 py-1.5 text-xs font-semibold text-[#0b1311]/70 transition-colors hover:bg-[#1e4137] hover:text-white"
            >
              {q}
            </button>
          ))}
        </div>
      </form>

      {/* desktop popular row */}
      <div className="mt-4 hidden items-center justify-center gap-2 lg:flex">
        <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#0b1311]/50">
          <Sparkles className="h-4 w-4 text-[#1e4137]" />
          Trending searches:
        </span>
        {QUICK.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => {
              setService(q)
              navigate({ pathname: '/vendors', search: createSearchParams({ category: q }).toString() })
            }}
            className="rounded-full border border-[#0b1311]/10 bg-white/80 px-4 py-1.5 text-[13px] font-semibold text-[#0b1311]/70 shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:border-[#1e4137] hover:text-[#1e4137] hover:shadow"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  )
}

export function DirectorySearch({ value, onChange }) {
  return (
    <div className="group relative">
      <div aria-hidden className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#1e4137]/10 via-[#bad6ff]/40 to-[#1e4137]/10 opacity-0 blur-lg transition-opacity duration-300 group-focus-within:opacity-100" />
      <div className="relative flex items-center gap-3 rounded-full border border-black/8 bg-white p-2 pl-3 shadow-[0_10px_36px_-16px_rgba(11,19,17,0.3)] transition-all duration-300 focus-within:border-[#1e4137]/30 focus-within:shadow-[0_16px_44px_-16px_rgba(30,65,55,0.4)]">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1e4137] text-[#bad6ff] shadow-md shadow-[#1e4137]/20">
          <Search className="h-5 w-5" />
        </span>
        <label htmlFor="vendor-search" className="sr-only">Search vendors</label>
        <input
          id="vendor-search"
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search by name, service or keyword…"
          className="w-full bg-transparent pr-2 text-[15px] font-medium text-[#0b1311] placeholder-[#0b1311]/40 focus:outline-none"
        />
        <span className="mr-2 hidden shrink-0 items-center gap-1.5 rounded-full bg-[#0b1311]/5 px-3.5 py-2 text-xs font-semibold text-[#0b1311]/50 sm:inline-flex">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          {value ? `${value.length} chars` : 'Filters below'}
        </span>
      </div>
    </div>
  )
}
