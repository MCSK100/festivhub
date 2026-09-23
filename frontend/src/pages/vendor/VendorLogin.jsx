import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'
import SEO from '../../components/common/SEO'
import { useAuth } from '../../contexts/AuthContext'

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

  const input = 'w-full rounded-full border border-black/10 bg-white px-6 py-3.5 text-[15px] font-medium text-[#0b1311] placeholder-gray-400 focus:border-[#1e4137] focus:outline-none focus:ring-2 focus:ring-[#1e4137]/20'

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fff7f0] px-4 pb-16 pt-24">
      <SEO title="Vendor Login" description="Sign in to your FestivLink vendor dashboard." path="/vendor/login" />
      <div className="w-full max-w-md rounded-[var(--jak-border-radius)] border border-[#1e4137]/10 bg-white p-8 shadow-xl sm:p-10">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.14em] text-[#1e4137]">FestivLink for vendors</p>
        <h1 className="mt-3 text-center text-3xl font-bold">Vendor Login</h1>
        <p className="mt-2 text-center text-sm text-[#0b1311]/60">Manage your profile, portfolio and enquiries.</p>
        <form onSubmit={submit} className="mt-8 space-y-5">
          {error && <p role="alert" className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"><AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />{error}</p>}
          <div>
            <label htmlFor="v-email" className="mb-2 block text-sm font-semibold">Email</label>
            <input id="v-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@business.com" required autoComplete="email" className={input} />
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label htmlFor="v-pass" className="block text-sm font-semibold">Password</label>
              <Link to="/forgot-password" className="text-sm font-medium text-[#1e4137] hover:underline">Forgot Password?</Link>
            </div>
            <div className="relative">
              <input id="v-pass" type={show ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required autoComplete="current-password" className={input} />
              <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? 'Hide password' : 'Show password'} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1e4137]">
                {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full rounded-full bg-[#1e4137] px-6 py-3.5 text-sm font-bold text-[#bad6ff] transition-colors hover:bg-[#142e27] disabled:opacity-50">
            {loading ? 'Signing in...' : 'Login'}
          </button>
          <p className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            <CheckCircle className="h-5 w-5 shrink-0" /> Customers never need an account — only vendors sign in here.
          </p>
          <p className="text-center text-sm text-[#0b1311]/60">
            New vendor? <Link to="/vendor/register" className="font-semibold text-[#1e4137] underline underline-offset-4">Create Vendor Account</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
