import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = ['Stories', 'Creators', 'Gallery', 'About'];

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
        {/* Logo */}
        <a href="#" onClick={(e) => e.preventDefault()}>
          <h1 
            className="text-3xl md:text-4xl tracking-tight" 
            style={{ fontFamily: 'Bebas Neue, sans-serif' }}
          >
            CHRO'MAG
          </h1>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link}
              href="#"
              className="text-sm hover:text-amber-500 transition-colors duration-300"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              onClick={(e) => e.preventDefault()}
            >
              {link}
            </a>
          ))}
          <button 
            className="px-6 py-2 bg-white text-black hover:bg-amber-500 hover:text-white transition-colors duration-300 text-sm"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Submit
          </button>
        </nav>

        {/* Mobile Menu Button */}
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

      {/* Mobile Menu */}
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
                <a
                  key={link}
                  href="#"
                  className="text-lg hover:text-amber-500 transition-colors duration-300"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  {link}
                </a>
              ))}
              <button 
                className="px-6 py-3 bg-white text-black hover:bg-amber-500 hover:text-white transition-colors duration-300 w-full"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Submit Your Work
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
