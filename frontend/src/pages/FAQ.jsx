import { motion } from 'framer-motion'

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
        <h2 className="text-5xl lg:text-7xl font-serif font-light italic gradient-gold mb-8 leading-tight">
          Questions?
        </h2>
        <p className="text-2xl lg:text-3xl xl:text-4xl font-light text-slate-700 max-w-4xl mx-auto leading-[1.6] backdrop-blur-xl">
          Everything you need to know before joining thousands of successful events
        </p>
      </motion.div>

      {/* FAQ Items */}
      <div className="space-y-8 lg:spac
e-y-10">
        {faqs.map((faq, index) => (
          <motion.div 
            key={index}
            className="group glass-card rounded-3xl p-8 lg:p-10 border border-black/5 hover:border-yellow-500/40 hover:shadow-xl transition-all duration-500 overflow-hidden relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.05 }}
            whileHover={{ scale: 1.01 }}
          >
            {/* Glow Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/8 to-blue-500/8 opacity-0 group-hover:opacity-100 blur-xl rounded-[3rem] transition-all duration-700" />
            
            {/* Question */}
            <motion.h3 
              className="text-xl lg:text-2xl font-serif font-bold mb-4 text-gray-900 relative z-10"
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
        <motion.button 
          whileHover={{ scale: 1.04, y: -4 }}
          className="btn-primary px-10 lg:px-14 py-5 lg:py-6 text-xl lg:text-2xl font-semibold"
        >
          Still Have Questions?
        </motion.button>
        <p className="mt-12 text-xl lg:text-2xl text-slate-400 font-light">
          Our support team responds within 2 hours • 24/7
        </p>
      </motion.div>
    </div>
  </motion.section>
)

export default FAQ
