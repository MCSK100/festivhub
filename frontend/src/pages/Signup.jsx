import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import FreeTrialTimer from '../components/FreeTrialTimer'

const Signup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('user')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const result = await register(email, password, role)
    if (result.success) {
      setSuccess('Account created successfully!')
      setTimeout(() => navigate('/dashboard'), 1500)
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
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-gold-500/15 via-purple-500/8 to-transparent opacity-70" />
      
      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-16 lg:gap-24 items-center lg:items-stretch px-6 lg:px-12 relative z-10">
        {/* Left Hero Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.92, x: -40 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:w-1/2 h-[650px] lg:h-[750px] rounded-[4rem] overflow-hidden relative navy-glass shadow-hero-glow border border-purple-400/40 hover:shadow-[0_0_80px_rgba(124,92,252,0.3)] transition-all duration-700"
        >
          <img 
            src="https://images.unsplash.com/photo-1524712627812-4078e9d1cb88?ixlib=rb-4.0.3&w=1400&fit=crop&auto=format" 
            alt="Premium catering"
            className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900/75 via-transparent to-transparent backdrop-blur-sm" />
          <div className="absolute bottom-12 left-12 right-12 text-white/95 backdrop-blur-xl">
            <motion.h2 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-5xl lg:text-7xl xl:text-8xl font-serif font-light italic mb-6 leading-none shadow-2xl drop-shadow-2xl"
            >
              Begin Your Journey.
            </motion.h2>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl lg:text-3xl leading-relaxed backdrop-blur-md font-light"
            >
              Join the platform trusted by thousands.
              <br />
              <span className="block mt-4 text-purple-300 font-serif italic text-xl lg:text-2xl shadow-purple-glow">
                Free 30 days • Premium connections • Guaranteed results
              </span>
            </motion.p>
          </div>
        </motion.div>

        {/* Right Form Card */}
        <div className="lg:w-1/2 max-w-2xl flex flex-col justify-center lg:pl-12">
          {/* Trial Timer */}
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
            className="purple-glass backdrop-blur-3xl rounded-[4rem] p-12 lg:p-16 shadow-hero-glow border border-purple-400/40 hover:shadow-[0_0_60px_rgba(124,92,252,0.4)] hover:border-gold-500/60 transition-all duration-700"
          >
            <div className="text-center mb-12 lg:mb-16">
              <motion.h1 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-5xl lg:text-7xl xl:text-8xl font-serif font-light italic bg-gradient-to-r from-purple-400 via-gold-500 to-purple-500 bg-clip-text text-transparent mb-6 shadow-purple-glow-lg leading-none"
              >
                Join FestivLink
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-2xl lg:text-3xl font-light text-slate-200/90 backdrop-blur-sm"
              >
                Start showcasing your work to thousands of event organizers. 
                <span className="block text-gold-300 font-serif italic">Free for 30 days</span>
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
                  className="w-full bg-navy-800/50 border-purple-400/30 backdrop-blur-xl rounded-3xl text-xl placeholder-slate-400 font-light h-16 lg:h-20 focus:ring-purple-500/50 focus:border-purple-500/70 p-6 transition-all duration-300"
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
                  className="w-full bg-navy-800/50 border-purple-400/30 backdrop-blur-xl rounded-3xl text-xl placeholder-slate-400 font-light h-16 lg:h-20 focus:ring-purple-500/50 focus:border-purple-500/70 p-6 transition-all duration-300"
                  required
                  disabled={loading}
                  minLength={6}
                />
              </div>

              <div>
                <label className="block text-slate-300 font-serif text-xl font-light mb-4">
                  Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-navy-800/50 border-purple-400/30 backdrop-blur-xl rounded-3xl text-xl font-light h-16 lg:h-20 focus:ring-purple-500/50 focus:border-purple-500/70 p-6 transition-all duration-300"
                  disabled={loading}
                >
                  <option value="user">Event Organizer (Customer)</option>
                  <option value="provider">Service Provider (Vendor)</option>
                </select>
              </div>

              <motion.button 
                type="submit"
                disabled={loading}
                className="w-full btn-purple text-xl lg:text-2xl py-6 lg:py-8 rounded-[3rem] shadow-purple-glow-lg hover:shadow-hero-glow font-serif tracking-wide h-[70px] disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </motion.button>
            </form>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center pt-12 border-t border-purple-400/30"
            >
              <p className="text-lg lg:text-xl text-slate-400 mb-4">
                Already have an account?{' '}
              </p>
              <Link 
                to="/login" 
                className="inline-block px-12 lg:px-16 py-5 lg:py-6 btn-gold shadow-purple-glow font-light text-lg lg:text-xl tracking-wide hover:shadow-hero-glow"
              >
                Sign In
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default Signup
