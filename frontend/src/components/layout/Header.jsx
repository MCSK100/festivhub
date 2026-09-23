import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X, LayoutDashboard, LogOut } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/vendors', label: 'Vendors' },
  { to: '/#categories', label: 'Categories' },
  { to: '/#how-it-works', label: 'How It Works' },
]

export default function Header() {
  const { user, logout, isVendor } = useAuth()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    setOpen(false)
    navigate('/', { replace: true })
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#1e4137]/10 bg-[#fff7f0]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-xl font-black tracking-tight text-[#1e4137]" aria-label="FestivLink home">
          FestivLink
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <NavLink
              key={l.label}
              to={l.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-[15px] font-medium transition-colors ${
                  isActive ? 'bg-[#1e4137]/5 text-[#1e4137]' : 'text-[#0b1311]/70 hover:bg-black/5 hover:text-[#0b1311]'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user && isVendor ? (
            <>
              <Link
                to="/vendor/dashboard"
                className="inline-flex items-center gap-2 rounded-full bg-[#1e4137] px-5 py-2.5 text-sm font-semibold text-[#bad6ff] transition-colors hover:bg-[#142e27]"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-semibold text-[#0b1311] transition-colors hover:border-[#1e4137]"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/vendor/register"
              className="rounded-full bg-[#1e4137] px-5 py-2.5 text-sm font-semibold text-[#bad6ff] transition-colors hover:bg-[#142e27]"
            >
              Become a Vendor
            </Link>
          )}
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-[#0b1311] md:hidden"
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav aria-label="Mobile navigation" className="border-t border-black/5 bg-[#fff7f0] px-4 pb-6 pt-2 md:hidden">
          <ul className="flex flex-col">
            {LINKS.map((l) => (
              <li key={l.label}>
                <Link
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 text-base font-medium text-[#0b1311] hover:bg-black/5"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-col gap-2">
            {user && isVendor ? (
              <>
                <Link
                  to="/vendor/dashboard"
                  onClick={() => setOpen(false)}
                  className="rounded-full bg-[#1e4137] px-5 py-3 text-center text-sm font-semibold text-[#bad6ff]"
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-[#0b1311]"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/vendor/register"
                  onClick={() => setOpen(false)}
                  className="rounded-full bg-[#1e4137] px-5 py-3 text-center text-sm font-semibold text-[#bad6ff]"
                >
                  Become a Vendor
                </Link>
                <Link
                  to="/vendor/login"
                  onClick={() => setOpen(false)}
                  className="rounded-full border border-black/10 bg-white px-5 py-3 text-center text-sm font-semibold text-[#0b1311]"
                >
                  Vendor Login
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  )
}
