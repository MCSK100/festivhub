import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, AlertCircle, Check, BadgeCheck, Star, ArrowRight } from 'lucide-react'
import SEO from '../../components/common/SEO'
import GoogleSignIn from '../../components/GoogleSignIn'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'

const STEPS = [
  { n: '1', text: 'Create your account in 30 seconds' },
  { n: '2', text: 'Add photos, services & pricing' },
  { n: '3', text: 'Get direct enquiries from hosts' },
]

export default function VendorRegister() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!name.trim()) { setError('Business / vendor name is required.'); return }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) { setError('Please enter a valid email address.'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    if (password !== confirm) { setError('Passwords do not match.'); return }
    setLoading(true)
    const res = await register(email, password, 'vendor', name.trim())
    if (res.success) {
      // Save phone onto the auto-created provider profile (best-effort)
      if (phone.trim()) {
        try {
          await api.put('/providers/profile', { phone: phone.trim(), contactEmail: email.trim().toLowerCase() })
        } catch { /* non-blocking */ }
      }
      navigate('/vendor/dashboard', { replace: true })
    } else {
      setError(res.error || 'Registration failed. Please try again.')
      setLoading(false)
    }
  }

  const input = 'w-full rounded-2xl border border-black/10 bg-white/80 px-5 py-3.5 text-[15px] font-medium text-[#0b1311] placeholder-gray-400 backdrop-blur transition-all focus:border-[#1e4137] focus:outline-none focus:ring-2 focus:ring-[#1e4137]/20'
  const label = 'mb-1.5 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#0b1311]/55'

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fff7f0]">
      <SEO title="Become a Vendor" description="Create your FestivLink vendor account and start receiving booking enquiries." path="/vendor/register" noindex />
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[480px] w-[480px] rounded-full bg-[#bad6ff]/35 blur-[120px]" />
        <div className="absolute -bottom-48 -right-40 h-[520px] w-[520px] rounded-full bg-[#f3d9c8]/55 blur-[130px]" />
      </div>

      <div className="relative mx-auto grid min-h-screen w-full max-w-6xl items-center gap-8 px-4 py-24 sm:px-6 lg:grid-cols-[1fr_1fr] lg:py-28">
        {/* Brand panel */}
        <div className="relative hidden overflow-hidden rounded-[32px] bg-[#1e4137] p-10 text-white shadow-[0_32px_80px_-24px_rgba(30,65,55,0.6)] lg:block">
          <div aria-hidden className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1000&auto=format&fit=crop"
              alt=""
              className="h-full w-full object-cover opacity-25"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f2a23] via-[#1e4137]/70 to-[#1e4137]/40" />
          </div>
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#bad6ff]">For event professionals</p>
            <h2 className="mt-4 text-4xl font-black leading-[1.08] tracking-tight">
              List your business. Get booked.
            </h2>
            <div className="mt-6 flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[13px] font-bold text-white backdrop-blur">
              <BadgeCheck className="h-4 w-4 text-emerald-300" /> Free listing • No spam • Direct chat
            </div>
            <ol className="mt-8 space-y-4">
              {STEPS.map((s) => (
                <li key={s.n} className="flex items-center gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white font-black text-[#1e4137]">{s.n}</span>
                  <span className="font-semibold text-white/90">{s.text}</span>
                </li>
              ))}
            </ol>
            <div className="mt-8 flex items-center gap-2 text-sm text-white/75">
              <span className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </span>
              <span className="font-bold text-white">4.9</span> loved by 100+ vendors
            </div>
          </div>
        </div>

        {/* Form card */}
        <div className="glass-ios mx-auto w-full max-w-md rounded-[32px] p-8 sm:p-10">
          <Link to="/" className="mx-auto block w-fit" aria-label="FestivLink home">
            <img src="/new-logo.png" alt="FestivLink logo" className="h-12 w-auto" />
          </Link>
          <h1 className="mt-4 text-center text-3xl font-black tracking-tight">Create account</h1>
          <p className="mt-2 text-center text-sm text-[#0b1311]/60">Free listing. Direct enquiries. Zero spam.</p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            {error && <p role="alert" className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"><AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />{error}</p>}
            <div>
              <label htmlFor="r-name" className={label}>Business / vendor name</label>
              <input id="r-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Lens Studio Photography" required autoComplete="organization" maxLength={120} className={input} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="r-email" className={label}>Email</label>
                <input id="r-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@business.com" required autoComplete="email" maxLength={254} className={input} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="r-phone" className={label}>Phone <span className="font-medium normal-case text-[#0b1311]/40">(optional)</span></label>
                <input id="r-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" autoComplete="tel" inputMode="tel" maxLength={20} className={input} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="r-pass" className={label}>Password</label>
                <div className="relative">
                  <input id="r-pass" type={show ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters" required autoComplete="new-password" maxLength={72} className={input} />
                  <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? 'Hide password' : 'Show password'} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1e4137]">
                    {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="r-confirm" className={label}>Confirm</label>
                <input id="r-confirm" type={show ? 'text' : 'password'} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat it" required autoComplete="new-password" maxLength={72} className={input} />
              </div>
            </div>
            {confirm && password === confirm && <p className="-mt-1 flex items-center gap-1 text-xs font-bold text-emerald-700"><Check className="h-4 w-4" /> Passwords match</p>}
            <button type="submit" disabled={loading} className="group flex w-full items-center justify-center gap-2 rounded-full bg-[#1e4137] px-6 py-3.5 text-sm font-bold text-white shadow-[0_14px_30px_-12px_rgba(30,65,55,0.7)] transition-all hover:-translate-y-0.5 hover:bg-[#142e27] disabled:opacity-50">
              {loading ? 'Creating account...' : <>Create vendor account <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></>}
            </button>
            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-[#0b1311]/40">
              <span className="h-px flex-1 bg-black/10" /> or <span className="h-px flex-1 bg-black/10" />
            </div>
            <GoogleSignIn role="vendor" mode="signup" onError={(msg) => setError(msg)} />
            <p className="text-center text-xs leading-relaxed text-[#0b1311]/50">
              By creating an account you agree to our{' '}
              <Link to="/policy#terms" className="font-semibold text-[#1e4137] underline underline-offset-2">Terms</Link> and{' '}
              <Link to="/policy#privacy" className="font-semibold text-[#1e4137] underline underline-offset-2">Privacy Policy</Link>.
            </p>
            <p className="text-center text-sm text-[#0b1311]/60">
              Already a vendor? <Link to="/vendor/login" className="font-bold text-[#1e4137] underline underline-offset-4">Sign in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
