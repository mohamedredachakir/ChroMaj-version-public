import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef, useState } from 'react';
import { Palette, Heart, Users } from 'lucide-react';

const pillars = [
  {
    icon: Palette,
    title: 'ART',
    description: 'Visual expression through graffiti, photography, and contemporary design',
    color: 'from-red-600 to-orange-600'
  },
  {
    icon: Heart,
    title: 'PASSION',
    description: 'Music, dance, and performance that moves souls and breaks boundaries',
    color: 'from-amber-600 to-yellow-600'
  },
  {
    icon: Users,
    title: 'CULTURE',
    description: 'Stories, heritage, and the evolving identity of modern Morocco',
    color: 'from-orange-600 to-red-600'
  }
];

export function Pillars() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section ref={ref} className="py-32 px-6 bg-zinc-950">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          className="text-5xl md:text-7xl mb-20 text-center"
          style={{ fontFamily: 'Bebas Neue, sans-serif' }}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          OUR THREE PILLARS
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                className="relative group cursor-pointer"
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
              >
                <div className="relative h-96 bg-zinc-900 overflow-hidden">
                  {/* Gradient overlay on hover */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${pillar.color} opacity-0`}
                    animate={{ opacity: hoveredIndex === index ? 0.2 : 0 }}
                    transition={{ duration: 0.3 }}
                  />

                  <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-center">
                    <motion.div
                      animate={{ 
                        scale: hoveredIndex === index ? 1.2 : 1,
                        rotate: hoveredIndex === index ? 360 : 0
                      }}
                      transition={{ duration: 0.6 }}
                    >
                      <Icon className="w-16 h-16 mb-6" />
                    </motion.div>

                    <h3 
                      className="text-5xl mb-4" 
                      style={{ fontFamily: 'Bebas Neue, sans-serif' }}
                    >
                      {pillar.title}
                    </h3>

                    <motion.p
                      className="text-gray-400 text-lg"
                      style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                      animate={{ 
                        opacity: hoveredIndex === index ? 1 : 0.7,
                        y: hoveredIndex === index ? 0 : 10
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {pillar.description}
                    </motion.p>
                  </div>

                  {/* Bottom border accent */}
                  <motion.div
                    className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${pillar.color}`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: hoveredIndex === index ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
