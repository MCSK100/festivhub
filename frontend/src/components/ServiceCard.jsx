import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

const ServiceCard = ({ provider }) => (
  <motion.div 
    className="group cursor-pointer"
    whileHover={{ y: -12, scale: 1.02 }}
    transition={{ duration: 0.4, ease: 'easeOut' }}
  >
    <div className="relative h-[22rem] lg:h-[28rem] rounded-3xl overflow-hidden bg-white shadow-xl hover:shadow-2xl border border-gray-100 hover:border-sky-300 transition-all duration-700">
      {/* Portfolio Image/Video Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 group-hover:scale-110"
        style={{ 
          backgroundImage: `url(${provider?.image || 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&w=1200&fit=crop&auto=format'})`
        }}
      />
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-gray-800/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-sky-500/10 via-sky-400/5 to-sky-300/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      {/* Status Badge */}
      <motion.div 
        className="absolute top-6 right-6 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-700"
        initial={{ scale: 0 }}
        whileHover={{ scale: 1.1 }}
      >
        <div className="flex items-center space-x-2 bg-sky-500/20 backdrop-blur-xl px-4 py-2 rounded-2xl border border-sky-400/50 shadow-lg shadow-sky-400/30">
          <motion.div 
            animate={{ scale: [1, 1.4, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-3 h-3 bg-sky-400 rounded-full shadow-md"
          />
          <span className="text-sky-300 font-medium text-sm tracking-wide">Live</span>
        </div>
      </motion.div>
      
      {/* Rating Stars */}
      <div className="absolute top-6 left-6 flex items-center space-x-1">
        <div className="flex text-sky-400 text-2xl">
          <Star className="w-6 h-6 fill-current stroke-current" />
          <Star className="w-6 h-6 fill-current stroke-current" />
          <Star className="w-6 h-6 fill-current stroke-current" />
          <Star className="w-6 h-6 fill-current stroke-current" />
          <Star className="w-6 h-6 stroke-current" />
        </div>
        <span className="ml-2 text-xl font-bold text-white shadow-lg">4.9</span>
      </div>
      
      {/* Content Card */}
      <div className="absolute bottom-6 left-8 right-8 p-6 lg:p-8 backdrop-blur-xl rounded-3xl bg-white/90 border border-gray-200 shadow-lg">
        <motion.h3 
          className="text-2xl lg:text-3xl xl:text-4xl font-serif font-bold mb-3 text-slate-900 leading-tight group-hover:text-sky-600 transition-all duration-700"
          whileHover={{ scale: 1.02 }}
        >
          {provider?.name || 'Priya Photography'}
        </motion.h3>
        <p className="text-lg lg:text-xl text-slate-600 mb-6 leading-relaxed font-light">
          {provider?.description || 'Award-winning wedding & event photographer with 8+ years experience'}
        </p>
        <div className="flex items-center justify-between">
          <motion.span 
            className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-sky-500 to-sky-400 bg-clip-text text-transparent shadow-lg"
            whileHover={{ scale: 1.1 }}
          >
            ₹{provider?.price || '35k'}+
          </motion.span>
          <motion.button 
            whileHover={{ scale: 1.1, rotate: [0, 5, -5, 0] }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-sky-500 to-sky-400 hover:from-sky-600 hover:to-sky-500 px-8 lg:px-10 py-4 lg:py-5 text-lg lg:text-xl shadow-lg hover:shadow-sky-500/50 font-medium tracking-wide whitespace-nowrap rounded-2xl text-white transition-all duration-300"
          >
            Book Now
          </motion.button>
        </div>
      </div>
      
      {/* Doodle Accent */}
      <motion.svg 
        className="absolute top-8 -right-12 w-24 h-24 text-sky-400/30 group-hover:text-sky-300/50 transition-colors duration-700 drop-shadow-lg"
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        <path d="M12 21a9.004 9.004 0 0 1-9-9 9.004 9.004 0 0 1 9-9c5 0 8.229 3.326 9.219 7h-2.719C19.229 8.326 17 5 12 5a7 7 0 0 0-7 7 7 7 0 0 0 7 7c2.23 0 4.108-1.104 6.194-2.424L17 17h2v2l-2.414-.414A9.004 9.004 0 0 1 12 21z" />
      </motion.svg>
    </div>
  </motion.div>
)

export default ServiceCard

