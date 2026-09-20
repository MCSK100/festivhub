import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Instagram, Linkedin, Facebook } from 'lucide-react'
import StudioButton from '../components/ui/StudioButton'

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
      {/* ============ HERO / BANNER ============ */}
      <header className="relative overflow-hidden pt-44 lg:pt-56">
        {/* pastel blobs */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 top-10 h-[480px] w-[480px] rounded-full bg-[#C2D5F1]/50 blur-3xl" />
          <div className="absolute right-[-160px] top-64 h-[560px] w-[560px] rounded-full bg-[#F3D9C8]/60 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-[100rem] px-6 lg:px-10">
          <h1 className="sr-only">FestivLink</h1>
          {/* giant wordmark, slides in from both sides like theirs */}
          <div aria-hidden className="relative z-[6] select-none">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="text-[62%] font-black leading-[0.85] tracking-tight text-[#1e4137]"
              style={{ fontSize: 'clamp(3rem, 12vw, 10rem)' }}
            >
              FESTIV
            </motion.div>
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="ml-[21.5%] text-right font-black leading-[0.85] tracking-tight text-[#1e4137] lg:ml-[40%]"
              style={{ fontSize: 'clamp(3rem, 12vw, 10rem)' }}
            >
              LINK
            </motion.div>
          </div>

          <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-end">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="lg:col-span-2 lg:col-start-9"
            >
              <img
                src={HERO_IMG_TOP}
                alt="Wedding celebration"
                className="r-card h-44 w-full object-cover shadow-xl lg:h-52"
                loading="eager"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.55 }}
              className="lg:col-span-5 lg:col-start-2"
            >
              <img
                src={HERO_IMG_BOTTOM}
                alt="Concert crowd with lights"
                className="r-card h-52 w-full object-cover shadow-xl lg:h-64"
                loading="eager"
              />
            </motion.div>

            <div className="flex items-end justify-between gap-6 lg:col-span-4">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="max-w-xs text-balance text-lg font-medium leading-snug text-[#0b1311]"
              >
                Event management for hosts with a vision
              </motion.p>
              {/* rotating scroll badge */}
              <div aria-hidden className="relative hidden h-28 w-28 shrink-0 sm:block lg:h-[165px] lg:w-[165px]">
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
        </div>
      </header>

      {/* ============ STATEMENT ============ */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center lg:py-32">
        <motion.p
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-[clamp(1.25rem,1rem+1vw,2.25rem)] font-light leading-[1.6] text-[#0b1311]"
        >
          We plan celebrations that add an extra layer to life. Photography, catering,
          music, decor, production: five services, one vision. What we make together
          gets a place in the world one day. Let’s make it more beautiful.
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
            From a first idea
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
              Ready to give your celebration a place in the world?
            </h2>
            <p className="mt-5 text-[clamp(18px,1.35vw,26px)] font-normal leading-[1.6]">
              Let’s sit together once. Tell us what you have in mind — we’ll both feel
              quickly whether it clicks.
            </p>
            <div className="mt-8">
              <StudioButton to="/join">Plan a chat</StudioButton>
            </div>
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
