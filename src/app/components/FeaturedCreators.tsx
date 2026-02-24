import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { Instagram, ExternalLink } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';

const creators = [
  {
    id: 1,
    name: 'Yassine El Mansouri',
    role: 'Street Artist & Muralist',
    image: 'https://images.unsplash.com/photo-1551180452-45cc5da51c3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMGFydGlzdCUyMHBhaW50aW5nJTIwc3R1ZGlvfGVufDF8fHx8MTc3MTc5NzgyOXww&ixlib=rb-4.1.0&q=80&w=1080',
    instagram: '@yassine.art'
  },
  {
    id: 2,
    name: 'Amina Zahiri',
    role: 'Photographer & Visual Storyteller',
    image: 'https://images.unsplash.com/photo-1708006247791-00eee9388480?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwcGhvdG9ncmFwaGVyJTIwcG9ydHJhaXQlMjBjcmVhdGl2ZXxlbnwxfHx8fDE3NzE3OTc4MzB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    instagram: '@aminazahiri'
  },
  {
    id: 3,
    name: 'Mehdi Benali',
    role: 'Music Producer & DJ',
    image: 'https://images.unsplash.com/photo-1710951403141-353d4e5c7cbf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXp6JTIwbXVzaWNpYW4lMjBwZXJmb3JtYW5jZXxlbnwxfHx8fDE3NzE3NTAwMjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    instagram: '@mehdi.beats'
  },
  {
    id: 4,
    name: 'Sofia Alami',
    role: 'Fashion Designer',
    image: 'https://images.unsplash.com/photo-1767294274414-5e1e6c3974e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBhcnQlMjBleGhpYml0aW9ufGVufDF8fHx8MTc3MTc3NTA3OHww&ixlib=rb-4.1.0&q=80&w=1080',
    instagram: '@sofiaalami'
  }
];

export function FeaturedCreators() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-32 px-6 bg-zinc-950">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-6xl md:text-8xl mb-4" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
            FEATURED CREATORS
          </h2>
          <p className="text-xl text-gray-400" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            The artists defining Morocco's creative future
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8">
          {creators.map((creator, index) => (
            <motion.div
              key={creator.id}
              className="group cursor-pointer"
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="relative overflow-hidden bg-zinc-900 mb-4">
                <div className="aspect-[3/4] relative">
                  <ImageWithFallback
                    src={creator.image}
                    alt={creator.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />

                  {/* Hover overlay */}
                  <motion.div
                    className="absolute inset-0 bg-black/80 flex items-center justify-center gap-4"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <a
                      href="#"
                      className="p-3 bg-white text-black hover:bg-amber-500 transition-colors duration-300"
                      onClick={(e) => e.preventDefault()}
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                    <a
                      href="#"
                      className="p-3 bg-white text-black hover:bg-amber-500 transition-colors duration-300"
                      onClick={(e) => e.preventDefault()}
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </motion.div>
                </div>
              </div>

              <div>
                <h3
                  className="text-2xl mb-1 group-hover:text-amber-500 transition-colors duration-300"
                  style={{ fontFamily: 'Bebas Neue, sans-serif' }}
                >
                  {creator.name}
                </h3>
                <p
                  className="text-gray-400 mb-2"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {creator.role}
                </p>
                <p
                  className="text-sm text-gray-500"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {creator.instagram}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
