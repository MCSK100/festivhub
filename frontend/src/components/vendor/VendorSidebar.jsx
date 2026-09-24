import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, User, Images, Briefcase, Inbox, CalendarCheck, Settings, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

const ITEMS = [
  { to: '/vendor/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/vendor/profile', label: 'My Profile', icon: User },
  { to: '/vendor/portfolio', label: 'Portfolio', icon: Images },
  { to: '/vendor/services', label: 'Services', icon: Briefcase },
  { to: '/vendor/bookings', label: 'Bookings', icon: CalendarCheck },
  { to: '/vendor/enquiries', label: 'Enquiries', icon: Inbox },
  { to: '/vendor/settings', label: 'Settings', icon: Settings },
]

export default function VendorSidebar({ vendorName, unread }) {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  const list = (onNav) => (
    <>
      <div className="border-b border-white/10 p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#bad6ff] text-lg font-bold text-[#1e4137]">
            {(vendorName || 'V').charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-[#fff7f0]">{vendorName || 'Vendor'}</p>
            <p className="text-xs text-[#fff7f0]/60">Vendor Portal</p>
          </div>
        </div>
      </div>
      <nav aria-label="Vendor dashboard" className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1.5">
          {ITEMS.map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                onClick={onNav}
                className={({ isActive }) =>
                  `flex w-full items-center gap-3 rounded-full px-4 py-3 text-sm font-medium transition-colors ${
                    isActive ? 'bg-[#bad6ff] text-[#1e4137]' : 'text-[#fff7f0]/70 hover:bg-white/10 hover:text-[#fff7f0]'
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                {label}
                {to === '/vendor/enquiries' && unread > 0 && (
                  <span className="ml-auto rounded-full bg-[#ff643c] px-2 py-0.5 text-xs font-bold text-white">{unread}</span>
                )}
                {to === '/vendor/bookings' && unread > 0 && (
                  <span className="sr-only">({unread} unread)</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="border-t border-white/10 p-4">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-full px-4 py-3 text-sm font-medium text-[#fff7f0]/70 transition-colors hover:bg-white/10 hover:text-[#fff7f0]"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </>
  )

  return (
    <>
      <aside className="fixed left-0 top-0 hidden h-screen w-72 flex-col bg-[#1e4137] lg:flex">
        {list()}
      </aside>
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-black/5 bg-white px-4 py-3 lg:hidden">
        <p className="text-sm font-bold">Vendor Portal</p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-full bg-[#1e4137] p-2.5 text-[#bad6ff]"
          aria-label="Open vendor menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 flex h-full w-72 flex-col bg-[#1e4137]">
            <div className="flex items-center justify-between border-b border-white/10 p-4">
              <span className="text-sm font-bold text-[#fff7f0]">Menu</span>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close vendor menu" className="rounded-full p-2 text-[#fff7f0]/70 hover:bg-white/10">
                <X className="h-5 w-5" />
              </button>
            </div>
            {list(() => setOpen(false))}
          </aside>
        </div>
      )}
    </>
  )
}
