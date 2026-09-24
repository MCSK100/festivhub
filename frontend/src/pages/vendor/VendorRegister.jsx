import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, AlertCircle, Check, Star, BadgeCheck, Lightbulb, ArrowRight } from 'lucide-react'
import SEO from '../../components/common/SEO'
import GoogleSignIn from '../../components/GoogleSignIn'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'

const STEPS = [
  { n: '1', title: 'Create account', text: '30 seconds, email or Google' },
  { n: '2', title: 'Build profile', text: 'Photos, services & pricing' },
  { n: '3', title: 'Get enquiries', text: 'Hosts contact you directly' },
]

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
    'w-full rounded-2xl border border-black/10 bg-white px-5 py-3.5 text-[15px] font-medium text-[#0b1311] placeholder-[#0b1311]/35 shadow-sm transition-all focus:border-[#1e4137] focus:outline-none focus:ring-2 focus:ring-[#1e4137]/20'
  const label = 'mb-1.5 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#0b1311]/55'

  return (
    <div className="relative min-h-screen bg-[#fff7f0]">
      <SEO title="Become a Vendor" description="Create your FestivLink vendor account and start receiving booking enquiries." path="/vendor/register" noindex />

      {/* Mobile top banner */}
      <div className="relative h-52 overflow-hidden sm:h-64 lg:hidden">
        <img
          src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1000&auto=format&fit=crop"
          alt="Celebration table"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f2a23]/90 via-[#1e4137]/40 to-transparent" />
        <Link to="/" className="absolute left-5 top-5 block w-fit rounded-2xl bg-white/95 px-3 py-2 shadow-lg backdrop-blur" aria-label="FestivLink home">
          <img src="/new-logo.png" alt="FestivLink logo" className="h-8 w-auto" />
        </Link>
        <p className="absolute bottom-5 left-5 right-5 text-2xl font-black leading-tight text-white">
          List your business. Get booked.
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
            <div className="mt-6 flex items-center gap-2">
              {STEPS.map((s, i) => (
                <span key={s.n} className="flex items-center gap-2">
                  <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-black ${i === 0 ? 'bg-[#1e4137] text-white' : 'bg-[#0b1311]/8 text-[#0b1311]/50'}`}>{s.n}</span>
                  {i < STEPS.length - 1 && <span className="h-px w-6 bg-black/10 sm:w-10" />}
                </span>
              ))}
              <span className="ml-1 text-xs font-bold text-[#0b1311]/50">Step 1 of 1 — it's quick</span>
            </div>
            <h1 className="mt-4 text-4xl font-black tracking-[-0.02em] sm:text-5xl">Create account</h1>
            <p className="mt-3 text-[15px] leading-relaxed text-[#0b1311]/60">
              Free listing • Direct enquiries • Zero spam.
            </p>

            <form onSubmit={submit} className="mt-8 space-y-4">
              {error && (
                <p role="alert" className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />{error}
                </p>
              )}
              <div>
                <label htmlFor="r-name" className={label}>Business / vendor name</label>
                <input id="r-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Lens Studio Photography" required autoComplete="organization" maxLength={120} className={input} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="r-email" className={label}>Email</label>
                  <input id="r-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@business.com" required autoComplete="email" maxLength={254} className={input} />
                </div>
                <div>
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
              {confirm && password === confirm && (
                <p className="-mt-1 flex items-center gap-1 text-xs font-bold text-emerald-700">
                  <Check className="h-4 w-4" /> Passwords match
                </p>
              )}
              <button type="submit" disabled={loading} className="group flex w-full items-center justify-center gap-2 rounded-full bg-[#1e4137] px-6 py-4 text-sm font-bold text-white shadow-[0_16px_36px_-12px_rgba(30,65,55,0.7)] transition-all hover:-translate-y-0.5 hover:bg-[#142e27] disabled:opacity-50">
                {loading ? 'Creating account...' : <>Create vendor account <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></>}
              </button>
              <div className="flex items-center gap-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#0b1311]/40">
                <span className="h-px flex-1 bg-black/10" /> or continue with <span className="h-px flex-1 bg-black/10" />
              </div>
              <div className="flex justify-center overflow-hidden rounded-full border border-black/10 bg-white py-1.5 shadow-sm">
                <GoogleSignIn role="vendor" mode="signup" onError={(msg) => setError(msg)} />
              </div>
              <p className="text-center text-xs leading-relaxed text-[#0b1311]/50">
                By creating an account you agree to our{' '}
                <Link to="/policy#terms" className="font-semibold text-[#1e4137] underline underline-offset-2">Terms</Link> and{' '}
                <Link to="/policy#privacy" className="font-semibold text-[#1e4137] underline underline-offset-2">Privacy Policy</Link>.
              </p>
              <p className="text-center text-sm text-[#0b1311]/60">
                Already a vendor? <Link to="/vendor/login" className="font-bold text-[#1e4137] underline underline-offset-4">Sign in</Link>
              </p>
            </form>

            <div className="mt-8 rounded-[24px] border border-[#1e4137]/10 bg-white/70 p-5 backdrop-blur">
              <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[#1e4137]">
                <Lightbulb className="h-4 w-4" /> Tips for a strong listing
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
            src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1400&auto=format&fit=crop"
            alt="Celebration table with florals"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f2a23]/85 via-[#1e4137]/25 to-[#0b1311]/15" />

          <div className="absolute inset-x-10 top-10 flex items-center justify-between">
            <span className="glass-ios-dark inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-semibold text-white">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              Vendors get booked daily
            </span>
            <span className="glass-ios inline-flex items-center gap-1 text-[12px] font-black text-[#0b1311] sm:inline-flex">
              <span className="flex px-2 py-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
              </span>
              4.9
            </span>
          </div>

          <div className="absolute inset-x-10 bottom-10 space-y-3">
            {STEPS.map((s) => (
              <div key={s.n} className="glass-ios flex items-center gap-4 rounded-3xl p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1e4137] text-sm font-black text-white">{s.n}</span>
                <span>
                  <span className="block text-[15px] font-black">{s.title}</span>
                  <span className="block text-[13px] font-medium text-[#0b1311]/60">{s.text}</span>
                </span>
              </div>
            ))}
            <div className="flex items-center gap-2 rounded-full bg-[#1e4137] px-4 py-2.5 text-[12px] font-bold text-white">
              <BadgeCheck className="h-4 w-4 text-emerald-300" /> Free listing • No spam • Direct chat
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
