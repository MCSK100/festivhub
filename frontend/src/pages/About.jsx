import { motion } from 'framer-motion'

const About = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    className="min-h-screen navy-bg/90 backdrop-blur-xl py-24 lg:py-32"
  >
    <div className="max-w-7xl mx-auto px-8 lg:px-20">
      {/* Hero Header */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-24 lg:mb-36"
      >
        <h1 className="text-7xl lg:text-[9rem] xl:text-[10rem] font-serif font-light italic bg-gradient-to-r from-blue-500 via-indigo-600 to-blue-600 bg-clip-text text-transparent mb-12 leading-none shadow-hero-glow [text-shadow:0_12px_60px_rgba(59,130,246,0.3)]">
          About<br />FestivLink
        </h1>
        <p className="text-2xl lg:text-4xl xl:text-5xl font-light text-slate-700 max-w-5xl mx-auto leading-[1.6] backdrop-blur-xl">
          Revolutionizing event planning through premium connections
        </p>
      </motion.div>

      {/* Mission Section */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="max-w-5xl mx-auto text-center mb-32 lg:mb-48"
      >
        <div className="glass-accent backdrop-blur-3xl p-16 lg:p-24 rounded-[4rem] shadow-hero-glow border border-blue-500/30 hover:shadow-[0_0_60px_rgba(59,130,246,0.2)] transition-all duration-700">
          <p className="text-2xl lg:text-3xl xl:text-4xl font-light text-slate-800 leading-[1.7] max-w-4xl mx-auto mb-16 lg:mb-24">
            We built FestivLink to eliminate the chaos of event planning. No more unreliable recommendations, endless WhatsApp groups, or last-minute cancellations.
          </p>
          <blockquote className="text-5xl lg:text-7xl xl:text-[8rem] font-serif font-light italic text-transparent bg-gradient-to-r from-blue-500 via-indigo-600 to-blue-600 bg-clip-text shadow-purple-glow-lg leading-none mb-12">
            Verified talent.
            <br />
            Unforgettable moments.
          </blockquote>
          <p className="text-xl lg:text-2xl text-slate-700 font-light max-w-3xl mx-auto">
            Real portfolios • Direct booking • Secure payments • 24/7 support
          </p>
        </div>
      </motion.section>

      {/* Stats Row */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-32 lg:mb-48"
      >
        <div className="group text-center p-12 lg:p-16 glass-dark rounded-4xl backdrop-blur-2xl border border-blue-500/30 hover:border-indigo-500/60 hover:shadow-hero-glow hover:-translate-y-6 transition-all duration-700">
          <motion.div 
            className="w-20 h-20 mx-auto mb-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-[2.5rem] flex items-center justify-center shadow-gold-glow-xl group-hover:rotate-360 transition-all duration-1000"
            whileHover={{ scale: 1.2 }}
          >
            <span className="text-2xl font-serif font-bold text-slate-900 drop-shadow-lg">📸</span>
          </motion.div>
          <h3 className="text-5xl lg:text-6xl xl:text-7xl font-serif font-light mb-6 text-slate-900 group-hover:text-blue-600">12K+</h3>
          <p className="text-xl lg:text-2xl text-slate-700 font-light">Active Professionals</p>
        </div>

        <div className="group text-center p-12 lg:p-16 glass-dark rounded-4xl backdrop-blur-2xl border border-indigo-500/30 hover:border-blue-500/60 hover:shadow-hero-glow hover:-translate-y-6 transition-all duration-700">
          <motion.div 
            className="w-20 h-20 mx-auto mb-8 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-[2.5rem] flex items-center justify-center shadow-purple-glow-xl group-hover:rotate-360 transition-all duration-1000"
            whileHover={{ scale: 1.2 }}
          >
            <span className="text-2xl font-serif font-bold text-slate-900 drop-shadow-lg">🎉</span>
          </motion.div>
          <h3 className="text-5xl lg:text-6xl xl:text-7xl font-serif font-light mb-6 text-slate-900 group-hover:text-indigo-600">75K+</h3>
          <p className="text-xl lg:text-2xl text-slate-700 font-light">Events Connected</p>
        </div>

        <div className="group text-center p-12 lg:p-16 glass-dark rounded-4xl backdrop-blur-2xl border border-blue-500/30 hover:border-indigo-500/60 hover:shadow-hero-glow hover:-translate-y-6 transition-all duration-700">
          <motion.div 
            className="w-20 h-20 mx-auto mb-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-[2.5rem] flex items-center justify-center shadow-gold-glow-xl group-hover:rotate-360 transition-all duration-1000"
            whileHover={{ scale: 1.2 }}
          >
            <span className="text-2xl font-serif font-bold text-slate-900 drop-shadow-lg">🌍</span>
          </motion.div>
          <h3 className="text-5xl lg:text-6xl xl:text-7xl font-serif font-light mb-6 text-slate-900 group-hover:text-blue-600">120+</h3>
          <p className="text-xl lg:text-2xl text-slate-700 font-light">Cities Covered</p>
        </div>

        <div className="group text-center p-12 lg:p-16 glass-dark rounded-4xl backdrop-blur-2xl border border-indigo-500/30 hover:border-blue-500/60 hover:shadow-hero-glow hover:-translate-y-6 transition-all duration-700">
          <motion.div 
            className="w-20 h-20 mx-auto mb-8 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-[2.5rem] flex items-center justify-center shadow-purple-glow-xl group-hover:rotate-360 transition-all duration-1000"
            whileHover={{ scale: 1.2 }}
          >
            <span className="text-2xl font-serif font-bold text-slate-900 drop-shadow-lg">⭐</span>
          </motion.div>
          <h3 className="text-5xl lg:text-6xl xl:text-7xl font-serif font-light mb-6 text-slate-900 group-hover:text-indigo-600">99.9%</h3>
          <p className="text-xl lg:text-2xl text-slate-700 font-light">Success Rate</p>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <motion.button 
          whileHover={{ scale: 1.1, y: -8 }}
          className="btn-gold px-20 lg:px-28 py-10 lg:py-12 text-3xl lg:text-4xl shadow-hero-glow hover:shadow-[0_0_80px_rgba(200,169,106,0.8)] font-light tracking-wide"
        >
          Get Started Today
        </motion.button>
      </motion.div>
    </div>
  </motion.div>
)

export default About
