import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Camera,
  Save,
  Building2,
  Wallet,
  Phone,
  Globe,
  Eye,
  Check,
  ImagePlus,
  Loader2,
} from 'lucide-react'
import { useVendor } from './VendorLayout'
import api from '../../services/api'
import { useToast } from '../../components/ui/Toast'
import { CATEGORY_NAMES } from '../../data/categories'
import { compressImageFile } from '../../utils/image'
import { profileCompletion } from '../../utils/format'

const inputCls =
  'w-full rounded-2xl border border-black/10 bg-[#F9FAFB] px-4 py-3 text-sm font-medium text-[#0b1311] placeholder-[#0b1311]/35 transition-all focus:border-[#1e4137] focus:outline-none focus:ring-2 focus:ring-[#1e4137]/20'
const labelCls = 'mb-1.5 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#0b1311]/55'

function Toggle({ checked, onChange, label, hint }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 rounded-2xl border border-black/8 bg-[#F9FAFB] px-4 py-3.5 text-left transition-colors hover:border-[#1e4137]/30"
    >
      <span>
        <span className="block text-sm font-bold">{label}</span>
        {hint && <span className="mt-0.5 block text-xs text-[#0b1311]/55">{hint}</span>}
      </span>
      <span
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${checked ? 'bg-[#1e4137]' : 'bg-black/15'}`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? 'left-6' : 'left-1'}`}
        />
      </span>
    </button>
  )
}

function Section({ index, icon: Icon, title, hint, children }) {
  return (
    <section className="rounded-[24px] border border-black/5 bg-white p-6 shadow-sm sm:p-7">
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#1e4137] text-white shadow-lg shadow-[#1e4137]/20">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1e4137]">Step {index}</p>
          <h2 className="mt-0.5 text-lg font-bold tracking-tight">{title}</h2>
          {hint && <p className="mt-1 text-[13px] leading-relaxed text-[#0b1311]/55">{hint}</p>}
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  )
}

