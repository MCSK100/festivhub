import { useRef, useState } from 'react'
import { Plus, Trash2, Upload } from 'lucide-react'
import { useVendor } from './VendorLayout'
import api from '../../services/api'
import { useToast } from '../../components/ui/Toast'
import EmptyState from '../../components/common/EmptyState'

export default function VendorPortfolio() {
  const { profile, setProfile } = useVendor()
  const { success, error } = useToast()
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef(null)

  const upload = async (file) => {
    if (!file) return
    if (file.size > 3 * 1024 * 1024) { error('File size must be less than 3MB'); return }
    if (!file.type.startsWith('image/')) { error('Please select an image file'); return }
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('image', file)
      const res = await api.post(`/providers/${profile._id}/gallery`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      setProfile({ ...profile, portfolioImages: [...(profile.portfolioImages || []), res.data.url] })
      success('Image uploaded!')
      if (fileRef.current) fileRef.current.value = ''
    } catch (err) {
      error(err.response?.data?.error || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const remove = async (url) => {
    try {
      const res = await api.delete(`/providers/portfolio?imageUrl=${encodeURIComponent(url)}`)
      setProfile(res.data.provider)
      success('Image deleted.')
    } catch {
      error('Failed to delete image.')
    }
  }

  const images = profile?.portfolioImages || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Portfolio</h1>
        <p className="text-sm text-[#0b1311]/60">{images.length} images</p>
      </div>

      <div className="rounded-[20px] border border-black/5 bg-white p-6 shadow-sm">
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => upload(e.target.files[0])} />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex w-full flex-col items-center rounded-2xl border-2 border-dashed border-[#1e4137]/25 bg-[#0b1311]/[0.02] p-10 text-center hover:bg-[#0b1311]/[0.04] disabled:opacity-50"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1e4137]/10"><Upload className="h-6 w-6 text-[#1e4137]" /></span>
          <span className="mt-3 font-bold">{uploading ? 'Uploading...' : 'Upload image'}</span>
          <span className="mt-1 text-sm text-[#0b1311]/60">JPG, PNG, WEBP • Max 3MB</span>
        </button>
      </div>

      <div className="rounded-[20px] border border-black/5 bg-white p-6 shadow-sm">
        {images.length === 0 ? (
          <EmptyState
            icon="image"
            title="No portfolio images yet."
            hint="Upload your best event work so customers can see what you do."
            action={<button type="button" onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-2 rounded-full bg-[#1e4137] px-6 py-2.5 text-sm font-semibold text-[#bad6ff]"><Plus className="h-4 w-4" /> Add First Image</button>}
          />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {images.map((src, i) => (
              <div key={src} className="group relative overflow-hidden rounded-2xl border border-black/5">
                <img src={src} alt={`Portfolio ${i + 1}`} loading="lazy" className="aspect-square w-full object-cover" />
                <button
                  type="button"
                  onClick={() => remove(src)}
                  aria-label={`Delete portfolio image ${i + 1}`}
                  className="absolute right-2 top-2 rounded-full bg-rose-600 p-2 text-white shadow-lg hover:bg-rose-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
