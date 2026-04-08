import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import FreeTrialTimer from '../components/FreeTrialTimer'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const result = await login(email, password)
    if (result.success) {
      setSuccess('Login successful!')
      setTimeout(() => navigate('/dashboard'), 1000)
    } else {
      setError(result.error)
    }
    setLoading(false)
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen navy-bg flex items-center justify-center relative overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold-500/10 via-purple-500/5 to-transparent opacity-60" />
      
      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-16 lg:gap-24 items-center lg:items-stretch px-6 lg:px-12 relative z-10">
        {/* Left Hero Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.92, x: -40 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:w-1/2 h-[650px] lg:h-[750px] rounded-[4rem] overflow-hidden relative navy-glass shadow-hero-glow border border-gold-400/40 hover:shadow-[0_0_80px_rgba(200,169,106,0.3)] transition-all duration-700"
        >
          <img 
            src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&w=1400&fit=crop&crop=entropy&auto=format" 
            alt="Premium event setup"
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900/70 via-transparent to-transparent backdrop-blur-sm" />
          <div className="absolute bottom-12 left-12 right-12 text-white/95 backdrop-blur-xl">
            <motion.h2 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-5xl lg:text-7xl xl:text-8xl font-serif font-light italic mb-6 leading-none shadow-2xl drop-shadow-2xl"
            >
              Premium Talent.
            </motion.h2>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl lg:text-3xl leading-relaxed backdrop-blur-md font-light"
            >
              Extraordinary Results.
              <br />
              <span className="block mt-4 text-gold-300 font-serif italic text-xl lg:text-2xl shadow-gold-glow">
                Your vision, perfectly executed.
              </span>
            </motion.p>
          </div>
        </motion.div>

        {/* Right Form Card */}
        <div className="lg:w-1/2 max-w-2xl flex flex-col justify-center lg:pl-12">
          {/* Trial Timer Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 self-center"
          >
            <FreeTrialTimer />
          </motion.div>
          
          <motion.div 
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="navy-glass backdrop-blur-3xl rounded-[4rem] p-12 lg:p-16 shadow-hero-glow border border-gold-400/40 hover:shadow-[0_0_60px_rgba(200,169,106,0.4)] hover:border-gold-500/60 transition-all duration-700"
          >
            <div className="text-center mb-12 lg:mb-16">
              <motion.h1 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-5xl lg:text-7xl xl:text-8xl font-serif font-light italic bg-gradient-to-r from-gold-400 via-purple-500 to-gold-500 bg-clip-text text-transparent mb-6 shadow-purple-glow-lg leading-none"
              >
                Welcome Back
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-2xl lg:text-3xl font-light text-slate-200/90 backdrop-blur-sm"
              >
                Access your dashboard and continue creating extraordinary events
              </motion.p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-3xl bg-red-500/20 border border-red-400/50 text-red-100 text-xl text-center font-light shadow-red-glow"
                >
                  {error}
                </motion.div>
              )}
              {success && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-3xl bg-green-500/20 border border-green-400/50 text-green-100 text-xl text-center font-light shadow-green-glow"
                >
                  {success}
                </motion.div>
              )}

              <div>
                <label className="block text-slate-300 font-serif text-xl font-light mb-4">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-navy-800/50 border-gold-400/30 backdrop-blur-xl rounded-3xl text-xl placeholder-slate-400 font-light h-16 lg:h-20 focus:ring-gold-500/50 focus:border-gold-500/70 p-6 transition-all duration-300"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-slate-300 font-serif text-xl font-light mb-4">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-navy-800/50 border-gold-400/30 backdrop-blur-xl rounded-3xl text-xl placeholder-slate-400 font-light h-16 lg:h-20 focus:ring-gold-500/50 focus:border-gold-500/70 p-6 transition-all duration-300"
                  required
                  disabled={loading}
                />
              </div>

              <motion.button 
                type="submit"
                disabled={loading}
                className="w-full btn-gold text-xl lg:text-2xl py-6 lg:py-8 rounded-[3rem] shadow-gold-glow-lg hover:shadow-hero-glow font-serif tracking-wide h-[70px] disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </motion.button>
            </form>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center pt-12 border-t border-gold-400/30"
            >
              <p className="text-lg lg:text-xl text-slate-400 mb-4">
                New to FestivLink?{' '}
              </p>
              <Link 
                to="/signup" 
                className="inline-block px-12 lg:px-16 py-5 lg:py-6 btn-gold shadow-gold-glow font-light text-lg lg:text-xl tracking-wide hover:shadow-hero-glow"
              >
                Create Account
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default Login
