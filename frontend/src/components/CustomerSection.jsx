import { motion } from 'framer-motion'

const customerFeatures = [
  {
    icon: '⭐',
    title: 'Curated Excellence',
    description: 'Only verified professionals with real portfolios and client reviews'
  },
  {
    icon: '💰',
    title: 'Transparent Pricing',
    description: 'Compare packages upfront. No hidden fees or surprises'
  },
  {
    icon: '🛡️',
    title: 'Secure Booking',
    description: 'Payments held until you confirm satisfaction. 100% protected'
  },
  {
    icon: '📱',
    title: 'Instant Contact',
    description: 'Direct messaging with vendors. Real-time availability'
  }
]

const CustomerSection = () => (
  <motion.section 
    initial={{ opacity: 0, y: 60 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8 }}
    className="py-32 lg:py-48 bg-gradient-to-b from-white to-gray-50 border-y border-gray-100 relative overflow-hidden"
  >
    <div className="max-w-7xl mx-auto px-8 lg:px-20 relative z-10">
      {/* Header */}
      <motion.div className="text-center mb-20 lg:mb-32">
        <motion.h2 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl lg:text-8xl xl:text-9xl font-serif font-light italic bg-gradient-to-r from-sky-400 via-sky-300 to-sky-500 bg-clip-text text-transparent mb-8 leading-none shadow-lg"
        >
          Hire Trusted<br />Professionals
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-2xl lg:text-3xl font-light text-slate-600/90 max-w-4xl mx-auto leading-relaxed"
        >
          Browse portfolios, compare experts, book with confidence. Your perfect event team in one place.
        </motion.p>
      </motion.div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
        {customerFeatures.map((feature, index) => (
          <motion.div 
            key={feature.title}
            className="group text-center p-10 lg:p-12 bg-white/70 backdrop-blur-xl rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-4 transition-all duration-700 border border-gray-200 hover:border-sky-300"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.08 }}
            whileHover={{ scale: 1.03 }}
          >
            {/* Icon */}
            <motion.div 
              className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-sky-400 to-sky-500 flex items-center justify-center shadow-lg group-hover:rotate-6 group-hover:scale-110 transition-all duration-700"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2 + index, repeat: Infinity }}
            >
              <span className="text-4xl lg:text-5xl drop-shadow-2xl">{feature.icon}</span>
            </motion.div>
            
            {/* Content */}
            <h3 className="text-3xl lg:text-4xl font-serif font-light mb-6 text-slate-900 group-hover:text-sky-500 transition-colors duration-700 leading-tight">
              {feature.title}
            </h3>
            <p className="text-xl text-slate-600 leading-relaxed max-w-md mx-auto group-hover:text-slate-700 transition-colors">
              {feature.description}
            </p>
            
            {/* Hover Glow */}
            <motion.div 
              className="absolute inset-0 -inset-1 rounded-3xl bg-gradient-to-r from-sky-400/20 to-sky-500/20 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-700"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </motion.div>
        ))}
      </div>

      {/* Bottom CTA */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="text-center mt-24 lg:mt-36"
      >
        <motion.button 
          whileHover={{ scale: 1.08, y: -6 }}
          className="bg-gradient-to-r from-sky-500 to-sky-400 hover:from-sky-600 hover:to-sky-500 px-16 lg:px-24 py-8 lg:py-10 text-2xl lg:text-3xl xl:text-4xl shadow-lg hover:shadow-xl font-light tracking-wide rounded-3xl text-white"
        >
          Browse Professionals Now
        </motion.button>
      </motion.div>
    </div>
  </motion.section>
)

export default CustomerSection

