import { useState, useEffect, useCallback } from 'react'
import { Search } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import WatchCard, { Watch } from '../WatchCard'
import api from '../../lib/api'

const CATEGORIES = [
  { value: 'all', label: 'All Watches' },
  { value: 'diving', label: 'Diving' },
  { value: 'dress', label: 'Dress' },
  { value: 'sport', label: 'Sport' },
  { value: 'luxury', label: 'Luxury' },
]

const SORTS = [
  { value: 'name', label: 'Name A–Z' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'brand', label: 'Brand' },
]

const gridVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.75,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

const rowVariants = {
  hidden: { opacity: 0, y: 36 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.85,
      staggerChildren: 0.18,
      delayChildren: 0.08,
    },
  },
}

export default function Products() {
  const [watches, setWatches] = useState<Watch[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState('name')
  const [search, setSearch] = useState('')

  const fetchProducts = useCallback(() => {
    setLoading(true)
    const params: Record<string, string> = { per_page: '50', sort }
    if (category !== 'all') params.category = category
    if (search.trim()) params.search = search.trim()

    api.get('/products', { params })
      .then(res => setWatches(res.data.data ?? res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [category, sort, search])

  useEffect(() => {
    const t = setTimeout(fetchProducts, search ? 350 : 0)
    return () => clearTimeout(t)
  }, [fetchProducts, search])

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3">Swiss Excellence</p>
          <h1 className="font-serif text-4xl font-light mb-4">Our Collection</h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed">
            Explore our curated selection of luxury timepieces — each representing decades of craftsmanship.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10 items-start sm:items-end">
          <div className="relative w-full sm:flex-1 sm:max-w-sm min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white pointer-events-none" />
            <Input
              placeholder="Search watches…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 bg-background text-foreground"
            />
          </div>
          <Select value={category} onValueChange={setCategory} className="w-full sm:w-40">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={setSort} className="w-full sm:w-44">
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORTS.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground whitespace-nowrap self-center">
            {watches.length} {watches.length === 1 ? 'watch' : 'watches'}
          </span>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="rounded-lg overflow-hidden border border-border">
                <div className="aspect-square bg-muted animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-muted animate-pulse rounded w-1/3" />
                  <div className="h-5 bg-muted animate-pulse rounded w-2/3" />
                  <div className="h-3 bg-muted animate-pulse rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : watches.length > 0 ? (
          <motion.div
            className="space-y-8"
            variants={gridVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
          >
            {Array.from({ length: Math.ceil(watches.length / 3) }, (_, rowIndex) => {
              const rowItems = watches.slice(rowIndex * 3, rowIndex * 3 + 3)

              return (
                <motion.div
                  key={`row-${rowIndex}`}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  variants={rowVariants}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.3 }}
                >
                  {rowItems.map(w => (
                    <motion.div key={w.id} variants={cardVariants} whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 180, damping: 24 }}>
                      <WatchCard watch={w} />
                    </motion.div>
                  ))}
                </motion.div>
              )
            })}
          </motion.div>
        ) : (
          <div className="text-center py-24">
            <p className="font-serif text-2xl text-muted-foreground mb-6">No watches found</p>
            <Button variant="outline" onClick={() => { setCategory('all'); setSort('name'); setSearch('') }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
