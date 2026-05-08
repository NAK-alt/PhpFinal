import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ShoppingCart, Check, Minus, Plus } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import api from '../../lib/api'

interface Product {
  id: number
  name: string
  brand: string
  price: string | number
  image: string
  description: string
  category: string
  stock: number
  features: { id: number; feature: string }[] | string[]
}

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const { addToCart } = useCart()

  useEffect(() => {
    if (!id) return
    setLoading(true)
    api.get(`/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))
  }, [id])

  const handleAdd = () => {
    if (!product) return
    const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price
    addToCart({ ...product, price }, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="aspect-square bg-muted animate-pulse rounded-lg" />
        <div className="space-y-4 pt-4">
          {[1,2,3,4,5].map(i => <div key={i} className="h-6 bg-muted animate-pulse rounded w-3/4" />)}
        </div>
      </div>
    </div>
  )

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="font-serif text-3xl mb-4">Watch not found</h2>
        <Button asChild variant="outline">
          <Link to="/products"><ArrowLeft className="mr-2 h-4 w-4" />Back to Collection</Link>
        </Button>
      </div>
    </div>
  )

  const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price
  const features = product.features?.map((f: any) => typeof f === 'string' ? f : f.feature) ?? []

  return (
    <div className="min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button asChild variant="ghost" className="mb-8 -ml-2 text-muted-foreground hover:text-foreground">
          <Link to="/products"><ArrowLeft className="mr-2 h-4 w-4" />Back to Collection</Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Image */}
          <div>
            <div className="aspect-square overflow-hidden rounded-lg bg-muted border border-border">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600' }}
              />
            </div>
          </div>

          {/* Info */}
          <div className="space-y-7 py-2">
            <div>
              <Badge variant="secondary" className="text-[10px] tracking-widest uppercase mb-3 font-normal">
                {product.category}
              </Badge>
              <h1 className="font-serif text-4xl font-light mb-2">{product.name}</h1>
              <p className="text-muted-foreground text-lg">{product.brand}</p>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="font-serif text-4xl text-primary">${price.toLocaleString()}</span>
              {product.stock > 0
                ? <span className="text-xs text-green-600 tracking-wide">In Stock</span>
                : <span className="text-xs text-destructive tracking-wide">Out of Stock</span>
              }
            </div>

            <Separator />

            <div>
              <h3 className="font-serif text-sm tracking-widest uppercase mb-3 text-muted-foreground">About</h3>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            {features.length > 0 && (
              <div>
                <h3 className="font-serif text-sm tracking-widest uppercase mb-3 text-muted-foreground">Features</h3>
                <ul className="grid grid-cols-1 gap-2">
                  {features.map((f, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <Check className="h-3.5 w-3.5 text-primary flex-shrink-0" strokeWidth={2.5} />
                      <span className="text-sm text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Separator />

            {/* Qty + Add */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">Quantity</span>
                <div className="flex items-center border border-border rounded-md">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-3 py-2 hover:bg-accent transition-colors">
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center">{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.stock || 10, q + 1))} className="px-3 py-2 hover:bg-accent transition-colors">
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>

              <Button
                onClick={handleAdd}
                size="lg"
                className="w-full tracking-widest uppercase text-sm font-light"
                disabled={added || product.stock === 0}
              >
                {added ? (
                  <><Check className="mr-2 h-4 w-4" />Added to Cart</>
                ) : (
                  <><ShoppingCart className="mr-2 h-4 w-4" />Add to Cart</>
                )}
              </Button>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {[
                ['Free Shipping', 'On all orders'],
                ['Lifetime Warranty', 'Full coverage'],
                ['30-Day Returns', 'Hassle-free'],
                ['Authenticated', 'Guaranteed genuine'],
              ].map(([title, sub]) => (
                <div key={title} className="border border-border rounded-md p-3">
                  <p className="text-xs font-medium mb-0.5">{title}</p>
                  <p className="text-xs text-muted-foreground">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
