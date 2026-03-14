import type { PaginationMeta } from '../../lib/types'

export function PaginationControls({
  pagination,
  onPrevious,
  onNext,
  label,
}: {
  pagination: PaginationMeta
  onPrevious: () => void
  onNext: () => void
  label: string
}) {
  return (
    <div className="mt-8 flex items-center justify-between" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
      <p className="text-sm text-zinc-500">
        Page {pagination.page} of {pagination.totalPages} · {pagination.totalItems} {label}
      </p>
      <div className="flex gap-3">
        <button
          onClick={onPrevious}
          disabled={!pagination.hasPrevious}
          className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-white disabled:opacity-40"
        >
          Previous
        </button>
        <button
          onClick={onNext}
          disabled={!pagination.hasNext}
          className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-white disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  )
}
