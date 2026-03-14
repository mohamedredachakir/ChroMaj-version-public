import { motion } from 'motion/react'
import { useInView } from 'motion/react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { NewsletterSignup } from './NewsletterSignup'

export function CommunityCTA() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="py-32 px-6 bg-zinc-950">
      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          <h2 
            className="text-6xl md:text-9xl mb-8 leading-[0.9]" 
            style={{ fontFamily: 'Bebas Neue, sans-serif' }}
          >
            JOIN THE MOVEMENT
          </h2>
          
          <p 
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto" 
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Are you a creator pushing boundaries? A storyteller with a vision? 
            Chro'Mag is your platform to be seen, heard, and celebrated.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.div
              className="group"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/auth" className="flex items-center gap-2 px-10 py-5 bg-white text-black hover:bg-amber-500 hover:text-white transition-all duration-300 text-lg">
                Submit Your Work
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <motion.div
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/events" className="block px-10 py-5 border-2 border-white hover:bg-white hover:text-black transition-all duration-300 text-lg">
                Explore Events
              </Link>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="mx-auto mt-12 max-w-2xl rounded-[2rem] border border-zinc-800 bg-black/50 p-6"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          <p className="mb-4 text-sm uppercase tracking-[0.35em] text-amber-500" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Newsletter
          </p>
          <NewsletterSignup />
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-3 gap-8 mt-24 pt-24 border-t border-zinc-800"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div>
            <div 
              className="text-5xl md:text-6xl mb-2 text-amber-500" 
              style={{ fontFamily: 'Bebas Neue, sans-serif' }}
            >
              500+
            </div>
            <div 
              className="text-gray-400 text-sm md:text-base" 
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Featured Creators
            </div>
          </div>

          <div>
            <div 
              className="text-5xl md:text-6xl mb-2 text-amber-500" 
              style={{ fontFamily: 'Bebas Neue, sans-serif' }}
            >
              1000+
            </div>
            <div 
              className="text-gray-400 text-sm md:text-base" 
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Stories Published
            </div>
          </div>

          <div>
            <div 
              className="text-5xl md:text-6xl mb-2 text-amber-500" 
              style={{ fontFamily: 'Bebas Neue, sans-serif' }}
            >
              50K+
            </div>
            <div 
              className="text-gray-400 text-sm md:text-base" 
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Community Members
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
