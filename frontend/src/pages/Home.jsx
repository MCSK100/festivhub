import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Search,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  MapPin,
  Star,
  Play,
  CalendarCheck,
  ShieldCheck,
  Sparkles,
  Check,
} from 'lucide-react'
import SEO from '../components/common/SEO'
import StudioButton from '../components/ui/StudioButton'
import { HomeSearch } from '../components/marketplace/SearchBar'
import { CategoryGrid } from '../components/marketplace/CategoryCard'
import VendorGrid from '../components/marketplace/VendorGrid'
import api from '../services/api'
import { normalizeVendors } from '../utils/format'

const HERO_MAIN =
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop'
const HERO_SECOND =
  'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop'
const HERO_THIRD =
  'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=600&auto=format&fit=crop'

const STEPS = [
  { n: '01', title: 'Discover', text: 'Search by service, city and budget — all verified profiles in one place.' },
  { n: '02', title: 'Compare', text: 'Portfolios, honest pricing, ratings and real reviews. No guesswork.' },
  { n: '03', title: 'Book', text: 'Send one enquiry, chat directly and lock your date in minutes.' },
  { n: '04', title: 'Celebrate', text: 'Get reminders, day-of support and a celebration that runs itself.' },
]

const MARQUEE = ['Weddings', 'Sangeet', 'Corporate', 'Festivals', 'Concerts', 'Haldi', 'Receptions', 'Birthdays']

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
    return () => {
      alive = false
    }
  }, [])

  return (
    <div className="relative overflow-hidden bg-[#fff7f0] text-[#0b1311]">
      <SEO path="/" />

      {/* ambient background */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[560px] w-[560px] rounded-full bg-[#bad6ff]/35 blur-[120px]" />
        <div className="absolute -right-48 top-32 h-[620px] w-[620px] rounded-full bg-[#f3d9c8]/55 blur-[130px]" />
        <div className="absolute left-1/2 top-[720px] h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-white/60 blur-[100px]" />
      </div>

      {/* ============ HERO ============ */}
      <section className="relative mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-8 lg:pt-32">
        <div className="grid items-center gap-12 lg:grid-cols-[1.04fr_0.96fr] lg:gap-10">
          {/* ---- Copy ---- */}
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="inline-flex items-center gap-2.5 rounded-full border border-[#1e4137]/12 bg-white/85 py-1.5 pl-2 pr-4 shadow-sm backdrop-blur"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1e4137] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-white">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-300" />
                </span>
                Live
              </span>
              <span className="text-[13px] font-semibold text-[#0b1311]/70">
                850+ verified vendors booking for 2026 season
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.08 }}
              className="mt-6 max-w-2xl text-balance text-[2.65rem] font-bold leading-[1.02] tracking-[-0.03em] sm:text-6xl lg:text-[4.4rem]"
            >
              Every vendor for your{' '}
              <span className="relative inline-block whitespace-nowrap font-serif italic text-[#1e4137]">
                big day
                <svg aria-hidden viewBox="0 0 220 14" className="absolute -bottom-2 left-0 w-full text-[#1e4137]/25" fill="none">
                  <path d="M3 10.5C60 3.5 160 3.5 217 10.5" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                </svg>
              </span>
              , in one search.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.16 }}
              className="mt-5 max-w-xl text-[1.05rem] leading-[1.7] text-[#0b1311]/62 sm:text-lg"
            >
              Photographers, caterers, decorators, DJs, makeup artists and venues —
              compare real portfolios and pricing, then book directly. No middlemen, no spam.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.24 }}
              className="mt-7 flex flex-wrap items-center gap-3"
            >
              <StudioButton to="/vendors">Browse vendors</StudioButton>
              <Link
                to="/#how-it-works"
                className="group inline-flex h-[68px] items-center gap-3 rounded-full border border-[#0b1311]/10 bg-white/80 py-2 pl-2 pr-7 font-semibold text-[#0b1311] shadow-sm backdrop-blur transition-all hover:border-[#1e4137]/30 hover:shadow-md"
              >
                <span className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#0b1311] text-white transition-colors group-hover:bg-[#1e4137]">
                  <Play className="ml-0.5 h-5 w-5 fill-current" />
                </span>
                See how it works
              </Link>
            </motion.div>

            {/* trust row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.34 }}
              className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2.5">
                  {[
                    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop',
                  ].map((src) => (
                    <img
                      key={src}
                      src={src}
                      alt="Happy customer"
                      loading="lazy"
                      className="h-10 w-10 rounded-full border-[2.5px] border-[#fff7f0] object-cover shadow-sm"
                    />
                  ))}
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border-[2.5px] border-[#fff7f0] bg-[#1e4137] text-[11px] font-bold text-white">
                    3k+
                  </span>
                </div>
                <div className="text-[13px] leading-tight">
                  <div className="flex items-center gap-1">
                    <span className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </span>
                    <span className="font-bold">4.9</span>
                  </div>
                  <p className="mt-0.5 font-medium text-[#0b1311]/55">3,200+ verified reviews</p>
                </div>
              </div>
              <div className="hidden h-11 w-px bg-[#0b1311]/10 sm:block" />
              <div className="flex items-center gap-5 text-[13px] font-semibold text-[#0b1311]/65">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-[18px] w-[18px] text-[#1e4137]" /> Verified & insured
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <BadgeCheck className="h-[18px] w-[18px] text-[#1e4137]" /> No brokerage
                </span>
              </div>
            </motion.div>
          </div>

          {/* ---- Modern visual ---- */}
          <div className="relative z-10 mx-auto w-full max-w-[560px] lg:mx-0 lg:justify-self-end">
            {/* backdrop shapes */}
            <div aria-hidden className="absolute -inset-6 -z-10">
              <div className="absolute inset-6 rotate-3 rounded-[40px] bg-gradient-to-br from-[#1e4137] to-[#0f2a23] opacity-100 shadow-2xl" />
              <div className="absolute inset-6 -rotate-2 rounded-[40px] border border-[#1e4137]/15 bg-white/50 backdrop-blur" />
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 28 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.18 }}
              className="relative overflow-hidden rounded-[32px] border-[6px] border-white bg-white shadow-[0_40px_90px_-24px_rgba(11,19,17,0.45)]"
            >
              <img
                src={HERO_MAIN}
                alt="Luxury Indian wedding mandap with florals and lights"
                className="aspect-[4/4.4] w-full object-cover sm:aspect-[5/5.2]"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b1311]/55 via-[#0b1311]/5 to-transparent" />

              {/* top status pill */}
              <div className="absolute left-4 right-4 top-4 flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-black/35 px-4 py-2 text-[12px] font-semibold text-white backdrop-blur-xl">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                  2,400+ events booked this month
                </span>
                <span className="hidden items-center gap-1.5 rounded-full bg-white/95 px-4 py-2 text-[12px] font-bold text-[#0b1311] shadow sm:inline-flex">
                  <MapPin className="h-3.5 w-3.5 text-[#1e4137]" /> Coimbatore
                </span>
              </div>

              {/* bottom info bar */}
              <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
                <div className="rounded-2xl bg-white/95 p-4 shadow-xl backdrop-blur-xl">
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#0b1311]/50">Starting from</p>
                  <p className="mt-0.5 text-xl font-black text-[#0b1311]">
                    ₹24,999 <span className="text-[13px] font-semibold text-[#0b1311]/50">/ event</span>
                  </p>
                  <div className="mt-2 flex gap-1.5">
                    {['Photo', 'Decor', 'DJ'].map((t) => (
                      <span key={t} className="rounded-full bg-[#1e4137]/8 px-2.5 py-1 text-[11px] font-bold text-[#1e4137]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <Link
                  to="/vendors"
                  className="group hidden h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-[#0b1311] shadow-xl transition-all hover:bg-[#1e4137] hover:text-white sm:flex"
                  aria-label="Browse vendors"
                >
                  <ArrowUpRight className="h-6 w-6 transition-transform group-hover:rotate-45" />
                </Link>
              </div>
            </motion.div>

            {/* floating: booking confirmed */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="absolute -left-3 top-16 w-[240px] rounded-3xl border border-white/60 bg-white/90 p-4 shadow-[0_24px_60px_-16px_rgba(11,19,17,0.4)] backdrop-blur-2xl sm:-left-10"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
                  <Check className="h-5 w-5" strokeWidth={3} />
                </span>
                <div>
                  <p className="text-[13px] font-bold leading-tight">Booking confirmed</p>
                  <p className="text-xs font-medium text-[#0b1311]/55">Aarav & Diya • Udaipur</p>
                </div>
              </div>
              <div className="mt-3 overflow-hidden rounded-full bg-black/8">
                <div className="h-1.5 w-4/5 rounded-full bg-gradient-to-r from-emerald-500 to-[#1e4137]" />
              </div>
              <div className="mt-3 flex items-center gap-2">
                <img src={HERO_SECOND} alt="" className="h-9 w-9 rounded-full border-2 border-white object-cover" />
                <img src={HERO_THIRD} alt="" className="h-9 w-9 rounded-full border-2 border-white object-cover" />
                <span className="text-[11px] font-semibold text-[#0b1311]/60">Photo + Decor locked</span>
              </div>
            </motion.div>

            {/* floating: rating */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-7 right-3 w-[220px] rounded-3xl border border-white/60 bg-white/95 p-4 shadow-[0_24px_60px_-16px_rgba(11,19,17,0.4)] backdrop-blur-2xl sm:right-6"
            >
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop"
                  alt="Reviewer"
                  className="h-11 w-11 rounded-2xl object-cover"
                />
                <div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="text-[15px] font-black">4.9</span>
                  </div>
                  <p className="text-[11px] font-semibold text-[#0b1311]/55">“Mandap looked magical”</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between rounded-2xl bg-[#fff7f0] px-3 py-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#1e4137]">
                  <CalendarCheck className="h-3.5 w-3.5" /> Next slot: Sat
                </span>
                <span className="text-[11px] font-bold text-emerald-600">Available</span>
              </div>
            </motion.div>

            {/* floating: mini image chip */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.65 }}
              className="absolute -right-2 top-1/2 hidden w-32 rotate-6 overflow-hidden rounded-3xl border-4 border-white shadow-2xl md:block lg:-right-8"
            >
              <img src={HERO_THIRD} alt="Concert lights" className="aspect-square w-full object-cover" loading="lazy" />
              <p className="bg-white px-2.5 py-2 text-center text-[10px] font-bold uppercase tracking-wider text-[#0b1311]">
                Concerts • Live
              </p>
            </motion.div>
          </div>
        </div>

        {/* search */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }}>
          <HomeSearch />
        </motion.div>

        {/* marquee */}
        <div className="relative mt-10 flex items-center gap-4 overflow-hidden rounded-full border border-[#0b1311]/8 bg-white/70 px-6 py-3.5 shadow-sm backdrop-blur">
          <span className="hidden shrink-0 items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.14em] text-[#1e4137] sm:inline-flex">
            <Sparkles className="h-4 w-4" /> Hosts book us for
          </span>
          <div className="flex flex-1 gap-7 overflow-hidden">
            <div className="flex min-w-full shrink-0 animate-[marquee_28s_linear_infinite] items-center justify-around gap-7 text-[13px] font-bold uppercase tracking-[0.14em] text-[#0b1311]/45">
              {MARQUEE.map((m) => (
                <span key={m} className="flex items-center gap-7">
                  {m} <span className="h-1.5 w-1.5 rounded-full bg-[#1e4137]/30" />
                </span>
              ))}
            </div>
            <div aria-hidden className="flex min-w-full shrink-0 animate-[marquee_28s_linear_infinite] items-center justify-around gap-7 text-[13px] font-bold uppercase tracking-[0.14em] text-[#0b1311]/45">
              {MARQUEE.map((m) => (
                <span key={m} className="flex items-center gap-7">
                  {m} <span className="h-1.5 w-1.5 rounded-full bg-[#1e4137]/30" />
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ CATEGORIES ============ */}
      <section id="categories" className="relative mx-auto max-w-7xl scroll-mt-24 px-4 py-14 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[32px] border border-black/5 bg-white p-6 shadow-[0_20px_60px_-30px_rgba(11,19,17,0.3)] sm:p-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-[#1e4137]/8 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#1e4137]">
                <Search className="h-3.5 w-3.5" /> Categories
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">What are you planning?</h2>
              <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-[#0b1311]/60">
                Twelve crafts, one marketplace. Pick a category to see verified pros with real work and pricing.
              </p>
            </div>
            <Link
              to="/vendors"
              className="group inline-flex items-center gap-2 rounded-full border border-[#0b1311]/10 bg-[#fff7f0] px-6 py-3 text-sm font-bold text-[#0b1311] transition-all hover:border-[#1e4137] hover:text-[#1e4137]"
            >
              View all vendors
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="mt-8">
            <CategoryGrid compact />
          </div>
        </div>
      </section>

      {/* ============ FEATURED ============ */}
      <section className="relative mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-amber-400/20 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#7c5a00]">
              <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" /> Featured
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Top-rated vendors near you</h2>
          </div>
          <Link
            to="/vendors"
            className="inline-flex items-center gap-2 rounded-full bg-[#0b1311] px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-[#1e4137]"
          >
            Browse all{total ? ` (${total})` : ''}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <VendorGrid vendors={vendors} loading={loading} error={error} onRetry={() => window.location.reload()} />
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section id="how-it-works" className="relative scroll-mt-20 border-y border-[#1e4137]/8 bg-gradient-to-b from-white to-[#fff7f0]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#1e4137]">How it works</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">From search to celebration in four steps</h2>
          </div>
          <ol className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <motion.li
                key={s.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group relative overflow-hidden rounded-[26px] border border-black/5 bg-[#fff7f0] p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_50px_-20px_rgba(30,65,55,0.4)]"
              >
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#1e4137]/6 transition-transform duration-300 group-hover:scale-150" />
                <p className="bg-gradient-to-br from-[#1e4137] to-[#1e4137]/40 bg-clip-text text-4xl font-black text-transparent">
                  {s.n}
                </p>
                <h3 className="mt-3 text-lg font-bold">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[#0b1311]/60">{s.text}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============ VENDOR CTA ============ */}
      <section className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[32px] bg-[#1e4137] p-8 text-white shadow-[0_32px_80px_-24px_rgba(30,65,55,0.6)] sm:p-12 lg:p-14">
          <div aria-hidden className="absolute inset-0">
            <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-[#bad6ff]/20 blur-3xl" />
            <div
              className="absolute inset-0 opacity-[0.12]"
              style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }}
            />
          </div>
          <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#bad6ff]">
                For professionals
              </p>
              <h2 className="mt-4 max-w-xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                Get discovered by hosts planning their biggest days.
              </h2>
              <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-white/70">
                Create a free listing, showcase your portfolio and receive direct enquiries — no commission on your first bookings.
              </p>
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[13px] font-semibold text-white/75">
                <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-emerald-300" /> Free listing</span>
                <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-emerald-300" /> Direct chat</span>
                <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-emerald-300" /> Zero spam</span>
              </div>
            </div>
            <div className="flex flex-col gap-3 lg:items-end">
              <StudioButton to="/vendor/register" variant="beige">List your business</StudioButton>
              <Link to="/vendor/login" className="text-center text-sm font-semibold text-white/70 underline-offset-4 hover:text-white hover:underline">
                Already a vendor? Log in
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
