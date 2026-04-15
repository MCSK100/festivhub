import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Hero = () => {
  const navigate = useNavigate()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  }

  return (
    <section className="relative min-h-screen overflow-hidden navy-bg py-20 lg:py-32 flex items-center pt-40 lg:pt-32">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/15 to-transparent rounded-full blur-3xl"
          animate={{
            y: [0, 100, 0],
            x: [-50, 50, -50],
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tl from-indigo-400/15 to-transparent rounded-full blur-3xl"
          animate={{
            y: [0, -100, 0],
            x: [50, -50, 50],
          }}
          transition={{ duration: 25, repeat: Infinity, delay: 2 }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-15 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8 lg:space-y-12"
          >
            {/* Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-3 px-6 py-3 glass-accent rounded-full w-fit"
            >
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-blue-600">
                Trusted by 1,000+ Professionals
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif font-light leading-tight">
                <span className="text-slate-900">Seamless</span>
                <br />
                <span className="gradient-gold-text font-semibold">
                  Events.
                </span>
                <br />
                <span className="text-slate-900">
                  Extraordinary
                </span>
                <br />
                <span className="gradient-gold-text font-semibold">
                  Professionals
                </span>
              </h1>
            </motion.div>

            {/* Subheading */}
            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl lg:text-2xl text-slate-700 leading-relaxed max-w-xl"
            >
              Connect with elite vendors and professionals. Book verified talent
              for photography, catering, decoration, and more. Your dream event
              deserves excellence.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 lg:gap-6 pt-4"
            >
              <button
                onClick={() => navigate('/signup?role=customer')}
                className="group btn-premium-gold inline-flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <span>Find Vendors</span>
                <ArrowRight className="inline-block w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/signup?role=vendor')}
                className="px-8 py-4 rounded-2xl border-2 border-blue-500/50 text-blue-600 font-semibold hover:bg-blue-500/10 hover:border-blue-500 transition-all duration-300 inline-flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <span>Join as Vendor</span>
                <ArrowRight className="inline-block w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-3 gap-8 pt-12 border-t border-blue-500/20"
            >
              <div>
                <p className="text-3xl lg:text-4xl font-bold text-blue-600 mb-2">
                  500+
                </p>
                <p className="text-sm text-slate-700 font-medium">Vendors</p>
              </div>
              <div>
                <p className="text-3xl lg:text-4xl font-bold text-blue-600 mb-2">
                  1K+
                </p>
                <p className="text-sm text-slate-700 font-medium">Bookings</p>
              </div>
              <div>
                <p className="text-3xl lg:text-4xl font-bold text-blue-600 mb-2">
                  15+
                </p>
                <p className="text-sm text-slate-700 font-medium">Cities</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative h-96 lg:h-[600px]"
          >
            <div className="absolute inset-0 rounded-3xl overflow-hidden glass-dark shadow-hero-glow border border-blue-500/30">
              <img
                src="https://images.unsplash.com/photo-1541538670337-c53313ad7c00?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8bWFycmlhZ2V8ZW58MHwxfDB8fHww"
                alt="Premium event"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent" />

              {/* Floating Badge */}
              <motion.div
                className="absolute bottom-8 left-8 right-8 glass-accent rounded-2xl p-6"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <p className="text-sm text-slate-600 font-medium mb-2">
                  LIVE EVENTS
                </p>
                <p className="text-2xl font-bold text-slate-900">2000+ Happening Now</p>
              </motion.div>
            </div>

            {/* Floating Elements */}
            <motion.div
              className="absolute -top-12 -right-12 w-40 h-40 bg-gradient-to-br from-blue-400/15 to-transparent rounded-full blur-2xl"
              animate={{ y: [0, 20, 0], rotate: [0, 180, 360] }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            <motion.div
              className="absolute -bottom-8 left-1/4 w-32 h-32 bg-gradient-to-tr from-purple-500/20 to-transparent rounded-full blur-2xl"
              animate={{ x: [0, 30, 0], rotate: [360, 180, 0] }}
              transition={{ duration: 10, repeat: Infinity }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero

