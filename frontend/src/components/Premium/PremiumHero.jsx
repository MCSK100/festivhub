import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeroScene from '../3D/HeroScene';

gsap.registerPlugin(ScrollTrigger);

/**
 * Premium Hero Component
 * Full-screen cinematic hero with 3D scene and animations
 */
const PremiumHero = () => {
  const heroRef = useRef(null);
  const contentRef = useRef(null);
  const headlineRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    // Animate headline on load
    gsap.fromTo(
      headlineRef.current,
      {
        opacity: 0,
        y: 50,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out',
        delay: 0.3,
      }
    );

    // Animate subtitle
    gsap.fromTo(
      subtitleRef.current,
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out',
        delay: 0.6,
      }
    );

    // Animate CTA button
    gsap.fromTo(
      ctaRef.current,
      {
        opacity: 0,
        scale: 0.9,
      },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: 'back.out',
        delay: 0.9,
      }
    );

    // Parallax effect on scroll
    gsap.to(contentRef.current, {
      y: 100,
      opacity: 0.5,
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        markers: false,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div
      ref={heroRef}
      className="relative w-full h-screen overflow-hidden bg-[#050505]"
    >
      {/* 3D Hero Scene */}
      <div className="absolute inset-0 z-0">
        <HeroScene />
      </div>

      {/* Content Overlay */}
      <div
        ref={contentRef}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 lg:px-20"
      >
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/30 to-[#050505] pointer-events-none" />

        {/* Content Container */}
        <div className="relative z-20 text-center max-w-4xl">
          {/* Headline */}
          <h1
            ref={headlineRef}
            className="text-5xl md:text-6xl lg:text-7xl font-serif font-light mb-6 text-white leading-tight"
          >
            Crafting Experiences That
            <span className="block text-[#C59D5F] font-semibold">
              Leave Lasting Impressions
            </span>
          </h1>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-12 leading-relaxed"
          >
            Connect with elite vendors and professionals. Create extraordinary events
            with verified talent across photography, catering, decoration, and more.
          </p>

          {/* CTA Buttons */}
          <div
            ref={ctaRef}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            {/* Primary CTA */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 lg:px-12 py-4 bg-[#C59D5F] text-white font-semibold rounded-lg hover:bg-[#B8915A] transition-all duration-300 shadow-lg hover:shadow-[0_20px_40px_rgba(197,157,95,0.3)]"
            >
              Plan Your Event
            </motion.button>

            {/* Secondary CTA */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 lg:px-12 py-4 border-2 border-[#C59D5F] text-[#C59D5F] font-semibold rounded-lg hover:bg-[#C59D5F]/10 transition-all duration-300"
            >
              Explore Vendors
            </motion.button>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-[#FFD27D]"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.div>
        </div>
      </div>

      {/* Floating Particles Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#FFD27D] rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: Math.random() * 0.5,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default PremiumHero;
