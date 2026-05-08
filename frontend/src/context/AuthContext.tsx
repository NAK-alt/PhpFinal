import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import api from '../lib/api'

interface Role { id: number; name: string }
interface User { id: number; name: string; email: string; role: Role }

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<User>
  register: (name: string, email: string, password: string, password_confirmation: string) => Promise<User>
  logout: () => Promise<void>
  isAdmin: () => boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      api.get('/user')
        .then(res => setUser(res.data))
        .catch(() => localStorage.removeItem('auth_token'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    const res = await api.post('/login', { email, password })
    localStorage.setItem('auth_token', res.data.token)
    setUser(res.data.user)
    return res.data.user
  }

  const register = async (name: string, email: string, password: string, password_confirmation: string) => {
    const res = await api.post('/register', { name, email, password, password_confirmation })
    localStorage.setItem('auth_token', res.data.token)
    setUser(res.data.user)
    return res.data.user
  }

  const logout = async () => {
    try { await api.post('/logout') } catch {}
    localStorage.removeItem('auth_token')
    setUser(null)
  }

  const isAdmin = () => user?.role?.name === 'admin'

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
