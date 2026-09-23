import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useVendor } from './VendorLayout'
import api from '../../services/api'
import { useToast } from '../../components/ui/Toast'
import EmptyState from '../../components/common/EmptyState'
import { formatINR } from '../../utils/format'

const blank = { name: '', description: '', startingPrice: '' }

export default function VendorServices() {
  const { profile, setProfile } = useVendor()
  const { success, error } = useToast()
  const [form, setForm] = useState(blank)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)

  const services = profile?.services || []

  const reset = () => { setForm(blank); setEditing(null) }

  const submit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) { error('Service name is required'); return }
    setSaving(true)
    try {
      const payload = { name: form.name.trim(), description: form.description, startingPrice: form.startingPrice === '' ? 0 : Number(form.startingPrice) }
      const res = editing
        ? await api.put(`/providers/services/${editing}`, payload)
        : await api.post('/providers/services', payload)
      setProfile(res.data)
      reset()
      success(editing ? 'Service updated!' : 'Service added!')
    } catch (err) {
      error(err.response?.data?.error || 'Failed to save service.')
    } finally {
      setSaving(false)
    }
  }

  const del = async (id) => {
    try {
      const res = await api.delete(`/providers/services/${id}`)
      setProfile(res.data)
      success('Service removed.')
    } catch {
      error('Failed to delete service.')
    }
  }

  const input = 'w-full rounded-xl border border-black/10 bg-[#F9FAFB] px-4 py-3 text-sm font-medium text-[#0b1311] placeholder-[#0b1311]/35 focus:border-[#1e4137] focus:outline-none focus:ring-2 focus:ring-[#1e4137]/20'

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Services</h1>

      <form onSubmit={submit} className="rounded-[20px] border border-black/5 bg-white p-6 shadow-sm">
        <h2 className="font-bold">{editing ? 'Edit service' : 'Add a service'}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2"><label className="mb-1.5 block text-sm font-semibold" htmlFor="svc-name">Name *</label><input id="svc-name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Wedding Photography" required className={input} /></div>
          <div className="sm:col-span-2"><label className="mb-1.5 block text-sm font-semibold" htmlFor="svc-desc">Description</label><textarea id="svc-desc" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={3} className={`${input} resize-none`} placeholder="What is included..." /></div>
          <div><label className="mb-1.5 block text-sm font-semibold" htmlFor="svc-price">Starting price (₹)</label><input id="svc-price" type="number" min="0" value={form.startingPrice} onChange={(e) => setForm((p) => ({ ...p, startingPrice: e.target.value }))} placeholder="15000" className={input} /></div>
        </div>
        <div className="mt-4 flex gap-2">
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-[#1e4137] px-6 py-2.5 text-sm font-bold text-[#bad6ff] hover:bg-[#142e27] disabled:opacity-50">
            <Plus className="h-4 w-4" /> {saving ? 'Saving...' : editing ? 'Update Service' : 'Add Service'}
          </button>
          {editing && <button type="button" onClick={reset} className="rounded-full border border-black/10 px-6 py-2.5 text-sm font-semibold">Cancel</button>}
        </div>
      </form>

      <div className="rounded-[20px] border border-black/5 bg-white p-6 shadow-sm">
        {services.length === 0 ? (
          <EmptyState title="No services yet." hint="Add services like Wedding Photography, Candid Shoot or Pre-Wedding Shoot." />
        ) : (
          <ul className="space-y-3">
            {services.map((s) => (
              <li key={s._id} className="flex items-start justify-between gap-4 rounded-xl bg-[#0b1311]/[0.03] p-4">
                <div>
                  <p className="font-bold">{s.name}</p>
                  {s.description && <p className="mt-1 text-sm text-[#0b1311]/60">{s.description}</p>}
                  {Number(s.startingPrice) > 0 && <p className="mt-1 text-sm font-bold">{formatINR(s.startingPrice)}</p>}
                </div>
                <div className="flex shrink-0 gap-2">
                  <button type="button" aria-label={`Edit ${s.name}`} onClick={() => { setEditing(s._id); setForm({ name: s.name, description: s.description || '', startingPrice: s.startingPrice || '' }) }} className="rounded-full border border-black/10 p-2.5 hover:border-[#1e4137]"><Pencil className="h-4 w-4" /></button>
                  <button type="button" aria-label={`Delete ${s.name}`} onClick={() => del(s._id)} className="rounded-full border border-red-200 p-2.5 text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
