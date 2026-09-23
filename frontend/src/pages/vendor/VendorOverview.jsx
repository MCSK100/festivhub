import { Link } from 'react-router-dom'
import { CalendarCheck, Inbox, CheckCircle } from 'lucide-react'
import { useVendor } from './VendorLayout'
import { profileCompletion } from '../../utils/format'

export default function VendorOverview() {
  const { profile, enquiries, bookings } = useVendor()
  const name = profile?.companyName || profile?.name || 'Vendor'
  const completion = profileCompletion(profile)

  const newEnquiries = enquiries.filter((e) => e.status === 'new').length
  const pendingBookings = bookings.filter((b) => b.status === 'pending').length
  const confirmed = bookings.filter((b) => b.status === 'confirmed').length + enquiries.filter((e) => e.status === 'confirmed').length
  const recent = [...enquiries.map((e) => ({ ...e, kind: 'enquiry' }))]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  const stats = [
    { label: 'New Enquiries', value: newEnquiries, icon: Inbox },
    { label: 'Pending Bookings', value: pendingBookings, icon: CalendarCheck },
    { label: 'Confirmed Bookings', value: confirmed, icon: CheckCircle },
  ]

  return (
    <div className="space-y-6">
      <div className="rounded-[20px] border border-black/5 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold sm:text-3xl">Welcome, {name}</h1>
        <p className="mt-1 text-sm text-[#0b1311]/60">Here is what is happening with your business.</p>
      </div>

      <div className="rounded-[20px] border border-black/5 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">Profile completion: {completion}%</h2>
          <Link to="/vendor/profile" className="rounded-full bg-[#1e4137] px-5 py-2 text-sm font-semibold text-[#bad6ff] hover:bg-[#142e27]">
            Complete Profile
          </Link>
        </div>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-[#0b1311]/5">
          <div className="h-full rounded-full bg-[#1e4137] transition-all" style={{ width: `${completion}%` }} />
        </div>
        {profile && (
          <Link to={`/vendors/${profile._id}`} className="mt-3 inline-block text-sm font-semibold text-[#1e4137] underline underline-offset-4">
            Preview Profile
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="flex items-center justify-between rounded-[20px] border border-black/5 bg-white p-6 shadow-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#0b1311]/50">{label}</p>
              <p className="mt-1 text-3xl font-black">{value}</p>
            </div>
            <span className="rounded-2xl border border-[#1e4137]/20 bg-[#1e4137]/5 p-3"><Icon className="h-6 w-6 text-[#1e4137]" /></span>
          </div>
        ))}
      </div>

      <div className="rounded-[20px] border border-black/5 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">Recent enquiries</h2>
          <Link to="/vendor/enquiries" className="text-sm font-semibold text-[#1e4137] underline underline-offset-4">View all</Link>
        </div>
        {recent.length === 0 ? (
          <p className="mt-4 rounded-xl bg-[#0b1311]/[0.03] p-6 text-center text-sm text-[#0b1311]/60">No booking requests yet.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {recent.map((e) => (
              <li key={e._id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#0b1311]/[0.03] p-4">
                <div>
                  <p className="text-sm font-bold">{e.fullName}</p>
                  <p className="text-xs text-[#0b1311]/60">{e.eventType} • {e.eventDate ? new Date(e.eventDate).toLocaleDateString() : ''} • {e.eventLocation}</p>
                </div>
                <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider">{e.status}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
