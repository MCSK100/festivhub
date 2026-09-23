import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import SEO from '../components/common/SEO'
import BookingForm, { BookingSuccess } from '../components/marketplace/BookingForm'
import { PageSkeleton } from '../components/common/LoadingSkeleton'
import { ErrorState } from '../components/common/EmptyState'
import api from '../services/api'

export default function BookingPage() {
  const { vendorId } = useParams()
  const [vendor, setVendor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [sent, setSent] = useState(false)

  const fetchVendor = async () => {
    setLoading(true)
    setError(false)
    try {
      const res = await api.get(`/providers/${vendorId}`)
      setVendor(res.data)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVendor()
    window.scrollTo(0, 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendorId])

  if (loading) return <div className="bg-[#fff7f0] pt-24 lg:pt-28"><PageSkeleton /></div>
  if (error || !vendor) {
    return (
      <div className="mx-auto max-w-2xl bg-[#fff7f0] px-4 pb-16 pt-24 lg:pt-28">
        <ErrorState title="Vendor not found." onRetry={fetchVendor} />
        <Link to="/vendors" className="mt-6 inline-block text-sm font-semibold text-[#1e4137] underline underline-offset-4">Back to vendors</Link>
      </div>
    )
  }

  const name = vendor.companyName || vendor.name

  return (
    <div className="bg-[#fff7f0]">
      <SEO title={`Book ${name}`} description={`Send a booking request to ${name} (${vendor.category}). No account needed.`} path={`/book/${vendor._id}`} />
      <div className="mx-auto max-w-2xl px-4 pb-16 pt-24 sm:px-6 lg:pt-28">
        <Link to={`/vendors/${vendor._id}`} className="text-sm font-semibold text-[#1e4137] underline underline-offset-4">← Back to {name}</Link>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">Send Booking Request</h1>
        <p className="mt-2 text-[15px] text-[#0b1311]/60">
          To <span className="font-semibold text-[#0b1311]">{name}</span> • {vendor.category} • No account needed.
        </p>
        <div className="mt-6 rounded-[20px] border border-black/5 bg-white p-6 shadow-sm sm:p-8">
          {sent ? (
            <>
              <BookingSuccess vendorName={name} />
              <Link to={`/vendors/${vendor._id}`} className="mt-4 block text-center text-sm font-semibold text-[#1e4137] underline underline-offset-4">
                Back to vendor profile
              </Link>
            </>
          ) : (
            <BookingForm vendor={vendor} onSuccess={() => { setSent(true); window.scrollTo(0, 0) }} />
          )}
        </div>
      </div>
    </div>
  )
}
