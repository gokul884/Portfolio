import { ArrowRight, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  onOpenContact: () => void;
}

export default function Header({ onOpenContact }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'Service', href: '#service' },
    { label: 'Works', href: '#works' },
    { label: 'Experiences', href: '#experiences' },
    { label: 'Blog', href: '#blog' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F5]/95 backdrop-blur-sm border-b border-stone-200/40 py-4 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <a id="logo-link" href="#home" className="flex items-center gap-2 group">
          <span className="font-display font-bold text-xl text-stone-900 tracking-tight">
            Gokul Krisnan
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="hover:text-[#FF5B22] transition-colors relative py-1"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Contact Button */}
        <div className="hidden md:block">
          <button
            id="nav-contact-btn"
            onClick={onOpenContact}
            className="flex items-center gap-2 bg-[#FF5B22] hover:bg-[#E04B15] text-white text-sm font-semibold py-2.5 px-6 rounded-lg transition-all cursor-pointer hover:opacity-95 shadow-sm"
          >
            <span>Contact Me</span>
            <span className="text-white">→</span>
          </button>
        </div>

        {/* Mobile menu trigger */}
        <button
          id="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#FAF9F5] border-b border-stone-200 shadow-xl py-6 px-6 space-y-4 animate-in fade-in slide-in-from-top-5 duration-200">
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-stone-700 hover:text-[#FF5B22] font-medium text-base transition-colors py-1.5 border-b border-stone-100"
              >
                {item.label}
              </a>
            ))}
            <button
              id="mobile-nav-contact-btn"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenContact();
              }}
              className="w-full flex items-center justify-center gap-2 bg-[#FF5B22] hover:bg-[#E04B15] text-white text-base font-medium py-3 px-5 rounded-xl transition-all cursor-pointer shadow"
            >
              <span>Contact Me</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
