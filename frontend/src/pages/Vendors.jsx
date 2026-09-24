import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Store, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react'
import SEO from '../components/common/SEO'
import { DirectorySearch } from '../components/marketplace/SearchBar'
import VendorFilters from '../components/marketplace/VendorFilters'
import VendorGrid from '../components/marketplace/VendorGrid'
import api from '../services/api'
import { normalizeVendors } from '../utils/format'

function useDebounced(value, ms = 400) {
  const [v, setV] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms)
    return () => clearTimeout(t)
  }, [value, ms])
  return v
}

export default function Vendors() {
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState(params.get('q') || '')
  const [category, setCategory] = useState(params.get('category') || 'All')
  const [location, setLocation] = useState(params.get('location') || '')
  const [sort, setSort] = useState('rating')
  const [page, setPage] = useState(1)

  const [vendors, setVendors] = useState([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const debouncedQuery = useDebounced(query)
  const debouncedLocation = useDebounced(location)

  const fetchVendors = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const res = await api.get('/providers', {
        params: {
          q: debouncedQuery || undefined,
          category: category !== 'All' ? category : undefined,
          location: debouncedLocation || undefined,
          sort,
          page,
          limit: 12,
        },
      })
      const { vendors: list, total: t, pages: p } = normalizeVendors(res.data)
      setVendors(list)
      setTotal(t)
      setPages(p)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [debouncedQuery, category, debouncedLocation, sort, page])

  useEffect(() => { fetchVendors() }, [fetchVendors])

  // Keep URL in sync so hero search + filters are shareable
  useEffect(() => {
    const next = {}
    if (debouncedQuery) next.q = debouncedQuery
    if (category !== 'All') next.category = category
    if (debouncedLocation) next.location = debouncedLocation
    setParams(next, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, category, debouncedLocation])

  useEffect(() => { setPage(1) }, [debouncedQuery, category, debouncedLocation, sort])

  const clearFilters = useMemo(
    () => () => {
      setQuery('')
      setCategory('All')
      setLocation('')
      setSort('rating')
      setPage(1)
    },
    []
  )

  return (
    <div className="relative overflow-hidden bg-[#fff7f0]">
      <SEO title="Find Event Vendors" description="Discover trusted event professionals near you. Search photographers, caterers, decorators and more." path="/vendors" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-[#bad6ff]/30 via-white/60 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6 lg:px-8 lg:pt-32">
        {/* breadcrumb + heading */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[13px] font-semibold text-[#0b1311]/50">
          <Link to="/" className="transition-colors hover:text-[#1e4137]">Home</Link>
          <span aria-hidden>/</span>
          <span className="text-[#0b1311]">Vendors</span>
        </nav>

        <div className="mt-4 flex flex-wrap items-end justify-between gap-5">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#1e4137]/12 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#1e4137] shadow-sm">
              <Store className="h-3.5 w-3.5" /> Marketplace
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-[-0.02em] sm:text-5xl">Find your perfect vendor</h1>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-[#0b1311]/60">
              {total > 0 ? (
                <><span className="font-bold text-[#0b1311]">{total} verified pros</span> ready for your date — search, compare and book directly.</>
              ) : (
                'Discover trusted photographers, caterers, decorators and more near you.'
              )}
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-[13px] font-bold text-emerald-700">
            <ShieldCheck className="h-4 w-4" /> All profiles verified
          </div>
        </div>

        {/* search + filters card */}
        <div className="mt-8 rounded-[28px] border border-black/5 bg-white/70 p-4 shadow-[0_20px_60px_-28px_rgba(11,19,17,0.35)] backdrop-blur-xl sm:p-5">
          <DirectorySearch value={query} onChange={setQuery} />
          <div className="mt-4">
            <VendorFilters
              category={category}
              setCategory={setCategory}
              location={location}
              setLocation={setLocation}
              sort={sort}
              setSort={setSort}
            />
          </div>
        </div>

        <div className="mt-8">
          <VendorGrid vendors={vendors} loading={loading} error={error} total={total} onRetry={fetchVendors} onClearFilters={clearFilters} />
        </div>

        {pages > 1 && (
          <nav aria-label="Vendor pages" className="mt-10 flex items-center justify-center gap-3">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-bold shadow-sm transition-all hover:border-[#1e4137] hover:text-[#1e4137] disabled:opacity-40 disabled:hover:border-black/10 disabled:hover:text-current"
            >
              <ChevronLeft className="h-4 w-4" /> Prev
            </button>
            <span className="rounded-full bg-[#0b1311] px-5 py-2.5 text-sm font-bold text-white">
              {page} / {pages}
            </span>
            <button
              type="button"
              disabled={page >= pages}
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-bold shadow-sm transition-all hover:border-[#1e4137] hover:text-[#1e4137] disabled:opacity-40 disabled:hover:border-black/10 disabled:hover:text-current"
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </nav>
        )}
      </div>
    </div>
  )
}
