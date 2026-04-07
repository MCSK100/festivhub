import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import FreeTrialTimer from '../components/FreeTrialTimer'

const RoleSelection = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen navy-bg flex items-center justify-center relative overflow-hidden"
    >
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(200,169,106,0.08)_0%,transparent_40%),radial-gradient(circle_at_75%_75%,rgba(124,92,252,0.06)_0%,transparent_40%)] opacity-50" />
      
      <div className="text-center max-w-5xl mx-auto px-8 lg:px-16 relative z-10">
        <motion.h1 
          initial={{ y: -40, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="text-6xl lg:text-[8rem] xl:text-[9rem] font-serif font-light italic bg-gradient-to-r from-gold-400 via-purple-500 to-gold-500 bg-clip-text text-transparent mb-12 leading-none shadow-hero-glow [text-shadow:0_12px_60px_rgba(200,169,106,0.7)]"
        >
          Choose<br className="lg:hidden" />Your Path
        </motion.h1>
        
        <motion.p 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-2xl lg:text-4xl xl:text-5xl font-light text-slate-200/90 mb-24 lg:mb-32 leading-[1.6] backdrop-blur-xl max-w-3xl mx-auto px-4"
        >
          Whether hiring top talent or showcasing your expertise – 
          <span className="block mt-6 text-gold-300 font-serif italic bg-gradient-to-r from-gold-400 via-purple-400 to-gold-500 bg-clip-text text-transparent shadow-purple-glow">
            your perfect event starts here
          </span>
        </motion.p>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 max-w-7xl mx-auto mb-24 lg:mb-32">
          {/* Customer Path */}
          <motion.div 
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            whileHover={{ scale: 1.05, y: -12 }}
            className="group relative navy-glass backdrop-blur-3xl p-12 lg:p-20 rounded-[4rem] shadow-hero-glow border border-gold-400/40 hover:border-purple-500/60 hover:shadow-[0_0_80px_rgba(200,169,106,0.4)] transition-all duration-700 cursor-pointer overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
            <div className="w-28 h-28 lg:w-32 lg:h-32 mx-auto mb-10 lg:mb-12 rounded-[3rem] bg-gradient-to-r from-gold-500 to-purple-500 flex items-center justify-center shadow-gold-glow-lg border-4 border-white/30 backdrop-blur-2xl group-hover:rotate-6 group-hover:scale-110 transition-all duration-700 relative z-10">
              <svg className="w-14 lg:w-16 h-14 lg:h-16 text-white drop-shadow-2xl" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <motion.h3 
              className="text-4xl lg:text-5xl xl:text-6xl font-serif font-bold mb-8 text-slate-100 group-hover:text-gold-300 transition-all duration-700 leading-tight shadow-2xl"
              whileHover={{ y: -4 }}
            >
              Hire Talent
            </motion.h3>
            <p className="text-xl lg:text-2xl text-slate-300/90 mb-12 lg:mb-16 leading-relaxed font-light max-w-lg mx-auto group-hover:text-slate-200/95">
              Find & book verified photographers, caterers, decorators and more for your perfect event.
            </p>
            <Link 
              to="/signup" 
              className="inline-block px-10 lg:px-14 py-6 lg:py-8 btn-gold shadow-gold-glow-lg hover:shadow-hero-glow font-light text-xl lg:text-2xl tracking-wide relative z-20"
            >
              Start Hiring
            </Link>
          </motion.div>

          {/* Vendor Path */}
          <motion.div 
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            whileHover={{ scale: 1.05, y: -12 }}
            className="group relative navy-glass backdrop-blur-3xl p-12 lg:p-20 rounded-[4rem] shadow-hero-glow border border-purple-400/40 hover:border-gold-500/60 hover:shadow-[0_0_80px_rgba(124,92,252,0.4)] transition-all duration-700 cursor-pointer overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-gold-500/5 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
            <div className="w-28 h-28 lg:w-32 lg:h-32 mx-auto mb-10 lg:mb-12 rounded-[3rem] bg-gradient-to-r from-purple-500 to-gold-500 flex items-center justify-center shadow-purple-glow-lg border-4 border-white/30 backdrop-blur-2xl group-hover:rotate-6 group-hover:scale-110 transition-all duration-700 relative z-10">
              <svg className="w-14 lg:w-16 h-14 lg:h-16 text-white drop-shadow-2xl" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <motion.h3 
              className="text-4xl lg:text-5xl xl:text-6xl font-serif font-bold mb-8 text-slate-100 group-hover:text-purple-300 transition-all duration-700 leading-tight shadow-2xl"
              whileHover={{ y: -4 }}
            >
              Showcase Work
            </motion.h3>
            <p className="text-xl lg:text-2xl text-slate-300/90 mb-12 lg:mb-16 leading-relaxed font-light max-w-lg mx-auto group-hover:text-slate-200/95">
              Build your portfolio and connect with thousands of event organizers looking for professionals like you.
            </p>
            <Link 
              to="/signup" 
              className="inline-block px-10 lg:px-14 py-6 lg:py-8 btn-purple shadow-purple-glow-lg hover:shadow-hero-glow font-light text-xl lg:text-2xl tracking-wide relative z-20"
            >
              Join as Professional
            </Link>
          </motion.div>
        </div>

        {/* Free Trial Timer */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-24 lg:mt-32 max-w-md mx-auto"
        >
          <FreeTrialTimer />
        </motion.div>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-20 text-lg lg:text-xl text-slate-400 font-light backdrop-blur-xl"
        >
          Already registered?{' '}
          <Link to="/login" className="text-gold-400 hover:text-gold-300 font-medium shadow-gold-glow hover:shadow-gold-glow-lg transition-all duration-300 inline-block px-4 py-2 rounded-xl backdrop-blur-xl">Sign in here</Link>
        </motion.p>
      </div>
    </motion.div>
  )
}

export default RoleSelection

