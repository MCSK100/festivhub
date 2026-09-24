import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { CATEGORIES } from '../../data/categories'

export default function CategoryCard({ category }) {
  return (
    <Link
      to={`/category/${encodeURIComponent(category.name)}`}
      className="group relative block overflow-hidden rounded-[24px] border border-black/5 bg-white shadow-[0_8px_28px_-14px_rgba(11,19,17,0.25)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_26px_55px_-20px_rgba(11,19,17,0.35)]"
    >
      <div className="relative h-32 overflow-hidden sm:h-36">
        <img
          src={category.image}
          alt={category.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
        <span className="absolute left-3 top-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/95 text-xl shadow backdrop-blur" aria-hidden>
          {category.icon}
        </span>
        <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-xl transition-all duration-300 group-hover:bg-white group-hover:text-[#0b1311]">
          <ArrowUpRight className="h-4 w-4" />
        </span>
        <span className="absolute bottom-3 left-3 right-14">
          <span className="block truncate text-[15px] font-bold leading-tight text-white">{category.name}</span>
          <span className="mt-0.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-white/70">
            Explore pros →
          </span>
        </span>
      </div>
    </Link>
  )
}

export function CategoryGrid({ compact = false }) {
  const list = compact ? CATEGORIES : CATEGORIES
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
      {list.map((c) => (
        <CategoryCard key={c.name} category={c} />
      ))}
    </div>
  )
}
