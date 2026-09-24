import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ShieldCheck, Search, CalendarCheck, Sparkles, ArrowRight, Star } from 'lucide-react'
import SEO from '../components/common/SEO'
import StudioButton from '../components/ui/StudioButton'

const PILLARS = [
  {
    icon: ShieldCheck,
    title: 'Verified only',
    text: 'Every vendor is reviewed before going live — real portfolios, real contact details, real accountability.',
  },
  {
    icon: Search,
    title: 'Transparent search',
    text: 'Filter by craft, city and budget. See honest pricing and ratings up front — no hidden brokerage.',
  },
  {
    icon: CalendarCheck,
    title: 'Direct booking',
    text: 'One enquiry goes straight to the vendor. No middlemen, no spam, no endless phone tag.',
  },
]

const STATS = [
  { value: '100+', label: 'Verified vendors' },
  { value: '12', label: 'Event crafts' },
  { value: '100+', label: 'Verified reviews' },
  { value: '4.9', label: 'Average rating' },
]

export default function About() {
  return (
    <div className="relative overflow-hidden bg-[#fff7f0] text-[#0b1311]">
      <SEO
        title="About Us"
        description="FestivLink is India's celebration marketplace — verified photographers, caterers, decorators, DJs and venues you can compare and book directly."
        path="/about"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[480px] w-[480px] rounded-full bg-[#bad6ff]/35 blur-[120px]" />
        <div className="absolute -right-48 top-40 h-[520px] w-[520px] rounded-full bg-[#f3d9c8]/55 blur-[130px]" />
      </div>

      {/* Hero */}
      <section className="relative mx-auto max-w-7xl px-4 pt-28 sm:px-6 lg:px-8 lg:pt-36">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#1e4137]/12 bg-white/85 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#1e4137] shadow-sm backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" /> Our story
          </p>
          <h1 className="mt-5 text-balance text-4xl font-bold leading-[1.05] tracking-[-0.02em] sm:text-5xl lg:text-6xl">
            Planning a celebration shouldn't take 40 phone calls.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[#0b1311]/65 sm:text-lg">
            FestivLink started with a simple frustration: finding a trustworthy photographer,
            caterer or decorator meant relying on luck and word of mouth. So we built one hub
            where hosts compare verified pros — and book in minutes.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.dl
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="glass-ios mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-4 rounded-[28px] p-6 sm:grid-cols-4 sm:p-8"
        >
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <dd className="text-3xl font-black tracking-tight text-[#1e4137] sm:text-4xl">{s.value}</dd>
              <dt className="mt-1 text-[13px] font-semibold text-[#0b1311]/55">{s.label}</dt>
            </div>
          ))}
        </motion.dl>
      </section>

      {/* Pillars */}
      <section className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#1e4137]">What we stand for</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Three promises, kept on every booking</h2>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {PILLARS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-ios rounded-[26px] p-7"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1e4137] text-white shadow-lg shadow-[#1e4137]/25">
                <p.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-xl font-bold">{p.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-[#0b1311]/60">{p.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works strip */}
      <section className="relative mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[32px] bg-[#1e4137] p-8 text-white shadow-[0_32px_80px_-24px_rgba(30,65,55,0.6)] sm:p-12">
          <div aria-hidden className="absolute inset-0">
            <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-[#bad6ff]/20 blur-3xl" />
          </div>
          <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <div className="flex items-center gap-1.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
                <span className="ml-1 text-sm font-bold">4.9 from 100+ reviews</span>
              </div>
              <h2 className="mt-4 max-w-xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                Come see why hosts plan with FestivLink.
              </h2>
              <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-white/70">
                Browse vendors, compare honest pricing, and send your first enquiry today — free, no account needed.
              </p>
            </div>
            <div className="flex flex-col gap-3 lg:items-end">
              <StudioButton to="/vendors" variant="beige">
                Browse vendors <ArrowRight className="h-4 w-4" />
              </StudioButton>
              <Link to="/faq" className="text-center text-sm font-semibold text-white/70 underline-offset-4 hover:text-white hover:underline">
                Questions? Read the FAQ
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
