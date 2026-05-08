import { useState, useEffect, useRef } from 'react'
import { Package, Users, MessageSquare, Plus, Pencil, Trash2, X, Check, Clock3, ShoppingCart, RefreshCcw } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import api from '../../lib/api'
import { useAuth } from '../../context/AuthContext'

type Tab = 'overview' | 'orders' | 'products' | 'contacts' | 'customers'
type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

interface Product {
  id: number; name: string; brand: string; price: string; category: string; stock: number; is_active: boolean; image: string; description: string
}
interface ContactMsg {
  id: number; name: string; email: string; subject: string; message: string; is_read: boolean; created_at: string
}

interface AdminOrderItem {
  id: number
  product_name: string
  quantity: number
  price: string | number
}

interface AdminOrder {
  id: number
  status: OrderStatus
  total_amount: string | number
  tax_amount: string | number
  created_at: string
  recipient_name?: string | null
  city?: string | null
  country?: string | null
  user?: { id: number; name: string; email: string }
  items: AdminOrderItem[]
}

interface RecentOrderStat {
  id: number
  status: OrderStatus
  items_count: number
  total_with_tax: number
  created_at: string
  user_name?: string | null
  user_email?: string | null
}

interface Stats {
  total_products: number
  active_products: number
  low_stock_products: number
  total_users: number
  total_orders: number
  pending_orders: number
  monthly_orders: number
  unread_messages: number
  gross_revenue: number
  monthly_revenue: number
  average_order_value: number
  recent_orders: RecentOrderStat[]
}

const EMPTY_PRODUCT = { name: '', brand: '', price: '', category: 'diving', stock: '10', image: '', description: '' }

