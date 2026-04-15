import { motion } from 'framer-motion'

const TrustBar = () => {
  const stats = [
    { number: '1K+', label: 'Verified\nProfessionals', color: 'blue', delay: 0 },
    { number: '2K+', label: 'Events\nCelebrated', color: 'indigo', delay: 0.1 },
    { number: '15+', label: 'Cities\nWorldwide', color: 'blue', delay: 0.2 },
    { number: '99.9%', label: 'Satisfaction\nGuaranteed', color: 'indigo', delay: 0.3 },
  ]

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      className="relative py-24 lg:py-32 navy-bg border-y border-blue-500/20"
    >
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-400/10 to-transparent rounded-full blur-3xl"
          animate={{ y: [-50, 50, -50], x: [50, -50, 50] }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-indigo-400/10 to-transparent rounded-full blur-3xl"
          animate={{ y: [50, -50, 50], x: [-50, 50, -50] }}
          transition={{ duration: 18, repeat: Infinity, delay: 2 }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-20 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: stat.delay }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="group"
            >
              <div className={`glass-accent rounded-2xl p-6 lg:p-8 border transition-all duration-300 ${
                stat.color === 'blue'
                  ? 'border-blue-500/30 group-hover:border-blue-500/60 group-hover:shadow-gold-glow'
                  : 'border-indigo-500/30 group-hover:border-indigo-500/60 group-hover:shadow-purple-glow'
              }`}>
                {/* Number */}
                <motion.div
                  className={`text-3xl lg:text-4xl xl:text-5xl font-bold font-serif mb-4 ${
                    stat.color === 'blue' ? 'gradient-gold-text' : 'gradient-purple-text'
                  }`}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                >
                  {stat.number}
                </motion.div>

                {/* Label */}
                <p className="text-sm lg:text-base text-slate-700 font-medium whitespace-pre-line leading-relaxed">
                  {stat.label}
                </p>

                {/* Accent Line */}
                <motion.div
                  className={`mt-4 h-1 w-0 group-hover:w-full transition-all duration-300 rounded-full ${
                    stat.color === 'blue'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-400'
                      : 'bg-gradient-to-r from-indigo-500 to-indigo-400'
                  }`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}

export default TrustBar