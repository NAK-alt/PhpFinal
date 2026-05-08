import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Star, Shield, Truck } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '../ui/button'
import WatchCard, { Watch } from '../WatchCard'
import api from '../../lib/api'

const HERO_IMG = 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=1800&q=80'

const reveal = {
  hidden: { opacity: 0, y: 36, filter: 'blur(4px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.95 },
  },
}

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.08 },
  },
}

export default function Home() {
  const [featured, setFeatured] = useState<Watch[]>([])

  useEffect(() => {
    api.get('/products?featured=1&per_page=3')
      .then(res => setFeatured(res.data.data ?? res.data))
      .catch(() => {})
  }, [])

  const features = [
    { icon: Star, title: 'Premium Quality', desc: 'Each timepiece is crafted with the finest materials and obsessive attention to detail.' },
    { icon: Shield, title: 'Lifetime Warranty', desc: 'We stand behind every watch with comprehensive, transferable warranty coverage.' },
    { icon: Truck, title: 'Free Shipping', desc: 'Complimentary insured worldwide shipping on all orders, discreetly packaged.' },
  ]

  return (
    <div>
      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="Luxury watch collection" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
        </div>
        <div className="relative z-10 text-center text-white max-w-3xl mx-auto px-6 animate-fade-up">
          <p className="text-xs tracking-[0.4em] uppercase text-gold-light mb-6 font-light">Est. 1973 · Geneva</p>
          <h1 className="font-serif text-5xl md:text-7xl font-light mb-6 leading-tight">
            Timeless<br />Elegance
          </h1>
          <p className="text-white/75 text-lg mb-10 font-light max-w-xl mx-auto leading-relaxed">
            Discover the world's most exquisite luxury timepieces, crafted with precision and passion for those who appreciate the art of time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-black hover:bg-white/90 font-light tracking-widest uppercase text-sm px-8">
              <Link to="/products">Explore Collection <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-white text-black hover:bg-white/90 font-light tracking-widest uppercase text-sm px-8">
              <Link to="/about">Our Story</Link>
            </Button>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 animate-bounce">
          <div className="w-px h-12 bg-white/30 mx-auto" />
        </div>
      </section>

      {/* Value props */}
      <motion.section
        className="py-20 bg-muted/40"
        variants={reveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="max-w-5xl mx-auto px-6">
          <motion.div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border" variants={stagger}>
            {features.map(({ icon: Icon, title, desc }) => (
              <motion.div key={title} className="text-center px-10 py-10 md:py-0" variants={reveal}>
                <Icon className="h-8 w-8 text-primary mx-auto mb-4" strokeWidth={1.5} />
                <h3 className="font-serif text-lg mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Featured */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3">Curated Selection</p>
            <h2 className="font-serif text-4xl font-light mb-4">Featured Timepieces</h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed">
              Handpicked from our most coveted collections, each representing the pinnacle of horological excellence.
            </p>
          </motion.div>
          {featured.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
            >
              {featured.map(w => <WatchCard key={w.id} watch={w} />)}
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {[1, 2, 3].map(i => (
                <div key={i} className="aspect-square bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          )}
          <motion.div
            className="text-center"
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <Button asChild variant="outline" size="lg" className="tracking-widest uppercase text-sm font-light px-10">
              <Link to="/products">View All Watches <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* CTA banner */}
      <motion.section
        className="relative py-32 overflow-hidden"
        variants={reveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.22 }}
      >
        <img
          src="https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=1600&q=80"
          alt="Luxury experience"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/65" />
        <motion.div className="relative z-10 max-w-2xl mx-auto text-center px-6 text-white" variants={reveal}>
          <p className="text-xs tracking-[0.4em] uppercase text-gold-light mb-4 font-light">Exclusive Access</p>
          <h2 className="font-serif text-4xl md:text-5xl font-light mb-6">
            Experience Luxury Like Never Before
          </h2>
          <p className="text-white/70 mb-10 text-sm leading-relaxed">
            Join our exclusive community and be the first to discover new arrivals, limited editions, and private sale events.
          </p>
          <Button asChild size="lg" className="bg-white text-black hover:bg-white/90 font-light tracking-widest uppercase text-sm px-10">
            <Link to="/register">Create Account</Link>
          </Button>
        </motion.div>
      </motion.section>
    </div>
  )
}
