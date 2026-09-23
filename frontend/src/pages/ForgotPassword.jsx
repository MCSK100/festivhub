import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react'
import api from '../services/api'
import StudioButton from '../components/ui/StudioButton'
import { useToast } from '../components/ui/Toast'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    const normalized = email.trim().toLowerCase()
    if (!/\S+@\S+\.\S+/.test(normalized)) {
      error('Please enter a valid email address.')
      return
    }
    setLoading(true)

    try {
      await api.post('/password/forgot', { email: normalized })
      success('Password reset link sent to your email!')
      setEmail(normalized)
      setSubmitted(true)
    } catch (err) {
      error(err.response?.data?.error || 'Failed to send reset email. Please try again.')
    } finally {
      setLoading(false)
    }
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
              <Mail className="w-8 h-8 text-[#bad6ff]" />
            </div>
            <h1 className="text-[clamp(28px,3.33vw,48px)] font-semibold leading-[1.1] text-gray-900 mb-2">
              Reset Password
            </h1>
            <p className="text-gray-500 text-sm">
              Enter your email to receive a password reset link
            </p>
          </motion.div>

          {!submitted ? (
            <motion.form variants={containerVariants} onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-6 py-3.5 rounded-full bg-white border border-black/10 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#1e4137] transition-all duration-300"
                  placeholder="your@email.com"
                />
              </motion.div>

              {/* Submit Button */}
              <motion.div variants={itemVariants}>
                <StudioButton type="submit" disabled={loading} className="w-full studio-btn-block">
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </StudioButton>
              </motion.div>

              {/* Back to Login */}
              <motion.div variants={itemVariants} className="text-center">
                <Link
                  to="/vendor/login"
                  className="inline-flex items-center gap-2 text-[#1e4137] hover:text-[#1e4137]/80 font-medium transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Login
                </Link>
              </motion.div>
            </motion.form>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-center space-y-6"
            >
              <motion.div variants={itemVariants}>
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              </motion.div>
              <motion.div variants={itemVariants}>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Check Your Email
                </h2>
                <p className="text-gray-500">
                  We've sent a password reset link to <span className="font-semibold text-gray-900">{email}</span>
                </p>
              </motion.div>
              <motion.p variants={itemVariants} className="text-sm text-gray-400">
                The link expires in 1 hour. If you don't see it, check your spam folder.
              </motion.p>
              <motion.div variants={itemVariants}>
                <Link
                  to="/vendor/login"
                  className="inline-flex items-center gap-2 text-[#1e4137] hover:text-[#1e4137]/80 font-medium transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Login
                </Link>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}

export default ForgotPassword
