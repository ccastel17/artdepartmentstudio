'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Hammer, Camera, Palette, Key, Users, Mail, Image, Menu, X } from 'lucide-react';
import { useState } from 'react';
import Logo from './Logo';

const menuItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/prop-making', label: 'Prop Making', icon: Hammer },
  { href: '/fotografia', label: 'Photography', icon: Camera },
  { href: '/art-direction', label: 'Art Direction', icon: Palette },
  { href: '/rental', label: 'Rental', icon: Key },
  { href: '/about-us', label: 'About Us', icon: Users },
  { href: '/contact', label: 'Contact Us', icon: Mail },
  { href: '/gallery', label: 'Art Department Gallery', icon: Image },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const isAdmin = pathname?.startsWith('/admin');

  // Only show sidebar on test pages
  const isTestPage = pathname?.startsWith('/test-');
  if (!isTestPage) return null;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-6 left-6 z-50 p-3 bg-white text-black border-4 border-black font-bold"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={28} strokeWidth={3} /> : <Menu size={28} strokeWidth={3} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-72 bg-black border-r-4 border-white z-40
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-6">
          {/* Logo */}
          <Link href="/" className="block mb-8 bg-black">
            <Logo className="w-full h-16" />
          </Link>

          {/* Navigation */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-4 transition-all font-bold uppercase tracking-wider
                    border-2 border-transparent
                    ${isActive 
                      ? 'bg-white text-black border-white' 
                      : 'text-white hover:bg-white hover:text-black hover:border-white'
                    }
                  `}
                >
                  <Icon size={22} strokeWidth={2.5} />
                  <span className="text-xs">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
