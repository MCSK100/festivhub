import { useRef, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const layers = [
  {
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
    speed: 0.2,
    zIndex: 1,
  },
  {
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&auto=format&fit=crop&q=80',
    speed: 0.4,
    zIndex: 2,
  },
  {
    image: 'https://images.unsplash.com/photo-1492684223066-87ee7f0b7f37?w=1200&auto=format&fit=crop&q=80',
    speed: 0.6,
    zIndex: 3,
  },
]

const ParallaxShowcase = () => {
  const sectionRef = useRef(null)
  const layersRef = useRef([])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  useEffect(() => {
    const ctx = gsap.context(() => {
      layersRef.current.forEach((layer, index) => {
        if (layer) {
          gsap.fromTo(
            layer,
            { y: 100 + index * 50, scale: 0.9 + index * 0.05 },
            {
              y: -100 - index * 50,
              scale: 1 + index * 0.05,
              ease: 'none',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
              },
            }
          )
        }
      })

      // Animate text content
      gsap.fromTo(
        '.parallax-title',
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.parallax-title',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      gsap.fromTo(
        '.parallax-desc',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.parallax-desc',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden flex items-center justify-center"
    >
      {/* Parallax Image Layers */}
      <div className="absolute inset-0">
        {layers.map((layer, index) => (
          <div
            key={index}
            ref={(el) => (layersRef.current[index] = el)}
            className="absolute inset-0 flex items-center justify-center parallax-layer"
            style={{ zIndex: layer.zIndex }}
          >
            <div className="relative w-[80%] max-w-4xl aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={layer.image}
                alt={`Parallax layer ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
            </div>
          </div>
        ))}
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div className="glass rounded-3xl p-12 lg:p-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-gold text-sm font-medium uppercase tracking-widest mb-4"
          >
            Immersive Design
          </motion.span>
          <h2 className="parallax-title text-4xl md:text-5xl lg:text-6xl font-display font-light mb-6 opacity-0">
            Every Layer Tells a{' '}
            <span className="gradient-gold">Story</span>
          </h2>
          <p className="parallax-desc text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed mb-8 opacity-0">
            Our events are built with depth and intention. Each element is carefully layered to create
            an immersive experience that engages all the senses.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary inline-flex items-center gap-2"
          >
            Explore Our Approach
          </motion.button>
        </div>
      </div>
    </section>
  )
}

export default ParallaxShowcase
