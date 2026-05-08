import { Link } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { Button } from './ui/button'
import { Badge } from './ui/badge'

export interface Watch {
  id: number
  name: string
  brand: string
  price: number | string
  image: string
  description: string
  category: string
  features?: string[]
}

export default function WatchCard({ watch }: { watch: Watch }) {
  const { addToCart } = useCart()
  const price = typeof watch.price === 'string' ? parseFloat(watch.price) : watch.price

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addToCart({ ...watch, price })
  }

  return (
    <Link to={`/product/${watch.id}`} className="group block">
      <div className="watch-card-hover bg-card border border-border rounded-lg overflow-hidden">
        {/* Image */}
        <div className="aspect-square overflow-hidden bg-muted relative">
          <img
            src={watch.image}
            alt={watch.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400' }}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          <Button
            size="sm"
            onClick={handleAddToCart}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 whitespace-nowrap shadow-lg"
          >
            <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
            Add to Cart
          </Button>
        </div>

        {/* Info */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex-1 min-w-0">
              <Badge variant="secondary" className="text-[10px] tracking-widest uppercase mb-2 font-normal">
                {watch.category}
              </Badge>
              <h3 className="font-serif text-lg leading-tight mb-0.5 truncate">{watch.name}</h3>
              <p className="text-sm text-muted-foreground">{watch.brand}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed">{watch.description}</p>
          <div className="flex items-center justify-between">
            <span className="font-serif text-xl text-primary">
              ${price.toLocaleString()}
            </span>
            <span className="text-[10px] text-muted-foreground tracking-widest uppercase">View Details →</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
