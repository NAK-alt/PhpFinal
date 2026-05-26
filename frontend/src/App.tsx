import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Layout from './components/Layout'
import Home from './components/pages/Home'
import Products from './components/pages/Products'
import ProductDetail from './components/pages/ProductDetail'
import Cart from './components/pages/Cart'
import Checkout from './components/pages/Checkout'
import About from './components/pages/About'
import Contact from './components/pages/Contact'
import Login from './components/pages/Login'
import Register from './components/pages/Register'
import AdminDashboard from './components/pages/AdminDashboard'
import { ReactNode } from 'react'

function PrivateRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center"><span className="text-muted-foreground font-serif text-lg">Loading…</span></div>
  return user ? <>{children}</> : <Navigate to="/login" replace />
}

function AdminRoute({ children }: { children: ReactNode }) {
  const { user, loading, isAdmin } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center"><span className="text-muted-foreground font-serif text-lg">Loading…</span></div>
  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin()) return <Navigate to="/" replace />
  return <>{children}</>
}

function GuestRoute({ children }: { children: ReactNode }) {
  const { user, loading, isAdmin } = useAuth()
  if (loading) return null
  if (user) return <Navigate to={isAdmin() ? '/admin' : '/'} replace />
  return <>{children}</>
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
              <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
              <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </Router>
      </CartProvider>
    </AuthProvider>
  )
}
