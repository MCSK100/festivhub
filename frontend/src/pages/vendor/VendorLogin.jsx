import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, AlertCircle, Star, BadgeCheck, Lightbulb, ArrowRight } from 'lucide-react'
import SEO from '../../components/common/SEO'
import GoogleSignIn from '../../components/GoogleSignIn'
import { useAuth } from '../../contexts/AuthContext'

const TIPS = [
  'Complete your profile to rank higher in search.',
  'Fresh portfolio photos get 3x more enquiries.',
  'Reply fast — hosts book the first responder.',
]

export default function VendorLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError('Please enter a valid email address.')
      return
    }
    if (!password) {
      setError('Please enter your password.')
      return
    }
    setLoading(true)
    const res = await login(email, password)
    if (res.success) {
      navigate('/vendor/dashboard', { replace: true })
    } else {
      setError(res.error || 'Login failed. Please try again.')
      setLoading(false)
    }
  }

  const input =
    'w-full rounded-2xl border border-black/10 bg-white px-5 py-3.5 text-[15px] font-medium text-[#0b1311] placeholder-[#0b1311]/35 shadow-sm transition-all focus:border-[#1e4137] focus:outline-none focus:ring-2 focus:ring-[#1e4137]/20'

  return (
    <div className="relative min-h-screen bg-[#fff7f0]">
      <SEO title="Vendor Login" description="Sign in to your FestivLink vendor dashboard." path="/vendor/login" noindex />

      {/* Mobile top banner */}
      <div className="relative h-52 overflow-hidden sm:h-64 lg:hidden">
        <img
          src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1000&auto=format&fit=crop"
          alt="Decorated wedding venue"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f2a23]/90 via-[#1e4137]/40 to-transparent" />
        <Link to="/" className="absolute left-5 top-5 block w-fit rounded-2xl bg-white/95 px-3 py-2 shadow-lg backdrop-blur" aria-label="FestivLink home">
          <img src="/new-logo.png" alt="FestivLink logo" className="h-8 w-auto" />
        </Link>
        <p className="absolute bottom-5 left-5 right-5 text-2xl font-black leading-tight text-white">
          Welcome back, partner.
        </p>
      </div>

      <div className="grid min-h-screen lg:grid-cols-2">
        {/* ---- Form side ---- */}
        <div className="relative flex items-center justify-center overflow-hidden px-5 py-12 sm:px-10 lg:py-16">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#bad6ff]/30 blur-[110px]" />
            <div className="absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-[#f3d9c8]/50 blur-[110px]" />
            <div
              className="absolute inset-0 opacity-[0.35]"
              style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(11,19,17,0.10) 1px, transparent 0)', backgroundSize: '26px 26px' }}
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative w-full max-w-md"
          >
            <Link to="/" className="hidden w-fit lg:block" aria-label="FestivLink home">
              <img src="/new-logo.png" alt="FestivLink logo" className="h-12 w-auto" />
            </Link>
            <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#1e4137]/8 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#1e4137]">
              Vendor portal
            </p>
            <h1 className="mt-4 text-4xl font-black tracking-[-0.02em] sm:text-5xl">Sign in</h1>
            <p className="mt-3 text-[15px] leading-relaxed text-[#0b1311]/60">
              Your enquiries, bookings and portfolio are waiting.
            </p>

            <form onSubmit={submit} className="mt-8 space-y-4">
              {error && (
                <p role="alert" className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />{error}
                </p>
              )}
              <div>
                <label htmlFor="v-email" className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#0b1311]/55">Email</label>
                <input id="v-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@business.com" required autoComplete="email" maxLength={254} className={input} />
              </div>
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label htmlFor="v-pass" className="block text-[11px] font-bold uppercase tracking-[0.12em] text-[#0b1311]/55">Password</label>
                  <Link to="/forgot-password" className="text-[13px] font-bold text-[#1e4137] hover:underline">Forgot password?</Link>
                </div>
                <div className="relative">
                  <input id="v-pass" type={show ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required autoComplete="current-password" maxLength={72} className={input} />
                  <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? 'Hide password' : 'Show password'} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1e4137]">
                    {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="group flex w-full items-center justify-center gap-2 rounded-full bg-[#1e4137] px-6 py-4 text-sm font-bold text-white shadow-[0_16px_36px_-12px_rgba(30,65,55,0.7)] transition-all hover:-translate-y-0.5 hover:bg-[#142e27] disabled:opacity-50">
                {loading ? 'Signing in...' : <>Sign in <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></>}
              </button>
              <div className="flex items-center gap-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#0b1311]/40">
                <span className="h-px flex-1 bg-black/10" /> or continue with <span className="h-px flex-1 bg-black/10" />
              </div>
              <div className="flex justify-center overflow-hidden rounded-full border border-black/10 bg-white py-1.5 shadow-sm">
                <GoogleSignIn role="vendor" mode="signin" onError={(msg) => setError(msg)} />
              </div>
              <p className="text-center text-sm text-[#0b1311]/60">
                New vendor? <Link to="/vendor/register" className="font-bold text-[#1e4137] underline underline-offset-4">Create account</Link>
              </p>
            </form>

            <div className="mt-8 rounded-[24px] border border-[#1e4137]/10 bg-white/70 p-5 backdrop-blur">
              <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[#1e4137]">
                <Lightbulb className="h-4 w-4" /> Tips to get booked faster
              </p>
              <ul className="mt-3 space-y-2">
                {TIPS.map((t, i) => (
                  <li key={t} className="flex items-start gap-2.5 text-[13px] font-medium leading-snug text-[#0b1311]/70">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1e4137] text-[10px] font-black text-white">{i + 1}</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* ---- Image side ---- */}
        <div className="relative hidden overflow-hidden lg:block">
          <img
            src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1400&auto=format&fit=crop"
            alt="Decorated wedding venue with florals"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f2a23]/85 via-[#1e4137]/25 to-[#0b1311]/15" />

          <div className="absolute inset-x-10 top-10 flex items-center justify-between">
            <span className="glass-ios-dark inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-semibold text-white">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              100+ events this month
            </span>
            <span className="glass-ios inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[12px] font-bold text-[#0b1311]">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> 4.9 rated
            </span>
          </div>

          <div className="absolute inset-x-10 bottom-10">
            <div className="glass-ios rounded-[28px] p-6">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1e4137] px-3 py-1.5 text-[11px] font-bold text-white">
                  <BadgeCheck className="h-3.5 w-3.5" /> Host favourite
                </span>
              </div>
              <p className="mt-3 text-2xl font-black leading-snug tracking-tight">
                "Enquiries land in my dashboard before I've had my morning coffee."
              </p>
              <p className="mt-2 text-sm font-semibold text-[#0b1311]/55">Lens Studio • Wedding photographer, Coimbatore</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
