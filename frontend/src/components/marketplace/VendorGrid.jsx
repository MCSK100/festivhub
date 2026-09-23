import VendorCard from './VendorCard'
import { VendorGridSkeleton } from '../common/LoadingSkeleton'
import EmptyState from '../common/EmptyState'
import { ErrorState } from '../common/EmptyState'

export default function VendorGrid({ vendors, loading, error, total, onRetry, onClearFilters }) {
  if (loading) return <VendorGridSkeleton />
  if (error) return <ErrorState onRetry={onRetry} />
  if (!vendors || vendors.length === 0) {
    return (
      <EmptyState
        title="No vendors found"
        hint="Try another category or location."
        action={
          onClearFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="rounded-full bg-[#1e4137] px-6 py-2.5 text-sm font-semibold text-[#bad6ff] transition-colors hover:bg-[#142e27]"
            >
              Clear Filters
            </button>
          )
        }
      />
    )
  }
  return (
    <div>
      {typeof total === 'number' && (
        <p className="mb-5 text-sm font-medium text-[#0b1311]/60" role="status">
          {total} Vendor{total === 1 ? '' : 's'} Found
        </p>
      )}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {vendors.map((v) => (
          <VendorCard key={v._id} vendor={v} />
        ))}
      </div>
    </div>
  )
}
