import { Award, Users, Clock, Globe } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from '../ui/button'

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

export default function About() {
  const stats = [
    { icon: Clock, label: 'Years of Excellence', value: '50+' },
    { icon: Award, label: 'Awards Won', value: '25+' },
    { icon: Users, label: 'Master Craftsmen', value: '100+' },
    { icon: Globe, label: 'Countries Served', value: '40+' },
  ]

  const values = [
    { title: 'Craftsmanship', description: 'Every timepiece is meticulously crafted by master artisans who have dedicated their lives to the art of horology.' },
    { title: 'Innovation', description: 'We continuously push the boundaries of watchmaking technology while deeply respecting traditional techniques.' },
    { title: 'Heritage', description: 'Our legacy spans generations, with each watch carrying forward the traditions of fine Swiss watchmaking.' },
    { title: 'Excellence', description: 'We accept nothing less than perfection in every aspect — from initial design to final assembly and beyond.' },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=1600&q=80"
          alt="Watchmaking atelier"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 text-center text-white max-w-3xl mx-auto px-6">
          <p className="text-xs tracking-[0.4em] uppercase text-gold-light mb-5 font-light">Founded 1973 · Geneva, Switzerland</p>
          <h1 className="font-serif text-5xl md:text-7xl font-light mb-6">Our Story</h1>
          <p className="text-white/70 text-lg font-light leading-relaxed max-w-xl mx-auto">
            Over five decades at the forefront of horological excellence, creating timepieces that represent the perfect fusion of tradition and innovation.
          </p>
        </div>
      </section>

      {/* Stats */}
      <motion.section
        className="py-20 bg-muted/40"
        variants={reveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="max-w-4xl mx-auto px-6">
          <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-8" variants={stagger}>
            {stats.map(({ icon: Icon, label, value }) => (
              <motion.div key={label} className="text-center" variants={reveal}>
                <Icon className="h-7 w-7 text-primary mx-auto mb-3" strokeWidth={1.5} />
                <div className="font-serif text-4xl mb-1">{value}</div>
                <div className="text-xs text-muted-foreground tracking-wide">{label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Story */}
      <motion.section
        className="py-24"
        variants={reveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.18 }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div variants={reveal}>
              <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">A Legacy of Precision</p>
              <h2 className="font-serif text-4xl font-light mb-8">Crafted With Purpose,<br />Built to Last Forever</h2>
              <div className="space-y-5 text-muted-foreground leading-relaxed text-sm">
                <p>Founded in 1973 by master watchmaker Heinrich Zimmermann, Chronos Luxury began as a small atelier in the Swiss Alps. With an unwavering commitment to precision and artistry, Heinrich set out to create timepieces that would stand the test of time.</p>
                <p>Today, we continue his legacy with the same dedication to excellence. Each watch undergoes hundreds of hours of meticulous handcrafting, ensuring every component meets our exacting standards.</p>
                <p>Our master craftsmen, trained in traditional Swiss methods, work alongside cutting-edge technology to create watches that are not just instruments of time, but works of art to be treasured for generations.</p>
              </div>
              <Button asChild className="mt-10 tracking-widest uppercase text-sm font-light" variant="outline">
                <Link to="/products">Explore the Collection</Link>
              </Button>
            </motion.div>
            <motion.div className="relative" variants={reveal}>
              <img
                src="https://images.unsplash.com/photo-1553119281-99dbc4f4ed33?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Watchmaking precision"
                className="w-full h-[500px] object-cover rounded-lg"
              />
              <img
                src="https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&q=80"
                alt="Luxury watch detail"
                className="absolute -bottom-6 -left-6 w-48 h-48 object-cover rounded-lg shadow-2xl hidden lg:block"
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Values */}
      <motion.section
        className="py-24 bg-muted/30"
        variants={reveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="max-w-5xl mx-auto px-6">
          <motion.div className="text-center mb-16" variants={reveal}>
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3">What Drives Us</p>
            <h2 className="font-serif text-4xl font-light">Our Values</h2>
          </motion.div>
          <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border" variants={stagger}>
            {values.map(({ title, description }) => (
              <motion.div key={title} className="bg-background p-10" variants={reveal}>
                <h3 className="font-serif text-xl mb-4">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>
    </div>
  )
}
