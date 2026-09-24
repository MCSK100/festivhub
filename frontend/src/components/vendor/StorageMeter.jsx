import { useEffect, useState } from 'react'
import { HardDrive } from 'lucide-react'
import api from '../../services/api'
import { formatKB } from '../../utils/image'

/**
 * Small storage-quota meter for the vendor workspace.
 * Refreshes when `refreshKey` changes (e.g. after an upload/delete).
 */
export default function StorageMeter({ refreshKey = 0, compact = false }) {
  const [usage, setUsage] = useState(null)

  useEffect(() => {
    let alive = true
    api
      .get('/providers/storage/usage')
      .then((res) => alive && setUsage(res.data))
      .catch(() => alive && setUsage(null))
    return () => {
      alive = false
    }
  }, [refreshKey])

  if (!usage) return null
  const pct = Math.min(100, Math.round((usage.totalBytes / usage.quotaBytes) * 100))
  const over = pct >= 90

  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold ${
          over ? 'bg-red-50 text-red-700' : 'bg-[#0b1311]/5 text-[#0b1311]/60'
        }`}
        title={`${formatKB(usage.totalBytes)} of ${usage.quotaMB}MB used`}
      >
        <HardDrive className="h-3.5 w-3.5" />
        {formatKB(usage.totalBytes)} / {usage.quotaMB}MB
      </span>
    )
  }

  return (
    <div className="rounded-[20px] border border-black/5 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="inline-flex items-center gap-2 text-sm font-bold">
          <HardDrive className="h-4 w-4 text-[#1e4137]" />
          Storage
        </p>
        <p className="text-xs font-semibold text-[#0b1311]/55">
          {formatKB(usage.totalBytes)} of {usage.quotaMB}MB used
          {typeof usage.portfolioCount === 'number' && ` • ${usage.portfolioCount}/${usage.maxPortfolioImages} photos`}
        </p>
      </div>
      <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#0b1311]/6">
        <div
          className={`h-full rounded-full transition-all ${over ? 'bg-red-500' : 'bg-[#1e4137]'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-2 text-xs leading-relaxed text-[#0b1311]/55">
        Uploads are auto-compressed (≈80% smaller). {over ? 'Almost full — delete a portfolio photo to free space.' : 'Plenty of room.'}
      </p>
    </div>
  )
}
