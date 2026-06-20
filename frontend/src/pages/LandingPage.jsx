import { Suspense, useEffect, useRef } from 'react'
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
import VideoShowcase from '../components/VideoShowcase'
import ParallaxShowcase from '../components/ParallaxShowcase'

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
  const mainRef = useRef(null)

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

    // GSAP ScrollTrigger parallax effects for sections
    const ctx = gsap.context(() => {
      // Services section parallax
      gsap.fromTo('.services-section',
        { opacity: 0, y: 60, scale: 0.98 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.services-section',
            start: 'top 85%',
            end: 'top 40%',
            scrub: 1,
          },
        }
      )

      // Featured events parallax
      gsap.fromTo('.featured-events',
        { opacity: 0, y: 80 },
        {
          opacity: 1, y: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.featured-events',
            start: 'top 85%',
            end: 'top 35%',
            scrub: 1,
          },
        }
      )

      // Process section - 3D tilt on scroll
      gsap.fromTo('.process-section',
        { rotateX: 5, opacity: 0 },
        {
          rotateX: 0, opacity: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.process-section',
            start: 'top 80%',
            end: 'top 40%',
            scrub: 1,
          },
        }
      )

      // Awards cards stagger
      gsap.fromTo('.awards-section .glass-card',
        { y: 40, opacity: 0, rotateY: -5 },
        {
          y: 0, opacity: 1, rotateY: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.awards-section',
            start: 'top 80%',
          },
        }
      )

      // FAQ section scale entrance
      gsap.fromTo('.faq-section',
        { scale: 0.95, opacity: 0 },
        {
          scale: 1, opacity: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.faq-section',
            start: 'top 80%',
          },
        }
      )

      // Contact section slide-in
      gsap.fromTo('.contact-section',
        { x: -50, opacity: 0 },
        {
          x: 0, opacity: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.contact-section',
            start: 'top 80%',
          },
        }
      )
    }, mainRef)

    return () => {
      lenis.destroy()
      gsap.ticker.lagSmoothing(false)
      ctx.revert()
    }
  }, [])

  return (
    <main ref={mainRef} className="bg-premium-bg min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Trust Bar / Marquee */}
      <TrustBar />

      {/* Services Showcase */}
      <div className="services-section">
        <ServicesSection />
      </div>

      {/* Metrics */}
      <MetricsSection />

      {/* Event Categories */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={itemVariants}
      >
        <CategoryGrid />
      </motion.div>

      {/* Featured Events Gallery */}
      <div className="featured-events">
        <FeaturedEventsSection />
      </div>

      {/* Video Showcase */}
      <VideoShowcase />

      {/* Process Timeline */}
      <div className="process-section" style={{ perspective: '1000px' }}>
        <ProcessSection />
      </div>

      {/* Parallax Showcase */}
      <ParallaxShowcase />

      {/* Awards */}
      <div className="awards-section">
        <AwardsSection />
      </div>

      {/* FAQ */}
      <div className="faq-section">
        <FAQSection />
      </div>

      {/* Contact / Lead Gen */}
      <div className="contact-section">
        <ContactSection />
      </div>
    </main>
  )
}

export default LandingPage
