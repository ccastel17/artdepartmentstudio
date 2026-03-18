import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t-[3px] border-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-start gap-12 mb-12">
          {/* Logo y descripción */}
          <div className="max-w-md">
            <h3 className="text-2xl font-bold text-white mb-4">
              Art Department Studio
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              Scenographic materials production and product photography studio with over 10 years of experience.
            </p>
            
            {/* Contact Information */}
            <div className="space-y-3">
              <div>
                <h4 className="text-white font-semibold text-sm mb-1">Address</h4>
                <p className="text-gray-400 text-sm">
                  Carrer de Cobalt, 14<br />
                  Hospitalet de Llobregat<br />
                  Barcelona
                </p>
              </div>
              
              <div>
                <h4 className="text-white font-semibold text-sm mb-1">Email</h4>
                <a 
                  href="mailto:hello@artdepartmentstudio.es" 
                  className="text-french-blue hover:text-blue-400 transition-colors text-sm"
                >
                  hello@artdepartmentstudio.es
                </a>
              </div>
            </div>
          </div>

          {/* Secciones en 4 columnas */}
          <div className="flex gap-12">
            <div>
              <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">
                Sections
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/set-buildings" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Set Buildings
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm opacity-0 pointer-events-none">
                Sections
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/fotografia" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Photography
                  </Link>
                </li>
                <li>
                  <Link href="/art-direction" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Art Direction
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm opacity-0 pointer-events-none">
                Sections
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/rental" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Rental
                  </Link>
                </li>
                <li>
                  <Link href="/about-us" className="text-gray-400 hover:text-white transition-colors text-sm">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm opacity-0 pointer-events-none">
                Sections
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/gallery" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Gallery
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t-[3px] border-white text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Art Department Studio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
