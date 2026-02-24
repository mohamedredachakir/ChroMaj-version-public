import { Instagram, Twitter, Youtube, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-black border-t border-zinc-900 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 
              className="text-5xl mb-4" 
              style={{ fontFamily: 'Bebas Neue, sans-serif' }}
            >
              CHRO'MAG
            </h3>
            <p 
              className="text-gray-400 mb-6 max-w-md" 
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              A digital chronicle celebrating the vibrant creative spirit of young Morocco. 
              Art, Passion, and Culture converge here.
            </p>
            <div className="flex gap-4">
              <a 
                href="#" 
                className="p-2 bg-zinc-900 hover:bg-white hover:text-black transition-colors duration-300"
                onClick={(e) => e.preventDefault()}
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="p-2 bg-zinc-900 hover:bg-white hover:text-black transition-colors duration-300"
                onClick={(e) => e.preventDefault()}
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="p-2 bg-zinc-900 hover:bg-white hover:text-black transition-colors duration-300"
                onClick={(e) => e.preventDefault()}
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="p-2 bg-zinc-900 hover:bg-white hover:text-black transition-colors duration-300"
                onClick={(e) => e.preventDefault()}
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 
              className="text-xl mb-4" 
              style={{ fontFamily: 'Bebas Neue, sans-serif' }}
            >
              Explore
            </h4>
            <ul 
              className="space-y-2 text-gray-400" 
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              <li><a href="#" className="hover:text-white transition-colors" onClick={(e) => e.preventDefault()}>Stories</a></li>
              <li><a href="#" className="hover:text-white transition-colors" onClick={(e) => e.preventDefault()}>Creators</a></li>
              <li><a href="#" className="hover:text-white transition-colors" onClick={(e) => e.preventDefault()}>Gallery</a></li>
              <li><a href="#" className="hover:text-white transition-colors" onClick={(e) => e.preventDefault()}>Events</a></li>
            </ul>
          </div>

          <div>
            <h4 
              className="text-xl mb-4" 
              style={{ fontFamily: 'Bebas Neue, sans-serif' }}
            >
              Connect
            </h4>
            <ul 
              className="space-y-2 text-gray-400" 
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              <li><a href="#" className="hover:text-white transition-colors" onClick={(e) => e.preventDefault()}>Submit Work</a></li>
              <li><a href="#" className="hover:text-white transition-colors" onClick={(e) => e.preventDefault()}>Collaborate</a></li>
              <li><a href="#" className="hover:text-white transition-colors" onClick={(e) => e.preventDefault()}>Advertise</a></li>
              <li><a href="#" className="hover:text-white transition-colors" onClick={(e) => e.preventDefault()}>Contact</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div 
          className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm"
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          <p>© 2026 Chro'Mag. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors" onClick={(e) => e.preventDefault()}>Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