export default function AdminDashboard() {
  const { user } = useAuth()
  const [tab, setTab] = useState<Tab>('overview')
  const [stats, setStats] = useState<Stats | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [contacts, setContacts] = useState<ContactMsg[]>([])
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [customers, setCustomers] = useState<{ id: number; name: string; email: string }[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null)
  const [customerOrders, setCustomerOrders] = useState<AdminOrder[]>([])
  const [customersLoading, setCustomersLoading] = useState(false)
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | OrderStatus>('all')
  const [orderSearch, setOrderSearch] = useState('')
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null)
  const [form, setForm] = useState(EMPTY_PRODUCT)
  const [editId, setEditId] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const closeTimerRef = useRef<number | null>(null)
  const closeCustTimerRef = useRef<number | null>(null)
  const [customersPreviewOpen, setCustomersPreviewOpen] = useState(false)
  const [ordersPreviewOpen, setOrdersPreviewOpen] = useState(false)
  const [pendingPreviewOpen, setPendingPreviewOpen] = useState(false)
  const [messagesPreviewOpen, setMessagesPreviewOpen] = useState(false)
  const closeOrdersTimerRef = useRef<number | null>(null)
  const closePendingTimerRef = useRef<number | null>(null)
  const closeMessagesTimerRef = useRef<number | null>(null)

  const fetchStats = async () => {
    try {
      const r = await api.get('/admin/stats')
      setStats(r.data)
    } catch {}
  }

  const fetchOrders = async () => {
    setOrdersLoading(true)
    try {
      const params: Record<string, string> = {}
      if (orderStatusFilter !== 'all') params.status = orderStatusFilter
      if (orderSearch.trim()) params.search = orderSearch.trim()
      const r = await api.get('/admin/orders', { params })
      setOrders(r.data.data ?? r.data)
    } catch {
      setOrders([])
    } finally {
      setOrdersLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchCustomers = async () => {
    setCustomersLoading(true)
    try {
      const r = await api.get('/admin/users')
      setCustomers(r.data.data ?? r.data)
    } catch {
      setCustomers([])
    } finally {
      setCustomersLoading(false)
    }
  }

  const fetchContacts = async () => {
    try {
      const r = await api.get('/admin/contacts')
      setContacts(r.data.data ?? r.data)
    } catch {}
  }

  useEffect(() => {
    if (tab === 'products') api.get('/admin/products').then(r => setProducts(r.data.data ?? r.data)).catch(() => {})
    if (tab === 'contacts') fetchContacts()
    if (tab === 'orders') fetchOrders()
    if (tab === 'overview' && products.length === 0) api.get('/admin/products').then(r => setProducts(r.data.data ?? r.data)).catch(() => {})
    if (tab === 'customers') fetchCustomers()
    if (tab === 'overview' && customers.length === 0) fetchCustomers()
    if (tab === 'overview' && contacts.length === 0) fetchContacts()
  }, [tab, orderStatusFilter])

  useEffect(() => {
    if (tab !== 'orders') return
    const t = setTimeout(fetchOrders, 300)
    return () => clearTimeout(t)
  }, [orderSearch, tab])

  const fetchCustomerOrders = async (customerId: number) => {
    try {
      const r = await api.get('/admin/orders', { params: { user_id: customerId } })
      setCustomerOrders(r.data.data ?? r.data)
    } catch {
      setCustomerOrders([])
    }
  }

  const openCreate = () => { setForm(EMPTY_PRODUCT); setEditId(null); setShowForm(true) }
  const openEdit = (p: Product) => {
    setForm({ name: p.name, brand: p.brand, price: p.price, category: p.category, stock: String(p.stock), image: p.image, description: p.description })
    setEditId(p.id); setShowForm(true)
  }
  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = { ...form, price: parseFloat(form.price), stock: parseInt(form.stock) }
      if (editId) {
        const res = await api.put(`/admin/products/${editId}`, payload)
        setProducts(ps => ps.map(p => p.id === editId ? res.data : p))
      } else {
        const res = await api.post('/admin/products', payload)
        setProducts(ps => [res.data, ...ps])
      }
      setShowForm(false)
      fetchStats()
    } catch {} finally { setSaving(false) }
  }
  const handleDelete = async (id: number) => {
    if (!confirm('Delete this product?')) return
    await api.delete(`/admin/products/${id}`)
    setProducts(ps => ps.filter(p => p.id !== id))
    fetchStats()
  }
  const markRead = async (id: number) => {
    await api.put(`/admin/contacts/${id}/read`)
    setContacts(cs => cs.map(c => c.id === id ? { ...c, is_read: true } : c))
    fetchStats()
  }

  const updateOrderStatus = async (orderId: number, status: OrderStatus) => {
    setUpdatingOrderId(orderId)
    try {
      const res = await api.put(`/admin/orders/${orderId}/status`, { status })
      setOrders(os => os.map(o => (o.id === orderId ? res.data : o)))
      fetchStats()
    } catch {}
    setUpdatingOrderId(null)
  }

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current)
      if (closeCustTimerRef.current) window.clearTimeout(closeCustTimerRef.current)
      if (closeOrdersTimerRef.current) window.clearTimeout(closeOrdersTimerRef.current)
      if (closePendingTimerRef.current) window.clearTimeout(closePendingTimerRef.current)
      if (closeMessagesTimerRef.current) window.clearTimeout(closeMessagesTimerRef.current)
    }
  }, [])

  const totalWithTax = (order: AdminOrder) => Number(order.total_amount || 0) + Number(order.tax_amount || 0)

  const statusClasses = (status: OrderStatus) => {
    if (status === 'pending') return 'bg-amber-500/15 text-amber-400 border-amber-500/30'
    if (status === 'processing') return 'bg-sky-500/15 text-sky-400 border-sky-500/30'
    if (status === 'shipped') return 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30'
    if (status === 'delivered') return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
    return 'bg-rose-500/15 text-rose-400 border-rose-500/30'
  }

  const money = (value: number) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  const revenueTotal = Math.max(stats?.gross_revenue ?? 0, 0)
  const monthlyRevenue = Math.max(stats?.monthly_revenue ?? 0, 0)
  const monthlyRevenueShare = revenueTotal > 0 ? Math.round((monthlyRevenue / revenueTotal) * 100) : 0
  const otherRevenue = Math.max(revenueTotal - monthlyRevenue, 0)
  const pieRadius = 40
  const pieCircumference = 2 * Math.PI * pieRadius
  const pieFilled = (monthlyRevenueShare / 100) * pieCircumference

  const TABS: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'orders', label: 'Orders' },
    { id: 'customers', label: 'Customers' },
    { id: 'products', label: 'Products' },
    { id: 'contacts', label: 'Messages' },
  ]

  return (
    <div className="min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs tracking-widest uppercase text-muted-foreground mb-1">Admin Panel</p>
          <h1 className="font-serif text-3xl font-light">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Signed in as <span className="text-foreground">{user?.name}</span></p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-border">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-5 py-3 text-sm tracking-widest uppercase transition-colors border-b-2 -mb-px ${
                tab === t.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === 'overview' && (
          <div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
              <div
                className="relative bg-card border border-border rounded-lg p-6"
                onMouseEnter={() => {
                  if (closeTimerRef.current) { window.clearTimeout(closeTimerRef.current); closeTimerRef.current = null }
                  setPreviewOpen(true)
                }}
                onMouseLeave={() => {
                  closeTimerRef.current = window.setTimeout(() => { setPreviewOpen(false); closeTimerRef.current = null }, 150)
                }}
              >
                <Package className="h-6 w-6 text-blue-500 mb-3" strokeWidth={1.5} />
                <div className="font-serif text-2xl lg:text-3xl mb-1">{products.length}</div>
                <div className="text-xs text-muted-foreground tracking-wide">Current Product Listed</div>
                <div
                  className={`absolute left-4 right-4 top-full z-30 mt-2 rounded-lg border border-border bg-background/95 p-3 shadow-2xl backdrop-blur-md transition-all duration-200 ${previewOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 pointer-events-none'}`}
                  onMouseEnter={() => {
                    if (closeTimerRef.current) { window.clearTimeout(closeTimerRef.current); closeTimerRef.current = null }
                    setPreviewOpen(true)
                  }}
                  onMouseLeave={() => {
                    closeTimerRef.current = window.setTimeout(() => { setPreviewOpen(false); closeTimerRef.current = null }, 150)
                  }}
                >
                  <p className="text-[10px] tracking-widest uppercase text-muted-foreground mb-2">Current Product Listed</p>
                  <div className="space-y-1.5 max-h-44 overflow-y-auto">
                    {products.slice(0, 8).map(p => (
                      <div key={p.id} className="text-xs flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-5 h-5 rounded-sm object-cover bg-muted shrink-0"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                          />
                          <span className="truncate">{p.name}</span>
                        </div>
                        <span className="text-muted-foreground shrink-0">{p.brand}</span>
                      </div>
                    ))}
                    {products.length === 0 && <p className="text-xs text-muted-foreground">No products found.</p>}
                  </div>
                </div>
              </div>

              <div
                className="relative bg-card border border-border rounded-lg p-6"
                onMouseEnter={() => {
                  if (closeCustTimerRef.current) { window.clearTimeout(closeCustTimerRef.current); closeCustTimerRef.current = null }
                  setCustomersPreviewOpen(true)
                }}
                onMouseLeave={() => {
                  closeCustTimerRef.current = window.setTimeout(() => { setCustomersPreviewOpen(false); closeCustTimerRef.current = null }, 150)
                }}
              >
                <Users className="h-6 w-6 text-green-500 mb-3" strokeWidth={1.5} />
                <div className="font-serif text-2xl lg:text-3xl mb-1">{stats?.total_users ?? '—'}</div>
                <div className="text-xs text-muted-foreground tracking-wide">Customers</div>
                <div className={`absolute left-4 right-4 top-full z-30 mt-2 rounded-lg border border-border bg-background/95 p-3 shadow-2xl backdrop-blur-md transition-all duration-200 ${customersPreviewOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 pointer-events-none'}`}
                  onMouseEnter={() => {
                    if (closeCustTimerRef.current) { window.clearTimeout(closeCustTimerRef.current); closeCustTimerRef.current = null }
                    setCustomersPreviewOpen(true)
                  }}
                  onMouseLeave={() => {
                    closeCustTimerRef.current = window.setTimeout(() => { setCustomersPreviewOpen(false); closeCustTimerRef.current = null }, 150)
                  }}
                >
                  <p className="text-[10px] tracking-widest uppercase text-muted-foreground mb-2">Customers</p>
                  <div className="space-y-1.5 max-h-44 overflow-y-auto text-xs">
                    {customers.slice(0, 12).map(c => (
                      <div key={c.id} className="flex items-center justify-between">
                        <div className="truncate pr-2">{c.name}</div>
                        <div className="text-muted-foreground ml-2 truncate">{c.email}</div>
                      </div>
                    ))}
                    {customers.length === 0 && <p className="text-xs text-muted-foreground">No customers found.</p>}
                  </div>
                </div>
              </div>

              <div
                className="relative bg-card border border-border rounded-lg p-6"
                onMouseEnter={() => {
                  if (closeOrdersTimerRef.current) { window.clearTimeout(closeOrdersTimerRef.current); closeOrdersTimerRef.current = null }
                  setOrdersPreviewOpen(true)
                }}
                onMouseLeave={() => {
                  closeOrdersTimerRef.current = window.setTimeout(() => { setOrdersPreviewOpen(false); closeOrdersTimerRef.current = null }, 150)
                }}
              >
                <ShoppingCart className="h-6 w-6 text-violet-500 mb-3" strokeWidth={1.5} />
                <div className="font-serif text-2xl lg:text-3xl mb-1">{stats?.total_orders ?? '—'}</div>
                <div className="text-xs text-muted-foreground tracking-wide">Orders</div>
                <div
                  className={`absolute left-4 right-4 top-full z-30 mt-2 rounded-lg border border-border bg-background/95 p-3 shadow-2xl backdrop-blur-md transition-all duration-200 ${ordersPreviewOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 pointer-events-none'}`}
                  onMouseEnter={() => {
                    if (closeOrdersTimerRef.current) { window.clearTimeout(closeOrdersTimerRef.current); closeOrdersTimerRef.current = null }
                    setOrdersPreviewOpen(true)
                  }}
                  onMouseLeave={() => {
                    closeOrdersTimerRef.current = window.setTimeout(() => { setOrdersPreviewOpen(false); closeOrdersTimerRef.current = null }, 150)
                  }}
                >
                  <p className="text-[10px] tracking-widest uppercase text-muted-foreground mb-2">Recent Orders</p>
                  <div className="space-y-1.5 max-h-44 overflow-y-auto text-xs">
                    {(stats?.recent_orders ?? []).slice(0, 8).map(order => (
                      <div key={order.id} className="flex items-center justify-between gap-2">
                        <div className="min-w-0 truncate">Order #{order.id} · {order.user_name ?? 'Unknown User'}</div>
                        <Badge variant="outline" className={`text-[10px] uppercase border ${statusClasses(order.status)}`}>{order.status}</Badge>
                      </div>
                    ))}
                    {(stats?.recent_orders?.length ?? 0) === 0 && <p className="text-xs text-muted-foreground">No recent orders found.</p>}
                  </div>
                </div>
              </div>

              <div
                className="relative bg-card border border-border rounded-lg p-6"
                onMouseEnter={() => {
                  if (closePendingTimerRef.current) { window.clearTimeout(closePendingTimerRef.current); closePendingTimerRef.current = null }
                  setPendingPreviewOpen(true)
                }}
                onMouseLeave={() => {
                  closePendingTimerRef.current = window.setTimeout(() => { setPendingPreviewOpen(false); closePendingTimerRef.current = null }, 150)
                }}
              >
                <MessageSquare className="h-6 w-6 text-amber-500 mb-3" strokeWidth={1.5} />
                <div className="font-serif text-2xl lg:text-3xl mb-1">{stats?.unread_messages ?? '—'}</div>
                <div className="text-xs text-muted-foreground tracking-wide">Unread Messages</div>
                <div
                  className={`absolute left-4 right-4 top-full z-30 mt-2 rounded-lg border border-border bg-background/95 p-3 shadow-2xl backdrop-blur-md transition-all duration-200 ${pendingPreviewOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 pointer-events-none'}`}
                  onMouseEnter={() => {
                    if (closePendingTimerRef.current) { window.clearTimeout(closePendingTimerRef.current); closePendingTimerRef.current = null }
                    setPendingPreviewOpen(true)
                  }}
                  onMouseLeave={() => {
                    closePendingTimerRef.current = window.setTimeout(() => { setPendingPreviewOpen(false); closePendingTimerRef.current = null }, 150)
                  }}
                >
                  <p className="text-[10px] tracking-widest uppercase text-muted-foreground mb-2">Pending Orders</p>
                  <div className="space-y-1.5 max-h-44 overflow-y-auto text-xs">
                    {(stats?.recent_orders ?? []).filter(order => order.status === 'pending').slice(0, 8).map(order => (
                      <div key={order.id} className="flex items-center justify-between gap-2">
                        <div className="min-w-0 truncate">Order #{order.id} · {order.user_name ?? 'Unknown User'}</div>
                        <span className="text-muted-foreground shrink-0">{money(order.total_with_tax)}</span>
                      </div>
                    ))}
                    {((stats?.recent_orders ?? []).filter(order => order.status === 'pending').length === 0) && <p className="text-xs text-muted-foreground">No pending orders found.</p>}
                  </div>
                </div>
              </div>

              <div
                className="relative bg-card border border-border rounded-lg p-6"
                onMouseEnter={() => {
                  if (closeMessagesTimerRef.current) { window.clearTimeout(closeMessagesTimerRef.current); closeMessagesTimerRef.current = null }
                  setMessagesPreviewOpen(true)
                }}
                onMouseLeave={() => {
                  closeMessagesTimerRef.current = window.setTimeout(() => { setMessagesPreviewOpen(false); closeMessagesTimerRef.current = null }, 150)
                }}
              >
                <Clock3 className="h-6 w-6 text-orange-500 mb-3" strokeWidth={1.5} />
                <div className="font-serif text-2xl lg:text-3xl mb-1">{stats?.pending_orders ?? '—'}</div>
                <div className="text-xs text-muted-foreground tracking-wide">Pending Orders</div>
                <div
                  className={`absolute left-4 right-4 top-full z-30 mt-2 rounded-lg border border-border bg-background/95 p-3 shadow-2xl backdrop-blur-md transition-all duration-200 ${messagesPreviewOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 pointer-events-none'}`}
                  onMouseEnter={() => {
                    if (closeMessagesTimerRef.current) { window.clearTimeout(closeMessagesTimerRef.current); closeMessagesTimerRef.current = null }
                    setMessagesPreviewOpen(true)
                  }}
                  onMouseLeave={() => {
                    closeMessagesTimerRef.current = window.setTimeout(() => { setMessagesPreviewOpen(false); closeMessagesTimerRef.current = null }, 150)
                  }}
                >
                  <p className="text-[10px] tracking-widest uppercase text-muted-foreground mb-2">Unread Messages</p>
                  <div className="space-y-1.5 max-h-44 overflow-y-auto text-xs">
                    {contacts.filter(msg => !msg.is_read).slice(0, 8).map(msg => (
                      <div key={msg.id} className="flex items-center justify-between gap-2">
                        <div className="min-w-0 truncate">{msg.name} · {msg.subject || 'No subject'}</div>
                        <span className="text-muted-foreground shrink-0">{new Date(msg.created_at).toLocaleDateString()}</span>
                      </div>
                    ))}
                    {contacts.filter(msg => !msg.is_read).length === 0 && <p className="text-xs text-muted-foreground">No unread messages found.</p>}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 bg-card border border-border rounded-lg p-6">
                <h2 className="font-serif text-xl mb-4">Recent Orders</h2>
                <div className="space-y-3">
                  {(stats?.recent_orders ?? []).map(order => (
                    <div key={order.id} className="border border-border rounded-md px-4 py-3 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">Order #{order.id} · {order.user_name ?? 'Unknown User'}</p>
                        <p className="text-xs text-muted-foreground truncate">{order.user_email ?? 'No email'} · {new Date(order.created_at).toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <Badge variant="outline" className={`text-[10px] uppercase border ${statusClasses(order.status)}`}>{order.status}</Badge>
                        <span className="text-sm font-serif">{money(order.total_with_tax)}</span>
                      </div>
                    </div>
                  ))}
                  {(stats?.recent_orders?.length ?? 0) === 0 && (
                    <p className="text-sm text-muted-foreground">No recent orders found.</p>
                  )}
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6 space-y-6">
                <div>
                  <h2 className="font-serif text-xl mb-4">Quick Actions</h2>
                  <div className="flex flex-col gap-3">
                    <Button variant="outline" size="sm" onClick={() => { setTab('products'); openCreate() }}>
                      <Plus className="h-4 w-4 mr-2" />Add Product
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setTab('orders')}>
                      <ShoppingCart className="h-4 w-4 mr-2" />Manage Orders
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setTab('contacts')}>
                      <MessageSquare className="h-4 w-4 mr-2" />View Messages
                    </Button>
                    <Button variant="outline" size="sm" onClick={fetchStats}>
                      <RefreshCcw className="h-4 w-4 mr-2" />Refresh Stats
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm tracking-widest uppercase text-muted-foreground mb-3">Monthly Revenue Pie</h3>
                  <div className="flex items-center gap-4 mb-5">
                    <svg viewBox="0 0 100 100" className="w-24 h-24 -rotate-90 shrink-0">
                      <circle cx="50" cy="50" r={pieRadius} fill="none" className="stroke-muted" strokeWidth="12" />
                      <circle
                        cx="50"
                        cy="50"
                        r={pieRadius}
                        fill="none"
                        className="stroke-primary transition-all duration-500"
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={`${pieFilled} ${pieCircumference}`}
                      />
                    </svg>
                    <div className="text-xs space-y-2">
                      <div className="flex items-center gap-2"><span className="inline-block w-2.5 h-2.5 rounded-full bg-primary" />This Month: {money(monthlyRevenue)} ({monthlyRevenueShare}%)</div>
                      <div className="flex items-center gap-2"><span className="inline-block w-2.5 h-2.5 rounded-full bg-muted" />Other Months: {money(otherRevenue)} ({Math.max(0, 100 - monthlyRevenueShare)}%)</div>
                    </div>
                  </div>

                  <Separator className="mb-5" />

                  <h3 className="text-sm tracking-widest uppercase text-muted-foreground mb-3">Performance Snapshot</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between"><span className="text-muted-foreground">Average order value</span><span className="font-medium">{stats ? money(stats.average_order_value) : '—'}</span></div>
                    <div className="flex items-center justify-between"><span className="text-muted-foreground">Monthly orders</span><span className="font-medium">{stats?.monthly_orders ?? '—'}</span></div>
                    <div className="flex items-center justify-between"><span className="text-muted-foreground">Active products</span><span className="font-medium">{stats?.active_products ?? '—'}</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Orders */}
        {tab === 'orders' && (
          <div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h2 className="font-serif text-2xl font-light">Orders ({orders.length})</h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  placeholder="Search order ID, user name or email"
                  value={orderSearch}
                  onChange={e => setOrderSearch(e.target.value)}
                  className="sm:w-72"
                />
                <Select value={orderStatusFilter} onValueChange={v => setOrderStatusFilter(v as 'all' | OrderStatus)}>
                  <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={fetchOrders}><RefreshCcw className="h-4 w-4 mr-2" />Refresh</Button>
              </div>
            </div>

            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="bg-card border border-border rounded-lg p-5">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <p className="font-medium">Order #{order.id}</p>
                        <Badge variant="outline" className={`text-[10px] uppercase border ${statusClasses(order.status)}`}>{order.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{order.user?.name ?? 'Unknown User'} · {order.user?.email ?? 'No email'}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(order.created_at).toLocaleString()} · {order.items?.length ?? 0} items · {money(totalWithTax(order))}
                      </p>
                      {(order.recipient_name || order.city || order.country) && (
                        <p className="text-xs text-muted-foreground mt-1">Ship to: {[order.recipient_name, order.city, order.country].filter(Boolean).join(', ')}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <Select
                        value={order.status}
                        onValueChange={v => updateOrderStatus(order.id, v as OrderStatus)}
                        disabled={updatingOrderId === order.id}
                      >
                        <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      {updatingOrderId === order.id && <span className="text-xs text-muted-foreground">Updating...</span>}
                    </div>
                  </div>

                  {order.items?.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-xs tracking-widest uppercase text-muted-foreground mb-2">Order Items</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {order.items.slice(0, 4).map(item => (
                          <div key={item.id} className="text-sm text-muted-foreground flex items-center justify-between gap-2 border border-border rounded px-3 py-2">
                            <span className="truncate">{item.product_name}</span>
                            <span className="shrink-0">x{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                      {order.items.length > 4 && (
                        <p className="text-xs text-muted-foreground mt-2">+{order.items.length - 4} more item(s)</p>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {!ordersLoading && orders.length === 0 && (
                <div className="text-center py-16 text-muted-foreground bg-card border border-border rounded-lg">
                  <ShoppingCart className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No orders found</p>
                </div>
              )}

              {ordersLoading && (
                <div className="text-center py-16 text-muted-foreground bg-card border border-border rounded-lg text-sm">
                  Loading orders...
                </div>
              )}
            </div>
          </div>
        )}

        {/* Customers */}
        {tab === 'customers' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-light">Customers ({customers.length})</h2>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={fetchCustomers}><RefreshCcw className="h-4 w-4 mr-2" />Refresh</Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-3">
                {customers.map(c => (
                  <div key={c.id} className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="font-medium truncate">{c.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{c.email}</p>
                    </div>
                    <div className="flex-shrink-0 ml-3">
                      <Button size="sm" variant="outline" onClick={() => { setSelectedCustomer(c.id); fetchCustomerOrders(c.id) }}>
                        View Orders
                      </Button>
                    </div>
                  </div>
                ))}
                {customers.length === 0 && (
                  <div className="text-center py-10 text-muted-foreground bg-card border border-border rounded-lg">No customers found</div>
                )}
              </div>

              <div className="lg:col-span-2">
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-serif text-xl mb-4">{selectedCustomer ? `Orders for ${customers.find(c => c.id === selectedCustomer)?.name ?? ''}` : 'Select a customer to view orders'}</h3>
                  <div className="space-y-4">
                    {customerOrders.map(o => (
                      <div key={o.id} className="border border-border rounded-md px-4 py-3">
                        <div className="flex items-center justify-between">
                          <div className="min-w-0">
                            <p className="text-sm font-medium">Order #{o.id}</p>
                            <p className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString()}</p>
                          </div>
                          <div className="text-sm font-serif">{money(Number(o.total_amount || 0) + Number(o.tax_amount || 0))}</div>
                        </div>
                        {o.items?.length > 0 && (
                          <div className="mt-3 text-xs text-muted-foreground">
                            {o.items.slice(0,4).map(it => (
                              <div key={it.id} className="flex items-center justify-between py-1">
                                <span className="truncate">{it.product_name}</span>
                                <span className="ml-2">x{it.quantity}</span>
                              </div>
                            ))}
                            {o.items.length > 4 && <div className="text-xs mt-2">+{o.items.length - 4} more item(s)</div>}
                          </div>
                        )}
                      </div>
                    ))}
                    {selectedCustomer && customerOrders.length === 0 && (
                      <div className="text-sm text-muted-foreground">No orders found for this customer.</div>
                    )}
                    {!selectedCustomer && (
                      <div className="text-sm text-muted-foreground">Select a customer to see their order history.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products */}
        {tab === 'products' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-light">Products ({products.length})</h2>
              <Button onClick={openCreate} size="sm"><Plus className="h-4 w-4 mr-2" />Add Product</Button>
            </div>

            {/* Product form modal */}
            {showForm && (
              <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                <div className="bg-background border border-border rounded-lg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-serif text-xl">{editId ? 'Edit Product' : 'New Product'}</h3>
                    <button aria-label="Close form" title="Close form" onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
                  </div>
                  <div className="space-y-4">
                    {[['name','Name'], ['brand','Brand'], ['image','Image URL']].map(([key, lbl]) => (
                      <div key={key} className="space-y-1.5">
                        <Label className="text-xs tracking-widest uppercase text-muted-foreground">{lbl}</Label>
                        <Input value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
                      </div>
                    ))}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs tracking-widest uppercase text-muted-foreground">Price ($)</Label>
                        <Input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs tracking-widest uppercase text-muted-foreground">Stock</Label>
                        <Input type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs tracking-widest uppercase text-muted-foreground">Category</Label>
                      <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {['diving','dress','sport','luxury'].map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs tracking-widest uppercase text-muted-foreground">Description</Label>
                      <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <Button onClick={handleSave} disabled={saving} className="flex-1">
                      {saving ? 'Saving…' : <><Check className="h-4 w-4 mr-2" />Save</>}
                    </Button>
                    <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="text-left px-5 py-3 text-xs tracking-widest uppercase text-muted-foreground">Product</th>
                    <th className="text-left px-5 py-3 text-xs tracking-widest uppercase text-muted-foreground hidden md:table-cell">Category</th>
                    <th className="text-left px-5 py-3 text-xs tracking-widest uppercase text-muted-foreground">Price</th>
                    <th className="text-left px-5 py-3 text-xs tracking-widest uppercase text-muted-foreground hidden sm:table-cell">Stock</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-md bg-muted" onError={(e) => { (e.target as HTMLImageElement).style.display='none' }} />
                          <div>
                            <p className="font-medium">{p.name}</p>
                            <p className="text-xs text-muted-foreground">{p.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <Badge variant="secondary" className="text-[10px] capitalize">{p.category}</Badge>
                      </td>
                      <td className="px-5 py-4 font-serif">${parseFloat(p.price).toLocaleString()}</td>
                      <td className="px-5 py-4 hidden sm:table-cell">
                        <span className={p.stock > 0 ? 'text-green-600' : 'text-destructive'}>{p.stock}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 justify-end">
                          <button aria-label="Edit product" title="Edit product" onClick={() => openEdit(p)} className="text-muted-foreground hover:text-foreground transition-colors"><Pencil className="h-4 w-4" /></button>
                          <button aria-label="Delete product" title="Delete product" onClick={() => handleDelete(p.id)} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {products.length === 0 && (
                <div className="text-center py-16 text-muted-foreground">
                  <Package className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No products yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Contacts */}
        {tab === 'contacts' && (
          <div>
            <h2 className="font-serif text-2xl font-light mb-6">Contact Messages ({contacts.length})</h2>
            <div className="space-y-4">
              {contacts.map(msg => (
                <div key={msg.id} className={`bg-card border rounded-lg p-6 ${msg.is_read ? 'border-border opacity-70' : 'border-primary/30'}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-medium">{msg.name}</span>
                        {!msg.is_read && <Badge className="text-[10px] bg-primary">New</Badge>}
                        <span className="text-xs text-muted-foreground">{new Date(msg.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{msg.email}</p>
                      {msg.subject && <p className="text-sm font-medium mb-2">{msg.subject}</p>}
                      <p className="text-sm text-muted-foreground">{msg.message}</p>
                    </div>
                    {!msg.is_read && (
                      <Button variant="outline" size="sm" onClick={() => markRead(msg.id)}>
                        <Check className="h-3.5 w-3.5 mr-1.5" />Mark Read
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {contacts.length === 0 && (
                <div className="text-center py-16 text-muted-foreground bg-card border border-border rounded-lg">
                  <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No messages yet</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
