import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Quote } from 'lucide-react'

/* ------------------------------------------------------------------ */
/* Data — FestivLink mapped onto the Studio Modular structure          */
/* ------------------------------------------------------------------ */

const img = (id, w = 900) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`

const HERO_IMG_TOP = img('photo-1519741497674-611481863552', 500) // wedding
const HERO_IMG_BOTTOM = img('photo-1470229722913-7c0e2dbbafd3', 800) // concert

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
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */

const reveal = {
  hidden: { opacity: 0, y: 36 },
  visible: (d = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: 'easeOut', delay: d },
  }),
}

const Pretitle = ({ children }) => (
  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#1e4137]/70 mb-4">
    {children}
  </p>
)

const PillButton = ({ to, children, dark = false }) => (
  <Link
    to={to}
    className={`group inline-flex items-center gap-3 rounded-full pl-2 pr-7 py-2 text-sm font-semibold transition-all duration-300 ${
      dark
        ? 'bg-[#1e4137] text-[#FFF9F2] hover:bg-[#142e27]'
        : 'bg-[#1e4137] text-[#FFF9F2] hover:bg-[#142e27]'
    }`}
  >
    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C9A96A] text-[#1e4137] transition-transform duration-300 group-hover:rotate-45">
      <ArrowUpRight className="h-5 w-5" />
    </span>
    {children}
  </Link>
)

const Tag = ({ children }) => (
  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#1e4137]/15 bg-white/60 px-3 py-1 text-xs font-medium text-[#1e4137]">
    <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#C9A96A]" />
    {children}
  </span>
)

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const LandingPage = () => {
  const [quoteIndex, setQuoteIndex] = useState(0)
  const quote = TESTIMONIALS[quoteIndex]

  return (
    <div className="bg-[#FFF9F2] text-[#14201c] antialiased">
      {/* ============ HERO ============ */}
      <header className="relative overflow-hidden pt-28 lg:pt-36">
        {/* pastel blobs */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 top-10 h-[480px] w-[480px] rounded-full bg-[#C2D5F1]/50 blur-3xl" />
          <div className="absolute right-[-160px] top-64 h-[560px] w-[560px] rounded-full bg-[#F3D9C8]/60 blur-3xl" />
          <div className="absolute left-1/3 top-[480px] h-[380px] w-[380px] rounded-full bg-[#C9A96A]/20 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          {/* giant wordmark */}
          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="font-serif font-black leading-[0.85] tracking-tight text-[#1e4137]"
            style={{ fontSize: 'clamp(3.5rem, 13vw, 11rem)' }}
          >
            FESTIV
            <br />
            LINK
          </motion.h1>

          <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-end">
            {/* small top image */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="lg:col-span-2 lg:col-start-9"
            >
              <img
                src={HERO_IMG_TOP}
                alt="Wedding celebration"
                className="h-44 w-full rounded-2xl object-cover shadow-xl lg:h-52"
                loading="eager"
              />
            </motion.div>

            {/* wide bottom image */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="lg:col-span-5 lg:col-start-2"
            >
              <img
                src={HERO_IMG_BOTTOM}
                alt="Concert crowd with lights"
                className="h-52 w-full rounded-2xl object-cover shadow-xl lg:h-64"
                loading="eager"
              />
            </motion.div>

            {/* tagline + rotating badge */}
            <div className="flex items-end justify-between gap-6 lg:col-span-4">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.35 }}
                className="max-w-xs text-lg font-medium leading-snug text-[#1e4137]"
              >
                Event management for hosts with a vision
              </motion.p>
              <div aria-hidden className="relative hidden h-28 w-28 shrink-0 sm:block">
                <svg viewBox="0 0 100 100" className="h-full w-full animate-spin-slow text-[#1e4137]">
                  <defs>
                    <path id="circlePath" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
                  </defs>
                  <text className="fill-current text-[10px] font-semibold uppercase tracking-[0.2em]">
                    <textPath href="#circlePath">plan your event • plan your event •</textPath>
                  </text>
                </svg>
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#C9A96A] text-[#1e4137]">
                    <ArrowRight className="h-5 w-5" />
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ============ STATEMENT ============ */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center lg:py-32">
        <motion.p
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="font-serif text-2xl font-light leading-relaxed text-[#1e4137] lg:text-[2rem]"
        >
          I plan celebrations that add an extra layer to life. Photography, catering,
          music, decor, production: five services, one vision. What we make together
          gets a place in the world one day. Let’s make it more beautiful.
        </motion.p>
        <motion.div
          variants={reveal}
          custom={0.15}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-8"
        >
          <PillButton to="/join">Start your event</PillButton>
        </motion.div>
      </section>

      {/* ============ CASES ============ */}
      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-10 lg:pb-32">
        <div className="mb-12 text-center">
          <Pretitle>Celebrations</Pretitle>
          <motion.h2
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mx-auto max-w-2xl font-serif text-4xl font-light text-[#1e4137] lg:text-5xl"
          >
            Results for celebrations that ring true
          </motion.h2>
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
                <div className="overflow-hidden rounded-3xl">
                  <img
                    src={c.image}
                    alt={c.title}
                    loading="lazy"
                    className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <h3 className="mt-4 font-serif text-2xl font-semibold text-[#1e4137] transition-colors group-hover:text-[#C9A96A]">
                  {c.title}
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Tag>{c.sector}</Tag>
                  {c.services.map((s) => (
                    <Tag key={s}>{s}</Tag>
                  ))}
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        <div className="mt-4 text-center">
          <PillButton to="/signup">View all celebrations</PillButton>
        </div>
      </section>

      {/* ============ SCROLL TITLES + SERVICES ============ */}
      <section className="bg-[#F6EFE3]/60 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <motion.h2
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="font-serif text-5xl font-light italic text-[#1e4137]/90 lg:text-7xl"
          >
            From a first idea
          </motion.h2>
          <div className="my-10 flex items-center gap-6">
            <img
              src={img('photo-1511795409834-ef04bbd61622', 400)}
              alt="Planner at work"
              loading="lazy"
              className="h-20 w-32 rounded-xl object-cover"
            />
            <img
              src={img('photo-1552664730-d307ca884978', 400)}
              alt="Planning together"
              loading="lazy"
              className="h-20 w-32 rounded-xl object-cover"
            />
          </div>
          <motion.h2
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-right font-serif text-5xl font-light italic text-[#1e4137]/90 lg:text-7xl"
          >
            to celebration
          </motion.h2>

          <div className="mt-20 space-y-20">
            {SERVICES.map((s, i) => (
              <motion.div
                key={s.title}
                variants={reveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-16 ${
                  i % 2 === 1 ? '' : ''
                }`}
              >
                <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="overflow-hidden rounded-3xl shadow-lg">
                    <img
                      src={s.image}
                      alt={s.title}
                      loading="lazy"
                      className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                </div>
                <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
                  <h3 className="font-serif text-3xl font-semibold text-[#1e4137] lg:text-4xl">
                    {s.title}
                  </h3>
                  <p className="mt-4 leading-relaxed text-[#14201c]/80">{s.text}</p>
                  <Link
                    to="/signup"
                    className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#1e4137] underline decoration-[#C9A96A] decoration-2 underline-offset-4 hover:text-[#C9A96A]"
                  >
                    More about this <ArrowRight className="h-4 w-4" />
                  </Link>
                  <div className="mt-4 flex flex-wrap gap-2">
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
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
          <motion.img
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            src={img('photo-1522071820081-009f0129c71c', 800)}
            alt="FestivLink team at work"
            loading="lazy"
            className="aspect-[4/3] w-full rounded-3xl object-cover shadow-lg"
          />
          <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <Pretitle>About</Pretitle>
            <h2 className="font-serif text-4xl font-light text-[#1e4137] lg:text-5xl">Who we are</h2>
            <p className="mt-5 leading-relaxed text-[#14201c]/80">
              We are FestivLink, and we learned our craft across hundreds of weddings,
              summits and festivals — for hosts who expect agency-level polish without
              agency-level chaos. The same bar we set for the biggest stages, we now set
              from our own studio for every host who understands that event management
              is more than a checklist: no half work, every decision counts.
            </p>
            <div className="mt-6">
              <PillButton to="/about">Read our story</PillButton>
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
            <h2 className="font-serif text-4xl font-light text-[#1e4137] lg:text-5xl">How we work</h2>
            <p className="mt-5 leading-relaxed text-[#14201c]/80">
              We don’t work for you, we work with you. We design a thought-through
              proposal and take you along in our thinking. No colour here and line there.
              The whole thing has to ring true — from first call to final farewell.
            </p>
            <div className="mt-6">
              <PillButton to="/about">Discover our approach</PillButton>
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
            className="aspect-[4/3] w-full rounded-3xl object-cover shadow-lg lg:order-2"
          />
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="bg-[#1e4137] py-24 text-[#FFF9F2] lg:py-32">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <Pretitle>
            <span className="text-[#C9A96A]">Kind words</span>
          </Pretitle>
          <h2 className="font-serif text-3xl font-light lg:text-4xl">
            We could tell you everything here, but our hosts say it better
          </h2>
          <Quote className="mx-auto mt-10 h-10 w-10 text-[#C9A96A]" />
          <motion.blockquote
            key={quoteIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-6 font-serif text-xl font-light italic leading-relaxed lg:text-2xl"
          >
            “{quote.quote}”
          </motion.blockquote>
          <p className="mt-6 font-semibold">{quote.name}</p>
          <p className="text-sm text-white/60">{quote.context}</p>
          <div className="mt-8 flex items-center justify-center gap-3">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setQuoteIndex(i)}
                aria-label={`Show testimonial ${i + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i === quoteIndex ? 'w-8 bg-[#C9A96A]' : 'w-2.5 bg-white/30 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============ VENDOR WALL ============ */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <div className="text-center">
          <Pretitle>Vendors</Pretitle>
          <h2 className="mx-auto max-w-2xl font-serif text-4xl font-light text-[#1e4137] lg:text-5xl">
            Proud to work with these crafts
          </h2>
        </div>
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {VENDOR_WALL.map((v) => (
            <span
              key={v}
              className="rounded-full border border-[#1e4137]/15 bg-white px-5 py-2.5 text-sm font-medium text-[#1e4137] transition-colors hover:border-[#C9A96A] hover:bg-[#C9A96A]/10"
            >
              {v}
            </span>
          ))}
        </div>
      </section>

      {/* ============ INSIGHTS ============ */}
      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-10 lg:pb-32">
        <div className="mb-12 text-center">
          <Pretitle>Insights</Pretitle>
          <h2 className="mx-auto max-w-2xl font-serif text-4xl font-light text-[#1e4137] lg:text-5xl">
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
              className="group overflow-hidden rounded-3xl bg-white shadow-sm transition-shadow hover:shadow-xl"
            >
              <div className="overflow-hidden">
                <img
                  src={a.image}
                  alt={a.title}
                  loading="lazy"
                  className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="font-serif text-xl font-semibold leading-snug text-[#1e4137]">
                  {a.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#14201c]/70">{a.text}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#1e4137] underline decoration-[#C9A96A] decoration-2 underline-offset-4">
                  More about this <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-10 lg:pb-32">
        <div className="relative overflow-hidden rounded-[2.5rem]">
          <img
            src={img('photo-1514525253161-7a46d19cd819', 1400)}
            alt="Celebration lights"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[#1e4137]/70" />
          <div className="relative px-8 py-20 text-center text-[#FFF9F2] lg:py-28">
            <h2 className="mx-auto max-w-3xl font-serif text-4xl font-light leading-tight lg:text-6xl">
              Ready to give your celebration a place in the world?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-white/80">
              Let’s sit together once. Tell us what you have in mind — we’ll both feel
              quickly whether it clicks.
            </p>
            <div className="mt-8">
              <Link
                to="/join"
                className="group inline-flex items-center gap-3 rounded-full bg-[#FFF9F2] py-2 pl-2 pr-7 text-sm font-semibold text-[#1e4137] transition-all hover:bg-white"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C9A96A] text-[#1e4137] transition-transform duration-300 group-hover:rotate-45">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
                Plan a chat
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="bg-[#1e4137] text-[#FFF9F2]">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-4">
            <div>
              <p className="font-serif text-3xl font-black tracking-tight">FESTIVLINK</p>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
                Event management for hosts with a vision. Photography, catering, music,
                decor, production — five services, one vision.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C9A96A]">Explore</p>
              <ul className="mt-4 space-y-2.5 text-sm">
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
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C9A96A]">Services</p>
              <ul className="mt-4 space-y-2.5 text-sm text-white/80">
                {['Photography', 'Catering', 'DJ & Music', 'Decor & Florals', 'Lighting & Production'].map(
                  (s) => (
                    <li key={s}>{s}</li>
                  )
                )}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C9A96A]">Contact</p>
              <ul className="mt-4 space-y-2.5 text-sm text-white/80">
                <li>hello@festivlink.com</li>
                <li>+91 98765 43210</li>
                <li>Mumbai • Global</li>
              </ul>
              <div className="mt-6">
                <PillButton to="/join">Start your event</PillButton>
              </div>
            </div>
          </div>
          <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/50 sm:flex-row">
            <p>© {new Date().getFullYear()} FestivLink. All rights reserved.</p>
            <div className="flex gap-6">
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
