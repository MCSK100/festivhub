import { motion } from 'framer-motion'
import { Award } from 'lucide-react'

const awards = [
  { year: '2025', title: 'Event Company of the Year', organization: 'Event Tech Awards' },
  { year: '2024', title: 'Best Wedding Experience', organization: 'Luxury Lifestyle Awards' },
  { year: '2024', title: 'Innovation in Events', organization: 'Global Event Summit' },
  { year: '2023', title: 'Top Event Planner', organization: 'Business Excellence' },
]

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }
const itemVariants = { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } } }

const AwardsSection = () => {
  return (
    <section className="relative py-20 lg:py-28 bg-white overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 text-primary-dark mb-4">
            <Award className="w-5 h-5" />
            <span className="text-sm font-medium uppercase tracking-widest">Recognition</span>
          </motion.div>
          <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl lg:text-5xl font-display font-light text-gray-900">
            Awards & <span className="gradient-gold">Achievements</span>
          </motion.h2>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {awards.map((award, index) => (
            <motion.div key={index} variants={itemVariants} className="glass-card rounded-2xl p-6 text-center hover:shadow-card-hover transition-all duration-300">
              <div className="text-primary-dark text-sm font-medium mb-2">{award.year}</div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">{award.title}</h3>
              <p className="text-gray-500 text-sm">{award.organization}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default AwardsSection
