import { motion } from 'framer-motion'

const CategoryGrid = () => {
  const categories = [
    {
      name: 'Photography',
      icon: '📸',
      image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2F0ZXJpbmd8ZW58MHx8MHx8fDI%3D',
      color: 'from-blue-400/15',
    },
    {
      name: 'Catering',
      icon: '🍽️',
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&fit=crop&crop=face&auto=format',
      color: 'from-indigo-400/15',
    },
    {
      name: 'Decorations',
      icon: '✨',
      image: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZGVjb3JhdGlvbnxlbnwwfHwwfHx8Mg%3D%3D',
      color: 'from-blue-400/15',
    },
    {
      name: 'Music & DJ',
      icon: '🎵',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8bXVzaWN8ZW58MHx8MHx8fDI%3D',
      color: 'from-indigo-400/15',
    },
    {
      name: 'Makeup & Beauty',
      icon: '💄',
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWFrZXVwfGVufDB8fDB8fHwy',
      color: 'from-blue-400/15',
    },
    {
      name: 'Event Planners',
      icon: '🎪',
      image: 'https://images.unsplash.com/photo-1712903276180-eda90d32c182?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZXZlbnQlMjBwbGFuZXJ8ZW58MHx8MHx8fDI%3D',
      color: 'from-indigo-400/15',
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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  }

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={containerVariants}
      className="relative py-24 lg:py-32 navy-bg overflow-hidden"
    >
      {/* Background Gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-transparent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
          animate={{ y: [0, 50, 0], x: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
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
            className="text-4xl md:text-5xl lg:text-6xl font-serif font-light text-slate-900 mb-6"
          >
            Explore <span className="gradient-gold-text font-semibold">Categories</span>
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-slate-700 max-w-2xl mx-auto leading-relaxed"
          >
            Discover premium specialists across every event category
          </motion.p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 lg:gap-6"
        >
          {categories.map((cat, index) => (
            <motion.div
              key={cat.name}
              variants={itemVariants}
              whileHover={{ y: -15, transition: { duration: 0.3 } }}
              className="group cursor-pointer"
            >
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden">
                {/* Background Image */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url(${cat.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 via-navy-900/30 to-transparent" />
                </div>

                {/* Hover Overlay */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${cat.color} via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm`}
                />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                  {/* Icon */}
                  {/* <motion.div
                    className="text-4xl lg:text-5xl mb-3 drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
                    whileHover={{ scale: 1.15 }}
                  >
                    
                  </motion.div> */}

                  {/* Text */}
                  <motion.span
                    className="text-center  text-2xl  drop-shadow-lg opacity-0 group-hover:opacity-100  transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                  >
                    {cat.name}
                  </motion.span>
                </div>

                {/* Border Animation */}
                <motion.div
                  className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-gold-500/50 transition-all duration-300"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}

export default CategoryGrid

