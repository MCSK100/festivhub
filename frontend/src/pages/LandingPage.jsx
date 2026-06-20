import { Suspense, useEffect } from 'react'
import { motion } from 'framer-motion'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Components
import Hero from '../components/Hero'
import ServicesSection from '../components/ServicesSection'
import MetricsSection from '../components/MetricsSection'
import ProcessSection from '../components/ProcessSection'
import FAQSection from '../components/FAQSection'
import ContactSection from '../components/ContactSection'
import AwardsSection from '../components/AwardsSection'
import FeaturedEventsSection from '../components/FeaturedEventsSection'
import TrustBar from '../components/TrustBar'
import CategoryGrid from '../components/CategoryGrid'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: 'easeOut' },
  },
}

const LandingPage = () => {
  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      smoothTouch: false,
    })

    // Integrate with GSAP
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => lenis.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      gsap.ticker.lagSmoothing(false)
    }
  }, [])

  return (
    <main className="bg-premium-bg min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Trust Bar / Marquee */}
      <TrustBar />

      {/* Services Showcase */}
      <ServicesSection />

      {/* Metrics */}
      <MetricsSection />

      {/* Event Categories (CategoryGrid already exists) */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={itemVariants}
      >
        <CategoryGrid />
      </motion.div>

      {/* Featured Events Gallery */}
      <FeaturedEventsSection />

      {/* Process Timeline */}
      <ProcessSection />

      {/* Testimonials (existing component) */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={itemVariants}
      >
        <CategoryGrid />
      </motion.div>

      {/* Awards */}
      <AwardsSection />

      {/* FAQ */}
      <FAQSection />

      {/* Contact / Lead Gen */}
      <ContactSection />
    </main>
  )
}

export default LandingPage