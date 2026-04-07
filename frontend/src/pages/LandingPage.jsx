import { motion } from 'framer-motion'
import Hero from '../components/Hero'
import VendorSection from '../components/VendorSection'
import CustomerSection from '../components/CustomerSection'
import CategoryGrid from '../components/CategoryGrid'
import TrustBar from '../components/TrustBar'
import Testimonials from '../components/Testimonials'

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' }
  }
}

const LandingPage = () => (
  <>
    {/* Enhanced Hero */}
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={itemVariants}>
      <Hero />
    </motion.div>

    {/* NEW Vendor Showcase */}
    <motion.div 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      <VendorSection />
    </motion.div>

    {/* NEW Customer Benefits */}
    <motion.div 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      <CustomerSection />
    </motion.div>

    {/* Enhanced Category Grid */}
    <motion.div 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      <CategoryGrid />
    </motion.div>

    {/* TrustBar */}
    <motion.div 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-120px" }}
      variants={containerVariants}
    >
      <TrustBar />
    </motion.div>

    {/* Testimonials */}
    <motion.div 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-120px" }}
      variants={containerVariants}
    >
      <Testimonials />
    </motion.div>

    {/* NEW Final CTA - Massive */}
    <motion.section 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
className="py-32 md:py-48 lg:py-64 bg-gradient-to-b from-white to-gray-50 border-t-4 border-gray-200"
    >
      <div className="max-w-6xl mx-auto text-center px-8 lg:px-32">
        <motion.h2 
          initial={{ y: 60, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-light italic mb-12 lg:mb-20 leading-tight bg-gradient-to-r from-gold-400 via-purple-400 to-gold-500 bg-clip-text text-transparent shadow-hero-glow"
        >
          Your Perfect<br />Event Awaits
        </motion.h2>
        <motion.button 
          whileHover={{ scale: 1.12, y: -12, rotateX: 12 }}
          whileTap={{ scale: 0.98 }}
          className="group relative px-28 lg:px-36 py-16 lg:py-20 text-4xl lg:text-5xl xl:text-6xl font-serif italic btn-gold shadow-hero-glow hover:shadow-[0_0_120px_rgba(200,169,106,0.8)] text-navy-900 font-light tracking-wide overflow-hidden [text-shadow:none]"
        >
          <span className="relative z-20">Start Planning</span>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/40 via-gold-500/50 to-purple-500/40 -skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-2xl scale-[1.2]" />
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-gold-400/30 animate-pulse blur-3xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <div className="absolute -inset-2 bg-gradient-to-r from-gold-500 via-purple-500 to-gold-500 rounded-[5rem] opacity-80 blur-3xl animate-ping group-hover:animate-none" />
        </motion.button>
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-20 text-2xl lg:text-3xl xl:text-4xl font-light text-slate-300/80 italic backdrop-blur-xl px-8"
        >
          Join thousands creating extraordinary moments daily
        </motion.p>
      </div>
    </motion.section>
  </>
)

export default LandingPage
