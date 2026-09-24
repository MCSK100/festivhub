import { Link } from 'react-router-dom'
import { Instagram, Facebook, Linkedin, MapPin, Mail, ArrowUpRight } from 'lucide-react'
import { CATEGORY_NAMES } from '../../data/categories'

export default function Footer() {
  return (
    <footer className="relative bg-[#0f2a23] text-[#fff7f0]">
      <div aria-hidden className="h-7 rounded-b-[28px] bg-[#fff7f0]" />
      {/* glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 left-1/3 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-24 right-10 h-80 w-80 rounded-full bg-[#bad6ff]/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pb-8 pt-14 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.7fr_0.8fr_1fr]">
          <div>
            <Link to="/" className="inline-block rounded-2xl bg-white/95 px-4 py-2.5 shadow-lg" aria-label="FestivLink home">
              <img src="/new-logo.png" alt="FestivLink logo" className="h-10 w-auto" />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/65">
              India's celebration marketplace — photographers, caterers, decorators,
              DJs and venues, all verified and bookable in one search.
            </p>
            <div className="mt-6 flex items-center gap-2.5">
              {[
                { icon: Instagram, label: 'Instagram' },
                { icon: Facebook, label: 'Facebook' },
                { icon: Linkedin, label: 'LinkedIn' },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/8 text-white/80 transition-all hover:-translate-y-1 hover:bg-white hover:text-[#1e4137]"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Footer explore">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/40">Explore</p>
            <ul className="mt-4 flex flex-col gap-1">
              {[
                ['Home', '/'],
                ['All vendors', '/vendors'],
                ['About us', '/about'],
                ['FAQ', '/faq'],
              ].map(([label, to]) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="group inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm font-medium text-white/75 transition-colors hover:text-white"
                  >
                    {label}
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/40">Top categories</p>
            <ul className="mt-4 flex flex-col gap-1">
              {CATEGORY_NAMES.slice(0, 6).map((c) => (
                <li key={c}>
                  <Link
                    to={`/category/${encodeURIComponent(c)}`}
                    className="inline-block rounded-lg px-2 py-1.5 text-sm font-medium text-white/75 transition-colors hover:text-white"
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[26px] border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#bad6ff]">For vendors</p>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              Get discovered by thousands of hosts planning weddings, corporate events and festivals.
            </p>
            <Link
              to="/vendor/register"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#fff7f0] px-6 py-3 text-sm font-bold text-[#1e4137] transition-all hover:-translate-y-0.5 hover:bg-[#bad6ff]"
            >
              List your business <ArrowUpRight className="h-4 w-4" />
            </Link>
            <div className="mt-5 space-y-1.5 border-t border-white/10 pt-4 text-[13px] text-white/60">
              <p className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" /> hello@festivlink.com</p>
              <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> Coimbatore • Mumbai • Delhi</p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} FestivLink. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link to="/about" className="transition-colors hover:text-white">About</Link>
            <Link to="/faq" className="transition-colors hover:text-white">FAQ</Link>
            <Link to="/policy#privacy" className="transition-colors hover:text-white">Privacy Policy</Link>
            <Link to="/policy#terms" className="transition-colors hover:text-white">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
