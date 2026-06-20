import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const videos = [
  { id: 1, title: 'Grand Innovation Summit 2025', description: 'A cutting-edge corporate event featuring immersive tech experiences and world-class speakers.', youtubeId: 'dQw4w9WgXcQ', category: 'Corporate' },
  { id: 2, title: 'Eclipse Music Festival', description: 'Three days of unforgettable music, art installations, and community celebration.', youtubeId: '9bZkp7q19f0', category: 'Festival' },
  { id: 3, title: 'Celestial Wedding Collection', description: 'Breathtaking wedding designs that transform venues into magical experiences.', youtubeId: 'kJQP7kiw5Fk', category: 'Wedding' },
]

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } }
const itemVariants = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } } }

const VideoShowcase = () => {
  return (
    <section className="relative py-24 lg:py-32 bg-gray-50 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={containerVariants} className="text-center mb-16 lg:mb-20">
          <motion.span variants={itemVariants} className="inline-block text-primary-dark text-sm font-medium uppercase tracking-widest mb-4">See Our Work</motion.span>
          <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl lg:text-6xl font-display font-light mb-6 text-gray-900">
            Event <span className="gradient-gold">Highlights</span>
          </motion.h2>
          <motion.p variants={itemVariants} className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Watch our most spectacular events come to life through immersive video experiences.
          </motion.p>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video) => (
            <motion.div key={video.id} variants={itemVariants} whileHover={{ y: -8, transition: { duration: 0.3 } }} className="group">
              <div className="glass-card rounded-2xl overflow-hidden shadow-card">
                <div className="relative aspect-video">
                  <iframe src={`https://www.youtube.com/embed/${video.youtubeId}?rel=0&modestbranding=1`} title={video.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full" loading="lazy" />
                </div>
                <div className="p-6">
                  <span className="inline-block text-primary-dark text-xs font-medium uppercase tracking-widest mb-2">{video.category}</span>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-dark transition-colors">{video.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{video.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={containerVariants} className="mt-16">
          <motion.div variants={itemVariants} className="glass-card rounded-2xl overflow-hidden shadow-card">
            <div className="relative aspect-[21/9]">
              <iframe src="https://www.youtube.com/embed/LXb3EKWsInQ?rel=0&modestbranding=1" title="FestivLink - Premium Event Experiences" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full" loading="lazy" />
            </div>
            <div className="p-8 text-center">
              <h3 className="text-2xl lg:text-3xl font-display font-light text-gray-900 mb-3">
                Experience the <span className="gradient-gold">FestivLink Difference</span>
              </h3>
              <p className="text-gray-500 max-w-2xl mx-auto">From concept to execution, watch how we transform ordinary spaces into extraordinary experiences.</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default VideoShowcase
