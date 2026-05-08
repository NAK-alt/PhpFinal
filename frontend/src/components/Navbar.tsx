import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, ShoppingBag, Watch, Sun, Moon, User, LogOut, LayoutDashboard } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { cart } = useCart()
  const { user, loading, logout, isAdmin } = useAuth()

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => { setIsOpen(false) }, [location.pathname])

  const toggleTheme = () => {
    const html = document.documentElement
    html.classList.toggle('dark')
    const dark = html.classList.contains('dark')
    localStorage.setItem('theme', dark ? 'dark' : 'light')
    setIsDark(dark)
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Collection', path: '/products' },
    { name: 'Our Story', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ]

  const isActive = (path: string) => location.pathname === path
  const totalItems = cart.items.reduce((s, i) => s + i.quantity, 0)

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-background/98 backdrop-blur shadow-sm border-b border-border'
        : 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Watch className="h-4.5 w-4.5 text-primary" />
            </div>
            <span className="font-serif text-xl tracking-widest uppercase text-foreground">
              Chronos
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm tracking-widest uppercase transition-colors relative group ${
                  isActive(link.path)
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/60 px-2 py-1 rounded'
                }`}
              >
                {link.name}
                <span className={`absolute -bottom-0.5 left-0 h-px bg-primary transition-all duration-300 ${
                  isActive(link.path) ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <Button variant="ghost" size="sm" onClick={toggleTheme} className="w-9 h-9 p-0">
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {/* Cart */}
            <Link to="/cart">
              <Button variant="ghost" size="sm" className="w-9 h-9 p-0 relative">
                <ShoppingBag className="h-4 w-4" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-medium rounded-full h-4 w-4 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            {/* Auth */}
            {loading ? (
              <div className="hidden md:flex items-center gap-2 px-3 text-sm text-muted-foreground">
                <span>Loading...</span>
              </div>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="hidden md:flex items-center gap-2 px-3">
                    <User className="h-4 w-4" />
                    <span className="text-sm max-w-[100px] truncate">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-zinc-900 text-white border-zinc-700">
                  {isAdmin() && (
                    <>
                      <DropdownMenuItem onClick={() => navigate('/admin')} className="text-white focus:text-white focus:bg-white/10">
                        <LayoutDashboard className="h-4 w-4 mr-2" /> Admin Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-white/15" />
                    </>
                  )}
                  <DropdownMenuItem onClick={handleLogout} className="text-white focus:text-white focus:bg-white/10">
                    <LogOut className="h-4 w-4 mr-2" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button size="sm" asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link to="/register">Register</Link>
                </Button>
              </div>
            )}

            {/* Mobile hamburger */}
            <Button variant="ghost" size="sm" className="md:hidden w-9 h-9 p-0" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.name}
                to={link.path}
                className={`block px-4 py-2.5 text-sm tracking-widest uppercase rounded-md transition-colors ${
                  isActive(link.path)
                    ? 'text-primary bg-primary/5'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-2 px-4 flex flex-col gap-2">
              {loading ? (
                <div className="text-sm text-muted-foreground px-2 py-1">Loading...</div>
              ) : user ? (
                <>
                  {isAdmin() && (
                    <Button variant="outline" size="sm" asChild className="w-full">
                      <Link to="/admin"><LayoutDashboard className="h-4 w-4 mr-2" />Admin</Link>
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={handleLogout} className="w-full text-destructive border-destructive/30">
                    <LogOut className="h-4 w-4 mr-2" />Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link to="/login">Sign In</Link>
                  </Button>
                  <Button size="sm" asChild className="w-full">
                    <Link to="/register">Register</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
