import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, BadgeCheck } from 'lucide-react'
import SEO from '../components/common/SEO'
import VendorGrid from '../components/marketplace/VendorGrid'
import api from '../services/api'
import { normalizeVendors } from '../utils/format'
import { CATEGORIES } from '../data/categories'

export default function CategoryPage() {
  const { category } = useParams()
  const name = decodeURIComponent(category || '')
  const [vendors, setVendors] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const meta = CATEGORIES.find((c) => c.name.toLowerCase() === name.toLowerCase())

  const fetchAll = async () => {
    setLoading(true)
    setError(false)
    try {
      const res = await api.get('/providers', { params: { category: name, limit: 48, sort: 'rating' } })
      const { vendors: list, total: t } = normalizeVendors(res.data)
      setVendors(list)
      setTotal(t)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAll()
    window.scrollTo(0, 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name])

  return (
    <div className="relative overflow-hidden bg-[#fff7f0]">
      <SEO title={`${name} vendors`} description={`Browse ${name} professionals for your event. Compare profiles, portfolio and pricing.`} path={`/category/${encodeURIComponent(name)}`} />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[380px]">
        {meta?.image && (
          <img src={meta.image} alt="" className="h-full w-full object-cover opacity-15" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[#fff7f0]/40 via-[#fff7f0]/85 to-[#fff7f0]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6 lg:px-8 lg:pt-32">
        <Link
          to="/vendors"
          className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-[13px] font-bold text-[#0b1311] shadow-sm transition-all hover:border-[#1e4137] hover:text-[#1e4137]"
        >
          <ArrowLeft className="h-4 w-4" /> All vendors
        </Link>

        <div className="mt-5 flex flex-wrap items-center gap-5">
          {meta && (
            <span className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-3xl border-4 border-white bg-white text-3xl shadow-xl">
              {meta.icon}
            </span>
          )}
          <div>
            <h1 className="text-4xl font-bold tracking-[-0.02em] sm:text-5xl">{name}</h1>
            <p className="mt-2 flex flex-wrap items-center gap-2 text-[15px] text-[#0b1311]/60">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[12px] font-bold text-emerald-700">
                <BadgeCheck className="h-3.5 w-3.5" /> Verified pros
              </span>
              {total > 0 ? `${total} ${name.toLowerCase()} specialists ready to book` : `Browse ${name.toLowerCase()} professionals for your event.`}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <VendorGrid vendors={vendors} loading={loading} error={error} total={total} onRetry={fetchAll} />
        </div>
      </div>
    </div>
  )
}
