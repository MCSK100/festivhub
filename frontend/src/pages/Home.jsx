import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
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
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import SEO from '../components/common/SEO'
import StudioButton from '../components/ui/StudioButton'
import { HomeSearch } from '../components/marketplace/SearchBar'
import { CategoryGrid } from '../components/marketplace/CategoryCard'
import VendorGrid from '../components/marketplace/VendorGrid'
import api from '../services/api'
import { normalizeVendors, vendorImage, vendorLocation, startingPriceLabel } from '../utils/format'
import { CATEGORIES } from '../data/categories'

const HERO_MAIN =
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1800&auto=format&fit=crop'
const HERO_SECOND =
  'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop'
const HERO_THIRD =
  'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=1200&auto=format&fit=crop'

// Hi-res version of a category's artwork.
const hiRes = (url) => String(url || '').replace('w=600', 'w=1400')

const hasRealPhoto = (v) =>
  Boolean(v.profileImage || v.coverImage || (v.portfolioImages || []).length || (v.gallery || []).length)

// Small thumbs for the floating cards — distinct crafts, not carousel repeats.
const THUMB_VIDEO = 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=200&auto=format&fit=crop'
const THUMB_FOOD = 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=200&auto=format&fit=crop'
const THUMB_STAGE = 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400&auto=format&fit=crop'

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
  const [slide, setSlide] = useState(0)
  const [paused, setPaused] = useState(false)

  // Hero carousel slides — real vendor photos first, then one slide per
  // category with its own artwork. Deduped by image URL + unique keys, so a
  // repeated image can never appear twice in the rotation.
  const slides = useMemo(() => {
    const seen = new Set()
    const out = []
    const push = (id, src, slide) => {
      if (!src || seen.has(src)) return
      seen.add(src)
      out.push({ id, src, ...slide })
    }
    // 1. Real uploaded vendor photos (most trustworthy first).
    for (const v of vendors || []) {
      if (!v || out.length >= 6) break
      if (!hasRealPhoto(v)) continue
      push(`v-${v._id}`, vendorImage(v), {
        name: v.companyName || v.name || 'Featured vendor',
        category: v.category || 'Events',
        location: vendorLocation(v),
        price: startingPriceLabel(v),
        cta: 'View profile',
        to: `/vendors/${v._id}`,
      })
    }
    // 2. Every category gets its own distinct artwork slide.
    for (const c of CATEGORIES) {
      push(`c-${c.name}`, hiRes(c.image), {
        name: `${c.name} specialists`,
        category: c.name,
        location: 'Across India',
        price: 'Compare real portfolios',
        cta: 'Explore category',
        to: `/category/${encodeURIComponent(c.name)}`,
      })
    }
    if (out.length >= 2) return out
    return [
      { id: 'f1', src: HERO_MAIN, name: 'Signature weddings', category: 'Decoration', location: 'Coimbatore', price: 'Starting from ₹24,999', cta: 'View profile', to: '/vendors' },
      { id: 'f2', src: HERO_SECOND, name: 'Candid stories', category: 'Photography', location: 'Chennai', price: 'Starting from ₹14,999', cta: 'View profile', to: '/vendors' },
      { id: 'f3', src: HERO_THIRD, name: 'Live nights', category: 'DJ & Music', location: 'Bengaluru', price: 'Starting from ₹9,999', cta: 'View profile', to: '/vendors' },
    ]
  }, [vendors])
  const count = slides.length
  const current = slides[slide % count]

  useEffect(() => {
    setSlide(0)
  }, [count])

  useEffect(() => {
    if (paused || count < 2) return
    const t = setInterval(() => setSlide((s) => (s + 1) % count), 4500)
    return () => clearInterval(t)
  }, [paused, count])

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
      <SEO
        path="/"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'FestivLink',
          url: 'https://festivlink.vercel.app/',
          description: 'Marketplace connecting event hosts with verified vendors across India',
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://festivlink.vercel.app/vendors?q={search_term_string}',
            'query-input': 'required name=search_term_string',
          },
        }}
      />

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
                100+ verified vendors booking for 2026 season
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
                big day,
                <svg aria-hidden viewBox="0 0 220 14" className="absolute -bottom-2 left-0 w-full text-[#1e4137]/25" fill="none">
                  <path d="M3 10.5C60 3.5 160 3.5 217 10.5" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                </svg>
              </span>{' '}
              in one search.
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
              <div className="text-[13px] leading-tight">
                <div className="flex items-center gap-1">
                  <span className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </span>
                  <span className="font-bold">4.9</span>
                </div>
                <p className="mt-0.5 font-medium text-[#0b1311]/55">100+ verified reviews</p>
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
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              className="relative overflow-hidden rounded-[32px] border-[6px] border-white bg-white shadow-[0_40px_90px_-24px_rgba(11,19,17,0.45)]"
            >
              {/* carousel image */}
              <div className="relative aspect-[4/4.4] w-full overflow-hidden sm:aspect-[5/5.2]">
                <AnimatePresence mode="popLayout">
                  <motion.img
                    key={current.id}
                    src={current.src}
                    alt={`${current.name} — ${current.category} in ${current.location}`}
                    initial={{ opacity: 0, scale: 1.07 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="eager"
                  />
                </AnimatePresence>
              </div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0b1311]/60 via-[#0b1311]/5 to-transparent" />

              {/* autoplay progress */}
              {count > 1 && !paused && (
                <motion.div
                  key={`progress-${slide}`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 4.5, ease: 'linear' }}
                  className="absolute left-0 top-0 h-1 w-full origin-left bg-white/80"
                />
              )}

              {/* top status pill */}
              <div className="absolute left-4 right-4 top-4 flex items-center justify-between gap-2">
                <span className="glass-ios-dark inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-semibold text-white">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                  2,400+ events booked this month
                </span>
                <span className="glass-ios hidden items-center gap-1.5 rounded-full px-4 py-2 text-[12px] font-bold text-[#0b1311] sm:inline-flex">
                  <MapPin className="h-3.5 w-3.5 text-[#1e4137]" /> {current.location}
                </span>
              </div>

              {/* bottom info bar — live vendor per slide */}
              <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
                <div className="glass-ios min-w-0 flex-1 rounded-2xl p-4">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={current.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="truncate text-[15px] font-black tracking-tight text-[#0b1311]">
                        {current.name}
                      </p>
                      <p className="mt-0.5 truncate text-[12px] font-semibold text-[#0b1311]/55">
                        {current.category} • {current.location}
                      </p>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <p className="truncate text-[13px] font-bold text-[#1e4137]">{current.price}</p>
                        {count > 1 && (
                          <span className="shrink-0 rounded-full bg-[#0b1311]/6 px-2.5 py-1 text-[11px] font-bold tabular-nums text-[#0b1311]/60">
                            {(slide % count) + 1} / {count}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
                <div className="flex shrink-0 flex-col gap-2">
                  {count > 1 && (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setSlide((s) => (s - 1 + count) % count)}
                        aria-label="Previous vendor"
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/85 text-[#0b1311] shadow-xl backdrop-blur-xl transition-all hover:bg-[#1e4137] hover:text-white"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setSlide((s) => (s + 1) % count)}
                        aria-label="Next vendor"
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/85 text-[#0b1311] shadow-xl backdrop-blur-xl transition-all hover:bg-[#1e4137] hover:text-white"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                  <Link
                    to={current.to}
                    className="group hidden h-11 items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-[#1e4137] px-4 text-[12px] font-bold text-white shadow-xl transition-all hover:bg-[#142e27] sm:inline-flex"
                    aria-label={`${current.cta || 'View'} — ${current.name}`}
                  >
                    {current.cta || 'View profile'}
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* floating: booking confirmed */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="glass-ios absolute -left-3 top-16 w-[240px] rounded-3xl p-4 sm:-left-10"
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
                <img src={THUMB_VIDEO} alt="" loading="lazy" className="h-9 w-9 rounded-full border-2 border-white object-cover" />
                <img src={THUMB_FOOD} alt="" loading="lazy" className="h-9 w-9 rounded-full border-2 border-white object-cover" />
                <span className="text-[11px] font-semibold text-[#0b1311]/60">Photo + Decor locked</span>
              </div>
            </motion.div>

            {/* floating: rating */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              className="glass-ios absolute -bottom-7 right-3 w-[220px] rounded-3xl p-4 sm:right-6"
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
              <img src={THUMB_STAGE} alt="DJ and stage lights" className="aspect-square w-full object-cover" loading="lazy" />
              <p className="glass-ios px-2.5 py-2 text-center text-[10px] font-bold uppercase tracking-wider text-[#0b1311]">
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
        <div className="glass-ios relative mt-10 flex items-center gap-4 overflow-hidden rounded-full px-6 py-3.5">
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
        <div className="glass-ios overflow-hidden rounded-[32px] p-6 sm:p-10">
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
                className="glass-ios group relative overflow-hidden rounded-[26px] p-6 transition-all duration-300 hover:-translate-y-1.5"
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
