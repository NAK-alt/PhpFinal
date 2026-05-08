import { Link } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart()
  const tax = cart.total * 0.1
  const grandTotal = cart.total + tax

  if (cart.items.length === 0) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mx-auto mb-6" strokeWidth={1} />
        <h2 className="font-serif text-3xl font-light mb-3">Your cart is empty</h2>
        <p className="text-muted-foreground mb-8 text-sm">Discover our collection of luxury timepieces.</p>
        <Button asChild>
          <Link to="/products" className="tracking-widest uppercase text-sm font-light">
            Browse Collection <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-4xl font-light mb-10">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map(item => {
              const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price
              return (
                <div key={item.id} className="flex gap-5 bg-card border border-border rounded-lg p-5">
                  <Link to={`/product/${item.id}`} className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-md"
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200' }}
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.id}`}>
                      <h3 className="font-serif text-lg hover:text-primary transition-colors">{item.name}</h3>
                    </Link>
                    <p className="text-muted-foreground text-sm mb-3">{item.brand}</p>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center border border-border rounded-md">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2.5 py-1.5 hover:bg-accent transition-colors">
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-3 py-1.5 text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2.5 py-1.5 hover:bg-accent transition-colors">
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-serif text-lg text-primary">
                          ${(price * item.quantity).toLocaleString()}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}

            <div className="flex justify-between pt-2">
              <Button variant="ghost" size="sm" onClick={clearCart} className="text-muted-foreground hover:text-destructive text-xs">
                <Trash2 className="h-3.5 w-3.5 mr-2" />Clear Cart
              </Button>
              <Button variant="outline" asChild size="sm">
                <Link to="/products">Continue Shopping</Link>
              </Button>
            </div>
          </div>

          {/* Summary */}
          <div>
            <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
              <h2 className="font-serif text-xl mb-6">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal ({cart.items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span>${cart.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax (10%)</span>
                  <span>${tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium text-base">
                  <span>Total</span>
                  <span className="font-serif text-primary text-lg">${grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>
              <Button asChild className="w-full mt-6 tracking-widest uppercase text-sm font-light" size="lg">
                <Link to="/checkout" className="w-full">Proceed to Checkout</Link>
              </Button>
              <p className="text-center text-xs text-muted-foreground mt-4">
                Secure checkout · SSL encrypted
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
