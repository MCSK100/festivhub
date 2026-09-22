import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import GoogleSignIn from '../components/GoogleSignIn'
import StudioButton from '../components/ui/StudioButton'
import { Eye, EyeOff, AlertCircle, CheckCircle, Sparkles } from 'lucide-react'

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
        navigate(role === 'vendor' ? '/vendor-dashboard' : '/customer-dashboard', { replace: true })
      }, 600)
    } else {
      setError(result.error || 'Login failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fff7f0] px-6 py-16 pt-36 lg:pt-40"
    >
      {/* theme blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-10 h-[420px] w-[420px] rounded-full bg-[#C2D5F1]/50 blur-3xl" />
        <div className="absolute -right-40 bottom-0 h-[480px] w-[480px] rounded-full bg-[#F3D9C8]/60 blur-3xl" />
      </div>

      {/* single centered form */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="rounded-[var(--jak-border-radius)] border border-[#1e4137]/10 bg-white p-8 shadow-xl sm:p-10">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#1e4137]/5 px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#1e4137]">
              <Sparkles className="h-4 w-4" />
              FestivLink
            </span>
            <h1 className="mt-4 text-[clamp(1.9rem,4vw,2.6rem)] font-semibold leading-tight text-[#0b1311]">
              Welcome back
            </h1>
            <p className="mt-2 text-[15px] text-[#0b1311]/60">
              Sign in to manage bookings, vendors and events.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {sessionExpired && !success && !error && (
              <div className="flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
                <AlertCircle className="h-5 w-5" />
                Session expired. Please sign in again.
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2 rounded-xl border border-green-300 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                <CheckCircle className="h-5 w-5" />
                {success}
              </div>
            )}
            {error && (
              <div className="flex items-start gap-3 rounded-xl border border-red-300 bg-red-50 p-4">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
                <span className="text-sm text-red-600">{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-[#0b1311]">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="w-full rounded-full border border-black/10 bg-white px-6 py-3.5 font-medium text-[#0b1311] placeholder-gray-400 transition-all focus:border-[#1e4137] focus:outline-none focus:ring-2 focus:ring-[#1e4137]/20"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-semibold text-[#0b1311]">
                  Password
                </label>
                <Link to="/forgot-password" className="text-sm font-medium text-[#1e4137] hover:underline">
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
                  autoComplete="current-password"
                  className="w-full rounded-full border border-black/10 bg-white px-6 py-3.5 font-medium text-[#0b1311] placeholder-gray-400 transition-all focus:border-[#1e4137] focus:outline-none focus:ring-2 focus:ring-[#1e4137]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-[#1e4137]"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex cursor-pointer items-center gap-3" onClick={() => setRememberMe(!rememberMe)}>
              <div className={`flex h-5 w-5 items-center justify-center rounded-md border-2 transition-all ${rememberMe ? 'border-[#1e4137] bg-[#1e4137]' : 'border-gray-300 bg-white'}`}>
                {rememberMe && (
                  <svg className="h-3 w-3 text-[#bad6ff]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span className="text-sm font-medium text-[#0b1311]/60">Keep me signed in</span>
            </div>

            <StudioButton type="submit" disabled={loading} className="studio-btn-block w-full">
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </StudioButton>

            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-black/10" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-xs font-medium text-[#0b1311]/50">or continue with</span>
              </div>
            </div>

            <GoogleSignIn mode="signin" onError={(msg) => setError(msg)} />

            <p className="pt-1 text-center text-sm text-[#0b1311]/60">
              New to FestivLink?{' '}
              <Link to="/signup" className="font-semibold text-[#1e4137] underline underline-offset-4 hover:text-[#1e4137]/80">
                Create an account
              </Link>
            </p>
            <p className="text-center text-xs text-[#0b1311]/45">
              By signing in, you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>
        </div>

        <div className="mt-6 flex items-center justify-center gap-4 text-xs font-medium text-[#0b1311]/50">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-green-500" /> Secure login</span>
          <span className="h-1 w-1 rounded-full bg-black/20" />
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-green-500" /> SSL encrypted</span>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Login
