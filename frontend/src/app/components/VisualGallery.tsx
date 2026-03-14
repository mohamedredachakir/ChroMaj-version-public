import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef, useState } from 'react';
import { ImageWithFallback } from './ImageWithFallback';

const galleryImages = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1613894811137-b5ee44ba3cb3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFmZml0aSUyMHdhbGwlMjB1cmJhbiUyMGFydHxlbnwxfHx8fDE3NzE3OTc4MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    alt: 'Urban graffiti art'
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1761416181955-472b15a18c86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNb3JvY2NvJTIwdGlsZXMlMjBwYXR0ZXJuJTIwY3VsdHVyZXxlbnwxfHx8fDE3NzE3OTc4MzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    alt: 'Moroccan patterns'
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1542357091-d4cd9ad6ba02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2F0ZWJvYXJkJTIwdXJiYW4lMjBjdWx0dXJlfGVufDF8fHx8MTc3MTc5NzgzMnww&ixlib=rb-4.1.0&q=80&w=1080',
    alt: 'Urban skateboard culture'
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1667143298015-e72d76911222?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNb3JvY2NhbiUyMHN0cmVldCUyMGFydCUyMGdyYWZmaXRpfGVufDF8fHx8MTc3MTc5NzgyOXww&ixlib=rb-4.1.0&q=80&w=1080',
    alt: 'Street art Morocco'
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1764683062374-4945760e6e03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMGRhbmNlJTIwaGlwJTIwaG9wfGVufDF8fHx8MTc3MTc5NzgzMXww&ixlib=rb-4.1.0&q=80&w=1080',
    alt: 'Hip hop dance'
  },
  {
    id: 6,
    url: 'https://images.unsplash.com/photo-1601895236907-c1ead695720a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXQlMjBmYXNoaW9uJTIwTW9yb2Njb3xlbnwxfHx8fDE3NzE3OTc4MzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    alt: 'Street fashion'
  },
  {
    id: 7,
    url: 'https://images.unsplash.com/photo-1757163587904-14cdadfda026?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNb3JvY2NvJTIwYXJjaGl0ZWN0dXJlJTIwaGVyaXRhZ2V8ZW58MXx8fHwxNzcxNzk3ODMwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    alt: 'Moroccan architecture'
  },
  {
    id: 8,
    url: 'https://images.unsplash.com/photo-1758267928314-751925a9170f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMHByb2R1Y2VyJTIwc3R1ZGlvJTIwdXJiYW58ZW58MXx8fHwxNzcxNzk3ODMwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    alt: 'Music production'
  },
  {
    id: 9,
    url: 'https://images.unsplash.com/photo-1767294274414-5e1e6c3974e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBhcnQlMjBleGhpYml0aW9ufGVufDF8fHx8MTc3MTc3NTA3OHww&ixlib=rb-4.1.0&q=80&w=1080',
    alt: 'Contemporary art'
  }
];

export function VisualGallery() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section ref={ref} className="py-32 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="mb-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-6xl md:text-8xl mb-4" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
            VISUAL GALLERY
          </h2>
          <p className="text-xl text-gray-400" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Moments captured from the streets of Morocco
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {galleryImages.map((image, index) => (
            <motion.div
              key={image.id}
              className="relative aspect-square overflow-hidden bg-zinc-900 cursor-pointer"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              onHoverStart={() => setHoveredId(image.id)}
              onHoverEnd={() => setHoveredId(null)}
            >
              <ImageWithFallback
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-700"
                style={{
                  transform: hoveredId === image.id ? 'scale(1.15)' : 'scale(1)'
                }}
              />

              {/* Overlay on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-amber-600/80 to-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredId === image.id ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <button
            className="px-8 py-4 border-2 border-white hover:bg-white hover:text-black transition-all duration-300"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            View Full Gallery
          </button>
        </motion.div>
      </div>
    </section>
  );
}
