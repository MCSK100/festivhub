import { Link } from 'react-router-dom'
import { CATEGORY_NAMES } from '../../data/categories'

export default function Footer() {
  return (
    <footer className="bg-[#1e4137] text-[#fff7f0]">
      <div aria-hidden className="h-8 rounded-b-[24px] bg-[#fff7f0]" />
      <div className="mx-auto max-w-7xl px-6 pb-10 pt-12 lg:px-8">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="text-2xl font-black tracking-tight">FESTIVLINK</p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
              Find photographers, caterers, decorators, makeup artists, venues and more. Browse local professionals and
              send a booking request directly.
            </p>
          </div>
          <nav aria-label="Footer" className="md:col-span-2">
            <p className="text-sm font-semibold uppercase tracking-wider text-white/50">Explore</p>
            <ul className="mt-4 flex flex-col gap-3 text-sm">
              <li><Link to="/" className="text-white/80 hover:text-white">Home</Link></li>
              <li><Link to="/vendors" className="text-white/80 hover:text-white">Vendors</Link></li>
              <li><Link to="/#categories" className="text-white/80 hover:text-white">Categories</Link></li>
              <li><Link to="/#how-it-works" className="text-white/80 hover:text-white">How It Works</Link></li>
            </ul>
          </nav>
          <div className="md:col-span-3">
            <p className="text-sm font-semibold uppercase tracking-wider text-white/50">Categories</p>
            <ul className="mt-4 grid grid-cols-1 gap-3 text-sm">
              {CATEGORY_NAMES.slice(0, 6).map((c) => (
                <li key={c}>
                  <Link to={`/category/${encodeURIComponent(c)}`} className="text-white/80 hover:text-white">
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-3">
            <p className="text-sm font-semibold uppercase tracking-wider text-white/50">For vendors</p>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              Showcase your services and connect with customers looking for vendors like you.
            </p>
            <Link
              to="/vendor/register"
              className="mt-5 inline-block rounded-full bg-[#fff7f0] px-6 py-3 text-sm font-semibold text-[#1e4137] transition-colors hover:bg-[#bad6ff]"
            >
              List Your Business
            </Link>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} FestivLink. All rights reserved.</p>
          <p>hello@festivlink.com • Coimbatore, India</p>
        </div>
      </div>
    </footer>
  )
}
