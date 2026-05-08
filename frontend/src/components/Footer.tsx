import { Link } from 'react-router-dom'
import { Watch, Instagram, Twitter, Facebook } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-muted border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-5">
              <Watch className="h-6 w-6 text-primary" />
              <span className="font-serif text-xl tracking-widest uppercase">Chronos Luxury</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              Curating the world's finest luxury timepieces since 1973. Each watch in our collection represents the pinnacle of Swiss craftsmanship and elegance.
            </p>
            <div className="flex gap-4 mt-6">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-serif text-sm tracking-widest uppercase mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {[['Collection', '/products'], ['Our Story', '/about'], ['Contact', '/contact'], ['Cart', '/cart']].map(([label, path]) => (
                <li key={path}>
                  <Link to={path} className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-sm tracking-widest uppercase mb-4">Services</h3>
            <ul className="space-y-2.5">
              {['Shipping & Returns', 'Lifetime Warranty', 'Watch Care', 'Authentication', 'FAQ'].map(item => (
                <li key={item}>
                  <a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-xs tracking-wide">
            © {new Date().getFullYear()} Chronos Luxury. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service'].map(item => (
              <a key={item} href="#" className="text-muted-foreground hover:text-foreground text-xs transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
