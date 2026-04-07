import { motion } from 'framer-motion'

const TrustBar = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    className="relative py-24 lg:py-32 bg-gradient-to-r from-white to-gray-50 shadow-inner border-b border-gray-100"
  >
    <div className="max-w-7xl mx-auto px-8 lg:px-20 xl:px-32 text-center">
      <div className="flex flex-wrap justify-center gap-12 lg:gap-24 xl:gap-32 text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-serif font-light italic">
        {/* Verified Professionals */}
        <motion.div 
          className="flex flex-col lg:flex-row items-center lg:space-x-8 group hover:scale-[1.08] transition-all duration-700 cursor-pointer"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          whileHover={{ y: -8 }}
        >
          <motion.div 
            className="w-24 h-24 lg:w-32 lg:h-32 xl:w-36 xl:h-36 bg-gradient-to-br from-sky-400 to-sky-500 rounded-[3rem] flex items-center justify-center shadow-lg group-hover:shadow-xl backdrop-blur-xl border-4 border-sky-300 hover:border-sky-500 hover:scale-125 transition-all duration-800 mx-auto lg:mx-0 mb-6 lg:mb-0 relative overflow-hidden"
            whileHover={{ rotateY: [0, 180, 360] }}
            transition={{ duration: 1.5 }}
          >
            <span className="text-white text-3xl lg:text-4xl xl:text-5xl font-serif font-bold drop-shadow-lg relative z-10">8K+</span>
            <div className="absolute inset-0 bg-gradient-to-r from-sky-500/30 opacity-0 group-hover:opacity-100 blur-xl transition-opacity" />
          </motion.div>
          <motion.span 
            className="text-slate-800 font-light leading-tight min-w-[220px] lg:min-w-[260px] text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          >
            Verified<br />Professionals
          </motion.span>
        </motion.div>

        {/* Events Celebrated */}
        <motion.div 
          className="flex flex-col lg:flex-row items-center lg:space-x-8 group hover:scale-[1.08] transition-all duration-700 cursor-pointer"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          whileHover={{ y: -8 }}
        >
          <motion.div 
            className="w-24 h-24 lg:w-32 lg:h-32 xl:w-36 xl:h-36 bg-gradient-to-br from-sky-500 to-sky-400 rounded-[3rem] flex items-center justify-center shadow-lg group-hover:shadow-xl backdrop-blur-xl border-4 border-sky-400 hover:border-sky-500 hover:scale-125 transition-all duration-800 mx-auto lg:mx-0 mb-6 lg:mb-0 relative overflow-hidden"
            whileHover={{ rotateX: [0, 180, 360] }}
            transition={{ duration: 1.5 }}
          >
            <span className="text-white text-3xl lg:text-4xl xl:text-5xl font-serif font-bold drop-shadow-lg relative z-10">25K+</span>
            <div className="absolute inset-0 bg-gradient-to-r from-sky-400/30 opacity-0 group-hover:opacity-100 blur-xl transition-opacity" />
          </motion.div>
          <motion.span 
            className="text-slate-800 font-light leading-tight min-w-[220px] lg:min-w-[260px] text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          >
            Events<br />Celebrated
          </motion.span>
        </motion.div>

        {/* Cities */}
        <motion.div 
          className="flex flex-col lg:flex-row items-center lg:space-x-8 group hover:scale-[1.08] transition-all duration-700 cursor-pointer"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          whileHover={{ y: -8 }}
        >
          <motion.div 
            className="w-24 h-24 lg:w-32 lg:h-32 xl:w-36 xl:h-36 bg-gradient-to-br from-sky-400 to-sky-500 rounded-[3rem] flex items-center justify-center shadow-lg group-hover:shadow-xl backdrop-blur-xl border-4 border-sky-300 hover:border-sky-500 hover:scale-125 transition-all duration-800 mx-auto lg:mx-0 mb-6 lg:mb-0 relative overflow-hidden"
            whileHover={{ rotate: [0, -180, 0] }}
            transition={{ duration: 1.5 }}
          >
            <span className="text-white text-3xl lg:text-4xl xl:text-5xl font-serif font-bold drop-shadow-lg relative z-10">85+</span>
            <div className="absolute inset-0 bg-gradient-to-r from-sky-500/30 opacity-0 group-hover:opacity-100 blur-xl transition-opacity" />
          </motion.div>
          <motion.span 
            className="text-slate-800 font-light leading-tight min-w-[220px] lg:min-w-[260px] text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          >
            Cities<br />Worldwide
          </motion.span>
        </motion.div>

        {/* Satisfaction */}
        <motion.div 
          className="flex flex-col lg:flex-row items-center lg:space-x-8 group hover:scale-[1.08] transition-all duration-700 cursor-pointer"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          whileHover={{ y: -8 }}
        >
          <motion.div 
            className="w-24 h-24 lg:w-32 lg:h-32 xl:w-36 xl:h-36 bg-gradient-to-br from-sky-500 to-sky-400 rounded-[3rem] flex items-center justify-center shadow-lg group-hover:shadow-xl backdrop-blur-xl border-4 border-sky-400 hover:border-sky-500 hover:scale-125 transition-all duration-800 mx-auto lg:mx-0 mb-6 lg:mb-0 relative overflow-hidden"
            whileHover={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-white text-3xl lg:text-4xl xl:text-5xl font-serif font-bold drop-shadow-lg relative z-10">99.9%</span>
            <div className="absolute inset-0 bg-gradient-to-r from-sky-400/30 opacity-0 group-hover:opacity-100 blur-xl transition-opacity" />
          </motion.div>
          <motion.span 
            className="text-slate-800 font-light leading-tight min-w-[260px] lg:min-w-[300px] text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          >
            Satisfaction<br />Guaranteed
          </motion.span>
        </motion.div>
      </div>
    </div>
  </motion.div>
)

export default TrustBar

