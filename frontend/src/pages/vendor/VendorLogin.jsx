import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, AlertCircle, CheckCircle, Inbox, Images, ShieldCheck } from 'lucide-react'
import SEO from '../../components/common/SEO'
import GoogleSignIn from '../../components/GoogleSignIn'
import { useAuth } from '../../contexts/AuthContext'

const PERKS = [
  { icon: Inbox, title: 'Direct enquiries', text: 'Hosts reach you — no middlemen, no commission on chats.' },
  { icon: Images, title: 'Portfolio that sells', text: 'Photos, services and pricing on one beautiful page.' },
  { icon: ShieldCheck, title: 'Verified badge', text: 'Stand out with a trusted, reviewed profile.' },
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

  const input = 'w-full rounded-2xl border border-black/10 bg-white/80 px-5 py-3.5 text-[15px] font-medium text-[#0b1311] placeholder-gray-400 backdrop-blur transition-all focus:border-[#1e4137] focus:outline-none focus:ring-2 focus:ring-[#1e4137]/20'

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fff7f0]">
      <SEO title="Vendor Login" description="Sign in to your FestivLink vendor dashboard." path="/vendor/login" noindex />
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[480px] w-[480px] rounded-full bg-[#bad6ff]/35 blur-[120px]" />
        <div className="absolute -bottom-48 -right-40 h-[520px] w-[520px] rounded-full bg-[#f3d9c8]/55 blur-[130px]" />
      </div>

      <div className="relative mx-auto grid min-h-screen w-full max-w-6xl items-center gap-8 px-4 py-24 sm:px-6 lg:grid-cols-[1fr_1fr] lg:py-28">
        {/* Brand panel */}
        <div className="relative hidden overflow-hidden rounded-[32px] bg-[#1e4137] p-10 text-white shadow-[0_32px_80px_-24px_rgba(30,65,55,0.6)] lg:block">
          <div aria-hidden className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1000&auto=format&fit=crop"
              alt=""
              className="h-full w-full object-cover opacity-25"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f2a23] via-[#1e4137]/70 to-[#1e4137]/40" />
          </div>
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#bad6ff]">FestivLink for vendors</p>
            <h2 className="mt-4 text-4xl font-black leading-[1.08] tracking-tight">
              Your next 100 bookings start here.
            </h2>
            <div className="mt-8 space-y-4">
              {PERKS.map((p) => (
                <div key={p.title} className="glass-ios-dark flex items-start gap-4 rounded-3xl p-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-[#bad6ff]">
                    <p.icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block font-bold">{p.title}</span>
                    <span className="mt-0.5 block text-sm text-white/70">{p.text}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form card */}
        <div className="glass-ios mx-auto w-full max-w-md rounded-[32px] p-8 sm:p-10">
          <Link to="/" className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#1e4137] text-xl font-black text-[#bad6ff] shadow-lg" aria-label="FestivLink home">
            F
          </Link>
          <h1 className="mt-4 text-center text-3xl font-black tracking-tight">Welcome back</h1>
          <p className="mt-2 text-center text-sm text-[#0b1311]/60">Sign in to manage your business.</p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            {error && <p role="alert" className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"><AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />{error}</p>}
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
            <button type="submit" disabled={loading} className="w-full rounded-full bg-[#1e4137] px-6 py-3.5 text-sm font-bold text-white shadow-[0_14px_30px_-12px_rgba(30,65,55,0.7)] transition-all hover:-translate-y-0.5 hover:bg-[#142e27] disabled:opacity-50">
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-[#0b1311]/40">
              <span className="h-px flex-1 bg-black/10" /> or <span className="h-px flex-1 bg-black/10" />
            </div>
            <GoogleSignIn role="vendor" mode="signin" onError={(msg) => setError(msg)} />
            <p className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-[13px] text-emerald-800">
              <CheckCircle className="h-5 w-5 shrink-0" /> Customers never need an account — only vendors sign in here.
            </p>
            <p className="text-center text-sm text-[#0b1311]/60">
              New vendor? <Link to="/vendor/register" className="font-bold text-[#1e4137] underline underline-offset-4">Create account</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
