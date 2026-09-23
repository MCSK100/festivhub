import { useState } from 'react'
import { X } from 'lucide-react'
import EmptyState from '../common/EmptyState'

export default function PortfolioGallery({ images, name }) {
  const list = images || []
  const [lightbox, setLightbox] = useState(null)

  if (list.length === 0) {
    return <EmptyState icon="image" title="No portfolio images yet." hint="This vendor has not added portfolio work yet." />
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {list.map((src, i) => (
          <button
            key={`${src}-${i}`}
            type="button"
            onClick={() => setLightbox(i)}
            className="group overflow-hidden rounded-2xl border border-black/5 bg-[#0b1311]/5"
            aria-label={`Open portfolio image ${i + 1} of ${name}`}
          >
            <img
              src={src}
              alt={`${name} portfolio work ${i + 1}`}
              loading="lazy"
              className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </button>
        ))}
      </div>
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Portfolio image viewer"
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            className="absolute right-5 top-5 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
            aria-label="Close image viewer"
          >
            <X className="h-5 w-5" />
          </button>
          <img
            src={list[lightbox]}
            alt={`${name} portfolio work ${lightbox + 1}`}
            className="max-h-[85vh] max-w-full rounded-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute bottom-6 flex gap-2">
            <button
              type="button"
              disabled={lightbox === 0}
              onClick={(e) => { e.stopPropagation(); setLightbox((v) => Math.max(0, v - 1)) }}
              className="rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-white disabled:opacity-40"
            >
              Prev
            </button>
            <button
              type="button"
              disabled={lightbox === list.length - 1}
              onClick={(e) => { e.stopPropagation(); setLightbox((v) => Math.min(list.length - 1, v + 1)) }}
              className="rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-white disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  )
}
