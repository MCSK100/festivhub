import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
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
    <div className="bg-[#fff7f0]">
      <SEO title="Find Event Vendors" description="Discover trusted event professionals near you. Search photographers, caterers, decorators and more." path="/vendors" />
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6 lg:px-8 lg:pt-28">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Find Event Vendors</h1>
        <p className="mt-2 text-[15px] text-[#0b1311]/60">Discover trusted event professionals near you.</p>

        <div className="mt-6 max-w-2xl">
          <DirectorySearch value={query} onChange={setQuery} />
        </div>
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

        <div className="mt-8">
          <VendorGrid vendors={vendors} loading={loading} error={error} total={total} onRetry={fetchVendors} onClearFilters={clearFilters} />
        </div>

        {pages > 1 && (
          <nav aria-label="Vendor pages" className="mt-10 flex items-center justify-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-full border border-black/10 bg-white px-5 py-2 text-sm font-semibold disabled:opacity-40"
            >
              Prev
            </button>
            <span className="text-sm font-medium text-[#0b1311]/60">Page {page} of {pages}</span>
            <button
              type="button"
              disabled={page >= pages}
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              className="rounded-full border border-black/10 bg-white px-5 py-2 text-sm font-semibold disabled:opacity-40"
            >
              Next
            </button>
          </nav>
        )}
      </div>
    </div>
  )
}
