import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { useAuth } from '../auth/AuthProvider'

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isAuthenticated, logout, user } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Stories', to: '/stories' },
    { label: 'Artists', to: '/artists' },
    { label: 'Events', to: '/events' },
  ]

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/95 backdrop-blur-sm border-b border-zinc-900' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link to="/">
          <h1 
            className="text-3xl md:text-4xl tracking-tight" 
            style={{ fontFamily: 'Bebas Neue, sans-serif' }}
          >
            CHRO'MAG
          </h1>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `text-sm transition-colors duration-300 ${isActive ? 'text-amber-500' : 'hover:text-amber-500'}`}
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              {link.label}
            </NavLink>
          ))}
          {user?.role === 'ADMIN' ? (
            <NavLink to="/admin" className="text-sm hover:text-amber-500 transition-colors duration-300" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Dashboard
            </NavLink>
          ) : null}
          {isAuthenticated ? (
            <button
              className="px-6 py-2 bg-white text-black hover:bg-amber-500 hover:text-white transition-colors duration-300 text-sm"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              onClick={logout}
            >
              Logout
            </button>
          ) : (
            <NavLink
              to="/auth"
              className="px-6 py-2 bg-white text-black hover:bg-amber-500 hover:text-white transition-colors duration-300 text-sm"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Sign In
            </NavLink>
          )}
        </nav>

        <button
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden bg-black border-t border-zinc-900"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="px-6 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className="text-lg hover:text-amber-500 transition-colors duration-300"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                  }}
                >
                  {link.label}
                </NavLink>
              ))}
              {user?.role === 'ADMIN' ? (
                <NavLink
                  to="/admin"
                  className="text-lg hover:text-amber-500 transition-colors duration-300"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </NavLink>
              ) : null}
              {isAuthenticated ? (
                <button
                  className="px-6 py-3 bg-white text-black hover:bg-amber-500 hover:text-white transition-colors duration-300 w-full"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  onClick={() => {
                    logout()
                    setIsMobileMenuOpen(false)
                  }}
                >
                  Logout
                </button>
              ) : (
                <NavLink
                  to="/auth"
                  className="px-6 py-3 bg-white text-black hover:bg-amber-500 hover:text-white transition-colors duration-300 w-full text-center"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </NavLink>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
