import { useState } from 'react'
import { motion } from 'framer-motion'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle } from 'lucide-react'
import api from '../services/api'
import StudioButton from '../components/ui/StudioButton'
import { useToast } from '../components/ui/Toast'

const ResetPassword = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [resetSuccess, setResetSuccess] = useState(false)
  const [tokenError, setTokenError] = useState(false)
  const { success, error } = useToast()

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

  const validatePassword = () => {
    if (!token) {
      error('Reset link is missing or invalid. Please request a new one.')
      setTokenError(true)
      return false
    }
    if (password.length < 6) {
      error('Password must be at least 6 characters long')
      return false
    }
    if (password !== confirmPassword) {
      error('Passwords do not match')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validatePassword()) return

    setLoading(true)
    try {
      await api.post('/password/reset', { token, newPassword: password })
      success('Password reset successfully!')
      setResetSuccess(true)
      setTimeout(() => navigate('/vendor/login'), 2000)
    } catch (err) {
      if (err.response?.status === 400) {
        setTokenError(true)
        error('Password reset link has expired or is invalid')
      } else {
        error(err.response?.data?.error || 'Failed to reset password')
      }
    } finally {
      setLoading(false)
    }
  }

  const passwordStrength = {
    weak: password.length > 0 && password.length < 6,
    medium: password.length >= 6 && password.length < 10,
    strong: password.length >= 10,
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#fff7f0] flex items-center justify-center relative overflow-hidden py-12 pt-40 lg:pt-32"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-br from-[#1e4137]/10 to-transparent rounded-full blur-3xl"
          animate={{ y: [0, 60, 0], x: [50, -50, 50] }}
          transition={{ duration: 20, repeat: Infinity }}
        />
      </div>

      <div className="w-full max-w-md mx-auto px-6 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-[var(--jak-border-radius)] p-8 lg:p-10 border border-black/5 shadow-xl"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <div className="w-16 h-16 bg-[#1e4137] rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-[#bad6ff]" />
            </div>
            <h1 className="text-[clamp(28px,3.33vw,48px)] font-semibold leading-[1.1] text-gray-900 mb-2">
              Set New Password
            </h1>
            <p className="text-gray-500 text-sm">
              Create a strong password for your account
            </p>
          </motion.div>

          {resetSuccess ? (
            <motion.div variants={containerVariants} className="text-center space-y-6">
              <motion.div variants={itemVariants}>
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              </motion.div>
              <motion.p variants={itemVariants} className="text-gray-900 font-semibold">
                Password reset successfully!
              </motion.p>
              <motion.p variants={itemVariants} className="text-gray-500 text-sm">
                Redirecting to login...
              </motion.p>
            </motion.div>
          ) : tokenError ? (
            <motion.div variants={containerVariants} className="text-center space-y-6">
              <motion.div variants={itemVariants}>
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
              </motion.div>
              <motion.div variants={itemVariants}>
                <p className="text-gray-900 font-semibold mb-2">Link Expired</p>
                <p className="text-gray-500 text-sm mb-6">
                  Your password reset link has expired or is invalid. Please request a new one.
                </p>
                <StudioButton to="/forgot-password">
                  Request New Link
                </StudioButton>
              </motion.div>
            </motion.div>
          ) : (
            <motion.form variants={containerVariants} onSubmit={handleSubmit} className="space-y-6">
              {/* Password Input */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-6 py-3.5 rounded-full bg-white border border-black/10 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#1e4137] transition-all duration-300"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-[#1e4137]"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {password && (
                  <div className="mt-2 flex gap-1">
                    <div
                      className={`h-1 flex-1 rounded-full ${
                        password.length > 0 ? 'bg-red-400' : 'bg-gray-200'
                      }`}
                    />
                    <div
                      className={`h-1 flex-1 rounded-full ${
                        password.length >= 6 ? 'bg-yellow-400' : 'bg-gray-200'
                      }`}
                    />
                    <div
                      className={`h-1 flex-1 rounded-full ${
                        password.length >= 10 ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  </div>
                )}
              </motion.div>

              {/* Confirm Password Input */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-6 py-3.5 rounded-full bg-white border border-black/10 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#1e4137] transition-all duration-300"
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-[#1e4137]"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.div variants={itemVariants}>
                <StudioButton type="submit" disabled={loading} className="w-full studio-btn-block">
                  {loading ? 'Resetting...' : 'Reset Password'}
                </StudioButton>
              </motion.div>

              {/* Back to Login */}
              <motion.div variants={itemVariants} className="text-center">
                <Link
                  to="/vendor/login"
                  className="text-[#1e4137] hover:text-[#1e4137]/80 font-medium text-sm transition-colors underline underline-offset-4"
                >
                  Back to Login
                </Link>
              </motion.div>
            </motion.form>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}

export default ResetPassword
