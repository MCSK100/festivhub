import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const events = [
  { id: 1, title: 'Grand Innovation Summit', category: 'Corporate Conference', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80' },
  { id: 2, title: 'Celestial Wedding', category: 'Wedding', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80' },
  { id: 3, title: 'Neon Brand Activation', category: 'Brand Activation', image: 'https://images.unsplash.com/photo-1492684223066-87ee7f0b7f37?w=800&auto=format&fit=crop&q=80' },
  { id: 4, title: 'Eclipse Music Festival', category: 'Festival', image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&auto=format&fit=crop&q=80' },
]

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }
const itemVariants = { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } }

const FeaturedEventsSection = () => {
  return (
    <section className="relative py-24 lg:py-32 bg-white overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants} className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 lg:mb-16">
          <div>
            <motion.span variants={itemVariants} className="inline-block text-primary-dark text-sm font-medium uppercase tracking-widest mb-4">Our Work</motion.span>
            <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl lg:text-6xl font-display font-light text-gray-900">
              Featured <span className="gradient-gold">Events</span>
            </motion.h2>
          </div>
          <motion.button variants={itemVariants} className="btn-secondary mt-6 md:mt-0 inline-flex items-center gap-2">
            <span>View All</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {events.map((event, index) => (
            <motion.div key={event.id} variants={itemVariants} className={`group relative rounded-2xl overflow-hidden shadow-card ${index === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}>
              <div className="aspect-[16/9] md:aspect-auto">
                <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                <p className="text-primary text-sm font-medium uppercase tracking-widest mb-2">{event.category}</p>
                <h3 className={`font-semibold text-white ${index === 0 ? 'text-2xl lg:text-4xl' : 'text-xl lg:text-2xl'}`}>{event.title}</h3>
              </div>
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/30 rounded-2xl transition-colors" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default FeaturedEventsSection
