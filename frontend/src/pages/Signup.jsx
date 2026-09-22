import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import GoogleSignIn from '../components/GoogleSignIn'
import StudioButton from '../components/ui/StudioButton'
import { Eye, EyeOff, AlertCircle, Check, Sparkles } from 'lucide-react'

const Signup = () => {
  const [searchParams] = useSearchParams()
  const roleFromUrl = ['customer', 'vendor'].includes(searchParams.get('role'))
    ? searchParams.get('role')
    : 'customer'

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

  const strength = password.length === 0 ? 'empty' : password.length < 6 ? 'weak' : password.length < 10 ? 'medium' : 'strong'

  const validateForm = () => {
    if (!name.trim()) {
      setError('Name is required')
      return false
    }
    if (!/\S+@\S+\.\S+/.test(email.trim())) {
      setError('Please enter a valid email address')
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
      setSuccess('Account created! Redirecting to your dashboard...')
      const newRole = result.user?.role || role
      setTimeout(() => {
        navigate(newRole === 'vendor' ? '/vendor-dashboard' : '/customer-dashboard', { replace: true })
      }, 600)
    } else {
      setError(result.error || 'Registration failed. Please try again.')
      setLoading(false)
    }
  }

  const inputCls =
    'w-full rounded-full border border-black/10 bg-white px-6 py-3.5 font-medium text-[#0b1311] placeholder-gray-400 transition-all focus:border-[#1e4137] focus:outline-none focus:ring-2 focus:ring-[#1e4137]/20'

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
              Join FestivLink
            </span>
            <h1 className="mt-4 text-[clamp(1.9rem,4vw,2.6rem)] font-semibold leading-tight text-[#0b1311]">
              Create your account
            </h1>
            <p className="mt-2 text-[15px] text-[#0b1311]/60">
              One account for booking vendors or growing your business.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {success && (
              <div className="flex items-center gap-2 rounded-xl border border-green-300 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                <Check className="h-5 w-5" />
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
              <span className="mb-2 block text-sm font-semibold text-[#0b1311]">I&apos;m joining as</span>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'customer', label: 'Customer', hint: 'Book events' },
                  { value: 'vendor', label: 'Vendor', hint: 'Offer services' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setRole(option.value)}
                    aria-pressed={role === option.value}
                    className={`rounded-2xl border-2 px-4 py-3 text-left transition-all ${
                      role === option.value
                        ? 'border-[#1e4137] bg-[#1e4137]/5 text-[#1e4137]'
                        : 'border-black/10 text-[#0b1311]/60 hover:border-[#1e4137]/40'
                    }`}
                  >
                    <span className="block text-sm font-bold">{option.label}</span>
                    <span className="block text-xs font-medium opacity-70">{option.hint}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-semibold text-[#0b1311]">
                Full name
              </label>
              <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Aarav Sharma" required autoComplete="name" className={inputCls} />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-[#0b1311]">
                Email address
              </label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required autoComplete="email" className={inputCls} />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-semibold text-[#0b1311]">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  required
                  autoComplete="new-password"
                  className={inputCls}
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
              {strength !== 'empty' && (
                <div className="mt-2">
                  <div className="flex gap-1.5">
                    {['weak', 'medium', 'strong'].map((level) => (
                      <span
                        key={level}
                        className={`h-1.5 flex-1 rounded-full ${
                          (strength === 'weak' && level === 'weak' && 'bg-red-400') ||
                          (strength === 'medium' && (level === 'weak' || level === 'medium') && 'bg-yellow-400') ||
                          (strength === 'strong' && 'bg-green-500') ||
                          'bg-black/10'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mt-1 text-xs text-[#0b1311]/50">
                    {strength === 'weak' && 'Weak — use at least 6 characters'}
                    {strength === 'medium' && 'Good — add length for extra strength'}
                    {strength === 'strong' && 'Strong password'}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="mb-2 block text-sm font-semibold text-[#0b1311]">
                Confirm password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  required
                  autoComplete="new-password"
                  className={inputCls}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-[#1e4137]"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {confirmPassword && password === confirmPassword && (
                <p className="mt-2 flex items-center gap-1 text-xs font-medium text-green-600">
                  <Check className="h-4 w-4" /> Passwords match
                </p>
              )}
            </div>

            <StudioButton type="submit" disabled={loading} className="studio-btn-block w-full">
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Creating account...
                </span>
              ) : (
                `Create ${role === 'vendor' ? 'vendor' : 'customer'} account`
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

            <GoogleSignIn mode="signup" role={role} onError={(msg) => setError(msg)} />

            <p className="pt-1 text-center text-sm text-[#0b1311]/60">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-[#1e4137] underline underline-offset-4 hover:text-[#1e4137]/80">
                Sign in
              </Link>
            </p>
            <p className="text-center text-xs text-[#0b1311]/45">
              By creating an account, you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>
        </div>

        <p className="mt-6 text-center text-xs font-medium text-[#0b1311]/50">
          Vendors get a free provider profile • Customers get a 30-day trial
        </p>
      </motion.div>
    </motion.div>
  )
}

export default Signup
