import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import SEO from '../components/common/SEO'
import VendorGrid from '../components/marketplace/VendorGrid'
import api from '../services/api'
import { normalizeVendors } from '../utils/format'

export default function CategoryPage() {
  const { category } = useParams()
  const name = decodeURIComponent(category || '')
  const [vendors, setVendors] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

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
    <div className="bg-[#fff7f0]">
      <SEO title={`${name} vendors`} description={`Browse ${name} professionals for your event. Compare profiles, portfolio and pricing.`} path={`/category/${encodeURIComponent(name)}`} />
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6 lg:px-8 lg:pt-28">
        <Link to="/vendors" className="text-sm font-semibold text-[#1e4137] underline underline-offset-4">← All vendors</Link>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{name}</h1>
        <p className="mt-2 text-[15px] text-[#0b1311]/60">Browse {name.toLowerCase()} professionals for your event.</p>
        <div className="mt-8">
          <VendorGrid vendors={vendors} loading={loading} error={error} total={total} onRetry={fetchAll} />
        </div>
      </div>
    </div>
  )
}
