import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { ImageWithFallback } from './ImageWithFallback';

const stories = [
  {
    id: 1,
    title: 'The Rise of Casablanca Street Art',
    category: 'ART',
    image: 'https://images.unsplash.com/photo-1667143298015-e72d76911222?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNb3JvY2NhbiUyMHN0cmVldCUyMGFydCUyMGdyYWZmaXRpfGVufDF8fHx8MTc3MTc5NzgyOXww&ixlib=rb-4.1.0&q=80&w=1080',
    excerpt: 'How a new generation is transforming urban walls into cultural statements',
    size: 'large'
  },
  {
    id: 2,
    title: 'Voices of the Underground',
    category: 'PASSION',
    image: 'https://images.unsplash.com/photo-1758267928314-751925a9170f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMHByb2R1Y2VyJTIwc3R1ZGlvJTIwdXJiYW58ZW58MXx8fHwxNzcxNzk3ODMwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    excerpt: 'Moroccan producers redefining the sound of North African music',
    size: 'medium'
  },
  {
    id: 3,
    title: 'Heritage Reimagined',
    category: 'CULTURE',
    image: 'https://images.unsplash.com/photo-1757163587904-14cdadfda026?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNb3JvY2NvJTIwYXJjaGl0ZWN0dXJlJTIwaGVyaXRhZ2V8ZW58MXx8fHwxNzcxNzk3ODMwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    excerpt: 'Traditional architecture meets modern design philosophy',
    size: 'medium'
  },
  {
    id: 4,
    title: 'Street Fashion Revolution',
    category: 'ART',
    image: 'https://images.unsplash.com/photo-1601895236907-c1ead695720a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXQlMjBmYXNoaW9uJTIwTW9yb2Njb3xlbnwxfHx8fDE3NzE3OTc4MzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    excerpt: 'Young designers blending tradition with streetwear culture',
    size: 'large'
  },
  {
    id: 5,
    title: 'Dance as Resistance',
    category: 'PASSION',
    image: 'https://images.unsplash.com/photo-1764683062374-4945760e6e03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMGRhbmNlJTIwaGlwJTIwaG9wfGVufDF8fHx8MTc3MTc5NzgzMXww&ixlib=rb-4.1.0&q=80&w=1080',
    excerpt: 'Hip-hop and breaking culture in Moroccan cities',
    size: 'medium'
  }
];

export function FeaturedStories() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-32 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-6xl md:text-8xl mb-4" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
            FEATURED STORIES
          </h2>
          <p className="text-xl text-gray-400" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            The latest chronicles from Morocco's creative scene
          </p>
        </motion.div>

        <div className="grid md:grid-cols-12 gap-6">
          {/* Large story 1 */}
          <motion.article
            className="md:col-span-8 group cursor-pointer"
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="relative h-[600px] overflow-hidden bg-zinc-900">
              <ImageWithFallback
                src={stories[0].image}
                alt={stories[0].title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <span
                  className="text-sm text-amber-500 mb-2 block"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {stories[0].category}
                </span>
                <h3
                  className="text-4xl md:text-5xl mb-3 group-hover:text-amber-500 transition-colors duration-300"
                  style={{ fontFamily: 'Bebas Neue, sans-serif' }}
                >
                  {stories[0].title}
                </h3>
                <p
                  className="text-gray-300 text-lg"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {stories[0].excerpt}
                </p>
              </div>
            </div>
          </motion.article>

          {/* Medium stories */}
          <div className="md:col-span-4 flex flex-col gap-6">
            {stories.slice(1, 3).map((story, index) => (
              <motion.article
                key={story.id}
                className="group cursor-pointer"
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              >
                <div className="relative h-[290px] overflow-hidden bg-zinc-900">
                  <ImageWithFallback
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span
                      className="text-xs text-amber-500 mb-2 block"
                      style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                    >
                      {story.category}
                    </span>
                    <h3
                      className="text-2xl mb-2 group-hover:text-amber-500 transition-colors duration-300"
                      style={{ fontFamily: 'Bebas Neue, sans-serif' }}
                    >
                      {story.title}
                    </h3>
                    <p
                      className="text-gray-300 text-sm"
                      style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                    >
                      {story.excerpt}
                    </p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Large story 2 */}
          <motion.article
            className="md:col-span-7 group cursor-pointer"
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="relative h-[500px] overflow-hidden bg-zinc-900">
              <ImageWithFallback
                src={stories[3].image}
                alt={stories[3].title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <span
                  className="text-sm text-amber-500 mb-2 block"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {stories[3].category}
                </span>
                <h3
                  className="text-4xl mb-3 group-hover:text-amber-500 transition-colors duration-300"
                  style={{ fontFamily: 'Bebas Neue, sans-serif' }}
                >
                  {stories[3].title}
                </h3>
                <p
                  className="text-gray-300 text-lg"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {stories[3].excerpt}
                </p>
              </div>
            </div>
          </motion.article>

          {/* Medium story */}
          <motion.article
            className="md:col-span-5 group cursor-pointer"
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="relative h-[500px] overflow-hidden bg-zinc-900">
              <ImageWithFallback
                src={stories[4].image}
                alt={stories[4].title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <span
                  className="text-sm text-amber-500 mb-2 block"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {stories[4].category}
                </span>
                <h3
                  className="text-3xl mb-3 group-hover:text-amber-500 transition-colors duration-300"
                  style={{ fontFamily: 'Bebas Neue, sans-serif' }}
                >
                  {stories[4].title}
                </h3>
                <p
                  className="text-gray-300"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {stories[4].excerpt}
                </p>
              </div>
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  );
}
