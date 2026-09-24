import { useRef, useState } from 'react'
import { Plus, Trash2, Upload, Loader2, Images } from 'lucide-react'
import { useVendor } from './VendorLayout'
import api from '../../services/api'
import { useToast } from '../../components/ui/Toast'
import EmptyState from '../../components/common/EmptyState'
import { compressImageFile, formatKB } from '../../utils/image'
import StorageMeter from '../../components/vendor/StorageMeter'

export default function VendorPortfolio() {
  const { profile, setProfile } = useVendor()
  const { success, error } = useToast()
  const [uploading, setUploading] = useState(false)
  const [storageKey, setStorageKey] = useState(0)
  const fileRef = useRef(null)

  const upload = async (original) => {
    if (!original) return
    setUploading(true)
    try {
      const { file, originalBytes, compressedBytes } = await compressImageFile(original, 'portfolio')
      const fd = new FormData()
      fd.append('image', file)
      const res = await api.post(`/providers/${profile._id}/gallery`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setProfile({ ...profile, portfolioImages: [...(profile.portfolioImages || []), res.data.url] })
      setStorageKey((k) => k + 1)
      success(
        originalBytes > compressedBytes
          ? `Uploaded (${formatKB(originalBytes)} → ${formatKB(compressedBytes)})!`
          : 'Image uploaded!'
      )
      if (fileRef.current) fileRef.current.value = ''
    } catch (err) {
      error(err.response?.data?.error || err.message || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const remove = async (url) => {
    try {
      const res = await api.delete(`/providers/portfolio?imageUrl=${encodeURIComponent(url)}`)
      setProfile(res.data.provider)
      setStorageKey((k) => k + 1)
      success('Image deleted — space freed.')
    } catch {
      error('Failed to delete image.')
    }
  }

  const images = profile?.portfolioImages || []

  return (
    <div className="space-y-5 pb-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2.5 text-2xl font-black tracking-tight">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#1e4137] text-white">
              <Images className="h-5 w-5" />
            </span>
            Portfolio
          </h1>
          <p className="mt-1.5 text-[13px] font-medium text-[#0b1311]/55">
            {images.length} photos • best work first — customers judge in seconds.
          </p>
        </div>
      </div>

      <StorageMeter refreshKey={storageKey} />

      <div className="rounded-[24px] border border-black/5 bg-white p-5 shadow-sm sm:p-6">
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => upload(e.target.files[0])} />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="group flex w-full flex-col items-center rounded-3xl border-2 border-dashed border-[#1e4137]/25 bg-[#0b1311]/[0.02] p-8 text-center transition-colors hover:border-[#1e4137]/50 hover:bg-[#1e4137]/[0.04] disabled:opacity-50 sm:p-10"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1e4137] text-white shadow-lg shadow-[#1e4137]/25 transition-transform group-hover:scale-105">
            {uploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Upload className="h-6 w-6" />}
          </span>
          <span className="mt-3 font-bold">{uploading ? 'Compressing & uploading…' : 'Drop your best shot here'}</span>
          <span className="mt-1 text-[13px] text-[#0b1311]/55">JPG, PNG, WEBP • auto-compressed to ~200KB • max 12 photos</span>
        </button>
      </div>

      <div className="rounded-[24px] border border-black/5 bg-white p-5 shadow-sm sm:p-6">
        {images.length === 0 ? (
          <EmptyState
            icon="image"
            title="No portfolio images yet."
            hint="Upload your best event work so customers can see what you do."
            action={<button type="button" onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-2 rounded-full bg-[#1e4137] px-6 py-2.5 text-sm font-semibold text-white"><Plus className="h-4 w-4" /> Add first photo</button>}
          />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
            {images.map((src, i) => (
              <div key={src} className="group relative overflow-hidden rounded-2xl border border-black/5 bg-black/5">
                <img src={src} alt={`Portfolio ${i + 1}`} loading="lazy" className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                {i === 0 && (
                  <span className="absolute left-2 top-2 rounded-full bg-[#1e4137] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                    Cover
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => remove(src)}
                  aria-label={`Delete portfolio image ${i + 1}`}
                  className="absolute right-2 top-2 rounded-full bg-black/55 p-2 text-white opacity-0 backdrop-blur transition-all hover:bg-rose-600 group-hover:opacity-100"
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
