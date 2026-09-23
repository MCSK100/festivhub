import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Camera, Save } from 'lucide-react'
import { useVendor } from './VendorLayout'
import api from '../../services/api'
import { useToast } from '../../components/ui/Toast'
import { CATEGORY_NAMES } from '../../data/categories'

export default function VendorProfile() {
  const { profile, setProfile } = useVendor()
  const { success, error } = useToast()
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(null)

  useEffect(() => {
    if (profile && !form) {
      setForm({
        name: profile.name || '',
        companyName: profile.companyName || '',
        category: profile.category || '',
        experience: profile.experience || '',
        description: profile.description || '',
        phone: profile.phone || '',
        contactEmail: profile.contactEmail || '',
        location: { city: profile.location?.city || '', state: profile.location?.state || '' },
        priceRange: profile.priceRange || '',
        startingPrice: profile.startingPrice || '',
        businessHours: profile.businessHours || '',
        availability: profile.availability !== false,
        isPublished: profile.isPublished !== false,
        socialLinks: {
          facebook: profile.socialLinks?.facebook || '',
          instagram: profile.socialLinks?.instagram || '',
          website: profile.socialLinks?.website || '',
          youtube: profile.socialLinks?.youtube || '',
        },
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile])

  if (!form) return <p className="text-sm text-[#0b1311]/60">Loading profile…</p>

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }))

  const uploadImage = async (file, kind) => {
    if (!file) return
    if (file.size > 3 * 1024 * 1024) { error('File size must be less than 3MB'); return }
    if (!file.type.startsWith('image/')) { error('Please select an image file'); return }
    setUploading(kind)
    try {
      const fd = new FormData()
      fd.append('image', file)
      const res = await api.post(kind === 'cover' ? '/providers/cover-image' : '/providers/profile-image', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setProfile(res.data.provider)
      success(kind === 'cover' ? 'Cover image updated!' : 'Profile photo updated!')
    } catch (err) {
      error(err.response?.data?.error || 'Upload failed. Please try again.')
    } finally {
      setUploading(null)
    }
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) { error('Business name is required'); return }
    if (!form.category) { error('Please select a category'); return }
    setSaving(true)
    try {
      const payload = {
        ...form,
        startingPrice: form.startingPrice === '' ? 0 : Number(form.startingPrice),
      }
      const res = await api.put('/providers/profile', payload)
      setProfile(res.data)
      success('Profile saved!')
    } catch (err) {
      error(err.response?.data?.error || 'Failed to save profile.')
    } finally {
      setSaving(false)
    }
  }

  const input = 'w-full rounded-xl border border-black/10 bg-[#F9FAFB] px-4 py-3 text-sm font-medium text-[#0b1311] placeholder-[#0b1311]/35 focus:border-[#1e4137] focus:outline-none focus:ring-2 focus:ring-[#1e4137]/20'

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <div className="flex gap-2">
          {profile && <Link to={`/vendors/${profile._id}`} className="rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-semibold hover:border-[#1e4137]">Preview Profile</Link>}
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-[#1e4137] px-6 py-2.5 text-sm font-bold text-[#bad6ff] hover:bg-[#142e27] disabled:opacity-50">
            <Save className="h-4 w-4" /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="grid gap-4 rounded-[20px] border border-black/5 bg-white p-6 shadow-sm sm:grid-cols-2">
        <div className="sm:col-span-2">
          <p className="text-sm font-bold">Cover image</p>
          {profile?.coverImage && <img src={profile.coverImage} alt="Cover" className="mt-2 aspect-[21/9] w-full rounded-xl object-cover" />}
          <label className="mt-2 inline-flex cursor-pointer items-center gap-2 rounded-full border border-black/10 px-5 py-2.5 text-sm font-semibold hover:border-[#1e4137]">
            <Camera className="h-4 w-4" /> {uploading === 'cover' ? 'Uploading...' : 'Upload cover'}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => uploadImage(e.target.files[0], 'cover')} />
          </label>
        </div>
        <div>
          <p className="text-sm font-bold">Profile photo</p>
          <div className="mt-2 flex items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-[#1e4137]/10 font-bold text-[#1e4137]">
              {profile?.profileImage ? <img src={profile.profileImage} alt="Profile" className="h-full w-full object-cover" /> : (form.name || 'V').charAt(0)}
            </span>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-black/10 px-5 py-2.5 text-sm font-semibold hover:border-[#1e4137]">
              <Camera className="h-4 w-4" /> {uploading === 'profile' ? 'Uploading...' : 'Upload photo'}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => uploadImage(e.target.files[0], 'profile')} />
            </label>
          </div>
        </div>
        <label className="flex items-center gap-3 text-sm font-medium">
          <input type="checkbox" checked={form.isPublished} onChange={(e) => set('isPublished', e.target.checked)} className="h-5 w-5 accent-[#1e4137]" />
          Publish profile (visible in vendor directory)
        </label>
      </div>

      <div className="rounded-[20px] border border-black/5 bg-white p-6 shadow-sm">
        <h2 className="font-bold">Business details</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div><label className="mb-1.5 block text-sm font-semibold" htmlFor="vp-name">Business name *</label><input id="vp-name" value={form.name} onChange={(e) => set('name', e.target.value)} required className={input} /></div>
          <div><label className="mb-1.5 block text-sm font-semibold" htmlFor="vp-company">Display name</label><input id="vp-company" value={form.companyName} onChange={(e) => set('companyName', e.target.value)} placeholder="Shown on cards" className={input} /></div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold" htmlFor="vp-cat">Category *</label>
            <select id="vp-cat" value={form.category} onChange={(e) => set('category', e.target.value)} required className={input}>
              <option value="">Select category</option>
              {CATEGORY_NAMES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div><label className="mb-1.5 block text-sm font-semibold" htmlFor="vp-exp">Experience</label><input id="vp-exp" value={form.experience} onChange={(e) => set('experience', e.target.value)} placeholder="e.g. 5+ years" className={input} /></div>
          <div className="sm:col-span-2"><label className="mb-1.5 block text-sm font-semibold" htmlFor="vp-desc">Description</label><textarea id="vp-desc" value={form.description} onChange={(e) => set('description', e.target.value)} rows={4} className={`${input} resize-none`} placeholder="Tell customers about your work..." /></div>
          <div><label className="mb-1.5 block text-sm font-semibold" htmlFor="vp-city">City</label><input id="vp-city" value={form.location.city} onChange={(e) => setForm((p) => ({ ...p, location: { ...p.location, city: e.target.value } }))} placeholder="Coimbatore" className={input} /></div>
          <div><label className="mb-1.5 block text-sm font-semibold" htmlFor="vp-state">State</label><input id="vp-state" value={form.location.state} onChange={(e) => setForm((p) => ({ ...p, location: { ...p.location, state: e.target.value } }))} placeholder="Tamil Nadu" className={input} /></div>
          <div><label className="mb-1.5 block text-sm font-semibold" htmlFor="vp-phone">Phone</label><input id="vp-phone" value={form.phone} onChange={(e) => set('phone', e.target.value)} className={input} inputMode="tel" /></div>
          <div><label className="mb-1.5 block text-sm font-semibold" htmlFor="vp-cemail">Contact email</label><input id="vp-cemail" type="email" value={form.contactEmail} onChange={(e) => set('contactEmail', e.target.value)} className={input} /></div>
          <div><label className="mb-1.5 block text-sm font-semibold" htmlFor="vp-price">Starting price (₹)</label><input id="vp-price" type="number" min="0" value={form.startingPrice} onChange={(e) => set('startingPrice', e.target.value)} placeholder="15000" className={input} /></div>
          <div><label className="mb-1.5 block text-sm font-semibold" htmlFor="vp-range">Price range label</label><input id="vp-range" value={form.priceRange} onChange={(e) => set('priceRange', e.target.value)} placeholder="₹15k – ₹50k" className={input} /></div>
          <div className="sm:col-span-2"><label className="mb-1.5 block text-sm font-semibold" htmlFor="vp-hours">Business hours</label><input id="vp-hours" value={form.businessHours} onChange={(e) => set('businessHours', e.target.value)} placeholder="Mon–Sat, 10am–7pm" className={input} /></div>
          <label className="flex items-center gap-3 text-sm font-medium"><input type="checkbox" checked={form.availability} onChange={(e) => set('availability', e.target.checked)} className="h-5 w-5 accent-[#1e4137]" /> Available for new bookings</label>
        </div>
      </div>

      <div className="rounded-[20px] border border-black/5 bg-white p-6 shadow-sm">
        <h2 className="font-bold">Links</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div><label className="mb-1.5 block text-sm font-semibold" htmlFor="vp-web">Website</label><input id="vp-web" value={form.socialLinks.website} onChange={(e) => setForm((p) => ({ ...p, socialLinks: { ...p.socialLinks, website: e.target.value } }))} placeholder="https://…" className={input} inputMode="url" /></div>
          <div><label className="mb-1.5 block text-sm font-semibold" htmlFor="vp-ig">Instagram</label><input id="vp-ig" value={form.socialLinks.instagram} onChange={(e) => setForm((p) => ({ ...p, socialLinks: { ...p.socialLinks, instagram: e.target.value } }))} placeholder="https://instagram.com/…" className={input} inputMode="url" /></div>
          <div><label className="mb-1.5 block text-sm font-semibold" htmlFor="vp-fb">Facebook</label><input id="vp-fb" value={form.socialLinks.facebook} onChange={(e) => setForm((p) => ({ ...p, socialLinks: { ...p.socialLinks, facebook: e.target.value } }))} placeholder="https://facebook.com/…" className={input} inputMode="url" /></div>
          <div><label className="mb-1.5 block text-sm font-semibold" htmlFor="vp-yt">YouTube</label><input id="vp-yt" value={form.socialLinks.youtube} onChange={(e) => setForm((p) => ({ ...p, socialLinks: { ...p.socialLinks, youtube: e.target.value } }))} placeholder="https://youtube.com/…" className={input} inputMode="url" /></div>
        </div>
      </div>
    </form>
  )
}
