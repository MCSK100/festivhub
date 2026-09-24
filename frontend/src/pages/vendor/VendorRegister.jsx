import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, AlertCircle, Check } from 'lucide-react'
import SEO from '../../components/common/SEO'
import GoogleSignIn from '../../components/GoogleSignIn'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'

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

  const input = 'w-full rounded-full border border-black/10 bg-white px-6 py-3.5 text-[15px] font-medium text-[#0b1311] placeholder-gray-400 focus:border-[#1e4137] focus:outline-none focus:ring-2 focus:ring-[#1e4137]/20'

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fff7f0] px-4 pb-16 pt-24">
      <SEO title="Become a Vendor" description="Create your FestivLink vendor account and start receiving booking enquiries." path="/vendor/register" />
      <div className="w-full max-w-md rounded-[var(--jak-border-radius)] border border-[#1e4137]/10 bg-white p-8 shadow-xl sm:p-10">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.14em] text-[#1e4137]">For event professionals</p>
        <h1 className="mt-3 text-center text-3xl font-bold">Create Vendor Account</h1>
        <p className="mt-2 text-center text-sm text-[#0b1311]/60">List your business and receive booking requests.</p>
        <form onSubmit={submit} className="mt-8 space-y-5">
          {error && <p role="alert" className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"><AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />{error}</p>}
          <div>
            <label htmlFor="r-name" className="mb-2 block text-sm font-semibold">Business / Vendor Name</label>
            <input id="r-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Lens Studio Photography" required autoComplete="organization" maxLength={120} className={input} />
          </div>
          <div>
            <label htmlFor="r-email" className="mb-2 block text-sm font-semibold">Email</label>
            <input id="r-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@business.com" required autoComplete="email" maxLength={254} className={input} />
          </div>
          <div>
            <label htmlFor="r-phone" className="mb-2 block text-sm font-semibold">Phone</label>
            <input id="r-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" autoComplete="tel" inputMode="tel" maxLength={20} className={input} />
          </div>
          <div>
            <label htmlFor="r-pass" className="mb-2 block text-sm font-semibold">Password</label>
            <div className="relative">
              <input id="r-pass" type={show ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimum 6 characters" required autoComplete="new-password" maxLength={72} className={input} />
              <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? 'Hide password' : 'Show password'} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1e4137]">
                {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="r-confirm" className="mb-2 block text-sm font-semibold">Confirm Password</label>
            <input id="r-confirm" type={show ? 'text' : 'password'} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat your password" required autoComplete="new-password" maxLength={72} className={input} />
            {confirm && password === confirm && <p className="mt-2 flex items-center gap-1 text-xs font-medium text-emerald-700"><Check className="h-4 w-4" /> Passwords match</p>}
          </div>
          <button type="submit" disabled={loading} className="w-full rounded-full bg-[#1e4137] px-6 py-3.5 text-sm font-bold text-[#bad6ff] transition-colors hover:bg-[#142e27] disabled:opacity-50">
            {loading ? 'Creating account...' : 'Create Vendor Account'}
          </button>
          <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-[#0b1311]/40">
            <span className="h-px flex-1 bg-black/10" /> or <span className="h-px flex-1 bg-black/10" />
          </div>
          <GoogleSignIn role="vendor" mode="signup" onError={(msg) => setError(msg)} />
          <p className="text-center text-sm text-[#0b1311]/60">
            Already a vendor? <Link to="/vendor/login" className="font-semibold text-[#1e4137] underline underline-offset-4">Login</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
