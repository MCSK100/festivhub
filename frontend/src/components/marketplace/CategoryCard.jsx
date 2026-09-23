import { Link } from 'react-router-dom'
import { CATEGORIES } from '../../data/categories'

export default function CategoryCard({ category }) {
  return (
    <Link
      to={`/category/${encodeURIComponent(category.name)}`}
      className="group overflow-hidden rounded-[20px] border border-black/5 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="flex items-center gap-4 p-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#1e4137]/5 text-2xl" aria-hidden>
          {category.icon}
        </span>
        <span>
          <span className="block text-[15px] font-bold text-[#0b1311] group-hover:text-[#1e4137]">{category.name}</span>
          <span className="mt-0.5 block text-xs font-medium text-[#0b1311]/50">Browse vendors →</span>
        </span>
      </div>
    </Link>
  )
}

export function CategoryGrid({ compact = false }) {
  const list = compact ? CATEGORIES : CATEGORIES
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {list.map((c) => (
        <CategoryCard key={c.name} category={c} />
      ))}
    </div>
  )
}
