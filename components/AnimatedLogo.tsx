'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AnimatedLogo() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 150);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Link href="/" className="flex-shrink-0">
      <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight relative overflow-hidden">
        <div className={`flex items-center ${scrolled ? 'gap-[3px]' : 'gap-0'}`} style={{ transition: 'gap 800ms cubic-bezier(0.4, 0, 0.2, 1)' }}>
          {/* A */}
          <span className="inline-flex items-center">
            <span className="bg-white text-black px-1">A</span>
            <span 
              style={{ 
                opacity: scrolled ? 0 : 1,
                width: scrolled ? '0px' : 'auto',
                overflow: 'hidden',
                transition: 'opacity 600ms cubic-bezier(0.4, 0, 0.2, 1), width 600ms cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <span style={{ transitionProperty: 'opacity', transitionDuration: '600ms', transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)', transitionDelay: '0ms' }}>r</span>
              <span style={{ transitionProperty: 'opacity', transitionDuration: '600ms', transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)', transitionDelay: '80ms' }}>t</span>
            </span>
          </span>

          {/* Space */}
          <span 
            style={{ 
              width: scrolled ? '0px' : '0.25rem',
              opacity: scrolled ? 0 : 1,
              transition: 'width 600ms cubic-bezier(0.4, 0, 0.2, 1), opacity 600ms cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            {' '}
          </span>

          {/* D */}
          <span className="inline-flex items-center">
            <span className="bg-white text-black px-1">D</span>
            <span 
              style={{ 
                opacity: scrolled ? 0 : 1,
                width: scrolled ? '0px' : 'auto',
                overflow: 'hidden',
                transition: 'opacity 600ms cubic-bezier(0.4, 0, 0.2, 1), width 600ms cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <span style={{ transitionProperty: 'opacity', transitionDuration: '600ms', transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)', transitionDelay: '160ms' }}>e</span>
              <span style={{ transitionProperty: 'opacity', transitionDuration: '600ms', transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)', transitionDelay: '240ms' }}>p</span>
              <span style={{ transitionProperty: 'opacity', transitionDuration: '600ms', transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)', transitionDelay: '320ms' }}>a</span>
              <span style={{ transitionProperty: 'opacity', transitionDuration: '600ms', transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)', transitionDelay: '400ms' }}>r</span>
              <span style={{ transitionProperty: 'opacity', transitionDuration: '600ms', transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)', transitionDelay: '480ms' }}>t</span>
              <span style={{ transitionProperty: 'opacity', transitionDuration: '600ms', transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)', transitionDelay: '560ms' }}>m</span>
              <span style={{ transitionProperty: 'opacity', transitionDuration: '600ms', transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)', transitionDelay: '640ms' }}>e</span>
              <span style={{ transitionProperty: 'opacity', transitionDuration: '600ms', transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)', transitionDelay: '720ms' }}>n</span>
              <span style={{ transitionProperty: 'opacity', transitionDuration: '600ms', transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)', transitionDelay: '800ms' }}>t</span>
            </span>
          </span>

          {/* Space */}
          <span 
            style={{ 
              width: scrolled ? '0px' : '0.25rem',
              opacity: scrolled ? 0 : 1,
              transition: 'width 600ms cubic-bezier(0.4, 0, 0.2, 1), opacity 600ms cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            {' '}
          </span>

          {/* S */}
          <span className="inline-flex items-center">
            <span className="bg-white text-black px-1">S</span>
            <span 
              style={{ 
                opacity: scrolled ? 0 : 1,
                width: scrolled ? '0px' : 'auto',
                overflow: 'hidden',
                transition: 'opacity 600ms cubic-bezier(0.4, 0, 0.2, 1), width 600ms cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <span style={{ transitionProperty: 'opacity', transitionDuration: '600ms', transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)', transitionDelay: '880ms' }}>t</span>
              <span style={{ transitionProperty: 'opacity', transitionDuration: '600ms', transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)', transitionDelay: '960ms' }}>u</span>
              <span style={{ transitionProperty: 'opacity', transitionDuration: '600ms', transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)', transitionDelay: '1040ms' }}>d</span>
              <span style={{ transitionProperty: 'opacity', transitionDuration: '600ms', transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)', transitionDelay: '1120ms' }}>i</span>
              <span style={{ transitionProperty: 'opacity', transitionDuration: '600ms', transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)', transitionDelay: '1200ms' }}>o</span>
            </span>
          </span>
        </div>
      </h1>
    </Link>
  );
}
