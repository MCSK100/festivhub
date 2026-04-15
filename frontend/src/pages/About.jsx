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
      className="min-h-screen navy-bg overflow-hidden"
    >
      {/* Hero Section */}
      <section className="relative pt-40 pb-24 lg:py-48 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/15 to-transparent rounded-full blur-3xl"
            animate={{ y: [0, 100, 0], x: [-50, 50, -50] }}
            transition={{ duration: 20, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tl from-indigo-400/15 to-transparent rounded-full blur-3xl"
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
              className="text-6xl md:text-7xl lg:text-8xl font-serif font-light mb-8 text-slate-900"
            >
              About <span className="gradient-gold-text font-semibold">FestivLink</span>
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-2xl md:text-3xl lg:text-4xl font-light text-slate-700 max-w-4xl mx-auto leading-relaxed"
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
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
              <div className="relative backdrop-blur-xl bg-blue-500/10 rounded-3xl p-10 lg:p-12">
                <Target className="w-12 h-12 text-blue-600 mb-6" />
                <h3 className="text-3xl font-semibold text-slate-900 mb-4">Our Mission</h3>
                <p className="text-slate-700 leading-relaxed text-lg">
                  To revolutionize event planning by connecting organizers with verified professionals, making quality accessible and stress-free.
                </p>
              </div>
            </motion.div>

            {/* Vision */}
            <motion.div
              variants={itemVariants}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-blue-500/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
              <div className="relative backdrop-blur-xl bg-indigo-500/10 rounded-3xl p-10 lg:p-12">
                <Globe className="w-12 h-12 text-indigo-600 mb-6" />
                <h3 className="text-3xl font-semibold text-slate-900 mb-4">Our Vision</h3>
                <p className="text-slate-700 leading-relaxed text-lg">
                  A world where every celebration is powered by excellence, trust, and genuine human connection.
                </p>
              </div>
            </motion.div>

            {/* Purpose */}
            <motion.div
              variants={itemVariants}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
              <div className="relative backdrop-blur-xl bg-blue-500/10 rounded-3xl p-10 lg:p-12">
                <Heart className="w-12 h-12 text-blue-600 mb-6" />
                <h3 className="text-3xl font-semibold text-slate-900 mb-4">Our Purpose</h3>
                <p className="text-slate-700 leading-relaxed text-lg">
                  Empowering both customers and professionals to create meaningful moments without compromise.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="relative py-24 lg:py-32 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5 overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 lg:px-20 relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            <motion.h2
              variants={itemVariants}
              className="text-5xl md:text-6xl lg:text-7xl font-serif font-light mb-12 text-slate-900"
            >
              Our <span className="gradient-gold-text font-semibold">Story</span>
            </motion.h2>
            
            <motion.div
              variants={itemVariants}
              className="space-y-8 text-lg md:text-xl text-slate-700 leading-relaxed"
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
              className="text-5xl md:text-6xl lg:text-7xl font-serif font-light mb-16 text-slate-900 text-center"
            >
              Our <span className="gradient-gold-text font-semibold">Values</span>
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
                  color: 'from-blue-500 to-blue-600',
                },
                {
                  title: 'Customer Centric',
                  description: '24/7 support, dedicated to your success from booking to celebration.',
                  icon: Users,
                  color: 'from-indigo-500 to-indigo-600',
                },
                {
                  title: 'Excellence',
                  description: 'Only the best professionals. Rigorous vetting for quality assurance.',
                  icon: Zap,
                  color: 'from-blue-500 to-indigo-600',
                },
                {
                  title: 'Innovation',
                  description: 'Constantly improving technology to solve real event planning problems.',
                  icon: Target,
                  color: 'from-indigo-500 to-blue-500',
                },
              ].map((value, index) => {
                const Icon = value.icon
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="group relative"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${value.color} rounded-2xl blur-2xl opacity-0 group-hover:opacity-30 transition-all duration-500`} />
                    <div className="relative backdrop-blur-xl bg-white/5 rounded-2xl p-8 group-hover:bg-white/10 transition-all duration-300">
                      <Icon className="w-10 h-10 mb-4 text-transparent bg-gradient-to-r bg-clip-text" style={{ backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))` }} />
                      <div className={`w-10 h-10 mb-4 rounded-xl bg-gradient-to-br ${value.color} flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-3">{value.title}</h3>
                      <p className="text-slate-700 text-sm leading-relaxed">{value.description}</p>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-24 lg:py-32 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-blue-500/10 overflow-hidden">
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
                <h3 className="text-4xl md:text-5xl font-serif font-light text-slate-900 mb-3">
                  {stat.number}
                </h3>
                <p className="text-lg text-slate-700 font-light">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-gold-500/10 to-transparent rounded-full blur-3xl"
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
              className="text-5xl md:text-6xl lg:text-7xl font-serif font-light mb-8 text-slate-900"
            >
              Ready to <span className="gradient-gold-text font-semibold">Join Us?</span>
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl text-slate-700 mb-12 leading-relaxed"
            >
              Whether you're looking to book incredible services or showcase your talent, FestivLink is your platform for success.
            </motion.p>
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-6 justify-center"
            >
              <button className="btn-premium-gold px-10 py-4 text-lg font-semibold">
                Browse Professionals
              </button>
              <button className="px-10 py-4 rounded-2xl border-2 border-blue-500/50 text-blue-600 font-semibold hover:bg-blue-500/10 transition-all duration-300">
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
