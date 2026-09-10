import React, { useState, useEffect } from 'react';
import { Menu, X, Heart } from 'lucide-react';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Início', href: '#hero' },
    { name: 'A Nossa História', href: '#story' },
    { name: 'Os Noivos', href: '#couple' },
    { name: 'Programa & Local', href: '#schedule' },
    { name: 'Galeria', href: '#gallery' },
    { name: 'Presentes', href: '#gifts' },
    { name: 'RSVP', href: '#rsvp' },
    { name: 'Mural', href: '#messages' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-[#FAF7F2]/90 backdrop-blur-md shadow-sm py-3 border-b border-[#E2C799]/30' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-2 group">
          <span className="font-script text-3xl sm:text-4xl text-[#B8860B] group-hover:text-[#AA7C11] transition-colors">
            Alberto & Lieza
          </span>
          <Heart className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37] animate-pulse hidden sm:inline-block" />
        </a>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-[#4A3E3D]">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="hover:text-[#B8860B] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#D4AF37] hover:after:w-full after:transition-all"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Action Controls (Mobile Menu Button) */}
        <div className="flex items-center gap-3">
          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#4A3E3D] hover:bg-[#E2C799]/20 focus:outline-hidden"
            aria-label="Abrir Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF7F2] border-b border-[#E2C799]/30 shadow-lg px-6 py-6 transition-all animate-fadeIn">
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-[#4A3E3D] hover:text-[#B8860B] py-1 border-b border-gray-100"
              >
                {link.name}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
