import { motion } from 'framer-motion'

const reviews = [
  { 
    name: 'Priya S.', 
    role: 'Bride, Mumbai', 
    quote: "Found our dream photographer through FestivLink. The portfolios made our choice effortless – wedding was flawless!", 
    rating: 5,
    avatarColor: 'from-sky-500 to-sky-400'
  },
  { 
    name: 'Rohan K.', 
    role: 'Event Manager', 
    quote: "Expanded my catering business to 50+ cities. Quality leads, seamless payments, incredible ROI.", 
    rating: 5,
    avatarColor: 'from-sky-400 to-sky-500'
  },
  { 
    name: 'Aisha M.', 
    role: 'Corporate Planner', 
    quote: "Venue, DJ, decor – everything booked seamlessly. Most professional platform I've used.", 
    rating: 5,
    avatarColor: 'from-sky-500 to-sky-300'
  },
  { 
    name: 'Vikram S.', 
    role: 'Photographer', 
    quote: "High-quality inquiries transformed my bookings. 3x growth in 6 months.", 
    rating: 5,
    avatarColor: 'from-sky-300 to-sky-500'
  },
  { 
    name: 'Neha P.', 
    role: 'Destination Wedding', 
    quote: "Decorators from Delhi to Goa. Perfect execution, stress-free planning.", 
    rating: 5,
    avatarColor: 'from-sky-500 to-sky-400'
  },
  { 
    name: 'Arjun M.', 
    role: 'Birthday Organizer', 
    quote: "Caterers, entertainers, photographers – saved weeks of coordination!", 
    rating: 5,
    avatarColor: 'from-sky-400 to-sky-300'
  },
]

const Testimonials = () => (
  <motion.section 
    initial={{ opacity: 0, y: 60 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8 }}
    className="py-32 lg:py-48 bg-gradient-to-b from-white to-gray-50"
  >
    <div className="max-w-7xl mx-auto px-8 lg:px-20 xl:px-32">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center mb-20 lg:mb-28 xl:mb-36"
      >
        <h2 className="text-6xl lg:text-[7.5rem] xl:text-[8.5rem] 2xl:text-[9.5rem] font-serif font-light italic bg-gradient-to-r from-sky-400 via-sky-300 to-sky-500 bg-clip-text text-transparent mb-12 leading-none shadow-lg">
          Voices of Success
        </h2>
        <p className="text-2xl lg:text-3xl xl:text-4xl font-light text-slate-600 max-w-5xl mx-auto leading-relaxed">
          Real professionals, real results
        </p>
      </motion.div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-14 xl:gap-20">
        {reviews.map((review, index) => (
          <motion.div 
            key={index}
            className="group relative p-10 lg:p-14 xl:p-16 rounded-[3rem] bg-white backdrop-blur-xl shadow-lg hover:shadow-2xl hover:-translate-y-10 transition-all duration-1000 border border-gray-200 hover:border-sky-300 cursor-pointer overflow-hidden"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            whileHover={{ scale: 1.04 }}
          >
            {/* Glow Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-sky-400/20 via-sky-300/10 to-sky-400/20 opacity-0 group-hover:opacity-100 blur-xl rounded-[3rem] transition-all duration-700" />
            
            {/* Stars */}
            <div className="flex justify-center mb-10 gap-1">
              {[...Array(review.rating)].map((_, starIndex) => (
                <motion.span 
                  key={starIndex}
                  className="text-4xl lg:text-5xl xl:text-6xl text-sky-400 drop-shadow-lg group-hover:scale-125"
                  initial={{ rotate: 180 }}
                  animate={{ rotate: 0 }}
                  whileHover={{ 
                    scale: [1, 1.4, 1.2], 
                    rotate: [0, 360], 
                    y: [-8, 0]
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 12 
                  }}
                >
                  ★
                </motion.span>
              ))}
            </div>
            
            {/* Quote */}
            <motion.blockquote 
              className="text-2xl lg:text-3xl xl:text-[1.75rem] 2xl:text-4xl text-slate-800 font-serif font-light italic leading-[1.4] mb-14 group-hover:text-slate-900 transition-all duration-700 text-center px-4 lg:px-8"
              whileHover={{ y: -6 }}
            >
              &ldquo;{review.quote}&rdquo;
            </motion.blockquote>
            
            {/* Author */}
            <div className="flex items-center justify-center">
              <motion.div 
                className={`w-20 h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 bg-gradient-to-br ${review.avatarColor} rounded-[2.5rem] flex items-center justify-center mr-6 lg:mr-8 shadow-lg ring-2 ring-white/50 group-hover:rotate-360 group-hover:scale-125 transition-all duration-1000 flex-shrink-0 backdrop-blur-xl`}
                whileHover={{ scale: 1.2, rotate: 360 }}
                transition={{ duration: 0.8, type: 'spring' }}
              >
                <span className="text-white font-serif text-2xl lg:text-3xl xl:text-4xl font-bold drop-shadow-lg">
                  {review.name.split(' ')[0][0]}{review.name.split(' ')[1]?.[0] || ''}
                </span>
              </motion.div>
              <div className="text-right">
                <motion.p 
                  className="font-serif text-3xl lg:text-4xl xl:text-5xl font-light text-slate-900 group-hover:text-sky-500 transition-colors shadow-lg leading-tight"
                  whileHover={{ x: 8 }}
                >
                  {review.name}
                </motion.p>
                <motion.p 
                  className="text-xl lg:text-2xl text-slate-500 font-light mt-2 group-hover:text-slate-600 transition-colors"
                  whileHover={{ x: 4 }}
                >
                  {review.role}
                </motion.p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA Button */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="text-center mt-24 lg:mt-36"
      >
        <motion.button 
          whileHover={{ scale: 1.1, y: -8 }}
          className="bg-gradient-to-r from-sky-500 to-sky-400 hover:from-sky-600 hover:to-sky-500 px-20 lg:px-28 py-10 lg:py-12 text-3xl lg:text-4xl xl:text-5xl shadow-xl hover:shadow-2xl font-light tracking-wide rounded-3xl text-white"
        >
          See More Success Stories
        </motion.button>
      </motion.div>
    </div>
  </motion.section>
)

export default Testimonials

