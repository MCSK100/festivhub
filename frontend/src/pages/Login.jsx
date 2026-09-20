import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import GoogleSignIn from '../components/GoogleSignIn'
import StudioButton from '../components/ui/StudioButton'
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'

const Login = () => {
  const [searchParams] = useSearchParams()
  const sessionExpired = searchParams.get('session') === 'expired'
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
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email.trim())) {
      setError('Please enter a valid email address.')
      return
    }
    if (!password) {
      setError('Please enter your password.')
      return
    }
    setLoading(true)
    setError('')
    setSuccess('')

    const result = await login(email, password)
    if (result.success) {
      setSuccess('Login successful! Redirecting...')
      const role = result.user?.role || JSON.parse(localStorage.getItem('user') || '{}')?.role
      setTimeout(() => {
        if (role === 'vendor') {
          navigate('/vendor-dashboard', { replace: true })
        } else {
          navigate('/customer-dashboard', { replace: true })
        }
      }, 600)
    } else {
      setError(result.error || 'Login failed. Please try again.')
      setLoading(false)
    }
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
      className="min-h-screen bg-[#fff7f0] flex items-center justify-center relative overflow-hidden py-12 pt-40 lg:pt-32"
    >
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-br from-[#1e4137]/10 to-transparent rounded-full blur-3xl"
          animate={{
            y: [0, 60, 0],
            x: [50, -50, 50],
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 left-1/3 w-96 h-96 bg-gradient-to-tl from-[#1e4137]/10 to-transparent rounded-full blur-3xl"
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
            <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-100 rounded-3xl overflow-hidden border border-black/10 shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1662483818635-c07ee6f2fa3c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z2lybCUyMHVzaW5nJTIwcGhvbmVzJTIwb2ZmaWNlfGVufDB8fDB8fHwy"
                alt="Premium event professionals"
                className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent" />
            </div>

            {/* Floating Badge */}
            <motion.div
              className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-xl rounded-[var(--jak-border-radius)] p-6 border border-black/10 shadow-lg"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <p className="text-xs text-[#1e4137] font-semibold uppercase tracking-wider">
                  Trusted by professionals
                </p>
              </div>
              <p className="text-2xl font-bold text-gray-900">1K+ Active Users</p>
              <p className="text-sm text-gray-500 mt-1">Join thousands booking events daily</p>
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
              <h1 className="text-[clamp(28px,3.33vw,64px)] font-semibold leading-[1.1] text-gray-900 mb-3">
                Welcome Back
              </h1>
              <p className="text-lg text-gray-500">
                Sign in to access your account and continue booking
              </p>
            </motion.div>

            {/* Form Card */}
            <motion.form
              variants={itemVariants}
              onSubmit={handleSubmit}
              className="bg-white rounded-[var(--jak-border-radius)] p-8 lg:p-10 border border-black/5 shadow-xl space-y-6"
            >
              {/* Success Message */}
              {sessionExpired && !success && !error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-amber-50 border border-amber-300 text-amber-700 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2"
                >
                  <AlertCircle className="w-5 h-5" />
                  Session expired. Please sign in again.
                </motion.div>
              )}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2"
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
                  className="bg-red-50 border border-red-300 rounded-lg p-4 flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-red-600 text-sm">{error}</span>
                </motion.div>
              )}

              {/* Email Field */}
              <motion.div variants={itemVariants}>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-6 py-3.5 bg-white border border-black/10 rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#1e4137] focus:ring-2 focus:ring-[#1e4137]/20 transition-all duration-300 font-medium"
                />
              </motion.div>

              {/* Password Field */}
              <motion.div variants={itemVariants}>
                <div className="flex items-center justify-between mb-3">
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-[#1e4137] hover:text-[#1e4137]/80 font-medium transition-colors"
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
                    className="w-full px-6 py-3.5 bg-white border border-black/10 rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#1e4137] focus:ring-2 focus:ring-[#1e4137]/20 transition-all duration-300 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#1e4137] transition-colors"
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
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-300 ${
                    rememberMe
                      ? 'bg-[#1e4137] border-[#1e4137]'
                      : 'border-gray-300 group-hover:border-[#1e4137] bg-white'
                  }`}
                >
                  {rememberMe && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <label className="text-sm text-gray-500 font-medium cursor-pointer">
                  Keep me signed in
                </label>
              </motion.div>

              {/* Submit Button */}
              <motion.div variants={itemVariants}>
                <StudioButton type="submit" disabled={loading} className="w-full studio-btn-block">
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in...
                    </span>
                  ) : (
                    'Sign In'
                  )}
                </StudioButton>
              </motion.div>

              {/* Divider */}
              <motion.div variants={itemVariants} className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-3 bg-white text-gray-500 text-xs font-medium">
                    or continue with
                  </span>
                </div>
              </motion.div>

              {/* Google SSO */}
              <motion.div variants={itemVariants}>
                <GoogleSignIn mode="signin" onError={(msg) => setError(msg)} />
              </motion.div>

              {/* Divider */}
              <motion.div variants={itemVariants} className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-3 bg-white text-gray-500 text-xs font-medium">
                    New to our platform?
                  </span>
                </div>
              </motion.div>

              {/* Sign Up Link */}
              <motion.div
                variants={itemVariants}
                className="text-center"
              >
                <p className="text-gray-500 text-sm">
                  Don't have an account?{' '}
                  <Link
                    to="/signup"
                    className="text-[#1e4137] hover:text-[#1e4137]/80 font-semibold transition-colors underline underline-offset-4"
                  >
                    Create one now
                  </Link>
                </p>
                <p className="text-gray-600 text-xs mt-3">
                  By signing in, you agree to our Terms of Service
                </p>
              </motion.div>
            </motion.form>

            {/* Trust Indicators */}
            <motion.div
              variants={itemVariants}
              className="mt-8 flex items-center justify-center gap-4 text-xs text-gray-500"
            >
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                Secure Login
              </div>
              <div className="w-1 h-1 bg-gray-300 rounded-full" />
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
