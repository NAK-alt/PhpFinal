import { createContext, useContext, useReducer, useEffect, useRef, useState, ReactNode } from 'react'
import api from '../lib/api'

export interface CartItem {
  id: number
  cartItemId?: number
  name: string
  brand: string
  price: number
  image: string
  quantity: number
}

interface CartState { items: CartItem[]; total: number }
interface CartNotification {
  id: number
  message: string
}
type CartAction =
  | { type: 'INIT'; payload: CartItem[] }
  | { type: 'ADD'; payload: CartItem }
  | { type: 'REMOVE'; payload: number }
  | { type: 'UPDATE'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR' }

function calcTotal(items: CartItem[]) {
  return items.reduce((s, i) => s + i.price * i.quantity, 0)
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'INIT':
      return { items: action.payload, total: calcTotal(action.payload) }
    case 'ADD': {
      const existing = state.items.find(i => i.id === action.payload.id)
      const items = existing
        ? state.items.map(i => i.id === action.payload.id ? { ...i, quantity: i.quantity + action.payload.quantity } : i)
        : [...state.items, { ...action.payload }]
      return { items, total: calcTotal(items) }
    }
    case 'REMOVE': {
      const items = state.items.filter(i => i.id !== action.payload)
      return { items, total: calcTotal(items) }
    }
    case 'UPDATE': {
      const items = state.items
        .map(i => i.id === action.payload.id ? { ...i, quantity: action.payload.quantity } : i)
        .filter(i => i.quantity > 0)
      return { items, total: calcTotal(items) }
    }
    case 'CLEAR':
      return { items: [], total: 0 }
    default:
      return state
  }
}

interface CartContextType {
  cart: CartState
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
  removeFromCart: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  notification: CartNotification | null
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, { items: [], total: 0 })
  const [notification, setNotification] = useState<CartNotification | null>(null)
  const notificationTimer = useRef<number | null>(null)

  const showNotification = (message: string) => {
    if (notificationTimer.current) {
      window.clearTimeout(notificationTimer.current)
    }
    setNotification({ id: Date.now(), message })
    notificationTimer.current = window.setTimeout(() => {
      setNotification(null)
      notificationTimer.current = null
    }, 3000)
  }

  // Load cart from API if logged in
  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      api.get('/cart').then(res => {
        const items: CartItem[] = res.data.items.map((i: any) => ({
          id: i.product.id,
          cartItemId: i.id,
          name: i.product.name,
          brand: i.product.brand,
          price: parseFloat(i.product.price),
          image: i.product.image,
          quantity: i.quantity,
        }))
        dispatch({ type: 'INIT', payload: items })
      }).catch(() => {})
    }
  }, [])

  // Initialize from localStorage if present (helps offline and cross-tab sync)
  useEffect(() => {
    try {
      const raw = localStorage.getItem('cart_items')
      if (raw) {
        const items: CartItem[] = JSON.parse(raw)
        if (items && items.length > 0) dispatch({ type: 'INIT', payload: items })
      }
    } catch {}
  }, [])

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('cart_items', JSON.stringify(cart.items))
    } catch {}
  }, [cart.items])

  // Listen to storage events from other tabs and sync
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key !== 'cart_items') return
      try {
        const items: CartItem[] = e.newValue ? JSON.parse(e.newValue) : []
        dispatch({ type: 'INIT', payload: items })
      } catch {}
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [])

  const addToCart = (item: Omit<CartItem, 'quantity'>, quantity = 1) => {
    dispatch({ type: 'ADD', payload: { ...item, quantity } })
    showNotification(`${item.name} added to cart`)
    const token = localStorage.getItem('auth_token')
    if (token) {
      api.post('/cart', { product_id: item.id, quantity }).catch(() => {})
    }
  }

  const removeFromCart = (id: number) => {
    const cartItem = cart.items.find(i => i.id === id)
    dispatch({ type: 'REMOVE', payload: id })
    const token = localStorage.getItem('auth_token')
    if (token && cartItem?.cartItemId) {
      api.delete(`/cart/${cartItem.cartItemId}`).catch(() => {})
    }
  }

  const updateQuantity = (id: number, quantity: number) => {
    const cartItem = cart.items.find(i => i.id === id)
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    dispatch({ type: 'UPDATE', payload: { id, quantity } })
    const token = localStorage.getItem('auth_token')
    if (token && cartItem?.cartItemId) {
      api.put(`/cart/${cartItem.cartItemId}`, { quantity }).catch(() => {})
    }
  }

  const clearCart = () => {
    // capture current items so we can attempt server deletes
    const current = cart.items.slice()
    dispatch({ type: 'CLEAR' })
    try { localStorage.setItem('cart_items', JSON.stringify([])) } catch {}
    const token = localStorage.getItem('auth_token')
    if (token) {
      current.forEach(ci => {
        if (ci.cartItemId) api.delete(`/cart/${ci.cartItemId}`).catch(() => {})
      })
    }
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, notification }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be inside CartProvider')
  return ctx
}
