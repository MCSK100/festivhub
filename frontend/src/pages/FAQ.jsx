import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Plus, MessageCircleQuestion, ArrowRight } from 'lucide-react'
import SEO from '../components/common/SEO'
import StudioButton from '../components/ui/StudioButton'

const FAQS = [
  {
    q: 'Do I need an account to book a vendor?',
    a: 'No. Browsing vendors and sending a booking enquiry is completely free and needs no account. Only vendors sign in — to manage their listings, portfolio and incoming enquiries.',
  },
  {
    q: 'How do I book a vendor?',
    a: 'Find a vendor you like, open their profile and hit "Send Booking Request". Fill in your event date, location and details — the enquiry goes straight to the vendor, who contacts you directly to confirm.',
  },
  {
    q: 'Are the vendors verified?',
    a: 'Yes. Every vendor profile is reviewed before going live, and listings show real portfolios, ratings and reviews from past hosts so you can compare with confidence.',
  },
  {
    q: 'Does FestivLink charge a brokerage or commission to hosts?',
    a: 'No. Hosts browse and enquire for free. The price you see is the vendor\'s own pricing — there is no middleman markup added on top.',
  },
  {
    q: 'How do I join as a vendor?',
    a: 'Click "Become a Vendor", create your account with email (or Google), complete your profile, upload a cover photo and portfolio, add your services and pricing — then you start receiving direct enquiries.',
  },
  {
    q: 'I forgot my password. How do I reset it?',
    a: 'Go to the vendor login page and click "Forgot Password". You\'ll get a reset link by email that expires in 1 hour. If it doesn\'t arrive, check spam or request a fresh link.',
  },
  {
    q: 'How do vendors receive enquiries?',
    a: 'Enquiries land instantly in the vendor dashboard under Enquiries, with the host\'s event type, date, location and contact details. Vendors can accept, confirm or decline from there.',
  },
  {
    q: 'Which cities do you serve?',
    a: 'Vendors are listed across India — including Coimbatore, Chennai, Bengaluru, Mumbai, Delhi, Hyderabad and more. Use the location search to find pros near your venue.',
  },
]

function Item({ faq, open, onToggle }) {
  return (
    <div className={`glass-ios overflow-hidden rounded-[24px] transition-all ${open ? 'ring-2 ring-[#1e4137]/20' : ''}`}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="text-[16px] font-bold tracking-tight">{faq.q}</span>
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${open ? 'rotate-45 bg-[#1e4137] text-white' : 'bg-[#0b1311]/6 text-[#0b1311]'}`}>
          <Plus className="h-4 w-4" />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <p className="px-6 pb-6 text-[15px] leading-relaxed text-[#0b1311]/65">{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQ() {
  const [open, setOpen] = useState(0)
  return (
    <div className="relative overflow-hidden bg-[#fff7f0] text-[#0b1311]">
      <SEO
        title="Frequently Asked Questions"
        description="How FestivLink works: booking vendors, verification, pricing, vendor sign-up and password help — answered."
        path="/faq"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: FAQS.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[480px] w-[480px] rounded-full bg-[#bad6ff]/35 blur-[120px]" />
        <div className="absolute -right-48 top-40 h-[520px] w-[520px] rounded-full bg-[#f3d9c8]/55 blur-[130px]" />
      </div>

      <section className="relative mx-auto max-w-3xl px-4 pb-16 pt-28 sm:px-6 lg:pt-36">
        <div className="text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#1e4137]/12 bg-white/85 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#1e4137] shadow-sm backdrop-blur">
            <MessageCircleQuestion className="h-3.5 w-3.5" /> Help center
          </p>
          <h1 className="mt-5 text-4xl font-bold tracking-[-0.02em] sm:text-5xl">Questions, answered.</h1>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-[#0b1311]/60 sm:text-base">
            Everything hosts and vendors ask us before their first booking.
          </p>
        </div>

        <div className="mt-10 space-y-3">
          {FAQS.map((f, i) => (
            <Item key={f.q} faq={f} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 text-center">
          <StudioButton to="/vendors">
            Browse vendors <ArrowRight className="h-4 w-4" />
          </StudioButton>
          <p className="text-sm text-[#0b1311]/55">
            Still stuck? Write to <span className="font-bold text-[#0b1311]">hello@festivlink.com</span> — or{' '}
            <Link to="/vendor/register" className="font-semibold text-[#1e4137] underline underline-offset-4">
              join as a vendor
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  )
}
