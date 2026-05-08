import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Watch, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      navigate(user.role?.name === 'admin' ? '/admin' : '/')
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left image panel */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=900&q=80"
          alt="Luxury watch"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-end p-16 text-white">
          <p className="font-serif text-3xl font-light mb-3 text-center">Time is the most<br />precious luxury</p>
          <p className="text-white/60 text-sm text-center">Chronos Luxury · Est. 1973</p>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <Link to="/" className="inline-flex items-center gap-2 mb-8 text-muted-foreground hover:text-foreground transition-colors">
              <Watch className="h-5 w-5" />
              <span className="font-serif text-lg tracking-widest uppercase">Chronos Luxury</span>
            </Link>
            <h1 className="font-serif text-3xl font-light mb-2">Welcome Back</h1>
            <p className="text-muted-foreground text-sm">Sign in to your account</p>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-md px-4 py-3 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs tracking-widest uppercase text-muted-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs tracking-widest uppercase text-muted-foreground">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white hover:text-white"
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full tracking-widest uppercase text-sm font-light" size="lg" disabled={loading}>
              {loading ? 'Signing In…' : 'Sign In'}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:underline">Create one</Link>
          </p>

          {/* Demo hint */}
          <div className="mt-6 p-4 bg-muted rounded-md text-xs text-muted-foreground text-center space-y-1">
            <p className="font-medium text-foreground">Demo credentials</p>
            <p>Admin: <span className="font-mono">admin@chronos.com</span> / <span className="font-mono">password</span></p>
            <p>Customer: <span className="font-mono">user@chronos.com</span> / <span className="font-mono">password</span></p>
          </div>
        </div>
      </div>
    </div>
  )
}
