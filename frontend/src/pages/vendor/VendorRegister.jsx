import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, AlertCircle, Check, Star, BadgeCheck, Lightbulb } from 'lucide-react'
import SEO from '../../components/common/SEO'
import GoogleSignIn from '../../components/GoogleSignIn'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'

const TIPS = [
  'Use your real business name — hosts trust real brands.',
  'Add 6+ portfolio photos before you publish.',
  'Set honest starting prices to get 3x more enquiries.',
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

  const input =
    'w-full rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-medium text-[#0b1311] placeholder-[#0b1311]/35 shadow-sm transition-all focus:border-[#1e4137] focus:outline-none focus:ring-2 focus:ring-[#1e4137]/20'

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fff7f0] px-4 py-24">
      <SEO title="Become a Vendor" description="Create your FestivLink vendor account and start receiving booking enquiries." path="/vendor/register" noindex />
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
          <h1 className="mt-6 text-3xl font-black tracking-tight sm:text-4xl">Create an account</h1>
          <p className="mt-2 text-sm text-[#0b1311]/55">Free listing • Direct enquiries • Zero spam.</p>

          <form onSubmit={submit} className="mt-7 space-y-3.5">
            {error && (
              <p role="alert" className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />{error}
              </p>
            )}
            <div>
              <label htmlFor="r-name" className="mb-1.5 block text-xs font-bold text-[#0b1311]/70">Business / vendor name</label>
              <input id="r-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Lens Studio Photography" required autoComplete="organization" maxLength={120} className={input} />
            </div>
            <div>
              <label htmlFor="r-email" className="mb-1.5 block text-xs font-bold text-[#0b1311]/70">Email</label>
              <input id="r-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@business.com" required autoComplete="email" maxLength={254} className={input} />
            </div>
            <div>
              <label htmlFor="r-phone" className="mb-1.5 block text-xs font-bold text-[#0b1311]/70">Phone <span className="font-medium text-[#0b1311]/40">(optional)</span></label>
              <input id="r-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" autoComplete="tel" inputMode="tel" maxLength={20} className={input} />
            </div>
            <div className="grid gap-3.5 sm:grid-cols-2">
              <div>
                <label htmlFor="r-pass" className="mb-1.5 block text-xs font-bold text-[#0b1311]/70">Password</label>
                <div className="relative">
                  <input id="r-pass" type={show ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters" required autoComplete="new-password" maxLength={72} className={input} />
                  <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? 'Hide password' : 'Show password'} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1e4137]">
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="r-confirm" className="mb-1.5 block text-xs font-bold text-[#0b1311]/70">Confirm</label>
                <input id="r-confirm" type={show ? 'text' : 'password'} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat it" required autoComplete="new-password" maxLength={72} className={input} />
              </div>
            </div>
            {confirm && password === confirm && (
              <p className="-mt-1 flex items-center gap-1 text-xs font-bold text-emerald-700">
                <Check className="h-4 w-4" /> Passwords match
              </p>
            )}
            <button type="submit" disabled={loading} className="w-full rounded-full bg-[#1e4137] px-6 py-3 text-sm font-bold text-white shadow-[0_14px_30px_-12px_rgba(30,65,55,0.7)] transition-all hover:-translate-y-0.5 hover:bg-[#142e27] disabled:opacity-50">
              {loading ? 'Creating account...' : 'Create vendor account'}
            </button>
            <GoogleSignIn role="vendor" mode="signup" onError={(msg) => setError(msg)} />
            <p className="text-center text-xs leading-relaxed text-[#0b1311]/50">
              By creating an account you agree to our{' '}
              <Link to="/policy#terms" className="font-semibold text-[#1e4137] underline underline-offset-2">Terms</Link> and{' '}
              <Link to="/policy#privacy" className="font-semibold text-[#1e4137] underline underline-offset-2">Privacy Policy</Link>.
            </p>
            <p className="text-center text-[13px] text-[#0b1311]/55">
              Already a vendor? <Link to="/vendor/login" className="font-bold text-[#1e4137] underline underline-offset-4">Sign in</Link>
            </p>
          </form>

          {/* Tips */}
          <div className="mt-7 rounded-3xl bg-[#1e4137]/[0.06] p-5">
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[#1e4137]">
              <Lightbulb className="h-4 w-4" /> Tips for a strong listing
            </p>
            <ul className="mt-3 space-y-2">
              {TIPS.map((t) => (
                <li key={t} className="flex items-start gap-2 text-[13px] font-medium leading-snug text-[#0b1311]/70">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#1e4137]" /> {t}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ---- Image side ---- */}
        <div className="relative hidden min-h-[600px] lg:block">
          <img
            src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1000&auto=format&fit=crop"
            alt="Celebration table with florals"
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b1311]/45 via-transparent to-[#0b1311]/10" />

          <span className="glass-ios-dark absolute right-5 top-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-semibold text-white">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            Vendors get booked daily
          </span>

          <div className="glass-ios absolute left-5 top-20 w-[240px] rounded-3xl p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#0b1311]/50">Why vendors join</p>
            <p className="mt-1.5 text-[15px] font-black leading-snug">Direct enquiries, zero spam.</p>
            <div className="mt-3 flex items-center gap-1.5">
              <span className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
              </span>
              <span className="text-xs font-bold">4.9</span>
            </div>
          </div>

          <div className="glass-ios absolute bottom-5 left-5 right-5 flex items-center justify-between gap-3 rounded-3xl p-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1e4137] px-3 py-1.5 text-[11px] font-bold text-white">
                <BadgeCheck className="h-3.5 w-3.5" /> Free listing
              </span>
              <p className="text-[13px] font-semibold text-[#0b1311]/70">Showcase photos, services & pricing</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
