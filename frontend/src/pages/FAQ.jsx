import { motion } from 'framer-motion'
import StudioButton from '../components/ui/StudioButton'

const faqs = [
  {
    q: 'Is it free to hire professionals?',
    a: 'Completely free for customers. Browse unlimited portfolios, compare pricing, message vendors directly. Professionals pay success fees only on confirmed bookings.'
  },
  {
    q: 'How do I join as a vendor?',
    a: 'Click "Join as Professional" → Complete your profile → Upload portfolio → Set availability & rates → Start receiving qualified inquiries immediately.'
  },
  {
    q: 'Are payments secure?',
    a: '100% secure. Industry-leading encryption, payments held in escrow, released only after your confirmation. Zero risk guaranteed.'
  },
  {
    q: 'What cities are covered?',
    a: '125+ cities worldwide. Major hubs like Mumbai, Delhi, NYC, London, Dubai + thousands of Tier 2/3 locations. Expanding daily.'
  },
  {
    q: 'Do you offer support?',
    a: '24/7 priority support for all users. Dedicated account managers for premium professionals. Live chat, email, phone available.'
  },
  {
    q: 'How fast are bookings?',
    a: '95% of inquiries receive responses within 4 hours. Instant messaging + verified availability calendars ensure rapid coordination.'
  }
]

const FAQ = () => (
  <motion.section 
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    className="pt-28 lg:pt-36 pb-24 lg:pb-32 bg-white min-h-screen"
  >
    <div className="max-w-5xl mx-auto px-8 lg:px-20">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-24 lg:mb-36"
      >
        <h2 className="text-[clamp(32px,5.2vw,100px)] font-semibold leading-[1.1] text-[#1e4137] mb-8">
          Questions?
        </h2>
        <p className="text-2xl lg:text-3xl xl:text-4xl font-light text-[#0b1311]/70 max-w-4xl mx-auto leading-[1.6] backdrop-blur-xl">
          Everything you need to know before joining thousands of successful events
        </p>
      </motion.div>

      {/* FAQ Items */}
      <div className="space-y-8 lg:spac
e-y-10">
        {faqs.map((faq, index) => (
          <motion.div 
            key={index}
            className="group bg-white rounded-[var(--jak-border-radius)] p-8 lg:p-10 border border-black/5 hover:border-[#1e4137]/40 hover:shadow-xl transition-all duration-500 overflow-hidden relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.05 }}
            whileHover={{ scale: 1.01 }}
          >
            {/* Glow Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#1e4137]/[.07] to-[#bad6ff]/20 opacity-0 group-hover:opacity-100 blur-xl rounded-[var(--jak-border-radius)] transition-all duration-700" />
            
            {/* Question */}
            <motion.h3 
              className="text-xl lg:text-2xl font-semibold mb-4 text-gray-900 relative z-10"
              whileHover={{ x: 8 }}
            >
              {faq.q}
            </motion.h3>
            
            {/* Answer */}
            <motion.p 
              className="text-base lg:text-lg text-gray-600 leading-relaxed font-light relative z-10 max-w-4xl"
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
            >
              {faq.a}
            </motion.p>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-center mt-32 lg:mt-48"
      >
        <StudioButton to="/join">
          Still Have Questions?
        </StudioButton>
        <p className="mt-12 text-xl lg:text-2xl text-[#0b1311]/50 font-light">
          Our support team responds within 2 hours • 24/7
        </p>
      </motion.div>
    </div>
  </motion.section>
)

export default FAQ
