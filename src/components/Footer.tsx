import { ArrowRight, Instagram, Twitter } from 'lucide-react';

interface FooterProps {
  onOpenContact: () => void;
}

export default function Footer({ onOpenContact }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'Service', href: '#service' },
    { label: 'Works', href: '#works' },
    { label: 'Experiences', href: '#experiences' },
    { label: 'Blog', href: '#blog' },
  ];

  return (
    <footer className="bg-[#FAF9F5] border-t border-stone-200/60 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-16">
        
        {/* Upper Grid: CTA "Have a Dream Project?" */}
        <div className="bg-[#F5EFE6]/50 border border-stone-200/60 rounded-3xl p-10 md:p-16 text-center space-y-6 max-w-4xl mx-auto shadow-sm relative overflow-hidden bg-dot-grid">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100/60 border border-orange-200/50 text-[#FF5B22] text-xs font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5B22] animate-pulse" />
            <span>Available for Works</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold font-display text-stone-900 tracking-tight leading-tight">
            Have a Dream <span className="italic text-[#FF5B22] font-extrabold pl-1">Project?</span>
          </h2>
          
          <p className="text-stone-600 text-sm md:text-base max-w-xl mx-auto font-normal leading-relaxed">
            Let's bring your vision to life with impactful design. Get in touch today to build a brand that truly stands out from the competition.
          </p>

          <div className="pt-4">
            <button
              id="footer-contact-btn"
              onClick={onOpenContact}
              className="inline-flex items-center gap-2 bg-[#FF5B22] hover:bg-[#E04B15] text-white text-base font-semibold py-3.5 px-8 rounded-lg transition-all duration-300 shadow-md cursor-pointer"
            >
              <span>Contact Me</span>
              <span>→</span>
            </button>
          </div>

        </div>

        {/* Lower row: Nav and Socials divider */}
        <div className="pt-10 border-t border-stone-200 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Footer Nav Links */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-semibold text-stone-600 hover:text-[#FF5B22] transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <a
              id="social-x-link"
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-white border border-stone-200 rounded-full flex items-center justify-center text-stone-700 hover:text-[#FF5B22] hover:border-[#FF5B22]/30 hover:shadow-sm transition-all"
              aria-label="X (formerly Twitter)"
            >
              {/* Minimal SVG for X icon */}
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              id="social-instagram-link"
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-white border border-stone-200 rounded-full flex items-center justify-center text-stone-700 hover:text-[#FF5B22] hover:border-[#FF5B22]/30 hover:shadow-sm transition-all"
              aria-label="Instagram"
            >
              <Instagram className="w-4.5 h-4.5" />
            </a>
          </div>

        </div>

        {/* Brand Copyright */}
        <div className="text-center text-xs text-stone-500 font-medium">
          <p>
            Gokul Krisnan © Copyright | All rights reserved. {currentYear}
          </p>
        </div>

      </div>
    </footer>
  );
}
