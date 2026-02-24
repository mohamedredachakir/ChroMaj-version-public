import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Pillars } from './components/Pillars';
import { FeaturedStories } from './components/FeaturedStories';
import { FeaturedCreators } from './components/FeaturedCreators';
import { VisualGallery } from './components/VisualGallery';
import { CommunityCTA } from './components/CommunityCTA';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <Header />
      <Hero />
      <About />
      <Pillars />
      <FeaturedStories />
      <FeaturedCreators />
      <VisualGallery />
      <CommunityCTA />
      <Footer />
    </div>
  );
}
