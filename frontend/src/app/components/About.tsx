import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';

export function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-32 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-6xl md:text-8xl mb-8 leading-[0.9]" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
              THE VOICE OF A NEW GENERATION
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <p className="text-xl text-gray-300 leading-relaxed" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Chro'Mag is a digital cultural chronicle that amplifies the voices of young Moroccan creators shaping the contemporary cultural landscape.
            </p>
            <p className="text-lg text-gray-400 leading-relaxed" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              From street art in Casablanca to underground music scenes in Marrakech, we document the raw, unfiltered creativity that defines Morocco's new wave.
            </p>
            <p className="text-lg text-gray-400 leading-relaxed" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              We are the intersection of heritage and innovation—a platform where tradition meets rebellion, and culture evolves.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
