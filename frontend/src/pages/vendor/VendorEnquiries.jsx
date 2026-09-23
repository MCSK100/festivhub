import { useState } from 'react'
import { Phone, Mail, MapPin } from 'lucide-react'
import { useVendor } from './VendorLayout'
import api from '../../services/api'
import { useToast } from '../../components/ui/Toast'
import EmptyState from '../../components/common/EmptyState'

const STATUSES = ['new', 'contacted', 'confirmed', 'completed', 'cancelled']

function statusColor(s) {
  if (s === 'new') return 'bg-amber-500/10 text-amber-700 border-amber-500/25'
  if (s === 'confirmed') return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/25'
  if (s === 'completed') return 'bg-[#1e4137]/10 text-[#1e4137] border-[#1e4137]/25'
  if (s === 'cancelled') return 'bg-rose-500/10 text-rose-600 border-rose-500/25'
  return 'bg-sky-500/10 text-sky-700 border-sky-500/25'
}

export default function VendorEnquiries() {
  const { enquiries, setEnquiries, refresh } = useVendor()
  const { success, error } = useToast()
  const [filter, setFilter] = useState('all')
  const [busy, setBusy] = useState({})

  const list = enquiries.filter((e) => (filter === 'all' ? true : e.status === filter))

  const update = async (id, status) => {
    setBusy((p) => ({ ...p, [id]: true }))
    try {
      const res = await api.patch(`/enquiries/${id}/status`, { status })
      setEnquiries((prev) => prev.map((e) => (e._id === id ? res.data.enquiry : e)))
      success(`Enquiry marked as ${status}.`)
    } catch {
      error('Failed to update enquiry.')
    } finally {
      setBusy((p) => ({ ...p, [id]: false }))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Enquiries</h1>
        <p className="text-sm text-[#0b1311]/60">{enquiries.length} total</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter enquiries">
        {['all', ...STATUSES].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            aria-pressed={filter === s}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold capitalize ${filter === s ? 'border-transparent bg-[#1e4137] text-[#bad6ff]' : 'border-black/10 bg-white text-[#0b1311]/70'}`}
          >
            {s}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <EmptyState
          icon="booking"
          title="No booking requests yet."
          hint="When customers send booking requests, they will appear here."
          action={<button type="button" onClick={refresh} className="rounded-full border border-[#1e4137]/20 bg-white px-6 py-2.5 text-sm font-semibold text-[#1e4137]">Refresh</button>}
        />
      ) : (
        <ul className="space-y-4">
          {list.map((e) => (
            <li key={e._id} className="rounded-[20px] border border-black/5 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-bold">{e.fullName}</p>
                  <p className="mt-0.5 text-sm text-[#0b1311]/60">{e.eventType} • {e.eventDate ? new Date(e.eventDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : ''} • {e.eventLocation}</p>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#0b1311]/70">
                    <span className="inline-flex items-center gap-1.5"><Phone className="h-4 w-4 text-[#1e4137]" /> {e.phone}</span>
                    <span className="inline-flex items-center gap-1.5"><Mail className="h-4 w-4 text-[#1e4137]" /> {e.email}</span>
                    {e.guests > 0 && <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-[#1e4137]" /> {e.guests} guests</span>}
                  </div>
                  {e.budget && <p className="mt-1 text-sm text-[#0b1311]/60">Budget: <span className="font-semibold text-[#0b1311]">{e.budget}</span></p>}
                  {e.message && <p className="mt-3 rounded-xl bg-[#0b1311]/[0.03] p-4 text-sm italic text-[#0b1311]/75">“{e.message}”</p>}
                </div>
                <span className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${statusColor(e.status)}`}>{e.status}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <label className="sr-only" htmlFor={`st-${e._id}`}>Change status</label>
                <select
                  id={`st-${e._id}`}
                  value={e.status}
                  disabled={busy[e._id]}
                  onChange={(ev) => update(e._id, ev.target.value)}
                  className="rounded-full border border-black/10 bg-[#F9FAFB] px-4 py-2 text-sm font-semibold capitalize"
                >
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
