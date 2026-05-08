import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, ShieldCheck } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import api from '../../lib/api'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

interface CheckoutForm {
  recipient_name: string
  phone: string
  address_line1: string
  address_line2: string
  city: string
  state: string
  postal_code: string
  country: string
}

export default function Checkout() {
  const { user } = useAuth()
  const { cart, clearCart } = useCart()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<CheckoutForm>({
    recipient_name: user?.name ?? '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'United States',
  })

  useEffect(() => {
    setForm(current => ({ ...current, recipient_name: user?.name ?? current.recipient_name }))
  }, [user])

  const subtotal = cart.total
  const tax = subtotal * 0.1
  const grandTotal = subtotal + tax

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await api.post('/orders', form)
      clearCart()
      setSuccess(true)
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Unable to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-16">
        <div className="max-w-xl w-full text-center bg-card border border-border rounded-2xl p-10 shadow-sm">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Check className="h-8 w-8" />
          </div>
          <h1 className="font-serif text-4xl font-light mb-3">Order Confirmed</h1>
          <p className="text-muted-foreground mb-8">
            Your order has been placed successfully. We’ll use the address details you provided for delivery.
          </p>
          <Button asChild>
            <Link to="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-16">
        <div className="max-w-lg w-full text-center">
          <h1 className="font-serif text-4xl font-light mb-3">Checkout</h1>
          <p className="text-muted-foreground mb-8">Your cart is empty. Add items before proceeding to checkout.</p>
          <Button asChild>
            <Link to="/products">Browse Collection</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button asChild variant="ghost" className="mb-8 -ml-2 text-muted-foreground hover:text-foreground">
          <Link to="/cart"><ArrowLeft className="mr-2 h-4 w-4" />Back to Cart</Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6">
              <h1 className="font-serif text-4xl font-light mb-2">Checkout</h1>
              <p className="text-muted-foreground text-sm">Enter the shipping details for this order.</p>
            </div>

            {error && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
              <div>
                <h2 className="font-serif text-2xl mb-1">Shipping Information</h2>
                <p className="text-sm text-muted-foreground">The delivery address must be complete before placing the order.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 md:col-span-2">
                  <Label htmlFor="recipient_name">Full Name</Label>
                  <Input id="recipient_name" value={form.recipient_name} onChange={e => setForm(f => ({ ...f, recipient_name: e.target.value }))} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} required />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <Label htmlFor="address_line1">Address Line 1</Label>
                  <Input id="address_line1" value={form.address_line1} onChange={e => setForm(f => ({ ...f, address_line1: e.target.value }))} required />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <Label htmlFor="address_line2">Address Line 2</Label>
                  <Input id="address_line2" value={form.address_line2} onChange={e => setForm(f => ({ ...f, address_line2: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="state">State</Label>
                  <Input id="state" value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} required />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <Label htmlFor="postal_code">Postal Code</Label>
                  <Input id="postal_code" value={form.postal_code} onChange={e => setForm(f => ({ ...f, postal_code: e.target.value }))} required />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 flex items-center gap-3 text-sm text-muted-foreground">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Secure checkout. Your information is used only for order fulfillment.
            </div>

            <Button type="submit" size="lg" className="w-full tracking-widest uppercase text-sm font-light" disabled={loading}>
              {loading ? 'Placing Order…' : 'Place Order'}
            </Button>
          </form>

          <aside className="lg:col-span-1">
            <div className="bg-card border border-border rounded-2xl p-6 sticky top-24">
              <h2 className="font-serif text-2xl mb-6">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax (10%)</span>
                  <span>${tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between font-medium text-base pt-2 border-t border-border">
                  <span>Total</span>
                  <span className="font-serif text-primary text-lg">${grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Logged in as {user?.email}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}