import { motion } from 'framer-motion'
import {
  Briefcase,
  Heart,
  Zap,
  LayoutGrid,
  Rocket,
  Music,
  PartyPopper,
  Mic,
  Stage,
  TrendingUp
} from 'lucide-react'

const services = [
  {
    icon: Briefcase,
    title: 'Corporate Events',
    description: 'Transform company gatherings into memorable experiences that strengthen teams and reinforce brand identity.',
  },
  {
    icon: Heart,
    title: 'Wedding Planning',
    description: 'From intimate gatherings to grand celebrations, we bring your dream wedding to life with flawless execution.',
  },
  {
    icon: Zap,
    title: 'Brand Activations',
    description: 'Immersive experiences that transform audiences into loyal advocates through innovative brand storytelling.',
  },
  {
    icon: LayoutGrid,
    title: 'Exhibitions',
    description: 'Captivating exhibition designs that command attention and deliver measurable ROI.',
  },
  {
    icon: Rocket,
    title: 'Product Launches',
    description: 'Unforgettable reveals that generate buzz and drive market impact.',
  },
  {
    icon: Music,
    title: 'Concerts',
    description: 'World-class production for artists who demand excellence.',
  },
  {
    icon: PartyPopper,
    title: 'Festivals',
    description: 'Multi-day experiences that define culture and create lifelong memories.',
  },
  {
    icon: Mic,
    title: 'Conferences',
    description: 'Flawless execution for events that shape industries.',
  },
  {
    icon: Stage,
    title: 'Stage Production',
    description: 'Cutting-edge staging and technical production that amaze.',
  },
  {
    icon: TrendingUp,
    title: 'Event Marketing',
    description: 'Strategic marketing that amplifies your event\'s impact.',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

const ServicesSection = () => {
  return (
    <section className="relative py-24 lg:py-32 premium-bg overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
          className="text-center mb-16 lg:mb-20"
        >
          <motion.span variants={itemVariants} className="inline-block text-gold text-sm font-medium uppercase tracking-widest mb-4">
            Our Expertise
          </motion.span>
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-light mb-6"
          >
            Comprehensive{' '}
            <span className="gradient-gold">Event Solutions</span>
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed"
          >
            From intimate gatherings to massive productions, we deliver excellence across every event type.
          </motion.p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group"
            >
              <div className="glass-card rounded-2xl p-8 h-full transition-all duration-500 hover:border-gold/30">
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center mb-6 text-gold group-hover:bg-gold group-hover:text-premium-bg transition-all duration-300">
                  <service.icon className="w-7 h-7" />
                </div>

                {/* Content */}
                <h3 className="text-xl lg:text-2xl font-semibold mb-4 text-white">
                  {service.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {service.description}
                </p>

                {/* Arrow */}
                <div className="mt-6 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  <span className="text-gold text-sm">Learn more →</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default ServicesSection