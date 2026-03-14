import { About } from '../components/About'
import { CommunityCTA } from '../components/CommunityCTA'
import { FeaturedCreators } from '../components/FeaturedCreators'
import { FeaturedStories } from '../components/FeaturedStories'
import { Hero } from '../components/Hero'
import { Pillars } from '../components/Pillars'
import { VisualGallery } from '../components/VisualGallery'

export function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Pillars />
      <FeaturedStories />
      <FeaturedCreators />
      <VisualGallery />
      <CommunityCTA />
    </>
  )
}
