import { ArrowUpRight, Sparkles, Send, Briefcase } from 'lucide-react';

interface HeroProps {
  onOpenContact: () => void;
  heroPhotoUrl?: string;
}

export default function Hero({ onOpenContact, heroPhotoUrl }: HeroProps) {
  return (
    <section id="home" className="relative overflow-hidden bg-dot-grid py-12 md:py-24 px-6 md:px-12 border-b border-stone-200/50">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Side: Copy */}
        <div className="lg:col-span-7 flex flex-col items-start space-y-6 md:space-y-8 z-10">
          
          {/* Heading */}
          <div className="space-y-4">
            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold font-display text-stone-900 tracking-tight leading-tight animate-slide-left-1"
            >
              Hey, I'm <br />
              Gokul Krisnan
            </h1>
            <div
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold font-display text-stone-900 leading-tight animate-slide-left-2"
            >
              I'm a <span className="italic text-[#FF5B22] font-extrabold select-none">Digital Marketer & SEO Specialist</span>
            </div>
          </div>

          {/* Bio */}
          <p
            className="text-stone-600 text-base md:text-lg max-w-xl leading-relaxed font-normal animate-fade-in-3"
          >
            I'm <strong>Gokul Krisnan</strong>, a professional <strong>Digital Marketer</strong> and <strong>SEO Specialist</strong>. I specialize in high-conversion <strong>Website Building</strong>, custom <strong>Poster Creation</strong>, advanced <strong>Search Engine Optimization (SEO)</strong>, and engaging <strong>Blog Content Creation</strong> designed to help businesses rank #1 on Google.
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto animate-slide-up-4"
          >
            <button
              id="hero-primary-btn"
              onClick={onOpenContact}
              className="flex items-center justify-center gap-2 bg-stone-950 hover:bg-stone-900 text-white font-semibold py-3.5 px-7 rounded-xl text-sm tracking-wide transition-all duration-300 cursor-pointer shadow-sm"
              aria-label="Contact Gokul Krisnan for SEO & Digital Marketing Services"
            >
              <span>Get In Touch Today</span>
              <span className="text-[#FF5B22]">→</span>
            </button>
            <a
              id="hero-secondary-btn"
              href="#works"
              className="flex items-center justify-center gap-2 bg-white hover:bg-stone-50 text-stone-800 font-semibold py-3.5 px-7 rounded-xl text-sm tracking-wide border border-stone-200 transition-all duration-300 cursor-pointer shadow-sm"
              aria-label="View Gokul Krisnan's Website Design and Marketing Portfolio"
            >
              <span>See my Portfolio</span>
              <span>→</span>
            </a>
          </div>
        </div>

        {/* Right Side: Portrait & Floating Badge */}
        <div className="lg:col-span-5 relative flex justify-center z-0 mt-8 lg:mt-0">
          
          {/* Animated Spinning circular "Contact me" badge */}
          <div
            onClick={onOpenContact}
            className="absolute top-0 left-0 md:left-4 z-20 cursor-pointer group bg-white rounded-full p-2 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-stone-100 animate-scale-in-5"
          >
            <div className="relative w-24 h-24 flex items-center justify-center">
              {/* Spinning Text SVG */}
              <svg className="w-full h-full animate-spin-slow" viewBox="0 0 100 100">
                <defs>
                  <path
                    id="circlePath"
                    d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
                  />
                </defs>
                <text fill="#292524" className="text-[9.5px] font-bold tracking-[0.2em] font-display">
                  <textPath href="#circlePath">
                    • CONTACT ME • CONTACT ME • CONTACT ME 
                  </textPath>
                </text>
              </svg>
              {/* Inner arrow */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 bg-[#FF5B22] rounded-full flex items-center justify-center text-white transform group-hover:rotate-45 transition-transform duration-300 shadow">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>

          {/* Portrait frame with soft cream backdrop */}
          <div className="relative w-full max-w-[380px] aspect-[3/4] rounded-2xl overflow-hidden bg-stone-200/50 shadow-2xl border border-stone-200/80 group">
            {/* Elegant warm beige geometric container offset */}
            <div className="absolute inset-0 bg-[#F5EFE6] rounded-2xl transform rotate-2 -z-10 group-hover:rotate-1 transition-transform duration-500" />
            
            {heroPhotoUrl && !heroPhotoUrl.includes('photo-1506794778202-cad84cf45f1d') ? (
              <img
                src={heroPhotoUrl}
                alt="Gokul Krisnan - Portrait"
                className="w-full h-full object-cover transform scale-102 group-hover:scale-104 transition-transform duration-700 select-none filter contrast-[1.02]"
                referrerPolicy="no-referrer"
                loading="eager"
                fetchPriority="high"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#FF5B22]/10 via-[#F5EFE6] to-[#FF5B22]/5 flex flex-col items-center justify-center p-8 text-center select-none">
                <div className="w-20 h-20 rounded-full bg-white shadow-md flex items-center justify-center border border-stone-100 mb-4 transform group-hover:scale-105 transition-transform duration-500">
                  <span className="text-2xl font-extrabold font-display text-[#FF5B22] tracking-wider">GK</span>
                </div>
                <h3 className="text-lg font-bold text-stone-800 font-display leading-tight">Gokul Krisnan</h3>
                <p className="text-[11px] font-semibold text-[#FF5B22] uppercase tracking-widest mt-1">Digital Marketer</p>
                <div className="mt-5 flex flex-wrap justify-center gap-1.5">
                  <span className="text-[9px] font-bold bg-white/85 border border-stone-100 px-2 py-0.5 rounded-full text-stone-600">SEO</span>
                  <span className="text-[9px] font-bold bg-white/85 border border-stone-100 px-2 py-0.5 rounded-full text-stone-600">Web Design</span>
                  <span className="text-[9px] font-bold bg-white/85 border border-stone-100 px-2 py-0.5 rounded-full text-stone-600">Growth</span>
                </div>
              </div>
            )}
            
            {/* Subtle overlay gradient */}
            <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          </div>

        </div>
      </div>
    </section>
  );
}
