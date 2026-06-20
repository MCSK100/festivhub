import { useEffect, useRef, useMemo } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// 3D Animated Background Scene
function HeroScene({ scrollProgress }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      className="absolute inset-0"
    >
      <color attach="background" args={['#FFFFFF']} />
      <fog attach="fog" args={['#FFFFFF', 8, 20]} />

      <ambientLight intensity={0.6} />
      <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={1.5} color="#FACC15" />
      <pointLight position={[-10, -10, -10]} intensity={0.8} color="#FDE68A" />
      <pointLight position={[0, 5, 5]} intensity={0.4} color="#FFFFFF" />

      <FloatingGeometry scrollProgress={scrollProgress} />
      <FloatingParticles />
      <AnimatedRings />
    </Canvas>
  )
}

function FloatingGeometry({ scrollProgress }) {
  const meshRef = useRef()
  const mesh2Ref = useRef()
  const mesh3Ref = useRef()

  useFrame((state) => {
    const scroll = scrollProgress?.current || 0
    const t = state.clock.elapsedTime

    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.15
      meshRef.current.rotation.x = t * 0.08 + scroll * 0.5
      meshRef.current.position.y = Math.sin(t * 0.4) * 0.3 - scroll * 3
      meshRef.current.position.x = Math.sin(t * 0.2) * 0.2
      meshRef.current.scale.setScalar(1.2 - scroll * 0.4)
    }
    if (mesh2Ref.current) {
      mesh2Ref.current.rotation.y = -t * 0.12
      mesh2Ref.current.rotation.z = t * 0.1
      mesh2Ref.current.position.y = Math.cos(t * 0.3) * 0.4 - 1.5 - scroll * 2
      mesh2Ref.current.position.x = Math.cos(t * 0.25) * 0.3 + 2
    }
    if (mesh3Ref.current) {
      mesh3Ref.current.rotation.x = t * 0.1
      mesh3Ref.current.rotation.z = -t * 0.08
      mesh3Ref.current.position.y = Math.sin(t * 0.35) * 0.3 - 1 - scroll * 1.5
      mesh3Ref.current.position.x = -2 + Math.sin(t * 0.15) * 0.2
    }
  })

  return (
    <>
      {/* Main central icosahedron */}
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
        <mesh ref={meshRef} position={[0, 0, 0]}>
          <icosahedronGeometry args={[1.3, 1]} />
          <MeshDistortMaterial
            color="#FACC15"
            metalness={0.3}
            roughness={0.4}
            distort={0.25}
            speed={1.5}
            transparent
            opacity={0.85}
          />
        </mesh>
      </Float>

      {/* Secondary dodecahedron */}
      <Float speed={2} rotationIntensity={0.4} floatIntensity={0.6}>
        <mesh ref={mesh2Ref} position={[2, -1.5, -1]}>
          <dodecahedronGeometry args={[0.6, 0]} />
          <meshStandardMaterial
            color="#FDE047"
            metalness={0.2}
            roughness={0.5}
            transparent
            opacity={0.7}
          />
        </mesh>
      </Float>

      {/* Tertiary octahedron */}
      <Float speed={1.8} rotationIntensity={0.5} floatIntensity={0.7}>
        <mesh ref={mesh3Ref} position={[-2, -1, -0.5]}>
          <octahedronGeometry args={[0.5, 0]} />
          <meshStandardMaterial
            color="#FDE68A"
            metalness={0.15}
            roughness={0.6}
            transparent
            opacity={0.6}
          />
        </mesh>
      </Float>
    </>
  )
}

function FloatingParticles() {
  const count = 200
  const particles = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 25
      pos[i + 1] = (Math.random() - 0.5) * 25
      pos[i + 2] = (Math.random() - 0.5) * 15
    }
    return pos
  }, [])

  const pointsRef = useRef()

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.015
      pointsRef.current.rotation.x = state.clock.elapsedTime * 0.008
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#EAB308"
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  )
}

function AnimatedRings() {
  const ring1Ref = useRef()
  const ring2Ref = useRef()
  const ring3Ref = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = t * 0.15
      ring1Ref.current.rotation.x = Math.PI / 3 + Math.sin(t * 0.2) * 0.1
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -t * 0.1
      ring2Ref.current.rotation.x = Math.PI / 4 + Math.cos(t * 0.15) * 0.1
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.z = t * 0.08
      ring3Ref.current.rotation.y = Math.PI / 5
    }
  })

  return (
    <>
      <mesh ref={ring1Ref} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[2.5, 0.015, 16, 100]} />
        <meshStandardMaterial color="#FACC15" emissive="#FACC15" emissiveIntensity={0.4} transparent opacity={0.6} />
      </mesh>
      <mesh ref={ring2Ref} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[3.2, 0.01, 16, 100]} />
        <meshStandardMaterial color="#FDE68A" emissive="#FDE68A" emissiveIntensity={0.3} transparent opacity={0.4} />
      </mesh>
      <mesh ref={ring3Ref} rotation={[Math.PI / 5, 0, 0]}>
        <torusGeometry args={[3.8, 0.008, 16, 100]} />
        <meshStandardMaterial color="#EAB308" emissive="#EAB308" emissiveIntensity={0.2} transparent opacity={0.3} />
      </mesh>
    </>
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
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
  }

  return (
    <section ref={sectionRef} className="relative min-h-[120vh] overflow-hidden bg-white">
      {/* 3D Animated Background */}
      <div className="absolute inset-0 z-0">
        <HeroScene scrollProgress={scrollProgress} />
      </div>

      {/* Subtle gradient overlay at bottom for seamless transition */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/10 to-white z-[1] pointer-events-none" />

      {/* Content */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity, scale }}
        className="relative z-10 min-h-screen flex flex-col justify-center items-center text-center px-6 pt-32 pb-20 sticky top-0"
      >
        {/* Badge */}
        <motion.div
          className="hero-badge inline-flex items-center gap-3 px-5 py-2.5 glass rounded-full mb-8 opacity-0"
        >
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <span className="text-sm font-medium text-primary-dark">
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
          <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-light leading-tight text-gray-900">
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
          className="text-lg md:text-xl lg:text-2xl text-gray-500 max-w-2xl mt-8 leading-relaxed"
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
            className="flex flex-col items-center gap-2 text-gray-400 hover:text-primary-dark transition-colors"
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
