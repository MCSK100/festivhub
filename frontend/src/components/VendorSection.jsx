import { motion } from 'framer-motion'

const vendorCategories = [
  {
    title: 'Photographers',
    icon: '📸',
    stats: '2,500+ Active',
    bg: 'from-sky-400/10 to-sky-500/10',
    description: 'Capture moments that last forever'
  },
  {
    title: 'Caterers',
    icon: '🍽️',
    stats: '1,800+ Verified',
    bg: 'from-sky-500/10 to-sky-400/10',
    description: 'Elevate every occasion'
  },
  {
    title: 'Decorators',
    icon: '✨',
    stats: '3,200+ Portfolios',
    bg: 'from-sky-500/20 via-sky-400/10 to-sky-500/10',
    description: 'Transform spaces into magic'
  },
  {
    title: 'Event Planners',
    icon: '🎪',
    stats: '950+ Experts',
    bg: 'from-sky-400/10 to-sky-500/10',
    description: 'Stress-free perfection'
  }
]

const VendorSection = () => (
  <motion.section 
    initial={{ opacity: 0, y: 60 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8 }}
    className="py-32 lg:py-48 bg-gradient-to-b from-white to-gray-50 border-t border-gray-100"
  >
    <div className="max-w-7xl mx-auto px-8 lg:px-20">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-20 lg:mb-32"
      >
        <h2 className="text-6xl lg:text-8xl xl:text-9xl font-serif font-light italic bg-gradient-to-r from-sky-400 via-sky-300 to-sky-500 bg-clip-text text-transparent mb-8 leading-none shadow-lg">
          Showcase<br className="lg:hidden" /> Your Talent
        </h2>
        <p className="text-2xl lg:text-3xl font-light text-slate-600/90 max-w-4xl mx-auto leading-relaxed">
          Join 8,000+ professionals getting booked daily. Build your portfolio, 
          set your rates, connect directly with clients.
        </p>
      </motion.div>

      {/* Vendor Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
        {vendorCategories.map((vendor, index) => (
          <motion.div 
            key={vendor.title}
            className="group relative cursor-pointer"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            whileHover={{ 
              y: -20,
              scale: 1.05,
              transition: { duration: 0.4 }
            }}
          >
            <div className={`relative h-80 lg:h-96 rounded-4xl overflow-hidden bg-white/90 backdrop-blur-xl shadow-2xl hover:shadow-2xl border border-gray-200 hover:border-sky-400 transition-all duration-700 ${vendor.bg}`}>
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 via-transparent to-transparent" />
              
              {/* Icon */}
              <motion.div 
                className="absolute top-12 left-1/2 transform -translate-x-1/2 w-28 h-28 lg:w-32 lg:h-32 bg-gradient-to-br from-sky-400 to-sky-500 rounded-4xl flex items-center justify-center shadow-lg border-4 border-white/50 group-hover:scale-110 transition-all duration-700 z-20"
                animate={{ rotate: [0, 180] }}
                transition={{ duration: 4 + index, repeat: Infinity, ease: 'linear' }}
              >
                <motion.span 
                  className="text-4xl lg:text-5xl drop-shadow-2xl"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {vendor.icon}
                </motion.span>
              </motion.div>
              
              {/* Content */}
              <div className="absolute bottom-12 left-8 right-8 text-center">
                <h3 className="text-3xl lg:text-4xl font-serif font-light mb-4 text-slate-800 group-hover:text-sky-500 transition-all duration-700 leading-tight">
                  {vendor.title}
                </h3>
                <p className="text-lg text-slate-600/90 font-light mb-6">{vendor.description}</p>
                <div className="inline-flex items-center bg-sky-500/20 backdrop-blur-xl px-6 py-3 rounded-2xl border border-sky-400/50 text-sky-600 text-sm font-medium shadow-md">
                  {vendor.stats}
                </div>
              </div>
              
              {/* Hover Glow */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-sky-400/30 via-sky-500/20 to-sky-400/30 rounded-4xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-center mt-28 lg:mt-40"
      >
        <motion.button 
          whileHover={{ scale: 1.1, y: -8 }}
          className="bg-gradient-to-r from-sky-500 to-sky-400 hover:from-sky-600 hover:to-sky-500 px-16 lg:px-20 py-8 lg:py-10 text-2xl lg:text-3xl xl:text-4xl shadow-xl hover:shadow-2xl font-light tracking-wide rounded-3xl text-white"
        >
          Become a Vendor Today
        </motion.button>
      </motion.div>
    </div>
  </motion.section>
)

export default VendorSection