export default function VendorProfile() {
  const { profile, setProfile } = useVendor()
  const { success, error } = useToast()
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(null)
  const coverRef = useRef(null)
  const avatarRef = useRef(null)

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
        startingPrice: profile.startingPrice ?? '',
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

  const completion = useMemo(
    () => profileCompletion(profile),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [profile, form]
  )

  if (!form) {
    return (
      <div className="flex items-center gap-3 rounded-[24px] border border-black/5 bg-white p-8 text-sm font-medium text-[#0b1311]/60 shadow-sm">
        <Loader2 className="h-5 w-5 animate-spin text-[#1e4137]" /> Loading your profile…
      </div>
    )
  }

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }))

  const uploadImage = async (original, kind) => {
    if (!original) return
    setUploading(kind)
    try {
      const { file } = await compressImageFile(original, kind === 'cover' ? 'cover' : 'avatar')
      const fd = new FormData()
      fd.append('image', file)
      const res = await api.post(
        kind === 'cover' ? '/providers/cover-image' : '/providers/profile-image',
        fd,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      setProfile(res.data.provider)
      success(kind === 'cover' ? 'Cover updated!' : 'Photo updated!')
    } catch (err) {
      error(err.response?.data?.error || err.message || 'Upload failed. Please try again.')
    } finally {
      setUploading(null)
      if (coverRef.current) coverRef.current.value = ''
      if (avatarRef.current) avatarRef.current.value = ''
    }
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) {
      error('Business name is required')
      return
    }
    if (!form.category) {
      error('Please select a category')
      return
    }
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

  return (
    <form onSubmit={submit} className="space-y-5 pb-10">
      {/* sticky header */}
      <div className="sticky top-0 z-20 -mx-4 border-b border-black/5 bg-[#fff7f0]/90 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-black tracking-tight sm:text-2xl">My Profile</h1>
            <p className="mt-0.5 flex items-center gap-2 text-xs font-semibold text-[#0b1311]/55">
              <span className="inline-flex h-1.5 w-24 overflow-hidden rounded-full bg-black/10">
                <span className="h-full rounded-full bg-[#1e4137]" style={{ width: `${completion}%` }} />
              </span>
              {completion}% complete
            </p>
          </div>
          <div className="flex items-center gap-2">
            {profile && (
              <Link
                to={`/vendors/${profile._id}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-4 py-2.5 text-[13px] font-bold transition-colors hover:border-[#1e4137] hover:text-[#1e4137]"
              >
                <Eye className="h-4 w-4" /> Preview
              </Link>
            )}
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full bg-[#1e4137] px-6 py-2.5 text-[13px] font-bold text-white shadow-lg shadow-[#1e4137]/25 transition-all hover:-translate-y-0.5 hover:bg-[#142e27] disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </div>
      </div>

      {/* cover + avatar */}
      <div className="overflow-hidden rounded-[24px] border border-black/5 bg-white shadow-sm">
        <div className="group relative">
          {profile?.coverImage ? (
            <img src={profile.coverImage} alt="Cover" className="aspect-[21/8] w-full object-cover sm:aspect-[21/7]" />
          ) : (
            <div className="flex aspect-[21/8] w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#1e4137] via-[#142e27] to-[#0b1311] text-white sm:aspect-[21/7]">
              <ImagePlus className="h-8 w-8 opacity-60" />
              <p className="text-sm font-semibold opacity-80">Add a cover to make your profile shine</p>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <input
            ref={coverRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => uploadImage(e.target.files[0], 'cover')}
          />
          <button
            type="button"
            onClick={() => coverRef.current?.click()}
            disabled={uploading === 'cover'}
            className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2.5 text-[13px] font-bold text-[#0b1311] shadow-xl backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white disabled:opacity-60"
          >
            {uploading === 'cover' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
            {uploading === 'cover' ? 'Uploading…' : profile?.coverImage ? 'Change cover' : 'Upload cover'}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-4 p-5 sm:p-6">
          <div className="relative -mt-14 sm:-mt-16">
            <span className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-[24px] border-4 border-white bg-[#1e4137]/10 text-2xl font-black text-[#1e4137] shadow-xl sm:h-24 sm:w-24">
              {profile?.profileImage ? (
                <img src={profile.profileImage} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                (form.name || 'V').charAt(0).toUpperCase()
              )}
            </span>
            <input
              ref={avatarRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => uploadImage(e.target.files[0], 'profile')}
            />
            <button
              type="button"
              onClick={() => avatarRef.current?.click()}
              disabled={uploading === 'profile'}
              aria-label="Upload profile photo"
              className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full bg-[#1e4137] text-white shadow-lg transition-transform hover:scale-105 disabled:opacity-60"
            >
              {uploading === 'profile' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
            </button>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-lg font-black tracking-tight">{form.companyName || form.name || 'Your business'}</p>
            <p className="text-[13px] font-medium text-[#0b1311]/55">
              {form.category || 'Pick a category below'} {form.location.city ? `• ${form.location.city}` : ''}
            </p>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold ${
              form.isPublished ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${form.isPublished ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            {form.isPublished ? 'Live in directory' : 'Hidden'}
          </span>
        </div>
      </div>

      {/* visibility */}
      <div className="grid gap-3 sm:grid-cols-2">
        <Toggle
          checked={form.isPublished}
          onChange={(v) => set('isPublished', v)}
          label="Publish profile"
          hint="Visible to customers in the vendor directory"
        />
        <Toggle
          checked={form.availability}
          onChange={(v) => set('availability', v)}
          label="Available for new bookings"
          hint="Turn off when fully booked"
        />
      </div>

      {/* 01 business */}
      <Section index="01" icon={Building2} title="Business details" hint="This is what customers see first — make it count.">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls} htmlFor="vp-name">Business name *</label>
            <input id="vp-name" value={form.name} onChange={(e) => set('name', e.target.value)} required maxLength={120} placeholder="FireFlash Events" className={inputCls} />
          </div>
          <div>
            <label className={labelCls} htmlFor="vp-company">Display name</label>
            <input id="vp-company" value={form.companyName} onChange={(e) => set('companyName', e.target.value)} placeholder="Shown on cards" maxLength={120} className={inputCls} />
          </div>
          <div>
            <label className={labelCls} htmlFor="vp-cat">Category *</label>
            <select id="vp-cat" value={form.category} onChange={(e) => set('category', e.target.value)} required className={inputCls}>
              <option value="">Select category</option>
              {CATEGORY_NAMES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls} htmlFor="vp-exp">Experience</label>
            <input id="vp-exp" value={form.experience} onChange={(e) => set('experience', e.target.value)} placeholder="e.g. 5+ years, 200+ events" maxLength={80} className={inputCls} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls} htmlFor="vp-desc">About your work</label>
            <textarea id="vp-desc" value={form.description} onChange={(e) => set('description', e.target.value)} rows={4} maxLength={1000} placeholder="Tell customers what makes your work special — style, team size, signature setups…" className={`${inputCls} resize-none`} />
            <p className="mt-1.5 text-right text-xs font-medium text-[#0b1311]/40">{form.description.length}/1000</p>
          </div>
          <div>
            <label className={labelCls} htmlFor="vp-city">City</label>
            <input id="vp-city" value={form.location.city} onChange={(e) => setForm((p) => ({ ...p, location: { ...p.location, city: e.target.value } }))} placeholder="Coimbatore" maxLength={80} className={inputCls} />
          </div>
          <div>
            <label className={labelCls} htmlFor="vp-state">State</label>
            <input id="vp-state" value={form.location.state} onChange={(e) => setForm((p) => ({ ...p, location: { ...p.location, state: e.target.value } }))} placeholder="Tamil Nadu" maxLength={80} className={inputCls} />
          </div>
        </div>
      </Section>

      {/* 02 pricing */}
      <Section index="02" icon={Wallet} title="Pricing & schedule" hint="Honest pricing gets 3x more enquiries.">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls} htmlFor="vp-price">Starting price (₹)</label>
            <input id="vp-price" type="number" min="0" value={form.startingPrice} onChange={(e) => set('startingPrice', e.target.value)} placeholder="15000" className={inputCls} />
          </div>
          <div>
            <label className={labelCls} htmlFor="vp-range">Price range label</label>
            <input id="vp-range" value={form.priceRange} onChange={(e) => set('priceRange', e.target.value)} placeholder="₹15k – ₹50k" maxLength={60} className={inputCls} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls} htmlFor="vp-hours">Business hours</label>
            <input id="vp-hours" value={form.businessHours} onChange={(e) => set('businessHours', e.target.value)} placeholder="Mon–Sat, 10am–7pm" maxLength={120} className={inputCls} />
          </div>
        </div>
      </Section>

      {/* 03 contact */}
      <Section index="03" icon={Phone} title="Contact" hint="Only shared with customers after they enquire.">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls} htmlFor="vp-phone">Phone</label>
            <input id="vp-phone" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+91 98765 43210" maxLength={20} className={inputCls} inputMode="tel" />
          </div>
          <div>
            <label className={labelCls} htmlFor="vp-cemail">Contact email</label>
            <input id="vp-cemail" type="email" value={form.contactEmail} onChange={(e) => set('contactEmail', e.target.value)} placeholder="hello@business.com" maxLength={254} className={inputCls} />
          </div>
        </div>
      </Section>

      {/* 04 links */}
      <Section index="04" icon={Globe} title="Online presence" hint="Link your best work — profiles with links rank higher.">
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            ['vp-web', 'Website', 'website', 'https://…', 'https://yourbusiness.com'],
            ['vp-ig', 'Instagram', 'instagram', 'https://instagram.com/…', 'https://instagram.com/handle'],
            ['vp-fb', 'Facebook', 'facebook', 'https://facebook.com/…', 'https://facebook.com/page'],
            ['vp-yt', 'YouTube', 'youtube', 'https://youtube.com/…', 'https://youtube.com/@handle'],
          ].map(([id, label, key, ph]) => (
            <div key={id}>
              <label className={labelCls} htmlFor={id}>{label}</label>
              <input
                id={id}
                value={form.socialLinks[key]}
                onChange={(e) => setForm((p) => ({ ...p, socialLinks: { ...p.socialLinks, [key]: e.target.value } }))}
                placeholder={ph}
                className={inputCls}
                inputMode="url"
                maxLength={2048}
              />
            </div>
          ))}
        </div>
      </Section>

      {/* bottom save */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-[#1e4137]/15 bg-[#1e4137] p-5 text-white shadow-xl sm:p-6">
        <p className="flex items-center gap-2 text-sm font-semibold text-white/85">
          <Check className="h-4 w-4 text-emerald-300" /> Changes go live instantly in the directory.
        </p>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-bold text-[#1e4137] transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? 'Saving…' : 'Save all changes'}
        </button>
      </div>
    </form>
  )
}
