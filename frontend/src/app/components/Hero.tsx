import { motion } from 'motion/react'
import { ArrowDown } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
      <motion.div
        className="absolute inset-0 opacity-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 2 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-black to-amber-900/20" />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <h1 className="text-[clamp(3rem,12vw,14rem)] leading-[0.9] tracking-tighter mb-8" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
            CHRO'MAG
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="max-w-3xl mx-auto mb-12"
        >
          <p className="text-xl md:text-2xl text-gray-300 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Where Moroccan Culture Meets Contemporary Expression
          </p>
          <p className="text-base md:text-lg text-gray-500" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Art • Passion • Culture
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <Link to="/stories" className="inline-flex px-8 py-4 bg-white text-black hover:bg-gray-200 transition-colors duration-300" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Explore Stories
          </Link>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.5, repeat: Infinity, repeatType: 'reverse' }}
      >
        <ArrowDown className="w-6 h-6 text-gray-500" />
      </motion.div>
    </section>
  )
}
