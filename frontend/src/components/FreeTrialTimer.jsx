import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

const FreeTrialTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 29, hours: 23, minutes: 59, seconds: 59 })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev
        
        if (seconds > 0) {
          seconds--
        } else if (minutes > 0) {
          seconds = 59
          minutes--
        } else if (hours > 0) {
          seconds = 59
          minutes = 59
          hours--
        } else if (days > 0) {
          seconds = 59
          minutes = 59
          hours = 23
          days--
        }
        
        return { days, hours, minutes, seconds }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="group relative px-6 py-3 bg-gradient-to-r from-gold-500/20 to-purple-500/20 backdrop-blur-xl rounded-3xl border border-gold-400/50 shadow-gold-glow ring-2 ring-gold-500/30 hover:shadow-gold-glow-lg hover:scale-105 transition-all duration-500 flex items-center space-x-3"
      whileHover={{ y: -2 }}
    >
      <motion.div 
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="w-6 h-6 bg-gold-400 rounded-full shadow-gold-glow"
      />
      <div className="flex items-baseline space-x-1 text-sm font-bold">
        <span className="text-gold-400 drop-shadow-lg">🎉 Free for 30 Days</span>
        <span className="text-xs text-slate-300">– Limited Offer</span>
      </div>
      <div className="text-xs font-mono text-slate-200 ml-2 space-x-1">
        <span>{timeLeft.days.toString().padStart(2, '0')}d</span>
        <span>:</span>
        <span>{timeLeft.hours.toString().padStart(2, '0')}h</span>
        <span>:</span>
        <span>{timeLeft.minutes.toString().padStart(2, '0')}m</span>
        <span>:</span>
        <span>{timeLeft.seconds.toString().padStart(2, '0')}s</span>
      </div>
    </motion.div>
  )
}

export default FreeTrialTimer

