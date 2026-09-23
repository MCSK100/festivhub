import { useState } from 'react'
import { CheckCircle } from 'lucide-react'
import api from '../../services/api'
import { EVENT_TYPES } from '../../data/categories'

const initial = { fullName: '', phone: '', email: '', eventType: 'Wedding', eventDate: '', eventLocation: '', guests: '', budget: '', message: '' }

export default function BookingForm({ vendor, onSuccess }) {
  const [form, setForm] = useState(initial)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }))

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.fullName.trim() || !form.phone.trim() || !form.email.trim() || !form.eventType || !form.eventDate || !form.eventLocation.trim()) {
      setError('Please fill all required fields.')
      return
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      setError('Please enter a valid email address.')
      return
    }
    setLoading(true)
    try {
      const res = await api.post('/enquiries', {
        vendorId: vendor._id,
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        eventType: form.eventType,
        eventDate: form.eventDate,
        eventLocation: form.eventLocation.trim(),
        guests: form.guests === '' ? 0 : Number(form.guests),
        budget: form.budget,
        message: form.message,
      })
      onSuccess(res.data?.enquiry || null)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send request. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const input = 'w-full rounded-xl border border-black/10 bg-[#F9FAFB] px-4 py-3 text-sm font-medium text-[#0b1311] placeholder-[#0b1311]/35 focus:border-[#1e4137] focus:outline-none focus:ring-2 focus:ring-[#1e4137]/20'

  return (
    <form onSubmit={submit} className="space-y-4">
      {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="bk-name" className="mb-1.5 block text-sm font-semibold text-[#0b1311]">Full Name *</label>
          <input id="bk-name" value={form.fullName} onChange={(e) => set('fullName', e.target.value)} placeholder="Your name" required className={input} autoComplete="name" />
        </div>
        <div>
          <label htmlFor="bk-phone" className="mb-1.5 block text-sm font-semibold text-[#0b1311]">Phone Number *</label>
          <input id="bk-phone" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+91 98765 43210" required className={input} autoComplete="tel" inputMode="tel" />
        </div>
      </div>
      <div>
        <label htmlFor="bk-email" className="mb-1.5 block text-sm font-semibold text-[#0b1311]">Email *</label>
        <input id="bk-email" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="you@example.com" required className={input} autoComplete="email" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="bk-type" className="mb-1.5 block text-sm font-semibold text-[#0b1311]">Event Type *</label>
          <select id="bk-type" value={form.eventType} onChange={(e) => set('eventType', e.target.value)} required className={input}>
            {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="bk-date" className="mb-1.5 block text-sm font-semibold text-[#0b1311]">Event Date *</label>
          <input id="bk-date" type="date" value={form.eventDate} onChange={(e) => set('eventDate', e.target.value)} min={new Date().toISOString().split('T')[0]} required className={input} />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="bk-loc" className="mb-1.5 block text-sm font-semibold text-[#0b1311]">Event Location *</label>
          <input id="bk-loc" value={form.eventLocation} onChange={(e) => set('eventLocation', e.target.value)} placeholder="Coimbatore" required className={input} />
        </div>
        <div>
          <label htmlFor="bk-guests" className="mb-1.5 block text-sm font-semibold text-[#0b1311]">Number of Guests</label>
          <input id="bk-guests" type="number" min="0" value={form.guests} onChange={(e) => set('guests', e.target.value)} placeholder="200" className={input} />
        </div>
      </div>
      <div>
        <label htmlFor="bk-budget" className="mb-1.5 block text-sm font-semibold text-[#0b1311]">Budget (optional)</label>
        <input id="bk-budget" value={form.budget} onChange={(e) => set('budget', e.target.value)} placeholder="e.g. ₹50,000" className={input} />
      </div>
      <div>
        <label htmlFor="bk-msg" className="mb-1.5 block text-sm font-semibold text-[#0b1311]">Message</label>
        <textarea id="bk-msg" value={form.message} onChange={(e) => set('message', e.target.value)} rows={4} placeholder="Tell the vendor about your event..." className={`${input} resize-none`} />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-[#1e4137] px-6 py-3.5 text-sm font-bold text-[#bad6ff] transition-colors hover:bg-[#142e27] disabled:opacity-50"
      >
        {loading ? 'Sending...' : 'Send Booking Request'}
      </button>
      <p className="text-center text-xs text-[#0b1311]/50">No account needed. The vendor will contact you directly.</p>
    </form>
  )
}

export function BookingSuccess({ vendorName }) {
  return (
    <div className="py-6 text-center">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
        <CheckCircle className="h-9 w-9 text-emerald-600" />
      </span>
      <h3 className="mt-4 text-xl font-bold text-[#0b1311]">Request Sent Successfully</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-[#0b1311]/60">
        Your enquiry has been sent to {vendorName || 'the vendor'}. The vendor will contact you shortly.
      </p>
    </div>
  )
}
