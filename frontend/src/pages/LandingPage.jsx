import { motion } from 'framer-motion'
import { CheckCircle, Users, Zap, Shield, ArrowRight, Star } from 'lucide-react'
import Hero from '../components/Hero'
import CategoryGrid from '../components/CategoryGrid'
import TrustBar from '../components/TrustBar'
import Testimonials from '../components/Testimonials'
import { useNavigate } from 'react-router-dom'

const LandingPage = () => {
  const navigate = useNavigate()

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

  // Features Section Data
  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Verified Professionals',
      description: 'All vendors are thoroughly vetted and verified. Book with confidence.',
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Instant Booking',
      description: 'Quick and seamless booking process. Connect within minutes.',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Expert Support',
      description: '24/7 support team ready to assist with any questions.',
    },
  ]

  // Services Data
  const services = [
    {
      name: 'Photography',
      description: 'Professional photographers for your special moments',
      image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&w=400&fit=crop&crop=entropy&auto=format',
    },
    {
      name: 'Catering',
      description: 'Delicious cuisines and professional catering services',
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&fit=crop&auto=format',
    },
    {
      name: 'Decoration',
      description: 'Creative decoration to enhance your event',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&fit=crop&auto=format',
    },
  ]

  return (
    <>
      {/* Hero Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={itemVariants}
      >
        <Hero />
      </motion.div>

      {/* Trust Bar Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={itemVariants}
      >
        <TrustBar />
      </motion.div>

      {/* Features Section */}
      <section className="relative py-24 lg:py-32 navy-bg overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-1/2 left-0 w-96 h-96 bg-gradient-to-r from-indigo-400/10 to-transparent rounded-full blur-3xl"
            animate={{ y: [0, 50, 0], x: [-50, 50, -50] }}
            transition={{ duration: 15, repeat: Infinity }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-20 relative z-10">
          {/* Section Header */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="text-center mb-16 lg:mb-20"
          >
            <motion.h2
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-serif font-light mb-6 text-slate-900\"
            >
              Why Choose <span className="gradient-gold-text font-semibold">EventHub?</span>
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-slate-700 max-w-2xl mx-auto leading-relaxed"
            >
              Your trusted platform for connecting with premium event professionals
            </motion.p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid md:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="group relative glass-accent rounded-2xl p-8 lg:p-10 border border-blue-500/30 hover:border-blue-500/60 transition-all duration-300"
              >
                {/* Icon */}
                <div className="w-14 h-14 bg-gradient-to-br from-blue-400/25 to-indigo-400/25 rounded-xl flex items-center justify-center mb-6 text-blue-600 group-hover:text-blue-500 transition-colors">
                  {feature.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl lg:text-2xl font-semibold text-slate-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-slate-700 leading-relaxed">{feature.description}</p>

                {/* Hover Border Animation */}
                <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 w-0 group-hover:w-full transition-all duration-300 rounded-full" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-24 lg:py-32 bg-gradient-to-b overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-20">
          {/* Section Header */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="text-center mb-16 lg:mb-20"
          >
            <motion.h2
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-serif font-light mb-6 text-slate-900"
            >
              How It <span className="gradient-purple-text font-semibold">Works</span>
            </motion.h2>
          </motion.div>

          {/* Steps Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid md:grid-cols-3 gap-8 lg:gap-12"
          >
            {[
              {
                step: '01',
                title: 'Browse Vendors',
                description: 'Explore thousands of verified professionals in your area',
              },
              {
                step: '02',
                title: 'Compare & Connect',
                description: 'Review portfolios, pricing, and availability',
              },
              {
                step: '03',
                title: 'Book & Celebrate',
                description: 'Secure your booking and enjoy your event',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative"
              >
                <div className="glass-accent rounded-2xl p-8 lg:p-10 border border-indigo-500/30 h-full flex flex-col justify-between">
                  {/* Step Number */}
                  <div className="text-6xl lg:text-7xl font-serif font-light text-indigo-500/20 mb-4">
                    {item.step}
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="text-2xl lg:text-3xl font-semibold text-slate-900 mb-4">
                      {item.title}
                    </h3>
                    <p className="text-slate-700 leading-relaxed">{item.description}</p>
                  </div>
                </div>

                {/* Arrow */}
                {index < 2 && (
                  <div className="hidden md:flex absolute -right-6 top-1/2 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-blue-500" />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={itemVariants}
      >
        <CategoryGrid />
      </motion.div>

      {/* About Section */}
      <section className="relative py-24 lg:py-32 navy-bg overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-gold-500/10 to-transparent rounded-full blur-3xl"
            animate={{ y: [0, 50, 0], x: [50, -50, 50] }}
            transition={{ duration: 15, repeat: Infinity, delay: 2 }}
          />
        </div>

        <div className="max-w-5xl mx-auto px-6 lg:px-20 relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="text-center"
          >
            <motion.h2
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-serif font-light mb-8 text-slate-900"
            >
              About <span className="gradient-gold-text font-semibold">EventHub</span>
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-slate-700 leading-relaxed mb-8"
            >
              We believe every event deserves excellence. EventHub connects customers
              with verified professionals across photography, catering, decoration, and
              more. Our platform makes hiring top talent simple, transparent, and
              stress-free.
            </motion.p>
            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-slate-700 leading-relaxed mb-12"
            >
              Whether you're a professional looking to showcase your work or an organizer
              seeking the best vendors, EventHub is your trusted platform for success.
            </motion.p>

            <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-8">
              <div className="glass-accent rounded-2xl p-8 border border-gold-500/30">
                <h3 className="text-2xl font-semibold text-blue-600 mb-4">For Customers</h3>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-gold-500 flex-shrink-0" />
                    Browse verified professionals
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-gold-500 flex-shrink-0" />
                    Compare prices and portfolios
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-gold-500 flex-shrink-0" />
                    Book with confidence
                  </li>
                </ul>
              </div>

              <div className="glass-accent rounded-2xl p-8 border border-purple-500/30">
                <h3 className="text-2xl font-semibold text-indigo-600 mb-4">For Vendors</h3>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0" />
                    Showcase your portfolio
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0" />
                    Grow your business
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0" />
                    Connect with quality clients
                  </li>
                </ul>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={itemVariants}
      >
        <Testimonials />
      </motion.div>

      {/* Final CTA Section */}
      <section className="relative py-32 lg:py-48 navy-bg overflow-hidden border-t border-gold-500/20">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-gold-500/20 to-transparent rounded-full blur-3xl"
            animate={{ y: [-50, 50, -50] }}
            transition={{ duration: 12, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-500/20 to-transparent rounded-full blur-3xl"
            animate={{ y: [50, -50, 50] }}
            transition={{ duration: 14, repeat: Infinity }}
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
              className="text-4xl md:text-5xl lg:text-7xl font-serif font-light mb-8 text-slate-900 leading-tight"
            >
              Ready to Transform Your <span className="gradient-gold-text font-semibold">Event?</span>
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-slate-700 mb-12 leading-relaxed"
            >
              Join thousands of satisfied customers and professionals. Start your journey today.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button
                onClick={() => navigate('/signup?role=customer')}
                className="group btn-premium-gold inline-flex items-center justify-center gap-2 text-lg px-10 py-5"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-10 py-5 rounded-2xl border-2 border-blue-500/50 text-blue-600 font-semibold hover:bg-blue-500/10 hover:border-blue-500 transition-all duration-300 text-lg"
              >
                Sign In
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default LandingPage
