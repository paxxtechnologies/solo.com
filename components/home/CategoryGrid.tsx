'use client'

import Link from 'next/link'
import { categories } from '@/lib/mock-data'
import {
  Smartphone,
  Laptop,
  Headphones,
  Speaker,
  Watch,
  RefreshCw,
} from 'lucide-react'

const iconMap: Record<string, React.ReactNode> = {
  smartphone: <Smartphone className="w-12 h-12" />,
  laptop: <Laptop className="w-12 h-12" />,
  headphones: <Headphones className="w-12 h-12" />,
  speaker: <Speaker className="w-12 h-12" />,
  watch: <Watch className="w-12 h-12" />,
  refresh: <RefreshCw className="w-12 h-12" />,
}

export function CategoryGrid() {
  return (
    <section className="py-16 max-md:py-12">
      <div className="max-w-[1280px] mx-auto px-6 max-md:px-4">
        <h2 className="text-2xl font-bold text-solo-navy mb-8">Shop by Category</h2>

        <div className="grid grid-cols-3 max-md:grid-cols-2 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/shop/${category.slug}`}
              className="group relative aspect-[4/3] rounded-card bg-solo-navy overflow-hidden cursor-pointer border-2 border-transparent hover:border-solo-green transition-all"
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white/70 group-hover:text-solo-green transition-colors">
                {iconMap[category.icon]}
                <span className="font-semibold text-lg mt-3 text-white">
                  {category.name}
                </span>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-solo-green/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
