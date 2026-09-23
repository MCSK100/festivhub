import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useVendor } from './VendorLayout'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../components/ui/Toast'
import api from '../../services/api'

export default function VendorSettings() {
  const { profile, setProfile } = useVendor()
  const { logout } = useAuth()
  const { success, error } = useToast()
  const navigate = useNavigate()
  const [email, setEmail] = useState(profile?.contactEmail || '')
  const [saving, setSaving] = useState(false)

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await api.put('/providers/profile', { contactEmail: email })
      setProfile(res.data)
      success('Settings saved!')
    } catch {
      error('Failed to save settings.')
    } finally {
      setSaving(false)
    }
  }

  const togglePublish = async () => {
    try {
      const res = await api.put('/providers/profile', { isPublished: !(profile?.isPublished !== false) })
      setProfile(res.data)
      success(res.data.isPublished !== false ? 'Profile published!' : 'Profile hidden.')
    } catch {
      error('Failed to update visibility.')
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <form onSubmit={save} className="rounded-[20px] border border-black/5 bg-white p-6 shadow-sm">
        <h2 className="font-bold">Contact</h2>
        <label className="mt-3 block text-sm font-semibold" htmlFor="set-email">Contact email</label>
        <input id="set-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 w-full rounded-xl border border-black/10 bg-[#F9FAFB] px-4 py-3 text-sm font-medium focus:border-[#1e4137] focus:outline-none" />
        <button type="submit" disabled={saving} className="mt-4 rounded-full bg-[#1e4137] px-6 py-2.5 text-sm font-bold text-[#bad6ff] disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      <div className="rounded-[20px] border border-black/5 bg-white p-6 shadow-sm">
        <h2 className="font-bold">Profile visibility</h2>
        <p className="mt-1 text-sm text-[#0b1311]/60">
          {profile?.isPublished !== false ? 'Your profile is live in the vendor directory.' : 'Your profile is hidden from the directory.'}
        </p>
        <button type="button" onClick={togglePublish} className="mt-4 rounded-full border border-black/10 bg-white px-6 py-2.5 text-sm font-semibold hover:border-[#1e4137]">
          {profile?.isPublished !== false ? 'Unpublish profile' : 'Publish profile'}
        </button>
      </div>

      <div className="rounded-[20px] border border-red-200 bg-red-50/50 p-6">
        <h2 className="font-bold text-red-800">Danger zone</h2>
        <p className="mt-1 text-sm text-red-700/80">Sign out of the vendor portal on this device.</p>
        <button
          type="button"
          onClick={() => { logout(); navigate('/', { replace: true }) }}
          className="mt-4 rounded-full bg-red-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  )
}
