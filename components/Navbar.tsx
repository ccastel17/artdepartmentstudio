'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import AnimatedLogo from './AnimatedLogo';

const menuItems = [
  { href: '/', label: 'Home', hoverColor: 'hover:bg-blue-500' },
  { href: '/set-buildings', label: 'Set Buildings', hoverColor: 'hover:bg-purple-500' },
  { href: '/fotografia', label: 'Photography', hoverColor: 'hover:bg-pink-500' },
  { href: '/art-direction', label: 'Art Direction', hoverColor: 'hover:bg-orange-500' },
  { href: '/rental', label: 'Rental', hoverColor: 'hover:bg-green-500' },
  { href: '/about-us', label: 'About Us', hoverColor: 'hover:bg-cyan-500' },
  { href: '/contact', label: 'Contact', hoverColor: 'hover:bg-yellow-500' },
  { href: '/gallery', label: 'Gallery', hoverColor: 'hover:bg-red-500' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isAdmin = pathname?.startsWith('/admin');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isAdmin) return null;

  return (
    <>
      {/* Desktop & Mobile Navbar */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b-4 border-white"
      >
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <AnimatedLogo />

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-3">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      px-4 py-2 text-sm font-medium transition-all border-[3px]
                      ${isActive 
                        ? 'bg-white text-black border-transparent'
                        : 'text-white border-transparent hover:border-white hover:bg-black hover:text-white'
                      }
                    `}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-white"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/95 z-40 pt-20"
          onClick={() => setIsOpen(false)}
        >
          <nav className="flex flex-col items-center gap-6 p-8">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`
                    text-2xl font-medium transition-colors
                    ${isActive 
                      ? 'text-white' 
                      : 'text-gray-400 hover:text-white'
                    }
                  `}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
}
