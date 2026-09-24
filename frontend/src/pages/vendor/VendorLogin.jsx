import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, AlertCircle, Star, CheckCircle2, BadgeCheck, Lightbulb } from 'lucide-react'
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
    'w-full rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-medium text-[#0b1311] placeholder-[#0b1311]/35 shadow-sm transition-all focus:border-[#1e4137] focus:outline-none focus:ring-2 focus:ring-[#1e4137]/20'

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fff7f0] px-4 py-24">
      <SEO title="Vendor Login" description="Sign in to your FestivLink vendor dashboard." path="/vendor/login" noindex />
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[480px] w-[480px] rounded-full bg-[#bad6ff]/35 blur-[120px]" />
        <div className="absolute -bottom-48 -right-40 h-[520px] w-[520px] rounded-full bg-[#f3d9c8]/55 blur-[130px]" />
      </div>

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/60 bg-[#fffdf9] shadow-[0_40px_100px_-30px_rgba(11,19,17,0.4)] lg:grid-cols-[1fr_1.05fr]">
        {/* ---- Form side ---- */}
        <div className="p-8 sm:p-10 lg:p-12">
          <Link to="/" className="block w-fit" aria-label="FestivLink home">
            <img src="/new-logo.png" alt="FestivLink logo" className="h-11 w-auto" />
          </Link>
          <h1 className="mt-6 text-3xl font-black tracking-tight sm:text-4xl">Welcome back</h1>
          <p className="mt-2 text-sm text-[#0b1311]/55">Sign in to manage your business.</p>

          <form onSubmit={submit} className="mt-7 space-y-3.5">
            {error && (
              <p role="alert" className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />{error}
              </p>
            )}
            <div>
              <label htmlFor="v-email" className="mb-1.5 block text-xs font-bold text-[#0b1311]/70">Email</label>
              <input id="v-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@business.com" required autoComplete="email" maxLength={254} className={input} />
            </div>
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="v-pass" className="block text-xs font-bold text-[#0b1311]/70">Password</label>
                <Link to="/forgot-password" className="text-xs font-bold text-[#1e4137] hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <input id="v-pass" type={show ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required autoComplete="current-password" maxLength={72} className={input} />
                <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? 'Hide password' : 'Show password'} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1e4137]">
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full rounded-full bg-[#1e4137] px-6 py-3 text-sm font-bold text-white shadow-[0_14px_30px_-12px_rgba(30,65,55,0.7)] transition-all hover:-translate-y-0.5 hover:bg-[#142e27] disabled:opacity-50">
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
            <GoogleSignIn role="vendor" mode="signin" onError={(msg) => setError(msg)} />
            <p className="text-center text-[13px] text-[#0b1311]/55">
              New vendor? <Link to="/vendor/register" className="font-bold text-[#1e4137] underline underline-offset-4">Create account</Link>
            </p>
          </form>

          {/* Tips */}
          <div className="mt-7 rounded-3xl bg-[#1e4137]/[0.06] p-5">
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[#1e4137]">
              <Lightbulb className="h-4 w-4" /> Tips to get booked faster
            </p>
            <ul className="mt-3 space-y-2">
              {TIPS.map((t) => (
                <li key={t} className="flex items-start gap-2 text-[13px] font-medium leading-snug text-[#0b1311]/70">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#1e4137]" /> {t}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ---- Image side ---- */}
        <div className="relative hidden min-h-[560px] lg:block">
          <img
            src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1000&auto=format&fit=crop"
            alt="Decorated wedding venue"
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b1311]/45 via-transparent to-[#0b1311]/10" />

          <span className="glass-ios-dark absolute right-5 top-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-semibold text-white">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            100+ events this month
          </span>

          <div className="glass-ios absolute left-5 top-20 w-[230px] rounded-3xl p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg">
                <CheckCircle2 className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[13px] font-bold leading-tight">Booking confirmed</p>
                <p className="text-xs font-medium text-[#0b1311]/55">Aarav & Diya • Udaipur</p>
              </div>
            </div>
            <div className="mt-3 overflow-hidden rounded-full bg-black/10">
              <div className="h-1.5 w-4/5 rounded-full bg-gradient-to-r from-emerald-500 to-[#1e4137]" />
            </div>
          </div>

          <div className="glass-ios absolute bottom-5 left-5 right-5 flex items-center justify-between gap-3 rounded-3xl p-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1e4137] px-3 py-1.5 text-[11px] font-bold text-white">
                <BadgeCheck className="h-3.5 w-3.5" /> Verified
              </span>
              <p className="text-[13px] font-semibold text-[#0b1311]/70">Hosts book verified pros first</p>
            </div>
            <span className="flex shrink-0 items-center gap-1 text-sm font-black">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> 4.9
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
