import { motion } from 'framer-motion'
import { CheckCircle, Heart, Zap, Globe, Users, Target, Award } from 'lucide-react'

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: 'easeOut' },
    },
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white overflow-hidden"
    >
      {/* Hero Section */}
      <section className="relative pt-40 pb-24 lg:py-48 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-gold/15 to-transparent rounded-full blur-3xl"
            animate={{ y: [0, 100, 0], x: [-50, 50, -50] }}
            transition={{ duration: 20, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tl from-gold/15 to-transparent rounded-full blur-3xl"
            animate={{ y: [0, -100, 0], x: [50, -50, 50] }}
            transition={{ duration: 25, repeat: Infinity, delay: 2 }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-20 relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center"
          >
            <motion.h1
              variants={itemVariants}
              className="text-6xl md:text-7xl lg:text-8xl font-serif font-light mb-8 text-gray-900"
            >
              About <span className="gradient-gold font-semibold">FestivLink</span>
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-2xl md:text-3xl lg:text-4xl font-light text-gray-500 max-w-4xl mx-auto leading-relaxed"
            >
              Simplifying event planning through verified professionals and seamless connections
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid md:grid-cols-3 gap-12 lg:gap-16"
          >
            {/* Mission */}
            <motion.div
              variants={itemVariants}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gold/20 to-gold/10 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
              <div className="relative glass-card rounded-3xl p-10 lg:p-12 border border-primary/10">
                <Target className="w-12 h-12 text-primary-dark mb-6" />
                <h3 className="text-3xl font-semibold text-gray-900 mb-4">Our Mission</h3>
                <p className="text-gray-500 leading-relaxed text-lg">
                  To revolutionize event planning by connecting organizers with verified professionals, making quality accessible and stress-free.
                </p>
              </div>
            </motion.div>

            {/* Vision */}
            <motion.div
              variants={itemVariants}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gold/20 to-gold/10 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
              <div className="relative glass-card rounded-3xl p-10 lg:p-12 border border-primary/10">
                <Globe className="w-12 h-12 text-primary-dark mb-6" />
                <h3 className="text-3xl font-semibold text-gray-900 mb-4">Our Vision</h3>
                <p className="text-gray-500 leading-relaxed text-lg">
                  A world where every celebration is powered by excellence, trust, and genuine human connection.
                </p>
              </div>
            </motion.div>

            {/* Purpose */}
            <motion.div
              variants={itemVariants}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gold/20 to-gold/10 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
              <div className="relative glass-card rounded-3xl p-10 lg:p-12 border border-primary/10">
                <Heart className="w-12 h-12 text-primary-dark mb-6" />
                <h3 className="text-3xl font-semibold text-gray-900 mb-4">Our Purpose</h3>
                <p className="text-gray-500 leading-relaxed text-lg">
                  Empowering both customers and professionals to create meaningful moments without compromise.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="relative py-24 lg:py-32 bg-gradient-to-br from-gold/5 via-transparent to-gold/5 overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 lg:px-20 relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            <motion.h2
              variants={itemVariants}
              className="text-5xl md:text-6xl lg:text-7xl font-serif font-light mb-12 text-gray-900"
            >
              Our <span className="gradient-gold font-semibold">Story</span>
            </motion.h2>
            
            <motion.div
              variants={itemVariants}
              className="space-y-8 text-lg md:text-xl text-gray-500 leading-relaxed"
            >
              <p>
                FestivLink was born from a real problem. Our founders struggled through countless events, dealing with unreliable vendors, broken promises, and endless coordination nightmares. We knew there had to be a better way.
              </p>
              <p>
                In 2024, we decided to build the platform we wished existed. Starting with photography and catering, we've grown to connect thousands of customers with verified professionals across music, decorations, event planning, makeup, and more.
              </p>
              <p>
                Today, FestivLink powers events across 120+ cities, with a 99.9% success rate and customers who genuinely love using our platform. But we're just getting started.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Core Values */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            <motion.h2
              variants={itemVariants}
              className="text-5xl md:text-6xl lg:text-7xl font-serif font-light mb-16 text-gray-900 text-center"
            >
              Our <span className="gradient-gold font-semibold">Values</span>
            </motion.h2>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {[
                {
                  title: 'Trust First',
                  description: 'Verified backgrounds, real portfolios, honest reviews. No compromises.',
                  icon: Award,
                },
                {
                  title: 'Customer Centric',
                  description: '24/7 support, dedicated to your success from booking to celebration.',
                  icon: Users,
                },
                {
                  title: 'Excellence',
                  description: 'Only the best professionals. Rigorous vetting for quality assurance.',
                  icon: Zap,
                },
                {
                  title: 'Innovation',
                  description: 'Constantly improving technology to solve real event planning problems.',
                  icon: Target,
                },
              ].map((value, index) => {
                const Icon = value.icon
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="group relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-gold/20 to-gold/10 rounded-2xl blur-2xl opacity-0 group-hover:opacity-30 transition-all duration-500" />
                    <div className="relative glass-card rounded-2xl p-8 group-hover:border-primary/30 transition-all duration-300 border border-primary/10">
                      <div className="w-10 h-10 mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary-dark" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{value.description}</p>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-24 lg:py-32 bg-gradient-to-r from-gold/10 via-gold/5 to-gold/10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12"
          >
            {[
              { number: '12K+', label: 'Active Professionals', icon: '👥' },
              { number: '75K+', label: 'Events Connected', icon: '🎉' },
              { number: '120+', label: 'Cities Covered', icon: '🌍' },
              { number: '99.9%', label: 'Success Rate', icon: '⭐' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="text-5xl md:text-6xl mb-6 group-hover:scale-110 transition-transform duration-300"
                >
                  {stat.icon}
                </motion.div>
                <h3 className="text-4xl md:text-5xl font-serif font-light text-gray-900 mb-3">
                  {stat.number}
                </h3>
                <p className="text-lg text-gray-500 font-light">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-gold/10 to-transparent rounded-full blur-3xl"
            animate={{ y: [-50, 50, -50] }}
            transition={{ duration: 12, repeat: Infinity }}
          />
        </div>

        <div className="max-w-4xl mx-auto px-6 lg:px-20 relative z-10 text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2
              variants={itemVariants}
              className="text-5xl md:text-6xl lg:text-7xl font-serif font-light mb-8 text-gray-900"
            >
              Ready to <span className="gradient-gold font-semibold">Join Us?</span>
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl text-gray-500 mb-12 leading-relaxed"
            >
              Whether you're looking to book incredible services or showcase your talent, FestivLink is your platform for success.
            </motion.p>
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-6 justify-center"
            >
              <button className="btn-primary px-10 py-4 text-lg font-semibold">
                Browse Professionals
              </button>
              <button className="btn-secondary px-10 py-4 text-lg font-semibold">
                Become a Professional
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}

export default About
