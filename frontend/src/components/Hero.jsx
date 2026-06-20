import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float, Particles, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

// 3D Scene Components
function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      className="absolute inset-0"
    >
      <color attach="background" args={['#050505']} />
      <fog attach="fog" args={['#050505', 5, 15]} />

      <ambientLight intensity={0.2} />
      <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={1} color="#C59D5F" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#FFD27D" />

      <FloatingStage />
      <Particles />

      <Environment preset="night" />
    </Canvas>
  )
}

function FloatingStage() {
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <icosahedronGeometry args={[1.5, 1]} />
        <MeshDistortMaterial
          color="#C59D5F"
          metalness={0.8}
          roughness={0.2}
          distort={0.3}
          speed={2}
          envMapIntensity={1}
        />
      </mesh>

      {/* Stage rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <torusGeometry args={[2.2, 0.02, 16, 100]} />
        <meshStandardMaterial color="#C59D5F" emissive="#C59D5F" emissiveIntensity={0.5} />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <torusGeometry args={[2.8, 0.01, 16, 100]} />
        <meshStandardMaterial color="#FFD27D" emissive="#FFD27D" emissiveIntensity={0.3} />
      </mesh>
    </Float>
  )
}

function Particles() {
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
        color="#C59D5F"
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

  useTextReveal(headingRef)

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    })
  }

  return (
    <section className="relative min-h-screen overflow-hidden premium-bg">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <HeroScene />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-premium-bg/50 via-transparent to-premium-bg z-[1]" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center items-center text-center px-6 pt-32 pb-20">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-3 px-5 py-2.5 glass rounded-full mb-8"
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
              <span className="char opacity-0 transform translate-y-full transition-all duration-700 ease-expo-out">
                Crafting
              </span>
            </span>
            <span className="block mb-4">
              <span className="char opacity-0 transform translate-y-full transition-all duration-700 ease-expo-out gradient-gold">
                Experiences
              </span>
            </span>
            <span className="block">
              <span className="char opacity-0 transform translate-y-full transition-all duration-700 ease-expo-out">
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-col sm:flex-row gap-4 mt-10"
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
      </div>
    </section>
  )
}

export default Hero

// Helper styles inline
const styles = `
  .ease-expo-out { transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1); }
  .char { display: inline-block; }
  .char.revealed { opacity: 1 !important; transform: translateY(0) !important; }
`