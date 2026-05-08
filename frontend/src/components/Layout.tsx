import { ReactNode, useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from './Navbar'
import Footer from './Footer'
import { useCart } from '../context/CartContext'

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation()
  const { notification } = useCart()

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  const pageVariants = {
    initial: {
      opacity: 0,
      y: 12,
      filter: 'blur(4px)',
    },
    animate: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 1.3,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  return (
    <div className="min-h-screen flex flex-col">
      {notification && (
        <div className="fixed top-20 right-6 z-[60] max-w-sm rounded-xl border border-border bg-background/95 px-4 py-3 shadow-2xl backdrop-blur-md animate-in slide-in-from-right-4 fade-in duration-300">
          <p className="text-sm font-medium text-foreground">{notification.message}</p>
        </div>
      )}
      <Navbar />
      <main className="flex-1 overflow-hidden">
        <motion.div
          key={location.pathname}
          className="min-h-full"
          variants={pageVariants}
          initial="initial"
          animate="animate"
        >
          {children}
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}
