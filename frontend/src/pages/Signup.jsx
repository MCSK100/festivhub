import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Eye, EyeOff, ArrowRight, AlertCircle, Check } from 'lucide-react'

const Signup = () => {
  const [searchParams] = useSearchParams()
  const roleFromUrl = searchParams.get('role') || 'customer'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState(roleFromUrl)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()

  const passwordStrength = {
    weak: password.length < 6,
    medium: password.length >= 6 && password.length < 10,
    strong: password.length >= 10,
  }

  const validateForm = () => {
    if (!name.trim()) {
      setError('Name is required')
      return false
    }
    if (!email.includes('@')) {
      setError('Valid email is required')
      return false
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return false
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    setError('')
    setSuccess('')

    const result = await register(email, password, role, name)
    if (result.success) {
      setSuccess('Account created successfully! Redirecting...')
      setTimeout(() => navigate('/dashboard'), 1500)
    } else {
      setError(result.error || 'Registration failed. Please try again.')
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
          className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-br from-indigo-300/10 to-transparent rounded-full blur-3xl"
          animate={{
            y: [0, 60, 0],
            x: [50, -50, 50],
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 left-1/3 w-96 h-96 bg-gradient-to-tl from-blue-300/10 to-transparent rounded-full blur-3xl"
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
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-3xl overflow-hidden border border-blue-200/50 shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1524712627812-4078e9d1cb88?ixlib=rb-4.0.3&w=800&fit=crop&auto=format"
                alt="Premium event services"
                className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/40 via-transparent to-transparent" />
            </div>

            {/* Floating Badge */}
            <motion.div
              className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 shadow-lg"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wider">
                  Join our community
                </p>
              </div>
              <p className="text-2xl font-bold text-slate-900">25K+ Bookings</p>
              <p className="text-sm text-slate-600 mt-1">Professional events powered by our platform</p>
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
                Get Started Today
              </h1>
              <p className="text-lg text-slate-600">
                Create your account and start discovering premium services
              </p>
            </motion.div>

            {/* Form Card */}
            <motion.form
              variants={itemVariants}
              onSubmit={handleSubmit}
              className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 lg:p-10 border border-blue-200/50 shadow-xl space-y-5"
            >
              {/* Success Message */}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50 border border-green-200/50 text-green-700 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2"
                >
                  <Check className="w-5 h-5" />
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

              {/* Role Selection */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  I'm joining as
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'customer', label: 'Customer' },
                    { value: 'vendor', label: 'Vendor' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setRole(option.value)}
                      className={`py-3 px-4 rounded-lg border-2 font-medium transition-all duration-300 ${
                        role === option.value
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-blue-200/60 text-slate-700 hover:border-blue-400'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Name Field */}
              <motion.div variants={itemVariants}>
                <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-3">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-blue-200/60 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 font-medium"
                />
              </motion.div>

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
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-3">
                  Password
                </label>
                <div className="relative mb-2">
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
                {/* Password Strength */}
                <div className="flex gap-2 mb-2">
                  <div className={`flex-1 h-1.5 rounded-full transition-all ${
                    passwordStrength.weak 
                      ? 'bg-red-400' 
                      : passwordStrength.medium 
                      ? 'bg-yellow-400' 
                      : 'bg-green-500'
                  }`} />
                </div>
                <p className="text-xs text-slate-600">
                  {passwordStrength.weak && '❌ Weak password (min 6 characters)'}
                  {passwordStrength.medium && '⚠️ Medium strength'}
                  {passwordStrength.strong && '✓ Strong password'}
                </p>
              </motion.div>

              {/* Confirm Password Field */}
              <motion.div variants={itemVariants}>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 mb-3">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-blue-200/60 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-blue-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {confirmPassword && password === confirmPassword && (
                  <p className="text-xs text-green-600 mt-2 flex items-center gap-1 font-medium">
                    <Check className="w-4 h-4" />
                    Passwords match
                  </p>
                )}
              </motion.div>

              {/* Submit Button */}
              <motion.button
                variants={itemVariants}
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 lg:py-4 text-lg font-semibold rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl mt-6"
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                    Creating account...
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>

              {/* Sign In Link */}
              <motion.p
                variants={itemVariants}
                className="text-center text-slate-700 text-sm pt-4"
              >
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-700 font-bold transition-colors underline underline-offset-2"
                >
                  Sign in here
                </Link>
              </motion.p>

              {/* Terms and Privacy */}
              <motion.p
                variants={itemVariants}
                className="text-center text-slate-500 text-xs"
              >
                By creating an account, you agree to our Terms of Service and Privacy Policy
              </motion.p>
            </motion.form>

            {/* Trust Indicators */}
            <motion.div
              variants={itemVariants}
              className="mt-8 flex items-center justify-center gap-4 text-xs text-slate-600"
            >
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                Secure Registration
              </div>
              <div className="w-1 h-1 bg-blue-300 rounded-full" />
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                Privacy Protected
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default Signup
