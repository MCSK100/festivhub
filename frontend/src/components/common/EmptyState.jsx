import { SearchX, CalendarX, ImageOff, AlertTriangle } from 'lucide-react'

export default function EmptyState({ icon = 'search', title, hint, action }) {
  const Icon = icon === 'booking' ? CalendarX : icon === 'image' ? ImageOff : SearchX
  return (
    <div className="rounded-[var(--jak-border-radius)] border border-black/5 bg-white px-6 py-14 text-center shadow-sm">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#1e4137]/5">
        <Icon className="h-7 w-7 text-[#1e4137]" />
      </span>
      <h3 className="mt-4 text-lg font-semibold text-[#0b1311]">{title}</h3>
      {hint && <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-[#0b1311]/60">{hint}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

export function ErrorState({ title = 'Something went wrong. Please try again.', onRetry }) {
  return (
    <div className="rounded-[var(--jak-border-radius)] border border-red-200 bg-red-50/60 px-6 py-12 text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
        <AlertTriangle className="h-7 w-7 text-red-600" />
      </span>
      <h3 className="mt-4 text-lg font-semibold text-[#0b1311]">{title}</h3>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 rounded-full border border-[#1e4137]/20 bg-white px-6 py-2.5 text-sm font-semibold text-[#1e4137] transition-colors hover:border-[#1e4137]"
        >
          Try again
        </button>
      )}
    </div>
  )
}
