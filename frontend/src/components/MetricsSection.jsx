import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

// Animated counter hook
function useCounter(end, duration = 2) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  useEffect(() => {
    if (!isInView) return

    let startTime
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) {
        requestAnimationFrame(step)
      }
    }

    requestAnimationFrame(step)
  }, [isInView, end, duration])

  return { count, ref }
}

function Metric({ value, suffix, label }) {
  const { count, ref } = useCounter(value)

  return (
    <div ref={ref} className="text-center">
      <div className="text-5xl md:text-6xl lg:text-7xl font-display font-light gradient-gold mb-2">
        {count}
        {suffix && <span className="text-gold">{suffix}</span>}
      </div>
      <div className="text-gray-400 text-lg">{label}</div>
    </div>
  )
}

const MetricsSection = () => {
  return (
    <section className="relative py-24 lg:py-32 premium-bg overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-premium-bg via-premium-elevated to-premium-bg" />
      </div>

      {/* Decorative line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid md:grid-cols-3 gap-12 lg:gap-20">
          <Metric value={500} suffix="+" label="Events Managed" />
          <Metric value={200} suffix="+" label="Happy Clients" />
          <Metric value={50} suffix="+" label="Cities Worldwide" />
        </div>
      </div>

      {/* Decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
    </section>
  )
}

export default MetricsSection