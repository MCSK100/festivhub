import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

const reviews = [
  {
    name: 'Priya S.',
    role: 'Bride, Mumbai',
    quote: 'Found our dream photographer through EventHub. The portfolios made our choice effortless – wedding was flawless!',
    rating: 5,
    accentColor: 'blue',
  },
  {
    name: 'Rohan K.',
    role: 'Event Manager',
    quote: 'Expanded my catering business to 50+ cities. Quality leads, seamless payments, incredible ROI.',
    rating: 5,
    accentColor: 'indigo',
  },
  {
    name: 'Aisha M.',
    role: 'Corporate Planner',
    quote: 'Venue, DJ, decor – everything booked seamlessly. Most professional platform I\'ve used.',
    rating: 5,
    accentColor: 'blue',
  },
  {
    name: 'Vikram S.',
    role: 'Photographer',
    quote: 'High-quality inquiries transformed my bookings. 3x growth in 6 months.',
    rating: 5,
    accentColor: 'indigo',
  },
  {
    name: 'Neha P.',
    role: 'Destination Wedding',
    quote: 'Decorators from Delhi to Goa. Perfect execution, stress-free planning.',
    rating: 5,
    accentColor: 'blue',
  },
  {
    name: 'Arjun M.',
    role: 'Birthday Organizer',
    quote: 'Caterers, entertainers, photographers – saved weeks of coordination!',
    rating: 5,
    accentColor: 'indigo',
  },
]

const Testimonials = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: 'easeOut' },
    },
  }

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={containerVariants}
      className="relative py-32 lg:py-48 navy-bg overflow-hidden"
    >
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-3xl"
          animate={{ y: [0, 100, 0], x: [-50, 50, -50] }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tl from-gold-500/10 to-transparent rounded-full blur-3xl"
          animate={{ y: [0, -100, 0], x: [50, -50, 50] }}
          transition={{ duration: 25, repeat: Infinity, delay: 2 }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-20 relative z-10">
        {/* Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16 lg:mb-24"
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-7xl font-serif font-light text-slate-900 mb-6"
          >
            Voices of <span className="gradient-purple-text font-semibold">Success</span>
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-slate-700 max-w-2xl mx-auto leading-relaxed"
          >
            Real professionals, real results
          </motion.p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group"
            >
              <div
                className={`glass-accent rounded-2xl p-8 lg:p-10 border h-full flex flex-col transition-all duration-300 ${
                  review.accentColor === 'blue'
                    ? 'border-blue-500/30 group-hover:border-blue-500/60 group-hover:shadow-gold-glow'
                    : 'border-indigo-500/30 group-hover:border-indigo-500/60 group-hover:shadow-purple-glow'
                }`}
              >
                {/* Stars */}
                <div className="flex justify-start gap-1 mb-6">
                  {[...Array(review.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.1,
                      }}
                    >
                      <Star
                        className={`w-5 h-5 fill-current ${
                          review.accentColor === 'blue'
                            ? 'text-blue-500'
                            : 'text-indigo-500'
                        }`}
                      />
                    </motion.div>
                  ))}
                </div>

                {/* Quote */}
                <motion.blockquote className="text-lg lg:text-xl text-slate-800 font-light leading-relaxed mb-8 flex-grow italic">
                  &ldquo;{review.quote}&rdquo;
                </motion.blockquote>

                {/* Author Info */}
                <div className="flex items-center gap-4 pt-6 border-t border-blue-500/20">
                  <motion.div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
                      review.accentColor === 'blue'
                        ? 'from-blue-500 to-blue-400'
                        : 'from-indigo-500 to-indigo-400'
                    } flex items-center justify-center flex-shrink-0 font-semibold text-white text-lg`}
                  >
                    {review.name[0]}
                  </motion.div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm lg:text-base">
                      {review.name}
                    </p>
                    <p className="text-xs lg:text-sm text-slate-700">{review.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}

export default Testimonials