import { motion } from 'motion/react';
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
          
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100/60 border border-orange-200/80 text-[#FF5B22] text-xs font-semibold uppercase tracking-wider"
          >
            <span className="w-2 h-2 rounded-full bg-[#FF5B22] animate-ping" />
            <span className="w-2 h-2 rounded-full bg-[#FF5B22] absolute" />
            <span className="ml-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Available for Works
            </span>
          </motion.div>

          {/* Heading */}
          <div className="space-y-2">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold font-display text-stone-900 tracking-tight leading-none"
            >
              Hey, I'm Antor
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold font-display text-stone-900 leading-none"
            >
              I'm a <span className="italic text-[#FF5B22] font-extrabold select-none">Designer</span>
            </motion.div>
          </div>

          {/* Bio */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-stone-600 text-base md:text-lg max-w-xl leading-relaxed font-normal"
          >
            I'm Antor, UI Designer passionate about creating simple, intuitive designs that enhance user experience across web and mobile platforms.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto"
          >
            <button
              id="hero-primary-btn"
              onClick={onOpenContact}
              className="flex items-center justify-center gap-2 bg-stone-950 hover:bg-stone-900 text-white font-semibold py-3.5 px-7 rounded-xl text-sm tracking-wide transition-all duration-300 cursor-pointer shadow-sm"
            >
              <span>Get In Touch Today</span>
              <span className="text-[#FF5B22]">→</span>
            </button>
            <a
              id="hero-secondary-btn"
              href="#works"
              className="flex items-center justify-center gap-2 bg-white hover:bg-stone-50 text-stone-800 font-semibold py-3.5 px-7 rounded-xl text-sm tracking-wide border border-stone-200 transition-all duration-300 cursor-pointer shadow-sm"
            >
              <span>See my Portfolio</span>
              <span>→</span>
            </a>
          </motion.div>
        </div>

        {/* Right Side: Portrait & Floating Badge */}
        <div className="lg:col-span-5 relative flex justify-center z-0 mt-8 lg:mt-0">
          
          {/* Animated Spinning circular "Contact me" badge */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 80, delay: 0.5 }}
            onClick={onOpenContact}
            className="absolute top-0 left-0 md:left-4 z-20 cursor-pointer group bg-white rounded-full p-2 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-stone-100"
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
          </motion.div>

          {/* Portrait frame with soft cream backdrop */}
          <div className="relative w-full max-w-[380px] aspect-[3/4] rounded-2xl overflow-hidden bg-stone-200/50 shadow-2xl border border-stone-200/80 group">
            {/* Elegant warm beige geometric container offset */}
            <div className="absolute inset-0 bg-[#F5EFE6] rounded-2xl transform rotate-2 -z-10 group-hover:rotate-1 transition-transform duration-500" />
            
            <img
              src={heroPhotoUrl || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=700&h=900&q=80"}
              alt="Antor - Portrait"
              className="w-full h-full object-cover transform scale-102 group-hover:scale-104 transition-transform duration-700 select-none filter contrast-[1.02]"
              referrerPolicy="no-referrer"
            />
            
            {/* Subtle overlay gradient */}
            <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          </div>

          {/* Mini Tech stack floating element for visuals */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="absolute bottom-6 right-0 md:right-4 bg-white/90 backdrop-blur border border-stone-100 rounded-xl p-3.5 shadow-lg flex items-center gap-3"
          >
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <div className="text-left">
              <p className="text-[10px] uppercase font-bold tracking-wider text-stone-400">Current Status</p>
              <p className="text-xs font-semibold text-stone-800">Available For Hire</p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
