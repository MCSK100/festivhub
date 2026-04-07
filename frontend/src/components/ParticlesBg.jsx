import { motion } from 'framer-motion'

const ParticlesBg = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Animated Gradient Blobs */}
      <motion.div 
        className="absolute top-20 left-10 w-80 h-80 lg:w-[500px] lg:h-[500px] bg-gradient-to-r from-gold-500/20 via-purple-500/15 to-gold-400/10 rounded-[50%] blur-3xl animate-blob1 opacity-70"
        animate={{
          scale: [1, 1.1, 1],
          x: [0, 20, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div 
        className="absolute bottom-32 right-20 w-[600px] h-[600px] lg:w-[800px] lg:h-[800px] bg-gradient-to-br from-purple-500/15 via-gold-400/10 to-purple-400/20 rounded-full blur-[150px] animate-blob2 opacity-60"
        animate={{
          scale: [1, 1.05, 1],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div 
        className="absolute -top-32 right-32 w-[400px] h-[400px] bg-gradient-to-t from-gold-400/25 via-purple-500/20 to-transparent rounded-[40%] blur-[100px] animate-blob3 opacity-50"
        animate={{
          scale: [1, 1.15, 1],
          x: [-20, 20, -20],
          y: [0, -30, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(200,169,106,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(200,169,106,0.03)_1px,transparent_1px)] bg-[size:50px_50px] opacity-30 animate-pulse" />
      
      {/* Floating Particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 lg:w-3 lg:h-3 bg-gold-400/80 rounded-full shadow-gold-glow blur-sm"
          style={{
            left: `${10 + (i * 15)}%`,
            top: `${20 + (i * 8)}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0.8, 0.3, 0.8],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 8 + i * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

export default ParticlesBg

