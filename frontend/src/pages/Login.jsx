import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
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
      setSuccess('Login successful! Redirecting...')
      setTimeout(() => navigate('/dashboard'), 1500)
    } else {
      setError(result.error || 'Login failed. Please try again.')
    }
    setLoading(false)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen navy-bg flex items-center justify-center relative overflow-hidden py-12 pt-40 lg:pt-32"
    >
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-300/10 to-transparent rounded-full blur-3xl"
          animate={{
            y: [0, 60, 0],
            x: [50, -50, 50],
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 left-1/3 w-96 h-96 bg-gradient-to-tl from-indigo-300/10 to-transparent rounded-full blur-3xl"
          animate={{
            y: [0, -60, 0],
            x: [-50, 50, -50],
          }}
          transition={{ duration: 25, repeat: Infinity, delay: 2 }}
        />
      </div>

      <div className="w-full max-w-6xl mx-auto px-6 lg:px-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Image Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: -40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden lg:block relative h-[600px] rounded-3xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl overflow-hidden border border-blue-200/50 shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&w=800&fit=crop&crop=entropy&auto=format"
                alt="Premium event professionals"
                className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-600/40 via-transparent to-transparent" />
            </div>

            {/* Floating Badge */}
            <motion.div
              className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 shadow-lg"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider">
                  Trusted by professionals
                </p>
              </div>
              <p className="text-2xl font-bold text-slate-900">8K+ Active Users</p>
              <p className="text-sm text-slate-600 mt-1">Join thousands booking events daily</p>
            </motion.div>
          </motion.div>

          {/* Right Form Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col justify-center"
          >
            {/* Header */}
            <motion.div variants={itemVariants} className="mb-8">
              <h1 className="text-4xl md:text-5xl font-serif font-light text-slate-900 mb-3">
                Welcome Back
              </h1>
              <p className="text-lg text-slate-600">
                Sign in to access your account and continue booking
              </p>
            </motion.div>

            {/* Form Card */}
            <motion.form
              variants={itemVariants}
              onSubmit={handleSubmit}
              className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 lg:p-10 border border-blue-200/50 shadow-xl space-y-6"
            >
              {/* Success Message */}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50 border border-green-200/50 text-green-700 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  {success}
                </motion.div>
              )}

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200/50 rounded-lg p-4 flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span className="text-red-700 text-sm">{error}</span>
                </motion.div>
              )}

              {/* Email Field */}
              <motion.div variants={itemVariants}>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-3">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-blue-200/60 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 font-medium"
                />
              </motion.div>

              {/* Password Field */}
              <motion.div variants={itemVariants}>
                <div className="flex items-center justify-between mb-3">
                  <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-blue-200/60 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-blue-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </motion.div>

              {/* Remember Me */}
              <motion.div
                variants={itemVariants}
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => setRememberMe(!rememberMe)}
              >
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-300 ${
                    rememberMe
                      ? 'bg-blue-600 border-blue-600'
                      : 'border-blue-300 group-hover:border-blue-500 bg-white'
                  }`}
                >
                  {rememberMe && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <label className="text-sm text-slate-700 font-medium cursor-pointer">
                  Keep me signed in
                </label>
              </motion.div>

              {/* Submit Button */}
              <motion.button
                variants={itemVariants}
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-3 lg:py-4 text-lg font-semibold rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                    Signing in...
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>

              {/* Divider */}
              <motion.div variants={itemVariants} className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-blue-200/50" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-3 bg-white text-slate-600 text-xs font-medium">
                    New to our platform?
                  </span>
                </div>
              </motion.div>

              {/* Sign Up Link */}
              <motion.div
                variants={itemVariants}
                className="text-center"
              >
                <p className="text-slate-700 text-sm">
                  Don't have an account?{' '}
                  <Link
                    to="/signup"
                    className="text-blue-600 hover:text-blue-700 font-bold transition-colors underline underline-offset-2"
                  >
                    Create one now
                  </Link>
                </p>
                <p className="text-slate-500 text-xs mt-3">
                  By signing in, you agree to our Terms of Service
                </p>
              </motion.div>
            </motion.form>

            {/* Trust Indicators */}
            <motion.div
              variants={itemVariants}
              className="mt-8 flex items-center justify-center gap-4 text-xs text-slate-600"
            >
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                Secure Login
              </div>
              <div className="w-1 h-1 bg-blue-300 rounded-full" />
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                SSL Encrypted
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default Login
