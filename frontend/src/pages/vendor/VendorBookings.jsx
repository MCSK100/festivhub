import { useState } from 'react'
import { CheckCircle, XCircle, Clock } from 'lucide-react'
import { useVendor } from './VendorLayout'
import api from '../../services/api'
import { useToast } from '../../components/ui/Toast'
import EmptyState from '../../components/common/EmptyState'

export default function VendorBookings() {
  const { bookings, setBookings } = useVendor()
  const { success, error } = useToast()
  const [busy, setBusy] = useState({})

  const update = async (id, status) => {
    setBusy((p) => ({ ...p, [id]: true }))
    try {
      await api.put(`/bookings/${id}/status`, { status })
      const res = await api.get('/bookings/vendor-bookings')
      setBookings(res.data)
      success(`Booking ${status}.`)
    } catch {
      error('Failed to update booking.')
    } finally {
      setBusy((p) => ({ ...p, [id]: false }))
    }
  }

  if (bookings.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Bookings</h1>
        <EmptyState icon="booking" title="No booking requests yet." hint="Legacy bookings and confirmed orders will appear here." />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Bookings</h1>
        <p className="text-sm text-[#0b1311]/60">{bookings.length} total</p>
      </div>
      <ul className="space-y-4">
        {bookings.map((b) => (
          <li key={b._id} className="rounded-[20px] border border-black/5 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-bold">{b.customer?.name || 'Customer'}</p>
                <p className="text-sm text-[#0b1311]/60">{b.customer?.email || ''}</p>
                <div className="mt-3 grid grid-cols-2 gap-3 rounded-xl bg-[#0b1311]/[0.03] p-4 text-sm sm:grid-cols-4">
                  <div><p className="text-xs font-semibold uppercase text-[#0b1311]/50">Service</p><p className="font-semibold">{b.serviceTitle}</p></div>
                  <div><p className="text-xs font-semibold uppercase text-[#0b1311]/50">Date</p><p className="font-semibold">{new Date(b.date).toLocaleDateString()}</p></div>
                  <div><p className="text-xs font-semibold uppercase text-[#0b1311]/50">Price</p><p className="font-bold">₹{Number(b.price).toLocaleString('en-IN')}</p></div>
                  <div><p className="text-xs font-semibold uppercase text-[#0b1311]/50">Status</p><p className="font-semibold capitalize">{b.status}</p></div>
                </div>
                {b.notes && <p className="mt-3 rounded-xl bg-[#0b1311]/[0.03] p-4 text-sm italic">“{b.notes}”</p>}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {b.status === 'pending' && (
                <>
                  <button type="button" disabled={busy[b._id]} onClick={() => update(b._id, 'confirmed')} className="inline-flex items-center gap-2 rounded-full bg-[#1e4137] px-5 py-2 text-sm font-bold text-[#bad6ff] disabled:opacity-50"><CheckCircle className="h-4 w-4" /> Accept</button>
                  <button type="button" disabled={busy[b._id]} onClick={() => update(b._id, 'cancelled')} className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-white px-5 py-2 text-sm font-bold text-red-600 disabled:opacity-50"><XCircle className="h-4 w-4" /> Reject</button>
                </>
              )}
              {b.status === 'confirmed' && (
                <button type="button" disabled={busy[b._id]} onClick={() => update(b._id, 'completed')} className="inline-flex items-center gap-2 rounded-full bg-[#1e4137] px-5 py-2 text-sm font-bold text-[#bad6ff] disabled:opacity-50"><Clock className="h-4 w-4" /> Mark Complete</button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
