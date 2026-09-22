import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Instagram, Linkedin, Facebook, Star, MapPin, BadgeCheck, Sparkles, CalendarCheck } from 'lucide-react'
import StudioButton from '../components/ui/StudioButton'

/* ------------------------------------------------------------------ */
/* Data — FestivLink mapped onto the Studio Modular structure          */
/* ------------------------------------------------------------------ */

const img = (id, w = 900) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`

const HERO_IMG_TOP = img('photo-1519741497674-611481863552', 800) // wedding couple
const HERO_IMG_MAIN = img('photo-1511795409834-ef04bbd61622', 1000) // table celebration
const HERO_IMG_BOTTOM = img('photo-1470229722913-7c0e2dbbafd3', 800) // concert

/* Hero trust stats — FestivLink marketplace positioning */
const HERO_STATS = [
  { value: '2K+', label: 'Events powered' },
  { value: '850+', label: 'Verified vendors' },
  { value: '40+', label: 'Cities served' },
]

const TRUSTED_CATEGORIES = [
  'Weddings', 'Corporate Summits', 'Sangeet Nights', 'Festivals', 'Product Launches', 'Concerts',
]

const CASES = [
  {
    title: 'Aarav & Diya Wedding',
    sector: 'Weddings',
    services: ['Photography', 'Decor', 'Catering'],
    image: img('photo-1519225421980-715cb0215aed', 800),
  },
  {
    title: 'TechNova Summit',
    sector: 'Corporate',
    services: ['Staging', 'Lighting', 'Photography'],
    image: img('photo-1511578314322-379afb476865', 800),
  },
  {
    title: 'Sunburn Arena Night',
    sector: 'Concerts',
    services: ['Sound & DJ', 'Lighting', 'Staging'],
    image: img('photo-1505373877841-8d25f7d46678', 800),
  },
  {
    title: 'The Grand Food Fest',
    sector: 'Festivals',
    services: ['Catering', 'Decor', 'Lighting'],
    image: img('photo-1555244162-803834f70033', 800),
  },
  {
    title: 'Meera’s Haldi Morning',
    sector: 'Weddings',
    services: ['Florals', 'Photography'],
    image: img('photo-1464366400600-7168b8af9bc3', 800),
  },
  {
    title: 'Neon Pulse Club Tour',
    sector: 'Nightlife',
    services: ['DJ', 'Lighting', 'Photography'],
    image: img('photo-1470225620780-dba8ba36b745', 800),
  },
]

const SERVICES = [
  {
    title: 'Photography',
    text: 'What does your celebration feel like? Not what it looks like in a checklist, but who is in the room. We start there, and everything else follows: the frames, the film, the feeling. So your event becomes the obvious memory.',
    tags: ['Wedding films', 'Candid stories', 'Drone & reels'],
    image: img('photo-1519741497674-611481863552', 700),
  },
  {
    title: 'Catering',
    text: 'People recognise a great event before they taste a single bite. At a colour, a spread, a smell from the live counter. Catering is not a service you add later: it is how your celebration stands in the world.',
    tags: ['Live counters', 'Multi-cuisine', 'Dessert bars'],
    image: img('photo-1555244162-803834f70033', 700),
  },
  {
    title: 'DJ & Music',
    text: 'Music is your event, offline and out loud. Something to move to, to feel, to remember. The work sits in details people don’t always see but always feel: transitions, reading the room, the 1AM peak. So your night stays physical.',
    tags: ['Wedding DJs', 'Sangeet nights', 'Afterparties'],
    image: img('photo-1470225620780-dba8ba36b745', 700),
  },
  {
    title: 'Decor & Florals',
    text: 'Your venue is your online and offline visiting card. Decor is never “oh yes, we need that too” — it has to show who you are. No template you fill in. A place where guests feel within the first second whether your celebration rings true.',
    tags: ['Mandaps', 'Stage & entry', 'Tablescapes'],
    image: img('photo-1490750967868-88aa4486c946', 700),
  },
  {
    title: 'Lighting & Production',
    text: 'You are present every hour of your event, across stages, halls and dance floors. We design light, sound and staging your team runs itself every day. So your celebration stays recognisable without starting over each time.',
    tags: ['Stage production', 'Sound systems', 'LED & effects'],
    image: img('photo-1470229722913-7c0e2dbbafd3', 700),
  },
]

const TESTIMONIALS = [
  {
    quote:
      'We fell in love with the decor, which definitely matches the vibe and energy we wanted in our venue. You understood what we wanted to create, and our celebration found its place in the colours, in the music, in those beautiful little details.',
    name: 'Priya & Arjun',
    context: 'Udaipur Wedding',
  },
  {
    quote:
      'FestivLink handled photography, catering and staging for three of our company offsites, and impressed us every single time. Proactive, creative, with fresh ideas — clear planning and crisp communication make them a partner you can trust.',
    name: 'Rohit Shekhawat',
    context: 'TechNova Group',
  },
  {
    quote:
      'We have booked DJs and photographers through FestivLink several times for our festival. Always unbelievably happy! Not only beautiful work, but communicative, and every deadline and promise kept. Really top to work with!',
    name: 'Sneha Kulkarni',
    context: 'Sunburn Arena',
  },
  {
    quote:
      'Our sangeet needed an upgrade without throwing away the warmth of a family function. FestivLink felt that brief perfectly — a tight new light design and a clear run-of-show gave us exactly the professional glow we needed.',
    name: 'Kavya Reddy',
    context: 'Hyderabad Sangeet',
  },
]

const VENDOR_WALL = [
  'Photographers', 'Caterers', 'DJs', 'Decorators', 'Florists',
  'Lighting', 'Makeup Artists', 'Mehendi', 'Anchors', 'Choreographers',
  'Videographers', 'Bartenders', 'Security', 'Tent & Stage', 'Fireworks',
  'Photo Booths', 'Live Bands', 'Comedians', 'Magicians', 'Car Rentals',
]

const INSIGHTS = [
  {
    title: 'What happens when your decor doesn’t match who you are',
    text: 'Your event doesn’t look like how it feels. Why that happens, and what to do about it.',
    image: img('photo-1511795409834-ef04bbd61622', 600),
  },
  {
    title: 'AI makes playlists. We make weddings. That’s not the same',
    text: 'A celebration that is truly yours is not made in ten minutes.',
    image: img('photo-1492684223066-81342ee5ff30', 600),
  },
  {
    title: 'Your photographer is not your memory',
    text: 'Most hosts ask for coverage. But what they are actually looking for is something else.',
    image: img('photo-1514525253161-7a46d19cd819', 600),
  },
]

/* ------------------------------------------------------------------ */
/* Small building blocks — exact Studio Modular patterns               */
/* ------------------------------------------------------------------ */

const reveal = {
  hidden: { opacity: 0, y: 36 },
  visible: (d = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: 'easeOut', delay: d },
  }),
}

/* h5 pretitle: uppercase, wide tracking, regular weight */
const Pretitle = ({ children, light = false }) => (
  <p
    className={`mb-4 text-[clamp(15px,1.15vw,22px)] font-normal uppercase tracking-[0.08em] ${
      light ? 'text-[#bad6ff]' : 'text-[#0b1311]'
    }`}
  >
    {children}
  </p>
);

/* c-tag: white pill, small radius padding, icon dot + label */
const Tag = ({ children }) => (
  <span className="inline-flex items-center gap-2.5 rounded-full border border-transparent bg-white px-5 py-2.5 text-[15px] font-normal text-[#0b1311]">
    <span className="inline-block h-2 w-2 rounded-full bg-[#1e4137]" />
    {children}
  </span>
);

/* text link with underline, like their "Meer hierover" */
const TextLink = ({ to, children }) => (
  <Link
    to={to}
    className="inline-flex items-center gap-1 text-[1em] font-medium text-[#0b1311] underline decoration-[#1e4137]/30 decoration-1 underline-offset-[0.25em] transition-colors hover:text-[#1e4137]"
  >
    {children} <ArrowRight className="h-4 w-4" />
  </Link>
);

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const LandingPage = () => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const quote = TESTIMONIALS[quoteIndex];
  const prevQuote = () => setQuoteIndex((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const nextQuote = () => setQuoteIndex((i) => (i + 1) % TESTIMONIALS.length);

  return (
    <div className="bg-[#fff7f0] text-[#0b1311] antialiased">
      {/* ============ HERO — redesigned: marketplace-first, single idea ============ */}
      <header className="relative overflow-hidden pt-36 lg:pt-44">
        {/* pastel blobs + faint wordmark */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 top-10 h-[480px] w-[480px] rounded-full bg-[#C2D5F1]/50 blur-3xl" />
          <div className="absolute right-[-160px] top-64 h-[560px] w-[560px] rounded-full bg-[#F3D9C8]/60 blur-3xl" />
          <div className="absolute inset-x-0 top-24 select-none text-center font-black leading-none tracking-tight text-[#1e4137]/[0.05]" style={{ fontSize: 'clamp(4rem, 14vw, 12rem)' }}>
            FESTIVLINK
          </div>
        </div>

        <div className="relative mx-auto max-w-[100rem] px-6 lg:px-10">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            {/* Copy */}
            <div className="lg:col-span-6">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 rounded-full border border-[#1e4137]/15 bg-white px-4 py-2 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#1e4137] shadow-sm"
              >
                <Sparkles className="h-4 w-4" />
                Weddings • Corporate • Concerts
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="mt-6 text-balance text-[clamp(2.5rem,5.2vw,5rem)] font-semibold leading-[1.04] tracking-tight text-[#0b1311]"
              >
                One hub for every{' '}
                <span className="relative whitespace-nowrap text-[#1e4137]">
                  celebration
                  <svg aria-hidden viewBox="0 0 220 14" className="absolute -bottom-2 left-0 w-full text-[#bad6ff]" fill="none">
                    <path d="M3 10.5C60 3.5 160 3.5 217 10.5" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                  </svg>
                </span>{' '}
                in India
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="mt-6 max-w-xl text-[clamp(1.05rem,1.35vw,1.35rem)] font-normal leading-[1.65] text-[#0b1311]/70"
              >
                FestivLink connects hosts with verified photographers, caterers, DJs,
                decorators and production teams — compare, chat, and book in one place,
                from intimate haldis to 10,000-guest festivals.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="mt-8 flex flex-wrap items-center gap-4"
              >
                <StudioButton to="/join">Find your vendor</StudioButton>
                <Link
                  to="/about"
                  className="inline-flex h-[68px] items-center gap-2 rounded-full border border-[#0b1311]/15 bg-white/70 px-8 font-semibold text-[#0b1311] backdrop-blur transition-colors hover:border-[#1e4137] hover:text-[#1e4137]"
                >
                  <CalendarCheck className="h-5 w-5" />
                  How it works
                </Link>
              </motion.div>

              {/* trust row */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.45 }}
                className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[
                      img('photo-1494790108377-be9c29b29330', 100),
                      img('photo-1507003211169-0a1dd7228f2d', 100),
                      img('photo-1438761681033-6461ffad8d80', 100),
                    ].map((src) => (
                      <img key={src} src={src} alt="Happy customer" className="h-9 w-9 rounded-full border-2 border-[#fff7f0] object-cover" loading="lazy" />
                    ))}
                  </div>
                  <div className="text-sm leading-tight">
                    <div className="flex items-center gap-1 font-bold text-[#0b1311]">
                      <Star className="h-4 w-4 fill-[#1e4137] text-[#1e4137]" /> 4.9/5
                    </div>
                    <p className="text-[#0b1311]/60">from 3,200+ reviews</p>
                  </div>
                </div>
                <div className="hidden h-10 w-px bg-[#0b1311]/10 sm:block" />
                <div className="flex items-center gap-2 text-sm font-medium text-[#0b1311]/70">
                  <BadgeCheck className="h-5 w-5 text-[#1e4137]" />
                  Verified vendors only
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-[#0b1311]/70">
                  <MapPin className="h-5 w-5 text-[#1e4137]" />
                  Mumbai • Delhi • Bengaluru + 37 more
                </div>
              </motion.div>

              {/* stats */}
              <motion.dl
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.55 }}
                className="mt-10 grid max-w-lg grid-cols-3 gap-4"
              >
                {HERO_STATS.map((s) => (
                  <div key={s.label} className="r-card border border-[#1e4137]/10 bg-white/80 px-4 py-4 text-center shadow-sm backdrop-blur">
                    <dt className="order-2 mt-1 block text-[13px] font-medium text-[#0b1311]/60">{s.label}</dt>
                    <dd className="text-[clamp(1.5rem,2vw,2rem)] font-black text-[#1e4137]">{s.value}</dd>
                  </div>
                ))}
              </motion.dl>
            </div>

            {/* Visual collage */}
            <div className="relative lg:col-span-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.25 }}
                className="r-card relative overflow-hidden shadow-2xl"
              >
                <img
                  src={HERO_IMG_MAIN}
                  alt="Decorated celebration table with flowers and lights"
                  className="aspect-[4/3] w-full object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1311]/45 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-center gap-2.5">
                  {['Verified Decorator', 'Udaipur • 4.9 ★', '₹85k onwards'].map((t) => (
                    <span key={t} className="rounded-full bg-white/95 px-4 py-2 text-[13px] font-semibold text-[#0b1311] shadow backdrop-blur">
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* floating cards */}
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="absolute -left-4 top-8 hidden w-52 rotate-[-4deg] overflow-hidden rounded-[var(--jak-border-radius)] border border-black/5 bg-white shadow-xl sm:block lg:-left-10"
              >
                <img src={HERO_IMG_TOP} alt="Wedding celebration" className="h-32 w-full object-cover" loading="eager" />
                <p className="px-4 py-3 text-[13px] font-semibold text-[#0b1311]">Aarav & Diya • Udaipur <span className="block font-normal text-[#0b1311]/60">Photography + Decor booked</span></p>
              </motion.div>

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-6 right-4 w-60 rotate-[3deg] overflow-hidden rounded-[var(--jak-border-radius)] border border-black/5 bg-white shadow-xl lg:right-8"
              >
                <img src={HERO_IMG_BOTTOM} alt="Concert crowd with lights" className="h-28 w-full object-cover" loading="eager" />
                <p className="px-4 py-3 text-[13px] font-semibold text-[#0b1311]">Sunburn Arena Night <span className="block font-normal text-[#0b1311]/60">Sound • Lights • Staging</span></p>
              </motion.div>

              {/* rotating badge */}
              <div aria-hidden className="absolute -top-8 right-6 hidden h-28 w-28 lg:block lg:h-[140px] lg:w-[140px]">
                <svg viewBox="0 0 100 100" className="h-full w-full text-[#0b1311]" style={{ animation: 'scroll-text-rotate 16s linear infinite' }}>
                  <defs>
                    <path id="circlePath" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
                  </defs>
                  <text className="fill-current text-[8.5px] font-semibold uppercase tracking-[0.18em]">
                    <textPath href="#circlePath">plan your event • plan your event •</textPath>
                  </text>
                </svg>
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-[55%] w-[55%] items-center justify-center rounded-full bg-[#1e4137] text-[#bad6ff]">
                    <ArrowRight className="h-5 w-5 rotate-90" />
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* trusted strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-[#0b1311]/10 pt-6 text-sm font-semibold uppercase tracking-[0.14em] text-[#0b1311]/45"
          >
            <span className="tracking-normal normal-case text-[#0b1311]/50 font-medium">Hosts book us for</span>
            {TRUSTED_CATEGORIES.map((c) => (
              <span key={c}>{c}</span>
            ))}
          </motion.div>
        </div>
      </header>

      {/* ============ STATEMENT — marketplace promise ============ */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center lg:py-28">
        <Pretitle>Why FestivLink</Pretitle>
        <motion.p
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-[clamp(1.35rem,1rem+1.1vw,2.3rem)] font-light leading-[1.55] text-[#0b1311]"
        >
          Planning a wedding, offsite or festival shouldn&apos;t mean 40 phone calls.
          Tell us your date, city and budget — we match you with verified vendors,
          transparent pricing and one booking thread. You celebrate, we coordinate.
        </motion.p>
        <motion.div
          variants={reveal}
          custom={0.15}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-10"
        >
          <StudioButton to="/join">Start your event</StudioButton>
        </motion.div>
      </section>

      {/* ============ CASES ============ */}
      <section className="mx-auto max-w-[100rem] px-6 pb-24 lg:px-10 lg:pb-32">
        <div className="mb-12 text-center">
          <Pretitle>Celebrations</Pretitle>
          <motion.h2
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mx-auto max-w-3xl text-[clamp(28px,3.33vw,64px)] font-semibold leading-[1.1] text-[#0b1311]"
          >
            Real celebrations, booked through FestivLink
          </motion.h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[#0b1311]/60">
            Weddings in Udaipur, summits in Bengaluru, arena nights in Mumbai — every story below started with one search.
          </p>
        </div>

        <div className="columns-1 gap-8 md:columns-2 [&>*]:mb-8">
          {CASES.map((c, i) => (
            <motion.article
              key={c.title}
              variants={reveal}
              custom={(i % 3) * 0.08}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="group break-inside-avoid"
            >
              <Link to="/join" className="block">
                <div className="r-card overflow-hidden">
                  <img
                    src={c.image}
                    alt={c.title}
                    loading="lazy"
                    className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <h3 className="mt-6 text-[clamp(18px,1.66vw,32px)] font-semibold text-[#0b1311]">
                  {c.title}
                </h3>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  <Tag>{c.sector}</Tag>
                  {c.services.map((s) => (
                    <Tag key={s}>{s}</Tag>
                  ))}
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        <div className="mt-6 text-center">
          <StudioButton to="/signup">View all celebrations</StudioButton>
        </div>
      </section>

      {/* ============ SCROLL TITLES + SERVICES ============ */}
      <section className="bg-[#f4f4f2]/60 py-24 lg:py-32">
        <div className="mx-auto max-w-[100rem] px-6 lg:px-10">
          <motion.h2
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-[clamp(32px,5.2vw,100px)] font-semibold leading-[1.1] text-[#0b1311]"
          >
            From first idea,
          </motion.h2>
          <div className="my-10 flex items-center gap-6">
            <img
              src={img('photo-1511795409834-ef04bbd61622', 400)}
              alt="Planner at work"
              loading="lazy"
              className="r-card h-20 w-32 -rotate-3 object-cover"
            />
            <img
              src={img('photo-1552664730-d307ca884978', 400)}
              alt="Planning together"
              loading="lazy"
              className="r-card h-20 w-32 object-cover"
            />
          </div>
          <motion.h2
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-right text-[clamp(32px,5.2vw,100px)] font-semibold leading-[1.1] text-[#0b1311]"
          >
            to booked vendor.
          </motion.h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#0b1311]/60 lg:ml-auto lg:text-right">
            Five core crafts, hundreds of verified pros. Browse portfolios, compare honest pricing, request dates — all in your dashboard.
          </p>

          <div className="mt-20 space-y-20">
            {SERVICES.map((s, i) => (
              <motion.div
                key={s.title}
                variants={reveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16"
              >
                <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="r-card overflow-hidden shadow-lg">
                    <img
                      src={s.image}
                      alt={s.title}
                      loading="lazy"
                      className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                </div>
                <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
                  <h3 className="text-[clamp(24px,2.5vw,48px)] font-semibold leading-[1.1] text-[#0b1311]">
                    {s.title}
                  </h3>
                  <p className="mt-4 text-[clamp(18px,1.35vw,26px)] font-normal leading-[1.6] text-[#0b1311]">
                    {s.text}
                  </p>
                  <div className="mt-4">
                    <TextLink to="/signup">More about this</TextLink>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2.5">
                    {s.tags.map((t) => (
                      <Tag key={t}>{t}</Tag>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ ABOUT + APPROACH ============ */}
      <section className="mx-auto max-w-[100rem] px-6 py-24 lg:px-10 lg:py-32">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
          <motion.img
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            src={img('photo-1522071820081-009f0129c71c', 800)}
            alt="FestivLink team at work"
            loading="lazy"
            className="r-card aspect-[4/3] w-full object-cover shadow-lg"
          />
          <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <Pretitle>About</Pretitle>
            <h2 className="text-[clamp(28px,3.33vw,64px)] font-semibold leading-[1.1]">Who we are</h2>
            <p className="mt-5 text-[clamp(18px,1.35vw,26px)] font-normal leading-[1.6]">
              We are FestivLink, and we learned our craft across hundreds of weddings,
              summits and festivals — for hosts who expect agency-level polish without
              agency-level chaos. The same bar we set for the biggest stages, we now set
              for every host who understands that event management is more than a
              checklist: no half work, every decision counts.
            </p>
            <div className="mt-8">
              <StudioButton to="/about">Read our story</StudioButton>
            </div>
          </motion.div>
        </div>

        <div className="mt-24 grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:order-1"
          >
            <Pretitle>Approach</Pretitle>
            <h2 className="text-[clamp(28px,3.33vw,64px)] font-semibold leading-[1.1]">How we work</h2>
            <p className="mt-5 text-[clamp(18px,1.35vw,26px)] font-normal leading-[1.6]">
              We don’t work for you, we work with you. We design a thought-through
              proposal and take you along in our thinking. No colour here and line there.
              The whole thing has to ring true — from first call to final farewell.
            </p>
            <div className="mt-8">
              <StudioButton to="/about">Discover our approach</StudioButton>
            </div>
          </motion.div>
          <motion.img
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            src={img('photo-1552664730-d307ca884978', 800)}
            alt="Planning session"
            loading="lazy"
            className="r-card aspect-[4/3] w-full object-cover shadow-lg lg:order-2"
          />
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="mx-auto max-w-[100rem] px-6 pb-24 lg:px-10 lg:pb-32">
        <div className="mb-12 text-center">
          <Pretitle>Kind words</Pretitle>
          <h2 className="mx-auto max-w-3xl text-[clamp(28px,3.33vw,64px)] font-semibold leading-[1.1]">
            We could tell you everything here, but our hosts say it better
          </h2>
        </div>

        <div className="mx-auto max-w-4xl">
          <motion.figure
            key={quoteIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="r-card border border-[#1e4137] bg-white p-10 lg:p-14"
          >
            <blockquote className="text-[clamp(18px,1.35vw,26px)] font-normal leading-[1.6]">
              “{quote.quote}”
            </blockquote>
            <figcaption className="mt-8">
              <p className="font-semibold">{quote.name}</p>
              <p className="text-[#0b1311]/60">{quote.context}</p>
            </figcaption>
          </motion.figure>

          <div className="mt-8 flex items-center justify-center gap-6">
            <button
              type="button"
              onClick={prevQuote}
              aria-label="Previous testimonial"
              className="flex h-[68px] w-[68px] rotate-180 items-center justify-center rounded-full bg-[#1e4137] text-[#bad6ff] transition-transform hover:scale-105"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-3">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setQuoteIndex(i)}
                  aria-label={`Show testimonial ${i + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    i === quoteIndex ? 'w-8 bg-[#1e4137]' : 'w-2.5 bg-[#0b1311]/20 hover:bg-[#0b1311]/40'
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={nextQuote}
              aria-label="Next testimonial"
              className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-[#1e4137] text-[#bad6ff] transition-transform hover:scale-105"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* ============ VENDOR WALL ============ */}
      <section className="mx-auto max-w-[100rem] px-6 pb-24 lg:px-10 lg:pb-32">
        <div className="text-center">
          <Pretitle>Vendors</Pretitle>
          <h2 className="mx-auto max-w-3xl text-[clamp(28px,3.33vw,64px)] font-semibold leading-[1.1]">
            Proud to work with these crafts
          </h2>
        </div>
        <div className="mt-12 flex flex-wrap justify-center gap-2.5">
          {VENDOR_WALL.map((v) => (
            <span
              key={v}
              className="rounded-full border border-[#0b1311]/20 bg-transparent px-5 py-2.5 text-[15px] text-[#0b1311] transition-colors hover:border-[#1e4137] hover:bg-white"
            >
              {v}
            </span>
          ))}
        </div>
      </section>

      {/* ============ INSIGHTS ============ */}
      <section className="mx-auto max-w-[100rem] px-6 pb-24 lg:px-10 lg:pb-32">
        <div className="mb-12 text-center">
          <Pretitle>Insights</Pretitle>
          <h2 className="mx-auto max-w-3xl text-[clamp(28px,3.33vw,64px)] font-semibold leading-[1.1]">
            How we look at celebrations
          </h2>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {INSIGHTS.map((a, i) => (
            <motion.article
              key={a.title}
              variants={reveal}
              custom={i * 0.1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="group flex flex-col overflow-hidden rounded-[var(--jak-border-radius)] bg-white shadow-sm transition-shadow hover:shadow-xl"
            >
              <div className="overflow-hidden">
                <img
                  src={a.image}
                  alt={a.title}
                  loading="lazy"
                  className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-8">
                <h3 className="text-[clamp(18px,1.66vw,32px)] font-semibold leading-[1.2]">
                  {a.title}
                </h3>
                <p className="mt-3 leading-[1.6] text-[#0b1311]/70">{a.text}</p>
                <div className="mt-auto pt-6">
                  <TextLink to="/about">More about this</TextLink>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="mx-auto max-w-[100rem] px-6 pb-24 lg:px-10 lg:pb-32">
        <div className="grid items-center gap-10 overflow-hidden rounded-[var(--jak-border-radius)] bg-white p-8 lg:grid-cols-2 lg:p-14">
          <div className="r-card overflow-hidden">
            <img
              src={img('photo-1514525253161-7a46d19cd819', 900)}
              alt="Celebration lights"
              loading="lazy"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-[clamp(28px,3.33vw,64px)] font-semibold leading-[1.1]">
              Ready to meet your vendor?
            </h2>
            <p className="mt-5 text-[clamp(18px,1.35vw,26px)] font-normal leading-[1.6]">
              Create a free account, tell us your date and city, and get matched in
              minutes. No brokerage, no spam — just confirmed bookings.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <StudioButton to="/join">Plan a chat</StudioButton>
            </div>
            <p className="mt-4 text-sm text-[#0b1311]/60">Free to join • 30-day trial for new hosts • Cancel anytime</p>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="bg-[#1e4137] text-[#fff7f0]">
        {/* cream curve into the green, like theirs */}
        <div aria-hidden className="h-[clamp(2.5rem,2.3rem+0.6vw,3.125rem)] rounded-b-[clamp(1.25rem,1rem+0.6vw,1.875rem)] bg-[#fff7f0]" />
        <div className="mx-auto max-w-[100rem] px-6 pb-10 pt-14 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="text-[32px] font-black leading-none tracking-tight">FESTIVLINK</p>
              <p className="mt-5 max-w-xs leading-[1.6] text-white/70">
                Event management for hosts with a vision. Photography, catering, music,
                decor, production — five services, one vision.
              </p>
              <div className="mt-6 flex items-center gap-5">
                {[
                  { icon: Instagram, label: 'Instagram' },
                  { icon: Linkedin, label: 'LinkedIn' },
                  { icon: Facebook, label: 'Facebook' },
                ].map(({ icon: Icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
                    className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-[#fff7f0] text-[#1e4137] transition-colors hover:bg-[#bad6ff]"
                  >
                    <Icon className="h-6 w-6" />
                  </a>
                ))}
              </div>
            </div>
            <nav aria-label="Footer" className="lg:col-span-2">
              <ul className="flex flex-col gap-4">
                {[
                  ['Celebrations', '/signup'],
                  ['Services', '/signup'],
                  ['Approach', '/about'],
                  ['About', '/about'],
                  ['FAQ', '/faq'],
                  ['Contact', '/join'],
                ].map(([label, to]) => (
                  <li key={label}>
                    <Link to={to} className="text-white/80 transition-colors hover:text-white">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="lg:col-span-3">
              <ul className="flex flex-col gap-4 text-white/80">
                {['Photography', 'Catering', 'DJ & Music', 'Decor & Florals', 'Lighting & Production'].map(
                  (s) => (
                    <li key={s}>{s}</li>
                  )
                )}
              </ul>
            </div>
            <div className="flex flex-col gap-7 lg:col-span-3">
              <div className="space-y-2 text-white/80">
                <p>hello@festivlink.com</p>
                <p>+91 98765 43210</p>
                <p>Mumbai • Global</p>
              </div>
              <div className="mt-auto">
                <StudioButton to="/join" variant="beige">
                  Start your event
                </StudioButton>
              </div>
            </div>
          </div>
          <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-8 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} FestivLink. All rights reserved.</p>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              <Link to="/about" className="hover:text-white">Privacy & Cookies</Link>
              <Link to="/about" className="hover:text-white">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
