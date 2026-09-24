import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X, LayoutDashboard, LogOut, Sparkles, ArrowRight } from 'lucide-react'
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
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-3 rounded-full border border-white/60 bg-[#fff7f0]/80 py-2 pl-3 pr-2 shadow-[0_16px_44px_-18px_rgba(11,19,17,0.35)] backdrop-blur-2xl sm:pl-5 sm:pr-3">
        <Link to="/" className="group flex items-center gap-2.5" aria-label="FestivLink home">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1e4137] text-lg font-black text-[#bad6ff] shadow-lg shadow-[#1e4137]/25 transition-transform group-hover:rotate-6">
            F
          </span>
          <span className="leading-none">
            <span className="block text-[19px] font-black tracking-tight text-[#0b1311]">
              FestivLink
            </span>
            <span className="mt-0.5 hidden items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0b1311]/45 sm:flex">
              <Sparkles className="h-3 w-3 text-[#1e4137]" /> Celebrations, sorted
            </span>
          </span>
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-1 rounded-full border border-black/5 bg-white/70 p-1.5 backdrop-blur lg:flex">
          {LINKS.map((l) => (
            <NavLink
              key={l.label}
              to={l.to}
              className={({ isActive }) =>
                `rounded-full px-5 py-2.5 text-[14px] font-semibold transition-all ${
                  isActive
                    ? 'bg-[#0b1311] text-white shadow'
                    : 'text-[#0b1311]/65 hover:bg-black/5 hover:text-[#0b1311]'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user && isVendor ? (
            <>
              <Link
                to="/vendor/dashboard"
                className="inline-flex items-center gap-2 rounded-full bg-[#0b1311] px-5 py-3 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-[#1e4137]"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-bold text-[#0b1311] transition-colors hover:border-[#1e4137] hover:text-[#1e4137]"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/vendor/login"
                className="rounded-full px-4 py-3 text-sm font-bold text-[#0b1311]/70 transition-colors hover:text-[#0b1311]"
              >
                Log in
              </Link>
              <Link
                to="/vendor/register"
                className="group inline-flex items-center gap-2 rounded-full bg-[#1e4137] px-6 py-3 text-sm font-bold text-white shadow-[0_14px_30px_-12px_rgba(30,65,55,0.7)] transition-all hover:-translate-y-0.5 hover:bg-[#142e27]"
              >
                Become a Vendor
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#0b1311] text-white shadow-lg md:hidden"
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav
          aria-label="Mobile navigation"
          className="mx-auto mt-2 max-w-7xl rounded-[28px] border border-white/60 bg-white/95 p-3 shadow-2xl backdrop-blur-2xl md:hidden"
        >
          <ul className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <li key={l.label}>
                <Link
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl px-5 py-3.5 text-[15px] font-bold text-[#0b1311] transition-colors hover:bg-[#fff7f0]"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-2 grid gap-2 border-t border-black/5 pt-3">
            {user && isVendor ? (
              <>
                <Link
                  to="/vendor/dashboard"
                  onClick={() => setOpen(false)}
                  className="rounded-full bg-[#0b1311] px-5 py-3.5 text-center text-sm font-bold text-white"
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full border border-black/10 bg-white px-5 py-3.5 text-sm font-bold text-[#0b1311]"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/vendor/register"
                  onClick={() => setOpen(false)}
                  className="rounded-full bg-[#1e4137] px-5 py-3.5 text-center text-sm font-bold text-white"
                >
                  Become a Vendor
                </Link>
                <Link
                  to="/vendor/login"
                  onClick={() => setOpen(false)}
                  className="rounded-full border border-black/10 bg-white px-5 py-3.5 text-center text-sm font-bold text-[#0b1311]"
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
