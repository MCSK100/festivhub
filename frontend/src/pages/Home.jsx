import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, ArrowRight, BadgeCheck, MapPin } from 'lucide-react'
import SEO from '../components/common/SEO'
import StudioButton from '../components/ui/StudioButton'
import { HomeSearch } from '../components/marketplace/SearchBar'
import { CategoryGrid } from '../components/marketplace/CategoryCard'
import VendorGrid from '../components/marketplace/VendorGrid'
import api from '../services/api'
import { normalizeVendors } from '../utils/format'

const HERO_IMG = 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop'

const STEPS = [
  { n: '01', title: 'Find', text: 'Browse vendors by category and location.' },
  { n: '02', title: 'Compare', text: 'Check profiles, services, portfolio and pricing.' },
  { n: '03', title: 'Request', text: 'Send a booking enquiry directly to the vendor.' },
  { n: '04', title: 'Celebrate', text: 'Connect with the vendor and plan your event.' },
]

export default function Home() {
  const [vendors, setVendors] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let alive = true
    api
      .get('/providers', { params: { limit: 8, sort: 'rating' } })
      .then((res) => {
        if (!alive) return
        const { vendors: list, total: t } = normalizeVendors(res.data)
        setVendors(list.slice(0, 8))
        setTotal(t)
      })
      .catch(() => alive && setError(true))
      .finally(() => alive && setLoading(false))
    return () => { alive = false }
  }, [])

  return (
    <div className="bg-[#fff7f0] text-[#0b1311]">
      <SEO path="/" />

      {/* HERO — single idea, marketplace-first, keeps cream/pine theme */}
      <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-8 lg:pt-28">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#1e4137]/15 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#1e4137]">
              Weddings • Corporate • Celebrations
            </span>
            <h1 className="mt-5 text-balance text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Find the right vendors for your event.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-[#0b1311]/65 sm:text-lg">
              Discover photographers, caterers, decorators, makeup artists, venues and more. Browse local
              professionals and send a booking request directly.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <StudioButton to="/vendors">Browse Vendors</StudioButton>
              <Link
                to="/vendor/register"
                className="inline-flex items-center gap-2 rounded-full border border-[#0b1311]/15 bg-white px-7 py-4 text-sm font-semibold text-[#0b1311] transition-colors hover:border-[#1e4137] hover:text-[#1e4137]"
              >
                Become a Vendor
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-[#0b1311]/60">
              <span className="inline-flex items-center gap-1.5"><BadgeCheck className="h-4 w-4 text-[#1e4137]" /> Verified vendors</span>
              <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-[#1e4137]" /> Local professionals</span>
              <span className="inline-flex items-center gap-1.5"><Search className="h-4 w-4 text-[#1e4137]" /> No login needed</span>
            </div>
          </div>
          <div className="overflow-hidden rounded-[var(--jak-border-radius)] border border-black/5 bg-white shadow-xl">
            <img src={HERO_IMG} alt="Decorated event venue with flowers and lights" className="aspect-[4/3] w-full object-cover" loading="eager" />
            <div className="flex flex-wrap gap-2 p-4">
              {['Photography', 'Catering', 'Decor', 'Venues'].map((t) => (
                <Link key={t} to={`/category/${encodeURIComponent(t === 'Decor' ? 'Decoration' : t)}`} className="rounded-full bg-[#0b1311]/[0.04] px-4 py-1.5 text-xs font-semibold text-[#0b1311]/70 hover:bg-[#1e4137]/10 hover:text-[#1e4137]">
                  {t}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <HomeSearch />
      </section>

      {/* CATEGORIES */}
      <section id="categories" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#1e4137]">Categories</p>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Popular categories</h2>
          </div>
          <Link to="/vendors" className="hidden text-sm font-semibold text-[#1e4137] underline underline-offset-4 sm:block">View all vendors</Link>
        </div>
        <CategoryGrid compact />
      </section>

      {/* FEATURED VENDORS */}
      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#1e4137]">Featured</p>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Trusted vendors near you</h2>
          </div>
          <Link to="/vendors" className="text-sm font-semibold text-[#1e4137] underline underline-offset-4">Browse all{total ? ` (${total})` : ''}</Link>
        </div>
        <VendorGrid vendors={vendors} loading={loading} error={error} onRetry={() => window.location.reload()} />
      </section>

      {/* HOW IT WORKS — 4 steps only */}
      <section id="how-it-works" className="scroll-mt-20 border-y border-black/5 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#1e4137]">How it works</p>
          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">From search to celebration in four steps</h2>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <li key={s.n} className="rounded-[20px] border border-black/5 bg-[#fff7f0] p-6">
                <p className="text-sm font-black text-[#1e4137]/40">{s.n}</p>
                <h3 className="mt-2 text-lg font-bold">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[#0b1311]/60">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* VENDOR CTA — simple */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 rounded-[var(--jak-border-radius)] bg-[#1e4137] p-8 text-[#fff7f0] lg:grid-cols-2 lg:p-12">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Are you an event professional?</h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/75 sm:text-base">
              Showcase your services and connect with customers looking for vendors like you.
            </p>
          </div>
          <div className="lg:text-right">
            <StudioButton to="/vendor/register" variant="beige">List Your Business</StudioButton>
          </div>
        </div>
      </section>
    </div>
  )
}
