import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float, MeshDistortMaterial } from '@react-three/drei'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// 3D Scene Components
function HeroScene({ scrollProgress }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      className="absolute inset-0"
    >
      <color attach="background" args={['#0A0A0A']} />
      <fog attach="fog" args={['#0A0A0A', 5, 15]} />

      <ambientLight intensity={0.2} />
      <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={1} color="#FACC15" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#FDE68A" />

      <FloatingStage scrollProgress={scrollProgress} />
      <ParticleField />

      <Environment preset="night" />
    </Canvas>
  )
}

function FloatingStage({ scrollProgress }) {
  const meshRef = useRef()
  const ring1Ref = useRef()
  const ring2Ref = useRef()

  useFrame((state) => {
    const scroll = scrollProgress?.current || 0
    const baseSpeed = 0.1 + scroll * 0.5

    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * baseSpeed
      meshRef.current.rotation.x = scroll * 0.5
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1 - scroll * 2
      meshRef.current.scale.setScalar(1 - scroll * 0.3)
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = state.clock.elapsedTime * (0.2 + scroll * 0.3)
      ring1Ref.current.rotation.x = Math.PI / 2 + scroll * 0.3
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -(state.clock.elapsedTime * (0.15 + scroll * 0.2))
      ring2Ref.current.rotation.x = Math.PI / 2 - scroll * 0.2
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <icosahedronGeometry args={[1.5, 1]} />
        <MeshDistortMaterial
          color="#FACC15"
          metalness={0.8}
          roughness={0.2}
          distort={0.3}
          speed={2}
          envMapIntensity={1}
        />
      </mesh>

      {/* Stage rings */}
      <mesh ref={ring1Ref} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <torusGeometry args={[2.2, 0.02, 16, 100]} />
        <meshStandardMaterial color="#FACC15" emissive="#FACC15" emissiveIntensity={0.5} />
      </mesh>

      <mesh ref={ring2Ref} rotation={[Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <torusGeometry args={[2.8, 0.01, 16, 100]} />
        <meshStandardMaterial color="#FDE68A" emissive="#FDE68A" emissiveIntensity={0.3} />
      </mesh>
    </Float>
  )
}

function ParticleField() {
  const count = 500
  const positions = new Float32Array(count * 3)

  for (let i = 0; i < count * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 20
    positions[i + 1] = (Math.random() - 0.5) * 20
    positions[i + 2] = (Math.random() - 0.5) * 20
  }

  const pointsRef = useRef()

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#FACC15"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

// Text reveal hook
function useTextReveal(ref, delay = 0) {
  useEffect(() => {
    const el = ref.current
    if (el) {
      const chars = el.querySelectorAll('.char')
      chars.forEach((char, i) => {
        char.style.transitionDelay = `${delay + i * 0.05}s`
      })
      setTimeout(() => {
        chars.forEach((char) => char.classList.add('revealed'))
      }, 100)
    }
  }, [delay])
}

// Hero component
const Hero = () => {
  const navigate = useNavigate()
  const headingRef = useRef(null)
  const subRef = useRef(null)
  const sectionRef = useRef(null)
  const scrollProgress = useRef(0)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const contentY = useTransform(scrollYProgress, [0, 1], [0, 150])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85])

  useTextReveal(headingRef)

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (v) => {
      scrollProgress.current = v
    })
    return unsubscribe
  }, [scrollYProgress])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-badge',
        { opacity: 0, y: 30, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power3.out', delay: 0.2 }
      )
      gsap.fromTo('.hero-cta',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 1 }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    })
  }

  return (
    <section ref={sectionRef} className="relative min-h-[120vh] overflow-hidden premium-bg">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <HeroScene scrollProgress={scrollProgress} />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-premium-bg/50 via-transparent to-premium-bg z-[1]" />

      {/* Content */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity, scale }}
        className="relative z-10 min-h-screen flex flex-col justify-center items-center text-center px-6 pt-32 pb-20 sticky top-0"
      >
        {/* Badge */}
        <motion.div
          className="hero-badge inline-flex items-center gap-3 px-5 py-2.5 glass rounded-full mb-8 opacity-0"
        >
          <div className="w-2 h-2 bg-gold rounded-full animate-pulse" />
          <span className="text-sm font-medium text-gold">
            Premium Event Experiences
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="max-w-5xl"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-light leading-tight">
            <span className="block mb-4">
              <span className="char opacity-0 transform translate-y-full transition-all duration-700 ease-out">
                Crafting
              </span>
            </span>
            <span className="block mb-4">
              <span className="char opacity-0 transform translate-y-full transition-all duration-700 ease-out gradient-gold">
                Experiences
              </span>
            </span>
            <span className="block">
              <span className="char opacity-0 transform translate-y-full transition-all duration-700 ease-out">
                That Leave Lasting Impressions
              </span>
            </span>
          </h1>
        </motion.div>

        {/* Subheading */}
        <motion.p
          ref={subRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-lg md:text-xl lg:text-2xl text-gray-400 max-w-2xl mt-8 leading-relaxed"
        >
          We don't just plan events — we create moments that transform brands,
          unite communities, and celebrate life's milestones.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="hero-cta flex flex-col sm:flex-row gap-4 mt-10 opacity-0"
        >
          <button
            onClick={() => navigate('/contact')}
            className="btn-primary inline-flex items-center justify-center gap-2 group"
          >
            <span>Plan Your Event</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => navigate('/portfolio')}
            className="btn-secondary inline-flex items-center justify-center gap-2"
          >
            <span>View Portfolio</span>
          </button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <button
            onClick={scrollToContent}
            className="flex flex-col items-center gap-2 text-gray-500 hover:text-gold transition-colors"
          >
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <ChevronDown className="w-5 h-5 animate-bounce" />
          </button>
        </motion.div>
      </motion.div>

      {/* Helper styles */}
      <style>{`
        .ease-out { transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1); }
        .char { display: inline-block; }
        .char.revealed { opacity: 1 !important; transform: translateY(0) !important; }
      `}</style>
    </section>
  )
}

export default Hero
