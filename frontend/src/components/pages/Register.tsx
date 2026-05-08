import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Watch, Eye, EyeOff, Check } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState<string | Record<string, string[]>>('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.password_confirmation) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    try {
      await register(form.name, form.email, form.password, form.password_confirmation)
      navigate('/')
    } catch (err: any) {
      const data = err.response?.data
      setError(data?.errors ?? data?.message ?? 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  const errorMessages = typeof error === 'string'
    ? [error]
    : Object.values(error).flat()

  const perks = [
    'Early access to new arrivals',
    'Exclusive members-only pricing',
    'Personalized recommendations',
    'Saved cart across devices',
  ]

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-foreground items-center justify-center p-16">
        <div className="text-background max-w-sm">
          <Watch className="h-10 w-10 mb-8 text-primary" />
          <h2 className="font-serif text-4xl font-light mb-4">Join the<br />Chronos Circle</h2>
          <p className="text-background/60 text-sm mb-10 leading-relaxed">
            Become part of an exclusive community that shares a passion for exceptional timepieces and the art of horology.
          </p>
          <ul className="space-y-3">
            {perks.map(perk => (
              <li key={perk} className="flex items-center gap-3 text-sm text-background/80">
                <Check className="h-4 w-4 text-primary flex-shrink-0" />
                {perk}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <Link to="/" className="inline-flex items-center gap-2 mb-8 text-muted-foreground hover:text-foreground transition-colors lg:hidden">
              <Watch className="h-5 w-5" />
              <span className="font-serif text-lg tracking-widest uppercase">Chronos Luxury</span>
            </Link>
            <h1 className="font-serif text-3xl font-light mb-2">Create Account</h1>
            <p className="text-muted-foreground text-sm">Join our exclusive community</p>
          </div>

          {errorMessages.length > 0 && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-md px-4 py-3 mb-6 space-y-1">
              {errorMessages.map((m, i) => <p key={i}>{m}</p>)}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs tracking-widest uppercase text-muted-foreground">Full Name</Label>
              <Input id="name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs tracking-widest uppercase text-muted-foreground">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs tracking-widest uppercase text-muted-foreground">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="At least 8 characters"
                  required
                  minLength={8}
                  className="pr-10"
                />
                <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white hover:text-white">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirm" className="text-xs tracking-widest uppercase text-muted-foreground">Confirm Password</Label>
              <Input
                id="confirm"
                type="password"
                value={form.password_confirmation}
                onChange={e => setForm(f => ({ ...f, password_confirmation: e.target.value }))}
                placeholder="Repeat password"
                required
              />
            </div>

            <Button type="submit" className="w-full tracking-widest uppercase text-sm font-light" size="lg" disabled={loading}>
              {loading ? 'Creating Account…' : 'Create Account'}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
