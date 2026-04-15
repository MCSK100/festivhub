import { useState } from 'react'
import { motion } from 'framer-motion'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle } from 'lucide-react'
import api from '../services/api'
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
      setTimeout(() => navigate('/login'), 2000)
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
    weak: password.length < 6,
    medium: password.length >= 6 && password.length < 10,
    strong: password.length >= 10,
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen navy-bg flex items-center justify-center relative overflow-hidden py-12 pt-40 lg:pt-32"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-300/10 to-transparent rounded-full blur-3xl"
          animate={{ y: [0, 60, 0], x: [50, -50, 50] }}
          transition={{ duration: 20, repeat: Infinity }}
        />
      </div>

      <div className="w-full max-w-md mx-auto px-6 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 lg:p-10 border border-blue-500/20"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-serif font-light text-slate-900 mb-2">
              Set New Password
            </h1>
            <p className="text-slate-700 text-sm">
              Create a strong password for your account
            </p>
          </motion.div>

          {resetSuccess ? (
            <motion.div variants={containerVariants} className="text-center space-y-6">
              <motion.div variants={itemVariants}>
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              </motion.div>
              <motion.p variants={itemVariants} className="text-slate-900 font-semibold">
                Password reset successfully!
              </motion.p>
              <motion.p variants={itemVariants} className="text-slate-600 text-sm">
                Redirecting to login...
              </motion.p>
            </motion.div>
          ) : tokenError ? (
            <motion.div variants={containerVariants} className="text-center space-y-6">
              <motion.div variants={itemVariants}>
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
              </motion.div>
              <motion.div variants={itemVariants}>
                <p className="text-slate-900 font-semibold mb-2">Link Expired</p>
                <p className="text-slate-600 text-sm mb-6">
                  Your password reset link has expired or is invalid. Please request a new one.
                </p>
                <Link
                  to="/forgot-password"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300"
                >
                  Request New Link
                </Link>
              </motion.div>
            </motion.div>
          ) : (
            <motion.form variants={containerVariants} onSubmit={handleSubmit} className="space-y-6">
              {/* Password Input */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-blue-500/30 text-slate-900 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all duration-300"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-500 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {password && (
                  <div className="mt-2 flex gap-1">
                    <div
                      className={`h-1 flex-1 rounded-full ${
                        password.length > 0 ? 'bg-red-500' : 'bg-gray-300'
                      }`}
                    />
                    <div
                      className={`h-1 flex-1 rounded-full ${
                        password.length >= 6 ? 'bg-yellow-500' : 'bg-gray-300'
                      }`}
                    />
                    <div
                      className={`h-1 flex-1 rounded-full ${
                        password.length >= 10 ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    />
                  </div>
                )}
              </motion.div>

              {/* Confirm Password Input */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-blue-500/30 text-slate-900 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all duration-300"
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-slate-500 hover:text-slate-700"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.button
                variants={itemVariants}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </motion.button>

              {/* Back to Login */}
              <motion.div variants={itemVariants} className="text-center">
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
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
