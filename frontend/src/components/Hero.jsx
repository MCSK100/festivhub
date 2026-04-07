import { motion } from 'framer-motion'
import { DoodleBanner } from '../utils/doodles'

const Hero = () => (
  <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-white via-blue-50/50 to-indigo-50 py-24 lg:py-32">
    {/* Floating Doodles */}
    <DoodleBanner className="absolute top-20 right-20 w-96 h-auto opacity-20 animate-floatSlow text-sky-400 hidden lg:block" />
    
    <div className="max-w-7xl mx-auto px-6 lg:px-20 2xl:px-32 relative z-10">
      <div className="grid lg:grid-cols-2 items-center gap-20 lg:gap-32 min-h-[70vh]">
        {/* Left - Content */}
        <motion.div 
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:pr-16 space-y-8 lg:space-y-12"
        >
          <motion.div 
            className="inline-block bg-gradient-to-r from-sky-400/20 to-sky-500/20 backdrop-blur-xl px-8 py-4 rounded-3xl border border-sky-200 shadow-xl"
          >
            <span className="text-sm font-medium text-sky-600 tracking-wide uppercase">Trusted Marketplace</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-[5rem] 2xl:text-8xl font-serif font-black leading-[0.9] bg-gradient-to-r from-slate-900 via-sky-900 to-slate-900 bg-clip-text text-transparent"
          >
            Find Your Perfect<br />
            <span className="text-4xl md:text-5xl lg:text-3xl 2xl:text-6xl block font-light bg-gradient-to-r from-sky-500 to-sky-400 text-sky-500">Event Team</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-xl lg:text-2xl xl:text-3xl font-light text-slate-600 leading-relaxed max-w-lg"
          >
            Connect with top-rated photographers, caterers, decorators and more. 
            <span className="block mt-4 text-sky-600 font-medium">Your dream event, flawlessly executed.</span>
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row gap-4 lg:gap-6"
            transition={{ delay: 0.6 }}
          >
            <motion.button 
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="group relative px-10 lg:px-12 py-6 lg:py-7 text-xl lg:text-2xl font-semibold bg-gradient-to-r from-sky-500 to-sky-400 hover:from-sky-600 hover:to-sky-500 text-white rounded-3xl shadow-2xl hover:shadow-sky-500/50 transition-all duration-300 font-serif tracking-wide"
            >
              <span>Find Professionals</span>
              <motion.span 
                className="absolute -inset-2 bg-gradient-to-r from-sky-400 to-sky-500 -skew-x-12 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-all duration-500 -z-10"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.03 }}
              className="px-10 lg:px-12 py-6 lg:py-7 border-2 border-sky-300 text-xl lg:text-2xl font-light bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg hover:bg-sky-50 hover:border-sky-400 hover:shadow-xl transition-all duration-300 text-slate-800 font-serif tracking-wide"
            >
              Join as Vendor
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Right - Hero Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative lg:col-start-2"
          transition={{ delay: 0.8 }}
        >
          <div className="relative w-full h-96 lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl group">
            <img 
              src="https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80"
              alt="Event celebration"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-8 left-8 right-8">
              <div className="bg-white/90 backdrop-blur-xl px-8 py-4 rounded-2xl shadow-xl inline-block">
                <span className="text-sm font-medium text-sky-600 tracking-wide uppercase block mb-1">Live Events</span>
                <span className="text-2xl font-bold text-slate-900">2000+ Happening Now</span>
              </div>
            </div>
          </div>
          
          {/* Floating Elements */}
          <motion.div 
            className="absolute -top-16 -right-20 w-32 h-32 bg-gradient-to-br from-sky-400/20 to-sky-500/20 backdrop-blur-xl rounded-full shadow-2xl"
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 180],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              y: { duration: 4, repeat: Infinity },
              rotate: { duration: 20, repeat: Infinity },
              scale: { duration: 3, repeat: Infinity }
            }}
          />
          <motion.div 
            className="absolute bottom-24 left-16 w-24 h-24 bg-gradient-to-br from-indigo-400/20 to-sky-400/20 backdrop-blur-xl rounded-2xl shadow-xl rotate-12"
            animate={{ x: [0, 20, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
        </motion.div>
      </div>
    </div>
  </section>
)

export default Hero

