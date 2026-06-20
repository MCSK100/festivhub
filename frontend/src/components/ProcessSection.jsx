import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Lightbulb, ClipboardList, Hammer, Zap, PartyPopper } from 'lucide-react'

const steps = [
  {
    icon: Lightbulb,
    title: 'Discovery',
    description: 'We listen, learn, and understand your vision. Every great event starts with a conversation.',
  },
  {
    icon: ClipboardList,
    title: 'Planning',
    description: 'Every detail mapped, every possibility explored. We craft a roadmap to your perfect event.',
  },
  {
    icon: Hammer,
    title: 'Production',
    description: 'Where creativity takes form. Our team brings the vision to life with meticulous attention.',
  },
  {
    icon: Zap,
    title: 'Execution',
    description: 'The moment everything comes alive. We deliver flawless experiences that exceed expectations.',
  },
  {
    icon: PartyPopper,
    title: 'Celebration',
    description: 'Your success, our achievement. We ensure every moment is treasured and remembered.',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

const lineVariants = {
  hidden: { scaleY: 0 },
  visible: {
    scaleY: 1,
    transition: { duration: 1, ease: 'easeInOut' },
  },
}

const ProcessSection = () => {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-32 premium-bg overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="text-center mb-16 lg:mb-24"
        >
          <motion.span variants={itemVariants} className="inline-block text-gold text-sm font-medium uppercase tracking-widest mb-4">
            Our Process
          </motion.span>
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-light mb-6"
          >
            From Vision to{' '}
            <span className="gradient-gold">Reality</span>
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed"
          >
            A proven five-step methodology that ensures every event exceeds expectations.
          </motion.p>
        </motion.div>

        {/* Timeline */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative"
        >
          {/* Vertical line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gold/20">
            <motion.div
              variants={lineVariants}
              className="absolute inset-0 bg-gold"
              style={{ originY: 0, scaleY: isInView ? 1 : 0 }}
            />
          </div>

          {/* Steps */}
          <div className="space-y-16 lg:space-y-20">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`relative flex items-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                } flex-col gap-8`}
              >
                {/* Content */}
                <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'} pl-12 md:pl-0`}>
                  <div className="text-gold text-sm font-medium uppercase tracking-widest mb-2">
                    Step {index + 1}
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-semibold mb-3 text-white">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Icon */}
                <div className="absolute left-0 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gold/20 border-2 border-gold flex items-center justify-center z-10">
                  <step.icon className="w-4 h-4 text-gold" />
                </div>

                {/* Empty space for alternating layout */}
                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default ProcessSection