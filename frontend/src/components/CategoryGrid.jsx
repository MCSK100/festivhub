import { motion } from 'framer-motion'

const CategoryGrid = () => {
  const categories = [
    { 
      name: 'Photography', 
      icon: '📸', 
      image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&w=800&fit=crop&crop=entropy&auto=format',
      gradient: 'from-sky-500/20 via-sky-400/15 to-sky-300/10'
    },
    { 
      name: 'Catering', 
      icon: '🍽️', 
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&fit=crop&crop=face&auto=format',
      gradient: 'from-sky-400/20 via-sky-500/15 to-sky-400/10'
    },
    { 
      name: 'Decorations', 
      icon: '✨', 
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&fit=crop&auto=format',
      gradient: 'from-sky-500/25 via-sky-400/20 to-sky-500/15'
    },
    { 
      name: 'Music & DJ', 
      icon: '🎵', 
      image: 'https://images.unsplash.com/photo-1576693936061-7f0a92a47d94?w=800&fit=crop&crop=face&auto=format',
      gradient: 'from-sky-400/20 to-sky-300/20'
    },
    { 
      name: 'Makeup & Beauty', 
      icon: '💄', 
      image: 'https://images.unsplash.com/photo-1625772299848-361b80395917?w=800&fit=crop&crop=face&auto=format',
      gradient: 'from-sky-500/15 via-sky-400/25 to-sky-300/10'
    },
    {
      name: 'Event Planners', 
      icon: '🎪',
      image: 'https://images.unsplash.com/photo-1558618047-7facc92277e1?w=800&fit=crop&auto=format',
      gradient: 'from-sky-400/15 to-sky-500/20'
    },
    {
      name: 'Lighting', 
      icon: '💡',
      image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24f?w=800&fit=crop&auto=format',
      gradient: 'from-sky-300/20 via-sky-400/15 to-sky-500/10'
    }
  ]

  return (
    <motion.section 
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="py-24 lg:py-32 bg-gradient-to-b from-white to-gray-50"
    >
      <div className="max-w-7xl mx-auto px-8 lg:px-20">
        <div className="text-center mb-16 lg:mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl lg:text-7xl xl:text-8xl font-serif font-light italic bg-gradient-to-r from-sky-500 via-sky-400 to-sky-500 bg-clip-text text-transparent mb-8 leading-none shadow-lg"
          >
            Explore<br />Specialties
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl lg:text-3xl font-light text-slate-600 max-w-3xl mx-auto leading-relaxed"
          >
            Premium specialists across every event category
          </motion.p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-6 lg:gap-8">
          {categories.map((cat, index) => (
            <motion.div 
              key={cat.name} 
              className="group cursor-pointer"
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.05 }}
              whileHover={{ 
                scale: 1.1, 
                y: -12,
                transition: { duration: 0.3, ease: 'easeOut' }
              }}
            >
              <div 
                className="w-full h-48 lg:h-56 rounded-3xl hover:scale-110 transition-all duration-500 shadow-lg hover:shadow-2xl border border-gray-100 hover:border-sky-300 relative overflow-hidden bg-gradient-to-br from-white to-gray-50 hover:brightness-110"
                style={{ 
                  backgroundImage: `url(${cat.image})`, 
                  backgroundSize: 'cover', 
                  backgroundPosition: 'center'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/30 via-transparent to-transparent" />
                
                <motion.div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm"
                  style={{ backgroundImage: `linear-gradient(45deg, ${cat.gradient})` }}
                />
                
                <motion.div 
                  className="absolute top-8 left-1/2 -translate-x-1/2 w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-sky-400 to-sky-500 rounded-2xl flex items-center justify-center shadow-lg border-4 border-white/30 z-10 group-hover:scale-110 transition-all duration-500"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 4 + index * 0.5, repeat: Infinity, ease: 'linear' }}
                >
                  <span className="text-2xl lg:text-3xl drop-shadow-lg">{cat.icon}</span>
                </motion.div>
                
                <div className="absolute bottom-6 left-4 right-4 text-center">
                  <motion.span 
                    className="font-serif text-xl lg:text-2xl text-slate-900/95 font-light leading-tight group-hover:text-sky-500 transition-all duration-500 shadow-lg"
                    whileHover={{ scale: 1.05 }}
                  >
                    {cat.name}
                  </motion.span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}

export default CategoryGrid

