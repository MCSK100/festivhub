import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useVendor } from './VendorLayout'
import api from '../../services/api'
import { useToast } from '../../components/ui/Toast'
import EmptyState from '../../components/common/EmptyState'
import { formatINR } from '../../utils/format'

const blank = { name: '', price: '', description: '', features: '' }

export default function VendorPackages() {
  const { profile, setProfile } = useVendor()
  const { success, error } = useToast()
  const [form, setForm] = useState(blank)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)

  const packages = profile?.packages || []
  const reset = () => { setForm(blank); setEditing(null) }

  const submit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) { error('Package name is required'); return }
    if (form.price === '' || Number(form.price) < 0) { error('Valid price is required'); return }
    setSaving(true)
    try {
      const payload = {
        name: form.name.trim(),
        price: Number(form.price),
        description: form.description,
        features: String(form.features).split('\n').map((f) => f.trim()).filter(Boolean),
      }
      const res = editing
        ? await api.put(`/providers/packages/${editing}`, payload)
        : await api.post('/providers/packages', payload)
      setProfile(res.data)
      reset()
      success(editing ? 'Package updated!' : 'Package added!')
    } catch (err) {
      error(err.response?.data?.error || 'Failed to save package.')
    } finally {
      setSaving(false)
    }
  }

  const del = async (id) => {
    try {
      const res = await api.delete(`/providers/packages/${id}`)
      setProfile(res.data)
      success('Package removed.')
    } catch {
      error('Failed to delete package.')
    }
  }

  const input = 'w-full rounded-xl border border-black/10 bg-[#F9FAFB] px-4 py-3 text-sm font-medium text-[#0b1311] placeholder-[#0b1311]/35 focus:border-[#1e4137] focus:outline-none focus:ring-2 focus:ring-[#1e4137]/20'

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Packages</h1>

      <form onSubmit={submit} className="rounded-[20px] border border-black/5 bg-white p-6 shadow-sm">
        <h2 className="font-bold">{editing ? 'Edit package' : 'Add a package'}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div><label className="mb-1.5 block text-sm font-semibold" htmlFor="pkg-name">Name *</label><input id="pkg-name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Premium" required className={input} /></div>
          <div><label className="mb-1.5 block text-sm font-semibold" htmlFor="pkg-price">Price (₹) *</label><input id="pkg-price" type="number" min="0" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} placeholder="30000" required className={input} /></div>
          <div className="sm:col-span-2"><label className="mb-1.5 block text-sm font-semibold" htmlFor="pkg-desc">Description</label><textarea id="pkg-desc" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={3} className={`${input} resize-none`} /></div>
          <div className="sm:col-span-2"><label className="mb-1.5 block text-sm font-semibold" htmlFor="pkg-feat">Features (one per line)</label><textarea id="pkg-feat" value={form.features} onChange={(e) => setForm((p) => ({ ...p, features: e.target.value }))} rows={4} placeholder={'Full-day coverage\n200 edited photos\nTeaser reel'} className={`${input} resize-none`} /></div>
        </div>
        <div className="mt-4 flex gap-2">
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-[#1e4137] px-6 py-2.5 text-sm font-bold text-[#bad6ff] hover:bg-[#142e27] disabled:opacity-50">
            <Plus className="h-4 w-4" /> {saving ? 'Saving...' : editing ? 'Update Package' : 'Add Package'}
          </button>
          {editing && <button type="button" onClick={reset} className="rounded-full border border-black/10 px-6 py-2.5 text-sm font-semibold">Cancel</button>}
        </div>
      </form>

      <div className="rounded-[20px] border border-black/5 bg-white p-6 shadow-sm">
        {packages.length === 0 ? (
          <EmptyState title="No packages yet." hint="Create Basic, Premium and Luxury packages with clear pricing." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {packages.map((p) => (
              <div key={p._id} className="rounded-2xl border border-[#1e4137]/15 bg-[#fff7f0] p-5">
                <p className="font-bold">{p.name}</p>
                <p className="mt-1 text-xl font-black text-[#1e4137]">{formatINR(p.price)}</p>
                {p.description && <p className="mt-2 text-sm text-[#0b1311]/65">{p.description}</p>}
                {(p.features || []).length > 0 && (
                  <ul className="mt-3 space-y-1 text-sm text-[#0b1311]/70">
                    {p.features.map((f, i) => <li key={i}>• {f}</li>)}
                  </ul>
                )}
                <div className="mt-4 flex gap-2">
                  <button type="button" aria-label={`Edit ${p.name}`} onClick={() => { setEditing(p._id); setForm({ name: p.name, price: p.price, description: p.description || '', features: (p.features || []).join('\n') }) }} className="rounded-full border border-black/10 bg-white p-2.5 hover:border-[#1e4137]"><Pencil className="h-4 w-4" /></button>
                  <button type="button" aria-label={`Delete ${p.name}`} onClick={() => del(p._id)} className="rounded-full border border-red-200 bg-white p-2.5 text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
