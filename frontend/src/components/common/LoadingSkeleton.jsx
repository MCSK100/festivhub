export function VendorCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[var(--jak-border-radius)] border border-black/5 bg-white shadow-sm" aria-hidden>
      <div className="aspect-[4/3] animate-pulse bg-[#0b1311]/5" />
      <div className="space-y-3 p-5">
        <div className="h-5 w-3/4 animate-pulse rounded bg-[#0b1311]/10" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-[#0b1311]/10" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-[#0b1311]/10" />
        <div className="h-9 w-full animate-pulse rounded-full bg-[#0b1311]/10" />
      </div>
    </div>
  )
}

export function VendorGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-label="Loading vendors">
      {Array.from({ length: count }).map((_, i) => (
        <VendorCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function PageSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10" aria-label="Loading page">
      <div className="h-8 w-1/3 animate-pulse rounded bg-[#0b1311]/10" />
      <div className="mt-3 h-4 w-1/2 animate-pulse rounded bg-[#0b1311]/10" />
      <div className="mt-8 h-64 animate-pulse rounded-[var(--jak-border-radius)] bg-[#0b1311]/5" />
    </div>
  )
}
